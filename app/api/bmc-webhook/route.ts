import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { mintUnlockCode, verifyBmcSignature } from '@/lib/utils/unlock';

/**
 * Buy Me a Coffee calls this when someone supports the app.
 *
 * It does not email anyone. Sending mail would mean adding a mail provider,
 * another processor on the privacy page and another key to rotate, for a
 * volume that is currently a handful of people. Instead the minted code is
 * recorded, and `npm run codes` reads the list out so they can be sent by
 * hand — from a real person, which suits a gift better than an autoresponder.
 * When the volume stops being handleable, the sending step slots in here.
 *
 * The stored record is the supporter's email and their code. That is a real
 * piece of personal data and the first thing in this app to be kept on a
 * server, so it is deliberately small, has a ninety-day expiry, and is only
 * what is needed to send someone the thing they paid for.
 */

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/** Long enough to notice and send; short enough not to become an archive. */
const RECORD_TTL_SECONDS = 60 * 60 * 24 * 90;

/** Events that mean "this person supported the app". */
const SUPPORT_EVENTS = new Set([
  'donation.created',
  'recurring_donation.started',
  'membership.started',
  'extra_purchase.created',
]);

/**
 * BMC's payload shape is documented only in their OpenAPI spec, and the field
 * carrying the supporter's email differs between event types. Rather than
 * guess one path, look through the plausible ones and take the first thing
 * that is actually an email.
 */
function findEmail(data: unknown): string | null {
  const seen = new Set<unknown>();
  const walk = (node: unknown, depth: number): string | null => {
    if (depth > 6 || node == null || typeof node !== 'object' || seen.has(node)) return null;
    seen.add(node);
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (typeof value === 'string' && /email/i.test(key) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        return value;
      }
      const nested = walk(value, depth + 1);
      if (nested) return nested;
    }
    return null;
  };
  return walk(data, 0);
}

export async function POST(request: Request) {
  const bmcSecret = process.env.BMC_WEBHOOK_SECRET;
  const unlockSecret = process.env.SLOW_GARDEN_UNLOCK_SECRET;

  if (!bmcSecret || !unlockSecret) {
    console.error('BMC webhook not configured (BMC_WEBHOOK_SECRET / SLOW_GARDEN_UNLOCK_SECRET)');
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // The signature is over the bytes exactly as sent, so the body must be read
  // as text and only parsed afterwards — re-serialising JSON would reorder
  // keys and invalidate a signature that was in fact genuine.
  const raw = await request.text();

  const signed = await verifyBmcSignature(raw, request.headers.get('x-signature-sha256'), bmcSecret);
  if (!signed) {
    // No detail in the response: an attacker probing this endpoint learns only
    // that it exists.
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: { type?: string; data?: unknown };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // 200 on events we do not act on: a non-2xx would make BMC retry something
  // that was never going to succeed.
  if (!payload.type || !SUPPORT_EVENTS.has(payload.type)) {
    return NextResponse.json({ ok: true, ignored: payload.type ?? 'unknown' });
  }

  const email = findEmail(payload.data);
  if (!email) {
    // Some supporters give anonymously and there is genuinely no address. Say
    // so in the log rather than failing, so it can be followed up by hand.
    console.warn(`[bmc] ${payload.type} with no email — no code minted`);
    return NextResponse.json({ ok: true, minted: false });
  }

  const code = await mintUnlockCode(email, unlockSecret);

  try {
    if (redis) {
      await redis.set(`sl:supporter:${await hashKey(email)}`, { email, code, type: payload.type, at: new Date().toISOString() }, { ex: RECORD_TTL_SECONDS });
    }
  } catch (error) {
    // The code is deterministic — the same email always mints the same code —
    // so a failed write loses the reminder, not the ability to reissue it.
    console.error('[bmc] could not record supporter', error);
  }

  return NextResponse.json({ ok: true, minted: true });
}

/** Key by hash so the email is not sitting in a key name in plain sight. */
async function hashKey(email: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
