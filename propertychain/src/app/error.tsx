/**
 * Global Error Page - PropertyChain
 * 
 * Error boundary with:
 * - Retry functionality
 * - Error reporting
 * - Graceful fallback UI
 * - Debug information (dev mode)
 * 
 * Following UpdatedUIPlan.md Step 40 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Clock,
  Shield,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  Activity,
  FileText,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Error animation component
function ErrorAnimation() {
  return (
    <div className="relative w-full h-32 mb-6 flex items-center justify-center">
      {/* Animated error icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="relative z-10"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
      </motion.div>

      {/* Ripple effect */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 border-2 border-red-200 rounded-full"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2 + i, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Floating elements */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-300 rounded-full"
          style={{
            left: `${30 + (i * 15)}%`,
            top: `${20 + (i % 2) * 60}%`,
          }}
          animate={{
            y: [-5, -15, -5],
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
  )
}

// Error details component
function ErrorDetails({ 
  error, 
  digest 
}: { 
  error: Error & { digest?: string }
  digest?: string 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const errorInfo = {
    message: error.message || 'An unexpected error occurred',
    name: error.name || 'Error',
    digest: digest || error.digest || 'N/A',
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
    url: typeof window !== 'undefined' ? window.location.href : 'N/A',
  }

  const copyErrorInfo = async () => {
    const info = `
Error Report - PropertyChain
===========================
Message: ${errorInfo.message}
Type: ${errorInfo.name}
Digest: ${errorInfo.digest}
Time: ${errorInfo.timestamp}
URL: ${errorInfo.url}
User Agent: ${errorInfo.userAgent}
Stack: ${error.stack || 'Not available'}
    `.trim()

    try {
      await navigator.clipboard.writeText(info)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy error info:', err)
    }
  }

  // Only show detailed error info in development
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Bug className="h-5 w-5" />
          Error Details
        </CardTitle>
        <CardDescription>
          Information about what went wrong
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Error Type:</span>
            <p className="text-gray-900">{errorInfo.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Time:</span>
            <p className="text-gray-900">{new Date(errorInfo.timestamp).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-600">Message:</span>
            <p className="text-gray-900 font-mono text-sm bg-white p-2 rounded border">
              {errorInfo.message}
            </p>
          </div>
          {isDev && (
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Error ID:</span>
              <p className="text-gray-900 font-mono text-xs">{errorInfo.digest}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={copyErrorInfo} variant="outline" size="sm">
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Error Info'}
          </Button>
        </div>

        {isDev && error.stack && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                Stack Trace (Development)
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-40">
                {error.stack}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}

// Main error page component
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error)
    }

    // In production, you might want to send error to a logging service
    // reportError(error)
  }, [error])

  const handleRetry = async () => {
    setIsRetrying(true)
    setRetryCount(prev => prev + 1)

    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      reset()
    } catch (retryError) {
      console.error('Retry failed:', retryError)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleReportError = () => {
    // In a real app, this would submit to an error reporting service
    window.open('mailto:support@propertychain.com?subject=Error Report&body=' + 
      encodeURIComponent(`Error: ${error.message}\nPage: ${window.location.href}`))
  }

  const reloadPage = () => {
    window.location.reload()
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main error content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <ErrorAnimation />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, we're working to fix it.
          </p>

          {retryCount > 0 && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Retry attempt {retryCount} {retryCount > 2 ? '(Multiple retries detected - there may be a persistent issue)' : ''}
              </AlertDescription>
            </Alert>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            size="lg"
            className="min-w-[140px]"
          >
            {isRetrying ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
          
          <Button 
            onClick={reloadPage} 
            variant="outline" 
            size="lg"
          >
            <Activity className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline" 
            size="lg"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </motion.div>

        {/* Error details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-6"
        >
          <ErrorDetails error={error} />
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="space-y-4"
        >
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">What can you do?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Quick fixes:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Refresh the page</li>
                    <li>• Check your internet connection</li>
                    <li>• Clear your browser cache</li>
                    <li>• Try again in a few minutes</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Need help?</h4>
                  <div className="space-y-2">
                    <Button onClick={handleReportError} variant="ghost" size="sm" className="justify-start w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Report this error
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="justify-start w-full">
                      <a href="/help">
                        <FileText className="h-4 w-4 mr-2" />
                        Visit Help Center
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="justify-start w-full">
                      <a href="/contact">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Support
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status indicator */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Platform Status: <Badge variant="outline" className="text-green-600 border-green-200">Operational</Badge>
            </p>
            <p className="text-xs text-gray-400">
              If you continue experiencing issues, check our{' '}
              <a href="/status" className="underline hover:text-gray-600">
                status page
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}