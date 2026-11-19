#!/usr/bin/env node
// Per-photo data for the customer menu, written to src/data/menu-image-meta.json:
// { "<image url from menu-images.json>": { "x": 0..1, "y": 0..1, "w": <px>, "h": <px>, "blur": "data:image/webp;base64,..." } }
// - x/y: where the price tag is tied, as fractions of the photo: a point on the glass rim,
//   a little in from its right edge.
// - blur: a 12px-wide copy shown (blurred) the instant the page opens, before the real photo
//   arrives on a slow connection.
// The rim is the first row (from the top) where the cut-out reaches ~its full width, so ice
// sticking up above the glass doesn't count. Run after gen-menu-images.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const IMAGES = JSON.parse(readFileSync(join(ROOT, 'src/data/menu-images.json'), 'utf8'));
const OUT = join(ROOT, 'src/data/menu-image-meta.json');

async function blurOf(file) {
  const buf = await sharp(file).resize({ width: 12 }).webp({ quality: 50, alphaQuality: 60 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function rimOf(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels } = info;
  const spans = [];
  for (let y = 0; y < H; y++) {
    let l = -1, r = -1;
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * channels + 3] > 128) { if (l < 0) l = x; r = x; }
    }
    spans.push(l < 0 ? null : [l, r]);
  }
  const maxW = Math.max(...spans.map(s => (s ? s[1] - s[0] : 0)));
  const rimY = spans.findIndex(s => s && s[1] - s[0] >= maxW * 0.85);
  if (rimY < 0) return null;
  const [l, r] = spans[rimY];
  const x = r - (r - l) * 0.16;             // on the rim, a little in from the right edge
  const y = rimY + H * 0.012;               // just below the lip so the knot sits on the glass
  return { x: +(x / W).toFixed(4), y: +(y / H).toFixed(4), w: W, h: H };
}

const out = {};
for (const folder of Object.values(IMAGES)) {
  for (const url of Object.values(folder)) {
    const file = join(ROOT, 'public', decodeURIComponent(url.split('?')[0]));
    const rim = await rimOf(file).catch(() => null);
    const blur = await blurOf(file).catch(() => null);
    if (rim) out[url] = { ...rim, blur };
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`menu image meta: ${Object.keys(out).length} photo(s) → src/data/menu-image-meta.json`);
