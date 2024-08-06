import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This is your secret from your NextAuth configuration
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: any) {
    const session = await getToken({ req: request, secret });

    if (request.nextUrl.pathname.startsWith('/roadmap/')|| request.nextUrl.pathname === ('/home') || request.nextUrl.pathname === ('/success/share')) {
        if (!session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/roadmap/:path*', '/home', '/success/share'],
};
