import { NextResponse } from 'next/server';

export function middleware(request) {
    const user = request.cookies.get('user')?.value; // Accede al valor de la cookie


    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        if (user) {
            const userData = JSON.parse(user);
            // Redirigir si intenta acceder a rutas de admin sin ser admin
            if (userData.rol !== 'Admin' && request.nextUrl.pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/client/dashboard', request.url));
            }
        }
    } catch (error) {
        // Si hay error al parsear el JSON, redirigir a login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/client/:path*',
        '/dashboard/:path*'
    ]
};