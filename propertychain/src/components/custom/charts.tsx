/**
 * Chart Components - PropertyChain
 * 
 * Comprehensive charting components using Recharts
 * Following Section 0 principles with responsive design
 */

'use client'

import * as React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Treemap,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Brush,
  ReferenceLine,
  ReferenceArea,
  LabelList,
  TooltipProps,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Maximize2,
  Info,
  Calendar,
  DollarSign,
} from 'lucide-react'

// Color palette following PropertyChain brand
export const CHART_COLORS = {
  primary: '#8b5cf6',
  secondary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1',
  gradient: {
    purple: ['#8b5cf6', '#7c3aed'],
    blue: ['#3b82f6', '#2563eb'],
    green: ['#10b981', '#059669'],
    amber: ['#f59e0b', '#d97706'],
    red: ['#ef4444', '#dc2626'],
  },
}

// Chart container with loading state
interface ChartContainerProps {
  title?: string
  description?: string
  loading?: boolean
  error?: string
  children: React.ReactNode
  className?: string
  height?: number | string
  toolbar?: React.ReactNode
  footer?: React.ReactNode
}

export function ChartContainer({
  title,
  description,
  loading = false,
  error,
  children,
  className,
  height = 350,
  toolbar,
  footer,
}: ChartContainerProps) {
  if (loading) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <Skeleton className="h-6 w-32" />}
            {description && <Skeleton className="h-4 w-48 mt-2" />}
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <div 
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            <div className="text-center">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {(title || description || toolbar) && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {toolbar}
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ height }}>{children}</div>
      </CardContent>
      {footer && (
        <div className="px-6 pb-4">
          {footer}
        </div>
      )}
    </Card>
  )
}

// Custom tooltip with PropertyChain styling
export function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
          </div>
          <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Line Chart Component
interface LineChartProps {
  data: any[]
  lines: {
    dataKey: string
    name?: string
    color?: string
    strokeWidth?: number
    strokeDasharray?: string
    dot?: boolean
  }[]
  xAxisKey?: string
  yAxisFormatter?: (value: any) => string
  showGrid?: boolean
  showLegend?: boolean
  showBrush?: boolean
  animate?: boolean
  height?: number
}

