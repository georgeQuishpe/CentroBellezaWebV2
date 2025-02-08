import { NextResponse } from 'next/server';

export function middleware(request) {
    const user = request.cookies.get('user')?.value; // Accede al valor de la cookie


    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        if (user) {
            const userData = JSON.parse(user);
            console.log('Middleware - Usuario:', userData);

            // Redirigir si intenta acceder a rutas de admin sin ser admin
            // if (userData.rol !== 'Admin' && request.nextUrl.pathname.startsWith('/admin')) {
            //     return NextResponse.redirect(new URL('/client/dashboard', request.url));
            // }

            // if (userData.rol === 'Admin') {
            //     if (!request.nextUrl.pathname.startsWith('/admin')) {
            //         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            //     }
            // } else {
            //     if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/client')) {
            //         return NextResponse.redirect(new URL('/user/dashboard', request.url));
            //     }
            // }

            // // Verificar explícitamente el rol y la ruta
            // if (userData.rol === 'Admin') {
            //     console.log('Usuario Admin detectado, verificando ruta:', request.nextUrl.pathname);

            //     // Si es admin y NO está en una ruta de admin, redirigir a admin dashboard
            //     if (!request.nextUrl.pathname.startsWith('/admin')) {
            //         console.log('Redirigiendo admin a /admin/dashboard');
            //         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            //     }
            // } else {
            //     // Si es cliente y está intentando acceder a rutas de admin, redirigir a user dashboard
            //     if (request.nextUrl.pathname.startsWith('/admin')) {
            //         console.log('Cliente intentando acceder a ruta admin, redirigiendo a /user/dashboard');
            //         return NextResponse.redirect(new URL('/user/dashboard', request.url));
            //     }
            // }


            if (userData.rol === 'Admin') {
                // Si es admin y trata de acceder a rutas de usuario
                if (request.nextUrl.pathname.startsWith('/user')) {
                    console.log('Admin intentando acceder a ruta de usuario');
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                }
            } else {
                // Si es usuario y trata de acceder a rutas de admin
                if (request.nextUrl.pathname.startsWith('/admin')) {
                    console.log('Usuario intentando acceder a ruta de admin');
                    return NextResponse.redirect(new URL('/user/dashboard', request.url));
                }
            }

        }
    } catch (error) {
        // Si hay error al parsear el JSON, redirigir a login
        console.error('Error en middleware:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // '/admin/:path*',
        // '/user/:path*',
        // '/client/:path*',
        // '/dashboard/:path*'
        '/admin/:path*',
        '/user/:path*',
        '/dashboard/:path*',
        '/login'
    ]
};