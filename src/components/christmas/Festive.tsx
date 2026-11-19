// Elegant Christmas ornaments for the customer menu (inline SVG, server-component safe).
// Thin gold line-work like a luxury holiday poster. No ids/defs so instances never collide.

const GOLD = "#E8C27A";
const RED = "#B3202A";
const RED_DARK = "#7A1219";
const PINE = "#3F6B4A";

type Props = { className?: string };

const line = { strokeLinejoin: "round", strokeLinecap: "round" } as const;

const INK = "#2A1A12";
const SNOW = "#FBF7EF";
const SNOW_SHADE = "#D9D0C1";
const FUR = "#8A5A36";
const FUR_LIGHT = "#C89B6D";
const ANTLER = "#E3C48C";

// The snowman and reindeer are built from named parts (.sm-*, .rh-*, .rf-*, .blink) so CSS in
// app/menu/layout.tsx can move them: blinking, waving, ear twitches, a hop, a walking gait.
// Wrap one in .is-alive for the idle motions, .is-hopping / .is-walking for travelling on the table.

/** Little snowman figurine: top hat with a gold band, red scarf, carrot nose. */
export function Snowman({ className }: Props) {
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden="true" overflow="visible">
      <ellipse className="sm-shadow" cx={30} cy={76} rx={16} ry={2.6} fill="#000" opacity={0.4} />
      <g className="sm-body">
        {/* stick arms */}
        <g stroke="#6B4027" strokeWidth={1.8} fill="none" {...line}>
          <path className="sm-arm-l" d="M16 50 L5 42 M9 45 L6 40" />
          <path className="sm-arm-r" d="M44 50 L55 42 M51 45 L54 40" />
        </g>
        <circle cx={30} cy={58} r={17} fill={SNOW} stroke={SNOW_SHADE} strokeWidth={1.2} />
        <path d="M17 64 A17 17 0 0 0 43 64 A20 12 0 0 1 17 64 Z" fill={SNOW_SHADE} opacity={0.5} />
        <g className="sm-head">
          <circle cx={30} cy={33} r={12} fill={SNOW} stroke={SNOW_SHADE} strokeWidth={1.2} />
          {/* hat */}
          <rect x={22} y={6} width={16} height={16} rx={1.5} fill="#2F5D3A" stroke="#4E8A5C" strokeWidth={0.8} />
          <rect x={22} y={16} width={16} height={3} fill={GOLD} />
          <rect x={17} y={21} width={26} height={3} rx={1.5} fill="#2F5D3A" stroke="#4E8A5C" strokeWidth={0.8} />
          <path d="M24.5 8 V15" stroke="#6FA77C" strokeWidth={1.2} opacity={0.6} {...line} />
          <path d="M36 17 l3 -3 l1 4 Z" fill={RED} />
          {/* face */}
          <g className="blink">
            <circle cx={26} cy={31} r={1.4} fill={INK} />
            <circle cx={34} cy={31} r={1.4} fill={INK} />
          </g>
          <path d="M30 34 L40 36 L30 37.4 Z" fill="#F08A3A" />
          <ellipse cx={23.5} cy={36} rx={2} ry={1.2} fill="#F2A0A0" opacity={0.8} />
          <ellipse cx={36.5} cy={36} rx={2} ry={1.2} fill="#F2A0A0" opacity={0.8} />
          <path d="M26.5 39 Q30 41 33.5 39" fill="none" stroke={INK} strokeWidth={1} {...line} />
        </g>
        {/* scarf */}
        <path d="M18.5 42 Q30 47 41.5 42 L41.5 46 Q30 51 18.5 46 Z" fill={RED} />
        <path className="sm-scarf" d="M35 46 L38 60 L33 60 L31.5 47.5 Z" fill={RED_DARK} />
        <path d="M21 44 l2 2 M26 45.5 l2 2 M32 45.5 l2 2 M37 44 l2 2" stroke={SNOW} strokeWidth={0.8} opacity={0.7} />
        {/* buttons */}
        <circle cx={30} cy={53} r={1.5} fill={INK} />
        <circle cx={30} cy={59} r={1.5} fill={INK} />
        <circle cx={30} cy={65} r={1.5} fill={INK} />
      </g>
    </svg>
  );
}

