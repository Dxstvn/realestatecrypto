/**
 * ISR Configuration - PropertyChain
 * 
 * Incremental Static Regeneration settings for Next.js pages
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

/**
 * ISR revalidation intervals in seconds
 */
export const ISR_INTERVALS = {
  // Frequently updated pages
  realtime: 10, // 10 seconds
  frequent: 60, // 1 minute
  
  // Standard pages
  standard: 300, // 5 minutes
  medium: 900, // 15 minutes
  
  // Less frequently updated
  hourly: 3600, // 1 hour
  daily: 86400, // 24 hours
  weekly: 604800, // 7 days
  
  // Static pages
  static: false as const, // No revalidation
} as const

/**
 * Page-specific ISR configuration
 */
export const PAGE_ISR_CONFIG = {
  // Homepage
  '/': ISR_INTERVALS.frequent,
  
  // Property pages
  '/properties': ISR_INTERVALS.frequent,
  '/properties/[id]': ISR_INTERVALS.standard,
  '/properties/featured': ISR_INTERVALS.medium,
  '/properties/new': ISR_INTERVALS.frequent,
  
  // Market pages
  '/market': ISR_INTERVALS.realtime,
  '/market/trends': ISR_INTERVALS.frequent,
  '/market/analytics': ISR_INTERVALS.medium,
  
  // User pages
  '/users/[id]': ISR_INTERVALS.medium,
  '/profile': ISR_INTERVALS.standard,
  '/dashboard': ISR_INTERVALS.frequent,
  
  // Static pages
  '/about': ISR_INTERVALS.daily,
  '/privacy': ISR_INTERVALS.weekly,
  '/terms': ISR_INTERVALS.weekly,
  '/help': ISR_INTERVALS.daily,
  
  // Blog/Content
  '/blog': ISR_INTERVALS.hourly,
  '/blog/[slug]': ISR_INTERVALS.daily,
  '/resources': ISR_INTERVALS.daily,
  
  // Admin pages (no ISR, always dynamic)
  '/admin': false,
  '/admin/*': false,
} as const

/**
 * Get ISR configuration for a page
 */
export function getPageISRConfig(pathname: string): number | false {
  // Direct match
  if (pathname in PAGE_ISR_CONFIG) {
    return PAGE_ISR_CONFIG[pathname as keyof typeof PAGE_ISR_CONFIG]
  }
  
  // Pattern matching for dynamic routes
  for (const [pattern, config] of Object.entries(PAGE_ISR_CONFIG)) {
    if (pattern.includes('[') && pattern.includes(']')) {
      const regex = new RegExp(
        '^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$'
      )
      if (regex.test(pathname)) {
        return config
      }
    }
  }
  
  // Default to standard interval
  return ISR_INTERVALS.standard
}

/**
 * On-demand revalidation paths
 */
export const REVALIDATION_PATHS = {
  property: (id: string) => [`/properties/${id}`, '/properties', '/'],
  user: (id: string) => [`/users/${id}`, `/profile/${id}`],
  transaction: () => ['/dashboard', '/transactions', '/admin/transactions'],
  market: () => ['/market', '/', '/properties'],
  blog: (slug: string) => [`/blog/${slug}`, '/blog'],
} as const

/**
 * Generate static params for dynamic routes
 */
