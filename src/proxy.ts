import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, getAuthEnv, verifySession } from '@/lib/auth';

// The storefront (/ and /menu) is public; the back office (/management) and the API need the login cookie.
function isPublic(pathname: string): boolean {
  return pathname === '/' || pathname === '/menu' || pathname.startsWith('/menu/');
}

export function proxy(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) return NextResponse.next();
  const { secret } = getAuthEnv();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifySession(token, secret)) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  // Everything except the login page/endpoint, Next internals and static files in public/ (incl. menu photos).
  matcher: ['/((?!login|api/auth/login|_next/|assets/|icons/|menu-photos/|promo/|manifest.json|favicon.ico).*)'],
};
