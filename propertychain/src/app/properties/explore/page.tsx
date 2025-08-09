/**
 * Property Exploration Page - PropertyChain
 * 
 * Advanced property discovery system with multiple views,
 * filtering, search, and comparison features
 * Following RECOVERY_PLAN.md Step 1.3 specifications
 */

'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyCard, PropertyCardSkeleton } from '@/components/custom/property-card'
import { PropertyListItem } from '@/components/custom/property-list-item'
import { PropertyMap } from '@/components/custom/property-map'
import { PropertyComparison } from '@/components/custom/property-comparison'
import { PropertySearch } from '@/components/custom/property-search'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll'
import { useSavedSearches } from '@/lib/hooks/use-saved-searches'
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  Map,
  X,
  ChevronDown,
  Save,
  Bell,
  Loader2,
  MapPin,
  DollarSign,
  TrendingUp,
  Building,
  Home,
  Check,
  AlertCircle,
  Sparkles,
  Clock,
  Users,
  BarChart3,
  GitCompare,
} from 'lucide-react'
import { toast } from 'sonner'

// ============================================================================
// Types
// ============================================================================

type ViewMode = 'grid' | 'list' | 'map'

type SortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'roi_desc' 
  | 'newest' 
  | 'deadline'
  | 'funding_progress'
  | 'investors'

type PropertyType = 
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'hospitality'
  | 'mixed-use'
  | 'land'

interface FilterState {
  priceRange: [number, number]
  propertyTypes: PropertyType[]
  locations: string[]
  minROI: number
  investmentRange: [number, number]
  status: ('funding' | 'funded' | 'upcoming')[]
  amenities: string[]
}

// ============================================================================
// Mock Data
// ============================================================================

const generateMockProperties = (count: number) => {
  const properties = []
  const cities = ['New York', 'San Francisco', 'Miami', 'Chicago', 'Austin', 'Boston', 'Seattle', 'Denver']
  const types = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Mixed-Use']
  const statuses = ['funding', 'funded', 'upcoming'] as const
  
  for (let i = 1; i <= count; i++) {
    properties.push({
      id: `prop-${i}`,
      title: `Property ${i} - ${types[i % types.length]}`,
      location: `${cities[i % cities.length]}, ${['NY', 'CA', 'FL', 'IL', 'TX', 'MA', 'WA', 'CO'][i % 8]}`,
      price: 500000 + (i * 100000),
      tokenPrice: 100 + (i * 10),
      minInvestment: 100,
      targetFunding: 1000000 + (i * 50000),
      currentFunding: (1000000 + (i * 50000)) * (0.2 + (i % 8) * 0.1),
      expectedReturn: 8 + (i % 5),
      returnPeriod: 'Annual',
      propertyType: types[i % types.length],
      beds: 2 + (i % 4),
      baths: 1 + (i % 3),
      sqft: 1000 + (i * 100),
      investors: 50 + (i * 5),
      daysLeft: 30 - (i % 25),
      status: statuses[i % 3],
      featured: i % 7 === 0,
      verified: i % 3 !== 0,
      image: `https://images.unsplash.com/photo-${1560518883 + i}-cc1a3fa10c00?w=800&h=600&fit=crop`,
      coordinates: {
        lat: 40.7128 + (i % 10) * 0.1,
        lng: -74.0060 + (i % 10) * 0.1,
      },
      amenities: ['Parking', 'Pool', 'Gym', 'Security'].slice(0, 2 + (i % 3)),
      yearBuilt: 2010 + (i % 14),
      description: `Modern ${types[i % types.length].toLowerCase()} property with excellent investment potential.`,
    })
  }
  
  return properties
}

const allProperties = generateMockProperties(150)

// ============================================================================
// Property Exploration Component
// ============================================================================

