/**
 * Lazy Loading Utilities
 * PropertyLend DeFi Platform
 * 
 * Performance optimization through code splitting and lazy loading
 */

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

// Loading fallback components
export const ChartSkeleton = () => (
  <div className="w-full h-64 bg-gray-900/50 rounded-lg animate-pulse">
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
    </div>
  </div>
)

export const CardSkeleton = () => (
  <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 animate-pulse">
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4 bg-gray-800" />
      <Skeleton className="h-8 w-1/2 bg-gray-800" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-gray-800" />
        <Skeleton className="h-3 w-5/6 bg-gray-800" />
      </div>
    </div>
  </div>
)

export const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg animate-pulse">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4 bg-gray-800" />
          <Skeleton className="h-3 w-1/3 bg-gray-800" />
        </div>
        <Skeleton className="h-8 w-20 bg-gray-800" />
      </div>
    ))}
  </div>
)

// Lazy loaded heavy components
export const DeFiDashboard = dynamic(
  () => import('@/components/custom/defi-dashboard').then(mod => mod.DeFiDashboard),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const YieldCalculator = dynamic(
  () => import('@/components/custom/yield-calculator').then(mod => mod.YieldCalculator),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)

export const LendingPoolCard = dynamic(
  () => import('@/components/custom/lending-pool-card').then(mod => mod.LendingPoolCard),
  {
    loading: () => <CardSkeleton />,
  }
)

export const DeFiFilterBar = dynamic(
  () => import('@/components/custom/defi-filter-bar').then(mod => mod.DeFiFilterBar),
  {
    loading: () => <Skeleton className="h-12 w-full bg-gray-900/50" />,
  }
)

// Chart components (heavy libraries)
export const AreaChart = dynamic(
  () => import('recharts').then(mod => mod.AreaChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const BarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

export const PieChart = dynamic(
  () => import('recharts').then(mod => mod.PieChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
)

// Admin components (only loaded for admins)
export const AdminDashboard = dynamic(
  () => import('@/app/admin/dashboard/page'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    ),
    ssr: false,
  }
)

// Utility function for creating lazy loaded components with custom loading
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | T>,
  loadingComponent?: ReactNode
) {
  return dynamic(importFunc, {
    loading: () => <>{loadingComponent || <CardSkeleton />}</>,
  })
}

// Intersection Observer hook for lazy loading on scroll
import { useEffect, useRef, useState } from 'react'

export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, isIntersecting, hasLoaded }
}

// Image lazy loading component
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export function LazyImage({ src, alt, className, placeholder }: LazyImageProps) {
  const { ref, hasLoaded } = useLazyLoad()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div ref={ref} className={className}>
      {!hasLoaded ? (
        <div className="w-full h-full bg-gray-900/50 animate-pulse" />
      ) : (
        <>
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-900/50 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            className={`${className} ${!imageLoaded ? 'hidden' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </>
      )}
    </div>
  )
}