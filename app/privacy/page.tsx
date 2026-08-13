/**
 * This page is prose, so it is set in the reading serif rather than the pixel
 * face. VT323 is reserved for machine output — the generated reading, the days
 * counted, the notes catalogued, the date stamped — and a privacy policy is
 * none of those; it is the one place in the app speaking plainly as a person.
 */
const SERIF = 'var(--font-biz-udmincho), serif';
const MONO = 'var(--font-dm-mono), ui-monospace, monospace';

/** Lime page, ink type — the tear-off calendar's palette, not the app's dark ground. */
const INK = '#172211';
const LIME = '#C9F24E';

/* Sized for a serif now: the old band existed because VT323 reads small for
   its point size, and carrying it over would have left this shouting. */
const H1 = 'clamp(34px, 8vw, 52px)';
const H2 = 'clamp(18px, 3.4vw, 24px)';
const BODY = 'clamp(15px, 2.2vw, 19px)';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-3" style={{ fontSize: H2, lineHeight: 1.25 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ background: LIME, color: INK, fontFamily: SERIF }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-1" style={{ fontSize: H1, lineHeight: 1.1 }}>
          privacy policy
        </h1>
        <p className="mb-14 opacity-60" style={{ fontFamily: MONO, fontSize: 'clamp(10px, 2.2vw, 12px)', letterSpacing: '0.18em' }}>
          last updated: august 2026
        </p>

        <Section title="the short version">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            slow garden keeps your data in your browser — not on our servers. we
            don&apos;t sell it, share it, or advertise to you. three things do leave
            your device: your birth details and card go to anthropic to write your
            reading, your birth location goes to openstreetmap to be turned into
            coordinates, and your ip address is seen by our rate limiter. nothing
            else.
          </p>
        </Section>

        <Section title="what you tell us">
          <p className="mb-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            during onboarding you optionally provide:
          </p>
          <ul className="list-disc pl-6 space-y-1" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            <li>your first name</li>
            <li>your birth date</li>
            <li>your birth time (optional)</li>
            <li>your birth location (optional)</li>
          </ul>
          <p className="mt-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            all of it is stored in your browser&apos;s local storage. it stays on your
            device — there is no account and no database with your name in it.
          </p>
        </Section>

        <Section title="your readings">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            the cards you draw, your journal reflections, and your reading history
            are stored locally in your browser, along with a short private note the
            app keeps to make later readings feel continuous. we have no access to
            any of it. clearing your browser data or switching devices removes it.
          </p>
        </Section>

        <Section title="what leaves your device">
          <p className="mb-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            slow garden relies on four outside services:
          </p>
          <ul className="list-disc pl-6 space-y-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            <li>
              <span className="underline">anthropic claude</span> — when you draw
              your card, your birth details and the card are sent to anthropic to
              generate the reading. their privacy policy applies:{' '}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                anthropic.com/privacy
              </a>
            </li>
            <li>
              <span className="underline">openstreetmap nominatim</span> — if you
              enter a birth location, that text is sent to openstreetmap&apos;s
              geocoder to find its coordinates. nothing else about you goes with it.
            </li>
            <li>
              <span className="underline">upstash</span> — our rate limiter counts
              requests per ip address so one network can&apos;t exhaust the service.
              your ip is stored as a short-lived counter and nothing else about you
              is attached to it.
            </li>
            <li>
              <span className="underline">vercel analytics</span> — privacy-friendly,
              cookieless counts of how many people visit. no personal data, no
              cookie banner needed.
            </li>
          </ul>
        </Section>

        <Section title="reminders">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            if you turn on a daily reminder, it is scheduled by your own browser and
            the time you picked is saved on your device. there is no push server and
            we are not told when — or whether — you open the app.
          </p>
        </Section>

        <Section title="cookies">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            slow garden sets no tracking cookies. vercel analytics is cookieless by
            design.
          </p>
        </Section>

        <Section title="your rights">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            since your personal data lives in your browser, you can delete all of it
            at any time by clearing local storage or using the reset option in the
            app. we hold nothing on our end to delete.
          </p>
        </Section>

        <a href="/" className="underline" style={{ fontFamily: MONO, fontSize: 'clamp(11px, 2.4vw, 13px)', letterSpacing: '0.18em' }}>
          ← back
        </a>
      </div>
    </main>
  );
}
