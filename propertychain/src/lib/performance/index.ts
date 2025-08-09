/**
 * Performance Monitoring System - PropertyChain
 * 
 * Core Web Vitals tracking and performance optimization utilities
 * Following CLAUDE.md performance standards
 */

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, Metric } from 'web-vitals'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
  inp?: number // Interaction to Next Paint
  
  // Custom Metrics
  timeToInteractive?: number
  totalBlockingTime?: number
  firstMeaningfulPaint?: number
  domContentLoaded?: number
  windowLoaded?: number
  
  // Resource Metrics
  jsHeapSize?: number
  transferSize?: number
  encodedBodySize?: number
  decodedBodySize?: number
  
  // Navigation Timing
  navigationStart?: number
  responseEnd?: number
  domComplete?: number
  loadEventEnd?: number
}

export interface PerformanceReport {
  timestamp: number
  url: string
  userAgent: string
  connection?: {
    effectiveType?: string
    downlink?: number
    rtt?: number
    saveData?: boolean
  }
  metrics: PerformanceMetrics
  resources: ResourceTiming[]
  errors: ErrorLog[]
}

export interface ResourceTiming {
  name: string
  entryType: string
  startTime: number
  duration: number
  transferSize?: number
  encodedBodySize?: number
  decodedBodySize?: number
  initiatorType?: string
}

export interface ErrorLog {
  timestamp: number
  message: string
  source?: string
  lineno?: number
  colno?: number
  stack?: string
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number }
  fid: { good: number; needsImprovement: number }
  cls: { good: number; needsImprovement: number }
  fcp: { good: number; needsImprovement: number }
  ttfb: { good: number; needsImprovement: number }
  inp: { good: number; needsImprovement: number }
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 }, // ms
  fid: { good: 100, needsImprovement: 300 }, // ms
  cls: { good: 0.1, needsImprovement: 0.25 }, // score
  fcp: { good: 1800, needsImprovement: 3000 }, // ms
  ttfb: { good: 800, needsImprovement: 1800 }, // ms
  inp: { good: 200, needsImprovement: 500 }, // ms
}

