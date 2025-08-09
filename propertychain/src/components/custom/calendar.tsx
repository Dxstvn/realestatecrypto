/**
 * Calendar Components - PropertyChain
 * 
 * Comprehensive calendar with event management and date picking
 * Following Section 0 principles with accessibility
 */

'use client'

import * as React from 'react'
import { 
  format, 
  addDays, 
  addMonths,
  addWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
  isFuture,
  parseISO,
  eachDayOfInterval,
  getDay,
  setHours,
  setMinutes,
} from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar as CalendarIcon2,
  Bell,
  Repeat,
  Video,
  Phone,
  Mail,
  DollarSign,
  Building,
  Home,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Circle,
} from 'lucide-react'

// Event types
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  startTime?: string
  endTime?: string
  location?: string
  type?: 'viewing' | 'meeting' | 'deadline' | 'payment' | 'inspection' | 'closing'
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  attendees?: string[]
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  color?: string
  reminder?: boolean
  metadata?: Record<string, any>
}

// Date utilities
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Event type configurations
const EVENT_TYPES = {
  viewing: {
    label: 'Property Viewing',
    icon: <Eye className="h-4 w-4" />,
    color: 'bg-blue-500',
  },
  meeting: {
    label: 'Meeting',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-purple-500',
  },
  deadline: {
    label: 'Deadline',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'bg-red-500',
  },
  payment: {
    label: 'Payment Due',
    icon: <DollarSign className="h-4 w-4" />,
    color: 'bg-green-500',
  },
  inspection: {
    label: 'Inspection',
    icon: <FileText className="h-4 w-4" />,
    color: 'bg-amber-500',
  },
  closing: {
    label: 'Closing',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-indigo-500',
  },
}

