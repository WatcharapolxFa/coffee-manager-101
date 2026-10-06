import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Single-password login. The session cookie is "<expiresAtMs>.<hmac>", signed with SESSION_SECRET.

export const SESSION_COOKIE = 'coffee_session';
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

function hmac(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

// Hash both sides first so timingSafeEqual always compares equal-length buffers.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function signSession(secret: string, now = Date.now()): string {
  const payload = String(now + SESSION_MAX_AGE_SEC * 1000);
  return `${payload}.${hmac(secret, payload)}`;
}

export function verifySession(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig     = token.slice(dot + 1);
  if (!safeEqual(sig, hmac(secret, payload))) return false;
  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

export function checkPassword(input: string, expected: string): boolean {
  return safeEqual(input, expected);
}

export function getAuthEnv(): { password: string; secret: string } {
  const password = process.env.APP_PASSWORD;
  const secret   = process.env.SESSION_SECRET;
  if (!password || !secret) {
    throw new Error('APP_PASSWORD and SESSION_SECRET must be set');
  }
  return { password, secret };
}
