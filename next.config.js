const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: 'slow-garden',
  project: 'slow-garden',

  // Source maps are uploaded at build time so stack traces name real lines
  // instead of minified soup, then deleted from the bundle so they are not
  // served to the public.
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },

  // Routes Sentry's own browser requests through the app's origin, so ad
  // blockers do not silently drop error reports.
  tunnelRoute: '/monitoring',
});
