/**
 * User Dashboard Components - PropertyChain
 * 
 * User dashboard with portfolio overview and property management
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserProfile, ProfileActivity } from './user-profile'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  TrendingUp,
  TrendingDown,
  Home,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Star,
  Heart,
  MessageSquare,
  Share,
  Download,
  Upload,
  Edit,
  Settings,
  Bell,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Target,
  Award,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
  GraduationCap,
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  Receipt,
  FileText,
  Key,
  Lock,
  Unlock,
} from 'lucide-react'
import {
  format,
  subDays,
  subMonths,
  differenceInDays,
  isThisMonth,
  isThisYear,
} from 'date-fns'

// Investment portfolio types
export interface Investment {
  id: string
  propertyName: string
  propertyType: 'house' | 'apartment' | 'commercial' | 'land'
  location: string
  investedAmount: number
  currentValue: number
  roi: number
  monthlyReturn: number
  status: 'active' | 'funded' | 'completed' | 'pending'
  startDate: Date
  images: string[]
}

export interface PortfolioStats {
  totalInvested: number
  currentValue: number
  totalReturns: number
  monthlyIncome: number
  averageROI: number
  activeInvestments: number
  completedInvestments: number
  pendingInvestments: number
}

// User Dashboard Component
interface UserDashboardProps {
  user: UserProfile
  investments?: Investment[]
  activities?: ProfileActivity[]
  onInvestmentClick?: (investment: Investment) => void
  onEditProfile?: () => void
  className?: string
}

export function UserDashboard({
  user,
  investments = [],
  activities = [],
  onInvestmentClick,
  onEditProfile,
  className,
}: UserDashboardProps) {
  const [timeRange, setTimeRange] = React.useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Calculate portfolio stats
  const portfolioStats: PortfolioStats = React.useMemo(() => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0)
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
    const totalReturns = currentValue - totalInvested
    const monthlyIncome = investments.reduce((sum, inv) => sum + inv.monthlyReturn, 0)
    const averageROI = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

    return {
      totalInvested,
      currentValue,
      totalReturns,
      monthlyIncome,
      averageROI,
      activeInvestments: investments.filter(i => i.status === 'active').length,
      completedInvestments: investments.filter(i => i.status === 'completed').length,
      pendingInvestments: investments.filter(i => i.status === 'pending').length,
    }
  }, [investments])

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.displayName || user.username

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback className="text-lg">
              {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Member since {format(user.stats.joinedDate, 'MMMM yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Last active {format(user.stats.lastActive, 'MMM d')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEditProfile}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioStats.totalInvested)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioStats.currentValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-muted-foreground">
                {portfolioStats.averageROI >= 0 ? '+' : ''}{portfolioStats.averageROI.toFixed(1)}% ROI
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioStats.monthlyIncome)}</p>
              </div>
              <Receipt className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+8% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Investments</p>
                <p className="text-2xl font-bold">{portfolioStats.activeInvestments}</p>
              </div>
              <Building className="h-8 w-8 text-amber-500" />
            </div>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-muted-foreground">
                {portfolioStats.pendingInvestments} pending
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Portfolio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Investment Portfolio</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No investments yet. Start building your portfolio!
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  investments.map((investment) => (
                    <InvestmentCard
                      key={investment.id}
                      investment={investment}
                      onClick={() => onInvestmentClick?.(investment)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(activity.timestamp, 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Profile Completion */}
          <ProfileCompletionCard user={user} />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Residential</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Commercial</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <Progress value={25} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Land</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <Progress value={10} />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your investment milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-200">
                  <Award className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">First Investment</p>
                    <p className="text-xs text-muted-foreground">Completed your first property investment</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">$100K Milestone</p>
                    <p className="text-xs text-muted-foreground">Reached $100,000 in total investments</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg border border-dashed">
                  <Star className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Diversified Portfolio</p>
                    <p className="text-xs text-muted-foreground">Invest in 5 different property types</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Investment Card Component
interface InvestmentCardProps {
  investment: Investment
  onClick?: () => void
}

function InvestmentCard({ investment, onClick }: InvestmentCardProps) {
  const roi = ((investment.currentValue - investment.investedAmount) / investment.investedAmount) * 100
  const roiColor = roi >= 0 ? 'text-green-500' : 'text-red-500'

  return (
    <div
      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
          <Home className="h-6 w-6" />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{investment.propertyName}</h4>
            <p className="text-sm text-muted-foreground">
              {investment.location} • {investment.propertyType}
            </p>
          </div>
          <Badge variant={
            investment.status === 'active' ? 'default' :
            investment.status === 'completed' ? 'success' :
            investment.status === 'funded' ? 'secondary' :
            'outline'
          }>
            {investment.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
          <div>
            <p className="text-muted-foreground">Invested</p>
            <p className="font-medium">{formatCurrency(investment.investedAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Value</p>
            <p className="font-medium">{formatCurrency(investment.currentValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ROI</p>
            <p className={cn("font-medium", roiColor)}>
              {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-muted-foreground">Monthly Return</span>
          <span className="font-medium text-green-500">
            {formatCurrency(investment.monthlyReturn)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Profile Completion Card
interface ProfileCompletionCardProps {
  user: UserProfile
}

function ProfileCompletionCard({ user }: ProfileCompletionCardProps) {
  const completionItems = [
    { key: 'avatar', label: 'Profile Photo', completed: !!user.avatar },
    { key: 'bio', label: 'Bio', completed: !!user.bio },
    { key: 'phone', label: 'Phone Number', completed: !!user.phone },
    { key: 'location', label: 'Location', completed: !!user.location },
    { key: 'email_verified', label: 'Email Verified', completed: user.verification.email },
    { key: 'phone_verified', label: 'Phone Verified', completed: user.verification.phone },
  ]

  const completedCount = completionItems.filter(item => item.completed).length
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardDescription>Complete your profile to unlock more features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} />
          </div>
          
          <div className="space-y-2">
            {completionItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                {item.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          
          {completionPercentage < 100 && (
            <Button className="w-full" size="sm">
              Complete Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function for activity icons
function getActivityIcon(type: ProfileActivity['type']) {
  switch (type) {
    case 'investment':
      return <TrendingUp className="h-4 w-4 text-green-500" />
    case 'property':
      return <Home className="h-4 w-4 text-blue-500" />
    case 'transaction':
      return <CreditCard className="h-4 w-4 text-purple-500" />
    case 'social':
      return <Users className="h-4 w-4 text-cyan-500" />
    case 'achievement':
      return <Award className="h-4 w-4 text-amber-500" />
    default:
      return <Info className="h-4 w-4" />
  }
}