/**
 * Investor Dashboard - PropertyChain
 * 
 * Primary user interface following RECOVERY_PLAN.md Step 3.1
 * Dashboard with portfolio tracking, performance analytics, and investment management
 */

'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building,
  FileText,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  MoreVertical,
  ChevronRight,
  Info,
  Bell,
  Settings,
  LogOut,
  User,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Coins,
  Receipt,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Filter,
  Search,
  Home,
  Briefcase,
  Target,
  Award,
  Shield,
  Zap,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// ============================================================================
// Types
// ============================================================================

interface PortfolioMetrics {
  totalValue: number
  totalReturns: number
  totalReturnPercent: number
  monthlyIncome: number
  activeInvestments: number
  change24h: number
  change24hPercent: number
}

interface Investment {
  id: string
  propertyId: string
  propertyName: string
  propertyAddress: string
  investmentAmount: number
  currentValue: number
  tokens: number
  returns: number
  returnPercent: number
  status: 'active' | 'pending' | 'exited'
  purchaseDate: Date
  monthlyIncome: number
}

interface Activity {
  id: string
  type: 'investment' | 'dividend' | 'withdrawal' | 'reinvestment' | 'sale'
  title: string
  description: string
  amount?: number
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
}

interface Distribution {
  id: string
  propertyName: string
  amount: number
  date: Date
  type: 'dividend' | 'rental' | 'appreciation'
  status: 'paid' | 'pending' | 'processing'
}

// ============================================================================
// Mock Data
// ============================================================================

const portfolioMetrics: PortfolioMetrics = {
  totalValue: 125420.50,
  totalReturns: 15420.50,
  totalReturnPercent: 14.2,
  monthlyIncome: 1050.00,
  activeInvestments: 8,
  change24h: 2340.00,
  change24hPercent: 1.9,
}

const investments: Investment[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    propertyName: 'Luxury Downtown Apartments',
    propertyAddress: '123 Main St, New York, NY',
    investmentAmount: 25000,
    currentValue: 28500,
    tokens: 250,
    returns: 3500,
    returnPercent: 14.0,
    status: 'active',
    purchaseDate: new Date('2024-01-15'),
    monthlyIncome: 225,
  },
  {
    id: '2',
    propertyId: 'prop-2',
    propertyName: 'Suburban Office Complex',
    propertyAddress: '456 Business Blvd, Chicago, IL',
    investmentAmount: 15000,
    currentValue: 16200,
    tokens: 150,
    returns: 1200,
    returnPercent: 8.0,
    status: 'active',
    purchaseDate: new Date('2024-02-20'),
    monthlyIncome: 125,
  },
  {
    id: '3',
    propertyId: 'prop-3',
    propertyName: 'Retail Shopping Center',
    propertyAddress: '789 Commerce Way, Los Angeles, CA',
    investmentAmount: 30000,
    currentValue: 35100,
    tokens: 300,
    returns: 5100,
    returnPercent: 17.0,
    status: 'active',
    purchaseDate: new Date('2023-11-10'),
    monthlyIncome: 300,
  },
  {
    id: '4',
    propertyId: 'prop-4',
    propertyName: 'Industrial Warehouse',
    propertyAddress: '321 Industry Rd, Houston, TX',
    investmentAmount: 20000,
    currentValue: 21800,
    tokens: 200,
    returns: 1800,
    returnPercent: 9.0,
    status: 'active',
    purchaseDate: new Date('2023-09-05'),
    monthlyIncome: 175,
  },
  {
    id: '5',
    propertyId: 'prop-5',
    propertyName: 'Student Housing Complex',
    propertyAddress: '555 University Ave, Boston, MA',
    investmentAmount: 10000,
    currentValue: 11500,
    tokens: 100,
    returns: 1500,
    returnPercent: 15.0,
    status: 'active',
    purchaseDate: new Date('2024-03-01'),
    monthlyIncome: 100,
  },
]

