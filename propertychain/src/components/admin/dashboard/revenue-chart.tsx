/**
 * Revenue Analytics Chart - PropertyChain Admin
 * 
 * Multi-line chart showing platform and transaction fees
 * Following UpdatedUIPlan.md Step 55.1 specifications
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { formatCurrency } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

interface RevenueData {
  date: string
  platformFees: number
  transactionFees: number
  listingFees: number
  premiumFeatures: number
  total: number
}

export function RevenueChart() {
  const [period, setPeriod] = useState<TimePeriod>('daily')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')
  
  // Generate sample data based on period
  const generateData = (period: TimePeriod): RevenueData[] => {
    const dataPoints = {
      daily: 30,
      weekly: 12,
      monthly: 12,
      yearly: 5,
    }[period]
    
    const baseRevenue = {
      daily: 50000,
      weekly: 350000,
      monthly: 1500000,
      yearly: 18000000,
    }[period]
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const variance = 0.3
      const trend = 1 + (i * 0.02) // 2% growth trend
      
      const platformFees = baseRevenue * 0.4 * trend * (1 + (Math.random() - 0.5) * variance)
      const transactionFees = baseRevenue * 0.35 * trend * (1 + (Math.random() - 0.5) * variance)
      const listingFees = baseRevenue * 0.15 * trend * (1 + (Math.random() - 0.5) * variance)
      const premiumFeatures = baseRevenue * 0.1 * trend * (1 + (Math.random() - 0.5) * variance)
      
      const dateLabel = {
        daily: `Day ${i + 1}`,
        weekly: `Week ${i + 1}`,
        monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        yearly: `${2020 + i}`,
      }[period]
      
      return {
        date: dateLabel,
        platformFees,
        transactionFees,
        listingFees,
        premiumFeatures,
        total: platformFees + transactionFees + listingFees + premiumFeatures,
      }
    })
  }
  
  const [data] = useState<RevenueData[]>(generateData(period))
  
  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, d) => sum + d.total, 0)
  const avgRevenue = totalRevenue / data.length
  const growth = ((data[data.length - 1].total - data[0].total) / data[0].total) * 100
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-medium">
                {formatCurrency(entry.value as number)}
              </span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Total:</span>
              <span>{formatCurrency(payload[0].payload.total)}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
  
  const chartColors = {
    platformFees: '#007BFF',
    transactionFees: '#10B981',
    listingFees: '#F59E0B',
    premiumFeatures: '#8B5CF6',
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Revenue Analytics</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Platform revenue breakdown and trends
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
            >
              {chartType === 'line' ? 'Area Chart' : 'Line Chart'}
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-600 font-medium">Avg Revenue</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(avgRevenue)}
            </p>
          </div>
          
          <div className={cn(
            "rounded-lg p-3",
            growth >= 0 ? "bg-purple-50" : "bg-red-50"
          )}>
            <p className={cn(
              "text-sm font-medium",
              growth >= 0 ? "text-purple-600" : "text-red-600"
            )}>
              Growth Rate
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className={cn(
                "h-5 w-5",
                growth >= 0 ? "text-purple-900" : "text-red-900 rotate-180"
              )} />
              <p className={cn(
                "text-2xl font-bold",
                growth >= 0 ? "text-purple-900" : "text-red-900"
              )}>
                {Math.abs(growth).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <TabsList className="w-full">
            <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="flex-1">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Chart */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'area' ? (
              <AreaChart data={data}>
                <defs>
                  {Object.entries(chartColors).map(([key, color]) => (
                    <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="platformFees"
                  name="Platform Fees"
                  stackId="1"
                  stroke={chartColors.platformFees}
                  fill={`url(#gradient-platformFees)`}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="transactionFees"
                  name="Transaction Fees"
                  stackId="1"
                  stroke={chartColors.transactionFees}
                  fill={`url(#gradient-transactionFees)`}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="listingFees"
                  name="Listing Fees"
                  stackId="1"
                  stroke={chartColors.listingFees}
                  fill={`url(#gradient-listingFees)`}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="premiumFeatures"
                  name="Premium Features"
                  stackId="1"
                  stroke={chartColors.premiumFeatures}
                  fill={`url(#gradient-premiumFeatures)`}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="platformFees"
                  name="Platform Fees"
                  stroke={chartColors.platformFees}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="transactionFees"
                  name="Transaction Fees"
                  stroke={chartColors.transactionFees}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="listingFees"
                  name="Listing Fees"
                  stroke={chartColors.listingFees}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="premiumFeatures"
                  name="Premium Features"
                  stroke={chartColors.premiumFeatures}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Revenue Breakdown */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {Object.entries(chartColors).map(([key, color]) => {
            const total = data.reduce((sum, d) => {
              const value = d[key as keyof typeof d]
              return sum + (typeof value === 'number' ? value : 0)
            }, 0)
            const percentage = (total / totalRevenue) * 100
            
            return (
              <div key={key} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(total)}</p>
                <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}