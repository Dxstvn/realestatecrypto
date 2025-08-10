/**
 * KPI Strip Component - PropertyChain Admin
 * 
 * Real-time business metrics display with WebSocket updates
 * Following UpdatedUIPlan.md Section 10.2 specifications
 */

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/format'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'

interface KPIMetric {
  id: string
  label: string
  value: number
  previousValue: number
  format: 'currency' | 'number' | 'percentage'
  icon: React.ElementType
  color: string
  suffix?: string
}

interface KPIStripProps {
  onExport?: () => void
}

export function KPIStrip({ onExport }: KPIStripProps) {
  const [metrics, setMetrics] = useState<KPIMetric[]>([
    {
      id: 'tvl',
      label: 'Total Value Locked',
      value: 125750000,
      previousValue: 115000000,
      format: 'currency',
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      id: 'revenue',
      label: 'Platform Revenue',
      value: 2847500,
      previousValue: 2450000,
      format: 'currency',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      id: 'investors',
      label: 'Active Investors',
      value: 15234,
      previousValue: 14100,
      format: 'number',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      id: 'properties',
      label: 'Properties Listed',
      value: 342,
      previousValue: 310,
      format: 'number',
      icon: Building,
      color: 'text-orange-600',
    },
    {
      id: 'volume',
      label: 'Transaction Volume (24h)',
      value: 8975000,
      previousValue: 7250000,
      format: 'currency',
      icon: Activity,
      color: 'text-indigo-600',
    },
  ])
  
  const [isConnected, setIsConnected] = useState(false)
  
  // WebSocket connection for real-time updates
  useEffect(() => {
    // In production, connect to actual WebSocket
    const connectWebSocket = () => {
      try {
        // Mock WebSocket connection
        setIsConnected(true)
        
        // Simulate real-time updates
        const interval = setInterval(() => {
          setMetrics(prev => prev.map(metric => ({
            ...metric,
            value: metric.value + (Math.random() - 0.5) * (metric.value * 0.001),
          })))
        }, 5000)
        
        return () => {
          clearInterval(interval)
          setIsConnected(false)
        }
      } catch (error) {
        console.error('WebSocket connection failed:', error)
        setIsConnected(false)
      }
    }
    
    const cleanup = connectWebSocket()
    return cleanup
  }, [])
  
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
    }
  }
  
  const formatValue = (value: number, format: KPIMetric['format']) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return formatPercentage(value)
      default:
        return formatNumber(value)
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Header with export button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Business Metrics</h2>
          {isConnected && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export KPIs
        </Button>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((metric, index) => {
          const change = calculateChange(metric.value, metric.previousValue)
          const Icon = metric.icon
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Icon and Label */}
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "p-2 rounded-lg bg-opacity-10",
                      metric.color.replace('text-', 'bg-')
                    )}>
                      <Icon className={cn("h-5 w-5", metric.color)} />
                    </div>
                    
                    {/* Change indicator */}
                    <div className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      change.isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {change.isPositive ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {change.value.toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div>
                    <div className="text-2xl font-bold">
                      {metric.format === 'currency' && '$'}
                      <CountUp
                        end={metric.value}
                        duration={1}
                        separator=","
                        decimals={metric.format === 'currency' ? 0 : 0}
                        preserveValue
                      />
                      {metric.suffix}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {metric.label}
                    </p>
                  </div>
                  
                  {/* Sparkline placeholder */}
                  <div className="h-8 relative">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100 30"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        fill="none"
                        stroke={metric.color.replace('text-', '#')}
                        strokeWidth="2"
                        points={`0,${20 + Math.random() * 10} 25,${15 + Math.random() * 10} 50,${10 + Math.random() * 10} 75,${5 + Math.random() * 10} 100,${Math.random() * 10}`}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-20"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
      
      {/* Period selector */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-gray-500">Comparing to:</span>
        <div className="inline-flex rounded-lg border">
          {['24h', '7d', '30d', '1y'].map((period) => (
            <button
              key={period}
              className={cn(
                "px-3 py-1 text-sm transition-colors",
                period === '24h' 
                  ? "bg-primary text-white" 
                  : "hover:bg-gray-100"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}