import type { Metadata } from 'next';
import { version } from '../../package.json';

/**
 * Its own title, so the tab and any shared link say what the page is rather
 * than inheriting the app's "slow garden".
 */
export const metadata: Metadata = {
  title: 'terms & privacy · slow garden',
  description:
    'what slow garden is, what it is not, and the short list of things that leave your device.',
};

/**
 * Terms and privacy, on one page.
 *
 * Headings are machine voice, the prose is not — the reading page established
 * that split, and this is the one place in the app that has to be both a list
 * of what the software does and something a person can actually read.
 *
 * Everything stated here is checked against the code rather than aspired to. If
 * a data practice changes, this page changes in the same commit: a privacy
 * policy that describes an older version of the app is worse than none, because
 * it is a promise the software is no longer keeping.
 */
const SANS = 'var(--font-dm-sans), sans-serif';
const MONO = 'var(--font-dm-mono), ui-monospace, monospace';
const TERM = 'var(--font-vt323), monospace';

/** Lime page, ink type — the tear-off calendar's palette, not the app's dark ground. */
const INK = '#172211';
const LIME = '#C9F24E';

/* VT323 reads small for its point size, so the headings carry more px than the
   sans would want at the same visual weight. */
const H1 = 'clamp(34px, 7.5vw, 54px)';
const H2 = 'clamp(24px, 4.4vw, 32px)';
const H3 = 'clamp(19px, 3.4vw, 24px)';
const BODY = 'clamp(15px, 2.2vw, 19px)';
/** The standfirst, a step up from the body it introduces. */
const LEDE = 'clamp(18px, 2.9vw, 24px)';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14">
      <h2
        className="mb-6"
        style={{ fontFamily: TERM, fontSize: H2, lineHeight: 1.1, letterSpacing: '0.01em' }}
      >
        &gt; {title}
      </h2>
      {children}
    </section>
  );
}

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-9">
      <h3
        className="mb-2"
        style={{ fontFamily: TERM, fontSize: H3, lineHeight: 1.15 }}
      >
        {title}
      </h3>
      <div style={{ fontSize: BODY, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function TermsAndPrivacy() {
  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{ background: LIME, color: INK, fontFamily: SANS }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 style={{ fontFamily: TERM, fontSize: H1, lineHeight: 1, letterSpacing: '0.01em' }}>
          &gt; TERMS &amp; PRIVACY
        </h1>

        <p
          className="mt-5 opacity-60"
          style={{ fontFamily: MONO, fontSize: 'clamp(10px, 2.2vw, 12px)', letterSpacing: '0.18em' }}
        >
          last updated: august 2026
        </p>

        {/* The one paragraph anyone reads, so it is set like a standfirst and
            framed the way the reading page frames its own blocks. Dotted on
            ink, since the rule is the app's, not a border for its own sake. */}
        <div
          className="mt-10 mb-16"
          style={{ border: `1px dotted ${INK}`, padding: 'clamp(20px, 4vw, 30px)' }}
        >
          <p style={{ fontSize: LEDE, lineHeight: 1.55 }}>
            slow garden is a web app that draws you one tarot card a day and writes a short
            reflection to go with it. it runs entirely in your browser. there is no account,
            no login, and no database anywhere with your name in it, which makes most of what
            follows shorter than you might expect. jump to{' '}
            <a href="#terms" className="underline" style={{ fontWeight: 700 }}>the terms</a> or{' '}
            <a href="#privacy" className="underline" style={{ fontWeight: 700 }}>the privacy policy</a>.
          </p>
        </div>

        {/* ── TERMS ────────────────────────────────────────────────────── */}
        <Section id="terms" title="TERMS OF USE">
          <Clause title="using slow garden means agreeing to this">
            <p>
              if you use slow garden, you&apos;re agreeing to what&apos;s on this page. if
              some part of it doesn&apos;t sit right with you, the honest answer is to stop
              using it, and nothing of yours is left behind when you do.
            </p>
          </Clause>

          <Clause title="you should be at least 13">
            <p>
              slow garden is not built for children. if you&apos;re under 13, please
              don&apos;t use it. if you&apos;re between 13 and whatever counts as an adult
              where you live, have a parent or guardian read this with you.
            </p>
          </Clause>

          <Clause title="what you can do with it">
            <p>
              use it for yourself, as much as you like, for free. what we&apos;d ask you not
              to do: script it, scrape it, resell it, try to slip past the rate limits, or
              use it to build a competing service. the readings are for you, not for
              republishing as your own.
            </p>
          </Clause>

          <Clause title="there is no account, and that cuts both ways">
            <p>
              everything slow garden knows about you lives in your browser&apos;s local
              storage. that&apos;s good for privacy and unforgiving in every other respect.
              clear your browser data, use private browsing, or switch to another device,
              and your history is gone. we can&apos;t recover it, because we never had a
              copy. if a year of readings would hurt to lose, keep your own notes elsewhere.
            </p>
          </Clause>

          <Clause title="what you write stays yours">
            <p>
              your reflections belong to you. we claim no licence over them and no right to
              use them, which is easy to promise because they never leave your device in the
              first place.
            </p>
          </Clause>

          <Clause title="what slow garden is not">
            <p className="mb-4">
              this matters more than the rest of this page, so plainly: slow garden is for
              reflection. it is not advice. nothing in it is medical, psychological, legal,
              or financial guidance, and it should never be used in place of a professional
              who knows your situation.
            </p>
            <p className="mb-4">
              it does not predict anything. the cards are drawn from the date, the readings
              are written by a language model, and both can be wrong, strange, or simply
              unhelpful on a given day. treat a reading as a prompt for your own thinking,
              never as a fact about your life or as a reason to make a decision you
              wouldn&apos;t otherwise make.
            </p>
            <p>
              if you&apos;re struggling, please talk to someone real. a friend, a doctor, or
              a crisis line in your country will all serve you better than an app about
              flowers and tarot cards.
            </p>
          </Clause>

          <Clause title="it may change, and it may stop">
            <p>
              slow garden is made by one person and given away. features can change or
              disappear, the app can be offline, and readings are limited so the costs stay
              survivable. there&apos;s no guarantee it will keep working, and no promise it
              will still be here next year, though the intention is that it will be.
            </p>
          </Clause>

          <Clause title="if you buy me a coffee">
            <p>
              the support link is still a gift rather than a purchase, and it isn&apos;t
              refundable. what it does do is lift the seven-reading limit, for good. that
              is a thank-you, not a transaction: the readings you&apos;ve already had are
              yours either way, and nothing about the app is held back from anyone who
              doesn&apos;t.
            </p>
            <p>
              buy me a coffee handles the payment and tells us someone supported the app.
              we never see your card. from your email address we work out a code, send it
              to you, and you paste it in once &mdash; the code is a signature we can check
              rather than a lookup, so unlocking still doesn&apos;t create an account and
              there&apos;s still no record here of who you are. the code is worked out from
              your address in a way that can&apos;t be turned back into it, so it gives away
              nothing about you if you lose or share it.
            </p>
            <p>
              your address and your code are kept for ninety days so we can send it and
              resend it if it goes astray, then deleted. that&apos;s the only thing in slow
              garden stored on a server rather than on your device, and it exists solely to
              get you the thing you paid for.
            </p>
          </Clause>

          <Clause title="provided as it is">
            <p>
              slow garden is provided as it is, without warranties of any kind, to the
              fullest extent the law allows. to the same extent, we&apos;re not liable for
              any loss arising from using it or from not being able to use it, including
              lost readings or reflections. some places don&apos;t allow those exclusions; if
              yours is one, they simply don&apos;t apply to you.
            </p>
          </Clause>

          <Clause title="governing law">
            <p>
              these terms are governed by the laws of Singapore, and the courts of Singapore
              have jurisdiction over any dispute. if you&apos;re a consumer somewhere with
              protections that can&apos;t be waived by agreement, you keep those.
            </p>
          </Clause>

          <Clause title="changes to these terms">
            <p>
              if these terms change, the updated version appears here with a new date at the
              top. continuing to use slow garden after that means the new version applies.
            </p>
          </Clause>
        </Section>

        {/* ── PRIVACY ──────────────────────────────────────────────────── */}
        <Section id="privacy" title="PRIVACY POLICY">
          <Clause title="the short version">
            <p>
              everything you put into slow garden stays in your browser. we don&apos;t have a
              database with your name in it, because we don&apos;t have a database. we
              don&apos;t sell anything, we don&apos;t advertise to you, and there&apos;s
              nobody here reading your reflections. a few small things do have to leave your
              device for the app to work at all, and the rest of this is us being specific
              about which ones.
            </p>
          </Clause>

          <Clause title="who&apos;s responsible">
            <p>
              slow garden is made and run by one individual, not a company. a contact address
              for questions about this page will be published here shortly.
            </p>
          </Clause>

          <Clause title="what stays on your device">
            <p className="mb-4">
              all of this lives in your browser&apos;s local storage and nowhere else:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>your first name</li>
              <li>your birth date, and your birth time and location if you gave them</li>
              <li>every card you&apos;ve drawn, and the date you drew it</li>
              <li>anything you&apos;ve written in the reflection box</li>
              <li>the readings themselves, cached so re-opening a day costs nothing</li>
              <li>
                a short private note the app keeps after each reading, so tomorrow&apos;s
                doesn&apos;t feel like it&apos;s meeting you for the first time
              </li>
              <li>your settings, including whether personalisation and location are on</li>
            </ul>
            <p>
              we can&apos;t see any of it. it isn&apos;t backed up, synced, or transmitted
              anywhere, and clearing your browser data deletes all of it permanently.
            </p>
          </Clause>

          <Clause title="what leaves your device">
            <p className="mb-4">four outside services are involved, and only these four:</p>
            <ul className="list-disc pl-6 space-y-4 mb-4">
              <li>
                <span className="underline" style={{ fontWeight: 700 }}>anthropic</span> writes
                the personalised part of your reading. your birth details, the card you drew,
                and those short private notes are sent over so it has something to write
                from. your name and your reflections are not. their policy covers what
                happens next:{' '}
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
                <span className="underline" style={{ fontWeight: 700 }}>openstreetmap</span> turns
                a birth location into coordinates. it receives the place name you typed and
                nothing else about you.
              </li>
              <li>
                <span className="underline" style={{ fontWeight: 700 }}>upstash</span> runs the
                rate limiter, which counts requests per ip address so one busy network
                can&apos;t drain the whole thing. your ip becomes a short-lived counter and
                then expires. nothing else about you is attached to it, and if the limiter is
                unreachable the app carries on rather than locking you out.
              </li>
              <li>
                <span className="underline" style={{ fontWeight: 700 }}>vercel</span> hosts the
                app, so it necessarily handles the requests your browser makes, and provides
                the visitor counts. those counts are cookieless and carry no personal data,
                which is why you&apos;ve never seen a consent banner here.
              </li>
              <li>
                <span className="underline" style={{ fontWeight: 700 }}>sentry</span> tells us
                when the app breaks, on servers in the european union. it gets the error and
                the line of code that caused it. it does not get your name, your birth date,
                time or place, your reading, or anything you&apos;ve written &mdash; those are
                stripped out before the report leaves your device or our server, by a filter
                that works on the shape of the data rather than a list of places to look, so
                new code is covered the day it&apos;s written. we don&apos;t record your
                screen.
              </li>
            </ul>
          </Clause>

          <Clause title="where you are">
            <p>
              if you switch on &ldquo;use my location&rdquo;, your browser asks first and you
              can say no. we round the coordinates to about a kilometre, keep them on your
              device, and send them to our own reading endpoint so it can work out your
              sunrise, sunset, and moon phase. that&apos;s all they&apos;re for. they
              don&apos;t go to any third party, they aren&apos;t stored after the request,
              and turning the setting off forgets them. decline and you lose two lines of the
              margin, nothing else.
            </p>
          </Clause>

          <Clause title="reminders">
            <p>
              daily reminders are scheduled by your own browser, and the time you picked is
              saved on your device. there&apos;s no push server involved, so we never find
              out whether you opened the app.
            </p>
          </Clause>

          <Clause title="how long anything is kept">
            <p>
              on your device, until you delete it. on our side there is nothing to keep: the
              readings aren&apos;t stored, and the rate limiter&apos;s counters expire within
              the hour. we hold nothing on our end to delete on your behalf.
            </p>
          </Clause>

          <Clause title="data leaving singapore">
            <p>
              the services above operate internationally, so the small amount of data
              described here is processed outside Singapore, including in the United States
              and the European Union. we rely on those providers&apos; own contractual
              safeguards for those transfers, and send them no more than what&apos;s listed
              above.
            </p>
          </Clause>

          <Clause title="your rights">
            <p className="mb-4">
              under Singapore&apos;s PDPA you can ask for access to, or correction of,
              personal data an organisation holds about you. if you&apos;re in the UK or the
              EU, we&apos;ll honour the equivalent GDPR rights, and if you&apos;re in
              California the CCPA ones.
            </p>
            <p>
              in practice all of those requests have the same short answer: we hold nothing
              about you to hand over, correct, or erase. what exists is in your browser,
              where you can read it, change it, or clear it whenever you like, without asking
              anyone.
            </p>
          </Clause>

          <Clause title="children">
            <p>
              slow garden isn&apos;t intended for anyone under 13, and we don&apos;t knowingly
              collect anything from them. since there are no accounts, there&apos;s nothing
              for us to look up or delete, and clearing the browser removes everything the
              app has kept.
            </p>
          </Clause>

          <Clause title="changes to this policy">
            <p>
              if what the app does with data changes, this page changes with it, in the same
              release. the date at the top tells you when it last did.
            </p>
          </Clause>
        </Section>

        <div className="flex items-baseline justify-between gap-6">
          <a
            href="/"
            className="underline"
            style={{ fontFamily: MONO, fontSize: 'clamp(11px, 2.4vw, 13px)', letterSpacing: '0.18em', fontWeight: 500 }}
          >
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
