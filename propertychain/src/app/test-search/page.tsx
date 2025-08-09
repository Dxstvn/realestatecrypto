/**
 * Search Components Test Page - PropertyChain
 * Tests all search functionality and components
 */

'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SearchBar,
  AdvancedSearch,
  CommandPalette,
  SearchResults,
  InstantSearch,
  SearchHistory,
  TrendingSearches,
  type SearchResult,
  type SearchSuggestion,
} from '@/components/custom/search'
import {
  PropertySearchBar,
  PropertyFiltersPanel,
  MapSearch,
  SavedSearches,
  PropertySearchResults,
  type PropertyFilters,
} from '@/components/custom/property-search'
import {
  Search,
  Building2,
  MapPin,
  DollarSign,
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Wallet,
  HelpCircle,
  TrendingUp,
  Command,
  Filter,
  History,
  Star,
  Sparkles,
} from 'lucide-react'
import { toastInfo } from '@/lib/toast'

// Mock data generators
const generateSearchResults = (query: string): SearchResult[] => {
  const categories = ['Properties', 'Documents', 'Investments', 'Users']
  const results: SearchResult[] = []
  
  for (let i = 0; i < 10; i++) {
    results.push({
      id: `result-${i}`,
      title: `${query} Result ${i + 1}`,
      description: `This is a search result for "${query}" with some description text that might be quite long and needs to be truncated`,
      category: categories[i % categories.length],
      icon: i % 2 === 0 ? <Building2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />,
      url: `/result/${i}`,
      score: Math.random(),
    })
  }
  
  return results.sort((a, b) => (b.score || 0) - (a.score || 0))
}