/** Friendly Christmas reindeer face with branching antlers and a gold bell. */
export function ReindeerHead({ className }: Props) {
  return (
    <svg viewBox="0 0 70 70" className={className} aria-hidden="true" overflow="visible">
      <g className="rh-head">
        {/* antlers */}
        <g stroke={ANTLER} strokeWidth={3} fill="none" {...line}>
          <path d="M27 24 C22 16 18 11 13 4" />
          <path d="M21 14 L12 13" />
          <path d="M17 8 L19 2" />
          <path d="M43 24 C48 16 52 11 57 4" />
          <path d="M49 14 L58 13" />
          <path d="M53 8 L51 2" />
        </g>
        {/* ears */}
        <g className="rh-ear-l">
          <ellipse cx={18} cy={30} rx={8} ry={4} fill={FUR} transform="rotate(-25 18 30)" />
          <ellipse cx={18.5} cy={30} rx={4.5} ry={2} fill={FUR_LIGHT} transform="rotate(-25 18.5 30)" />
        </g>
        <g className="rh-ear-r">
          <ellipse cx={52} cy={30} rx={8} ry={4} fill={FUR} transform="rotate(25 52 30)" />
          <ellipse cx={51.5} cy={30} rx={4.5} ry={2} fill={FUR_LIGHT} transform="rotate(25 51.5 30)" />
        </g>
        {/* head + muzzle */}
        <path d="M35 21 C46 21 49 31 48 40 C47 51 41 58 35 58 C29 58 23 51 22 40 C21 31 24 21 35 21 Z" fill={FUR} />
        <ellipse cx={35} cy={50} rx={9} ry={7.5} fill={FUR_LIGHT} />
        <ellipse cx={35} cy={46.5} rx={3.6} ry={2.8} fill={INK} />
        <ellipse cx={34} cy={45.6} rx={1.2} ry={0.8} fill="#fff" opacity={0.6} />
        <path d="M32 53 Q35 55.5 38 53" fill="none" stroke={INK} strokeWidth={1.1} {...line} />
        {/* eyes */}
        <g className="blink">
          <circle cx={29.5} cy={36} r={2} fill={INK} />
          <circle cx={40.5} cy={36} r={2} fill={INK} />
          <circle cx={30.2} cy={35.3} r={0.7} fill="#fff" />
          <circle cx={41.2} cy={35.3} r={0.7} fill="#fff" />
        </g>
        <ellipse cx={26} cy={43} rx={2.4} ry={1.4} fill="#F2A0A0" opacity={0.55} />
        <ellipse cx={44} cy={43} rx={2.4} ry={1.4} fill="#F2A0A0" opacity={0.55} />
      </g>
      {/* collar + bell */}
      <path d="M27 57 Q35 61 43 57" fill="none" stroke={RED} strokeWidth={3} {...line} />
      <g className="rh-bell">
        <circle cx={35} cy={62.5} r={3.6} fill={GOLD} stroke="#B8873E" strokeWidth={0.8} />
        <path d="M33.2 63.5 L36.8 63.5" stroke="#8A6424" strokeWidth={0.8} />
      </g>
    </svg>
  );
}

/** Gold reindeer figurine, side view, facing right; legs move separately so it can walk. */
export function ReindeerFigure({ className }: Props) {
  const leg = { stroke: "#C9A05A", strokeWidth: 2.6, fill: "none", ...line };
  return (
    <svg viewBox="0 0 70 70" className={className} aria-hidden="true" overflow="visible">
      <ellipse className="rf-shadow" cx={35} cy={66} rx={20} ry={2.4} fill="#000" opacity={0.45} />
      {/* legs: diagonal pairs swing together, like a trot */}
      <path className="rf-leg rf-leg-a" d="M22 42 L21 64" {...leg} />
      <path className="rf-leg rf-leg-b" d="M27 43 L27 64" {...leg} />
      <path className="rf-leg rf-leg-b" d="M42 43 L42 64" {...leg} />
      <path className="rf-leg rf-leg-a" d="M47 42 L48 64" {...leg} />
      <g className="rf-body">
        <ellipse cx={34} cy={38} rx={16} ry={8} fill="#D9AE5F" />
        <path className="rf-tail" d="M18 34 L13 31 L16 37 Z" fill="#D9AE5F" />
        <path d="M22 34 Q34 29 46 34" fill="none" stroke="#F5DFA8" strokeWidth={1.4} opacity={0.8} {...line} />
        <g className="rf-head">
          <g stroke="#C9A05A" strokeWidth={2.6} fill="none" {...line}>
            <path d="M52 16 C50 10 47 6 43 2 M48 9 L44 10" />
            <path d="M55 16 C57 10 60 7 64 4 M58 9 L62 10" />
          </g>
          <path d="M44 34 L50 19 L56 21 L49 39 Z" fill="#D9AE5F" />
          <ellipse cx={55} cy={20} rx={6.5} ry={4.2} transform="rotate(-18 55 20)" fill="#D9AE5F" />
          <path d="M51 15 L47 13 L50 18 Z" fill="#D9AE5F" />
          <circle className="blink" cx={57.5} cy={18.5} r={1.1} fill={INK} />
          <circle cx={61} cy={21.5} r={1.3} fill={INK} />
          <path d="M46 31 l-3 -3 l0 5 Z M46 31 l3 -3 l0 5 Z" fill={RED} />
          <circle cx={46} cy={31} r={1.2} fill={RED_DARK} />
        </g>
      </g>
    </svg>
  );
}

