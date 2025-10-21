'use client';

import { useState, useEffect } from 'react';
import { TarotCard } from '@/lib/types/tarot';
import { getCardIcon } from './card-icons';

interface RolodexFlipProps {
  finalCard: TarotCard;
  onComplete: () => void;
  dateString?: string;
}

const cardNames = [
  'The Star', 'Ace of Cups', 'Seven of Wands', 'The Moon',
  'Three of Swords', 'The Hermit', 'Queen of Pentacles', 'The Lovers',
  'Five of Cups', 'The Chariot', 'Two of Wands', 'The World'
];

export default function RolodexFlip({ finalCard, onComplete, dateString }: RolodexFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [rotationY, setRotationY] = useState(0);

  // Simulate card flipping through multiple cards
  useEffect(() => {
    if (!isSpinning) return;

    const totalFlips = 15; // Number of cards to flip through
    const flipDuration = 80; // ms per flip - faster at start, slower at end

    if (currentIndex < totalFlips) {
      const delay = currentIndex < 8 ? flipDuration : flipDuration * (currentIndex - 6);
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setRotationY((prev) => prev + 180);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Finished flipping
      setTimeout(() => {
        setIsSpinning(false);
        onComplete();
      }, 800);
    }
  }, [currentIndex, isSpinning, onComplete]);

  const displayCardName = isSpinning
    ? cardNames[currentIndex % cardNames.length]
    : finalCard.name;

  const isFaceUp = Math.floor(rotationY / 180) % 2 === 0;

  // Get the icon for the final card
  const CardIcon = getCardIcon(finalCard.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Date */}
      {dateString && (
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
      )}

      <div className="flex justify-center items-center">
        <div className="relative perspective-1000">
          {/* Card stack effect - multiple cards behind */}
          <div className="relative">
          <div className="absolute inset-0 bg-forest-200 rounded-2xl transform translate-y-3 translate-x-3 opacity-20 blur-sm aspect-[2/3] w-72" />
          <div className="absolute inset-0 bg-forest-300 rounded-2xl transform translate-y-2 translate-x-2 opacity-30 blur-sm aspect-[2/3] w-72" />
          <div className="absolute inset-0 bg-forest-400 rounded-2xl transform translate-y-1 translate-x-1 opacity-40 aspect-[2/3] w-72" />

          {/* Main flipping card */}
          <div
            className="relative aspect-[2/3] w-72 bg-cream-50 rounded-2xl shadow-2xl border-2 border-forest-300 flex items-center justify-center preserve-3d"
            style={{
              transform: `rotateY(${rotationY}deg)`,
              transition: isSpinning
                ? `transform ${currentIndex < 8 ? 0.15 : 0.3}s cubic-bezier(0.4, 0.0, 0.2, 1)`
                : 'transform 0.6s ease-out',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Card Back (when flipped) - Forest green background */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="text-center w-full p-6">
                <div className="w-44 h-44 mx-auto mb-3 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-cream-100" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.3" />
                    <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
                    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-cream-100 mb-1">Daily Card</h3>
                <p className="text-cream-200 text-sm uppercase tracking-widest">Tarot</p>
              </div>
            </div>

            {/* Card Front - Shows actual card icon */}
            <div
              className="absolute inset-0 rounded-2xl bg-cream-50 flex items-center justify-center backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="text-center w-full p-6">
                <div className="w-44 h-44 mx-auto mb-3 text-forest-700">
                  {CardIcon && !isSpinning ? (
                    <CardIcon />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4" />
                        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
                        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.6" />
                        <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.5" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-light text-forest-900 mb-1">
                  {displayCardName}
                </h3>
                <p className="text-forest-600 text-sm uppercase tracking-widest">
                  {isSpinning ? 'Shuffling...' : 'Major Arcana'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
