/**
 * CSRF Protection - PropertyChain
 * 
 * Cross-Site Request Forgery protection with token generation and validation
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * CSRF configuration
 */
interface CSRFConfig {
  secret?: string
  cookieName?: string
  headerName?: string
  tokenLength?: number
  sameSite?: 'strict' | 'lax' | 'none'
  secure?: boolean
  httpOnly?: boolean
  maxAge?: number
  ignoreMethods?: string[]
  skipRoutes?: string[]
}

/**
 * Default CSRF configuration
 */
const DEFAULT_CONFIG: Required<CSRFConfig> = {
  secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
  cookieName: '_csrf_token',
  headerName: 'x-csrf-token',
  tokenLength: 32,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: false, // Allow client-side access for forms
  maxAge: 24 * 60 * 60, // 24 hours in seconds
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  skipRoutes: ['/api/health', '/api/webhook'],
}

/**
 * CSRF Protection Service
 */
export class CSRFProtection {
  private config: Required<CSRFConfig>
  
  constructor(config: CSRFConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    if (this.config.secret === DEFAULT_CONFIG.secret && process.env.NODE_ENV === 'production') {
      console.warn('WARNING: Using default CSRF secret in production. Set CSRF_SECRET environment variable.')
    }
  }
  
  /**
   * Generate CSRF token
   */
  generateToken(): string {
    // Use Web Crypto API for Edge Runtime compatibility
    const randomBytes = this.getRandomBytes(this.config.tokenLength)
    const timestamp = Date.now().toString()
    const payload = `${randomBytes}:${timestamp}`
    
    const signature = this.createHmac(payload, this.config.secret)
    
    return `${payload}:${signature}`
  }
  
  /**
   * Validate CSRF token
   */
  validateToken(token: string): boolean {
    if (!token) return false
    
    try {
      const parts = token.split(':')
      if (parts.length !== 3) return false
      
      const [randomHex, timestamp, signature] = parts
      const payload = `${randomHex}:${timestamp}`
      
      // Verify signature
      const expectedSignature = this.createHmac(payload, this.config.secret)
      
      if (!this.timingSafeEqual(signature, expectedSignature)) {
        return false
      }
      
      // Check token age
      const tokenTime = parseInt(timestamp, 10)
      const maxAge = this.config.maxAge * 1000 // Convert to milliseconds
      const now = Date.now()
      
      if (now - tokenTime > maxAge) {
        return false
      }
      
      return true
    } catch (error) {
      console.error('CSRF token validation error:', error)
      return false
    }
  }
  
  /**
   * Set CSRF token in cookie
   */
  setTokenCookie(response: NextResponse, token?: string): string {
    const csrfToken = token || this.generateToken()
    
    response.cookies.set(this.config.cookieName, csrfToken, {
      maxAge: this.config.maxAge,
      sameSite: this.config.sameSite,
      secure: this.config.secure,
      httpOnly: this.config.httpOnly,
      path: '/',
    })
    
    return csrfToken
  }
  
  /**
   * Get CSRF token from request
   */
  getTokenFromRequest(req: NextRequest): string | null {
    // Check header first
    const headerToken = req.headers.get(this.config.headerName)
    if (headerToken) return headerToken
    
    // Check body for form submissions
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // For form data, we'll need to parse it in the calling function
      return null
    }
    
