/**
 * Property-Specific Search Components - PropertyChain
 * 
 * Specialized search functionality for real estate properties
 */

'use client'

import * as React from 'react'
import { SearchBar, AdvancedSearch, SearchResults, InstantSearch } from './search'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatNumber } from '@/lib/format'
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Home,
  Filter,
  TrendingUp,
  Calendar,
  Users,
  Bed,
  Bath,
  Square,
  Car,
  Trees,
  Mountain,
  Waves,
  Building,
  Factory,
  Landmark,
  Map,
  Navigation,
  ChevronDown,
  X,
  Check,
  Plus,
  Minus,
  Clock,
} from 'lucide-react'

// Property search filters
export interface PropertyFilters {
  propertyType?: string[]
  priceRange?: { min: number; max: number }
  location?: {
    city?: string
    state?: string
    zip?: string
    radius?: number
  }
  features?: {
    bedrooms?: { min: number; max: number }
    bathrooms?: { min: number; max: number }
    sqft?: { min: number; max: number }
    yearBuilt?: { min: number; max: number }
    parking?: number
  }
  amenities?: string[]
  investmentCriteria?: {
    minROI?: number
    maxHOA?: number
    cashFlowPositive?: boolean
    tokenized?: boolean
  }
  status?: string[]
  sortBy?: string
}

