/**
 * Insight Generator v2
 *
 * Generates natural, conversational insights by combining:
 * - Card archetypes
 * - Transit templates
 * - House contexts
 * - Insight structure templates
 */

import { CardArchetype, getCardArchetype, getRandomCardPhrase } from '../data/card-archetypes';
import { getRandomTransitOpener, getTimingPhrase, planetMeanings } from '../data/transit-templates';
import { getRandomHousePhrase, getHouseEmotionalResonance, getRandomHouseQuestion, houseContexts } from '../data/house-contexts';
import {
  insightStructureTemplates,
  closingTemplates,
  keyPhraseTemplates,
  natalPlanetMeanings,
  transitingPlanetActions,
  aspectDescriptions,
  cardArchetypeSynthesis
} from '../data/insight-structure-templates';

export interface TransitData {
  transitingPlanet: string;
  natalPlanet: string;
  aspectType: 'square' | 'opposition' | 'conjunction' | 'trine' | 'sextile';
  phase: 'approaching' | 'peak' | 'separating';
  house: number;
  daysRemaining?: number;
}

export interface GeneratedInsight {
  keyPhrase: string;
  insight: string;
  transitInfo: string;
  transitExplanation: {
    transitingPlanet: string;
    transitingPlanetMeaning: string;
    natalPlanet: string;
    natalPlanetMeaning: string;
    aspectType: string;
    aspectMeaning: string;
    phaseMeaning: string;
  };
}

/**
 * Main insight generator
 */
export function generateInsight(
  cardId: string,
  transit: TransitData,
  isReversed: boolean = false
): GeneratedInsight | null {
  const cardArchetype = getCardArchetype(cardId, isReversed);
  if (!cardArchetype) {
    console.error(`No archetype found for card: ${cardId}`);
    return null;
  }

  // Determine the overall emotional tone
  const combinedTone = getCombinedTone(cardArchetype, transit);

  // Select appropriate structure template
  const structureTemplate = selectStructureTemplate(cardArchetype, transit, combinedTone);

  // Build the insight
  const insight = buildInsight(cardId, cardArchetype, transit, structureTemplate, combinedTone, isReversed);

  // Build the key phrase
  const keyPhrase = buildKeyPhrase(cardArchetype, transit, combinedTone);

  // Build transit info string
  const transitInfo = buildTransitInfo(transit);

  // Build transit explanation
  const transitExplanation = buildTransitExplanation(transit);

  return {
    keyPhrase,
    insight,
    transitInfo,
    transitExplanation
  };
}

/**
 * Determine the combined emotional tone
 */
function getCombinedTone(
  cardArchetype: CardArchetype['upright'],
  transit: TransitData
): 'challenging' | 'neutral' | 'expansive' {
  const transitTone = getTransitTone(transit.aspectType);

  // If both are challenging, it's challenging
  if (cardArchetype.emotionalTone === 'challenging' && transitTone === 'challenging') {
    return 'challenging';
  }

  // If both are expansive, it's expansive
  if (cardArchetype.emotionalTone === 'expansive' && transitTone === 'expansive') {
    return 'expansive';
  }

  // If one is challenging, lean challenging
  if (cardArchetype.emotionalTone === 'challenging' || transitTone === 'challenging') {
    return 'challenging';
  }

  // If one is expansive, lean expansive
  if (cardArchetype.emotionalTone === 'expansive' || transitTone === 'expansive') {
    return 'expansive';
  }

  return 'neutral';
}

function getTransitTone(aspectType: string): 'challenging' | 'neutral' | 'expansive' {
  const challenging = ['square', 'opposition'];
  const expansive = ['trine', 'sextile'];

  if (challenging.includes(aspectType)) return 'challenging';
  if (expansive.includes(aspectType)) return 'expansive';
  return 'neutral';
}

/**
 * Select appropriate structure template
 */
function selectStructureTemplate(
  cardArchetype: CardArchetype['upright'],
  transit: TransitData,
  combinedTone: 'challenging' | 'neutral' | 'expansive'
) {
  const transitTone = getTransitTone(transit.aspectType);

  // Filter templates that match the tones
  const suitableTemplates = insightStructureTemplates.filter(template => {
    const matchesTransit = template.bestFor.transitTone.includes(transitTone);
    const matchesCard = template.bestFor.cardTone.includes(cardArchetype.emotionalTone);
    return matchesTransit && matchesCard;
  });

  if (suitableTemplates.length === 0) {
    // Fallback to any template
    return insightStructureTemplates[0];
  }

  // Random selection from suitable templates
  return suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)];
}

