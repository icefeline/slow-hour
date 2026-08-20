import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { sanitizeOutput } from '@/lib/utils/validate';

/*
 * Nominatim is a volunteer-run service and its terms ask for no more than one
 * request per second. The per-IP guard in middleware.ts bounds how hard any one
 * network can lean on it, but it does nothing about the shape of the traffic:
 * birth locations are overwhelmingly a small set of cities typed over and over,
 * so most requests were asking OSM a question we had already answered.
 *
 * Caching the resolved string keeps repeat lookups off their infrastructure
 * entirely. What is stored is the tidied place name the app already returns to
 * the browser — no coordinates, and nothing tying a place to a person.
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/** Place names do not move. A day is short enough to fix a bad early answer. */
const CACHE_TTL_SECONDS = 60 * 60 * 24;

/** Case and surrounding space are noise; "Penang " and "penang" are one query. */
function cacheKey(q: string): string {
  return `sl:geo:${q.trim().toLowerCase().replace(/\s+/g, ' ')}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2 || q.trim().length > 200) {
    return NextResponse.json({ found: null });
  }

  const key = cacheKey(q);

  /*
   * A cache miss must never be fatal, and must never be slow either. Failing
   * open without a deadline is only half a safety net: measured against an
   * unreachable Upstash, the client sat on the connection for about six
   * seconds before giving up, which is far longer than the lookup it was
   * meant to save. The cache is a pure optimisation, so it gets a budget and
   * loses its turn if it misses it.
   */
  const withDeadline = <T,>(p: Promise<T>, ms: number): Promise<T | null> =>
    Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]);

  try {
    const hit = redis ? await withDeadline(redis.get<string>(key), 1000) : null;
    if (typeof hit === 'string') {
      return NextResponse.json({ found: hit });
    }
  } catch {
    // cache unavailable — fall through to the live lookup
  }

  /** Store and return in one step, so every exit path populates the cache. */
  const remember = async (found: string) => {
    try {
      // Same deadline reasoning as the read: the reader is waiting on this
      // response, and a write they will never benefit from must not hold it.
      if (redis) await withDeadline(redis.set(key, found, { ex: CACHE_TTL_SECONDS }), 1000);
    } catch {
      // a failed write only costs us the next lookup
    }
    return NextResponse.json({ found });
  };

  try {
    const encoded = encodeURIComponent(q.trim());
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SlowGardenTarotApp/1.0 (daily tarot readings)',
          'Accept-Language': 'en',
        },
      }
    );

    if (!res.ok) return NextResponse.json({ found: null });

    const data = await res.json();

    // A genuine "no such place" is worth remembering — typos get retyped, and
    // each retry is another request OSM did not need to serve. Transient
    // failures below are deliberately not cached.
    if (!Array.isArray(data) || data.length === 0) {
      return remember('');
    }

    const address = data[0].address ?? {};
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      '';
    const country = address.country || '';

    if (city && country) {
      return remember(sanitizeOutput(`${city.toLowerCase()}, ${country.toLowerCase()}`));
    }
    if (country) {
      return remember(sanitizeOutput(country.toLowerCase()));
    }
    // fallback: first two parts of display_name
    const displayName = typeof data[0].display_name === 'string' ? data[0].display_name : '';
    const parts = displayName.split(',');
    const simplified = parts.slice(0, 2).map((p: string) => p.trim()).join(', ').toLowerCase();
    return remember(sanitizeOutput(simplified));
  } catch {
    return NextResponse.json({ found: null });
  }
}