export default function PropertyExplorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State Management
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid')
  const [properties, setProperties] = React.useState(allProperties.slice(0, 12))
  const [loading, setLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortBy, setSortBy] = React.useState<SortOption>('newest')
  const [showFilters, setShowFilters] = React.useState(false)
  const [compareMode, setCompareMode] = React.useState(false)
  const [selectedForCompare, setSelectedForCompare] = React.useState<string[]>([])
  
  // Filter State
  const [filters, setFilters] = React.useState<FilterState>({
    priceRange: [0, 5000000],
    propertyTypes: [],
    locations: [],
    minROI: 0,
    investmentRange: [100, 100000],
    status: [],
    amenities: [],
  })
  
  // Applied filters for display
  const [appliedFilters, setAppliedFilters] = React.useState<FilterState>(filters)
  
  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // Custom hooks
  const { savedSearches, saveSearch, removeSavedSearch } = useSavedSearches()
  
  // Load more properties on scroll
  const loadMoreProperties = React.useCallback(() => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const nextPage = page + 1
      const startIdx = nextPage * 12
      const endIdx = startIdx + 12
      const newProperties = allProperties.slice(startIdx, endIdx)
      
      if (newProperties.length === 0) {
        setHasMore(false)
      } else {
        setProperties(prev => [...prev, ...newProperties])
        setPage(nextPage)
      }
      
      setLoading(false)
    }, 1000)
  }, [loading, hasMore, page])
  
  // Infinite scroll hook
  const { targetRef } = useInfiniteScroll(loadMoreProperties, {
    threshold: 0.8,
    enabled: hasMore && !loading && viewMode !== 'map',
  })
  
  // Apply filters
  const applyFilters = () => {
    setAppliedFilters(filters)
    setProperties(allProperties.slice(0, 12)) // Reset and filter
    setPage(1)
    setHasMore(true)
    setShowFilters(false)
    toast.success('Filters applied')
  }
  
  // Clear filters
  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, 5000000],
      propertyTypes: [],
      locations: [],
      minROI: 0,
      investmentRange: [100, 100000],
      status: [],
      amenities: [],
    }
    setFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
    setProperties(allProperties.slice(0, 12))
    setPage(1)
    setHasMore(true)
    toast.info('Filters cleared')
  }
  
  // Sort properties
  React.useEffect(() => {
    const sorted = [...properties].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'roi_desc':
          return b.expectedReturn - a.expectedReturn
        case 'newest':
          return b.yearBuilt - a.yearBuilt
        case 'deadline':
          return a.daysLeft - b.daysLeft
        case 'funding_progress':
          return (b.currentFunding / b.targetFunding) - (a.currentFunding / a.targetFunding)
        case 'investors':
          return b.investors - a.investors
        default:
          return 0
      }
    })
    setProperties(sorted)
  }, [sortBy])
  
  // Search effect
  React.useEffect(() => {
    if (debouncedSearch) {
      const filtered = allProperties.filter(p => 
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.propertyType.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      setProperties(filtered.slice(0, 12))
      setPage(1)
      setHasMore(filtered.length > 12)
    } else {
      setProperties(allProperties.slice(0, 12))
      setPage(1)
      setHasMore(true)
    }
  }, [debouncedSearch])
  
  // Toggle property comparison
  const toggleCompare = (propertyId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId)
      }
      if (prev.length >= 4) {
        toast.error('Maximum 4 properties can be compared')
        return prev
      }
      return [...prev, propertyId]
    })
  }
  
  // Active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 5000000) count++
    if (appliedFilters.propertyTypes.length > 0) count++
    if (appliedFilters.locations.length > 0) count++
    if (appliedFilters.minROI > 0) count++
    if (appliedFilters.investmentRange[0] > 100 || appliedFilters.investmentRange[1] < 100000) count++
    if (appliedFilters.status.length > 0) count++
    if (appliedFilters.amenities.length > 0) count++
    return count
  }, [appliedFilters])
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <PropertySearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by location, property type, or keyword..."
                className="w-full"
              />
            </div>
            
            {/* View Mode Tabs */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="grid grid-cols-3 w-[240px]">
                <TabsTrigger value="grid" className="gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="roi_desc">Highest ROI</SelectItem>
                  <SelectItem value="deadline">Ending Soon</SelectItem>
                  <SelectItem value="funding_progress">Most Funded</SelectItem>
                  <SelectItem value="investors">Most Investors</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filter Button (Mobile Sheet) */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Filter Properties</SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    onApply={applyFilters}
                    onClear={clearFilters}
                  />
                </SheetContent>
              </Sheet>
              
              {/* Compare Button */}
              <Button
                variant={compareMode ? "default" : "outline"}
                onClick={() => {
                  setCompareMode(!compareMode)
                  if (compareMode) {
                    setSelectedForCompare([])
                  }
                }}
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
                {selectedForCompare.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedForCompare.length}
                  </Badge>
                )}
              </Button>
              
              {/* Save Search */}
              <Button
                variant="outline"
                onClick={() => {
                  const searchData = {
                    query: searchQuery,
                    filters: appliedFilters,
                    sortBy,
                  }
                  saveSearch(searchData)
                  toast.success('Search saved! You\'ll be notified of new matches.')
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Save</span>
              </Button>
            </div>
          </div>
          
          {/* Results Count & Active Filters */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {properties.length} properties found
              </span>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2">
                  <Separator orientation="vertical" className="h-4" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 text-xs"
                  >
                    Clear filters
                    <X className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Compare Mode Indicator */}
            {compareMode && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">
                  Select up to 4 properties to compare
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Comparison Panel */}
        {compareMode && selectedForCompare.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <PropertyComparison
              propertyIds={selectedForCompare}
              onClose={() => {
                setCompareMode(false)
                setSelectedForCompare([])
              }}
            />
          </motion.div>
        )}
        
        {/* View Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  {compareMode && (
                    <div className="absolute top-4 right-4 z-10">
                      <Checkbox
                        checked={selectedForCompare.includes(property.id)}
                        onCheckedChange={() => toggleCompare(property.id)}
                        className="bg-white border-2"
                      />
                    </div>
                  )}
                  <PropertyCard
                    property={property}
                    variant="default"
                  />
                </div>
              ))}
              
              {/* Loading Skeleton */}
              {loading && (
                <>
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                  <PropertyCardSkeleton />
                </>
              )}
            </motion.div>
          )}
          
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {properties.map((property) => (
                <PropertyListItem
                  key={property.id}
                  property={property}
                  compareMode={compareMode}
                  selected={selectedForCompare.includes(property.id)}
                  onToggleCompare={() => toggleCompare(property.id)}
                />
              ))}
              
              {/* Loading */}
              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}
            </motion.div>
          )}
          
          {viewMode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-280px)]"
            >
              <PropertyMap
                properties={properties}
                onPropertyClick={(id) => router.push(`/properties/${id}`)}
                compareMode={compareMode}
                selectedForCompare={selectedForCompare}
                onToggleCompare={toggleCompare}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Infinite Scroll Target */}
        {viewMode !== 'map' && hasMore && (
          <div ref={targetRef} className="h-20 flex items-center justify-center">
            {loading && <Loader2 className="h-8 w-8 animate-spin text-gray-400" />}
          </div>
        )}
        
        {/* No More Results */}
        {!hasMore && properties.length > 0 && viewMode !== 'map' && (
          <div className="text-center py-8">
            <p className="text-gray-500">No more properties to load</p>
          </div>
        )}
        
        {/* Empty State */}
        {properties.length === 0 && !loading && (
          <div className="text-center py-16">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Filter Panel Component
// ============================================================================

interface FilterPanelProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  onApply: () => void
  onClear: () => void
}

function FilterPanel({ filters, setFilters, onApply, onClear }: FilterPanelProps) {
  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4">
      <div className="space-y-6 py-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Price Range
          </Label>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))
              }
              min={0}
              max={5000000}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0].toLocaleString()}</span>
              <span>${filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Property Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Property Type
          </Label>
          <div className="space-y-2">
            {[
              { value: 'residential', label: 'Residential', icon: Home },
              { value: 'commercial', label: 'Commercial', icon: Building },
              { value: 'industrial', label: 'Industrial', icon: Building },
              { value: 'hospitality', label: 'Hospitality', icon: Building },
              { value: 'mixed-use', label: 'Mixed-Use', icon: Building },
            ].map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.propertyTypes.includes(type.value as PropertyType)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      propertyTypes: checked
                        ? [...prev.propertyTypes, type.value as PropertyType]
                        : prev.propertyTypes.filter(t => t !== type.value)
                    }))
                  }}
                />
                <Label
                  htmlFor={type.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Minimum ROI */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Minimum ROI (%)
          </Label>
          <div className="space-y-4">
            <Slider
              value={[filters.minROI]}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, minROI: value[0] }))
              }
              min={0}
              max={20}
              step={0.5}
              className="w-full"
            />
            <div className="text-sm text-gray-600">
              {filters.minROI}% or higher
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Investment Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Investment Amount
          </Label>
          <div className="space-y-4">
            <Slider
              value={filters.investmentRange}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, investmentRange: value as [number, number] }))
              }
              min={100}
              max={100000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.investmentRange[0].toLocaleString()}</span>
              <span>${filters.investmentRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Funding Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Funding Status
          </Label>
          <div className="space-y-2">
            {[
              { value: 'funding', label: 'Currently Funding', color: 'text-green-600' },
              { value: 'funded', label: 'Fully Funded', color: 'text-blue-600' },
              { value: 'upcoming', label: 'Coming Soon', color: 'text-amber-600' },
            ].map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={status.value}
                  checked={filters.status.includes(status.value as any)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      status: checked
                        ? [...prev.status, status.value as any]
                        : prev.status.filter(s => s !== status.value)
                    }))
                  }}
                />
                <Label
                  htmlFor={status.value}
                  className={cn("cursor-pointer", status.color)}
                >
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onClear} variant="outline" className="flex-1">
            Clear All
          </Button>
          <Button onClick={onApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}