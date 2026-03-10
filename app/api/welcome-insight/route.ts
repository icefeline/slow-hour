import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

function getSunSignApprox(dateStr: string): string {
  const [day, month] = dateStr.split('/').map(Number);
  const m = month; const d = day;
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'aries';
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'taurus';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'gemini';
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'cancer';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'leo';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'virgo';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'libra';
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'scorpio';
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'sagittarius';
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'capricorn';
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'aquarius';
  return 'pisces';
}

function getLifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/\//g, '').split('').map(Number);
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, d) => acc + d, 0);
  }
  return sum;
}

// Qualities rather than labels — Claude should describe the energy, not name the sign
const sunSignQualities: Record<string, string> = {
  aries: 'initiating fire energy — moves first, processes internally, carries more weight than it shows',
  taurus: 'grounded earth steadiness — holds things together for others, needs far more than it asks for',
  gemini: 'dual-natured air intelligence — quick on the surface, goes much deeper underneath',
  cancer: 'absorptive water depth — takes on weight that isn\'t always its own, old patterns underneath current feelings',
  leo: 'radiant fire warmth — more tender than the confidence suggests, needs to be seen in softness not just strength',
  virgo: 'discerning earth attention — catches what others miss, processes feeling through precision',
  libra: 'relational air grace — holds everyone in balance, often disappears in the effort of it',
  scorpio: 'penetrating water perception — already sensing what hasn\'t been said, all-in or completely shut',
  sagittarius: 'expansive fire searching — always moving toward meaning, discomfort with standing still',
  capricorn: 'structural earth composure — carries enormous invisible pressure, rarely lets the effort show',
  aquarius: 'observing air detachment — feels things deeply while keeping distance, slightly outside the frame',
  pisces: 'porous water sensitivity — absorbs the world around it, feels for itself and everyone else at once',
};

const lifePathMeanings: Record<number, string> = {
  1: 'a path of leading, often alone',
  2: 'a path of bridging — building connection, sometimes at the cost of their own voice',
  3: 'a path of expression — things fester when held in',
  4: 'a path of building structure that others rely on',
  5: 'a path of freedom — figuring out how to commit without losing themselves',
  6: 'a path of care — learning where love ends and self-erasure begins',
  7: 'a path of depth — surface anything is uncomfortable',
  8: 'a path of legacy — real strength isn\'t control',
  9: 'a path of release — always finishing cycles before others are ready to',
  11: 'a master path of sensitivity — picks up frequencies others can\'t hear',
  22: 'a master path of building something large and lasting',
  33: 'a master path of healing presence — people feel it before they speak',
};

export async function POST(request: Request) {
  try {
    const { name, birthDate, birthTime, birthLocation } = await request.json();

    if (!birthDate) {
      return NextResponse.json({ error: 'Birth date required' }, { status: 400 });
    }

    const sunSign = getSunSignApprox(birthDate);
    const lifePathNumber = getLifePathNumber(birthDate);
    const hasBirthTime = birthTime && birthTime.trim().length > 0;
    const hasBirthLocation = birthLocation && birthLocation.trim().length >= 2;

    const dataContext = hasBirthTime && hasBirthLocation
      ? `full chart context — birth date, time (${birthTime}), and location (${birthLocation}) all provided. moon, rising, and houses are calculable.`
      : hasBirthTime
      ? `birth date and time provided — moon is calculable, rising estimated, houses limited`
      : hasBirthLocation
      ? `birth date and location provided — no birth time, so sun sign and life path are the main anchors, with location adding geographic depth`
      : `birth date only — sun sign quality and life path number are the primary anchors`;

    const apiKey = process.env.SLOW_HOUR_ANTHROPIC_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = `You write the welcome message for a tarot app called Slow Hour. Someone has just entered their birth details. This is the first thing they read — 3-4 sentences that feel like the app actually looked at their data and found something true about them. It should open toward their first card draw.

Voice (strict):
- Entirely lowercase, no em dashes, no exclamation marks
- Sound like a perceptive friend who just glanced at their chart — not a practitioner, not a chatbot
- Vary sentence openings intentionally — no two sentences may start with the same word. Absolutely no sentence may start with "you" — use alternatives like "there's", "something in", "a lot of what", "for someone with", "in someone like", "what shows up", "the pattern here", "most of", "some of what"
- Be specific to their actual placements — not generic horoscope copy
- 3-4 sentences total, 55-75 words
- The final sentence should be brief (5-8 words) and gesture quietly toward the card draw — low-key, not instructional
- No zodiac sign names — describe the quality, not the label
- No: "journey", "navigate", "embrace", "explore", "tap into", "delve", "unpack", "honour", "give yourself permission", "resonate"
- No questions

Name: ${name}
Sun sign quality (sidereal): ${sunSignQualities[sunSign]}
Life path: ${lifePathMeanings[lifePathNumber] || lifePathNumber}
Data context: ${dataContext}

Write only the message. No labels, no JSON, no preamble.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
    }

    return NextResponse.json({ message: content.text.trim() });
  } catch (error) {
    console.error('Welcome insight error:', error);
    return NextResponse.json({ error: 'Failed to generate welcome message' }, { status: 500 });
  }
}
