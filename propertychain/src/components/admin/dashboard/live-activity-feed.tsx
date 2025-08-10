/**
 * Live Activity Feed - PropertyChain Admin
 * 
 * Real-time transaction stream with WebSocket updates
 * Following UpdatedUIPlan.md Step 55.1 specifications
 */

'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Home,
  Users,
  FileCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Pause,
  Play,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatTimeAgo } from '@/lib/utils/format'
import { motion, AnimatePresence } from 'framer-motion'

interface ActivityItem {
  id: string
  type: 'investment' | 'listing' | 'kyc' | 'withdrawal' | 'user' | 'property' | 'system'
  title: string
  description: string
  amount?: number
  user?: {
    name: string
    avatar?: string
    id: string
  }
  property?: {
    name: string
    id: string
  }
  status: 'success' | 'pending' | 'failed' | 'warning'
  timestamp: Date
  metadata?: Record<string, any>
}

const activityIcons = {
  investment: DollarSign,
  listing: Home,
  kyc: FileCheck,
  withdrawal: ArrowUpRight,
  user: Users,
  property: Home,
  system: AlertCircle,
}

const statusColors = {
  success: 'text-green-600 bg-green-50',
  pending: 'text-yellow-600 bg-yellow-50',
  failed: 'text-red-600 bg-red-50',
  warning: 'text-orange-600 bg-orange-50',
}

