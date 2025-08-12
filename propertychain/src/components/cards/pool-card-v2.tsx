/**
 * Pool Card v2 - Standardized Implementation
 * PropertyLend DeFi Platform
 * 
 * Phase 2.2: Card Component Standardization
 * Uses the standardized card system for DeFi lending pools
 */

'use client'

import { StandardizedCard } from "@/components/ui/card-standardized"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Shield,
  Zap,
  Lock,
  Award,
  Activity,
  DollarSign,
  Wallet,
  Users,
  Timer,
  Flame,
  Coins
} from "lucide-react"
import { cn } from "@/lib/utils"

// Pool data interface
export interface PoolData {
  id: string
  name: string
  protocol?: string
  asset: string
  assetSymbol: string
  tvl: number
  apy: {
    senior: number
    junior: number
    current?: number
  }
  risk: 'low' | 'medium' | 'high'
  utilization: number
  liquidityAvailable: number
  minDeposit: number
  lockPeriod?: number
  status: 'active' | 'full' | 'paused' | 'upcoming'
  featured?: boolean
  verified?: boolean
  boosted?: boolean
  insurance?: boolean
  chain?: string
  investors?: number
  timeLeft?: number
  rewards?: {
    token: string
    amount: number
    apy: number
  }
  performanceHistory?: {
    '24h': number
    '7d': number
    '30d': number
  }
}

interface PoolCardV2Props {
  pool: PoolData
  variant?: 'default' | 'compact' | 'featured'
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  className?: string
}

