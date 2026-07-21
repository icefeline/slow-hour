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

// 10 readings/day per IP — matches the app's one-card-a-day model
const transitLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '24 h'), prefix: 'sl:transit', analytics: false })
  : null;

// 3 welcome messages/day — one-time onboarding call
const welcomeLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '24 h'), prefix: 'sl:welcome', analytics: false })
  : null;

// 10 geocode lookups/hour — debounced on the client already
const geocodeLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 h'), prefix: 'sl:geocode', analytics: false })
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
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return new NextResponse(
      JSON.stringify({ error: 'too many requests — come back tomorrow.' }),
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/calculate-transit', '/api/welcome-insight', '/api/geocode-check'],
};
