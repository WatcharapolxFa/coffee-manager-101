import Image from 'next/image';
import type { ReactNode } from 'react';
import type { MenuCategory, PublicMenuItem } from '@/lib/menu-public';
import { splitRows } from '@/components/halloween/MenuPoster';
import { Garland, GoldDivider, Holly, Ornament, ReindeerFigure, ReindeerHead, Snowflake, Snowman, Sparkle } from './Festive';
import { DrinkCup } from './DrinkCup';

// One category of the customer menu drawn as a luxe Christmas poster: warm dark-wood
// background with candle-light glow, gold serif titles, red ribbon name labels and
// each drink standing on a gold-rimmed plate. Fonts come from app/menu/layout.tsx
// (--font-display gold serif, --font-script, Thai serif body).

const GOLD_TEXT = 'bg-gradient-to-b from-[#FFF0C8] via-[#E8C27A] to-[#B8873E] bg-clip-text text-transparent';
// Gold text with a slow light sweep across it (see .anim-shimmer in app/menu/layout.tsx).
const GOLD_SHIMMER = 'anim-shimmer bg-clip-text text-transparent';
// Small helper for staggered animation timing.
const delay = (s: number) => ({ animationDelay: `${s}s` });

export function MenuPoster({ category, items, index = 0 }: { category: MenuCategory; items: PublicMenuItem[]; index?: number }) {
  const first = index === 0;
  const rows = splitRows(items);

  return (
    <article
      id={category.slug}
      aria-labelledby={`${category.slug}-title`}
      className={`relative mx-auto max-w-2xl scroll-mt-2 overflow-hidden px-4 pb-14 ${first ? 'pt-[calc(env(safe-area-inset-top)+2rem)]' : 'pt-10'}`}
    >
      {/* candle-light glow + faint snowflakes in the corners */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,170,90,0.22),transparent_60%),radial-gradient(ellipse_at_100%_70%,rgba(179,32,42,0.18),transparent_55%)]" />
      <Snowflake className="anim-spin pointer-events-none absolute top-6 left-3 size-14 opacity-25" />
      <Snowflake className="anim-spin-rev pointer-events-none absolute top-28 right-4 size-10 opacity-20" />
      <Snowflake className="anim-spin pointer-events-none absolute bottom-16 left-6 size-8 opacity-15" />
      <span style={delay(0)} className="anim-twinkle pointer-events-none absolute top-12 right-[22%]"><Sparkle className="size-3" /></span>
      <span style={delay(1.3)} className="anim-twinkle pointer-events-none absolute top-40 left-[18%]"><Sparkle className="size-2.5" /></span>
      <span style={delay(0.7)} className="anim-twinkle pointer-events-none absolute top-24 left-[40%]"><Sparkle className="size-2" /></span>

      {first ? (
        <header className="relative text-center">
          <Garland className="-mx-4 -mt-[calc(env(safe-area-inset-top)+2rem)] mb-4" />
          <p className="text-sm tracking-[0.35em] text-[#E8C27A]/80 uppercase">sunshine.coffee</p>
          <p className="anim-glow mt-3 font-[family-name:var(--font-script)] text-[clamp(2.4rem,11vw,3.6rem)] leading-none text-[#F5DFB0]">Special Menu</p>
          <p className={`-mt-1 font-[family-name:var(--font-display)] text-[clamp(2.8rem,14vw,5rem)] leading-tight font-semibold tracking-[0.06em] ${GOLD_SHIMMER} drop-shadow-[0_2px_10px_rgba(232,194,122,0.35)]`}>
            CHRISTMAS
          </p>
          <p className="font-[family-name:var(--font-display)] text-[clamp(0.8rem,3.4vw,1.05rem)] tracking-[0.18em] text-[#F5E6C8]">
            SANTA BREWED YOU A LITTLE GIFT
          </p>
          <p className="mt-3 text-base text-[#F5E6C8]/90">เมนูอุ่นใจ รับเทศกาลคริสต์มาส</p>
          <GoldDivider className="mx-auto mt-8 max-w-xs" />
        </header>
      ) : (
        <GoldDivider className="relative mx-auto max-w-xs" />
      )}

      <div className="relative mt-6 text-center">
        <h2 id={`${category.slug}-title`} className={`font-[family-name:var(--font-display)] text-[clamp(2rem,9vw,3.25rem)] leading-tight font-semibold tracking-[0.04em] ${GOLD_SHIMMER}`}>
          {category.title}
        </h2>
        {category.tagline && <p className="mt-1 text-base text-[#F5E6C8]/85">{category.tagline}</p>}
        <TitleBuddy index={index} />
      </div>

      {items.length === 0 && <p className="relative mt-12 text-center text-lg text-[#F5E6C8]/70">ยังไม่มีเมนูในหมวดนี้</p>}
      {rows.map((row, i) => (
        // The first two rows of the page are what a phone sees on opening: fetch those photos
        // straight away (the very first row at high priority); everything else loads lazily.
        <DrinkRow key={i} items={row} variant={index + i} load={first && i === 0 ? 'high' : first && i === 1 ? 'eager' : 'lazy'} />
      ))}
    </article>
  );
}

