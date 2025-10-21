import { tarotDeck } from '../data/tarot-deck';
import { TarotCard, DailyReading } from '../types/tarot';

/**
 * Generate a seeded random number based on a date
 * This ensures the same date always produces the same "random" result
 */
export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to a number between 0 and 1
  return Math.abs(Math.sin(hash) * 10000) % 1;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get a specific card by date (deterministic)
 * The same date will always return the same card and orientation
 * Only returns Major Arcana cards (first 22 cards)
 */
export function getCardForDate(dateString: string): { card: TarotCard; isReversed: boolean } {
  // Filter to only Major Arcana cards
  const majorArcana = tarotDeck.filter(card => card.suite === 'major');

  // Use date as seed for card selection
  const cardSeed = seededRandom(dateString + '-card');
  const cardIndex = Math.floor(cardSeed * majorArcana.length);

  // Use date as seed for orientation (50% chance of reversed)
  const orientationSeed = seededRandom(dateString + '-orientation');
  const isReversed = orientationSeed > 0.5;

  return {
    card: majorArcana[cardIndex],
    isReversed
  };
}

/**
 * Get today's card
 */
export function getTodaysCard(): { card: TarotCard; isReversed: boolean } {
  const today = getTodayDateString();
  return getCardForDate(today);
}

/**
 * Get the active meaning based on orientation
 */
export function getActiveMeaning(card: TarotCard, isReversed: boolean): string {
  return isReversed ? card.reversedMeaning : card.uprightMeaning;
}

/**
 * Get active keywords based on orientation
 */
export function getActiveKeywords(card: TarotCard, isReversed: boolean): string[] {
  return isReversed ? card.reversedKeywords : card.uprightKeywords;
}

/**
 * Format suite name for display
 */
export function formatSuite(suite: string): string {
  if (suite === 'major') return 'Major Arcana';
  return suite.charAt(0).toUpperCase() + suite.slice(1);
}
