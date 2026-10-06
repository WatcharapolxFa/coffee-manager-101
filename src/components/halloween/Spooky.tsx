import type { ReactNode } from "react";

// Cute picture-book Halloween illustrations (inline SVG, server-component safe).
// Flat fills, soft outlines, no ids/defs so multiple instances never collide.

const PLUM = "#3B2A5E";
const GRAPE = "#6B4FA0";
const PUMPKIN = "#FF8A3D";
const PUMPKIN_DARK = "#E8662A";
const SLIME = "#8BD17C";
const SLIME_DARK = "#4E9A47";
const PINK = "#FF8FB1";
const CREAM = "#FFF1C9";
const YELLOW = "#FFD23F";

type Props = { className?: string };

const line = { strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** Chubby white ghost waving its little arms. */
export function Ghost({ className }: Props) {
  return (
    <svg viewBox="0 0 100 110" className={className} aria-hidden="true">
      <g stroke={PLUM} strokeWidth={2.5} {...line}>
        <ellipse cx={15} cy={64} rx={6} ry={11} fill="#fff" transform="rotate(-55 15 64)" />
        <ellipse cx={85} cy={64} rx={6} ry={11} fill="#fff" transform="rotate(55 85 64)" />
        <path
          d="M18 98 V50 A32 32 0 0 1 82 50 V98 Q74 108 66 98 Q58 108 50 98 Q42 108 34 98 Q26 108 18 98 Z"
          fill="#fff"
        />
      </g>
      <circle cx={40} cy={52} r={4.5} fill={PLUM} />
      <circle cx={60} cy={52} r={4.5} fill={PLUM} />
      <circle cx={41.5} cy={50.5} r={1.5} fill="#fff" />
      <circle cx={61.5} cy={50.5} r={1.5} fill="#fff" />
      <ellipse cx={32} cy={62} rx={5} ry={3} fill={PINK} />
      <ellipse cx={68} cy={62} rx={5} ry={3} fill={PINK} />
      <ellipse cx={50} cy={66} rx={3} ry={3.5} fill={PLUM} />
    </svg>
  );
}

/** Pumpkin body shared by Pumpkin and PumpkinPrice (lobes + stem + leaf). */
function PumpkinBody({ cy, ry, rx }: { cy: number; ry: number; rx: number }) {
  const top = cy - ry;
  return (
    <>
      {/* curly tendril + stem + leaf */}
      <path d={`M47 ${top + 2} C38 ${top - 6} 34 ${top + 4} 41 ${top + 6}`} fill="none" stroke={SLIME_DARK} strokeWidth={2.5} {...line} />
      <path
        d={`M55 ${top - 6} C62 ${top - 18} 78 ${top - 16} 82 ${top - 9} C74 ${top - 3} 62 ${top - 2} 55 ${top - 6} Z`}
        fill={SLIME}
        stroke={SLIME_DARK}
        strokeWidth={2.5}
        {...line}
      />
      <rect x={45} y={top - 12} width={10} height={18} rx={4} fill={SLIME} stroke={SLIME_DARK} strokeWidth={2.5} transform={`rotate(8 50 ${top})`} />
      <g fill={PUMPKIN} stroke={PUMPKIN_DARK} strokeWidth={2.5} {...line}>
        <ellipse cx={50 - rx * 0.62} cy={cy} rx={rx} ry={ry * 0.94} />
        <ellipse cx={50 + rx * 0.62} cy={cy} rx={rx} ry={ry * 0.94} />
        <ellipse cx={50} cy={cy} rx={rx * 0.92} ry={ry} />
      </g>
    </>
  );
}

/** Round, happy jack-o'-lantern. */
export function Pumpkin({ className }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <PumpkinBody cy={61} rx={24} ry={32} />
      <g fill={PLUM} stroke={PLUM} strokeWidth={3} {...line}>
        <path d="M33 52 L43 52 L38 44 Z" />
        <path d="M57 52 L67 52 L62 44 Z" />
        <path d="M33 64 Q50 70 67 64 Q50 84 33 64 Z" />
      </g>
      <rect x={52} y={65.5} width={5} height={4.5} rx={1} fill={PUMPKIN} />
      <ellipse cx={27} cy={62} rx={4.5} ry={2.8} fill={PINK} />
      <ellipse cx={73} cy={62} rx={4.5} ry={2.8} fill={PINK} />
    </svg>
  );
}

