/**
 * Test Page for Property Filters Component
 * 
 * Tests all features of the PropertyFilters component:
 * - Price range sliders
 * - Location multi-select
 * - Property type checkboxes
 * - Mobile sheet modal
 * - Filter state management
 * - All variants
 */

'use client'

import { useState } from 'react'
import { PropertyFilters, type FilterFormValues } from '@/components/custom/property-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Filter, Grid3X3, Smartphone } from 'lucide-react'

export default function TestPropertyFilters() {
  const [sidebarFilters, setSidebarFilters] = useState<FilterFormValues>({})
  const [sheetFilters, setSheetFilters] = useState<FilterFormValues>({})
  const [inlineFilters, setInlineFilters] = useState<FilterFormValues>({})
  
  const [sidebarActiveCount, setSidebarActiveCount] = useState(0)
  const [sheetActiveCount, setSheetActiveCount] = useState(0)
  const [inlineActiveCount, setInlineActiveCount] = useState(0)

  // Helper function to count active filters
  const countActiveFilters = (filters: FilterFormValues): number => {
    let count = 0
    
    if (filters.priceRange && (filters.priceRange[0] !== 50000 || filters.priceRange[1] !== 5000000)) count++
    if (filters.minInvestment && (filters.minInvestment[0] !== 100 || filters.minInvestment[1] !== 50000)) count++
    if (filters.locations && filters.locations.length > 0) count++
    if (filters.propertyTypes && filters.propertyTypes.length > 0) count++
    if (filters.investmentTypes && filters.investmentTypes.length > 0) count++
    if (filters.returnRange && (filters.returnRange[0] !== 5 || filters.returnRange[1] !== 25)) count++
    if (filters.fundingStatus && filters.fundingStatus.length > 0) count++
    if (filters.amenities && filters.amenities.length > 0) count++
    if (filters.yearBuilt && (filters.yearBuilt[0] !== 1950 || filters.yearBuilt[1] !== 2024)) count++
    if (filters.occupancyRate && (filters.occupancyRate[0] !== 70 || filters.occupancyRate[1] !== 100)) count++
    if (filters.verified) count++
    if (filters.featured) count++
    if (filters.newListings) count++
    if (filters.closingSoon) count++
    
    return count
  }

  const handleSidebarFiltersChange = (filters: FilterFormValues) => {
    setSidebarFilters(filters)
    setSidebarActiveCount(countActiveFilters(filters))
    console.log('Sidebar filters changed:', filters)
  }

  const handleSheetFiltersChange = (filters: FilterFormValues) => {
    setSheetFilters(filters)
    setSheetActiveCount(countActiveFilters(filters))
    console.log('Sheet filters changed:', filters)
  }

  const handleInlineFiltersChange = (filters: FilterFormValues) => {
    setInlineFilters(filters)
    setInlineActiveCount(countActiveFilters(filters))
    console.log('Inline filters changed:', filters)
  }

  const handleClearFilters = (variant: string) => {
    toast.success(`${variant} filters cleared`)
  }

  // Format filter values for display
  const formatFilterValue = (key: string, value: any): string => {
    if (!value) return 'None'
    
    switch (key) {
      case 'priceRange':
      case 'minInvestment':
        return `$${value[0]?.toLocaleString()} - $${value[1]?.toLocaleString()}`
      case 'returnRange':
        return `${value[0]}% - ${value[1]}%`
      case 'yearBuilt':
        return `${value[0]} - ${value[1]}`
      case 'occupancyRate':
        return `${value[0]}% - ${value[1]}%`
      case 'locations':
      case 'propertyTypes':
      case 'investmentTypes':
      case 'fundingStatus':
      case 'amenities':
        return Array.isArray(value) ? value.join(', ') : 'None'
      case 'verified':
      case 'featured':
      case 'newListings':
      case 'closingSoon':
        return value ? 'Yes' : 'No'
      default:
        return String(value)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Property Filters Component Test</h1>
        <p className="text-gray-600">
          Testing advanced filtering system with price ranges, location selects, property types, and mobile responsiveness
        </p>
      </div>

      {/* Filter Variants */}
      <Tabs defaultValue="sidebar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sidebar" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Sidebar
          </TabsTrigger>
          <TabsTrigger value="sheet" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile Sheet
          </TabsTrigger>
          <TabsTrigger value="inline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Inline Card
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sidebar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Sidebar Filters
                    <Badge variant="secondary">
                      {sidebarActiveCount} active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <PropertyFilters
                    variant="sidebar"
                    onFiltersChange={handleSidebarFiltersChange}
                    onClearFilters={() => handleClearFilters('Sidebar')}
                    activeFiltersCount={sidebarActiveCount}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Filter Results */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Filter Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(sidebarFilters).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-sm text-gray-600 text-right max-w-xs">
                            {formatFilterValue(key, value)}
                          </span>
                        </div>
                        {key !== Object.keys(sidebarFilters)[Object.keys(sidebarFilters).length - 1] && (
                          <Separator className="mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mock Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Based on your filters, here would be the matching properties:
                  </p>
                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Sample Property {i}</h4>
                          <p className="text-sm text-muted-foreground">
                            Matches {sidebarActiveCount} of your filter criteria
                          </p>
                        </div>
                        <Badge variant="outline">Featured</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sheet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Sheet Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Click the button below to open the mobile sheet filter. This is optimized for mobile devices.
              </p>
              
              <div className="flex items-center gap-4">
                <PropertyFilters
                  variant="sheet"
                  onFiltersChange={handleSheetFiltersChange}
                  onClearFilters={() => handleClearFilters('Sheet')}
                  activeFiltersCount={sheetActiveCount}
                />
                
                <Badge variant="secondary">
                  {sheetActiveCount} filters active
                </Badge>
              </div>

              {/* Sheet Filter Values */}
              {Object.keys(sheetFilters).length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Sheet Filter Values:</h3>
                  <div className="space-y-2">
                    {Object.entries(sheetFilters).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-gray-600">
                          {formatFilterValue(key, value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PropertyFilters
              variant="inline"
              onFiltersChange={handleInlineFiltersChange}
              onClearFilters={() => handleClearFilters('Inline')}
              activeFiltersCount={inlineActiveCount}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Inline Filter State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Filters:</span>
                    <Badge variant="secondary">
                      {inlineActiveCount}
                    </Badge>
                  </div>
                  
                  {Object.keys(inlineFilters).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(inlineFilters).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                          </span>
                          <span className="text-gray-600">
                            {formatFilterValue(key, value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No filters applied yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Sidebar Variant</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full-featured filter sidebar</li>
                <li>• Collapsible sections</li>
                <li>• Real-time filter updates</li>
                <li>• Active filter counting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mobile Sheet</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full-screen mobile modal</li>
                <li>• Touch-optimized controls</li>
                <li>• Slide-in animation</li>
                <li>• Easy close actions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Inline Card</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Embeddable card format</li>
                <li>• Compact design</li>
                <li>• Same functionality</li>
                <li>• Flexible placement</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Features to Test</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Price range sliders</li>
                <li>• Multi-select locations</li>
                <li>• Property type checkboxes</li>
                <li>• Investment type options</li>
                <li>• Return range slider</li>
              </ul>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Funding status filters</li>
                <li>• Amenities selection</li>
                <li>• Quick filter toggles</li>
                <li>• Sort options</li>
                <li>• Clear all filters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}