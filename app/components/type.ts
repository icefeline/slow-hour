import type { CSSProperties } from 'react';

/**
 * The label face: mono, small, widely tracked.
 *
 * Every section heading in the app is set in this — "meaning", "scent notes",
 * "about this card", the year, the month names — so they read as one system of
 * labels rather than as a hierarchy of headings competing with the body copy.
 * It is the same size as the scent notes' own relation labels, which is where
 * the treatment started.
 *
 * Shared rather than repeated so the sizes cannot drift apart file by file.
 */
export const LABEL_TYPE: CSSProperties = {
  fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
  fontSize: 'clamp(8px, 2.2vw, 10px)',
  letterSpacing: '0.2em',
  lineHeight: 1.4,
};

/**
 * Body copy, wherever the app sets a paragraph outside the reading page.
 *
 * DM Sans. This was BIZ UDMincho, a mincho serif — dropped once the reading
 * page moved to its own three voices, since a serif used on one screen and
 * nowhere else is an accident rather than a decision.
 */
export const BODY_TYPE: CSSProperties = {
  fontFamily: 'var(--font-dm-sans), sans-serif',
  // Was a flat 22px, which stayed 22px on a phone and on a wide desktop alike —
  // too big in a 343px column.
  fontSize: 'clamp(15px, 2.2vw, 19px)',
  lineHeight: 1.6,
};

/* ══ the reading page ══════════════════════════════════════════════════════
 *
 * The card reading page is built to its own spec (build/SPEC.md in the design
 * bundle) and is the one screen in the app with a closed palette and a closed
 * set of faces. Everything it needs lives here so the sections cannot drift
 * apart from each other file by file.
 */

/**
 * SPEC §2. The greens are a ladder, not a set of moods: PAPER is the brightest
 * thing on the page and MOSS_3 the faintest, and every text colour is one rung
 * of it. LIME is the only accent and is spent on exactly three things — the
 * sequence number, the `>` prompts, and the module's ground.
 */
export const READING = {
  ink: '#1B2616',
  inkDeep: '#0E140B',
  paper: '#F7F4E6',
  paper2: '#EFF2E6',
  paper3: '#B9C4AE',
  lime: '#C9F24E',
  limeInk: '#171F1A',
  limeInkSoft: 'rgba(23,31,26,.77)',
  limeRule: 'rgba(23,31,26,.45)',
  moss: '#8C9683',
  moss2: '#6C7864',
  moss3: '#4A5C3E',
  rule: '#3A4A31',
} as const;

/**
 * SPEC §1.3: every rule on this page is dotted. The spine between the body
 * columns is the one exception in kind — 2px-on-5px rather than a dot — because
 * a dotted vertical rule at this height reads as a broken line instead of a
 * seam.
 */
export const RULE_DOTTED = `1px dotted ${READING.rule}`;
export const RULE_ON_LIME = `1px dotted ${READING.limeRule}`;
export const SPINE = `repeating-linear-gradient(180deg,${READING.moss3} 0 2px,transparent 2px 7px)`;

/** SPEC §1.1, voice one: machine lines, and the whole lime module. */
export const TERM_TYPE: CSSProperties = {
  fontFamily: 'var(--font-vt323), monospace',
  letterSpacing: '0.04em',
};

/** Voice two: the keyword list and the six-note list. Uppercase, light, tracked. */
export const LIST_TYPE: CSSProperties = {
  fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
  fontWeight: 300,
  fontSize: 'clamp(15px, 2.4vw, 16px)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

/**
 * Voice three: the meaning copy and the textarea, and nothing else.
 *
 * Deliberately its own constant rather than BODY_TYPE: this page's sizes are
 * set by SPEC §2 and must not drift when the app's body copy is retuned.
 */
export const MEANING_TYPE: CSSProperties = {
  fontFamily: 'var(--font-dm-sans), sans-serif',
  fontSize: 'clamp(16px, 2.2vw, 18px)',
  lineHeight: 1.5,
};

export const MEANING_SUB_TYPE: CSSProperties = {
  fontFamily: 'var(--font-dm-sans), sans-serif',
  fontSize: 'clamp(12.5px, 1.6vw, 13px)',
  lineHeight: 1.55,
};
