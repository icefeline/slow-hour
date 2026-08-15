/**
 * One line of the margin column: the number, then what it is.
 *
 * Rows are built by the caller and any row it has no real number for is simply
 * never constructed — SPEC §1.6. Nothing downstream substitutes a placeholder,
 * so a short column is the honest result of a reader with no birth location
 * rather than a rendering bug.
 */
export interface MarginRow {
  /** The figure itself: `07:14`, `68%`, `0°14'`, `289`. */
  value: string;
  /** The word set in the fainter moss beside it: `drawn`, `sunrise`, `orb`. */
  label: string;
}
