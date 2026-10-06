'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.auth.login(password);
      window.location.href = '/management';
    } catch {
      setError('รหัสผ่านไม่ถูกต้อง');
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="grid size-10 place-items-center rounded-xl bg-ink text-lg font-semibold text-bg">R</div>
          <div>
            <div className="text-lg font-semibold leading-none">RADIANT</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-mute">Coffee · Bakery</div>
          </div>
        </div>
        <label className="label" htmlFor="password">รหัสผ่าน</label>
        <input
          id="password"
          type="password"
          className="input"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button className="btn-primary mt-4 w-full" disabled={busy || !password}>
          {busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </main>
  );
}
