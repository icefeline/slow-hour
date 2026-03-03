'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
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

const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

function buildCalendarDays(year: number, monthIndex: number): CalendarDay[] {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Monday-first: JS getDay() returns 0=Sun, so (0+6)%7=6, (1+6)%7=0=Mon, etc.
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days: CalendarDay[] = [];

  // Previous month overflow
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({ date, day, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ date, day: d, isCurrentMonth: true });
  }

  // Next month overflow to complete the last row
  const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex === 11 ? year + 1 : year;
  const remaining = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const date = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ date, day: d, isCurrentMonth: false });
  }

  return days;
}

function getCardFilename(cardId: string, cardName: string): string {
  if (cardId.startsWith('major-')) {
    const namePart = cardName.toLowerCase().replace(/\s+/g, '-').replace(/^the-/, '');
    return `${cardId}-${namePart}`;
  }
  return cardId;
}

// Hand-drawn vertical line for desktop
const VerticalLine = ({ isToday }: { isToday?: boolean }) => {
  const wobble = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const y = 2 + i * 2;
      const x = 2 + (Math.random() - 0.5) * 0.8;
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
        className="text-[#CEF17B]"
        opacity={isToday ? '0.6' : '0.2'}
      />
    </svg>
  );
};

// Desktop mini tarot card
const MiniTarotCard = ({ cardId, cardName, isToday }: { cardId: string; cardName: string; isToday?: boolean }) => (
  <div className={`w-full h-full rounded overflow-hidden ${isToday ? 'ring-2 ring-[#CEF17B] shadow-lg' : 'shadow-sm'}`}>
    <img
      src={`/cards/${getCardFilename(cardId, cardName)}.png`}
      alt={cardName}
      className="w-full h-full object-cover"
    />
  </div>
);

