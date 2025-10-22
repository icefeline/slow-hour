'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { getCardIcon } from './card-icons';
import TarotCard from './TarotCard';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // Delay scroll to avoid triggering glass effect on initial load
      setTimeout(() => {
        // Temporarily disable scroll detection
        setIsScrolling(false);
        currentMonthRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        // Keep glass hidden during initial auto-scroll
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      }, 100);
    }
  }, []);

  // Detect scrolling to show/hide glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Hide glass effect after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Count days with cards
  const daysWithCards = journalEntries.length;

  const currentMonth = new Date(currentDate).getMonth();

  // Get selected card data for drawer
  const selectedEntry = selectedDate ? journalEntries.find(e => e.date === selectedDate) : null;
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);

  // Fetch card data when a date is selected
  useEffect(() => {
    if (selectedDate && selectedEntry) {
      // Fetch the card data from the API
      fetch(`/api/daily-card?seed=${selectedDate}`)
        .then(res => res.json())
        .then(data => setSelectedCard(data.card))
        .catch(err => console.error('Failed to load card:', err));
    }
  }, [selectedDate, selectedEntry]);

  return (
    <div className="relative min-h-screen bg-cream-50 pt-12">
      {/* Sticky header with gradient fade background */}
      <div className="sticky top-16 md:top-20 z-20 bg-gradient-to-b from-cream-50 via-cream-50 to-cream-50/0 pb-6 md:pb-8">
        <div className="text-center pt-4 px-6 md:px-8">
          <h1 className="text-4xl md:text-5xl font-handwritten text-forest-900 mb-2">
            {year}
          </h1>
          <p className="text-forest-600 text-base md:text-lg font-light">
            {daysWithCards} {daysWithCards === 1 ? 'day' : 'days'} drawn
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-8">

        {/* Compact grid of all days - vertical lines and mini cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(24px,1fr))] gap-1 md:gap-1.5 justify-items-center">
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
                  onClick={() => {
                    // On mobile, open drawer; on desktop, use onDateClick
                    if (window.innerWidth < 768 && hasCard) {
                      setSelectedDate(date);
                      setDrawerOpen(true);
                    } else {
                      onDateClick(date);
                    }
                  }}
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
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md bg-forest-800/90 text-cream-50 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50 shadow-lg border border-forest-600/30">
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

      {/* Mobile bottom drawer */}
      {drawerOpen && selectedDate && selectedCard && selectedEntry && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-forest-900/40 backdrop-blur-sm z-40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-cream-50 rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Handle bar - sticky with higher z-index */}
            <div className="sticky top-0 bg-cream-50 pt-3 pb-4 flex justify-center rounded-t-3xl z-10 shadow-sm">
              <div className="w-12 h-1.5 bg-forest-300 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              {/* Date */}
              <div className="text-center mb-8">
                <p className="text-forest-600 text-lg font-light tracking-wider uppercase">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Card Display */}
              <div className="max-w-sm mx-auto mb-6">
                <TarotCard
                  card={selectedCard}
                  isReversed={selectedEntry.isReversed || false}
                  isRevealed={true}
                />
              </div>

              {/* Reflection - always show the container */}
              <div className="mt-6">
                <h3 className="text-2xl font-light text-forest-900 mb-3">
                  Reflection
                </h3>
                <div className="bg-cream-100/50 border border-forest-200 rounded-xl p-4 text-forest-800 font-light text-base leading-relaxed min-h-[100px]">
                  {localStorage.getItem(`reflection-${selectedDate}`) || 'No reflection written for this day.'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
