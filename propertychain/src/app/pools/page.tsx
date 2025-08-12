/**
 * Pools Page - PropertyLend DeFi Platform
 * 
 * Browse and interact with all available lending pools
 * Features senior/junior tranches with different risk/return profiles
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { LendingPoolCard } from '@/components/custom/lending-pool-card'
import { DeFiFilterBar, type DeFiFilterOptions } from '@/components/custom/defi-filter-bar'
import { DeFiStatsDisplay, DEFI_STATS_PRESETS } from '@/components/custom/defi-stats-display'
import { cn } from '@/lib/utils'
import {
  Search,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Info,
  ArrowUpRight,
  ChevronRight,
  Coins,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  Filter,
} from 'lucide-react'

// Mock data for pools
const mockPools = [
  {
    id: '1',
    name: 'Miami Beach Resort - Senior',
    asset: 'USDC',
    assetSymbol: 'USDC',
    apy: {
      junior: 0,
      senior: 8.5,
      current: 8.5,
    },
    tvl: 25000000,
    liquidityAvailable: 5000000,
    totalSupply: 25000000,
    totalBorrowed: 20000000,
    minDeposit: 100,
    lockPeriod: 365,
    risk: 'low' as const,
    utilization: 80,
    investors: 234,
    status: 'active' as const,
    verified: true,
    insurance: true,
  },
  {
    id: '2',
    name: 'Miami Beach Resort - Junior',
    asset: 'USDC',
    assetSymbol: 'USDC',
    apy: {
      junior: 28.5,
      senior: 0,
      current: 28.5,
    },
    tvl: 10000000,
    liquidityAvailable: 2000000,
    totalSupply: 10000000,
    totalBorrowed: 8000000,
    minDeposit: 1000,
    lockPeriod: 365,
    risk: 'medium' as const,
    utilization: 85,
    investors: 89,
    status: 'active' as const,
    verified: true,
    boosted: true,
  },
  {
    id: '3',
    name: 'NYC Commercial Complex - Senior',
    asset: 'USDT',
    assetSymbol: 'USDT',
    apy: {
      junior: 0,
      senior: 7.8,
      current: 7.8,
    },
    tvl: 50000000,
    liquidityAvailable: 10000000,
    totalSupply: 50000000,
    totalBorrowed: 40000000,
    minDeposit: 100,
    lockPeriod: 730,
    risk: 'low' as const,
    utilization: 75,
    investors: 456,
    status: 'active' as const,
    verified: true,
    insurance: true,
  },
  {
    id: '4',
    name: 'NYC Commercial Complex - Junior',
    asset: 'USDT',
    assetSymbol: 'USDT',
    apy: {
      junior: 32.5,
      senior: 0,
      current: 32.5,
    },
    tvl: 15000000,
    liquidityAvailable: 0,
    totalSupply: 15000000,
    totalBorrowed: 15000000,
    minDeposit: 5000,
    lockPeriod: 730,
    risk: 'high' as const,
    utilization: 100,
    investors: 67,
    status: 'full' as const,
    verified: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Austin Tech Hub - Senior',
    asset: 'DAI',
    assetSymbol: 'DAI',
    apy: {
      junior: 0,
      senior: 9.2,
      current: 9.2,
    },
    tvl: 30000000,
    liquidityAvailable: 8000000,
    totalSupply: 30000000,
    totalBorrowed: 22000000,
    minDeposit: 100,
    lockPeriod: 540,
    risk: 'low' as const,
    utilization: 73,
    investors: 312,
    status: 'active' as const,
    verified: true,
    insurance: true,
  },
  {
    id: '6',
    name: 'Austin Tech Hub - Junior',
    asset: 'DAI',
    assetSymbol: 'DAI',
    apy: {
      junior: 25.0,
      senior: 0,
      current: 25.0,
    },
    tvl: 8000000,
    liquidityAvailable: 3000000,
    totalSupply: 8000000,
    totalBorrowed: 5000000,
    minDeposit: 2000,
    lockPeriod: 540,
    risk: 'medium' as const,
    utilization: 62,
    investors: 45,
    status: 'active' as const,
    verified: true,
    boosted: true,
  },
]

export default function PoolsPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [pools, setPools] = useState(mockPools)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<DeFiFilterOptions>({
    search: '',
    tranche: 'all',
    minApy: undefined,
    maxApy: undefined,
    riskLevel: 'all',
    sortBy: 'apy',
  })

  // Filter pools based on selected tab and filters
  const filteredPools = pools.filter(pool => {
    const isSenior = pool.name.includes('Senior')
    const isJunior = pool.name.includes('Junior')
    
    if (selectedTab === 'senior' && !isSenior) return false
    if (selectedTab === 'junior' && !isJunior) return false
    if (selectedTab === 'filled' && pool.status !== 'full') return false
    
    if (filters.search && !pool.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    if (filters.tranche === 'senior' && !isSenior) return false
    if (filters.tranche === 'junior' && !isJunior) return false
    
    const currentApy = pool.apy.current || (isSenior ? pool.apy.senior : pool.apy.junior)
    if (filters.minApy && currentApy < filters.minApy) return false
    if (filters.maxApy && currentApy > filters.maxApy) return false
    if (filters.riskLevel !== 'all' && pool.risk !== filters.riskLevel) return false
    
    return true
  })

  // Sort pools
  const sortedPools = [...filteredPools].sort((a, b) => {
    switch (filters.sortBy) {
      case 'apy':
        const aApy = a.apy.current || Math.max(a.apy.senior, a.apy.junior)
        const bApy = b.apy.current || Math.max(b.apy.senior, b.apy.junior)
        return bApy - aApy
      case 'tvl':
        return b.tvl - a.tvl
      case 'risk':
        const riskOrder = { low: 0, medium: 1, high: 2 }
        return riskOrder[a.risk] - riskOrder[b.risk]
      default:
        return 0
    }
  })

  // Calculate stats
  const stats = [
    DEFI_STATS_PRESETS.tvl(
      pools.reduce((sum, p) => sum + p.tvl, 0),
      5.2
    ),
    DEFI_STATS_PRESETS.apy(
      pools.reduce((sum, p) => sum + (p.apy.current || Math.max(p.apy.senior, p.apy.junior)), 0) / pools.length,
      -0.3
    ),
    {
      label: 'Active Pools',
      value: pools.filter(p => p.status === 'active').length,
      icon: Coins,
      color: 'blue' as const,
    },
    DEFI_STATS_PRESETS.users(
      pools.reduce((sum, p) => sum + p.investors, 0),
      12.1
    ),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/10 to-transparent" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Lending Pools
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Earn sustainable yields from real estate-backed loans with fixed or variable returns
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Pools', value: pools.length, icon: Coins },
                { label: 'Avg APY', value: `${(pools.reduce((sum, p) => sum + (p.apy.current || Math.max(p.apy.senior, p.apy.junior)), 0) / pools.length).toFixed(1)}%`, icon: TrendingUp },
                { label: 'Total TVL', value: `$${(pools.reduce((sum, p) => sum + p.tvl, 0) / 1000000).toFixed(0)}M`, icon: DollarSign },
                { label: 'Active Lenders', value: pools.reduce((sum, p) => sum + p.investors, 0).toLocaleString(), icon: Users },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                >
                  <stat.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {/* Stats Display */}
        <div className="mb-8">
          <DeFiStatsDisplay
            stats={stats}
            variant="compact"
            className="bg-gray-900/50 backdrop-blur-sm"
          />
        </div>

        {/* Filters and Tabs */}
        <div className="mb-8 space-y-4">
          <DeFiFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalResults={sortedPools.length}
            variant="default"
          />

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-gray-900/50 border border-gray-800">
              <TabsTrigger value="all">All Pools</TabsTrigger>
              <TabsTrigger value="senior">
                Senior Tranches
                <Badge className="ml-2 bg-blue-950 text-blue-400 border-blue-800">
                  Low Risk
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="junior">
                Junior Tranches
                <Badge className="ml-2 bg-green-950 text-green-400 border-green-800">
                  High Yield
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="filled">Filled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <LendingPoolCard pool={pool} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sortedPools.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-800 p-12">
            <div className="text-center">
              <Coins className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No pools found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more pools</p>
            </div>
          </Card>
        )}

        {/* Educational Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-blue-950/50 to-blue-900/20 border-blue-800/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Senior Tranches</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400">
                Lower risk, fixed returns. First to receive payments and protected against defaults.
              </p>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-950/50">
                <span className="text-gray-400">Expected APY</span>
                <span className="text-xl font-bold text-blue-400">8-12%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-950/50 to-green-900/20 border-green-800/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white">Junior Tranches</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400">
                Higher risk, variable returns. Last to receive payments but earn higher yields.
              </p>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-950/50">
                <span className="text-gray-400">Expected APY</span>
                <span className="text-xl font-bold text-green-400">20-30%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}