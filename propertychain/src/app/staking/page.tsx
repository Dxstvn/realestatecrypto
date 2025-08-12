/**
 * Staking Page - PropertyLend DeFi Platform
 * 
 * Protocol token staking for governance and enhanced rewards
 * Stake PLEND tokens to earn additional APY and voting power
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  Lock,
  Unlock,
  Clock,
  Info,
  ArrowUpRight,
  ChevronRight,
  Coins,
  DollarSign,
  Gift,
  Trophy,
  Zap,
  Shield,
  Award,
  Users,
  Vote,
  AlertCircle,
  CheckCircle,
  Timer,
  Percent,
  BarChart3,
  Flame,
  Star,
} from 'lucide-react'

// Mock data
const stakingPools = [
  {
    id: 'flexible',
    name: 'Flexible Staking',
    description: 'Stake and unstake anytime',
    apy: 12,
    lockPeriod: 'No lock',
    minStake: 100,
    totalStaked: 25000000,
    userStaked: 5000,
    rewards: {
      plend: 12,
      bonus: 0,
    },
    features: ['No lock period', 'Instant withdrawal', 'Basic rewards'],
  },
  {
    id: '30-days',
    name: '30-Day Lock',
    description: 'Lock for 30 days for higher rewards',
    apy: 18,
    lockPeriod: '30 days',
    minStake: 500,
    totalStaked: 35000000,
    userStaked: 10000,
    rewards: {
      plend: 18,
      bonus: 2,
    },
    features: ['30-day lock', '+2% bonus APY', 'Governance power 1.5x'],
  },
  {
    id: '90-days',
    name: '90-Day Lock',
    description: 'Lock for 90 days for maximum rewards',
    apy: 25,
    lockPeriod: '90 days',
    minStake: 1000,
    totalStaked: 45000000,
    userStaked: 0,
    rewards: {
      plend: 25,
      bonus: 5,
    },
    features: ['90-day lock', '+5% bonus APY', 'Governance power 2x', 'VIP benefits'],
  },
  {
    id: 'governance',
    name: 'Governance Vault',
    description: 'Maximum voting power and rewards',
    apy: 35,
    lockPeriod: '180 days',
    minStake: 5000,
    totalStaked: 20000000,
    userStaked: 0,
    rewards: {
      plend: 35,
      bonus: 10,
    },
    features: ['180-day lock', '+10% bonus APY', 'Governance power 3x', 'Revenue sharing', 'Early access'],
  },
]

const userStats = {
  totalStaked: 15000,
  totalRewards: 1250,
  pendingRewards: 125,
  votingPower: 22500,
  tier: 'Silver',
  nextTier: 'Gold',
  tierProgress: 60,
}

const governanceProposals = [
  {
    id: '1',
    title: 'Increase Junior Tranche APY Cap',
    description: 'Proposal to increase the maximum APY for junior tranches from 30% to 35%',
    status: 'active',
    votesFor: 1250000,
    votesAgainst: 450000,
    quorum: 2000000,
    endTime: '2 days',
  },
  {
    id: '2',
    title: 'Add USDT Support',
    description: 'Enable USDT deposits and withdrawals across all lending pools',
    status: 'active',
    votesFor: 890000,
    votesAgainst: 210000,
    quorum: 2000000,
    endTime: '5 days',
  },
  {
    id: '3',
    title: 'Reduce Platform Fees',
    description: 'Reduce platform fees from 2% to 1.5% for all users',
    status: 'passed',
    votesFor: 3450000,
    votesAgainst: 550000,
    quorum: 2000000,
    endTime: 'Ended',
  },
]

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState('flexible')
  const [stakeAmount, setStakeAmount] = useState('')
  const [autoCompound, setAutoCompound] = useState(true)

  const calculateRewards = (amount: number, apy: number, days: number) => {
    const dailyRate = apy / 365 / 100
    return amount * dailyRate * days
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-primary/10 to-transparent" />
          <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-purple-950 text-purple-400 border-purple-800">
              <Flame className="h-3 w-3 mr-1" />
              Stake PLEND Tokens
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-primary to-pink-400 bg-clip-text text-transparent">
                Staking & Governance
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8">
              Stake your PLEND tokens to earn rewards, boost APY, and participate in governance
            </p>

            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: 'Total Staked', value: `${userStats.totalStaked.toLocaleString()} PLEND`, icon: Lock },
                { label: 'Voting Power', value: userStats.votingPower.toLocaleString(), icon: Vote },
                { label: 'Rewards Earned', value: `${userStats.totalRewards} PLEND`, icon: Gift },
                { label: 'Staker Tier', value: userStats.tier, icon: Award },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                >
                  <stat.icon className="h-5 w-5 text-purple-400 mb-2" />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="stake" className="space-y-8">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="stake">Staking Pools</TabsTrigger>
            <TabsTrigger value="rewards">My Rewards</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-8">
            {/* Staking Pools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stakingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border transition-all',
                    selectedPool === pool.id ? 'border-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'border-gray-800 hover:border-gray-700'
                  )}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{pool.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {pool.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-purple-950 text-purple-400 border-purple-800">
                          {pool.lockPeriod}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* APY Display */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-950/50 to-purple-900/20 border border-purple-800/50">
                        <div className="flex items-end justify-between mb-2">
                          <span className="text-sm text-gray-500">Total APY</span>
                          <span className="text-3xl font-bold text-purple-400">{pool.apy}%</span>
                        </div>
                        {pool.rewards.bonus > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <Zap className="h-3 w-3 text-yellow-400" />
                            <span className="text-yellow-400">+{pool.rewards.bonus}% bonus rewards</span>
                          </div>
                        )}
                      </div>

                      {/* Pool Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-gray-900/50">
                          <p className="text-xs text-gray-500 mb-1">Total Staked</p>
                          <p className="font-semibold text-white">
                            {(pool.totalStaked / 1000000).toFixed(1)}M PLEND
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-900/50">
                          <p className="text-xs text-gray-500 mb-1">Your Stake</p>
                          <p className="font-semibold text-white">
                            {pool.userStaked.toLocaleString()} PLEND
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {pool.features.map(feature => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        onClick={() => setSelectedPool(pool.id)}
                      >
                        {pool.userStaked > 0 ? 'Manage Stake' : 'Stake Now'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Staking Calculator */}
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Staking Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stake-amount" className="text-gray-300">
                        Amount to Stake
                      </Label>
                      <Input
                        id="stake-amount"
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="0"
                        className="bg-gray-900/50 border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Select Pool</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {stakingPools.map(pool => (
                          <Button
                            key={pool.id}
                            variant="outline"
                            className={cn(
                              'border-gray-700',
                              selectedPool === pool.id ? 'bg-primary/20 border-primary' : 'hover:bg-gray-800'
                            )}
                            onClick={() => setSelectedPool(pool.id)}
                          >
                            {pool.name.split(' ')[0]}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                      <Label htmlFor="auto-compound" className="text-gray-300 cursor-pointer">
                        Auto-compound rewards
                      </Label>
                      <Switch
                        id="auto-compound"
                        checked={autoCompound}
                        onCheckedChange={setAutoCompound}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-900/50">
                      <h4 className="font-semibold text-white mb-3">Estimated Rewards</h4>
                      {stakeAmount && Number(stakeAmount) > 0 ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Daily</span>
                            <span className="text-white">
                              {calculateRewards(
                                Number(stakeAmount),
                                stakingPools.find(p => p.id === selectedPool)?.apy || 0,
                                1
                              ).toFixed(2)} PLEND
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Monthly</span>
                            <span className="text-white">
                              {calculateRewards(
                                Number(stakeAmount),
                                stakingPools.find(p => p.id === selectedPool)?.apy || 0,
                                30
                              ).toFixed(2)} PLEND
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Yearly</span>
                            <span className="text-green-400 font-semibold">
                              {calculateRewards(
                                Number(stakeAmount),
                                stakingPools.find(p => p.id === selectedPool)?.apy || 0,
                                365
                              ).toFixed(2)} PLEND
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Enter an amount to see rewards</p>
                      )}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      disabled={!stakeAmount || Number(stakeAmount) <= 0}
                    >
                      Stake {stakeAmount || '0'} PLEND
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            {/* Rewards Overview */}
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Rewards Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-950/50 to-green-900/20 border border-green-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-gray-500">Pending Rewards</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{userStats.pendingRewards} PLEND</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3 border-green-800 text-green-400 hover:bg-green-950/50"
                    >
                      Claim Rewards
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <span className="text-sm text-gray-500">Total Earned</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{userStats.totalRewards} PLEND</p>
                    <p className="text-xs text-gray-500 mt-1">All time rewards</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-gray-500">Avg APY</span>
                    </div>
                    <p className="text-2xl font-bold text-white">15.2%</p>
                    <p className="text-xs text-gray-500 mt-1">Across all pools</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tier Progress */}
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Staker Tier Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-yellow-950/30">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{userStats.tier} Tier</p>
                      <p className="text-sm text-gray-500">Next: {userStats.nextTier}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-950 text-yellow-400 border-yellow-800">
                    {userStats.tierProgress}% Complete
                  </Badge>
                </div>

                <Progress value={userStats.tierProgress} className="h-3" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier, index) => (
                    <div 
                      key={tier}
                      className={cn(
                        'p-3 rounded-lg text-center',
                        tier === userStats.tier ? 'bg-primary/20 border border-primary/50' : 'bg-gray-900/50'
                      )}
                    >
                      <Star className={cn(
                        'h-5 w-5 mx-auto mb-1',
                        tier === userStats.tier ? 'text-primary' : 'text-gray-600'
                      )} />
                      <p className={cn(
                        'text-sm font-medium',
                        tier === userStats.tier ? 'text-white' : 'text-gray-500'
                      )}>
                        {tier}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            {/* Voting Power */}
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Your Voting Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-3">
                    <Vote className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-white">{userStats.votingPower.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total voting power</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/50">
                    Top 20%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Proposals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Active Proposals</h3>
              {governanceProposals.map((proposal) => (
                <Card key={proposal.id} className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{proposal.title}</CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {proposal.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          proposal.status === 'active' && 'text-green-400 border-green-400/50',
                          proposal.status === 'passed' && 'text-blue-400 border-blue-400/50'
                        )}
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Voting Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">For</span>
                        <span className="text-green-400">{(proposal.votesFor / 1000000).toFixed(1)}M votes</span>
                      </div>
                      <Progress 
                        value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Against</span>
                        <span className="text-red-400">{(proposal.votesAgainst / 1000000).toFixed(1)}M votes</span>
                      </div>
                    </div>

                    {/* Quorum */}
                    <div className="p-3 rounded-lg bg-gray-900/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Quorum</span>
                        <span className="text-white">
                          {((proposal.votesFor + proposal.votesAgainst) / proposal.quorum * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Time & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{proposal.endTime}</span>
                      </div>
                      {proposal.status === 'active' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-green-800 text-green-400 hover:bg-green-950/50">
                            Vote For
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-800 text-red-400 hover:bg-red-950/50">
                            Vote Against
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}