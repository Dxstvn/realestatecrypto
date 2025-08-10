/**
 * DeFi Dashboard Component - PropertyLend
 * 
 * Comprehensive DeFi protocol dashboard with live metrics and analytics
 * Web3 native design with real-time data visualization
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Zap,
  Lock,
  Percent,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Wallet,
  Coins,
  Shield,
  Flame,
  Clock,
  AlertCircle,
  ChevronRight,
  Globe,
  Layers,
  Award,
  Target,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
  RadialBar,
  RadialBarChart,
} from 'recharts'

// Types
interface PoolMetric {
  id: string
  name: string
  tvl: number
  apy: number
  utilization: number
  change24h: number
  risk: 'low' | 'medium' | 'high'
}

interface UserPosition {
  poolId: string
  poolName: string
  deposited: number
  earned: number
  apy: number
  status: 'active' | 'locked' | 'pending'
}

interface ProtocolMetrics {
  tvl: number
  tvl24hChange: number
  totalUsers: number
  users24hChange: number
  volume24h: number
  volume24hChange: number
  avgApy: number
  apyChange: number
  activePools: number
  totalYieldPaid: number
}

interface DeFiDashboardProps {
  className?: string
}

export function DeFiDashboard({ className }: DeFiDashboardProps) {
  const [timeframe, setTimeframe] = React.useState('24h')
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Mock data - in production, this would come from API/blockchain
  const protocolMetrics: ProtocolMetrics = {
    tvl: 125430000,
    tvl24hChange: 5.2,
    totalUsers: 8234,
    users24hChange: 12.1,
    volume24h: 45200000,
    volume24hChange: 23.5,
    avgApy: 18.5,
    apyChange: -0.3,
    activePools: 24,
    totalYieldPaid: 8900000,
  }

  const topPools: PoolMetric[] = [
    { id: '1', name: 'USDC-ETH Senior', tvl: 25000000, apy: 8.5, utilization: 72, change24h: 2.1, risk: 'low' },
    { id: '2', name: 'USDC-ETH Junior', tvl: 18000000, apy: 25.3, utilization: 85, change24h: 5.4, risk: 'medium' },
    { id: '3', name: 'DAI Stable', tvl: 15000000, apy: 6.2, utilization: 65, change24h: -0.5, risk: 'low' },
    { id: '4', name: 'WBTC-ETH Junior', tvl: 12000000, apy: 32.1, utilization: 91, change24h: 8.7, risk: 'high' },
    { id: '5', name: 'USDT Senior', tvl: 10000000, apy: 7.8, utilization: 58, change24h: 1.2, risk: 'low' },
  ]

  const userPositions: UserPosition[] = [
    { poolId: '1', poolName: 'USDC-ETH Senior', deposited: 10000, earned: 850, apy: 8.5, status: 'active' },
    { poolId: '2', poolName: 'USDC-ETH Junior', deposited: 5000, earned: 1265, apy: 25.3, status: 'active' },
    { poolId: '3', poolName: 'DAI Stable', deposited: 15000, earned: 930, apy: 6.2, status: 'locked' },
  ]

  // Chart data
  const tvlHistoryData = [
    { time: '00:00', value: 120000000 },
    { time: '04:00', value: 121500000 },
    { time: '08:00', value: 123000000 },
    { time: '12:00', value: 122000000 },
    { time: '16:00', value: 124000000 },
    { time: '20:00', value: 125430000 },
  ]

  const poolDistributionData = [
    { name: 'Senior Tranches', value: 45, color: '#3b82f6' },
    { name: 'Junior Tranches', value: 35, color: '#10b981' },
    { name: 'Stable Pools', value: 20, color: '#8b5cf6' },
  ]

  const utilizationData = topPools.map(pool => ({
    name: pool.name.split(' ')[0],
    utilization: pool.utilization,
    fill: pool.utilization > 85 ? '#ef4444' : pool.utilization > 70 ? '#eab308' : '#10b981',
  }))

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            DeFi Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time protocol analytics and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-gray-700 hover:bg-primary/10"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Value Locked</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ${(protocolMetrics.tvl / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        'text-xs',
                        protocolMetrics.tvl24hChange >= 0 
                          ? 'text-green-400 border-green-400/50' 
                          : 'text-red-400 border-red-400/50'
                      )}
                    >
                      {protocolMetrics.tvl24hChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(protocolMetrics.tvl24hChange)}%
                    </Badge>
                    <span className="text-xs text-gray-500">24h</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800 hover:border-green-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average APY</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {protocolMetrics.avgApy}%
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        'text-xs',
                        protocolMetrics.apyChange >= 0 
                          ? 'text-green-400 border-green-400/50' 
                          : 'text-red-400 border-red-400/50'
                      )}
                    >
                      {protocolMetrics.apyChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(protocolMetrics.apyChange)}%
                    </Badge>
                    <span className="text-xs text-gray-500">vs yesterday</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Percent className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800 hover:border-blue-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">24h Volume</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    ${(protocolMetrics.volume24h / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge 
                      variant="outline"
                      className="text-xs text-blue-400 border-blue-400/50"
                    >
                      <Activity className="h-3 w-3" />
                      {protocolMetrics.volume24hChange}%
                    </Badge>
                    <span className="text-xs text-gray-500">change</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800 hover:border-purple-500/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatNumber(protocolMetrics.totalUsers)}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge 
                      variant="outline"
                      className="text-xs text-purple-400 border-purple-400/50"
                    >
                      <Users className="h-3 w-3" />
                      +{protocolMetrics.users24hChange}%
                    </Badge>
                    <span className="text-xs text-gray-500">growth</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TVL Chart */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">TVL History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tvlHistoryData}>
                  <defs>
                    <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      border: '1px solid #374151',
                      borderRadius: '8px' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#tvlGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pool Distribution */}
        <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Pool Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={poolDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {poolDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      border: '1px solid #374151',
                      borderRadius: '8px' 
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {poolDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="pools" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
          <TabsTrigger value="pools">Top Pools</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Top Performing Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPools.map((pool, index) => (
                  <motion.div
                    key={pool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                        <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{pool.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline"
                            className={cn(
                              'text-xs',
                              pool.risk === 'low' && 'text-green-400 border-green-400/50',
                              pool.risk === 'medium' && 'text-yellow-400 border-yellow-400/50',
                              pool.risk === 'high' && 'text-red-400 border-red-400/50'
                            )}
                          >
                            {pool.risk} risk
                          </Badge>
                          <span className="text-xs text-gray-500">
                            ${(pool.tvl / 1000000).toFixed(1)}M TVL
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">APY</p>
                        <p className="text-lg font-bold text-green-400">{pool.apy}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Utilization</p>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={pool.utilization} 
                            className="w-16 h-2"
                            indicatorClassName={cn(
                              pool.utilization > 85 && 'bg-red-500',
                              pool.utilization > 70 && pool.utilization <= 85 && 'bg-yellow-500',
                              pool.utilization <= 70 && 'bg-green-500'
                            )}
                          />
                          <span className="text-sm font-medium text-white">{pool.utilization}%</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Your Active Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPositions.map((position, index) => (
                  <motion.div
                    key={position.poolId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gray-900/50 border border-gray-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{position.poolName}</p>
                        <Badge 
                          variant="outline"
                          className={cn(
                            'text-xs mt-1',
                            position.status === 'active' && 'text-green-400 border-green-400/50',
                            position.status === 'locked' && 'text-yellow-400 border-yellow-400/50',
                            position.status === 'pending' && 'text-gray-400 border-gray-400/50'
                          )}
                        >
                          {position.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Current APY</p>
                        <p className="text-lg font-bold text-green-400">{position.apy}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Deposited</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(position.deposited)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Earned</p>
                        <p className="text-sm font-semibold text-green-400">
                          +{formatCurrency(position.earned)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Value</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(position.deposited + position.earned)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-sm text-gray-500">Total Portfolio Value</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(userPositions.reduce((acc, p) => acc + p.deposited + p.earned, 0))}
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                    Deposit More
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Pool Utilization Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationData}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: '#111827', 
                        border: '1px solid #374151',
                        borderRadius: '8px' 
                      }}
                    />
                    <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
                      {utilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Avg Utilization</p>
                  <p className="text-lg font-bold text-white">74.2%</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Total Pools</p>
                  <p className="text-lg font-bold text-white">{protocolMetrics.activePools}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Yield Paid</p>
                  <p className="text-lg font-bold text-green-400">
                    ${(protocolMetrics.totalYieldPaid / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-900/50">
                  <p className="text-xs text-gray-500">Health Score</p>
                  <p className="text-lg font-bold text-primary">95/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}