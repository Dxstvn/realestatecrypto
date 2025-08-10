/**
 * KPI Card Components - PropertyChain
 * 
 * Key Performance Indicator cards for dashboard
 * Uses shadcn Card + Tremor for mini charts
 * Following Section 0 principles and Section 5.2 specifications
 */

'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import {
  SparkAreaChart,
  SparkLineChart,
  SparkBarChart,
  Tracker,
  ProgressBar,
  CategoryBar,
} from '@tremor/react'
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  MoreVertical,
  Download,
  Maximize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'

// KPI Card Types
export type KPIVariant = 'default' | 'compact' | 'detailed' | 'chart'
export type TrendDirection = 'up' | 'down' | 'neutral'
export type ChartType = 'area' | 'line' | 'bar' | 'tracker' | 'progress' | 'category'

// Chart data types
export interface ChartDataPoint {
  date?: string
  value: number
  label?: string
  color?: string
}

export interface TrackerData {
  color: string
  tooltip: string
}

export interface CategoryData {
  name: string
  value: number
  color?: string
}

// KPI Card Props
export interface KPICardProps {
  title: string
  value: string | number
  description?: string
  change?: number
  changeLabel?: string
  trend?: TrendDirection
  icon?: ReactNode
  variant?: KPIVariant
  chartType?: ChartType
  chartData?: ChartDataPoint[]
  trackerData?: TrackerData[]
  categoryData?: CategoryData[]
  target?: number
  footer?: ReactNode
  actions?: ReactNode
  loading?: boolean
  error?: boolean
  errorMessage?: string
  className?: string
  animate?: boolean
}

// Trend indicator component
function TrendIndicator({ 
  trend, 
  change, 
  changeLabel 
}: { 
  trend?: TrendDirection
  change?: number
  changeLabel?: string 
}) {
  if (!trend && change === undefined) return null

  const actualTrend = trend || (change && change > 0 ? 'up' : change && change < 0 ? 'down' : 'neutral')
  
  const trendConfig = {
    up: {
      icon: ArrowUpRight,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Increase',
    },
    down: {
      icon: ArrowDownRight,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Decrease',
    },
    neutral: {
      icon: Minus,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      label: 'No change',
    },
  }

  const config = trendConfig[actualTrend]
  const Icon = config.icon

  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
      config.bgColor,
      config.color
    )}>
      <Icon className="h-3 w-3" />
      {change !== undefined && (
        <span>{formatPercentage(Math.abs(change), { includeSign: false })}</span>
      )}
      {changeLabel && <span>{changeLabel}</span>}
    </div>
  )
}

// Mini chart component
function MiniChart({
  type,
  data,
  trackerData,
  categoryData,
  target,
  height = 40,
  className,
}: {
  type?: ChartType
  data?: ChartDataPoint[]
  trackerData?: TrackerData[]
  categoryData?: CategoryData[]
  target?: number
  height?: number
  className?: string
}) {
  if (!type) return null

  const chartColors = ['blue', 'emerald', 'violet', 'amber', 'rose', 'cyan']
  
  switch (type) {
    case 'area':
      return data ? (
        <SparkAreaChart
          data={data}
          index="date"
          categories={['value']}
          colors={chartColors}
          className={cn('h-10', className)}
        />
      ) : null

    case 'line':
      return data ? (
        <SparkLineChart
          data={data}
          index="date"
          categories={['value']}
          colors={chartColors}
          className={cn('h-10', className)}
        />
      ) : null

    case 'bar':
      return data ? (
        <SparkBarChart
          data={data}
          index="date"
          categories={['value']}
          colors={chartColors}
          className={cn('h-10', className)}
        />
      ) : null

    case 'tracker':
      return trackerData ? (
        <Tracker
          data={trackerData}
          className={cn('mt-2', className)}
        />
      ) : null

    case 'progress':
      return target !== undefined && data && data.length > 0 ? (
        <ProgressBar
          value={(data[data.length - 1].value / target) * 100}
          className={cn('mt-2', className)}
          showAnimation
        />
      ) : null

    case 'category':
      return categoryData ? (
        <CategoryBar
          values={categoryData.map(d => d.value)}
          colors={categoryData.map(d => d.color || 'blue') as any}
          className={cn('mt-2', className)}
          showAnimation
        />
      ) : null

    default:
      return null
  }
}

