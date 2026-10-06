'use client';

import { useState } from 'react';
import { ChannelBadge, ChannelLogo, Empty, LoadState } from '@/components/ui';
import { api, useLoad } from '@/lib/api';
import { getUnitPrice } from '@/lib/calculator';
import type { Channel, Menu } from '@/lib/types';
import { menuIcon, thb, todayStr } from '@/lib/utils';

interface CartItem { qty: number; price: number }

const CHANNEL_BUTTONS: Channel[] = ['instore', 'delivery1', 'delivery2'];

export default function SalesPage() {
  const [date, setDate] = useState(todayStr);
  const [channel, setChannel] = useState<Channel>('instore');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [saving, setSaving] = useState(false);

  const menus = useLoad('menus', api.menus.list);
  const sales = useLoad(date, () => api.sales.byDate(date));

  function changeDate(value: string) {
    setDate(value || todayStr());
    setCart({});
  }

  function tap(menu: Menu) {
    setCart(c => ({
      ...c,
      [menu.id]: {
        qty: (c[menu.id]?.qty ?? 0) + 1,
        price: c[menu.id]?.price ?? Math.ceil(getUnitPrice(menu, channel)),
      },
    }));
  }

  function changeQty(id: string, delta: number) {
    setCart(c => {
      const next = { ...c };
      const qty = (next[id]?.qty ?? 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = { ...next[id], qty };
      return next;
    });
  }

  function changePrice(id: string, raw: string) {
    const price = Math.max(0, Math.ceil(parseFloat(raw) || 0));
    setCart(c => ({ ...c, [id]: { ...c[id], price } }));
  }

  function remove(id: string) {
    setCart(c => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }

  async function confirmOrder() {
    const items = Object.entries(cart).map(([menuId, it]) => ({ menuId, qty: it.qty, unitPrice: it.price }));
    if (!items.length) return;
    setSaving(true);
    try {
      await api.sales.createOrder({ date, channel, items });
      setCart({});
      sales.reload();
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function removeSale(id: string) {
    if (!confirm('ลบรายการนี้?')) return;
    await api.sales.remove(id);
    sales.reload();
  }

  const menuById = new Map((menus.data ?? []).map(m => [m.id, m]));
  const cartEntries = Object.entries(cart).filter(([id]) => menuById.has(id));
  const cartTotal = cartEntries.reduce((acc, [, it]) => acc + it.price * it.qty, 0);
  const dayTotal = (sales.data ?? []).reduce((acc, s) => acc + s.revenue, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input type="date" className="input w-auto" value={date} onChange={e => changeDate(e.target.value)} />
        <div className="flex gap-1 rounded-2xl bg-surface p-1 shadow-soft">
          {CHANNEL_BUTTONS.map(ch => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`rounded-xl px-3 py-1.5 text-sm cursor-pointer ${channel === ch ? 'bg-accent-soft ring-1 ring-accent' : ''}`}
            >
              <ChannelLogo channel={ch} className="h-5" />
            </button>
          ))}
        </div>
      </div>

      {!menus.data ? <LoadState error={menus.error} /> : menus.data.length === 0 ? (
        <Empty icon="☕">ยังไม่มีเมนู กรุณาเพิ่มเมนูก่อน</Empty>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {menus.data.map((m, i) => {
            const qty = cart[m.id]?.qty ?? 0;
            return (
              <button
                key={m.id}
                onClick={() => tap(m)}
                className={`relative select-none rounded-2xl border-[1.5px] px-3 pt-4 pb-3.5 text-center shadow-soft transition active:scale-95 cursor-pointer ${qty > 0 ? 'border-accent bg-accent-soft' : 'border-line-soft bg-surface'}`}
              >
                {qty > 0 && <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-white">{qty}</span>}
                <span className="text-3xl">{menuIcon(m.name, i)}</span>
                <div className="mt-1.5 text-sm leading-tight font-medium">{m.name}</div>
                <div className="num mt-1 text-sm text-accent">{thb(getUnitPrice(m, channel))}</div>
              </button>
            );
          })}
        </div>
      )}

      {cartEntries.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-[28px] bg-ink text-bg shadow-[0_12px_30px_rgba(42,24,16,.22)]">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="font-semibold">🛒 ออเดอร์</span>
            <button className="btn-danger btn-sm" onClick={() => setCart({})}>ล้าง</button>
          </div>
          <div className="divide-y divide-white/10 px-5">
            {cartEntries.map(([id, it]) => (
              <div key={id} className="flex items-center gap-2 py-2.5">
                <div className="min-w-0 flex-1 truncate text-sm">{menuById.get(id)!.name}</div>
                <div className="flex items-center gap-1.5">
                  <button className="grid size-7 place-items-center rounded-lg bg-white/10 cursor-pointer" onClick={() => changeQty(id, -1)}>−</button>
                  <span className="num w-5 text-center">{it.qty}</span>
                  <button className="grid size-7 place-items-center rounded-lg bg-white/10 cursor-pointer" onClick={() => changeQty(id, 1)}>+</button>
                </div>
                <div className="flex w-20 flex-col items-end">
                  <input
                    type="number" min={0} step={1}
                    className="num w-16 rounded-md bg-white/10 px-1.5 py-0.5 text-right text-sm outline-none"
                    defaultValue={it.price}
                    onBlur={e => changePrice(id, e.target.value)}
                    aria-label="ราคาต่อแก้ว"
                  />
                  <span className="num mt-0.5 text-xs text-bg/60">{thb(it.price * it.qty)}</span>
                </div>
                <button className="px-1 text-bg/50 hover:text-white cursor-pointer" onClick={() => remove(id)} aria-label="ลบ">✕</button>
              </div>
            ))}
          </div>
          <div className="px-5 pt-3 pb-5">
            <div className="flex items-baseline justify-between">
              <span className="text-bg/70">รวม</span>
              <span className="num text-[28px] font-medium text-white">{thb(cartTotal)}</span>
            </div>
            <button className="btn-primary mt-3 w-full py-3.5 text-base" onClick={confirmOrder} disabled={saving}>
              {saving ? 'กำลังบันทึก…' : '✅ บันทึกออเดอร์'}
            </button>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold">บันทึกวันนี้</span>
          <span className="num font-semibold text-accent">{thb(dayTotal)}</span>
        </div>
        {!sales.data ? <LoadState error={sales.error} /> : sales.data.length === 0 ? (
          <Empty>ยังไม่มีการบันทึกวันนี้</Empty>
        ) : (
          <div className="divide-y divide-line-soft">
            {sales.data.map(s => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate font-medium">{s.menuName} × {s.qty}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                    <ChannelBadge channel={s.channel} /> <span className="num">{thb(s.unitPrice)}</span>/แก้ว
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="num font-semibold">{thb(s.revenue)}</span>
                  <button className="btn-danger btn-sm" onClick={() => removeSale(s.id)}>ลบ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
