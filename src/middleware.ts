import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lista de páginas que não devem ser interceptadas
  const publicPages = ['/login', '/register', '/401', '/403', '/404', '/500', '/teste'];
  
  // Verifica se a página atual é uma página pública
  const isPublicPage = publicPages.some(page => request.nextUrl.pathname === page);
  
  // Se for uma página pública, não intercepta
  if (isPublicPage) {
    return NextResponse.next();
  }
  
  // Verifica se o usuário está autenticado
  const session = request.cookies.get('next-auth.session-token');
  
  // Se não estiver autenticado e não for uma página pública, redireciona para a página de login
  if (!session && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Configuração do middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 