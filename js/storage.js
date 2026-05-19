import { STORAGE_KEYS, DEFAULTS } from './config.js';
import { genId } from './utils.js';

export function getMenus() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.menus)) || []; }
  catch { return []; }
}

function saveMenus(menus) {
  localStorage.setItem(STORAGE_KEYS.menus, JSON.stringify(menus));
}

export function addMenu(menu) {
  const menus = getMenus();
  const newMenu = { ...menu, id: genId() };
  menus.push(newMenu);
  saveMenus(menus);
  return newMenu;
}

export function updateMenu(id, data) {
  const menus = getMenus().map(m => m.id === id ? { ...m, ...data, id } : m);
  saveMenus(menus);
}

export function deleteMenu(id) {
  saveMenus(getMenus().filter(m => m.id !== id));
}

export function getMenuById(id) {
  return getMenus().find(m => m.id === id) ?? null;
}

export function getSales() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.sales)) || []; }
  catch { return []; }
}

function saveSales(sales) {
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
}

export function addSale(sale) {
  const sales = getSales();
  const newSale = { ...sale, id: genId() };
  sales.push(newSale);
  saveSales(sales);
  return newSale;
}

export function deleteSale(id) {
  saveSales(getSales().filter(s => s.id !== id));
}

export function getSalesByDate(dateStr) {
  return getSales().filter(s => s.date === dateStr);
}

export function getSalesByMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getSales().filter(s => s.date.startsWith(prefix));
}

export function getPurchases() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.purchases)) || []; }
  catch { return []; }
}

function savePurchases(items) {
  localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(items));
}

export function addPurchase(purchase) {
  const items = getPurchases();
  const newItem = { ...purchase, id: genId() };
  items.push(newItem);
  savePurchases(items);
  return newItem;
}

export function deletePurchase(id) {
  savePurchases(getPurchases().filter(p => p.id !== id));
}

export function getPurchasesByDate(dateStr) {
  return getPurchases().filter(p => p.date === dateStr);
}

export function getPurchasesByMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return getPurchases().filter(p => p.date.startsWith(prefix));
}

export function getMonthlyOverhead(year, month) {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.monthlyOverhead)) || {};
    return all[key] || [];
  } catch { return []; }
}

export function saveMonthlyOverhead(year, month, items) {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.monthlyOverhead)) || {};
    all[key] = items;
    localStorage.setItem(STORAGE_KEYS.monthlyOverhead, JSON.stringify(all));
  } catch {}
}

export function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    menus:           getMenus(),
    sales:           getSales(),
    purchases:       getPurchases(),
    monthlyOverhead: JSON.parse(localStorage.getItem(STORAGE_KEYS.monthlyOverhead) || '{}'),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `coffee-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.menus || !data.sales || !data.purchases) {
          throw new Error('ไฟล์ไม่ถูกต้อง');
        }
        localStorage.setItem(STORAGE_KEYS.menus,     JSON.stringify(data.menus));
        localStorage.setItem(STORAGE_KEYS.sales,     JSON.stringify(data.sales));
        localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(data.purchases));
        if (data.monthlyOverhead) {
          localStorage.setItem(STORAGE_KEYS.monthlyOverhead, JSON.stringify(data.monthlyOverhead));
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('อ่านไฟล์ไม่ได้'));
    reader.readAsText(file);
  });
}

export function seedIfEmpty() {
  if (getMenus().length > 0) return;
  addMenu({
    name: 'Iced Cafe Latte',
    ingredients: [
      { name: 'เมล็ดกาแฟคั่วเข้ม (Dark Roasted)', totalQty: 1000, totalPrice: 550, usedQty: 17 },
      { name: 'นมสด',      totalQty: 2000, totalPrice: 99.75, usedQty: 150 },
      { name: 'แก้ว',      totalQty: 1,    totalPrice: 1,     usedQty: 1 },
      { name: 'หลอด',      totalQty: 200,  totalPrice: 48,    usedQty: 1 },
      { name: 'ฝาเรียบ',   totalQty: 1,    totalPrice: 1,     usedQty: 1 },
      { name: 'น้ำแข็ง',  totalQty: 1,    totalPrice: 1,     usedQty: 1 },
      { name: 'สติ๊กเกอร์', totalQty: 1,   totalPrice: 1,     usedQty: 1 },
      { name: 'น้ำเชื่อม', totalQty: 1000, totalPrice: 30,    usedQty: 15 },
    ],
    hiddenCosts:    DEFAULTS.hiddenCosts.map(c => ({ ...c })),
    vat:            DEFAULTS.vat,
    packaging: [
      { name: 'ขวดเครื่องดื่ม',    totalQty: 50,  totalPrice: 60, usedQty: 1 },
      { name: 'กระดาษปิดปากแก้ว', totalQty: 200, totalPrice: 65, usedQty: 1 },
    ],
    packagingWaste: DEFAULTS.packagingWaste,
    company1GP:     DEFAULTS.company1GP,
    company2GP:     DEFAULTS.company2GP,
  });
}
