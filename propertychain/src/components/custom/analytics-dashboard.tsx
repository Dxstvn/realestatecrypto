/**
 * Analytics Dashboard Components - PropertyChain
 * 
 * Comprehensive analytics dashboard with customizable widgets and layouts
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
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Calendar,
  Grid3X3,
  Maximize2,
  Minimize2,
  MoreVertical,
  Plus,
  X,
  GripVertical,
  Home,
  DollarSign,
  Users,
  Target,
  Award,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Zap,
  Star,
  Heart,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
  isWithinInterval,
} from 'date-fns'

// Dashboard types
export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'activity' | 'progress' | 'map'
  title: string
  description?: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number; w: number; h: number }
  data: any
  config: WidgetConfig
  visible: boolean
  refreshInterval?: number
  lastUpdated?: Date
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'radar'
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all'
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year'
  filters?: Record<string, any>
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  animate?: boolean
  comparison?: boolean
}

export interface DashboardConfig {
  layout: 'grid' | 'flex' | 'masonry'
  columns: number
  gap: number
  autoRefresh: boolean
  refreshInterval: number
  theme: 'light' | 'dark' | 'auto'
  density: 'compact' | 'default' | 'comfortable'
}

export interface MetricData {
  label: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  format?: 'currency' | 'percent' | 'number' | 'text'
  target?: number
  status?: 'success' | 'warning' | 'danger' | 'neutral'
  trend?: number[]
  icon?: React.ReactNode
  color?: string
}

// Dashboard Container Component
interface AnalyticsDashboardProps {
  widgets: DashboardWidget[]
  config: DashboardConfig
  onWidgetUpdate?: (widget: DashboardWidget) => void
  onWidgetRemove?: (widgetId: string) => void
  onConfigChange?: (config: Partial<DashboardConfig>) => void
  onExport?: (format: 'pdf' | 'csv' | 'xlsx') => void
  className?: string
}

export function AnalyticsDashboard({
  widgets,
  config,
  onWidgetUpdate,
  onWidgetRemove,
  onConfigChange,
  onExport,
  className,
}: AnalyticsDashboardProps) {
  const [selectedWidget, setSelectedWidget] = React.useState<string | null>(null)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [timeRange, setTimeRange] = React.useState<string>(config.refreshInterval?.toString() || '30d')

  const visibleWidgets = widgets.filter(w => w.visible)

  const handleWidgetClick = (widgetId: string) => {
    setSelectedWidget(selectedWidget === widgetId ? null : widgetId)
  }

  const handleRefreshAll = () => {
    // Refresh all widgets
    console.log('Refreshing all widgets...')
  }

  const handleExport = (format: 'pdf' | 'csv' | 'xlsx') => {
    onExport?.(format)
  }

  const getGridColumns = () => {
    switch (config.columns) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-1 lg:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const getGapSize = () => {
    switch (config.gap) {
      case 2: return 'gap-2'
      case 4: return 'gap-4'
      case 6: return 'gap-6'
      case 8: return 'gap-8'
      default: return 'gap-4'
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            {visibleWidgets.length} widgets • Last updated: {format(new Date(), 'MMM d, h:mm a')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefreshAll}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Dashboard</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DashboardSettings config={config} onConfigChange={onConfigChange} />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className={cn(
        "grid",
        getGridColumns(),
        getGapSize(),
        config.density === 'compact' && "gap-2",
        config.density === 'comfortable' && "gap-8"
      )}>
        {visibleWidgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            widget={widget}
            selected={selectedWidget === widget.id}
            editMode={isEditMode}
            onClick={() => handleWidgetClick(widget.id)}
            onUpdate={onWidgetUpdate}
            onRemove={onWidgetRemove}
          />
        ))}
      </div>

      {visibleWidgets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No widgets configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add widgets to start visualizing your analytics data
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Widget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Dashboard Widget Component
interface DashboardWidgetProps {
  widget: DashboardWidget
  selected?: boolean
  editMode?: boolean
  onClick?: () => void
  onUpdate?: (widget: DashboardWidget) => void
  onRemove?: (widgetId: string) => void
}

function DashboardWidget({
  widget,
  selected = false,
  editMode = false,
  onClick,
  onUpdate,
  onRemove,
}: DashboardWidgetProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getWidgetSize = () => {
    switch (widget.size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-1 lg:col-span-2'
      case 'large': return 'col-span-1 lg:col-span-2 xl:col-span-3'
      case 'full': return 'col-span-full'
      default: return 'col-span-1'
    }
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer",
        getWidgetSize(),
        selected && "ring-2 ring-primary",
        editMode && "border-dashed",
        isExpanded && "col-span-full row-span-2"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{widget.title}</CardTitle>
            {widget.description && (
              <CardDescription className="text-xs">{widget.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1">
            {editMode && (
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <GripVertical className="h-3 w-3" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-3 w-3" />
                  Configure
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-3 w-3" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onRemove?.(widget.id)}
                  className="text-destructive"
                >
                  <X className="mr-2 h-3 w-3" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <WidgetContent widget={widget} expanded={isExpanded} loading={isLoading} />
      </CardContent>
    </Card>
  )
}

// Widget Content Renderer
interface WidgetContentProps {
  widget: DashboardWidget
  expanded?: boolean
  loading?: boolean
}

function WidgetContent({ widget, expanded = false, loading = false }: WidgetContentProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    )
  }

  switch (widget.type) {
    case 'metric':
      return <MetricWidget data={widget.data} expanded={expanded} />
    case 'chart':
      return <ChartWidget data={widget.data} config={widget.config} expanded={expanded} />
    case 'progress':
      return <ProgressWidget data={widget.data} expanded={expanded} />
    case 'activity':
      return <ActivityWidget data={widget.data} expanded={expanded} />
    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          Widget type "{widget.type}" not implemented
        </div>
      )
  }
}

// Metric Widget Component
interface MetricWidgetProps {
  data: MetricData
  expanded?: boolean
}

function MetricWidget({ data, expanded = false }: MetricWidgetProps) {
  const getChangeColor = () => {
    switch (data.changeType) {
      case 'increase': return 'text-green-500'
      case 'decrease': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusColor = () => {
    switch (data.status) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'danger': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value
    
    switch (data.format) {
      case 'currency': return formatCurrency(value)
      case 'percent': return `${value}%`
      case 'number': return value.toLocaleString()
      default: return value.toString()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {data.icon && <div className={cn("p-2 rounded-lg bg-muted", getStatusColor())}>{data.icon}</div>}
          <div>
            <p className={cn("text-2xl font-bold", expanded && "text-3xl")}>
              {formatValue(data.value)}
            </p>
            <p className="text-sm text-muted-foreground">{data.label}</p>
          </div>
        </div>
      </div>

      {data.change !== undefined && (
        <div className={cn("flex items-center gap-1 text-sm", getChangeColor())}>
          {data.changeType === 'increase' ? (
            <TrendingUp className="h-3 w-3" />
          ) : data.changeType === 'decrease' ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          <span>{Math.abs(data.change)}% from last period</span>
        </div>
      )}

      {data.target && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progress to target</span>
            <span>{Math.round((Number(data.value) / data.target) * 100)}%</span>
          </div>
          <Progress value={(Number(data.value) / data.target) * 100} />
        </div>
      )}

      {expanded && data.trend && (
        <div className="mt-4">
          <div className="h-16 flex items-end gap-1">
            {data.trend.map((value, index) => (
              <div
                key={index}
                className="bg-primary/20 rounded-t flex-1"
                style={{ height: `${(value / Math.max(...data.trend!)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Chart Widget Component (placeholder for chart integration)
interface ChartWidgetProps {
  data: any
  config: WidgetConfig
  expanded?: boolean
}

function ChartWidget({ data, config, expanded = false }: ChartWidgetProps) {
  return (
    <div className={cn("space-y-3", expanded && "h-64")}>
      <div className="flex items-center justify-center h-32 bg-muted/50 rounded border-2 border-dashed border-muted-foreground/25">
        <div className="text-center">
          <BarChart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {config.chartType?.toUpperCase() || 'CHART'} Widget
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Integration with chart library required
          </p>
        </div>
      </div>
    </div>
  )
}

// Progress Widget Component
interface ProgressWidgetProps {
  data: {
    items: Array<{
      label: string
      value: number
      target: number
      color?: string
      status?: 'success' | 'warning' | 'danger'
    }>
  }
  expanded?: boolean
}

function ProgressWidget({ data, expanded = false }: ProgressWidgetProps) {
  return (
    <div className="space-y-3">
      {data.items.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">
              {formatCurrency(item.value)} / {formatCurrency(item.target)}
            </span>
          </div>
          <Progress value={(item.value / item.target) * 100} />
        </div>
      ))}
    </div>
  )
}

// Activity Widget Component
interface ActivityWidgetProps {
  data: {
    activities: Array<{
      id: string
      title: string
      description: string
      timestamp: Date
      type: string
      user?: { name: string; avatar?: string }
    }>
  }
  expanded?: boolean
}

function ActivityWidget({ data, expanded = false }: ActivityWidgetProps) {
  const displayCount = expanded ? data.activities.length : 3

  return (
    <ScrollArea className={cn("space-y-3", expanded ? "h-64" : "h-32")}>
      <div className="space-y-3">
        {data.activities.slice(0, displayCount).map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(activity.timestamp, 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

// Dashboard Settings Dialog
interface DashboardSettingsProps {
  config: DashboardConfig
  onConfigChange?: (config: Partial<DashboardConfig>) => void
}

function DashboardSettings({ config, onConfigChange }: DashboardSettingsProps) {
  const [open, setOpen] = React.useState(false)

  const handleConfigChange = (key: keyof DashboardConfig, value: any) => {
    onConfigChange?.({ [key]: value })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Customize your dashboard layout and behavior
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Layout</Label>
            <Select 
              value={config.layout} 
              onValueChange={(value: any) => handleConfigChange('layout', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="flex">Flexible</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Columns</Label>
            <Select 
              value={config.columns.toString()} 
              onValueChange={(value) => handleConfigChange('columns', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Density</Label>
            <Select 
              value={config.density} 
              onValueChange={(value: any) => handleConfigChange('density', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-refresh"
              checked={config.autoRefresh}
              onCheckedChange={(checked) => handleConfigChange('autoRefresh', checked)}
            />
            <Label htmlFor="auto-refresh">Auto Refresh</Label>
          </div>

          {config.autoRefresh && (
            <div className="space-y-2">
              <Label>Refresh Interval (seconds)</Label>
              <Select 
                value={config.refreshInterval.toString()} 
                onValueChange={(value) => handleConfigChange('refreshInterval', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="900">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Utility function to create dashboard widgets
export function createDashboardWidget(
  id: string,
  type: DashboardWidget['type'],
  title: string,
  data: any,
  options: Partial<DashboardWidget> = {}
): DashboardWidget {
  return {
    id,
    type,
    title,
    size: 'medium',
    position: { x: 0, y: 0, w: 2, h: 1 },
    data,
    config: {},
    visible: true,
    ...options,
  }
}