// Main KPI Card Component
export function KPICard({
  title,
  value,
  description,
  change,
  changeLabel,
  trend,
  icon,
  variant = 'default',
  chartType,
  chartData,
  trackerData,
  categoryData,
  target,
  footer,
  actions,
  loading = false,
  error = false,
  errorMessage,
  className,
  animate = true,
}: KPICardProps) {
  // Format value based on type
  const formattedValue = typeof value === 'number' 
    ? formatNumber(value) 
    : value

  // Loading state
  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          {chartType && <div className="h-10 bg-gray-200 rounded mt-3" />}
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={cn('border-red-200', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-600">{title}</CardTitle>
          <Info className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            {errorMessage || 'Failed to load data'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const cardContent = (
    <>
      <CardHeader className={cn(
        'flex flex-row items-center justify-between space-y-0',
        variant === 'compact' ? 'pb-2' : 'pb-3'
      )}>
        <CardTitle className={cn(
          'font-medium',
          variant === 'compact' ? 'text-xs' : 'text-sm'
        )}>
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              'text-muted-foreground',
              variant === 'compact' ? 'h-3 w-3' : 'h-4 w-4'
            )}>
              {icon}
            </div>
          )}
          {actions && variant !== 'compact' && (
            <div className="flex items-center gap-1">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={variant === 'compact' ? 'pb-2' : undefined}>
        {/* Main Value */}
        <div className={cn(
          'font-bold',
          variant === 'compact' ? 'text-lg' : 'text-2xl'
        )}>
          {formattedValue}
        </div>

        {/* Change Indicator */}
        {(change !== undefined || trend) && (
          <div className={cn(
            'flex items-center gap-2',
            variant === 'compact' ? 'mt-1' : 'mt-2'
          )}>
            <TrendIndicator 
              trend={trend} 
              change={change} 
              changeLabel={changeLabel}
            />
            {description && variant !== 'compact' && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}

        {/* Description (if no change indicator) */}
        {description && !change && !trend && (
          <p className={cn(
            'text-muted-foreground',
            variant === 'compact' ? 'text-xs mt-1' : 'text-xs mt-2'
          )}>
            {description}
          </p>
        )}

        {/* Mini Chart */}
        {chartType && (
          <div className={variant === 'compact' ? 'mt-2' : 'mt-3'}>
            <MiniChart
              type={chartType}
              data={chartData}
              trackerData={trackerData}
              categoryData={categoryData}
              target={target}
              height={variant === 'compact' ? 30 : 40}
            />
          </div>
        )}

        {/* Detailed variant extras */}
        {variant === 'detailed' && target && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Target</span>
              <span className="font-medium">{formatNumber(target)}</span>
            </div>
            {chartData && chartData.length > 0 && (
              <Progress 
                value={(chartData[chartData.length - 1].value / target) * 100}
                className="h-2"
                indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
              />
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      {footer && variant !== 'compact' && (
        <CardFooter className="pt-0">
          {footer}
        </CardFooter>
      )}
    </>
  )

  // Wrap with motion for animation
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className={className}
      >
        <Card className="h-full transition-shadow hover:shadow-lg">
          {cardContent}
        </Card>
      </motion.div>
    )
  }

  return (
    <Card className={cn('h-full', className)}>
      {cardContent}
    </Card>
  )
}

// KPI Card Group Component for grid layouts
export function KPICardGroup({
  children,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
  className,
}: {
  children: ReactNode
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  className?: string
}) {
  const gridClass = cn(
    'grid gap-4',
    `grid-cols-${columns.mobile || 1}`,
    `md:grid-cols-${columns.tablet || 2}`,
    `lg:grid-cols-${columns.desktop || 4}`,
    className
  )

  return <div className={gridClass}>{children}</div>
}

// Skeleton loader for KPI Card
export function KPICardSkeleton({ 
  variant = 'default' 
}: { 
  variant?: KPIVariant 
}) {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className={cn(
          'h-4 bg-gray-200 rounded',
          variant === 'compact' ? 'w-16' : 'w-24'
        )} />
        <div className={cn(
          'bg-gray-200 rounded',
          variant === 'compact' ? 'h-6 w-6' : 'h-8 w-8'
        )} />
      </CardHeader>
      <CardContent>
        <div className={cn(
          'bg-gray-200 rounded mb-2',
          variant === 'compact' ? 'h-6 w-24' : 'h-8 w-32'
        )} />
        <div className={cn(
          'bg-gray-200 rounded',
          variant === 'compact' ? 'h-2 w-16' : 'h-3 w-20'
        )} />
        {variant !== 'compact' && (
          <div className="h-10 bg-gray-200 rounded mt-3" />
        )}
      </CardContent>
    </Card>
  )
}