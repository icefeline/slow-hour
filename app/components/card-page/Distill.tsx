import styles from './card-page.module.css';
import { cardAccords, cardMemories, cardScents, SCENT_RELATIONS } from '@/lib/data/card-scents';
import { dotLeader, relationVerb, slotIndex, widestNote } from '@/lib/utils/card-readout';

/**
 * SPEC §08. The card's six notes, and the memory they carry.
 *
 * This is where the old ScentNotes panel went. Same accord data and the same
 * fallback for suits whose six-note form hasn't been written yet; what changed
 * is that the block now leads with the memory paragraph, so the notes read as
 * the distillation of a remembered scene rather than as a spec sheet that
 * happens to sit under one.
 *
 * The ASCII drawing that bleeds off the top-right in the reference is not here:
 * the `asc-` set covers six notes out of the deck's full palette, so most cards
 * would show a drawing belonging to a note they don't contain. The block clips
 * its own overflow already, so the layer can be dropped back in when the
 * drawings are complete without moving anything else.
 */
export function Distill({ cardId }: { cardId: string }) {
  const rows = accordRows(cardId);
  if (rows.length === 0) return null;

  const memory = cardMemories[cardId];
  const written = cardId in cardAccords;
  const names = rows.map(row => row.note.toUpperCase());
  const widest = widestNote(names);

  return (
    <section className={styles.distill}>
      <div className={styles.prompt}>&gt; DISTILL --NOTES {rows.length}</div>

      {memory && <p className={styles.memory}>{memory}</p>}

      <div className={styles.notes}>
        {rows.map((row, i) => {
          const name = names[i];
          return (
            <div key={row.key}>
              {slotIndex(i)} {name}{' '}
              <span className={styles.dots}>
                {dotLeader(name, widest)} {relationVerb(row.label)}
              </span>
            </div>
          );
        })}
      </div>

      {/* The count is only a confirmation if it can also fail. A card on the
          tier fallback has notes but no written accord, and says so. */}
      <div className={styles.done}>
        {written
          ? `> DONE. ${rows.length}/${SCENT_RELATIONS.length} WRITTEN`
          : `> PARTIAL. ${rows.length} NOTES, ACCORD UNWRITTEN`}
      </div>
    </section>
  );
}

/**
 * A card's accord as label/note pairs.
 *
 * Ported from ScentNotes unchanged in substance: a written six-note accord
 * wins, and a card still on the three tiers is expanded into its notes with the
 * tier named once, so the deck stays whole while the suits fill in.
 */
function accordRows(cardId: string): Array<{ label: string; note: string; key: string }> {
  const accord = cardAccords[cardId];
  if (accord) {
    return SCENT_RELATIONS.map(relation => ({
      label: relation as string,
      note: accord[relation],
      key: relation,
    }));
  }

  const scent = cardScents[cardId];
  if (!scent) return [];

  const TIERS = [
    { key: 'top', label: 'OPENS WITH' },
    { key: 'heart', label: 'STEADIED BY' },
    { key: 'base', label: 'CLOSES ON' },
  ] as const;

  return TIERS.flatMap(({ key, label }) =>
    scent[key].map((note, i) => ({
      label: i === 0 ? label : '',
      note,
      key: `${key}-${note}`,
    })),
  );
}

export default Distill;
