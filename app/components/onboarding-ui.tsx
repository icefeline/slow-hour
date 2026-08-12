'use client';

import React from 'react';

/**
 * Shared chrome for the onboarding screens.
 *
 * The design is drawn on a 356 × 748 canvas. Neither surface is that size —
 * mobile is the viewport, desktop is a 647 × 909 panel — so every dimension is
 * expressed as design-pixels multiplied by a scale factor. Write the design
 * once, render it at whatever size the surface actually is.
 *
 * `light` is the desktop panel (cobalt on the pale ground); `dark` is mobile,
 * full bleed over the leaf video (lime on foliage, hence the text shadows).
 */
export type Tone = 'dark' | 'light';

export const LIME = '#C9F24E';
export const COBALT = '#2B35D6';
export const INK = '#172211';
export const BONE = '#EEF4E0';

const MONO = 'var(--font-dm-mono), ui-monospace, monospace';
const PIXEL = 'var(--font-vt323), monospace';

/** Titles and accents: cobalt on the pale panel, lime over video. */
export const accentOf = (tone: Tone) => (tone === 'light' ? COBALT : LIME);
/** Body copy. */
export const bodyOf = (tone: Tone) => (tone === 'light' ? INK : BONE);
/** Only type over moving foliage needs the shadow. */
const shadow = (tone: Tone) => (tone === 'dark' ? '0 2px 18px rgba(0,0,0,.5)' : undefined);

/** design px → rendered px */
const px = (n: number, s: number) => `${n * s}px`;

export function ObBack({ tone, scale, onClick }: { tone: Tone; scale: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute', left: px(24, scale), top: px(26, scale), zIndex: 10,
        fontFamily: MONO, fontSize: px(9.5, scale), letterSpacing: '0.24em',
        color: accentOf(tone), background: 'none', border: 'none', cursor: 'pointer',
        padding: 0,
      }}
    >
      ← BACK
    </button>
  );
}

export function ObHead({
  tone, scale, title, sub, eyebrow = '▸ ASKING', tight = false,
}: {
  tone: Tone; scale: number; title: React.ReactNode; sub?: React.ReactNode;
  eyebrow?: string; tight?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute', left: px(24, scale), right: px(24, scale), top: px(106, scale),
        display: 'flex', flexDirection: 'column', gap: px(12, scale),
      }}
    >
      <div style={{ fontFamily: PIXEL, fontSize: px(22, scale), color: bodyOf(tone), opacity: tone === 'dark' ? 0.8 : 1 }}>
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: PIXEL,
          fontSize: px(tight ? 52 : 60, scale),
          lineHeight: tight ? 1.05 : 0.94,
          letterSpacing: tight ? '-0.01em' : undefined,
          color: accentOf(tone),
          textShadow: shadow(tone),
        }}
      >
        {title}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: MONO, fontSize: px(11, scale), letterSpacing: '0.13em',
            lineHeight: 1.85, color: bodyOf(tone), opacity: tone === 'light' ? 0.6 : 0.75,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

/** The block the fields sit in — same top edge on every screen. */
export function ObFields({
  scale, stack = false, children,
}: { scale: number; stack?: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute', left: px(24, scale), right: px(24, scale), top: px(406, scale),
        display: 'flex', flexDirection: 'column', gap: stack ? px(16, scale) : 0,
      }}
    >
      {children}
    </div>
  );
}

export function fieldStyle(tone: Tone, scale: number, on: boolean, tall = false): React.CSSProperties {
  return {
    height: px(tall ? 70 : 62, scale),
    display: 'flex', alignItems: 'center',
    justifyContent: tall ? 'flex-start' : 'space-between',
    gap: tall ? px(10, scale) : undefined,
    padding: `0 ${px(18, scale)}`,
    border: on
      ? `1px solid ${tone === 'light' ? COBALT : 'rgba(201,242,78,.6)'}`
      : `1px solid ${tone === 'light' ? 'rgba(18,50,31,.28)' : 'rgba(238,244,224,.28)'}`,
    background: on
      ? (tone === 'light' ? 'rgba(255,255,255,.45)' : 'rgba(12,24,14,.3)')
      : 'transparent',
    // squared corners are the whole look here — no radius
    borderRadius: 0,
  };
}

export function ObTag({ tone, scale, required }: { tone: Tone; scale: number; required: boolean }) {
  return (
    <span
      style={{
        fontFamily: MONO, fontSize: px(9, scale), letterSpacing: '0.2em',
        padding: `${px(3, scale)} ${px(7, scale)}`,
        ...(required
          ? { background: accentOf(tone), color: tone === 'light' ? '#F7F4E6' : INK }
          : { opacity: 0.45, color: bodyOf(tone) }),
      }}
    >
      {required ? 'REQ' : 'OPT'}
    </span>
  );
}

export function ObHint({ tone, scale, children }: { tone: Tone; scale: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: px(10, scale), fontFamily: MONO, fontSize: px(9, scale),
        letterSpacing: '0.2em', color: bodyOf(tone), opacity: tone === 'light' ? 0.45 : 0.6,
      }}
    >
      {children}
    </div>
  );
}

/** Chunky square toggle — deliberately not a pill, to match the field corners. */
export function ObToggle({
  tone, scale, on, onChange, label,
}: { tone: Tone; scale: number; on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      style={{
        width: px(76, scale), height: px(34, scale),
        background: on ? LIME : 'transparent',
        border: on
          ? (tone === 'light' ? `1px solid ${INK}` : 'none')
          : `1px solid ${tone === 'light' ? 'rgba(18,50,31,.4)' : 'rgba(238,244,224,.4)'}`,
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
        padding: px(3, scale), cursor: 'pointer', borderRadius: 0,
      }}
    >
      <span
        style={{
          width: px(28, scale), height: px(26, scale),
          background: on ? INK : (tone === 'light' ? INK : BONE),
          display: 'block',
        }}
      />
    </button>
  );
}

export function ObCta({
  scale, onClick, disabled = false, label = 'CONTINUE',
}: { scale: number; onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'absolute', left: px(24, scale), right: px(24, scale), bottom: px(34, scale),
        height: px(62, scale), background: LIME, color: INK,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${px(22, scale)}`, border: 'none', borderRadius: 0,
        fontFamily: PIXEL, fontSize: px(28, scale),
        cursor: disabled ? 'default' : 'pointer',
        // kept in place rather than unmounted so the layout never jumps
        opacity: disabled ? 0.35 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'opacity .2s ease',
      }}
    >
      <span>{label}</span>
      <span>→</span>
    </button>
  );
}

/** Shared value/input typography inside a field. */
export const obValue = (scale: number, typed = false): React.CSSProperties => ({
  fontFamily: PIXEL,
  fontSize: px(typed ? 36 : 30, scale),
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: 0,
  width: '100%',
});

export { MONO as OB_MONO, PIXEL as OB_PIXEL, px as obPx };
