# Active Insights System - Architecture & Implementation

## Overview

The Active Insights system generates personalized, emotionally intelligent insights for each tarot card draw based on the user's current astrological transits, draw history, and house placements. This ensures that even when users draw the same card multiple times during a transit, they receive fresh, contextually relevant wisdom.

## Problem Solved

**Challenge**: Users may draw the same tarot card repeatedly during long transits (30-90 days). Reading the same static interpretation loses value quickly.

**Solution**: Add dynamic "active insights" that change based on:
- Where they are in their transit (beginning → peak → integration)
- How many times they've drawn this card during the transit
- Which astrological house is being activated
- Supporting transits that add nuance (Mercury Rx, Venus, Mars, etc.)

## Architecture

### Core Components

```
lib/
├── types/
│   └── astrology.ts          # TypeScript types for transits, charts, draws
├── data/
│   ├── insight-templates.ts   # Emotionally intelligent insight library
│   ├── card-house-insights.ts # Card-specific house placement wisdom
│   └── mock-transits.ts       # Mock data for prototyping (remove in production)
└── utils/
    └── insight-generator.ts   # Core logic for generating active insights
```

### Data Flow

```
User Chart + Current Date
         ↓
Calculate Daily Transits (dominant + supporting)
         ↓
Determine Which Card to Draw (transit → card mapping)
         ↓
Get User's Draw History (for this specific transit)
         ↓
Generate Active Insight
    • Transit phase context
    • Repetition awareness
    • House placement
    • Supporting transit weave
         ↓
Display: Card Meaning + Active Insight
```

## Key Features

### 1. Transit Phase Awareness

Each transit progresses through phases based on orb (distance from exact):

| Phase | Orb Range | Tone |
|-------|-----------|------|
| **Beginning** | 5°+ | Preparation, early awareness |
| **Approaching** | 3-5° | Building intensity, trust what's surfacing |
| **Peak** | <1° | Maximum intensity, presence, the work itself |
| **Separating** | 1-3° | Relief, noticing what's shifted |
| **Integration** | 3-5° separating | Harvest, reflection, taking it forward |

Example insights:
- Beginning: *"This Pluto square Moon is just beginning. The Tower arrives as preparation, not punishment."*
- Peak: *"You're at the heart of Saturn opposite Sun now. What The Hermit is showing you—this is the work."*
- Integration: *"As Neptune trine Moon separates, The Star asks: what are you taking forward from this?"*

### 2. Repetition Recognition

The system tracks how many times a user has drawn the same card during a single transit:

- **1st draw**: No repetition note, focus on transit + house
- **2nd draw**: Gentle acknowledgment (*"The Tower returns. Something here still needs your attention."*)
- **3rd+ draw**: Deepening language (*"This is the 3rd time The Tower has appeared. Notice: you're not where you were on day one."*)

This reframes repetition as **deepening** rather than redundancy.

### 3. House Placement Context

Each card has specific insights written for different houses:

```typescript
'tower': {
  4: "The Tower in your 4th house—foundations, family, the private self.
      What's crumbling isn't your enemy. It's making space for what's true.",
  10: "The Tower in your 10th house—your public life, your legacy.
       The world's version of you is being revised."
}
```

Currently implemented for major cards: Tower, Hermit, Death, Fool, Devil, Star, Moon, Sun, Wheel of Fortune, Temperance.

### 4. Supporting Transit Weaving

When multiple transits are active, the system can weave in secondary context:

- **Mercury Retrograde**: *"With Mercury retrograde, notice what's being said—and what's finally being heard."*
- **Venus transits**: *"Venus whispers through this: there's beauty even in the breaking."*
- **Mars transits**: *"Mars energy is here too. Sometimes the fight is staying present, not charging forward."*

## Example Output

### Scenario: 2nd Draw of The Tower During Pluto Square Moon (Peak Phase)

**Card Meaning** (static):
> Upheaval reveals truth. Everything that felt solid is being shaken...

