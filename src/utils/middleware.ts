import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Logger from '@/utils/logger';

type RequestHandler = (req: Request, context?: { params: Record<string, string> }) => Promise<Response> | Response;

export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;
  const isPublic = ['/login', '/register'].includes(path);

  const token = request.cookies.get('next-auth.session-token')?.value ??
        request.cookies.get('__Secure-next-auth.session-token')?.value;

  try {
    if (!isPublic && !token) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    if (isPublic && token) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    Logger.error('Middleware error', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

export async function withAuth(handler: RequestHandler): Promise<RequestHandler> {
  return async (req: Request, context?: { params: Record<string, string> }): Promise<Response> => {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
      });

      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
        });
      }

      if (!token.email) {
        return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
        });
      }

      return handler(req, context);
    } catch (error) {
      Logger.error('Middleware error', error);
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      });
    }
  };
}

export function withErrorHandler(handler: RequestHandler): RequestHandler {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      Logger.error('Request handler error', error);
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      });
    }
  };
}