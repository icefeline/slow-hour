/**
 * Classical Jyotish mechanics.
 *
 * The transit engine this sits beside is a Western one wearing sidereal
 * coordinates: it aspects Uranus, Neptune and Pluto — bodies Jyotish does not
 * use — through Western orbs, and because the outer planets crawl, the same two
 * or three of them were the answer nearly every day. This module supplies what
 * a Vedic reading actually turns on: the nine grahas including Rahu and Ketu,
 * the Vimshottari dasha the chart is living through, graha drishti, gochara
 * from the natal Moon, and dignity.
 *
 * Everything here is sign- and longitude-based and deterministic — no model is
 * involved in deciding what is active, only in writing it up afterwards.
 */

import type { ZodiacSign } from '../types/astrology';

export type Graha =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'rahu' | 'ketu';

export const GRAHAS: Graha[] = [
  'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu',
];

const SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const norm360 = (d: number) => ((d % 360) + 360) % 360;

export const signIndexOf = (longitude: number) => Math.floor(norm360(longitude) / 30);
export const signOf = (longitude: number): ZodiacSign => SIGNS[signIndexOf(longitude)];

/** 1–12, counting the `from` sign itself as 1 — how Jyotish counts everything. */
export function houseFrom(fromLongitude: number, toLongitude: number): number {
  return ((signIndexOf(toLongitude) - signIndexOf(fromLongitude) + 12) % 12) + 1;
}

// ── Rahu and Ketu ─────────────────────────────────────────────────────────────

/**
 * Mean longitude of the Moon's ascending node, tropical, in degrees.
 *
 * Jyotish works with the mean node rather than the true one — the classical
 * tables are mean-node tables, and the true node's wobble (up to ~1.5°) would
 * flicker Rahu across a nakshatra boundary and back within a fortnight.
 *
 * Standard series (Meeus, Astronomical Algorithms, ch. 47), T in Julian
 * centuries from J2000.
 */
export function meanLunarNode(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  return norm360(
    125.0445479
    - 1934.1362891 * T
    + 0.0020754 * T * T
    + (T * T * T) / 467441
    - (T * T * T * T) / 60616000,
  );
}

/** Rahu and Ketu as sidereal longitudes. Ketu is always exactly opposite. */
export function nodePositions(date: Date, ayanamsa: number): { rahu: number; ketu: number } {
  const rahu = norm360(meanLunarNode(date) - ayanamsa);
  return { rahu, ketu: norm360(rahu + 180) };
}

// ── Vimshottari dasha ─────────────────────────────────────────────────────────

/** Lords in order, with their period lengths in years. The cycle totals 120. */
const DASHA_SEQUENCE: Array<{ lord: Graha; years: number }> = [
  { lord: 'ketu', years: 7 },
  { lord: 'venus', years: 20 },
  { lord: 'sun', years: 6 },
  { lord: 'moon', years: 10 },
  { lord: 'mars', years: 7 },
  { lord: 'rahu', years: 18 },
  { lord: 'jupiter', years: 16 },
  { lord: 'saturn', years: 19 },
  { lord: 'mercury', years: 17 },
];

const DASHA_TOTAL_YEARS = 120;
const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;
const NAKSHATRA_SPAN = 360 / 27;

export interface DashaPeriod {
  lord: Graha;
  start: Date;
  end: Date;
}

export interface DashaState {
  /** The running mahadasha — the decade-scale chapter. */
  maha: DashaPeriod;
  /** The antardasha (bhukti) inside it — the sub-chapter, months to a couple of years. */
  antar: DashaPeriod;
  /** 0–1 through the mahadasha, for "just begun" vs "closing out" phrasing. */
  mahaProgress: number;
  /** 0–1 through the antardasha. */
  antarProgress: number;
  /** Years left in the mahadasha. */
  mahaYearsRemaining: number;
}

/**
 * The Vimshottari sequence from birth.
 *
 * The first mahadasha is the janma nakshatra's lord, and it is already partly
 * spent at birth: the fraction of the nakshatra the Moon has crossed is the
 * fraction of that period already gone. Everything after follows the fixed
 * order. Without this balance the whole timeline is wrong by up to 20 years,
 * which is why a dasha cannot be faked from the birth year alone.
 */
