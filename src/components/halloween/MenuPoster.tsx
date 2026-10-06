import Image from 'next/image';
import type { MenuCategory, PublicMenuItem } from '@/lib/menu-public';
import { Bat, Ghost, Moon, Pumpkin, Star, Web } from './Spooky';
import { DrinkCup } from './DrinkCup';

// One category of the customer menu drawn as a Halloween poster: night-sky title with the
// first three drinks, a tilted pumpkin band for the next three, then a compact grid.

const display = 'font-[family-name:var(--font-poster),var(--font-poster-body)]';

export type HeroStyle = 'halo' | 'card' | 'hill';

export function MenuPoster({ category, items, first = false, heroStyle = 'halo' }: { category: MenuCategory; items: PublicMenuItem[]; first?: boolean; heroStyle?: HeroStyle }) {
  const hero = items.slice(0, 3);
  const band = items.slice(3, 6);
  const rest = items.slice(6);

  return (
    <article id={category.slug} aria-labelledby={`${category.slug}-title`} className="mx-auto max-w-2xl scroll-mt-2">
      {/* Night sky: title + first drinks */}
      <section className={`relative bg-gradient-to-b from-[#24183F] via-[#3A2766] to-[#5A3C8E] px-4 pb-24 ${first ? 'pt-[calc(env(safe-area-inset-top)+1.5rem)]' : 'pt-10'}`}>
        <Web className="pointer-events-none absolute top-0 left-0 size-16 opacity-60" />
        <Moon className="absolute top-3 right-3 size-14 sm:size-20" />
        <Star className="absolute top-24 left-[12%] size-3" />
        <Star className="absolute top-16 right-[24%] size-4" />
        <Star className="absolute top-44 right-6 size-3" />
        <Bat className="absolute top-28 right-[18%] size-9 rotate-6" />
        <Bat className="absolute top-52 left-3 size-7 -rotate-12" />

        {first && (
          <>
            <p className="relative text-center text-sm tracking-[0.25em] text-[#FFF1C9]/80">sunshine.coffee</p>
            <p className="relative text-center text-[11px] tracking-[0.3em] text-[#FF8A3D]">happy halloween</p>
          </>
        )}

        <div className="relative mt-5 flex items-end justify-center gap-3">
          <h2 id={`${category.slug}-title`} className={`${display} text-[clamp(3.2rem,16vw,5.5rem)] leading-[0.9] font-black italic text-[#FFF1C9] [text-shadow:4px_4px_0_#FF8A3D,8px_8px_0_#2A1A48]`}>
            {category.title}
          </h2>
          <Ghost className="ghost-bob mb-2 size-12 shrink-0 sm:size-16" />
        </div>
        <p className="relative mt-4 text-center text-base font-semibold text-[#FFE3C2]">{category.tagline}</p>

        {items.length === 0 && <p className="mt-16 text-center text-[#FFF1C9]/70">ยังไม่มีเมนูในหมวดนี้</p>}
        <HeroRow items={hero} tone="night" look={heroStyle} />
      </section>

      {/* Pumpkin-patch band, tilted like a poster strip */}
      {band.length > 0 && (
        <section className="relative z-10 -mt-14 -skew-y-6 bg-gradient-to-br from-[#FFB067] to-[#F07C3A] px-4 pt-6 pb-14 shadow-[0_-10px_30px_rgba(0,0,0,0.25)]">
          <div className="skew-y-6">
            <div className="flex justify-between px-1">
              <Pumpkin className="size-10 -rotate-6" />
              <Pumpkin className="size-8 rotate-12" />
            </div>
            <HeroRow items={band} tone="pumpkin" look={heroStyle} />
          </div>
        </section>
      )}

      {/* The rest: compact grid like the lower half of a menu board */}
      {rest.length > 0 && (
        <section className="relative -mt-8 bg-[#2E2052] px-4 pt-16 pb-8">
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3">
            {rest.map(item => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <CupArt item={item} className="relative z-[1] h-24 w-16" />
                  <span aria-hidden="true" className="absolute -bottom-1 left-1/2 h-2.5 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-[2px]" />
                </div>
                <div className="min-w-0">
                  <h3 className={`${display} text-base leading-tight font-black italic text-[#FFF1C9]`}>{item.name}</h3>
                  <Price price={item.price} className="text-xl text-[#FF8A3D]" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

    </article>
  );
}

// Up to three big drinks side by side, name and price above each cup.
// `look` decides what anchors the cups: a soft circle behind each (halo), a little card per
// drink (card), or a rolling hill they all stand on (hill).
function HeroRow({ items, tone, look }: { items: PublicMenuItem[]; tone: 'night' | 'pumpkin'; look: HeroStyle }) {
  if (items.length === 0) return null;
  const night      = tone === 'night';
  const nameColor  = night || look === 'card' ? 'text-[#FFF1C9]' : 'text-[#2A1A48]';
  const priceColor = night || look === 'card' ? 'text-[#FF8A3D]' : 'text-[#FFF6EA] [text-shadow:2px_2px_0_#2A1A48]';
  const cols = items.length === 1 ? 'grid-cols-1 px-[25%]' : items.length === 2 ? 'grid-cols-2 px-[8%]' : 'grid-cols-3';

  return (
    <div className="relative mt-8">
      <ul className={`relative z-[1] grid items-end gap-2.5 ${cols}`}>
        {items.map(item => {
          const label = (
            <>
              {item.featured && <span className="mb-1 rounded-full bg-[#8BD17C] px-2 py-0.5 text-[10px] font-bold text-[#2A1A48]">แนะนำ</span>}
              <h3 className={`${display} text-[clamp(0.95rem,4.2vw,1.35rem)] leading-[1.05] font-black italic uppercase ${nameColor}`}>{item.name}</h3>
              <Price price={item.price} onLight={!night && look !== 'card'} className={`mt-0.5 text-[clamp(1.1rem,5vw,1.6rem)] ${priceColor}`} />
            </>
          );

          if (look === 'card') {
            return (
              <li key={item.id} className="flex h-full flex-col items-center rounded-[28px] border border-white/15 bg-[#2A1A48]/55 px-1.5 pt-3 pb-2 text-center shadow-[0_8px_20px_rgba(20,10,40,0.35)]">
                {label}
                <CupArt item={item} className="mt-auto aspect-[2/3] w-full max-w-32 pt-2" />
              </li>
            );
          }

          return (
            <li key={item.id} className="flex flex-col items-center text-center">
              {label}
              <div className="relative mt-2 w-full max-w-36">
                {look === 'halo' && (
                  <span aria-hidden="true" className={`absolute bottom-[6%] left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full ${night ? 'bg-[#6B4FA0]/70' : 'bg-[#FFE3C2]/70'}`} />
                )}
                <CupArt item={item} className="relative z-[1] aspect-[2/3] w-full" />
                <span aria-hidden="true" className="absolute -bottom-0.5 left-1/2 z-0 h-2.5 w-[60%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-[3px]" />
              </div>
            </li>
          );
        })}
      </ul>
      {look === 'hill' && (
        <svg aria-hidden="true" viewBox="0 0 400 60" preserveAspectRatio="none" className="relative -mx-4 -mt-5 block h-12 w-[calc(100%+2rem)]">
          <path d="M0 30 Q60 6 130 22 T260 18 T400 26 V60 H0 Z" fill={night ? '#2A1A48' : '#C9551F'} />
          <path d="M0 30 Q60 6 130 22 T260 18 T400 26" fill="none" stroke={night ? '#8BD17C' : '#FFB067'} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

function Price({ price, className, onLight = false }: { price: number | null; className?: string; onLight?: boolean }) {
  return price != null
    ? <p className={`${display} font-black italic ${className}`}>{price}.-</p>
    : <p className={`mt-1 text-xs font-semibold whitespace-nowrap ${onLight ? 'text-[#2A1A48]' : 'text-[#8BD17C]'}`}>ถามพนักงานนะ</p>;
}

// Real photo when one exists in public/menu/<slug>/, otherwise the cartoon cup.
function CupArt({ item, className }: { item: PublicMenuItem; className?: string }) {
  if (item.image) {
    return (
      <div className={`relative ${className}`}>
        <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 33vw, 200px" className="object-contain object-bottom" />
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
