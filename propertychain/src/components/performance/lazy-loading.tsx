/**
 * Lazy Loading Components - PropertyChain
 * 
 * Performance-optimized loading strategies
 * Following CLAUDE.md performance standards
 */

'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface LazyComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  onLoad?: () => void
  className?: string
}

export interface LazyImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  placeholder?: 'blur' | 'empty' | 'skeleton'
  blurDataURL?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

export interface VirtualListProps<T> {
  items: T[]
  height: number
  itemHeight: number | ((index: number) => number)
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
}

export interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  loader?: React.ReactNode
  endMessage?: React.ReactNode
  onLoadMore: () => void | Promise<void>
  threshold?: number
  className?: string
}

// ============================================================================
// Lazy Component Wrapper
// ============================================================================

export function LazyComponent({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '100px',
  triggerOnce = true,
  delay = 0,
  onLoad,
  className,
}: LazyComponentProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  })

  React.useEffect(() => {
    if (inView && !isLoaded) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          setIsLoaded(true)
          onLoad?.()
        }, delay)
        return () => clearTimeout(timer)
      } else {
        setIsLoaded(true)
        onLoad?.()
      }
    }
  }, [inView, isLoaded, delay, onLoad])

  return (
    <div ref={ref} className={className}>
      {isLoaded ? (
        children
      ) : (
        fallback || (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )
      )}
    </div>
  )
}

// ============================================================================
// Lazy Image Component
// ============================================================================