// ============================================================================
// Performance Observer
// ============================================================================

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private resources: ResourceTiming[] = []
  private errors: ErrorLog[] = []
  private observers: Set<(report: PerformanceReport) => void> = new Set()
  private thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
  private reportingEndpoint?: string
  private batchTimer?: NodeJS.Timeout
  private batchedReports: PerformanceReport[] = []

  constructor(config?: {
    thresholds?: Partial<PerformanceThresholds>
    reportingEndpoint?: string
    batchInterval?: number
  }) {
    if (config?.thresholds) {
      this.thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds }
    }
    
    this.reportingEndpoint = config?.reportingEndpoint
    
    if (config?.batchInterval) {
      this.startBatching(config.batchInterval)
    }
    
    this.initializeMonitoring()
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return

    // Core Web Vitals
    this.trackWebVitals()
    
    // Navigation Timing
    this.trackNavigationTiming()
    
    // Resource Timing
    this.trackResourceTiming()
    
    // JavaScript Errors
    this.trackErrors()
    
    // Memory Usage
    this.trackMemoryUsage()
    
    // Network Information
    this.trackNetworkInfo()
  }

  private trackWebVitals() {
    // Largest Contentful Paint
    onLCP((metric) => {
      this.metrics.lcp = metric.value
      this.checkThreshold('lcp', metric.value)
      this.reportMetric(metric)
    })

    // First Input Delay
    onFID((metric) => {
      this.metrics.fid = metric.value
      this.checkThreshold('fid', metric.value)
      this.reportMetric(metric)
    })

    // Cumulative Layout Shift
    onCLS((metric) => {
      this.metrics.cls = metric.value
      this.checkThreshold('cls', metric.value)
      this.reportMetric(metric)
    })

    // First Contentful Paint
    onFCP((metric) => {
      this.metrics.fcp = metric.value
      this.checkThreshold('fcp', metric.value)
      this.reportMetric(metric)
    })

    // Time to First Byte
    onTTFB((metric) => {
      this.metrics.ttfb = metric.value
      this.checkThreshold('ttfb', metric.value)
      this.reportMetric(metric)
    })

    // Interaction to Next Paint
    onINP((metric) => {
      this.metrics.inp = metric.value
      this.checkThreshold('inp', metric.value)
      this.reportMetric(metric)
    })
  }

  private trackNavigationTiming() {
    if (!window.performance || !window.performance.timing) return

    const timing = window.performance.timing
    
    // Wait for page load
    if (document.readyState === 'complete') {
      this.captureNavigationMetrics()
    } else {
      window.addEventListener('load', () => this.captureNavigationMetrics())
    }
  }

  private captureNavigationMetrics() {
    const timing = window.performance.timing
    
    this.metrics.navigationStart = timing.navigationStart
    this.metrics.responseEnd = timing.responseEnd - timing.navigationStart
    this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
    this.metrics.domComplete = timing.domComplete - timing.navigationStart
    this.metrics.windowLoaded = timing.loadEventEnd - timing.navigationStart
    
    // Calculate Time to Interactive (approximate)
    this.metrics.timeToInteractive = timing.domInteractive - timing.navigationStart
    
    // Calculate First Meaningful Paint (approximate)
    const paintEntries = performance.getEntriesByType('paint')
    const fmp = paintEntries.find(entry => entry.name === 'first-meaningful-paint')
    if (fmp) {
      this.metrics.firstMeaningfulPaint = fmp.startTime
    }
  }

  private trackResourceTiming() {
    if (!window.performance || !window.performance.getEntriesByType) return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource: ResourceTiming = {
          name: entry.name,
          entryType: entry.entryType,
          startTime: entry.startTime,
          duration: entry.duration,
        }

        if ('transferSize' in entry) {
          resource.transferSize = (entry as any).transferSize
          resource.encodedBodySize = (entry as any).encodedBodySize
          resource.decodedBodySize = (entry as any).decodedBodySize
        }

        if ('initiatorType' in entry) {
          resource.initiatorType = (entry as any).initiatorType
        }

        this.resources.push(resource)
        
        // Keep only last 100 resources
        if (this.resources.length > 100) {
          this.resources.shift()
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['resource', 'navigation', 'measure'] })
    } catch (e) {
      // Fallback for older browsers
      const resources = performance.getEntriesByType('resource')
      this.resources = resources.slice(-100).map(entry => ({
        name: entry.name,
        entryType: entry.entryType,
        startTime: entry.startTime,
        duration: entry.duration,
      }))
    }
  }

  private trackErrors() {
    window.addEventListener('error', (event) => {
      const error: ErrorLog = {
        timestamp: Date.now(),
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      }
      
      this.errors.push(error)
      
      // Keep only last 50 errors
      if (this.errors.length > 50) {
        this.errors.shift()
      }
      
      // Report critical errors immediately
      if (this.isCriticalError(error)) {
        this.reportError(error)
      }
    })

    window.addEventListener('unhandledrejection', (event) => {
      const error: ErrorLog = {
        timestamp: Date.now(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      }
      
      this.errors.push(error)
      
      if (this.errors.length > 50) {
        this.errors.shift()
      }
    })
  }

  private trackMemoryUsage() {
    if (!(performance as any).memory) return

    setInterval(() => {
      const memory = (performance as any).memory
      this.metrics.jsHeapSize = memory.usedJSHeapSize
      
      // Check for memory leaks
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        console.warn('High memory usage detected:', {
          used: memory.usedJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        })
      }
    }, 30000) // Check every 30 seconds
  }

  private trackNetworkInfo() {
    if (!(navigator as any).connection) return

    const connection = (navigator as any).connection
    
    const updateConnectionInfo = () => {
      // This info will be included in reports
    }

    connection.addEventListener('change', updateConnectionInfo)
    updateConnectionInfo()
  }

  private checkThreshold(metric: keyof PerformanceThresholds, value: number) {
    const threshold = this.thresholds[metric]
    
    if (value <= threshold.good) {
      console.log(`✅ ${metric.toUpperCase()}: ${value} (Good)`)
    } else if (value <= threshold.needsImprovement) {
      console.warn(`⚠️ ${metric.toUpperCase()}: ${value} (Needs Improvement)`)
    } else {
      console.error(`❌ ${metric.toUpperCase()}: ${value} (Poor)`)
    }
  }

  private reportMetric(metric: Metric) {
    const report = this.generateReport()
    
    // Notify observers
    this.observers.forEach(observer => observer(report))
    
    // Send to endpoint if configured
    if (this.reportingEndpoint) {
      this.sendReport(report)
    }
  }

  private reportError(error: ErrorLog) {
    if (!this.reportingEndpoint) return
    
    fetch(this.reportingEndpoint + '/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error),
    }).catch(console.error)
  }

  private isCriticalError(error: ErrorLog): boolean {
    // Define what constitutes a critical error
    const criticalPatterns = [
      /cannot read prop/i,
      /undefined is not/i,
      /network error/i,
      /failed to fetch/i,
    ]
    
    return criticalPatterns.some(pattern => pattern.test(error.message))
  }

  private generateReport(): PerformanceReport {
    const connection = (navigator as any).connection

    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: connection ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      } : undefined,
      metrics: { ...this.metrics },
      resources: [...this.resources],
      errors: [...this.errors],
    }
  }

  private sendReport(report: PerformanceReport) {
    if (!this.reportingEndpoint) return
    
    if (this.batchTimer) {
      // Add to batch
      this.batchedReports.push(report)
    } else {
      // Send immediately
      this.sendReports([report])
    }
  }

  private sendReports(reports: PerformanceReport[]) {
    if (!this.reportingEndpoint || reports.length === 0) return
    
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.reportingEndpoint,
        JSON.stringify(reports)
      )
    } else {
      // Fallback to fetch
      fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reports),
        keepalive: true,
      }).catch(console.error)
    }
  }

  private startBatching(interval: number) {
    this.batchTimer = setInterval(() => {
      if (this.batchedReports.length > 0) {
        this.sendReports(this.batchedReports)
        this.batchedReports = []
      }
    }, interval)
  }

  // Public API
  
  public subscribe(observer: (report: PerformanceReport) => void) {
    this.observers.add(observer)
    
    return () => {
      this.observers.delete(observer)
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public getReport(): PerformanceReport {
    return this.generateReport()
  }

  public clearMetrics() {
    this.metrics = {}
    this.resources = []
    this.errors = []
  }

  public mark(name: string) {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name)
    }
  }

  public measure(name: string, startMark?: string, endMark?: string) {
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark)
        
        const entries = window.performance.getEntriesByName(name, 'measure')
        const lastEntry = entries[entries.length - 1]
        
        if (lastEntry) {
          console.log(`⏱️ ${name}: ${lastEntry.duration.toFixed(2)}ms`)
          return lastEntry.duration
        }
      } catch (e) {
        console.error('Failed to measure:', e)
      }
    }
    
    return null
  }

  public destroy() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer)
      
      // Send any remaining reports
      if (this.batchedReports.length > 0) {
        this.sendReports(this.batchedReports)
      }
    }
    
    this.observers.clear()
  }
}