const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'dividend',
    title: 'Dividend Received',
    description: 'Monthly dividend from Luxury Downtown Apartments',
    amount: 225,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: '2',
    type: 'investment',
    title: 'New Investment',
    description: 'Invested in Student Housing Complex',
    amount: 10000,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: '3',
    type: 'reinvestment',
    title: 'Dividend Reinvested',
    description: 'Auto-reinvested dividends into Retail Shopping Center',
    amount: 500,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: '4',
    type: 'dividend',
    title: 'Dividend Pending',
    description: 'Upcoming dividend from Suburban Office Complex',
    amount: 125,
    timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
]

const upcomingDistributions: Distribution[] = [
  {
    id: '1',
    propertyName: 'Luxury Downtown Apartments',
    amount: 225,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    type: 'dividend',
    status: 'pending',
  },
  {
    id: '2',
    propertyName: 'Retail Shopping Center',
    amount: 300,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: 'rental',
    status: 'pending',
  },
  {
    id: '3',
    propertyName: 'Industrial Warehouse',
    amount: 175,
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    type: 'dividend',
    status: 'pending',
  },
]

// Chart data
const performanceData = [
  { month: 'Jan', value: 95000, returns: 1200 },
  { month: 'Feb', value: 98000, returns: 1400 },
  { month: 'Mar', value: 102000, returns: 1600 },
  { month: 'Apr', value: 108000, returns: 1850 },
  { month: 'May', value: 115000, returns: 2100 },
  { month: 'Jun', value: 118000, returns: 2300 },
  { month: 'Jul', value: 122000, returns: 2500 },
  { month: 'Aug', value: 125420, returns: 2650 },
]

const allocationData = [
  { name: 'Residential', value: 45, amount: 56439 },
  { name: 'Commercial', value: 25, amount: 31355 },
  { name: 'Industrial', value: 20, amount: 25084 },
  { name: 'Retail', value: 10, amount: 12542 },
]

const COLORS = ['#007BFF', '#10B981', '#F59E0B', '#EF4444']

// ============================================================================
// Investor Dashboard Component
// ============================================================================

