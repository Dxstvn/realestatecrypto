/**
 * Lending Pool Card Component - PropertyLend
 * 
 * DeFi lending pool card with yield metrics and liquidity details
 * Transformed from PropertyCard for Web3 DeFi platform
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Zap,
  Shield,
  Lock,
  Unlock,
  Activity,
  Coins,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Timer,
  Award,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '@/lib/format'

// Lending Pool type definitions
export interface LendingPoolData {
  id: string
  name: string
  protocol?: string
  asset: string
  assetSymbol: string
  tvl: number // Total Value Locked
  apy: {
    junior: number
    senior: number
    current?: number
  }
  risk: 'low' | 'medium' | 'high'
  utilization: number
  liquidityAvailable: number
  totalSupply: number
  totalBorrowed: number
  minDeposit: number
  lockPeriod?: number // in days
  status: 'active' | 'full' | 'paused' | 'upcoming'
  featured?: boolean
  verified?: boolean
  boosted?: boolean
  badges?: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }>
  investors?: number
  timeLeft?: number // days
  rewards?: {
    token: string
    amount: number
    apy: number
  }
  insurance?: boolean
  chain?: string
  performanceHistory?: {
    '24h': number
    '7d': number
    '30d': number
  }
}

interface LendingPoolCardProps {
  pool: LendingPoolData
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  className?: string
}

export function LendingPoolCard({
  pool,
  variant = 'default',
  showActions = true,
  onFavorite,
  onShare,
  className,
}: LendingPoolCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  // Determine risk color
  const getRiskColor = (risk: LendingPoolData['risk']) => {
    switch (risk) {
      case 'low':
        return 'text-green-400 bg-green-950 border-green-800'
      case 'medium':
        return 'text-yellow-400 bg-yellow-950 border-yellow-800'
      case 'high':
        return 'text-red-400 bg-red-950 border-red-800'
      default:
        return 'text-gray-400 bg-gray-950 border-gray-800'
    }
  }

  // Determine status color
  const getStatusColor = (status: LendingPoolData['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-950 border-green-800'
      case 'full':
        return 'text-blue-400 bg-blue-950 border-blue-800'
      case 'paused':
        return 'text-gray-400 bg-gray-950 border-gray-800'
      case 'upcoming':
        return 'text-purple-400 bg-purple-950 border-purple-800'
      default:
        return 'text-gray-400 bg-gray-950 border-gray-800'
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
    onFavorite?.(pool.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    onShare?.(pool.id)
  }

  // Format large numbers
  const formatTVL = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return formatCurrency(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn('h-full', className)}
    >
      <Card 
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all duration-300',
          'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950',
          'border border-gray-800 hover:border-primary/50',
          'hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
          pool.featured && 'ring-2 ring-primary ring-offset-2 ring-offset-gray-950',
          variant === 'compact' && 'min-h-[400px]',
          variant === 'default' && 'min-h-[480px]',
          variant === 'featured' && 'min-h-[520px]'
        )}
      >
        {/* Header Section with Gradient */}
        <div className="relative bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 p-6">
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Badges */}
          <div className="relative z-10 flex flex-wrap gap-2 mb-4">
            {pool.featured && (
              <Badge 
                className="bg-gradient-to-r from-primary to-purple-600 text-white border-0"
              >
                <Flame className="h-3 w-3 mr-1" />
                HOT
              </Badge>
            )}
            {pool.verified && (
              <Badge variant="secondary" className="bg-green-950 text-green-400 border-green-800 gap-1">
                <Shield className="h-3 w-3" />
                Audited
              </Badge>
            )}
            {pool.boosted && (
              <Badge className="bg-yellow-950 text-yellow-400 border-yellow-800">
                <Zap className="h-3 w-3 mr-1" />
                2x Rewards
              </Badge>
            )}
            {pool.insurance && (
              <Badge className="bg-blue-950 text-blue-400 border-blue-800">
                <Lock className="h-3 w-3 mr-1" />
                Insured
              </Badge>
            )}
          </div>

          {/* Pool Header */}
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-xl text-white mb-1">
                  {pool.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{pool.protocol}</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gray-900/50 text-gray-300 border-gray-700"
                  >
                    {pool.assetSymbol}
                  </Badge>
                  {pool.chain && (
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-gray-900/50 text-gray-300 border-gray-700"
                    >
                      {pool.chain}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {showActions && (
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/10 backdrop-blur hover:bg-white/20"
                          onClick={handleFavorite}
                        >
                          <Heart
                            className={cn(
                              'h-4 w-4',
                              isFavorited && 'fill-red-500 text-red-500'
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/10 backdrop-blur hover:bg-white/20"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share pool</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>

          {/* APY Display */}
          <div className="relative z-10 mt-4 grid grid-cols-2 gap-4">
            <div className="bg-black/40 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Junior Tranche</p>
              <p className="text-2xl font-bold text-green-400">
                {pool.apy.junior}%
              </p>
              <p className="text-xs text-gray-500">APY</p>
            </div>
            <div className="bg-black/40 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Senior Tranche</p>
              <p className="text-2xl font-bold text-blue-400">
                {pool.apy.senior}%
              </p>
              <p className="text-xs text-gray-500">APY</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 space-y-4 p-6">
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

          {/* Utilization Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Utilization Rate</span>
              <span className="font-medium text-white">{pool.utilization}%</span>
            </div>
            <Progress 
              value={pool.utilization} 
              className="h-2 bg-gray-800"
              indicatorClassName={cn(
                'transition-all',
                pool.utilization < 70 && 'bg-gradient-to-r from-green-600 to-green-400',
                pool.utilization >= 70 && pool.utilization < 90 && 'bg-gradient-to-r from-yellow-600 to-yellow-400',
                pool.utilization >= 90 && 'bg-gradient-to-r from-red-600 to-red-400'
              )}
            />
          </div>

          {/* Performance History */}
          {pool.performanceHistory && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">24h</p>
                <p className={cn(
                  'text-sm font-semibold',
                  pool.performanceHistory['24h'] >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {pool.performanceHistory['24h'] >= 0 ? '+' : ''}{pool.performanceHistory['24h']}%
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">7d</p>
                <p className={cn(
                  'text-sm font-semibold',
                  pool.performanceHistory['7d'] >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {pool.performanceHistory['7d'] >= 0 ? '+' : ''}{pool.performanceHistory['7d']}%
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">30d</p>
                <p className={cn(
                  'text-sm font-semibold',
                  pool.performanceHistory['30d'] >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {pool.performanceHistory['30d'] >= 0 ? '+' : ''}{pool.performanceHistory['30d']}%
                </p>
              </div>
            </div>
          )}

          {/* Pool Info */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Risk Level</span>
              <Badge 
                variant="outline"
                className={cn('uppercase', getRiskColor(pool.risk))}
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Min. Deposit</span>
              <span className="text-white font-medium">{formatCurrency(pool.minDeposit)}</span>
            </div>
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
              <Badge 
                variant="outline"
                className={cn('text-xs', getStatusColor(pool.status))}
              >
                {pool.status}
              </Badge>
            </div>
          </div>

          {/* Rewards Section */}
          {pool.rewards && (
            <div className="bg-gradient-to-r from-purple-900/20 to-primary/20 rounded-lg p-3 border border-purple-800/30">
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
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="pt-0 p-6">
          <div className="w-full space-y-3">
            <Separator className="bg-gray-800" />
            <div className="flex gap-2">
              <Link href={`/pools/${pool.id}`} className="flex-1">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                  size="lg"
                  disabled={pool.status === 'paused'}
                >
                  {pool.status === 'paused' ? 'Pool Paused' : 'Deposit Now'}
                </Button>
              </Link>
              {variant === 'featured' && (
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                  <Activity className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Skeleton loader for lending pool card
export function LendingPoolCardSkeleton() {
  return (
    <Card className="h-[480px] animate-pulse bg-gray-900 border-gray-800">
      <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-900" />
      <CardHeader className="pb-3">
        <div className="h-6 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-800 rounded" />
          <div className="h-12 bg-gray-800 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded" />
          <div className="flex justify-between">
            <div className="h-3 bg-gray-800 rounded w-20" />
            <div className="h-3 bg-gray-800 rounded w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-3">
          <div className="h-px bg-gray-800" />
          <div className="h-10 bg-gray-800 rounded" />
        </div>
      </CardFooter>
    </Card>
  )
}