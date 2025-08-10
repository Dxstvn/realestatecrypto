/**
 * Timeline Components - PropertyChain
 * 
 * Comprehensive timeline with milestone tracking and progress visualization
 * Following Section 0 principles with accessibility
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  Calendar,
  User,
  Users,
  DollarSign,
  FileText,
  Home,
  Building,
  TrendingUp,
  Target,
  Flag,
  Zap,
  Activity,
  BarChart,
  MessageSquare,
  Paperclip,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Info,
  Edit,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Package,
  Truck,
  CheckSquare,
  Square,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Briefcase,
  Shield,
  Award,
  Star,
  Heart,
  Eye,
  EyeOff,
  Filter,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  ChevronLeft,
} from 'lucide-react'
import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isAfter,
  isBefore,
  isToday,
  isPast,
  isFuture,
  addDays,
  addMonths,
  parseISO,
} from 'date-fns'

// Timeline event types
export interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: Date
  type?: 'milestone' | 'task' | 'event' | 'update' | 'alert'
  status?: 'completed' | 'active' | 'pending' | 'failed' | 'cancelled'
  icon?: React.ReactNode
  color?: string
  user?: {
    name: string
    avatar?: string
    role?: string
  }
  metadata?: Record<string, any>
  attachments?: {
    name: string
    url: string
    type: string
  }[]
  children?: TimelineEvent[]
  expanded?: boolean
}

// Timeline milestone
export interface TimelineMilestone {
  id: string
  name: string
  date: Date
  progress: number
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue'
  description?: string
  tasks?: {
    id: string
    name: string
    completed: boolean
  }[]
}

// Timeline configuration
export interface TimelineConfig {
  orientation?: 'vertical' | 'horizontal'
  variant?: 'default' | 'compact' | 'detailed'
  showConnectors?: boolean
  showDates?: boolean
  showProgress?: boolean
  collapsible?: boolean
  animated?: boolean
}

// Get relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const daysDiff = differenceInDays(date, now)
  const hoursDiff = differenceInHours(date, now)
  const minutesDiff = differenceInMinutes(date, now)

  if (daysDiff === 0) {
    if (hoursDiff === 0) {
      if (minutesDiff === 0) return 'Just now'
      if (minutesDiff > 0) return `In ${minutesDiff} min`
      return `${Math.abs(minutesDiff)} min ago`
    }
    if (hoursDiff > 0) return `In ${hoursDiff}h`
    return `${Math.abs(hoursDiff)}h ago`
  }
  if (daysDiff === 1) return 'Tomorrow'
  if (daysDiff === -1) return 'Yesterday'
  if (daysDiff > 0) return `In ${daysDiff} days`
  return `${Math.abs(daysDiff)} days ago`
}

// Get status icon
const getStatusIcon = (status?: TimelineEvent['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'active':
      return <Activity className="h-4 w-4 text-blue-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-gray-500" />
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

// Get status color
const getStatusColor = (status?: TimelineEvent['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500'
    case 'active':
      return 'bg-blue-500'
    case 'failed':
      return 'bg-red-500'
    case 'cancelled':
      return 'bg-gray-500'
    default:
      return 'bg-muted-foreground'
  }
}

// Base Timeline Component
interface TimelineProps {
  events: TimelineEvent[]
  config?: TimelineConfig
  onEventClick?: (event: TimelineEvent) => void
  className?: string
  loading?: boolean
}

export function Timeline({
  events,
  config = {},
  onEventClick,
  className,
  loading = false,
}: TimelineProps) {
  const {
    orientation = 'vertical',
    variant = 'default',
    showConnectors = true,
    showDates = true,
    showProgress = false,
    collapsible = false,
    animated = true,
  } = config

  const [expandedEvents, setExpandedEvents] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (eventId: string) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (orientation === 'horizontal') {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <div className="flex items-center gap-4 pb-4">
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              <div className="flex flex-col items-center min-w-[150px]">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2',
                    getStatusColor(event.status),
                    'border-background'
                  )}
                >
                  {event.icon || getStatusIcon(event.status)}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{event.title}</p>
                  {showDates && (
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, 'MMM d')}
                    </p>
                  )}
                </div>
              </div>
              {showConnectors && index < events.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {showConnectors && (
        <div className="absolute left-5 top-5 bottom-5 w-px bg-border" />
      )}
      
      <div className="space-y-4">
        {events.map((event, index) => {
          const isExpanded = expandedEvents.has(event.id)
          const hasChildren = event.children && event.children.length > 0

          return (
            <div
              key={event.id}
              className={cn(
                'relative flex gap-4',
                animated && 'transition-all duration-200'
              )}
            >
              {/* Timeline node */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-4 border-background',
                    event.color || getStatusColor(event.status),
                    'transition-transform',
                    animated && 'hover:scale-110'
                  )}
                  onClick={() => onEventClick?.(event)}
                  role="button"
                  tabIndex={0}
                >
                  {event.icon || getStatusIcon(event.status)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                {variant === 'detailed' ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {event.title}
                            {event.status && (
                              <Badge variant={
                                event.status === 'completed' ? 'outline' :
                                event.status === 'active' ? 'default' :
                                event.status === 'failed' ? 'destructive' :
                                'secondary'
                              } className={event.status === 'completed' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                                {event.status}
                              </Badge>
                            )}
                          </CardTitle>
                          {event.description && (
                            <CardDescription className="mt-1">
                              {event.description}
                            </CardDescription>
                          )}
                        </div>
                        {collapsible && hasChildren && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(event.id)}
                          >
                            {isExpanded ? <ChevronDown /> : <ChevronRight />}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {showDates && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(event.date, 'MMM d, yyyy')}
                          </span>
                        )}
                        {event.user && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.user.name}
                          </span>
                        )}
                      </div>
                      
                      {event.attachments && event.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.attachments.map((attachment) => (
                            <Badge key={attachment.name} variant="outline">
                              <Paperclip className="mr-1 h-3 w-3" />
                              {attachment.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {hasChildren && isExpanded && (
                        <div className="mt-4 ml-4 space-y-2 border-l-2 pl-4">
                          {event.children!.map((child) => (
                            <div key={child.id} className="flex items-center gap-2">
                              {getStatusIcon(child.status)}
                              <span className="text-sm">{child.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : variant === 'compact' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{event.title}</span>
                    {showDates && (
                      <span className="text-xs text-muted-foreground">
                        • {getRelativeTime(event.date)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {event.title}
                          {event.type === 'milestone' && (
                            <Flag className="h-3 w-3 text-primary" />
                          )}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                      {collapsible && hasChildren && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpanded(event.id)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {showDates && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getRelativeTime(event.date)}
                        </span>
                      )}
                      {event.user && (
                        <span className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={event.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {event.user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {event.user.name}
                        </span>
                      )}
                    </div>

                    {hasChildren && isExpanded && (
                      <div className="mt-3 ml-4 space-y-2 border-l-2 pl-4">
                        {event.children!.map((child) => (
                          <div key={child.id} className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {getStatusIcon(child.status)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{child.title}</p>
                              {child.description && (
                                <p className="text-xs text-muted-foreground">{child.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Milestone Tracker Component
interface MilestoneTrackerProps {
  milestones: TimelineMilestone[]
  currentMilestone?: string
  onMilestoneClick?: (milestone: TimelineMilestone) => void
  showDetails?: boolean
  className?: string
}

export function MilestoneTracker({
  milestones,
  currentMilestone,
  onMilestoneClick,
  showDetails = true,
  className,
}: MilestoneTrackerProps) {
  const overallProgress = React.useMemo(() => {
    const completed = milestones.filter(m => m.status === 'completed').length
    return (completed / milestones.length) * 100
  }, [milestones])

  const getStatusBadge = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>
      case 'in-progress':
        return <Badge>In Progress</Badge>
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
    }
  }

  const getStatusIcon = (status: TimelineMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Activity className="h-5 w-5 text-blue-500" />
      case 'upcoming':
        return <Clock className="h-5 w-5 text-muted-foreground" />
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Milestone Progress</CardTitle>
          <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const isActive = milestone.id === currentMilestone
            const isCompleted = milestone.status === 'completed'
            
            return (
              <div
                key={milestone.id}
                className={cn(
                  'relative flex gap-4 cursor-pointer transition-colors',
                  isActive && 'bg-accent/50 -mx-4 px-4 py-2 rounded-lg'
                )}
                onClick={() => onMilestoneClick?.(milestone)}
              >
                {/* Connector line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
                )}
                
                {/* Milestone icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(milestone.status)}
                </div>
                
                {/* Milestone content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{milestone.name}</h4>
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(milestone.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(milestone.date, 'MMM d, yyyy')}
                    </span>
                    {milestone.progress > 0 && (
                      <span className="flex items-center gap-1">
                        <BarChart className="h-3 w-3" />
                        {milestone.progress}%
                      </span>
                    )}
                  </div>
                  
                  {showDetails && milestone.tasks && milestone.tasks.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {milestone.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-sm">
                          {task.completed ? (
                            <CheckSquare className="h-3 w-3 text-green-500" />
                          ) : (
                            <Square className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={cn(
                            task.completed && 'line-through text-muted-foreground'
                          )}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Activity Timeline Component
interface ActivityTimelineProps {
  activities: {
    id: string
    action: string
    user: {
      name: string
      avatar?: string
    }
    timestamp: Date
    details?: string
    type?: 'comment' | 'update' | 'create' | 'delete' | 'system'
  }[]
  maxItems?: number
  className?: string
}

export function ActivityTimeline({
  activities,
  maxItems = 10,
  className,
}: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, maxItems)

  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4" />
      case 'update':
        return <Edit className="h-4 w-4" />
      case 'create':
        return <Plus className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'system':
        return <Zap className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {displayActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>
                        {' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.details}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Progress Timeline Component
interface ProgressTimelineProps {
  stages: {
    id: string
    name: string
    status: 'completed' | 'active' | 'pending'
    progress?: number
    startDate?: Date
    endDate?: Date
  }[]
  orientation?: 'horizontal' | 'vertical'
  showPercentage?: boolean
  className?: string
}

export function ProgressTimeline({
  stages,
  orientation = 'horizontal',
  showPercentage = true,
  className,
}: ProgressTimelineProps) {
  const overallProgress = React.useMemo(() => {
    const weights = stages.map((_, index) => 100 / stages.length)
    let progress = 0
    
    stages.forEach((stage, index) => {
      if (stage.status === 'completed') {
        progress += weights[index]
      } else if (stage.status === 'active' && stage.progress) {
        progress += (weights[index] * stage.progress) / 100
      }
    })
    
    return Math.round(progress)
  }, [stages])

  if (orientation === 'vertical') {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progress</CardTitle>
            {showPercentage && (
              <span className="text-2xl font-bold">{overallProgress}%</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-4">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  stage.status === 'completed' ? 'bg-green-500 text-white' :
                  stage.status === 'active' ? 'bg-blue-500 text-white' :
                  'bg-muted text-muted-foreground'
                )}>
                  {stage.status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{stage.name}</p>
                    {stage.status === 'active' && stage.progress && (
                      <span className="text-xs text-muted-foreground">
                        {stage.progress}%
                      </span>
                    )}
                  </div>
                  {stage.status === 'active' && (
                    <Progress value={stage.progress || 0} className="mt-1 h-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" />
          
          {/* Progress bar fill */}
          <div 
            className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
          
          {/* Stage indicators */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => (
              <TooltipProvider key={stage.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-background',
                        stage.status === 'completed' ? 'bg-green-500' :
                        stage.status === 'active' ? 'bg-blue-500' :
                        'bg-muted'
                      )}>
                        {stage.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : stage.status === 'active' ? (
                          <Activity className="h-4 w-4 text-white" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="mt-2 text-xs text-center max-w-[80px]">
                        {stage.name}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{stage.name}</p>
                      {stage.status === 'active' && stage.progress && (
                        <p className="text-xs">Progress: {stage.progress}%</p>
                      )}
                      {stage.startDate && (
                        <p className="text-xs">Started: {format(stage.startDate, 'MMM d')}</p>
                      )}
                      {stage.endDate && (
                        <p className="text-xs">Target: {format(stage.endDate, 'MMM d')}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        
        {showPercentage && (
          <div className="mt-6 text-center">
            <p className="text-3xl font-bold">{overallProgress}%</p>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Gantt Timeline Component (simplified)
interface GanttTimelineProps {
  tasks: {
    id: string
    name: string
    startDate: Date
    endDate: Date
    progress: number
    assignee?: string
    dependencies?: string[]
  }[]
  startDate: Date
  endDate: Date
  className?: string
}

export function GanttTimeline({
  tasks,
  startDate,
  endDate,
  className,
}: GanttTimelineProps) {
  const totalDays = differenceInDays(endDate, startDate)
  
  const getTaskPosition = (taskStart: Date, taskEnd: Date) => {
    const startOffset = differenceInDays(taskStart, startDate)
    const duration = differenceInDays(taskEnd, taskStart)
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const position = getTaskPosition(task.startDate, task.endDate)
            
            return (
              <div key={task.id} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium truncate">
                  {task.name}
                </div>
                <div className="flex-1 relative h-8 bg-muted rounded">
                  <div
                    className="absolute top-0 h-full bg-primary/20 rounded"
                    style={position}
                  >
                    <div
                      className="h-full bg-primary rounded transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-xs text-right">
                  {task.progress}%
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Import for Check icon
import { Check } from 'lucide-react'