export function LazyImage({
  src,
  alt,
  fallbackSrc = '/placeholder.png',
  placeholder = 'skeleton',
  blurDataURL,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = React.useState(src)
  const [isLoading, setIsLoading] = React.useState(!priority)
  const [hasError, setHasError] = React.useState(false)
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
    triggerOnce: true,
    skip: priority,
  })

  React.useEffect(() => {
    if (priority || inView) {
      const img = new Image()
      img.src = src
      
      img.onload = () => {
        setImageSrc(src)
        setIsLoading(false)
        onLoad?.()
      }
      
      img.onerror = () => {
        setImageSrc(fallbackSrc)
        setIsLoading(false)
        setHasError(true)
        onError?.()
      }
    }
  }, [src, fallbackSrc, priority, inView, onLoad, onError])

  const renderPlaceholder = () => {
    switch (placeholder) {
      case 'blur':
        return (
          <div
            className={cn('absolute inset-0 bg-cover bg-center filter blur-lg', className)}
            style={{ backgroundImage: `url(${blurDataURL || src})` }}
          />
        )
      case 'skeleton':
        return <Skeleton className={cn('absolute inset-0', className)} />
      case 'empty':
      default:
        return (
          <div className={cn('absolute inset-0 bg-muted flex items-center justify-center', className)}>
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )
    }
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      {isLoading && renderPlaceholder()}
      
      {!isLoading && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Virtual List Component
// ============================================================================

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className,
  onScroll,
}: VirtualListProps<T>) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const getItemHeight = React.useCallback(
    (index: number) => {
      return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight
    },
    [itemHeight]
  )
  
  const getTotalHeight = React.useMemo(() => {
    if (typeof itemHeight === 'number') {
      return items.length * itemHeight
    }
    return items.reduce((sum, _, index) => sum + getItemHeight(index), 0)
  }, [items, itemHeight, getItemHeight])
  
  const getVisibleRange = React.useMemo(() => {
    let accumulatedHeight = 0
    let startIndex = 0
    let endIndex = items.length - 1
    
    // Find start index
    for (let i = 0; i < items.length; i++) {
      const h = getItemHeight(i)
      if (accumulatedHeight + h > scrollTop) {
        startIndex = Math.max(0, i - overscan)
        break
      }
      accumulatedHeight += h
    }
    
    // Find end index
    accumulatedHeight = 0
    for (let i = startIndex; i < items.length; i++) {
      if (accumulatedHeight > height) {
        endIndex = Math.min(items.length - 1, i + overscan)
        break
      }
      accumulatedHeight += getItemHeight(i)
    }
    
    return { startIndex, endIndex }
  }, [scrollTop, height, items.length, overscan, getItemHeight])
  
  const handleScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const newScrollTop = scrollRef.current.scrollTop
      setScrollTop(newScrollTop)
      onScroll?.(newScrollTop)
    }
  }, [onScroll])
  
  const getItemOffset = React.useCallback(
    (index: number) => {
      if (typeof itemHeight === 'number') {
        return index * itemHeight
      }
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += getItemHeight(i)
      }
      return offset
    },
    [itemHeight, getItemHeight]
  )
  
  return (
    <div
      ref={scrollRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: getTotalHeight, position: 'relative' }}>
        {items.slice(getVisibleRange.startIndex, getVisibleRange.endIndex + 1).map((item, index) => {
          const actualIndex = getVisibleRange.startIndex + index
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: getItemOffset(actualIndex),
                left: 0,
                right: 0,
                height: getItemHeight(actualIndex),
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// Infinite Scroll Component
// ============================================================================

export function InfiniteScroll({
  children,
  hasMore,
  loader,
  endMessage,
  onLoadMore,
  threshold = 0.8,
  className,
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin: '100px',
  })

  React.useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setIsLoading(true)
      Promise.resolve(onLoadMore()).finally(() => {
        setIsLoading(false)
      })
    }
  }, [inView, hasMore, isLoading, onLoadMore])

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={ref} className="py-4">
          {isLoading && (loader || (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
            </div>
          ))}
        </div>
      )}
      
      {!hasMore && endMessage && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          {endMessage}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Progressive Enhancement Component
// ============================================================================

interface ProgressiveEnhancementProps {
  fallback: React.ReactNode
  enhanced: React.ReactNode
  dependencies?: string[]
}

export function ProgressiveEnhancement({
  fallback,
  enhanced,
  dependencies = [],
}: ProgressiveEnhancementProps) {
  const [isEnhanced, setIsEnhanced] = React.useState(false)

  React.useEffect(() => {
    // Check if all dependencies are loaded
    const checkDependencies = async () => {
      if (typeof window === 'undefined') return
      
      // Check for JavaScript support
      if (!window.navigator.userAgent) return
      
      // Check for required APIs
      const requiredAPIs = ['IntersectionObserver', 'ResizeObserver', 'requestIdleCallback']
      const hasAllAPIs = requiredAPIs.every(api => api in window)
      
      if (hasAllAPIs) {
        setIsEnhanced(true)
      }
    }
    
    checkDependencies()
  }, [dependencies])

  return <>{isEnhanced ? enhanced : fallback}</>
}

// ============================================================================
// Code Splitting Utilities
// ============================================================================

export const LazyPropertyCard = dynamic(
  () => import('@/components/custom/property-card').then(mod => mod.PropertyCard),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
)

export const LazyChart = dynamic(
  () => import('@/components/custom/charts').then(mod => ({ default: mod.ChartContainer })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
)

export const LazyMap = dynamic(
  () => import('@/components/custom/map-component').then(mod => ({ default: mod.MapComponent })),
  {
    loading: () => (
      <div className="h-96 w-full bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
    ssr: false,
  }
)

// ============================================================================
// Preload Utilities
// ============================================================================

export function preloadComponent(componentPath: string) {
  if (typeof window !== 'undefined') {
    // Use webpack's require.ensure for preloading
    import(componentPath).catch(console.error)
  }
}

export function preloadImage(src: string) {
  if (typeof window !== 'undefined') {
    const img = new Image()
    img.src = src
  }
}

export function preloadImages(srcs: string[]) {
  srcs.forEach(preloadImage)
}

// ============================================================================
// Resource Hints
// ============================================================================

export function ResourceHints({ 
  preconnect = [],
  prefetch = [],
  preload = [],
}: {
  preconnect?: string[]
  prefetch?: string[]
  preload?: Array<{ href: string; as: string }>
}) {
  React.useEffect(() => {
    // Add preconnect hints
    preconnect.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      document.head.appendChild(link)
    })
    
    // Add prefetch hints
    prefetch.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    })
    
    // Add preload hints
    preload.forEach(({ href, as }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    })
  }, [preconnect, prefetch, preload])
  
  return null
}