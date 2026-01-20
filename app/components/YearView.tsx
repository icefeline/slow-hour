'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { getCardIcon } from './card-icons';
import TarotCard from './TarotCard';
import { TarotCard as TarotCardType } from '@/lib/types/tarot';
import { tarotDeck } from '@/lib/data/tarot-deck';

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
  onNavigateToToday: () => void;
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
        className={isToday ? "text-[#CEF17B]" : "text-[#CEF17B]"}
        opacity={isToday ? "0.6" : "0.2"}
      />
    </svg>
  );
};

// Mini tarot card component for opened dates
const MiniTarotCard = ({ cardId, cardName, isToday }: { cardId: string; cardName: string; isToday?: boolean }) => {
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
    <div className={`w-full h-full rounded overflow-hidden ${
      isToday ? "ring-2 ring-[#CEF17B] shadow-lg" : "shadow-sm"
    }`}>
      <img
        src={`/cards/${getCardFilename(cardId, cardName)}.png`}
        alt={cardName}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function YearView({ year, journalEntries, onDateClick, onNavigateToToday, currentDate }: YearViewProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [animating, setAnimating] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create a card lookup map
  const cardLookup = useMemo(() => {
    const map = new Map<string, TarotCardType>();
    tarotDeck.forEach(card => {
      map.set(card.id, card);
    });
    return map;
  }, []);

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
        // Use Date.UTC to avoid timezone issues
        const date = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
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

  // Scroll to top (January 1st) on load
  useEffect(() => {
    // Scroll to top of page to show January 1st
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
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
    <div className="relative min-h-screen bg-[#172211] pt-12">
      {/* Sticky header with gradient fade background */}
      <div className="sticky top-16 md:top-20 z-20 bg-gradient-to-b from-[#172211] via-[#172211] to-[#172211]/0 pb-6 md:pb-8">
        <div className="text-center pt-6 md:pt-4 px-6 md:px-8">
          <h1 className="text-4xl md:text-5xl text-[#CEF17B] mb-2" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
            {year}
          </h1>
          <p className="text-[#E1EEFC] text-base md:text-lg opacity-70" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
            {daysWithCards} {daysWithCards === 1 ? 'day' : 'days'} drawn
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pb-8">

        {/* Compact grid of all days - vertical lines and mini cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(22px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(28px,1fr))] gap-1 gap-y-6 md:gap-5 md:gap-y-8 justify-items-center items-end">
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
                className="relative flex items-end"
                ref={monthIndex === currentMonth && isMonthStart ? currentMonthRef : null}
                style={{
                  animationDelay: hasCard ? `${animationDelay}ms` : '0ms',
                  height: 'clamp(36px, 7vw, 48px)'
                }}
              >
                {/* Month label */}
                {isMonthStart && (
                  <div className="absolute -top-4 md:-top-5 left-0 text-sm md:text-base text-[#CEF17B] whitespace-nowrap pointer-events-none" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                    {month.slice(0, 3).toLowerCase()}
                  </div>
                )}

                <button
                  onClick={() => {
                    // On mobile: if today's card, navigate to today view; if past card, open drawer
                    // On desktop: always use onDateClick
                    if (window.innerWidth < 768 && hasCard) {
                      if (isToday) {
                        // Navigate to today view on mobile
                        onDateClick(date);
                        onNavigateToToday();
                      } else {
                        // Open drawer for past cards
                        setSelectedDate(date);
                        setDrawerOpen(true);
                      }
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
                    width: hasCard ? 'clamp(24px, 5vw, 32px)' : '2.5px',
                    height: hasCard ? '100%' : 'clamp(28px, 6vw, 36px)',
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
                      {entry && cardLookup.get(entry.cardId) && (
                        <div className={isReversed ? 'rotate-180 w-full h-full' : 'w-full h-full'}>
                          <MiniTarotCard
                            cardId={entry.cardId}
                            cardName={cardLookup.get(entry.cardId)!.name}
                            isToday={isToday}
                          />
                        </div>
                      )}

                      {/* Reversed indicator - tiny curve below card */}
                      {isReversed && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          <svg viewBox="0 0 8 4" className="w-2 h-2 text-[#CEF17B]" opacity="0.6">
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
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md bg-[#172211]/95 text-[#CEF17B] px-3 py-2 rounded-lg text-xl whitespace-nowrap z-50 shadow-lg border border-[#CEF17B]/30" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                      <div>
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }).toLowerCase()}
                      </div>
                      {hasCard && entry && (
                        <div className="text-xl">
                          {isReversed ? '↻ reversed' : 'upright'}
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
            className="md:hidden fixed inset-0 bg-[#172211]/60 backdrop-blur-sm z-40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#172211] rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto animate-slide-up border-t-2 border-[#CEF17B]/30">
            {/* Handle bar - sticky with higher z-index */}
            <div className="sticky top-0 bg-[#172211] pt-4 pb-3 flex justify-center rounded-t-3xl z-10">
              <div className="w-12 h-1.5 bg-[#CEF17B]/40 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8 pt-6">
              {/* Date */}
              <div className="text-center mb-8">
                <p className="text-[#CEF17B] text-2xl tracking-wider" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }).toLowerCase()}
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

              {/* Reflection - only show if there is one */}
              {(() => {
                const reflection = localStorage.getItem(`reflection-${selectedDate}`);
                if (reflection && reflection.trim()) {
                  return (
                    <div className="mt-6 max-w-sm mx-auto">
                      <h3 className="text-3xl text-[#CEF17B] mb-3" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                        reflection
                      </h3>
                      <div className="bg-[#172211] border-2 border-[#CEF17B]/20 rounded-xl p-4 text-[#E1EEFC] text-2xl leading-relaxed" style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}>
                        {reflection}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
