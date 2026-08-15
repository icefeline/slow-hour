'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * The app's loading state: a plant, drawn out of a sentence.
 *
 * The design bundle's 3b — letterform halftone. A flowering plant is painted to
 * an offscreen canvas, sampled per character cell, and thresholded against a
 * Bayer matrix, so tone comes from how many cells fire rather than from which
 * character sits in them. The marks that fire are not a shading ramp: they are
 * the next glyph of a line of philosophy, advanced once per inked cell in
 * reading order, so the sentence runs through the form and loops.
 *
 * There is no ground. Unlit cells are spaces, so it paints in currentColor over
 * whatever is behind it.
 *
 * The plant breathes on a five-second triangle — three primary blooms on a
 * tapered stem, each sprouting secondary stems whose smaller blooms open a beat
 * behind their parent, so it unfolds outward-and-upward rather than all at
 * once, then folds back.
 */

/** Cell is 3×5 px, matching DM Mono's advance-to-line-height ratio. */
const CW = 3;
const CH = 5;

/**
 * The reference grid, and it does not change.
 *
 * A halftone is only legible at density: tone comes from how many cells fire,
 * so dropping cells to fit a small container does not shrink the drawing, it
 * destroys it — at 48 columns the plant reads as noise. The grid is therefore
 * fixed and the character size scales instead, which is what keeps the same
 * picture on a phone and on a desktop.
 */
const COLS = 132;
const ROWS = 82;

/** DM Mono advances about 0.6em. */
const ADVANCE = 0.6;

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** The lines the plant can be written out of. */
export const SCRIPTS = {
  'begin again':
    'WHAT IS TO GIVE LIGHT MUST ENDURE BURNING AND WHAT IS TO BLOOM MUST FIRST CONSENT TO BEING CLOSED ',
  'the same river':
    'NO ONE STEPS IN THE SAME RIVER TWICE FOR IT IS NOT THE SAME RIVER AND THEY ARE NOT THE SAME PERSON ',
  attention:
    'ATTENTION IS THE RAREST AND PUREST FORM OF GENEROSITY IT IS ALSO THE ONLY THING YOU EVER REALLY GIVE ',
  'the unlived life':
    'UNTIL YOU MAKE THE UNCONSCIOUS CONSCIOUS IT WILL DIRECT YOUR LIFE AND YOU WILL CALL IT FATE ',
} as const;

export type ScriptName = keyof typeof SCRIPTS;

const FRAME_MS = 130;
const BREATH_MS = 5000;

function smooth(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

/** Tapered stem: a quadratic curve drawn as a polygon so it can thin to a tip. */
function stem(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number, cx: number, cy: number, x1: number, y1: number,
  w0: number, w1: number,
) {
  const N = 22;
  const L: [number, number][] = [];
  const R: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const mt = 1 - t;
    const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1;
    const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
    const dx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx);
    const dy = 2 * mt * (cy - y0) + 2 * t * (y1 - cy);
    const len = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * t) / 2;
    L.push([x - (dy / len) * w, y + (dx / len) * w]);
    R.push([x + (dy / len) * w, y - (dx / len) * w]);
  }
  ctx.beginPath();
  L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
  ctx.closePath();
  ctx.fill();
}

function bloom(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, open: number, petals: number,
) {
  const o = smooth(open);
  if (o <= 0.001) return;
  const len = r * (0.3 + 0.7 * o);
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2 + o * 0.5;
    ctx.save();
    ctx.rotate(a);
    const g = ctx.createLinearGradient(0, 0, 0, -len);
    g.addColorStop(0, '#4a4a4a');
    g.addColorStop(0.45, '#f2f2f2');
    g.addColorStop(1, '#8a8a8a');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, -len * 0.58, len * (0.16 + 0.24 * o), len * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  const cr = r * (0.16 + 0.12 * o);
  const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, cr);
  cg.addColorStop(0, '#ffffff');
  cg.addColorStop(0.55, '#c8c8c8');
  cg.addColorStop(1, '#2a2a2a');
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.arc(0, 0, cr, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Flowers stemming from flowers. The black fill is the sampling ground only. */
function paintPlant(ctx: CanvasRenderingContext2D, W: number, H: number, breath: number) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ededed';

  stem(ctx, W * 0.5, H, W * 0.47, H * 0.72, W * 0.5, H * 0.4, W * 0.035, W * 0.012);

  const nodes = [
    { x: 0.5, y: 0.4, r: 0.15, p: 0, n: 8, from: [0.5, 0.62], c: [0.51, 0.5] },
    { x: 0.24, y: 0.5, r: 0.115, p: 0.22, n: 7, from: [0.49, 0.74], c: [0.32, 0.66] },
    { x: 0.77, y: 0.44, r: 0.1, p: 0.38, n: 7, from: [0.5, 0.66], c: [0.72, 0.6] },
  ];

  for (const nd of nodes) {
    const fx = nd.from[0] * W;
    const fy = nd.from[1] * H;
    const tx = nd.x * W;
    const ty = nd.y * H;
    stem(ctx, fx, fy, nd.c[0] * W, nd.c[1] * H, tx, ty, W * 0.017, W * 0.008);

    const o = smooth(breath * 1.45 - nd.p);

    [-0.85, 0.72].forEach((ang, k) => {
      const so = smooth(breath * 1.45 - nd.p - 0.3);
      if (so <= 0.001) return;
      const L = nd.r * W * (0.9 + 0.7 * so);
      const sx = tx + Math.sin(ang) * L;
      const sy = ty - Math.cos(ang) * L * 0.9;
      ctx.fillStyle = '#dcdcdc';
      stem(ctx, tx, ty, tx + Math.sin(ang) * L * 0.45, ty - Math.cos(ang) * L * 0.75,
        sx, sy, W * 0.009, W * 0.004);
      bloom(ctx, sx, sy, nd.r * W * (0.34 - k * 0.06), so, 6);
      ctx.fillStyle = '#ededed';
    });

    bloom(ctx, tx, ty, nd.r * W, o, nd.n);
  }

  ctx.fillStyle = '#c9c9c9';
  ([[-1, 0.3], [1, 0.26], [-1, 0.2]] as const).forEach(([dir, s], i) => {
    const y0 = H * (0.88 - i * 0.06);
    stem(ctx, W * 0.5, y0, W * (0.5 + dir * s * 0.8), y0 - H * 0.06,
      W * (0.5 + dir * s * 1.5), y0 - H * 0.13, W * 0.02, W * 0.002);
  });
}

