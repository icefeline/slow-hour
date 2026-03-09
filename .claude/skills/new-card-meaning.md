# /new-card-meaning

Update or add a card's meaning in the tarot deck data.

## steps

1. Ask: which card? (name or ID) and upright or reversed or both?
2. Read the current entry in `lib/data/tarot-deck.ts` for that card
3. Read the matching entry in `lib/data/card-archetypes.ts` if it exists
4. Show the current meaning(s) and ask what should change — or if it's a new card, what the meaning should be
5. Apply the edit, following the existing data structure exactly
6. After editing, run this check:
   ```
   node -e "const deck = require('./lib/data/tarot-deck.ts'); console.log(Object.keys(deck).length, 'cards')"
   ```
   If the count isn't 78, stop and flag it before continuing.

## tone rules for card meanings
- lowercase throughout
- no "you will" — use "there may be", "this can point to", "you might notice"
- upright meanings: 2–3 sentences covering the core theme
- reversed meanings: don't just negate the upright — describe a different expression (blocked, internalised, or excessive)
- keywords: 3–5 per orientation, nouns or short phrases, not adjectives alone
- avoid: "journey", "embrace", "transformation" as standalone clichés — be specific to the card

## what not to change
- card IDs (they're used as keys throughout the app)
- the data structure shape — don't add or remove fields without broader discussion
- suite names: `major`, `cups`, `wands`, `swords`, `pentacles`
