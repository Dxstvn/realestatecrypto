/**
 * Skeleton Loader Components - PropertyLend
 * Phase 3.2: Performance Optimizations
 * 
 * Features:
 * - Multiple skeleton variants
 * - Shimmer animation effect
 * - Responsive sizing
 * - Accessible loading states
 * - Smooth transitions
 */

'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-800',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-shimmer',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-none',
        variant === 'rounded' && 'rounded-lg',
        className
      )}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
        contain: 'layout style paint',
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Card Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6',
      className
    )}>
      <Skeleton variant="rectangular" height={200} className="mb-4 rounded-lg" />
      <Skeleton variant="text" className="mb-2 w-3/4" />
      <Skeleton variant="text" className="mb-4 w-1/2" />
      <div className="flex gap-2 mb-4">
        <Skeleton variant="rounded" width={80} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </div>
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  )
}

// Property Card Skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <Skeleton variant="rectangular" height={200} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Skeleton variant="text" className="mb-2 w-3/4 h-6" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
          <Skeleton variant="rounded" width={60} height={24} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Skeleton variant="text" className="mb-1 h-3 w-1/2" />
            <Skeleton variant="text" className="h-5" />
          </div>
          <div>
            <Skeleton variant="text" className="mb-1 h-3 w-1/2" />
            <Skeleton variant="text" className="h-5" />
          </div>
        </div>
        
        <Skeleton variant="rectangular" height={8} className="rounded-full mb-2" />
        <Skeleton variant="text" className="mb-4 h-3 w-1/3" />
        
        <Skeleton variant="rectangular" height={44} className="rounded-lg" />
      </div>
    </div>
  )
}

// Pool Card Skeleton
export function PoolCardSkeleton() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Skeleton variant="text" className="mb-2 h-6 w-32" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
        <Skeleton variant="rounded" width={80} height={24} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <Skeleton variant="circular" width={32} height={32} className="mb-2 mx-auto" />
          <Skeleton variant="text" className="h-8 w-16 mx-auto mb-1" />
          <Skeleton variant="text" className="h-3 w-20 mx-auto" />
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <Skeleton variant="circular" width={32} height={32} className="mb-2 mx-auto" />
          <Skeleton variant="text" className="h-8 w-20 mx-auto mb-1" />
          <Skeleton variant="text" className="h-3 w-20 mx-auto" />
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-24 h-3" />
          <Skeleton variant="text" className="w-16 h-3" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-20 h-3" />
          <Skeleton variant="text" className="w-12 h-3" />
        </div>
      </div>
      
      <Skeleton variant="rectangular" height={44} className="rounded-lg" />
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-4" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="border-b border-gray-200 dark:border-gray-800 last:border-b-0 p-4"
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// List Skeleton
export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton variant="text" className="mb-2 w-1/3 h-5" />
            <Skeleton variant="text" className="w-1/2 h-4" />
          </div>
          <Skeleton variant="rounded" width={100} height={36} />
        </div>
      ))}
    </div>
  )
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index}>
          <Skeleton variant="text" className="mb-2 w-24 h-4" />
          <Skeleton variant="rounded" height={40} />
        </div>
      ))}
      <div className="flex gap-4">
        <Skeleton variant="rounded" width={120} height={44} />
        <Skeleton variant="rounded" width={120} height={44} />
      </div>
    </div>
  )
}

// Chart Skeleton
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <Skeleton variant="text" className="w-32 h-6" />
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={60} height={32} />
          <Skeleton variant="rounded" width={60} height={32} />
          <Skeleton variant="rounded" width={60} height={32} />
        </div>
      </div>
      <Skeleton variant="rectangular" height={height} className="rounded-lg" />
      <div className="flex justify-center gap-8 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton variant="circular" width={12} height={12} />
            <Skeleton variant="text" className="w-16 h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Stats Skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rounded" width={60} height={20} />
          </div>
          <Skeleton variant="text" className="h-8 w-2/3 mb-2" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

// Add shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(
      90deg,
      rgba(229, 231, 235, 0) 0%,
      rgba(229, 231, 235, 0.5) 50%,
      rgba(229, 231, 235, 0) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  
  .dark .animate-shimmer {
    background: linear-gradient(
      90deg,
      rgba(55, 65, 81, 0) 0%,
      rgba(55, 65, 81, 0.5) 50%,
      rgba(55, 65, 81, 0) 100%
    );
  }
`

// Export styles for global use
export const SkeletonStyles = () => (
  <style jsx global>{shimmerStyles}</style>
)