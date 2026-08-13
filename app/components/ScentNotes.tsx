'use client';

import { useEffect, useState } from 'react';
import { cardAccords, cardScents, SCENT_RELATIONS } from '@/lib/data/card-scents';
import { artForNotes } from '@/lib/data/scent-art';
import { LABEL_TYPE } from './type';

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

/**
 * The ASCII field is off while its placement is worked out.
 *
 * Everything it needs is still here and still current — the drawings in
 * public/notes, the note-to-drawing matching in scent-art.ts, and the slot
 * tables below. Flip this to true to bring it back; it also wants
 * `overflow-x: hidden` on body again, which was removed from globals.css at
 * the same time as this, since a full-bleed layer can push the page sideways
 * on a phone.
 */
const SHOW_ART = false;

/**
 * Where the ASCII drawings sit behind the notes.
 *
 * Four placements, each fading out through a radial mask so nothing has a hard
 * border. They are deliberately wider than the text column and hang past both
 * edges of it — the section clips them, so the drawings read as a field the
 * notes are set into rather than as pictures placed beside a list. Offsets are
 * percentages of the section so the bleed holds at any width.
 *
 * The opacities step down in order, so the note a card opens with anchors the
 * composition and the rest fall back into depth behind it.
 */
const ART_SLOTS = [
  { left: '1%', top: '-4%', height: 'clamp(300px, 30vw, 520px)', opacity: 0.9, mask: '48%, 94%' },
  { right: '2%', top: '12%', height: 'clamp(320px, 32vw, 560px)', opacity: 0.68, mask: '46%, 92%' },
  { left: '20%', bottom: '-8%', height: 'clamp(280px, 28vw, 480px)', opacity: 0.5, mask: '44%, 90%' },
  { right: '22%', top: '-10%', height: 'clamp(260px, 26vw, 440px)', opacity: 0.38, mask: '42%, 88%' },
] as const;

/**
 * On a phone the same four would overlap into mush and each drawing would be
 * cropped to a sliver by the screen edge. Two, larger, each keeping its own
 * side, stays legible as artwork.
 */
const ART_SLOTS_NARROW = [
  // Pushed further off each edge than the desktop slots and set lower: on a
  // phone the notes occupy the middle of the screen, so a drawing sitting
  // straight behind them competes with the labels for the same pixels.
  { left: '-34%', top: '-4%', height: 'clamp(320px, 95vw, 420px)', opacity: 0.5, mask: '50%, 95%' },
  { right: '-38%', bottom: '-8%', height: 'clamp(300px, 88vw, 400px)', opacity: 0.34, mask: '46%, 92%' },
] as const;

/** Tier order is fixed: what you meet first, the body, what lingers. */
const TIERS = [
  { key: 'top', label: 'OPENS WITH' },
  { key: 'heart', label: 'STEADIED BY' },
  { key: 'base', label: 'CLOSES ON' },
] as const;

export function ScentNotes({ cardId }: { cardId: string }) {
  const accord = cardAccords[cardId];
  const scent = cardScents[cardId];

  // Phones get a different composition, not a squeezed version of this one.
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const sync = () => setIsNarrow(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

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

  // Art follows the accord's own order, so the drawing that anchors the block
  // is the note the card opens with. Cards whose notes have no drawing yet
  // simply render without one.
  const slots = isNarrow ? ART_SLOTS_NARROW : ART_SLOTS;
  const art = SHOW_ART ? artForNotes(rows.map(r => r.note), slots.length) : [];

  return (
    <section
      aria-label="scent notes"
      style={{
        position: 'relative',
        // Roomy but not the extra height the drawings needed — with the field
        // off, that much padding just left a hole between the sections.
        paddingBlock: 'clamp(24px, 7vw, 40px)',
      }}
    >
      {art.length > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            // Broken out of the text column to the full viewport, so the
            // drawings answer to the screen rather than to the column's padding.
            // body carries overflow-x: hidden so this can't scroll the page.
            left: '50%',
            width: '100vw',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          {art.map((src, i) => {
            const slot = slots[i];
            const [inner, outer] = slot.mask.split(', ');
            const mask = `radial-gradient(closest-side, #000 ${inner}, transparent ${outer})`;
            return (
              <img
                key={src}
                src={src}
                alt=""
                style={{
                  position: 'absolute',
                  left: 'left' in slot ? slot.left : undefined,
                  right: 'right' in slot ? slot.right : undefined,
                  top: 'top' in slot ? slot.top : undefined,
                  bottom: 'bottom' in slot ? slot.bottom : undefined,
                  height: slot.height,
                  width: 'auto',
                  maxWidth: 'none',
                  opacity: slot.opacity,
                  WebkitMaskImage: mask,
                  maskImage: mask,
                  userSelect: 'none',
                }}
                draggable="false"
              />
            );
          })}
        </div>
      )}

      {/* Lifted above the art layer. */}
      <div style={{ position: 'relative' }}>
      {/* Centred with the block below it — a left heading over a centred panel
          reads as a mistake rather than as a choice. */}
      <h4
        className="text-[#C9F24E] mb-3 md:mb-5 text-center"
        style={LABEL_TYPE}
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
      </div>
    </section>
  );
}

export default ScentNotes;
