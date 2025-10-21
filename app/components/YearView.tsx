'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { getCardIcon } from './card-icons';

interface JournalEntry {
  date: string;
  cardId: string;
  hasJournal: boolean;
  isReversed?: boolean;
}

interface YearViewProps {
  year: number;
  journalEntries: JournalEntry[];
  onDateClick: (date: string) => void;
  currentDate: string;
}

// Hand-drawn vertical line component for unopened dates
const VerticalLine = ({ isToday }: { isToday?: boolean }) => {
  // Create unique hand-drawn imperfections for each line
  const wobble = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const y = 2 + (i * 2);
      const x = 2 + (Math.random() - 0.5) * 0.8; // Random wobble
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }, []);

  return (
    <svg viewBox="0 0 4 24" className="w-full h-full">
      <polyline
        points={wobble}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className={isToday ? "text-forest-700" : "text-forest-300"}
        opacity={isToday ? "0.8" : "0.4"}
      />
    </svg>
  );
};

// Mini tarot card component for opened dates
const MiniTarotCard = ({ isToday }: { isToday?: boolean }) => {
  return (
    <div className={`w-full h-full rounded border-2 ${
      isToday ? "border-forest-700 bg-cream-100" : "border-forest-400 bg-cream-50"
    } shadow-sm`} />
  );
};

export default function YearView({ year, journalEntries, onDateClick, currentDate }: YearViewProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [animating, setAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);

  // Reset animation each time component mounts (when switching to Year view)
  useEffect(() => {
    setAnimating(true);
    // After all animations complete, set to false
    const maxDelay = journalEntries.length * 15; // 15ms per card
    const animationDuration = 400; // 400ms per card animation
    const timer = setTimeout(() => {
      setAnimating(false);
    }, maxDelay + animationDuration + 100);

    return () => clearTimeout(timer);
  }, []); // Only run on mount

  // Generate all days of the year as a single flowing array
  const allDaysInYear = useMemo(() => {
    const days = [];
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthName = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long' });

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day).toISOString().split('T')[0];
        days.push({
          date,
          month: monthName,
          monthIndex: month,
          dayOfYear: days.length
        });
      }
    }
    return days;
  }, [year]);

  // Create a map of dates with cards drawn
  const cardMap = useMemo(() => {
    const map = new Map<string, JournalEntry>();
    journalEntries.forEach(entry => {
      map.set(entry.date, entry);
    });
    return map;
  }, [journalEntries]);

  // Scroll to current month on load
  useEffect(() => {
    if (currentMonthRef.current) {
      setTimeout(() => {
        currentMonthRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, []);

  // Count days with cards
  const daysWithCards = journalEntries.length;

  const currentMonth = new Date(currentDate).getMonth();

  return (
    <div className="relative min-h-screen bg-cream-50">
      {/* Glass morphism fade at top */}
      <div className="fixed top-20 left-0 right-0 h-16 md:h-20 bg-gradient-to-b from-cream-50 via-cream-50/60 to-transparent backdrop-blur-sm z-30 pointer-events-none" />

      {/* Glass morphism fade at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-cream-50 via-cream-50/60 to-transparent backdrop-blur-sm z-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto py-4 px-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-handwritten text-forest-900 mb-2">
            {year}
          </h1>
          <p className="text-forest-600 text-base md:text-lg font-light">
            {daysWithCards} {daysWithCards === 1 ? 'day' : 'days'} drawn
          </p>
        </div>

        {/* Compact grid of all days - vertical lines and mini cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(24px,1fr))] gap-1 md:gap-1.5 justify-items-start">
          {allDaysInYear.map((dayData, idx) => {
            const { date, month, monthIndex } = dayData;
            const entry = cardMap.get(date);
            const isToday = date === currentDate;
            const hasCard = !!entry;
            const CardIcon = entry ? getCardIcon(entry.cardId) : null;
            const isReversed = entry?.isReversed || false;

            // Show month label on the 1st of each month
            const dayOfMonth = parseInt(date.split('-')[2]);
            const isMonthStart = dayOfMonth === 1;

            // Calculate animation delay for cascading effect
            // Only animate cards that have been drawn
            const cardIndex = journalEntries.findIndex(e => e.date === date);
            const animationDelay = hasCard && cardIndex >= 0 ? cardIndex * 15 : 0; // 15ms stagger for faster cascade

            return (
              <div
                key={date}
                className="relative"
                ref={monthIndex === currentMonth && isMonthStart ? currentMonthRef : null}
                style={{
                  animationDelay: hasCard ? `${animationDelay}ms` : '0ms'
                }}
              >
                {/* Month label */}
                {isMonthStart && (
                  <div className="absolute -top-5 md:-top-6 left-0 text-xs font-handwritten text-forest-600 whitespace-nowrap pointer-events-none">
                    {month.slice(0, 3)}
                  </div>
                )}

                <button
                  onClick={() => onDateClick(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`
                    relative transition-all duration-200
                    ${hasCard ? 'hover:scale-125 hover:z-30' : 'hover:scale-110'}
                    ${isToday ? 'scale-110 z-20' : 'z-0'}
                    ${hasCard && animating ? 'card-flip-enter' : ''}
                  `}
                  style={{
                    width: hasCard ? 'clamp(20px, 5vw, 24px)' : '3px',
                    height: 'clamp(28px, 7vw, 36px)',
                    animationDelay: hasCard ? `${animationDelay}ms` : '0ms',
                    animationFillMode: 'backwards',
                  }}
                  title={new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                >
                  {hasCard ? (
                    // Mini tarot card for opened dates
                    <>
                      <MiniTarotCard isToday={isToday} />

                      {/* Card icon */}
                      {CardIcon && (
                        <div
                          className={`absolute inset-0 p-0.5 text-forest-700 ${
                            isReversed ? 'rotate-180' : ''
                          }`}
                        >
                          <CardIcon />
                        </div>
                      )}

                      {/* Reversed indicator - tiny curve below card */}
                      {isReversed && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          <svg viewBox="0 0 8 4" className="w-2 h-2 text-forest-600" opacity="0.6">
                            <path
                              d="M 1 1 Q 4 3 7 1"
                              stroke="currentColor"
                              strokeWidth="1"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      )}
                    </>
                  ) : (
                    // Vertical line for unopened dates
                    <VerticalLine isToday={isToday} />
                  )}

                  {/* Hover tooltip */}
                  {hoveredDate === date && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 backdrop-blur-md bg-forest-800/90 text-cream-50 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-40 shadow-lg border border-forest-600/30">
                      <div className="font-light">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {hasCard && entry && (
                        <div className="font-handwritten text-sm">
                          {isReversed ? '↻ Reversed' : 'Upright'}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
