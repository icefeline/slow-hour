/**
 * Real Astrology Calculator using Astronomy Engine
 *
 * Calculates natal chart positions and current transits for users based on their
 * birth data (date, time, location).
 */

import * as Astronomy from 'astronomy-engine';
import type { ActiveTransit, UserChart, House, Planet, AspectType, TransitPhase } from '../types/astrology';
import { cardPlanetAffinity } from '../data/insight-structure-templates';

// Planet bodies in Astronomy Engine
const PLANET_BODIES = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

// Aspect orbs (degrees) - made more lenient to ensure we find transits
const ASPECT_ORBS = {
  conjunction: 10,
  opposition: 10,
  square: 8,
  trine: 8,
  sextile: 6,
};

/**
 * Calculate planetary positions for a given date
 */
function calculatePlanetaryPositions(date: Date, observer?: Astronomy.Observer): Record<Planet, number> {
  const positions: Partial<Record<Planet, number>> = {};

  // Convert Date to AstroTime
  const astroTime = new Astronomy.AstroTime(date);

  // Use default observer (geocentric) if not provided
  const obs = observer || new Astronomy.Observer(0, 0, 0);

  for (const [planetName, planetBody] of Object.entries(PLANET_BODIES)) {
    try {
      // Get equatorial coordinates for the planet
      const equatorial = Astronomy.Equator(planetBody as Astronomy.Body, astroTime, obs, true, true);

      // Convert to ecliptic coordinates
      const ecliptic = Astronomy.Ecliptic(equatorial.vec);

      // Normalize longitude to 0-360 degrees
      let lon = ecliptic.elon;
      while (lon < 0) lon += 360;
      while (lon >= 360) lon -= 360;

      positions[planetName as Planet] = lon;
    } catch (error) {
      console.error(`Failed to calculate position for ${planetName}:`, error);
    }
  }

  return positions as Record<Planet, number>;
}

/**
 * Calculate house cusps using simple equal house system
 * (Placidus would require more complex calculations)
 */
function calculateHouses(date: Date, latitude: number, longitude: number): { houses: number[]; ascendant: number } {
  try {
    // Convert Date to AstroTime
    const astroTime = new Astronomy.AstroTime(date);

    // Get local sidereal time in degrees
    const lst = Astronomy.SiderealTime(astroTime) * 15; // Convert hours to degrees

    // Calculate ascendant (simplified)
    // In reality, this requires obliquity of ecliptic and more complex math
    // For now, using a simplified calculation
    const ascendant = (lst + longitude) % 360;

    // Equal house system: divide ecliptic into 12 equal 30° segments starting from ascendant
    const houses: number[] = [];
    for (let i = 0; i < 12; i++) {
      houses.push((ascendant + i * 30) % 360);
    }

    return {
      houses,
      ascendant
    };
  } catch (error) {
    console.error('Failed to calculate houses:', error);
    // Return default houses if calculation fails
    const houses = Array.from({ length: 12 }, (_, i) => i * 30);
    return {
      houses,
      ascendant: 0
    };
  }
}

/**
 * Calculate the angle between two planetary positions
 */
