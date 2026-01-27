/**
 * Card Archetypes
 *
 * Core psychological and emotional themes for each tarot card.
 * Used to generate natural, conversational insights.
 */

export interface CardArchetype {
  id: string;
  name: string;
  coreThemes: string[];
  emotionalTone: 'challenging' | 'neutral' | 'expansive';
  psychologicalFocus: string[];
  actionQualities: string[];
  naturalPhrases: string[]; // Ways to reference this card naturally in text
}

export const cardArchetypes: Record<string, CardArchetype> = {
  // MAJOR ARCANA
  'major-0': {
    id: 'major-0',
    name: 'The Fool',
    coreThemes: ['new beginnings', 'trust', 'leap of faith', 'innocence', 'potential'],
    emotionalTone: 'expansive',
    psychologicalFocus: ['taking risks', 'letting go of certainty', 'trusting the unknown'],
    actionQualities: ['starting fresh', 'stepping into the unknown', 'following impulse'],
    naturalPhrases: [
      'the leap you\'re being asked to take',
      'that new beginning knocking',
      'the fresh start available',
      'starting without a map'
    ]
  },

  'major-16': {
    id: 'major-16',
    name: 'The Tower',
    coreThemes: ['sudden change', 'breakdown', 'truth revealed', 'false structures falling'],
    emotionalTone: 'challenging',
    psychologicalFocus: ['facing uncomfortable truth', 'releasing control', 'what can\'t be held together anymore'],
    actionQualities: ['letting it fall', 'naming what\'s crumbling', 'clearing space'],
    naturalPhrases: [
      'what\'s falling apart',
      'the breakdown',
      'what can\'t hold anymore',
      'the truth getting loud',
      'the structure collapsing'
    ]
  },

  'major-13': {
    id: 'major-13',
    name: 'Death',
    coreThemes: ['endings', 'transformation', 'release', 'transition', 'rebirth'],
    emotionalTone: 'challenging',
    psychologicalFocus: ['letting go completely', 'accepting endings', 'what needs to die'],
    actionQualities: ['releasing', 'ending', 'transforming', 'allowing death'],
    naturalPhrases: [
      'what needs to end completely',
      'the transformation',
      'the ending that has to happen',
      'what you\'re releasing',
      'the death of an old way'
    ]
  },

  'major-17': {
    id: 'major-17',
    name: 'The Star',
    coreThemes: ['hope', 'healing', 'renewal', 'guidance', 'faith'],
    emotionalTone: 'expansive',
    psychologicalFocus: ['believing again', 'finding hope', 'healing after loss'],
    actionQualities: ['hoping', 'trusting', 'healing', 'rebuilding faith'],
    naturalPhrases: [
      'hope rebuilding',
      'the healing available',
      'faith returning',
      'the light coming back',
      'renewal after destruction'
    ]
  },

  'major-9': {
    id: 'major-9',
    name: 'The Hermit',
    coreThemes: ['solitude', 'inner wisdom', 'introspection', 'guidance from within'],
    emotionalTone: 'neutral',
    psychologicalFocus: ['going inward', 'finding your own answers', 'wisdom through solitude'],
    actionQualities: ['withdrawing', 'reflecting', 'seeking within', 'being alone'],
    naturalPhrases: [
      'the solitude teaching you',
      'going inward',
      'what you learn alone',
      'the inner work',
      'the wisdom in withdrawal'
    ]
  },

  // WANDS (Action, Passion, Will)
  'wands-ace': {
    id: 'wands-ace',
    name: 'Ace of Wands',
    coreThemes: ['creative spark', 'new passion', 'inspired action', 'potential energy'],
    emotionalTone: 'expansive',
    psychologicalFocus: ['recognizing creative impulse', 'feeling inspired', 'new direction'],
    actionQualities: ['starting', 'creating', 'initiating', 'following spark'],
    naturalPhrases: [
      'that creative spark',
      'the impulse you\'re feeling',
      'the inspiration',
      'the fire igniting',
      'that sudden knowing'
    ]
  },

  // CUPS (Emotion, Relationships, Intuition)
  'cups-3': {
    id: 'cups-3',
    name: 'Three of Cups',
    coreThemes: ['celebration', 'community', 'joy', 'friendship', 'connection'],
    emotionalTone: 'expansive',
    psychologicalFocus: ['allowing joy', 'connecting with others', 'celebrating'],
    actionQualities: ['celebrating', 'connecting', 'sharing joy', 'being with people'],
    naturalPhrases: [
      'joy asking to be let in',
      'the celebration available',
      'connection with your people',
      'the ease you\'re feeling',
      'community showing up'
    ]
  },

  // SWORDS (Mind, Conflict, Truth)
  'swords-5': {
    id: 'swords-5',
    name: 'Five of Swords',
    coreThemes: ['conflict', 'winning at a cost', 'defeating others', 'hollow victory'],
    emotionalTone: 'challenging',
    psychologicalFocus: ['the cost of being right', 'battles worth fighting', 'empty wins'],
    actionQualities: ['fighting', 'winning', 'losing connection', 'choosing battles'],
    naturalPhrases: [
      'the battle',
      'winning at what cost',
      'the fight you\'re in',
      'the argument',
      'being right vs being heard'
    ]
  },

  'swords-8': {
    id: 'swords-8',
    name: 'Eight of Swords',
    coreThemes: ['feeling trapped', 'self-imposed limits', 'mental prison', 'blind spots'],
    emotionalTone: 'challenging',
    psychologicalFocus: ['believing you\'re stuck', 'not seeing options', 'mental constraints'],
    actionQualities: ['feeling bound', 'limiting self', 'missing freedom', 'staying stuck'],
    naturalPhrases: [
      'feeling trapped',
      'the bindings',
      'not seeing the way out',
      'the limits you believe in',
      'the stuck feeling'
    ]
  },

  // PENTACLES (Material, Body, Earth, Resources)
  // Add more as needed...
};

/**
 * Get card archetype by ID
 */
export function getCardArchetype(cardId: string): CardArchetype | undefined {
  return cardArchetypes[cardId];
}

/**
 * Get a random natural phrase for a card
 */
export function getRandomCardPhrase(cardId: string): string {
  const archetype = cardArchetypes[cardId];
  if (!archetype) return '';

  const phrases = archetype.naturalPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
