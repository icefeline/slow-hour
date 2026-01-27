# Active Insight UI Mockup

## Card Page Layout (After Drawing)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    [Card Image]                         │
│                    The Tower                            │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Card Meaning                                           │
│                                                         │
│  Upheaval reveals truth. What feels like collapse is   │
│  actually exposure—systems, beliefs, relationships      │
│  that were never as solid as you thought. This is not   │
│  punishment. This is clarity arriving with force.       │
│  Where in your life have you been building on shaky     │
│  ground? What illusion is being shattered so you can    │
│  see what's real?                                       │
│                                                         │
│  The Tower comes when something must fall so            │
│  something truer can rise. Notice where you're          │
│  clinging to structures, internal or external, that     │
│  no longer serve you. What are you defending that's     │
│  already crumbling? Sometimes the kindest thing the     │
│  universe can do is let the false foundation break      │
│  so you can finally build on truth.                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ⚡ What does this mean for you?                        │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Pluto square Moon is almost exact. The Tower is        │
│  here to help you name what you're feeling before       │
│  it names you. The Tower in your 4th house,             │
│  foundations and family. What's crumbling isn't         │
│  your enemy. It's making space for what's true.         │
│                                                         │
│  Saturn opposite Sun • peak phase • 42 days remaining   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Journal Prompt                                         │
│                                                         │
│  What foundation in my life is being asked to           │
│  transform?                                             │
│                                                         │
│  [Text area for journaling]                             │
│                                                         │
│                                      [Save Entry]       │
└─────────────────────────────────────────────────────────┘
```

---

## Visual Design Notes

### The "What does this mean for you?" Container

**Styling (similar to Strava's Athlete Intelligence)**:
- Subtle border (`border-neutral-200` light mode, `border-neutral-800` dark mode)
- Light background fill (`bg-neutral-50` light, `bg-neutral-900/50` dark)
- Rounded corners (`rounded-lg`)
- Comfortable padding (`p-6`)
- Small lightning bolt icon (⚡) or similar to indicate "personalized insight"

**Typography**:
- Header: `text-sm font-semibold`
- Body text: `text-sm leading-relaxed` for readability
- Transit info footer: `text-xs text-neutral-500` (subtle)

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  [Icon]  What does this mean for you?           │
│          ────────────────────────────────────   │
│                                                 │
│          [Insight text here, 2-3 sentences]     │
│                                                 │
│          ─────────────────────────────────────  │
│          Transit info • Phase • Days remaining  │
└─────────────────────────────────────────────────┘
```

### Color Scheme Ideas

**Option 1: Purple Accent** (mystical, tarot-themed)
- Icon: `text-purple-600` / `dark:text-purple-400`
- Border hover: `hover:border-purple-300`

**Option 2: Gold Accent** (celestial, astrological)
- Icon: `text-amber-600` / `dark:text-amber-400`
- Border: `border-amber-200` / `dark:border-amber-900`

**Option 3: Minimal Neutral** (clean, Strava-like)
- Just use neutral colors throughout
- Let the content be the focus

---

## Component Usage Example

```tsx
import { ActiveInsight } from '@/app/components/ActiveInsight';

// In your card page component
<ActiveInsight
  insight="Pluto square Moon is almost exact. The Tower is here to help you name what you're feeling before it names you. The Tower in your 4th house, foundations and family. What's crumbling isn't your enemy. It's making space for what's true."
  transitInfo="Pluto square Moon • approaching • 58 days remaining"
/>
```

---

## Mobile Considerations

- Container should have good touch targets
- Text should remain readable at `text-sm`
- Consider collapsible transit info on very small screens
- Icon should be visible but not dominant

---

## Alternative: Expandable Detail

For users who want more context:

```
┌─────────────────────────────────────────────────────────┐
│  ⚡ What does this mean for you?                        │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Pluto square Moon is almost exact. The Tower is        │
│  here to help you name what you're feeling before       │
│  it names you. The Tower in your 4th house,             │
│  foundations and family. What's crumbling isn't         │
│  your enemy. It's making space for what's true.         │
│                                                         │
│  [▼ About this transit]                                 │
│                                                         │
│  When expanded:                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Your Pluto square Moon transit                    │ │
│  │                                                   │ │
│  │ [========●========]                               │ │
│  │ Day 32 of 90                                      │ │
│  │                                                   │ │
│  │ Started: Jan 1, 2026                              │ │
│  │ Peak: Feb 15, 2026 (exact in 14 days)            │ │
│  │ Ends: Apr 30, 2026                                │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

This gives power users more astrological detail without overwhelming the main experience.

---

## Accessibility

- Use semantic HTML (`<section>`, `<h3>` for header)
- Ensure color contrast meets WCAG AA standards
- Icon should have `aria-label="Personalized insight"`
- Consider `aria-live="polite"` for dynamic updates

---

## Animation Ideas (Optional)

- Subtle fade-in when the card is revealed
- Gentle border glow on first render to draw attention
- Smooth collapse/expand for transit details

Keep it minimal and respectful of user preference for reduced motion.
