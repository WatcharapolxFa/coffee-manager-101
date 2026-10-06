import 'server-only';
import { prisma } from './db';
import { MENU_CATEGORIES } from './config';
import menuImages from '@/data/menu-images.json';

// Data for the public customer menu (/menu). Only fields safe to show customers leave this module.

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export interface PublicMenuItem {
  id: string;
  name: string;
  description: string;
  featured: boolean;
  price: number | null;   // store (instore) price; null = not set yet
  image: string | null;   // photo in public/menu-photos/<slug>/, if one matches the name
}

// Keep in sync with normalizeName() in scripts/gen-menu-images.mjs.
// Word order and "iced"/"hot" don't matter: "Iced-Mint-Latte" matches the menu "Latte Mint".
const IGNORED_WORDS = new Set(['iced', 'hot']);

export function normalizeName(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(/&/g, ' and ')
    .split(/[^a-z0-9฀-๿]+/).filter(w => w && !IGNORED_WORDS.has(w)).sort().join('-');
}

const IMAGES = menuImages as Record<string, Record<string, string>>;

// Look in the category's own photo folder first, then any folder (a photo filed under the
// wrong category still shows up).
function findImage(slug: string, name: string): string | null {
  const key = normalizeName(name);
  return IMAGES[slug]?.[key] ?? Object.values(IMAGES).find(folder => folder[key])?.[key] ?? null;
}

function toPublicItem(
  r: { id: string; name: string; description: string; featured: boolean; sellPrice: unknown },
  slug: string,
): PublicMenuItem {
  const instore = (r.sellPrice as { instore?: number } | null)?.instore;
  return {
    id:          r.id,
    name:        r.name,
    description: r.description,
    featured:    r.featured,
    price:       instore && instore > 0 ? instore : null,
    image:       findImage(slug, r.name),
  };
}

// Every category that has visible menus, in page order, with featured drinks first.
export async function getMenuPages(): Promise<{ category: MenuCategory; items: PublicMenuItem[] }[]> {
  const rows = await prisma.menu.findMany({
    where: { visible: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, description: true, category: true, featured: true, sellPrice: true },
  });
  return MENU_CATEGORIES
    .map(category => {
      const items = rows.filter(r => r.category === category.name).map(r => toPublicItem(r, category.slug));
      return { category, items: [...items.filter(i => i.featured), ...items.filter(i => !i.featured)] };
    })
    .filter(page => page.items.length > 0);
}
