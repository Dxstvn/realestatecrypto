/**
 * Dashboard Overview Page - PropertyChain
 * 
 * Comprehensive dashboard with KPI cards, charts, transactions, and activity feed
 * Following UpdatedUIPlan.md Step 32 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  ExternalLink,
  RefreshCw,
  Bell,
  Star,
  ShoppingCart,
  Wallet,
  PieChart,
  Target,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

// Mock data for charts and tables
const portfolioPerformanceData = [
  { month: 'Jan', value: 98500, properties: 18, income: 2200 },
  { month: 'Feb', value: 102300, properties: 19, income: 2350 },
  { month: 'Mar', value: 106800, properties: 20, income: 2480 },
  { month: 'Apr', value: 111200, properties: 21, income: 2620 },
  { month: 'May', value: 115800, properties: 22, income: 2750 },
  { month: 'Jun', value: 125430, properties: 23, income: 2847 },
]

const propertyTypeDistribution = [
  { name: 'Residential', value: 65, color: '#007BFF' },
  { name: 'Commercial', value: 25, color: '#4CAF50' },
  { name: 'Mixed-Use', value: 10, color: '#FF9800' },
]

const monthlyIncomeData = [
  { month: 'Jan', rental: 2200, dividends: 340, fees: -45 },
  { month: 'Feb', rental: 2350, dividends: 380, fees: -52 },
  { month: 'Mar', rental: 2480, dividends: 420, fees: -48 },
  { month: 'Apr', rental: 2620, dividends: 450, fees: -55 },
  { month: 'May', rental: 2750, dividends: 480, fees: -62 },
  { month: 'Jun', rental: 2847, dividends: 510, fees: -58 },
]

const recentTransactions = [
  {
    id: 'TXN-001',
    type: 'Purchase',
    property: 'Marina Bay Towers',
    amount: 5000,
    tokens: 50,
    date: '2024-01-15T10:30:00Z',
    status: 'completed',
    hash: '0x1234...5678',
  },
  {
    id: 'TXN-002',
    type: 'Dividend',
    property: 'Downtown Office Complex',
    amount: 247,
    tokens: 0,
    date: '2024-01-14T15:45:00Z',
    status: 'completed',
    hash: '0xabcd...ef01',
  },
  {
    id: 'TXN-003',
    type: 'Purchase',
    property: 'Luxury Apartments',
    amount: 3200,
    tokens: 32,
    date: '2024-01-13T09:15:00Z',
    status: 'processing',
    hash: '0x9876...5432',
  },
  {
    id: 'TXN-004',
    type: 'Sale',
    property: 'Suburban Mall',
    amount: 1800,
    tokens: -18,
    date: '2024-01-12T14:20:00Z',
    status: 'completed',
    hash: '0xfed4...ba98',
  },
  {
    id: 'TXN-005',
    type: 'Dividend',
    property: 'City Center Plaza',
    amount: 189,
    tokens: 0,
    date: '2024-01-11T11:00:00Z',
    status: 'completed',
    hash: '0x1111...2222',
  },
]

const activityFeedData = [
  {
    id: 1,
    type: 'investment',
    title: 'New investment in Marina Bay Towers',
    description: 'Purchased 50 tokens for $5,000',
    time: '2 hours ago',
    icon: ShoppingCart,
    color: 'text-blue-600',
  },
  {
    id: 2,
    type: 'dividend',
    title: 'Dividend payment received',
    description: '$247 from Downtown Office Complex',
    time: '1 day ago',
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    id: 3,
    type: 'property',
    title: 'New property available',
    description: 'Beachfront Resort now accepting investments',
    time: '2 days ago',
    icon: Building,
    color: 'text-purple-600',
  },
  {
    id: 4,
    type: 'milestone',
    title: 'Portfolio milestone reached',
    description: 'Total portfolio value exceeded $125,000',
    time: '3 days ago',
    icon: Target,
    color: 'text-orange-600',
  },
  {
    id: 5,
    type: 'update',
    title: 'Property valuation updated',
    description: 'City Center Plaza increased 5.2%',
    time: '1 week ago',
    icon: TrendingUp,
    color: 'text-green-600',
  },
]

/**
 * Enhanced KPI Card Component
 */