function calculateAngle(pos1: number, pos2: number): number {
  let angle = Math.abs(pos1 - pos2);

  // Normalize to 0-180 degrees
  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

/**
 * Determine aspect type based on angle
 */
function getAspectType(angle: number): AspectType | null {
  const aspects: Array<{ type: AspectType; degrees: number; orb: number }> = [
    { type: 'conjunction', degrees: 0, orb: ASPECT_ORBS.conjunction },
    { type: 'sextile', degrees: 60, orb: ASPECT_ORBS.sextile },
    { type: 'square', degrees: 90, orb: ASPECT_ORBS.square },
    { type: 'trine', degrees: 120, orb: ASPECT_ORBS.trine },
    { type: 'opposition', degrees: 180, orb: ASPECT_ORBS.opposition },
  ];

  for (const aspect of aspects) {
    const diff = Math.abs(angle - aspect.degrees);
    if (diff <= aspect.orb) {
      return aspect.type;
    }
  }

  return null;
}

/**
 * Determine which house a planet is in
 */
function getHouseForPlanet(planetPosition: number, houseCusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];

    // Handle wrap-around at 360/0 degrees
    if (nextCusp < currentCusp) {
      if (planetPosition >= currentCusp || planetPosition < nextCusp) {
        return i + 1;
      }
    } else {
      if (planetPosition >= currentCusp && planetPosition < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1; // Default to 1st house if calculation fails
}

/**
 * Determine transit phase based on orb
 */
function getTransitPhase(orb: number): TransitPhase {
  if (orb < 1) return 'peak';
  if (orb < 3) return 'approaching';
  return 'beginning';
}

/**
 * Determine zodiac sign from ecliptic longitude
 */
function getZodiacSign(degrees: number): any {
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  return signs[Math.floor(degrees / 30)];
}

/**
 * Geocode location to latitude/longitude using Nominatim (OpenStreetMap)
 * Free, no API key required. Used server-side only.
 */
async function geocodeLocation(location: string): Promise<{ latitude: number; longitude: number; timezone: string }> {
  try {
    const encoded = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SlowHourTarotApp/1.0 (daily tarot readings)',
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        timezone: 'UTC'
      };
    }

    console.warn(`Could not geocode "${location}" via Nominatim. Using equatorial default.`);
    return { latitude: 0, longitude: 0, timezone: 'UTC' };
  } catch (error) {
    console.error('Geocoding failed:', error);
    return { latitude: 0, longitude: 0, timezone: 'UTC' };
  }
}

/**
 * Calculate natal chart from birth data
 */
export async function calculateNatalChart(
  birthDate: Date,
  birthTime?: string,
  birthLocation?: string
): Promise<UserChart | null> {
  try {
    // Geocode location if provided
    const location = birthLocation
      ? await geocodeLocation(birthLocation)
      : { latitude: 0, longitude: 0, timezone: 'UTC' };

    // Parse birth time
    let birthDateTime = new Date(birthDate);
    if (birthTime) {
      const [hours, minutes] = birthTime.split(':').map(Number);
      birthDateTime.setHours(hours, minutes, 0, 0);
    } else {
      // Default to noon if no time provided
      birthDateTime.setHours(12, 0, 0, 0);
    }

    // Create observer for location
    const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);

    // Calculate planetary positions
    const positions = calculatePlanetaryPositions(birthDateTime, observer);

    // Calculate houses
    const { houses: houseCusps, ascendant } = calculateHouses(birthDateTime, location.latitude, location.longitude);

    // Build houses array with themes
    const houseThemes = [
      'self & identity', 'values & resources', 'communication & learning',
      'home & foundation', 'creativity & pleasure', 'health & service',
      'relationships & partnerships', 'transformation & shared resources',
      'philosophy & travel', 'career & public life', 'community & hopes',
      'subconscious & spirituality'
    ];

    const houses: House[] = houseCusps.map((cusp, i) => ({
      number: i + 1,
      sign: getZodiacSign(cusp),
      theme: houseThemes[i]
    }));

    return {
      sunSign: getZodiacSign(positions.sun),
      moonSign: getZodiacSign(positions.moon),
      risingSign: getZodiacSign(ascendant),
      birthDate,
      birthTime: birthTime || '12:00',
      birthLocation: location,
      houses
    };
  } catch (error) {
    console.error('Failed to calculate natal chart:', error);
    return null;
  }
}

/**
 * Calculate current active transits for a user
 */
