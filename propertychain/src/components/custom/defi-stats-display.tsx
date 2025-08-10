/**
 * DeFi Stats Display Component - PropertyLend
 * 
 * Real-time DeFi protocol statistics and metrics
 * Web3 native design with glassmorphism and neon accents
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Zap,
  Lock,
  Unlock,
  Percent,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  RefreshCw,
  Wallet,
  Coins,
  Shield,
  Flame,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'

interface DeFiStat {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ElementType
  trend?: 'up' | 'down' | 'neutral'
  info?: string
  unit?: string
  color?: 'primary' | 'green' | 'blue' | 'yellow' | 'red' | 'purple'
}

interface DeFiStatsDisplayProps {
  stats: DeFiStat[]
  title?: string
  variant?: 'default' | 'compact' | 'detailed'
  refreshInterval?: number // in seconds
  onRefresh?: () => void
  className?: string
}

export function DeFiStatsDisplay({
  stats,
  title = "Protocol Statistics",
  variant = 'default',
  refreshInterval,
  onRefresh,
  className,
}: DeFiStatsDisplayProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // Auto-refresh functionality
  useEffect(() => {
    if (!refreshInterval || !onRefresh) return

    const interval = setInterval(() => {
      handleRefresh()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [refreshInterval, onRefresh])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    setLastRefresh(Date.now())
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getColorClasses = (color?: DeFiStat['color']) => {
    switch (color) {
      case 'primary':
        return 'text-primary border-primary/30 bg-primary/10'
      case 'green':
        return 'text-green-400 border-green-400/30 bg-green-400/10'
      case 'blue':
        return 'text-blue-400 border-blue-400/30 bg-blue-400/10'
      case 'yellow':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
      case 'red':
        return 'text-red-400 border-red-400/30 bg-red-400/10'
      case 'purple':
        return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
    }
  }

  const formatValue = (stat: DeFiStat) => {
    if (typeof stat.value === 'number') {
      if (stat.unit === '$') return formatCurrency(stat.value)
      if (stat.unit === '%') return formatPercentage(stat.value / 100)
      return formatNumber(stat.value)
    }
    return stat.value
  }

  return (
    <Card className={cn(
      'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950',
      'border border-gray-800',
      className
    )}>
      {title && (
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover:bg-primary/10"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isRefreshing && "animate-spin"
                )} />
              </Button>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className="p-6">
        <div className={cn(
          'grid gap-4',
          variant === 'compact' && 'grid-cols-2 md:grid-cols-4',
          variant === 'default' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          variant === 'detailed' && 'grid-cols-1 md:grid-cols-2'
        )}>
          <AnimatePresence mode="wait">
            {stats.map((stat, index) => {
              const Icon = stat.icon || Activity

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'relative group',
                    variant === 'detailed' && 'col-span-1'
                  )}
                >
                  <div className={cn(
                    'p-4 rounded-xl border backdrop-blur-sm transition-all duration-300',
                    'bg-gray-900/50 border-gray-800',
                    'hover:bg-gray-900/70 hover:border-primary/50',
                    'hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                  )}>
                    {/* Stat Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'p-2 rounded-lg',
                          getColorClasses(stat.color)
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            {stat.label}
                          </p>
                          {stat.info && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3 w-3 text-gray-600 cursor-help inline-block ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{stat.info}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>

                      {stat.trend && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs px-1.5 py-0.5',
                            stat.trend === 'up' && 'text-green-400 border-green-400/50',
                            stat.trend === 'down' && 'text-red-400 border-red-400/50',
                            stat.trend === 'neutral' && 'text-gray-400 border-gray-400/50'
                          )}
                        >
                          {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                          {stat.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                          {stat.trend === 'neutral' && <Activity className="h-3 w-3" />}
                        </Badge>
                      )}
                    </div>

                    {/* Stat Value */}
                    <div className="space-y-2">
                      <p className={cn(
                        'font-bold',
                        variant === 'compact' && 'text-lg',
                        variant === 'default' && 'text-2xl',
                        variant === 'detailed' && 'text-3xl',
                        'text-white'
                      )}>
                        {formatValue(stat)}
                      </p>

                      {/* Change Indicator */}
                      {stat.change !== undefined && (
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={cn(
                              'text-xs',
                              stat.change >= 0 
                                ? 'text-green-400 border-green-400/50 bg-green-400/10' 
                                : 'text-red-400 border-red-400/50 bg-red-400/10'
                            )}
                          >
                            {stat.change >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(stat.change)}%
                          </Badge>
                          {stat.changeLabel && (
                            <span className="text-xs text-gray-500">
                              {stat.changeLabel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Optional Progress Bar for percentage stats */}
                    {stat.unit === '%' && typeof stat.value === 'number' && (
                      <div className="mt-3">
                        <Progress 
                          value={stat.value} 
                          className="h-1.5 bg-gray-800"
                          indicatorClassName={cn(
                            'transition-all',
                            stat.value < 30 && 'bg-gradient-to-r from-red-600 to-red-400',
                            stat.value >= 30 && stat.value < 70 && 'bg-gradient-to-r from-yellow-600 to-yellow-400',
                            stat.value >= 70 && 'bg-gradient-to-r from-green-600 to-green-400'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Last Refresh Indicator */}
        {refreshInterval && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Auto-refresh: {refreshInterval}s</span>
              </div>
              <span>
                Last updated: {new Date(lastRefresh).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Common DeFi Stats Presets
export const DEFI_STATS_PRESETS = {
  tvl: (value: number, change?: number): DeFiStat => ({
    label: 'Total Value Locked',
    value,
    change,
    changeLabel: '24h',
    icon: Lock,
    trend: change ? (change >= 0 ? 'up' : 'down') : 'neutral',
    unit: '$',
    color: 'primary',
    info: 'Total value of assets locked in the protocol',
  }),
  
  apy: (value: number, change?: number): DeFiStat => ({
    label: 'Average APY',
    value,
    change,
    icon: Percent,
    trend: change ? (change >= 0 ? 'up' : 'down') : 'neutral',
    unit: '%',
    color: 'green',
    info: 'Average annual percentage yield across all pools',
  }),
  
  users: (value: number, change?: number): DeFiStat => ({
    label: 'Active Users',
    value,
    change,
    changeLabel: '7d',
    icon: Users,
    trend: change ? (change >= 0 ? 'up' : 'down') : 'neutral',
    color: 'blue',
    info: 'Number of unique active users',
  }),
  
  volume: (value: number, change?: number): DeFiStat => ({
    label: '24h Volume',
    value,
    change,
    icon: Activity,
    trend: change ? (change >= 0 ? 'up' : 'down') : 'neutral',
    unit: '$',
    color: 'purple',
    info: '24-hour trading volume',
  }),
  
  pools: (value: number): DeFiStat => ({
    label: 'Active Pools',
    value,
    icon: Coins,
    color: 'yellow',
    info: 'Number of active lending pools',
  }),
  
  utilization: (value: number): DeFiStat => ({
    label: 'Utilization Rate',
    value,
    icon: PieChart,
    unit: '%',
    color: value > 80 ? 'red' : value > 60 ? 'yellow' : 'green',
    info: 'Percentage of available liquidity being utilized',
  }),
}

// Example usage component
export function DeFiStatsExample() {
  const stats: DeFiStat[] = [
    DEFI_STATS_PRESETS.tvl(125_430_000, 5.2),
    DEFI_STATS_PRESETS.apy(18.5, -0.3),
    DEFI_STATS_PRESETS.users(8234, 12.1),
    DEFI_STATS_PRESETS.volume(45_200_000, 23.5),
    DEFI_STATS_PRESETS.pools(24),
    DEFI_STATS_PRESETS.utilization(73.2),
  ]

  return (
    <DeFiStatsDisplay
      stats={stats}
      title="PropertyLend Protocol Stats"
      variant="default"
      refreshInterval={30}
      onRefresh={() => console.log('Refreshing stats...')}
    />
  )
}