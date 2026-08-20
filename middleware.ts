import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function makeRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const redis = makeRedis();

/*
 * These are ABUSE GUARDS, not the product's free-reading quota.
 *
 * The quota — 7 free readings per person — is per-user and lives in
 * localStorage (see TarotCard). It cannot live here: an IP is not a person.
 * Mobile carriers and offices put hundreds of people behind one address, so an
 * IP limit tight enough to be a quota would lock out real users the moment two
 * of them shared a network. That was the original bug.
 *
 * What an IP limit IS good for is capping the damage when someone scripts the
 * endpoint to run up the Anthropic bill. So these are set far above anything a
 * human would reach, and only exist to bound cost.
 */

// ~60/hour — a person draws once a day; this only stops a loop.
const transitLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 h'), prefix: 'sl:transit', analytics: false })
  : null;

// Onboarding runs once per person, but a shared network onboards many people.
const welcomeLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 h'), prefix: 'sl:welcome', analytics: false })
  : null;

// Cheap and debounced client-side; the ceiling also keeps us within Nominatim's
// ~1 req/sec fair-use terms.
const geocodeLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(120, '1 h'), prefix: 'sl:geocode', analytics: false })
  : null;

function getIp(request: NextRequest): string {
  // x-real-ip is set by Vercel's edge network and cannot be spoofed by clients
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    '127.0.0.1'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let limiter: Ratelimit | null = null;
  if (pathname === '/api/calculate-transit') limiter = transitLimiter;
  else if (pathname === '/api/welcome-insight') limiter = welcomeLimiter;
  else if (pathname === '/api/geocode-check') limiter = geocodeLimiter;

  if (!limiter) return NextResponse.next();

  const ip = getIp(request);

  // If Upstash is unreachable (outage, network blip), fail open rather than
  // taking the whole route down — a rate limiter should never be a single
  // point of failure for the app.
  try {
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
      return new NextResponse(
        // Deliberately not "come back tomorrow" — that framed this as a daily
        // product limit. A real person should never see this at all.
        JSON.stringify({ error: 'too many requests from this network — try again shortly.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }
  } catch (error) {
    console.error('Rate limiter unreachable, failing open:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/calculate-transit', '/api/welcome-insight', '/api/geocode-check'],
};
