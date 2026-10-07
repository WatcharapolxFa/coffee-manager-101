import Image from 'next/image';
import type { MenuCategory, PublicMenuItem } from '@/lib/menu-public';
import { Bat, Ghost, Moon, Pumpkin, Star, Web } from './Spooky';
import { DrinkCup } from './DrinkCup';

// One category of the customer menu drawn as a Halloween poster: night-sky title with the
// first row of drinks, a tilted pumpkin band for the second row, then any further rows.
// Everything uses the page font (Mali, set in app/menu/layout.tsx).

const NIGHT_TOP = '#24183F';

// Split drinks into rows of at most three without leaving a lonely drink on the last row
// (4 → 2+2, 7 → 3+2+2).
export function splitRows<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));
  const last = rows.at(-1);
  const prev = rows.at(-2);
  if (last && prev && last.length === 1 && prev.length === 3) last.unshift(prev.pop()!);
  return rows;
}

export function MenuPoster({ category, items, first = false }: { category: MenuCategory; items: PublicMenuItem[]; first?: boolean }) {
  const [hero = [], band = [], ...rest] = splitRows(items);

  return (
    <article id={category.slug} aria-labelledby={`${category.slug}-title`} className="relative mx-auto max-w-2xl scroll-mt-2">
      {/* soft curved edge so a new category doesn't start with a hard line */}
      {!first && (
        <svg aria-hidden="true" viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 -top-[39px] z-[5] block h-10 w-full">
          <path d="M0 40 C120 0 280 0 400 40 Z" fill={NIGHT_TOP} />
        </svg>
      )}

      {/* Night sky: title + first drinks */}
      <section className={`relative bg-gradient-to-b from-[#24183F] via-[#3A2766] to-[#5A3C8E] px-4 ${band.length ? 'pb-24' : 'pb-14'} ${first ? 'pt-[calc(env(safe-area-inset-top)+1.5rem)]' : 'pt-6'}`}>
        <Web className="pointer-events-none absolute top-0 left-0 size-16 opacity-60" />
        <Moon className="absolute top-3 right-3 size-14 sm:size-20" />
        <Star className="absolute top-24 left-[12%] size-3" />
        <Star className="absolute top-16 right-[24%] size-4" />
        <Star className="absolute top-44 right-6 size-3" />
        <Bat className="absolute top-28 right-[18%] size-9 rotate-6" />
        <Bat className="absolute top-52 left-3 size-7 -rotate-12" />

        {first && (
          <>
            <p className="relative text-center text-base font-semibold tracking-[0.2em] text-[#FFF1C9]/85">sunshine.coffee</p>
            <p className="relative text-center text-sm font-semibold tracking-[0.25em] text-[#FF8A3D]">happy halloween</p>
          </>
        )}

        <div className="relative mt-4 flex items-end justify-center gap-3">
          <h2 id={`${category.slug}-title`} className="text-[clamp(3rem,15vw,5.25rem)] leading-[1.05] font-bold italic text-[#FFF1C9] [text-shadow:4px_4px_0_#FF8A3D,8px_8px_0_#2A1A48]">
            {category.title}
          </h2>
          <Ghost className="ghost-bob mb-3 size-12 shrink-0 sm:size-16" />
        </div>
        <p className="relative mt-3 text-center text-lg font-semibold text-[#FFE3C2]">{category.tagline}</p>

        {items.length === 0 && <p className="mt-16 text-center text-lg text-[#FFF1C9]/70">ยังไม่มีเมนูในหมวดนี้</p>}
        <DrinkRow items={hero} tone="night" />
      </section>

      {/* Pumpkin-patch band, tilted like a poster strip */}
      {band.length > 0 && (
        <section className="relative z-10 -mt-14 -skew-y-6 bg-gradient-to-br from-[#FFB067] to-[#F07C3A] px-4 pt-4 pb-14 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
          <div className="skew-y-6">
            <div aria-hidden="true" className="flex justify-between px-1">
              <Pumpkin className="size-9 -rotate-6" />
              <Pumpkin className="size-7 rotate-12" />
            </div>
            <DrinkRow items={band} tone="pumpkin" />
          </div>
        </section>
      )}

      {/* Any further rows, back on the night sky */}
      {rest.length > 0 && (
        <section className="relative -mt-8 bg-gradient-to-b from-[#2E2052] to-[#24183F] px-4 pt-14 pb-10">
          {rest.map((row, i) => <DrinkRow key={i} items={row} tone="night" />)}
        </section>
      )}
    </article>
  );
}

// Up to three drinks side by side. Names take whatever lines they need, but price and cup
// line up across the row because each name block grows upward from the same baseline.
function DrinkRow({ items, tone }: { items: PublicMenuItem[]; tone: 'night' | 'pumpkin' }) {
  if (items.length === 0) return null;
  const night      = tone === 'night';
  const nameColor  = night ? 'text-[#FFF1C9]' : 'text-[#2A1A48]';
  const priceColor = night ? 'text-[#FF8A3D]' : 'text-[#FFF6EA] [text-shadow:2px_2px_0_#2A1A48]';
  const cols = items.length === 1 ? 'grid-cols-1 px-[28%]' : items.length === 2 ? 'grid-cols-2 px-[10%]' : 'grid-cols-3';

  return (
    <ul className={`relative z-[1] mt-8 grid items-stretch gap-x-2.5 gap-y-8 ${cols}`}>
      {items.map(item => (
        <li key={item.id} className="flex flex-col items-center text-center">
          <div className="flex flex-1 flex-col items-center justify-end">
            {item.featured && <span className="mb-1 rounded-full bg-[#8BD17C] px-2.5 py-0.5 text-xs font-bold text-[#2A1A48]">แนะนำ</span>}
            <h3 className={`text-[clamp(1rem,4.6vw,1.3rem)] leading-[1.2] font-bold ${nameColor}`}>{item.name}</h3>
          </div>
          <Price price={item.price} onLight={!night} className={`text-[clamp(1.45rem,6.4vw,1.9rem)] leading-tight ${priceColor}`} />
          <div className="relative mt-2 w-full max-w-36">
            <CupArt item={item} className="relative z-[1] aspect-[2/3] w-full" />
            <span aria-hidden="true" className="absolute -bottom-0.5 left-1/2 z-0 h-2.5 w-[60%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-[3px]" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Price({ price, className, onLight = false }: { price: number | null; className?: string; onLight?: boolean }) {
  return price != null
    ? <p className={`font-bold italic ${className}`}>{price}.-</p>
    : <p className={`mt-1 text-sm font-semibold whitespace-nowrap ${onLight ? 'text-[#2A1A48]' : 'text-[#8BD17C]'}`}>ถามพนักงานนะ</p>;
}

// Real photo when one exists in public/menu-photos/<slug>/, otherwise the cartoon cup.
function CupArt({ item, className }: { item: PublicMenuItem; className?: string }) {
  if (item.image) {
    return (
      <div className={`relative ${className}`}>
        <Image src={item.image} alt={item.name} fill quality={90} sizes="(max-width: 640px) 36vw, 220px" className="object-contain object-bottom" />
      </div>
    );
  }
  const parts = item.name.split('+').map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    return (
      <div className={`relative ${className}`}>
        <DrinkCup name={parts[0]} className="absolute bottom-0 left-0 h-[85%] -rotate-6" />
        <DrinkCup name={parts[1] ?? parts[0]} className="absolute right-0 bottom-0 h-[85%] rotate-6" />
      </div>
    );
  }
  return <DrinkCup name={item.name} className={className} />;
}
