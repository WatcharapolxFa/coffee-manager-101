const BROWN       = 'rgba(139, 90, 43, 1)';
const BROWN_FILL  = 'rgba(139, 90, 43, 0.7)';
const GOLD_FILL   = 'rgba(196, 145, 58, 0.75)';

const PALETTE = ['#8B5A2B','#C4913A','#D4AF6A','#6B3F1B','#E8C878','#A0724B','#F0DCA0','#4A2C0A'];

const instances = { daily: null, pie: null, dash: null };

function destroy(key) {
  if (instances[key]) { try { instances[key].destroy(); } catch (_) {} }
}

function getCtx(canvasId) {
  return document.getElementById(canvasId) ?? null;
}

export function renderDashChart(canvasId, labels, data) {
  const ctx = getCtx(canvasId);
  if (!ctx) return;
  destroy('dash');
  instances.dash = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'ยอดขาย (฿)', data, backgroundColor: GOLD_FILL, borderColor: BROWN, borderWidth: 1, borderRadius: 4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => Math.round(v).toLocaleString() } },
        x: { ticks: { font: { size: 10 }, maxRotation: 0 } },
      },
    },
  });
}

export function renderDailyBarChart(canvasId, labels, data) {
  const ctx = getCtx(canvasId);
  if (!ctx) return;
  destroy('daily');
  instances.daily = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'ยอดขาย (฿)', data, backgroundColor: BROWN_FILL, borderColor: BROWN, borderWidth: 1, borderRadius: 4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => Math.round(v).toLocaleString() } },
        x: { ticks: { font: { size: 11 } } },
      },
    },
  });
}

export function renderPieChart(canvasId, labels, data) {
  const ctx = getCtx(canvasId);
  if (!ctx) return;
  destroy('pie');
  instances.pie = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: PALETTE.slice(0, labels.length), borderWidth: 2, borderColor: '#fff' }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { font: { size: 12 }, padding: 12 } } },
    },
  });
}
