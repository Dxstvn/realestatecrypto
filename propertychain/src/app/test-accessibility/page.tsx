'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Accessibility,
  Keyboard,
  Eye,
  Volume2,
  Navigation,
  Focus,
  MousePointer,
  Monitor,
  Smartphone,
  Tablet,
  Home,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  Search,
  Menu,
  User,
  LogOut,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Zap,
  Shield,
  Heart,
  Star,
  MessageSquare,
  Calculator,
} from 'lucide-react'
import {
  AccessibilityProvider,
  AccessibilitySettings,
  AccessibilityToolbar,
  SkipNavigation,
  FocusTrap,
  KeyboardNavigation,
  LiveRegion,
  ScreenReaderOnly,
  AccessibleFormField,
  ReadingGuide,
  FocusModeOverlay,
  KeyboardShortcuts,
} from '@/components/accessibility'
import {
  AccessiblePropertyCard,
  AccessibleInvestmentCalculator,
  AccessiblePropertySearch,
  VoiceNavigation,
  TextToSpeech,
} from '@/components/accessibility/property-accessibility'

// Mock data
const mockProperty = {
  id: '1',
  title: 'Downtown Luxury Apartment',
  address: '123 Main Street, New York, NY 10001',
  price: 750000,
  roi: 12.5,
  type: 'Apartment',
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  tokenized: true,
  fundingProgress: 75,
  accessibility: {
    wheelchairAccessible: true,
    elevatorAvailable: true,
    rampAccess: true,
    accessibleParking: true,
    accessibleBathrooms: true,
    wideDoorways: true,
    grabBars: true,
    visualAlarms: true,
    brailleSignage: true,
    audioInduction: false,
    serviceAnimalFriendly: true,
    accessibleRoute: true,
  }
}

const mockProperties = [
  { ...mockProperty, id: '1', title: 'Downtown Luxury Apartment' },
  { ...mockProperty, id: '2', title: 'Suburban Family Home', type: 'House', bedrooms: 4, bathrooms: 3, sqft: 2500, price: 450000 },
  { ...mockProperty, id: '3', title: 'Beachfront Condo', type: 'Condo', bedrooms: 1, bathrooms: 1, sqft: 800, price: 350000, accessibility: undefined },
]

