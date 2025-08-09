/**
 * Timeline Test Page - PropertyChain
 * Tests all timeline components and features
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Timeline,
  MilestoneTracker,
  ActivityTimeline,
  ProgressTimeline,
  GanttTimeline,
  type TimelineEvent,
  type TimelineMilestone,
} from '@/components/custom/timeline'
import {
  PropertyDevelopmentTimeline,
  TransactionTimeline,
  InvestmentJourneyTimeline,
  RenovationTimeline,
  DEVELOPMENT_PHASES,
  TRANSACTION_STAGES,
  INVESTMENT_STAGES,
} from '@/components/custom/property-timeline'
import {
  Clock,
  Calendar,
  CheckCircle,
  Circle,
  Activity,
  AlertCircle,
  Home,
  Building,
  DollarSign,
  TrendingUp,
  Target,
  Flag,
  Users,
  FileText,
  Hammer,
  Key,
  Shield,
  Award,
  MessageSquare,
  Edit,
  Plus,
  Trash2,
  GitBranch,
  GitCommit,
  GitMerge,
  Info,
  Zap,
  BarChart,
  PieChart,
  Package,
  Truck,
  UserCheck,
  FileSignature,
  Search,
  Calculator,
  CreditCard,
} from 'lucide-react'
import { addDays, addMonths, subDays } from 'date-fns'
import { toastSuccess, toastInfo } from '@/lib/toast'

// Mock timeline events
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Property Listed',
    description: 'Property added to marketplace',
    date: subDays(new Date(), 30),
    type: 'milestone',
    status: 'completed',
    icon: <Home className="h-4 w-4 text-white" />,
    color: 'bg-green-500',
    user: {
      name: 'John Smith',
      role: 'Listing Agent',
    },
  },
  {
    id: '2',
    title: 'First Viewing Scheduled',
    description: '5 viewings booked in first week',
    date: subDays(new Date(), 25),
    type: 'event',
    status: 'completed',
    icon: <Users className="h-4 w-4 text-white" />,
    color: 'bg-blue-500',
  },
  {
    id: '3',
    title: 'Offer Received',
    description: 'Multiple offers above asking price',
    date: subDays(new Date(), 20),
    type: 'milestone',
    status: 'completed',
    icon: <FileText className="h-4 w-4 text-white" />,
    color: 'bg-purple-500',
    children: [
      {
        id: '3.1',
        title: 'Offer #1: $550,000',
        date: subDays(new Date(), 20),
        status: 'completed',
      },
      {
        id: '3.2',
        title: 'Offer #2: $565,000',
        date: subDays(new Date(), 19),
        status: 'completed',
      },
      {
        id: '3.3',
        title: 'Offer #3: $570,000',
        date: subDays(new Date(), 18),
        status: 'completed',
      },
    ],
  },
  {
    id: '4',
    title: 'Inspection Scheduled',
    description: 'Professional inspection booked',
    date: subDays(new Date(), 10),
    type: 'task',
    status: 'completed',
    icon: <Search className="h-4 w-4 text-white" />,
    color: 'bg-amber-500',
  },
  {
    id: '5',
    title: 'Financing Approved',
    description: 'Buyer\'s mortgage approved',
    date: subDays(new Date(), 5),
    type: 'milestone',
    status: 'active',
    icon: <CreditCard className="h-4 w-4 text-white" />,
    color: 'bg-indigo-500',
  },
  {
    id: '6',
    title: 'Closing Date Set',
    description: 'Scheduled for next month',
    date: addDays(new Date(), 20),
    type: 'milestone',
    status: 'pending',
    icon: <Calendar className="h-4 w-4 text-white" />,
    color: 'bg-gray-500',
  },
]

// Mock milestones
const mockMilestones: TimelineMilestone[] = [
  {
    id: '1',
    name: 'Project Initiation',
    date: subDays(new Date(), 60),
    progress: 100,
    status: 'completed',
    description: 'Project kickoff and planning',
    tasks: [
      { id: '1.1', name: 'Define requirements', completed: true },
      { id: '1.2', name: 'Assemble team', completed: true },
      { id: '1.3', name: 'Create timeline', completed: true },
    ],
  },
  {
    id: '2',
    name: 'Design Phase',
    date: subDays(new Date(), 30),
    progress: 100,
    status: 'completed',
    description: 'Architectural and interior design',
    tasks: [
      { id: '2.1', name: 'Concept design', completed: true },
      { id: '2.2', name: 'Detailed drawings', completed: true },
      { id: '2.3', name: 'Client approval', completed: true },
    ],
  },
  {
    id: '3',
    name: 'Permitting',
    date: new Date(),
    progress: 60,
    status: 'in-progress',
    description: 'Obtain necessary permits',
    tasks: [
      { id: '3.1', name: 'Building permit', completed: true },
      { id: '3.2', name: 'Electrical permit', completed: true },
      { id: '3.3', name: 'Plumbing permit', completed: false },
    ],
  },
  {
    id: '4',
    name: 'Construction',
    date: addDays(new Date(), 30),
    progress: 0,
    status: 'upcoming',
    description: 'Main construction phase',
    tasks: [
      { id: '4.1', name: 'Foundation', completed: false },
      { id: '4.2', name: 'Framing', completed: false },
      { id: '4.3', name: 'Finishing', completed: false },
    ],
  },
  {
    id: '5',
    name: 'Final Inspection',
    date: addDays(new Date(), 90),
    progress: 0,
    status: 'upcoming',
    description: 'Final walkthrough and handover',
  },
]

// Mock activities
const mockActivities = [
  {
    id: '1',
    action: 'updated property listing',
    user: { name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    timestamp: subDays(new Date(), 0.1),
    details: 'Added 5 new photos',
    type: 'update' as const,
  },
  {
    id: '2',
    action: 'commented on inspection report',
    user: { name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    timestamp: subDays(new Date(), 0.5),
    details: 'All issues have been addressed',
    type: 'comment' as const,
  },
  {
    id: '3',
    action: 'created new task',
    user: { name: 'Emily Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
    timestamp: subDays(new Date(), 1),
    details: 'Schedule final walkthrough',
    type: 'create' as const,
  },
  {
    id: '4',
    action: 'uploaded document',
    user: { name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    timestamp: subDays(new Date(), 2),
    details: 'Purchase agreement v2.pdf',
    type: 'system' as const,
  },
  {
    id: '5',
    action: 'changed status',
    user: { name: 'System', avatar: '' },
    timestamp: subDays(new Date(), 3),
    details: 'Inspection completed',
    type: 'system' as const,
  },
]

// Mock progress stages
const mockProgressStages = [
  {
    id: '1',
    name: 'Discovery',
    status: 'completed' as const,
    progress: 100,
  },
  {
    id: '2',
    name: 'Evaluation',
    status: 'completed' as const,
    progress: 100,
  },
  {
    id: '3',
    name: 'Negotiation',
    status: 'active' as const,
    progress: 60,
  },
  {
    id: '4',
    name: 'Documentation',
    status: 'pending' as const,
    progress: 0,
  },
  {
    id: '5',
    name: 'Closing',
    status: 'pending' as const,
    progress: 0,
  },
]

// Mock Gantt tasks
const mockGanttTasks = [
  {
    id: '1',
    name: 'Site Preparation',
    startDate: new Date(),
    endDate: addDays(new Date(), 14),
    progress: 75,
    assignee: 'Construction Team A',
  },
  {
    id: '2',
    name: 'Foundation',
    startDate: addDays(new Date(), 10),
    endDate: addDays(new Date(), 30),
    progress: 30,
    assignee: 'Construction Team B',
  },
  {
    id: '3',
    name: 'Framing',
    startDate: addDays(new Date(), 25),
    endDate: addDays(new Date(), 50),
    progress: 0,
    assignee: 'Construction Team A',
  },
  {
    id: '4',
    name: 'Electrical & Plumbing',
    startDate: addDays(new Date(), 45),
    endDate: addDays(new Date(), 65),
    progress: 0,
    assignee: 'Specialists',
  },
  {
    id: '5',
    name: 'Interior Finishing',
    startDate: addDays(new Date(), 60),
    endDate: addDays(new Date(), 90),
    progress: 0,
    assignee: 'Finishing Team',
  },
]

// Mock property development phases
const mockDevelopmentPhases = [
  {
    phase: 'planning' as const,
    status: 'completed' as const,
    startDate: subDays(new Date(), 180),
    endDate: subDays(new Date(), 150),
    progress: 100,
    milestones: [
      {
        id: 'p1',
        name: 'Feasibility Study',
        date: subDays(new Date(), 175),
        progress: 100,
        status: 'completed' as const,
      },
      {
        id: 'p2',
        name: 'Design Approval',
        date: subDays(new Date(), 160),
        progress: 100,
        status: 'completed' as const,
      },
    ],
  },
  {
    phase: 'acquisition' as const,
    status: 'completed' as const,
    startDate: subDays(new Date(), 150),
    endDate: subDays(new Date(), 120),
    progress: 100,
  },
  {
    phase: 'construction' as const,
    status: 'active' as const,
    startDate: subDays(new Date(), 120),
    endDate: addDays(new Date(), 60),
    progress: 45,
  },
  {
    phase: 'marketing' as const,
    status: 'pending' as const,
    startDate: addDays(new Date(), 30),
    endDate: addDays(new Date(), 90),
    progress: 0,
  },
  {
    phase: 'sales' as const,
    status: 'pending' as const,
    startDate: addDays(new Date(), 60),
    endDate: addDays(new Date(), 150),
    progress: 0,
  },
]

// Mock transaction stages
const mockTransactionStages = [
  {
    stage: 'offer' as const,
    status: 'completed' as const,
    date: subDays(new Date(), 20),
    details: 'Offer of $575,000 accepted',
    documents: [
      { name: 'Offer Letter.pdf', url: '#' },
      { name: 'Pre-approval.pdf', url: '#' },
    ],
    assignee: 'John Smith',
  },
  {
    stage: 'inspection' as const,
    status: 'completed' as const,
    date: subDays(new Date(), 10),
    details: 'Minor issues identified',
    documents: [
      { name: 'Inspection Report.pdf', url: '#' },
    ],
    assignee: 'Inspector Pro',
  },
  {
    stage: 'financing' as const,
    status: 'active' as const,
    date: new Date(),
    details: 'Awaiting final approval',
    assignee: 'Bank of America',
  },
  {
    stage: 'closing' as const,
    status: 'pending' as const,
    date: addDays(new Date(), 20),
    details: 'Scheduled for closing',
    assignee: 'Title Company',
  },
]

// Mock investment journey
const mockInvestmentJourney = [
  {
    stage: 'discovery' as const,
    status: 'completed' as const,
    date: subDays(new Date(), 90),
    notes: 'Found property through PropertyChain platform',
  },
  {
    stage: 'evaluation' as const,
    status: 'completed' as const,
    date: subDays(new Date(), 75),
    notes: 'Analyzed financials and market comparables',
  },
  {
    stage: 'commitment' as const,
    status: 'completed' as const,
    date: subDays(new Date(), 60),
    amount: 50000,
    notes: 'Committed to investment',
  },
  {
    stage: 'funding' as const,
    status: 'completed' as const,
    date: subDays(new Date(), 45),
    amount: 50000,
    notes: 'Funds transferred',
  },
  {
    stage: 'ownership' as const,
    status: 'active' as const,
    date: subDays(new Date(), 30),
    notes: 'Receiving monthly distributions',
  },
  {
    stage: 'returns' as const,
    status: 'active' as const,
    date: new Date(),
    returns: 2500,
    notes: 'Q1 distribution received',
  },
]

// Mock renovations
const mockRenovations = [
  {
    id: '1',
    area: 'Master Kitchen',
    type: 'kitchen' as const,
    status: 'completed' as const,
    startDate: subDays(new Date(), 60),
    endDate: subDays(new Date(), 30),
    budget: 25000,
    spent: 23500,
    contractor: 'Premium Kitchens Inc',
    beforePhoto: '#',
    afterPhoto: '#',
  },
  {
    id: '2',
    area: 'Main Bathroom',
    type: 'bathroom' as const,
    status: 'completed' as const,
    startDate: subDays(new Date(), 30),
    endDate: subDays(new Date(), 10),
    budget: 15000,
    spent: 16200,
    contractor: 'Luxury Bath Co',
  },
  {
    id: '3',
    area: 'HVAC System',
    type: 'systems' as const,
    status: 'in-progress' as const,
    startDate: subDays(new Date(), 5),
    budget: 8000,
    spent: 3000,
    contractor: 'Cool Air Services',
  },
  {
    id: '4',
    area: 'Exterior Paint',
    type: 'exterior' as const,
    status: 'planned' as const,
    startDate: addDays(new Date(), 10),
    budget: 5000,
    contractor: 'Pro Painters',
  },
]

export default function TestTimelinePage() {
  const [timelineConfig, setTimelineConfig] = useState({
    orientation: 'vertical' as const,
    variant: 'default' as const,
    showConnectors: true,
    showDates: true,
    collapsible: true,
    animated: true,
  })

  const handleEventClick = (event: TimelineEvent) => {
    toastInfo(`Event clicked: ${event.title}`)
  }

  const handleMilestoneClick = (milestone: TimelineMilestone) => {
    toastInfo(`Milestone: ${milestone.name} - ${milestone.progress}% complete`)
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Timeline Test</h1>
        <p className="text-muted-foreground">
          Testing timeline components with milestone tracking and progress visualization
        </p>
      </div>

      {/* Timeline Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Timeline Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{mockTimelineEvents.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">
                {mockMilestones.filter(m => m.status === 'in-progress').length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {mockMilestones.filter(m => m.status === 'completed').length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">52%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="transaction">Transaction</TabsTrigger>
          <TabsTrigger value="investment">Investment</TabsTrigger>
        </TabsList>

        {/* Basic Timeline Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Timeline Configuration</CardTitle>
                  <CardDescription>Test different timeline configurations</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={timelineConfig.variant === 'default' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimelineConfig({ ...timelineConfig, variant: 'default' })}
                  >
                    Default
                  </Button>
                  <Button
                    variant={timelineConfig.variant === 'compact' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimelineConfig({ ...timelineConfig, variant: 'compact' })}
                  >
                    Compact
                  </Button>
                  <Button
                    variant={timelineConfig.variant === 'detailed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimelineConfig({ ...timelineConfig, variant: 'detailed' })}
                  >
                    Detailed
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Timeline
                events={mockTimelineEvents}
                config={timelineConfig}
                onEventClick={handleEventClick}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <ActivityTimeline
              activities={mockActivities}
              maxItems={5}
            />

            <Card>
              <CardHeader>
                <CardTitle>Horizontal Timeline</CardTitle>
                <CardDescription>Compact horizontal view</CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline
                  events={mockTimelineEvents.slice(0, 4)}
                  config={{
                    orientation: 'horizontal',
                    showDates: true,
                  }}
                  onEventClick={handleEventClick}
                />
              </CardContent>
            </Card>
          </div>

          <ProgressTimeline
            stages={mockProgressStages}
            orientation="horizontal"
            showPercentage={true}
          />
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-6">
          <MilestoneTracker
            milestones={mockMilestones}
            currentMilestone="3"
            onMilestoneClick={handleMilestoneClick}
            showDetails={true}
          />

          <GanttTimeline
            tasks={mockGanttTasks}
            startDate={new Date()}
            endDate={addDays(new Date(), 90)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Vertical Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressTimeline
                stages={mockProgressStages}
                orientation="vertical"
                showPercentage={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Tab */}
        <TabsContent value="property" className="space-y-6">
          <PropertyDevelopmentTimeline
            propertyId="prop-123"
            phases={mockDevelopmentPhases}
            onPhaseClick={(phase) => toastInfo(`Phase: ${phase.phase}`)}
          />

          <RenovationTimeline
            propertyId="prop-456"
            renovations={mockRenovations}
            totalBudget={53000}
            totalSpent={42700}
          />
        </TabsContent>

        {/* Transaction Tab */}
        <TabsContent value="transaction" className="space-y-6">
          <TransactionTimeline
            transactionId="trans-001"
            stages={mockTransactionStages}
            buyer={{ name: 'Michael Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' }}
            seller={{ name: 'Sarah Williams', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }}
            propertyAddress="123 Oak Street, Portland, OR 97201"
            onStageClick={(stage) => toastInfo(`Stage: ${stage.stage}`)}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The transaction timeline tracks all stages from offer to closing, 
              showing current status, documents, and assigned parties.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Investment Tab */}
        <TabsContent value="investment" className="space-y-6">
          <InvestmentJourneyTimeline
            investmentId="inv-001"
            journey={mockInvestmentJourney}
            totalInvested={50000}
            currentValue={52500}
            projectedReturns={15000}
            onStageClick={(stage) => toastInfo(`Investment stage: ${stage.stage}`)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Investment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">$50,000</p>
                  <p className="text-sm text-muted-foreground">Initial Investment</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">+5.0%</p>
                  <p className="text-sm text-muted-foreground">Current ROI</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">$15,000</p>
                  <p className="text-sm text-muted-foreground">Projected Returns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Timeline Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Vertical & horizontal layouts</li>
                <li>✅ Multiple view variants</li>
                <li>✅ Milestone tracking</li>
                <li>✅ Progress visualization</li>
                <li>✅ Activity timeline</li>
                <li>✅ Gantt chart view</li>
                <li>✅ Collapsible events</li>
                <li>✅ Animated transitions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Property Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Development phases</li>
                <li>✅ Transaction tracking</li>
                <li>✅ Investment journey</li>
                <li>✅ Renovation timeline</li>
                <li>✅ Budget tracking</li>
                <li>✅ Document attachments</li>
                <li>✅ Team assignments</li>
                <li>✅ Status indicators</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Real-time updates</li>
                <li>✅ User avatars</li>
                <li>✅ Relative timestamps</li>
                <li>✅ Nested events</li>
                <li>✅ Custom icons & colors</li>
                <li>✅ Financial metrics</li>
                <li>✅ Before/after photos</li>
                <li>✅ Contractor management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}