/**
 * Performance Monitoring Utilities - PropertyChain
 * 
 * Runtime performance monitoring and optimization
 * Following UpdatedUIPlan.md Step 69 specifications and CLAUDE.md principles
 */

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  fcp: number | null // First Contentful Paint
  ttfb: number | null // Time to First Byte
  inp: number | null // Interaction to Next Paint
  
  // Custom metrics
  pageLoadTime: number | null
  domInteractive: number | null
  domContentLoaded: number | null
  resourceLoadTime: number | null
  jsHeapSize: number | null
  domNodeCount: number | null
}

/**
 * Performance observer configuration
 */
export interface PerformanceObserverConfig {
  enableWebVitals: boolean
  enableResourceTiming: boolean
  enableUserTiming: boolean
  enableLongTasks: boolean
  reportingThreshold: number
  sampleRate: number
}

/**
 * Default performance observer configuration
 */
export const defaultPerformanceConfig: PerformanceObserverConfig = {
  enableWebVitals: true,
  enableResourceTiming: true,
  enableUserTiming: true,
  enableLongTasks: true,
  reportingThreshold: 2500, // Report metrics above 2.5s
  sampleRate: 1.0, // Sample 100% of users
}

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private config: PerformanceObserverConfig
  private metrics: PerformanceMetrics
  private observers: PerformanceObserver[] = []
  private reportCallbacks: Array<(metrics: PerformanceMetrics) => void> = []
  
  constructor(config: Partial<PerformanceObserverConfig> = {}) {
    this.config = { ...defaultPerformanceConfig, ...config }
    this.metrics = this.initializeMetrics()
    
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers()
    }
  }
  
  /**
   * Initialize empty metrics
   */
  private initializeMetrics(): PerformanceMetrics {
    return {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
      inp: null,
      pageLoadTime: null,
      domInteractive: null,
      domContentLoaded: null,
      resourceLoadTime: null,
      jsHeapSize: null,
      domNodeCount: null,
    }
  }
  
  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    // Web Vitals observer
    if (this.config.enableWebVitals) {
      this.observeWebVitals()
    }
    
    // Resource timing observer
    if (this.config.enableResourceTiming) {
      this.observeResourceTiming()
    }
    
    // User timing observer
    if (this.config.enableUserTiming) {
      this.observeUserTiming()
    }
    
    // Long tasks observer
    if (this.config.enableLongTasks) {
      this.observeLongTasks()
    }
    
    // Page load metrics
    this.observePageLoad()
    
    // Memory usage
    this.observeMemoryUsage()
  }
  
  /**
   * Observe Web Vitals metrics
   */
  private observeWebVitals(): void {
    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
      this.checkAndReport()
    })
    
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      this.observers.push(lcpObserver)
    } catch (e) {
      // LCP not supported
    }
    
    // FID - First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstInput = entries[0] as any
      this.metrics.fid = firstInput.processingStart - firstInput.startTime
      this.checkAndReport()
    })
    
    try {
      fidObserver.observe({ type: 'first-input', buffered: true })
      this.observers.push(fidObserver)
    } catch (e) {
      // FID not supported
    }
    
    // CLS - Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      this.metrics.cls = clsValue
      this.checkAndReport()
    })
    
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      this.observers.push(clsObserver)
    } catch (e) {
      // CLS not supported
    }
    
    // FCP - First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcp) {
        this.metrics.fcp = fcp.startTime
        this.checkAndReport()
      }
    })
    
    try {
      fcpObserver.observe({ type: 'paint', buffered: true })
      this.observers.push(fcpObserver)
    } catch (e) {
      // Paint timing not supported
    }
  }
  
  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      let totalResourceTime = 0
      
      entries.forEach((entry) => {
        totalResourceTime += entry.duration
        
        // Log slow resources
        if (entry.duration > this.config.reportingThreshold) {
          console.warn(`Slow resource: ${entry.name} (${Math.round(entry.duration)}ms)`)
        }
      })
      
      this.metrics.resourceLoadTime = totalResourceTime
    })
    
    try {
      resourceObserver.observe({ type: 'resource', buffered: true })
      this.observers.push(resourceObserver)
    } catch (e) {
      // Resource timing not supported
    }
  }
  
  /**
   * Observe user timing (marks and measures)
   */
  private observeUserTiming(): void {
    const userTimingObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.log(`Performance measure: ${entry.name} = ${Math.round(entry.duration)}ms`)
        }
      })
    })
    
    try {
      userTimingObserver.observe({ entryTypes: ['mark', 'measure'] })
      this.observers.push(userTimingObserver)
    } catch (e) {
      // User timing not supported
    }
  }
  
  /**
   * Observe long tasks
   */
  private observeLongTasks(): void {
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${Math.round(entry.duration)}ms`)
        }
      })
    })
    
    try {
      longTaskObserver.observe({ type: 'longtask', buffered: true })
      this.observers.push(longTaskObserver)
    } catch (e) {
      // Long task timing not supported
    }
  }
  
  /**
   * Observe page load metrics
   */
  private observePageLoad(): void {
    if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
      const timing = window.performance.timing
      
      // Wait for page load
      if (document.readyState === 'complete') {
        this.calculatePageLoadMetrics()
      } else {
        window.addEventListener('load', () => {
          this.calculatePageLoadMetrics()
        })
      }
    }
  }
  
  /**
   * Calculate page load metrics
   */
  private calculatePageLoadMetrics(): void {
    const timing = window.performance.timing
    
    this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart
    this.metrics.domInteractive = timing.domInteractive - timing.navigationStart
    this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
    this.metrics.ttfb = timing.responseStart - timing.navigationStart
    
    // DOM node count
    this.metrics.domNodeCount = document.querySelectorAll('*').length
    
    this.checkAndReport()
  }
  
  /**
   * Observe memory usage
   */
  private observeMemoryUsage(): void {
    if (typeof window !== 'undefined' && (window.performance as any).memory) {
      setInterval(() => {
        const memory = (window.performance as any).memory
        this.metrics.jsHeapSize = memory.usedJSHeapSize
        
        // Warn if memory usage is high
        const heapSizeMB = memory.usedJSHeapSize / (1024 * 1024)
        if (heapSizeMB > 50) {
          console.warn(`High memory usage: ${Math.round(heapSizeMB)}MB`)
        }
      }, 10000) // Check every 10 seconds
    }
  }
  
  /**
   * Check metrics and report if needed
   */
  private checkAndReport(): void {
    // Check if we should sample this user
    if (Math.random() > this.config.sampleRate) {
      return
    }
    
    // Report to callbacks
    this.reportCallbacks.forEach(callback => {
      callback(this.metrics)
    })
    
    // Log slow metrics
    if (this.metrics.lcp && this.metrics.lcp > this.config.reportingThreshold) {
      console.warn(`Slow LCP: ${Math.round(this.metrics.lcp)}ms`)
    }
    
    if (this.metrics.fid && this.metrics.fid > 100) {
      console.warn(`High FID: ${Math.round(this.metrics.fid)}ms`)
    }
    
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      console.warn(`High CLS: ${this.metrics.cls.toFixed(3)}`)
    }
  }
  
  /**
   * Mark a performance point
   */
  public mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      window.performance.mark(name)
    }
  }
  
  /**
   * Measure between two marks
   */
  public measure(name: string, startMark: string, endMark?: string): void {
    if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark)
      } catch (e) {
        console.error(`Failed to measure ${name}:`, e)
      }
    }
  }
  
  /**
   * Get current metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
  
  /**
   * Add reporting callback
   */
  public onReport(callback: (metrics: PerformanceMetrics) => void): void {
    this.reportCallbacks.push(callback)
  }
  
  /**
   * Clear observers
   */
  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

/**
 * Performance optimization recommendations
 */
export function getPerformanceRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = []
  
  // LCP recommendations
  if (metrics.lcp && metrics.lcp > 2500) {
    recommendations.push('Optimize Largest Contentful Paint (LCP):')
    recommendations.push('- Optimize server response time')
    recommendations.push('- Use CDN for static assets')
    recommendations.push('- Optimize images and use modern formats')
    recommendations.push('- Preload critical resources')
  }
  
  // FID recommendations
  if (metrics.fid && metrics.fid > 100) {
    recommendations.push('Improve First Input Delay (FID):')
    recommendations.push('- Break up long tasks')
    recommendations.push('- Use web workers for heavy computations')
    recommendations.push('- Defer non-critical JavaScript')
    recommendations.push('- Reduce JavaScript execution time')
  }
  
  // CLS recommendations
  if (metrics.cls && metrics.cls > 0.1) {
    recommendations.push('Reduce Cumulative Layout Shift (CLS):')
    recommendations.push('- Set explicit dimensions for images and videos')
    recommendations.push('- Avoid inserting content above existing content')
    recommendations.push('- Use transform animations instead of layout properties')
    recommendations.push('- Preload fonts')
  }
  
  // TTFB recommendations
  if (metrics.ttfb && metrics.ttfb > 600) {
    recommendations.push('Improve Time to First Byte (TTFB):')
    recommendations.push('- Use server-side caching')
    recommendations.push('- Optimize database queries')
    recommendations.push('- Use a CDN')
    recommendations.push('- Upgrade hosting infrastructure')
  }
  
  // Memory recommendations
  if (metrics.jsHeapSize && metrics.jsHeapSize > 50 * 1024 * 1024) {
    recommendations.push('Reduce memory usage:')
    recommendations.push('- Remove event listeners when components unmount')
    recommendations.push('- Clear timers and intervals')
    recommendations.push('- Avoid memory leaks in closures')
    recommendations.push('- Use weak references where appropriate')
  }
  
  // DOM recommendations
  if (metrics.domNodeCount && metrics.domNodeCount > 1500) {
    recommendations.push('Optimize DOM size:')
    recommendations.push('- Use virtual scrolling for long lists')
    recommendations.push('- Lazy load off-screen content')
    recommendations.push('- Simplify DOM structure')
    recommendations.push('- Remove unnecessary wrapper elements')
  }
  
  return recommendations
}

/**
 * Performance budget configuration
 */
export interface PerformanceBudget {
  lcp: number
  fid: number
  cls: number
  ttfb: number
  bundleSize: number
  imageSize: number
}

/**
 * Default performance budget
 */
export const defaultPerformanceBudget: PerformanceBudget = {
  lcp: 2500, // 2.5s
  fid: 100, // 100ms
  cls: 0.1, // 0.1
  ttfb: 600, // 600ms
  bundleSize: 200 * 1024, // 200KB
  imageSize: 100 * 1024, // 100KB per image
}

/**
 * Check if metrics meet performance budget
 */
export function checkPerformanceBudget(
  metrics: PerformanceMetrics,
  budget: PerformanceBudget = defaultPerformanceBudget
): {
  passed: boolean
  violations: string[]
} {
  const violations: string[] = []
  
  if (metrics.lcp && metrics.lcp > budget.lcp) {
    violations.push(`LCP exceeds budget: ${Math.round(metrics.lcp)}ms > ${budget.lcp}ms`)
  }
  
  if (metrics.fid && metrics.fid > budget.fid) {
    violations.push(`FID exceeds budget: ${Math.round(metrics.fid)}ms > ${budget.fid}ms`)
  }
  
  if (metrics.cls && metrics.cls > budget.cls) {
    violations.push(`CLS exceeds budget: ${metrics.cls.toFixed(3)} > ${budget.cls}`)
  }
  
  if (metrics.ttfb && metrics.ttfb > budget.ttfb) {
    violations.push(`TTFB exceeds budget: ${Math.round(metrics.ttfb)}ms > ${budget.ttfb}ms`)
  }
  
  return {
    passed: violations.length === 0,
    violations,
  }
}

// Create global performance monitor instance
let globalMonitor: PerformanceMonitor | null = null

/**
 * Get or create global performance monitor
 */
export function getPerformanceMonitor(
  config?: Partial<PerformanceObserverConfig>
): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor(config)
  }
  return globalMonitor
}

export default {
  PerformanceMonitor,
  getPerformanceRecommendations,
  checkPerformanceBudget,
  getPerformanceMonitor,
  defaultPerformanceBudget,
  defaultPerformanceConfig,
}