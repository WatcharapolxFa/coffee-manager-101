'use client';

import { DailyChart } from '@/components/DailyChart';
import { ChannelLogo, Empty, LoadState } from '@/components/ui';
import { api, useLoad } from '@/lib/api';
import type { Channel, Sale } from '@/lib/types';
import { dateStr, daysInMonth, thb, todayStr } from '@/lib/utils';

const CHANNEL_ORDER: Channel[] = ['instore', 'delivery1', 'delivery2'];
const MEDALS = ['🥇', '🥈', '🥉', '4', '5'];

const sum = (rows: Sale[], f: (s: Sale) => number) => rows.reduce((acc, s) => acc + (f(s) || 0), 0);

export default function DashboardPage() {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1;
  const today = todayStr();
  const yday  = dateStr(new Date(year, month - 1, now.getDate() - 1));
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
  const from = yday < monthStart ? yday : monthStart;

  const { data: sales, error } = useLoad(`${from}..${today}`, () => api.sales.byRange(from, today));
  if (!sales) return <LoadState error={error} />;

  const monthSales = sales.filter(s => s.date >= monthStart);
  const revenue = sum(monthSales, s => s.revenue);
  const cups    = sum(monthSales, s => s.qty);
  const cost    = sum(monthSales, s => s.unitCost * s.qty);

  return (
    <>
      <TodayVsYesterday today={sales.filter(s => s.date === today)} yday={sales.filter(s => s.date === yday)} />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-[20px] bg-ink p-5 text-bg shadow-card">
          <div className="text-[13px] text-bg/60">ยอดขายเดือนนี้</div>
          <div className="num mt-1 text-[34px] font-medium text-white">{thb(revenue)}</div>
        </div>
        <Stat icon="☕" label="แก้วที่ขาย" value={cups.toLocaleString()} />
        <Stat icon="📊" label="กำไรโดยประมาณ" value={thb(revenue - cost)} />
      </div>

      <div className="card">
        <div className="card-title">ยอดขายรายวัน (เดือนนี้)</div>
        <DailyChart {...dailySeries(monthSales, year, month)} />
      </div>

      <div className="card">
        <div className="card-title">ยอดขายแยกช่องทาง (เดือนนี้)</div>
        <ChannelBreakdown sales={monthSales} />
      </div>

      <div className="card">
        <div className="card-title">เมนูขายดี 🏆</div>
        <TopMenus sales={monthSales} />
      </div>
    </>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-surface p-4 shadow-card">
      <div className="text-xl">{icon}</div>
      <div className="num mt-2 text-2xl font-medium">{value}</div>
      <div className="mt-0.5 text-xs text-ink-soft">{label}</div>
    </div>
  );
}

function TodayVsYesterday({ today, yday }: { today: Sale[]; yday: Sale[] }) {
  const cards = [
    { label: 'รายได้วันนี้', now: sum(today, s => s.revenue), prev: sum(yday, s => s.revenue), fmt: thb },
    { label: 'แก้ววันนี้',  now: sum(today, s => s.qty),     prev: sum(yday, s => s.qty),     fmt: (n: number) => `${n.toLocaleString()} แก้ว` },
  ];
  return (
    <div className="card">
      <div className="card-title">วันนี้ vs เมื่อวาน</div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-2xl bg-surface-2 p-3.5">
            <div className="text-xs text-ink-soft">{c.label}</div>
            <div className="num mt-1 text-xl font-medium">{c.fmt(c.now)}</div>
            <ChangeBadge current={c.now} previous={c.prev} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangeBadge({ current, previous }: { current: number; previous: number }) {
  const base = 'mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium';
  if (previous === 0 && current === 0) return <div className={`${base} bg-surface-3 text-ink-soft`}>ไม่มีข้อมูลเมื่อวาน</div>;
  if (previous === 0) return <div className={`${base} bg-success-soft text-success`}>▲ ใหม่</div>;
  const pct = ((current - previous) / previous) * 100;
  return pct >= 0
    ? <div className={`${base} bg-success-soft text-success`}>▲ {Math.abs(pct).toFixed(1)}%</div>
    : <div className={`${base} bg-danger-soft text-danger`}>▼ {Math.abs(pct).toFixed(1)}%</div>;
}

function dailySeries(sales: Sale[], year: number, month: number) {
  const days = daysInMonth(year, month);
  const labels = Array.from({ length: days }, (_, i) => String(i + 1));
  const byDay = new Map<number, number>();
  for (const s of sales) {
    const d = Number(s.date.slice(8, 10));
    byDay.set(d, (byDay.get(d) ?? 0) + (s.revenue || 0));
  }
  return { labels, data: labels.map((_, i) => byDay.get(i + 1) ?? 0) };
}

function ChannelBreakdown({ sales }: { sales: Sale[] }) {
  const agg = Object.fromEntries(CHANNEL_ORDER.map(ch => [ch, { rev: 0, cups: 0 }])) as Record<Channel, { rev: number; cups: number }>;
  for (const s of sales) {
    const ch = s.channel in agg ? s.channel : 'instore';
    agg[ch].rev  += s.revenue || 0;
    agg[ch].cups += s.qty || 0;
  }
  const total = CHANNEL_ORDER.reduce((acc, ch) => acc + agg[ch].rev, 0);
  if (total === 0) return <Empty>ยังไม่มีข้อมูลเดือนนี้</Empty>;

  return (
    <div className="space-y-3">
      {CHANNEL_ORDER.map(ch => {
        const pct = (agg[ch].rev / total) * 100;
        return (
          <div key={ch} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-sm"><ChannelLogo channel={ch} className="h-5" /></div>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-accent" style={{ width: `${pct.toFixed(1)}%` }} />
              </div>
              <div className="mt-1 flex gap-3 text-xs text-ink-soft">
                <span className="num font-medium text-ink">{thb(agg[ch].rev)}</span>
                <span>{agg[ch].cups} แก้ว</span>
                <span className="ml-auto num">{pct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopMenus({ sales }: { sales: Sale[] }) {
  const byMenu = new Map<string, { cups: number; revenue: number; cost: number }>();
  for (const s of sales) {
    const m = byMenu.get(s.menuName) ?? { cups: 0, revenue: 0, cost: 0 };
    m.cups    += s.qty || 0;
    m.revenue += s.revenue || 0;
    m.cost    += (s.unitCost || 0) * (s.qty || 0);
    byMenu.set(s.menuName, m);
  }
  const top = [...byMenu.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  if (top.length === 0) return <Empty>ยังไม่มีข้อมูลยอดขาย</Empty>;

  return (
    <div className="divide-y divide-line-soft">
      {top.map(([name, v], i) => {
        const margin = v.revenue > 0 ? ((v.revenue - v.cost) / v.revenue) * 100 : 0;
        const tone = margin >= 50 ? 'bg-success-soft text-success' : margin >= 30 ? 'bg-[#FFF6DD] text-gold' : 'bg-danger-soft text-danger';
        return (
          <div key={name} className="flex items-center justify-between gap-2 py-2.5">
            <span className="flex min-w-0 items-center gap-2">
              <span className={`w-6 shrink-0 text-center ${i < 3 ? 'text-lg' : 'text-sm text-ink-mute'}`}>{MEDALS[i]}</span>
              <span className="truncate">{name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-xs">
              <span className="text-ink-soft">{v.cups} แก้ว · <span className="num">{thb(v.revenue)}</span></span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${tone}`}>Margin {margin.toFixed(0)}%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
