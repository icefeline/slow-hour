// Hand-drawn style icons for Minor Arcana suits

// Cups suit - hand-drawn chalice
export const CupsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    {/* Chalice cup */}
    <path
      d="M 30 25 Q 28 35 28 40 L 28 45 Q 28 52 35 55 L 35 70 Q 35 72 37 72 L 63 72 Q 65 72 65 70 L 65 55 Q 72 52 72 45 L 72 40 Q 72 35 70 25 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      opacity="0.85"
    />
    {/* Base */}
    <path
      d="M 40 72 L 40 78 L 35 78 Q 33 78 33 80 L 67 80 Q 67 78 65 78 L 60 78 L 60 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      opacity="0.85"
    />
    {/* Handle - left */}
    <path
      d="M 28 35 Q 20 35 20 40 Q 20 45 25 45"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.75"
    />
    {/* Handle - right */}
    <path
      d="M 72 35 Q 80 35 80 40 Q 80 45 75 45"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.75"
    />
  </svg>
);

// Wands suit - hand-drawn staff/wand
export const WandsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    {/* Main wand shaft with slight curve */}
    <path
      d="M 48 15 Q 49 35 48 50 Q 47 65 48 85"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* Top ornament */}
    <circle cx="48" cy="15" r="4" opacity="0.8" />
    {/* Leaves sprouting from wand */}
    <path
      d="M 48 30 Q 38 28 35 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M 48 35 Q 58 33 61 37"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M 48 55 Q 40 53 37 57"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M 48 60 Q 56 58 59 62"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

// Swords suit - hand-drawn sword
export const SwordsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    {/* Blade */}
    <path
      d="M 48 15 L 50 15 L 52 70 L 48 70 Z"
      fill="currentColor"
      opacity="0.3"
    />
    <path
      d="M 48 15 L 50 15 L 52 70 L 48 70 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.85"
    />
    {/* Point */}
    <path
      d="M 48 15 L 50 10 L 52 15"
      fill="currentColor"
      opacity="0.85"
    />
    {/* Cross guard */}
    <path
      d="M 35 70 L 65 70"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* Handle */}
    <rect
      x="46"
      y="70"
      width="8"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.85"
    />
    {/* Pommel */}
    <circle cx="50" cy="85" r="4.5" opacity="0.8" />
  </svg>
);

// Pentacles suit - hand-drawn pentacle/coin
export const PentaclesIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    {/* Outer circle */}
    <circle
      cx="50"
      cy="50"
      r="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      opacity="0.85"
    />
    {/* Inner pentagram star */}
    <path
      d="M 50 25 L 57 45 L 78 45 L 61 57 L 68 77 L 50 65 L 32 77 L 39 57 L 22 45 L 43 45 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.75"
    />
    {/* Center dot */}
    <circle cx="50" cy="50" r="3" opacity="0.7" />
  </svg>
);