interface AsciiFlowerProps {
  /**
   * How wide the drawing should be. Any CSS length.
   *
   * Set on the host rather than inherited from it: these usually sit inside a
   * centred flex column that has shrunk to its other children, and a plant
   * measured against that comes out a couple of hundred pixels wide. Declaring
   * the width means the flower decides its own size and the column grows to it.
   */
  width?: string;
  /** Which line the plant is written out of. */
  script?: ScriptName;
  /** Defaults to currentColor so it inherits from wherever it is dropped. */
  color?: string;
  /** Announced to assistive tech; the art itself is hidden from it. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function AsciiFlower({
  width = 'min(86vw, 520px)',
  script = 'begin again',
  color,
  label = 'loading',
  className,
  style,
}: AsciiFlowerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState('');

  /**
   * Character size, from the room it actually has.
   *
   * The whole drawing is 132 characters wide, so the size that makes it fit is
   * simply the width divided by that. Small containers get small type and the
   * plant still reads, because every cell is still there.
   */
  const [fontPx, setFontPx] = useState(9);
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const room = host.clientWidth || host.parentElement?.clientWidth || window.innerWidth;
      setFontPx(Math.max(2.4, Math.min(12, room / (COLS * ADVANCE))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = COLS * CW;
    canvas.height = ROWS * CH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();

    const draw = () => {
      /*
       * Unfurl, hold, fold back. A pure triangle touches full bloom for a
       * single frame, so almost every glance caught the plant half open and it
       * read as an unfinished drawing rather than a flower. It now spends a
       * third of the breath fully open, which is the state the design shows.
       */
      const phase = still ? 0.5 : ((performance.now() - start) % BREATH_MS) / BREATH_MS;
      const breath =
        phase < 0.34 ? phase / 0.34
        : phase < 0.66 ? 1
        : 1 - (phase - 0.66) / 0.34;

      paintPlant(ctx, canvas.width, canvas.height, breath);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const src = SCRIPTS[script].replace(/\s+/g, ' ');
      let cursor = 0;
      const nextGlyph = () => {
        let ch = src[cursor++ % src.length];
        // Skip the spaces, or the plant would show holes where they land.
        if (ch === ' ') ch = src[cursor++ % src.length];
        return ch;
      };

      const lines: string[] = [];
      for (let r = 0; r < ROWS; r++) {
        let line = '';
        for (let c = 0; c < COLS; c++) {
          let sum = 0;
          for (let j = 0; j < CH; j++) {
            for (let i = 0; i < CW; i++) {
              const p = ((r * CH + j) * canvas.width + (c * CW + i)) * 4;
              sum += (data[p] * 0.2126 + data[p + 1] * 0.7152 + data[p + 2] * 0.0722) / 255;
            }
          }
          const value = Math.max(0, Math.min(1, Math.pow(sum / (CW * CH), 0.85) * 1.12));
          const threshold = (BAYER[r & 3][c & 3] + 0.5) / 16;
          line += value > threshold ? nextGlyph() : ' ';
        }
        lines.push(line.replace(/\s+$/, ''));
      }
      setFrame(lines.join('\n'));
    };

    draw();
    if (still) return;
    const timer = setInterval(draw, FRAME_MS);
    return () => clearInterval(timer);
  }, [script]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        width,
        maxWidth: '100%',
        flexShrink: 0,
        // Centres the drawing as one block, in whatever it is dropped into.
        marginInline: 'auto',
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
      role="status"
      aria-label={label}
    >
      <pre
        aria-hidden="true"
        style={{
          margin: 0,
          fontFamily: 'var(--font-dm-mono), ui-monospace, monospace',
          fontSize: `${fontPx}px`,
          /*
           * The sampling cell is 3 wide by 5 tall, so the rendered cell has to
           * be too or the plant comes out squashed. DM Mono advances about
           * 0.6em, so a line box of exactly 1em puts the ratio at 0.6:1 — which
           * is 3:5. Anything else and the drawing distorts on one axis.
           */
          lineHeight: 1,
          letterSpacing: 0,
          color: color ?? 'currentColor',
          whiteSpace: 'pre',
          userSelect: 'none',
          /*
           * Emphatically not text-align: center. Every line is a row of the
           * picture and they only line up when they all start at the same x —
           * centring each line by its own length shears the plant apart, which
           * looks like a half-drawn flower rather than a misalignment. The
           * block is centred by the host below instead.
           */
          textAlign: 'left',
        }}
      >
        {frame}
      </pre>
    </div>
  );
}

export { AsciiFlower };
