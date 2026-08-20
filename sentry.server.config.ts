import * as Sentry from '@sentry/nextjs';
import { scrubEvent } from '@/lib/utils/sentry-scrub';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // No DSN in local dev means Sentry stays inert rather than erroring, so a
  // contributor without credentials can still run the app.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Never send IPs, headers or bodies that Sentry would otherwise infer as
  // identity. scrubEvent is the second line; this is the first.
  sendDefaultPii: false,

  // One reading per person per day is not high traffic — sample everything and
  // revisit if the free tier starts complaining.
  tracesSampleRate: 1.0,

  beforeSend: scrubEvent,
});
