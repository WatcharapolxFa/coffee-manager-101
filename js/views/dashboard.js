import { getSalesByMonth } from '../storage.js';
import { thb, daysInMonth } from '../utils.js';
import { renderDashChart } from '../components/charts.js';

export function renderDashboard() {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;
  const sales = getSalesByMonth(year, month);

  const totalRevenue = sales.reduce((s, r) => s + (r.revenue  || 0), 0);
  const totalCups    = sales.reduce((s, r) => s + (r.qty      || 0), 0);
  const totalCost    = sales.reduce((s, r) => s + (r.unitCost || 0) * (r.qty || 0), 0);

  document.getElementById('stat-revenue').textContent = thb(totalRevenue);
  document.getElementById('stat-cups').textContent    = totalCups.toLocaleString();
  document.getElementById('stat-profit').textContent  = thb(totalRevenue - totalCost);

  _renderDailyChart(sales, year, month);
  _renderTopMenus(sales);
}

function _renderDailyChart(sales, year, month) {
  const days   = daysInMonth(year, month);
  const labels = Array.from({ length: days }, (_, i) => String(i + 1));
  const data   = labels.map(d => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return sales.filter(s => s.date === dateStr).reduce((sum, s) => sum + (s.revenue || 0), 0);
  });
  renderDashChart('dash-chart', labels, data);
}

function _renderTopMenus(sales) {
  const menuMap = {};
  sales.forEach(s => {
    if (!menuMap[s.menuName]) menuMap[s.menuName] = { cups: 0, revenue: 0 };
    menuMap[s.menuName].cups    += s.qty     || 0;
    menuMap[s.menuName].revenue += s.revenue || 0;
  });

  const sorted = Object.entries(menuMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 3);

  const MEDALS = ['🥇','🥈','🥉'];
  const el = document.getElementById('top-menus');
  el.innerHTML = sorted.length === 0
    ? '<div class="empty-state" style="padding:16px"><p>ยังไม่มีข้อมูลยอดขาย</p></div>'
    : sorted.map(([name, v], i) => `
        <div class="top-menu-item">
          <span><span class="top-menu-rank">${MEDALS[i]}</span>${name}</span>
          <span class="fw-bold color-brown">${v.cups} แก้ว · ${thb(v.revenue)}</span>
        </div>`).join('');
}
