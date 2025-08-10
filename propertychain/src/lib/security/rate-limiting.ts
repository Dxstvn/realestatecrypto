/**
 * Rate Limiting Service - PropertyChain
 * 
 * Comprehensive rate limiting with Redis and in-memory fallback
 * Following UpdatedUIPlan.md Step 66 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRedisClient } from '@/lib/cache/redis'
import { LRUCache } from 'lru-cache'

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Max requests per window
  message?: string // Custom error message
  statusCode?: number // HTTP status code for rate limit exceeded
  headers?: boolean // Whether to add rate limit headers
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  skip?: (req: NextRequest) => boolean // Skip rate limiting condition
  onLimitReached?: (req: NextRequest) => void // Callback when limit reached
}

/**
 * Rate limit result
 */
interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  total: number
}

/**
 * In-memory cache for fallback when Redis is unavailable
 */
const memoryStore = new LRUCache<string, { count: number; reset: number }>({
  max: 10000, // Maximum keys
  ttl: 60 * 60 * 1000, // 1 hour TTL
})

/**
 * Rate limiter class
 */
export class RateLimiter {
  private config: Required<RateLimitConfig>
  
  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      max: config.max,
      message: config.message || 'Too many requests, please try again later.',
      statusCode: config.statusCode || 429,
      headers: config.headers !== false,
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator,
      skip: config.skip || (() => false),
      onLimitReached: config.onLimitReached || (() => {}),
    }
  }
  
  /**
   * Check rate limit for request
   */
  async check(req: NextRequest): Promise<RateLimitResult> {
    // Skip if condition met
    if (this.config.skip(req)) {
      return {
        success: true,
        limit: this.config.max,
        remaining: this.config.max,
        reset: Date.now() + this.config.windowMs,
        total: 0,
      }
    }
    
    const key = this.config.keyGenerator(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    try {
      // Try Redis first
      const redis = getRedisClient()
      if (redis) {
        return await this.checkWithRedis(redis, key, now, windowStart)
      } else {
        return this.checkWithMemory(key, now, windowStart)
      }
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Fail open - allow request if rate limiting fails
      return {
        success: true,
        limit: this.config.max,
        remaining: this.config.max - 1,
        reset: now + this.config.windowMs,
        total: 1,
      }
    }
  }
  
  /**
   * Create rate limit middleware
   */
  middleware() {
    return async (req: NextRequest) => {
      const result = await this.check(req)
      
      if (!result.success) {
        this.config.onLimitReached(req)
        
        const response = NextResponse.json(
          { error: this.config.message },
          { status: this.config.statusCode }
        )
        
        if (this.config.headers) {
          this.addHeaders(response, result)
        }
        
        return response
      }
      
      // Add rate limit headers to successful requests
      if (this.config.headers) {
        const response = NextResponse.next()
        this.addHeaders(response, result)
        return response
      }
      
      return NextResponse.next()
    }
  }
  
  /**
   * Check rate limit using Redis
   */
  private async checkWithRedis(
    redis: any,
    key: string,
    now: number,
    windowStart: number
  ): Promise<RateLimitResult> {
    const windowKey = `rate_limit:${key}:${Math.floor(now / this.config.windowMs)}`
    
    try {
      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline()
      pipeline.incr(windowKey)
      pipeline.expire(windowKey, Math.ceil(this.config.windowMs / 1000))
      
      const results = await pipeline.exec()
      const count = results[0][1] as number
      
      const remaining = Math.max(0, this.config.max - count)
      const reset = Math.floor(now / this.config.windowMs) * this.config.windowMs + this.config.windowMs
      
      return {
        success: count <= this.config.max,
        limit: this.config.max,
        remaining,
        reset,
        total: count,
      }
    } catch (error) {
      console.error('Redis rate limiting error:', error)
      // Fallback to memory store
      return this.checkWithMemory(key, now, windowStart)
    }
  }
  
  /**
   * Check rate limit using memory store
   */
  private checkWithMemory(
    key: string,
    now: number,
    windowStart: number
  ): RateLimitResult {
    const windowKey = `${key}:${Math.floor(now / this.config.windowMs)}`
    const current = memoryStore.get(windowKey) || { count: 0, reset: now + this.config.windowMs }
    
    // Reset if window expired
    if (current.reset <= now) {
      current.count = 0
      current.reset = now + this.config.windowMs
    }
    
    current.count++
    memoryStore.set(windowKey, current)
    
    const remaining = Math.max(0, this.config.max - current.count)
    
    return {
      success: current.count <= this.config.max,
      limit: this.config.max,
      remaining,
      reset: current.reset,
      total: current.count,
    }
  }
  
  /**
   * Default key generator
   */
  private defaultKeyGenerator(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
              req.headers.get('x-real-ip') || 
              req.ip || 
              'unknown'
    return `ip:${ip}`
  }
  
  /**
   * Add rate limit headers to response
   */
  private addHeaders(response: NextResponse, result: RateLimitResult): void {
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.reset.toString())
    response.headers.set('X-RateLimit-Policy', `${this.config.max};w=${this.config.windowMs}`)
  }
}

