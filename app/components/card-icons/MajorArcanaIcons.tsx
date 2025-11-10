// Loose, organic pen-drawn icons - botanical, animals, whimsical elements
// Very thin, flowing strokes (1.2-2px) with varied pressure like Apple Pencil
// No human figures - use nature, creatures, anthropomorphic objects instead

export const FoolIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Little bird taking flight - whimsical and free */}
    {/* Body - loose organic shape with wobbles */}
    <path d="M 45 50 Q 43 48.5 42 45 Q 41 42 43 40 Q 46 39 49 40.5 Q 52 41 53 44 Q 54 47 52 50 Q 50 52 47 52 Q 46 51 45 50"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />

    {/* Head - slightly wobbly */}
    <path d="M 45 38 Q 45 34 47 32.5 Q 50 31 53 32.5 Q 55 34 55 38 Q 55 41 53 42.5 Q 50 44 47 42.5 Q 45 41 45 38"
          fill="none" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="48.5" cy="37.5" r="0.7" fill="currentColor" />

    {/* Beak */}
    <path d="M 53 38 Q 55.5 38 57 37.5" stroke="currentColor" strokeWidth="1.3" fill="none" />

    {/* Wings - loose, flowing with wobbles */}
    <path d="M 42 45 Q 36 43 31 43.5 Q 28.5 44 26.5 46" stroke="currentColor" strokeWidth="2.4" fill="none" />
    <path d="M 40.5 47 Q 35 46.5 30.5 48" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.7" />

    <path d="M 53 46 Q 59 45.5 64 47.5 Q 67 48 69.5 50" stroke="currentColor" strokeWidth="2.4" fill="none" />
    <path d="M 52.5 48 Q 57.5 49 62.5 51" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.7" />

    {/* Tail feathers - playful loose curves */}
    <path d="M 45 52 Q 42.5 56 40.5 60" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M 47 53 Q 46.5 57 45.5 62" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M 49 52 Q 49.5 56 50 61" stroke="currentColor" strokeWidth="1.4" fill="none" />

    {/* Little leaves/seeds floating around */}
    <ellipse cx="68" cy="32" rx="2.2" ry="3.5" transform="rotate(-20 68 32)" fill="currentColor" opacity="0.45" />
    <ellipse cx="72" cy="55" rx="1.8" ry="3" transform="rotate(15 72 55)" fill="currentColor" opacity="0.35" />
    <path d="M 28 60 Q 27.5 62 28 64" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
  </svg>
);

export const MagicianIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Four elements arranged - earth, water, air, fire */}
    {/* Stone/earth - lower left */}
    <ellipse cx="30" cy="65" rx="6" ry="5" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="2.2" />
    <path d="M 27 65 Q 28 67 30 67" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />

    {/* Water drop - lower right */}
    <path d="M 70 68 Q 70 62 73 58 Q 76 62 76 68 Q 76 72 73 75 Q 70 72 70 68"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />

    {/* Flame - upper right */}
    <path d="M 72 32 Q 70 28 71 24 Q 72 20 73 18 Q 74 20 75 24 Q 76 28 74 32 Q 73 30 72 32"
          fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="2" />

    {/* Air/wind spiral - upper left */}
    <path d="M 28 25 Q 30 27 33 27 Q 35 27 36 25 Q 36 23 34 22 Q 31 21 28 23"
          stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M 32 25 Q 33 26 34 25" stroke="currentColor" strokeWidth="1.3" fill="none" />

    {/* Center blooming flower connecting all */}
    <circle cx="50" cy="48" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="50" cy="48" r="1" fill="currentColor" opacity="0.4" />
    {/* Petals */}
    <path d="M 50 44 Q 48 42 50 40" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M 54 48 Q 56 48 58 48" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M 50 52 Q 50 54 50 56" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M 46 48 Q 44 48 42 48" stroke="currentColor" strokeWidth="1.4" fill="none" />
  </svg>
);

