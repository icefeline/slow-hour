import type { CSSProperties } from 'react';
import styles from './card-page.module.css';

/**
 * SPEC §02. The card name is the headline — there is no separate lime name
 * line, and the suit word is not displayed here (it belongs to the state line).
 *
 * Uppercasing is done in CSS so the deck's own sentence-case names stay intact
 * in the data.
 */
export function CardName({ name }: { name: string }) {
  // The stylesheet sizes the line from this so the name never wraps; see the
  // --fit calculation on .cardname.
  return (
    <h1
      className={styles.cardname}
      style={{ '--len': name.length } as CSSProperties}
    >
      {name}
    </h1>
  );
}

export default CardName;