// The little character under each category title, taking turns: holly, snowman, reindeer.
function TitleBuddy({ index }: { index: number }) {
  switch (index % 3) {
    case 1: return <span className="is-alive mx-auto mt-1 block w-14"><Snowman className="w-full" /></span>;
    case 2: return <span className="is-alive mx-auto mt-1 block w-16"><ReindeerHead className="w-full" /></span>;
    default: return <Holly className="anim-sway mx-auto mt-2 w-12 opacity-90" />;
  }
}

// Up to three drinks standing together on a wood table, like a styled food photo: warm
// light pool, blurred fairy-light bokeh behind, a reflection and contact shadow under each
// glass and a few props between them. Names sit on ribbon labels in a separate row so they
// line up however long they are.
// Table dressing per row: one still prop, plus one character that travels along the table
// (the reindeer trots, the snowman hops). Rows take turns so the page doesn't repeat.
const PROPS = [
  { still: { kind: 'ornament', at: 'right-[30%]', color: '#B3202A' }, walker: 'snowman' },
  { still: { kind: 'ornament', at: 'left-[31%]', color: '#C9A05A' }, walker: 'reindeer' },
  { still: { kind: 'holly', at: 'right-[30%]' }, walker: 'reindeer' },
  { still: { kind: 'ornament', at: 'left-[31%]', color: '#B3202A' }, walker: 'snowman' },
] as const;

const BOKEH = [
  'top-[6%] left-[8%] size-10 bg-[#F5C46A]/35',
  'top-[14%] right-[12%] size-14 bg-[#E8A04A]/25',
  'top-[2%] left-[46%] size-8 bg-[#FFE3A3]/30',
  'top-[24%] left-[24%] size-6 bg-[#C8323A]/35',
  'top-[20%] right-[34%] size-5 bg-[#FFE3A3]/40',
];

type PhotoLoad = 'high' | 'eager' | 'lazy';

