import styles from './card-page.module.css';
import type { MarginRow } from './types';

/**
 * SPEC §05. The left margin's figures, 2-up, on mobile only.
 *
 * The grid fills row-major, so the rows are zipped rather than concatenated —
 * that puts the first half of the list down the left of the strip and the
 * second half down the right, matching the reference. An odd number of rows
 * leaves the last cell empty, which is correct: the alternative is a lone
 * figure sitting under the wrong heading.
 */
export function Readout({ rows }: { rows: MarginRow[] }) {
  if (rows.length === 0) return null;

  const half = Math.ceil(rows.length / 2);
  const zipped: MarginRow[] = [];
  for (let i = 0; i < half; i++) {
    zipped.push(rows[i]);
    if (rows[i + half]) zipped.push(rows[i + half]);
  }

  return (
    <div className={styles.readout}>
      {zipped.map(row => (
        <div key={row.label}>
          {row.value} <span>{row.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Readout;
