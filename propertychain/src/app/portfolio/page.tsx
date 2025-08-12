/**
 * Portfolio Page - PropertyLend DeFi Platform
 * 
 * User's personal dashboard showing positions, earnings, and performance
 * Real-time portfolio tracking with detailed analytics
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DeFiDashboard } from '@/components/custom/defi-dashboard'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  BarChart3,
  PieChart,
  Activity,
  Lock,
  Unlock,
  Calendar,
  Award,
  Shield,
  Zap,
  Info,
  Settings,
  Bell,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'

// Mock user data
const userData = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb9',
  ens: 'defi-whale.eth',
  totalValue: 125430,
  totalEarned: 12543,
  monthlyIncome: 1045,
  memberSince: '2024-01-15',
  tier: 'Gold',
  tierProgress: 75,
  nextTier: 'Platinum',
  nextTierRequirement: 150000,
}

const positions = [
  {
    id: '1',
    poolName: 'Miami Beach Resort - Senior',
    type: 'senior',
    deposited: 25000,
    earned: 2125,
    apy: 8.5,
    status: 'active',
    maturity: '2025-01-15',
    daysRemaining: 365,
    autoCompound: true,
  },
  {
    id: '2',
    poolName: 'NYC Commercial - Junior',
    type: 'junior',
    deposited: 50000,
    earned: 6250,
    apy: 25.0,
    status: 'active',
    maturity: '2024-12-31',
    daysRemaining: 320,
    autoCompound: true,
  },
  {
    id: '3',
    poolName: 'Austin Tech Hub - Senior',
    type: 'senior',
    deposited: 30000,
    earned: 2400,
    apy: 8.0,
    status: 'locked',
    maturity: '2024-06-30',
    daysRemaining: 180,
    autoCompound: false,
  },
  {
    id: '4',
    poolName: 'SF Marina District - Junior',
    type: 'junior',
    deposited: 20000,
    earned: 1768,
    apy: 28.5,
    status: 'pending',
    maturity: '2024-03-31',
    daysRemaining: 90,
    autoCompound: true,
  },
]

const transactions = [
  { id: '1', type: 'deposit', pool: 'Miami Beach Resort', amount: 25000, date: '2024-01-15', status: 'completed' },
  { id: '2', type: 'earn', pool: 'NYC Commercial', amount: 625, date: '2024-01-14', status: 'completed' },
  { id: '3', type: 'deposit', pool: 'Austin Tech Hub', amount: 30000, date: '2024-01-10', status: 'completed' },
  { id: '4', type: 'withdraw', pool: 'LA Downtown', amount: 15000, date: '2024-01-08', status: 'completed' },
  { id: '5', type: 'earn', pool: 'Miami Beach Resort', amount: 212, date: '2024-01-07', status: 'completed' },
]

const performanceData = [
  { month: 'Jan', portfolio: 100000, earnings: 1850 },
  { month: 'Feb', portfolio: 102000, earnings: 1920 },
  { month: 'Mar', portfolio: 105000, earnings: 2100 },
  { month: 'Apr', portfolio: 108000, earnings: 2250 },
  { month: 'May', portfolio: 112000, earnings: 2400 },
  { month: 'Jun', portfolio: 115000, earnings: 2543 },
  { month: 'Jul', portfolio: 118000, earnings: 2650 },
  { month: 'Aug', portfolio: 121000, earnings: 2780 },
  { month: 'Sep', portfolio: 123000, earnings: 2890 },
  { month: 'Oct', portfolio: 125430, earnings: 3000 },
]

const allocationData = [
  { name: 'Senior Tranches', value: 55000, percentage: 44, color: '#3b82f6' },
  { name: 'Junior Tranches', value: 70000, percentage: 56, color: '#10b981' },
]

export default function PortfolioPage() {
  const [showBalance, setShowBalance] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(userData.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatValue = (value: number) => {
    if (!showBalance) return '•••••'
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header Section */}
      <section className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/api/placeholder/64/64" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                  DW
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{userData.ens}</h1>
                  <Badge className="bg-yellow-950 text-yellow-400 border-yellow-800">
                    <Award className="h-3 w-3 mr-1" />
                    {userData.tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 font-mono">
                    {userData.address.slice(0, 6)}...{userData.address.slice(-4)}
                  </span>
                  <button onClick={handleCopyAddress} className="text-gray-500 hover:text-white">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Portfolio Value */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Portfolio Value</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {formatValue(userData.totalValue)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">+12.5% this month</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Earned</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">
                      {formatValue(userData.totalEarned)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      All time earnings
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Income</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {formatValue(userData.monthlyIncome)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Avg per month
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-gray-500">Tier Progress</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-white">{userData.tier}</span>
                    <span className="text-sm text-gray-500">→ {userData.nextTier}</span>
                  </div>
                  <Progress value={userData.tierProgress} className="mt-3" />
                  <p className="text-xs text-gray-500 mt-2">
                    ${((userData.nextTierRequirement - userData.totalValue) / 1000).toFixed(0)}k to next tier
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="positions" className="space-y-8">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="positions">Active Positions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-6">
            {/* Positions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {positions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800 hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{position.poolName}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="outline"
                              className={cn(
                                position.type === 'senior' 
                                  ? 'text-blue-400 border-blue-400/50' 
                                  : 'text-green-400 border-green-400/50'
                              )}
                            >
                              {position.type === 'senior' ? <Shield className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
                              {position.type}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={cn(
                                'text-xs',
                                position.status === 'active' && 'text-green-400 border-green-400/50',
                                position.status === 'locked' && 'text-yellow-400 border-yellow-400/50',
                                position.status === 'pending' && 'text-gray-400 border-gray-400/50'
                              )}
                            >
                              {position.status === 'locked' ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                              {position.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">{position.apy}%</p>
                          <p className="text-xs text-gray-500">APY</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Value Display */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-gray-900/50">
                          <p className="text-xs text-gray-500 mb-1">Deposited</p>
                          <p className="text-lg font-semibold text-white">
                            ${position.deposited.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-950/30">
                          <p className="text-xs text-gray-500 mb-1">Earned</p>
                          <p className="text-lg font-semibold text-green-400">
                            +${position.earned.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Total Value */}
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Total Value</span>
                          <span className="text-xl font-bold text-white">
                            ${(position.deposited + position.earned).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Maturity Info */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Matures</p>
                            <p className="text-sm text-white">{position.maturity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Remaining</p>
                          <p className="text-sm font-semibold text-white">{position.daysRemaining} days</p>
                        </div>
                      </div>

                      {/* Auto-compound Status */}
                      {position.autoCompound && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/30 border border-blue-800/50">
                          <RefreshCw className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-blue-400">Auto-compounding enabled</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-gray-700 hover:bg-gray-800"
                          disabled={position.status === 'locked'}
                        >
                          Withdraw
                        </Button>
                        <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                          Add More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Allocation Chart */}
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: '#111827', 
                            border: '1px solid #374151',
                            borderRadius: '8px' 
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {allocationData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-white">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">
                            ${(item.value / 1000).toFixed(0)}k
                          </p>
                          <p className="text-xs text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: '#111827', 
                          border: '1px solid #374151',
                          borderRadius: '8px' 
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="portfolio" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#portfolioGradient)"
                        name="Portfolio Value"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#earningsGradient)"
                        name="Monthly Earnings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'p-2 rounded-lg',
                          tx.type === 'deposit' && 'bg-blue-950/50',
                          tx.type === 'earn' && 'bg-green-950/50',
                          tx.type === 'withdraw' && 'bg-red-950/50'
                        )}>
                          {tx.type === 'deposit' && <ArrowDownRight className="h-4 w-4 text-blue-400" />}
                          {tx.type === 'earn' && <TrendingUp className="h-4 w-4 text-green-400" />}
                          {tx.type === 'withdraw' && <ArrowUpRight className="h-4 w-4 text-red-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-white capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">{tx.pool}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          'font-semibold',
                          tx.type === 'withdraw' ? 'text-red-400' : 'text-green-400'
                        )}>
                          {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <DeFiDashboard />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}