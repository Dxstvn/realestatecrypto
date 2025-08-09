/**
 * Dashboard Widgets - PropertyChain
 * 
 * Advanced widgets with filtering, customization, and real-time updates
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Settings,
  Calendar as CalendarIcon,
  Download,
  Refresh,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Home,
  DollarSign,
  Users,
  Clock,
  Target,
  Star,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Plus,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  subMonths,
  isWithinInterval,
} from 'date-fns'

// Advanced Widget Types
export interface WidgetFilter {
  id: string
  label: string
  type: 'select' | 'range' | 'date' | 'boolean' | 'multi-select'
  options?: { value: string; label: string }[]
  value: any
  min?: number
  max?: number
  step?: number
}

export interface WidgetCustomization {
  title: string
  showTitle: boolean
  showDescription: boolean
  colorScheme: string
  refreshInterval: number
  autoRefresh: boolean
  size: 'small' | 'medium' | 'large' | 'full'
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'donut'
  displayFormat: 'compact' | 'detailed' | 'minimal'
}

// Real-time Portfolio Widget
interface PortfolioWidgetProps {
  data: {
    totalValue: number
    change24h: number
    change7d: number
    change30d: number
    assets: Array<{
      id: string
      name: string
      value: number
      change: number
      allocation: number
      type: 'property' | 'reit' | 'fund' | 'crypto'
    }>
  }
  customization?: Partial<WidgetCustomization>
  onCustomizationChange?: (customization: WidgetCustomization) => void
  className?: string
}

export function PortfolioWidget({
  data,
  customization = {},
  onCustomizationChange,
  className,
}: PortfolioWidgetProps) {
  const [timeframe, setTimeframe] = React.useState<'24h' | '7d' | '30d'>('24h')
  const [showAllAssets, setShowAllAssets] = React.useState(false)
  const [isCustomizing, setIsCustomizing] = React.useState(false)

  const config: WidgetCustomization = {
    title: 'Portfolio Overview',
    showTitle: true,
    showDescription: true,
    colorScheme: 'default',
    refreshInterval: 300,
    autoRefresh: true,
    size: 'large',
    displayFormat: 'detailed',
    ...customization,
  }

  const getCurrentChange = () => {
    switch (timeframe) {
      case '24h': return data.change24h
      case '7d': return data.change7d
      case '30d': return data.change30d
      default: return data.change24h
    }
  }

  const visibleAssets = showAllAssets ? data.assets : data.assets.slice(0, 4)

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {config.showTitle && (
              <CardTitle className="text-lg">{config.title}</CardTitle>
            )}
            {config.showDescription && (
              <CardDescription className="text-sm">
                Real-time portfolio performance and allocation
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCustomizing(true)}
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Portfolio Value */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">
            {formatCurrency(data.totalValue)}
          </span>
          <div className={cn(
            "flex items-center gap-1 text-sm",
            getCurrentChange() >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {getCurrentChange() >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{getCurrentChange() >= 0 ? '+' : ''}{getCurrentChange().toFixed(2)}%</span>
            <span className="text-muted-foreground">({timeframe})</span>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Asset Allocation</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setShowAllAssets(!showAllAssets)}
            >
              {showAllAssets ? 'Show Less' : 'Show All'}
              {showAllAssets ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            {visibleAssets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        asset.type === 'property' && "bg-blue-500",
                        asset.type === 'reit' && "bg-green-500",
                        asset.type === 'fund' && "bg-purple-500",
                        asset.type === 'crypto' && "bg-orange-500"
                      )} />
                      <span className="font-medium">{asset.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {asset.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span>{formatCurrency(asset.value)}</span>
                      <span className={cn(
                        "font-medium",
                        asset.change >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={asset.allocation} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {config.displayFormat === 'detailed' && (
          <div className="pt-2 border-t">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium">{data.assets.length}</p>
                <p className="text-muted-foreground text-xs">Assets</p>
              </div>
              <div className="text-center">
                <p className="font-medium">
                  {data.assets.filter(a => a.change > 0).length}
                </p>
                <p className="text-muted-foreground text-xs">Gainers</p>
              </div>
              <div className="text-center">
                <p className="font-medium">
                  {data.assets.filter(a => a.change < 0).length}
                </p>
                <p className="text-muted-foreground text-xs">Losers</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Customization Dialog */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Widget</DialogTitle>
            <DialogDescription>
              Personalize how this widget appears and behaves
            </DialogDescription>
          </DialogHeader>
          <WidgetCustomizationPanel
            config={config}
            onChange={onCustomizationChange}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Property Performance Widget
interface PropertyPerformanceWidgetProps {
  data: {
    properties: Array<{
      id: string
      name: string
      address: string
      currentValue: number
      purchaseValue: number
      monthlyIncome: number
      expenses: number
      roi: number
      occupancy: number
      lastUpdated: Date
    }>
  }
  filters?: WidgetFilter[]
  onFiltersChange?: (filters: WidgetFilter[]) => void
  className?: string
}

export function PropertyPerformanceWidget({
  data,
  filters = [],
  onFiltersChange,
  className,
}: PropertyPerformanceWidgetProps) {
  const [sortBy, setSortBy] = React.useState<'roi' | 'value' | 'income'>('roi')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = React.useState(false)

  const defaultFilters: WidgetFilter[] = [
    {
      id: 'min-roi',
      label: 'Minimum ROI (%)',
      type: 'range',
      value: [0],
      min: 0,
      max: 50,
      step: 0.5,
    },
    {
      id: 'property-type',
      label: 'Property Type',
      type: 'multi-select',
      options: [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'mixed', label: 'Mixed Use' },
      ],
      value: [],
    },
    {
      id: 'min-occupancy',
      label: 'Minimum Occupancy (%)',
      type: 'range',
      value: [0],
      min: 0,
      max: 100,
      step: 5,
    },
  ]

  const currentFilters = filters.length > 0 ? filters : defaultFilters

  const sortedProperties = React.useMemo(() => {
    const sorted = [...data.properties].sort((a, b) => {
      const getValue = (property: typeof a) => {
        switch (sortBy) {
          case 'roi': return property.roi
          case 'value': return property.currentValue
          case 'income': return property.monthlyIncome
          default: return property.roi
        }
      }
      
      const aValue = getValue(a)
      const bValue = getValue(b)
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })
    
    return sorted
  }, [data.properties, sortBy, sortOrder])

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Property Performance</CardTitle>
            <CardDescription className="text-sm">
              Track individual property metrics and returns
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-1 h-3 w-3" />
              Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by {sortBy.toUpperCase()}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort('roi')}>
                  ROI {sortBy === 'roi' && (sortOrder === 'desc' ? '↓' : '↑')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('value')}>
                  Value {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('income')}>
                  Income {sortBy === 'income' && (sortOrder === 'desc' ? '↓' : '↑')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="pt-4 border-t">
            <FilterPanel
              filters={currentFilters}
              onChange={onFiltersChange}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {sortedProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{property.name}</p>
                      <p className="text-xs text-muted-foreground">{property.address}</p>
                    </div>
                    <Badge variant={property.roi > 10 ? 'default' : 'secondary'}>
                      {property.roi.toFixed(1)}% ROI
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-medium">{formatCurrency(property.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Income</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(property.monthlyIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Occupancy</p>
                      <p className="font-medium">{property.occupancy}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Performance</span>
                      <span>{property.occupancy}%</span>
                    </div>
                    <Progress value={property.occupancy} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Market Trends Widget
interface MarketTrendsWidgetProps {
  data: {
    location: string
    trends: Array<{
      period: string
      averagePrice: number
      priceChange: number
      volume: number
      daysOnMarket: number
      inventory: number
    }>
    currentTrend: 'up' | 'down' | 'stable'
  }
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  className?: string
}

export function MarketTrendsWidget({
  data,
  timeRange = '30d',
  onTimeRangeChange,
  className,
}: MarketTrendsWidgetProps) {
  const [expandedView, setExpandedView] = React.useState(false)

  const latestTrend = data.trends[data.trends.length - 1]
  
  const getTrendColor = () => {
    switch (data.currentTrend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getTrendIcon = () => {
    switch (data.currentTrend) {
      case 'up': return <TrendingUp className="h-4 w-4" />
      case 'down': return <TrendingDown className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Market Trends
              <span className={getTrendColor()}>{getTrendIcon()}</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Real estate market analysis for {data.location}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="90d">90D</SelectItem>
                <SelectItem value="1y">1Y</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpandedView(!expandedView)}
            >
              {expandedView ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">
                {formatCurrency(latestTrend.averagePrice)}
              </span>
              <span className={cn(
                "text-xs",
                latestTrend.priceChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {latestTrend.priceChange >= 0 ? '+' : ''}{latestTrend.priceChange.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Days on Market</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{latestTrend.daysOnMarket}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          </div>
        </div>

        {/* Market Health Indicators */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Market Activity</span>
              <span>{Math.min(100, (latestTrend.volume / 200) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(100, (latestTrend.volume / 200) * 100)} />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Inventory Level</span>
              <span className={cn(
                latestTrend.inventory < 3 ? "text-red-500" :
                latestTrend.inventory > 6 ? "text-green-500" : "text-yellow-500"
              )}>
                {latestTrend.inventory} months
              </span>
            </div>
            <Progress 
              value={Math.min(100, (latestTrend.inventory / 12) * 100)} 
              className={cn(
                latestTrend.inventory < 3 && "[&>div]:bg-red-500",
                latestTrend.inventory > 6 && "[&>div]:bg-green-500"
              )}
            />
          </div>
        </div>

        {expandedView && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Historical Trends</h4>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {data.trends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{trend.period}</span>
                    <div className="flex items-center gap-3">
                      <span>{formatCurrency(trend.averagePrice)}</span>
                      <span className={cn(
                        "text-xs",
                        trend.priceChange >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {trend.priceChange >= 0 ? '+' : ''}{trend.priceChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Widget Customization Panel
interface WidgetCustomizationPanelProps {
  config: WidgetCustomization
  onChange?: (config: WidgetCustomization) => void
}

function WidgetCustomizationPanel({ config, onChange }: WidgetCustomizationPanelProps) {
  const handleChange = (key: keyof WidgetCustomization, value: any) => {
    onChange?.({ ...config, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Display Options</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-title">Show Title</Label>
            <Switch
              id="show-title"
              checked={config.showTitle}
              onCheckedChange={(checked) => handleChange('showTitle', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-description">Show Description</Label>
            <Switch
              id="show-description"
              checked={config.showDescription}
              onCheckedChange={(checked) => handleChange('showDescription', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Widget Size</Label>
        <Select value={config.size} onValueChange={(value: any) => handleChange('size', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="full">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Display Format</Label>
        <Select 
          value={config.displayFormat} 
          onValueChange={(value: any) => handleChange('displayFormat', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-refresh">Auto Refresh</Label>
          <Switch
            id="auto-refresh"
            checked={config.autoRefresh}
            onCheckedChange={(checked) => handleChange('autoRefresh', checked)}
          />
        </div>
        {config.autoRefresh && (
          <div className="space-y-2">
            <Label>Refresh Interval (seconds)</Label>
            <Slider
              value={[config.refreshInterval]}
              onValueChange={(value) => handleChange('refreshInterval', value[0])}
              min={30}
              max={1800}
              step={30}
            />
            <div className="text-xs text-muted-foreground text-center">
              {config.refreshInterval} seconds
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Filter Panel Component
interface FilterPanelProps {
  filters: WidgetFilter[]
  onChange?: (filters: WidgetFilter[]) => void
}

function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const handleFilterChange = (filterId: string, value: any) => {
    const updated = filters.map(filter => 
      filter.id === filterId ? { ...filter, value } : filter
    )
    onChange?.(updated)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filters.map((filter) => (
        <div key={filter.id} className="space-y-2">
          <Label className="text-xs">{filter.label}</Label>
          {filter.type === 'range' && (
            <div className="space-y-1">
              <Slider
                value={Array.isArray(filter.value) ? filter.value : [filter.value]}
                onValueChange={(value) => handleFilterChange(filter.id, value)}
                min={filter.min}
                max={filter.max}
                step={filter.step}
              />
              <div className="text-xs text-muted-foreground text-center">
                {Array.isArray(filter.value) ? filter.value[0] : filter.value}
                {filter.max && ` / ${filter.max}`}
              </div>
            </div>
          )}
          {filter.type === 'select' && (
            <Select
              value={filter.value}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filter.type === 'boolean' && (
            <Switch
              checked={filter.value}
              onCheckedChange={(checked) => handleFilterChange(filter.id, checked)}
            />
          )}
        </div>
      ))}
    </div>
  )
}