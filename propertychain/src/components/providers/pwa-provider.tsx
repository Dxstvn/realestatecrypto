/**
 * PWA Provider - PropertyChain
 * 
 * Progressive Web App provider component
 * Following UpdatedUIPlan.md Step 58 specifications and CLAUDE.md principles
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useServiceWorker, usePWAInstall, useOnlineStatus, usePushNotifications } from '@/lib/pwa/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Download, RefreshCw, Bell } from 'lucide-react'

interface PWAContextType {
  isOnline: boolean
  isInstalled: boolean
  isInstallable: boolean
  updateAvailable: boolean
  notificationPermission: NotificationPermission
  installApp: () => Promise<boolean>
  skipWaiting: () => void
  requestNotificationPermission: () => Promise<boolean>
}

const PWAContext = createContext<PWAContextType | null>(null)

export function usePWA() {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWA must be used within PWAProvider')
  }
  return context
}

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const isOnline = useOnlineStatus()
  const { updateAvailable, skipWaiting } = useServiceWorker()
  const { isInstalled, isInstallable, install } = usePWAInstall()
  const { permission, requestPermission } = usePushNotifications()
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)

  // Show install prompt after delay if installable
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000) // Show after 30 seconds
      
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  // Show update prompt when available
  useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true)
    }
  }, [updateAvailable])

  // Show notification prompt after install
  useEffect(() => {
    if (isInstalled && permission === 'default') {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true)
      }, 60000) // Show after 1 minute
      
      return () => clearTimeout(timer)
    }
  }, [isInstalled, permission])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setShowInstallPrompt(false)
      // Show notification prompt after successful install
      setTimeout(() => {
        setShowNotificationPrompt(true)
      }, 5000)
    }
    return success
  }

  const handleUpdate = () => {
    skipWaiting()
    setShowUpdatePrompt(false)
  }

  const handleNotificationPermission = async () => {
    const granted = await requestPermission()
    if (granted) {
      setShowNotificationPrompt(false)
    }
    return granted
  }

  const value: PWAContextType = {
    isOnline,
    isInstalled,
    isInstallable,
    updateAvailable,
    notificationPermission: permission,
    installApp: handleInstall,
    skipWaiting: handleUpdate,
    requestNotificationPermission: handleNotificationPermission,
  }

  return (
    <PWAContext.Provider value={value}>
      {children}
      
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Install PropertyChain</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Install our app for a better experience with offline access and push notifications.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleInstall}>
                      Install Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowInstallPrompt(false)}
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top">
          <Card className="shadow-lg border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Update Available</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    A new version of PropertyChain is available. Update now for the latest features and improvements.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdate}>
                      Update Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowUpdatePrompt(false)}
                    >
                      Later
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Enable Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Get notified about new properties, price changes, and investment opportunities.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleNotificationPermission}>
                      Enable
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowNotificationPrompt(false)}
                    >
                      No Thanks
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotificationPrompt(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PWAContext.Provider>
  )
}

// PWA Install Button Component
export function PWAInstallButton() {
  const { isInstallable, isInstalled, installApp } = usePWA()
  
  if (isInstalled || !isInstallable) {
    return null
  }
  
  return (
    <Button onClick={installApp} size="sm" variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Install App
    </Button>
  )
}

// Online Status Indicator Component
export function OnlineStatusIndicator() {
  const { isOnline } = usePWA()
  
  if (isOnline) {
    return null
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1 text-sm z-50">
      You are currently offline. Some features may be limited.
    </div>
  )
}