'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { getActiveMeaning, getActiveKeywords, formatSuite } from '@/lib/utils/card-utils';
import { getCardIcon } from './card-icons';
import { ActiveInsight } from './ActiveInsight';
import { ScentNotes } from './ScentNotes';
import { BODY_TYPE, LABEL_TYPE } from './type';
import CardSlotReveal from './CardSlotReveal';
import { generateInsight, TransitData, GeneratedInsight } from '@/lib/utils/insight-generator-v2';
import type { ActiveTransit } from '@/lib/types/astrology';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isRevealed: boolean;
  animateReveal?: boolean;
  /**
   * Render the card face while the details stay sealed. Used by the tear-off
   * page: the art sits underneath, so tearing progressively uncovers the real
   * card rather than a card back that flips over afterwards.
   */
  artVisibleEarly?: boolean;
  userName?: string;
  cardDate?: string; // YYYY-MM-DD of when the card was drawn; defaults to today
}

// Memory types
interface ReadingMemory {
  date: string;
  cardName: string;
  isReversed: boolean;
  transitingPlanet: string;
  natalPlanet: string;
  aspectType: string;
  house: number;
  keyPhrase: string;
}

interface SlowHourMemory {
  readings: ReadingMemory[];
  memoryNotes: string[];
}

function todayKey(): string {
  // Use local date so cache aligns with the user's calendar day, not UTC
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadCachedInsight(cardId: string, date?: string): GeneratedInsight | null {
  try {
    const key = date ?? todayKey();
    const raw = localStorage.getItem(`insight-${cardId}-${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedInsight;
  } catch {
    return null;
  }
}

function saveCachedInsight(cardId: string, insight: GeneratedInsight, date?: string): void {
  try {
    const key = date ?? todayKey();
    localStorage.setItem(`insight-${cardId}-${key}`, JSON.stringify(insight));
  } catch {
    // ignore
  }
}

function loadMemory(): SlowHourMemory {
  try {
    const raw = localStorage.getItem('slowHourMemory');
    if (!raw) return { readings: [], memoryNotes: [] };
    return JSON.parse(raw) as SlowHourMemory;
  } catch {
    return { readings: [], memoryNotes: [] };
  }
}

function saveMemory(
  memory: SlowHourMemory,
  newReading: ReadingMemory,
  memoryNote: string | undefined
): void {
  try {
    const updated: SlowHourMemory = {
      readings: [newReading, ...memory.readings].slice(0, 30),
      memoryNotes: memoryNote
        ? [memoryNote, ...memory.memoryNotes].slice(0, 10)
        : memory.memoryNotes,
    };
    localStorage.setItem('slowHourMemory', JSON.stringify(updated));
  } catch {
    // localStorage write failed (private browsing, quota exceeded, etc.)
  }
}

// Helper function to convert ActiveTransit to TransitData
function convertToTransitData(transit: ActiveTransit): TransitData {
  // Map phase to generator's expected format
  const phaseMap: Record<string, 'approaching' | 'peak' | 'separating'> = {
    'beginning': 'approaching',
    'approaching': 'approaching',
    'peak': 'peak',
    'separating': 'separating',
    'integration': 'separating'
  };

  // Calculate days remaining until exact date
  const today = new Date();
  const exactDate = new Date(transit.exactDate);
  const daysRemaining = Math.ceil((exactDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    transitingPlanet: transit.transitingPlanet.charAt(0).toUpperCase() + transit.transitingPlanet.slice(1),
    natalPlanet: transit.natalPlanet.charAt(0).toUpperCase() + transit.natalPlanet.slice(1),
    aspectType: transit.aspect,
    phase: phaseMap[transit.phase] || 'approaching',
    house: transit.house,
    daysRemaining: daysRemaining > 0 ? daysRemaining : undefined
  };
}

export default function TarotCard({ card, isReversed, isRevealed, animateReveal, artVisibleEarly, userName, cardDate }: TarotCardProps) {
  const activeMeaning = getActiveMeaning(card, isReversed);
  const activeKeywords = getActiveKeywords(card, isReversed);
  const CardIcon = getCardIcon(card.id);

  // State for generated insight — load from cache immediately on mount
  // Uses cardDate (the date the card was drawn) so past cards hit their original cached insight
  const [generatedInsight, setGeneratedInsight] = useState<GeneratedInsight | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadCachedInsight(card.id, cardDate);
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [insightError, setInsightError] = useState<'error' | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const isFirstMount = useRef(true);

  // Slot reveal animation — slotDone flips true when reel finishes
  const [slotDone, setSlotDone] = useState(false);
  const handleSlotComplete = useCallback(() => setSlotDone(true), []);
  const showSlot = !!animateReveal && isRevealed && !slotDone;


  // Reset insight + error when card or date changes, then try loading from cache for the new card/date
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const cached = loadCachedInsight(card.id, cardDate);
    setGeneratedInsight(cached);
    setInsightError(null);
    setIsRateLimited(false);
  }, [card.id, cardDate]);

  /*
   * The free quota: 3 personalised readings per person.
   *
   * Counted as distinct DAYS that consumed a reading, not as fetches — a retry
   * after an error, or re-opening the same day, must not burn quota. A day is
   * recorded only once its reading actually arrives.
   *
   * This is per-user and therefore client-side. It is bypassable by clearing
   * storage; that is a deliberate trade, since the alternative (an IP limit)
   * punishes everyone behind a shared network. Cost abuse is bounded by the
   * abuse guards in middleware.ts instead.
   */
  /**
   * Set during onboarding ("read my chart"). When off, no request is made at
   * all — no Claude call, no quota spent — and the reader gets the card and its
   * traditional meaning. Defaults to on so anyone who onboarded before this
   * existed is unaffected.
   */
  const personalisationOn = (): boolean => {
    try {
      return localStorage.getItem('slow-garden-personalise') !== 'false';
    } catch {
      return true;
    }
  };

  const FREE_READING_DAYS = 3;
  const READING_DAYS_KEY = 'slow-garden-reading-days';

  const getReadingDays = (): string[] => {
    try {
      const raw = localStorage.getItem(READING_DAYS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const recordReadingDay = (day: string) => {
    try {
      const days = getReadingDays();
      if (days.includes(day)) return;
      localStorage.setItem(READING_DAYS_KEY, JSON.stringify([...days, day]));
    } catch {
      // storage unavailable — the reading still shows, we just cannot count it
    }
  };

  /** Days already paid for stay readable; only a NEW day can exhaust the quota. */
  const hasQuotaFor = (day: string): boolean => {
    const days = getReadingDays();
    return days.includes(day) || days.length < FREE_READING_DAYS;
  };

  const fetchInsight = async () => {
    // Opted out — the personalised layer is simply absent, not "loading".
    if (!personalisationOn()) return;

    const readingDay = cardDate ?? todayKey();

    if (!hasQuotaFor(readingDay)) {
      setIsRateLimited(true);
      return;
    }

    setIsGenerating(true);
    setIsRateLimited(false);
    try {
      const birthDateStr = localStorage.getItem('userBirthdate');
      const birthTime = localStorage.getItem('userBirthTime');
      const birthLocation = localStorage.getItem('userBirthLocation');

      if (!birthDateStr) throw new Error('No birth date found');

      const cardSeed = card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) / 10000;

      const memory = loadMemory();
      const memoryNotes = memory.memoryNotes;
      const recentCards = memory.readings.slice(0, 7).map(r =>
        `${r.cardName}${r.isReversed ? ' (reversed)' : ''}`
      );

      const response = await fetch('/api/calculate-transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthDateStr,
          birthTime: birthTime || null,
          birthLocation: birthLocation || null,
          seed: cardSeed,
          cardId: card.id,
          isReversed,
          memoryNotes,
          recentCards
        })
      });

      if (response.status === 429) {
        setInsightError('error');
        return;
      }

        if (!response.ok) {
          setInsightError('error');
          return;
        }

        const data = await response.json();
        const dominantTransit: ActiveTransit = data.dominantTransit;

        if (!data.claudeInsight) {
          // API worked but Claude returned nothing — surface the error, don't fake a reading
          setInsightError('error');
          return;
        }

        // Build transit metadata (ticker + explanation accordion) from the real transit data
        const transitData = convertToTransitData(dominantTransit);
        const transitMeta = generateInsight(card.id, transitData, isReversed);

        const freshInsight: GeneratedInsight = {
          keyPhrase: data.claudeInsight.keyPhrase,
          insight: data.claudeInsight.insight,
          action: data.claudeInsight.action,
          transitInfo: transitMeta?.transitInfo || '',
          transitExplanation: transitMeta?.transitExplanation || {
            transitingPlanet: dominantTransit.transitingPlanet,
            transitingPlanetMeaning: '',
            natalPlanet: dominantTransit.natalPlanet,
            natalPlanetMeaning: '',
            aspectType: dominantTransit.aspect,
            aspectMeaning: '',
            phaseMeaning: '',
          },
        };

        setGeneratedInsight(freshInsight);
        saveCachedInsight(card.id, freshInsight, cardDate);
        // Only now — a failed or errored request must not cost the user a day.
        recordReadingDay(readingDay);

        saveMemory(
          memory,
          {
            date: new Date().toISOString().split('T')[0],
            cardName: card.name || card.id,
            isReversed,
            transitingPlanet: dominantTransit.transitingPlanet,
            natalPlanet: dominantTransit.natalPlanet,
            aspectType: dominantTransit.aspect,
            house: dominantTransit.house,
            keyPhrase: data.claudeInsight.keyPhrase,
          },
          data.claudeInsight.memoryNote
        );
      } catch (error) {
        console.error('Failed to calculate real transit:', error);
        setInsightError('error');
      } finally {
        setIsGenerating(false);
      }
  };

  // Generate insight when card is revealed
  useEffect(() => {
    if (!isRevealed || generatedInsight || insightError || isRateLimited) return;
    if (!personalisationOn()) return;
    const timer = setTimeout(fetchInsight, 800);
    return () => clearTimeout(timer);
  }, [isRevealed, card.id, isReversed, generatedInsight, insightError]);

  // Convert card ID to filename
  const getCardFilename = (cardId: string, cardName: string) => {
    // For major arcana, add the name part (e.g., "major-1" -> "major-1-magician")
    if (cardId.startsWith('major-')) {
      const namePart = cardName.toLowerCase().replace(/\s+/g, '-').replace(/^the-/, '');
      return `${cardId}-${namePart}`;
    }
    // For minor arcana, just use the ID (e.g., "cups-ace", "wands-2")
    return cardId;
  };

  return (
    <div className="w-full mx-auto">
      {/* Card Back/Front */}
      <div className="relative mb-16 md:mb-8">
        <div data-card-image className="aspect-[2/3] w-72 md:w-96 mx-auto rounded-2xl overflow-visible relative">
          {isRevealed || artVisibleEarly ? (
            // Card Front - Actual card image
            <div className={`relative w-full h-full rounded-2xl overflow-hidden transform-gpu ${
              isReversed ? 'rotate-180' : ''
            }`}>
              <img
                src={`/cards/${getCardFilename(card.id, card.name)}.png`}
                alt={card.name}
                className="w-full h-full object-cover shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = card.imagePath;
                }}
              />
            </div>
          ) : (
            // Card Back
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/card-back.png"
                alt="Card back"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Slot reel overlay — renders on top while animating */}
          {showSlot && (
            <CardSlotReveal
              selectedCardSrc={`/cards/${getCardFilename(card.id, card.name)}.png`}
              isReversed={isReversed}
              onComplete={handleSlotComplete}
            />
          )}
        </div>

        {/* Title sprawled below the card */}
        {isRevealed && (
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: 'clamp(-50px, -6vw, -100px)',
              left: '50%',
              width: '100vw',
              transform: 'translateX(-50%)',
            }}
          >
            <h3
              className="text-center"
              style={{
                fontSize: 'clamp(80px, 28vw, 200px)',
                fontFamily: 'var(--font-reenie-beanie), cursive',
                lineHeight: '0.72',
                color: '#C9F24E',
                overflow: 'visible',
                WebkitTextStroke: '1px #172211',
                transform: `rotate(-2.3deg) ${isReversed ? 'scaleX(-1)' : ''}`,
                transformOrigin: 'center center',
                letterSpacing: '-0.05em',
                padding: '0',
              }}
            >
              {card.name.toLowerCase()}
            </h3>
          </div>
        )}
      </div>

      {/* Card Name and Info (only shown when revealed) */}
      {isRevealed && (
        <div className="w-full space-y-6 md:space-y-12 animate-fade-in">

          {/* Keywords - Circular Marquee */}
          <div className="relative w-36 h-36 md:w-64 md:h-64 mx-auto mt-10 mb-0 md:mt-24 md:mb-0">
            {activeKeywords.slice(0, 5).map((keyword, index) => {
              const totalKeywords = Math.min(activeKeywords.length, 5);
              const startAngle = (index / totalKeywords) * 360;
              const animationDelay = -(index / totalKeywords) * 20; // Stagger start positions
              // Scale font down when 5 keywords to avoid crowding on mobile
              const mobileFontSize = totalKeywords >= 5 ? 'clamp(16px, 3.5vw, 32px)' : 'clamp(20px, 4vw, 32px)';

              return (
                <span
                  key={index}
                  className="absolute text-[#C9F24E]"
                  style={{
                    fontSize: mobileFontSize,
                    fontFamily: 'var(--font-reenie-beanie), cursive',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    animation: 'circular-revolve 20s linear infinite',
                    animationDelay: `${animationDelay}s`,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {keyword.toLowerCase()}
                </span>
              );
            })}
          </div>

          {/* Meaning */}
          <div>
            <h4 className="text-[#C9F24E] mb-2 md:mb-4" style={LABEL_TYPE}>meaning</h4>
            <p className="text-[#F7F4E6]" style={BODY_TYPE}>{activeMeaning.toLowerCase()}</p>
          </div>

          {/* Scent notes — sits between the traditional meaning and the
              personalised read. Renders nothing for cards without an accord. */}
          <ScentNotes cardId={card.id} />

          {/* Active Insight — omitted entirely when the reader opted out, so the
              card and its traditional meaning stand on their own. */}
          {!personalisationOn() ? null : insightError ? (
            <div>
              <h4 className="text-[#C9F24E] mb-2 md:mb-4" style={LABEL_TYPE}>what this could mean for you</h4>
              <div>
                <p className="text-[#F7F4E6] opacity-60" style={BODY_TYPE}>
                  couldn&apos;t connect to the reading right now.
                </p>
                <button
                  onClick={() => setInsightError(null)}
                  className="mt-3 text-[#C9F24E] opacity-70 hover:opacity-100 transition-opacity"
                  style={{ fontSize: 'clamp(13px, 3vw, 16px)', fontFamily: 'var(--font-dm-mono), ui-monospace, monospace' }}
                >
                  try again ↻
                </button>
              </div>
            </div>
          ) : (
            <ActiveInsight
              keyPhrase={generatedInsight?.keyPhrase || ""}
              insight={generatedInsight?.insight || ""}
              action={generatedInsight?.action || ""}
              transitInfo={generatedInsight?.transitInfo || ""}
              userName={userName}
              transitExplanation={generatedInsight?.transitExplanation || {
                transitingPlanet: "",
                transitingPlanetMeaning: "",
                natalPlanet: "",
                natalPlanetMeaning: "",
                aspectType: "",
                aspectMeaning: "",
                phaseMeaning: ""
              }}
              isLoading={isGenerating}
              isRateLimited={isRateLimited}
            />
          )}

          {/* Description */}
          <div>
            <h4 className="text-[#C9F24E] mb-2 md:mb-4" style={LABEL_TYPE}>about this card</h4>
            <p className="text-[#F7F4E6]" style={BODY_TYPE}>{card.description.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
