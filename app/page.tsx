'use client';

import { useState, useEffect } from 'react';
import TarotCard from './components/TarotCard';
import RolodexFlip from './components/RolodexFlip';
import YearView from './components/YearView';
import Onboarding from './components/Onboarding';
import NotificationSettings from './components/NotificationSettings';
import CardSelector from './components/CardSelector';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { tarotDeck } from '@/lib/data/tarot-deck';

type View = 'rolodex' | 'card' | 'year' | 'settings';

interface JournalEntry {
  date: string;
  cardId: string;
  hasJournal: boolean;
  reflection?: string;
  isReversed?: boolean;
}

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('rolodex');
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

  const loadTodaysCard = async () => {
    try {
      // Build URL with query parameters
      const params = new URLSearchParams();

      // Add test seed if present (for development)
      const testSeed = localStorage.getItem('testSeed');
      if (testSeed) {
        params.append('seed', testSeed);
      }

      // Add birthdate for personalized card selection
      const birthdate = localStorage.getItem('userBirthdate');
      if (birthdate) {
        params.append('birthdate', birthdate);
      }

      const url = params.toString() ? `/api/daily-card?${params.toString()}` : '/api/daily-card';
      const response = await fetch(url);
      const data = await response.json();

      setCard(data.card);
      setIsReversed(data.isReversed);
      setDateString(data.date);

      // Check if already revealed today
      const today = new Date().toISOString().split('T')[0];
      const lastDrawDate = localStorage.getItem('lastDrawDate');
      const wasRevealed = localStorage.getItem('cardRevealed') === 'true';

      if (lastDrawDate === today && wasRevealed) {
        setCurrentView('card');
        setIsRevealed(true);
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
    const year = new Date().getFullYear();

    // First, get all cards drawn (not just those with reflections)
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

    console.log('Loaded journal entries:', entries);
    setJournalEntries(entries);
  };

  const handleRolodexComplete = () => {
    setCurrentView('card');
    handleRevealCard();
  };

  const handleRevealCard = () => {
    setIsRevealed(true);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastDrawDate', today);
    localStorage.setItem('cardRevealed', 'true');

    // Save card data and reversed state
    if (card) {
      localStorage.setItem(`card-${dateString}`, card.id);
      localStorage.setItem(`reversed-${dateString}`, isReversed.toString());
    }

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
      setCurrentView('card');
    }
  };

  const handleReset = () => {
    // Only reset today's card, keep all historical data
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem('lastDrawDate');
    localStorage.removeItem('cardRevealed');
    localStorage.removeItem(`card-${today}`);
    localStorage.removeItem(`reversed-${today}`);
    localStorage.removeItem(`reflection-${today}`);
    // Add random timestamp to force different card draw
    localStorage.setItem('testSeed', Math.random().toString());
    window.location.reload();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    loadTodaysCard();
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
        <div className="text-[#E1EEFC] text-lg font-handwritten">Loading...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <main className="min-h-screen bg-[#172211]">
      {/* Header with View Toggle */}
      <div className="fixed top-0 left-0 right-0 z-30" style={{
        backgroundColor: 'rgba(23, 34, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(206, 241, 123, 0.2)'
      }}>
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          {/* Logo with spiral */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-handwritten text-[#E1EEFC]">
              sl
            </span>
            <img
              src="/spiral-logo.svg"
              alt="o"
              style={{
                height: '48px',
                width: 'auto',
                filter: 'brightness(0) invert(1)'
              }}
            />
            <span className="text-3xl font-handwritten text-[#E1EEFC]">
              w hour
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('card')}
              className={`px-6 py-3 rounded-full text-xl font-handwritten transition-all ${
                currentView === 'card'
                  ? 'bg-[#CEF17B] text-[#172211]'
                  : 'bg-[#CEF17B]/20 text-[#E1EEFC] hover:bg-[#CEF17B]/30'
              }`}
            >
              today
            </button>
            <button
              onClick={() => setCurrentView('year')}
              className={`px-6 py-3 rounded-full text-xl font-handwritten transition-all ${
                currentView === 'year'
                  ? 'bg-[#CEF17B] text-[#172211]'
                  : 'bg-[#CEF17B]/20 text-[#E1EEFC] hover:bg-[#CEF17B]/30'
              }`}
            >
              year
            </button>
            {/* Only show reset button in development */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-full text-2xl font-handwritten bg-[#CEF17B]/10 text-[#CEF17B] hover:bg-[#CEF17B]/20 transition-all"
                  title="Reset to see rolodex animation"
                >
                  ↻
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="px-4 py-3 rounded-full text-2xl font-handwritten bg-[#CEF17B]/10 text-[#CEF17B] hover:bg-[#CEF17B]/20 transition-all"
                  title="Full reset (clear all data)"
                >
                  🔄
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20">
        {currentView === 'rolodex' && card && (
          <RolodexFlip finalCard={card} onComplete={handleRolodexComplete} dateString={dateString} />
        )}

        {currentView === 'card' && card && (
          <div className="max-w-2xl mx-auto px-6 md:px-8 py-12">
            {/* Date */}
            <div className="text-center mb-12">
              <p className="text-[#CEF17B] text-2xl font-handwritten tracking-wider">
                {new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Card Display */}
            <TarotCard
              card={card}
              isReversed={isReversed}
              isRevealed={isRevealed}
            />

            {/* Reveal Button */}
            {!isRevealed && (
              <div className="text-center mt-16">
                <button
                  onClick={handleRevealCard}
                  className="px-8 py-3 bg-[#CEF17B] hover:bg-[#CEF17B]/90 text-[#172211] font-handwritten rounded-full transition-all duration-200 hover:shadow-md"
                >
                  Reveal Card
                </button>
                <p className="text-[#E1EEFC]/50 text-xs mt-4 font-handwritten">
                  Take a moment to center yourself
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
                <div className="mt-16 p-8">
                  <h3 className="text-3xl font-handwritten text-[#E1EEFC] mb-4">
                    Reflection
                  </h3>
                  {isToday ? (
                    <textarea
                      className="w-full h-48 bg-[#172211]/50 text-[#E1EEFC] border border-[#CEF17B]/20 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-[#CEF17B] resize-none font-handwritten text-xl leading-relaxed"
                      style={{fontSize: '40px', fontFamily: 'Reenie Beanie, cursive'}}
                      placeholder="Write your thoughts here..."
                      onChange={(e) => handleJournalChange(e.target.value)}
                      defaultValue={reflection}
                    />
                  ) : (
                    <div className="bg-[#172211]/30 border border-[#CEF17B]/20 rounded-xl p-6 text-[#E1EEFC] font-handwritten text-xl leading-relaxed">
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
              setCurrentView('card');
            }}
            currentDate={new Date().toISOString().split('T')[0]}
          />
        )}
      </div>

      {/* Development Card Selector */}
      {process.env.NODE_ENV === 'development' && (
        <CardSelector onSelectCard={handleSelectCard} />
      )}
    </main>
  );
}
