/**
 * PWA Hooks - PropertyChain
 * 
 * React hooks for PWA functionality
 * Following UpdatedUIPlan.md Step 58 specifications and CLAUDE.md principles
 */

import { useEffect, useState, useCallback } from 'react'

// Online/Offline status hook
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Service Worker hook
export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true)
      
      // Register service worker
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
          setRegistration(reg)
          setIsRegistered(true)
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  const update = useCallback(() => {
    if (registration) {
      registration.update()
    }
  }, [registration])

  const skipWaiting = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }, [registration])

  return {
    registration,
    isSupported,
    isRegistered,
    updateAvailable,
    update,
    skipWaiting,
  }
}

// PWA Install prompt hook
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to install PWA:', error)
      return false
    }
  }, [deferredPrompt])

  return {
    isInstallable,
    isInstalled,
    install,
  }
}

// Push Notifications hook
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Get existing subscription
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub)
        })
      })
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        // Subscribe to push notifications
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        })
        
        setSubscription(sub)
        
        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }, [isSupported])

  const unsubscribe = useCallback(async () => {
    if (!subscription) return false

    try {
      await subscription.unsubscribe()
      
      // Remove subscription from server
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      })
      
      setSubscription(null)
      return true
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      return false
    }
  }, [subscription])

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, options)
    }
  }, [permission])

  return {
    permission,
    subscription,
    isSupported,
    requestPermission,
    unsubscribe,
    sendNotification,
  }
}

// Background Sync hook
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      setIsSupported(true)
    }
  }, [])

  const registerSync = useCallback(async (tag: string) => {
    if (!isSupported) return false

    try {
      const registration = await navigator.serviceWorker.ready
      await (registration as any).sync.register(tag)
      setIsPending(true)
      return true
    } catch (error) {
      console.error('Background sync registration failed:', error)
      return false
    }
  }, [isSupported])

  const getTags = useCallback(async () => {
    if (!isSupported) return []

    try {
      const registration = await navigator.serviceWorker.ready
      return await (registration as any).sync.getTags()
    } catch (error) {
      console.error('Failed to get sync tags:', error)
      return []
    }
  }, [isSupported])

  return {
    isSupported,
    isPending,
    registerSync,
    getTags,
  }
}

// Cache management hook
export function useCacheManagement() {
  const [cacheNames, setCacheNames] = useState<string[]>([])
  const [cacheSize, setCacheSize] = useState(0)

  useEffect(() => {
    if ('caches' in window) {
      updateCacheInfo()
    }
  }, [])

  const updateCacheInfo = useCallback(async () => {
    try {
      const names = await caches.keys()
      setCacheNames(names)
      
      // Calculate cache size (approximate)
      let totalSize = 0
      for (const name of names) {
        const cache = await caches.open(name)
        const requests = await cache.keys()
        totalSize += requests.length // Simplified size calculation
      }
      setCacheSize(totalSize)
    } catch (error) {
      console.error('Failed to get cache info:', error)
    }
  }, [])

  const clearCache = useCallback(async (cacheName?: string) => {
    try {
      if (cacheName) {
        await caches.delete(cacheName)
      } else {
        const names = await caches.keys()
        await Promise.all(names.map(name => caches.delete(name)))
      }
      updateCacheInfo()
      return true
    } catch (error) {
      console.error('Failed to clear cache:', error)
      return false
    }
  }, [updateCacheInfo])

  const addToCache = useCallback(async (urls: string[], cacheName = 'propertychain-runtime') => {
    try {
      const cache = await caches.open(cacheName)
      await cache.addAll(urls)
      updateCacheInfo()
      return true
    } catch (error) {
      console.error('Failed to add to cache:', error)
      return false
    }
  }, [updateCacheInfo])

  return {
    cacheNames,
    cacheSize,
    clearCache,
    addToCache,
    updateCacheInfo,
  }
}

// Network information hook
export function useNetworkInformation() {
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const [effectiveType, setEffectiveType] = useState<string>('unknown')
  const [downlink, setDownlink] = useState<number | null>(null)
  const [rtt, setRtt] = useState<number | null>(null)
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      const updateConnectionInfo = () => {
        setConnectionType(connection.type || 'unknown')
        setEffectiveType(connection.effectiveType || 'unknown')
        setDownlink(connection.downlink || null)
        setRtt(connection.rtt || null)
        setSaveData(connection.saveData || false)
      }

      updateConnectionInfo()
      connection.addEventListener('change', updateConnectionInfo)

      return () => {
        connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  return {
    connectionType,
    effectiveType,
    downlink,
    rtt,
    saveData,
    isSlowConnection: effectiveType === '2g' || effectiveType === 'slow-2g',
  }
}

// Export all hooks
export default {
  useOnlineStatus,
  useServiceWorker,
  usePWAInstall,
  usePushNotifications,
  useBackgroundSync,
  useCacheManagement,
  useNetworkInformation,
}