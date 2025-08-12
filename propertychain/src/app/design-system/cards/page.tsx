/**
 * Card Standardization Test Page
 * PropertyLend DeFi Platform
 * 
 * Phase 2.2: Card Component Standardization
 * Demonstrates standardized card system with examples
 */

'use client'

import { PropertyCardV2, PropertyData } from '@/components/cards/property-card-v2'
import { PoolCardV2, PoolData } from '@/components/cards/pool-card-v2'
import { StandardizedCard } from '@/components/ui/card-standardized'
import { Badge } from '@/components/ui/badge'
import { 
  Award, 
  Shield, 
  TrendingUp,
  Activity,
  Star,
  Zap
} from 'lucide-react'

// Sample property data
const sampleProperties: PropertyData[] = [
  {
    id: '1',
    title: 'Luxury Downtown Condo Development',
    location: {
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105'
    },
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop',
    tokenPrice: 1000,
    expectedReturn: 8.5,
    returnPeriod: 'Annually',
    beds: 2,
    baths: 2,
    sqft: 1200,
    minInvestment: 10000,
    targetFunding: 5000000,
    currentFunding: 3250000,
    fundingProgress: 65,
    investors: 127,
    daysLeft: 12,
    featured: true,
    verified: true,
    status: 'funding',
    tranche: 'senior'
  },
  {
    id: '2',
    title: 'Modern Suburban Family Complex',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    tokenPrice: 500,
    expectedReturn: 24.2,
    returnPeriod: 'Annually',
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    minInvestment: 25000,
    targetFunding: 3000000,
    currentFunding: 1350000,
    fundingProgress: 45,
    investors: 89,
    daysLeft: 8,
    verified: true,
    status: 'funding',
    tranche: 'junior'
  },
  {
    id: '3',
    title: 'Historic Renovation Project',
    location: 'Boston, MA',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop',
    tokenPrice: 750,
    expectedReturn: 12.0,
    returnPeriod: 'Annually',
    beds: 1,
    baths: 1,
    sqft: 850,
    minInvestment: 5000,
    targetFunding: 2000000,
    currentFunding: 2000000,
    fundingProgress: 100,
    investors: 156,
    verified: true,
    status: 'funded'
  }
]

// Sample pool data
const samplePools: PoolData[] = [
  {
    id: '1',
    name: 'USDC Senior Pool',
    protocol: 'PropertyLend',
    asset: 'USD Coin',
    assetSymbol: 'USDC',
    tvl: 12500000,
    apy: {
      senior: 8.5,
      junior: 24.2
    },
    risk: 'low',
    utilization: 78,
    liquidityAvailable: 2750000,
    minDeposit: 1000,
    lockPeriod: 30,
    status: 'active',
    featured: true,
    verified: true,
    boosted: true,
    insurance: true,
    chain: 'Ethereum',
    investors: 234,
    timeLeft: 15,
    rewards: {
      token: 'PROP',
      amount: 125,
      apy: 2.5
    },
    performanceHistory: {
      '24h': 0.12,
      '7d': 0.89,
      '30d': 2.14
    }
  },
  {
    id: '2',
    name: 'DAI Yield Farm',
    protocol: 'PropertyLend',
    asset: 'Dai Stablecoin',
    assetSymbol: 'DAI',
    tvl: 8900000,
    apy: {
      senior: 6.8,
      junior: 28.9
    },
    risk: 'medium',
    utilization: 92,
    liquidityAvailable: 712000,
    minDeposit: 500,
    lockPeriod: 60,
    status: 'active',
    verified: true,
    chain: 'Polygon',
    investors: 189,
    timeLeft: 22,
    performanceHistory: {
      '24h': -0.05,
      '7d': 1.23,
      '30d': 3.67
    }
  },
  {
    id: '3',
    name: 'USDT High Yield',
    protocol: 'PropertyLend',
    asset: 'Tether',
    assetSymbol: 'USDT',
    tvl: 15600000,
    apy: {
      senior: 12.4,
      junior: 35.7
    },
    risk: 'high',
    utilization: 95,
    liquidityAvailable: 780000,
    minDeposit: 2000,
    status: 'full',
    chain: 'BSC',
    investors: 312,
    performanceHistory: {
      '24h': 0.34,
      '7d': -0.89,
      '30d': 4.12
    }
  }
]