function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  chartData,
  loading = false,
}: {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  description: string
  chartData?: Array<{ value: number }>
  loading?: boolean
}) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }

  const changeIcons = {
    positive: ArrowUpRight,
    negative: ArrowDownRight,
    neutral: MoreHorizontal,
  }

  const ChangeIcon = changeIcons[changeType]

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              value
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs">
            <ChangeIcon className={cn('h-3 w-3', changeColors[changeType])} />
            <span className={changeColors[changeType]}>
              {change}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
          
          <p className="text-xs text-muted-foreground">{description}</p>
          
          {/* Mini sparkline chart */}
          {chartData && (
            <div className="h-8 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#007BFF"
                    strokeWidth={1}
                    fill="url(#gradient)"
                    fillOpacity={0.3}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Quick Actions Component
 */
function QuickActions() {
  const actions = [
    {
      title: 'Invest in Property',
      description: 'Browse available properties',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/properties',
    },
    {
      title: 'View Portfolio',
      description: 'Check your investments',
      icon: PieChart,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/dashboard/portfolio',
    },
    {
      title: 'Analytics',
      description: 'Performance insights',
      icon: BarChart3,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/dashboard/analytics',
    },
    {
      title: 'Documents',
      description: 'Legal & contracts',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/dashboard/documents',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-gray-50"
              asChild
            >
              <Link href={action.href}>
                <div className={cn('p-2 rounded-lg text-white', action.color)}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Activity Feed Component
 */
function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest transactions and updates
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityFeedData.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={cn('p-2 rounded-lg bg-gray-100', activity.color)}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Enhanced Transactions Table Component
 */
function TransactionsTable() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Purchase':
        return 'text-blue-600'
      case 'Sale':
        return 'text-purple-600'
      case 'Dividend':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredTransactions = recentTransactions.filter((transaction) => {
    const matchesFilter = filter === 'all' || transaction.type.toLowerCase() === filter
    const matchesSearch = transaction.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your investment transactions and activity
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="dividend">Dividend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {transaction.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className={cn('font-medium', getTypeColor(transaction.type))}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.property}</TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.tokens !== 0 && (
                      <span className={transaction.tokens > 0 ? 'text-blue-600' : 'text-purple-600'}>
                        {transaction.tokens > 0 ? '+' : ''}{transaction.tokens}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('capitalize', getStatusColor(transaction.status))}
                    >
                      {transaction.status === 'processing' && (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {transaction.status === 'completed' && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Main Dashboard Page Component
 */
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('6m')
  const [isLoading, setIsLoading] = useState(false)

  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Dashboard data refreshed')
    }, 1000)
  }

  // KPI data with sparklines
  const kpiData = [
    {
      title: 'Total Portfolio Value',
      value: '$125,430',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Total value of all investments',
      chartData: portfolioPerformanceData.map(d => ({ value: d.value })),
    },
    {
      title: 'Active Investments',
      value: '23',
      change: '+3',
      changeType: 'positive' as const,
      icon: Building,
      description: 'Number of active properties',
      chartData: portfolioPerformanceData.map(d => ({ value: d.properties })),
    },
    {
      title: 'Monthly Income',
      value: '$2,847',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Rental income this month',
      chartData: monthlyIncomeData.map(d => ({ value: d.rental + d.dividends + d.fees })),
    },
    {
      title: 'Total Return',
      value: '14.8%',
      change: '-0.3%',
      changeType: 'negative' as const,
      icon: BarChart3,
      description: 'Overall return on investment',
      chartData: [
        { value: 12.1 }, { value: 13.4 }, { value: 14.2 }, 
        { value: 15.1 }, { value: 14.9 }, { value: 14.8 }
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your real estate investment summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefreshData}>
            <RefreshCw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
            Refresh
          </Button>
          <Button className="bg-[#007BFF] hover:bg-[#0062CC]">
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            description={kpi.description}
            chartData={kpi.chartData}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Portfolio Performance Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>
              Total portfolio value and growth over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`$${value?.toLocaleString()}`, name]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#007BFF"
                    strokeWidth={2}
                    fill="url(#portfolioGradient)"
                    fillOpacity={0.6}
                  />
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007BFF" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#007BFF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Property Distribution */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Property Distribution</CardTitle>
            <CardDescription>
              Investment breakdown by property type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {propertyTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Income Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income Breakdown</CardTitle>
          <CardDescription>
            Rental income, dividends, and fees over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIncomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rental" name="Rental Income" fill="#007BFF" />
                <Bar dataKey="dividends" name="Dividends" fill="#4CAF50" />
                <Bar dataKey="fees" name="Fees" fill="#FF5722" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Transactions Table */}
        <div className="lg:col-span-4">
          <TransactionsTable />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Market Insights
          </CardTitle>
          <CardDescription>
            Key trends and opportunities in real estate investment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Market Growth</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Real estate market showing strong 8.5% growth this quarter with increased investor confidence
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">High Demand</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Residential properties in urban areas experiencing 23% increase in tokenized investment interest
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">New Opportunities</span>
              </div>
              <p className="text-xs text-muted-foreground">
                15 new premium properties available for tokenized investment this week with expected 12-18% returns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}