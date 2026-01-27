/**
 * Insight Structure Templates
 *
 * These templates define the narrative flow of insights, maintaining
 * the conversational, emotionally intelligent voice.
 *
 * Variables:
 * {transit_opener} - Natural opening about the transit
 * {card_phrase} - Natural way to reference the card
 * {house_context} - What area of life (house) is affected
 * {emotional_reality} - What it feels like
 * {perspective} - The reframe or wisdom
 * {closing} - Truth or invitation to end with
 */

export interface InsightStructureTemplate {
  id: string;
  structure: string; // The narrative flow with placeholders
  bestFor: {
    transitTone: ('challenging' | 'neutral' | 'expansive')[];
    cardTone: ('challenging' | 'neutral' | 'expansive')[];
  };
  description: string; // What makes this structure work
}

export const insightStructureTemplates: InsightStructureTemplate[] = [
  {
    id: 'reality-check',
    structure: '{transit_opener}, and {card_phrase} in {house_context}. {emotional_reality}. Here\'s the thing: {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Direct confrontation with what\'s happening, then reframe'
  },

  {
    id: 'question-led',
    structure: '{transit_opener} while {card_phrase} shows up in {house_context}. {emotional_reality}. But {perspective}. {closing}?',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Leads with the situation, ends with a reflective question'
  },

  {
    id: 'expansion-flow',
    structure: '{transit_opener}, {card_phrase} in {house_context}. {emotional_reality}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['expansive', 'neutral'],
      cardTone: ['expansive', 'neutral']
    },
    description: 'Smooth flow for positive or opening transits'
  },

  {
    id: 'direct-naming',
    structure: '{transit_opener}. {card_phrase} in {house_context} - {house_emotional_context}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging'],
      cardTone: ['challenging']
    },
    description: 'For intense combinations - direct and clear'
  },

  {
    id: 'gentle-opening',
    structure: '{card_phrase} with {transit_opener} in {house_context}. {emotional_reality}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['expansive'],
      cardTone: ['expansive', 'neutral']
    },
    description: 'Card-first for softer, more opening energy'
  },

  {
    id: 'emotional-first',
    structure: '{emotional_reality} - that\'s {transit_opener} with {card_phrase} in {house_context}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging']
    },
    description: 'Starts with the feeling, then explains why'
  },

  {
    id: 'build-and-release',
    structure: '{transit_opener} and {card_phrase} landed in {house_context}. {emotional_reality}. {perspective}. But here\'s what matters: {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral', 'expansive']
    },
    description: 'Builds tension then releases with wisdom'
  }
];

/**
 * Perspective/Reframe Templates
 *
 * These are the "wisdom" parts - reframes, perspective shifts,
 * acknowledgments that help make sense of the experience.
 */

export const perspectiveTemplates = {
  challenging: [
    'what\'s {card_action} was probably held together with hope and effort for too long',
    'the {card_quality} isn\'t random - it\'s showing you what needs attention',
    '{card_quality} isn\'t the enemy. it\'s the truth finally getting loud enough to hear',
    'sometimes the smartest move is knowing which battles actually matter',
    'what you\'re {card_action} was never yours to carry in the first place',
    'the confusion isn\'t random. {transit_action} is dissolving what you thought was fixed',
    'what if the {card_quality} is the point? what if it\'s already making space for what\'s actually true?'
  ],

  neutral: [
    'the {card_quality} you\'re feeling? it\'s real. you\'re allowed to trust it',
    'what you learn in the {card_quality}, in the quiet, in the space between - that\'s where your growth lives',
    '{card_action} doesn\'t mean weakness. it means you\'re finally ready for what\'s next',
    'sometimes you need to {card_action} to see clearly',
    'the {card_quality} is teaching you something specific'
  ],

  expansive: [
    'the {card_quality} you\'re feeling? it\'s real. you won\'t rebuild alone',
    'when was the last time you let yourself actually {card_action} without waiting for the other shoe to drop?',
    'the ease you\'re feeling? it\'s real. you\'re allowed to trust it',
    'opportunities if you reach for them. help if you ask',
    'the impulse you\'re feeling isn\'t reckless - it\'s your future announcing itself'
  ]
};

/**
 * Closing Templates
 *
 * How to end the insight - truth statements or invitations
 */

export const closingTemplates = {
  challenging: [
    'the breakdown isn\'t the enemy. it\'s the truth finally getting loud enough to hear',
    'what\'s {card_action} isn\'t your enemy. it\'s making space for what\'s true',
    'the {card_quality} is real, and it\'s not here to destroy you - it\'s here to free you',
    'not every battle needs your words',
    'you\'re more free than you think - you just can\'t see it yet because you\'re still believing the old story'
  ],

  neutral: [
    'trust what you\'re learning in the solitude',
    'the answer is probably simpler than you think',
    '{card_action} isn\'t the end - it\'s the transition',
    'what you discover in the quiet becomes your compass'
  ],

  expansive: [
    'your people are closer than you think',
    'you\'re allowed to trust this',
    'the window is open right now',
    'joy is asking you to let it in',
    'this is your future announcing itself'
  ]
};

/**
 * Key Phrase Templates
 *
 * Short, punchy headers that capture the essence
 */

export const keyPhraseTemplates = {
  challenging: [
    'time to name what\'s {card_action}',
    'the {house_theme} is asking for truth',
    'what you\'re {card_action} was never yours to carry',
    'not every battle needs your words',
    'the breakdown is the beginning'
  ],

  neutral: [
    '{card_quality} is teaching you something',
    'the answer lives in the {house_theme}',
    'solitude knows what to do',
    'trust the {card_action}'
  ],

  expansive: [
    '{card_quality} is rebuilding your {house_theme}',
    'joy is asking you to let it in',
    'the lightning strike has a direction',
    'hope is real',
    'your {house_theme} is expanding'
  ]
};
