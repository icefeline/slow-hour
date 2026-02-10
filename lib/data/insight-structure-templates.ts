/**
 * Insight Structure Templates - Synthesis-Focused
 *
 * These templates synthesize three elements into ONE coherent message:
 * 1. What the transit means IN YOUR CHART (transiting planet + natal planet)
 * 2. What house/life area is being activated
 * 3. What the card archetype/suit adds to this specific moment
 *
 * The goal: NO repetition. Just connection and synthesis.
 *
 * Variables:
 * {transiting_planet} - The planet currently moving (Saturn, Jupiter, etc)
 * {natal_planet} - Your natal planet being activated (Sun, Moon, etc)
 * {natal_planet_meaning} - What this natal planet represents in YOUR chart
 * {transiting_planet_action} - What the transiting planet is doing
 * {aspect_description} - What the aspect means (square = tension, trine = flow, etc)
 * {house_number} - The house number (1-12)
 * {house_theme} - What this house represents
 * {card_archetype} - What the card/suit fundamentally represents
 * {synthesis} - The combined message: why these three together create THIS specific insight
 * {closing} - Final wisdom
 */

export interface InsightStructureTemplate {
  id: string;
  structure: string;
  bestFor: {
    transitTone: ('challenging' | 'neutral' | 'expansive')[];
    cardTone: ('challenging' | 'neutral' | 'expansive')[];
  };
  description: string;
}

export const insightStructureTemplates: InsightStructureTemplate[] = [
  {
    id: 'synthesis-direct',
    structure: '{transiting_planet} is {aspect_description} your {natal_planet} - {natal_planet_meaning}. This is happening in your {house_number} of {house_theme}. {card_archetype}. {synthesis}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Direct synthesis: transit meaning + house + card archetype = combined message'
  },

  {
    id: 'why-this-card',
    structure: '{transiting_planet} {aspect_description} your {natal_planet} in your {house_number} of {house_theme} - which is exactly why {card_archetype}. {synthesis}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral', 'expansive'],
      cardTone: ['challenging', 'neutral', 'expansive']
    },
    description: 'Emphasizes WHY this specific card appeared with this transit + house combo'
  },

  {
    id: 'chart-reading',
    structure: 'Your chart right now: {transiting_planet} meeting your {natal_planet} ({natal_planet_meaning}) in your {house_number} of {house_theme}. {card_archetype}. {synthesis}. {closing}.',
    bestFor: {
      transitTone: ['neutral', 'expansive'],
      cardTone: ['neutral', 'expansive']
    },
    description: 'Reads like an astrologer explaining your chart with the card'
  },

  {
    id: 'intense-synthesis',
    structure: '{transiting_planet} is {aspect_description} your {natal_planet} in your {house_number} of {house_theme}. {natal_planet_meaning}. {card_archetype}. These three together: {synthesis}. {closing}.',
    bestFor: {
      transitTone: ['challenging'],
      cardTone: ['challenging']
    },
    description: 'For heavy transits - breaks down each piece then synthesizes'
  },

  {
    id: 'opening-flow',
    structure: '{transiting_planet} is {aspect_description} your {natal_planet} - {natal_planet_meaning} - in your {house_number} of {house_theme}. {card_archetype}. {synthesis}. {closing}.',
    bestFor: {
      transitTone: ['expansive'],
      cardTone: ['expansive', 'neutral']
    },
    description: 'Flowing synthesis for positive transits'
  },

  {
    id: 'house-emphasis',
    structure: 'Your {house_number} of {house_theme} is where {transiting_planet} is {aspect_description} your {natal_planet} ({natal_planet_meaning}). {card_archetype}. {synthesis}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Starts with the life area being activated'
  }
];

/**
 * Natal Planet Meanings
 *
 * What each planet represents IN YOUR CHART specifically
 */
export const natalPlanetMeanings: Record<string, string[]> = {
  sun: [
    'your core identity, who you actually are',
    'your life force, how you shine',
    'your sense of self, what makes you you',
    'your ego and vitality'
  ],
  moon: [
    'your emotional world, how you feel and need',
    'your inner life, what makes you feel safe',
    'your instincts and emotional responses',
    'how you process feelings and memories'
  ],
  mercury: [
    'your mind, how you think and communicate',
    'how you process information and learn',
    'your voice, how you express ideas',
    'the way your brain works'
  ],
  venus: [
    'what you love, what you value',
    'how you relate and connect',
    'what brings you pleasure and beauty',
    'your relationship patterns and desires'
  ],
  mars: [
    'your drive, how you take action',
    'your will and assertion',
    'how you go after what you want',
    'your anger and passion'
  ],
  jupiter: [
    'your optimism and growth',
    'where you expand and seek meaning',
    'your faith and philosophy',
    'how you see possibility'
  ]
};

/**
 * Transiting Planet Actions
 *
 * What each transiting planet DOES when it activates your chart
 */
export const transitingPlanetActions: Record<string, string[]> = {
  saturn: [
    'bringing structure and testing what\'s real',
    'asking you to build something that lasts',
    'showing you where the foundation needs work',
    'demanding maturity and responsibility'
  ],
  jupiter: [
    'opening doors and expanding possibility',
    'asking you to grow beyond your current limits',
    'bringing opportunity and optimism',
    'showing you what\'s possible'
  ],
  uranus: [
    'breaking patterns and demanding change',
    'bringing sudden insight and awakening',
    'disrupting what felt stable',
    'pushing you toward authenticity'
  ],
  neptune: [
    'dissolving boundaries and illusions',
    'asking what\'s real beyond the story',
    'bringing spiritual sensitivity',
    'blurring what felt certain'
  ],
  pluto: [
    'transforming at the root',
    'bringing what\'s hidden to the surface',
    'demanding you face what\'s been avoided',
    'breaking down to rebuild from nothing'
  ],
  mars: [
    'activating your will and drive',
    'bringing energy and urgency',
    'pushing you to act',
    'stirring up conflict or courage'
  ]
};

