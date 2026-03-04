import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only initialise if env vars are present — falls back to no limiting in dev
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        // 5 insight requests per IP per day — generous for one-card-a-day usage
        limiter: Ratelimit.slidingWindow(5, '24 h'),
        prefix: 'slow-hour',
        analytics: false,
      })
    : null;

export async function middleware(request: NextRequest) {
  if (!ratelimit) return NextResponse.next();

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

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
  matcher: ['/api/calculate-transit'],
};
