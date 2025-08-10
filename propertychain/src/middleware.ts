/**
 * Security Middleware - PropertyChain
 * 
 * Comprehensive security middleware with authentication, rate limiting, CSRF protection,
 * and security headers following UpdatedUIPlan.md Step 66 and CLAUDE.md security standards
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cdnMiddleware } from '@/lib/cache/cdn-config'
import { rateLimiters } from '@/lib/security/rate-limiting'
import { csrfProtection } from '@/lib/security/csrf'
import { getSecurityHeadersForEnv } from '@/lib/security/headers'

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

// KYC required routes
const kycRequiredRoutes = [
  '/properties/invest',
  '/transactions/create',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Apply rate limiting
  if (pathname.startsWith('/api/')) {
    // Use different rate limiters based on endpoint
    let limiter = rateLimiters.api
    
    if (pathname.includes('/auth')) {
      limiter = rateLimiters.auth
    } else if (pathname.includes('/upload')) {
      limiter = rateLimiters.upload
    } else if (pathname.includes('/search')) {
      limiter = rateLimiters.search
    } else if (pathname.includes('/transaction')) {
      limiter = rateLimiters.transaction
    }
    
    const rateLimitResult = await limiter.check(request)
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString())
      
      return response
    }
  }
  
  // Apply CSRF protection for state-changing requests
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && 
      !pathname.startsWith('/api/csrf') &&
      !pathname.startsWith('/api/health')) {
    
    const csrfResult = await csrfProtection.validateRequest(request)
    
    if (!csrfResult) {
      return NextResponse.json(
        { error: 'CSRF token validation failed' },
        { status: 403 }
      )
    }
  }
  
  // Apply CDN caching headers for static content
  let response = NextResponse.next()
  if (pathname.startsWith('/api/') || pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    response = cdnMiddleware(request)
  }
  
  // Get JWT token from NextAuth
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isAuthenticated = !!token
  const userRole = token?.role as string | undefined
  const kycStatus = token?.kycStatus as string | undefined
  const isAdmin = userRole === 'ADMIN'
  const isKYCVerified = kycStatus === 'VERIFIED'
  
  // Protect admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('error', 'SessionRequired')
      return NextResponse.redirect(url)
    }
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Check KYC requirements
  if (kycRequiredRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('error', 'SessionRequired')
      return NextResponse.redirect(url)
    }
    
    if (!isKYCVerified) {
      const url = new URL('/onboarding/kyc', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('reason', 'KYCRequired')
      return NextResponse.redirect(url)
    }
  }
  
  // Protect authenticated routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      url.searchParams.set('error', 'SessionRequired')
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
  
  // Apply comprehensive security headers
  const securityHeaders = getSecurityHeadersForEnv()
  response = securityHeaders.apply(request, response)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * 
     * Note: API routes are now included for rate limiting and caching
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}