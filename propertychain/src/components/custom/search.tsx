/**
 * Search Components - PropertyChain
 * 
 * Comprehensive search functionality with autocomplete and filters
 * Following Section 0 principles with accessibility
 */

'use client'

import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils/cn'
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  History,
  TrendingUp,
  Star,
  ChevronRight,
  Loader2,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Settings,
  Home,
  Wallet,
  BarChart3,
  HelpCircle,
  Command,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react'

// Search result types
export interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  icon?: React.ReactNode
  url?: string
  metadata?: Record<string, any>
  score?: number
}

// Search suggestion types
export interface SearchSuggestion {
  id: string
  text: string
  category?: string
  icon?: React.ReactNode
  trending?: boolean
}

// Base Search Bar Component
interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  suggestions?: SearchSuggestion[]
  loading?: boolean
  autoFocus?: boolean
  showFilter?: boolean
  onFilterClick?: () => void
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  loading = false,
  autoFocus = false,
  showFilter = false,
  onFilterClick,
  className,
  size = 'default',
}: SearchBarProps) {
  const [localValue, setLocalValue] = React.useState(value || '')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange?.(newValue)
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0)
  }

  const handleSearch = () => {
    onSearch?.(localValue)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setLocalValue(suggestion.text)
    onChange?.(suggestion.text)
    onSearch?.(suggestion.text)
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange?.('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 text-sm'
      case 'lg':
        return 'h-12 text-base'
      default:
        return 'h-10'
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative flex items-center">
        <Search className={cn(
          'absolute left-3 text-muted-foreground pointer-events-none',
          size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        )} />
        <Input
          ref={inputRef}
          type="search"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            getSizeClasses(),
            'pl-9 pr-20',
            className
          )}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {localValue && !loading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {showFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFilterClick}
              className="h-6 px-2"
            >
              <Filter className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <ScrollArea className="max-h-80">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left transition-colors"
              >
                {suggestion.icon || <Search className="h-4 w-4 text-muted-foreground" />}
                <div className="flex-1">
                  <p className="text-sm">{suggestion.text}</p>
                  {suggestion.category && (
                    <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                  )}
                </div>
                {suggestion.trending && (
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Trending
                  </Badge>
                )}
              </button>
            ))}
          </ScrollArea>
        </Card>
      )}
    </div>
  )
}

// Advanced Search with Filters
interface AdvancedSearchProps {
  onSearch?: (query: string, filters: Record<string, any>) => void
  filters?: {
    categories?: string[]
    priceRange?: { min: number; max: number }
    dateRange?: { start: Date; end: Date }
    locations?: string[]
    propertyTypes?: string[]
    sortBy?: string
  }
  loading?: boolean
  className?: string
}

