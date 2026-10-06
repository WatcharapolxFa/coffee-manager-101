// Cartoon iced-drink cup used on the customer menu until a real photo is added
// to public/menu/<category>/. Colours are guessed from the drink name.

interface CupColors { top: string; bottom: string; cream?: string }

const PLUM = '#3B2A5E';

// Order matters: first match wins.
const PALETTES: [RegExp, CupColors][] = [
  [/matcha.*straw|straw.*matcha/i, { top: '#9BCF7E', bottom: '#F58BA8' }],
  [/coconut matcha|clear matcha/i, { top: '#B9DE95', bottom: '#7FBF5E' }],
  [/matcha|green tea|ชาเขียว/i,     { top: '#8BC46A', bottom: '#5E9E45', cream: '#F6F1E3' }],
  [/thai tea|ชาไทย/i,               { top: '#F2A15B', bottom: '#D9692A', cream: '#FBE7CF' }],
  [/cocoa.*mint|mint/i,             { top: '#6E4630', bottom: '#9FDCC3' }],
  [/cocoa.*straw|strawberry|pink/i, { top: '#F7A9BE', bottom: '#E7708F', cream: '#FFF1F4' }],
  [/cocoa|mocca|choc|โกโก้/i,       { top: '#7A4A2E', bottom: '#4E2C1A', cream: '#E9D3BF' }],
  [/orange/i,                       { top: '#3A2416', bottom: '#F08A2E' }],
  [/coconut/i,                      { top: '#4A2E1E', bottom: '#EFE6D2' }],
  [/honey|lime|lemon/i,             { top: '#5A3A22', bottom: '#E9C24A' }],
  [/americano|espresso|black tea/i, { top: '#4A2C1A', bottom: '#2C190E' }],
  [/earl grey/i,                    { top: '#C9A27A', bottom: '#A8794F', cream: '#F3E6D6' }],
  [/caramel|biscoff/i,              { top: '#D9A066', bottom: '#B9773A', cream: '#F6E7D2' }],
  [/latte|cappuccino|macchiato/i,   { top: '#C8996B', bottom: '#8A5A36', cream: '#F4E8DA' }],
  [/punch/i,                        { top: '#FF8A5B', bottom: '#E5484D' }],
  [/บ๊วย/,                          { top: '#F6B4A8', bottom: '#D9705F' }],
  [/milk|นม/i,                      { top: '#F7EFE2', bottom: '#EADBC4' }],
];

export function cupColors(name: string): CupColors {
  return PALETTES.find(([re]) => re.test(name))?.[1] ?? { top: '#C8996B', bottom: '#8A5A36' };
}

export function DrinkCup({ name, className }: { name: string; className?: string }) {
  const { top, bottom, cream } = cupColors(name);
  return (
    <svg viewBox="0 0 100 150" className={className} aria-hidden="true">
      {/* straw */}
      <path d="M58 4 L54 40" stroke="#FF8A3D" strokeWidth={7} strokeLinecap="round" />
      <path d="M58 4 L54 40" stroke="#FFF1C9" strokeWidth={7} strokeLinecap="round" strokeDasharray="4 6" />
      {/* dome lid */}
      <path d="M18 40 Q50 14 82 40 Z" fill="#FFFFFF" fillOpacity={0.75} stroke={PLUM} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x={13} y={38} width={74} height={7} rx={3.5} fill="#FFFFFF" stroke={PLUM} strokeWidth={2.5} />
      {/* drink: bottom layer, top layer, optional cream swirl */}
      <path d="M17 46 L83 46 L77 140 Q76 146 70 146 L30 146 Q24 146 23 140 Z" fill={bottom} />
      <path d="M17 46 L83 46 L79 96 Q60 88 50 96 Q38 104 21 96 Z" fill={top} />
      {cream && <path d="M20 84 Q34 74 48 86 Q62 96 80 82 L79 96 Q60 88 50 96 Q38 104 21 96 Z" fill={cream} />}
      {/* ice cubes */}
      <rect x={28} y={54} width={14} height={12} rx={3} fill="#FFFFFF" fillOpacity={0.45} transform="rotate(-12 35 60)" />
      <rect x={60} y={58} width={12} height={11} rx={3} fill="#FFFFFF" fillOpacity={0.4} transform="rotate(10 66 63)" />
      {/* cute face */}
      <ellipse cx={39} cy={114} rx={4} ry={5} fill={PLUM} />
      <ellipse cx={61} cy={114} rx={4} ry={5} fill={PLUM} />
      <circle cx={40.5} cy={112} r={1.4} fill="#FFFFFF" />
      <circle cx={62.5} cy={112} r={1.4} fill="#FFFFFF" />
      <ellipse cx={32} cy={123} rx={5} ry={3} fill="#FF8FB1" fillOpacity={0.8} />
      <ellipse cx={68} cy={123} rx={5} ry={3} fill="#FF8FB1" fillOpacity={0.8} />
      <path d="M44 122 Q50 128 56 122" fill="none" stroke={PLUM} strokeWidth={2.5} strokeLinecap="round" />
      {/* cup outline + shine */}
      <path d="M17 46 L83 46 L77 140 Q76 146 70 146 L30 146 Q24 146 23 140 Z" fill="none" stroke={PLUM} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M25 54 L29 134" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}
