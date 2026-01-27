/**
 * Card Archetypes
 *
 * Core psychological and emotional themes for each tarot card.
 * Used to generate natural, conversational insights.
 * Includes both upright and reversed meanings.
 */

export interface CardArchetype {
  id: string;
  name: string;
  upright: {
    coreThemes: string[];
    emotionalTone: 'challenging' | 'neutral' | 'expansive';
    psychologicalFocus: string[];
    actionQualities: string[];
    naturalPhrases: string[];
  };
  reversed: {
    coreThemes: string[];
    emotionalTone: 'challenging' | 'neutral' | 'expansive';
    psychologicalFocus: string[];
    actionQualities: string[];
    naturalPhrases: string[];
  };
}

export const cardArchetypes: Record<string, CardArchetype> = {
  // MAJOR ARCANA
  'major-0': {
    id: 'major-0',
    name: 'The Fool',
    upright: {
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
    reversed: {
      coreThemes: ['recklessness', 'fear of change', 'holding back', 'naivety', 'missed opportunities'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['fear stopping you', 'not trusting yourself', 'staying stuck in safety'],
      actionQualities: ['hesitating', 'overthinking', 'playing it safe', 'missing the moment'],
      naturalPhrases: [
        'the leap you\'re afraid to take',
        'the fear keeping you stuck',
        'playing it too safe',
        'the opportunity you\'re missing'
      ]
    }
  },

  'major-13': {
    id: 'major-13',
    name: 'Death',
    upright: {
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
    reversed: {
      coreThemes: ['resistance to change', 'fear of letting go', 'stuck in transition', 'clinging'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['refusing to let go', 'holding onto what\'s dead', 'fear of the unknown'],
      actionQualities: ['resisting', 'clinging', 'staying stuck', 'avoiding the end'],
      naturalPhrases: [
        'what you\'re refusing to let go of',
        'the ending you\'re resisting',
        'clinging to what\'s already dead',
        'the transformation you\'re avoiding'
      ]
    }
  },

  'major-16': {
    id: 'major-16',
    name: 'The Tower',
    upright: {
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
    reversed: {
      coreThemes: ['avoiding disaster', 'delaying the inevitable', 'internal breakdown', 'fear of change'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['seeing it coming but frozen', 'internal collapse', 'prolonging the fall'],
      actionQualities: ['resisting collapse', 'internal crumbling', 'delaying truth', 'holding on tighter'],
      naturalPhrases: [
        'the breakdown happening internally',
        'what you\'re trying to hold together',
        'the collapse you see coming',
        'the truth you\'re avoiding'
      ]
    }
  },

  'major-17': {
    id: 'major-17',
    name: 'The Star',
    upright: {
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
    reversed: {
      coreThemes: ['loss of faith', 'disconnection', 'despair', 'feeling lost'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t see the light', 'losing hope', 'feeling abandoned'],
      actionQualities: ['losing faith', 'disconnecting', 'despairing', 'giving up'],
      naturalPhrases: [
        'the hope that\'s hard to find',
        'feeling disconnected from yourself',
        'the faith that\'s fading',
        'when the light feels distant'
      ]
    }
  },

  'major-9': {
    id: 'major-9',
    name: 'The Hermit',
    upright: {
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
    reversed: {
      coreThemes: ['isolation', 'loneliness', 'withdrawal taken too far', 'refusing help'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['isolated, not alone', 'avoiding connection', 'lost in yourself'],
      actionQualities: ['hiding', 'isolating', 'refusing community', 'staying too long in solitude'],
      naturalPhrases: [
        'the isolation that\'s too much',
        'withdrawal that\'s become hiding',
        'when solitude turns to loneliness',
        'refusing the help available'
      ]
    }
  },

  // WANDS (Action, Passion, Will)
  'wands-ace': {
    id: 'wands-ace',
    name: 'Ace of Wands',
    upright: {
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
    reversed: {
      coreThemes: ['creative blocks', 'lack of direction', 'missed opportunities', 'delays'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t find the spark', 'uninspired', 'directionless'],
      actionQualities: ['stalling', 'doubting', 'missing timing', 'blocking creativity'],
      naturalPhrases: [
        'the spark you can\'t find',
        'feeling uninspired',
        'the creative block',
        'when nothing feels exciting'
      ]
    }
  },

  // CUPS (Emotion, Relationships, Intuition)
  'cups-3': {
    id: 'cups-3',
    name: 'Three of Cups',
    upright: {
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
    reversed: {
      coreThemes: ['isolation from community', 'overindulgence', 'gossip', 'exclusion'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['feeling left out', 'toxic celebration', 'shallow connections'],
      actionQualities: ['isolating', 'overindulging', 'gossiping', 'feeling excluded'],
      naturalPhrases: [
        'feeling outside the circle',
        'when celebration feels hollow',
        'connection that drains',
        'the community that doesn\'t fit'
      ]
    }
  },

  // SWORDS (Mind, Conflict, Truth)
  'swords-5': {
    id: 'swords-5',
    name: 'Five of Swords',
    upright: {
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
    reversed: {
      coreThemes: ['making amends', 'ending conflict', 'admitting defeat', 'reconciliation'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['choosing peace over winning', 'letting the battle go', 'humility'],
      actionQualities: ['surrendering', 'reconciling', 'admitting wrong', 'ending the fight'],
      naturalPhrases: [
        'the battle you\'re ending',
        'choosing peace',
        'letting go of being right',
        'the surrender that heals'
      ]
    }
  },

  'swords-8': {
    id: 'swords-8',
    name: 'Eight of Swords',
    upright: {
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
    reversed: {
      coreThemes: ['self-liberation', 'new perspective', 'removing blindfold', 'finding options'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['seeing clearly finally', 'releasing mental prison', 'recognizing freedom'],
      actionQualities: ['freeing yourself', 'seeing options', 'removing limits', 'stepping free'],
      naturalPhrases: [
        'the freedom you\'re finding',
        'seeing the way out',
        'the blindfold coming off',
        'recognizing you were never trapped'
      ]
    }
  },

  // PENTACLES (Material, Body, Earth, Resources)
  // Add more as needed...
};

/**
 * Get card archetype by ID and orientation
 */
export function getCardArchetype(cardId: string, isReversed: boolean = false): CardArchetype['upright'] | undefined {
  const card = cardArchetypes[cardId];
  if (!card) return undefined;

  return isReversed ? card.reversed : card.upright;
}

/**
 * Get a random natural phrase for a card
 */
export function getRandomCardPhrase(cardId: string, isReversed: boolean = false): string {
  const archetype = getCardArchetype(cardId, isReversed);
  if (!archetype) return '';

  const phrases = archetype.naturalPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
