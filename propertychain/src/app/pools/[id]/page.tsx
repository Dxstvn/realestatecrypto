/**
 * Pool Details Page - PropertyLend
 * Phase 5.1: Individual pool details with comprehensive information
 * 
 * Dynamic route: /pools/[id]
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  TrendingUp,
  Shield,
  Zap,
  AlertTriangle,
  Info,
  DollarSign,
  Calendar,
  Users,
  Home,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  Share2,
  Heart,
  ChevronDown,
  Wallet,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { Loading } from '@/components/ui/loading-states-v2'

// Mock pool data - Replace with API call
const getPoolData = (id: string) => ({
  id,
  name: 'Miami Beach Luxury Development',
  status: 'active',
  type: 'Bridge Loan',
  propertyType: 'Residential',
  location: 'Miami Beach, FL',
  borrower: 'Verified Developer',
  totalSize: 5000000,
  funded: 3850000,
  fundingProgress: 77,
  seniorTranche: {
    apy: 8.0,
    size: 3500000,
    filled: 2850000,
    available: 650000,
    investors: 142,
    minInvestment: 1000,
    protection: 'First 20% loss protection',
  },
  juniorTranche: {
    apy: 25.5,
    size: 1500000,
    filled: 1000000,
    available: 500000,
    investors: 38,
    minInvestment: 5000,
    risk: 'Subordinated to senior tranche',
  },
  loanDetails: {
    amount: 5000000,
    ltv: 65,
    term: 12,
    startDate: '2024-01-15',
    maturityDate: '2025-01-15',
    paymentFrequency: 'Monthly',
    interestRate: 14.5,
    collateralValue: 7692307,
  },
  riskMetrics: {
    riskScore: 'B+',
    defaultProbability: 0.8,
    recoveryRate: 98.5,
    stressTestScore: 92,
  },
  performance: {
    currentAPY: 14.75,
    historicalAPY: 13.2,
    paymentsOnTime: 11,
    totalPayments: 11,
    totalInterestPaid: 532000,
  },
  documents: [
    { name: 'Loan Agreement', date: '2024-01-10', type: 'PDF' },
    { name: 'Property Appraisal', date: '2024-01-05', type: 'PDF' },
    { name: 'Title Insurance', date: '2024-01-08', type: 'PDF' },
    { name: 'Environmental Report', date: '2024-01-03', type: 'PDF' },
  ],
  recentTransactions: [
    { date: '2024-08-10', type: 'Deposit', amount: 25000, user: '0x742d...b48e', tranche: 'Senior' },
    { date: '2024-08-09', type: 'Interest', amount: 44333, user: 'Pool', tranche: 'All' },
    { date: '2024-08-08', type: 'Deposit', amount: 100000, user: '0x9f2e...3d1a', tranche: 'Junior' },
    { date: '2024-08-07', type: 'Withdrawal', amount: 50000, user: '0x1a3b...7c9d', tranche: 'Senior' },
    { date: '2024-08-06', type: 'Deposit', amount: 75000, user: '0x5e8f...2b4c', tranche: 'Senior' },
  ],
})

// Chart data for performance visualization
const performanceData = [
  { month: 'Jan', apy: 14.2, tvl: 1000000 },
  { month: 'Feb', apy: 14.5, tvl: 2000000 },
  { month: 'Mar', apy: 14.3, tvl: 2500000 },
  { month: 'Apr', apy: 14.8, tvl: 3000000 },
  { month: 'May', apy: 14.6, tvl: 3200000 },
  { month: 'Jun', apy: 14.9, tvl: 3500000 },
  { month: 'Jul', apy: 14.7, tvl: 3700000 },
  { month: 'Aug', apy: 14.75, tvl: 3850000 },
]

export default function PoolDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const poolId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [pool, setPool] = useState<any>(null)
  const [selectedTranche, setSelectedTranche] = useState<'senior' | 'junior'>('senior')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [calculatedYield, setCalculatedYield] = useState(0)
  const [timeframe, setTimeframe] = useState('1y')
  const [activeTab, setActiveTab] = useState('overview')

  // Load pool data
  useEffect(() => {
    const loadPoolData = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const data = getPoolData(poolId)
      setPool(data)
      setLoading(false)
    }
    
    loadPoolData()
  }, [poolId])

  // Calculate yield based on input
  useEffect(() => {
    if (investmentAmount && pool) {
      const amount = parseFloat(investmentAmount)
      if (!isNaN(amount)) {
        const apy = selectedTranche === 'senior' 
          ? pool.seniorTranche.apy 
          : pool.juniorTranche.apy
        const monthlyYield = (amount * (apy / 100)) / 12
        setCalculatedYield(monthlyYield)
      }
    } else {
      setCalculatedYield(0)
    }
  }, [investmentAmount, selectedTranche, pool])

  if (loading) {
    return <Loading.Page type="fetchingPools" />
  }

  if (!pool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Pool not found
            </p>
            <Button 
              onClick={() => router.push('/pools')}
              className="w-full mt-4"
            >
              Back to Pools
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentTranche = selectedTranche === 'senior' ? pool.seniorTranche : pool.juniorTranche

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section with Pool Stats */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 py-12">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/pools" className="hover:text-white transition-colors">
              Pools
            </Link>
            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            <span className="text-white">{pool.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {pool.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {pool.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 border-gray-600">
                        {pool.type}
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 border-gray-600">
                        <Home className="h-3 w-3 mr-1" />
                        {pool.propertyType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  <span className="text-gray-400">Location:</span> {pool.location} • 
                  <span className="text-gray-400 ml-2">Borrower:</span> {pool.borrower}
                </p>

                {/* Funding Progress */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Funding Progress</span>
                    <span className="text-sm font-semibold text-white">
                      ${pool.funded.toLocaleString()} / ${pool.totalSize.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={pool.fundingProgress} className="h-3 mb-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{pool.fundingProgress}% Funded</span>
                    <span className="text-gray-400">
                      ${(pool.totalSize - pool.funded).toLocaleString()} Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Term</span>
                  </div>
                  <p className="text-xl font-bold text-white">{pool.loanDetails.term} months</p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">LTV</span>
                    <InfoTooltip term="LTV" />
                  </div>
                  <p className="text-xl font-bold text-white">{pool.loanDetails.ltv}%</p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Investors</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {pool.seniorTranche.investors + pool.juniorTranche.investors}
                  </p>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Risk Score</span>
                  </div>
                  <p className="text-xl font-bold text-white">{pool.riskMetrics.riskScore}</p>
                </div>
              </div>
            </div>

            {/* Tranche Selector & Quick Invest */}
            <div className="space-y-6">
              {/* Tranche Cards */}
              <div className="space-y-4">
                {/* Senior Tranche */}
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedTranche === 'senior' 
                      ? "ring-2 ring-blue-500 bg-blue-500/10" 
                      : "hover:bg-gray-800/50"
                  )}
                  onClick={() => setSelectedTranche('senior')}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <CardTitle className="text-lg">Senior Tranche</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                        Low Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-white">{pool.seniorTranche.apy}%</span>
                        <span className="text-sm text-gray-400">APY</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Available</span>
                          <span className="text-white">
                            ${pool.seniorTranche.available.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min Investment</span>
                          <span className="text-white">
                            ${pool.seniorTranche.minInvestment.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Protection</span>
                          <span className="text-green-400 text-xs">First 20% loss</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Junior Tranche */}
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedTranche === 'junior' 
                      ? "ring-2 ring-green-500 bg-green-500/10" 
                      : "hover:bg-gray-800/50"
                  )}
                  onClick={() => setSelectedTranche('junior')}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-green-400" />
                        <CardTitle className="text-lg">Junior Tranche</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400/30">
                        High Yield
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-white">{pool.juniorTranche.apy}%</span>
                        <span className="text-sm text-gray-400">APY</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Available</span>
                          <span className="text-white">
                            ${pool.juniorTranche.available.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min Investment</span>
                          <span className="text-white">
                            ${pool.juniorTranche.minInvestment.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk</span>
                          <span className="text-yellow-400 text-xs">Subordinated</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Invest */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Invest</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-400">Investment Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        type="number"
                        placeholder={`Min ${currentTranche.minInvestment.toLocaleString()}`}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  {calculatedYield > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated Monthly Yield</span>
                        <span className="text-green-400 font-semibold">
                          ${calculatedYield.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-400">Annual Return</span>
                        <span className="text-green-400 font-semibold">
                          ${(calculatedYield * 12).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet to Invest
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loan Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                        <span className="font-medium">${pool.loanDetails.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Collateral Value</span>
                        <span className="font-medium">${pool.loanDetails.collateralValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">LTV Ratio</span>
                        <span className="font-medium">{pool.loanDetails.ltv}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Interest Rate</span>
                        <span className="font-medium">{pool.loanDetails.interestRate}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                        <span className="font-medium">{pool.loanDetails.startDate}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 dark:text-gray-400">Maturity Date</span>
                        <span className="font-medium">{pool.loanDetails.maturityDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Yield Calculator */}
                <Card>
                  <CardHeader>
                    <CardTitle>Yield Calculator</CardTitle>
                    <CardDescription>
                      Calculate your potential returns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Investment Amount</Label>
                        <Slider
                          value={[parseFloat(investmentAmount) || 0]}
                          onValueChange={(value) => setInvestmentAmount(value[0].toString())}
                          max={100000}
                          min={currentTranche.minInvestment}
                          step={1000}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>${currentTranche.minInvestment.toLocaleString()}</span>
                          <span>${(parseFloat(investmentAmount) || 0).toLocaleString()}</span>
                          <span>$100,000</span>
                        </div>
                      </div>

                      <div>
                        <Label>Investment Period</Label>
                        <Select defaultValue="12">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 months</SelectItem>
                            <SelectItem value="6">6 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Monthly Yield</span>
                          <span className="font-semibold text-green-500">
                            ${calculatedYield.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Quarterly Yield</span>
                          <span className="font-semibold text-green-500">
                            ${(calculatedYield * 3).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Annual Yield</span>
                          <span className="font-semibold text-green-500">
                            ${(calculatedYield * 12).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Return</span>
                          <span className="font-bold text-green-500 text-lg">
                            ${((parseFloat(investmentAmount) || 0) + (calculatedYield * 12)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Property & Collateral Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Property Type</p>
                      <p className="font-medium">{pool.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                      <p className="font-medium">{pool.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Appraised Value</p>
                      <p className="font-medium">${pool.loanDetails.collateralValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loan Purpose</p>
                      <p className="font-medium">Property Development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Historical Performance</CardTitle>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Simple chart visualization */}
                  <div className="h-64 flex items-end justify-between gap-2">
                    {performanceData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t"
                          style={{ height: `${(data.apy / 20) * 100}%` }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          {data.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current APY</span>
                    </div>
                    <p className="text-2xl font-bold">{pool.performance.currentAPY}%</p>
                    <p className="text-sm text-green-500">+1.55% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payment Record</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {pool.performance.paymentsOnTime}/{pool.performance.totalPayments}
                    </p>
                    <p className="text-sm text-blue-500">100% on-time payments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest Paid</span>
                    </div>
                    <p className="text-2xl font-bold">
                      ${pool.performance.totalInterestPaid.toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-500">Distributed to investors</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Analysis Tab */}
            <TabsContent value="risk" className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Risk Disclosure</AlertTitle>
                <AlertDescription>
                  All investments carry risk. Past performance does not guarantee future results. 
                  Please review all risk factors before investing.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score</span>
                          <span className="font-semibold">{pool.riskMetrics.riskScore}</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Default Probability</span>
                          <span className="font-semibold text-green-500">{pool.riskMetrics.defaultProbability}%</span>
                        </div>
                        <Progress value={pool.riskMetrics.defaultProbability} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Recovery Rate</span>
                          <span className="font-semibold">{pool.riskMetrics.recoveryRate}%</span>
                        </div>
                        <Progress value={pool.riskMetrics.recoveryRate} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Stress Test Score</span>
                          <span className="font-semibold">{pool.riskMetrics.stressTestScore}%</span>
                        </div>
                        <Progress value={pool.riskMetrics.stressTestScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Strong Collateral Coverage</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            LTV ratio of {pool.loanDetails.ltv}% provides significant buffer
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Verified Borrower</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Borrower has completed KYC and has good payment history
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Market Risk</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Property values may fluctuate with market conditions
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Liquidity Consideration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Funds are locked until loan maturity or secondary market launch
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Tranche</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pool.recentTransactions.map((tx: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>
                            <Badge variant={tx.type === 'Deposit' ? 'default' : 'outline'}>
                              {tx.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${tx.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{tx.user}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {tx.tranche}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                              Confirmed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Documents</CardTitle>
                  <CardDescription>
                    All documents have been verified and are available for download
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pool.documents.map((doc: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded">
                            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Added {doc.date} • {doc.type}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Pools */}
      <section className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Similar Investment Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for related pools */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Loading Pool {i}</CardTitle>
                  <CardDescription>Similar risk profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">APY</span>
                      <span className="font-semibold">12-25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                      <span className="font-semibold">$500,000</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}