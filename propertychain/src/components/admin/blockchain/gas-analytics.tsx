/**
 * Gas Analytics Component - PropertyChain Admin
 * 
 * Monitor gas prices, analyze costs, and provide optimization suggestions
 * Following UpdatedUIPlan.md Step 55.5 specifications and CLAUDE.md principles
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  Zap, TrendingUp, TrendingDown, AlertTriangle, Info,
  Clock, DollarSign, Activity, RefreshCw, Download,
  AlertCircle, CheckCircle, ChevronRight, Gauge,
  Flame, Wind, Droplet, Target, Settings, ArrowUp,
  ArrowDown, Timer, Database, Package, Code
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Gas price tiers
interface GasPriceTier {
  label: string
  value: number
  speed: string
  estimatedTime: string
  color: string
  icon: React.ComponentType<any>
}

// Network congestion data
interface NetworkCongestion {
  level: 'low' | 'medium' | 'high' | 'very-high'
  baseFee: number
  priorityFee: number
  blockUtilization: number
  pendingTransactions: number
  averageWaitTime: number
}

// Optimization suggestion
interface OptimizationSuggestion {
  id: string
  type: 'timing' | 'batching' | 'contract' | 'network'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  potentialSavings: number
  implementation: string
  icon: React.ComponentType<any>
}

// Transaction cost analysis
interface TransactionCost {
  id: string
  function: string
  contract: string
  gasUsed: number
  gasPrice: number
  totalCost: number
  timestamp: Date
  network: string
  optimizable: boolean
}

export function GasAnalytics() {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum')
  const [timeRange, setTimeRange] = useState('24h')
  const [gasPriceHistory, setGasPriceHistory] = useState<any[]>([])
  const [currentGasPrices, setCurrentGasPrices] = useState<GasPriceTier[]>([])
  const [congestion, setCongestion] = useState<NetworkCongestion>({
    level: 'medium',
    baseFee: 35,
    priorityFee: 2,
    blockUtilization: 75,
    pendingTransactions: 12543,
    averageWaitTime: 45
  })
  const [isLive, setIsLive] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Generate gas price history
  useEffect(() => {
    const hours = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : 168
    const interval = timeRange === '1h' ? 5 : timeRange === '24h' ? 60 : 360 // minutes
    
    const data = Array.from({ length: hours }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (hours - i - 1) * interval)
      
      const basePrice = 30 + Math.sin(i / 4) * 10 + Math.random() * 5
      return {
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: timeRange === '1h' ? '2-digit' : undefined 
        }),
        slow: Math.floor(basePrice * 0.8),
        standard: Math.floor(basePrice),
        fast: Math.floor(basePrice * 1.3),
        instant: Math.floor(basePrice * 1.6),
        baseFee: Math.floor(basePrice * 0.9),
        priorityFee: Math.floor(basePrice * 0.1),
        blockUtilization: 50 + Math.sin(i / 3) * 30 + Math.random() * 10
      }
    })
    setGasPriceHistory(data)
  }, [timeRange, refreshKey])

  // Update current gas prices
  useEffect(() => {
    const baseFee = congestion.baseFee
    const prices: GasPriceTier[] = [
      {
        label: 'Slow',
        value: Math.floor(baseFee * 0.8),
        speed: '~10 minutes',
        estimatedTime: '10-30 min',
        color: '#10B981',
        icon: Droplet
      },
      {
        label: 'Standard',
        value: baseFee,
        speed: '~3 minutes',
        estimatedTime: '3-5 min',
        color: '#3B82F6',
        icon: Wind
      },
      {
        label: 'Fast',
        value: Math.floor(baseFee * 1.3),
        speed: '~1 minute',
        estimatedTime: '1-2 min',
        color: '#F59E0B',
        icon: Zap
      },
      {
        label: 'Instant',
        value: Math.floor(baseFee * 1.6),
        speed: '~15 seconds',
        estimatedTime: '15-30 sec',
        color: '#EF4444',
        icon: Flame
      }
    ]
    setCurrentGasPrices(prices)
  }, [congestion])

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setCongestion(prev => {
        const change = (Math.random() - 0.5) * 10
        const newBaseFee = Math.max(10, Math.min(200, prev.baseFee + change))
        const utilization = Math.max(20, Math.min(95, prev.blockUtilization + (Math.random() - 0.5) * 5))
        
        return {
          ...prev,
          baseFee: Math.floor(newBaseFee),
          priorityFee: Math.floor(newBaseFee * 0.1),
          blockUtilization: utilization,
          pendingTransactions: Math.floor(10000 + Math.random() * 5000),
          averageWaitTime: Math.floor(30 + utilization / 2),
          level: utilization > 80 ? 'very-high' : utilization > 60 ? 'high' : utilization > 40 ? 'medium' : 'low'
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  // Optimization suggestions
  const suggestions: OptimizationSuggestion[] = [
    {
      id: '1',
      type: 'timing',
      priority: 'high',
      title: 'Schedule Transactions During Off-Peak Hours',
      description: 'Gas prices are typically 40% lower between 2-6 AM UTC',
      potentialSavings: 40,
      implementation: 'Implement automated scheduling for non-urgent transactions',
      icon: Clock
    },
    {
      id: '2',
      type: 'batching',
      priority: 'high',
      title: 'Batch Multiple Transactions',
      description: 'Combine multiple operations into single transactions using multicall',
      potentialSavings: 35,
      implementation: 'Use Multicall3 contract for batch operations',
      icon: Package
    },
    {
      id: '3',
      type: 'contract',
      priority: 'medium',
      title: 'Optimize Storage Operations',
      description: 'Pack struct variables to use fewer storage slots',
      potentialSavings: 25,
      implementation: 'Refactor contract storage layout for efficiency',
      icon: Database
    },
    {
      id: '4',
      type: 'network',
      priority: 'medium',
      title: 'Use Layer 2 Solutions',
      description: 'Deploy contracts on Polygon or Arbitrum for 90% lower fees',
      potentialSavings: 90,
      implementation: 'Migrate appropriate contracts to L2 networks',
      icon: Activity
    },
    {
      id: '5',
      type: 'contract',
      priority: 'low',
      title: 'Implement Gas-Efficient Patterns',
      description: 'Use events instead of storage for historical data',
      potentialSavings: 20,
      implementation: 'Refactor contracts to emit events for off-chain indexing',
      icon: Code
    }
  ]

  // Sample transaction costs
  const transactionCosts: TransactionCost[] = Array.from({ length: 20 }, (_, i) => ({
    id: `tx-${i}`,
    function: ['mint', 'transfer', 'approve', 'burn', 'stake', 'claim'][Math.floor(Math.random() * 6)],
    contract: ['PropertyToken', 'MortgageManager', 'PaymentProcessor'][Math.floor(Math.random() * 3)],
    gasUsed: Math.floor(50000 + Math.random() * 200000),
    gasPrice: Math.floor(20 + Math.random() * 50),
    totalCost: 0,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    network: selectedNetwork,
    optimizable: Math.random() > 0.5
  })).map(tx => ({
    ...tx,
    totalCost: (tx.gasUsed * tx.gasPrice) / 1e9 // Convert to ETH
  }))

  // Network comparison data
  const networkComparison = [
    { network: 'Ethereum', avgGas: 35, transactions: 1200000, finalityTime: 15 },
    { network: 'Polygon', avgGas: 0.01, transactions: 3000000, finalityTime: 2 },
    { network: 'Arbitrum', avgGas: 0.1, transactions: 800000, finalityTime: 1 },
    { network: 'Optimism', avgGas: 0.15, transactions: 600000, finalityTime: 1 },
    { network: 'BSC', avgGas: 3, transactions: 5000000, finalityTime: 3 }
  ]

  // Gas usage by function
  const gasUsageByFunction = [
    { name: 'mint', value: 125000, percentage: 25 },
    { name: 'transfer', value: 65000, percentage: 13 },
    { name: 'approve', value: 45000, percentage: 9 },
    { name: 'burn', value: 55000, percentage: 11 },
    { name: 'stake', value: 85000, percentage: 17 },
    { name: 'claim', value: 125000, percentage: 25 }
  ]

  // Get congestion color
  const getCongestionColor = (level: NetworkCongestion['level']) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'very-high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // Calculate total costs
  const totalCosts = {
    today: transactionCosts.filter(tx => {
      const today = new Date()
      return tx.timestamp.toDateString() === today.toDateString()
    }).reduce((sum, tx) => sum + tx.totalCost, 0),
    week: transactionCosts.reduce((sum, tx) => sum + tx.totalCost, 0),
    avgPerTx: transactionCosts.reduce((sum, tx) => sum + tx.totalCost, 0) / transactionCosts.length,
    savingsPotential: suggestions.reduce((sum, s) => sum + s.potentialSavings, 0) / suggestions.length
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
              <SelectItem value="bsc">BSC</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            <Activity className={cn("h-4 w-4", isLive && "animate-pulse")} />
            {isLive ? 'Live' : 'Paused'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Network Congestion Alert */}
      {congestion.level === 'very-high' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>High Network Congestion:</strong> Gas prices are significantly elevated. 
            Consider delaying non-urgent transactions. Current wait time: ~{congestion.averageWaitTime} seconds.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Gas Prices */}
      <div className="grid grid-cols-4 gap-4">
        {currentGasPrices.map(tier => {
          const Icon = tier.icon
          return (
            <Card key={tier.label} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" style={{ color: tier.color }} />
                    <span className="font-medium">{tier.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tier.estimatedTime}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{tier.value}</p>
                  <p className="text-sm text-gray-500">Gwei</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: tier.color }} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Network Status</CardTitle>
            <Badge className={cn("gap-1", getCongestionColor(congestion.level))}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                congestion.level === 'low' && "bg-green-500",
                congestion.level === 'medium' && "bg-yellow-500",
                congestion.level === 'high' && "bg-orange-500",
                congestion.level === 'very-high' && "bg-red-500 animate-pulse"
              )} />
              {congestion.level.replace('-', ' ').toUpperCase()} CONGESTION
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-500">Base Fee</p>
              <div className="flex items-center gap-1">
                <p className="text-xl font-bold">{congestion.baseFee} Gwei</p>
                {congestion.baseFee > 50 ? (
                  <ArrowUp className="h-4 w-4 text-red-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Priority Fee</p>
              <p className="text-xl font-bold">{congestion.priorityFee} Gwei</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Block Utilization</p>
              <div className="space-y-1">
                <p className="text-xl font-bold">{congestion.blockUtilization.toFixed(1)}%</p>
                <Progress value={congestion.blockUtilization} className="h-2" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Txns</p>
              <p className="text-xl font-bold">{congestion.pendingTransactions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Wait Time</p>
              <p className="text-xl font-bold">{congestion.averageWaitTime}s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Price History</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="comparison">Network Comparison</TabsTrigger>
        </TabsList>

        {/* Price History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Gas Price Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={gasPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'Gas Price (Gwei)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="instant" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="fast" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="standard" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="slow" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Block Utilization</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={gasPriceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="blockUtilization" stroke="#8B5CF6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Base Fee vs Priority Fee</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={gasPriceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="baseFee" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="priorityFee" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Analysis Tab */}
        <TabsContent value="costs">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {transactionCosts.map(tx => (
                        <div key={tx.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {tx.function}
                                </Badge>
                                <span className="text-sm font-medium">{tx.contract}</span>
                                {tx.optimizable && (
                                  <Badge variant="secondary" className="text-xs gap-1">
                                    <Zap className="h-3 w-3" />
                                    Optimizable
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Gas: {tx.gasUsed.toLocaleString()}</span>
                                <span>Price: {tx.gasPrice} Gwei</span>
                                <span>{tx.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{tx.totalCost.toFixed(6)} ETH</p>
                              <p className="text-xs text-gray-500">
                                ${(tx.totalCost * 2000).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Today's Total</p>
                    <p className="text-2xl font-bold">{totalCosts.today.toFixed(4)} ETH</p>
                    <p className="text-sm text-gray-500">${(totalCosts.today * 2000).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weekly Total</p>
                    <p className="text-xl font-bold">{totalCosts.week.toFixed(4)} ETH</p>
                    <p className="text-sm text-gray-500">${(totalCosts.week * 2000).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Cost per Tx</p>
                    <p className="text-xl font-bold">{totalCosts.avgPerTx.toFixed(6)} ETH</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gas Usage by Function</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={gasUsageByFunction}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {gasUsageByFunction.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {gasUsageByFunction.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'][i] }}
                        />
                        <span>{item.name}: {item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Optimization Suggestions</CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Target className="h-3 w-3" />
                    {totalCosts.savingsPotential.toFixed(0)}% Potential Savings
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map(suggestion => {
                    const Icon = suggestion.icon
                    return (
                      <div
                        key={suggestion.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            suggestion.priority === 'high' && "bg-red-100",
                            suggestion.priority === 'medium' && "bg-yellow-100",
                            suggestion.priority === 'low' && "bg-blue-100"
                          )}>
                            <Icon className={cn(
                              "h-5 w-5",
                              suggestion.priority === 'high' && "text-red-600",
                              suggestion.priority === 'medium' && "text-yellow-600",
                              suggestion.priority === 'low' && "text-blue-600"
                            )} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{suggestion.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  suggestion.priority === 'high' ? 'destructive' :
                                  suggestion.priority === 'medium' ? 'default' : 'secondary'
                                }>
                                  {suggestion.priority}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                  <TrendingDown className="h-3 w-3" />
                                  {suggestion.potentialSavings}% savings
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-700">Implementation:</p>
                              <p className="text-xs text-gray-600 mt-1">{suggestion.implementation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Best Times to Transact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium">2 AM - 6 AM UTC</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        -40% gas
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">10 PM - 2 AM UTC</span>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        -25% gas
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">Weekends</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                        -15% gas
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Timer className="h-4 w-4" />
                    Schedule Batch Transaction
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Configure Gas Alerts
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Code className="h-4 w-4" />
                    Audit Contract Efficiency
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    Download Optimization Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Network Comparison Tab */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Network Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Average Gas Price</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={networkComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="network" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgGas" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Network Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={networkComparison}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="network" />
                      <PolarRadiusAxis />
                      <Radar name="Transactions" dataKey="transactions" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                      <Radar name="Finality Time" dataKey="finalityTime" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Network Details</h3>
                <div className="grid grid-cols-5 gap-4">
                  {networkComparison.map(network => (
                    <Card key={network.network}>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{network.network}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Gas:</span>
                            <span className="font-medium">${network.avgGas}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">TPS:</span>
                            <span className="font-medium">{(network.transactions / 86400).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Final:</span>
                            <span className="font-medium">{network.finalityTime}s</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}