'use client';

import { cardAccords, cardScents, SCENT_RELATIONS } from '@/lib/data/card-scents';

/**
 * The scent accord for a card, between the meaning and the personalised read.
 *
 * The deck's accords are held in perfumery's three tiers — top, heart, base —
 * so the labels here name the tier rather than each individual note. A note
 * cannot be told apart from its neighbours by tier alone ("cooled by black
 * pepper" would be nonsense), so the label is printed once against the first
 * note of its tier and the rest of that tier stacks underneath it. That keeps
 * the design's one-note-per-line rhythm without inventing a relationship the
 * data does not carry.
 *
 * Deliberately the one block on this screen not set in the handwritten face:
 * these are materials on a shelf, not more voice.
 *
 * The greens are the design's own — a muted sage for the labels, a warm bone
 * for the notes — chosen to sit quieter than the lime headings around them.
 */
const LABEL = '#8E9A85';
const NOTE = '#F7F4E6';

/** Tier order is fixed: what you meet first, the body, what lingers. */
const TIERS = [
  { key: 'top', label: 'OPENS WITH' },
  { key: 'heart', label: 'STEADIED BY' },
  { key: 'base', label: 'CLOSES ON' },
] as const;

export function ScentNotes({ cardId }: { cardId: string }) {
  const accord = cardAccords[cardId];
  const scent = cardScents[cardId];

  // A written six-note accord wins; suits still to be written fall back to the
  // three tiers, labelled once each, so the deck stays whole in the meantime.
  const rows = accord
    ? SCENT_RELATIONS.map(relation => ({
        label: relation as string,
        note: accord[relation],
        key: relation,
      }))
    : scent
    ? TIERS.flatMap(({ key, label }) =>
        scent[key].map((note, i) => ({
          label: i === 0 ? label : '',
          note,
          key: `${key}-${note}`,
        })),
      )
    : [];

  if (rows.length === 0) return null;

  return (
    <section aria-label="scent notes">
      {/* Centred with the block below it — a left heading over a centred panel
          reads as a mistake rather than as a choice. */}
      <h4
        className="text-[#C9F24E] mb-3 md:mb-5 text-center"
        style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: 'var(--font-reenie-beanie), cursive' }}
      >
        scent notes
      </h4>

      <dl
        style={{
          display: 'grid',
          // Label column tracks the design's 118-of-430 proportion on a phone
          // and stops growing after that; the note column takes only the width
          // its longest note needs, so the pair can be centred as one unit.
          gridTemplateColumns: 'clamp(88px, 27vw, 132px) max-content',
          columnGap: 'clamp(14px, 4vw, 18px)',
          rowGap: 'clamp(10px, 3vw, 12px)',
          alignItems: 'baseline',
          // Centred in the column: the block is a spec panel rather than prose,
          // and left-aligning it against the handwritten body above left the
          // seam floating in the middle of nothing.
          width: 'fit-content',
          marginInline: 'auto',
          marginBlock: 0,
        }}
      >
        {rows.map(({ label, note, key }) => (
          <div key={key} style={{ display: 'contents' }}>
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
              {label}
            </dt>
            <dd
              style={{
                margin: 0,
                fontFamily: 'var(--font-vt323), monospace',
                fontSize: 'clamp(19px, 5vw, 26px)',
                lineHeight: 1,
                color: NOTE,
                textTransform: 'uppercase',
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