/**
 * Plain pumpkin used as a price badge. Size via className (e.g. "size-16 text-sm").
 * Children (e.g. "55.-") render centered on the pumpkin body in bold white.
 */
export function PumpkinPrice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={"relative inline-grid place-items-center " + (className ?? "")}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <PumpkinBody cy={58} rx={29} ry={39} />
      </svg>
      <span
        className="relative z-10 pt-[18%] font-bold leading-none text-[#3B2A5E]"
        style={{ textShadow: "0 1px 0 rgba(255,241,201,0.6)" }}
      >
        {children}
      </span>
    </span>
  );
}

/** Round little bat with baby-tooth fangs. */
export function Bat({ className }: Props) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <g fill={GRAPE} stroke={PLUM} strokeWidth={2.5} {...line}>
        <path d="M48 30 C38 12 20 12 6 22 C12 25 14 29 14 34 C20 30 26 32 29 38 C33 33 41 34 48 40 Z" />
        <path d="M72 30 C82 12 100 12 114 22 C108 25 106 29 106 34 C100 30 94 32 91 38 C87 33 79 34 72 40 Z" />
        <path d="M48 24 L49 9 L57 18 Z" />
        <path d="M72 24 L71 9 L63 18 Z" />
        <circle cx={60} cy={33} r={16} />
      </g>
      <circle cx={54} cy={30} r={4} fill="#fff" />
      <circle cx={66} cy={30} r={4} fill="#fff" />
      <circle cx={54.5} cy={30.5} r={2.2} fill={PLUM} />
      <circle cx={66.5} cy={30.5} r={2.2} fill={PLUM} />
      <ellipse cx={49} cy={37} rx={3.5} ry={2.2} fill={PINK} />
      <ellipse cx={71} cy={37} rx={3.5} ry={2.2} fill={PINK} />
      <path d="M57.5 39.5 L58.3 42.5 L59.3 40 Z M60.7 40 L61.7 42.5 L62.5 39.5 Z" fill="#fff" stroke="#fff" strokeWidth={0.6} {...line} />
      <path d="M55 38 Q60 42 65 38" fill="none" stroke={PLUM} strokeWidth={2} {...line} />
    </svg>
  );
}

/** Sleepy crescent moon. */
export function Moon({ className }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M58 10 A41 41 0 1 0 58 90 A46 46 0 0 1 58 10 Z" fill={CREAM} stroke={PLUM} strokeWidth={2.5} {...line} />
      <path d="M17 42 Q21.5 46.5 26 42" fill="none" stroke={PLUM} strokeWidth={2.2} {...line} />
      <ellipse cx={28} cy={50} rx={4} ry={2.5} fill={PINK} />
      <path d="M17 55 Q21 59 25 55" fill="none" stroke={PLUM} strokeWidth={2.2} {...line} />
    </svg>
  );
}

/** Small rounded candy-corn-yellow star. */
export function Star({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 3 L14.6 8.9 L21 9.6 L16.2 13.9 L17.6 20.2 L12 17 L6.4 20.2 L7.8 13.9 L3 9.6 L9.4 8.9 Z"
        fill={YELLOW}
        stroke={YELLOW}
        strokeWidth={2.5}
        {...line}
      />
    </svg>
  );
}

/** Classic candy corn with a tiny smile. */
export function CandyCorn({ className }: Props) {
  return (
    <svg viewBox="0 0 40 50" className={className} aria-hidden="true">
      <path d="M20 5 L14.5 18 L25.5 18 Z" fill="#fff" />
      <path d="M14.5 18 L9.4 30 L30.6 30 L25.5 18 Z" fill={PUMPKIN} />
      <path d="M9.4 30 L6 38 Q4 44 10 44 L30 44 Q36 44 34 38 L30.6 30 Z" fill={YELLOW} />
      <path d="M20 5 L6 38 Q4 44 10 44 L30 44 Q36 44 34 38 Z" fill="none" stroke={PUMPKIN_DARK} strokeWidth={2.2} {...line} />
      <circle cx={16} cy={35} r={1.4} fill={PLUM} />
      <circle cx={24} cy={35} r={1.4} fill={PLUM} />
      <ellipse cx={12.5} cy={38} rx={1.8} ry={1.1} fill={PINK} />
      <ellipse cx={27.5} cy={38} rx={1.8} ry={1.1} fill={PINK} />
      <path d="M18 38 Q20 40 22 38" fill="none" stroke={PLUM} strokeWidth={1.2} {...line} />
    </svg>
  );
}

