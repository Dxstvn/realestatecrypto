/**
 * Revenue Dashboard Component - PropertyChain Admin
 * 
 * Real-time revenue tracking and analytics
 * Following UpdatedUIPlan.md Step 55.4 specifications and CLAUDE.md principles
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, Percent, Calendar,
  Download, Filter, RefreshCw, ArrowUp, ArrowDown, Activity,
  Wallet, CreditCard, Building2, Users, PiggyBank, Target,
  AlertCircle, ChevronRight, Clock, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Revenue stream types
interface RevenueStream {
  id: string
  name: string
  amount: number
  percentage: number
  change: number
  trend: 'up' | 'down' | 'stable'
  color: string
  icon: React.ComponentType<any>
}

// Transaction fee ticker item
interface TickerItem {
  id: string
  property: string
  amount: number
  fee: number
  timestamp: Date
  type: 'sale' | 'rental' | 'management' | 'tokenization'
}

// Revenue metrics
interface RevenueMetric {
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
  format: 'currency' | 'percentage' | 'number'
}

export function RevenueDashboard() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedStream, setSelectedStream] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  // Revenue streams
  const revenueStreams: RevenueStream[] = [
    {
      id: 'transaction-fees',
      name: 'Transaction Fees',
      amount: 2847500,
      percentage: 42,
      change: 18.5,
      trend: 'up',
      color: '#3B82F6',
      icon: CreditCard
    },
    {
      id: 'tokenization-fees',
      name: 'Tokenization Fees',
      amount: 1523000,
      percentage: 22,
      change: 25.3,
      trend: 'up',
      color: '#8B5CF6',
      icon: Building2
    },
    {
      id: 'management-fees',
      name: 'Management Fees',
      amount: 1234000,
      percentage: 18,
      change: -5.2,
      trend: 'down',
      color: '#EC4899',
      icon: Users
    },
    {
      id: 'listing-fees',
      name: 'Listing Fees',
      amount: 892000,
      percentage: 13,
      change: 12.1,
      trend: 'up',
      color: '#F59E0B',
      icon: Target
    },
    {
      id: 'premium-subscriptions',
      name: 'Premium Subscriptions',
      amount: 345000,
      percentage: 5,
      change: 8.7,
      trend: 'up',
      color: '#10B981',
      icon: Zap
    }
  ]

  // Key metrics
  const metrics: RevenueMetric[] = [
    { label: 'Total Revenue', value: 6841500, change: 15.3, trend: 'up', format: 'currency' },
    { label: 'Average Transaction', value: 28475, change: 8.2, trend: 'up', format: 'currency' },
    { label: 'Fee Rate', value: 2.5, change: 0.3, trend: 'up', format: 'percentage' },
    { label: 'Active Properties', value: 1247, change: 23, trend: 'up', format: 'number' }
  ]

  // Generate sample chart data
  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(180000 + Math.random() * 50000 + (i * 2000)),
        transactions: Math.floor(80 + Math.random() * 40 + (i * 2)),
        fees: Math.floor(4500 + Math.random() * 1500 + (i * 50)),
        'Transaction Fees': Math.floor(80000 + Math.random() * 20000),
        'Tokenization Fees': Math.floor(50000 + Math.random() * 15000),
        'Management Fees': Math.floor(40000 + Math.random() * 10000),
        'Listing Fees': Math.floor(25000 + Math.random() * 8000),
        'Premium Subscriptions': Math.floor(10000 + Math.random() * 3000)
      }
    })
    setRevenueData(data)
  }, [timeRange])

  // Simulate live ticker updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const properties = [
        'Marina Bay Towers #2501', 'Sunset Plaza #1203', 'The Grand Estate',
        'Park Avenue Residence', 'Ocean View Villa', 'Mountain Lodge #45'
      ]
      
      const newItem: TickerItem = {
        id: `ticker-${Date.now()}`,
        property: properties[Math.floor(Math.random() * properties.length)],
        amount: Math.floor(100000 + Math.random() * 900000),
        fee: Math.floor(2000 + Math.random() * 8000),
        timestamp: new Date(),
        type: ['sale', 'rental', 'management', 'tokenization'][Math.floor(Math.random() * 4)] as any
      }
      
      setTickerItems(prev => [newItem, ...prev].slice(0, 10))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  // Format value based on type
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${(value / 1000).toFixed(1)}K`
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'number':
        return value.toLocaleString()
      default:
        return value.toString()
    }
  }

  // Calculate total revenue
  const totalRevenue = revenueStreams.reduce((sum, stream) => sum + stream.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            <Activity className={cn("h-4 w-4", isLive && "animate-pulse")} />
            {isLive ? 'Live' : 'Paused'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Live Ticker */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Live Transaction Feed</CardTitle>
            <Badge variant={isLive ? 'default' : 'secondary'} className="gap-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
              )} />
              {isLive ? 'Live' : 'Paused'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-12 overflow-hidden relative">
            <AnimatePresence>
              {tickerItems.slice(0, 1).map(item => (
                <motion.div
                  key={item.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center px-6 bg-gradient-to-r from-blue-50 to-purple-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        {item.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{item.property}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-600">
                        Amount: ${item.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-green-600">
                        +${item.fee.toLocaleString()} fee
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{metric.label}</p>
                <Badge
                  variant={metric.trend === 'up' ? 'default' : 'destructive'}
                  className="gap-1 text-xs"
                >
                  {metric.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <p className="text-2xl font-bold">
                {formatValue(metric.value, metric.format)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Streams */}
      <div className="grid grid-cols-2 gap-6">
        {/* Stream Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueStreams.map(stream => {
                const Icon = stream.icon
                return (
                  <div
                    key={stream.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedStream === stream.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    )}
                    onClick={() => setSelectedStream(
                      selectedStream === stream.id ? null : stream.id
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" style={{ color: stream.color }} />
                        <span className="font-medium">{stream.name}</span>
                      </div>
                      <Badge
                        variant={stream.trend === 'up' ? 'default' : 'destructive'}
                        className="gap-1 text-xs"
                      >
                        {stream.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stream.change}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        ${(stream.amount / 1000).toFixed(0)}K
                      </span>
                      <span className="text-sm text-gray-500">
                        {stream.percentage}% of total
                      </span>
                    </div>
                    <Progress 
                      value={stream.percentage} 
                      className="h-2 mt-2"
                      style={{ 
                        // @ts-ignore
                        '--progress-background': stream.color 
                      }}
                    />
                  </div>
                )
              })}
            </div>
            
            {/* Total */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Revenue</span>
                <span className="text-2xl font-bold">
                  ${(totalRevenue / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueStreams}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {revenueStreams.map(stream => (
                <div key={stream.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stream.color }}
                  />
                  <span className="text-xs text-gray-600">{stream.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="streams">By Stream</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        {/* Overview Chart */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streams Chart */}
        <TabsContent value="streams">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`} />
                  <Legend />
                  {revenueStreams.map(stream => (
                    <Area
                      key={stream.id}
                      type="monotone"
                      dataKey={stream.name}
                      stackId="1"
                      stroke={stream.color}
                      fill={stream.color}
                      fillOpacity={0.6}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Chart */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume & Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#8B5CF6"
                    name="Transactions"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="fees"
                    stroke="#10B981"
                    name="Fees ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecast Chart */}
        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue Forecast</CardTitle>
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  AI Projection
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={[
                  ...revenueData,
                  ...Array.from({ length: 30 }, (_, i) => ({
                    date: `Future ${i + 1}`,
                    revenue: 230000 + (i * 3000) + Math.random() * 20000,
                    projected: true
                  }))
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeDasharray="0"
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Forecast Summary */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Projected Monthly</p>
                  <p className="text-xl font-bold text-green-600">$8.2M</p>
                  <p className="text-xs text-gray-500">+20% growth</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Confidence Score</p>
                  <p className="text-xl font-bold text-blue-600">87%</p>
                  <p className="text-xs text-gray-500">High accuracy</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Break-even Point</p>
                  <p className="text-xl font-bold text-purple-600">Q2 2025</p>
                  <p className="text-xs text-gray-500">6 months away</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}