export function vimshottariTimeline(moonLongitude: number, birthInstant: Date): DashaPeriod[] {
  const nakshatraIndex = Math.floor(norm360(moonLongitude) / NAKSHATRA_SPAN);
  const intoNakshatra = (norm360(moonLongitude) % NAKSHATRA_SPAN) / NAKSHATRA_SPAN;

  const startIndex = nakshatraIndex % 9;
  const first = DASHA_SEQUENCE[startIndex];

  const periods: DashaPeriod[] = [];
  // Wind back to where the first period would have begun, so the elapsed
  // portion at birth falls out of the arithmetic rather than being special-cased.
  let cursor = new Date(birthInstant.getTime() - first.years * intoNakshatra * YEAR_MS);

  // Two full cycles covers any lifetime from any starting point.
  for (let i = 0; i < DASHA_SEQUENCE.length * 2; i++) {
    const { lord, years } = DASHA_SEQUENCE[(startIndex + i) % DASHA_SEQUENCE.length];
    const end = new Date(cursor.getTime() + years * YEAR_MS);
    periods.push({ lord, start: cursor, end });
    cursor = end;
  }
  return periods;
}

/**
 * Antardashas within a mahadasha.
 *
 * Each sub-period is (sub lord's years / 120) of the mahadasha, running in the
 * same fixed order but starting from the mahadasha's own lord.
 */
export function antardashas(maha: DashaPeriod): DashaPeriod[] {
  const mahaYears = DASHA_SEQUENCE.find(d => d.lord === maha.lord)!.years;
  const startIndex = DASHA_SEQUENCE.findIndex(d => d.lord === maha.lord);

  const periods: DashaPeriod[] = [];
  let cursor = maha.start;
  for (let i = 0; i < DASHA_SEQUENCE.length; i++) {
    const sub = DASHA_SEQUENCE[(startIndex + i) % DASHA_SEQUENCE.length];
    const years = (mahaYears * sub.years) / DASHA_TOTAL_YEARS;
    const end = new Date(cursor.getTime() + years * YEAR_MS);
    periods.push({ lord: sub.lord, start: cursor, end });
    cursor = end;
  }
  return periods;
}

/** Which mahadasha and antardasha are running on `when`. */
export function dashaAt(moonLongitude: number, birthInstant: Date, when: Date): DashaState | null {
  const timeline = vimshottariTimeline(moonLongitude, birthInstant);
  const maha = timeline.find(p => when >= p.start && when < p.end);
  if (!maha) return null;

  const subs = antardashas(maha);
  const antar = subs.find(p => when >= p.start && when < p.end) ?? subs[0];

  const span = (p: DashaPeriod) => p.end.getTime() - p.start.getTime();
  return {
    maha,
    antar,
    mahaProgress: (when.getTime() - maha.start.getTime()) / span(maha),
    antarProgress: (when.getTime() - antar.start.getTime()) / span(antar),
    mahaYearsRemaining: (maha.end.getTime() - when.getTime()) / YEAR_MS,
  };
}

// ── Graha drishti ─────────────────────────────────────────────────────────────

/**
 * Which houses ahead of itself a graha looks at, counting its own as 1.
 *
 * Every graha aspects the 7th. Mars additionally takes the 4th and 8th, Jupiter
 * the 5th and 9th, Saturn the 3rd and 10th. The nodes are given Jupiter's
 * pattern, which is the more common modern reading. These are whole-sign
 * glances, not orb-based Western aspects — a graha either looks at a sign or
 * it does not.
 */
const DRISHTI: Record<Graha, number[]> = {
  sun: [7],
  moon: [7],
  mercury: [7],
  venus: [7],
  mars: [4, 7, 8],
  jupiter: [5, 7, 9],
  saturn: [3, 7, 10],
  rahu: [5, 7, 9],
  ketu: [5, 7, 9],
};

/** True when `graha` at `fromLongitude` casts drishti onto `ontoLongitude`. */
export function hasDrishti(graha: Graha, fromLongitude: number, ontoLongitude: number): boolean {
  return DRISHTI[graha].includes(houseFrom(fromLongitude, ontoLongitude));
}

// ── Gochara ───────────────────────────────────────────────────────────────────

