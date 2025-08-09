/**
 * Property Grid Component - PropertyChain
 * 
 * Responsive grid layout for displaying property cards
 * Implements virtual scrolling for performance with large datasets
 * Following UpdatedUIPlan.md specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building, 
  Filter, 
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react'

import { PropertyCard, type PropertyCardData } from './property-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'

/**
 * Property type definition - extends PropertyCardData for compatibility
 */
export interface Property extends PropertyCardData {
  trending?: boolean
  new?: boolean
  closingSoon?: boolean
}

/**
 * PropertyGrid component props
 */
export interface PropertyGridProps {
  properties?: Property[]
  loading?: boolean
  error?: string | null
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  enableVirtualization?: boolean
  showFilters?: boolean
  showSort?: boolean
  initialFilter?: 'all' | 'featured' | 'trending' | 'new' | 'closing'
  onPropertyClick?: (property: Property) => void
  onFilterChange?: (filter: string) => void
  onSortChange?: (sort: string) => void
  className?: string
}

/**
 * Sort options configuration
 */
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'return-desc', label: 'Highest Returns' },
  { value: 'funding-desc', label: 'Most Funded' },
  { value: 'closing-soon', label: 'Closing Soon' },
  { value: 'newest', label: 'Newest First' },
]

/**
 * Filter tabs configuration
 */
const FILTER_TABS = [
  { value: 'all', label: 'All Properties', icon: Building },
  { value: 'featured', label: 'Featured', icon: Sparkles },
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'new', label: 'New', icon: Sparkles },
  { value: 'closing', label: 'Closing Soon', icon: Clock },
]

/**
 * Empty state component
 */
function EmptyState({ 
  filter, 
  onClearFilter 
}: { 
  filter: string
  onClearFilter: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Empty state illustration placeholder */}
      <div className="w-64 h-64 mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <Building className="w-24 h-24 text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Properties Found
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">
        {filter === 'all' 
          ? "There are no properties available at this time. Check back soon for new investment opportunities."
          : `No properties match the "${filter}" filter. Try adjusting your filters or browse all properties.`
        }
      </p>
      
      {filter !== 'all' && (
        <Button
          variant="outline"
          onClick={onClearFilter}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}
    </motion.div>
  )
}

/**
 * Loading skeleton component
 */
function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Main PropertyGrid Component
 * Following Section 4 specifications:
 * - 3 columns desktop, 2 tablet, 1 mobile
 * - Virtual scrolling for performance
 * - Loading states with skeletons
 * - Empty state with illustration
 * - Filter tabs and sort options
 */
export function PropertyGrid({
  properties = [],
  loading = false,
  error = null,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  enableVirtualization = false,
  showFilters = true,
  showSort = true,
  initialFilter = 'all',
  onPropertyClick,
  onFilterChange,
  onSortChange,
  className,
}: PropertyGridProps) {
  const [activeFilter, setActiveFilter] = React.useState(initialFilter)
  const [sortBy, setSortBy] = React.useState('featured')
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Filter properties based on active filter
  const filteredProperties = React.useMemo(() => {
    if (activeFilter === 'all') return properties
    
    return properties.filter(property => {
      switch (activeFilter) {
        case 'featured':
          return property.featured
        case 'trending':
          return property.trending
        case 'new':
          return property.new
        case 'closing':
          return property.closingSoon || (property.daysLeft !== undefined && property.daysLeft <= 7)
        default:
          return true
      }
    })
  }, [properties, activeFilter])

  // Sort properties
  const sortedProperties = React.useMemo(() => {
    const sorted = [...filteredProperties]
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'return-desc':
        return sorted.sort((a, b) => (b.annualReturn ?? 0) - (a.annualReturn ?? 0))
      case 'funding-desc':
        return sorted.sort((a, b) => (b.fundingProgress ?? 0) - (a.fundingProgress ?? 0))
      case 'closing-soon':
        return sorted.sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999))
      case 'newest':
        return sorted.sort((a, b) => b.id.localeCompare(a.id))
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
    }
  }, [filteredProperties, sortBy])

  // Virtual scrolling setup for large datasets
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(sortedProperties.length / columns.desktop!),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimated height of property card
    overscan: 2,
  })

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter as typeof activeFilter)
    onFilterChange?.(filter)
  }

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    onSortChange?.(sort)
  }

  // Handle clear filter
  const handleClearFilter = () => {
    setActiveFilter('all')
    onFilterChange?.('all')
  }

  // Grid classes based on columns configuration
  const gridClasses = cn(
    'grid gap-6',
    columns.mobile === 1 && 'grid-cols-1',
    columns.tablet === 2 && 'md:grid-cols-2',
    columns.desktop === 3 && 'lg:grid-cols-3',
    columns.desktop === 4 && 'xl:grid-cols-4',
  )

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Properties
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with filters and sort */}
      {(showFilters || showSort) && (
        <div className="space-y-4">
          {/* Filter tabs */}
          {showFilters && (
            <Tabs 
              value={activeFilter} 
              onValueChange={handleFilterChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
                {FILTER_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="gap-2 data-[state=active]:bg-[#007BFF] data-[state=active]:text-white"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Results count and sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                {sortedProperties.length} {sortedProperties.length === 1 ? 'Property' : 'Properties'}
              </Badge>
              {activeFilter !== 'all' && (
                <Badge variant="outline" className="px-3 py-1">
                  <Filter className="w-3 h-3 mr-1" />
                  {FILTER_TABS.find(tab => tab.value === activeFilter)?.label}
                </Badge>
              )}
            </div>

            {showSort && (
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      {/* Property grid with loading and empty states */}
      {loading ? (
        <div className={gridClasses}>
          <LoadingSkeleton count={columns.desktop! * 2} />
        </div>
      ) : sortedProperties.length === 0 ? (
        <EmptyState filter={activeFilter} onClearFilter={handleClearFilter} />
      ) : enableVirtualization && sortedProperties.length > 20 ? (
        // Virtual scrolling for large datasets
        <div
          ref={parentRef}
          className="h-[800px] overflow-auto"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIndex = virtualRow.index * columns.desktop!
              const endIndex = Math.min(
                startIndex + columns.desktop!,
                sortedProperties.length
              )
              const rowProperties = sortedProperties.slice(startIndex, endIndex)

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className={gridClasses}>
                    {rowProperties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => onPropertyClick?.(property)}
                        className="cursor-pointer"
                      >
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        // Standard grid layout with animations
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + sortBy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={gridClasses}
          >
            {sortedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onPropertyClick?.(property)}
                className="cursor-pointer"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

/**
 * Export variant for list view
 */
export function PropertyList(props: PropertyGridProps) {
  return (
    <PropertyGrid
      {...props}
      columns={{ mobile: 1, tablet: 1, desktop: 1 }}
    />
  )
}