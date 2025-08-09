/**
 * Loading States Test Page - PropertyChain
 * 
 * Comprehensive test page for all loading state components
 * Testing Step 39 implementation from UpdatedUIPlan.md
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
  Spinner,
  WaveLoader,
  DotsLoader,
  ShimmerSkeleton,
  PulsingSkeleton,
  AnimatedProgress,
  LoadingButton,
  LoadingWrapper,
  PageLoader,
  PropertyCardSkeleton,
  KPICardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  FormSkeleton,
  InvestmentSkeleton,
  FileUploadSkeleton,
  SearchSkeleton,
  DashboardSuspense,
  PropertyListSuspense,
  FormSuspense,
  TableSuspense,
  useLoadingState,
  useProgressLoading,
} from '@/components/custom/loading'
import {
  Loader2,
  TestTube,
  Activity,
  Zap,
  Info,
  CheckCircle,
  Clock,
  BarChart3,
  Building,
  FileText,
  Search,
  Upload,
  Settings,
  TrendingUp,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Mock content components for demonstration
function MockContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/10 text-center">
      <p className="text-muted-foreground">{children}</p>
    </div>
  )
}

function MockPropertyCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-32 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold">Modern Downtown Loft</h3>
            <p className="text-sm text-muted-foreground">Portland, OR</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">$450,000</span>
            <Badge>Available</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MockKPICard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
            <p className="text-3xl font-bold">1,234</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-sm text-green-600 mt-2">+12% from last month</p>
      </CardContent>
    </Card>
  )
}

export default function TestLoadingPage() {
  const [activeTab, setActiveTab] = useState('basics')
  const [showPageLoader, setShowPageLoader] = useState(false)
  const [demoStates, setDemoStates] = useState({
    button: false,
    wrapper: false,
    form: false,
    table: false,
    search: false,
    upload: false,
  })

  // Loading state hooks
  const { loading: buttonLoading, startLoading: startButtonLoading } = useLoadingState(false, 3000)
  const { loading: wrapperLoading, startLoading: startWrapperLoading } = useLoadingState(false, 2000)
  
  const progressSteps = [
    'Initializing...',
    'Loading data...',
    'Processing...',
    'Finalizing...',
  ]
  const { 
    loading: progressLoading, 
    progress, 
    currentMessage, 
    startLoading: startProgressLoading 
  } = useProgressLoading(progressSteps, 1000)

  const toggleDemo = (key: keyof typeof demoStates) => {
    setDemoStates(prev => ({ ...prev, [key]: !prev[key] }))
    setTimeout(() => {
      setDemoStates(prev => ({ ...prev, [key]: false }))
    }, 3000)
  }

  const loaderTypes = [
    { name: 'Spinner', component: <Spinner />, description: 'Standard rotating loader' },
    { name: 'Spinner SM', component: <Spinner size="sm" />, description: 'Small spinner variant' },
    { name: 'Spinner LG', component: <Spinner size="lg" />, description: 'Large spinner variant' },
    { name: 'Wave', component: <WaveLoader />, description: 'Wave animation loader' },
    { name: 'Dots', component: <DotsLoader />, description: 'Pulsing dots loader' },
  ]

  const skeletonTypes = [
    { name: 'Basic', component: <ShimmerSkeleton className="h-4 w-48" />, description: 'Standard skeleton with shimmer' },
    { name: 'Pulsing', component: <PulsingSkeleton className="h-4 w-48" />, description: 'Breathing animation skeleton' },
    { name: 'Circle', component: <ShimmerSkeleton className="h-12 w-12 rounded-full" />, description: 'Circular skeleton' },
    { name: 'Button', component: <ShimmerSkeleton className="h-10 w-24 rounded-md" />, description: 'Button-shaped skeleton' },
    { name: 'Text Block', component: (
      <div className="space-y-2">
        <ShimmerSkeleton className="h-4 w-full" />
        <ShimmerSkeleton className="h-4 w-3/4" />
        <ShimmerSkeleton className="h-4 w-1/2" />
      </div>
    ), description: 'Multi-line text skeleton' },
  ]

  const progressTypes = [
    { name: 'Primary', color: 'primary' as const, value: 75 },
    { name: 'Success', color: 'success' as const, value: 90 },
    { name: 'Warning', color: 'warning' as const, value: 45 },
    { name: 'Danger', color: 'danger' as const, value: 25 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
              Loading States Test
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive testing interface for all loading state components.
            Test skeletons, spinners, progress indicators, and Suspense boundaries.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Layers className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Components</p>
              <p className="text-2xl font-bold">25+</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">Animations</p>
              <p className="text-2xl font-bold">8</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Suspense</p>
              <p className="text-2xl font-bold">5</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm font-medium">Progress</p>
              <p className="text-2xl font-bold">4</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TestTube className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm font-medium">Test Cases</p>
              <p className="text-2xl font-bold">50+</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Interactive Demos
            </CardTitle>
            <CardDescription>
              Test loading states with interactive controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <LoadingButton
                loading={buttonLoading}
                onClick={startButtonLoading}
                loadingText="Processing..."
              >
                Test Button Loading
              </LoadingButton>
              
              <Button onClick={startWrapperLoading} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Test Content Loading
              </Button>
              
              <Button onClick={startProgressLoading} variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Test Progress Loading
              </Button>
              
              <Button 
                onClick={() => setShowPageLoader(true)} 
                variant="outline"
              >
                <Activity className="h-4 w-4 mr-2" />
                Test Page Loader
              </Button>
            </div>

            {/* Progress Loading Demo */}
            {progressLoading && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-sm font-medium">{currentMessage}</span>
                  </div>
                  <AnimatedProgress 
                    value={progress} 
                    showLabel 
                    label="Overall Progress"
                    color="primary"
                  />
                </div>
              </div>
            )}

            {/* Content Loading Demo */}
            <div className="mt-6">
              <LoadingWrapper
                loading={wrapperLoading}
                skeleton={<PropertyCardSkeleton />}
                className="max-w-xs"
              >
                <MockPropertyCard />
              </LoadingWrapper>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="basics">Basic Loaders</TabsTrigger>
            <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="suspense">Suspense</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          {/* Basic Loaders Tab */}
          <TabsContent value="basics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Loading Animations</CardTitle>
                <CardDescription>
                  Essential loading indicators for different use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {loaderTypes.map((loader, index) => (
                    <div key={index} className="text-center space-y-3 p-4 border rounded-lg">
                      <div className="flex justify-center h-12 items-center">
                        {loader.component}
                      </div>
                      <div>
                        <h3 className="font-medium">{loader.name}</h3>
                        <p className="text-xs text-muted-foreground">{loader.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                These basic loaders can be used anywhere you need to indicate loading state.
                Each has different visual styles suitable for various contexts.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Skeletons Tab */}
          <TabsContent value="skeletons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skeleton Variations</CardTitle>
                <CardDescription>
                  Content placeholders with shimmer and pulse effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skeletonTypes.map((skeleton, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      <div className="h-16 flex items-center justify-center">
                        {skeleton.component}
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">{skeleton.name}</h3>
                        <p className="text-xs text-muted-foreground">{skeleton.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Animation Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Shimmer Effect</h4>
                    <ShimmerSkeleton className="h-4 w-full" />
                    <ShimmerSkeleton className="h-4 w-3/4" />
                    <ShimmerSkeleton className="h-4 w-1/2" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Pulse Effect</h4>
                    <PulsingSkeleton className="h-4 w-full" />
                    <PulsingSkeleton className="h-4 w-3/4" />
                    <PulsingSkeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Indicators</CardTitle>
                <CardDescription>
                  Animated progress bars with different colors and styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progressTypes.map((progress, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">{progress.name} Progress</h4>
                      <AnimatedProgress
                        value={progress.value}
                        color={progress.color}
                        showLabel
                        label={`${progress.name} Task`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Step Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">Step 1</div>
                    <div className="text-center">Step 2</div>
                    <div className="text-center">Step 3</div>
                    <div className="text-center">Step 4</div>
                  </div>
                  <AnimatedProgress value={75} showLabel label="Overall Progress" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 of 4 steps completed</span>
                    <span>75% complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Card Skeleton</CardTitle>
                </CardHeader>
                <CardContent>
                  <PropertyCardSkeleton />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>KPI Card Skeleton</CardTitle>
                </CardHeader>
                <CardContent>
                  <KPICardSkeleton />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chart Skeleton</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartSkeleton type="bar" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Skeleton</CardTitle>
                </CardHeader>
                <CardContent>
                  <InvestmentSkeleton />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Form Loading States</CardTitle>
              </CardHeader>
              <CardContent>
                <FormSkeleton />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Upload Loading</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploadSkeleton />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suspense Tab */}
          <TabsContent value="suspense" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suspense Boundaries</CardTitle>
                <CardDescription>
                  React Suspense components with custom fallbacks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Dashboard Suspense</h4>
                  <DashboardSuspense>
                    <MockContent>Dashboard content loaded!</MockContent>
                  </DashboardSuspense>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Property List Suspense</h4>
                  <PropertyListSuspense>
                    <MockContent>Property list loaded!</MockContent>
                  </PropertyListSuspense>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Form Suspense</h4>
                  <FormSuspense>
                    <MockContent>Form loaded!</MockContent>
                  </FormSuspense>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Table Suspense</h4>
                  <TableSuspense>
                    <MockContent>Table loaded!</MockContent>
                  </TableSuspense>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading Patterns</CardTitle>
                <CardDescription>
                  Common loading patterns and best practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Search Results Pattern</h4>
                  <SearchSkeleton />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Table Loading Pattern</h4>
                  <TableSkeleton rows={3} cols={5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Do's</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Use skeletons that match content shape
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Implement progressive loading
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Provide progress feedback
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Use Suspense boundaries
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Test on slow connections
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Don'ts</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-red-500" />
                        Show generic spinners everywhere
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-red-500" />
                        Block entire UI for partial loads
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-red-500" />
                        Ignore loading error states
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-red-500" />
                        Use excessive animations
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-red-500" />
                        Forget accessibility considerations
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Component Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500" />
                    shadcn/ui Skeleton integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Framer Motion animations
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-purple-500" />
                    Custom shimmer effects
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-yellow-500" />
                    Progress indicators
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-red-500" />
                    Suspense boundaries
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Use Cases</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Page-level loading states</li>
                  <li>• Component-specific skeletons</li>
                  <li>• Form submission feedback</li>
                  <li>• Data fetching indicators</li>
                  <li>• File upload progress</li>
                  <li>• Content streaming</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Performance</h4>
                <ul className="space-y-2 text-sm">
                  <li>• CSS animations for performance</li>
                  <li>• Minimal JavaScript overhead</li>
                  <li>• Responsive design support</li>
                  <li>• Accessibility compliant</li>
                  <li>• SEO-friendly skeletons</li>
                  <li>• Mobile optimized</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Loading components implementation: <strong>25+ components</strong> with comprehensive functionality
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline">Shimmer Effects</Badge>
                <Badge variant="outline">Pulse Animations</Badge>
                <Badge variant="outline">Progress Bars</Badge>
                <Badge variant="outline">Suspense Support</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Mobile First</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Loader Overlay */}
      {showPageLoader && (
        <PageLoader
          progress={75}
          message="Loading Application"
          subMessage="Please wait while we prepare your dashboard..."
        />
      )}

      {/* Auto-hide page loader */}
      {showPageLoader && setTimeout(() => setShowPageLoader(false), 3000)}
    </div>
  )
}