export function LineChartComponent({
  data,
  lines,
  xAxisKey = 'name',
  yAxisFormatter,
  showGrid = true,
  showLegend = true,
  showBrush = false,
  animate = true,
  height = 350,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        <XAxis 
          dataKey={xAxisKey}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          tickFormatter={yAxisFormatter}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {showBrush && <Brush dataKey={xAxisKey} height={30} stroke={CHART_COLORS.primary} />}
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color || CHART_COLORS.primary}
            strokeWidth={line.strokeWidth || 2}
            strokeDasharray={line.strokeDasharray}
            dot={line.dot !== false}
            animationDuration={animate ? 1000 : 0}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Area Chart Component
interface AreaChartProps {
  data: any[]
  areas: {
    dataKey: string
    name?: string
    color?: string
    gradient?: boolean
    stackId?: string
  }[]
  xAxisKey?: string
  yAxisFormatter?: (value: any) => string
  showGrid?: boolean
  showLegend?: boolean
  animate?: boolean
  height?: number
}

export function AreaChartComponent({
  data,
  areas,
  xAxisKey = 'name',
  yAxisFormatter,
  showGrid = true,
  showLegend = true,
  animate = true,
  height = 350,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          {areas.map((area, index) => (
            area.gradient && (
              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={area.color || CHART_COLORS.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={area.color || CHART_COLORS.primary} stopOpacity={0.1}/>
              </linearGradient>
            )
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        <XAxis 
          dataKey={xAxisKey}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          tickFormatter={yAxisFormatter}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {areas.map((area, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name || area.dataKey}
            stackId={area.stackId}
            stroke={area.color || CHART_COLORS.primary}
            fill={area.gradient ? `url(#gradient-${index})` : area.color || CHART_COLORS.primary}
            animationDuration={animate ? 1000 : 0}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Bar Chart Component
interface BarChartProps {
  data: any[]
  bars: {
    dataKey: string
    name?: string
    color?: string
    stackId?: string
    radius?: number | [number, number, number, number]
  }[]
  xAxisKey?: string
  yAxisFormatter?: (value: any) => string
  showGrid?: boolean
  showLegend?: boolean
  layout?: 'horizontal' | 'vertical'
  animate?: boolean
  height?: number
}

export function BarChartComponent({
  data,
  bars,
  xAxisKey = 'name',
  yAxisFormatter,
  showGrid = true,
  showLegend = true,
  layout = 'horizontal',
  animate = true,
  height = 350,
}: BarChartProps) {
  const isVertical = layout === 'vertical'
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data} 
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        {isVertical ? (
          <>
            <XAxis 
              type="number"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickFormatter={yAxisFormatter}
            />
            <YAxis 
              dataKey={xAxisKey}
              type="category"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
          </>
        ) : (
          <>
            <XAxis 
              dataKey={xAxisKey}
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickFormatter={yAxisFormatter}
            />
          </>
        )}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            name={bar.name || bar.dataKey}
            fill={bar.color || CHART_COLORS.primary}
            stackId={bar.stackId}
            radius={bar.radius}
            animationDuration={animate ? 1000 : 0}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// Pie Chart Component
interface PieChartProps {
  data: any[]
  dataKey?: string
  nameKey?: string
  colors?: string[]
  innerRadius?: number
  outerRadius?: number
  showLabel?: boolean
  showLegend?: boolean
  animate?: boolean
  height?: number
}

export function PieChartComponent({
  data,
  dataKey = 'value',
  nameKey = 'name',
  colors = Object.values(CHART_COLORS).filter(c => typeof c === 'string') as string[],
  innerRadius = 0,
  outerRadius = 80,
  showLabel = true,
  showLegend = true,
  animate = true,
  height = 350,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabel ? ({value, percent}: any) => `${(percent * 100).toFixed(0)}%` : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          animationDuration={animate ? 1000 : 0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  )
}

// Radar Chart Component
interface RadarChartProps {
  data: any[]
  dataKeys: {
    key: string
    name?: string
    color?: string
  }[]
  angleKey?: string
  showGrid?: boolean
  showLegend?: boolean
  animate?: boolean
  height?: number
}

export function RadarChartComponent({
  data,
  dataKeys,
  angleKey = 'category',
  showGrid = true,
  showLegend = true,
  animate = true,
  height = 350,
}: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        {showGrid && <PolarGrid className="stroke-muted" />}
        <PolarAngleAxis 
          dataKey={angleKey}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <PolarRadiusAxis className="text-xs" />
        {dataKeys.map((item, index) => (
          <Radar
            key={index}
            name={item.name || item.key}
            dataKey={item.key}
            stroke={item.color || CHART_COLORS.primary}
            fill={item.color || CHART_COLORS.primary}
            fillOpacity={0.6}
            animationDuration={animate ? 1000 : 0}
          />
        ))}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
      </RadarChart>
    </ResponsiveContainer>
  )
}

// Composed Chart Component (Multiple chart types)
interface ComposedChartProps {
  data: any[]
  components: {
    type: 'line' | 'bar' | 'area'
    dataKey: string
    name?: string
    color?: string
    yAxisId?: 'left' | 'right'
  }[]
  xAxisKey?: string
  showGrid?: boolean
  showLegend?: boolean
  animate?: boolean
  height?: number
}

export function ComposedChartComponent({
  data,
  components,
  xAxisKey = 'name',
  showGrid = true,
  showLegend = true,
  animate = true,
  height = 350,
}: ComposedChartProps) {
  const hasRightAxis = components.some(c => c.yAxisId === 'right')
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        <XAxis 
          dataKey={xAxisKey}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          yAxisId="left"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        {hasRightAxis && (
          <YAxis 
            yAxisId="right"
            orientation="right"
            className="text-xs"
            tick={{ fill: 'currentColor' }}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {components.map((comp, index) => {
          const props = {
            dataKey: comp.dataKey,
            name: comp.name || comp.dataKey,
            yAxisId: comp.yAxisId || 'left',
            animationDuration: animate ? 1000 : 0,
          }
          
          switch (comp.type) {
            case 'line':
              return (
                <Line
                  key={index}
                  {...props}
                  type="monotone"
                  stroke={comp.color || CHART_COLORS.primary}
                />
              )
            case 'bar':
              return (
                <Bar
                  key={index}
                  {...props}
                  fill={comp.color || CHART_COLORS.secondary}
                />
              )
            case 'area':
              return (
                <Area
                  key={index}
                  {...props}
                  type="monotone"
                  stroke={comp.color || CHART_COLORS.success}
                  fill={comp.color || CHART_COLORS.success}
                  fillOpacity={0.3}
                />
              )
            default:
              return null
          }
        })}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// Scatter Chart Component
interface ScatterChartProps {
  data: any[]
  scatters: {
    name: string
    data: any[]
    color?: string
  }[]
  xKey?: string
  yKey?: string
  zKey?: string
  showGrid?: boolean
  showLegend?: boolean
  animate?: boolean
  height?: number
}

export function ScatterChartComponent({
  data,
  scatters,
  xKey = 'x',
  yKey = 'y',
  zKey,
  showGrid = true,
  showLegend = true,
  animate = true,
  height = 350,
}: ScatterChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        <XAxis 
          type="number"
          dataKey={xKey}
          name={xKey}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          type="number"
          dataKey={yKey}
          name={yKey}
          className="text-xs"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        {showLegend && <Legend />}
        {scatters.map((scatter, index) => (
          <Scatter
            key={index}
            name={scatter.name}
            data={scatter.data}
            fill={scatter.color || CHART_COLORS.primary}
            animationDuration={animate ? 1000 : 0}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// Treemap Component
interface TreemapProps {
  data: any[]
  dataKey?: string
  aspectRatio?: number
  colors?: string[]
  animate?: boolean
  height?: number
}

export function TreemapComponent({
  data,
  dataKey = 'value',
  aspectRatio = 4 / 3,
  colors = Object.values(CHART_COLORS).filter(c => typeof c === 'string') as string[],
  animate = true,
  height = 350,
}: TreemapProps) {
  const CustomContent = (props: any) => {
    const { x, y, width, height, name, value, index } = props
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {width > 50 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 7}
              textAnchor="middle"
              fill="#fff"
              fontSize={10}
            >
              {value}
            </text>
          </>
        )}
      </g>
    )
  }
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey={dataKey}
        aspectRatio={aspectRatio}
        animationDuration={animate ? 1000 : 0}
        content={<CustomContent />}
      />
    </ResponsiveContainer>
  )
}

// Radial Bar Chart Component
interface RadialBarChartProps {
  data: any[]
  dataKey?: string
  colors?: string[]
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  animate?: boolean
  height?: number
}

export function RadialBarChartComponent({
  data,
  dataKey = 'value',
  colors = Object.values(CHART_COLORS).filter(c => typeof c === 'string') as string[],
  innerRadius = 20,
  outerRadius = 90,
  showLegend = true,
  animate = true,
  height = 350,
}: RadialBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius={innerRadius} 
        outerRadius={outerRadius} 
        data={data}
      >
        <RadialBar
          dataKey={dataKey}
          cornerRadius={10}
          fill={CHART_COLORS.primary}
          animationDuration={animate ? 1000 : 0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </RadialBar>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
      </RadialBarChart>
    </ResponsiveContainer>
  )
}