'use client';

import { useEffect, useRef } from 'react';

const REEL_IMAGES = [
  '/cards/major-0-fool.png',
  '/cards/major-1-magician.png',
  '/cards/major-2-high-priestess.png',
  '/cards/major-3-empress.png',
  '/cards/major-4-emperor.png',
  '/cards/major-5-hierophant.png',
  '/cards/major-6-lovers.png',
  '/cards/major-7-chariot.png',
  '/cards/major-8-strength.png',
  '/cards/major-9-hermit.png',
  '/cards/major-10-wheel-of-fortune.png',
  '/cards/major-11-justice.png',
  '/cards/major-12-hanged-man.png',
  '/cards/major-13-death.png',
  '/cards/major-14-temperance.png',
  '/cards/major-15-devil.png',
  '/cards/major-16-tower.png',
  '/cards/major-17-star.png',
  '/cards/major-18-moon.png',
  '/cards/major-19-sun.png',
  '/cards/cups-ace.png',
  '/cards/cups-3.png',
  '/cards/cups-5.png',
  '/cards/cups-7.png',
  '/cards/cups-9.png',
  '/cards/wands-ace.png',
  '/cards/wands-3.png',
  '/cards/wands-5.png',
  '/cards/wands-7.png',
  '/cards/wands-9.png',
  '/cards/swords-ace.png',
  '/cards/swords-3.png',
  '/cards/swords-5.png',
  '/cards/swords-7.png',
  '/cards/pentacles-ace.png',
  '/cards/pentacles-3.png',
  '/cards/pentacles-5.png',
];

interface CardSlotRevealProps {
  selectedCardSrc: string;
  isReversed: boolean;
  onComplete: () => void;
}

// Easing: linear for fast phase, then ease-out-quart for the last 5 cards
function customEase(t: number): number {
  // Fast phase covers first 80% of distance in 60% of time
  const fastTime = 0.60;
  const fastDist = 0.80;
  if (t < fastTime) {
    return (t / fastTime) * fastDist;
  }
  // Slow phase: ease-out-quart over remaining distance
  const slowT = (t - fastTime) / (1 - fastTime);
  const eased = 1 - Math.pow(1 - slowT, 4);
  return fastDist + eased * (1 - fastDist);
}

export default function CardSlotReveal({ selectedCardSrc, isReversed, onComplete }: CardSlotRevealProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Build reel: random cards (excluding the selected) + selected card at bottom
  const reel = (() => {
    const pool = REEL_IMAGES.filter(src => src !== selectedCardSrc);
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // 20 random cards + selected at the bottom
    return [...pool.slice(0, 20), selectedCardSrc];
  })();

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    // Total scroll: move all random cards off the top, leaving only the selected card visible
    // Each card has aspect-ratio 2/3. We measure actual rendered height.
    const cardEl = strip.firstElementChild as HTMLElement | null;
    if (!cardEl) return;

    const cardHeight = cardEl.offsetHeight;
    // We need to scroll up by 20 card heights (leaving the selected card at the bottom)
    const totalDistance = cardHeight * 20;
    const duration = 2800; // ms
    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = customEase(t);
      const translateY = -(totalDistance * eased);

      strip.style.transform = `translateY(${translateY}px)`;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        strip.style.transform = `translateY(${-totalDistance}px)`;
        onComplete();
      }
    };

    // Small delay so the first frame renders before we start scrolling
    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 50);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete, selectedCardSrc]);

  return (
    <div
      className="absolute inset-0 rounded-2xl overflow-hidden z-10"
      style={{ backgroundColor: '#172211' }}
    >
      <div ref={stripRef} className="absolute inset-x-0 top-0" style={{ willChange: 'transform' }}>
        {reel.map((src, i) => (
          <div
            key={i}
            className="w-full"
            style={{
              aspectRatio: '2/3',
              transform: isReversed && i === reel.length - 1 ? 'rotate(180deg)' : undefined,
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