/**
 * Build the full insight text - SYNTHESIS-FOCUSED
 */
function buildInsight(
  cardId: string,
  cardArchetype: CardArchetype['upright'],
  transit: TransitData,
  structureTemplate: any,
  combinedTone: 'challenging' | 'neutral' | 'expansive',
  isReversed: boolean
): string {
  let insight = structureTemplate.structure;

  // Transiting planet (capitalize first letter)
  const transitingPlanet = transit.transitingPlanet.charAt(0).toUpperCase() + transit.transitingPlanet.slice(1);
  insight = insight.replace(/{transiting_planet}/g, transitingPlanet);

  // Natal planet
  const natalPlanet = transit.natalPlanet.charAt(0).toUpperCase() + transit.natalPlanet.slice(1);
  insight = insight.replace(/{natal_planet}/g, natalPlanet);

  // Natal planet meaning IN YOUR CHART
  const natalMeanings = natalPlanetMeanings[transit.natalPlanet.toLowerCase()] || ['your inner nature'];
  const natalPlanetMeaning = selectRandomFromArray(natalMeanings);
  insight = insight.replace(/{natal_planet_meaning}/g, natalPlanetMeaning);

  // Aspect description
  const aspectDescs = aspectDescriptions[transit.aspectType] || ['aspecting'];
  const aspectDescription = selectRandomFromArray(aspectDescs);
  insight = insight.replace(/{aspect_description}/g, aspectDescription);

  // House number and theme
  const houseContext = houseContexts[transit.house];
  const houseTheme = houseContext ? houseContext.coreThemes[0] : 'life';
  insight = insight.replace(/{house_number}/g, `${transit.house}th house`);
  insight = insight.replace(/{house_theme}/g, houseTheme);

  // Card archetype and synthesis
  const cardSynthesis = getCardSynthesis(cardId, cardArchetype);
  insight = insight.replace(/{card_archetype}/g, cardSynthesis.archetype);

  // Synthesis - the combined meaning
  let synthesisText = selectRandomFromArray(cardSynthesis.synthesis);
  synthesisText = synthesisText.replace(/{house_theme}/g, houseTheme);
  synthesisText = synthesisText.replace(/{transiting_planet}/g, transitingPlanet);
  synthesisText = synthesisText.replace(/{natal_planet}/g, natalPlanet);
  insight = insight.replace(/{synthesis}/g, synthesisText);

  // Closing
  const closing = selectRandomFromArray(closingTemplates[combinedTone]);
  insight = insight.replace(/{closing}/g, closing);

  return insight;
}

/**
 * Build emotional reality statement
 */
function buildEmotionalReality(cardArchetype: CardArchetype['upright'], transit: TransitData): string {
  const templates = {
    challenging: [
      'everything feels unclear right now',
      'the tension is real',
      'something has to give',
      'you\'re feeling the pressure',
      'it feels like friction everywhere'
    ],
    neutral: [
      'you\'re in a transition',
      'things are shifting',
      'something\'s changing',
      'you\'re processing'
    ],
    expansive: [
      'things are opening up',
      'there\'s space emerging',
      'you\'re feeling possibility',
      'something\'s shifting in a good way'
    ]
  };

  const tone = cardArchetype.emotionalTone;
  return selectRandomFromArray(templates[tone]);
}

/**
 * Fill in perspective template with card-specific details
 */
function fillPerspective(template: string, cardArchetype: CardArchetype['upright']): string {
  let filled = template;

  // Replace card action
  if (filled.includes('{card_action}')) {
    const action = selectRandomFromArray(cardArchetype.actionQualities);
    filled = filled.replace('{card_action}', action);
  }

  // Replace card quality
  if (filled.includes('{card_quality}')) {
    const quality = selectRandomFromArray(cardArchetype.coreThemes);
    filled = filled.replace('{card_quality}', quality);
  }

  // Replace transit action (if present)
  if (filled.includes('{transit_action}')) {
    filled = filled.replace('{transit_action}', 'the transit');
  }

  return filled;
}

/**
 * Fill in closing template with card-specific details
 */
function fillClosing(template: string, cardArchetype: CardArchetype['upright']): string {
  let filled = template;

  if (filled.includes('{card_action}')) {
    const action = selectRandomFromArray(cardArchetype.actionQualities);
    filled = filled.replace('{card_action}', action);
  }

  if (filled.includes('{card_quality}')) {
    const quality = selectRandomFromArray(cardArchetype.coreThemes);
    filled = filled.replace('{card_quality}', quality);
  }

  return filled;
}

