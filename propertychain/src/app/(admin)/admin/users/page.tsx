/**
 * User Management Page - PropertyChain Admin
 * 
 * Main page for managing all users in the platform
 * Following UpdatedUIPlan.md Step 55.3 specifications and CLAUDE.md principles
 */

import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserTable, type User } from '@/components/admin/users/user-table'
import { KYCVerificationCenter } from '@/components/admin/users/kyc-verification-center'
import { CommunicationCenter } from '@/components/admin/users/communication-center'
import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  Shield,
  Mail,
  UserCheck,
  UserX,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Upload,
  Settings,
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
function generateSampleUsers(): User[] {
  const names = [
    'John Smith', 'Emily Chen', 'Michael Brown', 'Sarah Wilson', 'David Lee',
    'Jessica Taylor', 'Robert Johnson', 'Lisa Anderson', 'James Martinez', 'Maria Garcia'
  ]
  
  const cities = [
    { city: 'San Francisco', country: 'USA' },
    { city: 'New York', country: 'USA' },
    { city: 'London', country: 'UK' },
    { city: 'Tokyo', country: 'Japan' },
    { city: 'Singapore', country: 'Singapore' },
  ]
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length] + ` ${i}`,
    email: `user${i + 1}@example.com`,
    phone: `+1 555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    role: ['INVESTOR', 'PROPERTY_OWNER', 'ADMIN'][Math.floor(Math.random() * 3)] as any,
    kycStatus: ['NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'][Math.floor(Math.random() * 5)] as any,
    investmentTotal: Math.floor(Math.random() * 1000000),
    propertiesOwned: Math.floor(Math.random() * 10),
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    accountCreated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    status: ['active', 'suspended', 'banned'][Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0] as any,
    emailVerified: Math.random() > 0.3,
    twoFactorEnabled: Math.random() > 0.5,
    location: Math.random() > 0.3 ? cities[Math.floor(Math.random() * cities.length)] : undefined,
    investorType: ['individual', 'entity', 'institutional'][Math.floor(Math.random() * 3)] as any,
    activityLevel: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
    riskScore: Math.floor(Math.random() * 100),
    documents: {
      submitted: Math.floor(Math.random() * 10),
      verified: Math.floor(Math.random() * 8),
    },
  }))
}

function generateKYCSubmissions() {
  const pendingUsers = generateSampleUsers()
    .filter(u => u.kycStatus === 'PENDING_REVIEW')
    .slice(0, 15)
  
  return pendingUsers.map((user, i) => ({
    id: `kyc-${i + 1}`,
    userId: user.id,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      location: user.location,
      accountCreated: user.accountCreated,
      previousSubmissions: Math.floor(Math.random() * 3),
    },
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    status: 'pending' as const,
    documents: [
      {
        id: 'doc-1',
        type: 'id_front' as const,
        name: 'ID Front.jpg',
        url: 'https://via.placeholder.com/800x600',
        uploadedAt: new Date(),
      },
      {
        id: 'doc-2',
        type: 'id_back' as const,
        name: 'ID Back.jpg',
        url: 'https://via.placeholder.com/800x600',
        uploadedAt: new Date(),
      },
      {
        id: 'doc-3',
        type: 'selfie' as const,
        name: 'Selfie.jpg',
        url: 'https://via.placeholder.com/600x800',
        uploadedAt: new Date(),
      },
      {
        id: 'doc-4',
        type: 'address_proof' as const,
        name: 'Utility Bill.pdf',
        url: '#',
        uploadedAt: new Date(),
      },
    ],
    automatedChecks: {
      documentAuthenticity: { passed: Math.random() > 0.3, confidence: 85 + Math.random() * 15 },
      faceMatch: { passed: Math.random() > 0.2, confidence: 75 + Math.random() * 25 },
      addressVerification: { passed: Math.random() > 0.3, confidence: 80 + Math.random() * 20 },
      sanctionsCheck: { passed: Math.random() > 0.1, confidence: 95 + Math.random() * 5 },
      ageVerification: { passed: Math.random() > 0.1, confidence: 90 + Math.random() * 10 },
      duplicateCheck: { passed: Math.random() > 0.2, confidence: 88 + Math.random() * 12 },
    },
    manualChecks: {
      documentsComplete: Math.random() > 0.3,
      documentsLegible: Math.random() > 0.2,
      informationMatches: Math.random() > 0.3,
      noSuspiciousActivity: Math.random() > 0.1,
      identityConfirmed: false,
    },
    riskScore: Math.floor(Math.random() * 100),
    notes: [],
    previousActions: [],
  }))
}

export default async function UserManagementPage() {
  // Verify admin access
  const session = await getServerSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  // Fetch data (using sample data for now)
  const allUsers = generateSampleUsers()
  const kycSubmissions = generateKYCSubmissions()
  
  // Calculate statistics
  const stats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => u.status === 'active').length,
    verifiedUsers: allUsers.filter(u => u.kycStatus === 'APPROVED').length,
    pendingKYC: allUsers.filter(u => u.kycStatus === 'PENDING_REVIEW').length,
    totalInvestment: allUsers.reduce((sum, u) => sum + u.investmentTotal, 0),
    highActivityUsers: allUsers.filter(u => u.activityLevel === 'high').length,
    suspendedUsers: allUsers.filter(u => u.status === 'suspended').length,
    bannedUsers: allUsers.filter(u => u.status === 'banned').length,
  }
  
  // Calculate growth metrics
  const newUsersThisMonth = allUsers.filter(u => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return u.accountCreated > thirtyDaysAgo
  }).length
  
  const growthRate = ((newUsersThisMonth / stats.totalUsers) * 100).toFixed(1)
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 mt-2">
            Manage users, KYC verification, and communications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Users
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>{growthRate}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              +{newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              KYC Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.verifiedUsers}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(0)}%
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.pendingKYC} pending review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-xl font-bold">
                ${(stats.totalInvestment / 1000000).toFixed(1)}M
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Avg: ${(stats.totalInvestment / stats.totalUsers).toFixed(0)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.highActivityUsers}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                High Activity
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts Section */}
      {stats.pendingKYC > 10 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{stats.pendingKYC} KYC submissions</strong> are pending review. 
            Process these to maintain compliance and enable user investments.
          </AlertDescription>
        </Alert>
      )}
      
      {(stats.suspendedUsers > 0 || stats.bannedUsers > 0) && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{stats.suspendedUsers + stats.bannedUsers} users</strong> have restricted access 
            ({stats.suspendedUsers} suspended, {stats.bannedUsers} banned).
          </AlertDescription>
        </Alert>
      )}
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="all" className="gap-2">
            <Users className="h-4 w-4" />
            All Users
            <Badge variant="secondary" className="ml-1">
              {stats.totalUsers}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="kyc" className="gap-2">
            <Shield className="h-4 w-4" />
            KYC Verification
            {stats.pendingKYC > 0 && (
              <Badge variant="destructive" className="ml-1">
                {stats.pendingKYC}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="communication" className="gap-2">
            <Mail className="h-4 w-4" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* All Users Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Database</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {stats.activeUsers} Active
                  </Badge>
                  <Badge variant="outline">
                    {stats.verifiedUsers} Verified
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TableSkeleton />}>
                <UserTable 
                  users={allUsers}
                  onUserUpdate={(user) => {
                    console.log('Update user:', user)
                  }}
                  onBulkAction={(action, userIds) => {
                    console.log('Bulk action:', action, userIds)
                  }}
                />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* KYC Verification Tab */}
        <TabsContent value="kyc">
          <Suspense fallback={<TableSkeleton />}>
            <KYCVerificationCenter
              submissions={kycSubmissions}
              onApprove={(id, notes) => {
                console.log('Approve KYC:', id, notes)
              }}
              onReject={(id, reason) => {
                console.log('Reject KYC:', id, reason)
              }}
              onRequestInfo={(id, message) => {
                console.log('Request info:', id, message)
              }}
            />
          </Suspense>
        </TabsContent>
        
        {/* Communications Tab */}
        <TabsContent value="communication">
          <CommunicationCenter />
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <BarChart3 className="h-16 w-16 opacity-20" />
                  <p className="ml-4">Chart placeholder</p>
                </div>
              </CardContent>
            </Card>
            
            {/* KYC Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>KYC Completion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Started</span>
                      <span className="text-sm font-medium">100%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Documents Uploaded</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Under Review</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Verified</span>
                      <span className="text-sm font-medium">52%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '52%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium">High Activity</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.highActivityUsers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="font-medium">Medium Activity</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {allUsers.filter(u => u.activityLevel === 'medium').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium">Low Activity</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {allUsers.filter(u => u.activityLevel === 'low').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Investment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-500">$0 - $10K</p>
                    <p className="text-xl font-bold">
                      {allUsers.filter(u => u.investmentTotal < 10000).length} users
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-500">$10K - $100K</p>
                    <p className="text-xl font-bold">
                      {allUsers.filter(u => u.investmentTotal >= 10000 && u.investmentTotal < 100000).length} users
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-500">$100K+</p>
                    <p className="text-xl font-bold">
                      {allUsers.filter(u => u.investmentTotal >= 100000).length} users
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}