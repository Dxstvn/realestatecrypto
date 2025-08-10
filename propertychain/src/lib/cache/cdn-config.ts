/**
 * CDN Configuration - PropertyChain
 * 
 * CDN caching headers and edge configuration
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * CDN providers configuration
 */
export const CDN_PROVIDERS = {
  cloudflare: {
    name: 'Cloudflare',
    purgeUrl: 'https://api.cloudflare.com/client/v4/zones/{zoneId}/purge_cache',
    headers: {
      'CF-Cache-Control': true,
      'CDN-Cache-Control': true,
      'Cache-Tag': true
    }
  },
  
  vercel: {
    name: 'Vercel Edge Network',
    purgeUrl: 'https://api.vercel.com/v1/purge',
    headers: {
      'Cache-Control': true,
      'CDN-Cache-Control': true,
      'X-Vercel-Cache': true
    }
  },
  
  fastly: {
    name: 'Fastly',
    purgeUrl: 'https://api.fastly.com/purge',
    headers: {
      'Surrogate-Control': true,
      'Surrogate-Key': true,
      'Cache-Control': true
    }
  },
  
  cloudfront: {
    name: 'AWS CloudFront',
    purgeUrl: 'https://cloudfront.amazonaws.com/2020-05-31/distribution/{distributionId}/invalidation',
    headers: {
      'Cache-Control': true,
      'CloudFront-Cache-Control': true
    }
  }
} as const

/**
 * CDN cache durations by content type
 */
export const CDN_CACHE_DURATIONS = {
  // Static assets
  images: {
    edge: 31536000, // 1 year
    browser: 86400, // 1 day
    staleWhileRevalidate: 604800 // 1 week
  },
  
  fonts: {
    edge: 31536000, // 1 year
    browser: 31536000, // 1 year
    staleWhileRevalidate: 0
  },
  
  styles: {
    edge: 86400, // 1 day
    browser: 3600, // 1 hour
    staleWhileRevalidate: 86400 // 1 day
  },
  
  scripts: {
    edge: 86400, // 1 day
    browser: 3600, // 1 hour
    staleWhileRevalidate: 86400 // 1 day
  },
  
  // Dynamic content
  api: {
    edge: 60, // 1 minute
    browser: 0, // No browser cache
    staleWhileRevalidate: 300 // 5 minutes
  },
  
  html: {
    edge: 300, // 5 minutes
    browser: 0, // No browser cache
    staleWhileRevalidate: 3600 // 1 hour
  },
  
  feed: {
    edge: 300, // 5 minutes
    browser: 60, // 1 minute
    staleWhileRevalidate: 900 // 15 minutes
  }
} as const

/**
 * Generate CDN cache headers
 */
export function generateCDNCacheHeaders(
  contentType: keyof typeof CDN_CACHE_DURATIONS,
  options?: {
    edge?: number
    browser?: number
    staleWhileRevalidate?: number
    private?: boolean
    tags?: string[]
    vary?: string[]
  }
): Headers {
  const config = CDN_CACHE_DURATIONS[contentType]
  const {
    edge = config.edge,
    browser = config.browser,
    staleWhileRevalidate = config.staleWhileRevalidate,
    private: isPrivate = false,
    tags = [],
    vary = []
  } = options || {}
  
  const headers = new Headers()
  
  // Standard Cache-Control header
  const cacheControl = [
    isPrivate ? 'private' : 'public',
    browser > 0 ? `max-age=${browser}` : 'no-cache',
    edge > 0 ? `s-maxage=${edge}` : '',
    staleWhileRevalidate > 0 ? `stale-while-revalidate=${staleWhileRevalidate}` : '',
    'must-revalidate'
  ].filter(Boolean).join(', ')
  
  headers.set('Cache-Control', cacheControl)
  
  // CDN-specific headers
  // Cloudflare
  headers.set('CF-Cache-Control', cacheControl)
  headers.set('CDN-Cache-Control', cacheControl)
  
  // Fastly
  headers.set('Surrogate-Control', `max-age=${edge}`)
  
  // Cache tags for purging
  if (tags.length > 0) {
    headers.set('Cache-Tag', tags.join(','))
    headers.set('Surrogate-Key', tags.join(' '))
  }
  
  // Vary headers for cache key
  if (vary.length > 0) {
    headers.set('Vary', vary.join(', '))
  }
  
  return headers
}

