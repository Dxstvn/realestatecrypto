/**
 * Property-Specific Notification Components - PropertyChain
 * 
 * Specialized notification functionality for real estate operations
 */

'use client'

import * as React from 'react'
import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationBell,
  NotificationCenter,
  NotificationSettings,
  NotificationStats,
} from './notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  Home,
  Building,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  BellRing,
  Mail,
  Phone,
  Video,
  Key,
  FileText,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  ClipboardCheck,
  UserCheck,
  FileSignature,
  Shield,
  Award,
  Target,
  Flag,
  Zap,
  Activity,
  BarChart,
  PieChart,
  MapPin,
  Camera,
  Star,
  Heart,
  ThumbsUp,
  Share,
  Download,
  Upload,
  Archive,
  Trash2,
  Settings,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
  Package,
  Truck,
  Briefcase,
  Gavel,
  Scale,
  Hammer,
  PaintBucket,
  Lightbulb,
  Droplets,
  ThermometerSun,
  TreePine,
  Car,
  Wifi,
} from 'lucide-react'
import {
  addDays,
  addHours,
  subDays,
  format,
  isAfter,
  isBefore,
} from 'date-fns'

// Property notification templates
export const PROPERTY_NOTIFICATION_TEMPLATES = {
  // Property Listings
  'property-listed': {
    type: 'property' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'New Property Listed',
    messageTemplate: 'Property {{propertyAddress}} has been listed for {{price}}',
    icon: <Home className="h-4 w-4" />,
  },
  'property-updated': {
    type: 'property' as NotificationType,
    priority: 'low' as NotificationPriority,
    title: 'Property Updated',
    messageTemplate: 'Property {{propertyAddress}} details have been updated',
    icon: <FileText className="h-4 w-4" />,
  },
  'price-changed': {
    type: 'property' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'Price Change',
    messageTemplate: 'Price for {{propertyAddress}} changed from {{oldPrice}} to {{newPrice}}',
    icon: <DollarSign className="h-4 w-4" />,
  },

  // Property Viewings
  'viewing-scheduled': {
    type: 'property' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Viewing Scheduled',
    messageTemplate: 'Property viewing scheduled for {{date}} at {{time}}',
    icon: <Eye className="h-4 w-4" />,
  },
  'viewing-reminder': {
    type: 'reminder' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'Viewing Reminder',
    messageTemplate: 'Your property viewing is in {{timeUntil}} at {{address}}',
    icon: <Clock className="h-4 w-4" />,
  },
  'viewing-cancelled': {
    type: 'property' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Viewing Cancelled',
    messageTemplate: 'Property viewing for {{date}} has been cancelled',
    icon: <AlertTriangle className="h-4 w-4" />,
  },

  // Investment Notifications
  'investment-opportunity': {
    type: 'investment' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'New Investment Opportunity',
    messageTemplate: 'New investment opportunity: {{propertyType}} with {{expectedReturn}}% returns',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  'funding-milestone': {
    type: 'investment' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Funding Milestone',
    messageTemplate: 'Investment {{investmentName}} reached {{percentage}}% funding',
    icon: <Target className="h-4 w-4" />,
  },
  'investment-complete': {
    type: 'investment' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'Investment Funded',
    messageTemplate: 'Investment {{investmentName}} is now fully funded!',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  'dividend-payment': {
    type: 'payment' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Dividend Payment',
    messageTemplate: 'You received {{amount}} dividend from {{investmentName}}',
    icon: <Banknote className="h-4 w-4" />,
  },

  // Transaction Notifications
  'offer-received': {
    type: 'transaction' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'Offer Received',
    messageTemplate: 'New offer of {{amount}} received for {{propertyAddress}}',
    icon: <FileSignature className="h-4 w-4" />,
  },
  'offer-accepted': {
    type: 'transaction' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'Offer Accepted',
    messageTemplate: 'Your offer for {{propertyAddress}} has been accepted!',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  'inspection-scheduled': {
    type: 'transaction' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Inspection Scheduled',
    messageTemplate: 'Property inspection scheduled for {{date}}',
    icon: <ClipboardCheck className="h-4 w-4" />,
  },
  'closing-reminder': {
    type: 'reminder' as NotificationType,
    priority: 'urgent' as NotificationPriority,
    title: 'Closing Reminder',
    messageTemplate: 'Property closing is in {{daysUntil}} days',
    icon: <Key className="h-4 w-4" />,
  },

  // Payment Notifications
  'payment-due': {
    type: 'payment' as NotificationType,
    priority: 'high' as NotificationPriority,
    title: 'Payment Due',
    messageTemplate: 'Payment of {{amount}} is due in {{daysUntil}} days',
    icon: <Receipt className="h-4 w-4" />,
  },
  'payment-overdue': {
    type: 'payment' as NotificationType,
    priority: 'urgent' as NotificationPriority,
    title: 'Payment Overdue',
    messageTemplate: 'Payment of {{amount}} is {{daysOverdue}} days overdue',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  'payment-received': {
    type: 'payment' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Payment Received',
    messageTemplate: 'Payment of {{amount}} has been received',
    icon: <CheckCircle className="h-4 w-4" />,
  },

  // Market Updates
  'market-report': {
    type: 'system' as NotificationType,
    priority: 'low' as NotificationPriority,
    title: 'Market Report',
    messageTemplate: 'New market report available for {{area}}',
    icon: <BarChart className="h-4 w-4" />,
  },
  'price-alert': {
    type: 'property' as NotificationType,
    priority: 'medium' as NotificationPriority,
    title: 'Price Alert',
    messageTemplate: 'Properties in {{area}} matching your criteria are now {{trendDirection}}',
    icon: <TrendingUp className="h-4 w-4" />,
  },

  // Security & Account
  'security-alert': {
    type: 'security' as NotificationType,
    priority: 'urgent' as NotificationPriority,
    title: 'Security Alert',
    messageTemplate: 'Unusual login attempt detected from {{location}}',
    icon: <Shield className="h-4 w-4" />,
  },
  'profile-updated': {
    type: 'system' as NotificationType,
    priority: 'low' as NotificationPriority,
    title: 'Profile Updated',
    messageTemplate: 'Your profile information has been updated',
    icon: <UserCheck className="h-4 w-4" />,
  },
}

// Property Notification Builder
export class PropertyNotificationBuilder {
  static create(templateKey: keyof typeof PROPERTY_NOTIFICATION_TEMPLATES, data: Record<string, any>): Notification {
    const template = PROPERTY_NOTIFICATION_TEMPLATES[templateKey]
    const id = Math.random().toString(36).substr(2, 9)
    
    // Replace template variables
    let message = template.messageTemplate
    Object.entries(data).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })

    return {
      id,
      type: template.type,
      priority: template.priority,
      title: template.title,
      message,
      timestamp: new Date(),
      read: false,
      archived: false,
      pinned: false,
      metadata: data,
      relatedEntity: data.propertyId ? {
        type: 'property',
        id: data.propertyId,
        name: data.propertyAddress || data.propertyName || 'Property'
      } : data.investmentId ? {
        type: 'investment',
        id: data.investmentId,
        name: data.investmentName || 'Investment'
      } : undefined,
    }
  }
}

// Property Alert System
interface PropertyAlertSystemProps {
  properties: {
    id: string
    address: string
    price: number
    type: string
    status: string
  }[]
  userPreferences: {
    priceRange: { min: number; max: number }
    propertyTypes: string[]
    areas: string[]
    notifications: boolean
  }
  onAlert?: (notification: Notification) => void
  className?: string
}

export function PropertyAlertSystem({
  properties,
  userPreferences,
  onAlert,
  className,
}: PropertyAlertSystemProps) {
  const [alertsEnabled, setAlertsEnabled] = React.useState(userPreferences.notifications)
  const [alertCount, setAlertCount] = React.useState(0)

  // Simulate checking for matching properties
  React.useEffect(() => {
    if (!alertsEnabled) return

    const checkInterval = setInterval(() => {
      properties.forEach(property => {
        const matchesPrice = property.price >= userPreferences.priceRange.min && 
                           property.price <= userPreferences.priceRange.max
        const matchesType = userPreferences.propertyTypes.includes(property.type)
        
        if (matchesPrice && matchesType && Math.random() > 0.95) {
          const notification = PropertyNotificationBuilder.create('property-listed', {
            propertyId: property.id,
            propertyAddress: property.address,
            price: formatCurrency(property.price),
          })
          
          onAlert?.(notification)
          setAlertCount(prev => prev + 1)
        }
      })
    }, 5000) // Check every 5 seconds

    return () => clearInterval(checkInterval)
  }, [alertsEnabled, properties, userPreferences, onAlert])

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Alerts</CardTitle>
            <CardDescription>
              Get notified when properties match your criteria
            </CardDescription>
          </div>
          <Switch
            checked={alertsEnabled}
            onCheckedChange={setAlertsEnabled}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Active Alerts</span>
              </div>
              <p className="text-2xl font-bold">{alertCount}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Watching</span>
              </div>
              <p className="text-2xl font-bold">{properties.length}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Matches</span>
              </div>
              <p className="text-2xl font-bold">
                {properties.filter(p => 
                  p.price >= userPreferences.priceRange.min && 
                  p.price <= userPreferences.priceRange.max
                ).length}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Alert Criteria</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Range:</span>
                <span>
                  {formatCurrency(userPreferences.priceRange.min)} - {formatCurrency(userPreferences.priceRange.max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property Types:</span>
                <span>{userPreferences.propertyTypes.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Areas:</span>
                <span>{userPreferences.areas.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Investment Notification Dashboard
interface InvestmentNotificationDashboardProps {
  investments: {
    id: string
    name: string
    type: string
    currentValue: number
    targetAmount: number
    funded: number
    expectedReturn: number
    nextPayment?: Date
    status: 'funding' | 'active' | 'completed'
  }[]
  onNotification?: (notification: Notification) => void
  className?: string
}

export function InvestmentNotificationDashboard({
  investments,
  onNotification,
  className,
}: InvestmentNotificationDashboardProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  // Generate investment notifications
  React.useEffect(() => {
    const newNotifications: Notification[] = []

    investments.forEach(investment => {
      // Funding milestones
      const fundingPercentage = (investment.funded / investment.targetAmount) * 100
      if (fundingPercentage >= 25 && fundingPercentage % 25 === 0) {
        newNotifications.push(
          PropertyNotificationBuilder.create('funding-milestone', {
            investmentId: investment.id,
            investmentName: investment.name,
            percentage: Math.round(fundingPercentage),
          })
        )
      }

      // Fully funded
      if (investment.status === 'active' && fundingPercentage >= 100) {
        newNotifications.push(
          PropertyNotificationBuilder.create('investment-complete', {
            investmentId: investment.id,
            investmentName: investment.name,
          })
        )
      }

      // Payment reminders
      if (investment.nextPayment && isAfter(investment.nextPayment, new Date())) {
        const daysUntil = Math.ceil((investment.nextPayment.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntil <= 3) {
          newNotifications.push(
            PropertyNotificationBuilder.create('dividend-payment', {
              investmentId: investment.id,
              investmentName: investment.name,
              amount: formatCurrency(investment.currentValue * (investment.expectedReturn / 100) / 12),
              daysUntil,
            })
          )
        }
      }
    })

    setNotifications(newNotifications)
    newNotifications.forEach(notification => onNotification?.(notification))
  }, [investments, onNotification])

  const activeInvestments = investments.filter(i => i.status === 'active').length
  const fundingInvestments = investments.filter(i => i.status === 'funding').length
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Investment Notifications</CardTitle>
        <CardDescription>
          Stay updated on your investment portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Investment Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Active Investments</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{activeInvestments}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">Funding</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{fundingInvestments}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-600">Total Value</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          {/* Recent Investment Activity */}
          <div>
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {investments.slice(0, 3).map(investment => (
                <div key={investment.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      investment.status === 'active' ? "bg-green-100" :
                      investment.status === 'funding' ? "bg-blue-100" :
                      "bg-gray-100"
                    )}>
                      <TrendingUp className={cn(
                        "h-4 w-4",
                        investment.status === 'active' ? "text-green-600" :
                        investment.status === 'funding' ? "text-blue-600" :
                        "text-gray-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{investment.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {investment.status === 'funding' ? 
                          `${Math.round((investment.funded / investment.targetAmount) * 100)}% funded` :
                          `${investment.expectedReturn}% expected return`
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    investment.status === 'active' ? 'success' :
                    investment.status === 'funding' ? 'default' :
                    'secondary'
                  }>
                    {investment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings Quick Access */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Investment Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified about funding milestones and dividend payments
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Transaction Notification Timeline
interface TransactionNotificationTimelineProps {
  transactions: {
    id: string
    propertyAddress: string
    type: 'purchase' | 'sale' | 'rent'
    status: 'pending' | 'active' | 'completed'
    amount: number
    closingDate?: Date
    milestones: {
      name: string
      completed: boolean
      date?: Date
      dueDate?: Date
    }[]
  }[]
  onNotification?: (notification: Notification) => void
  className?: string
}

export function TransactionNotificationTimeline({
  transactions,
  onNotification,
  className,
}: TransactionNotificationTimelineProps) {
  // Generate transaction notifications
  React.useEffect(() => {
    transactions.forEach(transaction => {
      transaction.milestones.forEach(milestone => {
        if (milestone.dueDate && !milestone.completed) {
          const daysUntil = Math.ceil((milestone.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysUntil <= 3 && daysUntil > 0) {
            const notification = PropertyNotificationBuilder.create('closing-reminder', {
              transactionId: transaction.id,
              propertyAddress: transaction.propertyAddress,
              daysUntil,
              milestone: milestone.name,
            })
            onNotification?.(notification)
          }
        }
      })
    })
  }, [transactions, onNotification])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Transaction Timeline</CardTitle>
        <CardDescription>
          Track your transaction milestones and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{transaction.propertyAddress}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {transaction.type} • {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <Badge variant={
                    transaction.status === 'completed' ? 'success' :
                    transaction.status === 'active' ? 'default' :
                    'secondary'
                  }>
                    {transaction.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {transaction.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {milestone.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : milestone.dueDate && isBefore(milestone.dueDate, new Date()) ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{milestone.name}</p>
                        {milestone.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Due: {format(milestone.dueDate, 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      {!milestone.completed && milestone.dueDate && (
                        <Badge variant={
                          isBefore(milestone.dueDate, new Date()) ? 'destructive' :
                          isBefore(milestone.dueDate, addDays(new Date(), 3)) ? 'destructive' :
                          'secondary'
                        }>
                          {isBefore(milestone.dueDate, new Date()) ? 'Overdue' :
                           isBefore(milestone.dueDate, addDays(new Date(), 3)) ? 'Due Soon' :
                           'Upcoming'
                          }
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Real-time Notification Feed
interface RealTimeNotificationFeedProps {
  maxItems?: number
  autoRefresh?: boolean
  refreshInterval?: number
  className?: string
}

export function RealTimeNotificationFeed({
  maxItems = 50,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  className,
}: RealTimeNotificationFeedProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [connected, setConnected] = React.useState(false)

  // Simulate real-time notifications
  React.useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Simulate receiving a random notification
      if (Math.random() > 0.7) {
        const templates = Object.keys(PROPERTY_NOTIFICATION_TEMPLATES) as (keyof typeof PROPERTY_NOTIFICATION_TEMPLATES)[]
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
        
        const mockData = {
          propertyAddress: `${Math.floor(Math.random() * 9999)} Main St`,
          price: formatCurrency(Math.floor(Math.random() * 1000000) + 100000),
          amount: formatCurrency(Math.floor(Math.random() * 100000) + 1000),
          date: format(addDays(new Date(), Math.floor(Math.random() * 30)), 'MMM d'),
          time: format(addHours(new Date(), Math.floor(Math.random() * 24)), 'h:mm a'),
          investmentName: `Property Fund ${Math.floor(Math.random() * 100)}`,
          percentage: Math.floor(Math.random() * 100),
          daysUntil: Math.floor(Math.random() * 30),
        }

        const notification = PropertyNotificationBuilder.create(randomTemplate, mockData)
        
        setNotifications(prev => [notification, ...prev.slice(0, maxItems - 1)])
      }
    }, refreshInterval)

    setConnected(true)

    return () => {
      clearInterval(interval)
      setConnected(false)
    }
  }, [autoRefresh, refreshInterval, maxItems])

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Feed</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              connected ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm text-muted-foreground">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Waiting for notifications...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {PROPERTY_NOTIFICATION_TEMPLATES[notification.metadata?.templateKey]?.icon || 
                     <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <Badge variant={
                        notification.priority === 'urgent' ? 'destructive' :
                        notification.priority === 'high' ? 'destructive' :
                        notification.priority === 'medium' ? 'default' :
                        'secondary'
                      } className="ml-2">
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(notification.timestamp, 'h:mm:ss a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}