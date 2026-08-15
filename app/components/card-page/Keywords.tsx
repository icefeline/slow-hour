import styles from './card-page.module.css';

/**
 * SPEC §06. Five keywords, one per line, in the mono list voice.
 *
 * This replaced a ring of handwritten words revolving around the card. The list
 * is the same five keywords; what it stops doing is moving, which SPEC §5 rules
 * out, and competing with the card name for the eye.
 */
export function Keywords({ keywords }: { keywords: string[] }) {
  if (keywords.length === 0) return null;

  return (
    <section className={styles.keywords}>
      <div className={styles.prompt}>&gt; KEYWORDS</div>
      <ul>
        {keywords.slice(0, 5).map(keyword => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
    </section>
  );
}

export default Keywords;
