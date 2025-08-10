/**
 * Business Metrics Component - PropertyChain Admin
 * 
 * Comprehensive KPI tracking and analytics for business owners
 * Following UpdatedUIPlan.md Section 10 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Receipt,
  Activity,
  Target,
  Award,
  Zap,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Minus,
  Info,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  Hash,
  Percent,
  Calculator,
  CreditCard,
  Wallet,
  Globe,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  Briefcase,
  ShoppingCart,
  Package,
  Truck,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Types
interface MetricData {
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  target?: number
  forecast?: number
  history: Array<{
    date: string
    value: number
  }>
}

interface BusinessMetricsData {
  revenue: {
    total: MetricData
    recurring: MetricData
    transaction: MetricData
    bySource: Record<string, number>
    byRegion: Record<string, number>
  }
  costs: {
    total: MetricData
    operational: MetricData
    marketing: MetricData
    infrastructure: MetricData
    breakdown: Record<string, number>
  }
  profitability: {
    grossProfit: MetricData
    netProfit: MetricData
    ebitda: MetricData
    margins: {
      gross: number
      net: number
      operating: number
    }
  }
  growth: {
    userGrowth: MetricData
    revenueGrowth: MetricData
    transactionGrowth: MetricData
    propertyGrowth: MetricData
  }
  efficiency: {
    cac: MetricData // Customer Acquisition Cost
    ltv: MetricData // Lifetime Value
    ltvCacRatio: number
    churnRate: MetricData
    retentionRate: MetricData
  }
  performance: {
    arpu: MetricData // Average Revenue Per User
    conversionRate: MetricData
    avgTransactionSize: MetricData
    platformUptime: MetricData
  }
}

// Mock data
const mockMetrics: BusinessMetricsData = {
  revenue: {
    total: {
      value: 2456789,
      change: 12.5,
      trend: 'up',
      target: 2500000,
      forecast: 2650000,
      history: [
        { date: '2024-01-15', value: 2200000 },
        { date: '2024-01-16', value: 2280000 },
        { date: '2024-01-17', value: 2350000 },
        { date: '2024-01-18', value: 2400000 },
        { date: '2024-01-19', value: 2456789 },
      ],
    },
    recurring: {
      value: 1850000,
      change: 8.3,
      trend: 'up',
      history: [],
    },
    transaction: {
      value: 606789,
      change: 15.7,
      trend: 'up',
      history: [],
    },
    bySource: {
      'Platform Fees': 1200000,
      'Subscription': 850000,
      'Transaction Fees': 406789,
    },
    byRegion: {
      'North America': 1473000,
      'Europe': 615000,
      'Asia Pacific': 368789,
    },
  },
  costs: {
    total: {
      value: 1845000,
      change: 5.2,
      trend: 'up',
      history: [],
    },
    operational: {
      value: 923000,
      change: 3.1,
      trend: 'up',
      history: [],
    },
    marketing: {
      value: 461000,
      change: 12.5,
      trend: 'up',
      history: [],
    },
    infrastructure: {
      value: 461000,
      change: 2.8,
      trend: 'up',
      history: [],
    },
    breakdown: {
      'Salaries': 650000,
      'Infrastructure': 461000,
      'Marketing': 461000,
      'Operations': 273000,
    },
  },
  profitability: {
    grossProfit: {
      value: 1597000,
      change: 18.3,
      trend: 'up',
      target: 1625000,
      history: [],
    },
    netProfit: {
      value: 611789,
      change: 22.5,
      trend: 'up',
      target: 625000,
      history: [],
    },
    ebitda: {
      value: 736000,
      change: 19.8,
      trend: 'up',
      history: [],
    },
    margins: {
      gross: 65,
      net: 24.9,
      operating: 30,
    },
  },
  growth: {
    userGrowth: {
      value: 15.2,
      change: 2.3,
      trend: 'up',
      target: 20,
      history: [],
    },
    revenueGrowth: {
      value: 12.5,
      change: 1.8,
      trend: 'up',
      target: 15,
      history: [],
    },
    transactionGrowth: {
      value: 18.7,
      change: 3.2,
      trend: 'up',
      target: 20,
      history: [],
    },
    propertyGrowth: {
      value: 8.3,
      change: -0.5,
      trend: 'down',
      target: 10,
      history: [],
    },
  },
  efficiency: {
    cac: {
      value: 125,
      change: -5.3,
      trend: 'down',
      target: 100,
      history: [],
    },
    ltv: {
      value: 2850,
      change: 8.7,
      trend: 'up',
      target: 3000,
      history: [],
    },
    ltvCacRatio: 22.8,
    churnRate: {
      value: 3.2,
      change: -0.4,
      trend: 'down',
      target: 2.5,
      history: [],
    },
    retentionRate: {
      value: 96.8,
      change: 0.4,
      trend: 'up',
      target: 97,
      history: [],
    },
  },
  performance: {
    arpu: {
      value: 432,
      change: 6.8,
      trend: 'up',
      target: 450,
      history: [],
    },
    conversionRate: {
      value: 12.5,
      change: 1.2,
      trend: 'up',
      target: 15,
      history: [],
    },
    avgTransactionSize: {
      value: 13225,
      change: 4.3,
      trend: 'up',
      history: [],
    },
    platformUptime: {
      value: 99.95,
      change: 0.02,
      trend: 'up',
      target: 99.99,
      history: [],
    },
  },
}

interface BusinessMetricsProps {
  data?: BusinessMetricsData
  timeRange?: string
  onRefresh?: () => void
  onExport?: () => void
}

export function BusinessMetrics({
  data = mockMetrics,
  timeRange = '30d',
  onRefresh,
  onExport,
}: BusinessMetricsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'profitability' | 'growth' | 'efficiency'>('revenue')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate period comparison
  const periodComparison = useMemo(() => {
    const current = data.revenue.total.value
    const previous = current / (1 + data.revenue.total.change / 100)
    const difference = current - previous
    const percentChange = data.revenue.total.change

    return {
      current,
      previous,
      difference,
      percentChange,
    }
  }, [data])

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable', isPositive = true) => {
    if (trend === 'up') {
      return (
        <TrendingUp 
          className={cn(
            "h-4 w-4",
            isPositive ? "text-[#4CAF50]" : "text-[#DC3545]"
          )} 
        />
      )
    }
    if (trend === 'down') {
      return (
        <TrendingDown 
          className={cn(
            "h-4 w-4",
            isPositive ? "text-[#DC3545]" : "text-[#4CAF50]"
          )} 
        />
      )
    }
    return <Minus className="h-4 w-4 text-[#9E9E9E]" />
  }

  // Format metric value
  const formatMetricValue = (value: number, type: 'currency' | 'percentage' | 'number' = 'currency') => {
    if (type === 'currency') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`
      }
      return `$${value.toFixed(0)}`
    }
    if (type === 'percentage') {
      return `${value.toFixed(1)}%`
    }
    return value.toLocaleString()
  }

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    if (onRefresh) {
      await onRefresh()
    }
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#212121]">Business Metrics</h2>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Key performance indicators and financial metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-[#212121]">
                  {formatMetricValue(data.revenue.total.value)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.revenue.total.trend)}
                  <span className={cn(
                    "text-xs font-medium",
                    data.revenue.total.trend === 'up' ? "text-[#4CAF50]" : "text-[#DC3545]"
                  )}>
                    {Math.abs(data.revenue.total.change)}%
                  </span>
                  <span className="text-xs text-[#9E9E9E]">vs prev period</span>
                </div>
              </div>
              <div className="text-right">
                {data.revenue.total.target && (
                  <div className="text-xs text-[#9E9E9E]">
                    Target: {formatMetricValue(data.revenue.total.target)}
                  </div>
                )}
                <Progress 
                  value={(data.revenue.total.value / (data.revenue.total.target || data.revenue.total.value)) * 100} 
                  className="h-1 mt-2 w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-[#212121]">
                  {formatMetricValue(data.profitability.netProfit.value)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.profitability.netProfit.trend)}
                  <span className={cn(
                    "text-xs font-medium",
                    data.profitability.netProfit.trend === 'up' ? "text-[#4CAF50]" : "text-[#DC3545]"
                  )}>
                    {Math.abs(data.profitability.netProfit.change)}%
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {data.profitability.margins.net}% margin
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-[#212121]">
                  {formatMetricValue(data.growth.userGrowth.value, 'percentage')}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.growth.userGrowth.trend)}
                  <span className={cn(
                    "text-xs font-medium",
                    data.growth.userGrowth.trend === 'up' ? "text-[#4CAF50]" : "text-[#DC3545]"
                  )}>
                    {Math.abs(data.growth.userGrowth.change)}%
                  </span>
                  <span className="text-xs text-[#9E9E9E]">MoM</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-[#E0E0E0]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">LTV/CAC Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-[#212121]">
                  {data.efficiency.ltvCacRatio.toFixed(1)}x
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      data.efficiency.ltvCacRatio >= 3 
                        ? "border-[#4CAF50] text-[#2E7D32]" 
                        : "border-[#FF6347] text-[#F57C00]"
                    )}
                  >
                    {data.efficiency.ltvCacRatio >= 3 ? 'Healthy' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <Calculator className="h-8 w-8 text-[#E0E0E0]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.revenue.bySource).map(([source, value]) => {
                    const percentage = (value / data.revenue.total.value) * 100
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#424242]">{source}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{formatMetricValue(value)}</span>
                            <Badge variant="outline" className="text-xs">
                              {percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Revenue by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.revenue.byRegion).map(([region, value]) => {
                    const percentage = (value / data.revenue.total.value) * 100
                    return (
                      <div key={region} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#757575]" />
                          <span className="text-sm font-medium text-[#424242]">{region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{formatMetricValue(value)}</span>
                          <Badge variant="outline" className="text-xs">
                            {percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Historical revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-[#F5F5F5] rounded-lg">
                  <LineChart className="h-12 w-12 text-[#BDBDBD]" />
                  <span className="ml-3 text-[#9E9E9E]">Revenue Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profit Margins */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#616161]">Gross Margin</span>
                    <span className="text-lg font-bold text-[#212121]">
                      {data.profitability.margins.gross}%
                    </span>
                  </div>
                  <Progress value={data.profitability.margins.gross} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#616161]">Operating Margin</span>
                    <span className="text-lg font-bold text-[#212121]">
                      {data.profitability.margins.operating}%
                    </span>
                  </div>
                  <Progress value={data.profitability.margins.operating} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#616161]">Net Margin</span>
                    <span className="text-lg font-bold text-[#212121]">
                      {data.profitability.margins.net}%
                    </span>
                  </div>
                  <Progress value={data.profitability.margins.net} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.costs.breakdown).map(([category, value]) => {
                    const percentage = (value / data.costs.total.value) * 100
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-[#616161]">{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{formatMetricValue(value)}</span>
                          <Badge variant="outline" className="text-xs">
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* EBITDA */}
            <Card>
              <CardHeader>
                <CardTitle>EBITDA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-[#212121]">
                      {formatMetricValue(data.profitability.ebitda.value)}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {getTrendIcon(data.profitability.ebitda.trend)}
                      <span className={cn(
                        "text-sm font-medium",
                        data.profitability.ebitda.trend === 'up' ? "text-[#4CAF50]" : "text-[#DC3545]"
                      )}>
                        {Math.abs(data.profitability.ebitda.change)}% vs prev
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#9E9E9E]">Revenue</span>
                      <span>{formatMetricValue(data.revenue.total.value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9E9E9E]">Operating Costs</span>
                      <span className="text-red-600">-{formatMetricValue(data.costs.operational.value)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Growth Metrics */}
            {Object.entries(data.growth).map(([key, metric]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#212121]">
                        {formatMetricValue(metric.value, 'percentage')}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {getTrendIcon(metric.trend)}
                        <span className={cn(
                          "text-sm",
                          metric.trend === 'up' ? "text-[#4CAF50]" : "text-[#DC3545]"
                        )}>
                          {Math.abs(metric.change)}% change
                        </span>
                      </div>
                    </div>
                    <div>
                      {metric.target && (
                        <div className="text-right">
                          <p className="text-xs text-[#9E9E9E]">Target</p>
                          <p className="text-sm font-medium">{metric.target}%</p>
                          <Progress 
                            value={(metric.value / metric.target) * 100} 
                            className="h-1 mt-2 w-20"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CAC & LTV */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Economics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#616161]">CAC</span>
                    <span className="text-lg font-bold">${data.efficiency.cac.value}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(data.efficiency.cac.trend, false)}
                    <span className="text-xs text-[#9E9E9E]">
                      {Math.abs(data.efficiency.cac.change)}% vs prev
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#616161]">LTV</span>
                    <span className="text-lg font-bold">${data.efficiency.ltv.value}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(data.efficiency.ltv.trend)}
                    <span className="text-xs text-[#9E9E9E]">
                      {Math.abs(data.efficiency.ltv.change)}% vs prev
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">LTV/CAC Ratio</span>
                  <span className="text-xl font-bold text-[#007BFF]">
                    {data.efficiency.ltvCacRatio.toFixed(1)}x
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Retention Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Retention Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#616161]">Retention Rate</span>
                    <span className="text-lg font-bold text-[#4CAF50]">
                      {data.efficiency.retentionRate.value}%
                    </span>
                  </div>
                  <Progress value={data.efficiency.retentionRate.value} className="h-2 mt-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#616161]">Churn Rate</span>
                    <span className="text-lg font-bold text-[#DC3545]">
                      {data.efficiency.churnRate.value}%
                    </span>
                  </div>
                  <Progress value={data.efficiency.churnRate.value} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#616161]">ARPU</span>
                  <span className="font-medium">${data.performance.arpu.value}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#616161]">Conversion Rate</span>
                  <span className="font-medium">{data.performance.conversionRate.value}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#616161]">Avg Transaction</span>
                  <span className="font-medium">${data.performance.avgTransactionSize.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#616161]">Platform Uptime</span>
                  <span className="font-medium text-[#4CAF50]">{data.performance.platformUptime.value}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forecast Alert */}
      {data.revenue.total.forecast && (
        <Alert className="border-[#99C2FF] bg-[#E6F2FF]">
          <Info className="h-4 w-4 text-[#007BFF]" />
          <AlertDescription className="text-[#003166]">
            <strong>Revenue Forecast:</strong> Based on current trends, revenue is projected to reach{' '}
            <strong>{formatMetricValue(data.revenue.total.forecast)}</strong> by the end of this period,{' '}
            {data.revenue.total.forecast > data.revenue.total.target! ? (
              <span className="text-[#4CAF50]">exceeding the target by{' '}
                {formatMetricValue(data.revenue.total.forecast - data.revenue.total.target!)}.
              </span>
            ) : (
              <span className="text-[#DC3545]">falling short of the target by{' '}
                {formatMetricValue(data.revenue.total.target! - data.revenue.total.forecast)}.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}