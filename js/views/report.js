import { getSalesByMonth } from '../storage.js';
import { thb, daysInMonth } from '../utils.js';
import { renderDailyBarChart, renderPieChart } from '../components/charts.js';
import { t } from '../i18n.js';

export function renderReport() {
  const now      = new Date();
  const yearSel  = document.getElementById('report-year');
  const monthSel = document.getElementById('report-month');
  if (!yearSel.value)  yearSel.value  = now.getFullYear();
  if (!monthSel.value) monthSel.value = now.getMonth() + 1;
  showReport();
}

export function showReport() {
  const year  = +document.getElementById('report-year').value;
  const month = +document.getElementById('report-month').value;
  const sales = getSalesByMonth(year, month);

  if (sales.length === 0) {
    document.getElementById('report-charts').innerHTML  = `<div class="empty-state"><div class="empty-icon">📈</div><p>${t('report.no_sales')}</p></div>`;
    document.getElementById('report-table-body').innerHTML = '';
    document.getElementById('report-summary').innerHTML = '';
    return;
  }

  _renderSummaryCards(sales);
  _renderCharts(sales, year, month);
  _renderTable(sales);
}

function _renderSummaryCards(sales) {
  const totalRevenue = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCups    = sales.reduce((s, r) => s + r.qty, 0);
  const totalCost    = sales.reduce((s, r) => s + r.unitCost * r.qty, 0);

  document.getElementById('report-summary').innerHTML = `
    <div class="card">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-val">${thb(totalRevenue)}</div>
          <div class="stat-label">${t('report.total_revenue')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">☕</div>
          <div class="stat-val">${totalCups}</div>
          <div class="stat-label">${t('report.total_cups')}</div>
        </div>
        <div class="stat-card" style="border-left-color:#2E7D32">
          <div class="stat-icon">📊</div>
          <div class="stat-val" style="color:#2E7D32">${thb(totalRevenue - totalCost)}</div>
          <div class="stat-label">${t('report.est_profit')}</div>
        </div>
      </div>
    </div>`;
}

function _renderCharts(sales, year, month) {
  const days     = daysInMonth(year, month);
  const dayLabels = Array.from({ length: days }, (_, i) => String(i + 1));
  const dayData   = dayLabels.map(d => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return sales.filter(s => s.date === dateStr).reduce((sum, s) => sum + s.revenue, 0);
  });

  const menuMap   = {};
  sales.forEach(s => {
    menuMap[s.menuName] = (menuMap[s.menuName] || 0) + s.revenue;
  });

  document.getElementById('report-charts').innerHTML = `
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">${t('report.daily_sales')}</div>
      <div class="chart-box-tall"><canvas id="report-bar-chart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">${t('report.by_menu')}</div>
      <div class="chart-box-tall"><canvas id="report-pie-chart"></canvas></div>
    </div>`;

  setTimeout(() => {
    renderDailyBarChart('report-bar-chart', dayLabels, dayData);
    renderPieChart('report-pie-chart', Object.keys(menuMap), Object.values(menuMap));
  }, 50);
}

function _renderTable(sales) {
  const menuMap = {};
  sales.forEach(s => {
    if (!menuMap[s.menuName]) menuMap[s.menuName] = { cups: 0, revenue: 0, cost: 0 };
    menuMap[s.menuName].cups    += s.qty;
    menuMap[s.menuName].revenue += s.revenue;
    menuMap[s.menuName].cost    += s.unitCost * s.qty;
  });

  document.getElementById('report-table-body').innerHTML = Object.entries(menuMap).map(([name, v]) => `
    <tr>
      <td>${name}</td>
      <td class="text-center">${v.cups}</td>
      <td class="text-right">${thb(v.revenue)}</td>
      <td class="text-right">${thb(v.cost)}</td>
      <td class="text-right color-success fw-bold">${thb(v.revenue - v.cost)}</td>
    </tr>`).join('');
}