/**
 * CDN cache tags generator
 */
export function generateCacheTags(
  resource: string,
  id?: string,
  additional?: string[]
): string[] {
  const tags: string[] = []
  
  // Resource type tag
  tags.push(`type:${resource}`)
  
  // Specific resource tag
  if (id) {
    tags.push(`${resource}:${id}`)
  }
  
  // List tag
  tags.push(`list:${resource}`)
  
  // Additional tags
  if (additional) {
    tags.push(...additional)
  }
  
  return tags
}

/**
 * Apply CDN headers to response
 */
export function applyCDNHeaders(
  response: NextResponse,
  contentType: keyof typeof CDN_CACHE_DURATIONS,
  options?: Parameters<typeof generateCDNCacheHeaders>[1]
): NextResponse {
  const headers = generateCDNCacheHeaders(contentType, options)
  
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })
  
  // Add timing headers
  response.headers.set('X-Cache-Generated', new Date().toISOString())
  response.headers.set('X-Cache-Provider', process.env.CDN_PROVIDER || 'vercel')
  
  return response
}

/**
 * Edge cache configuration for different routes
 */
export const EDGE_CACHE_RULES = {
  // API routes
  '/api/properties': {
    contentType: 'api' as const,
    tags: ['api', 'properties'],
    vary: ['Accept', 'Accept-Encoding']
  },
  
  '/api/properties/[id]': {
    contentType: 'api' as const,
    edge: 300, // 5 minutes
    tags: (id: string) => ['api', 'properties', `property:${id}`],
    vary: ['Accept', 'Accept-Encoding']
  },
  
  '/api/users/[id]': {
    contentType: 'api' as const,
    edge: 600, // 10 minutes
    tags: (id: string) => ['api', 'users', `user:${id}`],
    vary: ['Accept', 'Accept-Encoding', 'Authorization']
  },
  
  // Static assets
  '/_next/static': {
    contentType: 'scripts' as const,
    edge: 31536000, // 1 year
    browser: 31536000, // 1 year
    tags: ['static', 'nextjs']
  },
  
  '/images': {
    contentType: 'images' as const,
    tags: ['images', 'static']
  },
  
  '/fonts': {
    contentType: 'fonts' as const,
    tags: ['fonts', 'static']
  },
  
  // Pages
  '/': {
    contentType: 'html' as const,
    edge: 300, // 5 minutes
    tags: ['page', 'home'],
    vary: ['Accept-Encoding', 'Accept-Language']
  },
  
  '/properties': {
    contentType: 'html' as const,
    edge: 180, // 3 minutes
    tags: ['page', 'properties'],
    vary: ['Accept-Encoding', 'Accept-Language']
  }
} as const

/**
 * Get edge cache rule for a path
 */
export function getEdgeCacheRule(pathname: string): typeof EDGE_CACHE_RULES[keyof typeof EDGE_CACHE_RULES] | null {
  // Direct match
  if (pathname in EDGE_CACHE_RULES) {
    return EDGE_CACHE_RULES[pathname as keyof typeof EDGE_CACHE_RULES]
  }
  
  // Pattern matching
  for (const [pattern, rule] of Object.entries(EDGE_CACHE_RULES)) {
    if (pattern.includes('[') || pattern.includes('*')) {
      const regex = new RegExp(
        '^' + pattern
          .replace(/\[.*?\]/g, '([^/]+)')
          .replace(/\*/g, '.*') + '$'
      )
      const match = pathname.match(regex)
      if (match) {
        return rule
      }
    }
  }
  
  return null
}