export default function YearView({ year, journalEntries, onDateClick, onNavigateToToday, currentDate }: YearViewProps) {
  const currentMonthIndex = new Date(currentDate + 'T00:00:00').getMonth();

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [animating, setAnimating] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<TarotCardType | null>(null);

  // Ref to scroll mobile view to current month on mount
  const currentMonthRef = useRef<HTMLDivElement>(null);

  const daysWithCards = journalEntries.length;

  const cardLookup = useMemo(() => {
    const map = new Map<string, TarotCardType>();
    tarotDeck.forEach(card => map.set(card.id, card));
    return map;
  }, []);

  const cardMap = useMemo(() => {
    const map = new Map<string, JournalEntry>();
    journalEntries.forEach(entry => map.set(entry.date, entry));
    return map;
  }, [journalEntries]);

  // Pre-compute calendar days for all 12 months
  const allMonthCalendarDays = useMemo(() => {
    return MONTH_NAMES.map((_, i) => buildCalendarDays(year, i));
  }, [year]);

  // All days flat (for desktop grid)
  const allDaysInYear = useMemo(() => {
    const days: { date: string; month: string; monthIndex: number }[] = [];
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        days.push({ date, month: MONTH_NAMES[month], monthIndex: month });
      }
    }
    return days;
  }, [year]);

  // Cascading flip animation
  useEffect(() => {
    setAnimating(true);
    const maxDelay = journalEntries.length * 15;
    const timer = setTimeout(() => setAnimating(false), maxDelay + 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll mobile view to current month on mount
  useEffect(() => {
    if (currentMonthRef.current) {
      const headerHeight = 80; // sticky header height
      const elementTop = currentMonthRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementTop - headerHeight - 12, behavior: 'instant' });
    }
  }, []);

  // Fetch past card for drawer
  const selectedEntry = selectedDate ? journalEntries.find(e => e.date === selectedDate) : null;
  useEffect(() => {
    if (selectedDate && selectedEntry) {
      fetch(`/api/daily-card?seed=${selectedDate}`)
        .then(res => res.json())
        .then(data => setSelectedCard(data.card))
        .catch(err => console.error('Failed to load card:', err));
    }
  }, [selectedDate, selectedEntry]);

  const handleDayClick = (date: string, hasCard: boolean, isToday: boolean) => {
    if (!hasCard) return;
    if (window.innerWidth < 768) {
      if (isToday) {
        onDateClick(date);
        onNavigateToToday();
      } else {
        setSelectedDate(date);
        setDrawerOpen(true);
      }
    } else {
      onDateClick(date);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#172211] pt-6 md:pt-12">

      {/* Sticky header */}
      <div className="sticky top-14 md:top-20 z-20 bg-gradient-to-b from-[#172211] via-[#172211] to-[#172211]/0 pb-3 md:pb-8">
        <div className="text-center pt-3 md:pt-4 px-4 md:px-8">
          <h1
            className="text-2xl md:text-5xl text-[#CEF17B] mb-1"
            style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
          >
            {year}
          </h1>
          <p
            className="text-[#E1EEFC] text-sm md:text-lg opacity-70"
            style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
          >
            {daysWithCards} {daysWithCards === 1 ? 'day' : 'days'} drawn
          </p>
        </div>
      </div>

      {/* ── MOBILE: All 12 months, vertically scrollable ── */}
      <div className="md:hidden px-4 pb-16">
        {MONTH_NAMES.map((monthName, monthIndex) => {
          const isCurrentMonth = monthIndex === currentMonthIndex;
          const monthDays = allMonthCalendarDays[monthIndex];

          return (
            <div
              key={monthName}
              ref={isCurrentMonth ? currentMonthRef : undefined}
              className="mb-10"
              style={{ scrollMarginTop: '92px' }}
            >
              {/* Month name */}
              <h2
                className={`mb-3 ${isCurrentMonth ? 'text-[#CEF17B]' : 'text-[#CEF17B]/50'}`}
                style={{ fontFamily: 'var(--font-reenie-beanie), cursive', fontSize: '30px', lineHeight: 1 }}
              >
                {monthName}
              </h2>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-0.5">
                {WEEKDAYS.map(wd => (
                  <div
                    key={wd}
                    className="text-center text-[#CEF17B] opacity-35"
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-vt323), monospace',
                      letterSpacing: '0.04em',
                      paddingBottom: '4px'
                    }}
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Calendar day grid */}
              <div
                className="grid grid-cols-7 gap-0.5"
                role="grid"
                aria-label={`${monthName} ${year}`}
              >
                {monthDays.map(({ date, day, isCurrentMonth: isCurrMonth }) => {
                  const entry = isCurrMonth ? cardMap.get(date) : undefined;
                  const isToday = date === currentDate;
                  const hasCard = !!entry;
                  const isReversed = entry?.isReversed || false;
                  const cardData = entry ? cardLookup.get(entry.cardId) : null;

                  return (
                    <div
                      key={date}
                      role="gridcell"
                      className={`relative overflow-hidden rounded-sm aspect-[2/3] ${!isCurrMonth ? 'opacity-20' : ''} ${isToday ? 'ring-1 ring-[#CEF17B]' : ''}`}
                    >
                      <button
                        onClick={() => isCurrMonth && handleDayClick(date, hasCard, isToday)}
                        className={`w-full h-full relative block ${hasCard && isCurrMonth ? 'cursor-pointer active:opacity-75' : 'cursor-default'}`}
                        tabIndex={hasCard && isCurrMonth ? 0 : -1}
                        aria-label={
                          isCurrMonth
                            ? `${day} ${monthName}${isToday ? ', today' : ''}${hasCard ? `, ${isReversed ? 'reversed' : 'upright'} card` : ''}`
                            : undefined
                        }
                      >
                        {/* Card image fills the cell */}
                        {hasCard && cardData ? (
                          <div className={`absolute inset-0 ${isReversed ? 'rotate-180' : ''}`}>
                            <img
                              src={`/cards/${getCardFilename(entry!.cardId, cardData.name)}.png`}
                              alt={cardData.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          /* Empty cell */
                          <div className="absolute inset-0 bg-[#172211] border border-[#CEF17B]/10 rounded-sm" />
                        )}

                        {/* Date number overlay */}
                        <span
                          className={`absolute top-0.5 left-1 leading-none z-10 select-none ${
                            hasCard
                              ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                              : 'text-[#CEF17B]/30'
                          }`}
                          style={{ fontSize: '9px', fontFamily: 'var(--font-vt323), monospace' }}
                        >
                          {day}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: Flat year grid ── */}
      <div className="hidden md:block w-full max-w-[1600px] mx-auto px-12 lg:px-16 pb-8">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(28px,1fr))] gap-5 gap-y-8 justify-items-center items-end">
          {allDaysInYear.map((dayData) => {
            const { date, month } = dayData;
            const entry = cardMap.get(date);
            const isToday = date === currentDate;
            const hasCard = !!entry;
            const isReversed = entry?.isReversed || false;
            const dayOfMonth = parseInt(date.split('-')[2]);
            const isMonthStart = dayOfMonth === 1;
            const cardIndex = journalEntries.findIndex(e => e.date === date);
            const animationDelay = hasCard && cardIndex >= 0 ? cardIndex * 15 : 0;

            return (
              <div
                key={date}
                className="relative flex items-end"
                style={{ animationDelay: hasCard ? `${animationDelay}ms` : '0ms', height: 'clamp(36px, 5vw, 48px)' }}
              >
                {isMonthStart && (
                  <div
                    className="absolute -top-5 left-0 text-base text-[#CEF17B] whitespace-nowrap pointer-events-none"
                    style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                  >
                    {month.slice(0, 3).toLowerCase()}
                  </div>
                )}

                <button
                  onClick={() => handleDayClick(date, hasCard, isToday)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  aria-label={`${new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${hasCard ? (isReversed ? ', reversed' : ', upright') : ''}`}
                  className={`
                    relative transition-all duration-200
                    ${hasCard ? 'hover:scale-125 hover:z-30 cursor-pointer' : 'cursor-default'}
                    ${isToday ? 'scale-110 z-20' : 'z-0'}
                    ${hasCard && animating ? 'card-flip-enter' : ''}
                  `}
                  style={{
                    width: hasCard ? 'clamp(24px, 3.5vw, 32px)' : '2.5px',
                    height: hasCard ? '100%' : 'clamp(28px, 4vw, 36px)',
                    animationDelay: hasCard ? `${animationDelay}ms` : '0ms',
                    animationFillMode: 'backwards',
                  }}
                >
                  {hasCard && entry && cardLookup.get(entry.cardId) ? (
                    <>
                      <div className={isReversed ? 'rotate-180 w-full h-full' : 'w-full h-full'}>
                        <MiniTarotCard cardId={entry.cardId} cardName={cardLookup.get(entry.cardId)!.name} isToday={isToday} />
                      </div>
                      {isReversed && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          <svg viewBox="0 0 8 4" className="w-2 h-2 text-[#CEF17B]" opacity="0.6">
                            <path d="M 1 1 Q 4 3 7 1" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
                          </svg>
                        </div>
                      )}
                    </>
                  ) : (
                    <VerticalLine isToday={isToday} />
                  )}

                  {/* Hover tooltip */}
                  {hoveredDate === date && (
                    <div
                      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md bg-[#172211]/95 text-[#CEF17B] px-3 py-2 rounded-lg text-xl whitespace-nowrap z-50 shadow-lg border border-[#CEF17B]/30 pointer-events-none"
                      style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                    >
                      <div>
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()}
                      </div>
                      {hasCard && entry && (
                        <div className="text-xl">{isReversed ? '↻ reversed' : 'upright'}</div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom drawer — past card detail (mobile) */}
      {drawerOpen && selectedDate && selectedCard && selectedEntry && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-[#172211]/60 backdrop-blur-sm z-40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 bg-[#172211] rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto animate-slide-up border-t-2 border-[#CEF17B]/30"
            role="dialog"
            aria-modal="true"
            aria-label={`Card reading for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
          >
            <div className="sticky top-0 bg-[#172211] pt-4 pb-3 flex justify-center rounded-t-3xl z-10">
              <div className="w-12 h-1.5 bg-[#CEF17B]/40 rounded-full" />
            </div>

            <div className="px-4 pb-6 pt-2">
              <div className="text-center mb-4">
                <p
                  className="text-[#CEF17B] text-xl tracking-wider"
                  style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                >
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                  }).toLowerCase()}
                </p>
              </div>

              <div className="max-w-[280px] mx-auto mb-4">
                <TarotCard card={selectedCard} isReversed={selectedEntry.isReversed || false} isRevealed={true} />
              </div>

              {(() => {
                const reflection = localStorage.getItem(`reflection-${selectedDate}`);
                if (reflection && reflection.trim()) {
                  return (
                    <div className="mt-4 max-w-sm mx-auto">
                      <h3
                        className="text-3xl text-[#CEF17B] mb-2"
                        style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                      >
                        reflection
                      </h3>
                      <div
                        className="bg-[#172211] border-2 border-[#CEF17B]/20 rounded-xl p-4 text-[#E1EEFC] text-2xl leading-relaxed"
                        style={{ fontFamily: 'var(--font-reenie-beanie), cursive' }}
                      >
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
