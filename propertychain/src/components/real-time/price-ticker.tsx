/**
 * Real-time Price Ticker Component
 * PropertyLend DeFi Platform
 * 
 * Displays live APY and TVL updates with animations
 */

'use client'

import { useEffect, useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '@/lib/format'

// Safe WebSocket hook that handles SSR
function useSafeWebSocket() {
  try {
    // Import dynamically to avoid SSR issues
    const { useWebSocketContext } = require('@/components/providers/websocket-provider')
    return useWebSocketContext()
  } catch (error) {
    // Return mock context during SSR
    return {
      isConnected: false,
      lastMessage: null,
      subscribe: () => {},
      unsubscribe: () => {},
    }
  }
}

interface PriceTickerProps {
  poolId?: string
  variant?: 'compact' | 'detailed'
  className?: string
}

interface TickerData {
  apy: number
  tvl: number
  change24h: number
  lastUpdate: number
}

export function PriceTicker({ 
  poolId, 
  variant = 'compact',
  className 
}: PriceTickerProps) {
  const { isConnected, lastMessage, subscribe, unsubscribe } = useSafeWebSocket()
  const [data, setData] = useState<TickerData>({
    apy: 8.5,
    tvl: 125000000,
    change24h: 2.3,
    lastUpdate: Date.now()
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!isConnected) return

    const channel = poolId ? `pool:${poolId}` : 'global:stats'
    subscribe(channel)

    return () => {
      unsubscribe(channel)
    }
  }, [isConnected, poolId, subscribe, unsubscribe])

  useEffect(() => {
    if (!lastMessage) return

    // Handle different message types
    if (lastMessage.type === 'pool_update' || lastMessage.type === 'apy_change') {
      const newData = lastMessage.data
      
      // Only update if data is for this pool or global
      if (!poolId || newData.poolId === poolId) {
        setData(prev => ({
          apy: newData.apy || prev.apy,
          tvl: newData.tvl || prev.tvl,
          change24h: newData.change24h || prev.change24h,
          lastUpdate: Date.now()
        }))
        
        // Trigger update animation
        setIsUpdating(true)
        setTimeout(() => setIsUpdating(false), 500)
      }
    }
  }, [lastMessage, poolId])

  const isPositive = data.change24h >= 0

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center gap-4 px-3 py-2 rounded-lg',
        'bg-gray-900/50 backdrop-blur-sm border border-gray-800',
        isUpdating && 'ring-2 ring-primary/50 transition-all',
        className
      )}>
        <div className="flex items-center gap-2">
          <Activity className={cn(
            'h-4 w-4',
            isConnected ? 'text-green-400 animate-pulse' : 'text-gray-600'
          )} />
          <span className="text-xs text-gray-500">APY</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={data.apy}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="font-bold text-white"
            >
              {formatPercentage(data.apy)}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
          <span className={cn(
            'text-sm font-medium',
            isPositive ? 'text-green-400' : 'text-red-400'
          )}>
            {isPositive ? '+' : ''}{formatPercentage(data.change24h)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'p-4 rounded-xl',
      'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950',
      'border border-gray-800',
      isUpdating && 'shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Live Stats</h3>
        <div className="flex items-center gap-1">
          <Activity className={cn(
            'h-3 w-3',
            isConnected ? 'text-green-400 animate-pulse' : 'text-gray-600'
          )} />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* APY */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Current APY</span>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={data.apy}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="text-xl font-bold text-white"
              >
                {formatPercentage(data.apy)}
              </motion.span>
            </AnimatePresence>
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              isPositive 
                ? 'bg-green-950 text-green-400' 
                : 'bg-red-950 text-red-400'
            )}>
              {isPositive ? '+' : ''}{formatPercentage(data.change24h)}
            </span>
          </div>
        </div>

        {/* TVL */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Value Locked</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={data.tvl}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-semibold text-white"
            >
              {formatCurrency(data.tvl)}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Last Update */}
        <div className="pt-2 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Last update</span>
            <span>{new Date(data.lastUpdate).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}