/**
 * Charts Test Page - PropertyChain
 * Tests all chart components and visualizations
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Import chart components
import {
  LineChartComponent,
  AreaChartComponent,
  BarChartComponent,
  PieChartComponent,
  RadarChartComponent,
  ComposedChartComponent,
  ScatterChartComponent,
  TreemapComponent,
  RadialBarChartComponent,
  ChartContainer,
  CHART_COLORS,
} from '@/components/custom/charts'

import {
  InvestmentPerformanceChart,
  PortfolioDistributionChart,
  PropertyROIComparisonChart,
  CashFlowTimelineChart,
  InvestmentGrowthProjectionChart,
  PropertyPerformanceRadarChart,
  TokenDistributionTimelineChart,
  MarketComparisonChart,
  RealTimePriceChart,
  InvestmentDashboard,
} from '@/components/custom/property-charts'

import { 
  TrendingUp, 
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  Settings,
} from 'lucide-react'

// Sample data generators
const generatePerformanceData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let invested = 100000
  let value = 100000
  
  return months.map((month, index) => {
    invested += Math.random() * 20000
    value = invested * (1 + (Math.random() * 0.3 - 0.05))
    const returns = ((value - invested) / invested) * 100
    
    return {
      period: month,
      invested: Math.round(invested),
      value: Math.round(value),
      returns: Number(returns.toFixed(2)),
    }
  })
}

const generateDistributionData = () => [
  { category: 'Residential', value: 450000, percentage: 45, color: CHART_COLORS.purple },
  { category: 'Commercial', value: 300000, percentage: 30, color: CHART_COLORS.blue },
  { category: 'Industrial', value: 150000, percentage: 15, color: CHART_COLORS.green },
  { category: 'Land', value: 100000, percentage: 10, color: CHART_COLORS.amber },
]

const generateROIData = () => [
  { property: 'Marina Bay', roi: 24.5, investment: 50000, currentValue: 62250 },
  { property: 'Downtown Tower', roi: 18.2, investment: 125000, currentValue: 147750 },
  { property: 'Sunset Villa', roi: 15.8, investment: 75000, currentValue: 86850 },
  { property: 'Tech Hub', roi: 12.3, investment: 200000, currentValue: 224600 },
  { property: 'Green Acres', roi: -5.2, investment: 35000, currentValue: 33180 },
]

const generateCashFlowData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map(month => ({
    month,
    income: Math.round(Math.random() * 20000 + 10000),
    expenses: Math.round(Math.random() * 15000 + 5000),
    netCashFlow: 0,
  })).map(item => ({
    ...item,
    netCashFlow: item.income - item.expenses,
  }))
}

const generateGrowthProjection = () => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  let baseValue = 100000
  
  return years.map((year, index) => {
    const projected = baseValue * Math.pow(1.12, index)
    const optimistic = projected * 1.2
    const pessimistic = projected * 0.8
    const actual = index < 3 ? baseValue * Math.pow(1.15, index) : undefined
    
    return {
      year: year.toString(),
      actual,
      projected: Math.round(projected),
      optimistic: Math.round(optimistic),
      pessimistic: Math.round(pessimistic),
    }
  })
}

const generateRadarData = () => [
  { metric: 'ROI', propertyA: 85, propertyB: 72, marketAvg: 65 },
  { metric: 'Occupancy', propertyA: 95, propertyB: 88, marketAvg: 82 },
  { metric: 'Maintenance', propertyA: 78, propertyB: 85, marketAvg: 70 },
  { metric: 'Location', propertyA: 92, propertyB: 78, marketAvg: 75 },
  { metric: 'Appreciation', propertyA: 88, propertyB: 82, marketAvg: 78 },
  { metric: 'Liquidity', propertyA: 70, propertyB: 90, marketAvg: 80 },
]

const generateTokenDistribution = () => {
  const dates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  let distributed = 0
  const totalSupply = 1000000
  
  return dates.map(date => {
    distributed += Math.random() * 100000 + 50000
    const remaining = totalSupply - distributed
    const burned = Math.random() * 5000
    
    return {
      date,
      distributed: Math.round(distributed),
      remaining: Math.round(remaining),
      burned: Math.round(burned),
    }
  })
}

const generateMarketComparison = () => [
  { category: 'Returns', propertyChain: 15.2, marketAverage: 10.5, topCompetitor: 12.8 },
  { category: 'Fees', propertyChain: 2.5, marketAverage: 4.2, topCompetitor: 3.1 },
  { category: 'Liquidity', propertyChain: 85, marketAverage: 65, topCompetitor: 75 },
  { category: 'Security', propertyChain: 95, marketAverage: 80, topCompetitor: 88 },
  { category: 'User Base', propertyChain: 75, marketAverage: 70, topCompetitor: 82 },
]

const generateRealTimePrice = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  let price = 100
  
  return hours.map(time => {
    price += (Math.random() - 0.5) * 5
    return {
      time,
      price: Number(price.toFixed(2)),
      volume: Math.round(Math.random() * 100000 + 50000),
    }
  })
}

// Simple chart data
const simpleLineData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

const simplePieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]

const scatterData = [
  { data: Array.from({ length: 20 }, () => ({ 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    z: Math.random() * 100 
  })), name: 'Series A' },
  { data: Array.from({ length: 20 }, () => ({ 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    z: Math.random() * 100 
  })), name: 'Series B' },
]

export default function TestChartsPage() {
  const [animate, setAnimate] = useState(true)
  const [timeframe, setTimeframe] = useState('1Y')
  const [chartVariant, setChartVariant] = useState<'pie' | 'donut' | 'treemap' | 'radial'>('donut')
  const [currentPrice, setCurrentPrice] = useState(125.50)
  const [priceChange, setPriceChange] = useState(5.2)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 2
        return Number((prev + change).toFixed(2))
      })
      setPriceChange((Math.random() - 0.3) * 10)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Charts & Visualizations Test</h1>
        <p className="text-muted-foreground">
          Testing Recharts components and PropertyChain analytics
        </p>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chart Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="animate"
                checked={animate}
                onCheckedChange={setAnimate}
              />
              <Label htmlFor="animate">Animations</Label>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="property" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="property">Property Charts</TabsTrigger>
          <TabsTrigger value="basic">Basic Charts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Charts</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Property Charts Tab */}
        <TabsContent value="property" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InvestmentPerformanceChart
              data={generatePerformanceData()}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              loading={isLoading}
            />
            <PortfolioDistributionChart
              data={generateDistributionData()}
              variant={chartVariant}
              loading={isLoading}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PropertyROIComparisonChart
              data={generateROIData()}
              loading={isLoading}
            />
            <CashFlowTimelineChart
              data={generateCashFlowData()}
              loading={isLoading}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InvestmentGrowthProjectionChart
              data={generateGrowthProjection()}
              loading={isLoading}
            />
            <PropertyPerformanceRadarChart
              data={generateRadarData()}
              properties={['Marina Bay Tower', 'Sunset Villa Complex']}
              loading={isLoading}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <TokenDistributionTimelineChart
              data={generateTokenDistribution()}
              totalSupply={1000000}
              loading={isLoading}
            />
            <MarketComparisonChart
              data={generateMarketComparison()}
              loading={isLoading}
            />
          </div>

          <RealTimePriceChart
            data={generateRealTimePrice()}
            currentPrice={currentPrice}
            priceChange={priceChange}
            loading={isLoading}
          />
        </TabsContent>

        {/* Basic Charts Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Line Chart" description="Multiple data series">
              <LineChartComponent
                data={simpleLineData}
                lines={[
                  { dataKey: 'pv', name: 'Page Views', color: CHART_COLORS.purple },
                  { dataKey: 'uv', name: 'Unique Visitors', color: CHART_COLORS.blue },
                ]}
                animate={animate}
              />
            </ChartContainer>

            <ChartContainer title="Area Chart" description="Stacked areas with gradient">
              <AreaChartComponent
                data={simpleLineData}
                areas={[
                  { dataKey: 'uv', name: 'UV', color: CHART_COLORS.purple, gradient: true },
                  { dataKey: 'pv', name: 'PV', color: CHART_COLORS.blue, gradient: true },
                ]}
                animate={animate}
              />
            </ChartContainer>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Bar Chart" description="Grouped bars">
              <BarChartComponent
                data={simpleLineData}
                bars={[
                  { dataKey: 'pv', name: 'Page Views', color: CHART_COLORS.purple },
                  { dataKey: 'uv', name: 'Unique Visitors', color: CHART_COLORS.blue },
                ]}
                animate={animate}
              />
            </ChartContainer>

            <ChartContainer title="Pie Chart" description="Data distribution">
              <PieChartComponent
                data={simplePieData}
                animate={animate}
              />
            </ChartContainer>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Donut Chart" description="Pie with inner radius">
              <PieChartComponent
                data={simplePieData}
                innerRadius={60}
                animate={animate}
              />
            </ChartContainer>

            <ChartContainer title="Radar Chart" description="Multi-dimensional data">
              <RadarChartComponent
                data={generateRadarData()}
                dataKeys={[
                  { key: 'propertyA', name: 'Property A', color: CHART_COLORS.purple },
                  { key: 'marketAvg', name: 'Market', color: CHART_COLORS.blue },
                ]}
                animate={animate}
              />
            </ChartContainer>
          </div>
        </TabsContent>

        {/* Advanced Charts Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Composed Chart" description="Multiple chart types combined">
              <ComposedChartComponent
                data={simpleLineData}
                components={[
                  { type: 'area', dataKey: 'amt', name: 'Amount', color: CHART_COLORS.green },
                  { type: 'bar', dataKey: 'pv', name: 'Page Views', color: CHART_COLORS.purple },
                  { type: 'line', dataKey: 'uv', name: 'Visitors', color: CHART_COLORS.blue },
                ]}
                animate={animate}
              />
            </ChartContainer>

            <ChartContainer title="Scatter Chart" description="Correlation analysis">
              <ScatterChartComponent
                data={[]}
                scatters={scatterData.map((s, i) => ({
                  ...s,
                  color: i === 0 ? CHART_COLORS.purple : CHART_COLORS.blue,
                }))}
                animate={animate}
              />
            </ChartContainer>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Treemap" description="Hierarchical data">
              <TreemapComponent
                data={[
                  { name: 'Residential', value: 45000 },
                  { name: 'Commercial', value: 30000 },
                  { name: 'Industrial', value: 15000 },
                  { name: 'Land', value: 10000 },
                ]}
                animate={animate}
              />
            </ChartContainer>

            <ChartContainer title="Radial Bar Chart" description="Circular progress">
              <RadialBarChartComponent
                data={[
                  { name: 'Q1', value: 85, fill: CHART_COLORS.purple },
                  { name: 'Q2', value: 72, fill: CHART_COLORS.blue },
                  { name: 'Q3', value: 90, fill: CHART_COLORS.green },
                  { name: 'Q4', value: 68, fill: CHART_COLORS.amber },
                ]}
                animate={animate}
              />
            </ChartContainer>
          </div>

          <ChartContainer 
            title="Line Chart with Brush" 
            description="Zoomable timeline"
          >
            <LineChartComponent
              data={generatePerformanceData()}
              lines={[
                { dataKey: 'value', name: 'Portfolio Value', color: CHART_COLORS.purple },
                { dataKey: 'invested', name: 'Invested', color: CHART_COLORS.blue },
              ]}
              xAxisKey="period"
              showBrush
              animate={animate}
            />
          </ChartContainer>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <InvestmentDashboard
            performanceData={generatePerformanceData()}
            distributionData={generateDistributionData()}
            cashFlowData={generateCashFlowData()}
            roiData={generateROIData()}
            loading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Chart Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Chart Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Chart Types</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Line Charts</li>
                <li>✅ Area Charts (with gradients)</li>
                <li>✅ Bar Charts (grouped/stacked)</li>
                <li>✅ Pie & Donut Charts</li>
                <li>✅ Radar Charts</li>
                <li>✅ Scatter Plots</li>
                <li>✅ Composed Charts</li>
                <li>✅ Treemaps</li>
                <li>✅ Radial Bar Charts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Charts</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Investment Performance</li>
                <li>✅ Portfolio Distribution</li>
                <li>✅ Property ROI Comparison</li>
                <li>✅ Cash Flow Timeline</li>
                <li>✅ Growth Projections</li>
                <li>✅ Token Distribution</li>
                <li>✅ Market Comparison</li>
                <li>✅ Real-time Price Charts</li>
                <li>✅ Performance Radar</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Responsive design</li>
                <li>✅ Custom tooltips</li>
                <li>✅ Loading states</li>
                <li>✅ Error handling</li>
                <li>✅ Export functionality</li>
                <li>✅ Real-time updates</li>
                <li>✅ Animations (toggle)</li>
                <li>✅ Dark mode support</li>
                <li>✅ TypeScript support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}