/**
 * Redis Cache Configuration - PropertyChain
 * 
 * Redis client setup and cache utilities
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

import { Redis } from '@upstash/redis'
import { LRUCache } from 'lru-cache'

// Redis client singleton
let redisClient: Redis | null = null

/**
 * Initialize Redis client
 */
export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    console.warn('Redis credentials not configured, using in-memory cache')
    return null
  }

  if (!redisClient) {
    try {
      redisClient = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })
    } catch (error) {
      console.error('Failed to initialize Redis client:', error)
      return null
    }
  }

  return redisClient
}

/**
 * In-memory LRU cache fallback
 */
const memoryCache = new LRUCache<string, any>({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes default TTL
  updateAgeOnGet: true,
  updateAgeOnHas: true,
})

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  // TTL values in seconds
  ttl: {
    short: 60, // 1 minute
    medium: 300, // 5 minutes
    long: 3600, // 1 hour
    day: 86400, // 24 hours
    week: 604800, // 7 days
  },
  
  // Cache key prefixes
  prefix: {
    api: 'api:',
    user: 'user:',
    property: 'property:',
    transaction: 'tx:',
    session: 'session:',
    rate: 'rate:',
    temp: 'temp:',
  },
  
  // Cache tags for invalidation
  tags: {
    properties: 'tag:properties',
    users: 'tag:users',
    transactions: 'tag:transactions',
    dashboard: 'tag:dashboard',
    public: 'tag:public',
  }
} as const

/**
 * Generate cache key
 */
export function generateCacheKey(
  prefix: keyof typeof CACHE_CONFIG.prefix,
  identifier: string,
  params?: Record<string, any>
): string {
  const baseKey = `${CACHE_CONFIG.prefix[prefix]}${identifier}`
  
  if (params && Object.keys(params).length > 0) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join(':')
    return `${baseKey}:${sortedParams}`
  }
  
  return baseKey
}

/**
 * Get value from cache
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedisClient()
    
    if (redis) {
      const value = await redis.get(key)
      return value ? (value as T) : null
    }
    
    // Fallback to memory cache
    return memoryCache.get(key) || null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

/**
 * Set value in cache
 */
export async function setInCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_CONFIG.ttl.medium
): Promise<boolean> {
  try {
    const redis = getRedisClient()
    
    if (redis) {
      await redis.setex(key, ttl, JSON.stringify(value))
      return true
    }
    
    // Fallback to memory cache
    memoryCache.set(key, value, { ttl: ttl * 1000 })
    return true
  } catch (error) {
    console.error('Cache set error:', error)
    return false
  }
}

/**
 * Delete from cache
 */
export async function deleteFromCache(key: string | string[]): Promise<boolean> {
  try {
    const redis = getRedisClient()
    const keys = Array.isArray(key) ? key : [key]
    
    if (redis) {
      await redis.del(...keys)
      return true
    }
    
    // Fallback to memory cache
    keys.forEach(k => memoryCache.delete(k))
    return true
  } catch (error) {
    console.error('Cache delete error:', error)
    return false
  }
}

/**
 * Clear cache by pattern
 */
export async function clearCacheByPattern(pattern: string): Promise<number> {
  try {
    const redis = getRedisClient()
    
    if (redis) {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
        return keys.length
      }
      return 0
    }
    
    // Fallback to memory cache
    let count = 0
    for (const key of Array.from(memoryCache.keys())) {
      if (key.match(pattern)) {
        memoryCache.delete(key)
        count++
      }
    }
    return count
  } catch (error) {
    console.error('Cache clear error:', error)
    return 0
  }
}

/**
 * Invalidate cache by tags
 */
export async function invalidateCacheByTag(tag: string): Promise<boolean> {
  try {
    const redis = getRedisClient()
    
    if (redis) {
      // Get all keys associated with the tag
      const keys = await redis.smembers(tag)
      
      if (keys.length > 0) {
        // Delete all keys
        await redis.del(...keys)
        // Clear the tag set
        await redis.del(tag)
      }
      
      return true
    }
    
    // Memory cache doesn't support tags, clear by prefix
    const pattern = tag.replace('tag:', '')
    await clearCacheByPattern(`*${pattern}*`)
    return true
  } catch (error) {
    console.error('Cache invalidation error:', error)
    return false
  }
}

