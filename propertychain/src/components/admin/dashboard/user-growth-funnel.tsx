/**
 * User Growth Funnel - PropertyChain Admin
 * 
 * Conversion metrics visualization with cohort analysis
 * Following UpdatedUIPlan.md Step 55.1 specifications
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import { formatNumber, formatPercentage } from '@/lib/utils/format'
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  TrendingUp,
  Calendar,
  Globe,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface FunnelData {
  stage: string
  users: number
  conversionRate: number
  icon: React.ElementType
  color: string
}

interface CohortData {
  cohort: string
  signups: number
  activated: number
  invested: number
  retained: number
  ltv: number
}

interface GeographicData {
  country: string
  users: number
  revenue: number
  growth: number
}

export function UserGrowthFunnel() {
  // Funnel data
  const funnelData: FunnelData[] = [
    {
      stage: 'Visitors',
      users: 45000,
      conversionRate: 100,
      icon: Users,
      color: '#007BFF',
    },
    {
      stage: 'Signups',
      users: 15234,
      conversionRate: 33.85,
      icon: UserCheck,
      color: '#10B981',
    },
    {
      stage: 'KYC Verified',
      users: 8450,
      conversionRate: 55.44,
      icon: UserCheck,
      color: '#F59E0B',
    },
    {
      stage: 'First Investment',
      users: 4225,
      conversionRate: 50,
      icon: CreditCard,
      color: '#8B5CF6',
    },
    {
      stage: 'Active Investors',
      users: 3180,
      conversionRate: 75.26,
      icon: TrendingUp,
      color: '#EF4444',
    },
  ]
  
  // Cohort analysis data
  const cohortData: CohortData[] = [
    { cohort: 'Jan 2024', signups: 2500, activated: 1800, invested: 900, retained: 720, ltv: 15000 },
    { cohort: 'Feb 2024', signups: 2800, activated: 2100, invested: 1050, retained: 850, ltv: 14500 },
    { cohort: 'Mar 2024', signups: 3200, activated: 2400, invested: 1300, retained: 1100, ltv: 16000 },
    { cohort: 'Apr 2024', signups: 3500, activated: 2700, invested: 1500, retained: 1300, ltv: 17500 },
    { cohort: 'May 2024', signups: 3800, activated: 3000, invested: 1700, retained: 1500, ltv: 18000 },
    { cohort: 'Jun 2024', signups: 4200, activated: 3400, invested: 2000, retained: 1800, ltv: 19000 },
  ]
  
  // Geographic distribution data
  const geographicData: GeographicData[] = [
    { country: 'United States', users: 6500, revenue: 8500000, growth: 25 },
    { country: 'United Kingdom', users: 2800, revenue: 3200000, growth: 18 },
    { country: 'Canada', users: 1900, revenue: 2100000, growth: 22 },
    { country: 'Australia', users: 1500, revenue: 1800000, growth: 30 },
    { country: 'Germany', users: 1200, revenue: 1400000, growth: 15 },
    { country: 'Others', users: 1334, revenue: 1500000, growth: 20 },
  ]
  
  const [selectedView, setSelectedView] = useState<'funnel' | 'cohort' | 'geographic'>('funnel')
  
  // Calculate funnel metrics
  const overallConversion = (funnelData[funnelData.length - 1].users / funnelData[0].users) * 100
  const totalUsers = funnelData[0].users
  const activeUsers = funnelData[funnelData.length - 1].users
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">User Growth Funnel</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Conversion metrics and cohort analysis
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </div>
        
        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
            <p className="text-sm text-blue-600 font-medium">Total Visitors</p>
            <p className="text-2xl font-bold text-blue-900">{formatNumber(totalUsers)}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
            <p className="text-sm text-green-600 font-medium">Active Investors</p>
            <p className="text-2xl font-bold text-green-900">{formatNumber(activeUsers)}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3">
            <p className="text-sm text-purple-600 font-medium">Overall Conversion</p>
            <p className="text-2xl font-bold text-purple-900">{overallConversion.toFixed(1)}%</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3">
            <p className="text-sm text-orange-600 font-medium">Avg. LTV</p>
            <p className="text-2xl font-bold text-orange-900">$17.5K</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="funnel" className="flex-1">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="cohort" className="flex-1">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="geographic" className="flex-1">Geographic Distribution</TabsTrigger>
          </TabsList>
          
          {/* Conversion Funnel View */}
          <TabsContent value="funnel" className="mt-6">
            <div className="space-y-6">
              {/* Visual Funnel */}
              <div className="space-y-2">
                {funnelData.map((stage, index) => {
                  const Icon = stage.icon
                  const widthPercentage = (stage.users / funnelData[0].users) * 100
                  
                  return (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center gap-4">
                        <div 
                          className="flex items-center gap-3 bg-gradient-to-r rounded-lg p-4 transition-all hover:shadow-md"
                          style={{
                            width: `${widthPercentage}%`,
                            background: `linear-gradient(to right, ${stage.color}20, ${stage.color}10)`,
                          }}
                        >
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${stage.color}30` }}
                          >
                            <Icon 
                              className="h-5 w-5" 
                              style={{ color: stage.color }}
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{stage.stage}</span>
                              <span className="text-2xl font-bold">
                                {formatNumber(stage.users)}
                              </span>
                            </div>
                            
                            {index > 0 && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-500">
                                  Conversion Rate:
                                </span>
                                <Badge variant="secondary">
                                  {stage.conversionRate.toFixed(1)}%
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {index < funnelData.length - 1 && (
                          <div className="text-sm text-gray-500">
                            → {((funnelData[index + 1].users / stage.users) * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Funnel Insights */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-600 mb-2">Biggest Drop-off</p>
                  <p className="text-lg font-bold">Visitors → Signups</p>
                  <p className="text-sm text-gray-600 mt-1">66.15% drop rate</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-600 mb-2">Best Conversion</p>
                  <p className="text-lg font-bold">Invested → Active</p>
                  <p className="text-sm text-gray-600 mt-1">75.26% conversion</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-600 mb-2">Opportunity</p>
                  <p className="text-lg font-bold">KYC Verification</p>
                  <p className="text-sm text-gray-600 mt-1">Improve by 10% → +845 users</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Cohort Analysis View */}
          <TabsContent value="cohort" className="mt-6">
            <div className="space-y-6">
              {/* Cohort Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Cohort</th>
                      <th className="text-right py-2 px-4 font-medium">Signups</th>
                      <th className="text-right py-2 px-4 font-medium">Activated</th>
                      <th className="text-right py-2 px-4 font-medium">Invested</th>
                      <th className="text-right py-2 px-4 font-medium">Retained</th>
                      <th className="text-right py-2 px-4 font-medium">LTV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort) => (
                      <tr key={cohort.cohort} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{cohort.cohort}</td>
                        <td className="text-right py-3 px-4">{formatNumber(cohort.signups)}</td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <span>{formatNumber(cohort.activated)}</span>
                            <span className="text-xs text-gray-500">
                              ({((cohort.activated / cohort.signups) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <span>{formatNumber(cohort.invested)}</span>
                            <span className="text-xs text-gray-500">
                              ({((cohort.invested / cohort.activated) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <span>{formatNumber(cohort.retained)}</span>
                            <span className="text-xs text-gray-500">
                              ({((cohort.retained / cohort.invested) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          ${(cohort.ltv / 1000).toFixed(1)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Cohort Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="cohort" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="signups" fill="#007BFF" name="Signups" />
                  <Bar dataKey="activated" fill="#10B981" name="Activated" />
                  <Bar dataKey="invested" fill="#F59E0B" name="Invested" />
                  <Bar dataKey="retained" fill="#8B5CF6" name="Retained" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Geographic Distribution View */}
          <TabsContent value="geographic" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Map Placeholder */}
              <div>
                <h3 className="font-medium mb-4">User Distribution by Country</h3>
                <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
                  <Globe className="h-16 w-16 text-gray-400" />
                  <p className="text-gray-500 ml-4">Interactive Map</p>
                </div>
              </div>
              
              {/* Country List */}
              <div>
                <h3 className="font-medium mb-4">Top Countries</h3>
                <div className="space-y-3">
                  {geographicData.map((country) => {
                    const percentage = (country.users / 15234) * 100
                    
                    return (
                      <div key={country.country} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{country.country}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {formatNumber(country.users)} users
                            </span>
                            <Badge 
                              variant={country.growth > 20 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              +{country.growth}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}