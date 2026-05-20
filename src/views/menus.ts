import { getMenus, getMenuById, addMenu, updateMenu, deleteMenu } from '../storage.ts';
import { calcMenu } from '../calculator.ts';
import { thb, menuIcon, escapeHtml } from '../utils.ts';
import { DEFAULTS, ASSET_BASE } from '../config.ts';
import { t } from '../i18n.ts';
import type { Ingredient, HiddenCost } from '../types/index.ts';

let editingMenuId    = '';
let modalIngredients: Ingredient[] = [];
let modalPackaging:   Ingredient[] = [];
let modalHiddenCosts: HiddenCost[] = [];

export function renderMenus(): void {
  const menus = getMenus();
  const grid  = document.getElementById('menu-grid');
  if (!grid) return;

  if (menus.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">☕</div><p>${t('menus.no_menus')}</p></div>`;
    return;
  }

  grid.innerHTML = menus.map((m, i) => {
    const c    = calcMenu(m);
    const icon = menuIcon(m.name, i);
    return `<div class="menu-card">
      <div class="menu-card-icon">${icon}</div>
      <div style="flex:1;min-width:0">
        <div class="menu-card-name">${escapeHtml(m.name)}</div>
        <div class="menu-card-cost-row">
          <span class="menu-card-cost-label">🧾 ต้นทุน / แก้ว</span>
          <span class="menu-card-price">${thb(c.totalDeliveryCost)}</span>
        </div>
      </div>
      <div class="menu-card-actions">
        <button class="icon-btn" onclick="app.openCostModal('${m.id}')" title="${t('menus.cost_title')}">🧮</button>
        <button class="icon-btn" onclick="app.openEditMenu('${m.id}')">✏️</button>
        <button class="icon-btn" onclick="app.confirmDeleteMenu('${m.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

export function confirmDeleteMenu(id: string): void {
  const m = getMenuById(id);
  if (!m) return;
  if (confirm(t('menus.confirm_delete', { name: m.name }))) {
    deleteMenu(id);
    renderMenus();
  }
}

export function openAddMenu(): void {
  editingMenuId    = '';
  modalIngredients = [_emptyRow()];
  modalPackaging   = [_emptyRow()];
  modalHiddenCosts = DEFAULTS.hiddenCosts.map(c => ({ ...c }));
  _fillModalFields(null);
  _openModal();
}

export function openEditMenu(id: string): void {
  const m = getMenuById(id);
  if (!m) return;
  editingMenuId    = id;
  modalIngredients = m.ingredients.length ? m.ingredients.map(r => ({ ...r })) : [_emptyRow()];
  modalPackaging   = (m.packaging ?? []).length ? m.packaging.map(r => ({ ...r })) : [_emptyRow()];
  modalHiddenCosts = (m.hiddenCosts ?? DEFAULTS.hiddenCosts).map(c => ({ ...c }));
  _fillModalFields(m);
  _openModal();
}

export function closeMenuModal(): void {
  document.getElementById('menu-modal')?.classList.remove('open');
}

export function saveMenu(onSaved?: () => void): void {
  const m = _collectModalData();
  if (!m.name) { alert(t('menus.required_name')); return; }
  editingMenuId ? updateMenu(editingMenuId, m) : addMenu(m);
  closeMenuModal();
  renderMenus();
  onSaved?.();
}

export function addIng(): void {
  modalIngredients.push(_emptyRow());
  _renderIngTable();
}

export function removeIng(i: number): void {
  modalIngredients.splice(i, 1);
  if (!modalIngredients.length) modalIngredients.push(_emptyRow());
  _renderIngTable();
  updateModalCalc();
}

export function addPkg(): void {
  modalPackaging.push(_emptyRow());
  _renderPkgTable();
}

export function removePkg(i: number): void {
  modalPackaging.splice(i, 1);
  if (!modalPackaging.length) modalPackaging.push(_emptyRow());
  _renderPkgTable();
  updateModalCalc();
}

export function updateModalCalc(): void {
  const m = _collectModalData();
  const c = calcMenu(m);
  const base = ASSET_BASE;
  const el = document.getElementById('modal-calc');
  if (!el) return;
  el.innerHTML = `
    <div class="calc-line"><span>${t('menus.raw_cost')}</span><span class="cost-val">${thb(c.rawCost)}</span></div>
    <div class="calc-line"><span>${t('menus.hidden_total')}</span><span class="cost-val">${thb(c.hiddenTotal)}</span></div>
    <div class="calc-line total-line"><span>${t('menus.base_cost')}</span><span class="cost-val">${thb(c.baseCost)}</span></div>
    <div class="calc-line"><span>🏪 หน้าร้าน</span><span class="cost-val">${thb(c.instorePrice)}</span></div>
    <div class="calc-line"><span><img src="${base}assets/grab-logo.svg" style="height:12px;vertical-align:middle"> (×${m.company1GP})</span><span class="cost-val">${thb(c.c1IncVAT)}</span></div>
    <div class="calc-line"><span><img src="${base}assets/lineman-logo.svg" style="height:12px;vertical-align:middle"> (×${m.company2GP})</span><span class="cost-val">${thb(c.c2IncVAT)}</span></div>`;
  _renderHiddenCostTotal(c.hiddenTotal);
}

function _renderHiddenCostTotal(total: number): void {
  const el = document.getElementById('hidden-cost-total');
  if (el) el.textContent = thb(total);
}

export function openCostModal(menuId: string): void {
  const m = getMenuById(menuId);
  if (!m) return;
  const c = calcMenu(m);
  const base = ASSET_BASE;

  const titleEl = document.getElementById('cost-modal-title');
  if (titleEl) titleEl.textContent = `${t('menus.cost_title')} — ${m.name}`;

  const bodyEl = document.getElementById('cost-modal-body');
  if (bodyEl) bodyEl.innerHTML = `
    <div class="cost-section">
      <div class="cost-row indent"><span>${t('menus.raw_cost')}</span><span class="cost-val">${thb(c.rawCost)}</span></div>
      ${(m.hiddenCosts ?? []).filter(h => h.amount > 0).map(h =>
        `<div class="cost-row indent"><span>+ ${escapeHtml(h.name)}</span><span class="cost-val">${thb(h.amount)}</span></div>`
      ).join('')}
      <div class="cost-row total"><span>${t('menus.base_cost')}</span><span class="cost-val">${thb(c.baseCost)}</span></div>
      <hr class="divider">
      <div class="cost-row indent"><span>${t('menus.pkg_waste_label')} ${m.packagingWaste}%</span><span class="cost-val">${thb(c.packagingWithWaste)}</span></div>
      <div class="cost-row total"><span>${t('menus.delivery_cost')}</span><span class="cost-val">${thb(c.totalDeliveryCost)}</span></div>
      <hr class="divider">
      <div class="cost-row delivery" style="background:var(--surface-2);border-color:var(--line)">
        <span>🏪 หน้าร้าน</span>
        <span class="cost-val fw-bold" style="font-size:17px">${thb(c.instorePrice)}</span>
      </div>
      <div class="cost-row delivery" style="margin-top:6px">
        <span><img src="${base}assets/grab-logo.svg" style="height:18px;vertical-align:middle;margin-right:6px">
        (×${m.company1GP})<br><small class="text-sm">${t('menus.pre_vat')}: ${thb(c.c1ExVAT)}</small></span>
        <span class="cost-val fw-bold" style="font-size:17px">${thb(c.c1IncVAT)}</span>
      </div>
      <div class="cost-row delivery" style="margin-top:6px;background:#FFFDE7;border-color:#FFF176">
        <span><img src="${base}assets/lineman-logo.svg" style="height:18px;vertical-align:middle;margin-right:6px">
        (×${m.company2GP})<br><small class="text-sm">${t('menus.pre_vat')}: ${thb(c.c2ExVAT)}</small></span>
        <span class="cost-val fw-bold" style="font-size:17px">${thb(c.c2IncVAT)}</span>
      </div>
    </div>
    <hr class="divider" style="margin:14px 0">
    <div class="card-title" style="margin-bottom:8px">${t('menus.ing_detail')}</div>
    <table class="data-table">
      <thead><tr>
        <th>${t('menus.col_num')}</th>
        <th>${t('menus.col_ing')}</th>
        <th class="text-right">${t('menus.col_used_total')}</th>
        <th class="text-right">${t('menus.col_cost')}</th>
      </tr></thead>
      <tbody>
        ${m.ingredients.filter(i => i.name).map((ing, idx) => {
          const tq = Number(ing.totalQty);
          const tp = Number(ing.totalPrice);
          const uq = Number(ing.usedQty);
          const cost = tq ? tp * (uq / tq) : 0;
          return `<tr><td>${idx + 1}</td><td>${escapeHtml(ing.name)}</td>
            <td class="text-right">${uq}/${tq}</td>
            <td class="text-right">${thb(cost)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>`;

  const editBtn = document.getElementById('cost-modal-edit-btn');
  if (editBtn) editBtn.onclick = () => { closeCostModal(); openEditMenu(menuId); };
  document.getElementById('cost-modal')?.classList.add('open');
}

export function closeCostModal(): void {
  document.getElementById('cost-modal')?.classList.remove('open');
}

function _emptyRow(): Ingredient {
  return { name: '', totalQty: '', totalPrice: '', usedQty: '' };
}

function _openModal(): void {
  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = editingMenuId ? t('menus.edit_title') : t('menus.add_new');
  _renderIngTable();
  _renderPkgTable();
  updateModalCalc();
  document.getElementById('menu-modal')?.classList.add('open');
}

function _fillModalFields(m: ReturnType<typeof getMenuById>): void {
  (document.getElementById('menu-name')    as HTMLInputElement).value = m?.name           ?? '';
  (document.getElementById('menu-vat')     as HTMLInputElement).value = String(m?.vat            ?? DEFAULTS.vat);
  (document.getElementById('pkg-waste')    as HTMLInputElement).value = String(m?.packagingWaste ?? DEFAULTS.packagingWaste);
  (document.getElementById('company1-gp') as HTMLInputElement).value = String(m?.company1GP     ?? DEFAULTS.company1GP);
  (document.getElementById('company2-gp') as HTMLInputElement).value = String(m?.company2GP     ?? DEFAULTS.company2GP);
  _renderHiddenCostTable();
}

function _collectModalData() {
  return {
    name:           (document.getElementById('menu-name')    as HTMLInputElement).value.trim() || 'เมนูใหม่',
    ingredients:    modalIngredients.filter(r => r.name || r.totalQty),
    hiddenCosts:    modalHiddenCosts.map(c => ({ ...c })),
    vat:            +(document.getElementById('menu-vat')     as HTMLInputElement).value    || DEFAULTS.vat,
    packaging:      modalPackaging.filter(r => r.name || r.totalQty),
    packagingWaste: +(document.getElementById('pkg-waste')    as HTMLInputElement).value    || DEFAULTS.packagingWaste,
    company1GP:     +(document.getElementById('company1-gp') as HTMLInputElement).value    || DEFAULTS.company1GP,
    company2GP:     +(document.getElementById('company2-gp') as HTMLInputElement).value    || DEFAULTS.company2GP,
  };
}

function _renderIngTable(): void {
  const tbody = document.getElementById('ing-tbody');
  if (!tbody) return;
  tbody.innerHTML = modalIngredients.map((ing, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><input type="text"   value="${escapeHtml(ing.name || '')}" placeholder="${t('menus.ing_ph')}" onchange="app.onIngChange(${i},'name',this.value)"></td>
      <td><input type="number" value="${ing.totalQty  || ''}" placeholder="0" onchange="app.onIngChange(${i},'totalQty',+this.value)"></td>
      <td><input type="number" value="${ing.totalPrice || ''}" placeholder="0" onchange="app.onIngChange(${i},'totalPrice',+this.value)"></td>
      <td><input type="number" value="${ing.usedQty   || ''}" placeholder="0" onchange="app.onIngChange(${i},'usedQty',+this.value)"></td>
      <td><button class="del-btn" onclick="app.removeIng(${i})">✕</button></td>
    </tr>`).join('');
}

function _renderPkgTable(): void {
  const tbody = document.getElementById('pkg-tbody');
  if (!tbody) return;
  tbody.innerHTML = modalPackaging.map((pkg, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><input type="text"   value="${escapeHtml(pkg.name || '')}" placeholder="${t('menus.pkg_ph')}" onchange="app.onPkgChange(${i},'name',this.value)"></td>
      <td><input type="number" value="${pkg.totalQty  || ''}" placeholder="0" onchange="app.onPkgChange(${i},'totalQty',+this.value)"></td>
      <td><input type="number" value="${pkg.totalPrice || ''}" placeholder="0" onchange="app.onPkgChange(${i},'totalPrice',+this.value)"></td>
      <td><input type="number" value="${pkg.usedQty   || ''}" placeholder="0" onchange="app.onPkgChange(${i},'usedQty',+this.value)"></td>
      <td><button class="del-btn" onclick="app.removePkg(${i})">✕</button></td>
    </tr>`).join('');
}

function _renderHiddenCostTable(): void {
  const tbody = document.getElementById('hidden-cost-tbody');
  if (!tbody) return;
  tbody.innerHTML = modalHiddenCosts.map((h, i) => `
    <tr>
      <td><input type="text"   class="hc-name"   value="${escapeHtml(h.name || '')}" placeholder="${t('overhead.cost_ph')}"
                 onchange="app.onHiddenCostChange(${i},'name',this.value)"></td>
      <td><input type="number" class="hc-amount" value="${h.amount > 0 ? h.amount : ''}" placeholder="0.00" step="0.01" min="0"
                 onchange="app.onHiddenCostChange(${i},'amount',+this.value)"></td>
      <td><button class="del-btn" onclick="app.removeHiddenCost(${i})">✕</button></td>
    </tr>`).join('');
}

export function addHiddenCost(): void {
  modalHiddenCosts.push({ name: '', amount: 0 });
  _renderHiddenCostTable();
  updateModalCalc();
}

export function removeHiddenCost(i: number): void {
  modalHiddenCosts.splice(i, 1);
  _renderHiddenCostTable();
  updateModalCalc();
}

export function onIngChange(i: number, field: keyof Ingredient, val: string | number): void {
  modalIngredients[i] = { ...modalIngredients[i], [field]: val };
  updateModalCalc();
}

export function onPkgChange(i: number, field: keyof Ingredient, val: string | number): void {
  modalPackaging[i] = { ...modalPackaging[i], [field]: val };
  updateModalCalc();
}

export function onHiddenCostChange(i: number, field: keyof HiddenCost, val: string | number): void {
  modalHiddenCosts[i] = { ...modalHiddenCosts[i], [field]: val } as HiddenCost;
  updateModalCalc();
}
