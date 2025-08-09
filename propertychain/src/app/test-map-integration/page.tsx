/**
 * Map Integration Test Page - PropertyChain
 * Tests all map components and features
 */

'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  MapComponent,
  LocationSearch,
  MapLayerControl,
  PropertyInfoPanel,
  createMockMapData,
  type PropertyMarker,
  type MapViewport,
  type MapLayer,
  type MapLocation,
} from '@/components/custom/map-component'
import {
  PropertyDiscoveryMap,
  MarketAnalysisMap,
  InvestmentOpportunityMap,
  type PropertySearchFilters,
} from '@/components/custom/property-map'
import {
  MapPin,
  Search,
  Filter,
  Layers,
  Home,
  Building,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Star,
  Heart,
  Eye,
  Share,
  Download,
  Settings,
  MoreVertical,
  Zap,
  Target,
  BarChart,
  PieChart,
  Activity,
  Navigation,
  Compass,
  Route,
  Satellite,
  Map as MapIcon,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { addDays, subDays, subMonths } from 'date-fns'
import { toastSuccess, toastInfo, toastError } from '@/lib/toast'

// Mock data and setup
const mockMapData = createMockMapData()

const mockSavedSearches = [
  {
    id: '1',
    name: 'Downtown Condos',
    filters: {
      priceRange: [400000, 800000] as [number, number],
      propertyTypes: ['residential'],
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: [800, 1500] as [number, number],
      yearBuilt: [2000, 2024] as [number, number],
      features: ['Parking', 'Gym', 'Rooftop Deck'],
      investmentCriteria: {
        minROI: 8,
        maxPaybackPeriod: 20,
        preferredCashFlow: 2000,
      },
      location: {
        radius: 5,
        center: { lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR' },
      },
      marketConditions: {
        appreciationTrend: ['up'],
        inventory: ['low'],
        daysOnMarket: 30,
      },
    },
  },
  {
    id: '2',
    name: 'Investment Properties',
    filters: {
      priceRange: [200000, 600000] as [number, number],
      propertyTypes: ['residential', 'mixed'],
      bedrooms: null,
      bathrooms: null,
      squareFootage: [500, 3000] as [number, number],
      yearBuilt: [1950, 2024] as [number, number],
      features: ['Parking'],
      investmentCriteria: {
        minROI: 12,
        maxPaybackPeriod: 15,
        preferredCashFlow: 1500,
      },
      location: {
        radius: 15,
        center: null,
      },
      marketConditions: {
        appreciationTrend: [],
        inventory: [],
        daysOnMarket: 60,
      },
    },
  },
]

export default function TestMapIntegrationPage() {
  const [selectedTab, setSelectedTab] = useState('basic')
  const [selectedProperty, setSelectedProperty] = useState<PropertyMarker | null>(null)
  const [mapViewport, setMapViewport] = useState<MapViewport>(mockMapData.viewport)
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(mockMapData.layers)
  const [searchFilters, setSearchFilters] = useState<PropertySearchFilters>({
    priceRange: [0, 2000000],
    propertyTypes: [],
    bedrooms: null,
    bathrooms: null,
    squareFootage: [0, 10000],
    yearBuilt: [1900, new Date().getFullYear()],
    features: [],
    investmentCriteria: {
      minROI: 0,
      maxPaybackPeriod: 30,
      preferredCashFlow: 0,
    },
    location: {
      radius: 10,
      center: null,
    },
    marketConditions: {
      appreciationTrend: [],
      inventory: [],
      daysOnMarket: 180,
    },
  })

  // Market analysis states
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'appreciation' | 'roi' | 'inventory' | 'demand'>('price')
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | '2y'>('1y')

  // Investment map states
  const [investmentType, setInvestmentType] = useState<'buy-hold' | 'flip' | 'commercial' | 'development'>('buy-hold')
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate')

  const handlePropertyClick = useCallback((property: PropertyMarker) => {
    setSelectedProperty(property)
    toastInfo(`Selected property: ${property.title}`)
  }, [])

  const handleLocationSelect = useCallback((location: MapLocation) => {
    setMapViewport(prev => ({ ...prev, center: location }))
    toastSuccess(`Location updated: ${location.address || `${location.city}, ${location.state}`}`)
  }, [])

  const handlePropertyFavorite = useCallback((propertyId: string) => {
    toastSuccess('Property added to favorites')
  }, [])

  const handlePropertyShare = useCallback((propertyId: string) => {
    toastInfo('Property link copied to clipboard')
  }, [])

  const handlePropertyViewDetails = useCallback((propertyId: string) => {
    toastInfo('Navigating to property details...')
  }, [])

  const handleLayerToggle = useCallback((layerId: string, visible: boolean) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible } : layer
    ))
    toastInfo(`Layer ${layerId} ${visible ? 'enabled' : 'disabled'}`)
  }, [])

  const handleLayerOpacityChange = useCallback((layerId: string, opacity: number) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ))
  }, [])

  const handleFiltersChange = useCallback((filters: Partial<PropertySearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }))
  }, [])

  // Demo data generators
  const generateRandomProperty = () => {
    const property: PropertyMarker = {
      id: `prop-${Date.now()}`,
      location: {
        lat: 45.5152 + (Math.random() - 0.5) * 0.1,
        lng: -122.6784 + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 9999)} Sample St, Portland, OR`,
      },
      title: `Sample Property ${Math.floor(Math.random() * 1000)}`,
      price: Math.floor(Math.random() * 1000000) + 200000,
      type: ['residential', 'commercial', 'land', 'mixed'][Math.floor(Math.random() * 4)] as any,
      status: ['available', 'sold', 'pending', 'off-market'][Math.floor(Math.random() * 4)] as any,
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      squareFeet: Math.floor(Math.random() * 2000) + 800,
      roi: Math.random() * 20 + 5,
      monthlyIncome: Math.floor(Math.random() * 5000) + 1500,
      features: ['Parking', 'Gym', 'Pool', 'Balcony'].filter(() => Math.random() > 0.5),
      lastUpdated: new Date(),
    }
    return property
  }

  // Stats calculations
  const totalProperties = mockMapData.markers.length
  const availableProperties = mockMapData.markers.filter(p => p.status === 'available').length
  const avgPrice = Math.round(
    mockMapData.markers.reduce((sum, p) => sum + (p.price || 0), 0) / mockMapData.markers.length
  )
  const avgROI = (
    mockMapData.markers.reduce((sum, p) => sum + (p.roi || 0), 0) / 
    mockMapData.markers.filter(p => p.roi).length
  ).toFixed(1)

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Map Integration Test</h1>
            <p className="text-muted-foreground">
              Testing comprehensive map components with PropertyChain real estate features
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => toastInfo('Generating sample data...')}>
              <Zap className="mr-2 h-4 w-4" />
              Generate Sample
            </Button>
          </div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalProperties}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{availableProperties}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">
                ${(avgPrice / 1000).toFixed(0)}K
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{avgROI}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Map</TabsTrigger>
          <TabsTrigger value="search">Location Search</TabsTrigger>
          <TabsTrigger value="discovery">Property Discovery</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        {/* Basic Map Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Property Map</CardTitle>
                  <CardDescription>
                    Basic map component with property markers and controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapComponent
                    viewport={mapViewport}
                    markers={mockMapData.markers}
                    layers={mapLayers}
                    selectedMarker={selectedProperty?.id || null}
                    onViewportChange={setMapViewport}
                    onMarkerClick={handlePropertyClick}
                    config={{
                      style: 'streets',
                      showControls: true,
                      showScale: true,
                      showCompass: true,
                      enableClustering: true,
                    }}
                    className="h-96"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Map Layers Control */}
              <MapLayerControl
                layers={mapLayers}
                onLayerToggle={handleLayerToggle}
                onLayerOpacityChange={handleLayerOpacityChange}
              />

              {/* Selected Property Info */}
              {selectedProperty && (
                <PropertyInfoPanel
                  property={selectedProperty}
                  onClose={() => setSelectedProperty(null)}
                  onFavorite={handlePropertyFavorite}
                  onShare={handlePropertyShare}
                  onViewDetails={handlePropertyViewDetails}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Location Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Search</CardTitle>
              <CardDescription>
                Search for addresses, neighborhoods, and landmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search Portland neighborhoods..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold mb-2">Popular Searches</h3>
                  <div className="space-y-1">
                    {[
                      'Pearl District, Portland',
                      'Capitol Hill, Seattle',
                      'SOMA, San Francisco',
                      'LoDo, Denver'
                    ].map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8"
                        onClick={() => handleLocationSelect({
                          lat: 45.5152 + Math.random() * 0.01,
                          lng: -122.6784 + Math.random() * 0.01,
                          address: search
                        })}
                      >
                        <MapPin className="mr-2 h-3 w-3" />
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Search Categories</h3>
                  <div className="space-y-1">
                    {[
                      { label: 'Schools', icon: <Building className="h-3 w-3" /> },
                      { label: 'Transit', icon: <Navigation className="h-3 w-3" /> },
                      { label: 'Shopping', icon: <Star className="h-3 w-3" /> },
                      { label: 'Parks', icon: <MapIcon className="h-3 w-3" /> }
                    ].map((category, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-8"
                      >
                        {category.icon}
                        <span className="ml-2">{category.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {[
                      '123 SW Morrison St',
                      'Hawthorne District',
                      'Alberta Arts District',
                      'Sellwood-Moreland'
                    ].map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8 text-muted-foreground"
                      >
                        <Clock className="mr-2 h-3 w-3" />
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Discovery Tab */}
        <TabsContent value="discovery" className="space-y-6">
          <PropertyDiscoveryMap
            filters={searchFilters}
            onFiltersChange={handleFiltersChange}
            onPropertySelect={handlePropertyClick}
            savedSearches={mockSavedSearches}
            className="h-[600px]"
          />

          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription>
              Use the filters panel to refine your search. Results update automatically as you 
              adjust criteria like price range, property type, and investment requirements.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="market" className="space-y-6">
          <MarketAnalysisMap
            selectedMetric={selectedMetric}
            onMetricChange={(metric) => setSelectedMetric(metric as any)}
            timeframe={timeframe}
            onTimeframeChange={(tf) => setTimeframe(tf as any)}
            className="min-h-[600px]"
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Market Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Market Trend:</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      Bullish
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Growth:</span>
                    <span className="text-green-600">+8.2% YoY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory:</span>
                    <span className="text-yellow-600">2.1 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days on Market:</span>
                    <span>26 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Price Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Median Price:</span>
                    <span className="font-medium">$725,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price/sqft:</span>
                    <span className="font-medium">$420</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Change:</span>
                    <span className="text-green-600">+2.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Change:</span>
                    <span className="text-green-600">+8.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Investment Climate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Rental Yield:</span>
                    <span className="text-green-600">6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cap Rate:</span>
                    <span className="text-green-600">5.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Population Growth:</span>
                    <span className="text-green-600">+1.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Growth:</span>
                    <span className="text-green-600">+2.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Investment Opportunities Tab */}
        <TabsContent value="investment" className="space-y-6">
          <InvestmentOpportunityMap
            investmentType={investmentType}
            onInvestmentTypeChange={(type) => setInvestmentType(type as any)}
            riskTolerance={riskTolerance}
            onRiskToleranceChange={(risk) => setRiskTolerance(risk as any)}
            className="min-h-[600px]"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Investment Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Buy & Hold</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Long-term rental income and appreciation
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">8-12% ROI</Badge>
                      <Badge variant="outline">Low Risk</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Fix & Flip</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Short-term renovation and resale profits
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">15-25% ROI</Badge>
                      <Badge variant="outline">High Risk</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Commercial</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Office, retail, and industrial properties
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">6-10% ROI</Badge>
                      <Badge variant="outline">Medium Risk</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Risk</span>
                      <span className="text-green-600">Low</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Liquidity Risk</span>
                      <span className="text-yellow-600">Medium</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Credit Risk</span>
                      <span className="text-green-600">Low</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Overall Risk Score</span>
                      <span className="text-green-600">3.2 / 10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Map Controls</CardTitle>
                <CardDescription>
                  Interactive map navigation and view controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <ZoomIn className="h-4 w-4" />
                    <span>Zoom In/Out Controls</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4" />
                    <span>Map Style Selector</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Maximize2 className="h-4 w-4" />
                    <span>Fullscreen Toggle</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Crosshair className="h-4 w-4" />
                    <span>Center on Location</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Compass className="h-4 w-4" />
                    <span>Compass & Scale</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Property Markers</CardTitle>
                <CardDescription>
                  Interactive property markers with detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    <span>Residential Properties</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                    <span>Commercial Properties</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <span>Land Parcels</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-purple-500 rounded-full" />
                    <span>Mixed-Use Properties</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Hover Tooltips</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Search & Filtering</CardTitle>
                <CardDescription>
                  Advanced search and filtering capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4" />
                    <span>Address Autocomplete</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Filter className="h-4 w-4" />
                    <span>Price & Property Type Filters</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span>Investment Criteria</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Route className="h-4 w-4" />
                    <span>Radius Search</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4" />
                    <span>Saved Searches</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Layers</CardTitle>
                <CardDescription>
                  Overlays and data visualizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart className="h-4 w-4" />
                    <span>Price Heatmaps</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PieChart className="h-4 w-4" />
                    <span>Market Analysis Layers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Property Clustering</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapIcon className="h-4 w-4" />
                    <span>Neighborhood Boundaries</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4" />
                    <span>Market Trend Indicators</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Map components are built with placeholder data and mock interactions. 
              In a production environment, these would integrate with real map services 
              like Google Maps, Mapbox, or OpenStreetMap.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Map Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Interactive map with zoom/pan controls</li>
                <li>✅ Property markers with hover tooltips</li>
                <li>✅ Location search with autocomplete</li>
                <li>✅ Map layer controls and visibility</li>
                <li>✅ Multiple map styles (street, satellite, etc.)</li>
                <li>✅ Responsive design with mobile support</li>
                <li>✅ Property clustering for performance</li>
                <li>✅ Fullscreen and navigation controls</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property discovery with advanced filters</li>
                <li>✅ Market analysis with trend visualization</li>
                <li>✅ Investment opportunity mapping</li>
                <li>✅ ROI and cash flow calculations</li>
                <li>✅ Property comparison tools</li>
                <li>✅ Saved search functionality</li>
                <li>✅ Risk assessment indicators</li>
                <li>✅ Market alerts and notifications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Heatmap overlays for market data</li>
                <li>✅ Neighborhood boundary visualization</li>
                <li>✅ Property clustering and aggregation</li>
                <li>✅ Multi-metric analysis layers</li>
                <li>✅ Investment strategy filtering</li>
                <li>✅ Market trend indicators</li>
                <li>✅ Property sharing and favorites</li>
                <li>✅ Export and data download</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}