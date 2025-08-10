/**
 * Notification System - PropertyChain
 * 
 * Comprehensive real-time notification system with:
 * - WebSocket integration for real-time updates
 * - Notification grouping by type and priority
 * - Mark as read/unread functionality
 * - Unread count badge with shadcn Badge
 * - Grouped display with expandable sections
 * - Mobile-optimized responsive design
 * - Bulk actions and filtering
 * 
 * Following UpdatedUIPlan.md Step 36 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  MoreHorizontal,
  Filter,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Clock,
  AlertTriangle,
  Info,
  DollarSign,
  Building,
  FileText,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  Archive,
  Star,
  Circle,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils/cn'
import { useNotifications, type Notification } from '@/contexts/notification-context'
import { useWebSocket, useWebSocketSubscription } from '@/providers/websocket-provider'
import { NOTIFICATION_TYPES } from '@/lib/constants'
import { toast } from 'sonner'

/**
 * Notification type configuration with icons and colors
 */
const NOTIFICATION_CONFIG = {
  system: {
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'System',
  },
  investment: {
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Investment',
  },
  property: {
    icon: Building,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Property',
  },
  document: {
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Document',
  },
  payment: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Payment',
  },
  kyc: {
    icon: Shield,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'KYC',
  },
  general: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'General',
  },
} as const

/**
 * Notification priority configuration
 */
const PRIORITY_CONFIG = {
  low: {
    color: 'text-gray-500',
    label: 'Low',
    weight: 1,
  },
  medium: {
    color: 'text-blue-600',
    label: 'Medium', 
    weight: 2,
  },
  high: {
    color: 'text-orange-600',
    label: 'High',
    weight: 3,
  },
  urgent: {
    color: 'text-red-600',
    label: 'Urgent',
    weight: 4,
  },
} as const

/**
 * Format timestamp for notification display
 */
function formatNotificationTime(timestamp: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return timestamp.toLocaleDateString()
}

/**
 * Individual Notification Item Component
 */
function NotificationItem({
  notification,
  onMarkRead,
  onRemove,
  compact = false,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
  onRemove: (id: string) => void
  compact?: boolean
}) {
  const config = NOTIFICATION_CONFIG[notification.type.toLowerCase() as keyof typeof NOTIFICATION_CONFIG]
  const Icon = config.icon
  const priorityConfig = PRIORITY_CONFIG[notification.priority || 'medium']

  const handleClick = () => {
    if (!notification.read) {
      onMarkRead(notification.id)
    }
    if (notification.actionUrl) {
      // Navigation would be handled here
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "group relative p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
        !notification.read && "bg-blue-50/50 border-l-4 border-l-blue-500",
        compact && "p-3"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          config.bgColor
        )}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                "text-sm font-medium line-clamp-1",
                !notification.read && "font-semibold"
              )}>
                {notification.title}
              </h4>
              {notification.description && !compact && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {notification.description}
                </p>
              )}
            </div>

            {/* Priority indicator */}
            {notification.priority && notification.priority !== 'medium' && (
              <Badge 
                variant="outline" 
                className={cn("text-xs", priorityConfig.color)}
              >
                {priorityConfig.label}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatNotificationTime(notification.timestamp)}
              </span>
              {notification.actionLabel && (
                <Badge variant="secondary" className="text-xs">
                  {notification.actionLabel}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkRead(notification.id)
                      }}
                    >
                      {notification.read ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {notification.read ? 'Mark as unread' : 'Mark as read'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(notification.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Remove notification
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </motion.div>
  )
}

/**
 * Notification Group Component
 */
function NotificationGroup({
  type,
  notifications,
  onMarkRead,
  onRemove,
  onMarkAllRead,
  expanded = true,
  onToggle,
}: {
  type: string
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onRemove: (id: string) => void
  onMarkAllRead: (type: string) => void
  expanded?: boolean
  onToggle: () => void
}) {
  const config = NOTIFICATION_CONFIG[type as keyof typeof NOTIFICATION_CONFIG]
  const Icon = config.icon
  const unreadCount = notifications.filter(n => !n.read).length

  if (notifications.length === 0) return null

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", config.bgColor)}>
            <Icon className={cn("h-4 w-4", config.color)} />
          </div>
          <div>
            <h3 className="font-medium text-sm">{config.label}</h3>
            <p className="text-xs text-muted-foreground">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && `, ${unreadCount} unread`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount}
            </Badge>
          )}
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={(e) => {
                e.stopPropagation()
                onMarkAllRead(type)
              }}
            >
              Mark all read
            </Button>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={onMarkRead}
                onRemove={onRemove}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Notification Filters Component
 */