export function PoolCardV2({
  pool,
  variant = 'default',
  onFavorite,
  onShare,
  className
}: PoolCardV2Props) {
  // Format large numbers
  const formatTVL = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(value)
  }

  // Format currency
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  // Get risk color
  const getRiskColor = (risk: PoolData['risk']) => {
    switch (risk) {
      case 'low': return 'success'
      case 'medium': return 'warning'  
      case 'high': return 'danger'
      default: return 'secondary'
    }
  }

  // Get status color
  const getStatusColor = (status: PoolData['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active': return 'secondary'
      case 'full': return 'default'
      case 'paused': return 'outline'
      case 'upcoming': return 'outline'
      default: return 'secondary'
    }
  }

  // Prepare badges
  const badges: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    icon?: React.ReactNode
  }> = []
  
  if (pool.featured) {
    badges.push({
      label: 'HOT',
      variant: 'destructive',
      icon: <Flame className="h-3 w-3" />
    })
  }
  
  if (pool.verified) {
    badges.push({
      label: 'Audited',
      variant: 'secondary',
      icon: <Shield className="h-3 w-3" />
    })
  }
  
  if (pool.boosted) {
    badges.push({
      label: '2x Rewards',
      variant: 'outline',
      icon: <Zap className="h-3 w-3" />
    })
  }
  
  if (pool.insurance) {
    badges.push({
      label: 'Insured',
      variant: 'default',
      icon: <Lock className="h-3 w-3" />
    })
  }

  badges.push({
    label: pool.status.toUpperCase(),
    variant: getStatusColor(pool.status)
  })

  // Prepare progress data for utilization
  const getUtilizationVariant = (utilization: number): 'success' | 'warning' | 'danger' => {
    if (utilization < 70) return 'success'
    if (utilization < 90) return 'warning'
    return 'danger'
  }

  const progress = {
    label: 'Utilization Rate',
    value: pool.utilization,
    max: 100,
    variant: getUtilizationVariant(pool.utilization)
  }

  // Card variant mapping
  const cardVariant = variant === 'featured' ? 'featured' : 
                     pool.featured ? 'featured' : 'pool'

  const cardSize = variant === 'compact' ? 'sm' : 
                  variant === 'featured' ? 'xl' : 'lg'

  return (
    <StandardizedCard
      className={className}
      variant={cardVariant}
      size={cardSize}
      title={pool.name}
      subtitle={pool.protocol}
      titleHref={`/pools/${pool.id}`}
      badges={badges}
      onFavorite={onFavorite ? () => onFavorite(pool.id) : undefined}
      onShare={onShare ? () => onShare(pool.id) : undefined}
      progress={progress}
      primaryAction={{
        label: pool.status === 'paused' ? 'Pool Paused' : 'Deposit Now',
        href: `/pools/${pool.id}`,
        variant: 'default',
        disabled: pool.status === 'paused'
      }}
      secondaryAction={variant === 'featured' ? {
        label: 'Analytics',
        href: `/pools/${pool.id}/analytics`,
        icon: <Activity className="h-4 w-4 mr-2" />
      } : undefined}
      minInvestment={formatCurrency(pool.minDeposit)}
    >
      {/* Header Section with APY */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 -mx-6 -mt-4 mb-4 p-4 rounded-lg border border-primary/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 backdrop-blur rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Senior Tranche</p>
            <p className="text-2xl font-bold text-blue-400">
              {pool.apy.senior}%
            </p>
            <p className="text-xs text-gray-600">APY</p>
          </div>
          <div className="bg-black/40 backdrop-blur rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Junior Tranche</p>
            <p className="text-2xl font-bold text-green-400">
              {pool.apy.junior}%
            </p>
            <p className="text-xs text-gray-600">APY</p>
          </div>
        </div>

        {/* Asset and Chain Info */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs bg-gray-900/50 text-gray-400 border-gray-700">
            {pool.assetSymbol}
          </Badge>
          {pool.chain && (
            <Badge variant="outline" className="text-xs bg-gray-900/50 text-gray-400 border-gray-700">
              {pool.chain}
            </Badge>
          )}
        </div>
      </div>

      {/* TVL and Liquidity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <DollarSign className="h-3 w-3" />
            <span>Total Value Locked</span>
          </div>
          <p className="text-lg font-bold text-white">
            {formatTVL(pool.tvl)}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Wallet className="h-3 w-3" />
            <span>Available</span>
          </div>
          <p className="text-lg font-bold text-white">
            {formatTVL(pool.liquidityAvailable)}
          </p>
        </div>
      </div>

      {/* Performance History */}
      {pool.performanceHistory && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(pool.performanceHistory).map(([period, change]) => (
            <div key={period} className="bg-gray-900/50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-500">{period}</p>
              <p className={cn(
                'text-sm font-semibold',
                change >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {change >= 0 ? '+' : ''}{change}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pool Details */}
      <div className="space-y-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Risk Level</span>
          <Badge 
            variant="outline"
            className={cn(
              'uppercase',
              getRiskColor(pool.risk) === 'success' && 'text-green-400 bg-green-950 border-green-800',
              getRiskColor(pool.risk) === 'warning' && 'text-yellow-400 bg-yellow-950 border-yellow-800',
              getRiskColor(pool.risk) === 'danger' && 'text-red-400 bg-red-950 border-red-800'
            )}
          >
            {pool.risk}
          </Badge>
        </div>
        
        {pool.lockPeriod && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Lock Period</span>
            <span className="text-white font-medium">{pool.lockPeriod} days</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {pool.investors !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{pool.investors}</span>
            </div>
          )}
          {pool.timeLeft !== undefined && (
            <div className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" />
              <span>{pool.timeLeft}d left</span>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Section */}
      {pool.rewards && (
        <div className="bg-gradient-to-r from-purple-900/20 to-primary/20 rounded-lg p-3 border border-purple-800/30 -mx-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-300">Bonus Rewards</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-purple-400">
                {pool.rewards.amount} {pool.rewards.token}
              </p>
              <p className="text-xs text-gray-500">+{pool.rewards.apy}% APY</p>
            </div>
          </div>
        </div>
      )}
    </StandardizedCard>
  )
}

// Skeleton loader for pool card v2
export function PoolCardV2Skeleton() {
  return (
    <div className="h-[520px] rounded-xl bg-gray-900/50 border border-gray-800 animate-pulse">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded p-3 space-y-2">
              <div className="h-3 bg-gray-700 rounded w-20" />
              <div className="h-8 bg-gray-700 rounded w-16" />
            </div>
            <div className="bg-gray-800 rounded p-3 space-y-2">
              <div className="h-3 bg-gray-700 rounded w-20" />
              <div className="h-8 bg-gray-700 rounded w-16" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-24" />
            <div className="h-6 bg-gray-800 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-20" />
            <div className="h-6 bg-gray-800 rounded w-20" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded" />
          <div className="flex justify-between">
            <div className="h-3 bg-gray-800 rounded w-20" />
            <div className="h-3 bg-gray-800 rounded w-12" />
          </div>
        </div>
        
        <div className="h-10 bg-gray-800 rounded" />
      </div>
    </div>
  )
}