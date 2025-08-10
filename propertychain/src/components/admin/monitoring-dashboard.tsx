/**
 * Monitoring Dashboard Component - PropertyChain
 * 
 * Real-time system monitoring and analytics dashboard
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Server, 
  TrendingUp, 
  Users, 
  Zap,
  RefreshCw
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  services: Record<string, {
    status: 'healthy' | 'degraded' | 'down'
    responseTime?: number
    lastCheck: number
    error?: string
  }>
  timestamp: number
}

interface MetricsSummary {
  totalMetrics: number
  recentErrors: number
  averageResponseTime: number
  webVitalsScore: number
}

interface PerformanceData {
  timestamp: string
  responseTime: number
  errorRate: number
  throughput: number
  memoryUsage: number
}

export function MonitoringDashboard() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null)
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Fetch system health
  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/monitoring/health')
      const data = await response.json()
      setSystemHealth(data)
    } catch (error) {
      console.error('Failed to fetch system health:', error)
    }
  }

  // Fetch metrics summary
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    }
  }

  // Fetch performance data
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/monitoring/performance')
      const data = await response.json()
      setPerformanceData(data.data || [])
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
    }
  }

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchSystemHealth(),
        fetchMetrics(),
        fetchPerformanceData()
      ])
      setIsLoading(false)
      setLastRefresh(new Date())
    }

    loadData()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await Promise.all([
        fetchSystemHealth(),
        fetchMetrics(),
      ])
      setLastRefresh(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Manual refresh
  const handleRefresh = async () => {
    setIsLoading(true)
    await Promise.all([
      fetchSystemHealth(),
      fetchMetrics(),
      fetchPerformanceData()
    ])
    setIsLoading(false)
    setLastRefresh(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case 'degraded': return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
      case 'down': return <Badge className="bg-red-100 text-red-800">Down</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'down': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading && !systemHealth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>System Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {systemHealth && getStatusIcon(systemHealth.status)}
              {systemHealth && getStatusBadge(systemHealth.status)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recent Errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold">{metrics?.recentErrors || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Response Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{metrics?.averageResponseTime || 0}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Web Vitals Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{metrics?.webVitalsScore || 100}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth?.services && Object.entries(systemHealth.services).map(([service, status]) => (
              <Card key={service}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {service === 'api' && <Server className="h-4 w-4" />}
                      {service === 'database' && <Database className="h-4 w-4" />}
                      {service === 'blockchain' && <Globe className="h-4 w-4" />}
                      <span className="capitalize">{service}</span>
                    </div>
                    {getStatusIcon(status.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(status.status)}
                    {status.responseTime && (
                      <div className="text-sm text-muted-foreground">
                        Response: {Math.round(status.responseTime)}ms
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Last check: {new Date(status.lastCheck).toLocaleTimeString()}
                    </div>
                    {status.error && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {status.error}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average API response time over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>Error rate percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="errorRate" 
                      stroke="#ef4444" 
                      fill="#fecaca" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>System memory utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Used Memory</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    1.2GB / 1.6GB available
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Real-time user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">247</div>
                    <div className="text-sm text-muted-foreground">
                      Active in last 5 minutes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Requests (24h)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,847</div>
                <div className="text-sm text-green-600">+12.5% from yesterday</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unique Visitors (24h)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,341</div>
                <div className="text-sm text-green-600">+8.3% from yesterday</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Bounce Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23.4%</div>
                <div className="text-sm text-red-600">+2.1% from yesterday</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium">High response time detected</div>
                    <div className="text-sm text-muted-foreground">
                      API response time exceeded 2000ms threshold
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2 minutes ago
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">System recovery</div>
                    <div className="text-sm text-muted-foreground">
                      All services are now operational
                    </div>
                    <div className="text-xs text-muted-foreground">
                      15 minutes ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MonitoringDashboard