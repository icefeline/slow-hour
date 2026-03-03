# slow hour

A quiet daily tarot app. One card a day, a space to reflect, a year to look back on.

---

## what it is

slow hour is a personal tarot companion built for people who want a moment of stillness each day — not a rushed reading, not a feed, just a single card and whatever it surfaces.

You draw once a day. You can write a reflection. At the end of the year, you have a quiet archive of where you've been.

---

## features

- **daily card** — one tarot card per day, seeded to your birthdate for a touch of personalisation. upright or reversed.
- **reflection** — a freeform space to write after your draw. no prompts, no structure.
- **year view** — a full-year calendar of every card you've drawn. scrollable on mobile, a minimal column grid on desktop.
- **personalised onboarding** — slow hour asks for your name, birthdate (and optionally birth time and location) and writes you a short welcome message based on your sun sign, moon sign, and rising — or just your sun and life path number if that's all you share.
- **drag to begin** — after the welcome message, you drag a card to start. a small ritual.
- **works on mobile and desktop** — fully responsive. desktop shows a device frame; mobile is full screen.

---

## stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- TypeScript
- Local storage — no backend, no accounts, no tracking

---

## running locally

```bash
git clone https://github.com/icefeline/slow-hour.git
cd slow-hour
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## project structure

```
app/
  components/
    Onboarding.tsx        # welcome flow (name → birthdate → message → drag to begin)
    YearView.tsx          # full-year calendar view
    TarotCard.tsx         # individual card component
    CardDrawer.tsx        # bottom sheet for past card detail
    ActiveInsight.tsx     # transit / insight ticker
  api/
    daily-card/           # card of the day endpoint
    calculate-transit/    # astrological transit calculation
  page.tsx                # main app shell
lib/
  data/
    tarot-deck.ts         # 78-card deck data
  types/
    tarot.ts              # TypeScript types
public/
  cards/                  # card image assets
  device-frame-deck.png   # desktop onboarding frame
  card-back.png           # card back image
  slow-hour-logo.png      # wordmark
```

---

## design notes

- **no accounts** — everything lives in `localStorage`. your data never leaves your device.
- **one draw per day** — the card is locked once revealed. come back tomorrow.
- **fonts** — Reenie Beanie (handwritten) for body and headings; VT323 (monospace) for calendar numerals.
- **colours** — `#172211` (dark green), `#CEF17B` (yellow-green accent), `#E1EEFC` (pale blue for text and the onboarding screen).

---

## licence

personal project. not for redistribution.