export const HighPriestessIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Crescent moons and veil of stars */}
    {/* Left crescent moon */}
    <path d="M 30 38 Q 28 42 28 46 Q 28 50 30 54"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    <path d="M 32 38 Q 35 42 35 46 Q 35 50 32 54"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.6" />

    {/* Center full moon */}
    <circle cx="50" cy="38" r="7" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="50" cy="38" r="4" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />

    {/* Right crescent moon */}
    <path d="M 68 38 Q 72 42 72 46 Q 72 50 68 54"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    <path d="M 70 38 Q 67 42 67 46 Q 67 50 70 54"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.6" />

    {/* Flowing water below - mystical veil */}
    <path d="M 25 60 Q 35 61 45 60 Q 55 59 65 60 Q 75 61 80 60"
          stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.5" />
    <path d="M 27 65 Q 37 66 47 65 Q 57 64 67 65 Q 73 66 78 65"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.4" />

    {/* Tiny stars */}
    <circle cx="38" cy="28" r="0.6" fill="currentColor" opacity="0.5" />
    <circle cx="62" cy="30" r="0.7" fill="currentColor" opacity="0.5" />
    <circle cx="50" cy="52" r="0.6" fill="currentColor" opacity="0.5" />
  </svg>
);

export const EmpressIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Abundant mushroom garden - loose and organic */}
    {/* Left mushroom - wobbly stem with loose curve */}
    <path d="M 28 56 Q 27.5 51 27 46 Q 28 40 28.5 34 Q 28 32 28 32" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M 28 32 Q 23 32.5 20 29.5 Q 21 25.5 28 23.5 Q 35 25.5 37 29.5 Q 34.5 32.5 28 32"
          fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="25" cy="28.5" r="1.2" fill="currentColor" opacity="0.45" />
    <circle cx="31" cy="26.5" r="0.9" fill="currentColor" opacity="0.45" />

    {/* Center large mushroom - more organic wobbly */}
    <path d="M 50 70 Q 49.5 62 50 52 Q 50.5 44 50 38 Q 49.5 36 50 36" stroke="currentColor" strokeWidth="2.4" fill="none" />
    <path d="M 50 36 Q 41 36.5 37 31.5 Q 38.5 26 50 22 Q 61.5 26 63 31.5 Q 59 36.5 50 36"
          fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="2.3" />
    <circle cx="44.5" cy="29.5" r="1.6" fill="currentColor" opacity="0.55" />
    <circle cx="52" cy="27.5" r="1.4" fill="currentColor" opacity="0.55" />
    <circle cx="57" cy="31" r="1.2" fill="currentColor" opacity="0.55" />

    {/* Right mushroom - loose wobbly */}
    <path d="M 72 62 Q 71.5 58 71 54 Q 72 50 72 50" stroke="currentColor" strokeWidth="1.9" fill="none" />
    <path d="M 72 50 Q 68.5 50 66.5 47.5 Q 68 44 72 42 Q 76 44 77.5 47.5 Q 75.5 50 72 50"
          fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />

    {/* Small mushroom */}
    <path d="M 64 70 Q 64.5 67 65 63.5 Q 65 62 65 62" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <ellipse cx="65" cy="60.5" rx="3.2" ry="2.3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.9" />

    {/* Loose flowers - simple loose petals */}
    <path d="M 38 66 Q 36.5 65.5 35.5 66 Q 36 66.5 37.5 66.5 Q 38.5 66 38.5 65 Q 37.5 65.5 38 66"
          stroke="currentColor" strokeWidth="1.3" fill="none" />
    <circle cx="38" cy="66" r="0.7" fill="currentColor" opacity="0.35" />

    <path d="M 58 72 Q 56.5 71.5 55.5 72 Q 56 72.5 57.5 72.5 Q 58.5 72 58.5 71 Q 57.5 71.5 58 72"
          stroke="currentColor" strokeWidth="1.3" fill="none" />
    <circle cx="58" cy="72" r="0.7" fill="currentColor" opacity="0.35" />

    {/* Grass tufts - loose quick marks */}
    <path d="M 42 72 Q 42.5 69 43 66" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
    <path d="M 44.5 73 Q 44.5 70.5 45 68" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
    <path d="M 78 70 Q 78.5 67.5 79 65" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
  </svg>
);

