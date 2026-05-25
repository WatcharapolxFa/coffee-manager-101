import { ASSET_BASE } from './config.ts';

export function thb(n: number | null | undefined): string {
  return '฿' + Math.ceil(Number(n ?? 0)).toLocaleString('en-US');
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function menuIcon(name: string, idx: number): string {
  // Tea — check before generic coffee patterns
  if (/earl\s*grey|เอิร์ลเกรย์/i.test(name))          return '🫖';
  if (/thai\s*tea|ชาไทย/i.test(name))                  return '🧋';
  if (/green\s*tea|ชาเขียว/i.test(name))               return '🍵';
  if (/matcha|มัทฉะ/i.test(name))                      return '🍵';
  if (/\btea\b|ชา/i.test(name))                        return '🫖';
  // Chocolate / cocoa
  if (/cocoa|โกโก้/i.test(name))                       return '🍫';
  if (/mocha|mocca|โมคา/i.test(name))                  return '🍫';
  if (/choc/i.test(name))                              return '🍫';
  // Coffee
  if (/espresso|เอสเปรสโซ/i.test(name))                return '☕';
  if (/americano|อเมริกาโน/i.test(name))               return '☕';
  if (/cappuccino|คาปูชิโน/i.test(name))               return '☕';
  if (/latte|ลาเต/i.test(name))                        return '☕';
  if (/coffee|กาแฟ/i.test(name))                       return '☕';
  // Fruit / smoothie
  if (/fruit|ผล|smoothie|สมูทตี้/i.test(name))         return '🍹';
  if (/taro|เผือก/i.test(name))                        return '🧋';
  // Milk-based generic
  if (/milk|นม/i.test(name))                           return '🥛';
  // Fallback
  const icons = ['☕', '🧋', '🍵', '🥤', '🍫', '🍹', '🧃', '🌿', '🫖', '🍶'];
  return icons[idx % icons.length];
}

export function channelLabel(ch: string): string {
  const base = ASSET_BASE;
  if (ch === 'delivery1') return `<span class="badge badge-delivery1"><img src="${base}assets/grab-logo.svg" style="height:14px;vertical-align:middle"></span>`;
  if (ch === 'delivery2') return `<span class="badge badge-delivery2"><img src="${base}assets/lineman-logo.svg" style="height:14px;vertical-align:middle"></span>`;
  return '<span class="badge badge-instore">หน้าร้าน</span>';
}

export function escapeHtml(s: string | number | null | undefined): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
