/**
 * Earn Page - PropertyLend DeFi Platform
 * 
 * Overview of all earning opportunities and yield strategies
 * Showcases different ways to earn returns on the platform
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { YieldCalculator } from '@/components/custom/yield-calculator'
import { DeFiStatsDisplay, DEFI_STATS_PRESETS } from '@/components/custom/defi-stats-display'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Info,
  ArrowUpRight,
  ChevronRight,
  Coins,
  DollarSign,
  Gift,
  Trophy,
  Target,
  Sparkles,
  Lock,
  Unlock,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Star,
  Flame,
} from 'lucide-react'

// Mock data for strategies
const strategies = [
  {
    id: 'senior-stable',
    name: 'Senior Stable',
    description: 'Low-risk fixed returns from senior tranches',
    apy: { min: 8, max: 12, current: 8.5 },
    risk: 'low',
    lockPeriod: 'Flexible',
    minDeposit: 100,
    tvl: 45000000,
    color: 'blue',
    icon: Shield,
    features: ['Fixed APY', 'No Lock', 'Protected Capital', 'Daily Compounding'],
  },
  {
    id: 'junior-yield',
    name: 'Junior Yield Hunter',
    description: 'High-yield variable returns from junior tranches',
    apy: { min: 20, max: 30, current: 25.3 },
    risk: 'medium',
    lockPeriod: '30 days',
    minDeposit: 1000,
    tvl: 25000000,
    color: 'green',
    icon: Zap,
    features: ['Variable APY', '30-Day Lock', 'Bonus Rewards', 'Auto-Compound'],
  },
  {
    id: 'balanced-portfolio',
    name: 'Balanced Portfolio',
    description: 'Mix of senior and junior tranches for balanced risk/reward',
    apy: { min: 12, max: 18, current: 15.2 },
    risk: 'medium',
    lockPeriod: 'Flexible',
    minDeposit: 500,
    tvl: 35000000,
    color: 'purple',
    icon: PieChart,
    features: ['Diversified', 'Rebalancing', 'Flexible Exit', 'Risk Management'],
  },
  {
    id: 'boosted-rewards',
    name: 'Boosted Rewards',
    description: 'Enhanced yields with protocol token staking',
    apy: { min: 15, max: 35, current: 28.7 },
    risk: 'high',
    lockPeriod: '90 days',
    minDeposit: 5000,
    tvl: 15000000,
    color: 'yellow',
    icon: Flame,
    features: ['Boosted APY', 'Token Rewards', 'Governance Rights', 'VIP Access'],
  },
]

const opportunities = [
  {
    title: 'New Miami Beach Pool',
    type: 'New Launch',
    apy: '30%',
    bonus: '+5% Early Bird',
    timeLeft: '2 days',
    progress: 65,
    raised: 6500000,
    target: 10000000,
  },
  {
    title: 'NYC Tower Refinancing',
    type: 'Limited Time',
    apy: '25%',
    bonus: '+3% USDC Bonus',
    timeLeft: '5 days',
    progress: 45,
    raised: 4500000,
    target: 10000000,
  },
  {
    title: 'Austin Tech Campus',
    type: 'Featured',
    apy: '22%',
    bonus: 'Double Points',
    timeLeft: '7 days',
    progress: 80,
    raised: 8000000,
    target: 10000000,
  },
]

export default function EarnPage() {
  const [selectedStrategy, setSelectedStrategy] = useState('all')
  
  const stats = [
    DEFI_STATS_PRESETS.tvl(120000000, 8.5),
    DEFI_STATS_PRESETS.apy(18.5, 2.1),
    {
      label: 'Strategies',
      value: strategies.length,
      icon: Target,
      color: 'purple' as const,
    },
    {
      label: 'Avg Lock Period',
      value: '45 days',
      icon: Clock,
      color: 'yellow' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-primary/10 to-transparent" />
          <div className="absolute top-20 -right-20 w-96 h-96 bg-green-600/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-green-950 text-green-400 border-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Earn More With PropertyLend
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 via-primary to-purple-400 bg-clip-text text-transparent">
                Start Earning Today
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8">
              Choose your strategy and earn sustainable yields from real estate-backed loans
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-primary hover:from-green-700 hover:to-primary/90"
              >
                Explore Strategies
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-gray-700 hover:bg-gray-800"
              >
                Use Calculator
                <BarChart3 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8">
        <DeFiStatsDisplay
          stats={stats}
          variant="compact"
          className="bg-gray-900/50 backdrop-blur-sm"
        />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="strategies" className="space-y-8">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="strategies">Yield Strategies</TabsTrigger>
            <TabsTrigger value="opportunities">Special Opportunities</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategies.map((strategy, index) => {
                const Icon = strategy.icon
                const colorClasses = {
                  blue: 'from-blue-950/50 to-blue-900/20 border-blue-800/50 text-blue-400',
                  green: 'from-green-950/50 to-green-900/20 border-green-800/50 text-green-400',
                  purple: 'from-purple-950/50 to-purple-900/20 border-purple-800/50 text-purple-400',
                  yellow: 'from-yellow-950/50 to-yellow-900/20 border-yellow-800/50 text-yellow-400',
                }[strategy.color]

                return (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      'bg-gradient-to-br border backdrop-blur-sm hover:shadow-xl transition-all',
                      colorClasses
                    )}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn('p-3 rounded-lg bg-gray-900/50')}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-white">{strategy.name}</CardTitle>
                              <CardDescription className="text-gray-400">
                                {strategy.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="outline"
                            className={cn(
                              'border',
                              strategy.risk === 'low' && 'text-blue-400 border-blue-400/50',
                              strategy.risk === 'medium' && 'text-yellow-400 border-yellow-400/50',
                              strategy.risk === 'high' && 'text-red-400 border-red-400/50'
                            )}
                          >
                            {strategy.risk} risk
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* APY Display */}
                        <div className="p-4 rounded-lg bg-gray-900/50">
                          <div className="flex items-end justify-between mb-2">
                            <span className="text-sm text-gray-500">Current APY</span>
                            <span className="text-3xl font-bold">{strategy.apy.current}%</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Range: {strategy.apy.min}-{strategy.apy.max}%</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Historical Avg
                            </span>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-gray-900/30">
                            <p className="text-xs text-gray-500 mb-1">Min Deposit</p>
                            <p className="font-semibold text-white">${strategy.minDeposit}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-900/30">
                            <p className="text-xs text-gray-500 mb-1">Lock Period</p>
                            <p className="font-semibold text-white">{strategy.lockPeriod}</p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          {strategy.features.map(feature => (
                            <div key={feature} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* TVL */}
                        <div className="pt-3 border-t border-gray-800">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Deposits</span>
                            <span className="font-semibold text-white">
                              ${(strategy.tvl / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                          Start Earning
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Educational Section */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: '1',
                      title: 'Choose Strategy',
                      description: 'Select a yield strategy that matches your risk profile',
                      icon: Target,
                    },
                    {
                      step: '2',
                      title: 'Deposit Funds',
                      description: 'Deposit USDC, USDT, or DAI into your chosen pools',
                      icon: Coins,
                    },
                    {
                      step: '3',
                      title: 'Earn Yields',
                      description: 'Watch your returns grow with automated compounding',
                      icon: TrendingUp,
                    },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {opportunities.map((opp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="mb-2 bg-primary/20 text-primary border-primary/50">
                            {opp.type}
                          </Badge>
                          <CardTitle className="text-white">{opp.title}</CardTitle>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">{opp.apy}</p>
                          <p className="text-xs text-gray-500">APY</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Bonus Badge */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-950/30 border border-yellow-800/50">
                        <Gift className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-medium">{opp.bonus}</span>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-white">{opp.progress}%</span>
                        </div>
                        <Progress value={opp.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>${(opp.raised / 1000000).toFixed(1)}M raised</span>
                          <span>${(opp.target / 1000000).toFixed(0)}M target</span>
                        </div>
                      </div>

                      {/* Time Left */}
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/30 border border-red-800/50">
                        <Clock className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-400">Ends in {opp.timeLeft}</span>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                        Participate Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Rewards Section */}
            <Card className="bg-gradient-to-br from-purple-950/50 to-purple-900/20 border-purple-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Loyalty Rewards Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { tier: 'Bronze', requirement: '$1K+', bonus: '+1% APY', perks: ['Priority Support'] },
                    { tier: 'Silver', requirement: '$10K+', bonus: '+2% APY', perks: ['Early Access', 'Priority Support'] },
                    { tier: 'Gold', requirement: '$50K+', bonus: '+3% APY', perks: ['VIP Access', 'Early Access', 'Priority Support'] },
                    { tier: 'Platinum', requirement: '$100K+', bonus: '+5% APY', perks: ['Custom Strategies', 'VIP Access', 'Early Access', 'Priority Support'] },
                  ].map((tier) => (
                    <div key={tier.tier} className="p-4 rounded-lg bg-gray-900/50 text-center">
                      <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <h4 className="font-semibold text-white mb-1">{tier.tier}</h4>
                      <p className="text-xs text-gray-500 mb-2">{tier.requirement}</p>
                      <Badge className="bg-green-950 text-green-400 border-green-800">
                        {tier.bonus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <YieldCalculator className="max-w-4xl mx-auto" />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}