export const EmperorIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Strong ancient mountain - stable and protective */}
    <path d="M 22 72 L 38 40 L 50 52 L 64 32 L 78 72"
          stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M 26 68 L 38 44 L 48 54"
          stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
    <path d="M 54 52 L 64 38 L 74 66"
          stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
    {/* Little peak details */}
    <path d="M 42 48 Q 43 46 44 48" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
    <path d="M 58 42 Q 59 40 60 42" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
  </svg>
);

export const HierophantIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Ancient tree rings - wisdom through time */}
    <path d="M 50 32 Q 57 33 61 39 Q 64 46 63.5 53 Q 62 60 56 64 Q 49 67 42 65 Q 35 62.5 32 56 Q 29 49 30 42 Q 33 35 40 32.5 Q 45 31 50 32"
          stroke="currentColor" strokeWidth="2.2" fill="none" opacity="0.5" />
    <path d="M 50 40 Q 55 40.5 58 44 Q 60 48 59.5 53 Q 58 57 54 59 Q 50 60 46 58.5 Q 42 56.5 41 52 Q 40 48 42 44 Q 44 40.5 48 40 Q 49 39.5 50 40"
          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
    <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.65" />
    <circle cx="50" cy="50" r="2.5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const LoversIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Two vines growing together - intertwined but separate */}
    <path d="M 32 72 Q 31 64 32 56 Q 33 46 32 38 Q 31.5 28 34 22"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    <path d="M 68 72 Q 69 64 68 56 Q 67 46 68 38 Q 68.5 28 66 22"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    {/* Connecting vine */}
    <path d="M 32 54 Q 41 52 50 53.5 Q 59 55 68 54"
          stroke="currentColor" strokeWidth="1.7" fill="none" opacity="0.6" />
    {/* Blooms at top */}
    <circle cx="34" cy="20" r="3" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="66" cy="20" r="3" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.8" />
    {/* Little leaves */}
    <path d="M 30 44 Q 28.5 42 28 40" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 70 44 Q 71.5 42 72 40" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 34 64 Q 32.5 62 32 60" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 66 64 Q 67.5 62 68 60" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
  </svg>
);

export const ChariotIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* River flowing with purpose - determined path */}
    <path d="M 28 26 Q 37 35.5 35 48 Q 33 60 44.5 68 Q 57 75 64 81"
          stroke="currentColor" strokeWidth="2.4" fill="none" />
    <path d="M 25 28.5 Q 33 36.5 31 48 Q 29 59 38 66"
          stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
    <path d="M 31.5 25 Q 41 34 39.5 48 Q 38 61 49 69.5 Q 58.5 75.5 66.5 80"
          stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
    {/* Little flow marks */}
    <path d="M 33 41 Q 34.5 39.5 36 39" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
    <path d="M 42 55.5 Q 43.5 53.5 45 53" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
  </svg>
);

export const StrengthIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Delicate flower breaking through stone crack */}
    {/* Stone crack */}
    <path d="M 31 74 L 41.5 61 L 47.5 53 L 53.5 61 L 64 74"
          stroke="currentColor" strokeWidth="2.2" fill="none" opacity="0.4" />
    {/* Flower stem */}
    <path d="M 48 52.5 Q 47.5 46 48 39 Q 48.5 32 49.5 27"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    {/* Flower petals - delicate */}
    <path d="M 44.5 33 Q 43.5 31.5 44 29.5 Q 44.5 27.5 45.5 26.5 Q 46.5 28 46 30 Z"
          fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.7" />
    <path d="M 48 29.5 Q 47.5 27.5 48 25.5 Q 48.5 23.5 49.5 22.5 Q 50.5 24 50 26 Z"
          fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.7" />
    <path d="M 51.5 31.5 Q 50.5 30 51 28 Q 51.5 26 52.5 25 Q 53.5 26.5 53 28.5 Z"
          fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="1.7" />
    {/* Little leaves */}
    <path d="M 45.5 40.5 Q 43 40 41 40.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 51.5 42 Q 54 41.5 56 42" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
  </svg>
);

