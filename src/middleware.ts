import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // Se for uma requisição OPTIONS, retorna imediatamente com os headers CORS
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Max-Age': '86400', // 24 horas
                },
            });
        }

        // Para outras requisições, adiciona os headers CORS à resposta
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        return response;
    }

    return NextResponse.next();
}

// Configura em quais caminhos o middleware será executado
export const config = {
    matcher: '/api/:path*',
}; 