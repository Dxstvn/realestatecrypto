/**
 * Cache Utilities - PropertyChain
 * 
 * Central cache management and utilities
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

// Re-export all cache modules
export * from './redis'
export * from './api-cache'
export * from './isr-config'
export * from './cdn-config'

// Import for utility functions
import { 
  withCache, 
  invalidateCacheByTag, 
  CACHE_CONFIG,
  generateCacheKey 
} from './redis'
import { 
  withAPICache, 
  invalidateAPICache,
  API_CACHE_CONFIG 
} from './api-cache'
import { 
  getPageISRConfig, 
  REVALIDATION_PATHS,
  ISR_INTERVALS 
} from './isr-config'
import { 
  CDNPurge, 
  generateCacheTags,
  CDN_CACHE_DURATIONS 
} from './cdn-config'

/**
 * Cache manager for coordinated cache operations
 */
export class CacheManager {
  private cdnPurge: CDNPurge
  
  constructor() {
    this.cdnPurge = new CDNPurge()
  }
  
  /**
   * Invalidate all cache layers for a resource
   */
  async invalidateResource(
    type: 'property' | 'user' | 'transaction' | 'market',
    id?: string
  ): Promise<void> {
    const operations: Promise<any>[] = []
    
    // Generate paths for revalidation
    const paths = id 
      ? REVALIDATION_PATHS[type](id as any)
      : REVALIDATION_PATHS[type]('') as string[]
    
    // 1. Invalidate Redis cache
    const tags = generateCacheTags(type, id)
    operations.push(
      ...tags.map(tag => invalidateCacheByTag(tag))
    )
    
    // 2. Invalidate API cache
    operations.push(
      invalidateAPICache(paths)
    )
    
    // 3. Purge CDN cache
    operations.push(
      this.cdnPurge.purgeTags(tags)
    )
    
    // 4. Trigger ISR revalidation
    operations.push(
      this.revalidatePages(paths)
    )
    
    await Promise.all(operations)
  }
  
  /**
   * Revalidate Next.js pages
   */
  private async revalidatePages(paths: string[]): Promise<void> {
    const revalidatePromises = paths.map(path => 
      fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
        method: 'POST',
        headers: {
          'x-revalidate-secret': process.env.REVALIDATE_SECRET || ''
        }
      }).catch(error => {
        console.error(`Failed to revalidate ${path}:`, error)
      })
    )
    
    await Promise.all(revalidatePromises)
  }
  
  /**
   * Warm cache for critical data
   */
  async warmCache(): Promise<void> {
    const warmupTasks = [
      // Warm property listings
      this.warmPropertyCache(),
      
      // Warm user profiles
      this.warmUserCache(),
      
      // Warm market data
      this.warmMarketCache()
    ]
    
    await Promise.all(warmupTasks)
  }
  
  private async warmPropertyCache(): Promise<void> {
    try {
      // Fetch featured properties
      const featured = await fetch('/api/properties?featured=true')
        .then(res => res.json())
      
      // Cache each property
      for (const property of featured.properties || []) {
        const key = generateCacheKey('property', property.id)
        await withCache(
          key,
          async () => property,
          { ttl: CACHE_CONFIG.ttl.long }
        )
      }
    } catch (error) {
      console.error('Failed to warm property cache:', error)
    }
  }
  
  private async warmUserCache(): Promise<void> {
    try {
      // Fetch active users
      const users = await fetch('/api/users?active=true&limit=50')
        .then(res => res.json())
      
      // Cache user profiles
      for (const user of users.users || []) {
        const key = generateCacheKey('user', user.id)
        await withCache(
          key,
          async () => user,
          { ttl: CACHE_CONFIG.ttl.medium }
        )
      }
    } catch (error) {
      console.error('Failed to warm user cache:', error)
    }
  }
  
  private async warmMarketCache(): Promise<void> {
    try {
      // Fetch market data
      const marketData = await fetch('/api/market/overview')
        .then(res => res.json())
      
      const key = generateCacheKey('api', 'market-overview')
      await withCache(
        key,
        async () => marketData,
        { ttl: CACHE_CONFIG.ttl.short }
      )
    } catch (error) {
      console.error('Failed to warm market cache:', error)
    }
  }
  
  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    redis: { connected: boolean; keys?: number }
    cdn: { provider: string; active: boolean }
    memory: { size: number; hits: number; misses: number }
  }> {
    // This would connect to monitoring services
    return {
      redis: {
        connected: true,
        keys: 0
      },
      cdn: {
        provider: process.env.CDN_PROVIDER || 'vercel',
        active: true
      },
      memory: {
        size: 0,
        hits: 0,
        misses: 0
      }
    }
  }
}

/**
 * React hooks for cache management
 */
import { useCallback, useEffect, useState } from 'react'

/**
 * Hook to manage cached data
 */
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number
    revalidateOnFocus?: boolean
    revalidateOnReconnect?: boolean
    refreshInterval?: number
  }
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const {
    ttl = CACHE_CONFIG.ttl.medium,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval
  } = options || {}
  
  const loadData = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await withCache(
        key,
        fetcher,
        { ttl, force }
      )
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl])
  
  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])
  
  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return
    
    const handleFocus = () => loadData(true)
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [revalidateOnFocus, loadData])
  
  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return
    
    const handleOnline = () => loadData(true)
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [revalidateOnReconnect, loadData])
  
  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return
    
    const interval = setInterval(() => loadData(true), refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval, loadData])
  
  return {
    data,
    loading,
    error,
    mutate: () => loadData(true)
  }
}

/**
 * Hook to invalidate cache
 */
export function useCacheInvalidation() {
  const [invalidating, setInvalidating] = useState(false)
  const cacheManager = new CacheManager()
  
  const invalidate = useCallback(async (
    type: Parameters<CacheManager['invalidateResource']>[0],
    id?: string
  ) => {
    setInvalidating(true)
    try {
      await cacheManager.invalidateResource(type, id)
    } finally {
      setInvalidating(false)
    }
  }, [])
  
  return { invalidate, invalidating }
}

/**
 * Cache configuration for Next.js
 */
export const nextCacheConfig = {
  // Default revalidate interval
  revalidate: ISR_INTERVALS.standard,
  
  // API route caching
  api: {
    ...API_CACHE_CONFIG,
    defaultTTL: CACHE_CONFIG.ttl.medium
  },
  
  // CDN configuration
  cdn: {
    ...CDN_CACHE_DURATIONS,
    provider: process.env.CDN_PROVIDER || 'vercel'
  },
  
  // Redis configuration
  redis: {
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
    enabled: Boolean(process.env.REDIS_URL && process.env.REDIS_TOKEN)
  }
}

/**
 * Performance monitoring for cache
 */
export class CacheMonitor {
  private hits = 0
  private misses = 0
  private errors = 0
  
  recordHit(): void {
    this.hits++
  }
  
  recordMiss(): void {
    this.misses++
  }
  
  recordError(): void {
    this.errors++
  }
  
  getMetrics(): {
    hits: number
    misses: number
    errors: number
    hitRate: number
  } {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      errors: this.errors,
      hitRate: total > 0 ? this.hits / total : 0
    }
  }
  
  reset(): void {
    this.hits = 0
    this.misses = 0
    this.errors = 0
  }
}

// Create singleton instances
export const cacheManager = new CacheManager()
export const cacheMonitor = new CacheMonitor()

// Export default configuration
export default {
  CacheManager,
  CacheMonitor,
  cacheManager,
  cacheMonitor,
  useCachedData,
  useCacheInvalidation,
  nextCacheConfig
}