/**
 * Aspect Descriptions
 *
 * What each aspect means in plain language
 */
export const aspectDescriptions: Record<string, string[]> = {
  square: [
    'squaring',
    'creating friction with',
    'challenging'
  ],
  opposition: [
    'opposing',
    'pulling against',
    'in tension with'
  ],
  conjunction: [
    'conjunct with',
    'merging with',
    'sitting right on top of'
  ],
  trine: [
    'trining',
    'flowing with',
    'supporting'
  ],
  sextile: [
    'sextiling',
    'offering opportunity to',
    'opening pathways with'
  ]
};

/**
 * Card Archetype Meanings
 *
 * What the CARD or SUIT fundamentally represents (not what it means - that's elsewhere)
 * This is about the archetype's ESSENCE that gets combined with the chart
 */
export const cardArchetypeSynthesis = {
  // Major Arcana examples
  'major-16': { // The Tower
    archetype: 'The Tower is collapse and breakthrough - structures coming down',
    synthesis: [
      'the structure that\'s breaking in {house_theme} needed to break. {transiting_planet} is showing you the cracks were always there',
      'what\'s collapsing in {house_theme} was built on something unstable. {transiting_planet} meeting your {natal_planet} is why it can\'t hold anymore',
      'the tower moment in {house_theme} isn\'t random - {transiting_planet} is forcing what your {natal_planet} knew wasn\'t working'
    ]
  },

  'major-17': { // The Star
    archetype: 'The Star is hope returning after devastation',
    synthesis: [
      '{transiting_planet} bringing flow to your {natal_planet} in {house_theme} - this is hope based on what survived',
      'after whatever broke in {house_theme}, {transiting_planet} with your {natal_planet} is why healing feels possible now',
      'the Star isn\'t naive optimism - it\'s {transiting_planet} helping your {natal_planet} rebuild trust in {house_theme}'
    ]
  },

  // Suit archetypes
  swords: {
    archetype: 'Swords are the mind, clarity, cutting through',
    synthesis: [
      'the mental clarity you need in {house_theme} is what {transiting_planet} meeting your {natal_planet} is demanding',
      'Swords cut through illusion - {transiting_planet} is bringing sharp truth to your {natal_planet} in {house_theme}',
      'the sword in {house_theme} means {transiting_planet} is asking your {natal_planet} to think clearly, not just feel'
    ]
  },

  cups: {
    archetype: 'Cups are emotion, connection, the heart',
    synthesis: [
      'the emotional truth in {house_theme} is what {transiting_planet} meeting your {natal_planet} is revealing',
      'Cups are about what you feel - {transiting_planet} is bringing emotional awareness to your {natal_planet} in {house_theme}',
      'the heart knows before the head - {transiting_planet} is asking your {natal_planet} to feel what\'s real in {house_theme}'
    ]
  },

  wands: {
    archetype: 'Wands are fire, will, creative action',
    synthesis: [
      'the creative energy in {house_theme} is what {transiting_planet} meeting your {natal_planet} is activating',
      'Wands are about will and vision - {transiting_planet} is igniting your {natal_planet}\'s drive in {house_theme}',
      'the fire you need in {house_theme} comes from {transiting_planet} meeting your {natal_planet} - this is about taking action'
    ]
  },

  pentacles: {
    archetype: 'Pentacles are earth, material reality, what you build',
    synthesis: [
      'the tangible work in {house_theme} is what {transiting_planet} meeting your {natal_planet} is grounding into reality',
      'Pentacles are about the material world - {transiting_planet} is asking your {natal_planet} to build something real in {house_theme}',
      'what you create with your hands in {house_theme} matters - {transiting_planet} meeting your {natal_planet} is making it solid'
    ]
  }
};

/**
 * Closing Templates
 *
 * Final wisdom statements
 */
export const closingTemplates = {
  challenging: [
    'this is how clarity comes',
    'the breakdown is the breakthrough',
    'what you\'re losing wasn\'t the real thing',
    'you\'re freer than you think',
    'the truth is harder but it\'s yours'
  ],

  neutral: [
    'trust what you\'re learning in the quiet',
    'the pause is preparation',
    'what you discover now becomes your foundation',
    'stillness has its own wisdom'
  ],

  expansive: [
    'the window is open',
    'you\'re allowed to trust this',
    'the opportunity is real',
    'this is your moment',
    'the lightning has a direction'
  ]
};

/**
 * Key Phrase Templates
 */
export const keyPhraseTemplates = {
  challenging: [
    'clarity through breakdown',
    'truth over comfort',
    'the necessary ending',
    'what needed to break',
    'the hard truth'
  ],

  neutral: [
    'the pause before motion',
    'stillness teaches',
    'between what was and what\'s next',
    'listening in the quiet'
  ],

  expansive: [
    'the door opening',
    'hope based on truth',
    'trust what\'s emerging',
    'the opportunity is real',
    'lightning with direction'
  ]
};
