# Security Backlog — slow garden

> Audited 2026-03-18. Fix in priority order.
> Updated 2026-07-21: 7 of 12 items fixed in the working tree — **not yet committed or pushed.**

---

## 🔴 Critical

### 1. Rotate exposed API keys — ⬜ OPEN
**Files:** `.env.local`
Keys in plaintext: Anthropic API key + Upstash Redis credentials.
- Rotate both immediately via their dashboards
- Set via Vercel Environment Variables instead of `.env.local`
- Confirm `.env.local` is in `.gitignore`

---

## 🟠 High

### 2. Prompt injection — user inputs go directly into Claude prompts — ✅ FIXED (uncommitted)
**Files:** `app/api/calculate-transit/route.ts`, `app/api/welcome-insight/route.ts`
`name`, `birthLocation`, `memoryNotes` interpolated into prompt strings without sanitization.
- `lib/utils/validate.ts` added: `sanitizeText()` strips control chars and enforces max length, now called on `name`, `birthLocation`, `memoryNotes`, `recentCards`, `cardId` before prompt interpolation.

### 3. Rate limiting gaps — welcome-insight and geocode-check unprotected — ✅ FIXED (uncommitted)
**File:** `middleware.ts`
Only `/api/calculate-transit` is rate-limited. Both other AI/external-calling endpoints are open.
- Middleware now runs three separate limiters keyed by pathname: `calculate-transit` 10/24h, `welcome-insight` 3/24h, `geocode-check` 10/hr.

### 4. X-Forwarded-For spoofing bypasses rate limiter — ✅ FIXED (uncommitted)
**File:** `middleware.ts` lines 23–24
IP is read from client-supplied `x-forwarded-for` header — trivially spoofable.
- Implemented as `getIp()` preferring `x-real-ip` (set by Vercel's edge, not client-controlled) with `x-forwarded-for` as fallback — not the originally suggested `@vercel/edge` import, but resolves the same spoofing vector. Worth double-checking `x-real-ip` is reliably set on Vercel's current edge network before relying on it in prod.

### 5. Input validation missing across all API routes — ✅ FIXED (uncommitted)
**Files:** all `app/api/` routes
`birthDate`, `birthTime`, `birthLocation` not validated before use in astrology calculator or prompts.
- `validate.ts` adds `isValidDate()` (dd/mm/yyyy, 1900–present) and `isValidTime()` (hh:mm), wired into `calculate-transit` and `welcome-insight`. Payload sizes capped via `sanitizeText()` max-length args.

---

## 🟡 Medium

### 6. No security headers (CSP, X-Frame-Options, etc.) — ✅ FIXED (uncommitted)
**File:** `next.config.js` (or `next.config.ts`)
No Content Security Policy, no clickjacking protection.
- `headers()` block added with `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. **Note: no `Content-Security-Policy` header was added** — still worth adding if the app embeds any third-party scripts.

### 7. Claude API response not wrapped in try/catch — ✅ ALREADY OK
**File:** `app/api/calculate-transit/route.ts` lines 161–176
`JSON.parse()` on Claude's response throws unhandled 500 if malformed.
- Verified the whole `generateClaudeInsight()` call (including the `JSON.parse`) is already inside a try/catch that logs and returns `null` on failure. No change needed.

### 8. Geocoding response not validated before use — ✅ FIXED (uncommitted)
**File:** `app/api/geocode-check/route.ts`
Assumes `data` is an array and `data[0].address` exists without checking.
- `Array.isArray(data)` guard added, plus `typeof data[0].display_name === 'string'` check. Output now passed through `sanitizeOutput()` (strips `<>`, trims, caps length) before returning to client.

### 9. Rate limit too permissive (1000/day) — ✅ FIXED (uncommitted)
**File:** `middleware.ts` line 14
1000 requests/day = ~40/hour is generous for an app with 1 draw/day.
- Reduced to 10/24h for `calculate-transit` (see #3).

### 10. Vercel Analytics vs. "no tracking" privacy promise — ✅ RESOLVED 2026-08-20
**File:** `app/layout.tsx`
`<Analytics />` sends usage data to Vercel. CLAUDE.md says "no tracking".
- Re-checked against the live page: `app/privacy/page.tsx` already discloses Vercel's
  visitor counts, that they are cookieless and carry no personal data, and why there is
  no consent banner. The reader-facing promise was never the inaccurate one.
- The stale claim was in CLAUDE.md's philosophy section ("no servers, no tracking"),
  now corrected there.
- ⚠️ Re-opens the moment PostHog lands: event capture and session replay are a
  different order of thing from a cookieless page count, and would need their own
  clause on the privacy page in the same commit.

---

## 🟢 Low

### 11. OSM Nominatim ToS — no server-side geocode rate control — 🟡 PARTIAL (uncommitted)
**File:** `app/api/geocode-check/route.ts`
Nominatim requires ≤ 1 req/sec. No server-side enforcement; only client debounce.
- The new 10/hr per-IP rate limit (#3) reduces load significantly but there's still no Redis response caching keyed by location string — a popular location string still hits Nominatim on every uncached request within the hourly limit.
- Remaining: cache results in Redis for 1 hour keyed by location string.

### 12. Partial reset doesn't clear memory notes — ⬜ OPEN
**File:** `app/page.tsx` lines 180–187
Full reset clears everything, but partial reset preserves `slow-garden-memory`.
- Document this, or add selective clear option

---

*All other data stays in localStorage — no backend persistence, which is correct.*