/**
 * Predefined rate limiters for common scenarios
 */
export const rateLimiters = {
  // General API rate limiting
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 minutes
    message: 'API rate limit exceeded. Please try again in 15 minutes.',
  }),
  
  // Authentication endpoints
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 login attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    onLimitReached: (req) => {
      console.warn('Auth rate limit exceeded:', {
        ip: req.ip,
        userAgent: req.headers.get('user-agent'),
        path: req.nextUrl.pathname,
      })
    },
  }),
  
  // Password reset
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 password reset attempts per hour
    message: 'Too many password reset attempts. Please try again in 1 hour.',
  }),
  
  // Email sending
  email: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 emails per hour
    message: 'Email rate limit exceeded. Please try again later.',
  }),
  
  // File uploads
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: 'File upload rate limit exceeded. Please try again later.',
  }),
  
  // Blockchain transactions
  transaction: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 transactions per minute
    message: 'Transaction rate limit exceeded. Please wait before submitting another transaction.',
  }),
  
  // Search and queries
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 searches per minute
    message: 'Search rate limit exceeded. Please slow down.',
  }),
  
  // Admin operations
  admin: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 admin operations per minute
    message: 'Admin operation rate limit exceeded.',
    skip: (req) => {
      // Skip for localhost in development
      const ip = req.headers.get('x-forwarded-for') || req.ip
      return process.env.NODE_ENV === 'development' && 
             (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost')
    },
  }),
}

/**
 * Create custom rate limiter with specific configuration
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config)
}

/**
 * Rate limiting middleware factory
 */
export function rateLimit(config: RateLimitConfig) {
  const limiter = new RateLimiter(config)
  return limiter.middleware()
}

/**
 * IP-based rate limiting with progressive penalties
 */
export class ProgressiveRateLimiter {
  private violations = new LRUCache<string, number>({
    max: 1000,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
  })
  
  /**
   * Get rate limit multiplier based on violations
   */
  getMultiplier(ip: string): number {
    const violations = this.violations.get(ip) || 0
    
    if (violations >= 10) return 0.1 // Very aggressive limiting
    if (violations >= 5) return 0.2 // Aggressive limiting
    if (violations >= 3) return 0.5 // Moderate limiting
    if (violations >= 1) return 0.8 // Light limiting
    
    return 1 // No limiting
  }
  
  /**
   * Record a violation
   */
  recordViolation(ip: string): void {
    const current = this.violations.get(ip) || 0
    this.violations.set(ip, current + 1)
  }
  
  /**
   * Clear violations for IP (for good behavior)
   */
  clearViolations(ip: string): void {
    this.violations.delete(ip)
  }
}

export const progressiveLimiter = new ProgressiveRateLimiter()

/**
 * Utility function to extract client IP
 */
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const real = req.headers.get('x-real-ip')
  const cf = req.headers.get('cf-connecting-ip') // Cloudflare
  
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim())
    return ips[0]
  }
  
  return cf || real || req.ip || 'unknown'
}

/**
 * Check if IP is whitelisted
 */
export function isWhitelisted(ip: string): boolean {
  const whitelist = (process.env.IP_WHITELIST || '').split(',').map(ip => ip.trim())
  
  // Always allow localhost in development
  if (process.env.NODE_ENV === 'development') {
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
      return true
    }
  }
  
  return whitelist.includes(ip)
}

export default RateLimiter