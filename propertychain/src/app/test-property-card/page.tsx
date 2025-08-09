/**
 * Property Card Test Page - PropertyChain
 * Tests property card component variants and states
 */

'use client'

import { useState, useEffect } from 'react'
import { PropertyCard, PropertyCardSkeleton, PropertyCardData } from '@/components/custom/property-card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// Mock property data
const mockProperties: PropertyCardData[] = [
  {
    id: '1',
    title: 'Luxury Downtown Penthouse',
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
    },
    images: ['/images/property-1.jpg'],
    price: 2500000,
    tokenPrice: 100,
    minInvestment: 500,
    targetFunding: 1000000,
    currentFunding: 750000,
    expectedReturn: 12.5,
    returnPeriod: 'Annual',
    propertyType: 'Residential',
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    investors: 127,
    daysLeft: 15,
    featured: true,
    verified: true,
    status: 'funding',
    badges: [
      { label: 'High Yield', variant: 'default' },
      { label: 'Prime Location', variant: 'secondary' },
    ],
  },
  {
    id: '2',
    title: 'Modern Office Complex',
    location: {
      address: '456 Business Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    images: ['/images/property-2.jpg'],
    price: 5000000,
    tokenPrice: 250,
    minInvestment: 1000,
    targetFunding: 2000000,
    currentFunding: 2000000,
    expectedReturn: 9.8,
    returnPeriod: 'Annual',
    propertyType: 'Commercial',
    sqft: 10000,
    investors: 245,
    daysLeft: 0,
    verified: true,
    status: 'funded',
  },
  {
    id: '3',
    title: 'Beachfront Vacation Rental',
    location: {
      address: '789 Ocean Dr',
      city: 'Miami',
      state: 'FL',
      zip: '33139',
    },
    images: ['/images/property-3.jpg'],
    price: 1800000,
    tokenPrice: 75,
    minInvestment: 300,
    targetFunding: 800000,
    currentFunding: 200000,
    expectedReturn: 15.2,
    returnPeriod: 'Annual',
    propertyType: 'Residential',
    beds: 4,
    baths: 3,
    sqft: 3200,
    investors: 64,
    daysLeft: 28,
    status: 'funding',
    badges: [
      { label: 'New Listing', variant: 'destructive' },
    ],
  },
  {
    id: '4',
    title: 'Industrial Warehouse',
    location: {
      address: '321 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    },
    images: ['/images/property-4.jpg'],
    price: 3200000,
    tokenPrice: 150,
    minInvestment: 750,
    targetFunding: 1500000,
    currentFunding: 0,
    expectedReturn: 8.5,
    returnPeriod: 'Annual',
    propertyType: 'Industrial',
    sqft: 25000,
    investors: 0,
    daysLeft: 45,
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Historic Renovation Project',
    location: {
      address: '555 Heritage St',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
    },
    images: ['/images/property-5.jpg'],
    price: 4000000,
    tokenPrice: 200,
    minInvestment: 1000,
    targetFunding: 2000000,
    currentFunding: 2000000,
    expectedReturn: 11.0,
    returnPeriod: 'Annual',
    propertyType: 'Mixed Use',
    beds: 8,
    baths: 6,
    sqft: 6500,
    investors: 189,
    daysLeft: 0,
    status: 'closed',
  },
]

export default function TestPropertyCardPage() {
  const [variant, setVariant] = useState<'default' | 'compact' | 'featured'>('default')
  const [showActions, setShowActions] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [gridColumns, setGridColumns] = useState('3')
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const results: string[] = []
    
    // Check for property card components
    const cards = document.querySelectorAll('[class*="property-card"]')
    if (cards.length > 0) {
      results.push('✅ Property cards rendered')
    } else {
      results.push('❌ Property cards not found')
    }

    // Check for hover effects
    const hoverElements = document.querySelectorAll('[class*="hover:"]')
    if (hoverElements.length > 0) {
      results.push('✅ Hover effects present')
    }

    // Check for badges
    const badges = document.querySelectorAll('[class*="badge"]')
    if (badges.length > 0) {
      results.push(`✅ ${badges.length} badges found`)
    }

    // Check for progress bars
    const progressBars = document.querySelectorAll('[role="progressbar"]')
    if (progressBars.length > 0) {
      results.push(`✅ ${progressBars.length} progress bars found`)
    }

    // Check for images or placeholders
    const images = document.querySelectorAll('img')
    if (images.length > 0) {
      results.push(`✅ ${images.length} images present`)
    }

    setTestResults(results)
  }, [variant, showActions, showSkeleton])

  const handleFavorite = (id: string) => {
    console.log(`Favorited property: ${id}`)
  }

  const handleShare = (id: string) => {
    console.log(`Shared property: ${id}`)
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Property Card Component Test</h1>

      {/* Controls */}
      <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-6">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        
        {/* Variant Selection */}
        <div className="space-y-2">
          <Label>Card Variant</Label>
          <RadioGroup value={variant} onValueChange={(v) => setVariant(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default (480px min-height)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="compact" />
              <Label htmlFor="compact">Compact (400px min-height)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="featured" id="featured" />
              <Label htmlFor="featured">Featured (520px min-height)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Grid Columns */}
        <div className="space-y-2">
          <Label>Grid Columns</Label>
          <RadioGroup value={gridColumns} onValueChange={setGridColumns}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="col1" />
              <Label htmlFor="col1">1 Column</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="col2" />
              <Label htmlFor="col2">2 Columns</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="col3" />
              <Label htmlFor="col3">3 Columns</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="col4" />
              <Label htmlFor="col4">4 Columns</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="actions"
              checked={showActions}
              onCheckedChange={setShowActions}
            />
            <Label htmlFor="actions">Show Action Buttons (Heart/Share)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="skeleton"
              checked={showSkeleton}
              onCheckedChange={setShowSkeleton}
            />
            <Label htmlFor="skeleton">Show Skeleton Loaders</Label>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Results</h2>
        <div className="space-y-1">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm">
              {result}
            </div>
          ))}
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Property Cards ({showSkeleton ? 'Skeleton' : variant} variant)
        </h2>
        <div 
          className={`grid gap-6 ${
            gridColumns === '1' ? 'grid-cols-1' :
            gridColumns === '2' ? 'grid-cols-1 md:grid-cols-2' :
            gridColumns === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {showSkeleton ? (
            <>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </>
          ) : (
            mockProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant={variant}
                showActions={showActions}
                onFavorite={handleFavorite}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="p-6 bg-green-50 border border-green-200 rounded">
        <h2 className="text-xl font-semibold mb-4">Step 15 Features Implemented:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ shadcn Card as base component</li>
          <li>✅ Three variants: default, compact, featured</li>
          <li>✅ Lazy loading images with Next.js Image</li>
          <li>✅ Progress bar with gradient fill</li>
          <li>✅ Multiple badge types (featured, verified, custom)</li>
          <li>✅ Framer Motion hover animations</li>
          <li>✅ Favorite and share actions</li>
          <li>✅ Responsive grid layout</li>
          <li>✅ Status indicators (funding, funded, closed, upcoming)</li>
          <li>✅ Investment details display</li>
          <li>✅ Property specifications (beds, baths, sqft)</li>
          <li>✅ Skeleton loader component</li>
          <li>✅ Min-height specifications per variant</li>
          <li>✅ 12px border-radius on cards</li>
          <li>✅ Shadow transitions on hover</li>
          <li>✅ 8px grid system compliance</li>
          <li>✅ WCAG AA compliant colors</li>
        </ul>
      </div>
    </div>
  )
}