/** Fine line-art snowflake (gold by default). */
export function Snowflake({ className, color = GOLD }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth={1.2} fill="none" {...line}>
        {[0, 60, 120].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 20 20)`}>
            <path d="M20 2 V38" />
            <path d="M16 6 L20 10 L24 6 M16 34 L20 30 L24 34" />
            <path d="M17 13 L20 15.5 L23 13 M17 27 L20 24.5 L23 27" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Four-point twinkle sparkle. */
export function Sparkle({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0 C12.8 8 16 11.2 24 12 C16 12.8 12.8 16 12 24 C11.2 16 8 12.8 0 12 C8 11.2 11.2 8 12 0 Z" fill={GOLD} />
    </svg>
  );
}

/** Holly leaves with red berries. */
export function Holly({ className }: Props) {
  return (
    <svg viewBox="0 0 100 60" className={className} aria-hidden="true">
      <g fill={PINE} stroke="#1E3A27" strokeWidth={1.5} {...line}>
        <path d="M50 34 C40 20 30 30 22 22 C24 30 14 32 8 30 C14 38 10 44 4 46 C16 50 34 50 50 34 Z" />
        <path d="M50 34 C60 20 70 30 78 22 C76 30 86 32 92 30 C86 38 90 44 96 46 C84 50 66 50 50 34 Z" />
      </g>
      <g fill={RED} stroke={RED_DARK} strokeWidth={1.5}>
        <circle cx={44} cy={30} r={6} />
        <circle cx={56} cy={30} r={6} />
        <circle cx={50} cy={20} r={6} />
      </g>
      <circle cx={48} cy={18} r={1.6} fill="#fff" opacity={0.7} />
    </svg>
  );
}

/** Shiny glass bauble lying on the table (red by default). */
export function Ornament({ className, color = RED }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true">
      <ellipse cx={20} cy={41} rx={13} ry={2.5} fill="#000" opacity={0.45} />
      <rect x={16} y={2} width={8} height={6} rx={1.5} fill="#C9A05A" />
      <circle cx={20} cy={24} r={16} fill={color} />
      <path d="M8 30 A16 16 0 0 0 32 30" fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={6} />
      <ellipse cx={14} cy={17} rx={4.5} ry={3} fill="#fff" opacity={0.55} transform="rotate(-30 14 17)" />
      <circle cx={25} cy={13} r={1.2} fill="#fff" opacity={0.6} />
    </svg>
  );
}

/**
 * String of fairy lights sagging across the top of the poster; bulbs blink out of step.
 * Bulbs are HTML dots placed on the curve so they stay round at any width.
 */
const BULB_COLORS = ["#FF4D5A", "#FFD166", "#7BD88F", "#FFE9B0", "#FF8A3D"];
const BULBS = Array.from({ length: 13 }, (_, i) => {
  const x = 4 + (i * 92) / 12;                       // 4% … 96%
  const t = (x - 50) / 50;                           // -1 … 1
  return { x, y: 2 + 38 * (1 - t * t), color: BULB_COLORS[i % BULB_COLORS.length], delay: (i * 0.37) % 2.2 };
});

export function Garland({ className }: Props) {
  return (
    <div aria-hidden="true" className={`pointer-events-none relative h-16 ${className ?? ""}`}>
      <svg viewBox="0 0 100 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 6 Q50 88 100 6" fill="none" stroke="#2B3A22" strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
      </svg>
      {BULBS.map((b) => (
        <span key={b.x} className="absolute -translate-x-1/2" style={{ left: `${b.x}%`, top: b.y }}>
          <span className="block h-1.5 w-1 rounded-sm bg-[#3A4A2E]" />
          <span
            className="anim-blink -mt-px block h-3 w-2 rounded-b-full rounded-t-[40%]"
            style={{ background: b.color, color: b.color, animationDelay: `${b.delay}s` }}
          />
        </span>
      ))}
    </div>
  );
}

/** Thin gold rule with a sparkle in the middle, used between sections. */
export function GoldDivider({ className }: Props) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 ${className ?? ""}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E8C27A]/70" />
      <span className="anim-twinkle"><Sparkle className="size-3.5" /></span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E8C27A]/70" />
    </div>
  );
}
