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
            // if (userData.rol !== 'Admin' && request.nextUrl.pathname.startsWith('/admin')) {
            //     return NextResponse.redirect(new URL('/client/dashboard', request.url));
            // }

            if (userData.rol === 'Admin') {
                if (!request.nextUrl.pathname.startsWith('/admin')) {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                }
            } else {
                if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/client')) {
                    return NextResponse.redirect(new URL('/user/dashboard', request.url));
                }
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
        '/user/:path*',
        '/client/:path*',
        '/dashboard/:path*'
    ]
};