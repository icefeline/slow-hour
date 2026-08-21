/**
 * Supporter unlock codes.
 *
 * Buy Me a Coffee knows an email address. slow garden knows a browser with
 * some localStorage in it. Nothing joins the two, and nothing should — adding
 * accounts to link them would cost the privacy promise far more than the
 * unlock is worth.
 *
 * A code is the join. It carries its own proof: an id derived from the
 * supporter's email, signed with a secret only the server holds. Verifying one
 * needs no database and no lookup, just the secret — so there is still no
 * table anywhere with a reader in it.
 *
 * The id is a hash of the email, never the email itself. A code that leaks, or
 * gets pasted into a screenshot, gives up nothing about who it belongs to.
 *
 * This is a bearer token: whoever holds it is unlocked, and a shared code
 * works for whoever it was shared with. That is a deliberate trade rather than
 * an oversight — the free quota already lives in localStorage and is already
 * bypassable by clearing it, so a leaked code costs nothing that was not
 * already given away. Buying the alternative would mean accounts.
 */

const encoder = new TextEncoder();

/** URL-safe base64 with the padding stripped, so codes survive being pasted. */
function base64url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * The supporter's identity, reduced to something that cannot be reversed back
 * into an email but is stable for the same person across re-issues.
 */
async function supporterId(email: string): Promise<string> {
  const normalised = email.trim().toLowerCase();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(normalised));
  return toHex(digest).slice(0, 8);
}

async function sign(id: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(id));
  // Truncated to keep the code short enough to read aloud. 16 base64 chars is
  // 96 bits, which is far past guessable and there is nothing to brute-force
  // against anyway — /api/unlock is rate limited and reveals only yes or no.
  return base64url(sig).slice(0, 16);
}

/** Mint the code handed to a supporter. Server-side only — needs the secret. */
export async function mintUnlockCode(email: string, secret: string): Promise<string> {
  const id = await supporterId(email);
  return `${id}-${await sign(id, secret)}`;
}

/**
 * True if this code was minted by us. Compares in constant time: a fast
 * rejection and a slow one are the same rejection, so nothing is learnt from
 * how long the answer took.
 */
export async function verifyUnlockCode(code: unknown, secret: string): Promise<boolean> {
  if (typeof code !== 'string' || !secret) return false;

  const trimmed = code.trim();
  // Bound the work before doing any: a megabyte of "code" should cost nothing.
  if (trimmed.length > 64) return false;

  const [id, sig] = trimmed.split('-');
  if (!id || !sig || !/^[0-9a-f]{8}$/.test(id)) return false;

  const expected = await sign(id, secret);
  if (expected.length !== sig.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verify Buy Me a Coffee's webhook signature: HMAC-SHA256 over the raw body,
 * compared against the x-signature-sha256 header. Without this the endpoint
 * would grant unlocks to anyone who found the URL and guessed the shape of a
 * donation payload.
 */
export async function verifyBmcSignature(
  rawBody: string,
  header: string | null,
  secret: string
): Promise<boolean> {
  if (!header || !secret) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expected = toHex(sig);

  const given = header.trim().toLowerCase();
  if (expected.length !== given.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  }
  return diff === 0;
}
