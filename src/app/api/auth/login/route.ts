import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC, checkPassword, getAuthEnv, signSession } from '@/lib/auth';
import { handle } from '@/lib/api-server';

const FAIL_DELAY_MS = 1000;

export function POST(request: Request) {
  return handle(async () => {
    const { password, secret } = getAuthEnv();
    const body = (await request.json()) as { password?: unknown };
    const input = typeof body.password === 'string' ? body.password : '';

    if (!checkPassword(input, password)) {
      await new Promise(r => setTimeout(r, FAIL_DELAY_MS)); // slows down guessing
      return NextResponse.json({ error: 'wrong password' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, signSession(secret), {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   SESSION_MAX_AGE_SEC,
    });
    return res;
  });
}