// ============================================================================
// Performance Utilities
// ============================================================================

export function measureComponentPerformance(componentName: string) {
  const startMark = `${componentName}-start`
  const endMark = `${componentName}-end`
  const measureName = `${componentName}-render`

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)
      
      const entries = performance.getEntriesByName(measureName, 'measure')
      const duration = entries[entries.length - 1]?.duration
      
      if (duration) {
        console.log(`⚛️ ${componentName} rendered in ${duration.toFixed(2)}ms`)
      }
      
      return duration
    }
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = func(...args)
    cache.set(key, result)
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }) as T
}

// ============================================================================
// React Hooks
// ============================================================================

export function usePerformanceMonitor(config?: {
  thresholds?: Partial<PerformanceThresholds>
  reportingEndpoint?: string
  batchInterval?: number
}) {
  const [monitor] = React.useState(() => new PerformanceMonitor(config))
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({})

  React.useEffect(() => {
    const unsubscribe = monitor.subscribe((report) => {
      setMetrics(report.metrics)
    })

    return () => {
      unsubscribe()
      monitor.destroy()
    }
  }, [monitor])

  return {
    metrics,
    mark: monitor.mark.bind(monitor),
    measure: monitor.measure.bind(monitor),
    getReport: monitor.getReport.bind(monitor),
  }
}

export function useComponentPerformance(componentName: string) {
  const performance = React.useRef(measureComponentPerformance(componentName))
  
  React.useEffect(() => {
    performance.current.start()
    
    return () => {
      performance.current.end()
    }
  }, [])
  
  return performance.current
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = React.useState(value)
  const lastRun = React.useRef(Date.now())

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= limit) {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }
    }, limit - (Date.now() - lastRun.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// ============================================================================
// Singleton Instance
// ============================================================================

let globalMonitor: PerformanceMonitor | null = null

export function initializePerformanceMonitoring(config?: {
  thresholds?: Partial<PerformanceThresholds>
  reportingEndpoint?: string
  batchInterval?: number
}) {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor(config)
  }
  
  return globalMonitor
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return globalMonitor
}

// Re-export React for hooks
import * as React from 'react'