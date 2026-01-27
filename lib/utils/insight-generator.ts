import type { TarotCard } from '../types/tarot';
import type {
  UserChart,
  DailyTransitContext,
  DrawContext,
  CardDraw,
  ActiveTransit
} from '../types/astrology';
import { INSIGHT_TEMPLATES, getHouseInsightPhrase } from '../data/insight-templates';
import { CARD_HOUSE_INSIGHTS } from '../data/card-house-insights';

// Helper to pick a random item from an array (deterministic based on seed)
function seededRandom<T>(array: T[], seed: number): T {
  const index = seed % array.length;
  return array[index];
}

// Helper to replace template variables
function fillTemplate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  }
  return result;
}

// Helper to convert number to ordinal (1st, 2nd, 3rd, etc.)
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Helper to calculate days between dates
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Create draw context from history
export function createDrawContext(
  currentCard: TarotCard,
  currentDate: Date,
  transitId: string,
  transitStartDate: Date,
  drawHistory: CardDraw[]
): DrawContext {

  const transitDrawHistory = drawHistory.filter(d => d.transitId === transitId);
  const sameCardDraws = transitDrawHistory.filter(d => d.cardId === currentCard.id);
  const lastDraw = sameCardDraws.length > 0 ? sameCardDraws[sameCardDraws.length - 1] : undefined;

  return {
    currentDraw: {
      id: `draw-${Date.now()}`,
      cardId: currentCard.id,
      cardName: currentCard.name,
      date: currentDate,
      transitId,
      insightTypes: []
    },
    transitDrawHistory,
    drawCount: sameCardDraws.length + 1, // +1 for current draw (so 1 = first time, 2 = second time, etc.)
    lastDrawnDate: lastDraw?.date,
    daysSinceLastDraw: lastDraw ? daysBetween(lastDraw.date, currentDate) : undefined,
    daysIntoTransit: daysBetween(transitStartDate, currentDate)
  };
}

// Main insight generation function
export function generateActiveInsight(
  card: TarotCard,
  userChart: UserChart,
  transitContext: DailyTransitContext,
  drawContext: DrawContext
): { insight: string; insightTypes: string[] } {

  const insights: string[] = [];
  const insightTypes: string[] = [];
  const seed = Date.now(); // In production, use deterministic seed based on date + userId

  const { dominantTransit, supportingTransits } = transitContext;

  // 1. REPETITION AWARENESS
  if (drawContext.drawCount === 2) {
    const template = seededRandom(INSIGHT_TEMPLATES.repetition.second_draw, seed);
    insights.push(fillTemplate(template, { CardName: card.name }));
    insightTypes.push('repetition_second');
  } else if (drawContext.drawCount >= 3) {
    const template = seededRandom(INSIGHT_TEMPLATES.repetition.third_plus_draw, seed + 1);
    insights.push(fillTemplate(template, {
      CardName: card.name,
      ordinal: ordinal(drawContext.drawCount)
    }));
    insightTypes.push('repetition_multiple');
  }

  // 2. TRANSIT PHASE CONTEXT
  const phaseTemplates = INSIGHT_TEMPLATES.transit_phase[dominantTransit.phase];
  const phaseTemplate = seededRandom(phaseTemplates, seed + 2);
  insights.push(fillTemplate(phaseTemplate, {
    transitName: dominantTransit.name,
    CardName: card.name
  }));
  insightTypes.push(`transit_phase_${dominantTransit.phase}`);

  // 3. HOUSE PLACEMENT
  const cardSlug = card.name.toLowerCase().replace(/^the\s+/, '').replace(/\s+/g, '-');
  const houseInsight = CARD_HOUSE_INSIGHTS[cardSlug]?.[dominantTransit.house];

  if (houseInsight) {
    insights.push(houseInsight);
    insightTypes.push(`house_${dominantTransit.house}`);
  } else {
    // Fallback: generic house context
    const houseTheme = getHouseInsightPhrase(dominantTransit.house);
    insights.push(`${card.name} is activating your ${dominantTransit.house}${ordinal(dominantTransit.house).slice(-2)} house—${houseTheme}.`);
    insightTypes.push(`house_${dominantTransit.house}_generic`);
  }

  // 4. SUPPORTING TRANSIT WEAVE (optional)
  if (supportingTransits.length > 0) {
    const supportingTransit = supportingTransits[0];
    let weaveTemplate: string | undefined;

    if (supportingTransit.transitingPlanet === 'mercury' &&
        supportingTransit.name.includes('retrograde')) {
      weaveTemplate = seededRandom(INSIGHT_TEMPLATES.supporting_transit.mercury_retrograde, seed + 3);
    } else if (supportingTransit.transitingPlanet === 'venus') {
      weaveTemplate = seededRandom(INSIGHT_TEMPLATES.supporting_transit.venus_transit, seed + 4);
    } else if (supportingTransit.transitingPlanet === 'mars') {
      weaveTemplate = seededRandom(INSIGHT_TEMPLATES.supporting_transit.mars_transit, seed + 5);
      weaveTemplate = fillTemplate(weaveTemplate, { CardName: card.name });
    }

    if (weaveTemplate) {
      insights.push(weaveTemplate);
      insightTypes.push(`supporting_${supportingTransit.transitingPlanet}`);
    }
  }

  // Combine 2-3 most relevant insights
  const selectedInsights = insights.slice(0, 3);
  const finalInsight = selectedInsights.join(' ');

  return {
    insight: finalInsight,
    insightTypes
  };
}

// Helper to format transit info for display
export function formatTransitInfo(transit: ActiveTransit): string {
  const daysRemaining = daysBetween(new Date(), transit.endDate);
  return `${transit.name} • ${transit.phase} phase • ${daysRemaining} days remaining`;
}
