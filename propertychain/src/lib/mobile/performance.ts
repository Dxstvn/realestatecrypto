/**
 * Mobile Performance Optimization Utilities - PropertyChain
 * 
 * Performance monitoring and optimization for mobile devices
 * Following UpdatedUIPlan.md Step 49 specifications and CLAUDE.md principles
 */

// Device detection
export const DeviceDetection = {
  isMobile: () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  },

  isIOS: () => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  },

  isAndroid: () => {
    if (typeof window === 'undefined') return false
    return /Android/i.test(navigator.userAgent)
  },

  isTouchDevice: () => {
    if (typeof window === 'undefined') return false
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    )
  },

  isStandalone: () => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    )
  },

  getDeviceType: () => {
    if (typeof window === 'undefined') return 'unknown'
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  },

  getOrientation: () => {
    if (typeof window === 'undefined') return 'portrait'
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  },
}

// Network detection
export const NetworkDetection = {
  getConnectionType: () => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return 'unknown'
    }
    const connection = (navigator as any).connection
    return connection.effectiveType || 'unknown'
  },

  isSlowConnection: () => {
    const type = NetworkDetection.getConnectionType()
    return type === '2g' || type === 'slow-2g'
  },

  getDataSaverStatus: () => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return false
    }
    return (navigator as any).connection?.saveData || false
  },

  isOffline: () => {
    if (typeof navigator === 'undefined') return false
    return !navigator.onLine
  },
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Measure component render time
  measureRender(componentName: string, callback: () => void) {
    const startTime = performance.now()
    callback()
    const endTime = performance.now()
    const duration = endTime - startTime

    this.recordMetric(`render_${componentName}`, duration)

    if (duration > 16) {
      // Longer than one frame (60fps)
      console.warn(`[Performance] Slow render: ${componentName} took ${duration.toFixed(2)}ms`)
    }
  }

  // Measure API call time
  async measureAPI<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    try {
      const result = await apiCall()
      const duration = performance.now() - startTime
      this.recordMetric(`api_${name}`, duration)
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      this.recordMetric(`api_${name}_error`, duration)
      throw error
    }
  }

  // Record a metric
  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    const values = this.metrics.get(name)!
    values.push(value)

    // Keep only last 100 values
    if (values.length > 100) {
      values.shift()
    }
  }

  // Get metrics summary
  getMetricsSummary(name: string) {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      count: values.length,
    }
  }

  // Monitor Core Web Vitals
  monitorWebVitals(callback?: (metric: any) => void) {
    if (typeof window === 'undefined') return

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      const lcp = lastEntry.renderTime || lastEntry.loadTime
      this.recordMetric('lcp', lcp)
      callback?.({ name: 'LCP', value: lcp })
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.set('lcp', lcpObserver)

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[]
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime
        this.recordMetric('fid', fid)
        callback?.({ name: 'FID', value: fid })
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
    this.observers.set('fid', fidObserver)

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[]
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.recordMetric('cls', clsValue)
          callback?.({ name: 'CLS', value: clsValue })
        }
      })
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.set('cls', clsObserver)
  }

  // Clean up observers
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
  }
}

// Memory management
export const MemoryManager = {
  // Check available memory
  getMemoryUsage: () => {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return null
    }
    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      percentUsed: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    }
  },

  // Check if memory is low
  isLowMemory: () => {
    const usage = MemoryManager.getMemoryUsage()
    if (!usage) return false
    return usage.percentUsed > 90
  },

  // Clean up unused resources
  cleanup: () => {
    // Clear image caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes('images')) {
            caches.delete(name)
          }
        })
      })
    }

    // Trigger garbage collection if available
    if (typeof (window as any).gc === 'function') {
      (window as any).gc()
    }
  },
}

// Battery management
export const BatteryManager = {
  getBatteryInfo: async () => {
    if (!('getBattery' in navigator)) return null

    try {
      const battery = await (navigator as any).getBattery()
      return {
        level: battery.level * 100,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      }
    } catch (error) {
      console.error('Battery API error:', error)
      return null
    }
  },

  isLowBattery: async () => {
    const info = await BatteryManager.getBatteryInfo()
    if (!info) return false
    return info.level < 20 && !info.charging
  },

  enablePowerSaveMode: async () => {
    const isLow = await BatteryManager.isLowBattery()
    if (isLow) {
      // Reduce animation frame rate
      document.documentElement.style.setProperty('--animation-duration', '0s')
      // Disable auto-play videos
      document.querySelectorAll('video').forEach((video) => {
        video.pause()
        video.removeAttribute('autoplay')
      })
      return true
    }
    return false
  },
}

// Viewport optimization
export const ViewportOptimizer = {
  // Set viewport meta tag
  setViewport: (options: {
    width?: string
    initialScale?: number
    maximumScale?: number
    userScalable?: boolean
  }) => {
    if (typeof document === 'undefined') return

    let viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.setAttribute('name', 'viewport')
      document.head.appendChild(viewport)
    }

    const content = [
      `width=${options.width || 'device-width'}`,
      `initial-scale=${options.initialScale || 1}`,
      `maximum-scale=${options.maximumScale || 5}`,
      `user-scalable=${options.userScalable !== false ? 'yes' : 'no'}`,
      'viewport-fit=cover',
    ].join(', ')

    viewport.setAttribute('content', content)
  },

  // Handle safe areas (notch, home indicator)
  getSafeAreaInsets: () => {
    if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 }

    const styles = getComputedStyle(document.documentElement)
    return {
      top: parseInt(styles.getPropertyValue('--sat') || '0'),
      right: parseInt(styles.getPropertyValue('--sar') || '0'),
      bottom: parseInt(styles.getPropertyValue('--sab') || '0'),
      left: parseInt(styles.getPropertyValue('--sal') || '0'),
    }
  },

  // Lock orientation
  lockOrientation: async (orientation: 'portrait' | 'landscape') => {
    if (!('orientation' in screen)) return false

    try {
      await (screen.orientation as any).lock(orientation)
      return true
    } catch (error) {
      console.error('Orientation lock failed:', error)
      return false
    }
  },

  // Unlock orientation
  unlockOrientation: () => {
    if ('orientation' in screen) {
      (screen.orientation as any).unlock()
    }
  },
}

// Request idle callback polyfill
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (window as any).requestIdleCallback
    : (callback: (deadline: any) => void) => {
        const start = Date.now()
        return setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          })
        }, 1)
      }

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Lazy load images
export const lazyLoadImages = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  const images = document.querySelectorAll('img[data-src]')
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  )

  images.forEach((img) => imageObserver.observe(img))
}

// Prefetch critical resources
export const prefetchResources = (urls: string[]) => {
  if (typeof document === 'undefined') return

  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

// Export all utilities
export default {
  DeviceDetection,
  NetworkDetection,
  PerformanceMonitor: PerformanceMonitor.getInstance(),
  MemoryManager,
  BatteryManager,
  ViewportOptimizer,
  requestIdleCallback,
  debounce,
  throttle,
  lazyLoadImages,
  prefetchResources,
}