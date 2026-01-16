import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_TOKEN_KEY } from '@/types'

export default function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl

    // ==============================
    // Allow static assets and API
    // ==============================
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/img') ||
        pathname.startsWith('/logo') ||
        pathname.startsWith('/video') ||
        pathname.startsWith('/public') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|mp4|pdf)$/)
    ) {
        return NextResponse.next()
    }

    const token = request.cookies.get(AUTH_TOKEN_KEY)?.value

    // ==============================
    // Check if accessing dashboard (protected route)
    // ==============================
    const isDashboardRoute = pathname.startsWith('/dashboard')

    // ==============================
    // Not authenticated and accessing dashboard -> redirect to login with callbackUrl
    // ==============================
    // ==============================
    // Not authenticated and accessing dashboard -> redirect to login (now root) with callbackUrl
    // ==============================
    if (!token && isDashboardRoute) {
        const loginUrl = new URL('/', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ==============================
    // Authenticated user visiting auth pages or root -> redirect to dashboard
    // ==============================
    if (token && (pathname === '/' || pathname === '/signin' || pathname === '/signup' || pathname === '/verify' || pathname === '/forgot-password')) {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    // ==============================
    // Redirect /signin to / (root is now signin)
    // ==============================
    if (pathname === '/signin') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // ==============================
    // Not authenticated and accessing root -> allow
    // ==============================
    if (!token && pathname === '/') {
        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

