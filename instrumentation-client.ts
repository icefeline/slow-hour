import * as Sentry from '@sentry/nextjs';
import { scrubEvent } from '@/lib/utils/sentry-scrub';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  sendDefaultPii: false,
  tracesSampleRate: 1.0,

  /*
   * Session replay is deliberately off. Replaying this app means replaying
   * someone's birth details as they type them and the reflection they write
   * afterwards; masking enough to make that safe would leave a recording of an
   * empty layout, which is not worth the exposure. Revisit only with a
   * specific question replay would answer.
   */
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  beforeSend: scrubEvent,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
