/**
 * Mobile Components Export - PropertyChain
 * 
 * Central export file for all mobile-optimized components and utilities
 * Following UpdatedUIPlan.md Step 49 specifications and CLAUDE.md principles
 */

// Mobile-specific components
export {
  BottomTabBar,
  PullToRefresh,
  SwipeableCard,
  TouchRipple,
  AppInstallPrompt,
  MobileDrawer,
  FloatingActionButton,
  MobilePropertyCard,
  MobileFilterBar,
  OfflineIndicator,
} from './mobile-specific'

// Responsive image components
export {
  ResponsiveImage,
  ResponsiveBackgroundImage,
  ResponsiveImageGallery,
} from './responsive-image'

// Performance utilities
export {
  DeviceDetection,
  NetworkDetection,
  PerformanceMonitor,
  MemoryManager,
  BatteryManager,
  ViewportOptimizer,
  requestIdleCallback,
  debounce,
  throttle,
  lazyLoadImages,
  prefetchResources,
} from '@/lib/mobile/performance'

// Gesture handlers
export {
  useGestures,
  useSwipeable,
  usePinchToZoom,
  usePullToRefresh,
  useDragToReorder,
  type GestureEvent,
  type GestureType,
  type SwipeDirection,
  type GestureHandlers,
  type GestureConfig,
} from '@/lib/mobile/gestures'

// PWA utilities
export const PWAUtils = {
  // Check if app is installed
  isInstalled: () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://')
  },

  // Request install prompt
  requestInstall: async () => {
    const deferredPrompt = (window as any).deferredPrompt
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    return outcome === 'accepted'
  },

  // Register service worker
  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js')
        console.log('Service Worker registered:', registration)
        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }
    return null
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    if (!('Notification' in window)) return 'unsupported'
    
    if (Notification.permission === 'granted') return 'granted'
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission
    }
    
    return 'denied'
  },

  // Check for updates
  checkForUpdates: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        registration.update()
        return true
      }
    }
    return false
  },

  // Clear cache
  clearCache: async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      return true
    }
    return false
  },

  // Get cache size
  getCacheSize: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
      }
    }
    return null
  },

  // Enable persistent storage
  requestPersistentStorage: async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const isPersisted = await navigator.storage.persist()
      return isPersisted
    }
    return false
  },
}

// Mobile-first hooks
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = React.useState(false)
  const [isTablet, setIsTablet] = React.useState(false)
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(width > window.innerHeight ? 'landscape' : 'portrait')
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return { isMobile, isTablet, orientation }
}

// Viewport height fix for mobile browsers
export const useViewportHeight = () => {
  React.useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)

    return () => {
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
    }
  }, [])
}

// Safe area insets for notched devices
export const useSafeAreaInsets = () => {
  const [insets, setInsets] = React.useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  React.useEffect(() => {
    const updateInsets = () => {
      const styles = getComputedStyle(document.documentElement)
      setInsets({
        top: parseInt(styles.getPropertyValue('--sat') || '0'),
        right: parseInt(styles.getPropertyValue('--sar') || '0'),
        bottom: parseInt(styles.getPropertyValue('--sab') || '0'),
        left: parseInt(styles.getPropertyValue('--sal') || '0'),
      })
    }

    updateInsets()
    window.addEventListener('resize', updateInsets)

    return () => window.removeEventListener('resize', updateInsets)
  }, [])

  return insets
}

// Touch-friendly click handler
export const useTouchClick = (
  onClick: () => void,
  onLongPress?: () => void,
  delay = 500
) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleStart = () => {
    setIsPressed(true)
    if (onLongPress) {
      timeoutRef.current = setTimeout(() => {
        onLongPress()
        setIsPressed(false)
      }, delay)
    }
  }

  const handleEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (isPressed) {
      onClick()
    }
    setIsPressed(false)
  }

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPressed(false)
  }

  return {
    onTouchStart: handleStart,
    onTouchEnd: handleEnd,
    onTouchCancel: handleCancel,
    onMouseDown: handleStart,
    onMouseUp: handleEnd,
    onMouseLeave: handleCancel,
    isPressed,
  }
}

// Export all mobile utilities
export default {
  PWAUtils,
  useMobileDetection,
  useViewportHeight,
  useSafeAreaInsets,
  useTouchClick,
}

// Import React for hooks
import * as React from 'react'