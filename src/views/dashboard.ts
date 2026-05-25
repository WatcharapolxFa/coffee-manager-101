import { getSalesByMonth, getSalesByDate } from '../storage.ts';
import { thb, daysInMonth, todayStr } from '../utils.ts';
import { renderDashChart } from '../components/charts.ts';
import { t } from '../i18n.ts';
import { escapeHtml } from '../utils.ts';
import { ASSET_BASE } from '../config.ts';

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

  _renderTodayVsYesterday();
  _renderDailyChart(sales.map(s => ({ date: s.date, revenue: s.revenue })), year, month);
  _renderChannelBreakdown(sales);
  _renderTopMenus(sales.map(s => ({
    menuName: s.menuName,
    qty:      s.qty,
    revenue:  s.revenue,
    cost:     (s.unitCost || 0) * (s.qty || 0),
  })));
}

// ─── Feature A: Today vs Yesterday ──────────────────────────────────────────

function _renderTodayVsYesterday(): void {
  const el = document.getElementById('today-vs-yday');
  if (!el) return;

  const today     = todayStr();
  const ydayDate  = new Date();
  ydayDate.setDate(ydayDate.getDate() - 1);
  const yday = `${ydayDate.getFullYear()}-${String(ydayDate.getMonth() + 1).padStart(2, '0')}-${String(ydayDate.getDate()).padStart(2, '0')}`;

  const todaySales = getSalesByDate(today);
  const ydaySales  = getSalesByDate(yday);

  const todayRev  = todaySales.reduce((s, r) => s + (r.revenue || 0), 0);
  const todayCups = todaySales.reduce((s, r) => s + (r.qty     || 0), 0);
  const ydayRev   = ydaySales.reduce((s, r)  => s + (r.revenue || 0), 0);
  const ydayCups  = ydaySales.reduce((s, r)  => s + (r.qty     || 0), 0);

  const revBadge  = _changeBadge(todayRev,  ydayRev);
  const cupsBadge = _changeBadge(todayCups, ydayCups);

  el.innerHTML = `
    <div class="today-stat-row">
      <div class="today-stat-card">
        <div class="today-stat-label">${t('dash.today_rev')}</div>
        <div class="today-stat-val">${thb(todayRev)}</div>
        ${revBadge}
      </div>
      <div class="today-stat-card">
        <div class="today-stat-label">${t('dash.today_cups')}</div>
        <div class="today-stat-val">${todayCups.toLocaleString()} <span class="today-stat-unit">${t('dash.cups_unit')}</span></div>
        ${cupsBadge}
      </div>
    </div>`;
}

function _changeBadge(current: number, previous: number): string {
  if (previous === 0 && current === 0) {
    return `<div class="change-badge change-badge--neutral">${t('dash.no_yday')}</div>`;
  }
  if (previous === 0) {
    return `<div class="change-badge change-badge--up">▲ ใหม่</div>`;
  }
  const pct   = ((current - previous) / previous) * 100;
  const sign  = pct >= 0 ? '▲' : '▼';
  const cls   = pct >= 0 ? 'change-badge--up' : 'change-badge--down';
  return `<div class="change-badge ${cls}">${sign} ${Math.abs(pct).toFixed(1)}%</div>`;
}

// ─── Daily Chart ─────────────────────────────────────────────────────────────

function _renderDailyChart(sales: { date: string; revenue: number }[], year: number, month: number): void {
  const days   = daysInMonth(year, month);
  const labels = Array.from({ length: days }, (_, i) => String(i + 1));
  const data   = labels.map(d => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return sales.filter(s => s.date === dateStr).reduce((sum, s) => sum + (s.revenue || 0), 0);
  });
  renderDashChart('dash-chart', labels, data);
}

// ─── Feature B: Channel Breakdown ────────────────────────────────────────────

