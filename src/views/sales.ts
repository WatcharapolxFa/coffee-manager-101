import { getMenus, getMenuById, addSale, deleteSale, getSalesByDate } from '../storage.ts';
import { getUnitPrice, getUnitCost } from '../calculator.ts';
import { thb, todayStr, menuIcon, channelLabel, escapeHtml } from '../utils.ts';
import { t } from '../i18n.ts';
import type { Channel } from '../types/index.ts';

let posCart: Record<string, number>  = {};
let posChannel: Channel = 'instore';

export function renderSales(): void {
  const dateEl = document.getElementById('sales-date') as HTMLInputElement | null;
  if (dateEl && !dateEl.value) dateEl.value = todayStr();

  posCart = {};
  renderPosGrid();
  renderCart();
  renderSalesHistory();
}

export function renderPosGrid(): void {
  const menus = getMenus();
  const grid  = document.getElementById('pos-menu-grid');
  if (!grid) return;

  if (menus.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">☕</div><p>${t('sales.no_menus')}</p></div>`;
    return;
  }

  grid.innerHTML = menus.map((m, i) => {
    const price = getUnitPrice(m, posChannel);
    const qty   = posCart[m.id] || 0;
    return `<button class="pos-menu-btn ${qty > 0 ? 'in-cart' : ''}" onclick="app.tapMenu('${m.id}')">
      ${qty > 0 ? `<span class="pmb-badge">${qty}</span>` : ''}
      <span class="pmb-icon">${menuIcon(m.name, i)}</span>
      <div class="pmb-name">${escapeHtml(m.name)}</div>
      <div class="pmb-price">${thb(price)}</div>
    </button>`;
  }).join('');
}

export function renderCart(): void {
  const cartEl  = document.getElementById('pos-cart') as HTMLElement | null;
  const itemsEl = document.getElementById('pos-cart-items');
  const totalEl = document.getElementById('pos-cart-total-val');
  if (!cartEl) return;

  const entries = Object.entries(posCart);
  if (entries.length === 0) { cartEl.style.display = 'none'; return; }
  cartEl.style.display = 'block';

  let total = 0;
  if (itemsEl) {
    itemsEl.innerHTML = entries.map(([menuId, qty]) => {
      const m = getMenuById(menuId);
      if (!m) return '';
      const unitPrice = getUnitPrice(m, posChannel);
      const subtotal  = unitPrice * qty;
      total += subtotal;
      return `<div class="pos-cart-item">
        <div class="pos-cart-item-name">${escapeHtml(m.name)}</div>
        <div class="pos-qty-ctrl">
          <button class="pos-qty-btn" onclick="app.updateCartQty('${menuId}',-1)">−</button>
          <span class="pos-qty-num">${qty}</span>
          <button class="pos-qty-btn" onclick="app.updateCartQty('${menuId}',1)">+</button>
        </div>
        <div class="pos-cart-item-price">${thb(subtotal)}</div>
        <button class="pos-del-btn" onclick="app.removeFromCart('${menuId}')">✕</button>
      </div>`;
    }).join('');
  }

  if (totalEl) totalEl.textContent = thb(total);
}

export function renderSalesHistory(): void {
  const date    = (document.getElementById('sales-date') as HTMLInputElement | null)?.value || todayStr();
  const sales   = getSalesByDate(date);
  const listEl  = document.getElementById('sales-history-list');
  const totalEl = document.getElementById('sales-day-total');
  if (!listEl) return;

  if (sales.length === 0) {
    listEl.innerHTML = `<div class="text-sm text-center" style="padding:16px;color:var(--text-light)">${t('sales.no_sales')}</div>`;
    if (totalEl) totalEl.textContent = '฿0';
    return;
  }

  const totalRev = sales.reduce((s, r) => s + r.revenue, 0);
  listEl.innerHTML = sales.map(s => `
    <div class="history-item">
      <div class="history-item-left">
        <div class="history-item-name">${escapeHtml(s.menuName)} × ${s.qty}</div>
        <div class="history-item-sub">${channelLabel(s.channel)} · ${thb(s.unitPrice)}${t('sales.per_cup')}</div>
      </div>
      <div class="history-item-right">
        <div class="history-item-rev">${thb(s.revenue)}</div>
        <button class="btn btn-danger btn-sm" style="margin-top:4px" onclick="app.removeSaleEntry('${s.id}')">${t('sales.delete')}</button>
      </div>
    </div>`).join('');
  if (totalEl) totalEl.textContent = thb(totalRev);
}

export function setChannel(ch: Channel): void {
  posChannel = ch;
  document.querySelectorAll<HTMLElement>('.ch-btn').forEach(b => {
    b.classList.toggle('active', (b as HTMLButtonElement).dataset['ch'] === ch);
  });
  renderPosGrid();
  renderCart();
}

export function tapMenu(menuId: string): void {
  posCart[menuId] = (posCart[menuId] || 0) + 1;
  renderPosGrid();
  renderCart();
}

export function updateCartQty(menuId: string, delta: number): void {
  posCart[menuId] = (posCart[menuId] || 0) + delta;
  if (posCart[menuId] <= 0) delete posCart[menuId];
  renderPosGrid();
  renderCart();
}

export function removeFromCart(menuId: string): void {
  delete posCart[menuId];
  renderPosGrid();
  renderCart();
}

export function clearCart(): void {
  posCart = {};
  renderPosGrid();
  renderCart();
}

export function confirmOrder(): void {
  const date    = (document.getElementById('sales-date') as HTMLInputElement).value || todayStr();
  const entries = Object.entries(posCart);
  if (!entries.length) return;

  entries.forEach(([menuId, qty]) => {
    const m = getMenuById(menuId);
    if (!m || qty <= 0) return;
    const unitPrice = getUnitPrice(m, posChannel);
    const unitCost  = getUnitCost(m);
    addSale({
      date, menuId, menuName: m.name, qty, channel: posChannel,
      unitPrice: +unitPrice.toFixed(2),
      unitCost:  +unitCost.toFixed(2),
      revenue:   +(unitPrice * qty).toFixed(2),
    });
  });

  posCart = {};
  renderPosGrid();
  renderCart();
  renderSalesHistory();
}

export function removeSaleEntry(id: string): void {
  if (confirm(t('sales.confirm_delete'))) {
    deleteSale(id);
    renderSalesHistory();
  }
}

export function onSalesDateChange(): void {
  posCart = {};
  renderPosGrid();
  renderCart();
  renderSalesHistory();
}
