/**
 * Loading States - PropertyChain
 * 
 * Comprehensive loading state components with:
 * - shadcn Skeleton variations
 * - Shimmer effects  
 * - Progress indicators
 * - Suspense boundaries
 * 
 * Following UpdatedUIPlan.md Step 39 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Building,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Image,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Enhanced Skeleton with shimmer effect
 */
export function ShimmerSkeleton({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Pulsing Skeleton with breathing animation
 */
export function PulsingSkeleton({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <motion.div
      className={cn('rounded-md bg-muted', className)}
      style={style}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Wave Loading Animation
 */
export function WaveLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-8 bg-primary rounded-full"
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Spinner with different sizes
 */
export function Spinner({
  size = 'default',
  className,
}: {
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )}
    />
  )
}

/**
 * Dots Loading Animation
 */
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Enhanced Progress with animated gradient
 */
export function AnimatedProgress({
  value,
  className,
  showLabel = false,
  label,
  color = 'primary',
}: {
  value?: number
  className?: string
  showLabel?: boolean
  label?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <Progress
        value={value}
        className="h-2"
        indicatorClassName={cn(
          colorClasses[color],
          'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer'
        )}
      />
    </div>
  )
}

/**
 * Property Card Loading Skeleton
 */
export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <ShimmerSkeleton className="h-48 w-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="h-9 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard KPI Card Loading
 */
export function KPICardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <ShimmerSkeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          <AnimatedProgress value={65} color="primary" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Chart Loading Skeleton
 */
export function ChartSkeleton({ type = 'bar' }: { type?: 'bar' | 'line' | 'pie' }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === 'pie' ? (
            <div className="flex justify-center">
              <ShimmerSkeleton className="h-48 w-48 rounded-full" />
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-2">
              {[...Array(8)].map((_, i) => (
                <PulsingSkeleton
                  key={i}
                  className="flex-1"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-sm" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Table Loading Skeleton
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Header */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {[...Array(cols)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
          
          {/* Rows */}
          {[...Array(rows)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 py-2 border-b border-border/50"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {[...Array(cols)].map((_, colIndex) => (
                <div key={colIndex}>
                  {colIndex === 0 ? (
                    <div className="flex items-center gap-2">
                      <ShimmerSkeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-16" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Form Loading Skeleton
 */
export function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form fields */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        
        {/* Checkbox group */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Investment Summary Loading
 */
export function InvestmentSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <ShimmerSkeleton className="h-10 w-10 rounded-full mx-auto" />
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-6 w-12 mx-auto" />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <AnimatedProgress value={75} showLabel />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * File Upload Loading State
 */
export function FileUploadSkeleton() {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <DotsLoader />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-3 w-64 mx-auto" />
          </div>
          <div className="space-y-2">
            <AnimatedProgress value={45} showLabel label="Uploading..." />
            <div className="flex justify-between text-xs">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Search Results Loading
 */
export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-full" />
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Loading Button States
 */
export function LoadingButton({
  loading,
  children,
  loadingText = 'Loading...',
  className,
  ...props
}: {
  loading?: boolean
  children: React.ReactNode
  loadingText?: string
} & React.ComponentProps<typeof Button>) {
  return (
    <Button className={className} disabled={loading} {...props}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Spinner size="sm" />
            {loadingText}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

/**
 * Content Loading Wrapper
 */
export function LoadingWrapper({
  loading,
  children,
  skeleton,
  className,
}: {
  loading: boolean
  children: React.ReactNode
  skeleton?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Page Loading State with Progress
 */
export function PageLoader({
  progress = 0,
  message = 'Loading...',
  subMessage,
}: {
  progress?: number
  message?: string
  subMessage?: string
}) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-96 max-w-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <WaveLoader />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{message}</h3>
              {subMessage && (
                <p className="text-sm text-muted-foreground">{subMessage}</p>
              )}
            </div>

            {progress > 0 && (
              <AnimatedProgress
                value={progress}
                showLabel
                label="Progress"
                color="primary"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Suspense Boundary Components
 */

// Generic Suspense wrapper
export function SuspenseBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <Suspense fallback={fallback || <Spinner />}>
      {children}
    </Suspense>
  )
}

// Dashboard Suspense
export function DashboardSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <KPICardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton type="bar" />
            <ChartSkeleton type="pie" />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

// Property List Suspense
export function PropertyListSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      {children}
    </Suspense>
  )
}

// Form Suspense
export function FormSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      {children}
    </Suspense>
  )
}

// Table Suspense
export function TableSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      {children}
    </Suspense>
  )
}

/**
 * Utility function to simulate loading delay
 */
export function useLoadingState(initialLoading = false, delay = 2000) {
  const [loading, setLoading] = React.useState(initialLoading)

  const startLoading = React.useCallback((customDelay?: number) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, customDelay || delay)
  }, [delay])

  return { loading, setLoading, startLoading }
}

/**
 * Loading state hook with progress
 */
export function useProgressLoading(steps: string[], stepDuration = 1000) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const startLoading = React.useCallback(() => {
    setLoading(true)
    setCurrentStep(0)
    setProgress(0)

    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
        setProgress(((index + 1) / steps.length) * 100)
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            setLoading(false)
            setCurrentStep(0)
            setProgress(0)
          }, stepDuration)
        }
      }, stepDuration * (index + 1))
    })
  }, [steps, stepDuration])

  const currentMessage = currentStep > 0 ? steps[currentStep - 1] : 'Starting...'

  return {
    loading,
    progress,
    currentStep,
    currentMessage,
    startLoading,
    setLoading,
  }
}

// Export all loading components and utilities
export {
  // Basic loaders (Skeleton is from ui components)
  Skeleton,
  // Note: All other components are already exported with 'export function'
}