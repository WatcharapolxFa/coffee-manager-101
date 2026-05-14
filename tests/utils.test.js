import { describe, it, expect } from 'vitest';
import { thb, todayStr, daysInMonth, genId, menuIcon } from '../js/utils.js';

describe('thb', () => {
  it('formats zero', ()        => expect(thb(0)).toBe('฿0.00'));
  it('formats integers', ()    => expect(thb(100)).toBe('฿100.00'));
  it('formats decimals', ()    => expect(thb(9.5)).toBe('฿9.50'));
  it('adds thousands comma', ()=> expect(thb(1234.5)).toBe('฿1,234.50'));
  it('handles null/undefined',()=> expect(thb(null)).toBe('฿0.00'));
  it('handles large numbers', ()=> expect(thb(1000000)).toBe('฿1,000,000.00'));
});

describe('todayStr', () => {
  it('returns YYYY-MM-DD format', () => {
    expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('matches current local date', () => {
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(todayStr()).toBe(expected);
  });
});

describe('daysInMonth', () => {
  it('returns 31 for January',         () => expect(daysInMonth(2024, 1)).toBe(31));
  it('returns 28 for Feb in non-leap', () => expect(daysInMonth(2023, 2)).toBe(28));
  it('returns 29 for Feb in leap year',() => expect(daysInMonth(2024, 2)).toBe(29));
  it('returns 30 for April',           () => expect(daysInMonth(2024, 4)).toBe(30));
  it('returns 31 for December',        () => expect(daysInMonth(2024, 12)).toBe(31));
});

describe('genId', () => {
  it('returns a non-empty string', () => {
    expect(typeof genId()).toBe('string');
    expect(genId().length).toBeGreaterThan(0);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, genId));
    expect(ids.size).toBe(100);
  });
});

describe('menuIcon', () => {
  it('returns ☕ for latte',   () => expect(menuIcon('latte', 0)).toBe('☕'));
  it('returns ☕ for ลาเต',   () => expect(menuIcon('ลาเต้', 0)).toBe('☕'));
  it('returns 🍵 for matcha', () => expect(menuIcon('Matcha Green', 0)).toBe('🍵'));
  it('returns 🍫 for choc',   () => expect(menuIcon('Hot Chocolate', 0)).toBe('🍫'));
  it('returns 🧋 for taro',   () => expect(menuIcon('Taro Milk', 0)).toBe('🧋'));
  it('returns 🍹 for fruit',  () => expect(menuIcon('Fruit Punch', 0)).toBe('🍹'));
  it('falls back to icon array by index', () => {
    const icons = ['☕','🧋','🍵','🥤','🍫','🍹','🧃','🌿','🫖','🍶'];
    expect(menuIcon('Unknown Drink', 3)).toBe(icons[3]);
  });
  it('wraps icon index with modulo', () => {
    const icons = ['☕','🧋','🍵','🥤','🍫','🍹','🧃','🌿','🫖','🍶'];
    expect(menuIcon('Unknown', 10)).toBe(icons[0]);
    expect(menuIcon('Unknown', 11)).toBe(icons[1]);
  });
});
