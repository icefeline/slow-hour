'use client';

/**
 * Paper tooth over the green ground.
 *
 * Three fixed layers, all inert to pointers and all sitting behind the content:
 *   grain     — two dot lattices at different pitches, so it reads as paper
 *               rather than a repeating pattern
 *   light     — sun through leaves; drifts over ~48s so the screen is never
 *               quite still, which is the whole point of the product
 *   vignette   — pulls the edges down so the reading column stays the
 *               brightest thing on screen
 *
 * Fixed rather than absolute: the texture belongs to the screen, not the
 * document, so it must not scroll with a long reading or the year grid.
 *
 * Not used on onboarding — that sits over video, which has its own tooth.
 */
export default function GroundTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 0.45,
          backgroundImage: [
            'radial-gradient(circle at 50% 50%, rgba(240,244,230,.20) 0 .6px, transparent .7px)',
            'radial-gradient(circle at 20% 80%, rgba(0,0,0,.28) 0 .7px, transparent .8px)',
          ].join(','),
          backgroundSize: '3px 3px, 5px 5px',
        }}
      />
      <div
        aria-hidden="true"
        className="sg-light pointer-events-none fixed z-0"
        style={{
          inset: '-10%',
          opacity: 0.55,
          background: [
            'radial-gradient(ellipse 46% 34% at 22% 12%, rgba(201,242,78,.13) 0%, transparent 68%)',
            'radial-gradient(ellipse 52% 38% at 84% 62%, rgba(0,0,0,.45) 0%, transparent 70%)',
            'radial-gradient(ellipse 38% 30% at 40% 92%, rgba(0,0,0,.35) 0%, transparent 72%)',
          ].join(','),
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          // the app's own ground colour, so this deepens the edges without tinting
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(23,34,17,.55) 0%, transparent 75%)',
        }}
      />
    </>
  );
}
