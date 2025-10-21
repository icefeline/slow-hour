'use client';

import { useState, useEffect } from 'react';
import TarotCard from './components/TarotCard';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';

export default function Home() {
  const [card, setCard] = useState<TarotCardType | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    // Check if we've already drawn today's card
    const today = new Date().toISOString().split('T')[0];
    const lastDrawDate = localStorage.getItem('lastDrawDate');
    const wasRevealed = localStorage.getItem('cardRevealed') === 'true';

    if (lastDrawDate === today && wasRevealed) {
      // Load today's card
      loadTodaysCard(true);
    } else {
      // New day or not revealed yet
      loadTodaysCard(false);
    }
  }, []);

  const loadTodaysCard = async (autoReveal: boolean) => {
    try {
      const response = await fetch('/api/daily-card');
      const data = await response.json();

      setCard(data.card);
      setIsReversed(data.isReversed);
      setDateString(data.date);
      setIsRevealed(autoReveal);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load card:', error);
      setIsLoading(false);
    }
  };

  const handleRevealCard = () => {
    setIsRevealed(true);
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastDrawDate', today);
    localStorage.setItem('cardRevealed', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="text-ink-600 text-lg">Loading your daily card...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-sand-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-ink-900 mb-2 tracking-wide">
            Daily Tarot
          </h1>
          <p className="text-ink-500 text-sm font-light tracking-wider uppercase">
            {new Date(dateString).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Card Display */}
        {card && (
          <TarotCard
            card={card}
            isReversed={isReversed}
            isRevealed={isRevealed}
          />
        )}

        {/* Reveal Button */}
        {!isRevealed && card && (
          <div className="text-center mt-16">
            <button
              onClick={handleRevealCard}
              className="px-8 py-3 bg-clay-500 hover:bg-clay-600 text-sand-50 font-light rounded-full transition-all duration-200 hover:shadow-md"
            >
              Reveal Card
            </button>
            <p className="text-ink-400 text-xs mt-4 font-light">
              Take a moment to center yourself
            </p>
          </div>
        )}

        {/* Reflection Area (shown after reveal) */}
        {isRevealed && card && (
          <div className="mt-16 bg-white/60 rounded-2xl p-8 border border-sand-300/50 shadow-sm">
            <h3 className="text-xl font-light text-ink-900 mb-3">
              Reflection
            </h3>
            <p className="text-ink-600 text-sm mb-6 font-light">
              How does this card's message resonate with your day?
            </p>
            <textarea
              className="w-full h-32 bg-sand-50/80 text-ink-800 border border-sand-300 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-clay-400 resize-none font-light text-sm"
              placeholder="Write your thoughts here..."
              onChange={(e) => {
                localStorage.setItem(`reflection-${dateString}`, e.target.value);
              }}
              defaultValue={localStorage.getItem(`reflection-${dateString}`) || ''}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-ink-400 text-xs font-light">
          <p>Return tomorrow for your next card</p>
        </div>
      </div>
    </main>
  );
}
