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
    if (!token && isDashboardRoute) {
        const loginUrl = new URL('/signin', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ==============================
    // Authenticated user visiting auth pages -> redirect to dashboard
    // ==============================
    if (token && (pathname === '/signin' || pathname === '/signup' || pathname === '/verify' || pathname === '/forgot-password')) {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