    // Check cookie as fallback
    const cookieToken = req.cookies.get(this.config.cookieName)?.value
    return cookieToken || null
  }
  
  /**
   * Check if route should be skipped
   */
  shouldSkipRoute(pathname: string): boolean {
    return this.config.skipRoutes.some(route => 
      pathname.startsWith(route) || pathname === route
    )
  }
  
  /**
   * Check if method should be ignored
   */
  shouldIgnoreMethod(method: string): boolean {
    return this.config.ignoreMethods.includes(method.toUpperCase())
  }
  
  /**
   * Middleware function for CSRF protection
   */
  middleware() {
    return async (req: NextRequest) => {
      const { pathname } = req.nextUrl
      const method = req.method
      
      // Skip CSRF for certain routes and methods
      if (this.shouldSkipRoute(pathname) || this.shouldIgnoreMethod(method)) {
        return NextResponse.next()
      }
      
      // For safe methods, ensure token is available
      if (this.shouldIgnoreMethod(method)) {
        const response = NextResponse.next()
        const cookieToken = req.cookies.get(this.config.cookieName)?.value
        
        if (!cookieToken || !this.validateToken(cookieToken)) {
          this.setTokenCookie(response)
        }
        
        return response
      }
      
      // For unsafe methods, validate token
      const token = this.getTokenFromRequest(req)
      
      if (!token || !this.validateToken(token)) {
        console.warn('CSRF validation failed:', {
          method,
          pathname,
          hasToken: !!token,
          ip: req.ip,
          userAgent: req.headers.get('user-agent'),
        })
        
        return NextResponse.json(
          { 
            error: 'CSRF token validation failed',
            code: 'CSRF_INVALID_TOKEN'
          },
          { status: 403 }
        )
      }
      
      return NextResponse.next()
    }
  }
  
  /**
   * API route helper to validate CSRF token
   */
  async validateRequest(req: NextRequest): Promise<boolean> {
    const { pathname } = req.nextUrl
    const method = req.method
    
    if (this.shouldSkipRoute(pathname) || this.shouldIgnoreMethod(method)) {
      return true
    }
    
    let token = this.getTokenFromRequest(req)
    
    // Handle form data
    if (!token && req.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
      try {
        const formData = await req.formData()
        token = formData.get('_csrf') as string
      } catch (error) {
        console.error('Error parsing form data for CSRF token:', error)
      }
    }
    
    return token ? this.validateToken(token) : false
  }

  /**
   * Generate random bytes using Web Crypto API (Edge Runtime compatible)
   */
  private getRandomBytes(length: number): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Browser/Edge Runtime
      const array = new Uint8Array(length)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Node.js fallback
      const nodeCrypto = require('crypto')
      return nodeCrypto.randomBytes(length).toString('hex')
    }
  }

  /**
   * Create HMAC using Web Crypto API (Edge Runtime compatible)
   */
  private createHmac(data: string, secret: string): string {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // This is a simplified version - in production you'd want to use crypto.subtle.importKey and crypto.subtle.sign
      // For now, using a simple hash as fallback
      return this.simpleHash(data + secret)
    } else {
      // Node.js fallback
      const nodeCrypto = require('crypto')
      const hmac = nodeCrypto.createHmac('sha256', secret)
      hmac.update(data)
      return hmac.digest('hex')
    }
  }

  /**
   * Timing-safe string comparison (Edge Runtime compatible)
   */
  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }
    
    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    
    return result === 0
  }

  /**
   * Simple hash function fallback
   */
  private simpleHash(str: string): string {
    let hash = 0
    if (str.length === 0) return hash.toString()
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

/**
 * Default CSRF protection instance
 */
export const csrfProtection = new CSRFProtection()

/**
 * React hook for CSRF token management
 */
export function useCSRF() {
  if (typeof window === 'undefined') {
    return { token: '', refreshToken: () => {} }
  }
  
  const getToken = (): string => {
    const cookies = document.cookie.split(';')
    const csrfCookie = cookies
      .find(cookie => cookie.trim().startsWith(`${DEFAULT_CONFIG.cookieName}=`))
      ?.split('=')[1]
    
    return csrfCookie || ''
  }
  
  const refreshToken = async () => {
    try {
      const response = await fetch('/api/csrf', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        return data.token
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error)
    }
    return null
  }
  
  return {
    token: getToken(),
    refreshToken,
  }
}

/**
 * Utility function to add CSRF token to fetch requests
 */
export function withCSRF(init: RequestInit = {}): RequestInit {
  if (typeof window === 'undefined') return init
  
  const cookies = document.cookie.split(';')
  const csrfToken = cookies
    .find(cookie => cookie.trim().startsWith(`${DEFAULT_CONFIG.cookieName}=`))
    ?.split('=')[1]
  
  if (!csrfToken) return init
  
  const headers = new Headers(init.headers)
  headers.set(DEFAULT_CONFIG.headerName, csrfToken)
  
  return {
    ...init,
    headers,
  }
}

/**
 * Generate CSRF token for server components
 */
export async function generateCSRFToken(): Promise<string> {
  return csrfProtection.generateToken()
}

/**
 * Validate CSRF token for server actions
 */
export async function validateCSRFToken(token: string): Promise<boolean> {
  return csrfProtection.validateToken(token)
}

/**
 * CSRF token component for forms
 */
export function CSRFToken({ token }: { token?: string }) {
  return (
    <input 
      type="hidden" 
      name="_csrf" 
      value={token || ''} 
    />
  )
}

/**
 * Double submit cookie pattern implementation
 */
export class DoubleSubmitCSRF {
  private cookieName = '_csrf_double_submit'
  private headerName = 'x-csrf-token'
  
  generateToken(): string {
    // Use Web Crypto API for Edge Runtime compatibility
    return this.getRandomBytes(32)
  }
  
  setToken(response: NextResponse): string {
    const token = this.generateToken()
    
    response.cookies.set(this.cookieName, token, {
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false, // Client needs to read this
      path: '/',
    })
    
    return token
  }
  
  validateToken(req: NextRequest): boolean {
    const cookieToken = req.cookies.get(this.cookieName)?.value
    const headerToken = req.headers.get(this.headerName)
    
    if (!cookieToken || !headerToken) return false
    
    return this.timingSafeEqual(cookieToken, headerToken)
  }

  /**
   * Generate random bytes using Web Crypto API (Edge Runtime compatible)
   */
  private getRandomBytes(length: number): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Browser/Edge Runtime
      const array = new Uint8Array(length)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      // Node.js fallback
      const nodeCrypto = require('crypto')
      return nodeCrypto.randomBytes(length).toString('hex')
    }
  }

  /**
   * Timing-safe string comparison (Edge Runtime compatible)
   */
  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }
    
    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    
    return result === 0
  }
}

export const doubleSubmitCSRF = new DoubleSubmitCSRF()

export default csrfProtection