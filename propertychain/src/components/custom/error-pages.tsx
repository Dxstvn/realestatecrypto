/**
 * Error Pages Components - PropertyChain
 * 
 * Comprehensive error handling components:
 * - Maintenance page
 * - Offline indicator
 * - Connection error
 * - Server error
 * - Access denied
 * 
 * Following UpdatedUIPlan.md Step 40 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Wrench,
  Wifi,
  WifiOff,
  Server,
  Shield,
  Clock,
  RefreshCw,
  Home,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Activity,
  Globe,
  Zap,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Maintenance Page Component
 */
export function MaintenancePage({
  title = 'Under Maintenance',
  message = 'We are currently performing scheduled maintenance to improve your experience.',
  estimatedTime = '2 hours',
  showProgress = true,
  contactInfo = true,
}: {
  title?: string
  message?: string
  estimatedTime?: string
  showProgress?: boolean
  contactInfo?: boolean
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!showProgress) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + Math.random() * 10
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [showProgress])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Animated maintenance icon */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Wrench className="h-24 w-24 text-orange-400" />
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-300 rounded-full"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">{message}</p>
          </motion.div>
        </div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Maintenance Status</span>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  In Progress
                </Badge>
              </div>

              {showProgress && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Estimated completion</span>
                    <span>{estimatedTime}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 text-center">
                    Progress is estimated and may vary
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">Started</p>
                  <p className="text-gray-600">2:00 AM PST</p>
                </div>
                <div className="text-center">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium">Status</p>
                  <p className="text-gray-600">Upgrading Systems</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="font-medium">Expected</p>
                  <p className="text-gray-600">4:00 AM PST</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What's being updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <Card className="bg-blue-50/50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">What we're improving</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Database optimization for faster property searches
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  Enhanced security features
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Improved mobile experience
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  New investment dashboard features
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact information */}
        {contactInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Need immediate assistance?</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button asChild variant="outline" size="sm">
                    <a href="tel:+1-555-0123">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="mailto:support@propertychain.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/status">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Status Page
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/**
 * Offline Indicator Component
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineModal, setShowOfflineModal] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      if (!online) {
        setShowOfflineModal(true)
      }
    }

    // Set initial state
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const retryConnection = () => {
    // Force a network check
    if (navigator.onLine) {
      setIsOnline(true)
      setShowOfflineModal(false)
      window.location.reload()
    }
  }

  return (
    <>
      {/* Persistent offline banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You're offline. Some features may not work.
                </span>
              </div>
              <Button
                onClick={retryConnection}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-red-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline modal */}
      <AnimatePresence>
        {showOfflineModal && !isOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOfflineModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <WifiOff className="h-8 w-8 text-red-500" />
                  </div>
                  <CardTitle>You're Offline</CardTitle>
                  <CardDescription>
                    Check your internet connection and try again
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Some features may not work while offline. Previously loaded content may still be available.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={retryConnection} className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => setShowOfflineModal(false)} 
                      variant="outline"
                      className="flex-1"
                    >
                      Continue Offline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * Connection Error Component
 */
export function ConnectionError({
  onRetry,
  showRetryButton = true,
}: {
  onRetry?: () => void
  showRetryButton?: boolean
}) {
  const [retryCount, setRetryCount] = useState(0)

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    onRetry?.()
  }

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <Globe className="h-8 w-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-red-900 mb-2">Connection Error</h3>
        <p className="text-red-700 mb-4">
          Unable to connect to PropertyChain servers. Please check your internet connection.
        </p>

        {retryCount > 0 && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Retry attempt {retryCount}. If the problem persists, please contact support.
            </AlertDescription>
          </Alert>
        )}

        {showRetryButton && (
          <div className="space-y-2">
            <Button onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <p className="text-xs text-red-600">
              If the problem continues, try refreshing the page
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Server Error Component
 */
export function ServerError({
  errorCode = '500',
  title = 'Internal Server Error',
  message = 'Something went wrong on our servers. Our team has been notified.',
}: {
  errorCode?: string
  title?: string
  message?: string
}) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <Server className="h-12 w-12 text-red-500" />
      </div>
      
      <div className="text-6xl font-bold text-gray-300 mb-4">{errorCode}</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload Page
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">
            <Mail className="h-4 w-4 mr-2" />
            Report Issue
          </Link>
        </Button>
      </div>
    </div>
  )
}

/**
 * Access Denied Component
 */
export function AccessDenied({
  title = 'Access Denied',
  message = 'You do not have permission to access this resource.',
  showLoginButton = true,
}: {
  title?: string
  message?: string
  showLoginButton?: boolean
}) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
        <Shield className="h-12 w-12 text-yellow-500" />
      </div>
      
      <div className="text-6xl font-bold text-gray-300 mb-4">403</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        {showLoginButton && (
          <Button asChild>
            <Link href="/login">
              <Shield className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  )
}

/**
 * Network Status Hook
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    const updateConnectionType = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setConnectionType(connection.effectiveType || 'unknown')
      }
    }

    // Set initial state
    updateOnlineStatus()
    updateConnectionType()

    // Listen for changes
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateConnectionType)
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateConnectionType)
      }
    }
  }, [])

  return { isOnline, connectionType }
}

/**
 * Error Boundary Hook
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null)

  const resetError = () => {
    setError(null)
  }

  const captureError = (error: Error) => {
    setError(error)
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // reportError(error)
    }
  }

  return { error, resetError, captureError }
}

// All components are already exported individually above