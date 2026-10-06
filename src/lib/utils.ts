import { MENU_ICONS } from './config';

export function thb(n: number | null | undefined): string {
  return '฿' + Math.ceil(Number(n ?? 0)).toLocaleString('en-US');
}

export function dateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayStr(): string {
  return dateStr(new Date());
}

export function monthStr(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
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
  return MENU_ICONS[idx % MENU_ICONS.length];
}

