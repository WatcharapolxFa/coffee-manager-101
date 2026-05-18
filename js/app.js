import { getLang, setLang as i18nSetLang, applyStatic } from './i18n.js';
import { seedIfEmpty } from './storage.js';
import { renderDashboard }  from './views/dashboard.js';
import { renderMenus, openAddMenu, openEditMenu, closeMenuModal, saveMenu,
         confirmDeleteMenu, openCostModal, closeCostModal,
         addIng, removeIng, addPkg, removePkg, updateModalCalc,
         onIngChange, onPkgChange,
         addHiddenCost, removeHiddenCost, onHiddenCostChange } from './views/menus.js';
import { renderSales, renderPosGrid, setChannel, tapMenu, updateCartQty,
         removeFromCart, clearCart, confirmOrder, removeSaleEntry,
         onSalesDateChange } from './views/sales.js';
import { renderReport, showReport } from './views/report.js';
import { renderOverhead, addOverheadRow, removeOverheadRow,
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
    report:    renderReport,
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
  addOverheadRow, removeOverheadRow, onOverheadChange, saveAllOverhead,
  setChannel, tapMenu, updateCartQty, removeFromCart,
  clearCart, confirmOrder, removeSaleEntry,
  openAddPurchase, closePurchaseModal, savePurchase, removePurchaseEntry,
};

document.addEventListener('DOMContentLoaded', () => {
  seedIfEmpty();

  // Apply saved language on load
  document.documentElement.lang = getLang();
  applyStatic();

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.tab));
  });

  document.getElementById('sales-date')?.addEventListener('change', onSalesDateChange);
  document.getElementById('purchase-date')?.addEventListener('change', onPurchaseDateChange);

  ['menu-vat', 'pkg-waste', 'company1-gp', 'company2-gp', 'menu-name']
    .forEach(id => document.getElementById(id)?.addEventListener('input', updateModalCalc));

  document.getElementById('report-year')?.addEventListener('change', showReport);
  document.getElementById('report-month')?.addEventListener('change', showReport);

  const yearSel = document.getElementById('report-year');
  if (yearSel) {
    const y = new Date().getFullYear();
    yearSel.innerHTML = [y - 1, y, y + 1]
      .map(yr => `<option value="${yr}" ${yr === y ? 'selected' : ''}>${yr}</option>`)
      .join('');
  }

  navigate('dashboard');
});

// Re-render current tab when language changes
window.addEventListener('langchange', () => {
  applyStatic();
  const renders = {
    dashboard: renderDashboard,
    sales:     renderSales,
    menus:     renderMenus,
    overhead:  renderOverhead,
    report:    renderReport,
    purchases: renderPurchases,
  };
  renders[currentTab]?.();
});

// PWA: Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(err => console.warn('SW registration failed:', err));
  });
}
