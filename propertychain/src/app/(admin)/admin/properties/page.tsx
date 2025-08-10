/**
 * Property Management Page - PropertyChain Admin
 * 
 * Main page for managing all properties in the platform
 * Following UpdatedUIPlan.md Step 55.2 specifications and CLAUDE.md principles
 */

import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PropertyTable, type Property } from '@/components/admin/properties/property-table'
import { ApprovalQueue } from '@/components/admin/properties/approval-queue'
import { PropertyWizard } from '@/components/admin/properties/property-wizard'
import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

// Loading components
function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

// Generate sample data (in production, fetch from database)
function generateSampleProperties(): Property[] {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `prop-${i + 1}`,
    name: `Property ${i + 1}`,
    address: `${100 + i} Main Street, City, State`,
    status: ['draft', 'pending', 'active', 'paused', 'completed'][Math.floor(Math.random() * 5)] as Property['status'],
    fundingProgress: Math.random() * 100,
    targetAmount: 1000000 + Math.random() * 4000000,
    raisedAmount: 500000 + Math.random() * 2000000,
    investorsCount: Math.floor(Math.random() * 500),
    roi: 8 + Math.random() * 12,
    yield: 5 + Math.random() * 8,
    createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    owner: {
      id: `owner-${Math.floor(Math.random() * 20)}`,
      name: ['John Smith', 'Emily Chen', 'Michael Brown'][Math.floor(Math.random() * 3)],
      email: `owner${i}@example.com`,
    },
    type: ['residential', 'commercial', 'industrial', 'land'][Math.floor(Math.random() * 4)] as Property['type'],
    featured: Math.random() > 0.7,
    verified: Math.random() > 0.3,
  }))
}

function generatePendingProperties() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `pending-${i + 1}`,
    name: `Pending Property ${i + 1}`,
    address: `${200 + i} Oak Avenue, City, State`,
    type: ['residential', 'commercial', 'industrial', 'land'][Math.floor(Math.random() * 4)] as any,
    price: 1000000 + Math.random() * 4000000,
    tokenPrice: 100 + Math.random() * 400,
    totalTokens: 10000 + Math.floor(Math.random() * 40000),
    owner: {
      id: `owner-${i}`,
      name: ['Sarah Wilson', 'David Lee', 'Jessica Taylor'][i % 3],
      email: `owner${i}@example.com`,
      verificationStatus: ['verified', 'pending', 'unverified'][Math.floor(Math.random() * 3)] as any,
    },
    documents: Array.from({ length: 5 }, (_, j) => ({
      id: `doc-${i}-${j}`,
      type: ['Property Deed', 'Insurance', 'Inspection', 'Appraisal', 'Tax Records'][j],
      name: `Document ${j + 1}.pdf`,
      url: '#',
      verified: Math.random() > 0.3,
      uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    })),
    images: Array.from({ length: 8 }, () => `https://via.placeholder.com/400x300`),
    verificationChecks: {
      ownership: Math.random() > 0.3,
      valuation: Math.random() > 0.3,
      legalCompliance: Math.random() > 0.3,
      insurance: Math.random() > 0.3,
      inspection: Math.random() > 0.3,
      title: Math.random() > 0.3,
      zoning: Math.random() > 0.3,
      environmental: Math.random() > 0.3,
    },
    submittedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
    notes: [
      {
        id: '1',
        author: 'Admin User',
        content: 'Initial review completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: 'info' as const,
      },
    ],
    status: 'pending' as const,
  }))
}

export default async function PropertyManagementPage() {
  // Verify admin access
  const session = await getServerSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  // Fetch data (using sample data for now)
  const allProperties = generateSampleProperties()
  const pendingProperties = generatePendingProperties()
  
  // Calculate statistics
  const stats = {
    total: allProperties.length,
    active: allProperties.filter(p => p.status === 'active').length,
    pending: allProperties.filter(p => p.status === 'pending').length,
    paused: allProperties.filter(p => p.status === 'paused').length,
    totalValue: allProperties.reduce((sum, p) => sum + p.targetAmount, 0),
    totalRaised: allProperties.reduce((sum, p) => sum + p.raisedAmount, 0),
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Management</h1>
          <p className="text-gray-500 mt-2">
            Manage all properties, approvals, and listings
          </p>
        </div>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{stats.active}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.pending}</span>
              {stats.pending > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Action Required
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Paused
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">{stats.paused}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-xl font-bold">
                ${(stats.totalValue / 1000000).toFixed(1)}M
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xl font-bold">
                ${(stats.totalRaised / 1000000).toFixed(1)}M
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Properties
            <Badge variant="secondary" className="ml-2">
              {stats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {stats.pending > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="add">
            Add Property
          </TabsTrigger>
        </TabsList>
        
        {/* All Properties Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TableSkeleton />}>
                <PropertyTable 
                  properties={allProperties}
                  onPropertyUpdate={(property) => {
                    console.log('Update property:', property)
                  }}
                  onBulkAction={(action, ids) => {
                    console.log('Bulk action:', action, ids)
                  }}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pending Approval Tab */}
        <TabsContent value="pending">
          <Suspense fallback={<TableSkeleton />}>
            <ApprovalQueue
              properties={pendingProperties}
              onApprove={(id, notes) => {
                console.log('Approve property:', id, notes)
              }}
              onReject={(id, reason) => {
                console.log('Reject property:', id, reason)
              }}
              onRequestInfo={(id, message) => {
                console.log('Request info:', id, message)
              }}
            />
          </Suspense>
        </TabsContent>
        
        {/* Add Property Tab */}
        <TabsContent value="add">
          <PropertyWizard
            onComplete={(data) => {
              console.log('Property created:', data)
              // Redirect to properties list
            }}
            onCancel={() => {
              // Go back to all properties
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}