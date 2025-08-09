/**
 * Property-Specific Chart Components - PropertyChain
 * 
 * Specialized charts for real estate investment analytics
 */

'use client'

import * as React from 'react'
import {
  LineChartComponent,
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent,
  RadarChartComponent,
  ComposedChartComponent,
  TreemapComponent,
  RadialBarChartComponent,
  ChartContainer,
  CHART_COLORS,
} from './charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  Building2,
  Users,
  PieChart,
  BarChart3,
  Activity,
  Target,
  Wallet,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Investment Performance Chart
interface InvestmentPerformanceProps {
  data: {
    period: string
    invested: number
    value: number
    returns: number
  }[]
  timeframe?: '1M' | '3M' | '6M' | '1Y' | 'ALL'
  onTimeframeChange?: (timeframe: string) => void
  loading?: boolean
}

export function InvestmentPerformanceChart({
  data,
  timeframe = '1Y',
  onTimeframeChange,
  loading = false,
}: InvestmentPerformanceProps) {
  const latestReturn = data.length > 0 ? data[data.length - 1].returns : 0
  const isPositive = latestReturn >= 0

  return (
    <ChartContainer
      title="Investment Performance"
      description="Portfolio value and returns over time"
      loading={loading}
      toolbar={
        <Select value={timeframe} onValueChange={onTimeframeChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1M">1M</SelectItem>
            <SelectItem value="3M">3M</SelectItem>
            <SelectItem value="6M">6M</SelectItem>
            <SelectItem value="1Y">1Y</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
          </SelectContent>
        </Select>
      }
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-500" : "text-red-500"
            )}>
              {isPositive ? '+' : ''}{formatPercentage(latestReturn)} Total Return
            </span>
          </div>
          <Badge variant="outline">Updated: Today</Badge>
        </div>
      }
    >
      <ComposedChartComponent
        data={data}
        components={[
          { type: 'area', dataKey: 'value', name: 'Portfolio Value', color: CHART_COLORS.purple },
          { type: 'bar', dataKey: 'invested', name: 'Total Invested', color: CHART_COLORS.blue },
          { type: 'line', dataKey: 'returns', name: 'Returns %', color: CHART_COLORS.green, yAxisId: 'right' },
        ]}
        xAxisKey="period"
      />
    </ChartContainer>
  )
}

// Portfolio Distribution Chart
interface PortfolioDistributionProps {
  data: {
    category: string
    value: number
    percentage: number
    color?: string
  }[]
  variant?: 'pie' | 'donut' | 'treemap' | 'radial'
  loading?: boolean
}

export function PortfolioDistributionChart({
  data,
  variant = 'donut',
  loading = false,
}: PortfolioDistributionProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  const renderChart = () => {
    switch (variant) {
      case 'pie':
        return (
          <PieChartComponent
            data={data}
            dataKey="value"
            nameKey="category"
            colors={data.map(d => d.color || CHART_COLORS.primary)}
            innerRadius={0}
          />
        )
      case 'donut':
        return (
          <PieChartComponent
            data={data}
            dataKey="value"
            nameKey="category"
            colors={data.map(d => d.color || CHART_COLORS.primary)}
            innerRadius={60}
          />
        )
      case 'treemap':
        return (
          <TreemapComponent
            data={data.map(d => ({ ...d, name: d.category }))}
            dataKey="value"
            colors={data.map(d => d.color || CHART_COLORS.primary)}
          />
        )
      case 'radial':
        return (
          <RadialBarChartComponent
            data={data.map(d => ({ ...d, name: d.category }))}
            dataKey="percentage"
            colors={data.map(d => d.color || CHART_COLORS.primary)}
          />
        )
      default:
        return null
    }
  }

  return (
    <ChartContainer
      title="Portfolio Distribution"
      description="Asset allocation by property type"
      loading={loading}
      toolbar={
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-lg font-bold">{formatCurrency(totalValue)}</p>
        </div>
      }
      footer={
        <div className="grid grid-cols-2 gap-4">
          {data.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || CHART_COLORS.primary }}
              />
              <span className="text-sm">{item.category}:</span>
              <span className="text-sm font-medium ml-auto">
                {formatPercentage(item.percentage)}
              </span>
            </div>
          ))}
        </div>
      }
    >
      {renderChart()}
    </ChartContainer>
  )
}

// Property ROI Comparison Chart
interface PropertyROIComparisonProps {
  data: {
    property: string
    roi: number
    investment: number
    currentValue: number
  }[]
  loading?: boolean
}

