// Loose, whimsical pen-drawn icons for Minor Arcana suits
// Thin flowing strokes (1.2-2.5px) with mixed weights for artistic depth

// Cups suit - delicate chalice with flowing water
export const CupsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Chalice bowl - loose organic shape */}
    <path
      d="M 31 28 Q 29.5 36 29.5 42 Q 29.5 48 35 52 L 35 68 Q 35 70 37 70 L 63 70 Q 65 70 65 68 L 65 52 Q 70.5 48 70.5 42 Q 70.5 36 69 28 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    {/* Stem */}
    <path
      d="M 48 70 L 48 76"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Base */}
    <ellipse cx="48" cy="79" rx="11" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    {/* Handle - left (loose curve) */}
    <path
      d="M 29.5 36 Q 22 36.5 21 41 Q 20.5 44.5 24 45.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      opacity="0.75"
    />
    {/* Handle - right (loose curve) */}
    <path
      d="M 70.5 36 Q 78 36.5 79 41 Q 79.5 44.5 76 45.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      opacity="0.75"
    />
    {/* Water ripple inside */}
    <path
      d="M 38 38 Q 48 39.5 62 38"
      stroke="currentColor"
      strokeWidth="1.3"
      opacity="0.4"
    />
  </svg>
);

// Wands suit - living branch with sprouting leaves
export const WandsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Main branch with organic curve */}
    <path
      d="M 49 16 Q 49.5 32 48.5 48 Q 48 64 49 82"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    {/* Top bud */}
    <circle cx="49" cy="14" r="3.5" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1.8" />
    {/* Leaves sprouting - loose curves */}
    <path
      d="M 48.5 28 Q 40 27 36 31"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 48.5 33 Q 57 32 61 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 48 44 Q 41 43 37.5 47"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 48 49 Q 55 48 58.5 52"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 48.5 60 Q 42 59 38.5 63"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M 48.5 65 Q 55 64 58.5 68"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    {/* Little leaf details */}
    <path d="M 37 30 Q 35.5 29 34 29" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    <path d="M 60 35 Q 61.5 34 63 34" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
  </svg>
);

// Swords suit - elegant blade with delicate details
export const SwordsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Blade - narrow with subtle fill */}
    <path
      d="M 49 16 L 49.5 16 L 51 68 L 49 68 Z"
      fill="currentColor"
      opacity="0.12"
    />
    {/* Blade outline */}
    <path
      d="M 49 16 L 49.5 16 L 51 68 L 49 68 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {/* Point */}
    <path
      d="M 49 16 L 50 11 L 51 16"
      fill="currentColor"
      opacity="0.14"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    {/* Cross guard - delicate */}
    <path
      d="M 36 68 Q 36.5 70 38 70 L 62 70 Q 63.5 70 64 68"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    {/* Handle grip */}
    <path
      d="M 47 70 L 47 80 L 53 80 L 53 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M 47 73 L 53 73 M 47 76 L 53 76" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
    {/* Pommel */}
    <circle cx="50" cy="83" r="3.5" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// Pentacles suit - organic flower mandala
export const PentaclesIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer circle - loose */}
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    />
    {/* Inner flower/star pattern - 5 petals */}
    <path
      d="M 50 26 Q 48 34 49 38 Q 50 40 51 38 Q 52 34 50 26 Z"
      fill="currentColor"
      opacity="0.12"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 65.5 38 Q 60 42 57 44 Q 55.5 45 56.5 46.5 Q 60 48 65.5 38 Z"
      fill="currentColor"
      opacity="0.12"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 62 62 Q 55 60 52 59 Q 50.5 59 51 60.5 Q 53 64 62 62 Z"
      fill="currentColor"
      opacity="0.12"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 38 62 Q 45 60 48 59 Q 49.5 59 49 60.5 Q 47 64 38 62 Z"
      fill="currentColor"
      opacity="0.12"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M 34.5 38 Q 40 42 43 44 Q 44.5 45 43.5 46.5 Q 40 48 34.5 38 Z"
      fill="currentColor"
      opacity="0.12"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    {/* Center circle */}
    <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);
