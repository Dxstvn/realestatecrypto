/**
 * Map Components - PropertyChain
 * 
 * Interactive map components with property markers, location search, and real estate features
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MapPin,
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Navigation,
  Home,
  Building,
  MapIcon,
  Satellite,
  Route,
  Target,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Share,
  Info,
  Star,
  Heart,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  Camera,
  MoreVertical,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/format'

// Map Types
export interface MapLocation {
  lat: number
  lng: number
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface PropertyMarker {
  id: string
  location: MapLocation
  title: string
  description?: string
  price?: number
  type: 'residential' | 'commercial' | 'land' | 'mixed'
  status: 'available' | 'sold' | 'pending' | 'off-market'
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  yearBuilt?: number
  images?: string[]
  features?: string[]
  roi?: number
  monthlyIncome?: number
  appreciation?: number
  lastUpdated?: Date
}

export interface MapLayer {
  id: string
  name: string
  type: 'markers' | 'heatmap' | 'choropleth' | 'cluster' | 'boundaries'
  visible: boolean
  opacity: number
  color?: string
  data: any[]
  interactive?: boolean
}

export interface MapViewport {
  center: MapLocation
  zoom: number
  bearing?: number
  pitch?: number
}

export interface MapConfig {
  style: 'streets' | 'satellite' | 'terrain' | 'dark' | 'light'
  interactive: boolean
  showControls: boolean
  showScale: boolean
  showCompass: boolean
  enableClustering: boolean
  clusterRadius: number
  minZoom: number
  maxZoom: number
}

// Base Map Component
interface MapComponentProps {
  viewport: MapViewport
  markers: PropertyMarker[]
  layers?: MapLayer[]
  config?: Partial<MapConfig>
  selectedMarker?: string | null
  onViewportChange?: (viewport: MapViewport) => void
  onMarkerClick?: (marker: PropertyMarker) => void
  onMarkerHover?: (marker: PropertyMarker | null) => void
  onMapClick?: (location: MapLocation) => void
  className?: string
}

export function MapComponent({
  viewport,
  markers,
  layers = [],
  config = {},
  selectedMarker,
  onViewportChange,
  onMarkerClick,
  onMarkerHover,
  onMapClick,
  className,
}: MapComponentProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hoveredMarker, setHoveredMarker] = React.useState<string | null>(null)
  const [mapStyle, setMapStyle] = React.useState<string>(config.style || 'streets')

  const mapConfig: MapConfig = {
    style: 'streets',
    interactive: true,
    showControls: true,
    showScale: true,
    showCompass: true,
    enableClustering: true,
    clusterRadius: 50,
    minZoom: 1,
    maxZoom: 20,
    ...config,
  }

  // Simulate map loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleZoomIn = () => {
    const newViewport = { ...viewport, zoom: Math.min(viewport.zoom + 1, mapConfig.maxZoom) }
    onViewportChange?.(newViewport)
  }

  const handleZoomOut = () => {
    const newViewport = { ...viewport, zoom: Math.max(viewport.zoom - 1, mapConfig.minZoom) }
    onViewportChange?.(newViewport)
  }

  const handleMarkerInteraction = (marker: PropertyMarker, action: 'click' | 'hover' | 'leave') => {
    switch (action) {
      case 'click':
        onMarkerClick?.(marker)
        break
      case 'hover':
        setHoveredMarker(marker.id)
        onMarkerHover?.(marker)
        break
      case 'leave':
        setHoveredMarker(null)
        onMarkerHover?.(null)
        break
    }
  }

  const getMarkerColor = (marker: PropertyMarker) => {
    switch (marker.type) {
      case 'residential': return 'bg-blue-500'
      case 'commercial': return 'bg-green-500'
      case 'land': return 'bg-yellow-500'
      case 'mixed': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: PropertyMarker['status']) => {
    switch (status) {
      case 'available': return 'text-green-500'
      case 'sold': return 'text-red-500'
      case 'pending': return 'text-yellow-500'
      case 'off-market': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className={cn("relative w-full h-96 bg-muted rounded-lg overflow-hidden", className)}>
      {!isLoaded ? (
        // Loading state
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map placeholder with grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Property Markers */}
          <div className="absolute inset-0">
            {markers.map((marker) => {
              // Convert lat/lng to x/y positions (simplified)
              const x = ((marker.location.lng + 180) / 360) * 100
              const y = ((90 - marker.location.lat) / 180) * 100

              return (
                <div
                  key={marker.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => handleMarkerInteraction(marker, 'click')}
                  onMouseEnter={() => handleMarkerInteraction(marker, 'hover')}
                  onMouseLeave={() => handleMarkerInteraction(marker, 'leave')}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all duration-200",
                    getMarkerColor(marker),
                    selectedMarker === marker.id && "scale-125 ring-2 ring-primary",
                    hoveredMarker === marker.id && "scale-110"
                  )}>
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      {marker.type === 'residential' && <Home className="w-3 h-3 text-white" />}
                      {marker.type === 'commercial' && <Building className="w-3 h-3 text-white" />}
                      {marker.type === 'land' && <MapPin className="w-3 h-3 text-white" />}
                      {marker.type === 'mixed' && <Star className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {/* Marker Tooltip */}
                  {hoveredMarker === marker.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border min-w-48">
                        <h4 className="font-semibold text-sm">{marker.title}</h4>
                        {marker.price && (
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(marker.price)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-xs">
                            {marker.type}
                          </Badge>
                          <span className={getStatusColor(marker.status)}>
                            {marker.status}
                          </span>
                        </div>
                        {marker.bedrooms && marker.bathrooms && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {marker.bedrooms}bd • {marker.bathrooms}ba
                            {marker.squareFeet && ` • ${marker.squareFeet.toLocaleString()} sqft`}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Map Controls */}
          {mapConfig.showControls && (
            <MapControls
              config={mapConfig}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onStyleChange={setMapStyle}
            />
          )}

          {/* Scale */}
          {mapConfig.showScale && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm border text-xs">
                <div className="w-16 h-1 bg-gray-400 mb-1" />
                <span className="text-muted-foreground">1 mile</span>
              </div>
            </div>
          )}

          {/* Compass */}
          {mapConfig.showCompass && (
            <div className="absolute top-4 right-4">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border">
                <Compass className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Map Controls Component
interface MapControlsProps {
  config: MapConfig
  onZoomIn: () => void
  onZoomOut: () => void
  onStyleChange: (style: string) => void
}

function MapControls({ config, onZoomIn, onZoomOut, onStyleChange }: MapControlsProps) {
  const [isStyleMenuOpen, setIsStyleMenuOpen] = React.useState(false)

  const mapStyles = [
    { id: 'streets', label: 'Streets', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'satellite', label: 'Satellite', icon: <Satellite className="w-4 h-4" /> },
    { id: 'terrain', label: 'Terrain', icon: <MapPin className="w-4 h-4" /> },
    { id: 'dark', label: 'Dark', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'light', label: 'Light', icon: <MapIcon className="w-4 h-4" /> },
  ]

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-none"
          onClick={onZoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Separator />
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-none"
          onClick={onZoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Style Selector */}
      <DropdownMenu open={isStyleMenuOpen} onOpenChange={setIsStyleMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <Layers className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Map Style</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {mapStyles.map((style) => (
            <DropdownMenuItem
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className="flex items-center gap-2"
            >
              {style.icon}
              {style.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Fullscreen Toggle */}
      <Button variant="outline" size="icon" className="w-8 h-8">
        <Maximize2 className="w-4 h-4" />
      </Button>

      {/* Current Location */}
      <Button variant="outline" size="icon" className="w-8 h-8">
        <Crosshair className="w-4 h-4" />
      </Button>
    </div>
  )
}

// Location Search Component
interface LocationSearchProps {
  onLocationSelect?: (location: MapLocation) => void
  placeholder?: string
  className?: string
}

export function LocationSearch({
  onLocationSelect,
  placeholder = "Search for an address or location...",
  className,
}: LocationSearchProps) {
  const [query, setQuery] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<MapLocation[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  // Mock location suggestions
  const mockLocations: MapLocation[] = [
    { lat: 45.5152, lng: -122.6784, address: '123 SW Morrison St', city: 'Portland', state: 'OR' },
    { lat: 47.6062, lng: -122.3321, address: '456 Pine St', city: 'Seattle', state: 'WA' },
    { lat: 37.7749, lng: -122.4194, address: '789 Market St', city: 'San Francisco', state: 'CA' },
    { lat: 39.7392, lng: -104.9903, address: '321 17th St', city: 'Denver', state: 'CO' },
  ]

  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsSearching(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filtered = mockLocations.filter(location =>
        location.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.state?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      setSuggestions(filtered)
      setShowSuggestions(true)
      setIsSearching(false)
    },
    []
  )

  React.useEffect(() => {
    const timeoutId = setTimeout(() => handleSearch(query), 300)
    return () => clearTimeout(timeoutId)
  }, [query, handleSearch])

  const handleLocationClick = (location: MapLocation) => {
    setQuery(location.address || `${location.city}, ${location.state}`)
    setShowSuggestions(false)
    onLocationSelect?.(location)
  }

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border max-h-64 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3"
              onClick={() => handleLocationClick(location)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{location.address}</p>
                <p className="text-xs text-muted-foreground">
                  {location.city}, {location.state}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Map Layer Control Component
interface MapLayerControlProps {
  layers: MapLayer[]
  onLayerToggle?: (layerId: string, visible: boolean) => void
  onLayerOpacityChange?: (layerId: string, opacity: number) => void
  className?: string
}

export function MapLayerControl({
  layers,
  onLayerToggle,
  onLayerOpacityChange,
  className,
}: MapLayerControlProps) {
  const [expandedLayer, setExpandedLayer] = React.useState<string | null>(null)

  const getLayerIcon = (type: MapLayer['type']) => {
    switch (type) {
      case 'markers': return <MapPin className="w-4 h-4" />
      case 'heatmap': return <Target className="w-4 h-4" />
      case 'choropleth': return <Layers className="w-4 h-4" />
      case 'cluster': return <Users className="w-4 h-4" />
      case 'boundaries': return <MapIcon className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  return (
    <Card className={cn("w-64", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Map Layers</CardTitle>
        <CardDescription className="text-xs">
          Control visibility and appearance of map layers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {layers.map((layer) => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getLayerIcon(layer.type)}
                    <span className="text-sm font-medium">{layer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={layer.visible}
                      onCheckedChange={(checked) => onLayerToggle?.(layer.id, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4"
                      onClick={() => setExpandedLayer(
                        expandedLayer === layer.id ? null : layer.id
                      )}
                    >
                      {expandedLayer === layer.id ? (
                        <ChevronRight className="w-3 h-3" />
                      ) : (
                        <ChevronLeft className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedLayer === layer.id && (
                  <div className="ml-6 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Opacity</Label>
                      <Slider
                        value={[layer.opacity * 100]}
                        onValueChange={(value) => 
                          onLayerOpacityChange?.(layer.id, value[0] / 100)
                        }
                        max={100}
                        step={10}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        {Math.round(layer.opacity * 100)}%
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {layer.data.length} items
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Property Info Panel Component
interface PropertyInfoPanelProps {
  property: PropertyMarker | null
  onClose?: () => void
  onFavorite?: (propertyId: string) => void
  onShare?: (propertyId: string) => void
  onViewDetails?: (propertyId: string) => void
  className?: string
}

export function PropertyInfoPanel({
  property,
  onClose,
  onFavorite,
  onShare,
  onViewDetails,
  className,
}: PropertyInfoPanelProps) {
  if (!property) return null

  return (
    <Card className={cn("w-80", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{property.title}</CardTitle>
            <CardDescription className="text-sm">
              {property.location.address}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Property Image */}
        {property.images && property.images.length > 0 && (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              {property.images.length} photos
            </span>
          </div>
        )}

        {/* Price and Status */}
        <div className="flex items-center justify-between">
          {property.price && (
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(property.price)}
            </span>
          )}
          <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
            {property.status}
          </Badge>
        </div>

        {/* Property Details */}
        {(property.bedrooms || property.bathrooms || property.squareFeet) && (
          <div className="grid grid-cols-3 gap-3 text-sm">
            {property.bedrooms && (
              <div className="text-center">
                <p className="font-medium">{property.bedrooms}</p>
                <p className="text-muted-foreground">Bedrooms</p>
              </div>
            )}
            {property.bathrooms && (
              <div className="text-center">
                <p className="font-medium">{property.bathrooms}</p>
                <p className="text-muted-foreground">Bathrooms</p>
              </div>
            )}
            {property.squareFeet && (
              <div className="text-center">
                <p className="font-medium">{property.squareFeet.toLocaleString()}</p>
                <p className="text-muted-foreground">Sq Ft</p>
              </div>
            )}
          </div>
        )}

        {/* Investment Metrics */}
        {(property.roi || property.monthlyIncome || property.appreciation) && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Investment Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {property.roi && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className="font-medium text-green-600">{property.roi}%</span>
                </div>
              )}
              {property.monthlyIncome && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Income:</span>
                  <span className="font-medium">{formatCurrency(property.monthlyIncome)}</span>
                </div>
              )}
              {property.appreciation && (
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Appreciation:</span>
                  <span className="font-medium text-blue-600">{property.appreciation}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Features</h4>
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 6).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{property.features.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={() => onViewDetails?.(property.id)}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onFavorite?.(property.id)}
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShare?.(property.id)}
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>

        {/* Last Updated */}
        {property.lastUpdated && (
          <div className="text-xs text-muted-foreground">
            Updated {formatDate(property.lastUpdated)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Utility function to create mock map data
export function createMockMapData(): {
  viewport: MapViewport
  markers: PropertyMarker[]
  layers: MapLayer[]
} {
  const viewport: MapViewport = {
    center: { lat: 45.5152, lng: -122.6784 }, // Portland, OR
    zoom: 12,
  }

  const markers: PropertyMarker[] = [
    {
      id: 'prop-1',
      location: { lat: 45.5152, lng: -122.6784, address: '123 SW Morrison St, Portland, OR' },
      title: 'Downtown Portland Condo',
      price: 650000,
      type: 'residential',
      status: 'available',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      roi: 8.5,
      monthlyIncome: 3200,
      features: ['Parking', 'Gym', 'Rooftop Deck'],
      images: ['image1.jpg', 'image2.jpg'],
      lastUpdated: new Date(),
    },
    {
      id: 'prop-2',
      location: { lat: 45.5200, lng: -122.6750, address: '456 NW 23rd Ave, Portland, OR' },
      title: 'Pearl District Loft',
      price: 850000,
      type: 'residential',
      status: 'pending',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 900,
      roi: 6.2,
      monthlyIncome: 2800,
      features: ['High Ceilings', 'Exposed Brick', 'Balcony'],
      lastUpdated: new Date(),
    },
    {
      id: 'prop-3',
      location: { lat: 45.5100, lng: -122.6850, address: '789 SE Division St, Portland, OR' },
      title: 'Commercial Retail Space',
      price: 1200000,
      type: 'commercial',
      status: 'available',
      squareFeet: 3500,
      roi: 12.3,
      monthlyIncome: 8500,
      features: ['Street Front', 'High Traffic', 'Parking'],
      lastUpdated: new Date(),
    },
    {
      id: 'prop-4',
      location: { lat: 45.5050, lng: -122.6900, address: '321 SE Hawthorne Blvd, Portland, OR' },
      title: 'Mixed-Use Development',
      price: 2500000,
      type: 'mixed',
      status: 'sold',
      squareFeet: 8500,
      roi: 15.7,
      monthlyIncome: 18500,
      features: ['Retail + Residential', 'New Construction', 'Green Certified'],
      lastUpdated: new Date(),
    },
  ]

  const layers: MapLayer[] = [
    {
      id: 'properties',
      name: 'Properties',
      type: 'markers',
      visible: true,
      opacity: 1.0,
      data: markers,
      interactive: true,
    },
    {
      id: 'price-heatmap',
      name: 'Price Heatmap',
      type: 'heatmap',
      visible: false,
      opacity: 0.6,
      data: [],
    },
    {
      id: 'neighborhoods',
      name: 'Neighborhoods',
      type: 'boundaries',
      visible: false,
      opacity: 0.3,
      data: [],
    },
  ]

  return { viewport, markers, layers }
}