const typeColors = {
  investment: 'border-l-blue-500',
  listing: 'border-l-purple-500',
  kyc: 'border-l-green-500',
  withdrawal: 'border-l-red-500',
  user: 'border-l-indigo-500',
  property: 'border-l-orange-500',
  system: 'border-l-gray-500',
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [filter, setFilter] = useState<ActivityItem['type'] | 'all'>('all')
  const [isConnected, setIsConnected] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Generate mock activity
  const generateActivity = (): ActivityItem => {
    const types: ActivityItem['type'][] = ['investment', 'listing', 'kyc', 'withdrawal', 'user', 'property', 'system']
    const type = types[Math.floor(Math.random() * types.length)]
    
    const templates = {
      investment: [
        {
          title: 'New Investment',
          description: 'invested in',
          amount: Math.floor(Math.random() * 50000) + 5000,
          status: 'success' as const,
        },
        {
          title: 'Investment Pending',
          description: 'initiated investment in',
          amount: Math.floor(Math.random() * 30000) + 3000,
          status: 'pending' as const,
        },
      ],
      listing: [
        {
          title: 'Property Listed',
          description: 'New property listed:',
          status: 'success' as const,
        },
        {
          title: 'Listing Updated',
          description: 'Property details updated:',
          status: 'success' as const,
        },
      ],
      kyc: [
        {
          title: 'KYC Submitted',
          description: 'submitted KYC documents',
          status: 'pending' as const,
        },
        {
          title: 'KYC Approved',
          description: 'KYC verification approved for',
          status: 'success' as const,
        },
        {
          title: 'KYC Rejected',
          description: 'KYC verification failed for',
          status: 'failed' as const,
        },
      ],
      withdrawal: [
        {
          title: 'Withdrawal Request',
          description: 'requested withdrawal of',
          amount: Math.floor(Math.random() * 20000) + 1000,
          status: 'pending' as const,
        },
        {
          title: 'Withdrawal Processed',
          description: 'withdrawal completed:',
          amount: Math.floor(Math.random() * 15000) + 2000,
          status: 'success' as const,
        },
      ],
      user: [
        {
          title: 'New User Signup',
          description: 'New user registered:',
          status: 'success' as const,
        },
        {
          title: 'User Verified',
          description: 'Email verified for',
          status: 'success' as const,
        },
      ],
      property: [
        {
          title: 'Property Funded',
          description: 'reached funding goal',
          status: 'success' as const,
        },
        {
          title: 'Property Sale',
          description: 'Property tokens traded:',
          amount: Math.floor(Math.random() * 10000) + 500,
          status: 'success' as const,
        },
      ],
      system: [
        {
          title: 'System Alert',
          description: 'High transaction volume detected',
          status: 'warning' as const,
        },
        {
          title: 'Backup Complete',
          description: 'Database backup completed successfully',
          status: 'success' as const,
        },
      ],
    }
    
    const template = templates[type][Math.floor(Math.random() * templates[type].length)]
    
    const userNames = ['John Smith', 'Emily Chen', 'Michael Brown', 'Sarah Wilson', 'David Lee']
    const propertyNames = ['Sunset Villa', 'Downtown Loft', 'Beach House', 'Mountain Retreat', 'City Tower']
    
    return {
      id: `activity-${Date.now()}-${Math.random()}`,
      type,
      ...template,
      user: ['investment', 'kyc', 'withdrawal', 'user'].includes(type) ? {
        name: userNames[Math.floor(Math.random() * userNames.length)],
        id: `user-${Math.floor(Math.random() * 10000)}`,
      } : undefined,
      property: ['investment', 'listing', 'property'].includes(type) ? {
        name: propertyNames[Math.floor(Math.random() * propertyNames.length)],
        id: `prop-${Math.floor(Math.random() * 1000)}`,
      } : undefined,
      timestamp: new Date(),
    }
  }
  
  // Initialize with some activities
  useEffect(() => {
    const initialActivities = Array.from({ length: 10 }, () => {
      const activity = generateActivity()
      activity.timestamp = new Date(Date.now() - Math.random() * 3600000) // Random time in last hour
      return activity
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    setActivities(initialActivities)
  }, [])
  
  // WebSocket simulation
  useEffect(() => {
    if (isPaused) return
    
    setIsConnected(true)
    
    const interval = setInterval(() => {
      const newActivity = generateActivity()
      setActivities(prev => [newActivity, ...prev].slice(0, 100)) // Keep last 100 activities
      
      // Auto-scroll to top if near top
      if (scrollRef.current && scrollRef.current.scrollTop < 100) {
        scrollRef.current.scrollTop = 0
      }
    }, Math.random() * 5000 + 2000) // Random interval between 2-7 seconds
    
    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [isPaused])
  
  // Filter activities
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter)
  
  // Calculate stats
  const stats = {
    total: activities.length,
    success: activities.filter(a => a.status === 'success').length,
    pending: activities.filter(a => a.status === 'pending').length,
    failed: activities.filter(a => a.status === 'failed').length,
  }
  
  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold">Live Activity Feed</CardTitle>
            {isConnected && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Live</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border rounded-lg px-3 py-1"
            >
              <option value="all">All Activities</option>
              <option value="investment">Investments</option>
              <option value="listing">Listings</option>
              <option value="kyc">KYC</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="user">Users</option>
              <option value="property">Properties</option>
              <option value="system">System</option>
            </select>
            
            {/* Control Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivities([])}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="secondary" className="gap-1">
            Total: {stats.total}
          </Badge>
          <Badge className="gap-1 bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" />
            {stats.success}
          </Badge>
          <Badge className="gap-1 bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3" />
            {stats.pending}
          </Badge>
          <Badge className="gap-1 bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" />
            {stats.failed}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea ref={scrollRef} className="h-full px-6">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity) => {
              const Icon = activityIcons[activity.type]
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "py-4 border-b border-l-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    typeColors[activity.type]
                  )}
                  onClick={() => {
                    // Handle click to view details
                    console.log('View activity details:', activity)
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                      "p-2 rounded-lg",
                      statusColors[activity.status]
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.user && (
                              <span className="font-medium text-gray-900">
                                {activity.user.name}{' '}
                              </span>
                            )}
                            {activity.description}
                            {activity.property && (
                              <span className="font-medium text-gray-900">
                                {' '}{activity.property.name}
                              </span>
                            )}
                            {activity.amount && (
                              <span className="font-bold text-gray-900">
                                {' '}{formatCurrency(activity.amount)}
                              </span>
                            )}
                          </p>
                        </div>
                        
                        {/* Timestamp */}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      
                      {/* Additional metadata */}
                      {activity.metadata && (
                        <div className="flex items-center gap-2 mt-2">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {filteredActivities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Activity className="h-12 w-12 mb-4 opacity-20" />
              <p>No activities to display</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}