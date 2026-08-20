import type { ErrorEvent, EventHint } from '@sentry/nextjs';

/**
 * Everything slow garden knows about a reader is the kind of thing you would
 * not want appearing in a third-party error dashboard: their name, the exact
 * minute and place they were born, the notes the app keeps about their
 * patterns, and whatever they wrote in the reflection box. The privacy page
 * promises there is no database anywhere with their name in it — an unscrubbed
 * error report would quietly make that untrue, one stack trace at a time.
 *
 * So this runs on every event before it leaves the process, on the client, the
 * server and the edge alike. It works by key name rather than by call site: a
 * new route that forwards `birthLocation` is scrubbed the day it is written,
 * without anyone remembering to come back here.
 */

/**
 * Matched against object keys, case-insensitively, as substrings — `birth`
 * catches birthDate, birthTime, birthLocation and any birth* field added
 * later. Deliberately broad: over-redacting costs a debugging detail, while
 * under-redacting ships someone's birth chart to Germany.
 */
const SENSITIVE_KEY = /(name|birth|location|coord|lat|lon|memory|note|insight|reflection|keyphrase|action|coffee|unlock|token|key|secret|auth|cookie)/i;

/** Query params that carry reader data in a URL rather than a body. */
const SENSITIVE_PARAM = new Set(['q', 'location', 'name', 'lat', 'lon']);

const REDACTED = '[redacted]';

/** Strip sensitive query params but keep the path, which is the useful part. */
export function scrubUrl(url: string): string {
  try {
    // Relative URLs need a base to parse; it is discarded below.
    const parsed = new URL(url, 'https://slowww.garden');
    let touched = false;
    parsed.searchParams.forEach((_, key) => {
      if (SENSITIVE_PARAM.has(key.toLowerCase()) || SENSITIVE_KEY.test(key)) {
        touched = true;
      }
    });
    if (!touched) return url;
    for (const key of [...parsed.searchParams.keys()]) {
      if (SENSITIVE_PARAM.has(key.toLowerCase()) || SENSITIVE_KEY.test(key)) {
        parsed.searchParams.set(key, REDACTED);
      }
    }
    return url.startsWith('http') ? parsed.toString() : parsed.pathname + parsed.search;
  } catch {
    // Unparseable URL — drop the query wholesale rather than guess.
    return url.split('?')[0];
  }
}

/**
 * Walks an arbitrary structure, replacing the values of sensitive keys. Depth
 * is capped because Sentry payloads can contain cyclic or very deep objects and
 * a scrubber that hangs is worse than no scrubber.
 */
function scrubValue(value: unknown, depth = 0): unknown {
  if (depth > 8 || value == null) return value;

  if (Array.isArray(value)) return value.map((v) => scrubValue(v, depth + 1));

  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEY.test(key) ? REDACTED : scrubValue(val, depth + 1);
    }
    return out;
  }

  return value;
}

/**
 * The `beforeSend` hook. Returning null would drop the event entirely; we want
 * to keep the error, just not the reader inside it.
 */
export function scrubEvent(event: ErrorEvent, _hint?: EventHint): ErrorEvent | null {
  // Never attach IP or other Sentry-inferred identity. sendDefaultPii is false
  // too; this is the belt to that's braces.
  if (event.user) {
    delete event.user.ip_address;
    delete event.user.email;
    delete event.user.username;
  }

  if (event.request) {
    if (event.request.url) event.request.url = scrubUrl(event.request.url);
    if (event.request.query_string) event.request.query_string = REDACTED;
    if (event.request.data) event.request.data = scrubValue(event.request.data);
    if (event.request.cookies) event.request.cookies = { [REDACTED]: REDACTED };
    if (event.request.headers) {
      for (const h of Object.keys(event.request.headers)) {
        if (/cookie|authorization|x-real-ip|x-forwarded-for/i.test(h)) {
          event.request.headers[h] = REDACTED;
        }
      }
    }
  }

  if (event.extra) event.extra = scrubValue(event.extra) as Record<string, unknown>;
  if (event.contexts) event.contexts = scrubValue(event.contexts) as typeof event.contexts;

  // Breadcrumbs are the sneaky one: a fetch breadcrumb records the geocode URL
  // with the birth location still in the query string.
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((crumb) => {
      const next = { ...crumb };
      if (next.data) {
        const data = scrubValue(next.data) as Record<string, unknown>;
        if (typeof data.url === 'string') data.url = scrubUrl(data.url);
        next.data = data;
      }
      return next;
    });
  }

  return event;
}
