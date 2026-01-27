import type { UserChart, ActiveTransit, House, DailyTransitContext } from '../types/astrology';

// Mock user chart for testing
export const mockUserChart: UserChart = {
  sunSign: 'cancer',
  moonSign: 'pisces',
  risingSign: 'virgo',
  birthDate: new Date('1990-07-15'),
  birthTime: '14:30',
  birthLocation: {
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York'
  },
  houses: [
    { number: 1, sign: 'virgo', theme: 'self & identity' },
    { number: 2, sign: 'libra', theme: 'values & resources' },
    { number: 3, sign: 'scorpio', theme: 'communication & learning' },
    { number: 4, sign: 'sagittarius', theme: 'home & foundation' },
    { number: 5, sign: 'capricorn', theme: 'creativity & pleasure' },
    { number: 6, sign: 'aquarius', theme: 'health & service' },
    { number: 7, sign: 'pisces', theme: 'relationships & partnerships' },
    { number: 8, sign: 'aries', theme: 'transformation & shared resources' },
    { number: 9, sign: 'taurus', theme: 'philosophy & travel' },
    { number: 10, sign: 'gemini', theme: 'career & public life' },
    { number: 11, sign: 'cancer', theme: 'community & hopes' },
    { number: 12, sign: 'leo', theme: 'subconscious & spirituality' }
  ]
};

// Mock active transits for different scenarios
export const mockTransits = {
  // Pluto square Moon - intense emotional transformation
  plutoSquareMoon: {
    id: 'transit-pluto-square-moon-2026-01',
    name: 'Pluto square Moon',
    transitingPlanet: 'pluto' as const,
    natalPlanet: 'moon' as const,
    aspect: 'square' as const,
    house: 4,
    startDate: new Date('2026-01-01'),
    exactDate: new Date('2026-02-15'),
    endDate: new Date('2026-04-30'),
    phase: 'approaching' as const,
    orb: 3.2,
    intensity: 'high' as const
  } as ActiveTransit,

  // Saturn opposite Sun - identity crisis/restructuring
  saturnOppositeSun: {
    id: 'transit-saturn-opposite-sun-2026-01',
    name: 'Saturn opposite Sun',
    transitingPlanet: 'saturn' as const,
    natalPlanet: 'sun' as const,
    aspect: 'opposition' as const,
    house: 10,
    startDate: new Date('2025-12-10'),
    exactDate: new Date('2026-01-20'),
    endDate: new Date('2026-03-15'),
    phase: 'peak' as const,
    orb: 0.8,
    intensity: 'high' as const
  } as ActiveTransit,

  // Uranus conjunction Venus - sudden changes in relationships/values
  uranusConjunctionVenus: {
    id: 'transit-uranus-conjunction-venus-2026-01',
    name: 'Uranus conjunction Venus',
    transitingPlanet: 'uranus' as const,
    natalPlanet: 'venus' as const,
    aspect: 'conjunction' as const,
    house: 7,
    startDate: new Date('2026-01-05'),
    exactDate: new Date('2026-02-28'),
    endDate: new Date('2026-05-10'),
    phase: 'beginning' as const,
    orb: 6.5,
    intensity: 'medium' as const
  } as ActiveTransit,

  // Neptune trine Moon - spiritual/emotional dissolution
  neptuneTrineMoon: {
    id: 'transit-neptune-trine-moon-2026-01',
    name: 'Neptune trine Moon',
    transitingPlanet: 'neptune' as const,
    natalPlanet: 'moon' as const,
    aspect: 'trine' as const,
    house: 12,
    startDate: new Date('2025-11-20'),
    exactDate: new Date('2026-01-10'),
    endDate: new Date('2026-03-25'),
    phase: 'separating' as const,
    orb: 2.1,
    intensity: 'medium' as const
  } as ActiveTransit,

  // Mercury retrograde (supporting transit example)
  mercuryRetrograde: {
    id: 'transit-mercury-rx-2026-01',
    name: 'Mercury retrograde in 3rd house',
    transitingPlanet: 'mercury' as const,
    natalPlanet: 'mercury' as const,
    aspect: 'conjunction' as const,
    house: 3,
    startDate: new Date('2026-01-15'),
    exactDate: new Date('2026-01-22'),
    endDate: new Date('2026-02-08'),
    phase: 'peak' as const,
    orb: 0.3,
    intensity: 'low' as const
  } as ActiveTransit
};

// Mock daily transit contexts for different scenarios
export const mockDailyContexts = {
  // Scenario 1: Peak Saturn transit with Mercury retrograde support
  saturnPeakWithMercury: {
    dominantTransit: mockTransits.saturnOppositeSun,
    supportingTransits: [mockTransits.mercuryRetrograde]
  } as DailyTransitContext,

  // Scenario 2: Approaching Pluto transit (intense)
  plutoApproaching: {
    dominantTransit: mockTransits.plutoSquareMoon,
    supportingTransits: []
  } as DailyTransitContext,

  // Scenario 3: Beginning Uranus transit with Neptune support
  uranusBeginning: {
    dominantTransit: mockTransits.uranusConjunctionVenus,
    supportingTransits: [mockTransits.neptuneTrineMoon]
  } as DailyTransitContext,

  // Scenario 4: Separating Neptune transit (integration phase)
  neptuneSeparating: {
    dominantTransit: mockTransits.neptuneTrineMoon,
    supportingTransits: []
  } as DailyTransitContext
};

// Mock draw history for testing repetition scenarios
export const mockDrawHistory = {
  // First time drawing a card during transit
  firstDraw: [],

  // Second time drawing the same card
  secondDraw: [
    {
      id: 'draw-1',
      cardId: 'tower',
      cardName: 'The Tower',
      date: new Date('2026-01-15'),
      transitId: 'transit-pluto-square-moon-2026-01',
      insightTypes: ['transit_phase_beginning'],
      journalEntry: 'Everything feels unstable right now.'
    }
  ],

  // Third+ time drawing the same card
  multipleDraws: [
    {
      id: 'draw-1',
      cardId: 'tower',
      cardName: 'The Tower',
      date: new Date('2026-01-15'),
      transitId: 'transit-pluto-square-moon-2026-01',
      insightTypes: ['transit_phase_beginning']
    },
    {
      id: 'draw-2',
      cardId: 'tower',
      cardName: 'The Tower',
      date: new Date('2026-01-22'),
      transitId: 'transit-pluto-square-moon-2026-01',
      insightTypes: ['repetition_second', 'transit_phase_approaching']
    },
    {
      id: 'draw-3',
      cardId: 'hermit',
      cardName: 'The Hermit',
      date: new Date('2026-01-28'),
      transitId: 'transit-pluto-square-moon-2026-01',
      insightTypes: ['transit_phase_approaching']
    }
  ]
};
