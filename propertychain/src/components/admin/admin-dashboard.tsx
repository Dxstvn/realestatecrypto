/**
 * Admin Dashboard Component - PropertyChain
 * 
 * Business owner view for platform management and monitoring
 * Following UpdatedUIPlan.md Section 10 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DollarSign,
  Users,
  Building,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  Plus,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  Check,
  X,
  Info,
  BarChart3,
  LineChart,
  PieChart,
  Receipt,
  FileText,
  UserCheck,
  UserX,
  Building2,
  Home,
  Wallet,
  CreditCard,
  Lock,
  Unlock,
  Database,
  Server,
  Cpu,
  HardDrive,
  Zap,
  Globe,
  MapPin,
  Hash,
  Percent,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  Package,
  Briefcase,
  Scale,
  Gavel,
  FileSearch,
  UserPlus,
  UserMinus,
  ShieldCheck,
  ShieldAlert,
  Key,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Code,
  Terminal,
  Bug,
  GitBranch,
  Github,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Types
interface AdminDashboardData {
  metrics: BusinessMetrics
  users: UserStats
  properties: PropertyStats
  transactions: TransactionStats
  compliance: ComplianceStatus
  system: SystemHealth
  alerts: Alert[]
  recentActivity: Activity[]
}

interface BusinessMetrics {
  totalRevenue: number
  revenueChange: number
  totalTransactions: number
  transactionChange: number
  activeUsers: number
  userChange: number
  propertyValue: number
  propertyChange: number
  platformFees: number
  feeChange: number
  escrowBalance: number
  escrowChange: number
}

interface UserStats {
  total: number
  active: number
  new: number
  verified: number
  pending: number
  suspended: number
  byType: {
    investors: number
    sellers: number
    agents: number
    admins: number
  }
  growth: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
}

interface PropertyStats {
  total: number
  active: number
  pending: number
  sold: number
  totalValue: number
  averagePrice: number
  byType: Record<string, number>
  byLocation: Record<string, number>
}

interface TransactionStats {
  total: number
  pending: number
  completed: number
  failed: number
  volume: number
  averageSize: number
  byMethod: Record<string, number>
  timeline: Array<{
    date: string
    count: number
    volume: number
  }>
}

interface ComplianceStatus {
  kycCompleted: number
  kycPending: number
  amlFlags: number
  documentsVerified: number
  documentsPending: number
  auditsCompleted: number
  nextAuditDate: string
  riskLevel: 'low' | 'medium' | 'high'
  issues: ComplianceIssue[]
}

interface ComplianceIssue {
  id: string
  type: 'kyc' | 'aml' | 'document' | 'audit'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  userId?: string
  propertyId?: string
  createdAt: string
  status: 'open' | 'investigating' | 'resolved'
}

interface SystemHealth {
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  cpu: number
  memory: number
  storage: number
  apiLatency: number
  blockchainSync: boolean
  services: ServiceStatus[]
}

interface ServiceStatus {
  name: string
  status: 'up' | 'down' | 'degraded'
  latency?: number
  lastCheck: string
}

interface Alert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  description: string
  timestamp: string
  read: boolean
  actionRequired: boolean
}

interface Activity {
  id: string
  type: 'user' | 'property' | 'transaction' | 'system'
  action: string
  description: string
  userId?: string
  metadata?: Record<string, any>
  timestamp: string
}

// Mock data
const mockData: AdminDashboardData = {
  metrics: {
    totalRevenue: 2456789,
    revenueChange: 12.5,
    totalTransactions: 1234,
    transactionChange: 8.3,
    activeUsers: 5678,
    userChange: 15.2,
    propertyValue: 125000000,
    propertyChange: 5.7,
    platformFees: 98765,
    feeChange: 10.1,
    escrowBalance: 5000000,
    escrowChange: -2.3,
  },
  users: {
    total: 8945,
    active: 5678,
    new: 234,
    verified: 7823,
    pending: 456,
    suspended: 23,
    byType: {
      investors: 6234,
      sellers: 1567,
      agents: 890,
      admins: 12,
    },
    growth: {
      daily: [120, 135, 128, 142, 156, 148, 162],
      weekly: [890, 920, 945, 980],
      monthly: [3200, 3400, 3650, 3900],
    },
  },
  properties: {
    total: 456,
    active: 234,
    pending: 45,
    sold: 177,
    totalValue: 125000000,
    averagePrice: 274122,
    byType: {
      'Single Family': 234,
      'Condo': 123,
      'Multi-Family': 67,
      'Commercial': 32,
    },
    byLocation: {
      'California': 156,
      'New York': 98,
      'Texas': 87,
      'Florida': 65,
      'Other': 50,
    },
  },
  transactions: {
    total: 3456,
    pending: 123,
    completed: 3234,
    failed: 99,
    volume: 45678900,
    averageSize: 13225,
    byMethod: {
      'Wire Transfer': 1234,
      'ACH': 890,
      'Crypto': 567,
      'Credit Card': 765,
    },
    timeline: [
      { date: '2024-01-15', count: 45, volume: 567890 },
      { date: '2024-01-16', count: 52, volume: 623450 },
      { date: '2024-01-17', count: 48, volume: 589000 },
      { date: '2024-01-18', count: 61, volume: 734560 },
      { date: '2024-01-19', count: 58, volume: 698700 },
    ],
  },
  compliance: {
    kycCompleted: 7823,
    kycPending: 456,
    amlFlags: 12,
    documentsVerified: 3456,
    documentsPending: 234,
    auditsCompleted: 24,
    nextAuditDate: '2024-02-15',
    riskLevel: 'low',
    issues: [
      {
        id: 'issue-001',
        type: 'kyc',
        severity: 'medium',
        description: 'Incomplete KYC documentation',
        userId: 'user-123',
        createdAt: '2024-01-18T10:00:00Z',
        status: 'open',
      },
    ],
  },
  system: {
    status: 'operational',
    uptime: 99.95,
    cpu: 45,
    memory: 62,
    storage: 78,
    apiLatency: 125,
    blockchainSync: true,
    services: [
      { name: 'API Gateway', status: 'up', latency: 45, lastCheck: '2024-01-20T12:00:00Z' },
      { name: 'Database', status: 'up', latency: 12, lastCheck: '2024-01-20T12:00:00Z' },
      { name: 'Blockchain Node', status: 'up', latency: 234, lastCheck: '2024-01-20T12:00:00Z' },
      { name: 'IPFS', status: 'up', latency: 156, lastCheck: '2024-01-20T12:00:00Z' },
    ],
  },
  alerts: [
    {
      id: 'alert-001',
      type: 'warning',
      title: 'High Transaction Volume',
      description: 'Transaction volume exceeds normal threshold by 25%',
      timestamp: '2024-01-20T11:30:00Z',
      read: false,
      actionRequired: false,
    },
  ],
  recentActivity: [
    {
      id: 'activity-001',
      type: 'user',
      action: 'registration',
      description: 'New user registered',
      userId: 'user-789',
      timestamp: '2024-01-20T12:15:00Z',
    },
    {
      id: 'activity-002',
      type: 'property',
      action: 'listing',
      description: 'New property listed',
      timestamp: '2024-01-20T12:10:00Z',
    },
  ],
}

export function AdminDashboard() {
  const { toast } = useToast()
  const [data, setData] = useState<AdminDashboardData>(mockData)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setData({ ...mockData })
      toast({
        title: 'Dashboard refreshed',
        description: 'All metrics have been updated',
      })
    } catch (error) {
      toast({
        title: 'Refresh failed',
        description: 'Could not update dashboard data',
        variant: 'destructive',
      })
    } finally {
      setRefreshing(false)
    }
  }, [toast])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 30000)
    return () => clearInterval(interval)
  }, [handleRefresh])

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    const conversionRate = (data.transactions.completed / data.users.active) * 100
    const avgTransactionValue = data.transactions.volume / data.transactions.completed
    const userGrowthRate = (data.users.new / data.users.total) * 100
    const propertyTurnover = (data.properties.sold / data.properties.total) * 100
    
    return {
      conversionRate,
      avgTransactionValue,
      userGrowthRate,
      propertyTurnover,
    }
  }, [data])

  // Get status color
  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-600'
    if (value >= threshold * 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get trend icon
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA]">
      {/* Admin Header */}
      <div className="bg-white border-b border-[#E0E0E0] sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#007BFF] to-[#004A99] flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#212121]">Admin Dashboard</h1>
                <p className="text-sm text-[#9E9E9E]">PropertyChain Business Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px] h-9"
                />
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-9 w-9"
              >
                <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              </Button>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 relative">
                    <Bell className="h-4 w-4" />
                    {data.alerts.filter(a => !a.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#DC3545] text-white text-xs flex items-center justify-center">
                        {data.alerts.filter(a => !a.read).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Notifications</h3>
                    <Separator />
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {data.alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={cn(
                              "p-3 rounded-lg border text-sm",
                              !alert.read && "bg-[#E6F2FF]"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-[#FF6347] mt-0.5" />}
                              {alert.type === 'error' && <XCircle className="h-4 w-4 text-[#DC3545] mt-0.5" />}
                              {alert.type === 'info' && <Info className="h-4 w-4 text-[#007BFF] mt-0.5" />}
                              {alert.type === 'success' && <CheckCircle2 className="h-4 w-4 text-[#4CAF50] mt-0.5" />}
                              <div className="flex-1">
                                <p className="font-medium">{alert.title}</p>
                                <p className="text-xs text-[#9E9E9E] mt-1">{alert.description}</p>
                                <p className="text-xs text-[#9E9E9E] mt-2">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Database className="h-4 w-4 mr-2" />
                    System Configuration
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#616161]">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#757575]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">
                ${(data.metrics.totalRevenue / 1000000).toFixed(2)}M
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(data.metrics.revenueChange)}
                <span className={cn(
                  "text-xs font-medium",
                  data.metrics.revenueChange > 0 ? "text-[#4CAF50]" : "text-[#DC3545]"
                )}>
                  {Math.abs(data.metrics.revenueChange)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#616161]">Active Users</CardTitle>
              <Users className="h-4 w-4 text-[#757575]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">
                {data.metrics.activeUsers.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(data.metrics.userChange)}
                <span className={cn(
                  "text-xs font-medium",
                  data.metrics.userChange > 0 ? "text-[#4CAF50]" : "text-[#DC3545]"
                )}>
                  {Math.abs(data.metrics.userChange)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#616161]">Properties</CardTitle>
              <Building className="h-4 w-4 text-[#757575]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">
                {data.properties.active}
              </div>
              <p className="text-xs text-[#9E9E9E] mt-1">
                {data.properties.pending} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#616161]">Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-[#757575]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">
                {data.metrics.totalTransactions.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(data.metrics.transactionChange)}
                <span className={cn(
                  "text-xs font-medium",
                  data.metrics.transactionChange > 0 ? "text-[#4CAF50]" : "text-[#DC3545]"
                )}>
                  {Math.abs(data.metrics.transactionChange)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#616161]">Platform Fees</CardTitle>
              <Percent className="h-4 w-4 text-[#757575]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">
                ${(data.metrics.platformFees / 1000).toFixed(1)}K
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(data.metrics.feeChange)}
                <span className={cn(
                  "text-xs font-medium",
                  data.metrics.feeChange > 0 ? "text-[#4CAF50]" : "text-[#DC3545]"
                )}>
                  {Math.abs(data.metrics.feeChange)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#616161]">Escrow Balance</CardTitle>
              <Lock className="h-4 w-4 text-[#757575]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">
                ${(data.metrics.escrowBalance / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(data.metrics.escrowChange)}
                <span className={cn(
                  "text-xs font-medium",
                  data.metrics.escrowChange > 0 ? "text-[#4CAF50]" : "text-[#DC3545]"
                )}>
                  {Math.abs(data.metrics.escrowChange)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Platform revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-[#F5F5F5] rounded-lg">
                    <LineChart className="h-12 w-12 text-[#BDBDBD]" />
                    <span className="ml-3 text-[#9E9E9E]">Revenue Chart</span>
                  </div>
                </CardContent>
              </Card>

              {/* User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    Active users and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-[#F5F5F5] rounded-lg">
                    <BarChart3 className="h-12 w-12 text-[#BDBDBD]" />
                    <span className="ml-3 text-[#9E9E9E]">Activity Chart</span>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Distribution</CardTitle>
                  <CardDescription>
                    Breakdown by payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data.transactions.byMethod).map(([method, count]) => {
                      const percentage = (count / data.transactions.total) * 100
                      return (
                        <div key={method}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-[#616161]">{method}</span>
                            <span className="font-medium text-[#212121]">
                              {count.toLocaleString()} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {data.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            activity.type === 'user' && "bg-[#E6F2FF]",
                            activity.type === 'property' && "bg-[#E8F5E9]",
                            activity.type === 'transaction' && "bg-[#FFF3E0]",
                            activity.type === 'system' && "bg-[#F5F5F5]"
                          )}>
                            {activity.type === 'user' && <User className="h-4 w-4 text-[#007BFF]" />}
                            {activity.type === 'property' && <Building className="h-4 w-4 text-[#4CAF50]" />}
                            {activity.type === 'transaction' && <Receipt className="h-4 w-4 text-[#FF6347]" />}
                            {activity.type === 'system' && <Server className="h-4 w-4 text-[#757575]" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#212121]">{activity.description}</p>
                            <p className="text-xs text-[#9E9E9E] mt-1">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            {/* User Management content will be added */}
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Users className="h-12 w-12 text-[#BDBDBD] mx-auto mb-4" />
                  <p className="text-[#9E9E9E]">User Management Panel</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6 mt-6">
            {/* Property Management content will be added */}
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Building className="h-12 w-12 text-[#BDBDBD] mx-auto mb-4" />
                  <p className="text-[#9E9E9E]">Property Management Panel</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6 mt-6">
            {/* Transaction Monitoring content will be added */}
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Receipt className="h-12 w-12 text-[#BDBDBD] mx-auto mb-4" />
                  <p className="text-[#9E9E9E]">Transaction Monitoring Panel</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* KYC Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">KYC Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#616161]">Completed</span>
                      <span className="font-medium">{data.compliance.kycCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#616161]">Pending</span>
                      <span className="font-medium text-[#FF6347]">{data.compliance.kycPending}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="font-bold text-[#4CAF50]">
                        {((data.compliance.kycCompleted / (data.compliance.kycCompleted + data.compliance.kycPending)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AML Monitoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AML Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#616161]">Active Flags</span>
                      <span className="font-medium text-[#DC3545]">{data.compliance.amlFlags}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#616161]">Risk Level</span>
                      <Badge className={cn(
                        "capitalize",
                        data.compliance.riskLevel === 'low' && "bg-[#E8F5E9] text-[#2E7D32]",
                        data.compliance.riskLevel === 'medium' && "bg-[#FFF3E0] text-[#F57C00]",
                        data.compliance.riskLevel === 'high' && "bg-[#FFEBEE] text-[#C62828]"
                      )}>
                        {data.compliance.riskLevel}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Next Audit</span>
                      <span className="text-sm">{new Date(data.compliance.nextAuditDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Document Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#616161]">Verified</span>
                      <span className="font-medium">{data.compliance.documentsVerified}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#616161]">Pending Review</span>
                      <span className="font-medium text-[#FF6347]">{data.compliance.documentsPending}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Audits Completed</span>
                      <span className="font-bold">{data.compliance.auditsCompleted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Issues */}
            {data.compliance.issues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Compliance Issues</CardTitle>
                  <CardDescription>
                    Issues requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.compliance.issues.map((issue) => (
                      <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          issue.severity === 'low' && "bg-[#E8F5E9]",
                          issue.severity === 'medium' && "bg-[#FFF3E0]",
                          issue.severity === 'high' && "bg-[#FFEBEE]",
                          issue.severity === 'critical' && "bg-[#FFEBEE]"
                        )}>
                          {issue.severity === 'critical' && <AlertTriangle className="h-4 w-4 text-[#C62828]" />}
                          {issue.severity === 'high' && <AlertCircle className="h-4 w-4 text-[#DC3545]" />}
                          {issue.severity === 'medium' && <Info className="h-4 w-4 text-[#FF6347]" />}
                          {issue.severity === 'low' && <Info className="h-4 w-4 text-[#4CAF50]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{issue.description}</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#9E9E9E] mt-1">
                            Type: {issue.type} • Created: {new Date(issue.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Overall system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge className={cn(
                        "capitalize",
                        data.system.status === 'operational' && "bg-[#E8F5E9] text-[#2E7D32]",
                        data.system.status === 'degraded' && "bg-[#FFF3E0] text-[#F57C00]",
                        data.system.status === 'down' && "bg-[#FFEBEE] text-[#C62828]"
                      )}>
                        {data.system.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#616161]">CPU Usage</span>
                          <span className={getStatusColor(100 - data.system.cpu, 50)}>
                            {data.system.cpu}%
                          </span>
                        </div>
                        <Progress value={data.system.cpu} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#616161]">Memory Usage</span>
                          <span className={getStatusColor(100 - data.system.memory, 30)}>
                            {data.system.memory}%
                          </span>
                        </div>
                        <Progress value={data.system.memory} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#616161]">Storage Usage</span>
                          <span className={getStatusColor(100 - data.system.storage, 20)}>
                            {data.system.storage}%
                          </span>
                        </div>
                        <Progress value={data.system.storage} className="h-2" />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[#9E9E9E]">Uptime</p>
                        <p className="font-medium">{data.system.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-[#9E9E9E]">API Latency</p>
                        <p className="font-medium">{data.system.apiLatency}ms</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                  <CardDescription>
                    Individual service health monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.system.services.map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            service.status === 'up' && "bg-[#4CAF50]",
                            service.status === 'degraded' && "bg-[#FF6347]",
                            service.status === 'down' && "bg-[#DC3545]"
                          )} />
                          <div>
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-[#9E9E9E]">
                              {service.latency && `${service.latency}ms latency`}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn(
                          "text-xs capitalize",
                          service.status === 'up' && "border-[#4CAF50] text-[#2E7D32]",
                          service.status === 'degraded' && "border-[#FF6347] text-[#F57C00]",
                          service.status === 'down' && "border-[#DC3545] text-[#C62828]"
                        )}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-[#E6F2FF] border border-[#99C2FF]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#007BFF]" />
                      <p className="text-sm text-[#003166]">
                        Blockchain sync: {data.system.blockchainSync ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}