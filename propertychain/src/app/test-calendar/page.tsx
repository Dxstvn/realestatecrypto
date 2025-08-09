/**
 * Calendar Test Page - PropertyChain
 * Tests all calendar components and features
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
  Calendar,
  DatePicker,
  DateRangePicker,
  MiniCalendar,
  type CalendarEvent,
} from '@/components/custom/calendar'
import {
  PropertyViewingCalendar,
  InvestmentTimelineCalendar,
  PropertyManagementCalendar,
  QuickActionsCalendar,
  type PropertyViewingEvent,
  type InvestmentTimelineEvent,
  type PropertyManagementEvent,
} from '@/components/custom/property-calendar'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Eye,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Bell,
  Building,
  TrendingUp,
  Target,
  Key,
  Shield,
  Info,
  CalendarDays,
  CalendarRange,
  CalendarSearch,
} from 'lucide-react'
import { addDays, addMonths, setHours, setMinutes } from 'date-fns'
import { toastSuccess, toastInfo } from '@/lib/toast'

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Property Viewing - 123 Oak Street',
    startDate: new Date(),
    startTime: '10:00',
    endTime: '10:30',
    type: 'viewing',
    location: '123 Oak Street, Portland, OR',
    attendees: ['John Smith', 'Jane Doe'],
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Investment Closing',
    startDate: addDays(new Date(), 2),
    startTime: '14:00',
    endTime: '15:00',
    type: 'closing',
    location: 'Title Company Office',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Mortgage Payment Due',
    startDate: addDays(new Date(), 5),
    type: 'payment',
    status: 'scheduled',
  },
  {
    id: '4',
    title: 'Property Inspection',
    startDate: addDays(new Date(), 7),
    startTime: '09:00',
    endTime: '11:00',
    type: 'inspection',
    location: '456 Pine Avenue',
    status: 'scheduled',
  },
  {
    id: '5',
    title: 'Investor Meeting',
    startDate: addDays(new Date(), 10),
    startTime: '15:00',
    endTime: '16:00',
    type: 'meeting',
    attendees: ['Investment Team'],
    status: 'scheduled',
  },
  {
    id: '6',
    title: 'Funding Deadline',
    startDate: addDays(new Date(), 14),
    type: 'deadline',
    status: 'scheduled',
  },
]

// Mock property viewings
const mockViewings: PropertyViewingEvent[] = [
  {
    id: '1',
    title: 'Property Viewing - Sarah Johnson',
    propertyId: 'prop-123',
    propertyAddress: '123 Oak Street, Portland, OR',
    viewerName: 'Sarah Johnson',
    viewerEmail: 'sarah@example.com',
    viewerPhone: '(555) 123-4567',
    viewingType: 'in-person',
    startDate: addDays(new Date(), 1),
    startTime: '10:00',
    endTime: '10:30',
    type: 'viewing',
    status: 'scheduled',
    confirmed: true,
    reminderSent: false,
    notes: 'First-time buyer, interested in investment property',
  },
  {
    id: '2',
    title: 'Virtual Tour - Michael Chen',
    propertyId: 'prop-123',
    propertyAddress: '123 Oak Street, Portland, OR',
    viewerName: 'Michael Chen',
    viewerEmail: 'michael@example.com',
    viewingType: 'virtual',
    startDate: addDays(new Date(), 3),
    startTime: '14:00',
    endTime: '14:30',
    type: 'viewing',
    status: 'scheduled',
    confirmed: false,
    reminderSent: false,
  },
  {
    id: '3',
    title: 'Self-Guided Tour - Emily Wilson',
    propertyId: 'prop-456',
    propertyAddress: '456 Pine Avenue, Seattle, WA',
    viewerName: 'Emily Wilson',
    viewerEmail: 'emily@example.com',
    viewingType: 'self-guided',
    startDate: addDays(new Date(), 2),
    startTime: '11:00',
    endTime: '12:00',
    type: 'viewing',
    status: 'scheduled',
    confirmed: true,
    reminderSent: true,
  },
]

// Mock investment milestones
const mockInvestments: InvestmentTimelineEvent[] = [
  {
    id: '1',
    title: 'Oak Street Investment - Funding Opens',
    investmentId: 'inv-001',
    propertyId: 'prop-123',
    milestone: 'funding_start',
    startDate: new Date(),
    type: 'deadline',
    status: 'scheduled',
    amount: 500000,
    stakeholders: ['PropertyChain', 'Investors'],
    completed: false,
  },
  {
    id: '2',
    title: 'Oak Street Investment - Funding Closes',
    investmentId: 'inv-001',
    propertyId: 'prop-123',
    milestone: 'funding_end',
    startDate: addDays(new Date(), 30),
    type: 'deadline',
    status: 'scheduled',
    amount: 500000,
    completed: false,
  },
  {
    id: '3',
    title: 'Oak Street Investment - Property Closing',
    investmentId: 'inv-001',
    propertyId: 'prop-123',
    milestone: 'closing',
    startDate: addDays(new Date(), 45),
    type: 'closing',
    status: 'scheduled',
    documents: ['Purchase Agreement', 'Title Documents'],
    completed: false,
  },
  {
    id: '4',
    title: 'Oak Street Investment - First Payment',
    investmentId: 'inv-001',
    propertyId: 'prop-123',
    milestone: 'first_payment',
    startDate: addMonths(new Date(), 2),
    type: 'payment',
    status: 'scheduled',
    amount: 2500,
    completed: false,
  },
  {
    id: '5',
    title: 'Oak Street Investment - Maturity',
    investmentId: 'inv-001',
    propertyId: 'prop-123',
    milestone: 'maturity',
    startDate: addMonths(new Date(), 60),
    type: 'deadline',
    status: 'scheduled',
    amount: 750000,
    completed: false,
  },
]

// Mock property management events
const mockManagementEvents: PropertyManagementEvent[] = [
  {
    id: '1',
    title: 'HVAC Maintenance',
    propertyId: 'prop-123',
    category: 'maintenance',
    priority: 'medium',
    startDate: addDays(new Date(), 3),
    startTime: '09:00',
    type: 'meeting',
    status: 'scheduled',
    assignedTo: 'John Maintenance',
    vendor: 'Cool Air Services',
    cost: 250,
  },
  {
    id: '2',
    title: 'Annual Property Inspection',
    propertyId: 'prop-123',
    category: 'inspection',
    priority: 'high',
    startDate: addDays(new Date(), 7),
    startTime: '10:00',
    type: 'inspection',
    status: 'scheduled',
    assignedTo: 'Inspector Smith',
  },
  {
    id: '3',
    title: 'Rent Payment Due',
    propertyId: 'prop-456',
    category: 'payment',
    priority: 'high',
    startDate: addDays(new Date(), 1),
    type: 'payment',
    status: 'scheduled',
    cost: 2500,
  },
  {
    id: '4',
    title: 'Lease Renewal Meeting',
    propertyId: 'prop-456',
    category: 'renewal',
    priority: 'medium',
    startDate: addDays(new Date(), 14),
    startTime: '14:00',
    type: 'meeting',
    status: 'scheduled',
    assignedTo: 'Property Manager',
  },
  {
    id: '5',
    title: 'Emergency Plumbing Repair',
    propertyId: 'prop-789',
    category: 'maintenance',
    priority: 'urgent',
    startDate: new Date(),
    startTime: '15:00',
    type: 'meeting',
    status: 'scheduled',
    assignedTo: 'Emergency Services',
    vendor: 'Quick Fix Plumbing',
    cost: 450,
  },
]

// Mock properties
const mockProperties = [
  { id: 'prop-123', name: 'Oak Street Property', address: '123 Oak Street, Portland, OR' },
  { id: 'prop-456', name: 'Pine Avenue Building', address: '456 Pine Avenue, Seattle, WA' },
  { id: 'prop-789', name: 'Downtown Complex', address: '789 Main Street, San Francisco, CA' },
]

export default function TestCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(),
    end: addDays(new Date(), 7),
  })
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'agenda'>('month')

  const handleEventClick = (event: CalendarEvent) => {
    toastInfo(`Event clicked: ${event.title}`)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    toastInfo(`Date selected: ${date.toLocaleDateString()}`)
  }

  const handleScheduleViewing = (viewing: PropertyViewingEvent) => {
    toastSuccess(`Viewing scheduled for ${viewing.viewerName}`)
  }

  const handleQuickAdd = (type: string) => {
    toastInfo(`Quick add: ${type}`)
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calendar Test</h1>
        <p className="text-muted-foreground">
          Testing calendar components with event management and date picking
        </p>
      </div>

      {/* Calendar Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{mockEvents.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Viewings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">
                {mockViewings.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Investment Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {mockInvestments.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Management Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">
                {mockManagementEvents.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Calendar</TabsTrigger>
          <TabsTrigger value="pickers">Date Pickers</TabsTrigger>
          <TabsTrigger value="viewings">Viewings</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        {/* Basic Calendar Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendar Views</CardTitle>
                  <CardDescription>Test different calendar view modes</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={calendarView === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={calendarView === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </Button>
                  <Button
                    variant={calendarView === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('day')}
                  >
                    Day
                  </Button>
                  <Button
                    variant={calendarView === 'agenda' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('agenda')}
                  >
                    Agenda
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                events={mockEvents}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onEventClick={handleEventClick}
                view={calendarView}
                showWeekNumbers
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mini Calendar</CardTitle>
                <CardDescription>Compact calendar widget</CardDescription>
              </CardHeader>
              <CardContent>
                <MiniCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  events={mockEvents}
                />
              </CardContent>
            </Card>

            <QuickActionsCalendar onQuickAdd={handleQuickAdd} />
          </div>
        </TabsContent>

        {/* Date Pickers Tab */}
        <TabsContent value="pickers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Date Picker</CardTitle>
                <CardDescription>Single date selection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DatePicker
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  placeholder="Select a date"
                />
                {selectedDate && (
                  <Alert>
                    <CalendarIcon className="h-4 w-4" />
                    <AlertDescription>
                      Selected: {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Date Range Picker</CardTitle>
                <CardDescription>Select a date range</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateRangePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onDateRangeChange={setDateRange}
                  placeholder="Select date range"
                />
                {dateRange.start && dateRange.end && (
                  <Alert>
                    <CalendarRange className="h-4 w-4" />
                    <AlertDescription>
                      Range: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Date Picker Variations</CardTitle>
              <CardDescription>Different date picker configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Disabled State</h4>
                  <DatePicker
                    date={new Date()}
                    placeholder="Disabled picker"
                    disabled
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Custom Placeholder</h4>
                  <DatePicker
                    placeholder="Birthday"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">With Initial Value</h4>
                  <DatePicker
                    date={new Date()}
                    onDateChange={(date) => toastInfo(`Date changed: ${date?.toLocaleDateString()}`)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Viewings Tab */}
        <TabsContent value="viewings" className="space-y-6">
          <PropertyViewingCalendar
            propertyId="prop-123"
            viewings={mockViewings}
            onScheduleViewing={handleScheduleViewing}
            onCancelViewing={(id) => toastInfo(`Cancelled viewing: ${id}`)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Viewing Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {mockViewings.filter(v => v.viewingType === 'in-person').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In-Person</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">
                    {mockViewings.filter(v => v.viewingType === 'virtual').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Virtual</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {mockViewings.filter(v => v.viewingType === 'self-guided').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Self-Guided</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <InvestmentTimelineCalendar
            investments={mockInvestments}
            onAddMilestone={(milestone) => toastSuccess('Milestone added')}
          />

          <Card>
            <CardHeader>
              <CardTitle>Timeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  The investment timeline tracks key milestones from funding to maturity. 
                  Each milestone can have associated documents, stakeholders, and financial amounts.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Management Tab */}
        <TabsContent value="management" className="space-y-6">
          <PropertyManagementCalendar
            events={mockManagementEvents}
            properties={mockProperties}
            onAddEvent={(event) => toastSuccess('Event added')}
          />

          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {mockManagementEvents.filter(e => e.priority === 'urgent').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {mockManagementEvents.filter(e => e.priority === 'high').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">
                    {mockManagementEvents.filter(e => e.priority === 'medium').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {mockManagementEvents.filter(e => e.priority === 'low').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Low</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Calendar Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Multiple view modes (month/week/day/agenda)</li>
                <li>✅ Event management system</li>
                <li>✅ Date & date range pickers</li>
                <li>✅ Mini calendar widget</li>
                <li>✅ Recurring events support</li>
                <li>✅ Event categories & colors</li>
                <li>✅ Week numbers display</li>
                <li>✅ Keyboard navigation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Property Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property viewing scheduler</li>
                <li>✅ Investment timeline tracker</li>
                <li>✅ Management task calendar</li>
                <li>✅ Virtual tour support</li>
                <li>✅ Self-guided tour booking</li>
                <li>✅ Milestone tracking</li>
                <li>✅ Priority-based tasks</li>
                <li>✅ Vendor management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Quick action shortcuts</li>
                <li>✅ Email reminders</li>
                <li>✅ Document attachments</li>
                <li>✅ Cost tracking</li>
                <li>✅ Stakeholder management</li>
                <li>✅ Status indicators</li>
                <li>✅ Overdue notifications</li>
                <li>✅ Timeline visualization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}