'use client';

import { useState, useEffect } from 'react';
import TarotCard from './components/TarotCard';
import YearView from './components/YearView';
import Onboarding from './components/Onboarding';
import CardSelector from './components/CardSelector';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { tarotDeck } from '@/lib/data/tarot-deck';

type View = 'card' | 'year';

// Use local calendar date (not UTC) so midnight in user's timezone triggers the new card
function localDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface JournalEntry {
  date: string;
  cardId: string;
  hasJournal: boolean;
  reflection?: string;
  isReversed?: boolean;
}

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('card');
  const [card, setCard] = useState<TarotCardType | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateString, setDateString] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [viewingPastCard, setViewingPastCard] = useState(false);

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      setShowOnboarding(true);
      setIsLoading(false);
    } else {
      loadTodaysCard();
      loadJournalEntries();
    }
  }, []);

  // Reload journal entries when switching to year view
  useEffect(() => {
    if (currentView === 'year') {
      loadJournalEntries();
    }
  }, [currentView]);

  const loadTodaysCard = (autoReveal = false) => {
    try {
      const today = localDateString();

      // Check if a card has already been drawn today
      const storedCardId = localStorage.getItem(`card-${today}`);
      const storedReversed = localStorage.getItem(`reversed-${today}`);

      let todayCard: TarotCardType | null = null;
      let todayReversed = false;

      if (storedCardId) {
        // Re-use the card drawn earlier today — stays consistent all day
        todayCard = tarotDeck.find(c => c.id === storedCardId) ?? null;
        todayReversed = storedReversed === 'true';
      }

      if (!todayCard) {
        // First draw of the day — pick a truly random card, like pulling from a real deck
        const randomIndex = Math.floor(Math.random() * tarotDeck.length);
        todayCard = tarotDeck[randomIndex];
        todayReversed = Math.random() < 0.30; // 30% chance reversed

        // Commit to localStorage immediately so it's stable for the rest of the day
        localStorage.setItem(`card-${today}`, todayCard.id);
        localStorage.setItem(`reversed-${today}`, todayReversed.toString());
      }

      setCard(todayCard);
      setIsReversed(todayReversed);
      setDateString(today);

      const lastDrawDate = localStorage.getItem('lastDrawDate');
      const wasRevealed = localStorage.getItem('cardRevealed') === 'true';

      if (lastDrawDate === today && wasRevealed) {
        setCurrentView('card');
        setIsRevealed(true);
      } else if (autoReveal) {
        // Auto-reveal after onboarding (first time only)
        setCurrentView('card');
        setIsRevealed(true);
        localStorage.setItem('lastDrawDate', today);
        localStorage.setItem('cardRevealed', 'true');
        loadJournalEntries();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load card:', error);
      setIsLoading(false);
    }
  };

  const loadJournalEntries = () => {
    // Load all journal entries from localStorage
    const entries: JournalEntry[] = [];

    // Get all cards drawn
    const cardsDrawn = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('card-')) {
        const date = key.replace('card-', '');
        cardsDrawn.add(date);
      }
    }

    // Build entries for all cards drawn
    cardsDrawn.forEach(date => {
      const reflection = localStorage.getItem(`reflection-${date}`);
      const cardId = localStorage.getItem(`card-${date}`);
      const isReversed = localStorage.getItem(`reversed-${date}`) === 'true';

      if (cardId) {
        entries.push({
          date,
          cardId,
          hasJournal: !!reflection && reflection.trim().length > 0,
          reflection: reflection || undefined,
          isReversed
        });
      }
    });

    setJournalEntries(entries);
  };


  const handleRevealCard = () => {
    setIsRevealed(true);
    const today = localDateString();
    localStorage.setItem('lastDrawDate', today);
    localStorage.setItem('cardRevealed', 'true');
    // Card is already stored in localStorage from loadTodaysCard — no re-save needed
    // Refresh journal entries to show the new card in year view
    loadJournalEntries();
  };

  const handleJournalChange = (value: string) => {
    localStorage.setItem(`reflection-${dateString}`, value);
    loadJournalEntries(); // Refresh entries
  };

  const handleDateClick = (date: string) => {
    const entry = journalEntries.find(e => e.date === date);
    if (!entry) return; // No card for this date

    const reversed = localStorage.getItem(`reversed-${date}`) === 'true';

    setDateString(date);
    setIsReversed(reversed);
    setIsRevealed(true);
    setViewingPastCard(true);

    // On desktop, navigate to card view
    // On mobile, the drawer will open (handled in YearView)
    if (window.innerWidth >= 768) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setCurrentView('card');
    }
  };

  const handleReset = () => {
    // Only reset today's card, keep all historical data
    const today = localDateString();
    localStorage.removeItem('lastDrawDate');
    localStorage.removeItem('cardRevealed');
    localStorage.removeItem(`card-${today}`);
    localStorage.removeItem(`reversed-${today}`);
    localStorage.removeItem(`reflection-${today}`);
    localStorage.removeItem('testSeed'); // clean up old workaround

    // Reset view — next loadTodaysCard will draw a fresh random card
    setCurrentView('card');
    setIsRevealed(false);
    loadTodaysCard();
  };

  const handleFullReset = () => {
    // Clear everything including onboarding
    localStorage.clear();
    window.location.reload();
  };

  const generateRandomCards = () => {
    // Generate 60 random cards across the year
    const today = new Date();
    const year = today.getFullYear();
    const usedDates = new Set<number>();

    // Generate 60 unique random day numbers (0-364)
    while (usedDates.size < 60) {
      usedDates.add(Math.floor(Math.random() * 365));
    }

    // Convert to dates and save cards
    usedDates.forEach(dayOfYear => {
      const date = new Date(year, 0, dayOfYear + 1);
      const dateString = date.toISOString().split('T')[0];
      const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
      const isReversed = Math.random() > 0.5;

      localStorage.setItem(`card-${dateString}`, randomCard.id);
      localStorage.setItem(`reversed-${dateString}`, isReversed.toString());
    });

    loadJournalEntries();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadTodaysCard(true); // Auto-reveal after onboarding
    loadJournalEntries();
  };

  const handleSelectCard = (cardId: string, reversed: boolean) => {
    // Find the card in the deck
    const selectedCard = tarotDeck.find(c => c.id === cardId);
    if (selectedCard) {
      setCard(selectedCard);
      setIsReversed(reversed);
      setIsRevealed(true);
      setCurrentView('card');
      setDateString(new Date().toISOString().split('T')[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#172211]">
        <div className="text-[#CEF17B] text-lg" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>loading...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <main className="min-h-screen bg-[#172211]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Navigation Header with Backdrop Blur */}
      <div className="fixed top-0 left-0 right-0 z-30" style={{
        background: 'rgba(23, 34, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(206, 241, 123, 0.2)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/spiral-logo.png"
              alt=""
              style={{
                height: 'clamp(36px, 6vw, 56px)',
                filter: 'brightness(0) saturate(100%) invert(93%) sepia(8%) saturate(346%) hue-rotate(183deg) brightness(103%) contrast(97%)',
                width: 'auto'
              }}
            />
            <span
              className="text-[#E1EEFC]"
              style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1' }}
            >
              slow hour
            </span>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex gap-2 md:gap-3 items-center ml-4 md:ml-12" role="navigation" aria-label="View switcher">
            <button
              onClick={() => {
                setViewingPastCard(false);
                window.scrollTo({ top: 0, behavior: 'instant' });
                setCurrentView('card');
              }}
              aria-pressed={currentView === 'card'}
              aria-label="View today's card"
              className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full transition-all text-lg md:text-2xl ${
                currentView === 'card'
                  ? 'bg-[#CEF17B] text-[#172211]'
                  : 'bg-[#172211] text-[#CEF17B] border border-[#CEF17B]/30 hover:border-[#CEF17B]/60'
              }`}
              style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
            >
              today
            </button>
            <button
              onClick={() => setCurrentView('year')}
              aria-pressed={currentView === 'year'}
              aria-label="View year history"
              className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full transition-all text-lg md:text-2xl ${
                currentView === 'year'
                  ? 'bg-[#CEF17B] text-[#172211]'
                  : 'bg-[#172211] text-[#CEF17B] border border-[#CEF17B]/30 hover:border-[#CEF17B]/60'
              }`}
              style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
            >
              year
            </button>

            {/* Development Reset Buttons */}
            {process.env.NODE_ENV === 'development' && (
              <div className="hidden md:flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full text-2xl bg-[#172211] text-[#CEF17B] border border-[#CEF17B]/30 hover:border-[#CEF17B]/60 transition-all"
                  title="Reset today's card"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  ↻
                </button>
                <button
                  onClick={generateRandomCards}
                  className="px-3 py-2 rounded-full text-lg bg-[#172211] text-[#CEF17B] border border-[#CEF17B]/30 hover:border-[#CEF17B]/60 transition-all"
                  title="Generate 60 random cards"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  60
                </button>
                <button
                  onClick={handleFullReset}
                  className="px-4 py-2 rounded-full text-2xl bg-[#172211] text-[#CEF17B] border border-[#CEF17B]/30 hover:border-[#CEF17B]/60 transition-all"
                  title="Full reset (including onboarding)"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  🔄
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-safe-nav">
        {currentView === 'card' && card && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
            {/* Date */}
            <div className="text-center mb-4 md:mb-8">
              <p
                className="text-[#CEF17B]"
                style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
              >
                {new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }).toLowerCase()}
              </p>
            </div>

            {/* Card Display */}
            <TarotCard
              card={card}
              isReversed={isReversed}
              isRevealed={isRevealed}
              userName={localStorage.getItem('userName') || undefined}
              cardDate={dateString}
            />

            {/* Reveal Button */}
            {!isRevealed && (
              <div className="text-center mt-16">
                <button
                  onClick={handleRevealCard}
                  className="px-8 py-3 bg-[#CEF17B] hover:bg-[#d4f58a] text-[#172211] rounded-full transition-all duration-200 shadow-lg"
                  style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  reveal card
                </button>
                <p className="text-[#E1EEFC] mt-4 opacity-60" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                  take a moment to centre yourself
                </p>
              </div>
            )}

            {/* Reflection Area */}
            {isRevealed && (() => {
              const today = new Date().toISOString().split('T')[0];
              const isToday = dateString === today;
              const reflection = localStorage.getItem(`reflection-${dateString}`) || '';

              // Only show reflection section if it's today OR if there's a past reflection
              if (!isToday && !reflection.trim()) {
                return null;
              }

              return (
                <div className="mt-12 w-full">
                  <h3 className="text-[#CEF17B] mb-4 md:mb-6" style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                    talk about it
                  </h3>
                  {isToday ? (
                    <textarea
                      aria-label="Write your reflection on today's card"
                      className="w-full h-48 bg-[#172211] text-[#E1EEFC] border border-[#CEF17B]/30 hover:border-[#CEF17B]/50 focus:border-[#CEF17B] rounded-xl p-4 md:p-6 focus:outline-none resize-none leading-relaxed placeholder:text-[#E1EEFC]/40"
                      placeholder="spill your thoughts here"
                      onChange={(e) => handleJournalChange(e.target.value)}
                      defaultValue={reflection}
                      style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.2' }}
                    />
                  ) : (
                    <div className="bg-[#172211] border border-[#CEF17B]/20 rounded-xl p-4 md:p-6 text-[#E1EEFC] leading-relaxed" style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '1.2' }}>
                      {reflection}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {currentView === 'year' && (
          <YearView
            year={new Date().getFullYear()}
            journalEntries={journalEntries}
            onDateClick={handleDateClick}
            onNavigateToToday={() => {
              setViewingPastCard(false);
              window.scrollTo({ top: 0, behavior: 'instant' });
              setCurrentView('card');
            }}
            currentDate={new Date().toISOString().split('T')[0]}
          />
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 flex items-center justify-center gap-5">
        <a
          href="/privacy"
          className="text-[#E1EEFC] opacity-30 hover:opacity-60 transition-opacity"
          style={{ fontSize: '18px', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          privacy policy
        </a>
        <span className="text-[#E1EEFC] opacity-30" style={{ fontSize: '18px' }}>·</span>
        <a
          href="https://buymeacoffee.com/shxntxnx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E1EEFC] opacity-30 hover:opacity-60 transition-opacity"
          style={{ fontSize: '18px', fontFamily: 'var(--font-reenie-beanie), cursive' }}
        >
          buy me a coffee
        </a>
      </div>

      {/* Development Card Selector */}
      {process.env.NODE_ENV === 'development' && (
        <CardSelector onSelectCard={handleSelectCard} />
      )}
    </main>
  );
}