export const HermitIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Wise owl with glowing lantern - solitary and contemplative */}
    {/* Body - loose organic shape with wobbles */}
    <path d="M 50 65 Q 43 64 39 58.5 Q 36.5 53 37 46 Q 38 41 41.5 37 Q 46 34 50 33.5 Q 54 34 57.5 37 Q 61 41 62 46 Q 63 53 61 58.5 Q 57 64 50 65"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />

    {/* Head - round with slight wobble */}
    <path d="M 40 40 Q 40 32 44 28 Q 50 25 56 28 Q 60 32 60 40 Q 60 48 56 52 Q 50 55 44 52 Q 40 48 40 40"
          fill="none" stroke="currentColor" strokeWidth="2.4" />

    {/* Big wise eyes */}
    <circle cx="46" cy="39.5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="46" cy="39.5" r="1.1" fill="currentColor" />

    <circle cx="54" cy="39.5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="54" cy="39.5" r="1.1" fill="currentColor" />

    {/* Little beak - loose */}
    <path d="M 50 42.5 Q 49.5 44 49 45" stroke="currentColor" strokeWidth="1.4" fill="none" />

    {/* Ear tufts - loose quick marks */}
    <path d="M 43 32 Q 42.5 29 43 26.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
    <path d="M 57 32 Q 57.5 29 57 26.5" stroke="currentColor" strokeWidth="1.7" fill="none" />

    {/* Wing suggestion - loose curves */}
    <path d="M 39 48 Q 34 49.5 31 51" stroke="currentColor" strokeWidth="1.9" fill="none" opacity="0.65" />
    <path d="M 61 48 Q 66 49.5 69 51" stroke="currentColor" strokeWidth="1.9" fill="none" opacity="0.65" />

    {/* Feet/talons - simple loose marks */}
    <path d="M 47 65 Q 45.5 67.5 44.5 70" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M 50 66 Q 50 68.5 50 71" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M 53 65 Q 54.5 67.5 55.5 70" stroke="currentColor" strokeWidth="1.5" fill="none" />

    {/* Little lantern beside owl - glowing */}
    <rect x="67" y="53" width="6" height="8" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="70" cy="57" r="1.8" fill="currentColor" opacity="0.2" />
    {/* Light rays - loose quick marks */}
    <path d="M 65 57 L 63 57 M 77 57 L 79 57" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
    <path d="M 70 51 L 70 49" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
    <path d="M 66 54 L 64 52" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
  </svg>
);

export const WheelOfFortuneIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Unfurling fern spiral - cycles of nature */}
    <path d="M 50 50 Q 51.5 48.5 54.5 48.5 Q 57.5 48.5 59.5 50.5 Q 61.5 54 59.5 58 Q 56 61.5 50.5 60 Q 45 58.5 43 53 Q 41 47 44.5 43 Q 50 39 57.5 40.5 Q 65 44 67 52 Q 69 61.5 63.5 69"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    {/* Little frond details */}
    <path d="M 57.5 42.5 Q 59.5 41 61.5 40.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 65.5 48.5 Q 67.5 47 69.5 46.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 44.5 49 Q 42.5 47.5 40.5 47" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 42.5 56.5 Q 40.5 58 38.5 60" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
  </svg>
);

