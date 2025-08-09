/**
 * Test Page for Property Grid Component
 * 
 * Tests all features of the PropertyGrid component:
 * - Responsive grid layout
 * - Virtual scrolling
 * - Filtering and sorting
 * - Loading states
 * - Empty states
 */

'use client'

import { useState } from 'react'
import { PropertyGrid, type Property } from '@/components/custom/property-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Generate mock properties
function generateMockProperties(count: number): Property[] {
  const statuses: Property['status'][] = ['funding', 'funded', 'closed', 'upcoming']
  const types = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Mixed-Use']
  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `property-${i + 1}`,
    title: `Property ${i + 1} - ${types[Math.floor(Math.random() * types.length)]}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    price: Math.floor(Math.random() * 4000000) + 500000,
    tokenPrice: Math.floor(Math.random() * 400) + 100,
    tokensAvailable: Math.floor(Math.random() * 10000) + 1000,
    totalTokens: 10000,
    annualReturn: Math.random() * 15 + 5,
    monthlyYield: Math.random() * 1.5 + 0.5,
    image: `https://images.unsplash.com/photo-${1486406146926 + i}-c627a92ad1ab?w=800&h=600&fit=crop`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    fundingProgress: Math.floor(Math.random() * 100),
    investors: Math.floor(Math.random() * 500) + 50,
    daysLeft: Math.floor(Math.random() * 30),
    featured: i < 3,
    trending: i >= 3 && i < 6,
    new: i >= 6 && i < 9,
    closingSoon: Math.random() > 0.7,
  }))
}

export default function TestPropertyGrid() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enableVirtualization, setEnableVirtualization] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [showSort, setShowSort] = useState(true)
  const [propertyCount, setPropertyCount] = useState(12)
  const [columns, setColumns] = useState({ mobile: 1, tablet: 2, desktop: 3 })

  const mockProperties = generateMockProperties(propertyCount)

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property)
    alert(`Clicked: ${property.title}`)
  }

  const handleFilterChange = (filter: string) => {
    console.log('Filter changed:', filter)
  }

  const handleSortChange = (sort: string) => {
    console.log('Sort changed:', sort)
  }

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const simulateError = () => {
    setError('Failed to load properties. Please try again later.')
    setTimeout(() => setError(null), 3000)
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Property Grid Component Test</h1>
        <p className="text-gray-600">
          Testing responsive grid layout, virtual scrolling, filtering, and sorting capabilities
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grid Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Number of Properties</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPropertyCount(6)}
                >
                  6
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPropertyCount(12)}
                >
                  12
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPropertyCount(50)}
                >
                  50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPropertyCount(100)}
                >
                  100
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Desktop Columns</Label>
              <div className="flex gap-2">
                <Button
                  variant={columns.desktop === 2 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setColumns({ ...columns, desktop: 2 })}
                >
                  2
                </Button>
                <Button
                  variant={columns.desktop === 3 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setColumns({ ...columns, desktop: 3 })}
                >
                  3
                </Button>
                <Button
                  variant={columns.desktop === 4 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setColumns({ ...columns, desktop: 4 })}
                >
                  4
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>States</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateLoading}
                >
                  Loading
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateError}
                >
                  Error
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPropertyCount(0)}
                >
                  Empty
                </Button>
              </div>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="virtualization"
                checked={enableVirtualization}
                onCheckedChange={setEnableVirtualization}
              />
              <Label htmlFor="virtualization">Virtual Scrolling</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="filters"
                checked={showFilters}
                onCheckedChange={setShowFilters}
              />
              <Label htmlFor="filters">Show Filters</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sort"
                checked={showSort}
                onCheckedChange={setShowSort}
              />
              <Label htmlFor="sort">Show Sort</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Grid Tests */}
      <Tabs defaultValue="default" className="space-y-4">
        <TabsList>
          <TabsTrigger value="default">Default View</TabsTrigger>
          <TabsTrigger value="no-filters">No Filters</TabsTrigger>
          <TabsTrigger value="no-sort">No Sort</TabsTrigger>
          <TabsTrigger value="minimal">Minimal</TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGrid
                properties={propertyCount > 0 ? mockProperties : []}
                loading={loading}
                error={error}
                columns={columns}
                enableVirtualization={enableVirtualization}
                showFilters={showFilters}
                showSort={showSort}
                onPropertyClick={handlePropertyClick}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="no-filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Without Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGrid
                properties={mockProperties}
                showFilters={false}
                showSort={true}
                columns={columns}
                onPropertyClick={handlePropertyClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="no-sort" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Without Sort</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGrid
                properties={mockProperties}
                showFilters={true}
                showSort={false}
                columns={columns}
                onPropertyClick={handlePropertyClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minimal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minimal (No Controls)</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyGrid
                properties={mockProperties}
                showFilters={false}
                showSort={false}
                columns={columns}
                onPropertyClick={handlePropertyClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Test */}
      {propertyCount >= 50 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Test ({propertyCount} Properties)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {enableVirtualization 
                ? 'Virtual scrolling enabled - Only visible items are rendered'
                : 'Virtual scrolling disabled - All items are rendered'}
            </p>
            <PropertyGrid
              properties={mockProperties}
              columns={{ mobile: 1, tablet: 2, desktop: 4 }}
              enableVirtualization={enableVirtualization}
              onPropertyClick={handlePropertyClick}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}