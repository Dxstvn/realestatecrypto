/**
 * Error Pages Test Page - PropertyChain
 * 
 * Comprehensive test page for all error handling components
 * Testing Step 40 implementation from UpdatedUIPlan.md
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  MaintenancePage,
  OfflineIndicator,
  ConnectionError,
  ServerError,
  AccessDenied,
  useNetworkStatus,
  useErrorBoundary,
} from '@/components/custom/error-pages'
import {
  AlertTriangle,
  TestTube,
  Activity,
  Zap,
  Info,
  CheckCircle,
  Clock,
  Shield,
  WifiOff,
  Server,
  Home,
  RefreshCw,
  Bug,
  Globe,
  Settings,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Error simulation component
function ErrorSimulator({ 
  onError,
  title,
  description,
  icon: Icon,
  variant = 'outline'
}: {
  onError: () => void
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'outline' | 'destructive'
}) {
  return (
    <Card className="h-full hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          </div>
          <Button onClick={onError} variant={variant} size="sm" className="w-full">
            <Play className="h-3 w-3 mr-2" />
            Simulate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Component for demonstrating different error states
function ErrorStateDemo({
  title,
  children,
  reset,
}: {
  title: string
  children: React.ReactNode
  reset?: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {reset && (
            <Button onClick={reset} variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// Component that throws an error for testing error boundary
function ErrorThrowingComponent() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('This is a test error thrown by the ErrorThrowingComponent')
  }

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <p className="text-sm text-muted-foreground mb-3">
        This component will throw an error when the button is clicked, demonstrating the error boundary.
      </p>
      <Button onClick={() => setShouldThrow(true)} variant="destructive" size="sm">
        <Bug className="h-4 w-4 mr-2" />
        Throw Error
      </Button>
    </div>
  )
}

// Error boundary component for testing
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-900">Error Boundary Activated</h3>
          </div>
          <p className="text-sm text-red-700 mb-3">
            {this.state.error?.message || 'An error occurred'}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            size="sm"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function TestErrorPagesPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showMaintenance, setShowMaintenance] = useState(false)
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false)
  const [simulateConnectionError, setSimulateConnectionError] = useState(false)
  const { isOnline, connectionType } = useNetworkStatus()
  const { error, resetError, captureError } = useErrorBoundary()

  const errorTypes = [
    {
      id: 'not-found',
      title: '404 Not Found',
      description: 'Page or resource not found',
      icon: Globe,
      action: () => window.open('/non-existent-page', '_blank'),
    },
    {
      id: 'server-error',
      title: '500 Server Error',
      description: 'Internal server error',
      icon: Server,
      action: () => {
        // Simulate server error in component
        setActiveTab('server-error')
      },
    },
    {
      id: 'access-denied',
      title: '403 Access Denied',
      description: 'Unauthorized access attempt',
      icon: Shield,
      action: () => {
        setActiveTab('access-denied')
      },
    },
    {
      id: 'maintenance',
      title: 'Maintenance Mode',
      description: 'Scheduled maintenance page',
      icon: Wrench,
      action: () => setShowMaintenance(true),
    },
    {
      id: 'offline',
      title: 'Offline State',
      description: 'Network connection lost',
      icon: WifiOff,
      action: () => setShowOfflineIndicator(true),
    },
    {
      id: 'connection',
      title: 'Connection Error',
      description: 'Failed to connect to server',
      icon: RefreshCw,
      action: () => setSimulateConnectionError(true),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Offline Indicator (always present but only shows when needed) */}
      {showOfflineIndicator && <OfflineIndicator />}
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Error Pages Test
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive testing interface for all error handling components.
            Test error boundaries, maintenance pages, offline states, and more.
          </p>
        </div>

        {/* Network Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Network Status</p>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Connection Type</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {connectionType}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Error Components</p>
                  <p className="text-xs text-muted-foreground">
                    {errorTypes.length} Types
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Simulators */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Error Simulators
            </CardTitle>
            <CardDescription>
              Test different error states and behaviors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {errorTypes.map((errorType) => (
                <ErrorSimulator
                  key={errorType.id}
                  title={errorType.title}
                  description={errorType.description}
                  icon={errorType.icon}
                  onError={errorType.action}
                  variant={errorType.id === 'maintenance' ? 'default' : 'outline'}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="error-boundary">Error Boundary</TabsTrigger>
            <TabsTrigger value="server-error">Server Error</TabsTrigger>
            <TabsTrigger value="access-denied">Access Denied</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              <ErrorStateDemo title="404 Not Found Page">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The 404 page is automatically shown when a route is not found.
                      It includes an animated illustration, search functionality, and helpful navigation.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3">
                    <Button asChild variant="outline">
                      <a href="/non-existent-page" target="_blank">
                        <Eye className="h-4 w-4 mr-2" />
                        View 404 Page
                      </a>
                    </Button>
                    <Badge variant="outline">Custom Illustration</Badge>
                    <Badge variant="outline">Search Functionality</Badge>
                    <Badge variant="outline">Helpful Links</Badge>
                  </div>
                </div>
              </ErrorStateDemo>

              <ErrorStateDemo title="Global Error Handler">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The error.tsx file catches unhandled errors and provides a retry mechanism
                      with detailed error information in development mode.
                    </AlertDescription>
                  </Alert>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Retry Functionality</Badge>
                    <Badge variant="outline">Error Reporting</Badge>
                    <Badge variant="outline">Debug Info</Badge>
                    <Badge variant="outline">Recovery Options</Badge>
                  </div>
                </div>
              </ErrorStateDemo>

              <ErrorStateDemo title="Offline Detection">
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Automatic detection of network status with persistent banner and modal notifications.
                      Includes retry functionality and offline mode guidance.
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={showOfflineIndicator}
                        onCheckedChange={setShowOfflineIndicator}
                      />
                      <Label>Show Offline Indicator</Label>
                    </div>
                    <Badge variant="outline">Network Detection</Badge>
                    <Badge variant="outline">Auto Recovery</Badge>
                  </div>
                </div>
              </ErrorStateDemo>
            </div>
          </TabsContent>

          {/* Error Boundary Tab */}
          <TabsContent value="error-boundary" className="space-y-6">
            <ErrorStateDemo title="React Error Boundary Test" reset={resetError}>
              <div className="space-y-4">
                <Alert>
                  <Bug className="h-4 w-4" />
                  <AlertDescription>
                    This demonstrates how errors are caught by React error boundaries.
                    Click the button below to trigger an error and see the recovery mechanism.
                  </AlertDescription>
                </Alert>
                
                <TestErrorBoundary onError={captureError}>
                  <ErrorThrowingComponent />
                </TestErrorBoundary>
              </div>
            </ErrorStateDemo>
          </TabsContent>

          {/* Server Error Tab */}
          <TabsContent value="server-error" className="space-y-6">
            <ErrorStateDemo title="500 Internal Server Error">
              <ServerError />
            </ErrorStateDemo>
          </TabsContent>

          {/* Access Denied Tab */}
          <TabsContent value="access-denied" className="space-y-6">
            <ErrorStateDemo title="403 Forbidden Access">
              <AccessDenied />
            </ErrorStateDemo>
          </TabsContent>

          {/* Connection Tab */}
          <TabsContent value="connection" className="space-y-6">
            <ErrorStateDemo 
              title="Connection Error Demo"
              reset={() => setSimulateConnectionError(false)}
            >
              {simulateConnectionError ? (
                <ConnectionError 
                  onRetry={() => setSimulateConnectionError(false)}
                />
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Connection is working fine</p>
                  <Button onClick={() => setSimulateConnectionError(true)} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Simulate Connection Error
                  </Button>
                </div>
              )}
            </ErrorStateDemo>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showMaintenance}
                    onCheckedChange={setShowMaintenance}
                  />
                  <Label>Show Maintenance Page</Label>
                </div>
                <Badge variant="outline">Full Page Overlay</Badge>
                <Badge variant="outline">Progress Tracking</Badge>
                <Badge variant="outline">ETA Display</Badge>
              </div>
              
              {!showMaintenance && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Toggle the switch above to see the maintenance page
                    </p>
                    <Button onClick={() => setShowMaintenance(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Show Maintenance Page
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Technical Implementation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Error Pages</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-red-500" />
                    Custom 404 with animations
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-orange-500" />
                    Global error boundary
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-yellow-500" />
                    Maintenance page overlay
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500" />
                    Offline detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-purple-500" />
                    Network status monitoring
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Animated illustrations</li>
                  <li>• Retry mechanisms</li>
                  <li>• Error reporting</li>
                  <li>• Graceful degradation</li>
                  <li>• User-friendly messaging</li>
                  <li>• Recovery suggestions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Error Types</h4>
                <ul className="space-y-2 text-sm">
                  <li>• 404 Not Found</li>
                  <li>• 500 Server Error</li>
                  <li>• 403 Access Denied</li>
                  <li>• Connection Errors</li>
                  <li>• Offline States</li>
                  <li>• Maintenance Mode</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Error handling implementation: <strong>6 error types</strong> with comprehensive recovery options
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline">Custom Illustrations</Badge>
                <Badge variant="outline">Retry Logic</Badge>
                <Badge variant="outline">Network Detection</Badge>
                <Badge variant="outline">Error Boundaries</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Accessible</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Page Overlay */}
      {showMaintenance && (
        <div className="fixed inset-0 z-50 bg-white">
          <MaintenancePage 
            title="Scheduled Maintenance"
            message="We're currently upgrading our systems to serve you better. This should only take a few hours."
            estimatedTime="2 hours"
            showProgress={true}
            contactInfo={true}
          />
          <div className="absolute top-4 right-4">
            <Button 
              onClick={() => setShowMaintenance(false)} 
              variant="outline" 
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}