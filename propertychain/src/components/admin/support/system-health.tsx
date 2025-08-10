/**
 * System Health Monitor Component - PropertyChain Admin
 * 
 * Monitor server status, API performance, and system health metrics
 * Following UpdatedUIPlan.md Step 55.6 specifications and CLAUDE.md principles
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'
import {
  Server, Database, Globe, Shield, Activity, Zap, AlertTriangle,
  CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, RefreshCw,
  Download, Settings, Bell, Info, Cpu, HardDrive, Wifi,
  Cloud, Lock, AlertCircle, BarChart3, Timer, Gauge
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Service status interface
interface ServiceStatus {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'down' | 'maintenance'
  uptime: number
  responseTime: number
  errorRate: number
  lastChecked: Date
  incidents: number
  region?: string
  dependencies?: string[]
}

// System metric interface
interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  threshold: number
  status: 'healthy' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<any>
  color: string
}

// API endpoint interface
interface APIEndpoint {
  id: string
  path: string
  method: string
  avgResponseTime: number
  successRate: number
  requestsPerMinute: number
  p95ResponseTime: number
  p99ResponseTime: number
  lastError?: string
  status: 'healthy' | 'slow' | 'failing'
}

// Alert configuration interface
interface AlertConfig {
  id: string
  name: string
  metric: string
  condition: 'above' | 'below' | 'equals'
  threshold: number
  severity: 'info' | 'warning' | 'critical'
  enabled: boolean
  recipients: string[]
  lastTriggered?: Date
}

export function SystemHealthMonitor() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const [isLive, setIsLive] = useState(true)
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([])

  // Initialize services
  useEffect(() => {
    const initialServices: ServiceStatus[] = [
      {
        id: 'web-app',
        name: 'Web Application',
        status: 'operational',
        uptime: 99.95,
        responseTime: 145,
        errorRate: 0.05,
        lastChecked: new Date(),
        incidents: 0,
        region: 'us-east-1'
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'operational',
        uptime: 99.99,
        responseTime: 89,
        errorRate: 0.01,
        lastChecked: new Date(),
        incidents: 0,
        region: 'global'
      },
      {
        id: 'database',
        name: 'PostgreSQL Database',
        status: 'operational',
        uptime: 99.98,
        responseTime: 12,
        errorRate: 0.02,
        lastChecked: new Date(),
        incidents: 0,
        region: 'us-east-1'
      },
      {
        id: 'redis-cache',
        name: 'Redis Cache',
        status: 'operational',
        uptime: 100,
        responseTime: 2,
        errorRate: 0,
        lastChecked: new Date(),
        incidents: 0,
        region: 'us-east-1'
      },
      {
        id: 'blockchain-rpc',
        name: 'Blockchain RPC',
        status: 'degraded',
        uptime: 98.5,
        responseTime: 450,
        errorRate: 1.5,
        lastChecked: new Date(),
        incidents: 2,
        region: 'global'
      },
      {
        id: 'ipfs-gateway',
        name: 'IPFS Gateway',
        status: 'operational',
        uptime: 99.7,
        responseTime: 234,
        errorRate: 0.3,
        lastChecked: new Date(),
        incidents: 0,
        region: 'distributed'
      },
      {
        id: 'auth-service',
        name: 'Authentication Service',
        status: 'operational',
        uptime: 99.99,
        responseTime: 67,
        errorRate: 0.01,
        lastChecked: new Date(),
        incidents: 0,
        region: 'us-east-1'
      },
      {
        id: 'notification-service',
        name: 'Notification Service',
        status: 'maintenance',
        uptime: 99.8,
        responseTime: 120,
        errorRate: 0.2,
        lastChecked: new Date(),
        incidents: 0,
        region: 'us-east-1'
      }
    ]
    setServices(initialServices)
  }, [])

  // Initialize system metrics
  useEffect(() => {
    const systemMetrics: SystemMetric[] = [
      {
        id: 'cpu-usage',
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        threshold: 80,
        status: 'healthy',
        trend: 'stable',
        icon: Cpu,
        color: '#3B82F6'
      },
      {
        id: 'memory-usage',
        name: 'Memory Usage',
        value: 62,
        unit: '%',
        threshold: 85,
        status: 'healthy',
        trend: 'up',
        icon: HardDrive,
        color: '#8B5CF6'
      },
      {
        id: 'disk-usage',
        name: 'Disk Usage',
        value: 73,
        unit: '%',
        threshold: 90,
        status: 'warning',
        trend: 'up',
        icon: Database,
        color: '#F59E0B'
      },
      {
        id: 'network-throughput',
        name: 'Network Throughput',
        value: 850,
        unit: 'Mbps',
        threshold: 1000,
        status: 'healthy',
        trend: 'stable',
        icon: Wifi,
        color: '#10B981'
      },
      {
        id: 'request-rate',
        name: 'Request Rate',
        value: 1250,
        unit: 'req/s',
        threshold: 2000,
        status: 'healthy',
        trend: 'up',
        icon: Activity,
        color: '#EC4899'
      },
      {
        id: 'error-rate',
        name: 'Error Rate',
        value: 0.12,
        unit: '%',
        threshold: 1,
        status: 'healthy',
        trend: 'down',
        icon: AlertTriangle,
        color: '#EF4444'
      }
    ]
    setMetrics(systemMetrics)
  }, [])

  // Initialize API endpoints
  useEffect(() => {
    const endpoints: APIEndpoint[] = [
      {
        id: '1',
        path: '/api/auth/login',
        method: 'POST',
        avgResponseTime: 145,
        successRate: 99.8,
        requestsPerMinute: 450,
        p95ResponseTime: 230,
        p99ResponseTime: 380,
        status: 'healthy'
      },
      {
        id: '2',
        path: '/api/properties',
        method: 'GET',
        avgResponseTime: 89,
        successRate: 99.9,
        requestsPerMinute: 1200,
        p95ResponseTime: 120,
        p99ResponseTime: 180,
        status: 'healthy'
      },
      {
        id: '3',
        path: '/api/transactions',
        method: 'POST',
        avgResponseTime: 567,
        successRate: 98.5,
        requestsPerMinute: 230,
        p95ResponseTime: 890,
        p99ResponseTime: 1200,
        status: 'slow'
      },
      {
        id: '4',
        path: '/api/kyc/verify',
        method: 'POST',
        avgResponseTime: 2340,
        successRate: 97.2,
        requestsPerMinute: 45,
        p95ResponseTime: 3200,
        p99ResponseTime: 4500,
        lastError: 'Timeout error',
        status: 'slow'
      },
      {
        id: '5',
        path: '/api/blockchain/deploy',
        method: 'POST',
        avgResponseTime: 4500,
        successRate: 95.3,
        requestsPerMinute: 12,
        p95ResponseTime: 6700,
        p99ResponseTime: 8900,
        lastError: 'Gas estimation failed',
        status: 'failing'
      }
    ]
    setApiEndpoints(endpoints)
  }, [])

  // Generate performance data
  useEffect(() => {
    const hours = selectedTimeRange === '1h' ? 12 : selectedTimeRange === '24h' ? 24 : 168
    const data = Array.from({ length: hours }, (_, i) => {
      const date = new Date()
      date.setHours(date.getHours() - (hours - i - 1))
      
      return {
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: selectedTimeRange === '1h' ? '2-digit' : undefined }),
        cpu: 40 + Math.sin(i / 4) * 20 + Math.random() * 10,
        memory: 55 + Math.sin(i / 3) * 15 + Math.random() * 10,
        requests: 1000 + Math.sin(i / 5) * 500 + Math.random() * 200,
        responseTime: 100 + Math.sin(i / 4) * 50 + Math.random() * 30,
        errorRate: 0.1 + Math.sin(i / 6) * 0.05 + Math.random() * 0.05
      }
    })
    setPerformanceData(data)
  }, [selectedTimeRange])

  // Initialize alert configurations
  useEffect(() => {
    const configs: AlertConfig[] = [
      {
        id: '1',
        name: 'High CPU Usage',
        metric: 'cpu-usage',
        condition: 'above',
        threshold: 80,
        severity: 'warning',
        enabled: true,
        recipients: ['admin@propertychain.com']
      },
      {
        id: '2',
        name: 'High Error Rate',
        metric: 'error-rate',
        condition: 'above',
        threshold: 1,
        severity: 'critical',
        enabled: true,
        recipients: ['admin@propertychain.com', 'devops@propertychain.com'],
        lastTriggered: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        name: 'Low Disk Space',
        metric: 'disk-usage',
        condition: 'above',
        threshold: 90,
        severity: 'critical',
        enabled: true,
        recipients: ['devops@propertychain.com']
      },
      {
        id: '4',
        name: 'Slow API Response',
        metric: 'response-time',
        condition: 'above',
        threshold: 500,
        severity: 'warning',
        enabled: false,
        recipients: ['dev@propertychain.com']
      }
    ]
    setAlertConfigs(configs)
  }, [])

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Update service statuses
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(1, service.responseTime + (Math.random() - 0.5) * 20),
        errorRate: Math.max(0, Math.min(5, service.errorRate + (Math.random() - 0.5) * 0.1)),
        lastChecked: new Date()
      })))

      // Update metrics
      setMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * 5
        const newValue = metric.unit === '%' ? 
          Math.max(0, Math.min(100, metric.value + change)) :
          Math.max(0, metric.value + change * 10)
        
        return {
          ...metric,
          value: newValue,
          status: newValue > metric.threshold * 0.9 ? 'critical' : 
                  newValue > metric.threshold * 0.7 ? 'warning' : 'healthy',
          trend: change > 1 ? 'up' : change < -1 ? 'down' : 'stable'
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  // Get service status color
  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'text-green-700 bg-green-100'
      case 'degraded': return 'text-yellow-700 bg-yellow-100'
      case 'down': return 'text-red-700 bg-red-100'
      case 'maintenance': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  // Get metric status color
  const getMetricStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Calculate overall health
  const overallHealth = {
    score: Math.round(
      (services.filter(s => s.status === 'operational').length / services.length) * 100
    ),
    operational: services.filter(s => s.status === 'operational').length,
    degraded: services.filter(s => s.status === 'degraded').length,
    down: services.filter(s => s.status === 'down').length,
    maintenance: services.filter(s => s.status === 'maintenance').length
  }

  // Calculate uptime average
  const avgUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            <Activity className={cn("h-4 w-4", isLive && "animate-pulse")} />
            {isLive ? 'Live' : 'Paused'}
          </Button>

          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Health Overview</CardTitle>
            <Badge className={cn(
              "text-lg px-3 py-1",
              overallHealth.score >= 90 && "bg-green-100 text-green-700",
              overallHealth.score >= 70 && overallHealth.score < 90 && "bg-yellow-100 text-yellow-700",
              overallHealth.score < 70 && "bg-red-100 text-red-700"
            )}>
              {overallHealth.score}% Healthy
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{overallHealth.operational}</p>
              <p className="text-sm text-gray-500">Operational</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{overallHealth.degraded}</p>
              <p className="text-sm text-gray-500">Degraded</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-2xl font-bold">{overallHealth.down}</p>
              <p className="text-sm text-gray-500">Down</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Settings className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{overallHealth.maintenance}</p>
              <p className="text-sm text-gray-500">Maintenance</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{avgUptime.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">Avg Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {overallHealth.down > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{overallHealth.down} services are down.</strong> Immediate attention required to restore service availability.
          </AlertDescription>
        </Alert>
      )}

      {overallHealth.degraded > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{overallHealth.degraded} services are degraded.</strong> Performance may be impacted for some users.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alert Config</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="grid grid-cols-2 gap-4">
            {services.map(service => (
              <Card key={service.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      {service.region && (
                        <p className="text-xs text-gray-500">Region: {service.region}</p>
                      )}
                    </div>
                    <Badge className={cn("text-xs", getStatusColor(service.status))}>
                      {service.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Uptime</p>
                      <div className="flex items-center gap-1">
                        <p className="font-semibold">{service.uptime}%</p>
                        <Progress value={service.uptime} className="flex-1 h-1" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Response Time</p>
                      <p className="font-semibold">{service.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Error Rate</p>
                      <p className={cn(
                        "font-semibold",
                        service.errorRate > 1 ? "text-red-600" : "text-green-600"
                      )}>
                        {service.errorRate.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Incidents</p>
                      <p className="font-semibold">{service.incidents}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                    </p>
                    {service.status === 'operational' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : service.status === 'degraded' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* System Metrics Tab */}
        <TabsContent value="metrics">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {metrics.map(metric => {
                const Icon = metric.icon
                return (
                  <Card key={metric.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color: metric.color }} />
                          <span className="font-medium text-sm">{metric.name}</span>
                        </div>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : metric.trend === 'down' ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <Activity className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-1">
                          <span className={cn("text-2xl font-bold", getMetricStatusColor(metric.status))}>
                            {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
                          </span>
                          <span className="text-sm text-gray-500">{metric.unit}</span>
                        </div>
                        <Progress 
                          value={(metric.value / metric.threshold) * 100} 
                          className="h-2"
                          style={{
                            // @ts-ignore
                            '--progress-background': metric.color
                          }}
                        />
                        <p className="text-xs text-gray-500">
                          Threshold: {metric.threshold}{metric.unit}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="cpu" stroke="#3B82F6" name="CPU %" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="memory" stroke="#8B5CF6" name="Memory %" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#10B981" name="Requests/s" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Performance Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {apiEndpoints.map(endpoint => (
                    <div key={endpoint.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono text-xs">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm">{endpoint.path}</code>
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          endpoint.status === 'healthy' && "bg-green-100 text-green-700",
                          endpoint.status === 'slow' && "bg-yellow-100 text-yellow-700",
                          endpoint.status === 'failing' && "bg-red-100 text-red-700"
                        )}>
                          {endpoint.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-6 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Avg Response</p>
                          <p className="font-semibold">{endpoint.avgResponseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-500">P95</p>
                          <p className="font-semibold">{endpoint.p95ResponseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-500">P99</p>
                          <p className="font-semibold">{endpoint.p99ResponseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Success Rate</p>
                          <p className={cn(
                            "font-semibold",
                            endpoint.successRate >= 99 ? "text-green-600" : 
                            endpoint.successRate >= 95 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {endpoint.successRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Requests/min</p>
                          <p className="font-semibold">{endpoint.requestsPerMinute}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Error</p>
                          <p className="text-xs text-red-600 truncate">
                            {endpoint.lastError || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Configuration Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alert Configurations</CardTitle>
                <Button size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Add Alert
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertConfigs.map(config => (
                  <div key={config.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => {
                            setAlertConfigs(prev => prev.map(c => 
                              c.id === config.id ? { ...c, enabled } : c
                            ))
                          }}
                        />
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-gray-500">
                            When {config.metric} is {config.condition} {config.threshold}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "text-xs",
                          config.severity === 'critical' && "bg-red-100 text-red-700",
                          config.severity === 'warning' && "bg-yellow-100 text-yellow-700",
                          config.severity === 'info' && "bg-blue-100 text-blue-700"
                        )}>
                          {config.severity}
                        </Badge>
                        {config.lastTriggered && (
                          <p className="text-xs text-gray-500">
                            Last triggered: {new Date(config.lastTriggered).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Recipients: {config.recipients.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}