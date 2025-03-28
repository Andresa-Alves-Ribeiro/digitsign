import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublic = ["/login", "/register"].includes(path);

    // Get the session token - handle both development and production cookie names
    const token = request.cookies.get("next-auth.session-token")?.value ??
        request.cookies.get("__Secure-next-auth.session-token")?.value;

    try {
        if (!isPublic && !token) {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }

        if (isPublic && token) {
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};