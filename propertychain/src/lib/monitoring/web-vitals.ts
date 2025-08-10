/**
 * Web Vitals Integration - PropertyChain
 * 
 * Collecting and reporting Web Vitals metrics
 * Following UpdatedUIPlan.md Step 56 specifications and CLAUDE.md principles
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

// Store metrics for reporting
let metricsStore: Record<string, Metric> = {}

// Metrics callback
const handleMetric = (metric: Metric) => {
  // Store metric
  metricsStore[metric.name] = metric

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value.toFixed(2))
  }

  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // Send to monitoring service (e.g., Sentry)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    ;(window as any).Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: getMetricLevel(metric),
      data: {
        id: metric.id,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        navigationType: metric.navigationType,
      },
    })
  }
}

// Get metric severity level
function getMetricLevel(metric: Metric): 'info' | 'warning' | 'error' {
  if (metric.rating === 'good') return 'info'
  if (metric.rating === 'needs-improvement') return 'warning'
  return 'error'
}

// Initialize Web Vitals collection
export function initWebVitals() {
  if (typeof window === 'undefined') return

  // Collect all metrics
  onCLS(handleMetric)
  onFCP(handleMetric)
  onFID(handleMetric)
  onLCP(handleMetric)
  onTTFB(handleMetric)
  onINP(handleMetric)
}

// Get current metrics
export function getWebVitalsMetrics() {
  return metricsStore
}

// Report metrics batch
export function reportWebVitalsBatch() {
  const metrics = Object.values(metricsStore)
  
  if (metrics.length === 0) return

  // Batch send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'web_vitals_batch', {
      event_category: 'Performance',
      custom_map: {
        FCP: metrics.find(m => m.name === 'FCP')?.value,
        LCP: metrics.find(m => m.name === 'LCP')?.value,
        FID: metrics.find(m => m.name === 'FID')?.value,
        CLS: metrics.find(m => m.name === 'CLS')?.value,
        TTFB: metrics.find(m => m.name === 'TTFB')?.value,
        INP: metrics.find(m => m.name === 'INP')?.value,
      }
    })
  }

  return metrics
}

// Export for Next.js
export function reportWebVitals(metric: Metric) {
  handleMetric(metric)
}

// Performance marks and measures
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name)
  }
}

export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark)
      } else {
        performance.measure(name, startMark)
      }
      
      const measures = performance.getEntriesByName(name, 'measure')
      const measure = measures[measures.length - 1]
      
      if (measure) {
        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${name}:`, measure.duration.toFixed(2), 'ms')
        }

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name,
            value: Math.round(measure.duration),
            event_category: 'Performance',
          })
        }

        return measure.duration
      }
    } catch (error) {
      console.warn('Performance measurement failed:', error)
    }
  }
  return null
}

// Resource timing analysis
export function analyzeResourceTimings() {
  if (typeof window === 'undefined' || !window.performance) return []

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  return resources.map(resource => ({
    name: resource.name,
    type: getResourceType(resource),
    duration: resource.duration,
    size: resource.transferSize,
    cached: resource.transferSize === 0 && resource.decodedBodySize > 0,
    protocol: resource.nextHopProtocol,
    timing: {
      dns: resource.domainLookupEnd - resource.domainLookupStart,
      tcp: resource.connectEnd - resource.connectStart,
      ssl: resource.secureConnectionStart > 0 
        ? resource.connectEnd - resource.secureConnectionStart 
        : 0,
      ttfb: resource.responseStart - resource.requestStart,
      download: resource.responseEnd - resource.responseStart,
    }
  }))
}

function getResourceType(resource: PerformanceResourceTiming): string {
  const { name, initiatorType } = resource
  
  if (name.match(/\.(js|mjs)$/)) return 'script'
  if (name.match(/\.(css)$/)) return 'stylesheet'
  if (name.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) return 'image'
  if (name.match(/\.(woff|woff2|ttf|otf|eot)$/)) return 'font'
  if (initiatorType === 'xmlhttprequest') return 'xhr'
  if (initiatorType === 'fetch') return 'fetch'
  
  return initiatorType || 'other'
}

// Navigation timing
export function getNavigationTiming() {
  if (typeof window === 'undefined' || !window.performance) return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  
  if (!navigation) return null

  return {
    // Navigation type
    type: navigation.type,
    
    // Redirect
    redirectCount: navigation.redirectCount,
    redirectTime: navigation.redirectEnd - navigation.redirectStart,
    
    // DNS
    dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
    
    // TCP
    tcpTime: navigation.connectEnd - navigation.connectStart,
    
    // SSL
    sslTime: navigation.secureConnectionStart > 0 
      ? navigation.connectEnd - navigation.secureConnectionStart 
      : 0,
    
    // Request
    requestTime: navigation.responseStart - navigation.requestStart,
    
    // Response
    responseTime: navigation.responseEnd - navigation.responseStart,
    
    // DOM
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    
    // Load
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    
    // Total
    totalTime: navigation.loadEventEnd - navigation.fetchStart,
  }
}

// Performance budget checking
export interface PerformanceBudget {
  FCP?: number
  LCP?: number
  FID?: number
  CLS?: number
  TTFB?: number
  INP?: number
  totalBlockingTime?: number
  totalBundleSize?: number
}

export function checkPerformanceBudget(budget: PerformanceBudget) {
  const metrics = getWebVitalsMetrics()
  const violations: Array<{ metric: string; actual: number; budget: number }> = []

  // Check Web Vitals
  Object.entries(budget).forEach(([key, budgetValue]) => {
    const metric = metrics[key]
    if (metric && metric.value > budgetValue) {
      violations.push({
        metric: key,
        actual: metric.value,
        budget: budgetValue
      })
    }
  })

  return {
    passed: violations.length === 0,
    violations
  }
}

// Export types
export type { Metric }