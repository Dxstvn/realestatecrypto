/**
 * Admin Dashboard - PropertyChain
 * 
 * Platform management dashboard following RECOVERY_PLAN.md Step 3.3
 * Complete admin interface with business analytics, user management, and platform configuration
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
  RadialBarChart,
  RadialBar,
} from 'recharts'
import {
  Building,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Download,
  Upload,
  Settings,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Ban,
  UserCheck,
  UserX,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  Database,
  Server,
  Zap,
  Lock,
  Unlock,
  Key,
  CreditCard,
  Receipt,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ChevronDown,
  Info,
  Bell,
  LogOut,
  Home,
  Briefcase,
  Target,
  Award,
  Hash,
  Calendar,
  Timer,
  AlertTriangle,
  CheckCircle2,
  XOctagon,
  Gauge,
  Package,
  Layers,
  GitBranch,
  HeartHandshake,
  Gavel,
  FileSearch,
  UserCog,
  SlidersHorizontal,
  HelpCircle,
  Headphones,
  Flag,
  Star,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// ============================================================================
// Types
// ============================================================================

interface PlatformMetrics {
  totalRevenue: number
  revenueChange: number
  totalUsers: number
  usersChange: number
  totalProperties: number
  propertiesChange: number
  totalTransactions: number
  transactionsChange: number
  platformHealth: number
  activeIssues: number
}

interface User {
  id: string
  name: string
  email: string
  role: 'investor' | 'owner' | 'admin'
  status: 'active' | 'suspended' | 'pending'
  kycStatus: 'verified' | 'pending' | 'rejected'
  joinDate: Date
  lastActive: Date
  totalInvested?: number
  propertyCount?: number
}

interface PropertyApproval {
  id: string
  propertyName: string
  ownerName: string
  submittedDate: Date
  propertyValue: number
  tokenizationAmount: number
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high'
}

interface Transaction {
  id: string
  type: 'investment' | 'withdrawal' | 'fee' | 'distribution'
  userName: string
  propertyName: string
  amount: number
  date: Date
  status: 'completed' | 'pending' | 'failed'
  txHash?: string
}

interface SupportTicket {
  id: string
  subject: string
  userName: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdDate: Date
  responseTime?: number
  category: 'technical' | 'financial' | 'kyc' | 'property' | 'other'
}

interface SystemHealth {
  service: string
  status: 'operational' | 'degraded' | 'down'
  uptime: number
  responseTime: number
  lastChecked: Date
}

interface AuditLog {
  id: string
  action: string
  user: string
  target?: string
  timestamp: Date
  ipAddress: string
  result: 'success' | 'failure'
}

// ============================================================================
// Mock Data
// ============================================================================

const platformMetrics: PlatformMetrics = {
  totalRevenue: 2847500,
  revenueChange: 12.5,
  totalUsers: 3456,
  usersChange: 8.3,
  totalProperties: 142,
  propertiesChange: 5.7,
  totalTransactions: 8923,
  transactionsChange: 15.2,
  platformHealth: 98.5,
  activeIssues: 3,
}

const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'investor',
    status: 'active',
    kycStatus: 'verified',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date('2024-03-30'),
    totalInvested: 125000,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'owner',
    status: 'active',
    kycStatus: 'verified',
    joinDate: new Date('2023-11-20'),
    lastActive: new Date('2024-03-29'),
    propertyCount: 3,
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    role: 'investor',
    status: 'pending',
    kycStatus: 'pending',
    joinDate: new Date('2024-03-28'),
    lastActive: new Date('2024-03-28'),
    totalInvested: 0,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    role: 'investor',
    status: 'suspended',
    kycStatus: 'rejected',
    joinDate: new Date('2024-02-10'),
    lastActive: new Date('2024-03-01'),
    totalInvested: 5000,
  },
]

const propertyApprovals: PropertyApproval[] = [
  {
    id: '1',
    propertyName: 'Marina Bay Towers',
    ownerName: 'Pacific Real Estate LLC',
    submittedDate: new Date('2024-03-25'),
    propertyValue: 15000000,
    tokenizationAmount: 7500000,
    status: 'pending',
    complianceScore: 92,
    riskLevel: 'low',
  },
  {
    id: '2',
    propertyName: 'Green Valley Mall',
    ownerName: 'Retail Properties Inc',
    submittedDate: new Date('2024-03-22'),
    propertyValue: 25000000,
    tokenizationAmount: 12500000,
    status: 'reviewing',
    complianceScore: 78,
    riskLevel: 'medium',
  },
  {
    id: '3',
    propertyName: 'Tech Park Building A',
    ownerName: 'Innovation Estates',
    submittedDate: new Date('2024-03-20'),
    propertyValue: 8000000,
    tokenizationAmount: 4000000,
    status: 'pending',
    complianceScore: 65,
    riskLevel: 'high',
  },
]

const supportTickets: SupportTicket[] = [
  {
    id: '1',
    subject: 'Cannot complete KYC verification',
    userName: 'Michael Chen',
    priority: 'high',
    status: 'open',
    createdDate: new Date('2024-03-29'),
    category: 'kyc',
  },
  {
    id: '2',
    subject: 'Withdrawal pending for 3 days',
    userName: 'John Smith',
    priority: 'urgent',
    status: 'in-progress',
    createdDate: new Date('2024-03-27'),
    responseTime: 2.5,
    category: 'financial',
  },
  {
    id: '3',
    subject: 'Property listing not visible',
    userName: 'Sarah Johnson',
    priority: 'medium',
    status: 'resolved',
    createdDate: new Date('2024-03-26'),
    responseTime: 1.2,
    category: 'property',
  },
]

const systemHealth: SystemHealth[] = [
  {
    service: 'Web Application',
    status: 'operational',
    uptime: 99.99,
    responseTime: 145,
    lastChecked: new Date(),
  },
  {
    service: 'Blockchain Node',
    status: 'operational',
    uptime: 99.95,
    responseTime: 320,
    lastChecked: new Date(),
  },
  {
    service: 'Database',
    status: 'operational',
    uptime: 99.98,
    responseTime: 28,
    lastChecked: new Date(),
  },
  {
    service: 'Payment Gateway',
    status: 'degraded',
    uptime: 98.50,
    responseTime: 890,
    lastChecked: new Date(),
  },
  {
    service: 'Email Service',
    status: 'operational',
    uptime: 99.90,
    responseTime: 210,
    lastChecked: new Date(),
  },
]

const auditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'Property Approved',
    user: 'Admin User',
    target: 'Sunset Heights Apartments',
    timestamp: new Date('2024-03-30T10:30:00'),
    ipAddress: '192.168.1.100',
    result: 'success',
  },
  {
    id: '2',
    action: 'User Suspended',
    user: 'Admin User',
    target: 'emily.d@email.com',
    timestamp: new Date('2024-03-30T09:15:00'),
    ipAddress: '192.168.1.100',
    result: 'success',
  },
  {
    id: '3',
    action: 'KYC Verification Failed',
    user: 'System',
    target: 'mchen@email.com',
    timestamp: new Date('2024-03-29T14:45:00'),
    ipAddress: '10.0.0.1',
    result: 'failure',
  },
]

// Chart data
const revenueData = [
  { month: 'Jan', revenue: 425000, users: 2800, properties: 110 },
  { month: 'Feb', revenue: 458000, users: 2950, properties: 118 },
  { month: 'Mar', revenue: 492000, users: 3100, properties: 125 },
  { month: 'Apr', revenue: 510000, users: 3250, properties: 132 },
  { month: 'May', revenue: 545000, users: 3400, properties: 138 },
  { month: 'Jun', revenue: 580000, users: 3456, properties: 142 },
]

const userDistribution = [
  { name: 'Investors', value: 2890, percentage: 83.6 },
  { name: 'Property Owners', value: 450, percentage: 13.0 },
  { name: 'Administrators', value: 116, percentage: 3.4 },
]

const propertyTypeDistribution = [
  { name: 'Residential', value: 45, amount: 125000000 },
  { name: 'Commercial', value: 35, amount: 180000000 },
  { name: 'Industrial', value: 15, amount: 95000000 },
  { name: 'Retail', value: 25, amount: 75000000 },
  { name: 'Mixed Use', value: 22, amount: 65000000 },
]

const COLORS = ['#007BFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

// ============================================================================
// Admin Dashboard Component
// ============================================================================

export default function AdminDashboardPage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [selectedProperty, setSelectedProperty] = React.useState<PropertyApproval | null>(null)
  const [showUserDialog, setShowUserDialog] = React.useState(false)
  const [showPropertyDialog, setShowPropertyDialog] = React.useState(false)
  const [showConfigDialog, setShowConfigDialog] = React.useState(false)
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null)
  const [bulkSelection, setBulkSelection] = React.useState<string[]>([])
  
  // Platform settings state
  const [platformSettings, setPlatformSettings] = React.useState({
    maintenanceMode: false,
    registrationEnabled: true,
    tradingEnabled: true,
    kycRequired: true,
    minInvestment: 100,
    maxInvestment: 1000000,
    platformFeePercent: 2,
    withdrawalFeePercent: 1,
  })
  
  // Handle property approval
  const handlePropertyApproval = (property: PropertyApproval, approved: boolean) => {
    setSelectedProperty(property)
    toast.success(
      approved 
        ? `Property "${property.propertyName}" approved for tokenization`
        : `Property "${property.propertyName}" rejected`
    )
    setShowPropertyDialog(false)
  }
  
  // Handle user action
  const handleUserAction = (user: User, action: 'suspend' | 'activate' | 'delete') => {
    switch (action) {
      case 'suspend':
        toast.warning(`User ${user.name} has been suspended`)
        break
      case 'activate':
        toast.success(`User ${user.name} has been activated`)
        break
      case 'delete':
        toast.error(`User ${user.name} has been deleted`)
        break
    }
  }
  
  // Handle ticket action
  const handleTicketAction = (ticket: SupportTicket, action: 'assign' | 'resolve' | 'escalate') => {
    switch (action) {
      case 'assign':
        toast.info(`Ticket #${ticket.id} assigned to support team`)
        break
      case 'resolve':
        toast.success(`Ticket #${ticket.id} marked as resolved`)
        break
      case 'escalate':
        toast.warning(`Ticket #${ticket.id} escalated to management`)
        break
    }
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {
                entry.name === 'users' || entry.name === 'properties' 
                  ? formatNumber(entry.value)
                  : formatCurrency(entry.value)
              }
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Platform management and analytics
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowConfigDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Alerts
            {platformMetrics.activeIssues > 0 && (
              <Badge variant="destructive" className="ml-2">
                {platformMetrics.activeIssues}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      {/* System Health Alert */}
      {systemHealth.some(s => s.status !== 'operational') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System degradation detected. Payment Gateway experiencing high response times.
            <Button variant="link" size="sm" className="ml-2">
              View Details
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Top Stats (Section 10.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(platformMetrics.totalRevenue)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {platformMetrics.revenueChange >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn(
                "text-sm",
                platformMetrics.revenueChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {Math.abs(platformMetrics.revenueChange)}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatNumber(platformMetrics.totalUsers)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-sm text-green-500">
                +{platformMetrics.usersChange}%
              </span>
              <span className="text-sm text-muted-foreground">new this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Properties Listed
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {platformMetrics.totalProperties}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-sm text-green-500">
                +{platformMetrics.propertiesChange}%
              </span>
              <span className="text-sm text-muted-foreground">growth</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatNumber(platformMetrics.totalTransactions)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-sm text-green-500">
                +{platformMetrics.transactionsChange}%
              </span>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab (Section 10.2) */}
        <TabsContent value="overview" className="space-y-6">
          {/* Business Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Platform Growth</CardTitle>
                  <Select defaultValue="6m">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Month</SelectItem>
                      <SelectItem value="3m">3 Months</SelectItem>
                      <SelectItem value="6m">6 Months</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#007BFF" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="users" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Users"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="properties" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Properties"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {userDistribution.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatNumber(entry.value)} ({entry.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* System Health Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Health</CardTitle>
                <Badge variant={
                  platformMetrics.platformHealth > 95 ? 'default' :
                  platformMetrics.platformHealth > 90 ? 'secondary' :
                  'destructive'
                }>
                  {platformMetrics.platformHealth}% Healthy
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {systemHealth.map((service) => (
                  <div key={service.service} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{service.service}</span>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        service.status === 'operational' && "bg-green-500",
                        service.status === 'degraded' && "bg-yellow-500",
                        service.status === 'down' && "bg-red-500"
                      )} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Uptime</span>
                        <span>{service.uptime}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Response</span>
                        <span>{service.responseTime}ms</span>
                      </div>
                    </div>
                    <Progress 
                      value={service.uptime} 
                      className="h-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Real-time Activity Feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Real-time Activity</CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        log.result === 'success' ? "bg-green-100" : "bg-red-100"
                      )}>
                        {log.result === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XOctagon className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.user} {log.target && `• ${log.target}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleString()} • {log.ipAddress}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Properties Tab (Section 10.3) */}
        <TabsContent value="properties" className="space-y-6">
          {/* Property Approval Queue */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Property Approval Queue</CardTitle>
                  <CardDescription>
                    Review and approve property tokenization requests
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {propertyApprovals.filter(p => p.status === 'pending').length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyApprovals.map((property) => (
                  <Card key={property.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{property.propertyName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {property.ownerName}
                          </p>
                        </div>
                        <Badge variant={
                          property.status === 'approved' ? 'default' :
                          property.status === 'reviewing' ? 'secondary' :
                          property.status === 'rejected' ? 'destructive' :
                          'outline'
                        }>
                          {property.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Value</p>
                          <p className="font-medium">{formatCurrency(property.propertyValue)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tokenization</p>
                          <p className="font-medium">{formatCurrency(property.tokenizationAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Compliance Score</span>
                          <span className={cn(
                            "font-medium",
                            property.complianceScore >= 80 && "text-green-600",
                            property.complianceScore >= 60 && property.complianceScore < 80 && "text-yellow-600",
                            property.complianceScore < 60 && "text-red-600"
                          )}>
                            {property.complianceScore}%
                          </span>
                        </div>
                        <Progress value={property.complianceScore} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant={
                          property.riskLevel === 'low' ? 'default' :
                          property.riskLevel === 'medium' ? 'secondary' :
                          'destructive'
                        } className="text-xs">
                          {property.riskLevel} risk
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedProperty(property)
                            setShowPropertyDialog(true)
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Property Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Property Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={propertyTypeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#007BFF" name="Properties" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {propertyTypeDistribution.map((type, index) => (
                    <div key={type.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium">{type.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {type.value} properties
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(type.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab (Section 10.4) */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage platform users and KYC verification
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input 
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkSelection(users.map(u => u.id))
                            } else {
                              setBulkSelection([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>KYC</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <input 
                            type="checkbox"
                            checked={bulkSelection.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkSelection([...bulkSelection, user.id])
                              } else {
                                setBulkSelection(bulkSelection.filter(id => id !== user.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            user.status === 'active' ? 'default' :
                            user.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            user.kycStatus === 'verified' ? 'default' :
                            user.kycStatus === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {user.kycStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate.toLocaleDateString()}</TableCell>
                        <TableCell>{user.lastActive.toLocaleDateString()}</TableCell>
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user)
                                setShowUserDialog(true)
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Verify KYC
                              </DropdownMenuItem>
                              {user.status === 'active' ? (
                                <DropdownMenuItem 
                                  className="text-yellow-600"
                                  onClick={() => handleUserAction(user, 'suspend')}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => handleUserAction(user, 'activate')}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleUserAction(user, 'delete')}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Bulk Actions Bar */}
              {bulkSelection.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between">
                  <span className="text-sm">
                    {bulkSelection.length} user(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Selected
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Verify KYC
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Ban className="mr-2 h-4 w-4" />
                      Suspend Selected
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* KYC Verification Queue */}
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification Queue</CardTitle>
              <CardDescription>
                {users.filter(u => u.kycStatus === 'pending').length} users pending verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.filter(u => u.kycStatus === 'pending').map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted {user.joinDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      <Button size="sm">
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Finance Tab (Section 10.5) */}
        <TabsContent value="finance" className="space-y-6">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platform Fees</span>
                  <span className="font-medium">{formatCurrency(1423750)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Fees</span>
                  <span className="font-medium">{formatCurrency(892300)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Withdrawal Fees</span>
                  <span className="font-medium">{formatCurrency(284750)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Premium Services</span>
                  <span className="font-medium">{formatCurrency(246700)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total Revenue</span>
                  <span className="text-lg">{formatCurrency(2847500)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payout Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pending Payouts</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(156000)}</p>
                  <Button className="w-full mt-3" size="sm">
                    Process Payouts
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processed Today</span>
                    <span>{formatCurrency(45000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">This Week</span>
                    <span>{formatCurrency(328000)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">This Month</span>
                    <span>{formatCurrency(1245000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fee Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                  <Input 
                    id="platform-fee" 
                    type="number" 
                    value={platformSettings.platformFeePercent}
                    onChange={(e) => setPlatformSettings({
                      ...platformSettings,
                      platformFeePercent: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-fee">Withdrawal Fee (%)</Label>
                  <Input 
                    id="withdrawal-fee" 
                    type="number" 
                    value={platformSettings.withdrawalFeePercent}
                    onChange={(e) => setPlatformSettings({
                      ...platformSettings,
                      withdrawalFeePercent: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <Button className="w-full">
                  Update Fees
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Transaction Monitor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction Monitor</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>TX Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Transaction rows would go here */}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Support Tab (Section 10.6) */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Support Center</CardTitle>
                  <CardDescription>
                    Manage customer support tickets and inquiries
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">
                    {supportTickets.filter(t => t.priority === 'urgent').length} Urgent
                  </Badge>
                  <Badge variant="secondary">
                    {supportTickets.filter(t => t.status === 'open').length} Open
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            ticket.priority === 'urgent' ? 'destructive' :
                            ticket.priority === 'high' ? 'default' :
                            ticket.priority === 'medium' ? 'secondary' :
                            'outline'
                          } className="text-xs">
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ticket.category}
                          </Badge>
                          <Badge variant={
                            ticket.status === 'resolved' ? 'default' :
                            ticket.status === 'in-progress' ? 'secondary' :
                            ticket.status === 'closed' ? 'outline' :
                            'destructive'
                          } className="text-xs">
                            {ticket.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{ticket.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ticket.userName} • {ticket.createdDate.toLocaleDateString()}
                          {ticket.responseTime && ` • Response time: ${ticket.responseTime}h`}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, 'assign')}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Assign to Team
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, 'resolve')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, 'escalate')}>
                            <Flag className="mr-2 h-4 w-4" />
                            Escalate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Thread
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Response Time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1.8h</p>
                <p className="text-xs text-muted-foreground">-15% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">4.7/5</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={cn(
                        "h-3 w-3",
                        star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12/15</p>
                <p className="text-xs text-muted-foreground">3 on break</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* System Tab (Section 10.7) */}
        <TabsContent value="system" className="space-y-6">
          {/* Audit Log */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audit Log</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.target || '-'}</TableCell>
                        <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                            {log.result}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Platform Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Disable platform for maintenance
                    </p>
                  </div>
                  <Switch 
                    id="maintenance"
                    checked={platformSettings.maintenanceMode}
                    onCheckedChange={(checked) => setPlatformSettings({
                      ...platformSettings,
                      maintenanceMode: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration">Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new user registrations
                    </p>
                  </div>
                  <Switch 
                    id="registration"
                    checked={platformSettings.registrationEnabled}
                    onCheckedChange={(checked) => setPlatformSettings({
                      ...platformSettings,
                      registrationEnabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trading">Trading</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable property investments
                    </p>
                  </div>
                  <Switch 
                    id="trading"
                    checked={platformSettings.tradingEnabled}
                    onCheckedChange={(checked) => setPlatformSettings({
                      ...platformSettings,
                      tradingEnabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="kyc">KYC Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require KYC for investments
                    </p>
                  </div>
                  <Switch 
                    id="kyc"
                    checked={platformSettings.kycRequired}
                    onCheckedChange={(checked) => setPlatformSettings({
                      ...platformSettings,
                      kycRequired: checked
                    })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-investment">Minimum Investment ($)</Label>
                  <Input 
                    id="min-investment" 
                    type="number" 
                    value={platformSettings.minInvestment}
                    onChange={(e) => setPlatformSettings({
                      ...platformSettings,
                      minInvestment: parseInt(e.target.value)
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-investment">Maximum Investment ($)</Label>
                  <Input 
                    id="max-investment" 
                    type="number" 
                    value={platformSettings.maxInvestment}
                    onChange={(e) => setPlatformSettings({
                      ...platformSettings,
                      maxInvestment: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
              
              <Button className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Property Review Dialog */}
      <Dialog open={showPropertyDialog} onOpenChange={setShowPropertyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Property Review</DialogTitle>
            <DialogDescription>
              Review property details and approve for tokenization
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Property Name</Label>
                  <p className="font-medium">{selectedProperty.propertyName}</p>
                </div>
                <div>
                  <Label>Owner</Label>
                  <p className="font-medium">{selectedProperty.ownerName}</p>
                </div>
                <div>
                  <Label>Property Value</Label>
                  <p className="font-medium">{formatCurrency(selectedProperty.propertyValue)}</p>
                </div>
                <div>
                  <Label>Tokenization Amount</Label>
                  <p className="font-medium">{formatCurrency(selectedProperty.tokenizationAmount)}</p>
                </div>
                <div>
                  <Label>Compliance Score</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedProperty.complianceScore} className="flex-1" />
                    <span className="font-medium">{selectedProperty.complianceScore}%</span>
                  </div>
                </div>
                <div>
                  <Label>Risk Level</Label>
                  <Badge variant={
                    selectedProperty.riskLevel === 'low' ? 'default' :
                    selectedProperty.riskLevel === 'medium' ? 'secondary' :
                    'destructive'
                  }>
                    {selectedProperty.riskLevel}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review-notes">Review Notes</Label>
                <Textarea 
                  id="review-notes" 
                  placeholder="Add notes about this property review..."
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPropertyDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedProperty && handlePropertyApproval(selectedProperty, false)}
            >
              Reject
            </Button>
            <Button 
              onClick={() => selectedProperty && handlePropertyApproval(selectedProperty, true)}
            >
              Approve Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}