/**
 * Classical gochara counts a transit from the janma rashi, not from the lagna,
 * and each graha has positions from the Moon where it is held to do well or
 * badly. This is the transit doctrine Jyotish actually uses — the reason
 * sade sati (Saturn over the 12th, 1st and 2nd from the Moon) is the transit
 * everyone knows by name.
 */
const GOCHARA_FAVOURABLE: Record<Graha, number[]> = {
  sun: [3, 6, 10, 11],
  moon: [1, 3, 6, 7, 10, 11],
  mercury: [2, 4, 6, 8, 10, 11],
  venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  mars: [3, 6, 11],
  jupiter: [2, 5, 7, 9, 11],
  saturn: [3, 6, 11],
  rahu: [3, 6, 10, 11],
  ketu: [3, 6, 11],
};

export interface GocharaPosition {
  graha: Graha;
  /** 1–12 from the janma rashi. */
  houseFromMoon: number;
  favourable: boolean;
}

export function gochara(
  transitPositions: Partial<Record<Graha, number>>,
  natalMoonLongitude: number,
): GocharaPosition[] {
  return GRAHAS.flatMap(graha => {
    const longitude = transitPositions[graha];
    if (longitude === undefined) return [];
    const house = houseFrom(natalMoonLongitude, longitude);
    return [{
      graha,
      houseFromMoon: house,
      favourable: GOCHARA_FAVOURABLE[graha].includes(house),
    }];
  });
}

/** Saturn over the 12th, 1st or 2nd from the Moon — the seven-and-a-half years. */
export function sadeSatiPhase(saturnLongitude: number, natalMoonLongitude: number): string | null {
  switch (houseFrom(natalMoonLongitude, saturnLongitude)) {
    case 12: return 'rising';
    case 1: return 'peak';
    case 2: return 'setting';
    default: return null;
  }
}

// ── Dignity ───────────────────────────────────────────────────────────────────

/** Sign indices a graha owns. The nodes own none. */
const OWN_SIGNS: Record<Graha, number[]> = {
  sun: [4], moon: [3], mercury: [2, 5], venus: [1, 6],
  mars: [0, 7], jupiter: [8, 11], saturn: [9, 10], rahu: [], ketu: [],
};

/** Exaltation sign per graha; debilitation is the opposite sign. */
const EXALTATION: Partial<Record<Graha, number>> = {
  sun: 0, moon: 1, mercury: 5, venus: 11, mars: 9, jupiter: 3, saturn: 6,
};

export type Dignity = 'exalted' | 'debilitated' | 'own sign' | 'neutral';

export function dignityOf(graha: Graha, longitude: number): Dignity {
  const sign = signIndexOf(longitude);
  const exalt = EXALTATION[graha];
  if (exalt !== undefined) {
    if (sign === exalt) return 'exalted';
    if (sign === (exalt + 6) % 12) return 'debilitated';
  }
  if (OWN_SIGNS[graha].includes(sign)) return 'own sign';
  return 'neutral';
}

/**
 * Combustion — too close to the Sun to act freely (astangata). The Moon is
 * excluded: its conjunction with the Sun is the new moon, read as a phase
 * rather than as a graha being burnt.
 */
const COMBUSTION_ORB: Partial<Record<Graha, number>> = {
  mercury: 14, venus: 10, mars: 17, jupiter: 11, saturn: 15,
};

export function isCombust(graha: Graha, longitude: number, sunLongitude: number): boolean {
  const orb = COMBUSTION_ORB[graha];
  if (orb === undefined) return false;
  const separation = Math.abs(norm360(longitude - sunLongitude + 180) - 180);
  return separation <= orb;
}

// ── Navamsa ───────────────────────────────────────────────────────────────────

/**
 * The D9 sign for a longitude.
 *
 * The 108 navamsas run continuously from 0° Aries, 3°20' each, cycling through
 * the signs — which reproduces the classical rule exactly: a movable sign's
 * navamsas start from itself, a fixed sign's from the 9th, a dual sign's from
 * the 5th. The navamsa is the second chart every Jyotishi reads; a graha strong
 * in the rashi but fallen in the navamsa promises more than it delivers.
 */
export function navamsaSign(longitude: number): ZodiacSign {
  return SIGNS[Math.floor(norm360(longitude) / (30 / 9)) % 12];
}