export const JusticeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Perfectly symmetrical leaf - balance */}
    {/* Central vein */}
    <path d="M 50 26 L 50 71" stroke="currentColor" strokeWidth="2.4" />
    {/* Symmetrical leaf sections */}
    <path d="M 50 36 Q 39 38.5 33.5 42 Q 31.5 43.5 33 45.5 Q 38.5 45.5 50 42"
          stroke="currentColor" strokeWidth="1.9" fill="none" />
    <path d="M 50 36 Q 61 38.5 66.5 42 Q 68.5 43.5 67 45.5 Q 61.5 45.5 50 42"
          stroke="currentColor" strokeWidth="1.9" fill="none" />
    <path d="M 50 48 Q 41 50 36 53.5 Q 35 55 36.5 57 Q 42 56.5 50 54"
          stroke="currentColor" strokeWidth="1.9" fill="none" />
    <path d="M 50 48 Q 59 50 64 53.5 Q 65 55 63.5 57 Q 58 56.5 50 54"
          stroke="currentColor" strokeWidth="1.9" fill="none" />
    <path d="M 50 60 Q 42.5 61 38.5 64 Q 37.5 65.5 39 67 Q 43.5 66.5 50 64.5"
          stroke="currentColor" strokeWidth="1.9" fill="none" />
    <path d="M 50 60 Q 57.5 61 61.5 64 Q 62.5 65.5 61 67 Q 56.5 66.5 50 64.5"
          stroke="currentColor" strokeWidth="1.9" fill="none" />
  </svg>
);

export const HangedManIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Bat hanging peacefully - new perspective */}
    {/* Hanging line */}
    <path d="M 50 22 L 50 29" stroke="currentColor" strokeWidth="1.7" opacity="0.5" />
    {/* Body */}
    <ellipse cx="50" cy="37" rx="6" ry="8" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="2.2" />
    {/* Wings folded */}
    <path d="M 44 39 Q 37.5 44 33 49.5 Q 31.5 51.5 33 53 L 37 51.5 Q 41 46.5 44 42.5"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
    <path d="M 56 39 Q 62.5 44 67 49.5 Q 68.5 51.5 67 53 L 63 51.5 Q 59 46.5 56 42.5"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
    {/* Little eyes */}
    <circle cx="48" cy="35" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="52" cy="35" r="1.5" fill="currentColor" opacity="0.6" />
  </svg>
);

export const DeathIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Falling autumn leaves - transformation */}
    <path d="M 33 29 Q 36.5 32.5 36.5 38 Q 36.5 43.5 33 46 Q 29.5 43.5 29.5 38 Q 29.5 32.5 33 29 M 33 32.5 L 33 41.5"
          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M 58.5 39 Q 62 42.5 62 48 Q 62 53.5 58.5 56 Q 55 53.5 55 48 Q 55 42.5 58.5 39 M 58.5 42.5 L 58.5 51.5"
          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.65" />
    <path d="M 40.5 57 Q 44 60.5 44 66 Q 44 71.5 40.5 74 Q 37 71.5 37 66 Q 37 60.5 40.5 57 M 40.5 60.5 L 40.5 69.5"
          stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M 67.5 63 Q 71 66.5 71 72 Q 71 77.5 67.5 80 Q 64 77.5 64 72 Q 64 66.5 67.5 63 M 67.5 66.5 L 67.5 75.5"
          stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.5" />
    <path d="M 50 49 Q 53.5 52.5 53.5 58 Q 53.5 63.5 50 66 Q 46.5 63.5 46.5 58 Q 46.5 52.5 50 49 M 50 52.5 L 50 61.5"
          stroke="currentColor" strokeWidth="2.2" fill="none" opacity="0.6" />
  </svg>
);

export const TemperanceIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Water pouring gently between vessels - balance */}
    {/* Upper vessel */}
    <ellipse cx="36" cy="33" rx="9" ry="4.5" stroke="currentColor" strokeWidth="2.2" fill="none" opacity="0.6" />
    {/* Lower vessel */}
    <ellipse cx="64" cy="67" rx="11" ry="5.5" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />
    {/* Flowing water */}
    <path d="M 38.5 36.5 Q 45 44.5 48 51.5 Q 51.5 59.5 57.5 65.5"
          stroke="currentColor" strokeWidth="2.3" fill="none" />
    <path d="M 41.5 38 Q 47 45.5 49.5 53.5 Q 52.5 61.5 59.5 66.5"
          stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
    {/* Water drops */}
    <circle cx="43.5" cy="42" r="1.5" fill="currentColor" opacity="0.4" />
    <circle cx="48" cy="48.5" r="1.5" fill="currentColor" opacity="0.4" />
    <circle cx="53.5" cy="57.5" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