export function PropertyROIComparisonChart({
  data,
  loading = false,
}: PropertyROIComparisonProps) {
  const sortedData = [...data].sort((a, b) => b.roi - a.roi)
  const avgROI = data.reduce((sum, item) => sum + item.roi, 0) / data.length

  return (
    <ChartContainer
      title="Property ROI Comparison"
      description="Return on investment by property"
      loading={loading}
      footer={
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            Average ROI: {formatPercentage(avgROI)}
          </Badge>
          <div className="flex gap-2">
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              Best: {sortedData[0]?.property}
            </Badge>
          </div>
        </div>
      }
    >
      <BarChartComponent
        data={sortedData}
        bars={[
          { dataKey: 'roi', name: 'ROI %', color: CHART_COLORS.success, radius: [8, 8, 0, 0] },
        ]}
        xAxisKey="property"
        yAxisFormatter={(value) => `${value}%`}
      />
    </ChartContainer>
  )
}

// Cash Flow Timeline Chart
interface CashFlowTimelineProps {
  data: {
    month: string
    income: number
    expenses: number
    netCashFlow: number
  }[]
  loading?: boolean
}

export function CashFlowTimelineChart({
  data,
  loading = false,
}: CashFlowTimelineProps) {
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0)
  const netCashFlow = totalIncome - totalExpenses

  return (
    <ChartContainer
      title="Cash Flow Timeline"
      description="Monthly income vs expenses"
      loading={loading}
      footer={
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Cash Flow</p>
            <p className={cn(
              "text-lg font-bold",
              netCashFlow >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {formatCurrency(netCashFlow)}
            </p>
          </div>
        </div>
      }
    >
      <ComposedChartComponent
        data={data}
        components={[
          { type: 'bar', dataKey: 'income', name: 'Income', color: CHART_COLORS.green },
          { type: 'bar', dataKey: 'expenses', name: 'Expenses', color: CHART_COLORS.red },
          { type: 'line', dataKey: 'netCashFlow', name: 'Net Cash Flow', color: CHART_COLORS.blue },
        ]}
        xAxisKey="month"
      />
    </ChartContainer>
  )
}

// Investment Growth Projection Chart
interface InvestmentGrowthProjectionProps {
  data: {
    year: string
    actual?: number
    projected: number
    optimistic?: number
    pessimistic?: number
  }[]
  loading?: boolean
}

export function InvestmentGrowthProjectionChart({
  data,
  loading = false,
}: InvestmentGrowthProjectionProps) {
  const currentYear = new Date().getFullYear()
  const projectedGrowth = data.length > 0 ? 
    ((data[data.length - 1].projected - data[0].projected) / data[0].projected) * 100 : 0

  return (
    <ChartContainer
      title="Investment Growth Projection"
      description="Expected portfolio growth over time"
      loading={loading}
      toolbar={
        <Badge variant="outline">
          <Target className="mr-1 h-3 w-3" />
          {formatPercentage(projectedGrowth)} Projected Growth
        </Badge>
      }
    >
      <AreaChartComponent
        data={data}
        areas={[
          { dataKey: 'pessimistic', name: 'Pessimistic', color: CHART_COLORS.red, gradient: true },
          { dataKey: 'projected', name: 'Expected', color: CHART_COLORS.blue, gradient: true },
          { dataKey: 'optimistic', name: 'Optimistic', color: CHART_COLORS.green, gradient: true },
          { dataKey: 'actual', name: 'Actual', color: CHART_COLORS.purple },
        ]}
        xAxisKey="year"
        yAxisFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
      />
    </ChartContainer>
  )
}

// Property Performance Radar Chart
interface PropertyPerformanceRadarProps {
  data: {
    metric: string
    propertyA: number
    propertyB: number
    marketAvg: number
  }[]
  properties?: string[]
  loading?: boolean
}

export function PropertyPerformanceRadarChart({
  data,
  properties = ['Property A', 'Property B'],
  loading = false,
}: PropertyPerformanceRadarProps) {
  return (
    <ChartContainer
      title="Property Performance Analysis"
      description="Multi-metric comparison"
      loading={loading}
      footer={
        <div className="flex gap-4 justify-center">
          {properties.map((property, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: index === 0 ? CHART_COLORS.purple : CHART_COLORS.blue 
                }}
              />
              <span className="text-sm">{property}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CHART_COLORS.gray }}
            />
            <span className="text-sm">Market Average</span>
          </div>
        </div>
      }
    >
      <RadarChartComponent
        data={data}
        dataKeys={[
          { key: 'propertyA', name: properties[0], color: CHART_COLORS.purple },
          { key: 'propertyB', name: properties[1], color: CHART_COLORS.blue },
          { key: 'marketAvg', name: 'Market Avg', color: '#6b7280' },
        ]}
        angleKey="metric"
      />
    </ChartContainer>
  )
}