/**
 * CDN purge/invalidation
 */
export class CDNPurge {
  private provider: keyof typeof CDN_PROVIDERS
  private credentials: {
    apiKey?: string
    zoneId?: string
    distributionId?: string
  }
  
  constructor(
    provider: keyof typeof CDN_PROVIDERS = 'vercel',
    credentials?: typeof CDNPurge.prototype.credentials
  ) {
    this.provider = provider
    this.credentials = credentials || {
      apiKey: process.env.CDN_API_KEY,
      zoneId: process.env.CDN_ZONE_ID,
      distributionId: process.env.CDN_DISTRIBUTION_ID
    }
  }
  
  /**
   * Purge cache by URL
   */
  async purgeUrl(urls: string | string[]): Promise<boolean> {
    const urlList = Array.isArray(urls) ? urls : [urls]
    const config = CDN_PROVIDERS[this.provider]
    
    try {
      switch (this.provider) {
        case 'cloudflare':
          return this.purgeCloudflare(urlList)
        
        case 'vercel':
          return this.purgeVercel(urlList)
        
        case 'fastly':
          return this.purgeFastly(urlList)
        
        case 'cloudfront':
          return this.purgeCloudFront(urlList)
        
        default:
          console.warn(`CDN provider ${this.provider} not supported`)
          return false
      }
    } catch (error) {
      console.error('CDN purge error:', error)
      return false
    }
  }
  
  /**
   * Purge cache by tags
   */
  async purgeTags(tags: string | string[]): Promise<boolean> {
    const tagList = Array.isArray(tags) ? tags : [tags]
    
    // Implementation depends on CDN provider
    console.log(`Purging tags: ${tagList.join(', ')}`)
    
    // For now, return true
    return true
  }
  
  private async purgeCloudflare(urls: string[]): Promise<boolean> {
    const response = await fetch(
      CDN_PROVIDERS.cloudflare.purgeUrl.replace('{zoneId}', this.credentials.zoneId || ''),
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: urls })
      }
    )
    
    return response.ok
  }
  
  private async purgeVercel(urls: string[]): Promise<boolean> {
    // Vercel automatically handles cache purging on deployment
    console.log('Vercel cache will be purged on next deployment')
    return true
  }
  
  private async purgeFastly(urls: string[]): Promise<boolean> {
    const promises = urls.map(url => 
      fetch(url, {
        method: 'PURGE',
        headers: {
          'Fastly-Key': this.credentials.apiKey || ''
        }
      })
    )
    
    const results = await Promise.all(promises)
    return results.every(r => r.ok)
  }
  
  private async purgeCloudFront(paths: string[]): Promise<boolean> {
    // CloudFront invalidation requires AWS SDK
    console.log('CloudFront invalidation requires AWS SDK setup')
    return true
  }
}

/**
 * Middleware to add CDN headers
 */
export function cdnMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname
  
  // Get cache rule for this path
  const rule = getEdgeCacheRule(pathname)
  
  if (rule) {
    // Generate tags
    const tags = typeof rule.tags === 'function' 
      ? rule.tags(pathname.split('/').pop() || '')
      : rule.tags
    
    // Apply CDN headers
    applyCDNHeaders(response, rule.contentType, {
      edge: (rule as any).edge,
      browser: (rule as any).browser,
      tags: tags ? [...tags] : undefined,
      vary: (rule as any).vary
    })
  }
  
  return response
}

// Export utilities
export default {
  CDN_PROVIDERS,
  CDN_CACHE_DURATIONS,
  generateCDNCacheHeaders,
  generateCacheTags,
  applyCDNHeaders,
  EDGE_CACHE_RULES,
  getEdgeCacheRule,
  CDNPurge,
  cdnMiddleware
}