import { version } from '../../package.json';

/**
 * Headings are machine voice, the prose is not.
 *
 * The reading page established the split: VT323 with a `>` prompt for anything
 * the system says about itself, DM Sans for anything addressed to a person.
 * A privacy policy is both — a list of what the software does, written to be
 * read by someone — so the headings label the sections the way a terminal would
 * and the copy underneath talks normally.
 */
const SANS = 'var(--font-dm-sans), sans-serif';
const MONO = 'var(--font-dm-mono), ui-monospace, monospace';
const TERM = 'var(--font-vt323), monospace';

/** Lime page, ink type — the tear-off calendar's palette, not the app's dark ground. */
const INK = '#172211';
const LIME = '#C9F24E';

/* VT323 reads small for its point size, so the headings carry more px than the
   sans would want at the same visual weight. */
const H1 = 'clamp(40px, 9vw, 62px)';
const H2 = 'clamp(22px, 4vw, 28px)';
const BODY = 'clamp(15px, 2.2vw, 19px)';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2
        className="mb-3"
        style={{ fontFamily: TERM, fontSize: H2, lineHeight: 1.15, letterSpacing: '0.02em' }}
      >
        &gt; {title}
      </h2>
      {children}
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ background: LIME, color: INK, fontFamily: SANS }}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          style={{ fontFamily: TERM, fontSize: H1, lineHeight: 1, letterSpacing: '0.01em' }}
        >
          &gt; PRIVACY POLICY
        </h1>
        {/* Given its own air rather than tucked under the title: it is a
            separate fact about the page, not a subtitle to it. */}
        <p className="mt-5 mb-16 opacity-60" style={{ fontFamily: MONO, fontSize: 'clamp(10px, 2.2vw, 12px)', letterSpacing: '0.18em' }}>
          last updated: august 2026
        </p>

        <Section title="THE SHORT VERSION">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            everything you put into slow garden stays in your browser. we don&apos;t
            have a database with your name in it, because we don&apos;t have a
            database. we don&apos;t sell anything, we don&apos;t advertise to you, and
            there&apos;s nobody here reading your reflections. a few small things do
            have to leave your device for the app to work at all, and the rest of
            this page is just us being specific about which ones.
          </p>
        </Section>

        <Section title="WHAT YOU TELL US">
          <p className="mb-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            during onboarding you can give us:
          </p>
          <ul className="list-disc pl-6 space-y-1" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            <li>your first name</li>
            <li>your birth date</li>
            <li>your birth time, if you know it</li>
            <li>your birth location, if you want the chart to be accurate</li>
          </ul>
          <p className="mt-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            all of it goes into your browser&apos;s local storage and stays there.
            there&apos;s no account to make and no password to forget.
          </p>
        </Section>

        <Section title="WHERE YOU ARE">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            if you switch on &ldquo;use my location&rdquo;, your browser asks first, and
            you can say no. we round the coordinates to about a kilometre, keep them
            on your device, and send them to our own reading endpoint so it can work
            out your sunrise, sunset and moon phase. that&apos;s genuinely all
            they&apos;re for. they don&apos;t go to anyone else, we don&apos;t keep
            them after the request, and turning the setting off forgets them.
          </p>
        </Section>

        <Section title="YOUR READINGS">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            the cards you draw, anything you write in the reflection box, and your
            history all live in your browser. the app also keeps a short private note
            after each reading so tomorrow&apos;s doesn&apos;t feel like it&apos;s
            meeting you for the first time. we can&apos;t see any of it. clear your
            browser data or move to a new device and it&apos;s gone, which is the
            trade you get for us not holding a copy.
          </p>
        </Section>

        <Section title="WHAT LEAVES YOUR DEVICE">
          <p className="mb-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            four outside services are involved:
          </p>
          <ul className="list-disc pl-6 space-y-4" style={{ fontSize: BODY, lineHeight: 1.7 }}>
            <li>
              <span className="underline" style={{ fontWeight: 700 }}>anthropic claude</span> writes the
              personalised part of your reading, so your birth details and the card
              you drew get sent over. their policy covers what happens next:{' '}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ fontWeight: 700 }}
              >
                anthropic.com/privacy
              </a>
            </li>
            <li>
              <span className="underline" style={{ fontWeight: 700 }}>openstreetmap nominatim</span> turns
              your birth location into coordinates. it gets the text you typed and
              nothing else about you.
            </li>
            <li>
              <span className="underline" style={{ fontWeight: 700 }}>upstash</span> runs the rate limiter,
              which counts requests per ip address so one busy network can&apos;t
              drain the whole thing. your ip becomes a short-lived number and then
              expires.
            </li>
            <li>
              <span className="underline" style={{ fontWeight: 700 }}>vercel analytics</span> counts visitors.
              no cookies, no personal data, no banner asking you to accept anything.
            </li>
          </ul>
        </Section>

        <Section title="REMINDERS">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            daily reminders are scheduled by your own browser, and the time you picked
            is saved on your device. there&apos;s no push server involved, so we never
            find out whether you actually opened the app.
          </p>
        </Section>

        <Section title="COOKIES">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            none for tracking. vercel analytics is cookieless by design, which is why
            you&apos;ve never seen a consent banner here.
          </p>
        </Section>

        <Section title="YOUR RIGHTS">
          <p style={{ fontSize: BODY, lineHeight: 1.7 }}>
            your data is in your browser, so you can delete every bit of it whenever
            you like: clear local storage, or use the reset option in the app. there
            is nothing on our end for us to delete on your behalf.
          </p>
        </Section>

        <div className="flex items-baseline justify-between gap-6">
          <a href="/" className="underline" style={{ fontFamily: MONO, fontSize: 'clamp(11px, 2.4vw, 13px)', letterSpacing: '0.18em', fontWeight: 500 }}>
            ← back
          </a>
          {/* Read from package.json so it cannot quietly fall out of date. */}
          <span
            className="opacity-50"
            style={{ fontFamily: TERM, fontSize: 'clamp(14px, 2.6vw, 17px)', letterSpacing: '0.04em' }}
          >
            v{version}
          </span>
        </div>
      </div>
    </main>
  );
}
