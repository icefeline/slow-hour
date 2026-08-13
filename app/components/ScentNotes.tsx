'use client';

import { getScentNotes } from '@/lib/data/scent-notes';

/**
 * The scent accord for a card, between the meaning and the personalised read.
 *
 * Deliberately the one block on this screen not set in the handwritten face:
 * the notes are a list of materials, and the pixel face reads them as labels on
 * a shelf rather than as more voice. The label column is right-aligned against
 * the notes so the two form a single seam down the middle.
 *
 * The greens here are the design's own — a muted sage for the labels and a warm
 * bone for the notes, neither of which is in the core palette. They exist to
 * keep this block quieter than the lime headings around it.
 */
const LABEL = '#8E9A85';
const NOTE = '#F7F4E6';

export function ScentNotes({ cardId }: { cardId: string }) {
  const notes = getScentNotes(cardId);
  // Cards without an accord written yet simply don't show the section.
  if (!notes) return null;

  return (
    <section aria-label="scent notes">
      <h4
        className="text-[#C9F24E] mb-3 md:mb-5"
        style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
      >
        scent notes
      </h4>

      <dl
        style={{
          display: 'grid',
          // The label column tracks the design's proportion (118 of 430) at
          // phone widths but stops growing after that — as a percentage of the
          // desktop container it drifted a quarter of the way across the page
          // and the seam lost its relationship to the heading above.
          gridTemplateColumns: 'clamp(88px, 27vw, 132px) 1fr',
          columnGap: 'clamp(14px, 4vw, 18px)',
          rowGap: 'clamp(12px, 3.5vw, 14px)',
          alignItems: 'baseline',
          margin: 0,
        }}
      >
        {notes.map(({ relation, note }) => (
          <div key={relation} style={{ display: 'contents' }}>
            <dt
              style={{
                textAlign: 'right',
                fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
                fontSize: 'clamp(8px, 2.2vw, 10px)',
                letterSpacing: '0.2em',
                lineHeight: 1.4,
                color: LABEL,
              }}
            >
              {relation}
            </dt>
            <dd
              style={{
                margin: 0,
                fontFamily: 'var(--font-vt323), monospace',
                fontSize: 'clamp(19px, 5vw, 26px)',
                lineHeight: 1,
                color: NOTE,
              }}
            >
              {note}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default ScentNotes;