**Active Insight** (dynamic):
> The Tower returns. Something here still needs your attention. Pluto square Moon is at maximum intensity. The intensity you feel isn't wrong. The Tower is here to help you metabolize it. The Tower in your 4th house—foundations, family, the private self. What's crumbling isn't your enemy. It's making space for what's true.

**Insight breakdown**:
1. ✅ Repetition awareness (2nd draw)
2. ✅ Transit phase (peak)
3. ✅ House placement (4th house)

## Orb Recommendations

Based on astrological best practices:

### Orb Tolerance by Planet

| Planet Type | Active Orb | Peak Orb |
|-------------|-----------|----------|
| **Outer Planets** (Saturn, Uranus, Neptune, Pluto) | 6-8° | <1° |
| **Social Planets** (Jupiter, Saturn) | 5-7° | <1° |
| **Personal Planets** (Sun, Moon, Mercury, Venus, Mars) | 3-5° | <0.5° |

**Recommendation**: Use **6° orb for outer planets** and **3° for personal planets** to define "active" transits.

## Implementation Roadmap

### ✅ Phase 1: Prototype (Complete)
- [x] Type definitions for astrology data
- [x] Mock transit data for testing
- [x] Insight template library (60+ templates)
- [x] Card-house insights for 10 major cards
- [x] Insight generation logic
- [x] Demo script showing all scenarios

### 🔄 Phase 2: Real Ephemeris Integration (Next)
- [ ] Install Swiss Ephemeris (`swisseph` npm package)
- [ ] Build transit calculator
  - [ ] Calculate planetary positions for any date
  - [ ] Compare to natal positions
  - [ ] Identify aspects within orb
  - [ ] Determine transit phase
- [ ] Create transit → card mapping system
- [ ] Deterministic daily card selection

### 📋 Phase 3: Complete Card Library
- [ ] Write house insights for all 78 cards
- [ ] Add rising sign nuances (optional)
- [ ] Expand supporting transit templates

### 🎨 Phase 4: UI Integration
- [ ] Add "Active Insight" section to card page
- [ ] Visual transit timeline
- [ ] Draw history tracking
- [ ] Journal integration

## Technical Decisions

### House System: Placidus
Using Placidus house system as it's the most widely used in Western astrology and what most users expect.

### Why Not AI/LLM for Generation?
**Decision**: Use rule-based template selection, NOT generative AI.

**Reasoning**:
- ✅ Maintain consistent emotionally intelligent tone (your voice)
- ✅ Predictable, debuggable output
- ✅ No API costs or latency
- ✅ Templates can be refined and version-controlled
- ✅ Users get the wisdom you intentionally wrote, not AI paraphrasing

AI could be used later for:
- Making template language more fluid (offline processing)
- Generating new template variations for review
- But **logic should always be rule-based**, not AI-decided

### Data Storage
**Current**: Mock data
**Production**: Need to store:
- User natal chart (from onboarding)
- Daily card draws with transit IDs
- Journal entries

Recommended stack:
- **Supabase** (PostgreSQL + Auth)
- **Vercel KV** for caching ephemeris calculations

## Testing the System

Run the demo script to see all scenarios:

```bash
npx tsx scripts/demo-insights.ts
```

This shows:
1. First draw (no repetition)
2. Second draw (repetition awareness)
3. Peak transit with supporting transit
4. Multiple repetitions (3rd+ draw)
5. Integration phase (separating transit)

## Next Steps

1. **Choose ephemeris approach**: Install `swisseph` and build transit calculator
2. **Expand card library**: Write house insights for remaining 68 cards
3. **Build transit → card mapping**: Define which transits trigger which cards
4. **UI design**: Sketch how active insights appear on card page
5. **User testing**: Validate that insights feel personalized and valuable

## Files Reference

- `lib/types/astrology.ts` - All TypeScript types
- `lib/data/insight-templates.ts` - Template library (60+ insights)
- `lib/data/card-house-insights.ts` - Card-specific house wisdom
- `lib/utils/insight-generator.ts` - Core generation logic
- `scripts/demo-insights.ts` - Working demo
- `lib/data/mock-transits.ts` - Test data (remove in production)
