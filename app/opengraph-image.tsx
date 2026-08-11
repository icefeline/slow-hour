import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'slow garden — one card. one moment. one day.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CANVAS = '#172211';
const ACCENT = '#CEF17B';

/**
 * The brand spiral, as an Archimedean curve unwinding from the centre.
 * Duplicated from components/Spiral rather than imported because this renders
 * through satori, which only understands a small subset of SVG/CSS.
 */
function spiralPath(turns = 3.4, steps = 320): string {
  const centre = 50;
  const maxRadius = 44;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const radius = maxRadius * t;
    d += `${i === 0 ? 'M' : 'L'}${(centre + radius * Math.cos(angle)).toFixed(2)} ${(
      centre + radius * Math.sin(angle)
    ).toFixed(2)}`;
  }
  return d;
}

export default async function OpengraphImage() {
  const instrumentSerif = await readFile(
    path.join(process.cwd(), 'public/fonts/InstrumentSerif-Italic.ttf'),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: CANVAS,
          // a soft bloom behind the mark so the flat canvas has some depth
          backgroundImage: `radial-gradient(circle at 50% 42%, #2c3d22 0%, ${CANVAS} 62%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'Instrument Serif',
              fontStyle: 'italic',
              fontSize: 190,
              color: ACCENT,
              letterSpacing: '-0.06em',
              lineHeight: 1,
            }}
          >
            sl
          </span>
          {/* the spiral stands in for the "o", as it does in the app */}
          <svg width={150} height={150} viewBox="0 0 100 100" style={{ marginTop: 18 }}>
            <path
              d={spiralPath()}
              stroke={ACCENT}
              strokeWidth={7.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span
            style={{
              fontFamily: 'Instrument Serif',
              fontStyle: 'italic',
              fontSize: 190,
              color: ACCENT,
              letterSpacing: '-0.06em',
              lineHeight: 1,
            }}
          >
            w garden
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 34,
            fontSize: 40,
            color: '#E1EEFC',
            opacity: 0.75,
            letterSpacing: '0.01em',
          }}
        >
          one card. one moment. one day.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Instrument Serif',
          data: instrumentSerif,
          style: 'italic',
          weight: 400,
        },
      ],
    },
  );
}