export default function CardsTestPage() {
  const handleFavorite = (id: string) => {
    console.log('Favorited:', id)
  }

  const handleShare = (id: string) => {
    console.log('Shared:', id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="container mx-auto max-w-7xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Card Standardization - Phase 2.2
          </h1>
          <p className="text-xl text-gray-400">
            Consistent 16:9 ratios, glassmorphic effects, clear hierarchy & accessible progress indicators
          </p>
        </div>

        {/* Features Overview */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Standardization Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: '16:9 Aspect Ratio',
                description: 'Consistent image dimensions across all cards',
                icon: <Activity className="h-6 w-6" />
              },
              {
                title: 'Glassmorphic Effects',
                description: 'Proper backdrop-filter with blur and transparency',
                icon: <Shield className="h-6 w-6" />
              },
              {
                title: 'Visual Hierarchy',
                description: 'Clear typography and spacing standards',
                icon: <Star className="h-6 w-6" />
              },
              {
                title: 'Accessible Progress',
                description: 'Screen reader friendly with proper labels',
                icon: <Award className="h-6 w-6" />
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="flex justify-center mb-2 text-primary-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Basic Standardized Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Basic Standardized Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StandardizedCard
              variant="default"
              title="Default Card"
              subtitle="Standard glassmorphic design"
              badges={[
                { label: 'Default', variant: 'default' }
              ]}
              progress={{
                label: 'Sample Progress',
                value: 65,
                currentValue: '$32,500',
                targetValue: '$50,000'
              }}
              primaryAction={{
                label: 'View Details',
                href: '#'
              }}
            >
              <p className="text-gray-400">
                This demonstrates the basic standardized card with glassmorphic effects
                and consistent spacing.
              </p>
            </StandardizedCard>

            <StandardizedCard
              variant="featured"
              title="Featured Card"
              subtitle="Enhanced with special effects"
              badges={[
                { label: 'Featured', variant: 'default', icon: <Award className="h-3 w-3" /> },
                { label: 'Hot', variant: 'destructive', icon: <Zap className="h-3 w-3" /> }
              ]}
              progress={{
                label: 'Completion',
                value: 90,
                variant: 'success'
              }}
              primaryAction={{
                label: 'Get Started',
                href: '#',
                variant: 'default'
              }}
              secondaryAction={{
                label: 'Learn More',
                icon: <TrendingUp className="h-4 w-4 mr-2" />
              }}
            >
              <p className="text-gray-400">
                Featured cards have enhanced visual effects and special ring borders.
              </p>
            </StandardizedCard>

            <StandardizedCard
              variant="property"
              size="sm"
              title="Compact Card"
              subtitle="Smaller size variant"
              badges={[
                { label: 'Compact', variant: 'secondary' }
              ]}
              primaryAction={{
                label: 'View',
                href: '#'
              }}
            >
              <p className="text-gray-400">
                Compact cards are perfect for dense layouts and mobile displays.
              </p>
            </StandardizedCard>
          </div>
        </section>

        {/* Property Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Property Cards v2
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProperties.map((property, index) => (
              <PropertyCardV2
                key={property.id}
                property={property}
                variant={index === 0 ? 'featured' : index === 2 ? 'compact' : 'default'}
                onFavorite={handleFavorite}
                onShare={handleShare}
              />
            ))}
          </div>
        </section>

        {/* Pool Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Pool Cards v2
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePools.map((pool, index) => (
              <PoolCardV2
                key={pool.id}
                pool={pool}
                variant={index === 0 ? 'featured' : index === 2 ? 'compact' : 'default'}
                onFavorite={handleFavorite}
                onShare={handleShare}
              />
            ))}
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibent text-white">
            Implementation Notes
          </h2>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Phase 2.2 Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-200">✅ Completed Features</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Consistent 16:9 aspect ratio for all images</li>
                    <li>• Glassmorphic effects with proper backdrop-filter</li>
                    <li>• Clear visual hierarchy with standardized typography</li>
                    <li>• Accessible progress indicators with ARIA labels</li>
                    <li>• Standardized spacing and padding system</li>
                    <li>• Motion animations with proper easing</li>
                    <li>• Responsive design with mobile optimization</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-200">🎯 Technical Improvements</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Modular component architecture</li>
                    <li>• Type-safe props with comprehensive interfaces</li>
                    <li>• Performance optimized with Next.js Image</li>
                    <li>• Theme-aware with automatic adaptation</li>
                    <li>• Skeleton loaders for better UX</li>
                    <li>• Proper focus management for accessibility</li>
                    <li>• Consistent animation timing (400ms)</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  All cards now follow the standardized design system ensuring consistency,
                  accessibility, and maintainability across the platform.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}