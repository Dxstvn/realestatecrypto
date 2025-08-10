/**
 * Support Center Page - PropertyChain Admin
 * 
 * Main page for support ticket management and system health monitoring
 * Following UpdatedUIPlan.md Step 55.6 specifications and CLAUDE.md principles
 */

import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { TicketManagement } from '@/components/admin/support/ticket-management'
import { SystemHealthMonitor } from '@/components/admin/support/system-health'
import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import {
  Inbox, MessageSquare, Clock, AlertTriangle, CheckCircle, Users,
  Server, Activity, Shield, Zap, TrendingUp, BarChart3, Bell,
  Download, Settings, RefreshCw, Star, Timer, Gauge, HeartHandshake,
  Headphones, AlertCircle, XCircle, UserCheck, FileText, Phone, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Loading components
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

// Support metrics interface
interface SupportMetrics {
  totalTickets: number
  newTickets: number
  openTickets: number
  pendingTickets: number
  resolvedToday: number
  avgResponseTime: number
  avgResolutionTime: number
  satisfaction: number
  escalatedTickets: number
  activeAgents: number
  systemHealth: number
  uptime: number
}

// Agent performance interface
interface AgentPerformance {
  id: string
  name: string
  avatar: string
  status: 'online' | 'busy' | 'away' | 'offline'
  activeTickets: number
  resolvedToday: number
  avgResponseTime: number
  satisfaction: number
  specialization: string[]
}

export default async function SupportCenterPage() {
  // Verify admin access
  const session = await getServerSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  // Fetch support metrics (using sample data for now)
  const metrics: SupportMetrics = {
    totalTickets: 1247,
    newTickets: 23,
    openTickets: 145,
    pendingTickets: 67,
    resolvedToday: 89,
    avgResponseTime: 12, // minutes
    avgResolutionTime: 4.5, // hours
    satisfaction: 4.6,
    escalatedTickets: 8,
    activeAgents: 12,
    systemHealth: 94,
    uptime: 99.95
  }
  
  // Agent performance data
  const agents: AgentPerformance[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      status: 'online',
      activeTickets: 8,
      resolvedToday: 15,
      avgResponseTime: 8,
      satisfaction: 4.8,
      specialization: ['technical', 'billing']
    },
    {
      id: '2',
      name: 'Emily Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
      status: 'busy',
      activeTickets: 12,
      resolvedToday: 18,
      avgResponseTime: 10,
      satisfaction: 4.9,
      specialization: ['kyc', 'account']
    },
    {
      id: '3',
      name: 'Michael Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      status: 'online',
      activeTickets: 6,
      resolvedToday: 12,
      avgResponseTime: 15,
      satisfaction: 4.5,
      specialization: ['property', 'general']
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      status: 'away',
      activeTickets: 0,
      resolvedToday: 8,
      avgResponseTime: 12,
      satisfaction: 4.7,
      specialization: ['billing', 'account']
    }
  ]
  
  // Calculate insights
  const insights = {
    ticketTrend: ((metrics.newTickets - 20) / 20) * 100, // compared to yesterday
    resolutionRate: (metrics.resolvedToday / (metrics.openTickets + metrics.resolvedToday)) * 100,
    firstResponseSLA: 95, // % meeting SLA
    customerEffort: 2.3, // score out of 5
    ticketsPerAgent: Math.round((metrics.openTickets + metrics.pendingTickets) / metrics.activeAgents),
    peakHours: '2-5 PM UTC',
    commonIssues: ['KYC Verification', 'Payment Issues', 'Login Problems']
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-gray-500 mt-2">
            Manage support tickets and monitor system health
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Configure Alerts
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              New Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-purple-500" />
                <span className="text-2xl font-bold">{metrics.newTickets}</span>
              </div>
              <Badge variant={insights.ticketTrend > 0 ? 'destructive' : 'secondary'} className="text-xs">
                {insights.ticketTrend > 0 ? '+' : ''}{insights.ticketTrend.toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{metrics.openTickets}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.pendingTickets} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{metrics.avgResponseTime}m</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {insights.firstResponseSLA}% SLA
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold">{metrics.satisfaction}</span>
              <span className="text-gray-500">/5</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on {metrics.resolvedToday} reviews
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{metrics.systemHealth}%</span>
            </div>
            <Progress value={metrics.systemHealth} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{metrics.uptime}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts */}
      {metrics.escalatedTickets > 5 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{metrics.escalatedTickets} escalated tickets</strong> require immediate attention from senior support staff.
          </AlertDescription>
        </Alert>
      )}
      
      {metrics.systemHealth < 90 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            System health is below optimal levels. Check the System Health tab for detailed diagnostics.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agent Performance</CardTitle>
            <Badge variant="outline">
              {metrics.activeAgents} agents active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {agents.map(agent => (
              <div key={agent.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                      agent.status === 'online' && "bg-green-500",
                      agent.status === 'busy' && "bg-yellow-500",
                      agent.status === 'away' && "bg-gray-500",
                      agent.status === 'offline' && "bg-red-500"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{agent.status}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Active</p>
                    <p className="font-semibold">{agent.activeTickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Resolved</p>
                    <p className="font-semibold">{agent.resolvedToday}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Response</p>
                    <p className="font-semibold">{agent.avgResponseTime}m</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{agent.satisfaction}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {agent.specialization.map(spec => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="tickets" className="gap-2">
            <Headphones className="h-4 w-4" />
            Support Tickets
            {metrics.newTickets > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {metrics.newTickets}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <Server className="h-4 w-4" />
            System Health
            {metrics.systemHealth < 90 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                !
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <FileText className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>
        
        {/* Support Tickets Tab */}
        <TabsContent value="tickets">
          <Suspense fallback={<DashboardSkeleton />}>
            <TicketManagement />
          </Suspense>
        </TabsContent>
        
        {/* System Health Tab */}
        <TabsContent value="health">
          <Suspense fallback={<DashboardSkeleton />}>
            <SystemHealthMonitor />
          </Suspense>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 className="h-16 w-16 opacity-20" />
                  <p className="ml-4">Chart placeholder</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resolution Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolution Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{insights.resolutionRate.toFixed(1)}%</span>
                      <Progress value={insights.resolutionRate} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Resolution Time</span>
                    <span className="font-semibold">{metrics.avgResolutionTime}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First Contact Resolution</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Effort Score</span>
                    <span className="font-semibold">{insights.customerEffort}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.commonIssues.map((issue, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{issue}</span>
                      <Badge variant="secondary">
                        {Math.floor(20 + Math.random() * 30)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Support Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tickets per Agent</span>
                    <span className="font-semibold">{insights.ticketsPerAgent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Hours</span>
                    <span className="font-semibold">{insights.peakHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Agent Utilization</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">78%</span>
                      <Progress value={78} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Escalation Rate</span>
                    <span className="font-semibold">
                      {((metrics.escalatedTickets / metrics.totalTickets) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'How to complete KYC verification',
                    'Understanding property tokenization',
                    'Payment methods and fees',
                    'How to invest in properties',
                    'Withdrawal process explained'
                  ].map((article, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm">{article}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {Math.floor(100 + Math.random() * 500)} views
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Create New Article
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <HeartHandshake className="h-4 w-4" />
                  Manage Templates
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <UserCheck className="h-4 w-4" />
                  Agent Training
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Phone className="h-4 w-4" />
                  Call Center Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}