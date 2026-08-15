/**
 * Sunrise, sunset and the moon, for the reading page's margin column.
 *
 * Server-side only. Sunrise and sunset need coordinates, and the only place the
 * reader's coordinates exist is inside the natal chart the transit route has
 * already cast — geocoding is done there, so nothing is looked up twice and
 * astronomy-engine never has to reach the browser bundle for a percentage.
 *
 * SPEC §1.6: numbers must be real. Every field here is null when it cannot be
 * computed, and the page leaves the row out rather than printing a zero.
 */

import * as Astronomy from 'astronomy-engine';
import type { SkyReadout } from './card-readout';

/** Nominatim's "we couldn't geocode that" sentinel — a point in the Atlantic. */
function isUnlocated(latitude: number, longitude: number): boolean {
  return latitude === 0 && longitude === 0;
}

/**
 * The sky for a given instant at a given place.
 *
 * Rise and set are searched from the start of that place's day rather than from
 * `at`, so a card drawn in the evening still reports the morning's sunrise
 * instead of tomorrow's. The zone is passed straight through so the page can
 * print those two times on the clock they actually happened on. The search window is two days: at high latitudes the
 * sun may not cross the horizon at all, and SearchRiseSet correctly returns null
 * there rather than inventing a time.
 */
export function skyFor(
  at: Date,
  latitude: number,
  longitude: number,
  zone: string | null,
): SkyReadout {
  const moon = moonFor(at);

  if (isUnlocated(latitude, longitude)) {
    return { sunrise: null, sunset: null, zone: null, ...moon };
  }

  try {
    const observer = new Astronomy.Observer(latitude, longitude, 0);
    const dayStart = new Date(at);
    dayStart.setHours(0, 0, 0, 0);

    const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dayStart, 2);
    const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, dayStart, 2);

    return {
      sunrise: rise ? rise.date.toISOString() : null,
      sunset: set ? set.date.toISOString() : null,
      zone,
      ...moon,
    };
  } catch {
    return { sunrise: null, sunset: null, zone: null, ...moon };
  }
}

/**
 * Illuminated fraction and which way it is heading.
 *
 * MoonPhase returns the elongation in degrees: 0 is new, 180 is full, so
 * everything under 180 is waxing and everything over it is waning. The
 * percentage comes from the phase angle rather than from a separate
 * illumination call, which keeps the number and the direction consistent with
 * each other at the edges.
 */
function moonFor(at: Date): Pick<SkyReadout, 'moonIllumination' | 'moonDirection'> {
  try {
    const elongation = Astronomy.MoonPhase(at);
    const illumination = (1 - Math.cos((elongation * Math.PI) / 180)) / 2;
    return {
      moonIllumination: Math.round(illumination * 100),
      moonDirection: elongation < 180 ? 'waxing' : 'waning',
    };
  } catch {
    return { moonIllumination: null, moonDirection: null };
  }
}
