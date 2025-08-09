/**
 * Authentication Middleware - PropertyChain
 * 
 * Protects routes and manages authentication flow
 * Following CLAUDE.md security standards
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/properties/invest',
  '/portfolio',
  '/transactions',
  '/documents',
  '/settings',
]

// Admin only routes
const adminRoutes = [
  '/dashboard/admin',
  '/admin',
]

// Auth routes (should redirect to dashboard if already authenticated)
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get authentication token from cookies
  // In production, this would validate JWT token
  const token = request.cookies.get('auth-token')
  const isAuthenticated = !!token
  
  // Check if user is admin (simplified - in production would decode JWT)
  const userRole = request.cookies.get('user-role')?.value
  const isAdmin = userRole === 'admin'
  
  // Protect admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Protect authenticated routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const from = request.nextUrl.searchParams.get('from')
      const redirectUrl = from || '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers following CLAUDE.md standards
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Updated CSP to allow Google Fonts and external resources
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https:",
    ].join('; ')
  )
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}