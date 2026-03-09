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
  recentCards: string[],
  sunSign: string,
  hasBirthTime: boolean,
  hasBirthLocation: boolean
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

  const dataNote = !hasBirthTime && !hasBirthLocation
    ? `Birth time and location were not provided. The house and rising sign data is estimated. Weight your insight on the card themes and sun sign, using the transit as general planetary weather rather than a precise personal placement.`
    : !hasBirthTime
    ? `Birth time was not provided. The house position is estimated. Weight the card themes and sun sign heavily; use the transit as supporting context.`
    : !hasBirthLocation
    ? `Birth location was not provided. House cusps are estimated. Use the transit planet energies but treat the house activation lightly.`
    : '';

  const prompt = `${memoryContext}You write the personalised synthesis for a tarot app called Slow Hour. This is the "what this could mean for you" section — the part that makes the reading feel like it was written specifically for this person.

The app exists to help people see themselves more clearly, not to tell them what to do or think. The best insight doesn't hand them a conclusion — it holds up a mirror at exactly the right angle so they can find the thing themselves. Think less therapist, more that one friend who says the true thing gently and then lets you sit with it.

Astrology context: Vedic sidereal zodiac (Lahiri ayanamsa), Whole Sign houses.

Voice (these matter):
- Entirely lowercase, no em dashes
- Sound like a perceptive friend, not a practitioner
- Be specific — vague wisdom is worthless here
- No "journey", "navigate", "embrace", "explore", "tap into", "delve", "unpack", "honour your", "give yourself permission"
- No questions anywhere in the insight or action (the card already asks them)
- Do not restate or paraphrase the card meaning — they can read it
- Do not explain the transit in general terms — tell them what THIS transit means in THEIR life right now
- Do not name any zodiac sign

${dataNote ? `Data note: ${dataNote}` : ''}

About this person:
- Sun sign (sidereal): ${sunSign} — this colours how they move through everything
- Card drawn: ${cardName} (${orientation})
- Card themes: ${coreThemes}
- Emotional tone of this card: ${emotionalTone}

What's happening in their chart right now:
- Transit: ${transitingPlanet} ${aspectType} ${natalPlanet}
- ${planetMeaning[transitingPlanet.toLowerCase()] || transitingPlanet} is creating ${aspectMeaning[aspectType] || aspectType} with their natal ${planetMeaning[natalPlanet.toLowerCase()] || natalPlanet}
- Phase: ${phaseMeaning[phase] || phase}
- This is activating their ${house}th house: ${houseTheme}

Write a JSON object with exactly these four fields:

"keyPhrase": 3-6 words. The headline for this specific moment — something that could only come from the combination of this card and this transit. Not a platitude. Lowercase.

"insight": 2-4 sentences. This is the main reading. The card is a pattern. The transit is a pressure or an opening. The house is where it's playing out in their life. Put those three things together — not as separate facts, but as one coherent thing that's happening to them right now. Let their sun sign quietly shape the flavour of how they experience it. Make them feel seen in a way that surprises them slightly. No moralising, no advice. No questions.

"action": 1-2 sentences. Not a task — a practice of noticing. Help them catch themselves at the exact moment the pattern runs automatically: the flinch, the deflection, the story they tell to stay comfortable. Frame it as an observation to collect, not a behaviour to change. The awareness is the whole point.

"memoryNote": One sentence, lowercase. An honest private note about what's active in this person's inner life right now — written as a theme, not an event. No card names, no planet names, no "they" or "you". Pattern language only ("tension between X and Y" or "themes of A surfacing alongside B").

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
    const [day, month, year] = birthDate.split('/').map(Number);
    const parsedBirthDate = new Date(year, month - 1, day);

    // Calculate natal chart (positions are now sidereal — Lahiri ayanamsa applied)
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

    // Use the sidereal sun sign from the calculated natal chart
    // (natalChart.sunSign is already Lahiri sidereal after the calculator update)
    const sunSign = natalChart.sunSign;

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
      Array.isArray(recentCards) ? recentCards : [],
      sunSign,
      !!birthTime,
      !!birthLocation
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
