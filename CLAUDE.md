# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Daily Tarot App is a web application that provides users with daily tarot card readings, similar to the "One Year" app concept but focused on tarot. Users draw a single card each day, receive its interpretation, and can journal their reflections.

## Development Commands

### Setup
```bash
# Install Node.js first if not already installed (requires Node.js 18+)
npm install
```

### Development
```bash
npm run dev          # Start development server on http://localhost:3000 (with Turbopack)
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
```

## Architecture

### Tech Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Server Components** by default

### Directory Structure

```
app/
  ├── api/              # API routes for server-side logic
  ├── components/       # Shared React components
  ├── (routes)/         # Page routes following App Router convention
  └── layout.tsx        # Root layout

lib/
  ├── types/            # TypeScript type definitions
  ├── data/             # Static data (tarot card database)
  └── utils/            # Utility functions

public/
  └── cards/            # Static assets (tarot card images)
```

### Key Concepts

**Daily Card Draw Logic**: The app needs to ensure users can only draw one card per day. This requires:
- Date-based seeding for randomization (same day = same card)
- Local storage or database to track draw history
- Server-side logic to prevent manipulation

**Tarot Card Data Structure**: Each card should include:
- Card name (e.g., "The Fool", "Ace of Cups")
- Suite (Major Arcana, Cups, Wands, Swords, Pentacles)
- Upright and reversed meanings
- Keywords and themes
- Image asset path

**Reading History**: Users should be able to:
- View past daily draws
- Add journal entries for each reading
- See patterns over time

### State Management

Use React Server Components where possible to minimize client-side JavaScript. For client-side state:
- Local state with `useState` for simple UI interactions
- Context API if global state is needed
- Consider Zustand or similar for more complex state management

### Data Persistence

Initially use localStorage for:
- Daily draw results
- Reading history
- User journal entries

For production, consider:
- Supabase for database + authentication
- Vercel KV for simple key-value storage
- PostgreSQL for relational data

### Styling Guidelines

Using Tailwind CSS:
- Follow mobile-first responsive design
- Use Tailwind's dark mode utilities
- Create reusable component classes in components
- Consider tarot-themed color palette (purples, golds, deep blues)

### API Routes

Create in `app/api/` for:
- `/api/draw` - Get today's card (with date-based seeding)
- `/api/readings` - CRUD operations for reading history
- `/api/cards/[id]` - Get specific card details

## Testing Strategy

- Unit tests for utility functions (card randomization, date handling)
- Component tests for UI components
- Integration tests for API routes
- E2E tests for critical user flows (daily draw, journaling)

## Deployment

Recommended platform: **Vercel** (zero-config Next.js hosting)

```bash
# Deploy to Vercel
vercel
```

Environment variables to configure:
- `DATABASE_URL` (if using external database)
- `NEXT_PUBLIC_APP_URL` (for production URL)