export const DevilIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Thorny vine - binding and temptation */}
    <path d="M 26 74 Q 33 67.5 40.5 60 Q 48 52.5 55.5 45 Q 63 37.5 71 30"
          stroke="currentColor" strokeWidth="2.4" fill="none" />
    {/* Thorns */}
    <path d="M 30.5 70 L 27 73.5 M 36 64.5 L 32.5 68 M 44 57 L 40.5 60.5 M 51.5 49.5 L 48 53 M 59 42 L 55.5 45.5 M 67 34.5 L 63.5 38"
          stroke="currentColor" strokeWidth="2" />
    {/* Twisted details */}
    <path d="M 34.5 66.5 Q 33 65 31.5 65" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.6" />
    <path d="M 50 51 Q 48.5 49.5 47 49.5" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.6" />
    <path d="M 65.5 35.5 Q 64 34 62.5 34" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.6" />
  </svg>
);

export const TowerIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Lightning bolt striking - sudden change */}
    <path d="M 53.5 20 L 48.5 38.5 L 53.5 38.5 L 43 66"
          stroke="currentColor" strokeWidth="2.8" fill="none" />
    {/* Energy bursts */}
    <path d="M 52 21.5 Q 50.5 20 49 19" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.6" />
    <path d="M 55.5 22.5 Q 57 20.5 58.5 19.5" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.6" />
    <path d="M 47 40.5 Q 45.5 42 44 43.5" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.6" />
    <path d="M 49.5 42 Q 51 43.5 52.5 45" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.6" />
    <path d="M 41 68 Q 39.5 69.5 38 71" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.6" />
    <path d="M 44 65 Q 45.5 66.5 47 68" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.6" />
  </svg>
);

export const StarIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Constellation pattern - hope and guidance */}
    {/* Center bright star */}
    <circle cx="50" cy="30" r="4" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="2.2" />
    <path d="M 47.5 27 L 50 30 L 52.5 27 M 47.5 33 L 50 30 L 52.5 33"
          stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.6" />
    {/* Surrounding stars */}
    <circle cx="33" cy="46" r="3" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="2" />
    <circle cx="67" cy="46" r="3" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="2" />
    <circle cx="29" cy="67" r="2.2" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="50" cy="61" r="3.5" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="2" />
    <circle cx="71" cy="67" r="2.2" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
    {/* Connection lines */}
    <path d="M 50 30 L 33 46 L 29 67 M 50 30 L 67 46 L 71 67 M 33 46 L 50 61 L 67 46"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.3" />
  </svg>
);

export const MoonIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Crescent moon with night-blooming flower */}
    {/* Crescent moon */}
    <path d="M 57 26 Q 64 27.5 68 32.5 Q 72 39.5 70 47 Q 68 53 61.5 55.5"
          stroke="currentColor" strokeWidth="2.4" fill="none" />
    <path d="M 59.5 29 Q 65.5 30.5 68.5 35 Q 71 41 69.5 46.5"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    {/* Night flower opening */}
    <path d="M 40 59 Q 40 52 40.5 47" stroke="currentColor" strokeWidth="2.2" fill="none" />
    {/* Petals */}
    <path d="M 36 50 Q 34.5 48.5 35 46.5 Q 35.5 44.5 36.5 43.5 Q 37.5 45 37 47 Z"
          fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1.7" />
    <path d="M 40.5 48 Q 39.5 46.5 40 44.5 Q 40.5 42.5 41.5 41.5 Q 42.5 43 42 45 Z"
          fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1.7" />
    <path d="M 44 50 Q 42.5 48.5 43 46.5 Q 43.5 44.5 44.5 43.5 Q 45.5 45 45 47 Z"
          fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1.7" />
    {/* Dew drops */}
    <circle cx="37" cy="52.5" r="1.2" fill="currentColor" opacity="0.4" />
    <circle cx="43" cy="53" r="1.2" fill="currentColor" opacity="0.4" />
  </svg>
);