/** Little grape cauldron bubbling with green slime. */
export function Cauldron({ className }: Props) {
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden="true">
      <g stroke={PLUM} strokeWidth={2.5} {...line}>
        <ellipse cx={30} cy={83} rx={7} ry={4} fill={PLUM} />
        <ellipse cx={70} cy={83} rx={7} ry={4} fill={PLUM} />
        <path d="M14 42 C10 70 26 82 50 82 C74 82 90 70 86 42 Z" fill={GRAPE} />
      </g>
      <g fill={SLIME} stroke={SLIME_DARK} strokeWidth={2.5} {...line}>
        <ellipse cx={50} cy={38} rx={35} ry={9} />
        <circle cx={40} cy={27} r={6} />
        <circle cx={59} cy={20} r={4.5} />
        <circle cx={67} cy={31} r={3.5} />
        <circle cx={48} cy={11} r={2.5} />
      </g>
      <circle cx={38} cy={25} r={1.6} fill="#fff" />
      <circle cx={57.8} cy={18.8} r={1.2} fill="#fff" />
      <rect x={8} y={38} width={84} height={10} rx={5} fill={GRAPE} stroke={PLUM} strokeWidth={2.5} />
      <path d="M30 46 V53 A3.5 3.5 0 0 0 37 53 V46 Z" fill={SLIME} stroke={SLIME_DARK} strokeWidth={2} {...line} />
      <circle cx={41} cy={62} r={3.5} fill={PLUM} />
      <circle cx={59} cy={62} r={3.5} fill={PLUM} />
      <circle cx={42} cy={61} r={1.1} fill="#fff" />
      <circle cx={60} cy={61} r={1.1} fill="#fff" />
      <ellipse cx={34} cy={68} rx={4} ry={2.5} fill={PINK} />
      <ellipse cx={66} cy={68} rx={4} ry={2.5} fill={PINK} />
      <path d="M46 68 Q50 72 54 68" fill="none" stroke={PLUM} strokeWidth={2} {...line} />
    </svg>
  );
}

// Spoke directions for the corner web (0° → 90°), and ring radii.
const WEB_DIRS = [0, 22.5, 45, 67.5, 90].map((deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]);
const WEB_MID = [11.25, 33.75, 56.25, 78.75].map((deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]);
const r1 = (n: number) => Math.round(n * 10) / 10;
const WEB_RINGS = [28, 52, 76, 100].map((r) => {
  const pts = WEB_DIRS.map(([c, s]) => [r1(c * r), r1(s * r)]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [mc, ms] = WEB_MID[i - 1];
    d += ` Q${r1(mc * r * 0.86)} ${r1(ms * r * 0.86)} ${pts[i][0]} ${pts[i][1]}`;
  }
  return d;
});

/** Top-left corner spiderweb with a tiny friendly spider. */
export function Web({ className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke={PLUM} strokeWidth={1.2} opacity={0.4} {...line}>
        {WEB_DIRS.map(([c, s], i) => (
          <line key={i} x1={0} y1={0} x2={r1(c * 115)} y2={r1(s * 115)} />
        ))}
        {WEB_RINGS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <line x1={88} y1={40} x2={88} y2={84} stroke={PLUM} strokeWidth={1} opacity={0.6} />
      <g fill="none" stroke={PLUM} strokeWidth={2} {...line}>
        <path d="M81 88 Q75 84 72 88 M81 92 Q75 92 73 96 M95 88 Q101 84 104 88 M95 92 Q101 92 103 96" />
      </g>
      <circle cx={88} cy={91} r={9} fill={PLUM} />
      <circle cx={85} cy={89} r={2.4} fill="#fff" />
      <circle cx={91} cy={89} r={2.4} fill="#fff" />
      <circle cx={85.3} cy={89.4} r={1.2} fill={PLUM} />
      <circle cx={91.3} cy={89.4} r={1.2} fill={PLUM} />
      <ellipse cx={82.5} cy={94} rx={2} ry={1.2} fill={PINK} />
      <ellipse cx={93.5} cy={94} rx={2} ry={1.2} fill={PINK} />
      <path d="M86 94.5 Q88 96.5 90 94.5" fill="none" stroke="#fff" strokeWidth={1} {...line} />
    </svg>
  );
}
