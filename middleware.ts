import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This is your secret from your NextAuth configuration
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: any) {
    const session = await getToken({ req: request, secret });

    // Check if the request path starts with "/digital-sat/"
    if (request.nextUrl.pathname.startsWith('/digital-sat/')|| request.nextUrl.pathname === ('/home') || request.nextUrl.pathname === ('/success/share')) {
        if (!session) {
            // If there's no session, redirect to the home page
            return NextResponse.redirect(new URL('/', request.url));
        }
        // If there is a session, continue with the request
        return NextResponse.next();
    }

    // For all other requests, continue without any action
    return NextResponse.next();
}

export const config = {
    matcher: ['/digital-sat/:path*', '/home', '/success/share'],
};
