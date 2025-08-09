/**
 * Mobile Optimizations Test Page - PropertyChain
 * 
 * Tests all mobile-specific components and features
 * Following CLAUDE.md mobile-first design principles
 */

'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  BottomTabBar,
  PullToRefresh,
  SwipeableCard,
  TouchRipple,
  AppInstallPrompt,
  MobileDrawer,
  FloatingActionButton,
  MobilePropertyCard,
  MobileFilterBar,
  OfflineIndicator,
} from '@/components/mobile/mobile-specific'
import {
  LazyComponent,
  LazyImage,
  VirtualList,
  InfiniteScroll,
  ProgressiveEnhancement,
} from '@/components/performance/lazy-loading'
import { 
  Home, 
  Search, 
  Heart, 
  MessageSquare, 
  User,
  Plus,
  Filter,
  ChevronRight,
  Download,
  Share2,
  Bell,
  Settings,
  LogOut,
  Zap,
  Smartphone,
  Wifi,
  Battery,
  Signal,
} from 'lucide-react'

// ============================================================================
// Test Data
// ============================================================================

const testProperties = [
  {
    id: '1',
    title: 'Luxury Downtown Condo',
    address: '123 Main St, New York, NY',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    beds: 2,
    baths: 2,
    sqft: 1200,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Modern Beach House',
    address: '456 Ocean Dr, Miami, FL',
    price: 1250000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    beds: 4,
    baths: 3,
    sqft: 2800,
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Mountain Retreat',
    address: '789 Pine Rd, Aspen, CO',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
    beds: 5,
    baths: 4,
    sqft: 3500,
    isFavorite: false,
  },
]

const generateListItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Property #${i + 1}`,
    price: Math.floor(Math.random() * 1000000) + 200000,
    location: `Location ${i + 1}`,
  }))
}

// ============================================================================
// Test Page Component
// ============================================================================

