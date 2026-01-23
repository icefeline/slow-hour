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
      <div className="relative mb-8">
        <div className="aspect-[2/3] w-96 mx-auto rounded-2xl overflow-visible relative">
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
          <div className="absolute left-0 right-0 flex items-end justify-center pointer-events-none" style={{ bottom: '-100px' }}>
            <h3
              className="text-center px-2"
              style={{
                fontSize: '200px',
                fontFamily: 'var(--font-reenie-beanie), cursive',
                lineHeight: '1',
                color: '#CEF17B',
                whiteSpace: 'nowrap',
                overflow: 'visible',
                WebkitTextStroke: '1px #172211',
                textStroke: '1px #172211',
                transform: `rotate(-2.3deg) ${isReversed ? 'scaleX(-1)' : ''}`,
                transformOrigin: 'center center',
                letterSpacing: '-0.05em'
              }}
            >
              {card.name.toLowerCase()}
            </h3>
          </div>
        )}
      </div>

      {/* Card Name and Info (only shown when revealed) */}
      {isRevealed && (
        <div className="w-full space-y-8 animate-fade-in">

          {/* Keywords - Circular Marquee */}
          <div className="relative w-64 h-64 mx-auto mt-24">
            {activeKeywords.slice(0, 5).map((keyword, index) => {
              const totalKeywords = Math.min(activeKeywords.length, 5);
              const startAngle = (index / totalKeywords) * 360;
              const animationDelay = -(index / totalKeywords) * 20; // Stagger start positions

              return (
                <span
                  key={index}
                  className="absolute text-[#CEF17B]"
                  style={{
                    fontSize: 'clamp(22px, 3.5vw, 32px)',
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
            <h4 className="text-[#CEF17B] mb-4" style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>meaning</h4>
            <p className="text-[#E1EEFC]" style={{ fontSize: '40px', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '60px' }}>{activeMeaning.toLowerCase()}</p>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[#CEF17B] mb-4" style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>about this card</h4>
            <p className="text-[#E1EEFC]" style={{ fontSize: '40px', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '60px' }}>{card.description.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
