import type { Viewport } from 'next';
import { Grandstander, Mali } from 'next/font/google';

// Customer menu (/menu): playful display face for titles, Mali for Thai and body text.
const display = Grandstander({ subsets: ['latin'], weight: ['700', '900'], style: ['normal', 'italic'], variable: '--font-poster' });
const body = Mali({ subsets: ['thai', 'latin'], weight: ['400', '600', '700'], variable: '--font-poster-body' });

// Safari status bar / toolbar tint matches the night-sky poster.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#24183F',
};

const css = `
html { -webkit-text-size-adjust: 100%; background: #24183F; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
@keyframes ghost-bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
.ghost-bob { animation: ghost-bob 3.2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ghost-bob { animation: none; } }
`;

export default function CustomerMenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} min-h-dvh overflow-x-clip bg-[#24183F] font-[family-name:var(--font-poster-body)] text-[#FFF1C9]`}>
      <style>{css}</style>
      {children}
    </div>
  );
}
