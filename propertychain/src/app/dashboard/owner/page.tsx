/**
 * Property Owner Dashboard - PropertyChain
 * 
 * Dashboard for property owners following RECOVERY_PLAN.md Step 3.2
 * Manage tokenized properties, investors, and financial reporting
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
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from 'recharts'
import {
  Building,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Download,
  Plus,
  Upload,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  ChevronRight,
  Info,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Home,
  Briefcase,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Receipt,
  Shield,
  Zap,
  Lock,
  Unlock,
  Star,
  Map,
  Camera,
  Paperclip,
  Hash,
  Target,
  Award,
  RefreshCw,
  ExternalLink,
  Filter,
  Search,
  Mail,
  Phone,
  TrendingDown,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// ============================================================================
// Types
// ============================================================================

interface Property {
  id: string
  name: string
  address: string
  type: 'residential' | 'commercial' | 'industrial' | 'retail'
  status: 'draft' | 'pending' | 'active' | 'funded' | 'closed'
  tokenizationStatus: 'not-started' | 'in-progress' | 'completed'
  totalValue: number
  tokenizedAmount: number
  tokensTotal: number
  tokensSold: number
  tokenPrice: number
  investorCount: number
  fundingProgress: number
  monthlyRevenue: number
  occupancyRate: number
  createdAt: Date
  fundingDeadline?: Date
}

interface Investor {
  id: string
  name: string
  email: string
  investmentAmount: number
  tokens: number
  joinDate: Date
  status: 'active' | 'pending' | 'exited'
  kycStatus: 'verified' | 'pending' | 'rejected'
  lastActivity: Date
}

interface Transaction {
  id: string
  type: 'investment' | 'distribution' | 'fee' | 'withdrawal'
  investorName: string
  amount: number
  date: Date
  status: 'completed' | 'pending' | 'failed'
  propertyName: string
}

interface Document {
  id: string
  name: string
  type: 'legal' | 'financial' | 'property' | 'marketing'
  size: string
  uploadDate: Date
  status: 'active' | 'expired' | 'pending'
}

interface Message {
  id: string
  from: string
  subject: string
  preview: string
  date: Date
  isRead: boolean
  priority: 'high' | 'normal' | 'low'
}

// ============================================================================
// Mock Data
// ============================================================================

const properties: Property[] = [
  {
    id: '1',
    name: 'Sunset Heights Apartments',
    address: '742 Evergreen Terrace, Springfield',
    type: 'residential',
    status: 'active',
    tokenizationStatus: 'completed',
    totalValue: 5000000,
    tokenizedAmount: 2500000,
    tokensTotal: 25000,
    tokensSold: 18750,
    tokenPrice: 100,
    investorCount: 156,
    fundingProgress: 75,
    monthlyRevenue: 42500,
    occupancyRate: 92,
    createdAt: new Date('2024-01-15'),
    fundingDeadline: new Date('2024-06-30'),
  },
  {
    id: '2',
    name: 'Downtown Business Center',
    address: '100 Corporate Blvd, Metro City',
    type: 'commercial',
    status: 'active',
    tokenizationStatus: 'completed',
    totalValue: 8000000,
    tokenizedAmount: 4000000,
    tokensTotal: 40000,
    tokensSold: 32000,
    tokenPrice: 100,
    investorCount: 89,
    fundingProgress: 80,
    monthlyRevenue: 67000,
    occupancyRate: 88,
    createdAt: new Date('2023-11-20'),
  },
  {
    id: '3',
    name: 'Green Valley Shopping Mall',
    address: '456 Commerce Way, Riverside',
    type: 'retail',
    status: 'pending',
    tokenizationStatus: 'in-progress',
    totalValue: 12000000,
    tokenizedAmount: 6000000,
    tokensTotal: 60000,
    tokensSold: 15000,
    tokenPrice: 100,
    investorCount: 45,
    fundingProgress: 25,
    monthlyRevenue: 95000,
    occupancyRate: 78,
    createdAt: new Date('2024-03-01'),
    fundingDeadline: new Date('2024-08-31'),
  },
]

const investors: Investor[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    investmentAmount: 50000,
    tokens: 500,
    joinDate: new Date('2024-01-20'),
    status: 'active',
    kycStatus: 'verified',
    lastActivity: new Date('2024-03-28'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    investmentAmount: 75000,
    tokens: 750,
    joinDate: new Date('2024-02-15'),
    status: 'active',
    kycStatus: 'verified',
    lastActivity: new Date('2024-03-29'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    investmentAmount: 100000,
    tokens: 1000,
    joinDate: new Date('2024-03-01'),
    status: 'active',
    kycStatus: 'verified',
    lastActivity: new Date('2024-03-30'),
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    investmentAmount: 25000,
    tokens: 250,
    joinDate: new Date('2024-03-10'),
    status: 'pending',
    kycStatus: 'pending',
    lastActivity: new Date('2024-03-25'),
  },
]

const recentTransactions: Transaction[] = [
  {
    id: '1',
    type: 'investment',
    investorName: 'John Smith',
    amount: 10000,
    date: new Date('2024-03-28'),
    status: 'completed',
    propertyName: 'Sunset Heights Apartments',
  },
  {
    id: '2',
    type: 'distribution',
    investorName: 'All Investors',
    amount: 42500,
    date: new Date('2024-03-25'),
    status: 'completed',
    propertyName: 'Downtown Business Center',
  },
  {
    id: '3',
    type: 'investment',
    investorName: 'Sarah Johnson',
    amount: 25000,
    date: new Date('2024-03-22'),
    status: 'pending',
    propertyName: 'Green Valley Shopping Mall',
  },
]

const documents: Document[] = [
  {
    id: '1',
    name: 'Property Deed - Sunset Heights',
    type: 'legal',
    size: '2.4 MB',
    uploadDate: new Date('2024-01-15'),
    status: 'active',
  },
  {
    id: '2',
    name: 'Q1 2024 Financial Report',
    type: 'financial',
    size: '1.8 MB',
    uploadDate: new Date('2024-03-31'),
    status: 'active',
  },
  {
    id: '3',
    name: 'Property Inspection Report',
    type: 'property',
    size: '5.2 MB',
    uploadDate: new Date('2024-03-15'),
    status: 'active',
  },
]

const messages: Message[] = [
  {
    id: '1',
    from: 'John Smith',
    subject: 'Question about dividend distribution',
    preview: 'I wanted to inquire about the next dividend payment date...',
    date: new Date('2024-03-29'),
    isRead: false,
    priority: 'normal',
  },
  {
    id: '2',
    from: 'PropertyChain Support',
    subject: 'Document verification required',
    preview: 'Please upload the updated insurance documents for...',
    date: new Date('2024-03-28'),
    isRead: false,
    priority: 'high',
  },
]

// Chart data
const revenueData = [
  { month: 'Jan', revenue: 185000, expenses: 45000 },
  { month: 'Feb', revenue: 192000, expenses: 48000 },
  { month: 'Mar', revenue: 204500, expenses: 51000 },
  { month: 'Apr', revenue: 198000, expenses: 47000 },
  { month: 'May', revenue: 215000, expenses: 52000 },
  { month: 'Jun', revenue: 225000, expenses: 54000 },
]

const investorGrowthData = [
  { month: 'Jan', investors: 120 },
  { month: 'Feb', investors: 145 },
  { month: 'Mar', investors: 178 },
  { month: 'Apr', investors: 210 },
  { month: 'May', investors: 245 },
  { month: 'Jun', investors: 290 },
]

// ============================================================================
// Property Owner Dashboard Component
// ============================================================================

export default function PropertyOwnerDashboardPage() {
  const router = useRouter()
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null)
  const [showTokenizationDialog, setShowTokenizationDialog] = React.useState(false)
  const [showMessageDialog, setShowMessageDialog] = React.useState(false)
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  
  // Calculate totals
  const totalPropertyValue = properties.reduce((sum, p) => sum + p.totalValue, 0)
  const totalTokenized = properties.reduce((sum, p) => sum + p.tokenizedAmount, 0)
  const totalInvestors = properties.reduce((sum, p) => sum + p.investorCount, 0)
  const totalMonthlyRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0)
  
  // Handle property tokenization
  const handleTokenize = (property: Property) => {
    setSelectedProperty(property)
    setShowTokenizationDialog(true)
  }
  
  // Handle submit tokenization
  const submitTokenization = () => {
    toast.success('Tokenization request submitted for review')
    setShowTokenizationDialog(false)
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'investors' ? entry.value : formatCurrency(entry.value)}
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
          <h1 className="text-3xl font-bold">Property Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tokenized properties and investor relations
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={() => router.push('/properties/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
          <Button variant="outline" onClick={() => setShowMessageDialog(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
            {messages.filter(m => !m.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {messages.filter(m => !m.isRead).length}
              </Badge>
            )}
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Property Value
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalPropertyValue)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Across {properties.length} properties
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tokenized Value
              </CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalTokenized)}</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={(totalTokenized / totalPropertyValue) * 100} className="h-1.5" />
              <span className="text-sm text-muted-foreground">
                {formatPercentage(totalTokenized / totalPropertyValue)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalInvestors}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-sm text-green-500">+23%</span>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalMonthlyRevenue)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Net after expenses
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="investors">Investors</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Properties</CardTitle>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Tokenization</TableHead>
                      <TableHead>Funding</TableHead>
                      <TableHead>Investors</TableHead>
                      <TableHead>Monthly Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{property.name}</p>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            property.status === 'active' ? 'default' :
                            property.status === 'funded' ? 'secondary' :
                            property.status === 'pending' ? 'outline' :
                            'destructive'
                          }>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant={
                              property.tokenizationStatus === 'completed' ? 'default' :
                              property.tokenizationStatus === 'in-progress' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {property.tokenizationStatus.replace('-', ' ')}
                            </Badge>
                            <p className="text-sm">
                              {property.tokensSold}/{property.tokensTotal} tokens
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={property.fundingProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {formatPercentage(property.fundingProgress / 100)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{property.investorCount}</TableCell>
                        <TableCell>{formatCurrency(property.monthlyRevenue)}</TableCell>
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
                              <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Property
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {property.tokenizationStatus !== 'completed' && (
                                <DropdownMenuItem onClick={() => handleTokenize(property)}>
                                  <Hash className="mr-2 h-4 w-4" />
                                  Tokenize Property
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                View Investors
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Report
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Property
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Property Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{property.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {property.occupancyRate}%
                        </span>
                      </div>
                      <Progress value={property.occupancyRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Property Documents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send Investor Update
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Receipt className="mr-2 h-4 w-4" />
                  Process Distributions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Property Viewing
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Investors Tab */}
        <TabsContent value="investors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Investor Management</CardTitle>
                  <CardDescription>
                    Manage and communicate with your property investors
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor</TableHead>
                      <TableHead>Investment</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.map((investor) => (
                      <TableRow key={investor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{investor.name}</p>
                            <p className="text-sm text-muted-foreground">{investor.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(investor.investmentAmount)}</TableCell>
                        <TableCell>{investor.tokens}</TableCell>
                        <TableCell>
                          <Badge variant={
                            investor.kycStatus === 'verified' ? 'default' :
                            investor.kycStatus === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {investor.kycStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{investor.joinDate.toLocaleDateString()}</TableCell>
                        <TableCell>{investor.lastActivity.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Documents
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Call Investor
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Investor Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Investor Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={investorGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="investors" 
                    stroke="#007BFF" 
                    strokeWidth={2}
                    dot={{ fill: '#007BFF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue & Expenses</CardTitle>
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
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue (YTD)</p>
                    <p className="text-xl font-bold">{formatCurrency(1219500)}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses (YTD)</p>
                    <p className="text-xl font-bold">{formatCurrency(297000)}</p>
                  </div>
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Income (YTD)</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(922500)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Distribution</span>
                    <span className="font-medium">April 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Distribution Amount</span>
                    <span className="font-medium">{formatCurrency(42500)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
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
                      <TableHead>Property</TableHead>
                      <TableHead>Investor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.propertyName}</TableCell>
                        <TableCell>{transaction.investorName}</TableCell>
                        <TableCell className={cn(
                          transaction.type === 'investment' ? 'text-green-600' : '',
                          transaction.type === 'distribution' ? 'text-red-600' : ''
                        )}>
                          {transaction.type === 'distribution' ? '-' : '+'}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>
                    Upload and manage property documents
                  </CardDescription>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge variant={
                        doc.status === 'active' ? 'default' :
                        doc.status === 'expired' ? 'destructive' :
                        'secondary'
                      } className="text-xs">
                        {doc.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{doc.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {doc.size} • {doc.uploadDate.toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Tokenization Dialog */}
      <Dialog open={showTokenizationDialog} onOpenChange={setShowTokenizationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tokenize Property</DialogTitle>
            <DialogDescription>
              Submit your property for tokenization and start accepting investments
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{selectedProperty.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Property Value</p>
                    <p className="font-medium">{formatCurrency(selectedProperty.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Proposed Tokenization</p>
                    <p className="font-medium">{formatCurrency(selectedProperty.tokenizedAmount)}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="token-amount">Tokenization Amount</Label>
                  <Input 
                    id="token-amount" 
                    type="number" 
                    defaultValue={selectedProperty.tokenizedAmount}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-price">Token Price</Label>
                  <Input 
                    id="token-price" 
                    type="number" 
                    defaultValue={100}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="funding-period">Funding Period (days)</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="120">120 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Investment Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the investment opportunity..."
                  rows={4}
                />
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Tokenization requires legal review and regulatory compliance checks. 
                  The process typically takes 5-7 business days.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTokenizationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitTokenization}>
              Submit for Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Messages Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Messages</DialogTitle>
            <DialogDescription>
              Investor communications and platform notifications
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  !message.isRead && "border-blue-500"
                )}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{message.from}</p>
                      {message.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                      {!message.isRead && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{message.subject}</p>
                    <p className="text-sm text-muted-foreground">{message.preview}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.date.toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Close
            </Button>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Compose Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}