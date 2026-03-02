import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { calculateNatalChart, calculateActiveTransits, getDominantTransit } from '@/lib/utils/astrology-calculator';
import { getCardArchetype, cardArchetypes } from '@/lib/data/card-archetypes';

const HOUSE_THEMES: Record<number, string> = {
  1: 'identity and how you show up',
  2: 'self-worth and resources',
  3: 'voice, communication, and learning',
  4: 'home, roots, and foundation',
  5: 'creativity, play, and joy',
  6: 'work, health, and daily life',
  7: 'relationships and partnerships',
  8: 'transformation, intimacy, and shared power',
  9: 'beliefs, meaning, and expansion',
  10: 'career, legacy, and public life',
  11: 'community, future, and belonging',
  12: 'inner world, patterns, and solitude',
};

interface ClaudeInsight {
  keyPhrase: string;
  insight: string;
  action: string;
  memoryNote: string;
}

async function generateClaudeInsight(
  cardId: string,
  isReversed: boolean,
  transitingPlanet: string,
  natalPlanet: string,
  aspectType: string,
  phase: string,
  house: number,
  memoryNotes: string[],
  recentCards: string[]
): Promise<ClaudeInsight | null> {
  const cardArchetype = getCardArchetype(cardId, isReversed);
  if (!cardArchetype) return null;

  const orientation = isReversed ? 'reversed' : 'upright';
  const cardName = cardArchetypes[cardId]?.name || cardId;
  const houseTheme = HOUSE_THEMES[house] || 'life';
  const coreThemes = cardArchetype.coreThemes.join(', ');
  const emotionalTone = cardArchetype.emotionalTone;

  const aspectMeaning: Record<string, string> = {
    square: 'tension and friction demanding action',
    opposition: 'polarity pulling in two directions',
    conjunction: 'energies merging and intensifying',
    trine: 'natural flow and ease',
    sextile: 'opportunity opening up',
  };

  const planetMeaning: Record<string, string> = {
    saturn: 'structure, limits, and what\'s actually real',
    jupiter: 'expansion, meaning, and opportunity',
    uranus: 'sudden change, disruption, and authenticity',
    neptune: 'dissolution, intuition, and what\'s unseen',
    pluto: 'power, transformation, and what can\'t be avoided',
    mars: 'will, action, and urgency',
    sun: 'identity and life force',
    moon: 'emotion and instinct',
    mercury: 'mind and communication',
    venus: 'love and values',
  };

  const phaseMeaning: Record<string, string> = {
    approaching: 'building in intensity',
    peak: 'exact and at full strength right now',
    separating: 'easing but still integrating',
    beginning: 'just starting to form',
    integration: 'settling into you',
  };

  // Build the memory context block if we have history
  let memoryContext = '';
  if (memoryNotes.length > 0 || recentCards.length > 0) {
    memoryContext = `Background on this person — use this only to deepen your understanding of their current arc. Do not reference it directly. Do not say "as I've noticed", "you've been dealing with", or anything that signals you remember past readings. Let it quietly inform your accuracy and sensitivity.

${memoryNotes.length > 0 ? `Recent patterns:\n${memoryNotes.map(n => `- ${n}`).join('\n')}` : ''}
${recentCards.length > 0 ? `\nCards drawn recently: ${recentCards.join(', ')}` : ''}

`;
  }

  const prompt = `${memoryContext}You generate tarot reading synthesis for an app called Slow Hour. Your job is to write the "what this means for you" section.

Voice rules (never break these):
- Write entirely lowercase
- No em dashes
- No questions at the end (the card already asks questions)
- Sound like a perceptive friend who really knows you, not a therapist or AI
- No words like "journey", "navigate", "embrace", "explore", "tap into", "delve", "unpack", "it's okay to", "honor your", "give yourself permission"
- No filler affirmations. Be specific and real
- Don't explain the card meaning back to them (they can read it)
- Don't explain what the transit "means" in general. Say what it means for THEM right now
- Short, direct sentences. No fluff

Card: ${cardName} (${orientation})
Card themes: ${coreThemes}
Emotional tone: ${emotionalTone}

Current transit: ${transitingPlanet} ${aspectType} ${natalPlanet}
Transit meaning: ${planetMeaning[transitingPlanet.toLowerCase()] || transitingPlanet} creating ${aspectMeaning[aspectType] || aspectType} with ${planetMeaning[natalPlanet.toLowerCase()] || natalPlanet}
Phase: ${phase} (${phaseMeaning[phase] || phase})
House activated: ${house} (${houseTheme})

Write a JSON object with exactly these four fields:

"keyPhrase": 3-6 words. The headline for this moment. Lowercase. Something specific to BOTH the card and the transit together, not just one or the other.

"insight": 2-3 sentences. What's actually happening for this person given BOTH the card AND the transit. Be specific about the combination. Don't explain the card or the transit separately. Say what the collision between them means. No questions. No affirmations.

"action": 1-2 sentences. A neuroplasticity-style practice of noticing. Not a task to complete, but something to pay attention to or catch in the moment. Like: "notice the moment you reach for distraction instead of sitting with it." or "catch the first thought that comes up when someone challenges your plan." The observation itself is the practice.

"memoryNote": Exactly one sentence, lowercase. A quiet observation about what's surfacing in this person's inner life right now — written as a pattern description, not an event. Do not mention card names or planet names. Do not use "they" or "you". Write it as an observation about a theme ("themes of X are coexisting with Y" or "tension between A and B is the active current"). This note is private and will inform future readings.

Return only valid JSON, no markdown, no extra text.`;

  const apiKey = process.env.SLOW_HOUR_ANTHROPIC_KEY;
  if (!apiKey) {
    console.error('SLOW_HOUR_ANTHROPIC_KEY not set');
    return null;
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') return null;

    // Strip markdown code fences if Claude wrapped the JSON
    const rawText = content.text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(rawText) as ClaudeInsight;

    // Basic validation
    if (!parsed.keyPhrase || !parsed.insight || !parsed.action) return null;

    return parsed;
  } catch (error) {
    console.error('Claude insight generation failed:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { birthDate, birthTime, birthLocation, seed, cardId, isReversed, memoryNotes, recentCards } = await request.json();

    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      );
    }

    // Parse birth date
    const [month, day, year] = birthDate.split('/').map(Number);
    const parsedBirthDate = new Date(year, month - 1, day);

    // Calculate natal chart
    const natalChart = await calculateNatalChart(
      parsedBirthDate,
      birthTime || undefined,
      birthLocation || undefined
    );

    if (!natalChart) {
      return NextResponse.json(
        { error: 'Failed to calculate natal chart' },
        { status: 500 }
      );
    }

    // Calculate current active transits
    const activeTransits = await calculateActiveTransits(natalChart);

    // Get the most relevant transit for this card (affinity-weighted, seed for tie-breaking)
    const dominantTransit = getDominantTransit(activeTransits, seed, cardId);

    if (!dominantTransit) {
      return NextResponse.json(
        { error: 'No active transits found' },
        { status: 404 }
      );
    }

    // Generate Claude insight (with memory context if available)
    const claudeInsight = await generateClaudeInsight(
      cardId,
      isReversed || false,
      dominantTransit.transitingPlanet,
      dominantTransit.natalPlanet,
      dominantTransit.aspect,
      dominantTransit.phase,
      dominantTransit.house,
      Array.isArray(memoryNotes) ? memoryNotes : [],
      Array.isArray(recentCards) ? recentCards : []
    );

    return NextResponse.json({
      dominantTransit,
      allTransits: activeTransits,
      claudeInsight,
    });
  } catch (error) {
    console.error('Transit calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate transit' },
      { status: 500 }
    );
  }
}
