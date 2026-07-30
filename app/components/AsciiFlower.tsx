'use client';

import { useEffect, useRef, useState } from 'react';

interface AsciiFlowerProps {
  /** Grid width in characters. Odd numbers keep the bloom centred. */
  cols?: number;
  /** Grid height in characters. Odd numbers keep the bloom centred. */
  rows?: number;
  /** Character size in px. */
  fontSize?: number;
  /** One full open-and-close cycle, in ms. */
  periodMs?: number;
  /** Defaults to currentColor so it inherits. */
  color?: string;
  /** Announced to assistive tech. */
  label?: string;
  className?: string;
}

/**
 * A monospace cell is taller than it is wide, so vertical distance has to be
 * scaled up before measuring radius or the flower comes out as a wide oval.
 * Paired with the 0.85 lineHeight set on the <pre> below.
 */
const CELL_ASPECT = 1.7;

/** Sparse to dense. Digits echo the reference art's shading. */
const RAMP = ['.', '1', '2', '4', '8'];

const PETALS = 6;

/**
 * Renders one frame of the bloom.
 *
 * `openness` runs 0 (closed bud) to 1 (fully open). Each petal is its own lobe
 * that travels outward from the centre and grows as the flower opens, so a
 * tight bud unfurls into separate petals. Shading comes from the distance to
 * the nearest petal centre, which keeps the core round instead of smearing it
 * along the petal axes.
 */
function renderFlower(openness: number, cols: number, rows: number): string {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  // Normalise against the smaller visual half-extent so the bloom stays round
  // and always fits, whatever grid it is given.
  const scale = Math.min(cx, cy * CELL_ASPECT);

  const petalDistance = 0.05 + 0.45 * openness;
  const petalRadius = 0.17 + 0.17 * openness;
  const coreRadius = 0.09 + 0.05 * openness;

  const lines: string[] = [];

  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < cols; x++) {
      const nx = (x - cx) / scale;
      const ny = ((y - cy) * CELL_ASPECT) / scale;

      if (Math.hypot(nx, ny) < coreRadius) {
        line += '@';
        continue;
      }

      let nearest = Infinity;
      for (let i = 0; i < PETALS; i++) {
        const angle = (i * 2 * Math.PI) / PETALS - Math.PI / 2;
        const d = Math.hypot(
          nx - petalDistance * Math.cos(angle),
          ny - petalDistance * Math.sin(angle),
        );
        if (d < nearest) nearest = d;
      }

      if (nearest >= petalRadius) {
        line += ' ';
        continue;
      }

      const density = 1 - nearest / petalRadius;
      const index = Math.min(RAMP.length - 1, Math.floor(density * RAMP.length));
      line += RAMP[index];
    }
    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * An ASCII flower that opens and closes on a loop — the app's loading state.
 *
 * Replaces the spinners and pulsing circles. A spinner reads as "processing";
 * a flower breathing open and shut suits a product about slowing down.
 */
export default function AsciiFlower({
  cols = 21,
  rows = 11,
  fontSize = 14,
  periodMs = 3200,
  color = 'currentColor',
  label = 'loading',
  className = '',
}: AsciiFlowerProps) {
  // Start part-open so the very first painted frame already reads as a flower.
  const [frame, setFrame] = useState(() => renderFlower(0.55, cols, rows));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setFrame(renderFlower(0.8, cols, rows));
      return;
    }

    const start = performance.now();
    let lastPainted = 0;

    const tick = (now: number) => {
      // ASCII reads better chunky than smooth, and repainting a string 60
      // times a second is wasted work — step at ~12fps instead.
      if (now - lastPainted > 80) {
        const phase = ((now - start) % periodMs) / periodMs;
        // cosine ease: 0 -> 1 -> 0, so it opens and closes in one cycle
        const openness = (1 - Math.cos(phase * Math.PI * 2)) / 2;
        setFrame(renderFlower(openness, cols, rows));
        lastPainted = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cols, rows, periodMs]);

  return (
    <pre
      role="status"
      aria-label={label}
      className={`select-none ${className}`}
      style={{
        fontFamily: 'var(--font-vt323), monospace',
        fontSize: `${fontSize}px`,
        lineHeight: 0.85,
        letterSpacing: 0,
        color,
        margin: 0,
        whiteSpace: 'pre',
      }}
    >
      {frame}
    </pre>
  );
}
