import type { Metadata } from 'next';
import { SHOP_NAME } from '@/lib/config';
import { getMenuPages } from '@/lib/menu-public';
import { MenuPoster } from '@/components/christmas/MenuPoster';
import { CategoryDock } from '@/components/christmas/CategoryDock';
import { GoldDivider, ReindeerHead, Snowman } from '@/components/christmas/Festive';
import { ScrollReveal } from '@/components/christmas/ScrollReveal';

// Public, read-only customer menu: every category as a poster, one after another.
// Scroll down to move through categories, or tap one in the floating bar.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `เมนู — ${SHOP_NAME}`,
  description: `เมนูเครื่องดื่มร้าน ${SHOP_NAME}`,
};

export default async function CustomerMenuPage() {
  const pages = await getMenuPages();

  return (
    <>
      <h1 className="sr-only">เมนู {SHOP_NAME}</h1>
      {pages.length === 0 && <p className="py-24 text-center text-[#F5E6C8]/70">ยังไม่มีเมนู</p>}
      {pages.map(({ category, items }, i) => (
        <MenuPoster key={category.slug} category={category} items={items} index={i} />
      ))}

      <footer className="flex flex-col items-center gap-2 px-4 pt-8 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] text-center">
        <GoldDivider className="w-full max-w-xs" />
        <div className="mt-2 flex items-end gap-3">
          <span className="is-alive block w-11"><Snowman className="w-full" /></span>
          <span className="is-alive block w-14"><ReindeerHead className="w-full" /></span>
        </div>
        <p className="font-[family-name:var(--font-script)] text-4xl text-[#F5DFB0]">Merry Christmas</p>
        <p className="text-base text-[#F5E6C8]">ขอให้มีความสุขกับเครื่องดื่มนะ</p>
        <p className="text-xs text-[#F5E6C8]/55">รูปใช้เพื่อการโฆษณา · {SHOP_NAME}</p>
      </footer>

      <ScrollReveal />
      <CategoryDock items={pages.map(p => ({ slug: p.category.slug, title: p.category.title }))} />
    </>
  );
}
