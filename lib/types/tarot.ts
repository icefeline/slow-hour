export type Suite = 'major' | 'cups' | 'wands' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  name: string;
  suite: Suite;
  number?: number;
  uprightMeaning: string;
  reversedMeaning: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  description: string;
  imagePath: string;
}

export interface DailyReading {
  date: string; // ISO date string
  card: TarotCard;
  isReversed: boolean;
  journalEntry?: string;
  reflection?: string;
}

export interface ReadingHistory {
  readings: DailyReading[];
}
