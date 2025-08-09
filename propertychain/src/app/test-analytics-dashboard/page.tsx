/**
 * Analytics Dashboard Test Page - PropertyChain
 * Tests all analytics dashboard components and features
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  AnalyticsDashboard,
  createDashboardWidget,
  type DashboardWidget,
  type DashboardConfig,
} from '@/components/custom/analytics-dashboard'
import {
  PropertyOverviewDashboard,
  InvestmentAnalyticsDashboard,
  MarketAnalyticsDashboard,
  ExecutiveDashboard,
  type PropertyMetrics,
  type InvestmentMetrics,
  type MarketMetrics,
} from '@/components/custom/property-analytics'
import {
  PortfolioWidget,
  PropertyPerformanceWidget,
  MarketTrendsWidget,
  type WidgetFilter,
} from '@/components/custom/dashboard-widgets'
import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Home,
  DollarSign,
  Users,
  Calendar,
  Target,
  Award,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Eye,
  Zap,
  Settings,
  Download,
  Refresh,
  Filter,
} from 'lucide-react'
import { addDays, subDays, subMonths, addMonths } from 'date-fns'
import { toastSuccess, toastInfo, toastError } from '@/lib/toast'

// Mock data
const mockPropertyMetrics: PropertyMetrics = {
  totalProperties: 15,
  totalValue: 5250000,
  averageROI: 16.3,
  monthlyIncome: 32500,
  occupancyRate: 96.2,
  appreciation: 12.4,
  activeListings: 4,
  pendingTransactions: 3,
}

const mockInvestmentMetrics: InvestmentMetrics = {
  portfolioValue: 1250000,
  totalInvested: 950000,
  realizedGains: 185000,
  unrealizedGains: 115000,
  dividendIncome: 5800,
  averageYield: 14.7,
  activeInvestments: 12,
  riskScore: 7.2,
}

const mockMarketMetrics: MarketMetrics = {
  averagePrice: 725000,
  priceChange: 9.4,
  daysOnMarket: 26,
  saleVolume: 167,
  inventoryLevel: 2.3,
  demandIndex: 82,
  pricePerSqft: 420,
  marketTrend: 'up',
}

const mockPortfolioData = {
  totalValue: 1250000,
  change24h: 2.3,
  change7d: 5.7,
  change30d: 12.1,
  assets: [
    {
      id: 'prop-1',
      name: 'Portland Apartments',
      value: 425000,
      change: 8.2,
      allocation: 34,
      type: 'property' as const,
    },
    {
      id: 'reit-1',
      name: 'VNQ REIT Fund',
      value: 285000,
      change: -1.5,
      allocation: 23,
      type: 'reit' as const,
    },
    {
      id: 'fund-1',
      name: 'Real Estate Development',
      value: 320000,
      change: 15.3,
      allocation: 26,
      type: 'fund' as const,
    },
    {
      id: 'crypto-1',
      name: 'PropertyChain Token',
      value: 220000,
      change: 22.7,
      allocation: 17,
      type: 'crypto' as const,
    },
  ]
}

const mockPropertyPerformanceData = {
  properties: [
    {
      id: 'prop-1',
      name: 'Downtown Portland Complex',
      address: '123 SW Morrison St, Portland, OR',
      currentValue: 850000,
      purchaseValue: 650000,
      monthlyIncome: 7200,
      expenses: 2100,
      roi: 18.5,
      occupancy: 95,
      lastUpdated: subDays(new Date(), 2),
    },
    {
      id: 'prop-2',
      name: 'Seattle Waterfront Condos',
      address: '456 Alaskan Way, Seattle, WA',
      currentValue: 1200000,
      purchaseValue: 950000,
      monthlyIncome: 9800,
      expenses: 3200,
      roi: 15.2,
      occupancy: 88,
      lastUpdated: subDays(new Date(), 1),
    },
    {
      id: 'prop-3',
      name: 'Suburban Family Homes',
      address: '789 Oak Street, Beaverton, OR',
      currentValue: 650000,
      purchaseValue: 520000,
      monthlyIncome: 4500,
      expenses: 1800,
      roi: 12.8,
      occupancy: 100,
      lastUpdated: new Date(),
    },
    {
      id: 'prop-4',
      name: 'Mixed Use Development',
      address: '321 Pine Ave, Vancouver, WA',
      currentValue: 1500000,
      purchaseValue: 1100000,
      monthlyIncome: 12500,
      expenses: 4200,
      roi: 20.1,
      occupancy: 92,
      lastUpdated: subDays(new Date(), 3),
    },
  ]
}

const mockMarketTrendsData = {
  location: 'Portland, OR',
  currentTrend: 'up' as const,
  trends: [
    {
      period: 'Dec 2024',
      averagePrice: 725000,
      priceChange: 2.1,
      volume: 167,
      daysOnMarket: 26,
      inventory: 2.3,
    },
    {
      period: 'Nov 2024',
      averagePrice: 710000,
      priceChange: 1.8,
      volume: 152,
      daysOnMarket: 28,
      inventory: 2.5,
    },
    {
      period: 'Oct 2024',
      averagePrice: 697000,
      priceChange: 3.2,
      volume: 143,
      daysOnMarket: 31,
      inventory: 2.8,
    },
    {
      period: 'Sep 2024',
      averagePrice: 675000,
      priceChange: 4.1,
      volume: 138,
      daysOnMarket: 29,
      inventory: 3.1,
    },
    {
      period: 'Aug 2024',
      averagePrice: 648000,
      priceChange: 1.9,
      volume: 161,
      daysOnMarket: 25,
      inventory: 2.7,
    },
  ]
}

export default function TestAnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [location, setLocation] = useState('Portland, OR')
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    layout: 'grid',
    columns: 3,
    gap: 4,
    autoRefresh: true,
    refreshInterval: 300,
    theme: 'auto',
    density: 'default',
  })

  const [customDashboardWidgets, setCustomDashboardWidgets] = useState<DashboardWidget[]>([
    createDashboardWidget('total-value', 'metric', 'Total Portfolio Value', {
      label: 'Combined Portfolio Value',
      value: 6500000,
      change: 14.2,
      changeType: 'increase',
      format: 'currency',
      icon: <DollarSign className="h-4 w-4" />,
      status: 'success',
      trend: [85, 92, 88, 95, 100, 105, 112],
    }, { size: 'small' }),

    createDashboardWidget('monthly-income', 'metric', 'Monthly Income', {
      label: 'Total Monthly Income',
      value: 38300,
      change: 8.7,
      changeType: 'increase',
      format: 'currency',
      icon: <TrendingUp className="h-4 w-4" />,
      status: 'success',
      target: 45000,
    }, { size: 'small' }),

    createDashboardWidget('properties', 'metric', 'Properties Owned', {
      label: 'Total Properties',
      value: 15,
      change: 25.0,
      changeType: 'increase',
      format: 'number',
      icon: <Building className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('average-roi', 'metric', 'Average ROI', {
      label: 'Portfolio ROI',
      value: 16.3,
      change: 3.1,
      changeType: 'increase',
      format: 'percent',
      icon: <Target className="h-4 w-4" />,
      status: 'success',
    }, { size: 'small' }),

    createDashboardWidget('performance-chart', 'chart', 'Portfolio Performance', {
      chartType: 'line',
      data: [],
    }, { 
      size: 'large',
      config: { chartType: 'line', timeRange, showGrid: true, animate: true }
    }),

    createDashboardWidget('allocation-chart', 'chart', 'Asset Allocation', {
      chartType: 'pie',
      data: [],
    }, { 
      size: 'medium',
      config: { chartType: 'pie', showLegend: true }
    }),

    createDashboardWidget('recent-activities', 'activity', 'Recent Activities', {
      activities: [
        {
          id: '1',
          title: 'Property Acquired',
          description: 'Successfully acquired 789 Oak Street for $650,000',
          timestamp: subDays(new Date(), 1),
          type: 'acquisition',
        },
        {
          id: '2',
          title: 'Dividend Payment',
          description: 'Received $2,800 from VNQ REIT Fund',
          timestamp: subDays(new Date(), 3),
          type: 'dividend',
        },
        {
          id: '3',
          title: 'Property Listed',
          description: 'Listed 456 Pine Ave for $1.2M',
          timestamp: subDays(new Date(), 5),
          type: 'listing',
        },
        {
          id: '4',
          title: 'Market Alert',
          description: 'Portland market shows strong growth potential',
          timestamp: subDays(new Date(), 7),
          type: 'alert',
        },
        {
          id: '5',
          title: 'Lease Renewed',
          description: 'Tenant renewed lease at 123 SW Morrison',
          timestamp: subDays(new Date(), 10),
          type: 'lease',
        },
      ]
    }, { size: 'medium' }),

    createDashboardWidget('occupancy-progress', 'progress', 'Occupancy Metrics', {
      items: [
        {
          label: 'Overall Occupancy',
          value: 96.2,
          target: 100,
          status: 'success',
        },
        {
          label: 'Lease Renewals',
          value: 85,
          target: 100,
          status: 'success',
        },
        {
          label: 'Tenant Satisfaction',
          value: 92,
          target: 100,
          status: 'success',
        },
        {
          label: 'Maintenance Response',
          value: 78,
          target: 100,
          status: 'warning',
        },
      ]
    }, { size: 'medium' }),
  ])

  const handleWidgetUpdate = (widget: DashboardWidget) => {
    setCustomDashboardWidgets(prev =>
      prev.map(w => w.id === widget.id ? widget : w)
    )
    toastSuccess(`Updated widget: ${widget.title}`)
  }

  const handleWidgetRemove = (widgetId: string) => {
    setCustomDashboardWidgets(prev => prev.filter(w => w.id !== widgetId))
    toastSuccess('Widget removed')
  }

  const handleConfigChange = (newConfig: Partial<DashboardConfig>) => {
    setDashboardConfig(prev => ({ ...prev, ...newConfig }))
    toastInfo('Dashboard configuration updated')
  }

  const handleExport = (format: 'pdf' | 'csv' | 'xlsx') => {
    toastInfo(`Exporting dashboard as ${format.toUpperCase()}...`)
  }

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange)
    toastInfo(`Time range changed to ${newRange}`)
  }

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation)
    toastInfo(`Location changed to ${newLocation}`)
  }

  const generateSampleData = () => {
    // Add more sample widgets
    const newWidget = createDashboardWidget(
      `widget-${Date.now()}`,
      'metric',
      'Sample Metric',
      {
        label: 'Generated Metric',
        value: Math.floor(Math.random() * 1000000),
        change: (Math.random() - 0.5) * 20,
        changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
        format: 'currency',
        icon: <Star className="h-4 w-4" />,
        status: 'success',
      },
      { size: 'small' }
    )

    setCustomDashboardWidgets(prev => [...prev, newWidget])
    toastSuccess('Sample widget added')
  }

  // Stats calculations
  const totalWidgets = customDashboardWidgets.length
  const visibleWidgets = customDashboardWidgets.filter(w => w.visible).length
  const metricWidgets = customDashboardWidgets.filter(w => w.type === 'metric').length
  const chartWidgets = customDashboardWidgets.filter(w => w.type === 'chart').length

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard Test</h1>
            <p className="text-muted-foreground">
              Testing comprehensive analytics dashboard with PropertyChain features
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={generateSampleData}>
              <Zap className="mr-2 h-4 w-4" />
              Add Sample Widget
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Widgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalWidgets}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Visible Widgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{visibleWidgets}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metric Widgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{metricWidgets}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chart Widgets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{chartWidgets}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="custom" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="custom">Custom Dashboard</TabsTrigger>
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="widgets">Advanced Widgets</TabsTrigger>
        </TabsList>

        {/* Custom Dashboard Tab */}
        <TabsContent value="custom" className="space-y-6">
          <AnalyticsDashboard
            widgets={customDashboardWidgets}
            config={dashboardConfig}
            onWidgetUpdate={handleWidgetUpdate}
            onWidgetRemove={handleWidgetRemove}
            onConfigChange={handleConfigChange}
            onExport={handleExport}
          />
        </TabsContent>

        {/* Executive Dashboard Tab */}
        <TabsContent value="executive" className="space-y-6">
          <ExecutiveDashboard
            propertyMetrics={mockPropertyMetrics}
            investmentMetrics={mockInvestmentMetrics}
            marketMetrics={mockMarketMetrics}
          />
        </TabsContent>

        {/* Property Dashboard Tab */}
        <TabsContent value="properties" className="space-y-6">
          <PropertyOverviewDashboard
            metrics={mockPropertyMetrics}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabsContent>

        {/* Investment Dashboard Tab */}
        <TabsContent value="investments" className="space-y-6">
          <InvestmentAnalyticsDashboard
            metrics={mockInvestmentMetrics}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabsContent>

        {/* Market Dashboard Tab */}
        <TabsContent value="market" className="space-y-6">
          <MarketAnalyticsDashboard
            metrics={mockMarketMetrics}
            location={location}
            onLocationChange={handleLocationChange}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </TabsContent>

        {/* Advanced Widgets Tab */}
        <TabsContent value="widgets" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PortfolioWidget
              data={mockPortfolioData}
              customization={{ displayFormat: 'detailed' }}
            />
            
            <PropertyPerformanceWidget
              data={mockPropertyPerformanceData}
            />
          </div>

          <MarketTrendsWidget
            data={mockMarketTrendsData}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Advanced widgets support real-time updates, filtering, customization, 
              and interactive features for enhanced analytics experience.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Analytics Dashboard Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Customizable dashboard layouts</li>
                <li>✅ 5 widget types (metric, chart, progress, activity, table)</li>
                <li>✅ Real-time data updates</li>
                <li>✅ Export functionality (PDF, CSV, Excel)</li>
                <li>✅ Responsive grid system</li>
                <li>✅ Widget drag & drop</li>
                <li>✅ Time range filtering</li>
                <li>✅ Dashboard configuration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property portfolio dashboard</li>
                <li>✅ Investment analytics</li>
                <li>✅ Market trend analysis</li>
                <li>✅ Executive overview</li>
                <li>✅ ROI calculations</li>
                <li>✅ Occupancy tracking</li>
                <li>✅ Performance metrics</li>
                <li>✅ Asset allocation views</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Widget customization</li>
                <li>✅ Advanced filtering</li>
                <li>✅ Auto-refresh controls</li>
                <li>✅ Multiple chart types</li>
                <li>✅ Trend indicators</li>
                <li>✅ Interactive widgets</li>
                <li>✅ Performance optimization</li>
                <li>✅ Mobile responsiveness</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}