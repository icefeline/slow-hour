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
    structure: '{transiting_planet} is {aspect_description} your {natal_planet} ({natal_planet_meaning}) in your {house_number} of {house_theme}. {card_archetype}. {synthesis}. {closing}.',
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
  // Major Arcana
  'major-0': { // The Fool
    archetype: 'The Fool is the leap into unknown, trusting the path will appear',
    synthesis: [
      '{transiting_planet} activating your {natal_planet} in {house_theme} - the Fool is showing you where you need to leap without knowing where you\'ll land',
      'the beginning energy in {house_theme} is what {transiting_planet} meeting your {natal_planet} is creating. The Fool says trust it even when you can\'t see the whole path',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - this is about starting before you\'re ready'
    ]
  },

  'major-1': { // The Magician
    archetype: 'The Magician is manifestation - you have the tools, use them',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Magician is showing you that you already have what you need',
      'the creative power in {house_theme} is what {transiting_planet} activating your {natal_planet} is revealing. The Magician says the tools are in your hands',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - this is about recognizing your own agency'
    ]
  },

  'major-2': { // The High Priestess
    archetype: 'The High Priestess is intuition, the unseen, what you know without knowing how',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the High Priestess is asking you to trust what you sense beneath the surface',
      'the intuitive knowing in {house_theme} is what {transiting_planet} activating your {natal_planet} is awakening. Logic won\'t solve this one',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the High Priestess is showing you the hidden patterns'
    ]
  },

  'major-5': { // The Hierophant
    archetype: 'The Hierophant is tradition, structure, the established way',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Hierophant is asking whether you\'re following tradition because it\'s wise or because it\'s familiar',
      'the structures in {house_theme} that {transiting_planet} is activating through your {natal_planet} - the Hierophant shows you what\'s worth keeping',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Hierophant is revealing which rules serve you and which don\'t'
    ]
  },

  'major-6': { // The Lovers
    archetype: 'The Lovers is choice, union, what you commit to',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Lovers is showing you this choice matters more than you think',
      'the union or decision in {house_theme} is what {transiting_planet} activating your {natal_planet} is demanding. The Lovers say you can\'t have both',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - this is about choosing what you actually want, not what you should want'
    ]
  },

  'major-8': { // Strength
    archetype: 'Strength is gentle power, taming what\'s wild through softness',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - Strength is showing you that force isn\'t the answer here',
      'the power you need in {house_theme} is what {transiting_planet} activating your {natal_planet} is revealing. Strength says gentle persistence wins',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means Strength is asking you to work with the wild part, not against it'
    ]
  },

  'major-9': { // The Hermit
    archetype: 'The Hermit is withdrawal, solitude, finding answers within',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Hermit is telling you the answer isn\'t out there, it\'s in the solitude',
      'the withdrawal you\'re feeling in {house_theme} isn\'t isolation - it\'s {transiting_planet} asking your {natal_planet} to go inward before moving forward',
      '{transiting_planet} activating your {natal_planet} in {house_theme} means the Hermit\'s lantern lights the path, but only you can walk it alone'
    ]
  },

  'major-10': { // Wheel of Fortune
    archetype: 'The Wheel is cycles, fate, what\'s beyond your control',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Wheel is showing you this turn was always coming',
      'the cycle shifting in {house_theme} is what {transiting_planet} activating your {natal_planet} is revealing. The Wheel says you can\'t stop it, only respond',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Wheel is turning - luck or fate, you didn\'t cause this'
    ]
  },

  'major-12': { // The Hanged Man
    archetype: 'The Hanged Man is suspension, seeing differently, the pause that shifts perspective',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Hanged Man is showing you why struggling makes it worse',
      'the suspension in {house_theme} is what {transiting_planet} activating your {natal_planet} is creating. The Hanged Man says surrender opens the view',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Hanged Man is asking you to stop fighting and see it upside down'
    ]
  },

  'major-3': { // The Empress
    archetype: 'The Empress is abundance, fertility, creation flowing naturally',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Empress is showing you where abundance wants to grow if you let it',
      'the creative fertility in {house_theme} is what {transiting_planet} activating your {natal_planet} is nurturing. The Empress says stop forcing and start receiving',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Empress is asking you to trust what wants to be born'
    ]
  },

  'major-4': { // The Emperor
    archetype: 'The Emperor is structure, authority, the order you create',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Emperor is asking you to build the structure that holds everything together',
      'the authority you need in {house_theme} is what {transiting_planet} activating your {natal_planet} is demanding. The Emperor says create the boundaries',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Emperor is showing you where you need to take control'
    ]
  },

  'major-7': { // The Chariot
    archetype: 'The Chariot is will, direction, moving forward through opposing forces',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Chariot is showing you how to harness opposing forces to move forward',
      'the willpower you need in {house_theme} is what {transiting_planet} activating your {natal_planet} is demanding. The Chariot says hold the reins and direct it',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Chariot is asking you to choose a direction and commit'
    ]
  },

  'major-11': { // Justice
    archetype: 'Justice is balance, cause and effect, what\'s fair',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - Justice is showing you the scales need to balance',
      'the accountability in {house_theme} is what {transiting_planet} activating your {natal_planet} is revealing. Justice says the consequences are fair',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means Justice is asking what you owe and what\'s owed to you'
    ]
  },

  'major-13': { // Death
    archetype: 'Death is transformation, the ending that must happen for the beginning',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - Death is showing you that what\'s ending needed to end',
      'the transformation in {house_theme} is what {transiting_planet} activating your {natal_planet} is demanding. Death says you can\'t grow without letting go',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means Death is clearing the ground so something new can actually root'
    ]
  },

  'major-14': { // Temperance
    archetype: 'Temperance is alchemy, balance, mixing opposites into something new',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - Temperance is showing you how to blend what seemed incompatible',
      'the balance you\'re seeking in {house_theme} is what {transiting_planet} activating your {natal_planet} is creating. Temperance says patience transforms',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means Temperance is asking you to find the middle path'
    ]
  },

  'major-15': { // The Devil
    archetype: 'The Devil is bondage, addiction, what you think you can\'t leave',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Devil is showing you where you\'re chained by choice, not force',
      'the attachment in {house_theme} is what {transiting_planet} activating your {natal_planet} is revealing. The Devil says the chains are unlocked',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Devil is asking what you\'re getting from staying stuck'
    ]
  },

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

  'major-18': { // The Moon
    archetype: 'The Moon is illusion, the subconscious, what you can\'t see clearly',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Moon is showing you that things aren\'t as they appear',
      'the confusion in {house_theme} is what {transiting_planet} activating your {natal_planet} is creating. The Moon says trust instinct over logic',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Moon is revealing what\'s been hidden in shadow'
    ]
  },

  'major-19': { // The Sun
    archetype: 'The Sun is clarity, joy, what\'s obvious in daylight',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Sun is making everything visible and simple',
      'the clarity in {house_theme} is what {transiting_planet} activating your {natal_planet} is bringing. The Sun says it\'s exactly what it looks like',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the Sun is lighting up what you couldn\'t see before'
    ]
  },

  'major-20': { // Judgment
    archetype: 'Judgment is awakening, resurrection, seeing yourself clearly',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - Judgment is calling you to wake up to who you actually are',
      'the reckoning in {house_theme} is what {transiting_planet} activating your {natal_planet} is demanding. Judgment says face what you\'ve been avoiding',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means Judgment is asking you to shed the old identity'
    ]
  },

  'major-21': { // The World
    archetype: 'The World is completion, integration, the cycle fulfilled',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the World is showing you this chapter is complete',
      'the integration in {house_theme} is what {transiting_planet} activating your {natal_planet} is creating. The World says you\'ve arrived',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} means the World is closing this cycle so the next can begin'
    ]
  },

  // Suit archetypes
  swords: {
    archetype: 'Swords are the mind, clarity, cutting through',
    synthesis: [
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the Swords are showing you where mental clarity cuts through what emotion can\'t solve',
      'Swords cut through illusion - {transiting_planet} activating your {natal_planet} is demanding you think clearly about {house_theme}, not just feel your way through',
      'the sword moment in {house_theme} means {transiting_planet} is asking your {natal_planet} to see the truth, even if it hurts to look directly at it'
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
