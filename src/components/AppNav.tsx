'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

const TABS = [
  { href: '/management',           icon: '📊', label: 'ภาพรวม' },
  { href: '/management/sales',     icon: '📝', label: 'บันทึกขาย' },
  { href: '/management/menus',     icon: '☕', label: 'เมนู' },
  { href: '/management/overhead',  icon: '💰', label: 'ต้นทุนแฝง' },
  { href: '/management/purchases', icon: '🛒', label: 'ซื้อวัตถุดิบ' },
];

export function AppHeader() {
  async function logout() {
    await api.auth.logout();
    window.location.href = '/login';
  }
  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-ink text-lg font-semibold text-bg">R</div>
          <div>
            <div className="text-[17px] font-semibold leading-none tracking-wide">RADIANT</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-mute">Coffee · Bakery</div>
          </div>
        </div>
        <button className="btn-secondary btn-sm" onClick={logout}>ออกจากระบบ</button>
      </div>
    </header>
  );
}

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-3 bottom-[max(18px,env(safe-area-inset-bottom))] z-[100] mx-auto flex max-w-xl justify-between rounded-[26px] border border-white/60 bg-white/90 px-1.5 py-2 shadow-[0_10px_30px_rgba(58,38,24,.12)] backdrop-blur-xl">
      {TABS.map(tab => {
        const active = tab.href === '/management' ? pathname === '/management' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 text-[11px] font-medium ${active ? 'text-ink' : 'text-ink-mute'}`}
          >
            <span className={`grid h-8 w-11 place-items-center rounded-2xl text-lg ${active ? 'bg-accent-soft' : ''}`}>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
