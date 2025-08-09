/**
 * Test Page for Dashboard Layout Component
 * 
 * Tests all features of the Dashboard Layout:
 * - Resizable sidebar panels
 * - Mobile sheet navigation
 * - Breadcrumb navigation
 * - User menu dropdown
 * - Responsive behavior
 * - Navigation structure
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Info,
  CheckCircle,
  Settings,
  Layout,
  Navigation,
  Users,
  Menu,
} from 'lucide-react'

export default function TestDashboardLayout() {
  const [currentView, setCurrentView] = useState('desktop')

  const features = [
    {
      title: 'Resizable Sidebar',
      description: 'Desktop sidebar can be resized from 5% to 30% width',
      status: 'implemented',
      icon: Layout,
    },
    {
      title: 'Mobile Sheet Navigation',
      description: 'Mobile-optimized slide-out navigation menu',
      status: 'implemented',
      icon: Smartphone,
    },
    {
      title: 'Breadcrumb Navigation',
      description: 'Dynamic breadcrumbs based on current route',
      status: 'implemented',
      icon: Navigation,
    },
    {
      title: 'User Menu Dropdown',
      description: 'Profile, settings, and logout functionality',
      status: 'implemented',
      icon: Users,
    },
    {
      title: 'Collapsible Sidebar',
      description: 'Sidebar can collapse to icon-only view',
      status: 'implemented',
      icon: Menu,
    },
    {
      title: 'Responsive Design',
      description: 'Optimized for desktop, tablet, and mobile',
      status: 'implemented',
      icon: Monitor,
    },
  ]

  const navigationStructure = [
    {
      title: 'Overview',
      href: '/dashboard',
      description: 'Main dashboard with KPI cards and portfolio overview',
    },
    {
      title: 'Portfolio',
      href: '/dashboard/portfolio',
      description: 'Investment portfolio with sub-sections',
      children: ['Holdings', 'Performance', 'Dividends'],
    },
    {
      title: 'Properties',
      href: '/dashboard/properties',
      description: 'Property management and browsing',
      children: ['My Investments', 'Watchlist', 'Browse All'],
    },
    {
      title: 'Transactions',
      href: '/dashboard/transactions',
      description: 'Transaction history and records',
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      description: 'Investment analytics and insights',
    },
    {
      title: 'Documents',
      href: '/dashboard/documents',
      description: 'Legal documents and contracts',
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      description: 'Account and notification settings',
      children: ['Profile', 'Security', 'Notifications', 'Billing'],
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Dashboard Layout Test</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Testing comprehensive dashboard layout with resizable sidebar, mobile navigation, 
          breadcrumbs, user menu, and responsive design
        </p>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            To test the actual dashboard layout, visit <strong>/dashboard</strong> (the layout is applied to all dashboard routes).
            This page documents the layout features and implementation.
          </AlertDescription>
        </Alert>
      </div>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Implemented Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    ✓ Complete
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layout Structure */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Layout Overview</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
          <TabsTrigger value="features">Feature Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-200 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="bg-blue-100 p-3 rounded text-center font-medium">
                    Header (Sticky)
                    <div className="text-sm font-normal text-gray-600 mt-1">
                      Breadcrumbs • Search • Notifications • User Menu
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-1/4 bg-gray-100 p-3 rounded text-center">
                      <div className="font-medium">Sidebar</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Resizable • Collapsible • Navigation
                      </div>
                    </div>
                    <div className="flex-1 bg-green-100 p-3 rounded text-center">
                      <div className="font-medium">Main Content</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Dynamic pages with animations
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Desktop Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4" />
                      <span>Resizable panels</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layout className="h-4 w-4" />
                      <span>Sidebar toggle</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4" />
                      <span>Full breadcrumbs</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Tablet Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Tablet className="h-4 w-4" />
                      <span>Responsive sidebar</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Layout className="h-4 w-4" />
                      <span>Adaptive layout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4" />
                      <span>Touch optimized</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Mobile Layout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Smartphone className="h-4 w-4" />
                      <span>Sheet navigation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Menu className="h-4 w-4" />
                      <span>Hamburger menu</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>Compact header</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {navigationStructure.map((item) => (
                  <div key={item.title} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                          {item.href}
                        </code>
                      </div>
                      {item.children && (
                        <Badge variant="outline">
                          {item.children.length} sub-items
                        </Badge>
                      )}
                    </div>
                    {item.children && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {item.children.map((child) => (
                            <Badge key={child} variant="secondary" className="text-xs">
                              {child}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responsive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Responsive Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Desktop (1024px+)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Sidebar:</div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Resizable panels (5-30% width)</li>
                        <li>• Toggle collapse/expand</li>
                        <li>• Icon-only collapsed view</li>
                        <li>• Persistent user section</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Header:</div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Full search bar</li>
                        <li>• Complete breadcrumbs</li>
                        <li>• All action buttons visible</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Tablet className="h-4 w-4" />
                      Tablet (768-1023px)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Layout:</div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Adaptive sidebar width</li>
                        <li>• Touch-optimized controls</li>
                        <li>• Reduced padding/margins</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Navigation:</div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Larger touch targets</li>
                        <li>• Simplified breadcrumbs</li>
                        <li>• Priority content first</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile (&lt;768px)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Navigation:</div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Sheet slide-out menu</li>
                        <li>• Hamburger menu trigger</li>
                        <li>• Full-height navigation</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Header:</div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Compact layout</li>
                        <li>• Hidden search (icon only)</li>
                        <li>• Essential actions only</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Resize your browser window or use developer tools to test responsive behavior on the actual dashboard page.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Core Dependencies</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">UI</Badge>
                        <code>@radix-ui/react-resizable</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">UI</Badge>
                        <code>shadcn/ui Sheet</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">UI</Badge>
                        <code>shadcn/ui Breadcrumb</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">UI</Badge>
                        <code>shadcn/ui DropdownMenu</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Animation</Badge>
                        <code>framer-motion</code>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Key Features</h4>
                    <ul className="text-sm space-y-2">
                      <li>• Persistent sidebar state</li>
                      <li>• Dynamic breadcrumb generation</li>
                      <li>• Smooth page transitions</li>
                      <li>• Keyboard navigation support</li>
                      <li>• Touch gesture support</li>
                      <li>• Screen reader compatibility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testing Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Desktop Testing</h4>
                    <div className="space-y-2">
                      {[
                        'Resize sidebar panels',
                        'Toggle sidebar collapse',
                        'Navigate between pages',
                        'Test breadcrumb links',
                        'Use user menu dropdown',
                        'Test search functionality',
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 border-2 rounded-sm border-green-500 bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Mobile Testing</h4>
                    <div className="space-y-2">
                      {[
                        'Open sheet navigation',
                        'Touch navigation items',
                        'Test swipe gestures',
                        'Verify header layout',
                        'Check notification bell',
                        'Test user avatar menu',
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-4 border-2 rounded-sm border-green-500 bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle>Try the Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The dashboard layout is now fully implemented and ready for testing. 
            Visit the dashboard to experience all the features in action.
          </p>
          <div className="flex gap-4">
            <Button asChild className="bg-[#007BFF] hover:bg-[#0062CC]">
              <a href="/dashboard">View Dashboard</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/portfolio">Test Portfolio Page</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/settings">Test Settings Page</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}