// Token Distribution Timeline
interface TokenDistributionTimelineProps {
  data: {
    date: string
    distributed: number
    remaining: number
    burned?: number
  }[]
  totalSupply: number
  loading?: boolean
}

export function TokenDistributionTimelineChart({
  data,
  totalSupply,
  loading = false,
}: TokenDistributionTimelineProps) {
  const currentDistributed = data.length > 0 ? data[data.length - 1].distributed : 0
  const percentDistributed = (currentDistributed / totalSupply) * 100

  return (
    <ChartContainer
      title="Token Distribution Timeline"
      description="Property token distribution over time"
      loading={loading}
      toolbar={
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Supply</p>
          <p className="text-lg font-bold">{formatNumber(totalSupply)}</p>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Wallet className="mr-1 h-3 w-3" />
              {formatPercentage(percentDistributed)} Distributed
            </Badge>
            <Badge variant="outline">
              {formatNumber(currentDistributed)} / {formatNumber(totalSupply)} Tokens
            </Badge>
          </div>
        </div>
      }
    >
      <AreaChartComponent
        data={data}
        areas={[
          { dataKey: 'distributed', name: 'Distributed', color: CHART_COLORS.purple, stackId: '1' },
          { dataKey: 'remaining', name: 'Remaining', color: CHART_COLORS.blue, stackId: '1' },
          { dataKey: 'burned', name: 'Burned', color: CHART_COLORS.red },
        ]}
        xAxisKey="date"
      />
    </ChartContainer>
  )
}

// Market Comparison Chart
interface MarketComparisonProps {
  data: {
    category: string
    propertyChain: number
    marketAverage: number
    topCompetitor: number
  }[]
  loading?: boolean
}

export function MarketComparisonChart({
  data,
  loading = false,
}: MarketComparisonProps) {
  return (
    <ChartContainer
      title="Market Comparison"
      description="PropertyChain vs competitors"
      loading={loading}
      footer={
        <div className="flex gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>PropertyChain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Market Average</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Top Competitor</span>
          </div>
        </div>
      }
    >
      <BarChartComponent
        data={data}
        bars={[
          { dataKey: 'propertyChain', name: 'PropertyChain', color: CHART_COLORS.purple },
          { dataKey: 'marketAverage', name: 'Market Avg', color: CHART_COLORS.blue },
          { dataKey: 'topCompetitor', name: 'Top Competitor', color: CHART_COLORS.amber },
        ]}
        xAxisKey="category"
        yAxisFormatter={(value) => `${value}%`}
      />
    </ChartContainer>
  )
}

// Real-time Price Chart (Mock)
interface RealTimePriceChartProps {
  data: {
    time: string
    price: number
    volume: number
  }[]
  currentPrice: number
  priceChange: number
  loading?: boolean
}

export function RealTimePriceChart({
  data,
  currentPrice,
  priceChange,
  loading = false,
}: RealTimePriceChartProps) {
  const isPositive = priceChange >= 0

  return (
    <ChartContainer
      title="Token Price"
      description="Real-time price movement"
      loading={loading}
      toolbar={
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold">{formatCurrency(currentPrice)}</p>
            <p className={cn(
              "text-sm font-medium flex items-center gap-1",
              isPositive ? "text-green-500" : "text-red-500"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{formatPercentage(priceChange)}
            </p>
          </div>
          <Badge variant="outline" className="animate-pulse">
            <Activity className="mr-1 h-3 w-3" />
            Live
          </Badge>
        </div>
      }
      height={250}
    >
      <ComposedChartComponent
        data={data}
        components={[
          { type: 'area', dataKey: 'price', name: 'Price', color: CHART_COLORS.purple },
          { type: 'bar', dataKey: 'volume', name: 'Volume', color: CHART_COLORS.blue, yAxisId: 'right' },
        ]}
        xAxisKey="time"
        animate={false}
      />
    </ChartContainer>
  )
}

// Investment Dashboard Summary
interface InvestmentDashboardProps {
  performanceData: any[]
  distributionData: any[]
  cashFlowData: any[]
  roiData: any[]
  loading?: boolean
}

export function InvestmentDashboard({
  performanceData,
  distributionData,
  cashFlowData,
  roiData,
  loading = false,
}: InvestmentDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <InvestmentPerformanceChart data={performanceData} loading={loading} />
        <PortfolioDistributionChart data={distributionData} loading={loading} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CashFlowTimelineChart data={cashFlowData} loading={loading} />
        <PropertyROIComparisonChart data={roiData} loading={loading} />
      </div>
    </div>
  )
}