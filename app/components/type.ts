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