export default function TestAccessibilityPage() {
  const [selectedTab, setSelectedTab] = React.useState('overview')
  const [trapActive, setTrapActive] = React.useState(false)
  const [selectedProperty, setSelectedProperty] = React.useState<string | null>(null)
  const [announcements, setAnnouncements] = React.useState<string[]>([])

  const addAnnouncement = (message: string) => {
    setAnnouncements(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-background">
        {/* Skip Navigation */}
        <SkipNavigation />
        
        {/* Header with Navigation */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Accessibility className="h-6 w-6 text-primary" />
                  PropertyChain Accessibility
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Help">
                  <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="User menu">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main id="main" className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div>
              <h2 className="text-3xl font-bold mb-2">Accessibility Features Test</h2>
              <p className="text-muted-foreground">
                Comprehensive testing of WCAG AA compliant accessibility features
              </p>
            </div>

            {/* Alert for Screen Readers */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Accessibility Testing Mode</AlertTitle>
              <AlertDescription>
                This page demonstrates all accessibility features. Use Tab to navigate, 
                Enter/Space to activate, and "/" to focus search.
              </AlertDescription>
            </Alert>

            {/* Main Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility Overview</CardTitle>
                    <CardDescription>
                      Key accessibility features implemented in PropertyChain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Keyboard className="h-4 w-4" />
                          Keyboard Navigation
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Full keyboard navigation support</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Focus trap for modals and dialogs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Skip navigation links</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Keyboard shortcuts (? for help)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Visual Accessibility
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>High contrast mode</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Adjustable font sizes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Focus indicators</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Color blind friendly palette</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          Screen Reader Support
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>ARIA labels and descriptions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Live regions for updates</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Semantic HTML structure</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Text-to-speech support</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Navigation className="h-4 w-4" />
                          Cognitive Support
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Simple language option</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Reading guide</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Focus mode</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>Reduce motion option</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h3 className="font-semibold">WCAG AA Compliance</h3>
                      <div className="grid gap-2 md:grid-cols-3">
                        <Badge variant="secondary" className="justify-center py-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Level A Compliant
                        </Badge>
                        <Badge variant="secondary" className="justify-center py-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Level AA Compliant
                        </Badge>
                        <Badge variant="outline" className="justify-center py-2">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          AAA Partial
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Navigation Tab */}
              <TabsContent value="navigation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyboard Navigation Demo</CardTitle>
                    <CardDescription>
                      Test keyboard navigation with arrow keys, Tab, and Enter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Keyboard className="h-4 w-4" />
                      <AlertDescription>
                        Use arrow keys to navigate between items. Press Enter to select.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Navigation List</h3>
                      <KeyboardNavigation orientation="vertical">
                        <div className="space-y-2">
                          {['Home', 'Properties', 'Dashboard', 'Investments', 'Settings'].map((item, index) => (
                            <Button
                              key={item}
                              variant="outline"
                              className="w-full justify-start"
                              data-navigable="true"
                              onClick={() => addAnnouncement(`Navigated to ${item}`)}
                            >
                              <ChevronRight className="h-4 w-4 mr-2" />
                              {item}
                            </Button>
                          ))}
                        </div>
                      </KeyboardNavigation>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Focus Trap Demo</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the button to activate focus trap. Press Escape to exit.
                      </p>
                      <Button onClick={() => setTrapActive(true)}>
                        Activate Focus Trap
                      </Button>
                      
                      {trapActive && (
                        <FocusTrap
                          active={trapActive}
                          onEscape={() => setTrapActive(false)}
                          className="p-4 border rounded-lg space-y-2"
                        >
                          <p className="font-semibold">Focus is trapped in this area</p>
                          <div className="flex gap-2">
                            <Button size="sm">Button 1</Button>
                            <Button size="sm" variant="outline">Button 2</Button>
                            <Button size="sm" variant="ghost">Button 3</Button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => setTrapActive(false)}
                          >
                            Exit Focus Trap (or press Escape)
                          </Button>
                        </FocusTrap>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Forms Tab */}
              <TabsContent value="forms" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accessible Form Components</CardTitle>
                    <CardDescription>
                      Form fields with proper labels, descriptions, and error handling
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AccessibleFormField
                      id="property-name"
                      label="Property Name"
                      required
                      description="Enter a descriptive name for the property"
                    >
                      <input
                        id="property-name"
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-required="true"
                      />
                    </AccessibleFormField>

                    <AccessibleFormField
                      id="property-price"
                      label="Property Price"
                      required
                      description="Enter the listing price in USD"
                      error=""
                    >
                      <input
                        id="property-price"
                        type="number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-required="true"
                        aria-invalid="false"
                      />
                    </AccessibleFormField>

                    <AccessibleFormField
                      id="property-description"
                      label="Property Description"
                      description="Provide a detailed description of the property"
                    >
                      <textarea
                        id="property-description"
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </AccessibleFormField>

                    <AccessibleFormField
                      id="invalid-field"
                      label="Example with Error"
                      required
                      error="This field is required and must be at least 10 characters"
                    >
                      <input
                        id="invalid-field"
                        type="text"
                        className="w-full px-3 py-2 border border-destructive rounded-lg focus:outline-none focus:ring-2 focus:ring-destructive"
                        aria-required="true"
                        aria-invalid="true"
                      />
                    </AccessibleFormField>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Properties Tab */}
              <TabsContent value="properties" className="space-y-6">
                <AccessiblePropertySearch />
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mockProperties.map((property) => (
                    <AccessiblePropertyCard
                      key={property.id}
                      property={property}
                      selected={selectedProperty === property.id}
                      onSelect={() => setSelectedProperty(
                        selectedProperty === property.id ? null : property.id
                      )}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <AccessibleInvestmentCalculator />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Screen Reader Announcements</CardTitle>
                      <CardDescription>
                        Live region for dynamic content updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Button
                          onClick={() => addAnnouncement('Property added to favorites')}
                          className="w-full"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Add to Favorites
                        </Button>
                        <Button
                          onClick={() => addAnnouncement('Search completed. 15 properties found.')}
                          variant="outline"
                          className="w-full"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Simulate Search
                        </Button>
                        <Button
                          onClick={() => addAnnouncement('Investment calculation updated')}
                          variant="secondary"
                          className="w-full"
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          Calculate ROI
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Announcement Log</h4>
                        <div className="h-32 overflow-y-auto border rounded-lg p-2 text-xs space-y-1">
                          {announcements.length === 0 ? (
                            <p className="text-muted-foreground">No announcements yet</p>
                          ) : (
                            announcements.map((announcement, index) => (
                              <div key={index} className="text-muted-foreground">
                                {announcement}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <LiveRegion mode="polite">
                        {announcements[announcements.length - 1]}
                      </LiveRegion>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Text to Speech Demo</CardTitle>
                    <CardDescription>
                      Click the speaker icon to hear content read aloud
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm">
                          PropertyChain is a revolutionary platform that tokenizes real estate investments, 
                          making property ownership accessible to everyone. With our blockchain-based system, 
                          you can invest in premium properties starting from just $100.
                        </p>
                        <TextToSpeech 
                          text="PropertyChain is a revolutionary platform that tokenizes real estate investments, making property ownership accessible to everyone. With our blockchain-based system, you can invest in premium properties starting from just $100."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <AccessibilitySettings />
              </TabsContent>
            </Tabs>

            {/* Screen Reader Only Content */}
            <ScreenReaderOnly>
              <div role="status" aria-live="polite" aria-atomic="true">
                Page loaded. {mockProperties.length} properties available.
              </div>
            </ScreenReaderOnly>
          </div>
        </main>

        {/* Footer */}
        <footer id="footer" className="border-t mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                © 2024 PropertyChain. All rights reserved.
              </p>
              <nav aria-label="Footer navigation">
                <ul className="flex items-center gap-4 text-sm">
                  <li><a href="#" className="hover:underline">Privacy</a></li>
                  <li><a href="#" className="hover:underline">Terms</a></li>
                  <li><a href="#" className="hover:underline">Accessibility</a></li>
                  <li><a href="#" className="hover:underline">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </footer>

        {/* Floating Components */}
        <AccessibilityToolbar />
        <VoiceNavigation />
        <KeyboardShortcuts />
        <ReadingGuide />
        <FocusModeOverlay />
      </div>
    </AccessibilityProvider>
  )
}