export default function InvestorDashboardPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = React.useState('30d')
  const [showMoreActivities, setShowMoreActivities] = React.useState(false)
  const [selectedInvestment, setSelectedInvestment] = React.useState<Investment | null>(null)
  
  // Calculate total portfolio metrics
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalMonthlyIncome = investments.reduce((sum, inv) => sum + inv.monthlyIncome, 0)
  
  // Handle quick actions
  const handleInvest = () => {
    router.push('/properties/explore')
  }
  
  const handleWithdraw = () => {
    toast.info('Withdrawal feature coming soon')
  }
  
  const handleDocuments = () => {
    router.push('/dashboard/documents')
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2">
          <p className="text-sm font-medium">{label}</p>
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
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Your portfolio is performing well.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={handleInvest}>
            <Plus className="mr-2 h-4 w-4" />
            Invest
          </Button>
          <Button variant="outline" onClick={handleWithdraw}>
            <Wallet className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
          <Button variant="outline" onClick={handleDocuments}>
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
        </div>
      </div>
      
      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Period:</span>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio Value Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {formatCurrency(portfolioMetrics.totalValue)}
              </p>
              <div className="flex items-center gap-1">
                {portfolioMetrics.change24hPercent >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  portfolioMetrics.change24hPercent >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {formatCurrency(Math.abs(portfolioMetrics.change24h))}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({formatPercentage(Math.abs(portfolioMetrics.change24hPercent) / 100)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Returns Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Returns
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(portfolioMetrics.totalReturns)}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-green-600">
                  +{formatPercentage(portfolioMetrics.totalReturnPercent / 100)}
                </span>
                <span className="text-sm text-muted-foreground">
                  all time
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Income Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Income
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {formatCurrency(portfolioMetrics.monthlyIncome)}
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  Next payout in 5 days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Investments Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Investments
              </CardTitle>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Building className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {portfolioMetrics.activeInvestments}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Across 4 property types
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Portfolio Performance</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007BFF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#007BFF"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                  name="Portfolio Value"
                />
                <Area
                  type="monotone"
                  dataKey="returns"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorReturns)"
                  strokeWidth={2}
                  name="Returns"
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Portfolio Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Returns</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Portfolio Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Asset Allocation</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Distribution by property type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any, name: any) => [
                    `${value}% (${formatCurrency(allocationData.find(d => d.name === name)?.amount || 0)})`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="space-y-2 mt-4">
              {allocationData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Investments</CardTitle>
              <CardDescription>
                Detailed view of all your property investments
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Returns</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{investment.propertyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {investment.propertyAddress}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCurrency(investment.investmentAmount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {investment.tokens} tokens
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCurrency(investment.currentValue)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(investment.currentValue / investment.investmentAmount) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className={cn(
                          "font-medium",
                          investment.returns >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {investment.returns >= 0 ? '+' : ''}{formatCurrency(investment.returns)}
                        </p>
                        <p className={cn(
                          "text-sm",
                          investment.returnPercent >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {investment.returnPercent >= 0 ? '+' : ''}{formatPercentage(investment.returnPercent / 100)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          investment.status === 'active' ? 'default' :
                          investment.status === 'pending' ? 'secondary' :
                          'outline'
                        }
                      >
                        {investment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/properties/${investment.propertyId}`)}>
                            <Building className="mr-2 h-4 w-4" />
                            View Property
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Add Investment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Exit Investment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Table Summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-lg font-semibold">{formatCurrency(totalInvested)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-lg font-semibold">{formatCurrency(totalCurrent)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Return</p>
              <p className="text-lg font-semibold text-green-600">
                +{formatCurrency(totalCurrent - totalInvested)} ({formatPercentage((totalCurrent - totalInvested) / totalInvested)})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bottom Row: Activity Feed and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowMoreActivities(!showMoreActivities)}
              >
                {showMoreActivities ? 'Show Less' : 'View All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className={showMoreActivities ? "h-96" : "h-64"}>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case 'investment':
                        return <DollarSign className="h-4 w-4" />
                      case 'dividend':
                        return <TrendingUp className="h-4 w-4" />
                      case 'withdrawal':
                        return <Wallet className="h-4 w-4" />
                      case 'reinvestment':
                        return <RefreshCw className="h-4 w-4" />
                      case 'sale':
                        return <Receipt className="h-4 w-4" />
                      default:
                        return <Activity className="h-4 w-4" />
                    }
                  }
                  
                  const getActivityColor = () => {
                    switch (activity.type) {
                      case 'investment':
                        return 'bg-blue-100 text-blue-600'
                      case 'dividend':
                        return 'bg-green-100 text-green-600'
                      case 'withdrawal':
                        return 'bg-orange-100 text-orange-600'
                      case 'reinvestment':
                        return 'bg-purple-100 text-purple-600'
                      case 'sale':
                        return 'bg-red-100 text-red-600'
                      default:
                        return 'bg-gray-100 text-gray-600'
                    }
                  }
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        getActivityColor()
                      )}>
                        {getActivityIcon()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{activity.timestamp.toLocaleDateString()}</span>
                          {activity.amount && (
                            <span className="font-medium text-foreground">
                              {formatCurrency(activity.amount)}
                            </span>
                          )}
                          <Badge 
                            variant={
                              activity.status === 'completed' ? 'default' :
                              activity.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Quick Insights Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Best Performer */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Best Performer</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  +17%
                </Badge>
              </div>
              <p className="text-sm font-medium">Retail Shopping Center</p>
              <p className="text-xs text-muted-foreground">
                Outperforming market by 5.2%
              </p>
            </div>
            
            {/* Upcoming Distributions */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Distributions
              </h4>
              <div className="space-y-2">
                {upcomingDistributions.map((distribution) => (
                  <div key={distribution.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <p className="text-sm font-medium">
                        {formatCurrency(distribution.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {distribution.propertyName}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {distribution.date.toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Required */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Action Required</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 documents pending signature
                  </p>
                  <Button size="sm" variant="link" className="h-auto p-0 mt-1">
                    Review Documents
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Market Alert */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">New Opportunity</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Premium office space matching your criteria
                  </p>
                  <Button size="sm" variant="link" className="h-auto p-0 mt-1">
                    View Property
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}