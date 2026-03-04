'use client';

import { useState, useEffect, useRef } from 'react';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { getActiveMeaning, getActiveKeywords, formatSuite } from '@/lib/utils/card-utils';
import { getCardIcon } from './card-icons';
import { ActiveInsight } from './ActiveInsight';
import { generateInsight, TransitData, GeneratedInsight } from '@/lib/utils/insight-generator-v2';
import type { ActiveTransit } from '@/lib/types/astrology';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isRevealed: boolean;
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

export default function TarotCard({ card, isReversed, isRevealed, userName, cardDate }: TarotCardProps) {
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
  const isFirstMount = useRef(true);

  // Reset insight when card or date changes, then try loading from cache for the new card/date
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const cached = loadCachedInsight(card.id, cardDate);
    setGeneratedInsight(cached);
  }, [card.id, cardDate]);

  // Generate insight when card is revealed
  useEffect(() => {
    if (isRevealed && !generatedInsight) {
      setIsGenerating(true);

      // Calculate real astrology transits based on user's birth data
      const calculateRealTransit = async () => {
        try {
          // Get user's birth data from localStorage
          const birthDateStr = localStorage.getItem('userBirthdate');
          const birthTime = localStorage.getItem('userBirthTime');
          const birthLocation = localStorage.getItem('userBirthLocation');

          if (!birthDateStr) {
            throw new Error('No birth date found');
          }

          // Generate seed from card ID to consistently select same transit for same card
          const cardSeed = card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) / 10000;

          // Load memory to send as context
          const memory = loadMemory();
          const memoryNotes = memory.memoryNotes;
          const recentCards = memory.readings.slice(0, 7).map(r =>
            `${r.cardName}${r.isReversed ? ' (reversed)' : ''}`
          );

          // Call API to calculate transits (Swiss Ephemeris runs server-side)
          const response = await fetch('/api/calculate-transit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
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

          if (!response.ok) {
            throw new Error('Failed to fetch transit data');
          }

          const data = await response.json();
          const dominantTransit: ActiveTransit = data.dominantTransit;

          // Convert to TransitData format
          const transitData = convertToTransitData(dominantTransit);

          // Use Claude-generated insight if available, fall back to template
          if (data.claudeInsight) {
            const templateInsight = generateInsight(card.id, transitData, isReversed);
            const freshInsight: GeneratedInsight = {
              keyPhrase: data.claudeInsight.keyPhrase,
              insight: data.claudeInsight.insight,
              action: data.claudeInsight.action,
              transitInfo: templateInsight?.transitInfo || '',
              transitExplanation: templateInsight?.transitExplanation || {
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

            // Save this reading + memory note to localStorage
            const cardFullName = card.name || card.id;
            saveMemory(
              memory,
              {
                date: new Date().toISOString().split('T')[0],
                cardName: cardFullName,
                isReversed,
                transitingPlanet: dominantTransit.transitingPlanet,
                natalPlanet: dominantTransit.natalPlanet,
                aspectType: dominantTransit.aspect,
                house: dominantTransit.house,
                keyPhrase: data.claudeInsight.keyPhrase,
              },
              data.claudeInsight.memoryNote
            );
          } else {
            const insight = generateInsight(card.id, transitData, isReversed);
            setGeneratedInsight(insight);
            if (insight) saveCachedInsight(card.id, insight, cardDate);
          }
        } catch (error) {
          console.error('Failed to calculate real transit:', error);
          // Fall back to a default transit if calculation fails
          const defaultTransitData: TransitData = {
            transitingPlanet: 'Saturn',
            natalPlanet: 'Sun',
            aspectType: 'square',
            phase: 'approaching',
            house: 10,
            daysRemaining: 14
          };
          const insight = generateInsight(card.id, defaultTransitData, isReversed);
          setGeneratedInsight(insight);
        } finally {
          setIsGenerating(false);
        }
      };

      // Add slight delay for better UX
      setTimeout(() => {
        calculateRealTransit();
      }, 800);
    }
  }, [isRevealed, card.id, isReversed, generatedInsight]);

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
        <div className="aspect-[2/3] w-72 md:w-96 mx-auto rounded-2xl overflow-visible relative">
          {isRevealed ? (
            // Card Front - Actual card image
            <div className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-1000 transform-gpu ${
              isReversed ? 'rotate-180' : ''
            }`}>
              <img
                src={`/cards/${getCardFilename(card.id, card.name)}.png`}
                alt={card.name}
                className="w-full h-full object-cover shadow-xl"
                onError={(e) => {
                  // Fallback to SVG if PNG doesn't exist
                  e.currentTarget.src = card.imagePath;
                }}
              />
            </div>
          ) : (
            // Card Back - Use the actual card back design
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/card-back.png"
                alt="Card back"
                className="w-full h-full object-cover"
              />
            </div>
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
                color: '#CEF17B',
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
                  className="absolute text-[#CEF17B]"
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
            <h4 className="text-[#CEF17B] mb-2 md:mb-4" style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>meaning</h4>
            <p className="text-[#E1EEFC]" style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.2' }}>{activeMeaning.toLowerCase()}</p>
          </div>

          {/* Active Insight - Personalized Context */}
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
          />

          {/* Description */}
          <div>
            <h4 className="text-[#CEF17B] mb-2 md:mb-4" style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>about this card</h4>
            <p className="text-[#E1EEFC]" style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.2' }}>{card.description.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
