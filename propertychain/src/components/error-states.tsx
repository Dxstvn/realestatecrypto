/**
 * Error States Components - PropertyChain
 * 
 * Various error state components for different scenarios
 * Following RECOVERY_PLAN.md Phase 4 - Implement error boundaries
 */

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  WifiOff,
  ServerCrash,
  ShieldAlert,
  FileQuestion,
  Lock,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Generic Error Component
interface ErrorStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  onRetry?: () => void
  onGoBack?: () => void
  onGoHome?: () => void
  showDetails?: boolean
  error?: Error | string
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  icon = <AlertTriangle className="h-12 w-12" />,
  onRetry,
  onGoBack,
  onGoHome,
  showDetails = process.env.NODE_ENV === 'development',
  error,
  className,
}: ErrorStateProps) {
  const router = useRouter()
  
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.back()
    }
  }
  
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      router.push('/')
    }
  }
  
  return (
    <div className={cn('flex items-center justify-center min-h-[400px] p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-destructive/70">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showDetails && error && (
            <Alert variant="destructive" className="text-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2 font-mono text-xs">
                {typeof error === 'string' ? error : error.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="flex-1">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 404 Not Found
export function NotFoundError({
  title = 'Page Not Found',
  description = "The page you're looking for doesn't exist or has been moved.",
}: {
  title?: string
  description?: string
}) {
  return (
    <ErrorState
      title={title}
      description={description}
      icon={<FileQuestion className="h-12 w-12" />}
    />
  )
}

// 403 Forbidden
export function ForbiddenError({
  onLogin,
}: {
  onLogin?: () => void
}) {
  const router = useRouter()
  
  const handleLogin = () => {
    if (onLogin) {
      onLogin()
    } else {
      router.push('/login')
    }
  }
  
  return (
    <ErrorState
      title="Access Denied"
      description="You don't have permission to access this resource."
      icon={<Lock className="h-12 w-12" />}
      onRetry={handleLogin}
    />
  )
}

// 401 Unauthorized
export function UnauthorizedError() {
  const router = useRouter()
  
  return (
    <ErrorState
      title="Authentication Required"
      description="Please log in to access this page."
      icon={<ShieldAlert className="h-12 w-12" />}
      onRetry={() => router.push('/login')}
    />
  )
}

// Network Error
export function NetworkError({
  onRetry,
}: {
  onRetry?: () => void
}) {
  return (
    <ErrorState
      title="Connection Error"
      description="Unable to connect to our servers. Please check your internet connection."
      icon={<WifiOff className="h-12 w-12" />}
      onRetry={onRetry}
    />
  )
}

// Server Error
export function ServerError({
  onRetry,
}: {
  onRetry?: () => void
}) {
  return (
    <ErrorState
      title="Server Error"
      description="Our servers are experiencing issues. Please try again later."
      icon={<ServerCrash className="h-12 w-12" />}
      onRetry={onRetry}
    />
  )
}

// Empty State
export function EmptyState({
  title = 'No Results Found',
  description = 'Try adjusting your filters or search criteria.',
  icon,
  action,
  actionLabel = 'Clear Filters',
  className,
}: {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: () => void
  actionLabel?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && (
        <Button onClick={action} variant="outline" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Inline Error
export function InlineError({
  message,
  onDismiss,
  className,
}: {
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <Alert variant="destructive" className={cn('relative', className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <XCircle className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </Alert>
  )
}

// Form Error
export function FormError({
  errors,
  className,
}: {
  errors: string[] | Record<string, string | string[]>
  className?: string
}) {
  const errorList = React.useMemo(() => {
    if (Array.isArray(errors)) {
      return errors
    }
    
    const list: string[] = []
    Object.values(errors).forEach(error => {
      if (Array.isArray(error)) {
        list.push(...error)
      } else if (error) {
        list.push(error)
      }
    })
    return list
  }, [errors])
  
  if (errorList.length === 0) return null
  
  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Please fix the following errors:</AlertTitle>
      <AlertDescription className="mt-2">
        <ul className="list-disc list-inside space-y-1">
          {errorList.map((error, index) => (
            <li key={index} className="text-sm">
              {error}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

// API Error Handler
export function handleApiError(error: any): {
  title: string
  description: string
  type: 'network' | 'server' | 'client' | 'unknown'
} {
  // Network error
  if (!navigator.onLine || error.message === 'Network Error') {
    return {
      title: 'Connection Error',
      description: 'Please check your internet connection and try again.',
      type: 'network',
    }
  }
  
  // Server error (5xx)
  if (error.response?.status >= 500) {
    return {
      title: 'Server Error',
      description: 'Our servers are experiencing issues. Please try again later.',
      type: 'server',
    }
  }
  
  // Client error (4xx)
  if (error.response?.status >= 400) {
    const status = error.response.status
    
    if (status === 401) {
      return {
        title: 'Authentication Required',
        description: 'Please log in to continue.',
        type: 'client',
      }
    }
    
    if (status === 403) {
      return {
        title: 'Access Denied',
        description: "You don't have permission to perform this action.",
        type: 'client',
      }
    }
    
    if (status === 404) {
      return {
        title: 'Not Found',
        description: 'The requested resource could not be found.',
        type: 'client',
      }
    }
    
    return {
      title: 'Request Error',
      description: error.response?.data?.message || 'There was an error processing your request.',
      type: 'client',
    }
  }
  
  // Unknown error
  return {
    title: 'Unexpected Error',
    description: error.message || 'An unexpected error occurred. Please try again.',
    type: 'unknown',
  }
}