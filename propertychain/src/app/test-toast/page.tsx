/**
 * Toast System Test Page - PropertyChain
 * Tests various toast notifications and configurations
 */

'use client'

import { useState } from 'react'
import { 
  toast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastLoading,
  toastPromise,
  toastCustom,
  investmentToasts,
  transactionToasts,
  propertyToasts,
  securityToasts,
  utilityToasts,
} from '@/lib/toast'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DollarSign,
  Building2,
  Shield,
  Copy,
  Download,
  Upload,
  Share2,
  Bell,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Wallet,
  Heart,
  Zap,
} from 'lucide-react'

export default function TestToastPage() {
  const { toast: shadcnToast } = useToast()
  const [customMessage, setCustomMessage] = useState('Custom toast message')
  const [customDescription, setCustomDescription] = useState('Additional description')
  const [duration, setDuration] = useState(4000)
  const [loadingToastId, setLoadingToastId] = useState<string | number | undefined>()

  // Simulate async operation
  const simulateAsyncOperation = (success: boolean = true, delay: number = 2000): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve('Operation completed successfully!')
        } else {
          reject(new Error('Operation failed!'))
        }
      }, delay)
    })
  }

  // Promise toast example
  const handlePromiseToast = () => {
    toastPromise(
      simulateAsyncOperation(true, 3000),
      {
        loading: 'Processing your request...',
        success: (data) => `Success: ${data}`,
        error: (error) => `Error: ${error.message}`,
      }
    )
  }

  // Loading toast with manual dismiss
  const handleLoadingToast = () => {
    const id = toastLoading('Loading data...')
    setLoadingToastId(id)
    
    setTimeout(() => {
      toast.dismiss(id)
      toastSuccess('Data loaded successfully!')
    }, 3000)
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Toast System Test</h1>
        <p className="text-muted-foreground">
          Testing enhanced toast notifications with Sonner
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Toasts</TabsTrigger>
          <TabsTrigger value="specialized">Specialized</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="promise">Async</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Basic Toasts Tab */}
        <TabsContent value="basic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Standard Notifications</CardTitle>
                <CardDescription>Basic toast types with icons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => toastSuccess('Operation completed successfully!')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Success Toast
                </Button>
                
                <Button
                  onClick={() => toastError('Something went wrong!', {
                    description: 'Please try again later'
                  })}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                  Error Toast
                </Button>
                
                <Button
                  onClick={() => toastWarning('Warning: Limited availability', {
                    description: 'Only 5 items left in stock'
                  })}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  Warning Toast
                </Button>
                
                <Button
                  onClick={() => toastInfo('New features available', {
                    description: 'Check out the latest updates'
                  })}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Info className="mr-2 h-4 w-4 text-blue-500" />
                  Info Toast
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Toasts</CardTitle>
                <CardDescription>Toasts with action buttons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => toastSuccess('File saved', {
                    action: {
                      label: 'Open',
                      onClick: () => console.log('Opening file...'),
                    }
                  })}
                  className="w-full"
                  variant="outline"
                >
                  Toast with Action
                </Button>
                
                <Button
                  onClick={() => toastError('Upload failed', {
                    description: 'File size exceeds limit',
                    action: {
                      label: 'Retry',
                      onClick: () => console.log('Retrying upload...'),
                    }
                  })}
                  className="w-full"
                  variant="outline"
                >
                  Error with Retry
                </Button>
                
                <Button
                  onClick={() => toastInfo('Update available', {
                    description: 'Version 2.0 is now available',
                    action: {
                      label: 'Update Now',
                      onClick: () => console.log('Starting update...'),
                    },
                    important: true,
                  })}
                  className="w-full"
                  variant="outline"
                >
                  Important Toast (Won't auto-dismiss)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Specialized Toasts Tab */}
        <TabsContent value="specialized">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Investment Toasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Investment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => investmentToasts.success('$5,000', 'Marina District')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Investment Success
                </Button>
                <Button
                  onClick={() => investmentToasts.pending('Downtown Towers')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Investment Pending
                </Button>
                <Button
                  onClick={() => investmentToasts.failed('Insufficient balance')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Investment Failed
                </Button>
                <Button
                  onClick={() => investmentToasts.returns('$1,250', '25%', true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Positive Returns
                </Button>
              </CardContent>
            </Card>

            {/* Transaction Toasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => transactionToasts.sent('0x1234567890abcdef1234567890abcdef12345678')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Transaction Sent
                </Button>
                <Button
                  onClick={() => transactionToasts.confirmed(12)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Transaction Confirmed
                </Button>
                <Button
                  onClick={() => transactionToasts.failed('Gas estimation failed')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Transaction Failed
                </Button>
              </CardContent>
            </Card>

            {/* Property Toasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => propertyToasts.added('Sunset Villa')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Property Added
                </Button>
                <Button
                  onClick={() => propertyToasts.updated()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Property Updated
                </Button>
                <Button
                  onClick={() => propertyToasts.removed()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Property Removed
                </Button>
                <Button
                  onClick={() => propertyToasts.favorited('Ocean View Condo')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Property Favorited
                </Button>
              </CardContent>
            </Card>

            {/* Security Toasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => securityToasts.twoFactorEnabled()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  2FA Enabled
                </Button>
                <Button
                  onClick={() => securityToasts.passwordChanged()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Password Changed
                </Button>
                <Button
                  onClick={() => securityToasts.sessionExpired()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Session Expired
                </Button>
                <Button
                  onClick={() => securityToasts.suspiciousActivity()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Suspicious Activity
                </Button>
              </CardContent>
            </Card>

            {/* Utility Toasts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Utilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => utilityToasts.copied('0x1234...5678')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copied
                </Button>
                <Button
                  onClick={() => {
                    const id = utilityToasts.downloading('report.pdf')
                    setTimeout(() => {
                      toast.dismiss(id)
                      utilityToasts.downloaded('report.pdf')
                    }, 2000)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    const id = utilityToasts.uploading('document.pdf')
                    setTimeout(() => {
                      toast.dismiss(id)
                      utilityToasts.uploaded('document.pdf')
                    }, 2000)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Upload className="mr-2 h-3 w-3" />
                  Upload
                </Button>
                <Button
                  onClick={() => utilityToasts.shared()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Share2 className="mr-2 h-3 w-3" />
                  Share
                </Button>
              </CardContent>
            </Card>

            {/* Notification Toast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => utilityToasts.notification(
                    'New Investment Opportunity',
                    'Marina Bay Towers is now open for investment'
                  )}
                  className="w-full"
                  variant="outline"
                >
                  Show Notification
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Toast Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Toast Builder</CardTitle>
              <CardDescription>Create your own custom styled toast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter message"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration (ms)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1000}
                  max={10000}
                  step={500}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => toastCustom(customMessage, {
                    title: 'Custom Toast',
                    description: customDescription,
                    icon: <Heart className="h-5 w-5 text-pink-500" />,
                    duration,
                    action: {
                      label: 'Action',
                      onClick: () => console.log('Custom action clicked'),
                    }
                  })}
                >
                  Show Custom Toast
                </Button>

                <Button
                  onClick={() => toastCustom(customMessage, {
                    description: customDescription,
                    style: {
                      background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                      color: 'white',
                      border: 'none',
                    },
                    duration,
                  })}
                  variant="outline"
                >
                  Gradient Style
                </Button>

                <Button
                  onClick={() => toastCustom(customMessage, {
                    description: customDescription,
                    className: 'bg-gradient-to-r from-green-400 to-blue-500 text-white border-0',
                    duration,
                  })}
                  variant="outline"
                >
                  Custom Class
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promise/Async Tab */}
        <TabsContent value="promise">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Promise-based Toasts</CardTitle>
                <CardDescription>Handle async operations with toasts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handlePromiseToast}
                  className="w-full"
                  variant="outline"
                >
                  <Loader2 className="mr-2 h-4 w-4" />
                  Promise Toast (Success)
                </Button>

                <Button
                  onClick={() => {
                    toastPromise(
                      simulateAsyncOperation(false, 2000),
                      {
                        loading: 'Processing...',
                        success: 'Should not show',
                        error: (err) => `Failed: ${err.message}`,
                      }
                    )
                  }}
                  className="w-full"
                  variant="outline"
                >
                  Promise Toast (Error)
                </Button>

                <Button
                  onClick={handleLoadingToast}
                  className="w-full"
                  variant="outline"
                >
                  Loading with Manual Dismiss
                </Button>

                {loadingToastId && (
                  <Button
                    onClick={() => {
                      toast.dismiss(loadingToastId)
                      setLoadingToastId(undefined)
                    }}
                    className="w-full"
                    variant="destructive"
                  >
                    Dismiss Loading Toast
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>shadcn/ui Toast</CardTitle>
                <CardDescription>Original toast hook for comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => {
                    shadcnToast({
                      title: 'Scheduled: Catch up',
                      description: 'Friday, February 10, 2023 at 5:57 PM',
                    })
                  }}
                  className="w-full"
                  variant="outline"
                >
                  shadcn Toast (Default)
                </Button>

                <Button
                  onClick={() => {
                    shadcnToast({
                      title: 'Uh oh! Something went wrong.',
                      description: 'There was a problem with your request.',
                      variant: 'destructive',
                    })
                  }}
                  className="w-full"
                  variant="outline"
                >
                  shadcn Toast (Destructive)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Toast Configuration</CardTitle>
              <CardDescription>Current toast system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Position</h3>
                    <Badge>top-right</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Default Duration</h3>
                    <Badge>4000ms</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Max Visible</h3>
                    <Badge>3 toasts</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Theme</h3>
                    <Badge>Auto (follows system)</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Rich colors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Close button</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Pause on hover</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Action buttons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom styling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Promise support</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Section 7.2 Compliance</h3>
                  <ul className="space-y-2 text-sm">
                    <li>✅ Sonner integration as specified</li>
                    <li>✅ Position: top-right</li>
                    <li>✅ Custom styling with theme support</li>
                    <li>✅ Success/error/warning/info variants</li>
                    <li>✅ Action button support</li>
                    <li>✅ Duration control</li>
                    <li>✅ Important flag for persistent toasts</li>
                    <li>✅ Loading states with promises</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}