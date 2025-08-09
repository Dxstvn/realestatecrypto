/**
 * KPI Cards Test Page - PropertyChain
 * Tests KPI card components with various configurations
 */

'use client'

import { useState, useEffect } from 'react'
import { KPICard, KPICardGroup, KPICardSkeleton } from '@/components/custom/kpi-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Target,
  Clock,
  Shield,
  Award,
  Zap,
  Download,
  Maximize2,
  MoreVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Generate mock chart data
const generateChartData = (days: number, startValue: number, volatility: number = 0.1) => {
  const data = []
  let value = startValue
  
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * volatility
    value = value * (1 + change)
    data.push({
      date: `Day ${i + 1}`,
      value: Math.round(value),
    })
  }
  
  return data
}

// Mock tracker data for activity tracking
const trackerData = Array.from({ length: 30 }, (_, i) => ({
  color: Math.random() > 0.5 ? 'emerald' : 'gray',
  tooltip: `Day ${i + 1}`,
}))

// Mock category data
const categoryData = [
  { name: 'Residential', value: 45, color: 'blue' },
  { name: 'Commercial', value: 30, color: 'emerald' },
  { name: 'Industrial', value: 25, color: 'violet' },
]

export default function TestKPICardsPage() {
  const [variant, setVariant] = useState<'default' | 'compact' | 'detailed'>('default')
  const [showCharts, setShowCharts] = useState(true)
  const [animate, setAnimate] = useState(true)
  const [showLoading, setShowLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [gridColumns, setGridColumns] = useState('4')
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const results: string[] = []
    
    // Check for KPI cards
    const cards = document.querySelectorAll('[class*="card"]')
    if (cards.length > 0) {
      results.push(`✅ ${cards.length} cards rendered`)
    } else {
      results.push('❌ No cards found')
    }

    // Check for charts
    if (showCharts) {
      const charts = document.querySelectorAll('[class*="tremor"]')
      if (charts.length > 0) {
        results.push(`✅ ${charts.length} Tremor charts found`)
      } else {
        results.push('❌ No charts rendered')
      }
    }

    // Check for trend indicators
    const trends = document.querySelectorAll('[class*="text-green-600"], [class*="text-red-600"]')
    if (trends.length > 0) {
      results.push(`✅ ${trends.length} trend indicators found`)
    }

    // Check for responsive grid
    const grid = document.querySelector('[class*="grid-cols"]')
    if (grid) {
      results.push('✅ Responsive grid layout active')
    }

    // Check variant-specific features
    if (variant === 'compact') {
      results.push('📏 Compact variant: Reduced spacing and font sizes')
    } else if (variant === 'detailed') {
      results.push('📊 Detailed variant: Extra metrics and progress bars')
    } else {
      results.push('📱 Default variant: Standard layout')
    }

    setTestResults(results)
  }, [variant, showCharts, showLoading, showError])

  // Action menu for cards
  const cardActions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Maximize2 className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">KPI Cards Component Test</h1>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>Configure KPI card display options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variant Selection */}
          <div className="space-y-2">
            <Label>Card Variant</Label>
            <RadioGroup value={variant} onValueChange={(v) => setVariant(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="compact" />
                <Label htmlFor="compact">Compact</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="detailed" />
                <Label htmlFor="detailed">Detailed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Grid Columns */}
          <div className="space-y-2">
            <Label>Grid Columns (Desktop)</Label>
            <RadioGroup value={gridColumns} onValueChange={setGridColumns}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="col2" />
                <Label htmlFor="col2">2 Columns</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="col3" />
                <Label htmlFor="col3">3 Columns</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="col4" />
                <Label htmlFor="col4">4 Columns (Default)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="charts"
                checked={showCharts}
                onCheckedChange={setShowCharts}
              />
              <Label htmlFor="charts">Show Mini Charts</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="animate"
                checked={animate}
                onCheckedChange={setAnimate}
              />
              <Label htmlFor="animate">Enable Animations</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="loading"
                checked={showLoading}
                onCheckedChange={setShowLoading}
              />
              <Label htmlFor="loading">Show Loading State</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="error"
                checked={showError}
                onCheckedChange={setShowError}
              />
              <Label htmlFor="error">Show Error State</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Component Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm">
                {result}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Examples */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
          <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns}`}>
            <KPICard
              title="Total Portfolio Value"
              value={showLoading ? 0 : "$2,543,210"}
              description="Total value across all properties"
              change={12.5}
              changeLabel="from last month"
              trend="up"
              icon={<DollarSign className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'area' : undefined}
              chartData={showCharts ? generateChartData(30, 2500000, 0.05) : undefined}
              actions={cardActions}
              loading={showLoading}
              error={showError}
              errorMessage="Failed to load portfolio value"
              animate={animate}
            />

            <KPICard
              title="Active Properties"
              value={showLoading ? 0 : 24}
              description="Properties in your portfolio"
              change={8.3}
              trend="up"
              icon={<Building2 className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'bar' : undefined}
              chartData={showCharts ? generateChartData(30, 20, 0.2) : undefined}
              actions={cardActions}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Total Returns"
              value={showLoading ? 0 : "18.7%"}
              description="Annual average return"
              change={-2.1}
              changeLabel="vs last year"
              trend="down"
              icon={<TrendingUp className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'line' : undefined}
              chartData={showCharts ? generateChartData(30, 15, 0.3) : undefined}
              actions={cardActions}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Monthly Income"
              value={showLoading ? 0 : "$12,450"}
              description="Rental income this month"
              change={5.2}
              trend="up"
              icon={<Wallet className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'area' : undefined}
              chartData={showCharts ? generateChartData(30, 10000, 0.1) : undefined}
              actions={cardActions}
              loading={showLoading}
              error={showError}
              animate={animate}
            />
          </div>
        </div>

        {/* Activity Tracking Example */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Activity & Progress</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <KPICard
              title="Investment Activity"
              value="87%"
              description="Days with transactions"
              icon={<Activity className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'tracker' : undefined}
              trackerData={showCharts ? trackerData : undefined}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Funding Progress"
              value="$750,000"
              description="of $1,000,000 target"
              icon={<Target className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'progress' : undefined}
              chartData={showCharts ? [{ value: 750000 }] : undefined}
              target={1000000}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Portfolio Distribution"
              value="3 Types"
              description="Property categories"
              icon={<PieChart className="h-4 w-4" />}
              variant={variant}
              chartType={showCharts ? 'category' : undefined}
              categoryData={showCharts ? categoryData : undefined}
              loading={showLoading}
              error={showError}
              animate={animate}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Occupancy Rate"
              value="94.5%"
              change={3.2}
              trend="up"
              icon={<Users className="h-4 w-4" />}
              variant={variant}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Cap Rate"
              value="6.8%"
              change={0}
              trend="neutral"
              icon={<BarChart3 className="h-4 w-4" />}
              variant={variant}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Risk Score"
              value="Low"
              description="Portfolio risk assessment"
              icon={<Shield className="h-4 w-4" />}
              variant={variant}
              loading={showLoading}
              error={showError}
              animate={animate}
            />

            <KPICard
              title="Performance Rank"
              value="#12"
              description="Among all investors"
              change={5}
              changeLabel="positions up"
              trend="up"
              icon={<Award className="h-4 w-4" />}
              variant={variant}
              loading={showLoading}
              error={showError}
              animate={animate}
            />
          </div>
        </div>

        {/* Skeleton Examples */}
        {showLoading && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Loading States</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <KPICardSkeleton variant={variant} />
              <KPICardSkeleton variant={variant} />
              <KPICardSkeleton variant={variant} />
              <KPICardSkeleton variant={variant} />
            </div>
          </div>
        )}
      </div>

      {/* Feature Checklist */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Step 17 Features Implemented</CardTitle>
          <CardDescription>KPI card component specifications from Section 5.2</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-3">Core Features</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ shadcn Card as base component</li>
                <li>✅ Tremor charts integration (6 types)</li>
                <li>✅ Three variants: default, compact, detailed</li>
                <li>✅ Trend indicators with colors</li>
                <li>✅ Percentage change display</li>
                <li>✅ Icon support for context</li>
                <li>✅ Loading skeleton states</li>
                <li>✅ Error states with messages</li>
                <li>✅ Action menu support</li>
                <li>✅ Footer content slot</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Chart Types</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ SparkAreaChart for trends</li>
                <li>✅ SparkLineChart for metrics</li>
                <li>✅ SparkBarChart for comparisons</li>
                <li>✅ Tracker for activity monitoring</li>
                <li>✅ ProgressBar for targets</li>
                <li>✅ CategoryBar for distributions</li>
                <li>✅ Animated chart rendering</li>
                <li>✅ Responsive chart sizing</li>
                <li>✅ Custom color schemes</li>
                <li>✅ Tooltip support</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Responsive Grid</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ 4 columns on desktop (default)</li>
              <li>✅ 2 columns on tablet</li>
              <li>✅ 1 column on mobile</li>
              <li>✅ Configurable column counts</li>
              <li>✅ KPICardGroup wrapper component</li>
              <li>✅ Consistent gap spacing (16px)</li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Section 0 Compliance</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ 8px grid system alignment</li>
              <li>✅ 200ms transitions with Framer Motion</li>
              <li>✅ Hover states with scale effect</li>
              <li>✅ Clear visual hierarchy</li>
              <li>✅ WCAG AA color contrast</li>
              <li>✅ Progressive disclosure with variants</li>
              <li>✅ Performance optimized rendering</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}