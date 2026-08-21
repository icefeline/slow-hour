/**
 * Mint a supporter's unlock code by hand.
 *
 *   npm run mint -- someone@example.com
 *
 * Imports the same functions the API uses rather than reimplementing the
 * signature, so a change to the code format cannot silently produce codes the
 * server will reject.
 *
 * Codes are deterministic: the same address always mints the same code, so
 * reissuing one to someone who lost theirs needs no record of the first.
 */
import { readFileSync } from 'node:fs';
import { mintUnlockCode } from '../lib/utils/unlock.ts';

function secretFromEnv(): string {
  if (process.env.SLOW_GARDEN_UNLOCK_SECRET) return process.env.SLOW_GARDEN_UNLOCK_SECRET;
  try {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const i = line.indexOf('=');
      if (i > 0 && line.slice(0, i).trim() === 'SLOW_GARDEN_UNLOCK_SECRET') {
        return line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // no .env.local — fall through to the error below
  }
  return '';
}

const email = process.argv[2];
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error('usage: npm run mint -- someone@example.com');
  process.exit(1);
}

const secret = secretFromEnv();
if (!secret) {
  console.error('SLOW_GARDEN_UNLOCK_SECRET is not set (env or .env.local)');
  process.exit(1);
}

console.log(await mintUnlockCode(email, secret));
