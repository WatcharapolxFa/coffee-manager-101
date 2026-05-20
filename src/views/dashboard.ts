import { getSalesByMonth } from '../storage.ts';
import { thb, daysInMonth } from '../utils.ts';
import { renderDashChart } from '../components/charts.ts';
import { t } from '../i18n.ts';
import { escapeHtml } from '../utils.ts';

export function renderDashboard(): void {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;
  const sales = getSalesByMonth(year, month);

  const totalRevenue = sales.reduce((s, r) => s + (r.revenue  || 0), 0);
  const totalCups    = sales.reduce((s, r) => s + (r.qty      || 0), 0);
  const totalCost    = sales.reduce((s, r) => s + (r.unitCost || 0) * (r.qty || 0), 0);

  const revEl    = document.getElementById('stat-revenue');
  const cupsEl   = document.getElementById('stat-cups');
  const profitEl = document.getElementById('stat-profit');
  if (revEl)    revEl.textContent    = thb(totalRevenue);
  if (cupsEl)   cupsEl.textContent   = totalCups.toLocaleString();
  if (profitEl) profitEl.textContent = thb(totalRevenue - totalCost);

  _renderDailyChart(sales.map(s => ({ date: s.date, revenue: s.revenue })), year, month);
  _renderTopMenus(sales.map(s => ({ menuName: s.menuName, qty: s.qty, revenue: s.revenue })));
}

function _renderDailyChart(sales: { date: string; revenue: number }[], year: number, month: number): void {
  const days   = daysInMonth(year, month);
  const labels = Array.from({ length: days }, (_, i) => String(i + 1));
  const data   = labels.map(d => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return sales.filter(s => s.date === dateStr).reduce((sum, s) => sum + (s.revenue || 0), 0);
  });
  renderDashChart('dash-chart', labels, data);
}

function _renderTopMenus(sales: { menuName: string; qty: number; revenue: number }[]): void {
  const menuMap: Record<string, { cups: number; revenue: number }> = {};
  sales.forEach(s => {
    if (!menuMap[s.menuName]) menuMap[s.menuName] = { cups: 0, revenue: 0 };
    menuMap[s.menuName].cups    += s.qty     || 0;
    menuMap[s.menuName].revenue += s.revenue || 0;
  });

  const sorted = Object.entries(menuMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 3);

  const MEDALS = ['🥇', '🥈', '🥉'];
  const el = document.getElementById('top-menus');
  if (!el) return;
  el.innerHTML = sorted.length === 0
    ? `<div class="empty-state" style="padding:16px"><p>${t('dash.no_sales')}</p></div>`
    : sorted.map(([name, v], i) => `
        <div class="top-menu-item">
          <span><span class="top-menu-rank">${MEDALS[i]}</span>${escapeHtml(name)}</span>
          <span class="fw-bold color-brown">${v.cups} ${t('dash.cups_unit')} · ${thb(v.revenue)}</span>
        </div>`).join('');
}
