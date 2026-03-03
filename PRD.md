# slow hour — product requirements document

**Status:** active development
**Last updated:** March 2026

---

## 1. overview

slow hour is a personal daily tarot app. It is quiet by design — no notifications by default, no social features, no streaks or gamification. Its core premise is that a single card, drawn once a day and reflected on, is more valuable than a feature-rich experience.

The app targets people who already have some relationship with tarot or self-reflection practices, and who are worn out by tools that demand attention rather than rewarding presence.

---

## 2. problem

Most tarot apps are built around volume: large card libraries, spread generators, extensive card descriptions, sharing features. They treat tarot as content.

slow hour treats tarot as a practice. The problem it solves is simple: people who want a daily ritual card draw have no app that gets out of the way and lets that moment be what it is.

Secondary problem: reflective journaling apps are often too structured (prompts, categories, word counts). slow hour gives you a blank field after your card and nothing else.

---

## 3. target user

**Primary:** people aged 20–40 who use tarot as a personal reflection tool, not for predictive readings. likely already journaling in some form. comfortable with minimal UIs. not necessarily "witchy" — could be secular, just drawn to the symbolism.

**Secondary:** people curious about tarot who want a low-pressure entry point. the onboarding is designed to feel personal enough to hook someone even if they've never drawn a card.

**Not the target:** people who want card meanings, spreads, community, or readings for others.

---

## 4. core experience

The full daily loop is:

1. Open the app
2. See the back of today's card (undrawn state)
3. Tap / click to reveal
4. Read the card — name, orientation (upright / reversed), artwork
5. Optionally write a reflection in the freeform text area
6. Close the app

On return visits the same day, the revealed card is shown directly — no re-draw.

The year view is an optional layer: a visual archive of every day you've drawn, accessible from the nav.

---

## 5. features

### 5.1 onboarding

A multi-step flow that runs once on first open.

| Step | Content |
|---|---|
| 0 | slow hour logo + "continue" — sets the tone |
| 1 | Name input — "what's your name? the one that feels most like you" |
| 2 | Birthdate, birth time (optional), birth location (optional) |
| 3 | Personalised welcome message (typewritten), then drag a card to begin |

The welcome message is generated from the user's astrological data:
- Sun sign + life path number (birthdate only)
- + Moon sign (if birth time given)
- + Rising sign (if birth time + location given)

Dragging the card to begin is intentional — it's a physical gesture that signals the start of the practice.

All data is stored in `localStorage`. Nothing is sent to a server.

**Desktop:** shown inside a device frame image (a phone with cards fanned behind it) to ground the experience visually.
**Mobile:** full-screen, no frame.

### 5.2 daily card

- One card per day, seeded deterministically from the user's birthdate and the current date (so the same user always gets the same card on the same day — it's "their" card for that day, not random each session)
- 78-card Rider-Waite-inspired deck
- Upright or reversed, weighted
- Card is locked after reveal — can't re-draw within the same day
- Shows: card artwork, card name, orientation label

### 5.3 reflection

- Freeform textarea below the revealed card
- No prompt, no word count, no save button — auto-saves to `localStorage` on change
- Shown as read-only on past-day card views
- Not shown if no reflection was written

### 5.4 year view

A visual log of every card drawn.

**Mobile:** 12 months stacked vertically, scrollable. Each month shows a standard calendar grid (Mon–Sun). Days with cards show the card image as a thumbnail; days without a card show an empty cell. Tapping a past card opens a bottom drawer with the full card and any written reflection. Tapping today's card navigates to the main card view.

**Desktop:** a flat horizontal grid of all days in the year, displayed as either a small card thumbnail (if drawn) or a thin vertical line (if not). Hover shows date and orientation. Labels for month starts appear above the grid. Clicking a day navigates to the card view.

### 5.5 navigation

Two-button top nav: **today** and **year**. Fixed to the top of the viewport with a blur backdrop.

---

## 6. design principles

**Quiet.** The UI does not ask for attention. No animations that fire without user action (except the card reveal). No badges. No prompts.

**Personal.** The onboarding goes further than most apps to feel like it knows you. The welcome message is the centrepiece — it should feel specific enough to be a little surprising.

**Handmade.** The type (Reenie Beanie) and the card assets give it a hand-drawn quality. The aesthetic is intentionally soft and analogue.

**No friction, no obligation.** No accounts, no logins, no data leaving the device. Nothing to maintain. If you don't open it for a month, the year view just has a gap.

---

## 7. technical constraints

- **No user accounts** — all state in `localStorage`. This means: data is device-specific, clearing browser data loses history, no cross-device sync.
- **No push notifications** — out of scope for now (NotificationSettings component exists but is not integrated).
- **Card seeding** — must be deterministic per user per day. Changing the seeding algorithm would change every user's historical cards, so it's effectively immutable once shipped.
- **Timezone** — daily card uses the user's local calendar date, not UTC, so "today" is always meaningful.

---

## 8. known issues / open questions

| Issue | Status |
|---|---|
| localStorage wipes all history if user clears browser data | Accepted for now — no backend planned |
| No cross-device sync | Won't fix without accounts |
| Astrological calculations (moon sign, rising) are approximations | Acceptable for the use case — not an astrology tool |
| NotificationSettings component built but not wired up | Parked — notifications are opt-in and low priority |

---

## 9. roadmap

Items below are possibilities, not commitments. slow hour should stay small.

### near-term
- [ ] PWA / add-to-home-screen support so it feels native on mobile
- [ ] Card meaning layer — optional, toggled, not shown by default
- [ ] Export year (e.g. download a PDF or image of the year view)

### maybe
- [ ] Notification opt-in — a single daily reminder, no content, just a nudge
- [ ] Themes — the current palette is fixed; a light / cream option could broaden appeal
- [ ] iCloud / local sync between devices (no server, just keychain or file)

### won't do
- Spread readings (multi-card)
- Social / sharing features
- Card marketplace or deck switching
- AI-generated card interpretations
- Subscription / monetisation (not the intent)

---

## 10. success metrics

slow hour is not optimised for growth metrics. Success looks like:

- Users who open it daily without needing a notification
- Low support burden (nothing to break, nothing to log in to)
- Word of mouth from people who just find it useful and quiet

If it needs numbers: daily active users who have drawn cards on 5+ of the last 7 days, without a notification prompt.

---

## 11. out of scope

- Multiple users on one device
- Multiple decks
- Reading history export (beyond the year view)
- Admin dashboard
- Analytics beyond what Vercel provides by default
