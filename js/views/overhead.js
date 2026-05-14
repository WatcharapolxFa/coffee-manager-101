import { getMenus, getMenuById, updateMenu } from '../storage.js';
import { calcMenu } from '../calculator.js';
import { thb, menuIcon } from '../utils.js';
import { DEFAULTS } from '../config.js';

let editingAll = {};

export function renderOverhead() {
  const menus = getMenus();
  const container = document.getElementById('overhead-container');
  if (!container) return;

  if (menus.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">💰</div><p>ยังไม่มีเมนู กรุณาเพิ่มเมนูก่อน</p></div>';
    return;
  }

  menus.forEach(m => {
    if (!editingAll[m.id]) {
      editingAll[m.id] = (m.hiddenCosts ?? DEFAULTS.hiddenCosts).map(c => ({ ...c }));
    }
  });

  container.innerHTML = menus.map((m, idx) => _menuSection(m, idx)).join('');
  menus.forEach(m => _updateSummary(m.id));
}

function _menuSection(m, idx) {
  return `
  <div class="oh-menu-card card" id="oh-card-${m.id}">
    <div class="oh-menu-header">
      <span class="oh-menu-icon">${menuIcon(m.name, idx)}</span>
      <span class="oh-menu-name">${m.name}</span>
      <span class="oh-save-badge" id="oh-badge-${m.id}"></span>
    </div>

    <table class="hc-table" style="margin-bottom:8px">
      <thead><tr><th>รายการ</th><th style="text-align:right">฿/แก้ว</th><th></th></tr></thead>
      <tbody id="oh-tbody-${m.id}"></tbody>
    </table>
    <button class="btn btn-secondary btn-sm" onclick="app.addOverheadRow('${m.id}')">+ เพิ่มรายการ</button>

    <div class="oh-summary" id="oh-summary-${m.id}"></div>
  </div>`;
}

function _renderRows(menuId) {
  const tbody = document.getElementById(`oh-tbody-${menuId}`);
  if (!tbody) return;
  const costs = editingAll[menuId] ?? [];
  tbody.innerHTML = costs.map((h, i) => `
    <tr>
      <td><input class="overhead-name" type="text"
          value="${h.name || ''}" placeholder="เช่น ค่าแรง"
          onchange="app.onOverheadChange('${menuId}',${i},'name',this.value)"></td>
      <td><input class="overhead-amt" type="number"
          value="${h.amount > 0 ? h.amount : ''}" placeholder="0.00" step="0.01" min="0"
          onchange="app.onOverheadChange('${menuId}',${i},'amount',+this.value)"></td>
      <td><button class="del-btn" onclick="app.removeOverheadRow('${menuId}',${i})">✕</button></td>
    </tr>`).join('');
}

export function addOverheadRow(menuId) {
  if (!editingAll[menuId]) editingAll[menuId] = [];
  editingAll[menuId].push({ name: '', amount: 0 });
  _renderRows(menuId);
  _updateSummary(menuId);
}

export function removeOverheadRow(menuId, i) {
  editingAll[menuId].splice(i, 1);
  _renderRows(menuId);
  _updateSummary(menuId);
}

export function onOverheadChange(menuId, i, field, val) {
  if (!editingAll[menuId]) return;
  editingAll[menuId][i][field] = val;
  _updateSummary(menuId);
}

export function saveAllOverhead() {
  const menus = getMenus();
  menus.forEach(m => {
    if (editingAll[m.id]) {
      updateMenu(m.id, { ...m, hiddenCosts: editingAll[m.id].map(c => ({ ...c })) });
    }
  });
  _showSavedAll();
}

function _updateSummary(menuId) {
  _renderRows(menuId);

  const m = getMenuById(menuId);
  if (!m) return;
  const patched = { ...m, hiddenCosts: editingAll[menuId] ?? [] };
  const c = calcMenu(patched);
  const hiddenTotal = (editingAll[menuId] ?? []).reduce((s, h) => s + (Number(h.amount) || 0), 0);

  const el = document.getElementById(`oh-summary-${menuId}`);
  if (!el) return;
  el.innerHTML = `
    <div class="oh-summary-grid">
      <div class="oh-sum-row">
        <span>ต้นทุนวัตถุดิบ</span><span>${thb(c.rawCost)}</span>
      </div>
      <div class="oh-sum-row">
        <span>+ ต้นทุนแฝง</span><span>${thb(hiddenTotal)}</span>
      </div>
      <div class="oh-sum-row oh-sum-total">
        <span>รวม/แก้ว</span><span>${thb(c.baseCost)}</span>
      </div>
      <div class="oh-sum-row oh-sum-price">
        <span><img src="assets/grab-logo.svg" style="height:13px;vertical-align:middle"></span>
        <span class="fw-bold">${thb(c.c1IncVAT)}</span>
      </div>
      <div class="oh-sum-row oh-sum-price-lm">
        <span><img src="assets/lineman-logo.svg" style="height:13px;vertical-align:middle"></span>
        <span class="fw-bold">${thb(c.c2IncVAT)}</span>
      </div>
    </div>`;
}

function _showSavedAll() {
  const btn = document.getElementById('overhead-save-all-btn');
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '✅ บันทึกแล้ว';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 1800);
}