export const SunIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Sunflower with delicate petals */}
    {/* Center */}
    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.14" />
    {/* Petals - light and airy */}
    <path d="M 50 34 Q 47 39 48.5 42 Q 50 43.5 51.5 42 Q 53 39 50 34 Z"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M 66 50 Q 61 47 58.5 48.5 Q 57 50 58.5 51.5 Q 61 53 66 50 Z"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M 50 66 Q 47 61 48.5 58.5 Q 50 57 51.5 58.5 Q 53 61 50 66 Z"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M 34 50 Q 39 47 41.5 48.5 Q 43 50 41.5 51.5 Q 39 53 34 50 Z"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M 39.5 39.5 Q 43 42 44.5 43.5 Q 45.5 43.5 45.5 42 Q 44 39 39.5 39.5 Z"
          fill="currentColor" opacity="0.11" stroke="currentColor" strokeWidth="1.4" />
    <path d="M 60.5 39.5 Q 57 42 55.5 43.5 Q 54.5 43.5 54.5 42 Q 56 39 60.5 39.5 Z"
          fill="currentColor" opacity="0.11" stroke="currentColor" strokeWidth="1.4" />
    <path d="M 60.5 60.5 Q 57 58 55.5 56.5 Q 54.5 56.5 54.5 58 Q 56 61 60.5 60.5 Z"
          fill="currentColor" opacity="0.11" stroke="currentColor" strokeWidth="1.4" />
    <path d="M 39.5 60.5 Q 43 58 44.5 56.5 Q 45.5 56.5 45.5 58 Q 44 61 39.5 60.5 Z"
          fill="currentColor" opacity="0.11" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const JudgementIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Butterfly emerging - renewal and awakening */}
    {/* Body */}
    <path d="M 50 54 Q 49.5 63 50 73"
          stroke="currentColor" strokeWidth="2.2" />
    <ellipse cx="50" cy="47" rx="3.5" ry="6" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="2" />
    {/* Wings - delicate */}
    <path d="M 50 49 Q 39.5 42.5 34 35 Q 30.5 30 32 26.5 Q 35.5 25 39 28.5 Q 44.5 34 48.5 42.5 Z"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
    <path d="M 50 49 Q 60.5 42.5 66 35 Q 69.5 30 68 26.5 Q 64.5 25 61 28.5 Q 55.5 34 51.5 42.5 Z"
          fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
    {/* Wing patterns */}
    <path d="M 36 31.5 Q 34.5 29.5 34.5 27.5 M 39.5 35 Q 38 33 38 31"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 64 31.5 Q 65.5 29.5 65.5 27.5 M 60.5 35 Q 62 33 62 31"
          stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    {/* Antennae */}
    <path d="M 48 45 Q 45 42 43 40" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
    <path d="M 52 45 Q 55 42 57 40" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.5" />
  </svg>
);

export const WorldIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
    {/* Wreath of leaves - completion and wholeness */}
    {/* Outer circle - loose and organic */}
    <path d="M 50 23 Q 61 24 69.5 31.5 Q 77 39 77.5 50 Q 77 61 69.5 68.5 Q 61 76 50 77 Q 39 76 31.5 68.5 Q 24 61 23.5 50 Q 24 39 31.5 31.5 Q 39 24 50 23"
          stroke="currentColor" strokeWidth="2.2" fill="none" opacity="0.5" />
    {/* Center circle */}
    <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="2" />
    {/* Leaf sprigs around wreath */}
    <path d="M 50 24 Q 53 26 55.5 29" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M 76 50 Q 74 53 71 55.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M 50 76 Q 47 74 44.5 71" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M 24 50 Q 26 47 29 44.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
    {/* Small leaves at cardinal points */}
    <circle cx="50" cy="24" r="2.5" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="76" cy="50" r="2.5" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="50" cy="76" r="2.5" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="24" cy="50" r="2.5" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
