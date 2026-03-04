export default function PrivacyPolicy() {
  return (
    <main
      className="min-h-screen bg-[#172211] px-6 py-16 max-w-2xl mx-auto"
      style={{ color: '#E1EEFC', fontFamily: 'var(--font-reenie-beanie), cursive' }}
    >
      <h1
        className="mb-2"
        style={{ fontSize: '48px', color: '#CEF17B' }}
      >
        privacy policy
      </h1>
      <p className="mb-12 opacity-50" style={{ fontSize: '22px' }}>
        last updated: march 2026
      </p>

      <section className="mb-10">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          the short version
        </h2>
        <p style={{ fontSize: '22px', lineHeight: '1.6' }}>
          slow hour stores your data in your browser — not on our servers. we
          don&apos;t sell it, share it, or use it to advertise to you. the only time
          your data leaves your device is to generate your daily reading, and
          that request is handled by anthropic&apos;s claude ai.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          what we collect
        </h2>
        <p className="mb-4" style={{ fontSize: '22px', lineHeight: '1.6' }}>
          during onboarding, you optionally provide:
        </p>
        <ul className="list-disc pl-6 space-y-2" style={{ fontSize: '22px', lineHeight: '1.6' }}>
          <li>your first name</li>
          <li>your birth date</li>
          <li>your birth time (optional)</li>
          <li>your birth location (optional)</li>
        </ul>
        <p className="mt-4" style={{ fontSize: '22px', lineHeight: '1.6' }}>
          this information is stored in your browser&apos;s local storage. it stays
          on your device and is not sent to us.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          your reading data
        </h2>
        <p style={{ fontSize: '22px', lineHeight: '1.6' }}>
          the cards you draw, your journal reflections, and your reading
          history are all stored locally in your browser. we don&apos;t have access
          to any of this. clearing your browser data or switching devices will
          remove it.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          third-party services
        </h2>
        <p className="mb-4" style={{ fontSize: '22px', lineHeight: '1.6' }}>
          slow hour uses two external services:
        </p>
        <ul className="list-disc pl-6 space-y-3" style={{ fontSize: '22px', lineHeight: '1.6' }}>
          <li>
            <span style={{ color: '#CEF17B' }}>anthropic claude</span> — when
            you reveal your daily card, your birth data and card information
            are sent to anthropic to generate your personalised reading.
            anthropic&apos;s privacy policy applies:{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#CEF17B', textDecoration: 'underline' }}
            >
              anthropic.com/privacy
            </a>
          </li>
          <li>
            <span style={{ color: '#CEF17B' }}>vercel analytics</span> — we
            use vercel&apos;s privacy-friendly analytics to understand how many
            people visit the app. this collects no personal data and requires
            no cookie consent.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          cookies
        </h2>
        <p style={{ fontSize: '22px', lineHeight: '1.6' }}>
          slow hour does not use tracking cookies. vercel analytics is
          cookieless by design.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          your rights
        </h2>
        <p style={{ fontSize: '22px', lineHeight: '1.6' }}>
          since all your personal data lives in your browser, you can delete
          it at any time by clearing your browser&apos;s local storage or using
          the reset option in the app. we hold nothing on our end.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-3" style={{ fontSize: '30px', color: '#CEF17B' }}>
          contact
        </h2>
        <p style={{ fontSize: '22px', lineHeight: '1.6' }}>
          questions? reach out at{' '}
          <a
            href="mailto:hello@slow-hour.com"
            style={{ color: '#CEF17B', textDecoration: 'underline' }}
          >
            hello@slow-hour.com
          </a>
        </p>
      </section>

      <a
        href="/"
        style={{ fontSize: '26px', color: '#CEF17B', textDecoration: 'underline' }}
      >
        ← back
      </a>
    </main>
  );
}
