/**
 * Modal System Test Page - PropertyChain
 * Tests various modal components and configurations
 */

'use client'

import { useState } from 'react'
import {
  BaseModal,
  ConfirmModal,
  AlertModal,
  CommandModal,
  MediaGalleryModal,
  FormModal,
  QuickActionModal,
} from '@/components/custom/modals'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  Building2,
  DollarSign,
  FileText,
  Settings,
  Share2,
  Download,
  Copy,
  Trash2,
  Edit,
  Plus,
  Search,
  Home,
  User,
  HelpCircle,
  LogOut,
  CreditCard,
  Wallet,
  TrendingUp,
  Image as ImageIcon,
  Film,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react'

// Mock media data for gallery
const mockMedia = [
  {
    id: '1',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
    title: 'Luxury Apartment',
    description: 'Modern downtown luxury apartment with city views',
  },
  {
    id: '2',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200',
    title: 'Beautiful House',
    description: 'Spacious family home in quiet neighborhood',
  },
  {
    id: '3',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    title: 'Office Building',
    description: 'Prime commercial real estate opportunity',
  },
  {
    id: '4',
    type: 'video' as const,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Property Tour',
    description: 'Virtual walkthrough of the property',
  },
]

// Command palette commands
const commandItems = [
  {
    group: 'Navigation',
    items: [
      { icon: <Home className="h-4 w-4" />, label: 'Go to Dashboard', shortcut: '⌘D', onSelect: () => console.log('Dashboard') },
      { icon: <Building2 className="h-4 w-4" />, label: 'Browse Properties', shortcut: '⌘P', onSelect: () => console.log('Properties') },
      { icon: <DollarSign className="h-4 w-4" />, label: 'View Investments', shortcut: '⌘I', onSelect: () => console.log('Investments') },
    ],
  },
  {
    group: 'Actions',
    items: [
      { icon: <Plus className="h-4 w-4" />, label: 'New Investment', shortcut: '⌘N', onSelect: () => console.log('New Investment') },
      { icon: <Search className="h-4 w-4" />, label: 'Search Properties', shortcut: '⌘K', onSelect: () => console.log('Search') },
      { icon: <Settings className="h-4 w-4" />, label: 'Settings', shortcut: '⌘,', onSelect: () => console.log('Settings') },
    ],
  },
  {
    group: 'Account',
    items: [
      { icon: <User className="h-4 w-4" />, label: 'Profile', onSelect: () => console.log('Profile') },
      { icon: <HelpCircle className="h-4 w-4" />, label: 'Help & Support', onSelect: () => console.log('Help') },
      { icon: <LogOut className="h-4 w-4" />, label: 'Sign Out', onSelect: () => console.log('Sign Out') },
    ],
  },
]

// Quick actions
const quickActions = [
  {
    icon: <Copy className="h-4 w-4" />,
    label: 'Copy Link',
    description: 'Copy property link to clipboard',
    onClick: () => console.log('Copy'),
  },
  {
    icon: <Share2 className="h-4 w-4" />,
    label: 'Share',
    description: 'Share via email or social media',
    onClick: () => console.log('Share'),
  },
  {
    icon: <Download className="h-4 w-4" />,
    label: 'Download',
    description: 'Download property documents',
    onClick: () => console.log('Download'),
  },
  {
    icon: <Edit className="h-4 w-4" />,
    label: 'Edit',
    description: 'Edit property details',
    onClick: () => console.log('Edit'),
  },
  {
    icon: <Trash2 className="h-4 w-4" />,
    label: 'Delete',
    description: 'Remove from portfolio',
    onClick: () => console.log('Delete'),
    variant: 'destructive' as const,
  },
]

