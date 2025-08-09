/**
 * Notification System Test Page - PropertyChain
 * 
 * Comprehensive test page for all notification system components
 * Testing Step 36 implementation from UpdatedUIPlan.md
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  NotificationBell,
  NotificationCenter,
  NotificationSheet,
  NotificationSettings,
} from '@/components/custom/notifications'
import { useNotifications, useNotificationTriggers } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  Settings,
  TestTube,
  Activity,
  DollarSign,
  Building,
  FileText,
  Shield,
  AlertTriangle,
  Info,
  Zap,
  RefreshCw,
  Trash2,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function TestNotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications()
  const triggers = useNotificationTriggers()
  const [activeTab, setActiveTab] = useState('bell')
  const [demoCount, setDemoCount] = useState(0)

  // Demo notification generators
  const generateDemoNotifications = () => {
    const demoNotifications = [
      {
        type: 'INVESTMENT' as const,
        title: 'Investment Confirmed',
        description: 'Your $50,000 investment in Marina Heights Residences has been confirmed.',
        priority: 'high' as const,
      },
      {
        type: 'PROPERTY' as const,
        title: 'New Property Listed',
        description: 'Tech Hub Plaza is now available for tokenized investment.',
        priority: 'medium' as const,
      },
      {
        type: 'KYC' as const,
        title: 'KYC Verification Needed',
        description: 'Please complete identity verification to unlock full features.',
        priority: 'urgent' as const,
      },
      {
        type: 'PAYMENT' as const,
        title: 'Dividend Payment',
        description: 'You received $2,450 in quarterly dividends.',
        priority: 'medium' as const,
      },
      {
        type: 'DOCUMENT' as const,
        title: 'Document Signed',
        description: 'Investment agreement for Sunset Villa has been executed.',
        priority: 'low' as const,
      },
      {
        type: 'SYSTEM' as const,
        title: 'Maintenance Notice',
        description: 'Platform maintenance scheduled for tonight 2:00-4:00 AM EST.',
        priority: 'low' as const,
      }
    ]

    // Add 3 random notifications
    for (let i = 0; i < 3; i++) {
      const notification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
      setTimeout(() => {
        triggers.notifySystem(
          `${notification.title} #${demoCount + i + 1}`,
          notification.description,
          notification.priority
        )
      }, i * 1000)
    }

    setDemoCount(prev => prev + 3)
  }

  // Trigger specific notification types
  const triggerInvestmentNotification = () => {
    triggers.notifyInvestmentSuccess('Downtown Office Complex', 75000)
  }

  const triggerKYCNotification = (status: 'pending' | 'approved' | 'rejected') => {
    triggers.notifyKYCUpdate(status)
  }

  const triggerPropertyNotification = () => {
    triggers.notifyPropertyUpdate('Riverside Apartments', 'Funding milestone reached: 80% completed')
  }

  const triggerPaymentNotification = (type: 'received' | 'pending' | 'failed') => {
    triggers.notifyPayment(type, Math.floor(Math.random() * 10000) + 1000)
  }

  const triggerDocumentNotification = (action: 'uploaded' | 'signed' | 'expired') => {
    triggers.notifyDocument('Investment Agreement - Property #' + Math.floor(Math.random() * 100), action)
  }

  const triggerHighPriorityNotification = () => {
    triggers.notifySystem(
      'Critical Security Alert',
      'Unusual login activity detected from new device. Please verify your account.',
      'urgent'
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notification System Test
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive testing interface for the PropertyChain notification system.
            Test all components, triggers, and real-time functionality.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Notifications</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Unread Count</p>
                  <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Demo Generated</p>
                  <p className="text-2xl font-bold text-green-600">{demoCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">System Status</p>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Generate test notifications and manage the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={generateDemoNotifications} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Generate Random (3x)
              </Button>
              <Button onClick={triggerHighPriorityNotification} variant="destructive" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Urgent Alert
              </Button>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Mark All Read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button onClick={clearAll} variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Trigger Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Notification Type Triggers
            </CardTitle>
            <CardDescription>
              Test specific notification types and priorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Investment Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Investment
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={triggerInvestmentNotification}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Investment Success
                  </Button>
                </div>
              </div>

              {/* KYC Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  KYC Verification
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => triggerKYCNotification('pending')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    KYC Pending
                  </Button>
                  <Button
                    onClick={() => triggerKYCNotification('approved')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    KYC Approved
                  </Button>
                  <Button
                    onClick={() => triggerKYCNotification('rejected')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    KYC Rejected
                  </Button>
                </div>
              </div>

              {/* Property Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  Property Updates
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={triggerPropertyNotification}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Property Update
                  </Button>
                </div>
              </div>

              {/* Payment Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Payments
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => triggerPaymentNotification('received')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Payment Received
                  </Button>
                  <Button
                    onClick={() => triggerPaymentNotification('pending')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Payment Pending
                  </Button>
                  <Button
                    onClick={() => triggerPaymentNotification('failed')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Payment Failed
                  </Button>
                </div>
              </div>

              {/* Document Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Documents
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => triggerDocumentNotification('uploaded')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Doc Uploaded
                  </Button>
                  <Button
                    onClick={() => triggerDocumentNotification('signed')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Doc Signed
                  </Button>
                  <Button
                    onClick={() => triggerDocumentNotification('expired')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Doc Expired
                  </Button>
                </div>
              </div>

              {/* System Notifications */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  System
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => triggers.notifySystem('System Update', 'New features have been deployed.', 'low')}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    System Update
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Demos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Component Demonstrations
            </CardTitle>
            <CardDescription>
              Interactive demos of all notification components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="bell">Notification Bell</TabsTrigger>
                <TabsTrigger value="center">Notification Center</TabsTrigger>
                <TabsTrigger value="sheet">Mobile Sheet</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="bell" className="space-y-4">
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Notification Bell Component</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Click the bell to open the notification popover with real-time updates
                  </p>
                  
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Default Size</p>
                      <NotificationBell />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">With Label</p>
                      <NotificationBell showLabel />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Large Size</p>
                      <NotificationBell size="lg" />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Features:</strong> Real-time WebSocket integration, unread count badge, 
                      search & filtering, mark as read/unread, grouped by type
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="center" className="space-y-4">
                <div className="border rounded-lg">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold">Full Notification Center</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete notification management interface with grouping, search, and bulk actions
                    </p>
                  </div>
                  <div className="p-4">
                    <NotificationCenter />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sheet" className="space-y-4">
                <div className="text-center p-8 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Mobile Notification Sheet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Mobile-optimized slide-out notification panel
                  </p>
                  
                  <NotificationSheet>
                    <Button variant="outline" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Open Mobile Sheet
                    </Button>
                  </NotificationSheet>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Features:</strong> Mobile-first design, full-screen on small devices,
                      swipe-to-dismiss gestures, optimized touch targets
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="border rounded-lg">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold">Notification Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure notification preferences and delivery methods
                    </p>
                  </div>
                  <div className="p-4">
                    <NotificationSettings />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Real-time WebSocket integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Notification grouping by type
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Priority-based sorting
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Search and filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Mark as read/unread
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Persistent storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
                    Mobile-responsive design
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Components</h4>
                <ul className="space-y-2 text-sm">
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationBell</code> - Header bell button</li>
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationCenter</code> - Full page interface</li>
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationSheet</code> - Mobile slide-out</li>
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationSettings</code> - Preference management</li>
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationItem</code> - Individual notifications</li>
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationGroup</code> - Grouped display</li>
                  <li><code className="text-xs bg-gray-100 px-1 rounded">NotificationFilters</code> - Filter controls</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}