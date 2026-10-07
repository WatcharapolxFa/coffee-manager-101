import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, getAuthEnv, verifySession } from '@/lib/auth';

// The storefront (/ and /menu) is public; the back office (/management) and the API need the login cookie.
function isStorefront(pathname: string): boolean {
  return pathname === '/' || pathname === '/menu' || pathname.startsWith('/menu/');
}

function isLogin(pathname: string): boolean {
  return pathname === '/login' || pathname === '/api/auth/login';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isStorefront(pathname)) return NextResponse.next();

  // MENU_ONLY=1 publishes just the customer menu: everything else answers 404.
  if (process.env.MENU_ONLY === '1') {
    return new NextResponse('Not found', { status: 404 });
  }

  if (isLogin(pathname)) return NextResponse.next();
  const { secret } = getAuthEnv();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifySession(token, secret)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  // Everything except Next internals and static files in public/ (incl. menu photos).
  matcher: ['/((?!_next/|assets/|icons/|menu-photos/|promo/|manifest.json|favicon.ico).*)'],
};
