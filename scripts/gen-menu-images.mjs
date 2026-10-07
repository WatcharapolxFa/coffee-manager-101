#!/usr/bin/env node
// Scans public/menu-photos/<category-slug>/ for drink photos and writes src/data/menu-images.json:
// { "<category-slug>": { "<normalized file name>": "/menu-photos/<slug>/<file>?v=<content hash>" } }.
// The hash changes whenever a photo is edited, so browsers and the image optimizer never show a stale one.
// Runs before `next dev` / `next build` (predev / prebuild), so dropping a photo in the folder
// and restarting is enough. File names are matched to menu names with normalizeName().
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, parse } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const MENU_DIR = join(ROOT, 'public/menu-photos');
const OUT = join(ROOT, 'src/data/menu-images.json');
const EXT = new Set(['.png', '.webp', '.jpg', '.jpeg', '.avif']);

// Keep in sync with normalizeName() in src/lib/menu-public.ts.
// Word order and "iced"/"hot"/"with" don't matter: "Iced-Mint-Latte" matches the menu "Latte Mint".
const IGNORED_WORDS = new Set(['iced', 'hot', 'with']);
const normalizeName = s => s.normalize('NFC').toLowerCase().replace(/&/g, ' and ')
  .split(/[^a-z0-9฀-๿]+/).filter(w => w && !IGNORED_WORDS.has(w)).sort().join('-');

const manifest = {};
if (existsSync(MENU_DIR)) {
  for (const slug of readdirSync(MENU_DIR)) {
    const dir = join(MENU_DIR, slug);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir)) {
      const { name, ext } = parse(file);
      if (!EXT.has(ext.toLowerCase())) continue;
      const hash = createHash('sha1').update(readFileSync(join(dir, file))).digest('hex').slice(0, 10);
      (manifest[slug] ??= {})[normalizeName(name)] = `/menu-photos/${slug}/${encodeURIComponent(file)}?v=${hash}`;
    }
  }
}
writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
const count = Object.values(manifest).reduce((n, m) => n + Object.keys(m).length, 0);
console.log(`menu images: ${count} file(s) → src/data/menu-images.json`);
