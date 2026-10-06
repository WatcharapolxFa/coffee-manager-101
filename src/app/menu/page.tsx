import type { Metadata } from 'next';
import { SHOP_NAME } from '@/lib/config';
import { getMenuPages } from '@/lib/menu-public';
import { MenuPoster, type HeroStyle } from '@/components/halloween/MenuPoster';
import { CategoryDock } from '@/components/halloween/CategoryDock';
import { CandyCorn, Pumpkin } from '@/components/halloween/Spooky';

// Public, read-only customer menu: every category as a poster, one after another.
// Scroll down to move through categories, or tap one in the floating bar.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `เมนู — ${SHOP_NAME}`,
  description: `เมนูเครื่องดื่มร้าน ${SHOP_NAME}`,
};

export default async function CustomerMenuPage({ searchParams }: PageProps<'/menu'>) {
  // TEMP: ?v=halo|card|hill to compare cup styles; remove once one is chosen.
  const v = (await searchParams).v;
  const heroStyle: HeroStyle = v === 'card' || v === 'hill' ? v : 'halo';
  const pages = await getMenuPages();

  return (
    <>
      <h1 className="sr-only">เมนู {SHOP_NAME}</h1>
      {pages.length === 0 && <p className="py-24 text-center text-[#FFF1C9]/70">ยังไม่มีเมนู</p>}
      {pages.map(({ category, items }, i) => (
        <MenuPoster key={category.slug} category={category} items={items} first={i === 0} heroStyle={heroStyle} />
      ))}

      <footer className="flex flex-col items-center gap-2 px-4 pt-8 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] text-center">
        <div className="flex items-end gap-3">
          <CandyCorn className="size-7 -rotate-12" />
          <Pumpkin className="size-10" />
          <CandyCorn className="size-7 rotate-12" />
        </div>
        <p className="text-sm font-semibold text-[#FFE3C2]">Happy Halloween! ขอให้สนุกกับเครื่องดื่มนะ</p>
        <p className="text-[11px] text-[#FFF1C9]/50">รูปใช้เพื่อการโฆษณา · {SHOP_NAME}</p>
      </footer>

      <CategoryDock items={pages.map(p => ({ slug: p.category.slug, title: p.category.title }))} />
    </>
  );
}
