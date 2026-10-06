'use client';

import { BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

export function DailyChart({ labels, data }: { labels: string[]; data: number[] }) {
  return (
    <div className="h-56">
      <Bar
        data={{
          labels,
          datasets: [{
            label: 'ยอดขาย (฿)',
            data,
            backgroundColor: 'rgba(196, 145, 58, 0.75)',
            borderColor: 'rgba(139, 90, 43, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { callback: v => Math.round(Number(v)).toLocaleString() } },
            x: { ticks: { font: { size: 10 }, maxRotation: 0 } },
          },
        }}
      />
    </div>
  );
}
