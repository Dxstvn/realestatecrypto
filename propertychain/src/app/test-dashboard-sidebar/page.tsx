/**
 * Dashboard Sidebar Test Page - PropertyChain
 * Tests dashboard sidebar component functionality
 */

'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar, DashboardLayout } from '@/components/layouts/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Monitor,
  Smartphone,
  Check,
  X
} from 'lucide-react'

export default function TestDashboardSidebarPage() {
  const [layoutType, setLayoutType] = useState<'standalone' | 'integrated'>('integrated')
  const [collapsible, setCollapsible] = useState(true)
  const [defaultCollapsed, setDefaultCollapsed] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      setIsMobile(width < 1024)
      
      const results: string[] = []
      
      // Check layout type
      if (width < 1024) {
        results.push('📱 Mobile layout active (Sheet drawer)')
      } else {
        results.push('🖥️ Desktop layout active (Fixed sidebar)')
      }
      
      // Check for sidebar element
      const sidebar = document.querySelector('aside')
      const sheet = document.querySelector('[role="dialog"]')
      
      if (sidebar && !isMobile) {
        results.push('✅ Desktop sidebar element found')
        
        // Check width
        const sidebarWidth = sidebar.getBoundingClientRect().width
        if (Math.abs(sidebarWidth - 240) < 5 || Math.abs(sidebarWidth - 64) < 5) {
          results.push(`✅ Sidebar width correct: ${Math.round(sidebarWidth)}px`)
        } else {
          results.push(`❌ Sidebar width incorrect: ${Math.round(sidebarWidth)}px`)
        }
        
        // Check for navigation items
        const navButtons = sidebar.querySelectorAll('button')
        if (navButtons.length > 0) {
          results.push(`✅ ${navButtons.length} navigation items found`)
        } else {
          results.push('❌ No navigation items found')
        }
        
        // Check for collapsible sections
        const collapsibles = sidebar.querySelectorAll('[data-state]')
        if (collapsibles.length > 0) {
          results.push(`✅ ${collapsibles.length} collapsible sections found`)
        }
        
        // Check for badges
        const badges = sidebar.querySelectorAll('[class*="badge"]')
        if (badges.length > 0) {
          results.push(`✅ ${badges.length} notification badges found`)
        }
      } else if (width < 1024) {
        results.push('✅ Mobile mode - sidebar hidden, trigger button should be visible')
        
        // Check for mobile trigger
        const trigger = document.querySelector('button[class*="fixed"]')
        if (trigger) {
          results.push('✅ Mobile menu trigger button found')
        } else {
          results.push('❌ Mobile menu trigger missing')
        }
      }
      
      // Check for smooth transitions
      const transitions = document.querySelectorAll('[class*="transition"]')
      if (transitions.length > 0) {
        results.push(`✅ ${transitions.length} elements with transitions`)
      }
      
      setTestResults(results)
    }
    
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [isMobile, layoutType, collapsible])

  // Mock dashboard content
  const mockDashboardContent = (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Sidebar Test</h1>
        <p className="text-muted-foreground">
          Testing the dashboard sidebar component with various configurations
        </p>
      </div>

      {/* Screen Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              <span className="font-mono">{screenWidth}px</span>
              <Badge variant={isMobile ? 'secondary' : 'default'}>
                {isMobile ? 'Mobile' : 'Desktop'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isMobile 
                ? 'Sheet drawer with hamburger menu trigger' 
                : `Fixed ${collapsible ? 'collapsible' : 'static'} 240px sidebar`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Component Tests</CardTitle>
          <CardDescription>Automated test results for current configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  result.startsWith('✅') && 'text-green-600',
                  result.startsWith('❌') && 'text-red-600',
                  result.startsWith('📱') && 'text-blue-600',
                  result.startsWith('🖥️') && 'text-purple-600'
                )}
              >
                {result}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mock KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,430</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.7%</div>
            <p className="text-xs text-muted-foreground">Annual average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Co-Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">In your properties</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Step 16 Features Implemented</CardTitle>
          <CardDescription>Dashboard sidebar component specifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold mb-2">Desktop Features</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>240px fixed width sidebar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Collapsible to 64px mini mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Nested navigation with accordions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Active state indicators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Notification badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Tooltip hints when collapsed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Smooth animations (200ms)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>User profile section</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold mb-2">Mobile Features</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Sheet drawer from left</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Hamburger menu trigger</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Full-height navigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Touch-friendly targets (44px)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Auto-close on navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Backdrop overlay</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Scrollable content area</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>280px drawer width</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-2">Navigation Structure</h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <p className="font-medium mb-1">Main Navigation:</p>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                  <li>Dashboard</li>
                  <li>My Properties (badge)</li>
                  <li>Portfolio (expandable)</li>
                  <li>Investments (expandable)</li>
                  <li>Analytics</li>
                  <li>Documents</li>
                  <li>Wallet</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Settings & Utils:</p>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                  <li>Notifications (badge)</li>
                  <li>Messages (badge)</li>
                  <li>Account Settings</li>
                  <li>Security</li>
                  <li>Help & Support</li>
                  <li>User Profile</li>
                  <li>Sign Out</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Controls for testing
  const controls = (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Layout Type</Label>
            <RadioGroup value={layoutType} onValueChange={(v) => setLayoutType(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="integrated" id="integrated" />
                <Label htmlFor="integrated" className="text-sm">Integrated Layout</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standalone" id="standalone" />
                <Label htmlFor="standalone" className="text-sm">Standalone Sidebar</Label>
              </div>
            </RadioGroup>
          </div>

          {!isMobile && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="collapsible"
                  checked={collapsible}
                  onCheckedChange={setCollapsible}
                />
                <Label htmlFor="collapsible" className="text-sm">Collapsible</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="collapsed"
                  checked={defaultCollapsed}
                  onCheckedChange={setDefaultCollapsed}
                />
                <Label htmlFor="collapsed" className="text-sm">Start Collapsed</Label>
              </div>
            </>
          )}

          <div className="text-xs text-muted-foreground">
            Resize window to test responsive behavior
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (layoutType === 'integrated') {
    return (
      <>
        <DashboardLayout
          sidebarProps={{
            collapsible,
            defaultCollapsed,
          }}
        >
          {mockDashboardContent}
        </DashboardLayout>
        {controls}
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <DashboardSidebar
        collapsible={collapsible}
        defaultCollapsed={defaultCollapsed}
      />
      <div className="lg:ml-[240px]">
        {mockDashboardContent}
      </div>
      {controls}
    </div>
  )
}

// Import cn utility
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}