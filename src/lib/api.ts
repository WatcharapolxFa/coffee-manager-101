'use client';

import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import type { Channel, Menu, MenuInput, OverheadItem, Purchase, Sale } from './types';

// Browser-side client for the route handlers in src/app/api.

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('unauthorized');
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? res.statusText);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });

export const api = {
  menus: {
    list:   ()                                     => request<Menu[]>('/api/menus'),
    create: (m: Omit<MenuInput, 'id'>)             => request<Menu>('/api/menus', json('POST', m)),
    update: (id: string, m: Omit<MenuInput, 'id'>) => request<Menu>(`/api/menus/${id}`, json('PUT', m)),
    remove: (id: string)                           => request<void>(`/api/menus/${id}`, { method: 'DELETE' }),
    loadSeed: ()                                   => request<Menu[]>('/api/menus/seed', { method: 'POST' }),
  },
  sales: {
    byDate:  (date: string)             => request<Sale[]>(`/api/sales?date=${date}`),
    byRange: (from: string, to: string) => request<Sale[]>(`/api/sales?from=${from}&to=${to}`),
    createOrder: (order: { date: string; channel: Channel; items: { menuId: string; qty: number; unitPrice: number }[] }) =>
      request<Sale[]>('/api/sales', json('POST', order)),
    remove: (id: string) => request<void>(`/api/sales/${id}`, { method: 'DELETE' }),
  },
  purchases: {
    byDate: (date: string)                => request<Purchase[]>(`/api/purchases?date=${date}`),
    create: (p: Omit<Purchase, 'id'>)     => request<Purchase>('/api/purchases', json('POST', p)),
    remove: (id: string)                  => request<void>(`/api/purchases/${id}`, { method: 'DELETE' }),
  },
  overhead: {
    get:  (month: string)                         => request<OverheadItem[]>(`/api/overhead?month=${month}`),
    save: (month: string, items: OverheadItem[])  => request<OverheadItem[]>('/api/overhead', json('PUT', { month, items })),
  },
  auth: {
    login:  (password: string) => request<{ ok: true }>('/api/auth/login', json('POST', { password })),
    logout: ()                 => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
  },
};

// Loads data for `key`; reloads when the key changes or reload() is called.
// `data` is undefined while the current key is loading.
export function useLoad<T>(key: string, load: () => Promise<T>) {
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: '' });
  const [nonce, setNonce] = useState(0);
  const run = useEffectEvent(load);

  useEffect(() => {
    let alive = true;
    run()
      .then(data => { if (alive) setState({ key, data }); })
      .catch((err: Error) => { if (alive) setState({ key, error: err.message }); });
    return () => { alive = false; };
  }, [key, nonce]);

  const reload = useCallback(() => setNonce(n => n + 1), []);
  const current = state.key === key;
  return { data: current ? state.data : undefined, error: current ? state.error : undefined, reload, setData: (data: T) => setState({ key, data }) };
}
