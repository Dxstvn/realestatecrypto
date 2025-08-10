/**
 * DeFi Filter Bar Component - PropertyLend
 * 
 * Advanced filtering system for DeFi pools and lending opportunities
 * Web3 native design with multi-parameter filtering
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  Search,
  Filter,
  X,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  Shield,
  Zap,
  Clock,
  Coins,
  Layers,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  SlidersHorizontal,
  RefreshCw,
  Star,
  Lock,
  Unlock,
} from 'lucide-react'

// Types
export interface DeFiFilterOptions {
  search?: string
  tranche?: 'all' | 'junior' | 'senior'
  minApy?: number
  maxApy?: number
  minTvl?: number
  maxTvl?: number
  riskLevel?: 'all' | 'low' | 'medium' | 'high'
  chains?: string[]
  protocols?: string[]
  assets?: string[]
  lockPeriod?: 'all' | 'flexible' | '30' | '90' | '180' | '365'
  features?: {
    boosted?: boolean
    insured?: boolean
    audited?: boolean
    autoCompound?: boolean
  }
  sortBy?: 'apy' | 'tvl' | 'risk' | 'newest' | 'utilization'
  sortOrder?: 'asc' | 'desc'
}

interface DeFiFilterBarProps {
  filters: DeFiFilterOptions
  onFiltersChange: (filters: DeFiFilterOptions) => void
  onReset?: () => void
  totalResults?: number
  isLoading?: boolean
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
}

const AVAILABLE_CHAINS = [
  { value: 'ethereum', label: 'Ethereum', icon: '🔷' },
  { value: 'polygon', label: 'Polygon', icon: '🟣' },
  { value: 'arbitrum', label: 'Arbitrum', icon: '🔵' },
  { value: 'optimism', label: 'Optimism', icon: '🔴' },
  { value: 'bsc', label: 'BSC', icon: '🟡' },
]

const AVAILABLE_PROTOCOLS = [
  'Aave', 'Compound', 'Curve', 'Yearn', 'Convex', 'Balancer'
]

const AVAILABLE_ASSETS = [
  'USDC', 'USDT', 'DAI', 'ETH', 'WBTC', 'WETH', 'stETH'
]

export function DeFiFilterBar({
  filters,
  onFiltersChange,
  onReset,
  totalResults,
  isLoading,
  variant = 'default',
  className,
}: DeFiFilterBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState(filters.search || '')

  // Count active filters
  const activeFilterCount = React.useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.tranche && filters.tranche !== 'all') count++
    if (filters.minApy) count++
    if (filters.maxApy) count++
    if (filters.minTvl) count++
    if (filters.maxTvl) count++
    if (filters.riskLevel && filters.riskLevel !== 'all') count++
    if (filters.chains && filters.chains.length > 0) count++
    if (filters.protocols && filters.protocols.length > 0) count++
    if (filters.assets && filters.assets.length > 0) count++
    if (filters.lockPeriod && filters.lockPeriod !== 'all') count++
    if (filters.features) {
      if (filters.features.boosted) count++
      if (filters.features.insured) count++
      if (filters.features.audited) count++
      if (filters.features.autoCompound) count++
    }
    return count
  }, [filters])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, search: searchValue })
  }

  const handleQuickFilter = (key: keyof DeFiFilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleFeatureToggle = (feature: keyof NonNullable<DeFiFilterOptions['features']>) => {
    onFiltersChange({
      ...filters,
      features: {
        ...filters.features,
        [feature]: !filters.features?.[feature],
      },
    })
  }

  const handleReset = () => {
    setSearchValue('')
    onReset?.()
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search pools..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white"
            />
          </div>
        </form>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-primary/10"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search pools, protocols, or assets..."
              className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue('')
                  onFiltersChange({ ...filters, search: '' })
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-500 hover:text-white" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Filters */}
        <div className="flex items-center gap-2">
          {/* Tranche Filter */}
          <Select
            value={filters.tranche || 'all'}
            onValueChange={(value) => handleQuickFilter('tranche', value)}
          >
            <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700 text-white">
              <SelectValue placeholder="Tranche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tranches</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>

          {/* Risk Filter */}
          <Select
            value={filters.riskLevel || 'all'}
            onValueChange={(value) => handleQuickFilter('riskLevel', value)}
          >
            <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700 text-white">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={filters.sortBy || 'apy'}
            onValueChange={(value) => handleQuickFilter('sortBy', value)}
          >
            <SelectTrigger className="w-32 bg-gray-900/50 border-gray-700 text-white">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apy">Highest APY</SelectItem>
              <SelectItem value="tvl">Highest TVL</SelectItem>
              <SelectItem value="risk">Lowest Risk</SelectItem>
              <SelectItem value="utilization">Utilization</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters */}
          <Sheet open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-primary/10"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Advanced
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-primary/20 text-primary">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg bg-gray-950 border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">Advanced Filters</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Fine-tune your search with detailed parameters
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* APY Range */}
                <div className="space-y-3">
                  <Label className="text-gray-300">APY Range (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minApy || ''}
                      onChange={(e) => handleQuickFilter('minApy', Number(e.target.value))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxApy || ''}
                      onChange={(e) => handleQuickFilter('maxApy', Number(e.target.value))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[5, 10, 20, 30].map(apy => (
                      <Button
                        key={apy}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickFilter('minApy', apy)}
                        className="flex-1 border-gray-700 hover:bg-primary/10 text-xs"
                      >
                        {apy}%+
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* TVL Range */}
                <div className="space-y-3">
                  <Label className="text-gray-300">TVL Range ($)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minTvl || ''}
                      onChange={(e) => handleQuickFilter('minTvl', Number(e.target.value))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxTvl || ''}
                      onChange={(e) => handleQuickFilter('maxTvl', Number(e.target.value))}
                      className="bg-gray-900/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Lock Period */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Lock Period</Label>
                  <Select
                    value={filters.lockPeriod || 'all'}
                    onValueChange={(value) => handleQuickFilter('lockPeriod', value)}
                  >
                    <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                      <SelectValue placeholder="Any period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any period</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gray-800" />

                {/* Chains */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Blockchain</Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_CHAINS.map(chain => (
                      <Button
                        key={chain.value}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const chains = filters.chains || []
                          const newChains = chains.includes(chain.value)
                            ? chains.filter(c => c !== chain.value)
                            : [...chains, chain.value]
                          handleQuickFilter('chains', newChains)
                        }}
                        className={cn(
                          'border-gray-700',
                          filters.chains?.includes(chain.value) 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'hover:bg-gray-800'
                        )}
                      >
                        <span className="mr-1">{chain.icon}</span>
                        {chain.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Features */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">Boosted Rewards</span>
                      </div>
                      <Switch
                        checked={filters.features?.boosted || false}
                        onCheckedChange={() => handleFeatureToggle('boosted')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Insured</span>
                      </div>
                      <Switch
                        checked={filters.features?.insured || false}
                        onCheckedChange={() => handleFeatureToggle('insured')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-300">Audited</span>
                      </div>
                      <Switch
                        checked={filters.features?.audited || false}
                        onCheckedChange={() => handleFeatureToggle('audited')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-300">Auto-Compound</span>
                      </div>
                      <Switch
                        checked={filters.features?.autoCompound || false}
                        onCheckedChange={() => handleFeatureToggle('autoCompound')}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700 hover:bg-gray-800"
                    onClick={handleReset}
                  >
                    Reset All
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    onClick={() => setIsAdvancedOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Reset Button */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="hover:bg-red-950/50 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {variant === 'default' && activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm text-gray-500">Active filters:</span>
          
          {filters.search && (
            <Badge variant="outline" className="bg-gray-900/50 border-gray-700">
              Search: {filters.search}
              <button
                onClick={() => {
                  setSearchValue('')
                  onFiltersChange({ ...filters, search: undefined })
                }}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.tranche && filters.tranche !== 'all' && (
            <Badge variant="outline" className="bg-gray-900/50 border-gray-700">
              {filters.tranche} tranche
              <button
                onClick={() => onFiltersChange({ ...filters, tranche: 'all' })}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.riskLevel && filters.riskLevel !== 'all' && (
            <Badge variant="outline" className="bg-gray-900/50 border-gray-700">
              {filters.riskLevel} risk
              <button
                onClick={() => onFiltersChange({ ...filters, riskLevel: 'all' })}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.minApy && (
            <Badge variant="outline" className="bg-gray-900/50 border-gray-700">
              APY ≥ {filters.minApy}%
              <button
                onClick={() => onFiltersChange({ ...filters, minApy: undefined })}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {totalResults !== undefined && (
            <span className="text-sm text-gray-500 ml-auto">
              {isLoading ? 'Loading...' : `${totalResults} results`}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}