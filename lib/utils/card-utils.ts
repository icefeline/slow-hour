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
 * The same date + birthdate combination will always return the same card and orientation
 * Returns from the full 78-card tarot deck
 */
export function getCardForDate(dateString: string, birthdate?: string): { card: TarotCard; isReversed: boolean } {
  // Use the full tarot deck (all 78 cards)
  const fullDeck = tarotDeck;

  // Create a unique seed that combines date and birthdate for personalized readings
  const baseSeed = birthdate ? `${dateString}-${birthdate}` : dateString;

  // Use combined seed for card selection
  const cardSeed = seededRandom(baseSeed + '-card');
  const cardIndex = Math.floor(cardSeed * fullDeck.length);

  // Use combined seed for orientation (50% chance of reversed)
  const orientationSeed = seededRandom(baseSeed + '-orientation');
  const isReversed = orientationSeed > 0.5;

  return {
    card: fullDeck[cardIndex],
    isReversed
  };
}

/**
 * Get today's card (personalized based on user's birthdate if available)
 */
export function getTodaysCard(): { card: TarotCard; isReversed: boolean } {
  const today = getTodayDateString();

  // Get user's birthdate from localStorage if available (client-side only)
  let birthdate: string | undefined;
  if (typeof window !== 'undefined') {
    birthdate = localStorage.getItem('userBirthdate') || undefined;
  }

  return getCardForDate(today, birthdate);
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