function _renderChannelBreakdown(sales: { channel: string; revenue: number; qty: number }[]): void {
  const el = document.getElementById('channel-breakdown');
  if (!el) return;

  const base = ASSET_BASE;

  const channels = ['instore', 'delivery1', 'delivery2'] as const;
  const agg: Record<string, { rev: number; cups: number }> = {
    instore:   { rev: 0, cups: 0 },
    delivery1: { rev: 0, cups: 0 },
    delivery2: { rev: 0, cups: 0 },
  };

  sales.forEach(s => {
    const ch = s.channel in agg ? s.channel : 'instore';
    agg[ch].rev  += s.revenue || 0;
    agg[ch].cups += s.qty     || 0;
  });

  const totalRev = Object.values(agg).reduce((s, v) => s + v.rev, 0);

  if (totalRev === 0) {
    el.innerHTML = `<div class="empty-state" style="padding:16px"><p>${t('dash.no_channel_data')}</p></div>`;
    return;
  }

  const channelMeta: Record<string, { label: string; logo: string | null }> = {
    instore:   { label: t('dash.ch_instore'), logo: null },
    delivery1: { label: t('dash.ch_grab'),    logo: `${base}assets/grab-logo.svg` },
    delivery2: { label: t('dash.ch_lineman'), logo: `${base}assets/lineman-logo.svg` },
  };

  el.innerHTML = channels.map(ch => {
    const { rev, cups } = agg[ch];
    const pct  = totalRev > 0 ? (rev / totalRev) * 100 : 0;
    const meta = channelMeta[ch];
    const logoHtml = meta.logo
      ? `<img src="${meta.logo}" class="ch-breakdown-logo" alt="${escapeHtml(meta.label)}">`
      : `<span class="ch-breakdown-name-text">${meta.label}</span>`;

    return `
      <div class="ch-breakdown-row">
        <div class="ch-breakdown-label">${logoHtml}</div>
        <div class="ch-breakdown-body">
          <div class="ch-breakdown-bar-wrap">
            <div class="ch-breakdown-bar" style="width:${pct.toFixed(1)}%"></div>
          </div>
          <div class="ch-breakdown-stats">
            <span class="ch-breakdown-rev">${thb(rev)}</span>
            <span class="ch-breakdown-cups">${cups} ${t('dash.cups_short')}</span>
            <span class="ch-breakdown-pct">${pct.toFixed(0)}%</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ─── Feature C: Top 5 Menus with Margin % ────────────────────────────────────

function _renderTopMenus(sales: { menuName: string; qty: number; revenue: number; cost: number }[]): void {
  const menuMap: Record<string, { cups: number; revenue: number; cost: number }> = {};
  sales.forEach(s => {
    if (!menuMap[s.menuName]) menuMap[s.menuName] = { cups: 0, revenue: 0, cost: 0 };
    menuMap[s.menuName].cups    += s.qty     || 0;
    menuMap[s.menuName].revenue += s.revenue || 0;
    menuMap[s.menuName].cost    += s.cost    || 0;
  });

  const sorted = Object.entries(menuMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  const MEDALS = ['🥇', '🥈', '🥉', '4', '5'];
  const el = document.getElementById('top-menus');
  if (!el) return;

  el.innerHTML = sorted.length === 0
    ? `<div class="empty-state" style="padding:16px"><p>${t('dash.no_sales')}</p></div>`
    : sorted.map(([name, v], i) => {
        const margin    = v.revenue > 0 ? ((v.revenue - v.cost) / v.revenue) * 100 : 0;
        const marginCls = margin >= 50 ? 'margin-badge--green'
                        : margin >= 30 ? 'margin-badge--yellow'
                        :                'margin-badge--red';
        const isEmoji = i < 3;
        const rankHtml = isEmoji
          ? `<span class="top-menu-rank">${MEDALS[i]}</span>`
          : `<span class="top-menu-rank top-menu-rank--num">${MEDALS[i]}</span>`;
        return `
          <div class="top-menu-item">
            <span class="top-menu-item-left">${rankHtml}${escapeHtml(name)}</span>
            <span class="top-menu-item-right">
              <span class="top-menu-stats">${v.cups} ${t('dash.cups_unit')} · ${thb(v.revenue)}</span>
              <span class="margin-badge ${marginCls}">${t('dash.margin_label')} ${margin.toFixed(0)}%</span>
            </span>
          </div>`;
      }).join('');
}
