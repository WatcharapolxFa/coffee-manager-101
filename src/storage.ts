import { STORAGE_KEYS } from './config.ts';
import { genId } from './utils.ts';
import { SEED_MENUS } from './data/menus-seed.ts';
import type { Menu, MenuInput, Sale, Purchase, OverheadItem, StorageExport } from './types/index.ts';

export function getMenus(): Menu[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.menus) ?? 'null') || []; }
  catch { return []; }
}

function saveMenus(menus: Menu[]): void {
  localStorage.setItem(STORAGE_KEYS.menus, JSON.stringify(menus));
}

export function addMenu(menu: MenuInput): Menu {
  const menus = getMenus();
  const newMenu = { ...menu, id: genId() } as Menu;
  menus.push(newMenu);
  saveMenus(menus);
  return newMenu;
}

export function updateMenu(id: string, data: Partial<MenuInput>): void {
  const menus = getMenus().map(m => m.id === id ? { ...m, ...data, id } : m);
  saveMenus(menus);
}

export function deleteMenu(id: string): void {
  saveMenus(getMenus().filter(m => m.id !== id));
}

export function getMenuById(id: string): Menu | null {
  return getMenus().find(m => m.id === id) ?? null;
}

export function getSales(): Sale[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.sales) ?? 'null') || []; }
  catch { return []; }
}

function saveSales(sales: Sale[]): void {
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
}

export function addSale(sale: Omit<Sale, 'id'>): Sale {
  const sales = getSales();
  const newSale = { ...sale, id: genId() };
  sales.push(newSale);
  saveSales(sales);
  return newSale;
}

export function deleteSale(id: string): void {
  saveSales(getSales().filter(s => s.id !== id));
}

export function getSalesByDate(dateStr: string): Sale[] {
  return getSales().filter(s => s.date === dateStr);
}

export function getSalesByMonth(year: number, month: number): Sale[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getSales().filter(s => s.date.startsWith(prefix));
}

export function getPurchases(): Purchase[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.purchases) ?? 'null') || []; }
  catch { return []; }
}

function savePurchases(items: Purchase[]): void {
  localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(items));
}

export function addPurchase(purchase: Omit<Purchase, 'id'>): Purchase {
  const items = getPurchases();
  const newItem = { ...purchase, id: genId() };
  items.push(newItem);
  savePurchases(items);
  return newItem;
}

export function deletePurchase(id: string): void {
  savePurchases(getPurchases().filter(p => p.id !== id));
}

export function getPurchasesByDate(dateStr: string): Purchase[] {
  return getPurchases().filter(p => p.date === dateStr);
}

export function getPurchasesByMonth(year: number, month: number): Purchase[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getPurchases().filter(p => p.date.startsWith(prefix));
}

export function getMonthlyOverhead(year: number, month: number): OverheadItem[] {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  try {
    const all: Record<string, OverheadItem[]> = JSON.parse(localStorage.getItem(STORAGE_KEYS.monthlyOverhead) ?? 'null') || {};
    return all[key] || [];
  } catch { return []; }
}

export function saveMonthlyOverhead(year: number, month: number, items: OverheadItem[]): void {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  try {
    const all: Record<string, OverheadItem[]> = JSON.parse(localStorage.getItem(STORAGE_KEYS.monthlyOverhead) ?? 'null') || {};
    all[key] = items;
    localStorage.setItem(STORAGE_KEYS.monthlyOverhead, JSON.stringify(all));
  } catch { /* storage full — silent */ }
}

export function exportData(): void {
  const data: StorageExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    menus:           getMenus(),
    sales:           getSales(),
    purchases:       getPurchases(),
    monthlyOverhead: JSON.parse(localStorage.getItem(STORAGE_KEYS.monthlyOverhead) ?? '{}'),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `coffee-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<StorageExport> {
  if (file.size > 5 * 1024 * 1024) {
    return Promise.reject(new Error('ไฟล์ใหญ่เกิน 5 MB'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const raw = (e.target as FileReader).result as string;
        const data = JSON.parse(raw) as Record<string, unknown>;
        if (!Array.isArray(data['menus']) || !Array.isArray(data['sales']) || !Array.isArray(data['purchases'])) {
          throw new Error('ไฟล์ไม่ถูกต้อง');
        }
        localStorage.setItem(STORAGE_KEYS.menus,     JSON.stringify(data['menus']));
        localStorage.setItem(STORAGE_KEYS.sales,     JSON.stringify(data['sales']));
        localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(data['purchases']));
        if (data['monthlyOverhead'] && typeof data['monthlyOverhead'] === 'object') {
          localStorage.setItem(STORAGE_KEYS.monthlyOverhead, JSON.stringify(data['monthlyOverhead']));
        }
        resolve(data as unknown as StorageExport);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('อ่านไฟล์ไม่ได้'));
      }
    };
    reader.onerror = () => reject(new Error('อ่านไฟล์ไม่ได้'));
    reader.readAsText(file);
  });
}

export function seedIfEmpty(): void {
  if (getMenus().length > 0) return;
  SEED_MENUS.forEach(m => addMenu({ ...m }));
}

export function loadSeedMenus(): void {
  const existing = getMenus();
  const seedNames = new Set(SEED_MENUS.map(s => s.name));
  const nonSeedMenus = existing.filter(m => !seedNames.has(m.name));
  const seedMenus: Menu[] = SEED_MENUS.map(seed => {
    const match = existing.find(m => m.name === seed.name);
    return match
      ? { ...match, ...seed, id: match.id }
      : { ...seed, id: genId() } as Menu;
  });
  saveMenus([...nonSeedMenus, ...seedMenus]);
}
