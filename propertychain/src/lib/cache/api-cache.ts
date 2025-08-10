/**
 * API Cache Layer - PropertyChain
 * 
 * Caching middleware and utilities for API routes
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  withCache, 
  generateCacheKey, 
  invalidateCacheByTag,
  CACHE_CONFIG,
  checkRateLimit 
} from './redis'

/**
 * API cache configuration
 */
export const API_CACHE_CONFIG = {
  // Cache durations for different endpoints
  durations: {
    properties: CACHE_CONFIG.ttl.medium, // 5 minutes
    propertyDetail: CACHE_CONFIG.ttl.long, // 1 hour
    userProfile: CACHE_CONFIG.ttl.medium, // 5 minutes
    transactions: CACHE_CONFIG.ttl.short, // 1 minute
    analytics: CACHE_CONFIG.ttl.long, // 1 hour
    marketData: CACHE_CONFIG.ttl.short, // 1 minute
    static: CACHE_CONFIG.ttl.day, // 24 hours
  },
  
  // Endpoints that should be cached
  cacheable: [
    '/api/properties',
    '/api/properties/[id]',
    '/api/users/[id]/public',
    '/api/analytics',
    '/api/market',
    '/api/featured',
    '/api/categories',
  ],
  
  // Endpoints that should never be cached
  excluded: [
    '/api/auth',
    '/api/transactions/create',
    '/api/admin',
    '/api/webhooks',
    '/api/upload',
  ],
  
  // Methods that can be cached
  methods: ['GET', 'HEAD'],
} as const

/**
 * Check if request should be cached
 */
export function shouldCacheRequest(req: NextRequest): boolean {
  const { pathname } = req.nextUrl
  const method = req.method
  
  // Check method
  if (!API_CACHE_CONFIG.methods.includes(method as any)) {
    return false
  }
  
  // Check excluded paths
  if (API_CACHE_CONFIG.excluded.some(path => pathname.startsWith(path))) {
    return false
  }
  
  // Check if path matches cacheable patterns
  const isCacheable = API_CACHE_CONFIG.cacheable.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$')
    return regex.test(pathname)
  })
  
  return isCacheable
}

/**
 * Get cache duration for endpoint
 */
export function getCacheDuration(pathname: string): number {
  if (pathname.includes('/properties/') && pathname !== '/properties') {
    return API_CACHE_CONFIG.durations.propertyDetail
  }
  
  if (pathname.includes('/properties')) {
    return API_CACHE_CONFIG.durations.properties
  }
  
  if (pathname.includes('/users') && pathname.includes('/public')) {
    return API_CACHE_CONFIG.durations.userProfile
  }
  
  if (pathname.includes('/transactions')) {
    return API_CACHE_CONFIG.durations.transactions
  }
  
  if (pathname.includes('/analytics')) {
    return API_CACHE_CONFIG.durations.analytics
  }
  
  if (pathname.includes('/market')) {
    return API_CACHE_CONFIG.durations.marketData
  }
  
  // Default cache duration
  return CACHE_CONFIG.ttl.medium
}

/**
 * Generate cache key for API request
 */
export function generateAPICacheKey(req: NextRequest): string {
  const { pathname, searchParams } = req.nextUrl
  const params: Record<string, string> = {}
  
  // Include search params in cache key
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  // Include important headers
  const acceptHeader = req.headers.get('accept')
  if (acceptHeader) {
    params._accept = acceptHeader
  }
  
  return generateCacheKey('api', pathname, params)
}

/**
 * Cache middleware for API routes
 */
export async function withAPICache<T>(
  req: NextRequest,
  handler: () => Promise<T>,
  options?: {
    ttl?: number
    tags?: string[]
    revalidate?: boolean
  }
): Promise<T> {
  // Check if caching should be applied
  if (!shouldCacheRequest(req)) {
    return handler()
  }
  
  const cacheKey = generateAPICacheKey(req)
  const ttl = options?.ttl || getCacheDuration(req.nextUrl.pathname)
  const tags = options?.tags || []
  
  // Add automatic tags based on endpoint
  if (req.nextUrl.pathname.includes('/properties')) {
    tags.push(CACHE_CONFIG.tags.properties)
  }
  if (req.nextUrl.pathname.includes('/users')) {
    tags.push(CACHE_CONFIG.tags.users)
  }
  
  return withCache(
    cacheKey,
    handler,
    {
      ttl,
      tags,
      force: options?.revalidate
    }
  )
}

/**
 * API response with cache headers
 */
