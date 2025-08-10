/**
 * Performance Monitoring Dashboard - PropertyChain
 * 
 * Centralized performance metrics and monitoring
 * Following UpdatedUIPlan.md Step 56 specifications and CLAUDE.md principles
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Activity, Zap, Gauge, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Database, Cpu, HardDrive, Wifi, Globe, Shield,
  BarChart3, RefreshCw, Download, Settings, Info
} from 'lucide-react'
// Import web-vitals types
import type { Metric } from 'web-vitals'

// Web Vitals metrics
interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta?: number
}

// Performance metrics
interface PerformanceMetrics {
  FCP: WebVitalsMetric // First Contentful Paint
  LCP: WebVitalsMetric // Largest Contentful Paint
  FID: WebVitalsMetric // First Input Delay
  CLS: WebVitalsMetric // Cumulative Layout Shift
  TTFB: WebVitalsMetric // Time to First Byte
  INP: WebVitalsMetric // Interaction to Next Paint
}

// Resource timing
interface ResourceTiming {
  name: string
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'xhr' | 'fetch'
  duration: number
  size: number
  cached: boolean
}

// Bundle metrics
interface BundleMetrics {
  totalSize: number
  jsSize: number
  cssSize: number
  imageSize: number
  chunkCount: number
  cacheHitRate: number
}

export function PerformanceMonitoringDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [resources, setResources] = useState<ResourceTiming[]>([])
  const [bundleMetrics, setBundleMetrics] = useState<BundleMetrics | null>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Collect Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return

    const collectWebVitals = () => {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint')
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      // Calculate metrics
      const newMetrics: PerformanceMetrics = {
        FCP: {
          name: 'First Contentful Paint',
          value: fcp?.startTime || 0,
          rating: fcp?.startTime! < 1800 ? 'good' : fcp?.startTime! < 3000 ? 'needs-improvement' : 'poor'
        },
        LCP: {
          name: 'Largest Contentful Paint',
          value: 0, // Will be updated by observer
          rating: 'good'
        },
        FID: {
          name: 'First Input Delay',
          value: 0, // Will be updated by observer
          rating: 'good'
        },
        CLS: {
          name: 'Cumulative Layout Shift',
          value: 0, // Will be updated by observer
          rating: 'good'
        },
        TTFB: {
          name: 'Time to First Byte',
          value: navigation?.responseStart - navigation?.fetchStart || 0,
          rating: navigation?.responseStart - navigation?.fetchStart < 800 ? 'good' : 
                  navigation?.responseStart - navigation?.fetchStart < 1800 ? 'needs-improvement' : 'poor'
        },
        INP: {
          name: 'Interaction to Next Paint',
          value: 0, // Will be updated by observer
          rating: 'good'
        }
      }

      setMetrics(newMetrics)
    }

    // Observe LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      
      setMetrics(prev => prev ? {
        ...prev,
        LCP: {
          name: 'Largest Contentful Paint',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: lastEntry.renderTime < 2500 ? 'good' : 
                 lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor'
        }
      } : null)
    })

    // Observe CLS
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      
      setMetrics(prev => prev ? {
        ...prev,
        CLS: {
          name: 'Cumulative Layout Shift',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
        }
      } : null)
    })

    // Observe FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any
      const firstEntry = entries[0]
      
      setMetrics(prev => prev ? {
        ...prev,
        FID: {
          name: 'First Input Delay',
          value: firstEntry.processingStart - firstEntry.startTime,
          rating: firstEntry.processingStart - firstEntry.startTime < 100 ? 'good' : 
                 firstEntry.processingStart - firstEntry.startTime < 300 ? 'needs-improvement' : 'poor'
        }
      } : null)
    })

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch (e) {
      console.warn('Performance Observer not supported:', e)
    }

    collectWebVitals()

    return () => {
      lcpObserver.disconnect()
      clsObserver.disconnect()
      fidObserver.disconnect()
    }
  }, [])

  // Collect resource timings
  useEffect(() => {
    if (typeof window === 'undefined') return

    const collectResourceTimings = () => {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      const timings: ResourceTiming[] = resourceEntries
        .slice(-50) // Last 50 resources
        .map(entry => {
          const type: ResourceTiming['type'] = entry.name.endsWith('.js') ? 'script' :
                       entry.name.endsWith('.css') ? 'stylesheet' :
                       entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)/) ? 'image' :
                       entry.name.match(/\.(woff|woff2|ttf|otf)/) ? 'font' :
                       entry.initiatorType === 'xmlhttprequest' ? 'xhr' : 'fetch'
          
          return {
            name: entry.name.split('/').pop() || entry.name,
            type,
            duration: entry.duration,
            size: entry.transferSize,
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0
          }
        })
        .sort((a, b) => b.duration - a.duration)

      setResources(timings)
    }

    if (isMonitoring) {
      const interval = setInterval(() => {
        collectResourceTimings()
        setLastUpdate(new Date())
      }, 5000)

      collectResourceTimings()
      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  // Calculate bundle metrics
  useEffect(() => {
    if (resources.length === 0) return

    const jsResources = resources.filter(r => r.type === 'script')
    const cssResources = resources.filter(r => r.type === 'stylesheet')
    const imageResources = resources.filter(r => r.type === 'image')
    
    const metrics: BundleMetrics = {
      totalSize: resources.reduce((sum, r) => sum + r.size, 0),
      jsSize: jsResources.reduce((sum, r) => sum + r.size, 0),
      cssSize: cssResources.reduce((sum, r) => sum + r.size, 0),
      imageSize: imageResources.reduce((sum, r) => sum + r.size, 0),
      chunkCount: jsResources.length,
      cacheHitRate: (resources.filter(r => r.cached).length / resources.length) * 100
    }

    setBundleMetrics(metrics)
  }, [resources])

  // Generate historical data
  useEffect(() => {
    if (!metrics) return

    setHistoricalData(prev => {
      const newData = [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          FCP: metrics.FCP.value,
          LCP: metrics.LCP.value,
          CLS: metrics.CLS.value * 1000, // Scale for visibility
          TTFB: metrics.TTFB.value
        }
      ].slice(-20) // Keep last 20 data points

      return newData
    })
  }, [metrics])

  // Export metrics
  const exportMetrics = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      webVitals: metrics,
      resources: resources.slice(0, 20),
      bundle: bundleMetrics,
      historical: historicalData
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-metrics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [metrics, resources, bundleMetrics, historicalData])

  // Get metric color
  const getMetricColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Monitoring</h2>
          <p className="text-gray-500">Real-time performance metrics and analysis</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isMonitoring ? 'default' : 'secondary'}>
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportMetrics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Web Vitals */}
      {metrics && (
        <div className="grid grid-cols-6 gap-4">
          {Object.values(metrics).map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">{metric.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      {metric.name === 'CLS' ? metric.value.toFixed(3) : 
                       Math.round(metric.value)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {metric.name === 'CLS' ? '' : 'ms'}
                    </span>
                  </div>
                  <Badge className={getMetricColor(metric.rating)}>
                    {metric.rating}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bundle Metrics */}
      {bundleMetrics && (
        <Card>
          <CardHeader>
            <CardTitle>Bundle Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Size</p>
                <p className="text-xl font-bold">
                  {(bundleMetrics.totalSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">JavaScript</p>
                <p className="text-xl font-bold">
                  {(bundleMetrics.jsSize / 1024).toFixed(0)} KB
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">CSS</p>
                <p className="text-xl font-bold">
                  {(bundleMetrics.cssSize / 1024).toFixed(0)} KB
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Images</p>
                <p className="text-xl font-bold">
                  {(bundleMetrics.imageSize / 1024).toFixed(0)} KB
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Chunks</p>
                <p className="text-xl font-bold">{bundleMetrics.chunkCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cache Hit Rate</p>
                <div className="space-y-1">
                  <p className="text-xl font-bold">{bundleMetrics.cacheHitRate.toFixed(1)}%</p>
                  <Progress value={bundleMetrics.cacheHitRate} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="lighthouse">Lighthouse</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Performance Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="FCP" stroke="#3B82F6" name="FCP (ms)" />
                  <Line type="monotone" dataKey="LCP" stroke="#8B5CF6" name="LCP (ms)" />
                  <Line type="monotone" dataKey="TTFB" stroke="#10B981" name="TTFB (ms)" />
                  <Line type="monotone" dataKey="CLS" stroke="#F59E0B" name="CLS (×1000)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Loading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resources.slice(0, 20).map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                      <span className="text-sm font-mono truncate max-w-md">
                        {resource.name}
                      </span>
                      {resource.cached && (
                        <Badge variant="secondary" className="text-xs">
                          Cached
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{(resource.size / 1024).toFixed(1)} KB</span>
                      <span className={resource.duration > 500 ? 'text-red-600' : 'text-green-600'}>
                        {resource.duration.toFixed(0)} ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lighthouse Tab */}
        <TabsContent value="lighthouse">
          <Card>
            <CardHeader>
              <CardTitle>Lighthouse Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Run <code className="font-mono bg-gray-100 px-1">npm run lighthouse</code> to generate Lighthouse reports
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg className="transform -rotate-90 h-24 w-24">
                      <circle cx="48" cy="48" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="48" cy="48" r="36" stroke="#10B981" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.95} ${2 * Math.PI * 36}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                      95
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">Performance</p>
                </div>
                
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg className="transform -rotate-90 h-24 w-24">
                      <circle cx="48" cy="48" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="48" cy="48" r="36" stroke="#10B981" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.98} ${2 * Math.PI * 36}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                      98
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">Accessibility</p>
                </div>
                
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg className="transform -rotate-90 h-24 w-24">
                      <circle cx="48" cy="48" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="48" cy="48" r="36" stroke="#10B981" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.93} ${2 * Math.PI * 36}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                      93
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">Best Practices</p>
                </div>
                
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg className="transform -rotate-90 h-24 w-24">
                      <circle cx="48" cy="48" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="48" cy="48" r="36" stroke="#10B981" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.100} ${2 * Math.PI * 36}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                      100
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">SEO</p>
                </div>
                
                <div className="text-center">
                  <div className="relative h-24 w-24 mx-auto">
                    <svg className="transform -rotate-90 h-24 w-24">
                      <circle cx="48" cy="48" r="36" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="48" cy="48" r="36" stroke="#F59E0B" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36 * 0.75} ${2 * Math.PI * 36}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                      75
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">PWA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Update */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  )
}

// Export for use in pages
export default PerformanceMonitoringDashboard