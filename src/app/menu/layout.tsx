import type { Viewport } from 'next';
import { Cinzel, Great_Vibes, Playfair_Display, Trirong } from 'next/font/google';

// Customer menu (/menu), luxe Christmas: Thai serif body, gold Cinzel titles, script accent.
const body = Trirong({ subsets: ['thai', 'latin'], weight: ['400', '600', '700'], variable: '--font-body' });
// Drink names + prices: soft high-contrast italic (Thai glyphs fall back to Trirong).
const nameFont = Playfair_Display({ subsets: ['latin'], weight: ['500', '600'], style: ['italic'], variable: '--font-name' });
const display = Cinzel({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display' });
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script' });

// Safari status bar / toolbar tint matches the dark-wood poster.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1A0F0A',
};

const css = `
body { background: #1A0F0A; }
html { -webkit-text-size-adjust: 100%; background: #1A0F0A; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
@keyframes festive-bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
.festive-bob { animation: festive-bob 3.2s ease-in-out infinite; }
@keyframes snow-fall { from { transform: translateY(-10vh) translateX(0); } to { transform: translateY(110vh) translateX(var(--drift)); } }
.snowflake { position: absolute; top: 0; border-radius: 9999px; background: #fff; animation: snow-fall linear infinite; }
@media (prefers-reduced-motion: reduce) { .festive-bob, .snowflake { animation: none; } .snow { display: none; } }

/* drink names + prices */
.drink-name { font-family: var(--font-name), var(--font-body), serif; font-style: italic; font-weight: 600; letter-spacing: 0.01em; }

/* scroll reveal (only once JS is ready, so nothing hides without it) */
.reveal-ready .reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1); }
.reveal-ready .reveal.is-in { opacity: 1; transform: none; }

/* ---- idle animations ---- */
@keyframes twinkle { 0%, 100% { opacity: .35; transform: scale(.75) rotate(0deg); } 50% { opacity: 1; transform: scale(1.15) rotate(20deg); } }
.anim-twinkle { display: inline-block; animation: twinkle 2.6s ease-in-out infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.anim-spin { animation: spin 28s linear infinite; }
.anim-spin-rev { animation: spin 34s linear infinite reverse; }
@keyframes sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
.anim-sway { transform-origin: 50% 80%; animation: sway 4.2s ease-in-out infinite; }
@keyframes rock { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
.anim-rock { transform-origin: 50% 95%; animation: rock 3.4s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.anim-float { animation: float 4.6s ease-in-out infinite; }
@keyframes shadow { 0%, 100% { transform: scaleX(1); opacity: 1; } 50% { transform: scaleX(.82); opacity: .6; } }
.anim-shadow { animation: shadow 4.6s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { opacity: .55; transform: scale(.92); } 50% { opacity: 1; transform: scale(1.12); } }
.anim-breathe { animation: breathe 4.6s ease-in-out infinite; }
@keyframes bokeh { 0%, 100% { opacity: .5; transform: translate(0, 0) scale(.9); } 50% { opacity: 1; transform: translate(6px, -8px) scale(1.15); } }
.anim-bokeh { animation: bokeh 7s ease-in-out infinite; }
@keyframes swing { 0%, 100% { transform: rotate(calc(var(--tilt, 0deg) - 7deg)); } 50% { transform: rotate(calc(var(--tilt, 0deg) + 7deg)); } }
.anim-swing { transform-origin: 50% 0; animation: swing 2.8s ease-in-out infinite; }
@keyframes blink { 0%, 100% { opacity: 1; box-shadow: 0 0 8px 2px currentColor, 0 0 18px 4px currentColor; } 45% { opacity: .35; box-shadow: 0 0 2px 0 currentColor; } }
.anim-blink { animation: blink 2.2s ease-in-out infinite; }
@keyframes shimmer { 0% { background-position: 150% 0; } 60%, 100% { background-position: -50% 0; } }
.anim-shimmer { background-image: linear-gradient(105deg, #B8873E 0%, #E8C27A 30%, #FFF6DA 45%, #FFFFFF 50%, #FFF6DA 55%, #E8C27A 70%, #B8873E 100%); background-size: 250% 100%; animation: shimmer 5.5s ease-in-out infinite; }
@keyframes glow { 0%, 100% { text-shadow: 0 0 6px rgba(245,223,176,.25); } 50% { text-shadow: 0 0 18px rgba(245,223,176,.7); } }
.anim-glow { animation: glow 3.6s ease-in-out infinite; }
@keyframes pop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
.anim-pop { animation: pop 2.4s ease-in-out infinite; }

/* ---- snowman & reindeer: part-by-part motion ---- */
.is-alive svg *, .is-walking svg *, .is-hopping svg * { transform-box: fill-box; }
@keyframes eye-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
.is-alive .blink { transform-origin: 50% 50%; animation: eye-blink 4.2s infinite; }
@keyframes wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-22deg); } }
.is-alive .sm-arm-r { transform-origin: 0% 100%; animation: wave 1.2s ease-in-out infinite; }
@keyframes arm-flap { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(14deg); } }
.is-alive .sm-arm-l { transform-origin: 100% 100%; animation: arm-flap 1.8s ease-in-out infinite; }
@keyframes scarf { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
.is-alive .sm-scarf { transform-origin: 50% 0%; animation: scarf 1.6s ease-in-out infinite; }
@keyframes ear-l { 0%, 80%, 100% { transform: rotate(0deg); } 85% { transform: rotate(-18deg); } 90% { transform: rotate(6deg); } }
@keyframes ear-r { 0%, 60%, 100% { transform: rotate(0deg); } 65% { transform: rotate(18deg); } 70% { transform: rotate(-6deg); } }
.is-alive .rh-ear-l { transform-origin: 100% 50%; animation: ear-l 3.6s ease-in-out infinite; }
.is-alive .rh-ear-r { transform-origin: 0% 50%; animation: ear-r 3.6s ease-in-out infinite; }
@keyframes head-tilt { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
.is-alive .rh-head { transform-origin: 50% 90%; animation: head-tilt 5s ease-in-out infinite; }
@keyframes bell { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } }
.is-alive .rh-bell { transform-origin: 50% 0%; animation: bell 1.4s ease-in-out infinite; }

/* travelling along the table: the wrapper crosses and back, turning round at each end */
@keyframes walk-x { 0% { left: 0%; } 46% { left: calc(100% - 4rem); } 50% { left: calc(100% - 4rem); } 96% { left: 0%; } 100% { left: 0%; } }
.walk-x { animation: walk-x 24s linear infinite; }
.walk-x.walk-slow { animation-duration: 30s; }
@keyframes walk-face { 0%, 46% { transform: scaleX(1); } 50%, 96% { transform: scaleX(-1); } 100% { transform: scaleX(1); } }
.walk-face { animation: walk-face 24s ease-in-out infinite; }
.walk-slow .walk-face { animation-duration: 30s; }
/* reindeer trot: diagonal legs swing in turn, body bobs, head nods */
@keyframes leg { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }
.is-walking .rf-leg { transform-origin: 50% 0%; animation: leg .42s ease-in-out infinite alternate; }
.is-walking .rf-leg-b { animation-delay: -.42s; }
@keyframes trot-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.6px); } }
.is-walking .rf-body { animation: trot-bob .42s ease-in-out infinite; }
@keyframes nod { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-5deg); } }
.is-walking .rf-head { transform-origin: 0% 100%; animation: nod .84s ease-in-out infinite; }
@keyframes tail { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-25deg); } }
.is-walking .rf-tail { transform-origin: 100% 50%; animation: tail .6s ease-in-out infinite; }
/* snowman hop: squash on landing, stretch in the air, shadow shrinks while airborne */
@keyframes hop { 0%, 100% { transform: translateY(0) scale(1.08, .92); } 15% { transform: translateY(0) scale(.95, 1.06); } 50% { transform: translateY(-12px) scale(.97, 1.03); } 85% { transform: translateY(0) scale(1, 1); } }
.is-hopping .sm-body { transform-origin: 50% 100%; animation: hop .9s ease-in-out infinite; }
@keyframes hop-shadow { 0%, 100% { transform: scaleX(1); opacity: .4; } 50% { transform: scaleX(.6); opacity: .2; } }
.is-hopping .sm-shadow { transform-origin: 50% 50%; animation: hop-shadow .9s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .walk-x, .walk-face, .is-alive *, .is-walking *, .is-hopping * { animation: none !important; }
  .reveal-ready .reveal { opacity: 1; transform: none; transition: none; }
  [class*="anim-"] { animation: none !important; }
}
`;

// Gentle falling snow over the whole menu; deterministic so server and client render the same.
const FLAKES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 2 + (i % 3),
  duration: 9 + ((i * 7) % 9),
  delay: -((i * 13) % 17),
  drift: ((i % 5) - 2) * 12,
  opacity: 0.25 + (i % 3) * 0.15,
}));

function Snow() {
  return (
    <div aria-hidden="true" className="snow pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function CustomerMenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${body.className} ${body.variable} ${display.variable} ${script.variable} ${nameFont.variable} min-h-dvh overflow-x-clip bg-[#1A0F0A] bg-[linear-gradient(180deg,#1A0F0A_0%,#2A180F_40%,#1F120B_100%)] text-[#F5E6C8]`}>
      <style>{css}</style>
      <Snow />
      {children}
    </div>
  );
}
