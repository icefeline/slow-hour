'use client';

import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { getActiveMeaning, getActiveKeywords, formatSuite } from '@/lib/utils/card-utils';
import { getCardIcon } from './card-icons';
import { ActiveInsight } from './ActiveInsight';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isRevealed: boolean;
  userName?: string; // Optional: user's first name for personalization
}

export default function TarotCard({ card, isReversed, isRevealed, userName }: TarotCardProps) {
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
        <div className="w-full space-y-12 animate-fade-in">

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
            <p className="text-[#E1EEFC]" style={{ fontSize: '40px', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '48px' }}>{activeMeaning.toLowerCase()}</p>
          </div>

          {/* Active Insight - Personalized Context */}
          <ActiveInsight
            keyPhrase="the foundation is asking for truth"
            insight="Pluto square Moon is closing in, and The Tower landed in your 4th house. That's home territory - the foundation, the family dynamics, the stuff you thought was solid. Here's the thing: what's falling apart was probably held together with hope and effort for too long. The breakdown isn't the enemy. It's the truth finally getting loud enough to hear."
            transitInfo="Pluto square Moon • approaching • 58 days remaining"
            userName={userName}
            transitExplanation={{
              transitingPlanet: "Pluto",
              transitingPlanetMeaning: "transformation, power, the unconscious",
              natalPlanet: "Moon",
              natalPlanetMeaning: "emotions, home, nurturing, your inner world",
              aspectType: "square",
              aspectMeaning: "a 90° angle creating tension and challenge that demands action",
              phaseMeaning: "You're in the approaching phase, meaning the intensity is building as the transit gets closer to being exact. This is when you start feeling the pressure most strongly."
            }}
          />

          {/* Description */}
          <div>
            <h4 className="text-[#CEF17B] mb-4" style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}>about this card</h4>
            <p className="text-[#E1EEFC]" style={{ fontSize: '40px', fontFamily: 'var(--font-reenie-beanie), cursive', lineHeight: '48px' }}>{card.description.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
