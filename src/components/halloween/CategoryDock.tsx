'use client';

import { useEffect, useRef, useState } from 'react';

interface DockItem { slug: string; title: string }

// Floating category bar at the bottom of the customer menu, where a thumb reaches easily.
// Highlights the category on screen and glides to a category when tapped.
export function CategoryDock({ items }: { items: DockItem[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? '');
  const gliding = useRef(false);     // ignore scroll-spy while a tap-scroll is gliding
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (gliding.current) return;
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-40% 0px -55% 0px' });
    items.forEach(i => { const el = document.getElementById(i.slug); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [items]);

  // Keep the highlighted chip in view inside the bar (without moving the page).
  useEffect(() => {
    const chip = bar.current?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (!chip || !bar.current) return;
    const left = chip.offsetLeft - (bar.current.clientWidth - chip.clientWidth) / 2;
    bar.current.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  function go(slug: string) {
    const target = document.getElementById(slug);
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gliding.current = true;
    setTimeout(() => { gliding.current = false; }, 900);
    setActive(slug);
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${slug}`);
  }

  return (
    <nav
      aria-label="หมวดเมนู"
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pointer-events-none"
    >
      <div
        ref={bar}
        className="pointer-events-auto flex max-w-full snap-x gap-1 overflow-x-auto rounded-full border border-white/15 bg-[#3A2766]/75 p-1.5 shadow-[0_8px_28px_rgba(20,10,40,0.45)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(item => {
          const on = item.slug === active;
          return (
            <button
              key={item.slug}
              type="button"
              data-slug={item.slug}
              aria-current={on ? 'true' : undefined}
              onClick={() => go(item.slug)}
              className={`min-h-11 shrink-0 snap-center rounded-full px-4 text-[15px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF8A3D]/50 ${
                on ? 'bg-[#FFB067] text-[#2A1A48] shadow-[0_2px_10px_rgba(255,138,61,0.45)]' : 'text-[#FFF1C9]/85 active:bg-white/10'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
