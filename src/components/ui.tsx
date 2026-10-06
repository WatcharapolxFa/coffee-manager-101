'use client';

import { useEffect, type ReactNode } from 'react';
import { CHANNELS } from '@/lib/config';
import type { Channel } from '@/lib/types';

export function Modal({ title, onClose, footer, children }: {
  title: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/45 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-bg shadow-2xl sm:rounded-[28px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-ink px-5 py-4 text-bg">
          <span className="font-semibold">{title}</span>
          <button className="text-xl text-bg/60 hover:text-white cursor-pointer" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line bg-surface-2 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Empty({ icon, children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="py-6 text-center text-sm text-ink-mute">
      {icon && <div className="mb-2 text-4xl">{icon}</div>}
      <p>{children}</p>
    </div>
  );
}

export function LoadState({ error }: { error?: string }) {
  return error
    ? <div className="rounded-xl bg-danger-soft p-3 text-sm text-danger">โหลดข้อมูลไม่ได้: {error}</div>
    : <div className="py-6 text-center text-sm text-ink-mute">กำลังโหลด…</div>;
}

export function ChannelLogo({ channel, className = 'h-4' }: { channel: Channel; className?: string }) {
  const ch = CHANNELS[channel];
  if (!ch.logo) return <span>🏪 {ch.label}</span>;
  // eslint-disable-next-line @next/next/no-img-element -- small static SVG logos
  return <img src={ch.logo} alt={ch.label} className={`inline-block align-middle ${className}`} />;
}

export function ChannelBadge({ channel }: { channel: Channel }) {
  const tone = channel === 'delivery1' ? 'bg-[#E8F7EE]' : channel === 'delivery2' ? 'bg-[#FFFDE7]' : 'bg-surface-3';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tone}`}>
      <ChannelLogo channel={channel} className="h-3.5" />
    </span>
  );
}
