import { getLang, setLang as i18nSetLang, applyStatic } from './i18n.ts';
import { seedIfEmpty, exportData, importData, loadSeedMenus } from './storage.ts';
import { renderDashboard } from './views/dashboard.ts';
import { renderMenus, openAddMenu, openEditMenu, closeMenuModal, saveMenu,
         confirmDeleteMenu, openCostModal, closeCostModal,
         addIng, removeIng, addPkg, removePkg, updateModalCalc,
         onIngChange, onPkgChange,
         addHiddenCost, removeHiddenCost, onHiddenCostChange } from './views/menus.ts';
import { renderSales, renderPosGrid, setChannel, tapMenu, updateCartQty, updateCartPrice,
         removeFromCart, clearCart, confirmOrder, removeSaleEntry,
         onSalesDateChange } from './views/sales.ts';
import { renderOverhead, setOverheadMonth, addOverheadRow, removeOverheadRow,
         onOverheadChange, saveAllOverhead } from './views/overhead.ts';
import { renderPurchases, openAddPurchase, closePurchaseModal, savePurchase,
         removePurchaseEntry, onPurchaseDateChange } from './views/purchases.ts';
import type { Lang } from './types/index.ts';

type TabName = 'dashboard' | 'sales' | 'menus' | 'overhead' | 'purchases';

let currentTab: TabName = 'dashboard';

function navigate(tab: TabName): void {
  currentTab = tab;
  document.querySelectorAll<HTMLElement>('.nav-tab')
    .forEach(t => t.classList.toggle('active', t.dataset['tab'] === tab));
  document.querySelectorAll<HTMLElement>('.tab-panel')
    .forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));

  const renders: Record<TabName, () => void> = {
    dashboard: renderDashboard,
    sales:     renderSales,
    menus:     renderMenus,
    overhead:  renderOverhead,
    purchases: renderPurchases,
  };
  renders[tab]?.();
}

function setLang(lang: Lang): void {
  i18nSetLang(lang);
}

declare global {
  interface Window {
    app: typeof appExports;
  }
}

const appExports = {
  navigate,
  setLang,
  openAddMenu, openEditMenu, closeMenuModal,
  saveMenu: () => saveMenu(() => {
    if (currentTab === 'sales') renderPosGrid();
  }),
  confirmDeleteMenu, openCostModal, closeCostModal,
  addIng, removeIng, addPkg, removePkg,
  updateModalCalc, onIngChange, onPkgChange,
  addHiddenCost, removeHiddenCost, onHiddenCostChange,
  setOverheadMonth, addOverheadRow, removeOverheadRow, onOverheadChange, saveAllOverhead,
  setChannel, tapMenu, updateCartQty, updateCartPrice, removeFromCart,
  clearCart, confirmOrder, removeSaleEntry,
  openAddPurchase, closePurchaseModal, savePurchase, removePurchaseEntry,
  exportData,
  importData: () => (document.getElementById('import-file-input') as HTMLInputElement)?.click(),
  handleImportFile: async (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;
    if (!confirm('นำเข้าข้อมูลจะทับข้อมูลปัจจุบันทั้งหมด ยืนยันหรือไม่?')) {
      input.value = '';
      return;
    }
    try {
      await importData(file);
      input.value = '';
      alert('นำเข้าข้อมูลสำเร็จ');
      navigate(currentTab);
    } catch (err) {
      input.value = '';
      alert('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'ไม่ทราบสาเหตุ'));
    }
  },
  loadSeedMenus: () => {
    if (!confirm('โหลดเมนูจาก template จะเขียนทับเมนูที่มีชื่อซ้ำ ยืนยันหรือไม่?')) return;
    loadSeedMenus();
    renderMenus();
  },
  onSalesDateChange,
  onPurchaseDateChange,
};

window.app = appExports;

document.addEventListener('DOMContentLoaded', () => {
  seedIfEmpty();

  document.documentElement.lang = getLang();
  applyStatic();

  document.querySelectorAll<HTMLElement>('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset['tab'] as TabName));
  });

  document.getElementById('sales-date')?.addEventListener('change', onSalesDateChange);
  document.getElementById('purchase-date')?.addEventListener('change', onPurchaseDateChange);

  ['menu-vat', 'pkg-waste', 'company1-gp', 'company2-gp', 'menu-name']
    .forEach(id => document.getElementById(id)?.addEventListener('input', updateModalCalc));

  navigate('dashboard');
});

window.addEventListener('langchange', () => {
  applyStatic();
  const renders: Record<TabName, () => void> = {
    dashboard: renderDashboard,
    sales:     renderSales,
    menus:     renderMenus,
    overhead:  renderOverhead,
    purchases: renderPurchases,
  };
  renders[currentTab]?.();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js')
      .catch(err => console.warn('SW registration failed:', err));
  });
}
