import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;
  const isPublic = ['/login', '/register'].includes(path);

  const token = request.cookies.get('next-auth.session-token')?.value ??
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 