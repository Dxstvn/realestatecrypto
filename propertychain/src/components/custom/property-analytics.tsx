/**
 * Property Analytics Dashboard - PropertyChain
 * 
 * Specialized analytics dashboards for real estate and investment tracking
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AnalyticsDashboard,
  createDashboardWidget,
  type DashboardWidget,
  type DashboardConfig,
  type MetricData,
} from './analytics-dashboard'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  Home,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  MapPin,
  Target,
  Award,
  Calendar,
  BarChart,
  PieChart,
  Activity,
  Star,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  CreditCard,
  Receipt,
  Wallet,
  PiggyBank,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react'
import {
  addDays,
  subDays,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  differenceInDays,
} from 'date-fns'

// Property Analytics Types
export interface PropertyMetrics {
  totalProperties: number
  totalValue: number
  averageROI: number
  monthlyIncome: number
  occupancyRate: number
  appreciation: number
  activeListings: number
  pendingTransactions: number
}

export interface InvestmentMetrics {
  portfolioValue: number
  totalInvested: number
  realizedGains: number
  unrealizedGains: number
  dividendIncome: number
  averageYield: number
  activeInvestments: number
  riskScore: number
}

export interface MarketMetrics {
  averagePrice: number
  priceChange: number
  daysOnMarket: number
  saleVolume: number
  inventoryLevel: number
  demandIndex: number
  pricePerSqft: number
  marketTrend: 'up' | 'down' | 'stable'
}

// Property Overview Dashboard
interface PropertyOverviewDashboardProps {
  metrics?: PropertyMetrics
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  className?: string
}

export function PropertyOverviewDashboard({
  metrics,
  timeRange = '30d',
  onTimeRangeChange,
  className,
}: PropertyOverviewDashboardProps) {
  const defaultMetrics: PropertyMetrics = {
    totalProperties: 12,
    totalValue: 4250000,
    averageROI: 14.2,
    monthlyIncome: 28500,
    occupancyRate: 94.5,
    appreciation: 8.7,
    activeListings: 3,
    pendingTransactions: 2,
  }

  const data = metrics || defaultMetrics

  const dashboardWidgets: DashboardWidget[] = [
    createDashboardWidget('total-properties', 'metric', 'Total Properties', {
      label: 'Properties in Portfolio',
      value: data.totalProperties,
      change: 8.3,
      changeType: 'increase',
      format: 'number',
      icon: <Building className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('total-value', 'metric', 'Portfolio Value', {
      label: 'Total Property Value',
      value: data.totalValue,
      change: 12.1,
      changeType: 'increase',
      format: 'currency',
      icon: <DollarSign className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('monthly-income', 'metric', 'Monthly Income', {
      label: 'Rental Income',
      value: data.monthlyIncome,
      change: 5.7,
      changeType: 'increase',
      format: 'currency',
      icon: <Receipt className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('average-roi', 'metric', 'Average ROI', {
      label: 'Return on Investment',
      value: data.averageROI,
      change: 2.1,
      changeType: 'increase',
      format: 'percent',
      icon: <TrendingUp className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('occupancy-rate', 'progress', 'Occupancy Metrics', {
      items: [
        {
          label: 'Overall Occupancy',
          value: data.occupancyRate,
          target: 100,
          status: 'success',
        },
        {
          label: 'Lease Renewals',
          value: 78,
          target: 100,
          status: 'success',
        },
        {
          label: 'Tenant Satisfaction',
          value: 92,
          target: 100,
          status: 'success',
        },
      ]
    }, { size: 'medium' }),

    createDashboardWidget('property-performance', 'chart', 'Property Performance', {
      chartType: 'line',
      data: generateTimeSeriesData('property-value', 30),
    }, { 
      size: 'large',
      config: { chartType: 'line', timeRange: timeRange as any, showGrid: true, animate: true }
    }),

    createDashboardWidget('property-activities', 'activity', 'Recent Activity', {
      activities: [
        {
          id: '1',
          title: 'New Tenant Signed',
          description: '123 Oak Street - 2 year lease agreement',
          timestamp: subDays(new Date(), 1),
          type: 'lease',
        },
        {
          id: '2',
          title: 'Property Listed',
          description: '456 Pine Ave listed for $650,000',
          timestamp: subDays(new Date(), 2),
          type: 'listing',
        },
        {
          id: '3',
          title: 'Maintenance Completed',
          description: 'HVAC service at 789 Main St',
          timestamp: subDays(new Date(), 3),
          type: 'maintenance',
        },
        {
          id: '4',
          title: 'Rent Increase Applied',
          description: '$150 increase at Elm Street properties',
          timestamp: subDays(new Date(), 5),
          type: 'rent',
        },
      ]
    }, { size: 'medium' }),
  ]

  const dashboardConfig: DashboardConfig = {
    layout: 'grid',
    columns: 3,
    gap: 4,
    autoRefresh: true,
    refreshInterval: 300,
    theme: 'auto',
    density: 'default',
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Portfolio Overview</h2>
          <p className="text-muted-foreground">
            Monitor your real estate investments and performance
          </p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnalyticsDashboard
        widgets={dashboardWidgets}
        config={dashboardConfig}
      />
    </div>
  )
}

// Investment Analytics Dashboard
interface InvestmentAnalyticsDashboardProps {
  metrics?: InvestmentMetrics
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  className?: string
}

export function InvestmentAnalyticsDashboard({
  metrics,
  timeRange = '30d',
  onTimeRangeChange,
  className,
}: InvestmentAnalyticsDashboardProps) {
  const defaultMetrics: InvestmentMetrics = {
    portfolioValue: 875000,
    totalInvested: 650000,
    realizedGains: 125000,
    unrealizedGains: 100000,
    dividendIncome: 4200,
    averageYield: 12.8,
    activeInvestments: 8,
    riskScore: 6.5,
  }

  const data = metrics || defaultMetrics

  const dashboardWidgets: DashboardWidget[] = [
    createDashboardWidget('portfolio-value', 'metric', 'Portfolio Value', {
      label: 'Total Portfolio Value',
      value: data.portfolioValue,
      change: 15.2,
      changeType: 'increase',
      format: 'currency',
      icon: <Wallet className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('total-gains', 'metric', 'Total Gains', {
      label: 'Realized + Unrealized',
      value: data.realizedGains + data.unrealizedGains,
      change: 18.7,
      changeType: 'increase',
      format: 'currency',
      icon: <TrendingUp className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('dividend-income', 'metric', 'Monthly Dividends', {
      label: 'Dividend Income',
      value: data.dividendIncome,
      change: 6.3,
      changeType: 'increase',
      format: 'currency',
      icon: <PiggyBank className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('average-yield', 'metric', 'Average Yield', {
      label: 'Portfolio Yield',
      value: data.averageYield,
      change: 1.2,
      changeType: 'increase',
      format: 'percent',
      icon: <Target className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('investment-breakdown', 'progress', 'Investment Allocation', {
      items: [
        {
          label: 'Residential Properties',
          value: 425000,
          target: 875000,
          status: 'success',
        },
        {
          label: 'Commercial REITs',
          value: 285000,
          target: 875000,
          status: 'success',
        },
        {
          label: 'Development Projects',
          value: 165000,
          target: 875000,
          status: 'warning',
        },
      ]
    }, { size: 'medium' }),

    createDashboardWidget('performance-chart', 'chart', 'Investment Performance', {
      chartType: 'area',
      data: generateTimeSeriesData('investment-performance', 90),
    }, { 
      size: 'large',
      config: { chartType: 'area', timeRange: timeRange as any, showGrid: true, animate: true }
    }),

    createDashboardWidget('investment-activities', 'activity', 'Investment Activity', {
      activities: [
        {
          id: '1',
          title: 'Dividend Received',
          description: '$1,250 from Portland Apartments REIT',
          timestamp: subDays(new Date(), 1),
          type: 'dividend',
        },
        {
          id: '2',
          title: 'Investment Added',
          description: '$25,000 in Seattle Development Fund',
          timestamp: subDays(new Date(), 3),
          type: 'investment',
        },
        {
          id: '3',
          title: 'Property Sold',
          description: '789 Elm Street - $45,000 profit realized',
          timestamp: subDays(new Date(), 7),
          type: 'sale',
        },
        {
          id: '4',
          title: 'Market Valuation',
          description: 'Portfolio revalued +$18,500',
          timestamp: subDays(new Date(), 10),
          type: 'valuation',
        },
      ]
    }, { size: 'medium' }),
  ]

  const dashboardConfig: DashboardConfig = {
    layout: 'grid',
    columns: 3,
    gap: 4,
    autoRefresh: true,
    refreshInterval: 300,
    theme: 'auto',
    density: 'default',
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Investment Analytics</h2>
          <p className="text-muted-foreground">
            Track your investment performance and returns
          </p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnalyticsDashboard
        widgets={dashboardWidgets}
        config={dashboardConfig}
      />
    </div>
  )
}

// Market Analytics Dashboard
interface MarketAnalyticsDashboardProps {
  metrics?: MarketMetrics
  location?: string
  onLocationChange?: (location: string) => void
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  className?: string
}

export function MarketAnalyticsDashboard({
  metrics,
  location = 'Portland, OR',
  onLocationChange,
  timeRange = '30d',
  onTimeRangeChange,
  className,
}: MarketAnalyticsDashboardProps) {
  const defaultMetrics: MarketMetrics = {
    averagePrice: 685000,
    priceChange: 8.2,
    daysOnMarket: 28,
    saleVolume: 142,
    inventoryLevel: 2.1,
    demandIndex: 78,
    pricePerSqft: 385,
    marketTrend: 'up',
  }

  const data = metrics || defaultMetrics

  const getTrendIcon = () => {
    switch (data.marketTrend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getTrendColor = () => {
    switch (data.marketTrend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const dashboardWidgets: DashboardWidget[] = [
    createDashboardWidget('average-price', 'metric', 'Average Price', {
      label: 'Median Home Price',
      value: data.averagePrice,
      change: data.priceChange,
      changeType: data.priceChange > 0 ? 'increase' : 'decrease',
      format: 'currency',
      icon: <Home className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('days-on-market', 'metric', 'Days on Market', {
      label: 'Average Days Listed',
      value: data.daysOnMarket,
      change: -12.5,
      changeType: 'decrease',
      format: 'number',
      icon: <Clock className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('sale-volume', 'metric', 'Sale Volume', {
      label: 'Properties Sold',
      value: data.saleVolume,
      change: 24.8,
      changeType: 'increase',
      format: 'number',
      icon: <BarChart className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('price-per-sqft', 'metric', 'Price per Sq Ft', {
      label: 'Average Price/Sq Ft',
      value: data.pricePerSqft,
      change: 6.7,
      changeType: 'increase',
      format: 'currency',
      icon: <Building className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('market-indicators', 'progress', 'Market Health', {
      items: [
        {
          label: 'Demand Index',
          value: data.demandIndex,
          target: 100,
          status: 'success',
        },
        {
          label: 'Inventory Level (months)',
          value: data.inventoryLevel * 10,
          target: 60,
          status: 'warning',
        },
        {
          label: 'Price Stability',
          value: 85,
          target: 100,
          status: 'success',
        },
      ]
    }, { size: 'medium' }),

    createDashboardWidget('price-trends', 'chart', 'Price Trends', {
      chartType: 'line',
      data: generateTimeSeriesData('price-trends', 365),
    }, { 
      size: 'large',
      config: { chartType: 'line', timeRange: timeRange as any, showGrid: true, animate: true }
    }),

    createDashboardWidget('market-insights', 'activity', 'Market Insights', {
      activities: [
        {
          id: '1',
          title: 'Market Report Released',
          description: 'Q4 2024 Portland market shows 8.2% growth',
          timestamp: subDays(new Date(), 2),
          type: 'report',
        },
        {
          id: '2',
          title: 'Interest Rate Change',
          description: 'Fed rate decreased by 0.25% - expect more buyers',
          timestamp: subDays(new Date(), 5),
          type: 'economic',
        },
        {
          id: '3',
          title: 'Inventory Update',
          description: 'New listings up 15% this month',
          timestamp: subDays(new Date(), 7),
          type: 'inventory',
        },
        {
          id: '4',
          title: 'Seasonal Trend',
          description: 'Spring buying season shows early activity',
          timestamp: subDays(new Date(), 12),
          type: 'seasonal',
        },
      ]
    }, { size: 'medium' }),
  ]

  const dashboardConfig: DashboardConfig = {
    layout: 'grid',
    columns: 3,
    gap: 4,
    autoRefresh: true,
    refreshInterval: 300,
    theme: 'auto',
    density: 'default',
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Market Analytics
            {getTrendIcon()}
          </h2>
          <p className="text-muted-foreground">
            Real estate market insights for {location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Portland, OR">Portland, OR</SelectItem>
              <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
              <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
              <SelectItem value="Denver, CO">Denver, CO</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnalyticsDashboard
        widgets={dashboardWidgets}
        config={dashboardConfig}
      />
    </div>
  )
}

// Utility function to generate mock time series data
function generateTimeSeriesData(type: string, days: number) {
  const data = []
  const baseValue = type === 'property-value' ? 4250000 : 
                   type === 'investment-performance' ? 875000 : 685000
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const variation = (Math.random() - 0.5) * 0.1
    const trend = type === 'price-trends' ? Math.sin((days - i) / days * Math.PI) * 0.05 : 0.02
    const value = baseValue * (1 + trend + variation)
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      value: Math.round(value),
      label: format(date, 'MMM d'),
    })
  }
  
  return data
}

// Executive Dashboard - Combined overview
interface ExecutiveDashboardProps {
  propertyMetrics?: PropertyMetrics
  investmentMetrics?: InvestmentMetrics
  marketMetrics?: MarketMetrics
  className?: string
}

export function ExecutiveDashboard({
  propertyMetrics,
  investmentMetrics,
  marketMetrics,
  className,
}: ExecutiveDashboardProps) {
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your real estate portfolio and investments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{propertyMetrics?.totalProperties || 12}</p>
                    <p className="text-sm text-muted-foreground">Properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency((propertyMetrics?.totalValue || 0) + (investmentMetrics?.portfolioValue || 0))}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Receipt className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency((propertyMetrics?.monthlyIncome || 0) + (investmentMetrics?.dividendIncome || 0))}
                    </p>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {((propertyMetrics?.averageROI || 0) + (investmentMetrics?.averageYield || 0)) / 2}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg ROI</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <PropertyOverviewDashboard metrics={propertyMetrics} />
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentAnalyticsDashboard metrics={investmentMetrics} />
        </TabsContent>

        <TabsContent value="market">
          <MarketAnalyticsDashboard metrics={marketMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}