export async function calculateActiveTransits(
  natalChart: UserChart,
  currentDate: Date = new Date()
): Promise<ActiveTransit[]> {
  try {
    // Create observer for location
    const observer = new Astronomy.Observer(
      natalChart.birthLocation.latitude,
      natalChart.birthLocation.longitude,
      0
    );

    // Get current planetary positions
    const currentPositions = calculatePlanetaryPositions(currentDate, observer);

    // Get natal planetary positions
    let natalDateTime = new Date(natalChart.birthDate);
    if (natalChart.birthTime) {
      const [hours, minutes] = natalChart.birthTime.split(':').map(Number);
      natalDateTime.setHours(hours, minutes, 0, 0);
    }
    const natalPositions = calculatePlanetaryPositions(natalDateTime, observer);

    // Get house cusps
    const { houses: houseCusps } = calculateHouses(
      currentDate,
      natalChart.birthLocation.latitude,
      natalChart.birthLocation.longitude
    );

    const transits: ActiveTransit[] = [];

    // Check each transiting planet against each natal planet
    // Include more transiting planets to ensure we find at least one transit
    const transitingPlanets: Planet[] = ['saturn', 'jupiter', 'uranus', 'neptune', 'pluto', 'mars'];
    const natalPlanets: Planet[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter'];

    for (const transitingPlanet of transitingPlanets) {
      const transitPos = currentPositions[transitingPlanet];

      for (const natalPlanet of natalPlanets) {
        const natalPos = natalPositions[natalPlanet];

        // Calculate angle between planets
        const angle = calculateAngle(transitPos, natalPos);
        const aspectType = getAspectType(angle);

        if (aspectType) {
          // Calculate orb (difference from exact aspect)
          const exactAspectDegrees = aspectType === 'conjunction' ? 0
            : aspectType === 'sextile' ? 60
            : aspectType === 'square' ? 90
            : aspectType === 'trine' ? 120
            : 180;

          const orb = Math.abs(angle - exactAspectDegrees);

          // Determine which house is being activated
          const house = getHouseForPlanet(natalPos, houseCusps);

          // Determine transit phase
          const phase = getTransitPhase(orb);

          // Determine intensity (outer planets = high, inner = medium/low)
          const intensity = ['pluto', 'saturn', 'uranus'].includes(transitingPlanet) ? 'high' : 'medium';

          // Create transit ID
          const id = `transit-${transitingPlanet}-${aspectType}-${natalPlanet}-${currentDate.toISOString().split('T')[0]}`;

          transits.push({
            id,
            name: `${transitingPlanet} ${aspectType} ${natalPlanet}`,
            transitingPlanet,
            natalPlanet,
            aspect: aspectType,
            house,
            startDate: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // Approximate
            exactDate: currentDate,
            endDate: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000), // Approximate
            phase,
            orb,
            intensity
          });
        }
      }
    }

    // Sort by orb only (closest aspects first) - removed intensity sorting
    // This ensures all planets are available for selection, not just outer planets
    transits.sort((a, b) => a.orb - b.orb);

    return transits;
  } catch (error) {
    console.error('Failed to calculate active transits:', error);
    return [];
  }
}

/**
 * Get the most relevant transit for the drawn card.
 * Uses card-planet affinity to weight toward thematically resonant transits.
 * Falls back to tightest orb if no affinity match is active.
 */
export function getDominantTransit(
  transits: ActiveTransit[],
  seed: number = Math.random(),
  cardId?: string
): ActiveTransit | null {
  if (transits.length === 0) return null;

  const affinity = cardId ? cardPlanetAffinity[cardId] : null;

  const weights = transits.map((t, i) => {
    // Base weight: tighter orb = stronger signal
    let weight = Math.max(1, 10 - t.orb);

    if (affinity) {
      // Planet affinity: first in list gets highest boost
      const planetRank = affinity.planets.indexOf(t.transitingPlanet);
      if (planetRank !== -1) {
        weight += (affinity.planets.length - planetRank) * 6;
      }

      // Aspect affinity: matching aspect types get a bump
      if (affinity.aspects.includes(t.aspect)) {
        weight += 3;
      }
    }

    // Small deterministic noise so the same card doesn't always pick
    // the exact same transit when multiple affinity matches exist
    const noise = Math.sin(seed * 1000 + i) * 1.5;
    return Math.max(0.5, weight + noise);
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = (seed * totalWeight) % totalWeight;

  for (let i = 0; i < transits.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return transits[i];
    }
  }

  return transits[0];
}