export function cachedResponse(
  data: any,
  options?: {
    status?: number
    headers?: HeadersInit
    maxAge?: number
    sMaxAge?: number
    staleWhileRevalidate?: number
  }
): NextResponse {
  const {
    status = 200,
    headers = {},
    maxAge = 0,
    sMaxAge = 60,
    staleWhileRevalidate = 86400
  } = options || {}
  
  const response = NextResponse.json(data, { status, headers })
  
  // Set cache control headers
  const cacheControl = [
    maxAge > 0 ? `max-age=${maxAge}` : 'no-cache',
    `s-maxage=${sMaxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
    'public'
  ].join(', ')
  
  response.headers.set('Cache-Control', cacheControl)
  response.headers.set('X-Cache-Status', 'HIT')
  
  // Add CDN cache tags
  response.headers.set('CDN-Cache-Tag', 'api')
  
  return response
}

/**
 * Invalidate API cache
 */
export async function invalidateAPICache(patterns: string[]): Promise<void> {
  const invalidations = patterns.map(pattern => {
    if (pattern.startsWith('tag:')) {
      return invalidateCacheByTag(pattern)
    }
    
    // Convert API path to cache key pattern
    const cachePattern = `api:${pattern}*`
    return invalidateCacheByTag(cachePattern)
  })
  
  await Promise.all(invalidations)
}

/**
 * Rate limiting middleware
 */
export async function withRateLimit(
  req: NextRequest,
  options?: {
    identifier?: string
    limit?: number
    window?: number
  }
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const {
    identifier = req.ip || 'anonymous',
    limit = 100,
    window = 60
  } = options || {}
  
  const result = await checkRateLimit(identifier, limit, window)
  
  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: result.reset
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': (result.reset - Math.floor(Date.now() / 1000)).toString()
          }
        }
      )
    }
  }
  
  return { allowed: true }
}

/**
 * Stale-while-revalidate pattern
 */
export async function staleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number
    staleTtl?: number
    tags?: string[]
  }
): Promise<T> {
  const {
    ttl = CACHE_CONFIG.ttl.medium,
    staleTtl = CACHE_CONFIG.ttl.day,
    tags = []
  } = options || {}
  
  // Try to get cached data
  const cached = await withCache(
    key,
    async () => {
      // Check for stale data
      const staleKey = `${key}:stale`
      const staleData = await withCache(
        staleKey,
        fetcher,
        { ttl: staleTtl, tags }
      )
      
      // Trigger background revalidation
      fetcher().then(freshData => {
        withCache(key, async () => freshData, { ttl, tags })
      }).catch(console.error)
      
      return staleData
    },
    { ttl, tags }
  )
  
  return cached
}

/**
 * Cache warmer for critical endpoints
 */
export class APICacheWarmer {
  private endpoints: Array<{
    url: string
    ttl: number
    tags: string[]
  }> = []
  
  constructor(endpoints?: typeof APICacheWarmer.prototype.endpoints) {
    if (endpoints) {
      this.endpoints = endpoints
    }
  }
  
  add(url: string, ttl?: number, tags?: string[]): this {
    this.endpoints.push({
      url,
      ttl: ttl || CACHE_CONFIG.ttl.medium,
      tags: tags || []
    })
    return this
  }
  
  async warm(): Promise<void> {
    const promises = this.endpoints.map(async ({ url, ttl, tags }) => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        
        const cacheKey = generateCacheKey('api', url)
        await withCache(
          cacheKey,
          async () => data,
          { ttl, tags }
        )
      } catch (error) {
        console.error(`Failed to warm cache for ${url}:`, error)
      }
    })
    
    await Promise.all(promises)
  }
}

/**
 * Edge caching configuration for Vercel/Cloudflare
 */
export function getEdgeCacheConfig(pathname: string): {
  edge: string
  browser: string
} {
  // Static content
  if (pathname.startsWith('/api/static')) {
    return {
      edge: '1 year',
      browser: '1 day'
    }
  }
  
  // Property listings
  if (pathname.includes('/properties')) {
    return {
      edge: '5 minutes',
      browser: '1 minute'
    }
  }
  
  // User profiles
  if (pathname.includes('/users') && pathname.includes('/public')) {
    return {
      edge: '1 hour',
      browser: '5 minutes'
    }
  }
  
  // Analytics
  if (pathname.includes('/analytics')) {
    return {
      edge: '1 hour',
      browser: '5 minutes'
    }
  }
  
  // Default
  return {
    edge: '1 minute',
    browser: 'no-cache'
  }
}

// Export utilities
export default {
  shouldCacheRequest,
  getCacheDuration,
  generateAPICacheKey,
  withAPICache,
  cachedResponse,
  invalidateAPICache,
  withRateLimit,
  staleWhileRevalidate,
  APICacheWarmer,
  getEdgeCacheConfig,
  API_CACHE_CONFIG
}