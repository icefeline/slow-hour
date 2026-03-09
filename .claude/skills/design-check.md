# /design-check

Verify that a component follows the slow hour design system.

## steps

1. Ask: which component to check? Or check all recently edited files?
2. Read the component file(s)
3. Check against each rule below and report pass/fail for each

## checks

### colours
- [ ] No raw hex values (e.g. `#172211`, `#CEF17B`, `#E1EEFC`) — use Tailwind classes
- [ ] Background: `bg-[#172211]` or CSS variable equivalent
- [ ] Accent: `bg-[#CEF17B]` or `text-[#CEF17B]` for the yellow-green
- [ ] Soft blue: `text-[#E1EEFC]` for secondary labels
- [ ] No purples, golds, or deep blues — those are not in this palette

### typography
- [ ] Headings and UI labels use `font-[Reenie_Beanie]` or the correct font class
- [ ] Calendar/grid view uses `font-[VT323]`
- [ ] No inline `font-size` styles — use Tailwind size classes

### motion
- [ ] Card reveal animation isn't overridden or competing with new animations
- [ ] Transitions use `duration-700` or slower (nothing below `duration-300` unless it's a micro-interaction)
- [ ] No `transition: all` with short durations on large layout elements

### copy / tone
- [ ] All visible UI text is lowercase
- [ ] No "you will", "you should", "you need to" — check static strings
- [ ] Labels feel like slow hour ("what this could mean for you", "try this") not generic ("insights", "recommendations")

### responsiveness
- [ ] Mobile layout tested first
- [ ] Desktop uses the device frame wrapper (not full-width layout)

## output format
List each check with ✓ or ✗ and a brief note. If anything fails, suggest the specific fix.