export default function TestMobileOptimizationsPage() {
  const [activeTab, setActiveTab] = React.useState('home')
  const [activeView, setActiveView] = React.useState<'grid' | 'list' | 'map'>('grid')
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [items, setItems] = React.useState(generateListItems(20))
  const [hasMore, setHasMore] = React.useState(true)
  const [swipeCount, setSwipeCount] = React.useState({ left: 0, right: 0, up: 0, down: 0 })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setItems(generateListItems(20))
    toast.success('Content refreshed!')
    setIsRefreshing(false)
  }

  const handleLoadMore = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newItems = generateListItems(10)
    setItems(prev => [...prev, ...newItems])
    
    if (items.length >= 50) {
      setHasMore(false)
    }
  }

  const handleSwipe = (direction: string) => {
    setSwipeCount(prev => ({
      ...prev,
      [direction]: prev[direction as keyof typeof prev] + 1,
    }))
    toast.info(`Swiped ${direction}!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Mobile Optimizations Test</h1>
          <p className="text-sm text-muted-foreground">Testing mobile-specific components</p>
        </div>
      </div>

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Main Content */}
      <div className="pb-20">
        <Tabs defaultValue="navigation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2">
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="gestures">Gestures</TabsTrigger>
            <TabsTrigger value="touch">Touch</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="pwa">PWA</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          {/* Tab 1: Navigation */}
          <TabsContent value="navigation" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Bottom Tab Bar</CardTitle>
                <CardDescription>Mobile navigation with tab bar</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Current tab: <span className="font-semibold">{activeTab}</span>
                </p>
                <div className="text-xs text-muted-foreground">
                  The bottom tab bar is visible at the bottom of the screen on mobile devices.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Drawer</CardTitle>
                <CardDescription>Sheet drawer for mobile menus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MobileDrawer
                  trigger={<Button>Open Bottom Drawer</Button>}
                  side="bottom"
                >
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Mobile Menu</h3>
                    <div className="space-y-2">
                      {['Profile', 'Settings', 'Notifications', 'Help', 'Logout'].map((item) => (
                        <Button
                          key={item}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => toast.info(`${item} clicked`)}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                </MobileDrawer>

                <MobileDrawer
                  trigger={<Button variant="outline">Open Side Drawer</Button>}
                  side="left"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                    <nav className="space-y-2">
                      {['Dashboard', 'Properties', 'Investments', 'Documents', 'Messages'].map((item) => (
                        <Button
                          key={item}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          {item}
                        </Button>
                      ))}
                    </nav>
                  </div>
                </MobileDrawer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Floating Action Button</CardTitle>
                <CardDescription>FAB for primary actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The FAB appears in the bottom-right corner on mobile devices.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Gestures */}
          <TabsContent value="gestures" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Pull to Refresh</CardTitle>
                <CardDescription>Pull down to refresh content</CardDescription>
              </CardHeader>
              <CardContent>
                <PullToRefresh onRefresh={handleRefresh} className="min-h-[200px]">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-center">
                      {isRefreshing ? 'Refreshing...' : 'Pull down to refresh'}
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Last refreshed: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </PullToRefresh>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Swipeable Cards</CardTitle>
                <CardDescription>Swipe in any direction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Left: {swipeCount.left}</div>
                  <div>Right: {swipeCount.right}</div>
                  <div>Up: {swipeCount.up}</div>
                  <div>Down: {swipeCount.down}</div>
                </div>
                
                <div className="relative h-48 flex items-center justify-center">
                  <SwipeableCard
                    onSwipeLeft={() => handleSwipe('left')}
                    onSwipeRight={() => handleSwipe('right')}
                    onSwipeUp={() => handleSwipe('up')}
                    onSwipeDown={() => handleSwipe('down')}
                    threshold={50}
                  >
                    <Card className="w-64">
                      <CardContent className="p-6">
                        <p className="text-center font-semibold">Swipe Me!</p>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Drag in any direction
                        </p>
                      </CardContent>
                    </Card>
                  </SwipeableCard>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Touch */}
          <TabsContent value="touch" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Touch Ripple Effect</CardTitle>
                <CardDescription>Material design ripple on touch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <TouchRipple>
                    <Button variant="outline" className="w-full">
                      Touch Me
                    </Button>
                  </TouchRipple>
                  
                  <TouchRipple color="rgba(59, 130, 246, 0.3)">
                    <Button variant="outline" className="w-full">
                      Blue Ripple
                    </Button>
                  </TouchRipple>
                  
                  <TouchRipple color="rgba(239, 68, 68, 0.3)">
                    <Button variant="outline" className="w-full">
                      Red Ripple
                    </Button>
                  </TouchRipple>
                  
                  <TouchRipple duration={1000}>
                    <Button variant="outline" className="w-full">
                      Slow Ripple
                    </Button>
                  </TouchRipple>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Touch Targets</CardTitle>
                <CardDescription>Optimized touch target sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>44x44px minimum target</span>
                    <Button size="icon" className="h-11 w-11">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>48x48px recommended</span>
                    <Button size="icon" className="h-12 w-12">
                      <Share2 className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Performance */}
          <TabsContent value="performance" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Lazy Loading</CardTitle>
                <CardDescription>Load content as needed</CardDescription>
              </CardHeader>
              <CardContent>
                <LazyComponent
                  fallback={<div className="h-32 bg-muted animate-pulse rounded" />}
                  delay={1000}
                >
                  <div className="h-32 bg-primary/10 rounded flex items-center justify-center">
                    <p>Lazy loaded content!</p>
                  </div>
                </LazyComponent>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Virtual List</CardTitle>
                <CardDescription>Efficiently render large lists</CardDescription>
              </CardHeader>
              <CardContent>
                <VirtualList
                  items={generateListItems(1000)}
                  height={300}
                  itemHeight={60}
                  renderItem={(item) => (
                    <div className="p-3 border-b">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Infinite Scroll</CardTitle>
                <CardDescription>Load more content on scroll</CardDescription>
              </CardHeader>
              <CardContent>
                <InfiniteScroll
                  hasMore={hasMore}
                  onLoadMore={handleLoadMore}
                  endMessage="No more items to load"
                >
                  <div className="space-y-2 max-h-96 overflow-auto">
                    {items.map((item) => (
                      <div key={item.id} className="p-3 border rounded">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ${item.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: PWA */}
          <TabsContent value="pwa" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>App Install Prompt</CardTitle>
                <CardDescription>PWA installation prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <AppInstallPrompt
                  onInstall={() => toast.success('App installed!')}
                  onDismiss={() => toast.info('Install prompt dismissed')}
                />
                <p className="text-sm text-muted-foreground">
                  The install prompt appears automatically when conditions are met.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PWA Features</CardTitle>
                <CardDescription>Progressive Web App capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Installable</p>
                      <p className="text-sm text-muted-foreground">Add to home screen</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Offline Support</p>
                      <p className="text-sm text-muted-foreground">Works without internet</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Real-time updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Fast Loading</p>
                      <p className="text-sm text-muted-foreground">Service worker caching</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: Components */}
          <TabsContent value="components" className="space-y-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Mobile Filter Bar</CardTitle>
                <CardDescription>Filtering and view controls</CardDescription>
              </CardHeader>
              <CardContent>
                <MobileFilterBar
                  activeView={activeView}
                  onFilterClick={() => toast.info('Filter panel opened')}
                  onViewChange={setActiveView}
                  onSortChange={(sort) => toast.info(`Sort by: ${sort}`)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Property Cards</CardTitle>
                <CardDescription>Optimized property display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testProperties.map((property) => (
                    <MobilePropertyCard
                      key={property.id}
                      property={property}
                      onFavorite={() => toast.success('Added to favorites')}
                      onShare={() => toast.info('Share dialog opened')}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progressive Enhancement</CardTitle>
                <CardDescription>Graceful feature degradation</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressiveEnhancement
                  fallback={
                    <div className="p-4 bg-muted rounded">
                      <p>Basic HTML content</p>
                    </div>
                  }
                  enhanced={
                    <div className="p-4 bg-primary/10 rounded">
                      <p>Enhanced JavaScript content</p>
                      <Button className="mt-2" onClick={() => toast.success('Interactive!')}>
                        Click Me
                      </Button>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Tab Bar (Mobile Only) */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Floating Action Button (Mobile Only) */}
      <FloatingActionButton
        onClick={() => toast.success('FAB clicked!')}
        position="bottom-right"
      />
    </div>
  )
}