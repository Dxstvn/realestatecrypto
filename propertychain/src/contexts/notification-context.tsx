/**
 * Notification Context - PropertyChain
 * 
 * Global notification management system
 * Following RECOVERY_PLAN.md Phase 4 - Connect notification triggers
 */

'use client'

import * as React from 'react'
import { toast } from '@/hooks/use-toast'
import { Bell, Check, X, AlertCircle, Info } from 'lucide-react'
import { NOTIFICATION_TYPES, STORAGE_KEYS } from '@/lib/constants'

export interface Notification {
  id: string
  type: keyof typeof NOTIFICATION_TYPES
  title: string
  description?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  persistent?: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  getNotificationIcon: (type: keyof typeof NOTIFICATION_TYPES) => React.ReactNode
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
  maxNotifications?: number
  persistToStorage?: boolean
}

export function NotificationProvider({
  children,
  maxNotifications = 50,
  persistToStorage = true,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  
  // Load notifications from storage on mount
  React.useEffect(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setNotifications(parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })))
        } catch (error) {
          console.error('Failed to parse stored notifications:', error)
        }
      }
    }
  }, [persistToStorage])
  
  // Save notifications to storage when they change
  React.useEffect(() => {
    if (persistToStorage && typeof window !== 'undefined') {
      localStorage.setItem(
        'notifications',
        JSON.stringify(notifications)
      )
    }
  }, [notifications, persistToStorage])
  
  const unreadCount = React.useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  )
  
  const addNotification = React.useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      }
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev]
        // Limit the number of notifications
        if (updated.length > maxNotifications) {
          return updated.slice(0, maxNotifications)
        }
        return updated
      })
      
      // Show toast for high priority notifications
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        toast({
          title: notification.title,
          description: notification.description,
          variant: notification.priority === 'urgent' ? 'destructive' : 'default',
        })
      }
    },
    [maxNotifications]
  )
  
  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])
  
  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])
  
  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])
  
  const clearAll = React.useCallback(() => {
    setNotifications([])
  }, [])
  
  const getNotificationIcon = React.useCallback((type: keyof typeof NOTIFICATION_TYPES) => {
    switch (type) {
      case 'SYSTEM':
        return <AlertCircle className="h-4 w-4" />
      case 'INVESTMENT':
        return <Check className="h-4 w-4 text-green-500" />
      case 'PROPERTY':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'DOCUMENT':
        return <Info className="h-4 w-4" />
      case 'PAYMENT':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'KYC':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }, [])
  
  // Simulate receiving notifications (for demo purposes)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const demoNotifications = [
        {
          type: 'INVESTMENT' as const,
          title: 'Investment Confirmed',
          description: 'Your investment in Marina Heights has been confirmed.',
          priority: 'high' as const,
        },
        {
          type: 'PROPERTY' as const,
          title: 'New Property Available',
          description: 'Tech Hub Plaza is now open for investment.',
          priority: 'medium' as const,
          actionUrl: '/properties/1',
          actionLabel: 'View Property',
        },
        {
          type: 'KYC' as const,
          title: 'KYC Verification Required',
          description: 'Please complete your KYC verification to continue investing.',
          priority: 'urgent' as const,
          actionUrl: '/kyc',
          actionLabel: 'Complete KYC',
        },
      ]
      
      // Add demo notifications after a delay
      const timer = setTimeout(() => {
        if (notifications.length === 0) {
          demoNotifications.forEach((notification, index) => {
            setTimeout(() => {
              addNotification(notification)
            }, index * 2000)
          })
        }
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      getNotificationIcon,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      getNotificationIcon,
    ]
  )
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Hook for triggering notifications from anywhere
export function useNotificationTriggers() {
  const { addNotification } = useNotifications()
  
  return {
    notifyInvestmentSuccess: (propertyName: string, amount: number) => {
      addNotification({
        type: 'INVESTMENT',
        title: 'Investment Successful',
        description: `Your investment of $${amount.toLocaleString()} in ${propertyName} has been confirmed.`,
        priority: 'high',
        actionUrl: '/portfolio',
        actionLabel: 'View Portfolio',
      })
    },
    
    notifyKYCUpdate: (status: 'pending' | 'approved' | 'rejected') => {
      const messages = {
        pending: {
          title: 'KYC Verification Pending',
          description: 'Your documents are being reviewed. This usually takes 1-2 business days.',
          priority: 'medium' as const,
        },
        approved: {
          title: 'KYC Verification Approved',
          description: 'Congratulations! You can now invest in properties.',
          priority: 'high' as const,
        },
        rejected: {
          title: 'KYC Verification Required',
          description: 'Additional information is needed. Please review and resubmit.',
          priority: 'urgent' as const,
          actionUrl: '/kyc',
          actionLabel: 'Update KYC',
        },
      }
      
      addNotification({
        type: 'KYC',
        ...messages[status],
      })
    },
    
    notifyPropertyUpdate: (propertyName: string, updateType: string) => {
      addNotification({
        type: 'PROPERTY',
        title: `Property Update: ${propertyName}`,
        description: updateType,
        priority: 'low',
      })
    },
    
    notifyPayment: (type: 'received' | 'pending' | 'failed', amount?: number) => {
      const messages = {
        received: {
          title: 'Payment Received',
          description: amount ? `$${amount.toLocaleString()} has been credited to your account.` : 'Payment has been received.',
          priority: 'medium' as const,
        },
        pending: {
          title: 'Payment Processing',
          description: 'Your payment is being processed. This may take a few minutes.',
          priority: 'low' as const,
        },
        failed: {
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          priority: 'urgent' as const,
        },
      }
      
      addNotification({
        type: 'PAYMENT',
        ...messages[type],
      })
    },
    
    notifyDocument: (documentName: string, action: 'uploaded' | 'signed' | 'expired') => {
      const messages = {
        uploaded: {
          title: 'Document Uploaded',
          description: `${documentName} has been successfully uploaded.`,
          priority: 'low' as const,
        },
        signed: {
          title: 'Document Signed',
          description: `${documentName} has been signed and is now active.`,
          priority: 'medium' as const,
        },
        expired: {
          title: 'Document Expired',
          description: `${documentName} has expired and needs to be renewed.`,
          priority: 'high' as const,
          actionUrl: '/documents',
          actionLabel: 'Review Documents',
        },
      }
      
      addNotification({
        type: 'DOCUMENT',
        ...messages[action],
      })
    },
    
    notifySystem: (title: string, description?: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') => {
      addNotification({
        type: 'SYSTEM',
        title,
        description,
        priority,
      })
    },
  }
}