/**
 * Add cache tags
 */
export async function addCacheTags(key: string, tags: string[]): Promise<boolean> {
  try {
    const redis = getRedisClient()
    
    if (redis) {
      // Add key to each tag set
      await Promise.all(
        tags.map(tag => redis.sadd(tag, key))
      )
      return true
    }
    
    // Memory cache doesn't support tags
    return true
  } catch (error) {
    console.error('Cache tagging error:', error)
    return false
  }
}

/**
 * Cache wrapper with automatic key generation
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number
    tags?: string[]
    force?: boolean
  }
): Promise<T> {
  const { ttl = CACHE_CONFIG.ttl.medium, tags = [], force = false } = options || {}
  
  // Skip cache if forced
  if (force) {
    const data = await fetcher()
    await setInCache(key, data, ttl)
    if (tags.length > 0) {
      await addCacheTags(key, tags)
    }
    return data
  }
  
  // Try to get from cache
  const cached = await getFromCache<T>(key)
  if (cached !== null) {
    return cached
  }
  
  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  await setInCache(key, data, ttl)
  
  // Add tags if provided
  if (tags.length > 0) {
    await addCacheTags(key, tags)
  }
  
  return data
}

/**
 * Batch cache operations
 */
export class CacheBatch {
  private operations: Array<() => Promise<any>> = []
  
  get<T>(key: string): Promise<T | null> {
    this.operations.push(() => getFromCache<T>(key))
    return Promise.resolve(null)
  }
  
  set<T>(key: string, value: T, ttl?: number): this {
    this.operations.push(() => setInCache(key, value, ttl))
    return this
  }
  
  delete(key: string | string[]): this {
    this.operations.push(() => deleteFromCache(key))
    return this
  }
  
  async execute(): Promise<any[]> {
    return Promise.all(this.operations.map(op => op()))
  }
}

/**
 * Rate limiting using cache
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 60 // seconds
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = generateCacheKey('rate', identifier)
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - window
  
  try {
    const redis = getRedisClient()
    
    if (redis) {
      // Use Redis sorted set for sliding window
      await redis.zremrangebyscore(key, 0, windowStart)
      const count = await redis.zcard(key)
      
      if (count < limit) {
        await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })
        await redis.expire(key, window)
        
        return {
          allowed: true,
          remaining: limit - count - 1,
          reset: now + window
        }
      }
      
      return {
        allowed: false,
        remaining: 0,
        reset: now + window
      }
    }
    
    // Fallback to memory cache with simpler implementation
    const current = memoryCache.get(key) as number || 0
    
    if (current < limit) {
      memoryCache.set(key, current + 1, { ttl: window * 1000 })
      return {
        allowed: true,
        remaining: limit - current - 1,
        reset: now + window
      }
    }
    
    return {
      allowed: false,
      remaining: 0,
      reset: now + window
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // Allow on error to prevent blocking users
    return {
      allowed: true,
      remaining: limit,
      reset: now + window
    }
  }
}

/**
 * Session cache management
 */
export const sessionCache = {
  async get(sessionId: string): Promise<any> {
    const key = generateCacheKey('session', sessionId)
    return getFromCache(key)
  },
  
  async set(sessionId: string, data: any, ttl: number = CACHE_CONFIG.ttl.day): Promise<boolean> {
    const key = generateCacheKey('session', sessionId)
    return setInCache(key, data, ttl)
  },
  
  async delete(sessionId: string): Promise<boolean> {
    const key = generateCacheKey('session', sessionId)
    return deleteFromCache(key)
  },
  
  async extend(sessionId: string, ttl: number = CACHE_CONFIG.ttl.day): Promise<boolean> {
    const key = generateCacheKey('session', sessionId)
    const data = await getFromCache(key)
    
    if (data) {
      return setInCache(key, data, ttl)
    }
    
    return false
  }
}

// Export utilities
export default {
  getRedisClient,
  generateCacheKey,
  getFromCache,
  setInCache,
  deleteFromCache,
  clearCacheByPattern,
  invalidateCacheByTag,
  addCacheTags,
  withCache,
  CacheBatch,
  checkRateLimit,
  sessionCache,
  CACHE_CONFIG
}