export function DrinkRow({ items, variant, label, load = 'lazy' }: {
  items: PublicMenuItem[];
  variant: number;
  /** Optional override for what sits under each glass (the name ribbon by default; the price tag hangs on the glass). */
  label?: (item: PublicMenuItem, i: number) => ReactNode;
  load?: PhotoLoad;
}) {
  if (items.length === 0) return null;
  const n = items.length;
  const cols = n === 1 ? 'grid-cols-1 px-[28%]' : n === 2 ? 'grid-cols-2 px-[12%]' : 'grid-cols-3';
  const dressing = PROPS[variant % PROPS.length];

  return (
    <div className="relative z-[1] mt-10">
      {/* the scene */}
      <div className="relative -mx-4 px-4 pt-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 bottom-[22%]">
          {BOKEH.map((b, i) => <span key={b} style={{ animationDelay: `${i * 1.1}s` }} className={`anim-bokeh absolute rounded-full blur-md ${b}`} />)}
        </div>
        {/* wood table + warm light pool on it */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(180deg,#6B4027_0%,#4A2B19_35%,#2A170D_100%)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] shadow-[inset_0_10px_14px_-8px_rgba(255,200,140,0.35)]"
        >
          <span className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(176deg,transparent_0_9px,rgba(0,0,0,0.35)_9px_10px,transparent_10px_23px,rgba(255,210,160,0.12)_23px_24px)]" />
          <span className="absolute inset-x-[8%] top-0 h-full bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,196,120,0.45),transparent_65%)]" />
        </div>

        {n === 3 && (
          <span aria-hidden="true" className={`pointer-events-none absolute bottom-[9%] z-[2] ${dressing.still.at}`}>
            {dressing.still.kind === 'holly' && <span className="block -rotate-[8deg]"><Holly className="anim-sway w-11" /></span>}
            {dressing.still.kind === 'ornament' && <Ornament className="anim-rock w-7" color={dressing.still.color} />}
          </span>
        )}

        {/* a character wandering along the front of the table */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-[3%] bottom-[2px] z-[4] h-20">
          <span className={`walk-x absolute bottom-0 ${dressing.walker === 'snowman' ? 'walk-slow' : ''}`} style={{ animationDelay: `${-variant * 4.3}s` }}>
            <span className="walk-face block" style={{ animationDelay: `${-variant * 4.3}s` }}>
              {dressing.walker === 'snowman'
                ? <span className="is-hopping is-alive block"><Snowman className="w-12" /></span>
                : <span className="is-walking is-alive block"><ReindeerFigure className="w-16" /></span>}
            </span>
          </span>
        </span>

        <ul className={`relative grid items-end gap-x-3 ${cols}`}>
          {items.map((item, i) => {
            const hero = n === 3 && i === 1;   // middle drink a touch forward, like a styled shot
            return (
              <li key={item.id} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className={`reveal relative flex justify-center ${hero ? 'z-[3]' : 'z-[1]'}`}>
                <div className={`relative block w-full max-w-36 ${hero ? 'translate-y-2 scale-[1.06]' : ''}`}>
                  {/* warm back-light so the cut-out sits in the light of the scene */}
                  <span aria-hidden="true" style={delay(i * 0.8)} className="anim-breathe absolute inset-x-[5%] top-[18%] bottom-[18%] rounded-full bg-[#FFC27A]/25 blur-2xl" />
                  <div style={delay(i * 0.6)} className="anim-float relative z-[2]">
                    <CupArt item={item} load={load} className="relative aspect-[2/3] w-full" />
                    {/* price tag tied to the rim, hanging down the side of the glass */}
                    <span
                      className="absolute z-[3] -translate-x-1/2 -translate-y-[3px]"
                      // capped so a wide glass's tag never reaches the next glass on narrow phones
                      style={item.rim ? { left: `${Math.min(item.rim.x, 0.76) * 100}%`, top: `${item.rim.y * 100}%` } : { left: '76%', top: '14%' }}
                    >
                      <PriceTag price={item.price} tilt={i % 2 ? -6 : 6} swingDelay={i * 0.45} />
                    </span>
                  </div>
                  {/* contact shadow (shrinks as the glass floats up) + glass reflection on the wood */}
                  <span aria-hidden="true" className="absolute bottom-[1%] left-1/2 z-[1] h-3 w-[70%] -translate-x-1/2">
                    <span style={delay(i * 0.6)} className="anim-shadow block h-full w-full rounded-[50%] bg-black/70 blur-[5px]" />
                  </span>
                  {item.image && (
                    <div aria-hidden="true" className="absolute top-full left-0 z-0 h-[22%] w-full -scale-y-100 overflow-hidden opacity-25 [mask-image:linear-gradient(to_top,black,transparent_85%)]">
                      <div className="relative aspect-[2/3] w-full -translate-y-[0%]">
                        {/* same src/sizes/quality as the photo above, so it reuses that download */}
                        <Image src={item.image} alt="" fill quality={90} sizes={PHOTO_SIZES} loading={load === 'lazy' ? 'lazy' : 'eager'} className="object-contain object-bottom blur-[1px]" />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="h-8" />
      </div>

      {/* ribbon labels + swinging price tags */}
      <ul className={`mt-3 grid items-stretch gap-x-3 ${cols}`}>
        {items.map((item, i) => (
          <li key={item.id} data-reveal style={{ transitionDelay: `${120 + i * 90}ms` }} className="reveal flex">
            <div className="flex w-full flex-col items-center gap-1.5 text-center">
              {label ? label(item, i) : <Ribbon i={i}>{item.name}</Ribbon>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Red swallow-tail ribbon carrying the drink name, tilted a hair either way. */
export function Ribbon({ i, children, className }: { i: number; children: ReactNode; className?: string }) {
  return (
    <span
      style={{ clipPath: 'polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)' }}
      className={`drink-name flex w-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#B9242D]/95 to-[#7E1520]/95 px-2 py-1.5 text-[clamp(0.84rem,3.75vw,1.15rem)] leading-[1.12] [text-wrap:balance] text-[#FFF3DC] [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] ${
        i % 2 ? 'rotate-[0.8deg]' : '-rotate-[0.8deg]'
      } ${className ?? ''}`}
    >
      {children}
    </span>
  );
}

/**
 * Price on a cream gift tag tied to the glass rim by a red cord, e.g. "50฿".
 * The tag swings from the knot; `tilt` sets its resting angle.
 */
export function PriceTag({ price, tilt = 0, swingDelay = 0 }: { price: number | null; tilt?: number; swingDelay?: number }) {
  if (price == null) return null;
  return (
    <span
      className="anim-swing flex flex-col items-center"
      style={{ ['--tilt' as string]: `${tilt}deg`, transform: `rotate(${tilt}deg)`, animationDelay: `${swingDelay}s` }}
    >
      {/* knot on the rim + cord */}
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#C2262F] shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
      <span aria-hidden="true" className="h-[clamp(1.6rem,7vw,2.4rem)] w-px bg-gradient-to-b from-[#C2262F] to-[#9E1B25]" />
      <span
        style={{ clipPath: 'polygon(22% 0, 78% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)' }}
        className="relative grid min-w-11 place-items-center bg-gradient-to-b from-[#FBF1DC] to-[#E9D6B0] px-2 pt-2.5 pb-1 leading-none text-[#7E1520] shadow-[0_3px_8px_rgba(0,0,0,0.45)]"
      >
        <span aria-hidden="true" className="absolute top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#3A2216]/70" />
        <span className="flex items-baseline whitespace-nowrap">
          <span className="font-[family-name:var(--font-display)] text-[clamp(0.95rem,4.2vw,1.15rem)] font-bold">{price}</span>
          <span className="ml-px font-[family-name:var(--font-body)] text-[0.8em] font-semibold">฿</span>
        </span>
      </span>
    </span>
  );
}

// Real photo when one exists in public/menu-photos/<slug>/, otherwise the cartoon cup.
const PHOTO_SIZES = '(max-width: 640px) 36vw, 220px';

function CupArt({ item, className, load = 'lazy' }: { item: PublicMenuItem; className?: string; load?: PhotoLoad }) {
  if (item.image) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          quality={90}
          sizes={PHOTO_SIZES}
          loading={load === 'lazy' ? 'lazy' : 'eager'}
          fetchPriority={load === 'high' ? 'high' : undefined}
          placeholder={item.blur ? 'blur' : 'empty'}
          blurDataURL={item.blur ?? undefined}
          className="object-contain object-bottom [filter:sepia(0.12)_saturate(1.08)_brightness(0.97)_drop-shadow(0_0_1.5px_rgba(255,214,160,0.55))_drop-shadow(0_10px_10px_rgba(0,0,0,0.45))]" />
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
