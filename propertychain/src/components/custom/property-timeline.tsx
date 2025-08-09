/**
 * Property-Specific Timeline Components - PropertyChain
 * 
 * Specialized timeline functionality for real estate operations
 */

'use client'

import * as React from 'react'
import {
  Timeline,
  MilestoneTracker,
  ActivityTimeline,
  ProgressTimeline,
  GanttTimeline,
  type TimelineEvent,
  type TimelineMilestone,
} from './timeline'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Target,
  Package,
  Truck,
  Key,
  Shield,
  Award,
  Briefcase,
  MapPin,
  Camera,
  Hammer,
  PaintBucket,
  Lightbulb,
  ThermometerSun,
  Droplets,
  Zap,
  TreePine,
  Car,
  Wifi,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Eye,
  Heart,
  Star,
  Flag,
  GitBranch,
  GitCommit,
  GitMerge,
  Activity,
  BarChart,
  PieChart,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Info,
  UserCheck,
  FileSignature,
  Gavel,
  Scale,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  ClipboardCheck,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'
import {
  format,
  addDays,
  addMonths,
  differenceInDays,
  isAfter,
  isBefore,
  isPast,
  isFuture,
} from 'date-fns'

// Property development phases
export const DEVELOPMENT_PHASES = {
  planning: { label: 'Planning', icon: <FileText className="h-4 w-4" />, color: 'bg-blue-500' },
  acquisition: { label: 'Acquisition', icon: <Key className="h-4 w-4" />, color: 'bg-purple-500' },
  construction: { label: 'Construction', icon: <Hammer className="h-4 w-4" />, color: 'bg-amber-500' },
  marketing: { label: 'Marketing', icon: <TrendingUp className="h-4 w-4" />, color: 'bg-green-500' },
  sales: { label: 'Sales', icon: <DollarSign className="h-4 w-4" />, color: 'bg-indigo-500' },
  handover: { label: 'Handover', icon: <Key className="h-4 w-4" />, color: 'bg-pink-500' },
}

// Transaction stages
export const TRANSACTION_STAGES = {
  offer: { label: 'Offer Made', icon: <FileText className="h-4 w-4" /> },
  negotiation: { label: 'Negotiation', icon: <MessageSquare className="h-4 w-4" /> },
  inspection: { label: 'Inspection', icon: <Search className="h-4 w-4" /> },
  financing: { label: 'Financing', icon: <CreditCard className="h-4 w-4" /> },
  appraisal: { label: 'Appraisal', icon: <Calculator className="h-4 w-4" /> },
  closing: { label: 'Closing', icon: <FileSignature className="h-4 w-4" /> },
  complete: { label: 'Complete', icon: <CheckCircle className="h-4 w-4" /> },
}

// Investment journey stages
export const INVESTMENT_STAGES = {
  discovery: { label: 'Discovery', icon: <Search className="h-4 w-4" /> },
  evaluation: { label: 'Evaluation', icon: <BarChart className="h-4 w-4" /> },
  commitment: { label: 'Commitment', icon: <FileSignature className="h-4 w-4" /> },
  funding: { label: 'Funding', icon: <DollarSign className="h-4 w-4" /> },
  ownership: { label: 'Ownership', icon: <Award className="h-4 w-4" /> },
  returns: { label: 'Returns', icon: <TrendingUp className="h-4 w-4" /> },
  exit: { label: 'Exit', icon: <Target className="h-4 w-4" /> },
}

// Property Development Timeline Component
interface PropertyDevelopmentTimelineProps {
  propertyId: string
  phases?: {
    phase: keyof typeof DEVELOPMENT_PHASES
    status: 'completed' | 'active' | 'pending'
    startDate: Date
    endDate?: Date
    progress?: number
    milestones?: TimelineMilestone[]
    events?: TimelineEvent[]
  }[]
  onPhaseClick?: (phase: any) => void
  className?: string
}

