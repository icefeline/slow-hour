# CLAUDE.md — slow hour

slow hour is a meditative daily tarot app for self-reflection. not prediction, not advice — it helps you notice what's already moving in you. one card per day, personalised to your natal chart and current astrological transits, with a short AI-generated insight and a "try this" prompt for quiet attention.

---

## philosophy

- reflection over prediction: never tell the user what will happen or what they should do
- noticing over prescribing: the "try this" action is about paying attention, not changing behaviour
- tone: lowercase, conversational, intimate — like a letter from a thoughtful friend, not a self-help app
- privacy-first: all data stays in localStorage. no accounts, no servers, no tracking

---

## tech stack

- **Next.js 15** (App Router, Turbopack in dev)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **@anthropic-ai/sdk** — insight generation via `claude-haiku-4-5-20251001`
- **astronomy-engine** — natal chart + transit calculations (Vedic sidereal, Lahiri ayanamsa)
- **@upstash/redis + @upstash/ratelimit** — rate limiting (5 readings/day)
- **@vercel/analytics** — usage analytics

---

## design system

### colours
| token | hex | use |
|---|---|---|
| background | `#172211` | main app bg |
| accent | `#CEF17B` | buttons, highlights, "continue" |
| soft blue | `#E1EEFC` | secondary text, insight labels |
| white | `#FFFFFF` | card text, headings |

never use raw hex values in components — use Tailwind classes mapped to these. if a colour isn't in the design system, ask before adding it.

### typography
- **Reenie Beanie** — handwritten feel, used for headings, card names, UI labels
- **VT323** — monospace pixel font, used for the year calendar view
- body text inherits system sans; keep it minimal

### motion
- card reveal is the centrepiece animation — don't compete with it
- transitions should feel slow and intentional, not snappy
- use `transition-all duration-700` or slower as default

---

## directory structure

```
app/
  api/
    calculate-transit/   # generates AI insight + astrology data
    daily-card/          # date-seeded card selection
    geocode-check/       # birth location lookup
  components/
    TarotCard.tsx        # main card display + reveal animation
    ActiveInsight.tsx    # "what this could mean for you" section
    CardDrawer.tsx       # bottom sheet for past card details
    CardSelector.tsx     # manual card selection UI
    Onboarding.tsx       # welcome flow (name → birthdate → gesture tutorial)
    OnboardingScreens.tsx
    NotificationSettings.tsx
    YearView.tsx         # full-year calendar of all draws
    card-icons/          # SVG icon sets per arcana
  page.tsx               # root — card view + year view toggle

lib/
  data/
    tarot-deck.ts        # all 78 cards: names, meanings, keywords (~92KB)
    card-archetypes.ts   # deep interpretations per card
    insight-structure-templates.ts  # transit + insight generation templates
    house-contexts.ts    # astrological house meanings
  types/
    tarot.ts             # Suite, TarotCard, DailyReading interfaces
  utils/
    astrology-calculator.ts

public/
  cards/                 # card images
```

---

## localStorage schema

all user data lives in localStorage. no backend persistence.

| key | type | description |
|---|---|---|
| `slow-hour-user` | `{ name, birthDate, birthTime?, birthLocation?, sunSign }` | user profile from onboarding |
| `slow-hour-readings` | `DailyReading[]` | full history of all card draws |
| `slow-hour-memory` | `string[]` | last 10 AI-generated memoryNotes for personalisation |
| `slow-hour-insight-[date]-[cardId]` | `ClaudeInsight` | cached insight per card per date |

---

## AI integration

### insight generation (`/api/calculate-transit`)

1. receives: `{ userId, birthDate, birthTime?, birthLocation?, cardId, isReversed, memoryNotes, recentCards }`
2. calculates natal chart + active transits via `astronomy-engine`
3. calls `claude-haiku-4-5-20251001` with a prompt combining card archetype + transit data + house theme + user's sun sign
4. returns `ClaudeInsight`:
   - `keyPhrase` — 3–6 word headline
   - `insight` — 2–4 sentences (the main personalised reading)
   - `action` — 1–2 sentences (noticing practice, not behaviour change)
   - `memoryNote` — private pattern note stored for future personalisation

### voice (planned — ElevenLabs)

the `insight` text (and optionally `keyPhrase`) will be voiced via ElevenLabs TTS. a play button in `ActiveInsight.tsx` triggers it on demand, never autoplay. audio URL cached alongside insight in localStorage.

**voice guidelines:**
- slow, warm, slightly intimate register — like a tarot reader, not an assistant
- voice ID and stability/similarity settings to be finalised via ElevenLabs MCP
- only `insight` text gets voiced by default — not `action` or transit details
- env var: `ELEVENLABS_API_KEY`

---

## writing tone rules

these apply to AI prompts, UI copy, and any new card meanings:

- always lowercase for UI labels and headings
- never say "you will", "you should", "you need to" — only "you might notice", "there may be"
- the card doesn't predict — it reflects something already present
- avoid self-help clichés: "lean into", "embrace", "step into your power"
- the `action` field is a noticing practice — "notice when...", "pay attention to..." — not a to-do
- keep `insight` under 60 words; it will eventually be read aloud

---

## development commands

```bash
npm run dev       # dev server on :3000 (Turbopack)
npm run build     # production build
npm run lint      # ESLint
npm test          # Jest
npm run test:watch
```

---

## environment variables

```
ANTHROPIC_API_KEY        # required — Claude insight generation
UPSTASH_REDIS_REST_URL   # required — rate limiting
UPSTASH_REDIS_REST_TOKEN # required — rate limiting
ELEVENLABS_API_KEY       # planned — voice feature
```

---

## MCP setup (for contributors)

connect these MCPs to unlock the full development workflow:

### ElevenLabs MCP
for browsing + previewing voices during voice feature development.
```
npx @elevenlabs/mcp
```
requires `ELEVENLABS_API_KEY`.

### GitHub MCP
for managing issues, PRs, and releases without leaving Claude.
```
npx @modelcontextprotocol/server-github
```
requires a GitHub personal access token with repo scope.

### Vercel MCP
for deployment previews, build logs, and env var management.
```
npx @vercel/mcp-adapter
```
requires a Vercel token.

---

## community notes

- skills live in `.claude/skills/` — portable, no secrets
- hooks live in `.claude/settings.local.json` — not committed, configure locally
- MCP credentials are personal — see MCP setup above
- the tarot deck (`lib/data/tarot-deck.ts`) always has exactly 78 cards — don't add or remove entries without a card count check
- astrology uses Vedic sidereal (Lahiri ayanamsa), not Western tropical — this is intentional
