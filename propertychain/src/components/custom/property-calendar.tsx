/**
 * Property-Specific Calendar Components - PropertyChain
 * 
 * Specialized calendar functionality for real estate operations
 */

'use client'

import * as React from 'react'
import { 
  Calendar, 
  CalendarEvent, 
  DatePicker, 
  DateRangePicker,
  MiniCalendar,
} from './calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils/cn'
import { formatDate, formatCurrency } from '@/lib/format'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  Home,
  Eye,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Bell,
  Plus,
  Edit,
  Trash2,
  Video,
  Phone,
  Mail,
  Building,
  Briefcase,
  TrendingUp,
  Target,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Timer,
  Flag,
  Banknote,
  ClipboardCheck,
  Key,
  Camera,
  Shield,
  UserCheck,
  FileSignature,
} from 'lucide-react'
import {
  format,
  addDays,
  addMonths,
  isBefore,
  isAfter,
  isSameDay,
  differenceInDays,
  parseISO,
} from 'date-fns'

// Property viewing specific event type
export interface PropertyViewingEvent extends CalendarEvent {
  propertyId: string
  propertyAddress: string
  viewerName: string
  viewerEmail?: string
  viewerPhone?: string
  agentName?: string
  viewingType: 'in-person' | 'virtual' | 'self-guided'
  notes?: string
  confirmed: boolean
  reminderSent: boolean
}

// Investment timeline event
export interface InvestmentTimelineEvent extends CalendarEvent {
  investmentId: string
  propertyId: string
  milestone: 'funding_start' | 'funding_end' | 'closing' | 'first_payment' | 'maturity'
  amount?: number
  stakeholders?: string[]
  documents?: string[]
  completed: boolean
}

// Property management event
export interface PropertyManagementEvent extends CalendarEvent {
  propertyId: string
  category: 'maintenance' | 'inspection' | 'payment' | 'renewal' | 'meeting'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  cost?: number
  vendor?: string
  resolution?: string
}

// Property Viewing Calendar Component
interface PropertyViewingCalendarProps {
  propertyId?: string
  viewings?: PropertyViewingEvent[]
  onScheduleViewing?: (viewing: PropertyViewingEvent) => void
  onCancelViewing?: (viewingId: string) => void
  onRescheduleViewing?: (viewingId: string, newDate: Date) => void
  availableSlots?: Date[]
  blockedDates?: Date[]
  className?: string
}

