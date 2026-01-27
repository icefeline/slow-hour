export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type Planet =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

export type AspectType =
  | 'conjunction'    // 0°
  | 'sextile'        // 60°
  | 'square'         // 90°
  | 'trine'          // 120°
  | 'opposition';    // 180°

export type TransitPhase =
  | 'beginning'      // Transit just started, orb > 5°
  | 'approaching'    // Getting closer, orb 3-5°
  | 'peak'           // Exact or very close, orb < 1°
  | 'separating'     // Moving away, orb 1-3°
  | 'integration';   // Final phase, orb 3-5° separating

export interface House {
  number: number;      // 1-12
  sign: ZodiacSign;
  theme: string;       // e.g., "self & identity", "relationships", "career"
}

export interface UserChart {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  birthDate: Date;
  birthTime: string;
  birthLocation: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  houses: House[];
}

export interface ActiveTransit {
  id: string;
  name: string;                    // e.g., "Saturn opposite Moon"
  transitingPlanet: Planet;
  natalPlanet: Planet;
  aspect: AspectType;
  house: number;                   // which house is being activated (1-12)
  startDate: Date;
  exactDate: Date;                 // peak intensity
  endDate: Date;
  phase: TransitPhase;
  orb: number;                     // degrees from exact
  intensity: 'low' | 'medium' | 'high';  // based on planet importance + orb
}

export interface DailyTransitContext {
  dominantTransit: ActiveTransit;
  supportingTransits: ActiveTransit[];
}

export interface CardDraw {
  id: string;
  cardId: string;
  cardName: string;
  date: Date;
  transitId: string;               // which transit triggered this card
  insightTypes: string[];          // which insight templates were used
  journalEntry?: string;
}

export interface DrawContext {
  currentDraw: CardDraw;
  transitDrawHistory: CardDraw[]; // all draws during this specific transit
  drawCount: number;               // times THIS card was drawn during this transit
  lastDrawnDate?: Date;
  daysSinceLastDraw?: number;
  daysIntoTransit: number;         // how many days since transit started
}
