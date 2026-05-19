import { getLang, setLang as i18nSetLang, applyStatic } from './i18n.js';
import { seedIfEmpty, exportData, importData, loadSeedMenus } from './storage.js';
import { renderDashboard }  from './views/dashboard.js';
import { renderMenus, openAddMenu, openEditMenu, closeMenuModal, saveMenu,
         confirmDeleteMenu, openCostModal, closeCostModal,
         addIng, removeIng, addPkg, removePkg, updateModalCalc,
         onIngChange, onPkgChange,
         addHiddenCost, removeHiddenCost, onHiddenCostChange } from './views/menus.js';
import { renderSales, renderPosGrid, setChannel, tapMenu, updateCartQty,
         removeFromCart, clearCart, confirmOrder, removeSaleEntry,
         onSalesDateChange } from './views/sales.js';
import { renderOverhead, setOverheadMonth, addOverheadRow, removeOverheadRow,
         onOverheadChange, saveAllOverhead } from './views/overhead.js';
import { renderPurchases, openAddPurchase, closePurchaseModal, savePurchase,
         removePurchaseEntry, onPurchaseDateChange } from './views/purchases.js';

let currentTab = 'dashboard';

function navigate(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-tab')
    .forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-panel')
    .forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));

  const renders = {
    dashboard: renderDashboard,
    sales:     renderSales,
    menus:     renderMenus,
    overhead:  renderOverhead,
    purchases: renderPurchases,
  };
  renders[tab]?.();
}

function setLang(lang) {
  i18nSetLang(lang);
}

window.app = {
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
  setChannel, tapMenu, updateCartQty, removeFromCart,
  clearCart, confirmOrder, removeSaleEntry,
  openAddPurchase, closePurchaseModal, savePurchase, removePurchaseEntry,
  exportData,
  importData: () => document.getElementById('import-file-input').click(),
  handleImportFile: async (input) => {
    const file = input.files[0];
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
      alert('เกิดข้อผิดพลาด: ' + err.message);
    }
  },
  loadSeedMenus: () => {
    if (!confirm('โหลดเมนูจาก template จะเขียนทับเมนูที่มีชื่อซ้ำ ยืนยันหรือไม่?')) return;
    loadSeedMenus();
    renderMenus();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  seedIfEmpty();

  document.documentElement.lang = getLang();
  applyStatic();

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.tab));
  });

  document.getElementById('sales-date')?.addEventListener('change', onSalesDateChange);
  document.getElementById('purchase-date')?.addEventListener('change', onPurchaseDateChange);

  ['menu-vat', 'pkg-waste', 'company1-gp', 'company2-gp', 'menu-name']
    .forEach(id => document.getElementById(id)?.addEventListener('input', updateModalCalc));

  navigate('dashboard');
});

window.addEventListener('langchange', () => {
  applyStatic();
  const renders = {
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
    navigator.serviceWorker.register('/sw.js')
      .catch(err => console.warn('SW registration failed:', err));
  });
}