export function PropertyDevelopmentTimeline({
  propertyId,
  phases = [],
  onPhaseClick,
  className,
}: PropertyDevelopmentTimelineProps) {
  const [selectedPhase, setSelectedPhase] = React.useState<string | null>(null)
  const [view, setView] = React.useState<'timeline' | 'gantt' | 'milestones'>('timeline')

  // Convert phases to timeline events
  const timelineEvents: TimelineEvent[] = phases.flatMap(phase => {
    const phaseConfig = DEVELOPMENT_PHASES[phase.phase]
    const mainEvent: TimelineEvent = {
      id: phase.phase,
      title: phaseConfig.label,
      description: `${phase.progress || 0}% complete`,
      date: phase.startDate,
      type: 'milestone',
      status: phase.status,
      icon: phaseConfig.icon,
      color: phaseConfig.color,
      children: phase.events,
    }
    return [mainEvent, ...(phase.events || [])]
  })

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (phases.length === 0) return 0
    const totalProgress = phases.reduce((sum, phase) => sum + (phase.progress || 0), 0)
    return Math.round(totalProgress / phases.length)
  }, [phases])

  // Get current phase
  const currentPhase = phases.find(p => p.status === 'active')

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Development Timeline</CardTitle>
            <CardDescription>
              Track development progress from planning to handover
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('timeline')}
            >
              Timeline
            </Button>
            <Button
              variant={view === 'gantt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('gantt')}
            >
              Gantt
            </Button>
            <Button
              variant={view === 'milestones' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('milestones')}
            >
              Milestones
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Overview */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-2xl font-bold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="mb-3" />
          {currentPhase && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="default">Current Phase</Badge>
              <span className="font-medium">
                {DEVELOPMENT_PHASES[currentPhase.phase].label}
              </span>
              {currentPhase.endDate && (
                <span className="text-muted-foreground">
                  • {differenceInDays(currentPhase.endDate, new Date())} days remaining
                </span>
              )}
            </div>
          )}
        </div>

        {/* Views */}
        {view === 'timeline' && (
          <Timeline
            events={timelineEvents}
            config={{
              orientation: 'vertical',
              variant: 'detailed',
              showConnectors: true,
              showDates: true,
              collapsible: true,
              animated: true,
            }}
            onEventClick={(event) => {
              setSelectedPhase(event.id)
              onPhaseClick?.(phases.find(p => p.phase === event.id))
            }}
          />
        )}

        {view === 'gantt' && phases.length > 0 && (
          <GanttTimeline
            tasks={phases.map(phase => ({
              id: phase.phase,
              name: DEVELOPMENT_PHASES[phase.phase].label,
              startDate: phase.startDate,
              endDate: phase.endDate || addMonths(phase.startDate, 3),
              progress: phase.progress || 0,
            }))}
            startDate={phases[0].startDate}
            endDate={phases[phases.length - 1].endDate || addMonths(new Date(), 12)}
          />
        )}

        {view === 'milestones' && (
          <div className="space-y-4">
            {phases.map(phase => (
              <div key={phase.phase}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  {DEVELOPMENT_PHASES[phase.phase].icon}
                  {DEVELOPMENT_PHASES[phase.phase].label}
                </h3>
                {phase.milestones && phase.milestones.length > 0 ? (
                  <MilestoneTracker
                    milestones={phase.milestones}
                    showDetails={true}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No milestones defined</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Transaction Timeline Component
interface TransactionTimelineProps {
  transactionId: string
  stages?: {
    stage: keyof typeof TRANSACTION_STAGES
    status: 'completed' | 'active' | 'pending' | 'failed'
    date: Date
    details?: string
    documents?: { name: string; url: string }[]
    assignee?: string
  }[]
  buyer?: { name: string; avatar?: string }
  seller?: { name: string; avatar?: string }
  propertyAddress?: string
  onStageClick?: (stage: any) => void
  className?: string
}

export function TransactionTimeline({
  transactionId,
  stages = [],
  buyer,
  seller,
  propertyAddress,
  onStageClick,
  className,
}: TransactionTimelineProps) {
  // Convert stages to progress timeline format
  const progressStages = Object.keys(TRANSACTION_STAGES).map(key => {
    const stage = stages.find(s => s.stage === key)
    return {
      id: key,
      name: TRANSACTION_STAGES[key as keyof typeof TRANSACTION_STAGES].label,
      status: stage?.status || 'pending' as 'completed' | 'active' | 'pending',
      progress: stage?.status === 'completed' ? 100 : stage?.status === 'active' ? 50 : 0,
    }
  })

  // Get current stage
  const currentStage = stages.find(s => s.status === 'active')

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Progress</CardTitle>
            {propertyAddress && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {propertyAddress}
              </CardDescription>
            )}
          </div>
          {(buyer || seller) && (
            <div className="flex items-center gap-4">
              {buyer && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={buyer.avatar} />
                    <AvatarFallback>{buyer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Buyer</p>
                    <p className="text-sm font-medium">{buyer.name}</p>
                  </div>
                </div>
              )}
              {seller && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={seller.avatar} />
                    <AvatarFallback>{seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Seller</p>
                    <p className="text-sm font-medium">{seller.name}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ProgressTimeline
          stages={progressStages}
          orientation="horizontal"
          showPercentage={true}
        />

        {currentStage && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Stage:</strong> {TRANSACTION_STAGES[currentStage.stage].label}
              {currentStage.details && ` - ${currentStage.details}`}
            </AlertDescription>
          </Alert>
        )}

        <Separator className="my-6" />

        <h3 className="font-semibold mb-3">Transaction Details</h3>
        <div className="space-y-3">
          {stages.map((stage) => (
            <div
              key={stage.stage}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onStageClick?.(stage)}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                stage.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                stage.status === 'active' ? 'bg-blue-500/10 text-blue-500' :
                stage.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                'bg-muted text-muted-foreground'
              )}>
                {TRANSACTION_STAGES[stage.stage].icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {TRANSACTION_STAGES[stage.stage].label}
                    </p>
                    {stage.details && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {stage.details}
                      </p>
                    )}
                  </div>
                  <Badge variant={
                    stage.status === 'completed' ? 'success' :
                    stage.status === 'active' ? 'default' :
                    stage.status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {stage.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(stage.date, 'MMM d, yyyy')}
                  </span>
                  {stage.assignee && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {stage.assignee}
                    </span>
                  )}
                  {stage.documents && stage.documents.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {stage.documents.length} document(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Investment Journey Timeline Component
interface InvestmentJourneyTimelineProps {
  investmentId: string
  journey?: {
    stage: keyof typeof INVESTMENT_STAGES
    status: 'completed' | 'active' | 'pending'
    date: Date
    amount?: number
    returns?: number
    documents?: string[]
    notes?: string
  }[]
  totalInvested?: number
  currentValue?: number
  projectedReturns?: number
  onStageClick?: (stage: any) => void
  className?: string
}

export function InvestmentJourneyTimeline({
  investmentId,
  journey = [],
  totalInvested,
  currentValue,
  projectedReturns,
  onStageClick,
  className,
}: InvestmentJourneyTimelineProps) {
  const [selectedView, setSelectedView] = React.useState<'timeline' | 'financial'>('timeline')

  // Convert journey to timeline events
  const timelineEvents: TimelineEvent[] = journey.map(stage => ({
    id: stage.stage,
    title: INVESTMENT_STAGES[stage.stage].label,
    description: stage.notes,
    date: stage.date,
    type: 'milestone',
    status: stage.status,
    icon: INVESTMENT_STAGES[stage.stage].icon,
    metadata: {
      amount: stage.amount,
      returns: stage.returns,
      documents: stage.documents,
    },
  }))

  // Calculate ROI
  const roi = totalInvested && currentValue
    ? ((currentValue - totalInvested) / totalInvested) * 100
    : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Investment Journey</CardTitle>
            <CardDescription>
              Track your investment from discovery to exit
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('timeline')}
            >
              Timeline
            </Button>
            <Button
              variant={selectedView === 'financial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('financial')}
            >
              Financial
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Investment Summary */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Invested</span>
            </div>
            <p className="text-2xl font-bold">
              {totalInvested ? formatCurrency(totalInvested) : '-'}
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current Value</span>
            </div>
            <p className="text-2xl font-bold">
              {currentValue ? formatCurrency(currentValue) : '-'}
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ROI</span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              roi > 0 ? "text-green-500" : roi < 0 ? "text-red-500" : ""
            )}>
              {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
            </p>
          </div>
        </div>

        {selectedView === 'timeline' ? (
          <Timeline
            events={timelineEvents}
            config={{
              orientation: 'vertical',
              variant: 'default',
              showConnectors: true,
              showDates: true,
              animated: true,
            }}
            onEventClick={(event) => {
              onStageClick?.(journey.find(j => j.stage === event.id))
            }}
          />
        ) : (
          <div className="space-y-4">
            {journey
              .filter(stage => stage.amount || stage.returns)
              .map(stage => (
                <div key={stage.stage} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {INVESTMENT_STAGES[stage.stage].icon}
                    <div>
                      <p className="font-medium">{INVESTMENT_STAGES[stage.stage].label}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(stage.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {stage.amount && (
                      <p className="font-semibold">
                        {formatCurrency(stage.amount)}
                      </p>
                    )}
                    {stage.returns && (
                      <p className="text-sm text-green-500">
                        +{formatCurrency(stage.returns)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Property Renovation Timeline
interface RenovationTimelineProps {
  propertyId: string
  renovations?: {
    id: string
    area: string
    type: 'kitchen' | 'bathroom' | 'bedroom' | 'living' | 'exterior' | 'systems'
    status: 'planned' | 'in-progress' | 'completed'
    startDate: Date
    endDate?: Date
    budget?: number
    spent?: number
    contractor?: string
    beforePhoto?: string
    afterPhoto?: string
  }[]
  totalBudget?: number
  totalSpent?: number
  className?: string
}

export function RenovationTimeline({
  propertyId,
  renovations = [],
  totalBudget,
  totalSpent,
  className,
}: RenovationTimelineProps) {
  const getRenovationIcon = (type: string) => {
    switch (type) {
      case 'kitchen':
        return <Lightbulb className="h-4 w-4" />
      case 'bathroom':
        return <Droplets className="h-4 w-4" />
      case 'bedroom':
        return <Home className="h-4 w-4" />
      case 'living':
        return <TreePine className="h-4 w-4" />
      case 'exterior':
        return <PaintBucket className="h-4 w-4" />
      case 'systems':
        return <ThermometerSun className="h-4 w-4" />
      default:
        return <Hammer className="h-4 w-4" />
    }
  }

  const budgetUsage = totalBudget && totalSpent
    ? (totalSpent / totalBudget) * 100
    : 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Renovation Timeline</CardTitle>
        <CardDescription>Track property improvements and upgrades</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Budget Overview */}
        {totalBudget && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Budget Usage</span>
              <span className="text-sm">
                {formatCurrency(totalSpent || 0)} / {formatCurrency(totalBudget)}
              </span>
            </div>
            <Progress value={budgetUsage} className={cn(
              budgetUsage > 100 && "bg-red-100"
            )} />
            {budgetUsage > 100 && (
              <p className="text-xs text-red-500 mt-1">
                Over budget by {formatCurrency((totalSpent || 0) - totalBudget)}
              </p>
            )}
          </div>
        )}

        {/* Renovations Timeline */}
        <div className="space-y-4">
          {renovations.map((renovation) => (
            <div key={renovation.id} className="flex gap-4">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                renovation.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                renovation.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500' :
                'bg-gray-500/10 text-gray-500'
              )}>
                {getRenovationIcon(renovation.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{renovation.area}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {renovation.type} renovation
                    </p>
                  </div>
                  <Badge variant={
                    renovation.status === 'completed' ? 'success' :
                    renovation.status === 'in-progress' ? 'default' :
                    'secondary'
                  }>
                    {renovation.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(renovation.startDate, 'MMM d')}
                    {renovation.endDate && ` - ${format(renovation.endDate, 'MMM d')}`}
                  </span>
                  {renovation.budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(renovation.spent || 0)} / {formatCurrency(renovation.budget)}
                    </span>
                  )}
                  {renovation.contractor && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {renovation.contractor}
                    </span>
                  )}
                </div>
                {(renovation.beforePhoto || renovation.afterPhoto) && (
                  <div className="flex gap-2 mt-3">
                    {renovation.beforePhoto && (
                      <Badge variant="outline">
                        <Camera className="mr-1 h-3 w-3" />
                        Before
                      </Badge>
                    )}
                    {renovation.afterPhoto && (
                      <Badge variant="outline">
                        <Camera className="mr-1 h-3 w-3" />
                        After
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Import User icon
import { User } from 'lucide-react'