// Property Search Component - Simplified
interface PropertySearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PropertySearch({
  value,
  onChange,
  placeholder = "Search properties...",
  className,
}: PropertySearchProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [recentSearches] = React.useState([
    'New York luxury apartments',
    'Miami beachfront',
    'Commercial properties Chicago',
    'Under $500k residential',
  ])
  
  const [suggestions] = React.useState([
    'Manhattan condos',
    'Brooklyn townhouses',
    'Queens single family',
    'Bronx multi-family',
  ])

  const showDropdown = isFocused && (value.length === 0 || value.length > 2)

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown with suggestions and recent searches */}
      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-0">
            {value.length === 0 ? (
              <>
                {/* Recent Searches */}
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors"
                        onClick={() => onChange(search)}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Search Suggestions */}
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <TrendingUp className="h-3 w-3" />
                    Suggestions
                  </div>
                  <div className="space-y-1">
                    {suggestions
                      .filter(s => s.toLowerCase().includes(value.toLowerCase()))
                      .slice(0, 5)
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors"
                          onClick={() => onChange(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Property Search Bar with Quick Filters
interface PropertySearchBarProps {
  onSearch?: (query: string, filters: PropertyFilters) => void
  className?: string
}

export function PropertySearchBar({
  onSearch,
  className,
}: PropertySearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [propertyType, setPropertyType] = React.useState<string>('all')
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000000])
  const [location, setLocation] = React.useState('')

  const handleSearch = () => {
    const filters: PropertyFilters = {
      propertyType: propertyType !== 'all' ? [propertyType] : undefined,
      priceRange: { min: priceRange[0], max: priceRange[1] },
      location: location ? { city: location } : undefined,
    }
    onSearch?.(query, filters)
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-4">
        {/* Main Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1">
            <PropertySearch
              value={query}
              onChange={setQuery}
              placeholder="Search by address, neighborhood, city, or ZIP..."
            />
          </div>
          <Button size="lg" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label className="text-xs">Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Location</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or ZIP"
                className="pl-9"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Label className="text-xs">
              Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange as any}
              min={0}
              max={5000000}
              step={50000}
              className="mt-3"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

// Advanced Property Filters
interface PropertyFiltersProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  className?: string
}

export function PropertyFiltersPanel({
  filters,
  onChange,
  className,
}: PropertyFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  const updateFeature = (feature: string, value: any) => {
    onChange({
      ...filters,
      features: {
        ...filters.features,
        [feature]: value,
      },
    })
  }

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || []
    onChange({
      ...filters,
      amenities: current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity],
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
        <CardDescription>Refine your property search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Property Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'house', label: 'House', icon: <Home className="h-4 w-4" /> },
              { value: 'condo', label: 'Condo', icon: <Building className="h-4 w-4" /> },
              { value: 'townhouse', label: 'Townhouse', icon: <Building2 className="h-4 w-4" /> },
              { value: 'multi-family', label: 'Multi-Family', icon: <Users className="h-4 w-4" /> },
              { value: 'commercial', label: 'Commercial', icon: <Landmark className="h-4 w-4" /> },
              { value: 'land', label: 'Land', icon: <Trees className="h-4 w-4" /> },
            ].map((type) => (
              <label
                key={type.value}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors',
                  filters.propertyType?.includes(type.value)
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent'
                )}
              >
                <input
                  type="checkbox"
                  checked={filters.propertyType?.includes(type.value)}
                  onChange={(e) => {
                    const types = filters.propertyType || []
                    updateFilter(
                      'propertyType',
                      e.target.checked
                        ? [...types, type.value]
                        : types.filter(t => t !== type.value)
                    )
                  }}
                  className="sr-only"
                />
                {type.icon}
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Min Price</Label>
              <Input
                type="number"
                placeholder="$0"
                value={filters.priceRange?.min || ''}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  min: Number(e.target.value),
                })}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max Price</Label>
              <Input
                type="number"
                placeholder="No max"
                value={filters.priceRange?.max || ''}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  max: Number(e.target.value),
                })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Features</Label>
          <div className="space-y-3">
            {/* Bedrooms */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Bedrooms</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFeature('bedrooms', {
                    ...filters.features?.bedrooms,
                    min: Math.max(0, (filters.features?.bedrooms?.min || 0) - 1),
                  })}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center text-sm">
                  {filters.features?.bedrooms?.min || 0}+
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFeature('bedrooms', {
                    ...filters.features?.bedrooms,
                    min: (filters.features?.bedrooms?.min || 0) + 1,
                  })}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Bathrooms</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFeature('bathrooms', {
                    ...filters.features?.bathrooms,
                    min: Math.max(0, (filters.features?.bathrooms?.min || 0) - 1),
                  })}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center text-sm">
                  {filters.features?.bathrooms?.min || 0}+
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFeature('bathrooms', {
                    ...filters.features?.bathrooms,
                    min: (filters.features?.bathrooms?.min || 0) + 1,
                  })}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Square Feet */}
            <div>
              <Label className="text-xs text-muted-foreground">Square Feet</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.features?.sqft?.min || ''}
                  onChange={(e) => updateFeature('sqft', {
                    ...filters.features?.sqft,
                    min: Number(e.target.value),
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.features?.sqft?.max || ''}
                  onChange={(e) => updateFeature('sqft', {
                    ...filters.features?.sqft,
                    max: Number(e.target.value),
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Amenities */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Pool',
              'Garage',
              'Garden',
              'Gym',
              'Security',
              'Elevator',
              'Balcony',
              'Fireplace',
              'Storage',
              'Parking',
            ].map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities?.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded"
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Investment Criteria */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Investment Criteria</Label>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Minimum ROI (%)</Label>
              <Input
                type="number"
                placeholder="e.g., 8"
                value={filters.investmentCriteria?.minROI || ''}
                onChange={(e) => onChange({
                  ...filters,
                  investmentCriteria: {
                    ...filters.investmentCriteria,
                    minROI: Number(e.target.value),
                  },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Cash Flow Positive</Label>
              <Switch
                checked={filters.investmentCriteria?.cashFlowPositive}
                onCheckedChange={(checked) => onChange({
                  ...filters,
                  investmentCriteria: {
                    ...filters.investmentCriteria,
                    cashFlowPositive: checked,
                  },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Tokenized Only</Label>
              <Switch
                checked={filters.investmentCriteria?.tokenized}
                onCheckedChange={(checked) => onChange({
                  ...filters,
                  investmentCriteria: {
                    ...filters.investmentCriteria,
                    tokenized: checked,
                  },
                })}
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onChange({})}
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}

// Map-based Property Search
interface MapSearchProps {
  onBoundsChange?: (bounds: {
    north: number
    south: number
    east: number
    west: number
  }) => void
  properties?: {
    id: string
    lat: number
    lng: number
    price: number
    type: string
  }[]
  className?: string
}

export function MapSearch({
  onBoundsChange,
  properties = [],
  className,
}: MapSearchProps) {
  const [drawMode, setDrawMode] = React.useState<'pan' | 'draw'>('pan')
  const [selectedArea, setSelectedArea] = React.useState<any>(null)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Map Search</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={drawMode === 'pan' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDrawMode('pan')}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Pan
            </Button>
            <Button
              variant={drawMode === 'draw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDrawMode('draw')}
            >
              <Square className="mr-2 h-4 w-4" />
              Draw Area
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Map integration would go here
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {properties.length} properties in view
            </p>
          </div>
        </div>
        {selectedArea && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Selected Area</p>
            <p className="text-xs text-muted-foreground">
              Click "Search This Area" to find properties
            </p>
            <Button className="w-full mt-2" size="sm">
              Search This Area
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Saved Searches Component
interface SavedSearch {
  id: string
  name: string
  query: string
  filters: PropertyFilters
  frequency?: 'daily' | 'weekly' | 'instant'
  lastRun?: Date
  newResults?: number
}

interface SavedSearchesProps {
  searches: SavedSearch[]
  onRun?: (search: SavedSearch) => void
  onDelete?: (id: string) => void
  onEdit?: (search: SavedSearch) => void
  className?: string
}

export function SavedSearches({
  searches,
  onRun,
  onDelete,
  onEdit,
  className,
}: SavedSearchesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Saved Searches</CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Search
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {searches.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No saved searches yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((search) => (
              <div
                key={search.id}
                className="flex items-start justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{search.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {search.query || 'All properties'}
                      </p>
                      {search.filters.propertyType && (
                        <div className="flex gap-1 mt-2">
                          {search.filters.propertyType.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {search.newResults && search.newResults > 0 && (
                      <Badge className="ml-2">
                        {search.newResults} new
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {search.frequency && (
                      <span>Updates: {search.frequency}</span>
                    )}
                    {search.lastRun && (
                      <span>Last run: {new Date(search.lastRun).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRun?.(search)}
                  >
                    Run
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(search)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(search.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Property Search Results with Map Toggle
interface PropertySearchResultsProps {
  results: any[]
  loading?: boolean
  view?: 'list' | 'grid' | 'map'
  onViewChange?: (view: 'list' | 'grid' | 'map') => void
  className?: string
}

export function PropertySearchResults({
  results,
  loading = false,
  view = 'list',
  onViewChange,
  className,
}: PropertySearchResultsProps) {
  return (
    <div className={className}>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {results.length} properties found
        </p>
        <Tabs value={view} onValueChange={onViewChange as any}>
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results Display */}
      {view === 'map' ? (
        <MapSearch properties={results} />
      ) : (
        <SearchResults
          results={results}
          loading={loading}
          variant={view as any}
        />
      )}
    </div>
  )
}