function NotificationFilters({
  selectedTypes,
  onTypesChange,
  selectedPriorities,
  onPrioritiesChange,
  showUnreadOnly,
  onUnreadOnlyChange,
}: {
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
  selectedPriorities: string[]
  onPrioritiesChange: (priorities: string[]) => void
  showUnreadOnly: boolean
  onUnreadOnlyChange: (value: boolean) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
          {(selectedTypes.length < Object.keys(NOTIFICATION_TYPES).length ||
            selectedPriorities.length < Object.keys(PRIORITY_CONFIG).length ||
            showUnreadOnly) && (
            <Badge variant="secondary" className="text-xs">
              {selectedTypes.length + selectedPriorities.length + (showUnreadOnly ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            By Type
          </DropdownMenuLabel>
          {Object.entries(NOTIFICATION_CONFIG).map(([type, config]) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onTypesChange([...selectedTypes, type])
                } else {
                  onTypesChange(selectedTypes.filter(t => t !== type))
                }
              }}
            >
              <div className="flex items-center gap-2">
                <config.icon className={cn("h-3 w-3", config.color)} />
                {config.label}
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            By Priority
          </DropdownMenuLabel>
          {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={selectedPriorities.includes(priority)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onPrioritiesChange([...selectedPriorities, priority])
                } else {
                  onPrioritiesChange(selectedPriorities.filter(p => p !== priority))
                }
              }}
            >
              <div className={cn("flex items-center gap-2", config.color)}>
                {config.label}
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={showUnreadOnly}
          onCheckedChange={onUnreadOnlyChange}
        >
          Show unread only
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Notification Bell Button Component (for header)
 */
export function NotificationBell({
  size = 'default',
  showLabel = false,
}: {
  size?: 'sm' | 'default' | 'lg'
  showLabel?: boolean
}) {
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead } = useNotifications()
  const { isConnected } = useWebSocket()
  const [open, setOpen] = useState(false)

  // Real-time notification subscription
  useWebSocketSubscription('notification', (data) => {
    // Notification is automatically added by the WebSocket provider
    console.log('New notification received:', data)
  })

  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative",
            sizeClasses[size],
            showLabel && "w-auto px-3 gap-2"
          )}
        >
          {unreadCount > 0 ? (
            <BellRing className={cn(iconSizes[size], "text-blue-600")} />
          ) : (
            <Bell className={iconSizes[size]} />
          )}
          
          {showLabel && <span>Notifications</span>}
          
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          
          {/* WebSocket connection indicator */}
          <div className={cn(
            "absolute bottom-0 right-0 w-2 h-2 rounded-full",
            isConnected ? "bg-green-400" : "bg-gray-400"
          )} />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={8}
      >
        <NotificationPopover
          notifications={notifications}
          onMarkRead={markAsRead}
          onRemove={removeNotification}
          onMarkAllRead={markAllAsRead}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}

/**
 * Notification Popover Content Component
 */
function NotificationPopover({
  notifications,
  onMarkRead,
  onRemove,
  onMarkAllRead,
  onClose,
}: {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onRemove: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(Object.keys(NOTIFICATION_TYPES))
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(Object.keys(PRIORITY_CONFIG))
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(notification => {
        const matchesSearch = !searchQuery || 
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.description?.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesType = selectedTypes.includes(notification.type)
        const matchesPriority = selectedPriorities.includes(notification.priority || 'medium')
        const matchesReadState = !showUnreadOnly || !notification.read
        
        return matchesSearch && matchesType && matchesPriority && matchesReadState
      })
      .sort((a, b) => {
        // Sort by priority first, then by timestamp
        const aPriority = PRIORITY_CONFIG[a.priority || 'medium'].weight
        const bPriority = PRIORITY_CONFIG[b.priority || 'medium'].weight
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority
        }
        
        return b.timestamp.getTime() - a.timestamp.getTime()
      })
  }, [notifications, searchQuery, selectedTypes, selectedPriorities, showUnreadOnly])

  const unreadCount = notifications.filter(n => !n.read).length

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="font-medium text-gray-900 mb-2">No notifications</h3>
        <p className="text-sm text-gray-500">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col max-h-96">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} asChild>
              <Link href="/dashboard/notifications">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <NotificationFilters
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            selectedPriorities={selectedPriorities}
            onPrioritiesChange={setSelectedPriorities}
            showUnreadOnly={showUnreadOnly}
            onUnreadOnlyChange={setShowUnreadOnly}
          />
          
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications match your filters
            </div>
          ) : (
            filteredNotifications.slice(0, 10).map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={onMarkRead}
                onRemove={onRemove}
                compact
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {filteredNotifications.length > 10 && (
        <div className="p-3 border-t text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/notifications">
              View all notifications
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Full Notification Center Component (for dedicated page)
 */
export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(Object.keys(NOTIFICATION_TYPES))
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(Object.keys(PRIORITY_CONFIG))
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [groupedView, setGroupedView] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(Object.keys(NOTIFICATION_TYPES)))

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = !searchQuery || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = selectedTypes.includes(notification.type)
      const matchesPriority = selectedPriorities.includes(notification.priority || 'medium')
      const matchesReadState = !showUnreadOnly || !notification.read
      
      return matchesSearch && matchesType && matchesPriority && matchesReadState
    })
  }, [notifications, searchQuery, selectedTypes, selectedPriorities, showUnreadOnly])

  // Group notifications by type
  const groupedNotifications = useMemo(() => {
    return Object.keys(NOTIFICATION_TYPES).reduce((groups, type) => {
      groups[type] = filteredNotifications
        .filter(n => n.type === type)
        .sort((a, b) => {
          const aPriority = PRIORITY_CONFIG[a.priority || 'medium'].weight
          const bPriority = PRIORITY_CONFIG[b.priority || 'medium'].weight
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority
          }
          
          return b.timestamp.getTime() - a.timestamp.getTime()
        })
      return groups
    }, {} as Record<string, Notification[]>)
  }, [filteredNotifications])

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedGroups(newExpanded)
  }

  const handleMarkAllReadForType = (type: string) => {
    const typeNotifications = groupedNotifications[type].filter(n => !n.read)
    typeNotifications.forEach(n => markAsRead(n.id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            {unreadCount > 0 && `, ${unreadCount} unread`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGroupedView(!groupedView)}
          >
            {groupedView ? 'List View' : 'Group View'}
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <NotificationFilters
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              selectedPriorities={selectedPriorities}
              onPrioritiesChange={setSelectedPriorities}
              showUnreadOnly={showUnreadOnly}
              onUnreadOnlyChange={setShowUnreadOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-sm text-gray-500">
              {notifications.length === 0 
                ? "You're all caught up!" 
                : "No notifications match your filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedView ? (
            // Grouped view
            Object.entries(groupedNotifications).map(([type, typeNotifications]) => (
              <NotificationGroup
                key={type}
                type={type}
                notifications={typeNotifications}
                onMarkRead={markAsRead}
                onRemove={removeNotification}
                onMarkAllRead={handleMarkAllReadForType}
                expanded={expandedGroups.has(type)}
                onToggle={() => toggleGroup(type)}
              />
            ))
          ) : (
            // List view
            <Card>
              <div className="divide-y">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Mobile Notification Sheet Component
 */
export function NotificationSheet({
  children,
}: {
  children: React.ReactNode
}) {
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead } = useNotifications()
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary">
                {unreadCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your latest activity
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <NotificationPopover
            notifications={notifications}
            onMarkRead={markAsRead}
            onRemove={removeNotification}
            onMarkAllRead={markAllAsRead}
            onClose={() => {}}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

/**
 * Notification Settings Component
 */
export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    types: {
      [NOTIFICATION_TYPES.SYSTEM]: true,
      [NOTIFICATION_TYPES.INVESTMENT]: true,
      [NOTIFICATION_TYPES.PROPERTY]: true,
      [NOTIFICATION_TYPES.DOCUMENT]: true,
      [NOTIFICATION_TYPES.PAYMENT]: true,
      [NOTIFICATION_TYPES.KYC]: true,
      [NOTIFICATION_TYPES.GENERAL]: false,
    },
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleTypeChange = (type: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      types: { ...prev.types, [type]: enabled }
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h3 className="font-medium mb-3">Delivery Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm">Email notifications</label>
              <Checkbox
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', !!checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Push notifications</label>
              <Checkbox
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', !!checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">SMS notifications</label>
              <Checkbox
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', !!checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Notification Types */}
        <div>
          <h3 className="font-medium mb-3">Notification Types</h3>
          <div className="space-y-3">
            {Object.entries(NOTIFICATION_CONFIG).map(([type, config]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <config.icon className={cn("h-4 w-4", config.color)} />
                  <label className="text-sm">{config.label}</label>
                </div>
                <Checkbox
                  checked={settings.types[type as keyof typeof settings.types]}
                  onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}