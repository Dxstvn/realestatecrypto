/**
 * Market Data Feed Component - PropertyChain
 * 
 * Real-time market data and analytics dashboard
 * Following UpdatedUIPlan.md Step 48 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  Percent,
  Users,
  Building,
  Home,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Minus,
  Plus,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Bell,
  BellOff,
  Zap,
  Target,
  Award,
  Flame,
  Hash,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MoreVertical,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'
import { useWebSocket } from '@/providers/websocket-provider'

// Types
interface MarketMetric {
  id: string
  name: string
  value: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: number[]
  updatedAt: Date
}

interface PropertyMarketData {
  id: string
  title: string
  type: string
  location: string
  currentPrice: number
  tokenPrice: number
  marketCap: number
  volume24h: number
  priceChange24h: number
  priceChange7d: number
  priceChange30d: number
  holders: number
  transactions: number
  liquidityScore: number
  volatilityIndex: number
  priceHistory: { time: Date; price: number }[]
}

interface MarketAlert {
  id: string
  type: 'price' | 'volume' | 'listing' | 'news'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  propertyId?: string
  timestamp: Date
  isRead: boolean
}

interface TrendingProperty {
  id: string
  title: string
  image: string
  location: string
  price: number
  change24h: number
  volume: number
  rank: number
  momentum: 'hot' | 'rising' | 'cooling'
}

interface MarketDataFeedProps {
  propertyId?: string
  showAlerts?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function MarketDataFeed({
  propertyId,
  showAlerts = true,
  autoRefresh = true,
  refreshInterval = 30000,
}: MarketDataFeedProps) {
  const { subscribe, isConnected } = useWebSocket()
  const { toast } = useToast()

  // State
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d' | '1y'>('24h')
  const [selectedMarket, setSelectedMarket] = useState<'all' | 'residential' | 'commercial' | 'industrial'>('all')
  const [marketMetrics, setMarketMetrics] = useState<MarketMetric[]>([
    {
      id: 'total-value',
      name: 'Total Market Value',
      value: 2456789000,
      change: 125000000,
      changePercent: 5.37,
      trend: 'up',
      sparklineData: [100, 105, 103, 108, 112, 110, 115, 118],
      updatedAt: new Date(),
    },
    {
      id: 'avg-price',
      name: 'Average Token Price',
      value: 250,
      change: 12,
      changePercent: 5.04,
      trend: 'up',
      sparklineData: [238, 240, 245, 242, 248, 250, 248, 250],
      updatedAt: new Date(),
    },
    {
      id: 'total-volume',
      name: '24h Trading Volume',
      value: 45678900,
      change: -2340000,
      changePercent: -4.87,
      trend: 'down',
      sparklineData: [48, 46, 47, 45, 43, 44, 46, 45],
      updatedAt: new Date(),
    },
    {
      id: 'active-listings',
      name: 'Active Listings',
      value: 1234,
      change: 56,
      changePercent: 4.75,
      trend: 'up',
      sparklineData: [1178, 1190, 1200, 1210, 1220, 1225, 1230, 1234],
      updatedAt: new Date(),
    },
  ])

  const [trendingProperties, setTrendingProperties] = useState<TrendingProperty[]>([
    {
      id: '1',
      title: 'Downtown Office Complex',
      image: '/images/property-1.jpg',
      location: 'New York, NY',
      price: 5000000,
      change24h: 8.5,
      volume: 2340000,
      rank: 1,
      momentum: 'hot',
    },
    {
      id: '2',
      title: 'Luxury Apartment Building',
      image: '/images/property-2.jpg',
      location: 'Los Angeles, CA',
      price: 3500000,
      change24h: 6.2,
      volume: 1890000,
      rank: 2,
      momentum: 'rising',
    },
    {
      id: '3',
      title: 'Industrial Warehouse',
      image: '/images/property-3.jpg',
      location: 'Chicago, IL',
      price: 2800000,
      change24h: -2.1,
      volume: 980000,
      rank: 3,
      momentum: 'cooling',
    },
  ])

  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([
    {
      id: 'alert-1',
      type: 'price',
      severity: 'high',
      title: 'Significant Price Movement',
      description: 'Downtown Office Complex increased 15% in the last hour',
      propertyId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
    {
      id: 'alert-2',
      type: 'listing',
      severity: 'medium',
      title: 'New Premium Listing',
      description: 'Waterfront Resort Property now available for investment',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())

  // Subscribe to market updates
  useEffect(() => {
    const unsubscribe = subscribe('market_update', (data) => {
      // Update market metrics
      if (data.metrics) {
        setMarketMetrics(prev => 
          prev.map(metric => {
            const update = data.metrics.find((m: any) => m.id === metric.id)
            if (update) {
              return {
                ...metric,
                value: update.value,
                change: update.change,
                changePercent: update.changePercent,
                trend: update.trend,
                sparklineData: [...metric.sparklineData.slice(1), update.value],
                updatedAt: new Date(),
              }
            }
            return metric
          })
        )
      }

      // Update trending properties
      if (data.trending) {
        setTrendingProperties(data.trending)
      }

      // Add new alerts
      if (data.alert && notifications) {
        const newAlert: MarketAlert = {
          id: `alert-${Date.now()}`,
          type: data.alert.type,
          severity: data.alert.severity,
          title: data.alert.title,
          description: data.alert.description,
          propertyId: data.alert.propertyId,
          timestamp: new Date(),
          isRead: false,
        }
        
        setMarketAlerts(prev => [newAlert, ...prev])
        
        if (newAlert.severity === 'high') {
          toast({
            title: newAlert.title,
            description: newAlert.description,
          })
        }
      }

      setLastUpdateTime(new Date())
    })

    return unsubscribe
  }, [subscribe, notifications, toast])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdateTime(new Date())
    }, 1000)
  }

  // Mark alert as read
  const markAlertAsRead = (alertId: string) => {
    setMarketAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    )
  }

  // Format value
  const formatValue = (value: number, type: 'currency' | 'number' | 'percent' = 'number') => {
    switch (type) {
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'percent':
        return `${value.toFixed(2)}%`
      default:
        return value.toLocaleString()
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-[#4CAF50]" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-[#DC3545]" />
      default:
        return <Minus className="h-4 w-4 text-[#9E9E9E]" />
    }
  }

  // Get momentum badge
  const getMomentumBadge = (momentum: TrendingProperty['momentum']) => {
    switch (momentum) {
      case 'hot':
        return (
          <Badge className="bg-[#DC3545] text-white">
            <Flame className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        )
      case 'rising':
        return (
          <Badge className="bg-[#FF6347] text-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            Rising
          </Badge>
        )
      case 'cooling':
        return (
          <Badge className="bg-[#007BFF] text-white">
            <TrendingDown className="h-3 w-3 mr-1" />
            Cooling
          </Badge>
        )
    }
  }

  // Unread alerts count
  const unreadAlertsCount = marketAlerts.filter(a => !a.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Data</h2>
          <p className="text-sm text-[#9E9E9E]">
            Last updated: {lastUpdateTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <Select value={selectedTimeframe} onValueChange={(v: any) => setSelectedTimeframe(v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="1y">1Y</SelectItem>
            </SelectContent>
          </Select>

          {/* Market Filter */}
          <Select value={selectedMarket} onValueChange={(v: any) => setSelectedMarket(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>

          {/* Actions */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">{metric.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {metric.name.includes('Value') || metric.name.includes('Volume')
                    ? formatValue(metric.value, 'currency')
                    : metric.name.includes('Price')
                    ? `$${metric.value}`
                    : formatValue(metric.value, 'number')}
                </span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "text-sm font-medium",
                  metric.trend === 'up' ? "text-[#4CAF50]" : 
                  metric.trend === 'down' ? "text-[#DC3545]" : "text-[#9E9E9E]"
                )}>
                  {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                  {Math.abs(metric.changePercent).toFixed(2)}%
                </span>
                <span className="text-xs text-[#9E9E9E]">
                  {selectedTimeframe.toUpperCase()}
                </span>
              </div>
              {/* Mini Sparkline */}
              <div className="mt-3 h-8 flex items-end gap-0.5">
                {metric.sparklineData.map((value, index) => {
                  const height = (value / Math.max(...metric.sparklineData)) * 100
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 rounded-t",
                        metric.trend === 'up' ? "bg-[#4CAF50]" :
                        metric.trend === 'down' ? "bg-[#DC3545]" : "bg-[#9E9E9E]"
                      )}
                      style={{ height: `${height}%` }}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="movers">Top Movers</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {unreadAlertsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadAlertsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Trending Properties */}
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trending Properties</CardTitle>
              <CardDescription>Most active properties in the last {selectedTimeframe}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-[#9E9E9E] w-8">
                        #{property.rank}
                      </div>
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-[#9E9E9E]">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {property.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatValue(property.price, 'currency')}</p>
                        <p className="text-sm">
                          <span className={cn(
                            property.change24h > 0 ? "text-[#4CAF50]" : "text-[#DC3545]"
                          )}>
                            {property.change24h > 0 ? '+' : ''}{property.change24h}%
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#9E9E9E]">Volume</p>
                        <p className="text-sm font-medium">{formatValue(property.volume, 'currency')}</p>
                      </div>
                      {getMomentumBadge(property.momentum)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Movers */}
        <TabsContent value="movers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#4CAF50]" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F5F5]">
                      <div>
                        <p className="font-medium">Property {i}</p>
                        <p className="text-xs text-[#9E9E9E]">Location {i}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#4CAF50]">+{(Math.random() * 20 + 5).toFixed(2)}%</p>
                        <p className="text-xs text-[#9E9E9E]">${(Math.random() * 100 + 200).toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-[#DC3545]" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F5F5]">
                      <div>
                        <p className="font-medium">Property {i + 3}</p>
                        <p className="text-xs text-[#9E9E9E]">Location {i + 3}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#DC3545]">-{(Math.random() * 15 + 2).toFixed(2)}%</p>
                        <p className="text-xs text-[#9E9E9E]">${(Math.random() * 100 + 150).toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Alerts</CardTitle>
              <CardDescription>Important market events and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {marketAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors cursor-pointer",
                        !alert.isRead && "bg-[#E6F2FF] border-[#99C2FF]"
                      )}
                      onClick={() => markAlertAsRead(alert.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "mt-1",
                          alert.severity === 'high' && "text-[#DC3545]",
                          alert.severity === 'medium' && "text-[#FF6347]",
                          alert.severity === 'low' && "text-[#007BFF]"
                        )}>
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{alert.title}</p>
                            <span className="text-xs text-[#9E9E9E]">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#757575] mt-1">{alert.description}</p>
                          {alert.propertyId && (
                            <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                              View Property
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connection Status */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-[#9E9E9E]">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-[#4CAF50]" : "bg-[#DC3545]"
          )} />
          <span>{isConnected ? 'Connected' : 'Disconnected'} to live market data</span>
        </div>
      </div>
    </div>
  )
}