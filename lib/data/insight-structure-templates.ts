/**
 * Insight Structure Templates - Revised for Emotional Intelligence
 *
 * These templates explicitly connect:
 * 1. The card as your friend telling you what to pay attention to
 * 2. The transit as the cosmic weather creating the conditions
 * 3. The house as the specific area of life where this is playing out
 *
 * Variables:
 * {transit_opener} - Natural opening about the transit
 * {card_phrase} - Natural way to reference the card
 * {card_wisdom} - What the card is specifically telling you to notice
 * {house_context} - What area of life (house) is affected
 * {house_emotional_context} - The emotional weight of this house area
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
    id: 'card-as-messenger',
    structure: '{transit_opener} in {house_context}. {card_phrase} isn\'t random - it\'s telling you {card_wisdom}. {emotional_reality}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Card as direct messenger - tells you what to notice'
  },

  {
    id: 'house-first-emphasis',
    structure: '{transit_opener} is hitting your {house_context} - {house_emotional_context}. That\'s why {card_phrase} showed up. {card_wisdom}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Emphasizes which life area is active, then explains the card'
  },

  {
    id: 'wisdom-delivery',
    structure: '{card_phrase} in {house_context} while {transit_opener}. The card isn\'t just naming the feeling - {card_wisdom}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral', 'expansive']
    },
    description: 'Distinguishes between feeling and the card\'s actual message'
  },

  {
    id: 'direct-connection',
    structure: '{transit_opener} and {card_phrase} landed in {house_context}. {card_wisdom}. {emotional_reality}, but {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging'],
      cardTone: ['challenging']
    },
    description: 'For intense combos - direct about what\'s happening and why it matters'
  },

  {
    id: 'expansive-invitation',
    structure: '{card_phrase} with {transit_opener} in {house_context}. {card_wisdom}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['expansive'],
      cardTone: ['expansive', 'neutral']
    },
    description: 'Card-first for opening energy, focuses on opportunity'
  },

  {
    id: 'triple-link',
    structure: '{transit_opener} in {house_context} is why {card_phrase} matters right now. {card_wisdom}. {emotional_reality}. {perspective}. {closing}.',
    bestFor: {
      transitTone: ['challenging', 'neutral', 'expansive'],
      cardTone: ['challenging', 'neutral', 'expansive']
    },
    description: 'Explicitly links all three: transit + house + card message'
  },

  {
    id: 'question-to-wisdom',
    structure: '{transit_opener} while {card_phrase} shows up in {house_context}. {emotional_reality}. But here\'s what the card is actually saying: {card_wisdom}. {perspective}. {closing}?',
    bestFor: {
      transitTone: ['challenging', 'neutral'],
      cardTone: ['challenging', 'neutral']
    },
    description: 'Moves from confusion to card\'s actual wisdom, ends reflectively'
  }
];

/**
 * Card Wisdom Templates
 *
 * These are NEW - they explicitly state what the card is telling you to notice.
 * This replaces vague card mentions with specific guidance.
 */

export const cardWisdomTemplates = {
  challenging: [
    'this breakdown is necessary information',
    'what you\'ve been accepting isn\'t enough, and your heart knows it',
    'the pain is showing you exactly where the foundation was weak',
    'what\'s shattering needed to shatter',
    'the ending you\'re avoiding is the one that sets you free',
    'this grief is the tax on caring about something real',
    'the truth you\'re facing was always there - you\'re just finally ready to see it'
  ],

  neutral: [
    'you need to pause before you know which way to move',
    'solitude is where you remember who you actually are',
    'the answer isn\'t out there - it\'s in the stillness',
    'transition means you\'re already changing, even if it doesn\'t feel like it yet',
    'what you\'re learning in the quiet will guide you through what comes next'
  ],

  expansive: [
    'the opportunity is real, and it\'s asking you to trust it',
    'this connection wants to be built',
    'the hope you\'re feeling isn\'t naive - it\'s information',
    'something is trying to grow, and it needs your permission',
    'the ease you\'re feeling is real. you\'re allowed to believe it',
    'your instinct is right - this is the beginning of something'
  ]
};

/**
 * Perspective/Reframe Templates
 *
 * These are the "wisdom" parts - reframes, perspective shifts,
 * acknowledgments that help make sense of the experience.
 */

export const perspectiveTemplates = {
  challenging: [
    'what\'s breaking was probably held together with hope and effort for too long',
    'the discomfort isn\'t random - it\'s pointing you toward what needs to change',
    'sometimes clarity requires destruction first',
    'the pain is how you learn what you actually need',
    'you can\'t fix something that was never yours to carry',
    'the confusion is dissolving what you thought was fixed so something real can form'
  ],

  neutral: [
    'not knowing is its own kind of wisdom',
    'the pause is doing more than you realize',
    'what you learn when nothing is happening shapes what you build when things move again',
    'stillness isn\'t emptiness - it\'s preparation',
    'the quiet is teaching you to hear yourself'
  ],

  expansive: [
    'the timing is real, even if it feels sudden',
    'when was the last time you let yourself actually want something without waiting for it to be taken away?',
    'opportunities show up, but only if you\'re willing to reach',
    'the ease isn\'t a trick - it\'s what happens when things align',
    'your future is announcing itself'
  ]
};

/**
 * Closing Templates
 *
 * How to end the insight - truth statements or invitations
 */

export const closingTemplates = {
  challenging: [
    'the breakdown isn\'t your enemy - it\'s making space for what\'s true',
    'what you\'re losing was never the real thing',
    'you\'re more free than you think, you just can\'t see it yet',
    'the ending you\'re in is how you get to what\'s next',
    'this is how you learn what matters'
  ],

  neutral: [
    'trust what you\'re learning in the solitude',
    'the answer will show up when you stop forcing it',
    'what you discover when nothing is happening becomes your compass',
    'the pause is part of the process'
  ],

  expansive: [
    'your people are closer than you think',
    'you\'re allowed to trust this',
    'the window is open right now',
    'this is your moment - what are you going to do with it',
    'the lightning strike has a direction'
  ]
};

/**
 * Key Phrase Templates
 *
 * Short, punchy headers that capture the essence
 */

export const keyPhraseTemplates = {
  challenging: [
    'the breakdown is necessary',
    'truth over comfort',
    'what\'s shattering needed to shatter',
    'the ending that sets you free',
    'sometimes loss is information'
  ],

  neutral: [
    'the pause is preparation',
    'solitude knows what to do',
    'stillness before motion',
    'not knowing is knowing something',
    'the quiet is teaching you'
  ],

  expansive: [
    'the opportunity is real',
    'hope is information',
    'trust the opening',
    'your future is announcing itself',
    'this is the beginning'
  ]
};
