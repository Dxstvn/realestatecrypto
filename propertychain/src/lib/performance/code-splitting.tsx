/**
 * Code Splitting Utilities - PropertyChain
 * 
 * Dynamic imports and lazy loading configuration
 * Following UpdatedUIPlan.md Step 69 specifications and CLAUDE.md principles
 */

import dynamic from 'next/dynamic'
import { ComponentType, lazy, Suspense } from 'react'
import type { DynamicOptionsLoadingProps } from 'next/dynamic'

/**
 * Loading component configuration
 */
export interface LoadingConfig {
  delay?: number
  loader?: (props: DynamicOptionsLoadingProps) => JSX.Element | null
  ssr?: boolean
  suspense?: boolean
}

/**
 * Default loading component
 */
export const DefaultLoader = (props: DynamicOptionsLoadingProps) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

/**
 * Create a dynamically imported component with loading state
 */
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  config: LoadingConfig = {}
): ComponentType<P> {
  return dynamic(importFn, {
    loading: config.loader || DefaultLoader,
    ssr: config.ssr !== false,
    suspense: config.suspense || false,
  })
}

/**
 * Lazy load a component with Suspense boundary
 */
export function lazyLoadComponent<P extends {} = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
): React.FC<P> {
  const LazyComponent = lazy(importFn)
  
  return (props: P) => (
    <Suspense fallback={fallback || <DefaultLoader />}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  )
}

/**
 * Route-based code splitting configuration
 */
export const routeComponents = {
  // All routes commented out until pages are created
  // This configuration object is for reference and future use
}

/**
 * Heavy component lazy loading
 */
export const heavyComponents = {
  // All heavy components commented out until they are created
  // This configuration object is for reference and future use
}

/**
 * Prefetch component for improved performance
 */
export async function prefetchComponent(
  componentName: string
): Promise<void> {
  try {
    // Function is a placeholder until components are implemented
    console.log(`Prefetch requested for: ${componentName}`)
  } catch (error) {
    console.warn(`Failed to prefetch component: ${componentName}`, error)
  }
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyLoader(
  threshold = 0.1,
  rootMargin = '50px'
): {
  observe: (element: Element, callback: () => void) => void
  unobserve: (element: Element) => void
  disconnect: () => void
} {
  const callbacks = new Map<Element, () => void>()
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const callback = callbacks.get(entry.target)
          if (callback) {
            callback()
            observer.unobserve(entry.target)
            callbacks.delete(entry.target)
          }
        }
      })
    },
    { threshold, rootMargin }
  )
  
  return {
    observe: (element: Element, callback: () => void) => {
      callbacks.set(element, callback)
      observer.observe(element)
    },
    unobserve: (element: Element) => {
      observer.unobserve(element)
      callbacks.delete(element)
    },
    disconnect: () => {
      observer.disconnect()
      callbacks.clear()
    },
  }
}

/**
 * Route-based prefetching strategy
 */
export const prefetchStrategy = {
  // Prefetch on hover
  onHover: (componentName: keyof typeof routeComponents) => {
    let timeoutId: NodeJS.Timeout
    
    return {
      onMouseEnter: () => {
        timeoutId = setTimeout(() => {
          prefetchComponent(componentName)
        }, 100)
      },
      onMouseLeave: () => {
        clearTimeout(timeoutId)
      },
    }
  },
  
  // Prefetch on visibility
  onVisible: (componentName: keyof typeof routeComponents) => {
    const lazyLoader = createLazyLoader()
    
    return (element: Element | null) => {
      if (element) {
        lazyLoader.observe(element, () => {
          prefetchComponent(componentName)
        })
      }
    }
  },
  
  // Prefetch based on user interaction patterns
  predictive: async (currentRoute: string) => {
    // Define likely next routes based on current route
    const predictions: Record<string, string[]> = {
      '/': ['Properties', 'Dashboard'],
      '/properties': ['PropertyDetail', 'Dashboard'],
      '/dashboard': ['DashboardProperties', 'DashboardInvestments'],
      '/auth/login': ['Dashboard', 'Register'],
    }
    
    const likelyNext = predictions[currentRoute] || []
    
    // Prefetch likely next routes with delay
    for (const route of likelyNext) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      prefetchComponent(route as keyof typeof routeComponents)
    }
  },
}

/**
 * Bundle splitting configuration for libraries
 */
export const librarySplitPoints = {
  // Core libraries (always loaded)
  core: ['react', 'react-dom', 'next'],
  
  // UI libraries (loaded on demand)
  ui: ['@radix-ui', 'framer-motion', 'lucide-react', 'class-variance-authority'],
  
  // Web3 libraries (loaded for Web3 features)
  web3: ['ethers', 'wagmi', 'viem', '@rainbow-me/rainbowkit'],
  
  // Data libraries (loaded for data features)
  data: ['swr', 'axios', '@tanstack/react-query'],
  
  // Utility libraries (loaded as needed)
  utils: ['lodash', 'date-fns', 'zod', 'uuid'],
  
  // Form libraries (loaded for forms)
  forms: ['react-hook-form', '@hookform/resolvers'],
  
  // Chart libraries (loaded for analytics)
  charts: ['recharts', 'd3', 'chart.js'],
}

/**
 * Create chunk groups for webpack configuration
 */
export function createChunkGroups() {
  const groups: Record<string, any> = {}
  
  Object.entries(librarySplitPoints).forEach(([name, libraries]) => {
    groups[name] = {
      name,
      test: new RegExp(`[\\\\/]node_modules[\\\\/](${libraries.join('|')})[\\\\/]`),
      priority: name === 'core' ? 50 : 20,
      reuseExistingChunk: true,
    }
  })
  
  return groups
}

export default {
  createDynamicComponent,
  lazyLoadComponent,
  routeComponents,
  heavyComponents,
  prefetchComponent,
  createLazyLoader,
  prefetchStrategy,
  librarySplitPoints,
  createChunkGroups,
}