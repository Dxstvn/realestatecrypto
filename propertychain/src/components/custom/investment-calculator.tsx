/**
 * Investment Calculator Component - PropertyChain
 * 
 * Comprehensive investment analysis and projection tool
 * Following RECOVERY_PLAN.md Step 2.1 specifications
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'
import {
  Info,
  Download,
  FileSpreadsheet,
  FileText,
  Save,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Calculator,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Wallet,
  Home,
  PiggyBank,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface InvestmentCalculatorProps {
  propertyPrice?: number
  tokenPrice?: number
  expectedROI?: number
  monthlyRent?: number
  appreciationRate?: number
  className?: string
  onCalculate?: (results: CalculationResults) => void
}

interface CalculationResults {
  totalReturn: number
  totalReturnPercent: number
  annualROI: number
  monthlyCashFlow: number
  breakEvenMonths: number
  platformFee: number
  managementFee: number
  exitFee: number
  netReturn: number
  projectionData: ProjectionDataPoint[]
  comparisonData: ComparisonData
}

interface ProjectionDataPoint {
  year: number
  investment: number
  returns: number
  total: number
  cashFlow: number
  appreciation: number
}

interface ComparisonData {
  yourInvestment: number[]
  sp500: number[]
  realEstateIndex: number[]
  savingsAccount: number[]
}

interface SavedScenario {
  id: string
  name: string
  date: Date
  params: {
    amount: number
    period: number
    useFinancing: boolean
    propertyPrice: number
    appreciationRate: number
    rentalIncreaseRate: number
    expenseRatio: number
  }
  results: CalculationResults
}

// ============================================================================
// Investment Calculator Component
// ============================================================================

export function InvestmentCalculator({
  propertyPrice = 1000000,
  tokenPrice = 100,
  expectedROI = 8.5,
  monthlyRent = 5000,
  appreciationRate = 3,
  className,
  onCalculate,
}: InvestmentCalculatorProps) {
  // State Management
  const [investmentAmount, setInvestmentAmount] = React.useState(10000)
  const [holdingPeriod, setHoldingPeriod] = React.useState(5)
  const [useFinancing, setUseFinancing] = React.useState(false)
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [showFeeBreakdown, setShowFeeBreakdown] = React.useState(false)
  
  // Advanced Options
  const [customAppreciationRate, setCustomAppreciationRate] = React.useState(appreciationRate)
  const [rentalIncreaseRate, setRentalIncreaseRate] = React.useState(2)
  const [expenseRatio, setExpenseRatio] = React.useState(30)
  
  // Saved Scenarios
  const [savedScenarios, setSavedScenarios] = React.useState<SavedScenario[]>([])
  const [showSavedScenarios, setShowSavedScenarios] = React.useState(false)
  
  // Calculate Investment Returns
  const calculateReturns = React.useMemo((): CalculationResults => {
    // Calculate fees
    const platformFee = investmentAmount * 0.02 // 2% platform fee
    const annualManagementFee = investmentAmount * 0.01 // 1% annual
    const totalManagementFee = annualManagementFee * holdingPeriod
    const exitFee = investmentAmount * 0.01 // 1% exit fee
    const totalFees = platformFee + totalManagementFee + exitFee
    
    // Calculate monthly cash flow
    const ownershipPercentage = investmentAmount / propertyPrice
    const grossMonthlyCashFlow = monthlyRent * ownershipPercentage
    const monthlyExpenses = grossMonthlyCashFlow * (expenseRatio / 100)
    const netMonthlyCashFlow = grossMonthlyCashFlow - monthlyExpenses - (annualManagementFee / 12)
    
    // Calculate total returns
    const totalCashFlow = netMonthlyCashFlow * 12 * holdingPeriod
    const totalAppreciation = investmentAmount * Math.pow(1 + customAppreciationRate / 100, holdingPeriod) - investmentAmount
    const grossReturn = totalCashFlow + totalAppreciation
    const netReturn = grossReturn - totalFees
    const totalReturnPercent = (netReturn / investmentAmount) * 100
    const annualROI = totalReturnPercent / holdingPeriod
    
    // Calculate break-even
    const breakEvenMonths = Math.ceil(investmentAmount / netMonthlyCashFlow)
    
    // Generate projection data
    const projectionData: ProjectionDataPoint[] = []
    let cumulativeReturns = 0
    let currentValue = investmentAmount
    
    for (let year = 0; year <= holdingPeriod; year++) {
      if (year > 0) {
        const yearCashFlow = netMonthlyCashFlow * 12 * Math.pow(1 + rentalIncreaseRate / 100, year - 1)
        cumulativeReturns += yearCashFlow
        currentValue = investmentAmount * Math.pow(1 + customAppreciationRate / 100, year)
      }
      
      projectionData.push({
        year,
        investment: investmentAmount,
        returns: cumulativeReturns,
        total: currentValue + cumulativeReturns,
        cashFlow: year === 0 ? 0 : netMonthlyCashFlow * 12 * Math.pow(1 + rentalIncreaseRate / 100, year - 1),
        appreciation: currentValue - investmentAmount,
      })
    }
    
    // Generate comparison data
    const comparisonData: ComparisonData = {
      yourInvestment: [],
      sp500: [],
      realEstateIndex: [],
      savingsAccount: [],
    }
    
    for (let year = 0; year <= 5; year++) {
      comparisonData.yourInvestment.push(
        investmentAmount * Math.pow(1 + annualROI / 100, year)
      )
      comparisonData.sp500.push(
        investmentAmount * Math.pow(1.10, year) // 10% average S&P 500 return
      )
      comparisonData.realEstateIndex.push(
        investmentAmount * Math.pow(1.07, year) // 7% average real estate index
      )
      comparisonData.savingsAccount.push(
        investmentAmount * Math.pow(1.005, year) // 0.5% savings account
      )
    }
    
    const results = {
      totalReturn: netReturn,
      totalReturnPercent,
      annualROI,
      monthlyCashFlow: netMonthlyCashFlow,
      breakEvenMonths,
      platformFee,
      managementFee: totalManagementFee,
      exitFee,
      netReturn,
      projectionData,
      comparisonData,
    }
    
    // Notify parent component
    onCalculate?.(results)
    
    return results
  }, [
    investmentAmount,
    holdingPeriod,
    useFinancing,
    customAppreciationRate,
    rentalIncreaseRate,
    expenseRatio,
    propertyPrice,
    monthlyRent,
    onCalculate,
  ])
  
  // Save Scenario
  const saveScenario = () => {
    const name = prompt('Enter a name for this scenario:')
    if (!name) return
    
    const scenario: SavedScenario = {
      id: Date.now().toString(),
      name,
      date: new Date(),
      params: {
        amount: investmentAmount,
        period: holdingPeriod,
        useFinancing,
        propertyPrice,
        appreciationRate: customAppreciationRate,
        rentalIncreaseRate,
        expenseRatio,
      },
      results: calculateReturns,
    }
    
    setSavedScenarios(prev => [...prev, scenario])
    toast.success('Scenario saved successfully')
  }
  
  // Load Scenario
  const loadScenario = (scenario: SavedScenario) => {
    setInvestmentAmount(scenario.params.amount)
    setHoldingPeriod(scenario.params.period)
    setUseFinancing(scenario.params.useFinancing)
    setCustomAppreciationRate(scenario.params.appreciationRate)
    setRentalIncreaseRate(scenario.params.rentalIncreaseRate)
    setExpenseRatio(scenario.params.expenseRatio)
    setShowSavedScenarios(false)
    toast.success(`Loaded scenario: ${scenario.name}`)
  }
  
  // Export to PDF
  const exportToPDF = () => {
    toast.success('PDF export would be implemented here')
  }
  
  // Export to Excel
  const exportToExcel = () => {
    toast.success('Excel export would be implemented here')
  }
  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3">
          <p className="text-sm font-medium">Year {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </Card>
      )
    }
    return null
  }
  
  return (
    <Card className={cn('w-full max-w-[600px]', className)}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <CardTitle>Investment Calculator</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Calculate your potential returns based on investment amount, holding period, and market conditions.
                  All calculations are estimates and actual returns may vary.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Export Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={saveScenario}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Investment Amount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="investment-amount">Investment Amount</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                id="investment-amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-24 text-right"
                min={100}
                max={100000}
                step={100}
              />
            </div>
          </div>
          <Slider
            value={[investmentAmount]}
            onValueChange={([value]) => setInvestmentAmount(value)}
            min={100}
            max={100000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$100</span>
            <span>$100,000</span>
          </div>
        </div>
        
        {/* Holding Period */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="holding-period">Holding Period</Label>
            <Select value={holdingPeriod.toString()} onValueChange={(v) => setHoldingPeriod(Number(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year} {year === 1 ? 'year' : 'years'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Financing Toggle */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <Label htmlFor="financing">Use Financing</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    Calculate returns with mortgage financing (20% down, 4.5% interest)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="financing"
            checked={useFinancing}
            onCheckedChange={setUseFinancing}
          />
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculateReturns.totalReturn)}
                </p>
                <p className={cn(
                  'text-sm flex items-center gap-1 mt-1',
                  calculateReturns.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {calculateReturns.totalReturnPercent >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {formatPercentage(calculateReturns.totalReturnPercent / 100)}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual ROI</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPercentage(calculateReturns.annualROI / 100)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  per year
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Cash Flow</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(calculateReturns.monthlyCashFlow)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  after expenses
                </p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Break-even</p>
                <p className="text-2xl font-bold">
                  {calculateReturns.breakEvenMonths}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  months
                </p>
              </div>
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        </div>
        
        {/* Fee Breakdown */}
        <Collapsible open={showFeeBreakdown} onOpenChange={setShowFeeBreakdown}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3">
              <span className="text-sm font-medium">Fee Breakdown</span>
              {showFeeBreakdown ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (2%)</span>
                <span>{formatCurrency(calculateReturns.platformFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Management Fee (1% annual)</span>
                <span>{formatCurrency(calculateReturns.managementFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exit Fee (1%)</span>
                <span>{formatCurrency(calculateReturns.exitFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Total Fees</span>
                <span>{formatCurrency(
                  calculateReturns.platformFee + 
                  calculateReturns.managementFee + 
                  calculateReturns.exitFee
                )}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Projections Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Investment Projection</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={calculateReturns.projectionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Y${value}`}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="investment"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Investment"
              />
              <Area
                type="monotone"
                dataKey="returns"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Returns"
              />
              <Area
                type="monotone"
                dataKey="appreciation"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Appreciation"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Comparison Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">5-Year Comparison</h4>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Investment</TableHead>
                <TableHead className="text-right">Initial</TableHead>
                <TableHead className="text-right">Year 5</TableHead>
                <TableHead className="text-right">Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-500" />
                    Your Investment
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investmentAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateReturns.comparisonData.yourInvestment[5])}
                </TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  +{formatPercentage(
                    (calculateReturns.comparisonData.yourInvestment[5] - investmentAmount) / 
                    investmentAmount
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    S&P 500
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investmentAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateReturns.comparisonData.sp500[5])}
                </TableCell>
                <TableCell className="text-right">
                  +{formatPercentage(
                    (calculateReturns.comparisonData.sp500[5] - investmentAmount) / 
                    investmentAmount
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    Real Estate Index
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investmentAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateReturns.comparisonData.realEstateIndex[5])}
                </TableCell>
                <TableCell className="text-right">
                  +{formatPercentage(
                    (calculateReturns.comparisonData.realEstateIndex[5] - investmentAmount) / 
                    investmentAmount
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-gray-500" />
                    Savings Account
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(investmentAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateReturns.comparisonData.savingsAccount[5])}
                </TableCell>
                <TableCell className="text-right text-gray-500">
                  +{formatPercentage(
                    (calculateReturns.comparisonData.savingsAccount[5] - investmentAmount) / 
                    investmentAmount
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Options
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appreciation-rate">
                Appreciation Rate: {customAppreciationRate}%
              </Label>
              <Slider
                id="appreciation-rate"
                value={[customAppreciationRate]}
                onValueChange={([value]) => setCustomAppreciationRate(value)}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rental-increase">
                Rental Increase Rate: {rentalIncreaseRate}%
              </Label>
              <Slider
                id="rental-increase"
                value={[rentalIncreaseRate]}
                onValueChange={([value]) => setRentalIncreaseRate(value)}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-ratio">
                Expense Ratio: {expenseRatio}%
              </Label>
              <Slider
                id="expense-ratio"
                value={[expenseRatio]}
                onValueChange={([value]) => setExpenseRatio(value)}
                min={10}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Saved Scenarios */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowSavedScenarios(true)}
            disabled={savedScenarios.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Saved Scenarios ({savedScenarios.length})
          </Button>
        </div>
      </CardContent>
      
      {/* Saved Scenarios Dialog */}
      <Dialog open={showSavedScenarios} onOpenChange={setShowSavedScenarios}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Saved Scenarios</DialogTitle>
            <DialogDescription>
              Load a previously saved investment scenario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedScenarios.map((scenario) => (
              <Card key={scenario.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{scenario.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(scenario.date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>Amount: {formatCurrency(scenario.params.amount)}</span>
                      <span>Period: {scenario.params.period} years</span>
                      <span>ROI: {formatPercentage(scenario.results.annualROI / 100)}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => loadScenario(scenario)}>
                    Load
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}