const generateSuggestions = (query: string): SearchSuggestion[] => {
  if (!query) return []
  
  return [
    {
      id: '1',
      text: `${query} in San Francisco`,
      category: 'Popular',
      icon: <MapPin className="h-4 w-4" />,
      trending: true,
    },
    {
      id: '2',
      text: `${query} under $500k`,
      category: 'Price Range',
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      id: '3',
      text: `${query} with pool`,
      category: 'Features',
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: '4',
      text: `${query} investment properties`,
      category: 'Investment',
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ]
}

const mockPropertyResults = [
  {
    id: '1',
    title: 'Modern Downtown Condo',
    description: 'Luxury 2BR/2BA condo with city views',
    category: 'Residential',
    icon: <Building2 className="h-4 w-4" />,
    metadata: {
      price: 750000,
      sqft: 1200,
      bedrooms: 2,
      bathrooms: 2,
    },
  },
  {
    id: '2',
    title: 'Suburban Family Home',
    description: 'Spacious 4BR/3BA home with large backyard',
    category: 'Residential',
    icon: <Home className="h-4 w-4" />,
    metadata: {
      price: 1200000,
      sqft: 2800,
      bedrooms: 4,
      bathrooms: 3,
    },
  },
  {
    id: '3',
    title: 'Investment Property Portfolio',
    description: 'Multi-unit rental property with stable income',
    category: 'Investment',
    icon: <BarChart3 className="h-4 w-4" />,
    metadata: {
      price: 2500000,
      units: 6,
      roi: 8.5,
    },
  },
]

const mockSearchHistory = [
  { id: '1', query: '3 bedroom house San Francisco', timestamp: new Date('2024-01-15'), resultsCount: 42 },
  { id: '2', query: 'investment properties under 1M', timestamp: new Date('2024-01-14'), resultsCount: 18 },
  { id: '3', query: 'condos near transit', timestamp: new Date('2024-01-13'), resultsCount: 31 },
  { id: '4', query: 'properties with high ROI', timestamp: new Date('2024-01-12'), resultsCount: 25 },
  { id: '5', query: 'waterfront homes', timestamp: new Date('2024-01-11'), resultsCount: 12 },
]

const mockTrendingSearches = [
  { id: '1', query: 'Miami beach properties', count: 1542, trend: 'up' as const },
  { id: '2', query: 'Austin tech corridor', count: 1203, trend: 'up' as const },
  { id: '3', query: 'Remote work homes', count: 987, trend: 'stable' as const },
  { id: '4', query: 'Eco-friendly buildings', count: 756, trend: 'up' as const },
  { id: '5', query: 'Student housing', count: 623, trend: 'down' as const },
]

const mockSavedSearches = [
  {
    id: '1',
    name: 'Bay Area Investment Properties',
    query: 'investment properties',
    filters: {
      propertyType: ['multi-family', 'commercial'],
      priceRange: { min: 500000, max: 2000000 },
      location: { city: 'San Francisco', state: 'CA' },
    } as PropertyFilters,
    frequency: 'daily' as const,
    lastRun: new Date('2024-01-20'),
    newResults: 3,
  },
  {
    id: '2',
    name: 'Vacation Rentals',
    query: 'beachfront',
    filters: {
      propertyType: ['house', 'condo'],
      amenities: ['Pool', 'Parking'],
    } as PropertyFilters,
    frequency: 'weekly' as const,
    lastRun: new Date('2024-01-18'),
    newResults: 0,
  },
]

const commandItems = [
  {
    category: 'Navigation',
    items: [
      { id: '1', title: 'Dashboard', description: 'Go to dashboard', icon: <Home className="h-4 w-4" />, shortcut: '⌘D', onSelect: () => toastInfo('Navigate to Dashboard') },
      { id: '2', title: 'Properties', description: 'Browse properties', icon: <Building2 className="h-4 w-4" />, shortcut: '⌘P', onSelect: () => toastInfo('Navigate to Properties') },
      { id: '3', title: 'Investments', description: 'View investments', icon: <BarChart3 className="h-4 w-4" />, shortcut: '⌘I', onSelect: () => toastInfo('Navigate to Investments') },
      { id: '4', title: 'Wallet', description: 'Manage wallet', icon: <Wallet className="h-4 w-4" />, shortcut: '⌘W', onSelect: () => toastInfo('Navigate to Wallet') },
    ],
  },
  {
    category: 'Actions',
    items: [
      { id: '5', title: 'New Investment', description: 'Start a new investment', icon: <DollarSign className="h-4 w-4" />, onSelect: () => toastInfo('Start New Investment') },
      { id: '6', title: 'Search Properties', description: 'Advanced property search', icon: <Search className="h-4 w-4" />, onSelect: () => toastInfo('Open Advanced Search') },
      { id: '7', title: 'Upload Document', description: 'Upload property documents', icon: <FileText className="h-4 w-4" />, onSelect: () => toastInfo('Upload Document') },
      { id: '8', title: 'Invite User', description: 'Invite new users', icon: <Users className="h-4 w-4" />, onSelect: () => toastInfo('Invite User') },
    ],
  },
  {
    category: 'Settings',
    items: [
      { id: '9', title: 'Preferences', description: 'App preferences', icon: <Settings className="h-4 w-4" />, shortcut: '⌘,', onSelect: () => toastInfo('Open Preferences') },
      { id: '10', title: 'Help', description: 'Get help', icon: <HelpCircle className="h-4 w-4" />, shortcut: '⌘?', onSelect: () => toastInfo('Open Help') },
    ],
  },
]

export default function TestSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [propertyFilters, setPropertyFilters] = useState<PropertyFilters>({})
  const [searchView, setSearchView] = useState<'list' | 'grid' | 'map'>('list')

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    
    setTimeout(() => {
      setSearchResults(generateSearchResults(query))
      setIsSearching(false)
    }, 500)
  }, [])

  const handleInstantSearch = useCallback(async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generateSearchResults(query).slice(0, 5)
  }, [])

  const handlePropertySearch = useCallback((query: string, filters: PropertyFilters) => {
    toastInfo(`Searching: "${query}" with ${Object.keys(filters).length} filters`)
    setSearchResults(mockPropertyResults)
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Components Test</h1>
        <p className="text-muted-foreground">
          Testing search bars, filters, command palette, and results display
        </p>
      </div>

      {/* Command Palette Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setCommandOpen(true)}
          className="gap-2"
        >
          <Command className="h-4 w-4" />
          Command Palette
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        commands={commandItems}
      />

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Search</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="property">Property Search</TabsTrigger>
          <TabsTrigger value="instant">Instant Search</TabsTrigger>
          <TabsTrigger value="history">History & Saved</TabsTrigger>
        </TabsList>

        {/* Basic Search Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Search Bar</CardTitle>
              <CardDescription>Simple search with suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Search properties, documents, or users..."
                suggestions={generateSuggestions(searchQuery)}
                loading={isSearching}
                showFilter
                onFilterClick={() => toastInfo('Filter clicked')}
              />
              
              {searchResults.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Search Results</h3>
                  <SearchResults
                    results={searchResults}
                    loading={isSearching}
                    query={searchQuery}
                    totalResults={searchResults.length}
                    onResultClick={(result) => toastInfo(`Clicked: ${result.title}`)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <SearchHistory
              history={mockSearchHistory}
              onSelect={handleSearch}
              onClear={() => toastInfo('Clear history')}
            />
            
            <TrendingSearches
              searches={mockTrendingSearches}
              onSelect={handleSearch}
            />
          </div>
        </TabsContent>

        {/* Advanced Search Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
              <CardDescription>Search with multiple filters and options</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedSearch
                onSearch={(query, filters) => {
                  toastInfo(`Advanced search: "${query}" with ${Object.keys(filters).length} filters`)
                  handleSearch(query)
                }}
                loading={isSearching}
              />
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchResults
                  results={searchResults}
                  loading={isSearching}
                  variant="grid"
                  onResultClick={(result) => toastInfo(`Clicked: ${result.title}`)}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Property Search Tab */}
        <TabsContent value="property" className="space-y-6">
          <PropertySearchBar
            onSearch={handlePropertySearch}
          />

          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-1">
              <PropertyFiltersPanel
                filters={propertyFilters}
                onChange={setPropertyFilters}
              />
            </div>
            
            <div className="md:col-span-3">
              <PropertySearchResults
                results={mockPropertyResults}
                loading={isSearching}
                view={searchView}
                onViewChange={setSearchView}
              />
            </div>
          </div>

          <SavedSearches
            searches={mockSavedSearches}
            onRun={(search) => toastInfo(`Running saved search: ${search.name}`)}
            onDelete={(id) => toastInfo(`Delete search: ${id}`)}
            onEdit={(search) => toastInfo(`Edit search: ${search.name}`)}
          />
        </TabsContent>

        {/* Instant Search Tab */}
        <TabsContent value="instant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instant Search</CardTitle>
              <CardDescription>Real-time search as you type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InstantSearch
                onSearch={handleInstantSearch}
                placeholder="Try typing 'modern condo'..."
                debounceMs={300}
                minChars={2}
                maxResults={5}
              />
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✅ Debounced search (300ms)</li>
                  <li>✅ Minimum 2 characters to search</li>
                  <li>✅ Maximum 5 results shown</li>
                  <li>✅ Loading indicator</li>
                  <li>✅ Click to select result</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Bars - Size Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Small</Label>
                <SearchBar size="sm" placeholder="Small search bar..." />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Default</Label>
                <SearchBar placeholder="Default search bar..." />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Large</Label>
                <SearchBar size="lg" placeholder="Large search bar..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History & Saved Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Search History</CardTitle>
                <CardDescription>Your recent searches</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchHistory
                  history={mockSearchHistory}
                  onSelect={handleSearch}
                  onClear={() => toastInfo('Clear history')}
                  maxItems={10}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending Searches</CardTitle>
                <CardDescription>Popular searches right now</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendingSearches
                  searches={mockTrendingSearches}
                  onSelect={handleSearch}
                />
              </CardContent>
            </Card>
          </div>

          <SavedSearches
            searches={mockSavedSearches}
            onRun={(search) => toastInfo(`Running: ${search.name}`)}
            onDelete={(id) => toastInfo(`Delete: ${id}`)}
            onEdit={(search) => toastInfo(`Edit: ${search.name}`)}
          />
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Search Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Components</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ SearchBar with suggestions</li>
                <li>✅ AdvancedSearch with filters</li>
                <li>✅ CommandPalette (⌘K)</li>
                <li>✅ InstantSearch with debounce</li>
                <li>✅ SearchResults (list/grid/compact)</li>
                <li>✅ SearchHistory tracking</li>
                <li>✅ TrendingSearches display</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Property Search</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ PropertySearchBar with quick filters</li>
                <li>✅ PropertyFiltersPanel (advanced)</li>
                <li>✅ MapSearch integration</li>
                <li>✅ SavedSearches management</li>
                <li>✅ Property-specific filters</li>
                <li>✅ Investment criteria</li>
                <li>✅ Amenities selection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Autocomplete suggestions</li>
                <li>✅ Loading states</li>
                <li>✅ Keyboard navigation</li>
                <li>✅ Size variants (sm/default/lg)</li>
                <li>✅ View modes (list/grid/map)</li>
                <li>✅ Filter persistence</li>
                <li>✅ TypeScript support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Label } from '@/components/ui/label'