// Base Calendar Component
interface CalendarProps {
  events?: CalendarEvent[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onMonthChange?: (date: Date) => void
  view?: 'month' | 'week' | 'day' | 'agenda'
  showWeekNumbers?: boolean
  className?: string
  loading?: boolean
}

export function Calendar({
  events = [],
  selectedDate: controlledSelectedDate,
  onDateSelect,
  onEventClick,
  onMonthChange,
  view = 'month',
  showWeekNumbers = false,
  className,
  loading = false,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(controlledSelectedDate)
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>()

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const handlePreviousMonth = () => {
    const newMonth = addMonths(currentMonth, -1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    handleDateSelect(today)
  }

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.startDate, date)
    )
  }

  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startOfYear.getDay() + 1) / 7)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderMonthView = () => {
    const days = getDaysInMonth()
    
    return (
      <div>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
          >
            Today
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className={cn(
          "grid gap-px bg-muted p-px rounded-lg",
          showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
        )}>
          {showWeekNumbers && (
            <div className="bg-background p-2 text-center">
              <span className="text-xs font-medium text-muted-foreground">Wk</span>
            </div>
          )}
          {WEEKDAYS.map(day => (
            <div key={day} className="bg-background p-2 text-center">
              <span className="text-xs font-medium text-muted-foreground">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={cn(
          "grid gap-px bg-muted p-px rounded-lg mt-px",
          showWeekNumbers ? "grid-cols-8" : "grid-cols-7"
        )}>
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isHovered = hoveredDate && isSameDay(day, hoveredDate)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const showWeekNum = showWeekNumbers && getDay(day) === 0

            return (
              <React.Fragment key={day.toISOString()}>
                {showWeekNum && (
                  <div className="bg-background p-2 text-center">
                    <span className="text-xs text-muted-foreground">
                      {getWeekNumber(day)}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleDateSelect(day)}
                  onMouseEnter={() => setHoveredDate(day)}
                  onMouseLeave={() => setHoveredDate(undefined)}
                  className={cn(
                    "relative bg-background p-2 min-h-[80px] text-left transition-all hover:bg-accent",
                    isSelected && "ring-2 ring-primary",
                    isHovered && "bg-accent",
                    !isCurrentMonth && "text-muted-foreground bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium",
                    isToday(day) && "text-primary"
                  )}>
                    {format(day, 'd')}
                    {isToday(day) && (
                      <Badge className="ml-2 text-xs px-1 py-0">Today</Badge>
                    )}
                  </div>
                  
                  {/* Events */}
                  {dayEvents.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick?.(event)
                          }}
                          className={cn(
                            "text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80",
                            EVENT_TYPES[event.type || 'meeting'].color,
                            "text-white"
                          )}
                        >
                          {event.startTime && (
                            <span className="font-medium mr-1">
                              {event.startTime}
                            </span>
                          )}
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate || new Date())
    const days = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i))
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addWeeks(currentMonth, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              Week of {format(startOfCurrentWeek, 'MMM d, yyyy')}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addWeeks(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 text-xs font-medium text-muted-foreground border-r">
              Time
            </div>
            {days.map(day => (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 text-center border-r last:border-r-0",
                  isToday(day) && "bg-primary/10"
                )}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  isToday(day) && "text-primary"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          <ScrollArea className="h-96">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b">
                <div className="p-2 text-xs text-muted-foreground border-r">
                  {format(setHours(new Date(), hour), 'ha')}
                </div>
                {days.map(day => {
                  const hourEvents = events.filter(event => {
                    const eventHour = parseInt(event.startTime?.split(':')[0] || '0')
                    return isSameDay(event.startDate, day) && eventHour === hour
                  })

                  return (
                    <div
                      key={day.toISOString()}
                      className="p-1 border-r last:border-r-0 min-h-[40px] hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleDateSelect(day)}
                    >
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick?.(event)
                          }}
                          className={cn(
                            "text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80",
                            EVENT_TYPES[event.type || 'meeting'].color,
                            "text-white"
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const currentDate = selectedDate || new Date()
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDate(currentDate)

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDateSelect(addDays(currentDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDateSelect(addDays(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
        </div>

        <ScrollArea className="h-[600px] border rounded-lg">
          <div className="p-4">
            {hours.map(hour => {
              const hourEvents = dayEvents.filter(event => {
                const eventHour = parseInt(event.startTime?.split(':')[0] || '0')
                return eventHour === hour
              })

              return (
                <div key={hour} className="flex gap-4 border-b py-4">
                  <div className="w-16 text-sm text-muted-foreground">
                    {format(setHours(new Date(), hour), 'ha')}
                  </div>
                  <div className="flex-1 space-y-2">
                    {hourEvents.length > 0 ? (
                      hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer hover:opacity-90",
                            EVENT_TYPES[event.type || 'meeting'].color,
                            "text-white"
                          )}
                        >
                          <div className="font-medium">{event.title}</div>
                          {event.description && (
                            <div className="text-sm opacity-90 mt-1">
                              {event.description}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1 text-sm mt-2">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="h-12 border-l-2 border-muted" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(event => !isPast(event.startDate))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Badge variant="secondary">{upcomingEvents.length} events</Badge>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CalendarIcon2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No upcoming events</p>
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.map(event => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEventClick?.(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          EVENT_TYPES[event.type || 'meeting'].color
                        )}>
                          {EVENT_TYPES[event.type || 'meeting'].icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(event.startDate, 'MMM d, yyyy')}
                            </span>
                            {event.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.startTime}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {event.status && (
                        <Badge
                          variant={
                            event.status === 'confirmed' ? 'default' :
                            event.status === 'cancelled' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {event.status}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
        {view === 'agenda' && renderAgendaView()}
      </CardContent>
    </Card>
  )
}

// Date Picker Component
interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selectedDate={date}
          onDateSelect={(newDate) => {
            onDateChange?.(newDate)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

// Date Range Picker Component
interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onDateRangeChange?: (range: { start: Date | undefined; end: Date | undefined }) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  placeholder = 'Pick a date range',
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempStart, setTempStart] = React.useState(startDate)
  const [tempEnd, setTempEnd] = React.useState(endDate)

  const handleApply = () => {
    onDateRangeChange?.({ start: tempStart, end: tempEnd })
    setOpen(false)
  }

  const displayText = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
    }
    return placeholder
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !startDate && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <DatePicker
                date={tempStart}
                onDateChange={setTempStart}
                placeholder="Start date"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <DatePicker
                date={tempEnd}
                onDateChange={setTempEnd}
                placeholder="End date"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!tempStart || !tempEnd}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Mini Calendar Component
interface MiniCalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  events?: CalendarEvent[]
  className?: string
}

export function MiniCalendar({
  selectedDate: controlledSelectedDate,
  onDateSelect,
  events = [],
  className,
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(controlledSelectedDate)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }

  const hasEvent = (date: Date) => {
    return events.some(event => isSameDay(event.startDate, date))
  }

  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth().map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const hasEventOnDay = hasEvent(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateSelect(day)}
              className={cn(
                "relative h-7 w-7 text-xs rounded-md hover:bg-accent transition-colors",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                !isCurrentMonth && "text-muted-foreground",
                isToday(day) && "font-bold"
              )}
            >
              {format(day, 'd')}
              {hasEventOnDay && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}