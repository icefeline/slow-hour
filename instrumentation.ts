import * as Sentry from '@sentry/nextjs';

/**
 * Next.js calls this once per runtime. The two configs are imported rather
 * than inlined because the edge runtime and the Node server accept different
 * options, and keeping them apart makes it obvious which is which.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

/**
 * Without this, errors thrown inside App Router route handlers and server
 * components are swallowed by Next's own boundary and never reach Sentry —
 * which is most of the server-side code worth monitoring here.
 */
export const onRequestError = Sentry.captureRequestError;
