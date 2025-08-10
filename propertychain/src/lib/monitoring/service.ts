/**
 * Monitoring Service - PropertyChain
 * 
 * Comprehensive monitoring and analytics service
 * Following UpdatedUIPlan.md Step 65 specifications and CLAUDE.md principles
 */

import * as Sentry from '@sentry/nextjs'
import { alertService } from '@/lib/alerts/service'

/**
 * Performance metrics interface
 */
interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  tags?: Record<string, string>
}

/**
 * User analytics event
 */
interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  timestamp: number
}

/**
 * System health status
 */
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down'
  services: Record<string, {
    status: 'healthy' | 'degraded' | 'down'
    responseTime?: number
    lastCheck: number
    error?: string
  }>
  timestamp: number
}

/**
 * Monitoring service class
 */
export class MonitoringService {
  private static instance: MonitoringService
  private metrics: PerformanceMetric[] = []
  private analyticsQueue: AnalyticsEvent[] = []
  
  private constructor() {
    // Initialize monitoring
    this.setupWebVitals()
    this.setupErrorBoundary()
    this.startHealthChecks()
  }
  
  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }
  
  /**
   * Track performance metric
   */
  trackMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
    }
    
    this.metrics.push(fullMetric)
    
    // Submit to alert service for evaluation
    alertService.submitMetric(metric.name, metric.value, metric.tags)
    
    // Send to Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${metric.name}: ${metric.value}${metric.unit}`,
      level: 'info',
      data: metric.tags,
    })
    
    // Send to external monitoring if configured
    this.sendToExternalMonitoring(fullMetric)
    
    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }
  
  /**
   * Track user analytics event
   */
  trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    }
    
    this.analyticsQueue.push(fullEvent)
    
    // Send to analytics providers
    this.sendToAnalytics(fullEvent)
    
    // Add to Sentry breadcrumbs
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: event.name,
      level: 'info',
      data: event.properties,
    })
    
    // Keep only last 500 events in memory
    if (this.analyticsQueue.length > 500) {
      this.analyticsQueue = this.analyticsQueue.slice(-500)
    }
  }
  
  /**
   * Track error with context
   */
  trackError(error: Error, context?: Record<string, any>): void {
    console.error('Application Error:', error)
    
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('error_context', context)
      }
      
      // Add user context if available
      const userId = this.getCurrentUserId()
      if (userId) {
        scope.setUser({ id: userId })
      }
      
      Sentry.captureException(error)
    })
    
    // Track as metric
    this.trackMetric({
      name: 'error_count',
      value: 1,
      unit: 'count',
      tags: {
        error_type: error.name,
        error_message: error.message.substring(0, 100),
        ...context,
      },
    })
  }
  
  /**
   * Track API performance
   */
  trackAPICall(
    endpoint: string,
    method: string,
    duration: number,
    status: number,
    error?: Error
  ): void {
    const success = status >= 200 && status < 400
    
    // Track performance metric
    this.trackMetric({
      name: 'api_response_time',
      value: duration,
      unit: 'ms',
      tags: {
        endpoint,
        method,
        status: status.toString(),
        success: success.toString(),
      },
    })
    
    // Track error if failed
    if (error || !success) {
      this.trackError(
        error || new Error(`API call failed: ${status}`),
        {
          endpoint,
          method,
          status,
          duration,
        }
      )
    }
    
    // Send transaction to Sentry
    Sentry.withScope((scope) => {
      scope.setTag('http.status_code', status)
      scope.setTag('http.method', method)
      scope.setExtra('duration', duration)
      scope.setExtra('endpoint', endpoint)
      
      Sentry.addBreadcrumb({
        message: `${method} ${endpoint}`,
        category: 'http.client',
        level: status >= 400 ? 'error' : 'info',
        data: { status, duration }
      })
    })
  }
  
  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const services = await this.checkServices()
    
    const overallStatus = Object.values(services).every(s => s.status === 'healthy')
      ? 'healthy'
      : Object.values(services).some(s => s.status === 'down')
      ? 'down'
      : 'degraded'
    
    return {
      status: overallStatus,
      services,
      timestamp: Date.now(),
    }
  }
  
  /**
   * Setup Web Vitals monitoring
   */
  private setupWebVitals(): void {
    if (typeof window === 'undefined') return
    
    // Import Web Vitals dynamically
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        this.trackMetric({
          name: 'web_vitals_cls',
          value: metric.value,
          unit: 'score',
          tags: { rating: metric.rating },
        })
      })
      
      getFID((metric) => {
        this.trackMetric({
          name: 'web_vitals_fid',
          value: metric.value,
          unit: 'ms',
          tags: { rating: metric.rating },
        })
      })
      
      getFCP((metric) => {
        this.trackMetric({
          name: 'web_vitals_fcp',
          value: metric.value,
          unit: 'ms',
          tags: { rating: metric.rating },
        })
      })
      
      getLCP((metric) => {
        this.trackMetric({
          name: 'web_vitals_lcp',
          value: metric.value,
          unit: 'ms',
          tags: { rating: metric.rating },
        })
      })
      
      getTTFB((metric) => {
        this.trackMetric({
          name: 'web_vitals_ttfb',
          value: metric.value,
          unit: 'ms',
          tags: { rating: metric.rating },
        })
      })
    }).catch(console.error)
  }
  
  /**
   * Setup error boundary
   */
  private setupErrorBoundary(): void {
    if (typeof window === 'undefined') return
    
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        event.reason instanceof Error 
          ? event.reason 
          : new Error(String(event.reason)),
        {
          type: 'unhandled_promise_rejection',
        }
      )
    })
  }
  
  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    if (typeof window === 'undefined') return
    
    // Check health every 5 minutes
    setInterval(async () => {
      const health = await this.getHealthStatus()
      
      this.trackMetric({
        name: 'system_health',
        value: health.status === 'healthy' ? 1 : 0,
        unit: 'status',
        tags: {
          status: health.status,
        },
      })
      
      // Alert if system is down
      if (health.status === 'down') {
        this.trackError(new Error('System health check failed'), {
          services: health.services,
        })
      }
    }, 5 * 60 * 1000) // 5 minutes
  }
  
  /**
   * Check individual services
   */
  private async checkServices(): Promise<HealthStatus['services']> {
    const services: HealthStatus['services'] = {}
    
    // Check API health
    try {
      const start = performance.now()
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const duration = performance.now() - start
      
      services.api = {
        status: response.ok ? 'healthy' : 'degraded',
        responseTime: duration,
        lastCheck: Date.now(),
        error: response.ok ? undefined : `HTTP ${response.status}`,
      }
    } catch (error) {
      services.api = {
        status: 'down',
        lastCheck: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
    
    // Check database (via API)
    try {
      const start = performance.now()
      const response = await fetch('/api/health/database')
      const duration = performance.now() - start
      
      services.database = {
        status: response.ok ? 'healthy' : 'down',
        responseTime: duration,
        lastCheck: Date.now(),
        error: response.ok ? undefined : `HTTP ${response.status}`,
      }
    } catch (error) {
      services.database = {
        status: 'down',
        lastCheck: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
    
    // Check blockchain connectivity
    try {
      const start = performance.now()
      const response = await fetch('/api/health/blockchain')
      const duration = performance.now() - start
      
      services.blockchain = {
        status: response.ok ? 'healthy' : 'degraded',
        responseTime: duration,
        lastCheck: Date.now(),
        error: response.ok ? undefined : `HTTP ${response.status}`,
      }
    } catch (error) {
      services.blockchain = {
        status: 'down',
        lastCheck: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
    
    return services
  }
  
  /**
   * Send metric to external monitoring
   */
  private async sendToExternalMonitoring(metric: PerformanceMetric): Promise<void> {
    // DataDog integration
    if (process.env.DATADOG_API_KEY) {
      try {
        await fetch('https://api.datadoghq.com/api/v1/series', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'DD-API-KEY': process.env.DATADOG_API_KEY,
          },
          body: JSON.stringify({
            series: [{
              metric: `propertychain.${metric.name}`,
              points: [[Math.floor(metric.timestamp / 1000), metric.value]],
              tags: Object.entries(metric.tags || {}).map(([k, v]) => `${k}:${v}`),
            }],
          }),
        })
      } catch (error) {
        console.error('Failed to send metric to DataDog:', error)
      }
    }
    
    // Custom metrics endpoint
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      })
    } catch (error) {
      // Fail silently for metrics
      console.debug('Failed to send metric to internal API:', error)
    }
  }
  
  /**
   * Send event to analytics providers
   */
  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, {
        ...event.properties,
        user_id: event.userId,
      })
    }
    
    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(event.name, event.properties, {
        distinct_id: event.userId,
      })
    }
    
    // Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(event.name, {
        ...event.properties,
        distinct_id: event.userId,
      })
    }
  }
  
  /**
   * Get current user ID for context
   */
  private getCurrentUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined
    
    // Try to get from session storage or other auth state
    try {
      const session = localStorage.getItem('session')
      if (session) {
        const parsed = JSON.parse(session)
        return parsed.user?.id
      }
    } catch {
      // Ignore errors
    }
    
    return undefined
  }
  
  /**
   * Get metrics summary
   */
  getMetricsSummary(): {
    totalMetrics: number
    recentErrors: number
    averageResponseTime: number
    webVitalsScore: number
  } {
    const recentMetrics = this.metrics.filter(m => 
      Date.now() - m.timestamp < 60 * 60 * 1000 // Last hour
    )
    
    const errors = recentMetrics.filter(m => m.name === 'error_count')
    const apiCalls = recentMetrics.filter(m => m.name === 'api_response_time')
    const webVitals = recentMetrics.filter(m => m.name.startsWith('web_vitals_'))
    
    const avgResponseTime = apiCalls.length > 0
      ? apiCalls.reduce((sum, m) => sum + m.value, 0) / apiCalls.length
      : 0
    
    const webVitalsScore = webVitals.length > 0
      ? webVitals.reduce((sum, m) => sum + (m.tags?.rating === 'good' ? 100 : m.tags?.rating === 'needs-improvement' ? 50 : 0), 0) / webVitals.length
      : 100
    
    return {
      totalMetrics: recentMetrics.length,
      recentErrors: errors.reduce((sum, m) => sum + m.value, 0),
      averageResponseTime: Math.round(avgResponseTime),
      webVitalsScore: Math.round(webVitalsScore),
    }
  }
}

// Global monitoring instance
export const monitoring = MonitoringService.getInstance()

// Declare global types for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    posthog?: {
      capture: (event: string, properties?: any, options?: any) => void
    }
    mixpanel?: {
      track: (event: string, properties?: any) => void
    }
  }
}

// Export utility functions
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  monitoring.trackEvent({ name, properties })
}

export const trackError = (error: Error, context?: Record<string, any>) => {
  monitoring.trackError(error, context)
}

export const trackMetric = (name: string, value: number, unit: string, tags?: Record<string, string>) => {
  monitoring.trackMetric({ name, value, unit, tags })
}

export const trackAPICall = (
  endpoint: string,
  method: string,
  duration: number,
  status: number,
  error?: Error
) => {
  monitoring.trackAPICall(endpoint, method, duration, status, error)
}

export default monitoring