export function AdvancedSearch({
  onSearch,
  filters = {},
  loading = false,
  className,
}: AdvancedSearchProps) {
  const [query, setQuery] = React.useState('')
  const [selectedFilters, setSelectedFilters] = React.useState(filters)
  const [showFilters, setShowFilters] = React.useState(false)

  const handleSearch = () => {
    onSearch?.(query, selectedFilters)
  }

  const activeFilterCount = Object.values(selectedFilters).filter(v => 
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={() => handleSearch()}
          placeholder="Search properties, locations, or investments..."
          loading={loading}
          className="flex-1"
          size="lg"
        />
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        <Button
          size="lg"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {/* Property Types */}
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <div className="space-y-2">
                {['Residential', 'Commercial', 'Industrial', 'Land'].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.propertyTypes?.includes(type)}
                      onChange={(e) => {
                        const types = selectedFilters.propertyTypes || []
                        setSelectedFilters({
                          ...selectedFilters,
                          propertyTypes: e.target.checked
                            ? [...types, type]
                            : types.filter(t => t !== type)
                        })
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Min price"
                  value={selectedFilters.priceRange?.min || ''}
                  onChange={(e) => setSelectedFilters({
                    ...selectedFilters,
                    priceRange: {
                      ...selectedFilters.priceRange,
                      min: Number(e.target.value),
                      max: selectedFilters.priceRange?.max || 0,
                    }
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max price"
                  value={selectedFilters.priceRange?.max || ''}
                  onChange={(e) => setSelectedFilters({
                    ...selectedFilters,
                    priceRange: {
                      min: selectedFilters.priceRange?.min || 0,
                      max: Number(e.target.value),
                    }
                  })}
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                value={selectedFilters.sortBy || 'relevance'}
                onChange={(e) => setSelectedFilters({
                  ...selectedFilters,
                  sortBy: e.target.value,
                })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="date-new">Newest First</option>
                <option value="date-old">Oldest First</option>
                <option value="roi">Highest ROI</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Command Palette (cmd+k)
interface CommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  commands?: {
    category: string
    items: {
      id: string
      title: string
      description?: string
      icon?: React.ReactNode
      shortcut?: string
      onSelect: () => void
    }[]
  }[]
}

export function CommandPalette({
  open = false,
  onOpenChange,
  commands = [],
}: CommandPaletteProps) {
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange?.(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <CommandPrimitive className="h-[500px]">
          <div className="flex items-center border-b px-4 pb-3 pt-4">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>
          <ScrollArea className="max-h-[400px] overflow-y-auto p-2">
            <CommandPrimitive.List>
              {commands.length === 0 && (
                <CommandPrimitive.Empty className="py-6 text-center text-sm">
                  No results found.
                </CommandPrimitive.Empty>
              )}
              {commands.map((group) => (
                <div key={group.category}>
                  <CommandPrimitive.Group
                    heading={group.category}
                    className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {group.category}
                  </CommandPrimitive.Group>
                  {group.items.map((item) => (
                    <CommandPrimitive.Item
                      key={item.id}
                      value={item.title}
                      onSelect={() => {
                        item.onSelect()
                        onOpenChange?.(false)
                      }}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent aria-selected:bg-accent"
                    >
                      {item.icon && (
                        <div className="mr-2 h-4 w-4 text-muted-foreground">
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                          {item.shortcut}
                        </kbd>
                      )}
                    </CommandPrimitive.Item>
                  ))}
                </div>
              ))}
            </CommandPrimitive.List>
          </ScrollArea>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  )
}

// Search Results Display
interface SearchResultsProps {
  results: SearchResult[]
  loading?: boolean
  query?: string
  totalResults?: number
  onResultClick?: (result: SearchResult) => void
  className?: string
  variant?: 'list' | 'grid' | 'compact'
}

export function SearchResults({
  results,
  loading = false,
  query,
  totalResults,
  onResultClick,
  className,
  variant = 'list',
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">
            {query ? `Try adjusting your search for "${query}"` : 'Start searching to see results'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const renderResult = (result: SearchResult) => {
    const content = (
      <>
        {result.icon && (
          <div className="shrink-0 text-muted-foreground">
            {result.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium truncate">{result.title}</p>
              {result.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {result.category}
                </Badge>
                {result.score && (
                  <span className="text-xs text-muted-foreground">
                    {Math.round(result.score * 100)}% match
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </>
    )

    if (variant === 'compact') {
      return (
        <button
          key={result.id}
          onClick={() => onResultClick?.(result)}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-lg transition-colors"
        >
          {content}
        </button>
      )
    }

    return (
      <Card
        key={result.id}
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onResultClick?.(result)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {content}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'grid') {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
        {results.map(renderResult)}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {query && totalResults && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {totalResults} results for "{query}"
          </p>
          <Badge variant="outline">
            Page 1 of {Math.ceil(totalResults / 10)}
          </Badge>
        </div>
      )}
      {results.map(renderResult)}
    </div>
  )
}

// Instant Search Component
interface InstantSearchProps {
  onSearch?: (query: string) => Promise<SearchResult[]>
  placeholder?: string
  debounceMs?: number
  minChars?: number
  maxResults?: number
  className?: string
}

export function InstantSearch({
  onSearch,
  placeholder = 'Start typing to search...',
  debounceMs = 300,
  minChars = 2,
  maxResults = 5,
  className,
}: InstantSearchProps) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const searchTimeout = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    if (query.length < minChars) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    clearTimeout(searchTimeout.current)

    searchTimeout.current = setTimeout(async () => {
      if (onSearch) {
        const searchResults = await onSearch(query)
        setResults(searchResults.slice(0, maxResults))
        setShowResults(true)
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(searchTimeout.current)
  }, [query, onSearch, debounceMs, minChars, maxResults])

  return (
    <div className={cn('relative', className)}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
        loading={loading}
      />
      {showResults && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50">
          <SearchResults
            results={results}
            variant="compact"
            onResultClick={(result) => {
              console.log('Selected:', result)
              setShowResults(false)
              setQuery('')
            }}
          />
        </Card>
      )}
    </div>
  )
}

// Search History Component
interface SearchHistoryProps {
  history: {
    id: string
    query: string
    timestamp: Date
    resultsCount?: number
  }[]
  onSelect?: (query: string) => void
  onClear?: () => void
  maxItems?: number
  className?: string
}

export function SearchHistory({
  history,
  onSelect,
  onClear,
  maxItems = 10,
  className,
}: SearchHistoryProps) {
  const recentHistory = history.slice(0, maxItems)

  if (recentHistory.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {recentHistory.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect?.(item.query)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
            >
              <History className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.query}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString()}
                  {item.resultsCount && ` • ${item.resultsCount} results`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Trending Searches Component
interface TrendingSearchesProps {
  searches: {
    id: string
    query: string
    count: number
    trend?: 'up' | 'down' | 'stable'
  }[]
  onSelect?: (query: string) => void
  className?: string
}

export function TrendingSearches({
  searches,
  onSelect,
  className,
}: TrendingSearchesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trending Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {searches.map((search, index) => (
            <button
              key={search.id}
              onClick={() => onSelect?.(search.query)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm">{search.query}</p>
              </div>
              {search.trend === 'up' && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {search.trend === 'down' && (
                <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
              )}
              <Badge variant="secondary" className="text-xs">
                {search.count}
              </Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}