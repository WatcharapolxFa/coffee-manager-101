import { addPurchase, deletePurchase, getPurchasesByDate } from '../storage.js';
import { todayStr, thb } from '../utils.js';
import { t } from '../i18n.js';

const UNITS = ['g', 'kg', 'ml', 'L', 'ชิ้น', 'ถุง', 'กล่อง', 'แพ็ค', 'อื่นๆ'];

export function renderPurchases() {
  const dateEl = document.getElementById('purchase-date');
  if (!dateEl.value) dateEl.value = todayStr();
  renderPurchaseHistory();
}

export function renderPurchaseHistory() {
  const date   = document.getElementById('purchase-date')?.value || todayStr();
  const items  = getPurchasesByDate(date);
  const listEl = document.getElementById('purchase-history-list');
  const totalEl = document.getElementById('purchase-day-total');
  if (!listEl) return;

  if (items.length === 0) {
    listEl.innerHTML = `<div class="text-sm text-center" style="padding:16px;color:var(--text-light)">${t('purchase.no_items')}</div>`;
    if (totalEl) totalEl.textContent = '฿0.00';
    return;
  }

  const totalSpend = items.reduce((s, p) => s + p.totalPrice, 0);
  listEl.innerHTML = items.map(p => `
    <div class="history-item">
      <div class="history-item-left">
        <div class="history-item-name">🛒 ${p.name}</div>
        <div class="history-item-sub">${p.qty} ${p.unit}${p.note ? ' · ' + p.note : ''}</div>
      </div>
      <div class="history-item-right">
        <div class="history-item-rev" style="color:var(--danger)">${thb(p.totalPrice)}</div>
        <button class="btn btn-danger btn-sm" style="margin-top:4px" onclick="app.removePurchaseEntry('${p.id}')">${t('purchase.delete')}</button>
      </div>
    </div>`).join('');
  if (totalEl) totalEl.textContent = thb(totalSpend);
}

export function openAddPurchase() {
  document.getElementById('purchase-modal-title').textContent = t('purchase.add_title');
  document.getElementById('purchase-ing-name').value = '';
  document.getElementById('purchase-qty').value = '';
  document.getElementById('purchase-unit').value = UNITS[0];
  document.getElementById('purchase-price').value = '';
  document.getElementById('purchase-note').value = '';
  document.getElementById('purchase-modal').classList.add('open');
}

export function closePurchaseModal() {
  document.getElementById('purchase-modal').classList.remove('open');
}

export function savePurchase() {
  const name  = document.getElementById('purchase-ing-name').value.trim();
  const qty   = parseFloat(document.getElementById('purchase-qty').value);
  const unit  = document.getElementById('purchase-unit').value;
  const price = parseFloat(document.getElementById('purchase-price').value);
  const note  = document.getElementById('purchase-note').value.trim();
  const date  = document.getElementById('purchase-date')?.value || todayStr();

  if (!name) { alert(t('purchase.required_name')); return; }
  if (!qty || qty <= 0) { alert(t('purchase.required_qty')); return; }
  if (!price || price <= 0) { alert(t('purchase.required_price')); return; }

  addPurchase({ date, name, qty, unit, totalPrice: price, note });
  closePurchaseModal();
  renderPurchaseHistory();
}

export function removePurchaseEntry(id) {
  if (confirm(t('purchase.confirm_delete'))) {
    deletePurchase(id);
    renderPurchaseHistory();
  }
}

export function onPurchaseDateChange() {
  renderPurchaseHistory();
}

export function getPurchaseUnitsHtml() {
  return UNITS.map(u => `<option value="${u}">${u}</option>`).join('');
}