/**
 * Build key phrase
 */
function buildKeyPhrase(
  cardArchetype: CardArchetype['upright'],
  transit: TransitData,
  combinedTone: 'challenging' | 'neutral' | 'expansive'
): string {
  const templates = keyPhraseTemplates[combinedTone];
  let phrase = selectRandomFromArray(templates);

  // Fill in placeholders
  if (phrase.includes('{card_action}')) {
    const action = selectRandomFromArray(cardArchetype.actionQualities);
    phrase = phrase.replace('{card_action}', action);
  }

  if (phrase.includes('{card_quality}')) {
    const quality = selectRandomFromArray(cardArchetype.coreThemes);
    phrase = phrase.replace('{card_quality}', quality);
  }

  if (phrase.includes('{house_theme}')) {
    // Map house number to meaningful theme
    const houseThemeMap: Record<number, string> = {
      1: 'self',
      2: 'worth',
      3: 'voice',
      4: 'foundation',
      5: 'joy',
      6: 'work',
      7: 'relationships',
      8: 'transformation',
      9: 'beliefs',
      10: 'legacy',
      11: 'future',
      12: 'inner world'
    };
    const theme = houseThemeMap[transit.house] || 'life';
    phrase = phrase.replace('{house_theme}', theme);
  }

  return phrase;
}

/**
 * Build transit info string for marquee
 */
function buildTransitInfo(transit: TransitData): string {
  const phaseLabel = {
    approaching: 'approaching',
    peak: 'exact',
    separating: 'separating'
  }[transit.phase];

  const parts = [
    `${transit.transitingPlanet} ${transit.aspectType} ${transit.natalPlanet}`,
    phaseLabel
  ];

  if (transit.daysRemaining !== undefined) {
    parts.push(`${transit.daysRemaining} days remaining`);
  }

  return parts.join(' • ');
}

/**
 * Build transit explanation for expanded view
 */
function buildTransitExplanation(transit: TransitData) {
  const aspectMeanings: Record<string, string> = {
    square: 'a 90° angle creating tension and challenge that demands action',
    opposition: 'a 180° angle creating polarity and the need to balance extremes',
    conjunction: 'a 0° angle where energies merge and intensify together',
    trine: 'a 120° angle creating natural flow and ease',
    sextile: 'a 60° angle offering opportunities and support'
  };

  const phaseMeanings: Record<string, string> = {
    approaching: 'You\'re in the approaching phase, meaning the intensity is building as the transit gets closer to being exact. This is when you start feeling the pressure most strongly.',
    peak: 'The transit is exact right now - this is the peak of intensity. Whatever this transit is about is at maximum strength and demanding your full attention.',
    separating: 'The transit is separating - past the exact point. The intensity is easing, but the lessons and changes it brought are still integrating into your life.'
  };

  return {
    transitingPlanet: transit.transitingPlanet,
    transitingPlanetMeaning: selectRandomFromArray(planetMeanings[transit.transitingPlanet] || ['change']),
    natalPlanet: transit.natalPlanet,
    natalPlanetMeaning: selectRandomFromArray(planetMeanings[transit.natalPlanet] || ['your nature']),
    aspectType: transit.aspectType,
    aspectMeaning: aspectMeanings[transit.aspectType],
    phaseMeaning: phaseMeanings[transit.phase]
  };
}

/**
 * Get card synthesis - archetype + synthesis messages
 */
function getCardSynthesis(cardId: string, cardArchetype: CardArchetype['upright']): { archetype: string; synthesis: string[] } {
  // Check if specific card has synthesis
  if (cardArchetypeSynthesis[cardId as keyof typeof cardArchetypeSynthesis]) {
    return cardArchetypeSynthesis[cardId as keyof typeof cardArchetypeSynthesis] as { archetype: string; synthesis: string[] };
  }

  // Otherwise, use suit synthesis
  const suit = cardId.split('-')[0]; // e.g., 'swords-3' -> 'swords'
  if (cardArchetypeSynthesis[suit as keyof typeof cardArchetypeSynthesis]) {
    return cardArchetypeSynthesis[suit as keyof typeof cardArchetypeSynthesis] as { archetype: string; synthesis: string[] };
  }

  // Fallback
  return {
    archetype: 'This card',
    synthesis: ['is showing you what needs attention right now']
  };
}

/**
 * Utility: Select random item from array
 */
function selectRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