export function PropertyViewingCalendar({
  propertyId,
  viewings = [],
  onScheduleViewing,
  onCancelViewing,
  onRescheduleViewing,
  availableSlots = [],
  blockedDates = [],
  className,
}: PropertyViewingCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false)
  const [viewingForm, setViewingForm] = React.useState({
    viewerName: '',
    viewerEmail: '',
    viewerPhone: '',
    viewingType: 'in-person' as const,
    startTime: '',
    duration: '30',
    notes: '',
  })

  const upcomingViewings = viewings
    .filter(v => isAfter(v.startDate, new Date()))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  const pastViewings = viewings
    .filter(v => isBefore(v.startDate, new Date()))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

  const handleScheduleViewing = () => {
    if (!selectedDate || !onScheduleViewing) return

    const viewing: PropertyViewingEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Property Viewing - ${viewingForm.viewerName}`,
      propertyId: propertyId || '',
      propertyAddress: '123 Main St', // Would come from property data
      viewerName: viewingForm.viewerName,
      viewerEmail: viewingForm.viewerEmail,
      viewerPhone: viewingForm.viewerPhone,
      viewingType: viewingForm.viewingType,
      startDate: selectedDate,
      startTime: viewingForm.startTime,
      endTime: `${parseInt(viewingForm.startTime) + parseInt(viewingForm.duration) / 60}:00`,
      type: 'viewing',
      status: 'scheduled',
      notes: viewingForm.notes,
      confirmed: false,
      reminderSent: false,
    }

    onScheduleViewing(viewing)
    setShowScheduleDialog(false)
    resetForm()
  }

  const resetForm = () => {
    setViewingForm({
      viewerName: '',
      viewerEmail: '',
      viewerPhone: '',
      viewingType: 'in-person',
      startTime: '',
      duration: '30',
      notes: '',
    })
  }

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => isSameDay(blocked, date))
  }

  const getViewingIcon = (type: PropertyViewingEvent['viewingType']) => {
    switch (type) {
      case 'virtual':
        return <Video className="h-4 w-4" />
      case 'self-guided':
        return <Key className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Viewing Schedule</CardTitle>
            <CardDescription>
              Manage property viewings and appointments
            </CardDescription>
          </div>
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Viewing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule Property Viewing</DialogTitle>
                <DialogDescription>
                  Book a new viewing appointment for this property
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Viewer Name *</Label>
                    <Input
                      value={viewingForm.viewerName}
                      onChange={(e) => setViewingForm({ ...viewingForm, viewerName: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label>Viewing Type</Label>
                    <Select
                      value={viewingForm.viewingType}
                      onValueChange={(value: any) => setViewingForm({ ...viewingForm, viewingType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="virtual">Virtual Tour</SelectItem>
                        <SelectItem value="self-guided">Self-Guided</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={viewingForm.viewerEmail}
                      onChange={(e) => setViewingForm({ ...viewingForm, viewerEmail: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={viewingForm.viewerPhone}
                      onChange={(e) => setViewingForm({ ...viewingForm, viewerPhone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Date</Label>
                    <DatePicker
                      date={selectedDate}
                      onDateChange={setSelectedDate}
                      placeholder="Select date"
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Select
                      value={viewingForm.startTime}
                      onValueChange={(value) => setViewingForm({ ...viewingForm, startTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 18 }, (_, i) => i + 8).map(hour => (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {format(new Date().setHours(hour, 0), 'h:mm a')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={viewingForm.notes}
                    onChange={(e) => setViewingForm({ ...viewingForm, notes: e.target.value })}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleScheduleViewing}
                  disabled={!viewingForm.viewerName || !selectedDate || !viewingForm.startTime}
                >
                  Schedule Viewing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingViewings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastViewings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-4">
            <Calendar
              events={viewings}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onEventClick={(event) => {
                // Handle event click
              }}
              view="month"
            />
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {upcomingViewings.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No upcoming viewings</p>
                  </div>
                ) : (
                  upcomingViewings.map(viewing => (
                    <div
                      key={viewing.id}
                      className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getViewingIcon(viewing.viewingType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{viewing.viewerName}</p>
                            {viewing.confirmed && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                                Confirmed
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(viewing.startDate, 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {viewing.startTime}
                            </span>
                          </div>
                          {viewing.viewerEmail && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {viewing.viewerEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Send reminder
                          }}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Edit viewing
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancelViewing?.(viewing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {pastViewings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No past viewings</p>
                  </div>
                ) : (
                  pastViewings.map(viewing => (
                    <div
                      key={viewing.id}
                      className="flex items-start justify-between p-4 rounded-lg border opacity-75"
                    >
                      <div className="flex gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {getViewingIcon(viewing.viewingType)}
                        </div>
                        <div>
                          <p className="font-medium">{viewing.viewerName}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>{format(viewing.startDate, 'MMM d, yyyy')}</span>
                            <span>{viewing.startTime}</span>
                          </div>
                          {viewing.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {viewing.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Investment Timeline Calendar Component
interface InvestmentTimelineCalendarProps {
  investments?: InvestmentTimelineEvent[]
  onAddMilestone?: (milestone: InvestmentTimelineEvent) => void
  onUpdateMilestone?: (milestoneId: string, updates: Partial<InvestmentTimelineEvent>) => void
  className?: string
}

export function InvestmentTimelineCalendar({
  investments = [],
  onAddMilestone,
  onUpdateMilestone,
  className,
}: InvestmentTimelineCalendarProps) {
  const [selectedInvestment, setSelectedInvestment] = React.useState<string>('')
  const [view, setView] = React.useState<'timeline' | 'calendar'>('timeline')

  const upcomingMilestones = investments
    .filter(m => !m.completed && isAfter(m.startDate, new Date()))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  const getMilestoneIcon = (milestone: InvestmentTimelineEvent['milestone']) => {
    switch (milestone) {
      case 'funding_start':
        return <TrendingUp className="h-4 w-4" />
      case 'funding_end':
        return <Target className="h-4 w-4" />
      case 'closing':
        return <Key className="h-4 w-4" />
      case 'first_payment':
        return <Banknote className="h-4 w-4" />
      case 'maturity':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Flag className="h-4 w-4" />
    }
  }

  const getMilestoneLabel = (milestone: InvestmentTimelineEvent['milestone']) => {
    switch (milestone) {
      case 'funding_start':
        return 'Funding Opens'
      case 'funding_end':
        return 'Funding Closes'
      case 'closing':
        return 'Property Closing'
      case 'first_payment':
        return 'First Payment'
      case 'maturity':
        return 'Investment Maturity'
      default:
        return 'Milestone'
    }
  }

  const getMilestoneColor = (milestone: InvestmentTimelineEvent['milestone']) => {
    switch (milestone) {
      case 'funding_start':
        return 'bg-blue-500'
      case 'funding_end':
        return 'bg-purple-500'
      case 'closing':
        return 'bg-green-500'
      case 'first_payment':
        return 'bg-amber-500'
      case 'maturity':
        return 'bg-indigo-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Investment Timeline</CardTitle>
            <CardDescription>
              Track investment milestones and important dates
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
              variant={view === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('calendar')}
            >
              Calendar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'timeline' ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            
            {/* Timeline items */}
            <div className="space-y-6">
              {investments.map((milestone, index) => {
                const daysUntil = differenceInDays(milestone.startDate, new Date())
                const isPast = isBefore(milestone.startDate, new Date())
                
                return (
                  <div key={milestone.id} className="flex gap-4">
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background",
                        getMilestoneColor(milestone.milestone),
                        milestone.completed && "opacity-50"
                      )}
                    >
                      {getMilestoneIcon(milestone.milestone)}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {getMilestoneLabel(milestone.milestone)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {milestone.title}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(milestone.startDate, 'MMM d, yyyy')}
                            </span>
                            {milestone.amount && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {formatCurrency(milestone.amount)}
                              </span>
                            )}
                            {!isPast && !milestone.completed && (
                              <Badge variant="outline">
                                {daysUntil === 0 ? 'Today' :
                                 daysUntil === 1 ? 'Tomorrow' :
                                 daysUntil > 0 ? `In ${daysUntil} days` :
                                 `${Math.abs(daysUntil)} days ago`}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {milestone.completed ? (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        ) : isPast ? (
                          <Badge variant="destructive">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </div>
                      
                      {milestone.stakeholders && milestone.stakeholders.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {milestone.stakeholders.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {milestone.documents && milestone.documents.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {milestone.documents.length} document(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <Calendar
            events={investments}
            view="month"
            onEventClick={(event) => {
              // Handle milestone click
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Property Management Calendar Component
interface PropertyManagementCalendarProps {
  events?: PropertyManagementEvent[]
  properties?: { id: string; name: string; address: string }[]
  onAddEvent?: (event: PropertyManagementEvent) => void
  onUpdateEvent?: (eventId: string, updates: Partial<PropertyManagementEvent>) => void
  className?: string
}

export function PropertyManagementCalendar({
  events = [],
  properties = [],
  onAddEvent,
  onUpdateEvent,
  className,
}: PropertyManagementCalendarProps) {
  const [selectedProperty, setSelectedProperty] = React.useState<string>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const filteredEvents = events.filter(event => {
    const matchesProperty = selectedProperty === 'all' || event.propertyId === selectedProperty
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesProperty && matchesCategory
  })

  const getCategoryIcon = (category: PropertyManagementEvent['category']) => {
    switch (category) {
      case 'maintenance':
        return <Shield className="h-4 w-4" />
      case 'inspection':
        return <ClipboardCheck className="h-4 w-4" />
      case 'payment':
        return <DollarSign className="h-4 w-4" />
      case 'renewal':
        return <FileSignature className="h-4 w-4" />
      case 'meeting':
        return <Users className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: PropertyManagementEvent['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500'
      case 'high':
        return 'text-orange-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Management Calendar</CardTitle>
            <CardDescription>
              Schedule maintenance, inspections, and other property tasks
            </CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="renewal">Renewal</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendar */}
        <Calendar
          events={filteredEvents}
          view="month"
          onEventClick={(event) => {
            // Handle event click
          }}
        />

        {/* Upcoming Tasks Summary */}
        <div className="mt-6">
          <Separator className="mb-4" />
          <h3 className="font-semibold mb-3">Upcoming Tasks</h3>
          <div className="grid gap-3">
            {filteredEvents
              .filter(e => isAfter(e.startDate, new Date()))
              .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
              .slice(0, 5)
              .map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(event.category)}
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{format(event.startDate, 'MMM d')}</span>
                        {event.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.assignedTo}
                          </span>
                        )}
                        {event.cost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(event.cost)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(event.priority || 'medium')}>
                    {event.priority}
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Actions Calendar Widget
interface QuickActionsCalendarProps {
  onQuickAdd?: (type: string) => void
  className?: string
}

export function QuickActionsCalendar({
  onQuickAdd,
  className,
}: QuickActionsCalendarProps) {
  const quickActions = [
    { type: 'viewing', label: 'Schedule Viewing', icon: <Eye className="h-4 w-4" /> },
    { type: 'inspection', label: 'Book Inspection', icon: <ClipboardCheck className="h-4 w-4" /> },
    { type: 'payment', label: 'Payment Due', icon: <DollarSign className="h-4 w-4" /> },
    { type: 'meeting', label: 'Team Meeting', icon: <Users className="h-4 w-4" /> },
    { type: 'maintenance', label: 'Maintenance', icon: <Shield className="h-4 w-4" /> },
    { type: 'deadline', label: 'Add Deadline', icon: <Flag className="h-4 w-4" /> },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(action => (
            <Button
              key={action.type}
              variant="outline"
              className="justify-start"
              onClick={() => onQuickAdd?.(action.type)}
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}