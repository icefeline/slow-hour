/**
 * Scent notes per card.
 *
 * Each card gets an accord read as a sequence — what it opens with, what holds
 * it up, what it closes on. The labels are a fixed vocabulary so the column
 * reads as one voice across the deck rather than as free-form annotations, and
 * a card only carries the relations that suit it; four notes are as valid as
 * six. Order in the array is the order rendered, so it should follow the arc of
 * the scent rather than the order of the vocabulary below.
 *
 * ASCII artwork keyed to the same cards is coming later and will sit behind
 * this block; the shape here leaves room for it without needing a change.
 */

export type ScentRelation =
  | 'OPENS WITH'
  | 'STEADIED BY'
  | 'COOLED BY'
  | 'WARMED BY'
  | 'DEEPENED BY'
  | 'CLOSES ON';

export interface ScentNote {
  relation: ScentRelation;
  note: string;
}

/** Keyed by card id — 'major-0', 'cups-king', and so on. */
export const scentNotes: Record<string, ScentNote[]> = {
  'cups-king': [
    { relation: 'OPENS WITH', note: 'ELDERFLOWER' },
    { relation: 'STEADIED BY', note: 'MAGNOLIA' },
    { relation: 'COOLED BY', note: 'WHITE ROSE' },
    { relation: 'WARMED BY', note: 'ORANGE BLOSSOM' },
    { relation: 'DEEPENED BY', note: 'YLANG YLANG' },
    { relation: 'CLOSES ON', note: 'DAMASK ROSE' },
  ],
};

/** The accord for a card, or null while one hasn't been written yet. */
export function getScentNotes(cardId: string): ScentNote[] | null {
  const notes = scentNotes[cardId];
  return notes && notes.length > 0 ? notes : null;
}
