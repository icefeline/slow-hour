'use client';

import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { getActiveMeaning, getActiveKeywords, formatSuite } from '@/lib/utils/card-utils';
import { getCardIcon } from './card-icons';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isRevealed: boolean;
}

export default function TarotCard({ card, isReversed, isRevealed }: TarotCardProps) {
  const activeMeaning = getActiveMeaning(card, isReversed);
  const activeKeywords = getActiveKeywords(card, isReversed);
  const CardIcon = getCardIcon(card.id);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Back/Front */}
      <div className="relative mb-8">
        <div
          className={`
            aspect-[2/3] w-72 mx-auto rounded-2xl
            transition-all duration-1000 transform-gpu
            ${isReversed && isRevealed ? 'rotate-180' : ''}
          `}
        >
          {isRevealed ? (
            // Card Front - Hand-drawn style with forest green ink
            <div className="w-full h-full bg-cream-50 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-forest-300 shadow-md">
              <div className={`text-center w-full ${isReversed ? 'rotate-180' : ''}`}>
                {/* Hand-drawn nature element icon - larger and more prominent */}
                <div className="w-56 h-56 mx-auto mb-3 text-forest-700">
                  {CardIcon ? <CardIcon /> : (
                    <div className="w-full h-full rounded-full border-2 border-clay-400 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-sage-300/40"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-light text-forest-900 mb-1">{card.name}</h3>
                <p className="text-forest-600 text-sm uppercase tracking-widest">{formatSuite(card.suite)}</p>
              </div>
            </div>
          ) : (
            // Card Back - Whimsical botanical pattern
            <div className="w-full h-full bg-cream-50 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-forest-300 shadow-md overflow-hidden relative">
              <div className="text-center w-full">
                {/* Botanical pattern */}
                <div className="w-56 h-56 mx-auto mb-3 flex items-center justify-center relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url(/card-back-pattern.png)',
                      backgroundSize: 'cover',
                    }}
                  />
                </div>
                <h3 className="text-2xl font-light text-forest-900 mb-1">Daily Card</h3>
                <p className="text-forest-600 text-sm uppercase tracking-widest">Tarot</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Information (only shown when revealed) */}
      {isRevealed && (
        <div className="space-y-6 animate-fade-in">
          {/* Orientation Badge */}
          <div className="flex justify-center">
            <span className={`
              px-4 py-1 rounded-full text-xs font-light tracking-wider uppercase
              ${isReversed
                ? 'bg-clay-100 text-clay-700 border border-clay-300'
                : 'bg-sage-100 text-sage-700 border border-sage-300'
              }
            `}>
              {isReversed ? 'Reversed' : 'Upright'}
            </span>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-3">
            {activeKeywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-forest-100 text-forest-800 rounded-full text-lg border-2 border-forest-400 font-light transform hover:scale-105 transition-transform"
                style={{
                  transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`
                }}
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Meaning */}
          <div className="p-8">
            <h4 className="text-3xl font-light text-ink-900 mb-6">Meaning</h4>
            <p className="text-ink-700 leading-relaxed text-2xl font-light">{activeMeaning}</p>
          </div>

          {/* Description */}
          <div className="p-8">
            <h4 className="text-3xl font-light text-ink-900 mb-6">About This Card</h4>
            <p className="text-ink-700 leading-relaxed text-2xl font-light">{card.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