// Form steps for multi-step modal
const formSteps = [
  {
    title: 'Property Details',
    description: 'Select the property you want to invest in',
    content: (
      <div className="space-y-4">
        <div>
          <Label htmlFor="property">Property Name</Label>
          <Input id="property" placeholder="Select a property" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="type">Property Type</Label>
          <Input id="type" placeholder="Residential, Commercial, etc." className="mt-2" />
        </div>
      </div>
    ),
  },
  {
    title: 'Investment Amount',
    description: 'Specify how much you want to invest',
    content: (
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Investment Amount ($)</Label>
          <Input id="amount" type="number" placeholder="5000" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="percentage">Portfolio Percentage</Label>
          <Input id="percentage" type="number" placeholder="25" className="mt-2" />
        </div>
      </div>
    ),
  },
  {
    title: 'Review & Confirm',
    description: 'Review your investment details',
    content: (
      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Property:</span>
            <span className="text-sm font-medium">Marina District Apartments</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="text-sm font-medium">$5,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expected Return:</span>
            <span className="text-sm font-medium text-green-600">12.5% APY</span>
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-sm text-amber-800">
            By confirming, you agree to our investment terms and conditions.
          </p>
        </div>
      </div>
    ),
  },
]

export default function TestModalsPage() {
  const { toast } = useToast()
  const [baseModalOpen, setBaseModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [alertModalOpen, setAlertModalOpen] = useState<string | null>(null)
  const [commandModalOpen, setCommandModalOpen] = useState(false)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>('sm')

  const handleConfirm = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast({
      title: 'Action Confirmed',
      description: 'The operation was successful.',
    })
  }

  const handleDelete = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast({
      title: 'Item Deleted',
      description: 'The item has been removed.',
      variant: 'destructive',
    })
  }

  const handleFormComplete = async (data: any) => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast({
      title: 'Investment Submitted',
      description: 'Your investment has been processed successfully.',
    })
    console.log('Form data:', data)
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Modal System Test</h1>
        <p className="text-muted-foreground">
          Testing various modal components with shadcn Dialog
        </p>
      </div>

      {/* Modal Size Control */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Modal Size Control</CardTitle>
          <CardDescription>Select size for base modal demonstration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
              <Button
                key={size}
                variant={modalSize === size ? 'default' : 'outline'}
                size="sm"
                onClick={() => setModalSize(size)}
              >
                {size.toUpperCase()} ({size === 'xs' ? '320px' : size === 'sm' ? '480px' : size === 'md' ? '640px' : size === 'lg' ? '800px' : size === 'xl' ? '1024px' : '90vw'})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Examples Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Base Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Base Modal</CardTitle>
            <CardDescription>Standard modal with size variants</CardDescription>
          </CardHeader>
          <CardContent>
            <BaseModal
              open={baseModalOpen}
              onOpenChange={setBaseModalOpen}
              trigger={<Button className="w-full">Open Base Modal</Button>}
              title="Property Investment Details"
              description="Review the details of this investment opportunity"
              size={modalSize}
              footer={
                <>
                  <Button variant="outline" onClick={() => setBaseModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast({ title: 'Saved!', description: 'Your changes have been saved.' })
                    setBaseModalOpen(false)
                  }}>
                    Save Changes
                  </Button>
                </>
              }
            >
              <div className="space-y-4 py-4">
                <div>
                  <Label>Property Name</Label>
                  <Input placeholder="Marina District Apartments" className="mt-2" />
                </div>
                <div>
                  <Label>Investment Amount</Label>
                  <Input type="number" placeholder="5000" className="mt-2" />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea placeholder="Add any notes..." className="mt-2" />
                </div>
              </div>
            </BaseModal>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Confirmation Modal</CardTitle>
            <CardDescription>For important actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ConfirmModal
              open={confirmModalOpen}
              onOpenChange={setConfirmModalOpen}
              trigger={<Button className="w-full">Confirm Action</Button>}
              title="Confirm Investment"
              description="Are you sure you want to invest $5,000 in Marina District Apartments? This action cannot be undone."
              confirmText="Yes, Invest"
              cancelText="Cancel"
              onConfirm={handleConfirm}
            />
            
            <ConfirmModal
              open={deleteModalOpen}
              onOpenChange={setDeleteModalOpen}
              trigger={
                <Button variant="destructive" className="w-full">
                  Delete Item
                </Button>
              }
              title="Delete Property"
              description="This will permanently delete the property from your portfolio. This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={handleDelete}
              variant="destructive"
            />
          </CardContent>
        </Card>

        {/* Alert Modals */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Modals</CardTitle>
            <CardDescription>Different alert types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <AlertModal
              open={alertModalOpen === 'info'}
              onOpenChange={(open) => setAlertModalOpen(open ? 'info' : null)}
              trigger={
                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  Info Alert
                </Button>
              }
              type="info"
              title="Information"
              description="This property has been verified by our team and meets all investment criteria."
            />

            <AlertModal
              open={alertModalOpen === 'success'}
              onOpenChange={(open) => setAlertModalOpen(open ? 'success' : null)}
              trigger={
                <Button variant="outline" className="w-full text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Success Alert
                </Button>
              }
              type="success"
              title="Investment Successful!"
              description="Your investment of $5,000 has been processed successfully."
            />

            <AlertModal
              open={alertModalOpen === 'warning'}
              onOpenChange={(open) => setAlertModalOpen(open ? 'warning' : null)}
              trigger={
                <Button variant="outline" className="w-full text-amber-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Warning Alert
                </Button>
              }
              type="warning"
              title="Limited Availability"
              description="Only 10% of tokens remain available for this property."
            />

            <AlertModal
              open={alertModalOpen === 'error'}
              onOpenChange={(open) => setAlertModalOpen(open ? 'error' : null)}
              trigger={
                <Button variant="outline" className="w-full text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Error Alert
                </Button>
              }
              type="error"
              title="Transaction Failed"
              description="Unable to process your investment. Please check your wallet balance and try again."
            />
          </CardContent>
        </Card>

        {/* Command Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Command Palette</CardTitle>
            <CardDescription>Quick navigation and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <CommandModal
              open={commandModalOpen}
              onOpenChange={setCommandModalOpen}
              trigger={
                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Open Command Palette
                </Button>
              }
              commands={commandItems}
            />
          </CardContent>
        </Card>

        {/* Media Gallery Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Media Gallery</CardTitle>
            <CardDescription>Image and video gallery</CardDescription>
          </CardHeader>
          <CardContent>
            <MediaGalleryModal
              open={galleryModalOpen}
              onOpenChange={setGalleryModalOpen}
              trigger={
                <Button className="w-full">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Open Gallery
                </Button>
              }
              title="Property Media"
              media={mockMedia}
              initialIndex={0}
            />
          </CardContent>
        </Card>

        {/* Form Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Step Form</CardTitle>
            <CardDescription>Step-by-step process</CardDescription>
          </CardHeader>
          <CardContent>
            <FormModal
              open={formModalOpen}
              onOpenChange={setFormModalOpen}
              trigger={
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Investment
                </Button>
              }
              title="New Investment"
              description="Complete the following steps to make an investment"
              steps={formSteps}
              onComplete={handleFormComplete}
              size="md"
            />
          </CardContent>
        </Card>

        {/* Quick Action Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Context menu style</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActionModal
              open={quickActionModalOpen}
              onOpenChange={setQuickActionModalOpen}
              trigger={
                <Button className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Property Actions
                </Button>
              }
              title="Property Actions"
              actions={quickActions}
            />
          </CardContent>
        </Card>
      </div>

      {/* Feature Checklist */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Step 19 Features Implemented</CardTitle>
          <CardDescription>Modal system specifications from Section 7</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-3">Modal Types</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ BaseModal - Standard with size variants</li>
                <li>✅ ConfirmModal - Confirmation dialogs</li>
                <li>✅ AlertModal - Info/Success/Warning/Error</li>
                <li>✅ CommandModal - Command palette/search</li>
                <li>✅ MediaGalleryModal - Image/video gallery</li>
                <li>✅ FormModal - Multi-step forms</li>
                <li>✅ QuickActionModal - Context actions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Size variants (xs, sm, md, lg, xl, full)</li>
                <li>✅ Standard sizes: 480px, 640px, 800px</li>
                <li>✅ Mobile: Full screen with Sheet</li>
                <li>✅ Focus trap built-in</li>
                <li>✅ ESC key handling</li>
                <li>✅ Loading states</li>
                <li>✅ Animations with Framer Motion</li>
                <li>✅ Backdrop click to close</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Section 7 Compliance</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ shadcn Dialog as base component</li>
              <li>✅ AlertDialog for confirmations</li>
              <li>✅ Sheet for mobile full-screen</li>
              <li>✅ CommandDialog for search</li>
              <li>✅ Standard modal sizes (480px, 640px, 800px)</li>
              <li>✅ Focus management and keyboard navigation</li>
              <li>✅ Smooth animations (200ms transitions)</li>
              <li>✅ Accessibility with ARIA attributes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}