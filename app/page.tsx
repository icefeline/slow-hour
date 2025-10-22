'use client';

import { useState, useEffect } from 'react';
import TarotCard from './components/TarotCard';
import RolodexFlip from './components/RolodexFlip';
import YearView from './components/YearView';
import Onboarding from './components/Onboarding';
import NotificationSettings from './components/NotificationSettings';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';

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
      // Add random seed as query param for testing different cards
      const testSeed = localStorage.getItem('testSeed') || '';
      const url = testSeed ? `/api/daily-card?seed=${testSeed}` : '/api/daily-card';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-forest-600 text-lg font-light">Loading...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header with View Toggle */}
      <div className="fixed top-0 left-0 right-0 bg-cream-50/80 backdrop-blur-sm border-b border-forest-200 z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-handwritten text-forest-900">
            Slow Hour
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('card')}
              className={`px-6 py-3 rounded-full text-xl font-light transition-all ${
                currentView === 'card'
                  ? 'bg-forest-500 text-cream-50'
                  : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentView('year')}
              className={`px-6 py-3 rounded-full text-xl font-light transition-all ${
                currentView === 'year'
                  ? 'bg-forest-500 text-cream-50'
                  : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
              }`}
            >
              Year
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-full text-2xl font-light bg-forest-50 text-forest-600 hover:bg-forest-100 transition-all"
              title="Reset to see rolodex animation"
            >
              ↻
            </button>
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
              <p className="text-forest-600 text-2xl font-light tracking-wider uppercase">
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
                  className="px-8 py-3 bg-forest-600 hover:bg-forest-700 text-cream-50 font-light rounded-full transition-all duration-200 hover:shadow-md"
                >
                  Reveal Card
                </button>
                <p className="text-forest-500 text-xs mt-4 font-light">
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
                  <h3 className="text-3xl font-light text-forest-900 mb-4">
                    Reflection
                  </h3>
                  {isToday ? (
                    <textarea
                      className="w-full h-48 bg-cream-50/80 text-forest-800 border border-forest-300 rounded-xl p-6 focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none font-light text-xl leading-relaxed"
                      placeholder="Write your thoughts here..."
                      onChange={(e) => handleJournalChange(e.target.value)}
                      defaultValue={reflection}
                    />
                  ) : (
                    <div className="bg-cream-100/50 border border-forest-200 rounded-xl p-6 text-forest-800 font-light text-xl leading-relaxed">
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
            currentDate={new Date().toISOString().split('T')[0]}
          />
        )}
      </div>
    </main>
  );
}
