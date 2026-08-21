import { NextResponse } from 'next/server';
import { verifyUnlockCode } from '@/lib/utils/unlock';

/**
 * Checks a supporter code. Answers yes or no and nothing else — no hint about
 * which half was wrong, no echo of what was sent.
 *
 * The client stores the code on a yes and stops counting reading-days. That
 * check being client-side is not a weakness introduced here: the quota was
 * already client-side and already bypassable by clearing storage. What this
 * endpoint guarantees is only that a code cannot be *invented*, which is the
 * part that would otherwise let anyone mint their own unlock.
 */
export async function POST(request: Request) {
  const secret = process.env.SLOW_GARDEN_UNLOCK_SECRET;
  if (!secret) {
    console.error('SLOW_GARDEN_UNLOCK_SECRET not set — unlock codes cannot be verified');
    return NextResponse.json({ valid: false }, { status: 500 });
  }

  let code: unknown;
  try {
    ({ code } = await request.json());
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const valid = await verifyUnlockCode(code, secret);
  return NextResponse.json({ valid });
}
