import { getSalesByMonth, getMonthlyOverhead } from '../storage.ts';
import { thb, daysInMonth, escapeHtml } from '../utils.ts';
import { renderDailyBarChart, renderPieChart } from '../components/charts.ts';
import { t } from '../i18n.ts';
import type { Sale, OverheadItem } from '../types/index.ts';

export function renderReport(): void {
  const now      = new Date();
  const yearSel  = document.getElementById('report-year')  as HTMLSelectElement | null;
  const monthSel = document.getElementById('report-month') as HTMLSelectElement | null;
  if (!yearSel || !monthSel) return;
  if (!yearSel.value)  yearSel.value  = String(now.getFullYear());
  if (!monthSel.value) monthSel.value = String(now.getMonth() + 1);
  showReport();
}

export function showReport(): void {
  const year  = +(document.getElementById('report-year')  as HTMLSelectElement).value;
  const month = +(document.getElementById('report-month') as HTMLSelectElement).value;
  const sales    = getSalesByMonth(year, month);
  const overhead = getMonthlyOverhead(year, month);

  if (sales.length === 0) {
    const chartsEl = document.getElementById('report-charts');
    const tbodyEl  = document.getElementById('report-table-body');
    const summaryEl = document.getElementById('report-summary');
    if (chartsEl)  chartsEl.innerHTML  = `<div class="empty-state"><div class="empty-icon">📈</div><p>${t('report.no_sales')}</p></div>`;
    if (tbodyEl)   tbodyEl.innerHTML   = '';
    if (summaryEl) summaryEl.innerHTML = '';
    return;
  }

  _renderSummaryCards(sales, overhead);
  _renderCharts(sales, year, month);
  _renderTable(sales);
}

function _renderSummaryCards(sales: Sale[], overhead: OverheadItem[]): void {
  const totalRevenue  = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCups     = sales.reduce((s, r) => s + r.qty, 0);
  const totalCOGS     = sales.reduce((s, r) => s + r.unitCost * r.qty, 0);
  const totalOverhead = overhead.reduce((s, h) => s + (Number(h.amount) || 0), 0);
  const grossProfit   = totalRevenue - totalCOGS;
  const netProfit     = grossProfit - totalOverhead;

  const overheadRows = overhead.length > 0
    ? overhead.map(h => `
        <div class="oh-sum-row" style="font-size:13px">
          <span style="color:var(--ink-soft)">${escapeHtml(h.name)}</span>
          <span>${thb(h.amount)}</span>
        </div>`).join('')
    : `<div style="font-size:12px;color:var(--ink-mute);padding:4px 0">ยังไม่มีข้อมูลต้นทุนแฝงเดือนนี้ — กรอกได้ที่แท็บ "ต้นทุนแฝง"</div>`;

  const summaryEl = document.getElementById('report-summary');
  if (!summaryEl) return;
  summaryEl.innerHTML = `
    <div class="card">
      <div class="stats-grid">
        <div class="stat-card stat-card--feature">
          <div class="stat-label">${t('report.total_revenue')}</div>
          <div class="stat-val">${thb(totalRevenue)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">☕</div>
          <div class="stat-val">${totalCups}</div>
          <div class="stat-label">${t('report.total_cups')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-val">${thb(totalCOGS)}</div>
          <div class="stat-label">ต้นทุนวัตถุดิบ</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">ต้นทุนแฝงเดือนนี้</div>
      ${overheadRows}
      <div class="oh-sum-row oh-sum-total" style="margin-top:8px;border-radius:var(--r-sm);padding:10px 12px">
        <span>รวมต้นทุนแฝง</span>
        <span>${thb(totalOverhead)}</span>
      </div>
    </div>
    <div class="card" style="background:${netProfit >= 0 ? 'var(--success-soft)' : 'var(--danger-soft)'}">
      <div class="flex-between" style="margin-bottom:8px">
        <span class="card-title" style="margin:0;color:${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">กำไรสุทธิ</span>
        <span style="font-size:11px;color:var(--ink-mute)">รายได้ − วัตถุดิบ − ต้นทุนแฝง</span>
      </div>
      <div style="font-family:var(--font-display);font-size:34px;font-weight:500;letter-spacing:-0.025em;color:${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'}">
        ${thb(netProfit)}
      </div>
      <div style="margin-top:8px;font-size:12px;color:var(--ink-soft)">
        กำไรขั้นต้น ${thb(grossProfit)} − ต้นทุนแฝง ${thb(totalOverhead)}
      </div>
    </div>`;
}

function _renderCharts(sales: Sale[], year: number, month: number): void {
  const days      = daysInMonth(year, month);
  const dayLabels = Array.from({ length: days }, (_, i) => String(i + 1));
  const dayData   = dayLabels.map(d => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return sales.filter(s => s.date === dateStr).reduce((sum, s) => sum + s.revenue, 0);
  });

  const menuMap: Record<string, number> = {};
  sales.forEach(s => { menuMap[s.menuName] = (menuMap[s.menuName] || 0) + s.revenue; });

  const chartsEl = document.getElementById('report-charts');
  if (!chartsEl) return;
  chartsEl.innerHTML = `
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

function _renderTable(sales: Sale[]): void {
  const menuMap: Record<string, { cups: number; revenue: number; cost: number }> = {};
  sales.forEach(s => {
    if (!menuMap[s.menuName]) menuMap[s.menuName] = { cups: 0, revenue: 0, cost: 0 };
    menuMap[s.menuName].cups    += s.qty;
    menuMap[s.menuName].revenue += s.revenue;
    menuMap[s.menuName].cost    += s.unitCost * s.qty;
  });

  const tbodyEl = document.getElementById('report-table-body');
  if (!tbodyEl) return;
  tbodyEl.innerHTML = Object.entries(menuMap).map(([name, v]) => `
    <tr>
      <td>${escapeHtml(name)}</td>
      <td class="text-center">${v.cups}</td>
      <td class="text-right">${thb(v.revenue)}</td>
      <td class="text-right">${thb(v.cost)}</td>
      <td class="text-right color-success fw-bold">${thb(v.revenue - v.cost)}</td>
    </tr>`).join('');
}
