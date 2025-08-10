/**
 * Yield Calculator Component - PropertyLend
 * 
 * DeFi yield farming calculator with APY projections and risk analysis
 * Transformed from InvestmentCalculator for Web3 DeFi platform
 */

'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'
import {
  Info,
  TrendingUp,
  DollarSign,
  Calendar,
  Calculator,
  BarChart3,
  Percent,
  Zap,
  Shield,
  AlertTriangle,
  Coins,
  PiggyBank,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Flame,
  Lock,
  Unlock,
  Activity,
  Award,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

interface YieldCalculatorProps {
  className?: string
}

export function YieldCalculator({ className }: YieldCalculatorProps) {
  // State for calculator inputs
  const [principal, setPrincipal] = React.useState(10000)
  const [tranche, setTranche] = React.useState<'junior' | 'senior'>('junior')
  const [duration, setDuration] = React.useState(12) // months
  const [compounding, setCompounding] = React.useState<'daily' | 'monthly' | 'annually'>('daily')
  const [includeRewards, setIncludeRewards] = React.useState(true)
  const [autoCompound, setAutoCompound] = React.useState(true)
  const [leverage, setLeverage] = React.useState(1)
  
  // APY rates based on tranche selection
  const apyRates = {
    junior: { base: 18, boosted: 30, rewards: 5 },
    senior: { base: 8, boosted: 12, rewards: 2 },
  }

  const currentAPY = apyRates[tranche]
  const totalAPY = currentAPY.base + (includeRewards ? currentAPY.rewards : 0)
  const effectiveAPY = totalAPY * leverage

  // Calculate projected yields
  const calculateYield = () => {
    const rate = effectiveAPY / 100
    let periods = 365 // daily by default
    
    if (compounding === 'monthly') periods = 12
    if (compounding === 'annually') periods = 1
    
    const compoundedAmount = principal * Math.pow(1 + rate / periods, periods * (duration / 12))
    const totalYield = compoundedAmount - principal
    const monthlyYield = totalYield / duration
    const dailyYield = totalYield / (duration * 30)
    
    return {
      total: compoundedAmount,
      yield: totalYield,
      monthly: monthlyYield,
      daily: dailyYield,
      roi: (totalYield / principal) * 100,
    }
  }

  const results = calculateYield()

  // Generate projection data for chart
  const generateProjectionData = () => {
    const data = []
    for (let month = 0; month <= duration; month++) {
      const rate = effectiveAPY / 100
      const periods = compounding === 'daily' ? 365 : compounding === 'monthly' ? 12 : 1
      const amount = principal * Math.pow(1 + rate / periods, periods * (month / 12))
      
      data.push({
        month: `M${month}`,
        value: Math.round(amount),
        yield: Math.round(amount - principal),
      })
    }
    return data
  }

  const projectionData = generateProjectionData()

  // Risk metrics based on tranche and leverage
  const getRiskLevel = () => {
    if (tranche === 'senior') return leverage > 2 ? 'medium' : 'low'
    if (tranche === 'junior') {
      if (leverage > 3) return 'high'
      if (leverage > 1.5) return 'medium'
      return 'medium'
    }
    return 'medium'
  }

  const riskLevel = getRiskLevel()
  const riskColors = {
    low: 'text-green-400 bg-green-950 border-green-800',
    medium: 'text-yellow-400 bg-yellow-950 border-yellow-800',
    high: 'text-red-400 bg-red-950 border-red-800',
  }

  return (
    <Card className={cn(
      'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950',
      'border border-gray-800',
      className
    )}>
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Yield Calculator
            </CardTitle>
            <CardDescription className="text-gray-400">
              Calculate your potential DeFi returns
            </CardDescription>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/50">
            <Zap className="h-3 w-3 mr-1" />
            Advanced Mode
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="projection">Projection</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6 mt-6">
            {/* Input Section */}
            <div className="grid gap-6">
              {/* Principal Amount */}
              <div className="space-y-2">
                <Label htmlFor="principal" className="text-gray-300">
                  Investment Amount
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                    placeholder="10,000"
                  />
                </div>
                <div className="flex gap-2">
                  {[1000, 5000, 10000, 50000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrincipal(amount)}
                      className="flex-1 border-gray-700 hover:bg-primary/10"
                    >
                      ${formatNumber(amount)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tranche Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">Select Tranche</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTranche('junior')}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all',
                      'bg-gray-900/50 hover:bg-gray-900/70',
                      tranche === 'junior' 
                        ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                        : 'border-gray-700'
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Junior</span>
                        <Badge className="bg-green-950 text-green-400 border-green-800">
                          High Yield
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-green-400">
                        {apyRates.junior.base}-{apyRates.junior.boosted}%
                      </p>
                      <p className="text-xs text-gray-500">APY</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setTranche('senior')}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all',
                      'bg-gray-900/50 hover:bg-gray-900/70',
                      tranche === 'senior' 
                        ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'border-gray-700'
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Senior</span>
                        <Badge className="bg-blue-950 text-blue-400 border-blue-800">
                          Low Risk
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">
                        {apyRates.senior.base}-{apyRates.senior.boosted}%
                      </p>
                      <p className="text-xs text-gray-500">APY</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Lock Period</Label>
                  <span className="text-sm font-medium text-white">
                    {duration} months
                  </span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={([value]) => setDuration(value)}
                  min={1}
                  max={36}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 month</span>
                  <span>36 months</span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-purple-400" />
                    <Label htmlFor="rewards" className="text-gray-300 cursor-pointer">
                      Include Rewards
                    </Label>
                  </div>
                  <Switch
                    id="rewards"
                    checked={includeRewards}
                    onCheckedChange={setIncludeRewards}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <Label htmlFor="compound" className="text-gray-300 cursor-pointer">
                      Auto-Compound
                    </Label>
                  </div>
                  <Switch
                    id="compound"
                    checked={autoCompound}
                    onCheckedChange={setAutoCompound}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">Projected Returns</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-950/50 to-green-900/20 border border-green-800/50">
                  <p className="text-sm text-gray-400 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(results.total)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/50 to-purple-900/20 border border-purple-800/50">
                  <p className="text-sm text-gray-400 mb-1">Total Yield</p>
                  <p className="text-2xl font-bold text-purple-400">
                    +{formatCurrency(results.yield)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(results.monthly)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">ROI</p>
                  <p className="text-lg font-bold text-white">
                    {formatPercentage(results.roi / 100)}
                  </p>
                </div>
              </div>

              {/* Risk Indicator */}
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Risk Level</span>
                  </div>
                  <Badge 
                    variant="outline"
                    className={cn('uppercase', riskColors[riskLevel])}
                  >
                    {riskLevel}
                  </Badge>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                size="lg"
              >
                Start Earning {formatPercentage(effectiveAPY / 100)} APY
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="projection" className="space-y-6 mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#111827', 
                      border: '1px solid #374151',
                      borderRadius: '8px' 
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorValue)"
                    name="Total Value"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorYield)"
                    name="Yield Earned"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Best Month</p>
                <p className="text-lg font-bold text-white">
                  Month {duration}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Break Even</p>
                <p className="text-lg font-bold text-white">
                  Immediate
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Max Drawdown</p>
                <p className="text-lg font-bold text-green-400">
                  0%
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            {/* Leverage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">
                  Leverage
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline-block ml-1 h-3 w-3 text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Multiply your exposure and potential returns. Higher leverage increases risk.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm font-medium text-white">
                  {leverage}x
                </span>
              </div>
              <Slider
                value={[leverage]}
                onValueChange={([value]) => setLeverage(value)}
                min={1}
                max={5}
                step={0.5}
                className="py-4"
              />
              {leverage > 2 && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-950/50 border border-yellow-800/50">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <p className="text-xs text-yellow-400">
                    High leverage increases liquidation risk
                  </p>
                </div>
              )}
            </div>

            {/* Compounding Frequency */}
            <div className="space-y-2">
              <Label className="text-gray-300">Compounding Frequency</Label>
              <Select value={compounding} onValueChange={(value: any) => setCompounding(value)}>
                <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Effective APY Display */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/50">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Effective APY</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  {formatPercentage(effectiveAPY / 100)}
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Base APY:</span>
                    <span>{currentAPY.base}%</span>
                  </div>
                  {includeRewards && (
                    <div className="flex justify-between">
                      <span>Rewards APY:</span>
                      <span>+{currentAPY.rewards}%</span>
                    </div>
                  )}
                  {leverage > 1 && (
                    <div className="flex justify-between">
                      <span>Leverage:</span>
                      <span>×{leverage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}