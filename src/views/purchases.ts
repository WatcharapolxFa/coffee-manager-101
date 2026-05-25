import { addPurchase, deletePurchase, getPurchasesByDate } from '../storage.ts';
import { todayStr, thb, escapeHtml } from '../utils.ts';
import { t } from '../i18n.ts';

const UNITS = ['g', 'kg', 'ml', 'L', 'ชิ้น', 'ถุง', 'กล่อง', 'แพ็ค', 'อื่นๆ'];

export function renderPurchases(): void {
  const dateEl = document.getElementById('purchase-date') as HTMLInputElement | null;
  if (dateEl && !dateEl.value) dateEl.value = todayStr();
  renderPurchaseHistory();
}

export function renderPurchaseHistory(): void {
  const date   = (document.getElementById('purchase-date') as HTMLInputElement | null)?.value || todayStr();
  const items  = getPurchasesByDate(date);
  const listEl = document.getElementById('purchase-history-list');
  const totalEl = document.getElementById('purchase-day-total');
  if (!listEl) return;

  if (items.length === 0) {
    listEl.innerHTML = `<div class="text-sm text-center" style="padding:16px;color:var(--text-light)">${t('purchase.no_items')}</div>`;
    if (totalEl) totalEl.textContent = '฿0';
    return;
  }

  const totalSpend = items.reduce((s, p) => s + p.totalPrice, 0);
  listEl.innerHTML = items.map(p => `
    <div class="history-item">
      <div class="history-item-left">
        <div class="history-item-name">🛒 ${escapeHtml(p.name)}</div>
        <div class="history-item-sub">${escapeHtml(String(p.qty))} ${escapeHtml(p.unit)}${p.note ? ' · ' + escapeHtml(p.note) : ''}</div>
      </div>
      <div class="history-item-right">
        <div class="history-item-rev" style="color:var(--danger)">${thb(p.totalPrice)}</div>
        <button class="btn btn-danger btn-sm" style="margin-top:6px" onclick="app.removePurchaseEntry('${p.id}')">${t('purchase.delete')}</button>
      </div>
    </div>`).join('');
  if (totalEl) totalEl.textContent = thb(totalSpend);
}

export function openAddPurchase(): void {
  const titleEl = document.getElementById('purchase-modal-title');
  if (titleEl) titleEl.textContent = t('purchase.add_title');
  (document.getElementById('purchase-ing-name') as HTMLInputElement).value = '';
  (document.getElementById('purchase-qty')      as HTMLInputElement).value = '';
  (document.getElementById('purchase-unit')     as HTMLSelectElement).value = UNITS[0];
  (document.getElementById('purchase-price')    as HTMLInputElement).value = '';
  (document.getElementById('purchase-note')     as HTMLInputElement).value = '';
  document.getElementById('purchase-modal')?.classList.add('open');
}

export function closePurchaseModal(): void {
  document.getElementById('purchase-modal')?.classList.remove('open');
}

export function savePurchase(): void {
  const name  = (document.getElementById('purchase-ing-name') as HTMLInputElement).value.trim();
  const qty   = parseFloat((document.getElementById('purchase-qty')   as HTMLInputElement).value);
  const unit  = (document.getElementById('purchase-unit')  as HTMLSelectElement).value;
  const price = parseFloat((document.getElementById('purchase-price') as HTMLInputElement).value);
  const note  = (document.getElementById('purchase-note')  as HTMLInputElement).value.trim();
  const date  = (document.getElementById('purchase-date')  as HTMLInputElement | null)?.value || todayStr();

  if (!name)             { alert(t('purchase.required_name'));  return; }
  if (!qty || qty <= 0)  { alert(t('purchase.required_qty'));   return; }
  if (!price || price <= 0) { alert(t('purchase.required_price')); return; }

  addPurchase({ date, name, qty, unit, totalPrice: price, note });
  closePurchaseModal();
  renderPurchaseHistory();
}

export function removePurchaseEntry(id: string): void {
  if (confirm(t('purchase.confirm_delete'))) {
    deletePurchase(id);
    renderPurchaseHistory();
  }
}

export function onPurchaseDateChange(): void {
  renderPurchaseHistory();
}

export function getPurchaseUnitsHtml(): string {
  return UNITS.map(u => `<option value="${u}">${u}</option>`).join('');
}