export const STATIC_GENERATION = {
  // Generate paths for popular properties
  properties: {
    revalidate: ISR_INTERVALS.standard,
    generateStaticParams: async () => {
      // This would fetch from your API
      const popularProperties = await fetch('/api/properties?sort=popular&limit=100')
        .then(res => res.json())
        .catch(() => ({ properties: [] }))
      
      return popularProperties.properties.map((p: any) => ({
        id: p.id.toString()
      }))
    }
  },
  
  // Generate paths for user profiles
  users: {
    revalidate: ISR_INTERVALS.medium,
    generateStaticParams: async () => {
      // Pre-generate for verified users only
      const verifiedUsers = await fetch('/api/users?verified=true&limit=50')
        .then(res => res.json())
        .catch(() => ({ users: [] }))
      
      return verifiedUsers.users.map((u: any) => ({
        id: u.id.toString()
      }))
    }
  },
  
  // Generate paths for blog posts
  blog: {
    revalidate: ISR_INTERVALS.daily,
    generateStaticParams: async () => {
      const posts = await fetch('/api/blog/posts')
        .then(res => res.json())
        .catch(() => ({ posts: [] }))
      
      return posts.posts.map((p: any) => ({
        slug: p.slug
      }))
    }
  }
} as const

/**
 * ISR fallback configuration
 */
export const ISR_FALLBACK = {
  // Show loading state while generating
  blocking: [
    '/properties/[id]',
    '/users/[id]',
    '/blog/[slug]'
  ],
  
  // Show 404 if not found
  false: [
    '/admin/*',
    '/api/*'
  ],
  
  // Generate on demand
  true: [
    '/market/[symbol]',
    '/search',
    '/explore'
  ]
} as const

/**
 * Get fallback mode for a route
 */
export function getFallbackMode(pathname: string): 'blocking' | boolean {
  // Check blocking routes
  if (ISR_FALLBACK.blocking.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\[.*?\]/g, '[^/]+').replace(/\*/g, '.*') + '$')
    return regex.test(pathname)
  })) {
    return 'blocking'
  }
  
  // Check false routes
  if (ISR_FALLBACK.false.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    return regex.test(pathname)
  })) {
    return false
  }
  
  // Check true routes
  if (ISR_FALLBACK.true.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$')
    return regex.test(pathname)
  })) {
    return true
  }
  
  // Default to blocking
  return 'blocking'
}

/**
 * Priority pages for build-time generation
 */
export const PRIORITY_STATIC_PATHS = [
  '/',
  '/properties',
  '/about',
  '/privacy',
  '/terms',
  '/help',
  '/blog',
  '/resources'
]

/**
 * Dynamic import configuration for code splitting
 */
export const DYNAMIC_IMPORTS = {
  // Heavy components to load on demand
  charts: {
    loading: () => 'Loading charts...',
    ssr: false
  },
  
  editor: {
    loading: () => 'Loading editor...',
    ssr: false
  },
  
  maps: {
    loading: () => 'Loading map...',
    ssr: false
  },
  
  web3: {
    loading: () => 'Connecting to blockchain...',
    ssr: false
  }
} as const

/**
 * Prefetch configuration for Link components
 */
export const PREFETCH_CONFIG = {
  // Always prefetch these routes
  always: [
    '/',
    '/properties',
    '/dashboard'
  ],
  
  // Never prefetch these routes
  never: [
    '/admin/*',
    '/api/*',
    '/auth/*'
  ],
  
  // Prefetch on hover/focus
  onInteraction: [
    '/properties/[id]',
    '/users/[id]',
    '/blog/[slug]'
  ]
} as const

/**
 * Get prefetch setting for a route
 */
export function getPrefetchSetting(pathname: string): boolean | undefined {
  // Check always prefetch
  if (PREFETCH_CONFIG.always.includes(pathname as any)) {
    return true
  }
  
  // Check never prefetch
  if (PREFETCH_CONFIG.never.some(pattern => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    return regex.test(pathname)
  })) {
    return false
  }
  
  // Default to undefined (auto)
  return undefined
}

// Export configuration
export default {
  ISR_INTERVALS,
  PAGE_ISR_CONFIG,
  getPageISRConfig,
  REVALIDATION_PATHS,
  STATIC_GENERATION,
  ISR_FALLBACK,
  getFallbackMode,
  PRIORITY_STATIC_PATHS,
  DYNAMIC_IMPORTS,
  PREFETCH_CONFIG,
  getPrefetchSetting
}