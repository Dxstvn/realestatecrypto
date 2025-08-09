/**
 * Property Map Components - PropertyChain
 * 
 * Specialized map components for real estate property discovery and analysis
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
} from './map-component'
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
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Target,
  BarChart,
  PieChart,
  Activity,
  Zap,
  Clock,
  Route,
  Compass,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'
import { addDays, subDays, subMonths } from 'date-fns'

// Simple PropertyMap export for explore page
export function PropertyMap({
  properties,
  onPropertyClick,
  compareMode = false,
  selectedForCompare = [],
  onToggleCompare,
  className,
}: {
  properties: any[]
  onPropertyClick?: (id: string) => void
  compareMode?: boolean
  selectedForCompare?: string[]
  onToggleCompare?: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn('flex h-full', className)}>
      <div className="flex-1 relative bg-gray-100">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-24 w-24 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500 mb-2">Interactive Map View</p>
            <p className="text-sm text-gray-400">
              Map integration would display {properties.length} properties here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// PropertyChain Map Types
export interface PropertySearchFilters {
  priceRange: [number, number]
  propertyTypes: string[]
  bedrooms: number | null
  bathrooms: number | null
  squareFootage: [number, number]
  yearBuilt: [number, number]
  features: string[]
  investmentCriteria: {
    minROI: number
    maxPaybackPeriod: number
    preferredCashFlow: number
  }
  location: {
    radius: number // miles
    center: MapLocation | null
  }
  marketConditions: {
    appreciationTrend: string[]
    inventory: string[]
    daysOnMarket: number
  }
}

export interface MarketData {
  location: MapLocation
  averagePrice: number
  medianPrice: number
  pricePerSqft: number
  appreciation: number
  inventory: number
  daysOnMarket: number
  salesVolume: number
  priceHistory: Array<{
    date: Date
    price: number
  }>
}

export interface PropertyHeatmapData {
  location: MapLocation
  intensity: number
  metric: 'price' | 'roi' | 'appreciation' | 'demand'
  value: number
}

// Property Discovery Map
interface PropertyDiscoveryMapProps {
  filters?: Partial<PropertySearchFilters>
  onFiltersChange?: (filters: PropertySearchFilters) => void
  onPropertySelect?: (property: PropertyMarker) => void
  savedSearches?: Array<{ id: string; name: string; filters: PropertySearchFilters }>
  className?: string
}

export function PropertyDiscoveryMap({
  filters = {},
  onFiltersChange,
  onPropertySelect,
  savedSearches = [],
  className,
}: PropertyDiscoveryMapProps) {
  const [viewport, setViewport] = React.useState<MapViewport>({
    center: { lat: 45.5152, lng: -122.6784 }, // Portland, OR
    zoom: 12,
  })
  
  const [selectedProperty, setSelectedProperty] = React.useState<string | null>(null)
  const [showFilters, setShowFilters] = React.useState(false)
  const [showLayers, setShowLayers] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<PropertyMarker[]>([])
  const [favoriteProperties, setFavoriteProperties] = React.useState<Set<string>>(new Set())

  const mockData = createMockMapData()
  const [properties] = React.useState<PropertyMarker[]>(mockData.markers)
  const [layers, setLayers] = React.useState<MapLayer[]>(mockData.layers)

  const defaultFilters: PropertySearchFilters = {
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
    ...filters,
  }

  const [currentFilters, setCurrentFilters] = React.useState<PropertySearchFilters>(defaultFilters)

  // Filter properties based on current filters
  const filteredProperties = React.useMemo(() => {
    return properties.filter(property => {
      // Price filter
      if (property.price && (
        property.price < currentFilters.priceRange[0] ||
        property.price > currentFilters.priceRange[1]
      )) {
        return false
      }

      // Property type filter
      if (currentFilters.propertyTypes.length > 0 &&
          !currentFilters.propertyTypes.includes(property.type)) {
        return false
      }

      // Bedrooms filter
      if (currentFilters.bedrooms && property.bedrooms &&
          property.bedrooms < currentFilters.bedrooms) {
        return false
      }

      // Bathrooms filter
      if (currentFilters.bathrooms && property.bathrooms &&
          property.bathrooms < currentFilters.bathrooms) {
        return false
      }

      // ROI filter
      if (property.roi && property.roi < currentFilters.investmentCriteria.minROI) {
        return false
      }

      return true
    })
  }, [properties, currentFilters])

  const handleFiltersUpdate = (newFilters: Partial<PropertySearchFilters>) => {
    const updated = { ...currentFilters, ...newFilters }
    setCurrentFilters(updated)
    onFiltersChange?.(updated)
  }

  const handlePropertyClick = (property: PropertyMarker) => {
    setSelectedProperty(property.id)
    onPropertySelect?.(property)
  }

  const handleFavoriteProperty = (propertyId: string) => {
    setFavoriteProperties(prev => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
      } else {
        newSet.add(propertyId)
      }
      return newSet
    })
  }

  const selectedPropertyData = properties.find(p => p.id === selectedProperty)

  return (
    <div className={cn("flex h-96 bg-muted rounded-lg overflow-hidden", className)}>
      {/* Map Container */}
      <div className="flex-1 relative">
        <MapComponent
          viewport={viewport}
          markers={filteredProperties}
          layers={layers}
          selectedMarker={selectedProperty}
          onViewportChange={setViewport}
          onMarkerClick={handlePropertyClick}
          className="h-full"
        />

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <LocationSearch
            onLocationSelect={(location) => {
              setViewport(prev => ({ ...prev, center: location }))
              handleFiltersUpdate({ location: { ...currentFilters.location, center: location } })
            }}
            placeholder="Search neighborhoods, addresses, or landmarks..."
            className="shadow-lg"
          />
        </div>

        {/* Quick Filters */}
        <div className="absolute top-20 left-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="shadow-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters ({Object.keys(currentFilters).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLayers(!showLayers)}
            className="shadow-sm"
          >
            <Layers className="mr-2 h-4 w-4" />
            Layers
          </Button>
        </div>

        {/* Results Counter */}
        <div className="absolute bottom-4 left-4">
          <Card className="p-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{filteredProperties.length} properties</span>
            </div>
          </Card>
        </div>

        {/* Layer Control Panel */}
        {showLayers && (
          <div className="absolute top-32 left-4">
            <MapLayerControl
              layers={layers}
              onLayerToggle={(layerId, visible) => {
                setLayers(prev => prev.map(layer => 
                  layer.id === layerId ? { ...layer, visible } : layer
                ))
              }}
              onLayerOpacityChange={(layerId, opacity) => {
                setLayers(prev => prev.map(layer => 
                  layer.id === layerId ? { ...layer, opacity } : layer
                ))
              }}
            />
          </div>
        )}
      </div>

      {/* Property Info Sidebar */}
      {selectedPropertyData && (
        <div className="w-80 border-l bg-background">
          <PropertyInfoPanel
            property={selectedPropertyData}
            onClose={() => setSelectedProperty(null)}
            onFavorite={handleFavoriteProperty}
            onShare={(id) => console.log('Share property:', id)}
            onViewDetails={(id) => console.log('View details:', id)}
          />
        </div>
      )}

      {/* Advanced Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Property Filters</SheetTitle>
            <SheetDescription>
              Refine your property search with detailed criteria
            </SheetDescription>
          </SheetHeader>
          <PropertySearchFilters
            filters={currentFilters}
            onFiltersChange={handleFiltersUpdate}
            savedSearches={savedSearches}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Property Search Filters Component
interface PropertySearchFiltersProps {
  filters: PropertySearchFilters
  onFiltersChange: (filters: Partial<PropertySearchFilters>) => void
  savedSearches?: Array<{ id: string; name: string; filters: PropertySearchFilters }>
}

function PropertySearchFilters({
  filters,
  onFiltersChange,
  savedSearches = [],
}: PropertySearchFiltersProps) {
  const propertyTypes = [
    { id: 'residential', label: 'Residential', icon: <Home className="w-4 h-4" /> },
    { id: 'commercial', label: 'Commercial', icon: <Building className="w-4 h-4" /> },
    { id: 'land', label: 'Land', icon: <MapPin className="w-4 h-4" /> },
    { id: 'mixed', label: 'Mixed Use', icon: <Star className="w-4 h-4" /> },
  ]

  const commonFeatures = [
    'Parking', 'Gym', 'Pool', 'Rooftop Deck', 'Balcony', 'In-Unit Laundry',
    'Doorman', 'Elevator', 'Pet Friendly', 'Air Conditioning', 'Hardwood Floors',
    'Updated Kitchen', 'Walk-in Closet', 'Fireplace', 'Garden', 'Storage'
  ]

  const handlePriceRangeChange = (range: [number, number]) => {
    onFiltersChange({ priceRange: range })
  }

  const handlePropertyTypeToggle = (type: string) => {
    const current = filters.propertyTypes
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type]
    onFiltersChange({ propertyTypes: updated })
  }

  const handleFeatureToggle = (feature: string) => {
    const current = filters.features
    const updated = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature]
    onFiltersChange({ features: updated })
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6 py-4">
        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Saved Searches</Label>
            <div className="space-y-1">
              {savedSearches.map(search => (
                <Button
                  key={search.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onFiltersChange(search.filters)}
                >
                  <Bookmark className="mr-2 h-3 w-3" />
                  {search.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="space-y-2">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={2000000}
              step={25000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(filters.priceRange[0])}</span>
              <span>{formatCurrency(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Property Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Property Types</Label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map(type => (
              <Button
                key={type.id}
                variant={filters.propertyTypes.includes(type.id) ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => handlePropertyTypeToggle(type.id)}
              >
                {type.icon}
                <span className="ml-2">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Bedrooms</Label>
            <Select
              value={filters.bedrooms?.toString() || ''}
              onValueChange={(value) => onFiltersChange({
                bedrooms: value ? parseInt(value) : null
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Bathrooms</Label>
            <Select
              value={filters.bathrooms?.toString() || ''}
              onValueChange={(value) => onFiltersChange({
                bathrooms: value ? parseInt(value) : null
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Square Footage */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Square Footage</Label>
          <div className="space-y-2">
            <Slider
              value={filters.squareFootage}
              onValueChange={(range) => onFiltersChange({ squareFootage: range as [number, number] })}
              max={10000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.squareFootage[0].toLocaleString()} sqft</span>
              <span>{filters.squareFootage[1].toLocaleString()} sqft</span>
            </div>
          </div>
        </div>

        {/* Investment Criteria */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Investment Criteria</Label>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Minimum ROI (%)</Label>
              <Slider
                value={[filters.investmentCriteria.minROI]}
                onValueChange={([value]) => onFiltersChange({
                  investmentCriteria: { ...filters.investmentCriteria, minROI: value }
                })}
                max={25}
                step={0.5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-center">
                {filters.investmentCriteria.minROI}%
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Preferred Monthly Cash Flow</Label>
              <Input
                type="number"
                value={filters.investmentCriteria.preferredCashFlow}
                onChange={(e) => onFiltersChange({
                  investmentCriteria: {
                    ...filters.investmentCriteria,
                    preferredCashFlow: parseInt(e.target.value) || 0
                  }
                })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Features</Label>
          <div className="grid grid-cols-2 gap-1">
            {commonFeatures.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label htmlFor={feature} className="text-xs">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Search Radius */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Search Radius</Label>
          <div className="space-y-2">
            <Slider
              value={[filters.location.radius]}
              onValueChange={([value]) => onFiltersChange({
                location: { ...filters.location, radius: value }
              })}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {filters.location.radius} miles
            </div>
          </div>
        </div>

        {/* Reset Filters */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onFiltersChange({
              priceRange: [0, 2000000],
              propertyTypes: [],
              bedrooms: null,
              bathrooms: null,
              features: [],
              investmentCriteria: {
                minROI: 0,
                maxPaybackPeriod: 30,
                preferredCashFlow: 0,
              },
            })}
          >
            Reset All Filters
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}

// Market Analysis Map Component
interface MarketAnalysisMapProps {
  selectedMetric?: 'price' | 'appreciation' | 'roi' | 'inventory' | 'demand'
  onMetricChange?: (metric: string) => void
  timeframe?: '1m' | '3m' | '6m' | '1y' | '2y'
  onTimeframeChange?: (timeframe: string) => void
  className?: string
}

export function MarketAnalysisMap({
  selectedMetric = 'price',
  onMetricChange,
  timeframe = '1y',
  onTimeframeChange,
  className,
}: MarketAnalysisMapProps) {
  const [viewport, setViewport] = React.useState<MapViewport>({
    center: { lat: 45.5152, lng: -122.6784 },
    zoom: 11,
  })
  
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = React.useState(true)
  const [showComparisons, setShowComparisons] = React.useState(false)

  const mockData = createMockMapData()
  const [marketData, setMarketData] = React.useState<MarketData[]>([])
  const [heatmapData, setHeatmapData] = React.useState<PropertyHeatmapData[]>([])

  // Mock market data
  React.useEffect(() => {
    const mockMarketData: MarketData[] = [
      {
        location: { lat: 45.5152, lng: -122.6784, address: 'Downtown Portland' },
        averagePrice: 725000,
        medianPrice: 650000,
        pricePerSqft: 420,
        appreciation: 8.2,
        inventory: 2.1,
        daysOnMarket: 28,
        salesVolume: 45,
        priceHistory: [],
      },
      {
        location: { lat: 45.5200, lng: -122.6750, address: 'Pearl District' },
        averagePrice: 950000,
        medianPrice: 850000,
        pricePerSqft: 580,
        appreciation: 12.1,
        inventory: 1.8,
        daysOnMarket: 22,
        salesVolume: 38,
        priceHistory: [],
      },
    ]
    setMarketData(mockMarketData)
  }, [selectedMetric, timeframe])

  const metrics = [
    { id: 'price', label: 'Average Price', icon: <DollarSign className="w-4 h-4" />, color: 'bg-blue-500' },
    { id: 'appreciation', label: 'Appreciation', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500' },
    { id: 'roi', label: 'Investment ROI', icon: <Target className="w-4 h-4" />, color: 'bg-purple-500' },
    { id: 'inventory', label: 'Inventory Level', icon: <BarChart className="w-4 h-4" />, color: 'bg-yellow-500' },
    { id: 'demand', label: 'Market Demand', icon: <Activity className="w-4 h-4" />, color: 'bg-red-500' },
  ]

  const timeframes = [
    { id: '1m', label: '1 Month' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
    { id: '2y', label: '2 Years' },
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Metric:</Label>
            <Select value={selectedMetric} onValueChange={onMetricChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(metric => (
                  <SelectItem key={metric.id} value={metric.id}>
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      {metric.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Timeframe:</Label>
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map(tf => (
                  <SelectItem key={tf.id} value={tf.id}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="heatmap"
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
            />
            <Label htmlFor="heatmap" className="text-sm">Heatmap</Label>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparisons(!showComparisons)}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Compare Areas
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <MapComponent
            viewport={viewport}
            markers={[]}
            onViewportChange={setViewport}
            className="h-96"
            config={{
              style: showHeatmap ? 'satellite' : 'streets',
              showControls: true,
            }}
          />
        </div>

        {/* Market Data Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Market Statistics</CardTitle>
              <CardDescription className="text-sm">
                {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} analysis for {timeframe}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.slice(0, 3).map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{data.location.address}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4"
                      onClick={() => setSelectedArea(data.location.address || null)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {selectedMetric === 'price' && (
                    <div className="text-sm">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(data.averagePrice)}
                      </p>
                      <p className="text-muted-foreground">
                        {formatCurrency(data.pricePerSqft)}/sqft
                      </p>
                    </div>
                  )}
                  
                  {selectedMetric === 'appreciation' && (
                    <div className="text-sm">
                      <p className="font-semibold text-green-600">
                        +{data.appreciation}%
                      </p>
                      <p className="text-muted-foreground">
                        Past {timeframe}
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span>Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Area Comparison Panel */}
      {showComparisons && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Area Comparison</CardTitle>
            <CardDescription>
              Compare market metrics across different neighborhoods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {marketData.slice(0, 3).map((data, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">{data.location.address}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Avg Price:</span>
                      <span className="font-medium">{formatCurrency(data.averagePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Appreciation:</span>
                      <span className="font-medium text-green-600">+{data.appreciation}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days on Market:</span>
                      <span className="font-medium">{data.daysOnMarket}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory:</span>
                      <span className="font-medium">{data.inventory} months</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Investment Opportunity Map Component
interface InvestmentOpportunityMapProps {
  investmentType?: 'buy-hold' | 'flip' | 'commercial' | 'development'
  onInvestmentTypeChange?: (type: string) => void
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive'
  onRiskToleranceChange?: (risk: string) => void
  className?: string
}

export function InvestmentOpportunityMap({
  investmentType = 'buy-hold',
  onInvestmentTypeChange,
  riskTolerance = 'moderate',
  onRiskToleranceChange,
  className,
}: InvestmentOpportunityMapProps) {
  const mockData = createMockMapData()
  const [viewport, setViewport] = React.useState(mockData.viewport)
  const [opportunities] = React.useState(mockData.markers)
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<string | null>(null)

  const investmentTypes = [
    { id: 'buy-hold', label: 'Buy & Hold', description: 'Long-term rental income' },
    { id: 'flip', label: 'Fix & Flip', description: 'Short-term renovation profit' },
    { id: 'commercial', label: 'Commercial', description: 'Office, retail, warehouse' },
    { id: 'development', label: 'Development', description: 'Ground-up construction' },
  ]

  const riskLevels = [
    { id: 'conservative', label: 'Conservative', color: 'bg-green-500' },
    { id: 'moderate', label: 'Moderate', color: 'bg-yellow-500' },
    { id: 'aggressive', label: 'Aggressive', color: 'bg-red-500' },
  ]

  // Filter opportunities based on investment type and risk tolerance
  const filteredOpportunities = opportunities.filter(opportunity => {
    // Add logic to filter based on investment criteria
    return true // Simplified for demo
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Investment Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Label className="text-sm font-medium">Investment Strategy</Label>
            <RadioGroup
              value={investmentType}
              onValueChange={onInvestmentTypeChange}
              className="flex gap-4 mt-1"
            >
              {investmentTypes.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Risk Tolerance</Label>
          <Select value={riskTolerance} onValueChange={onRiskToleranceChange}>
            <SelectTrigger className="w-32 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {riskLevels.map(level => (
                <SelectItem key={level.id} value={level.id}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", level.color)} />
                    {level.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Map with Opportunities */}
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <MapComponent
            viewport={viewport}
            markers={filteredOpportunities}
            selectedMarker={selectedOpportunity}
            onViewportChange={setViewport}
            onMarkerClick={(property) => setSelectedOpportunity(property.id)}
            className="h-96"
          />
        </div>

        {/* Opportunity Analysis */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Opportunities</CardTitle>
              <CardDescription className="text-sm">
                Best matches for {investmentType} strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredOpportunities.slice(0, 3).map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedOpportunity(opportunity.id)}
                  >
                    <h4 className="font-medium text-sm">{opportunity.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {opportunity.location.address}
                    </p>
                    
                    {opportunity.roi && (
                      <div className="flex justify-between text-sm">
                        <span>Expected ROI:</span>
                        <span className="font-medium text-green-600">
                          {opportunity.roi}%
                        </span>
                      </div>
                    )}
                    
                    {opportunity.price && (
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">
                          {formatCurrency(opportunity.price)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Market Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Price Drop Alert</p>
                    <p className="text-muted-foreground text-xs">
                      3 properties reduced prices in your target area
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Market Shift</p>
                    <p className="text-muted-foreground text-xs">
                      Inventory levels increasing in downtown area
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">New Listings</p>
                    <p className="text-muted-foreground text-xs">
                      12 new properties match your criteria
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}