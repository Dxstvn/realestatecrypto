/**
 * Navigation Demo Page - PropertyLend
 * Phase 5.0: Demonstrates navigation switching based on auth state
 */

'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LandingHeader } from '@/components/layouts/landing-header'
import { AppHeader } from '@/components/layouts/app-header'
import { 
  Navigation, 
  Users, 
  Shield, 
  ArrowRight, 
  ChevronRight,
  BookOpen,
  TrendingUp,
  Vote,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function NavigationDemoPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [selectedNav, setSelectedNav] = useState<'landing' | 'app'>('landing')

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    walletAddress: '0x742d...b48e',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Demo Header - Conditionally render based on selection */}
      <div className="relative">
        {selectedNav === 'landing' ? (
          <LandingHeader />
        ) : (
          <AppHeader user={showAuth ? mockUser : undefined} />
        )}
      </div>

      {/* Main Content */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-400 bg-purple-500/10">
              <Navigation className="w-3 h-3 mr-1" />
              Phase 5.0: Navigation System
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Context-Aware Navigation
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Different navigation structures for landing pages and authenticated app experiences
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Switcher */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Mode Selector</CardTitle>
              <CardDescription>
                Switch between different navigation modes to see how the header adapts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={selectedNav === 'landing' ? 'default' : 'outline'}
                  onClick={() => setSelectedNav('landing')}
                  className="flex-1"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Landing Navigation
                </Button>
                <Button
                  variant={selectedNav === 'app' ? 'default' : 'outline'}
                  onClick={() => setSelectedNav('app')}
                  className="flex-1"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  App Navigation
                </Button>
              </div>
              
              {selectedNav === 'app' && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Simulate authenticated user
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAuth(!showAuth)}
                    >
                      {showAuth ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Authenticated
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Not Authenticated
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Comparison */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Navigation Structure Comparison
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Landing Navigation */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <CardTitle>Landing Page Navigation</CardTitle>
                </div>
                <CardDescription>
                  Focused on education and conversion for new users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                      Key Features:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Educational content focus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Clear value propositions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Product overview sections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Prominent CTAs for sign-up</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                      Navigation Items:
                    </h4>
                    <div className="space-y-1">
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">How It Works</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          For Lenders, For Borrowers, Security
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">Products</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Senior Tranches, Junior Tranches, All Pools
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">About</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Company, FAQ, Contact
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">Resources</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Documentation, Blog, Whitepaper
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App Navigation */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <CardTitle>App Navigation</CardTitle>
                </div>
                <CardDescription>
                  Functional navigation for authenticated users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                      Key Features:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span>Quick access to core features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span>Live statistics display</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span>User profile & settings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-500 mt-0.5" />
                        <span>Wallet connection status</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                      Navigation Items:
                    </h4>
                    <div className="space-y-1">
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">Pools</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          All Pools, Senior, Junior
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">Portfolio</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          View and manage investments
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">Earn</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Yield opportunities
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">Staking</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Stake tokens for rewards
                        </p>
                      </div>
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium text-sm">DAO</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Governance participation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Implementation Guide
          </h2>
          
          <Tabs defaultValue="usage" className="space-y-8">
            <TabsList>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="conditional">Conditional Rendering</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{`// Landing page header (for non-authenticated users)
import { LandingHeader } from '@/components/layouts/landing-header'

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      {/* Page content */}
    </>
  )
}

// App header (for authenticated users)
import { AppHeader } from '@/components/layouts/app-header'

export default function Dashboard() {
  const user = { name: 'John Doe', email: 'john@example.com' }
  
  return (
    <>
      <AppHeader user={user} />
      {/* Dashboard content */}
    </>
  )
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conditional" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conditional Rendering Based on Auth</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{`// Automatic header switching based on authentication
import { useSession } from 'next-auth/react'
import { LandingHeader } from '@/components/layouts/landing-header'
import { AppHeader } from '@/components/layouts/app-header'

export default function Layout({ children }) {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <LoadingHeader />
  }
  
  return (
    <>
      {session ? (
        <AppHeader user={session.user} />
      ) : (
        <LandingHeader />
      )}
      {children}
    </>
  )
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customization Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                        Landing Header Props:
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• className: Additional CSS classes</li>
                        <li>• Fixed position with scroll effects</li>
                        <li>• Mobile-responsive navigation</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                        App Header Props:
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• user: User object with name, email, avatar</li>
                        <li>• className: Additional CSS classes</li>
                        <li>• Live stats display (APY, TVL)</li>
                        <li>• Notification badge</li>
                        <li>• Wallet connection status</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}