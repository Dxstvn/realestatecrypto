/**
 * User Profile Test Page - PropertyChain
 * Tests all user profile components and features
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
  ProfileCard,
  AvatarUpload,
  ProfileSettingsPanel,
  ProfileActivityFeed,
  type UserProfile,
  type ProfileActivity,
} from '@/components/custom/user-profile'
import {
  UserDashboard,
  type Investment,
} from '@/components/custom/user-dashboard'
import {
  User,
  Users,
  Settings,
  Activity,
  TrendingUp,
  Home,
  DollarSign,
  Award,
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Building,
  Briefcase,
  Info,
  Camera,
  Edit,
  Heart,
  MessageSquare,
  Share,
  Eye,
  Target,
  CreditCard,
  Receipt,
} from 'lucide-react'
import { addDays, subDays, subMonths, addMonths } from 'date-fns'
import { toastSuccess, toastInfo, toastError } from '@/lib/toast'

// Mock user profile
const mockUserProfile: UserProfile = {
  id: 'user-123',
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John D.',
  bio: 'Real estate investor passionate about sustainable development and community building. Looking for opportunities in the Pacific Northwest.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  dateOfBirth: new Date('1985-06-15'),
  phone: '+1 (555) 123-4567',
  location: {
    city: 'Portland',
    state: 'Oregon',
    country: 'United States',
  },
  website: 'https://johndoe.com',
  socialMedia: {
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
  },
  preferences: {
    theme: 'system',
    language: 'en',
    timezone: 'PST',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showInvestments: true,
    },
  },
  verification: {
    email: true,
    phone: true,
    identity: true,
    accredited: false,
  },
  stats: {
    joinedDate: subMonths(new Date(), 18),
    lastActive: subDays(new Date(), 1),
    totalInvestments: 12,
    totalInvested: 485000,
    totalReturns: 62500,
    propertiesOwned: 5,
    averageROI: 12.8,
    riskTolerance: 'moderate',
  },
  subscription: {
    plan: 'premium',
    expiresAt: addMonths(new Date(), 6),
  },
}

// Mock investments
const mockInvestments: Investment[] = [
  {
    id: 'inv-1',
    propertyName: 'Downtown Portland Apartments',
    propertyType: 'apartment',
    location: 'Portland, OR',
    investedAmount: 125000,
    currentValue: 142000,
    roi: 13.6,
    monthlyReturn: 1850,
    status: 'active',
    startDate: subMonths(new Date(), 8),
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300'],
  },
  {
    id: 'inv-2',
    propertyName: 'Seattle Office Complex',
    propertyType: 'commercial',
    location: 'Seattle, WA',
    investedAmount: 200000,
    currentValue: 225000,
    roi: 12.5,
    monthlyReturn: 2750,
    status: 'active',
    startDate: subMonths(new Date(), 12),
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300'],
  },
  {
    id: 'inv-3',
    propertyName: 'Suburban Family Homes',
    propertyType: 'house',
    location: 'Beaverton, OR',
    investedAmount: 85000,
    currentValue: 92000,
    roi: 8.2,
    monthlyReturn: 1200,
    status: 'active',
    startDate: subMonths(new Date(), 6),
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300'],
  },
  {
    id: 'inv-4',
    propertyName: 'Tech Campus Development',
    propertyType: 'commercial',
    location: 'San Francisco, CA',
    investedAmount: 75000,
    currentValue: 68000,
    roi: -9.3,
    monthlyReturn: 950,
    status: 'pending',
    startDate: subDays(new Date(), 45),
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=300'],
  },
]

// Mock activities
const mockActivities: ProfileActivity[] = [
  {
    id: 'act-1',
    type: 'investment',
    title: 'New Investment',
    description: 'Invested $25,000 in Downtown Portland Apartments',
    timestamp: subDays(new Date(), 2),
    metadata: { amount: 25000, propertyId: 'prop-123' },
  },
  {
    id: 'act-2',
    type: 'transaction',
    title: 'Dividend Received',
    description: 'Received $1,850 dividend from Portland Apartments',
    timestamp: subDays(new Date(), 5),
    metadata: { amount: 1850, type: 'dividend' },
  },
  {
    id: 'act-3',
    type: 'property',
    title: 'Property Viewed',
    description: 'Viewed Seattle Waterfront Condos',
    timestamp: subDays(new Date(), 7),
    metadata: { propertyId: 'prop-456' },
  },
  {
    id: 'act-4',
    type: 'achievement',
    title: 'Milestone Reached',
    description: 'Reached $500K total investment milestone',
    timestamp: subDays(new Date(), 10),
    metadata: { milestone: '500k_invested' },
  },
  {
    id: 'act-5',
    type: 'social',
    title: 'Profile Update',
    description: 'Updated bio and investment preferences',
    timestamp: subDays(new Date(), 14),
  },
]

// Mock similar users
const mockSimilarUsers = [
  {
    ...mockUserProfile,
    id: 'user-456',
    username: 'sarahjohnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    displayName: 'Sarah J.',
    bio: 'Experienced real estate investor focused on sustainable properties',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    stats: {
      ...mockUserProfile.stats,
      totalInvestments: 8,
      totalInvested: 320000,
      averageROI: 15.2,
    },
  },
  {
    ...mockUserProfile,
    id: 'user-789',
    username: 'mikechen',
    firstName: 'Mike',
    lastName: 'Chen',
    displayName: 'Mike C.',
    bio: 'Tech professional investing in commercial real estate',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    verification: {
      ...mockUserProfile.verification,
      accredited: true,
    },
    stats: {
      ...mockUserProfile.stats,
      totalInvestments: 15,
      totalInvested: 750000,
      averageROI: 11.4,
    },
  },
]

export default function TestUserProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [profileView, setProfileView] = useState<'default' | 'compact' | 'detailed'>('default')

  const handleProfileSave = async (updates: Partial<UserProfile>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUserProfile(prev => ({ ...prev, ...updates }))
    toastSuccess('Profile updated successfully')
  }

  const handleAvatarUpload = async (file: File): Promise<string> => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    const url = URL.createObjectURL(file)
    setUserProfile(prev => ({ ...prev, avatar: url }))
    toastSuccess('Avatar updated successfully')
    return url
  }

  const handleAvatarRemove = () => {
    setUserProfile(prev => ({ ...prev, avatar: undefined }))
    toastInfo('Avatar removed')
  }

  const handleInvestmentClick = (investment: Investment) => {
    toastInfo(`Clicked investment: ${investment.propertyName}`)
  }

  const handleEditProfile = () => {
    toastInfo('Opening profile editor...')
  }

  const handleUserAction = (action: string, user?: UserProfile) => {
    if (user) {
      toastInfo(`${action} user: ${user.firstName} ${user.lastName}`)
    } else {
      toastInfo(`Action: ${action}`)
    }
  }

  // Stats calculations
  const totalUsers = mockSimilarUsers.length + 1
  const verifiedUsers = [userProfile, ...mockSimilarUsers].filter(u => u.verification.identity).length
  const accreditedUsers = [userProfile, ...mockSimilarUsers].filter(u => u.verification.accredited).length
  const averageInvestments = Math.round(
    [userProfile, ...mockSimilarUsers].reduce((sum, u) => sum + u.stats.totalInvestments, 0) / totalUsers
  )

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Profile Test</h1>
        <p className="text-muted-foreground">
          Testing user profile components with cards, settings, and dashboard
        </p>
      </div>

      {/* Profile Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{verifiedUsers}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Accredited Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{accreditedUsers}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">{averageInvestments}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile-cards">Profile Cards</TabsTrigger>
          <TabsTrigger value="avatar">Avatar Upload</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* User Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <UserDashboard
            user={userProfile}
            investments={mockInvestments}
            activities={mockActivities}
            onInvestmentClick={handleInvestmentClick}
            onEditProfile={handleEditProfile}
          />
        </TabsContent>

        {/* Profile Cards Tab */}
        <TabsContent value="profile-cards" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Card Variants</CardTitle>
                  <CardDescription>Different profile card layouts and styles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={profileView === 'default' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProfileView('default')}
                  >
                    Default
                  </Button>
                  <Button
                    variant={profileView === 'compact' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProfileView('compact')}
                  >
                    Compact
                  </Button>
                  <Button
                    variant={profileView === 'detailed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProfileView('detailed')}
                  >
                    Detailed
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ProfileCard
                  user={userProfile}
                  variant={profileView}
                  onEdit={() => handleUserAction('edit')}
                  onMessage={() => handleUserAction('message')}
                  onFollow={() => handleUserAction('follow')}
                />

                {profileView !== 'detailed' && (
                  <div>
                    <h3 className="font-semibold mb-4">Other Users</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {mockSimilarUsers.map(user => (
                        <ProfileCard
                          key={user.id}
                          user={user}
                          variant={profileView}
                          onMessage={() => handleUserAction('message', user)}
                          onFollow={() => handleUserAction('follow', user)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedUser && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Selected User:</strong> {selectedUser.firstName} {selectedUser.lastName} (@{selectedUser.username})
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Avatar Upload Tab */}
        <TabsContent value="avatar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Upload</CardTitle>
              <CardDescription>
                Test avatar upload functionality with different sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <h4 className="font-medium mb-4">Small (64px)</h4>
                  <AvatarUpload
                    currentAvatar={userProfile.avatar}
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                    size={64}
                    className="mx-auto"
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="font-medium mb-4">Medium (128px)</h4>
                  <AvatarUpload
                    currentAvatar={userProfile.avatar}
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                    size={128}
                    className="mx-auto"
                  />
                </div>
                
                <div className="text-center">
                  <h4 className="font-medium mb-4">Large (200px)</h4>
                  <AvatarUpload
                    currentAvatar={userProfile.avatar}
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                    size={200}
                    className="mx-auto"
                  />
                </div>
              </div>

              <Separator className="my-8" />

              <div>
                <h3 className="font-semibold mb-4">Features</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Drag and drop upload</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Click to browse files</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Image preview</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Loading states</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>File validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Remove functionality</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <ProfileSettingsPanel
            user={userProfile}
            onSave={handleProfileSave}
          />

          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  {userProfile.verification.email ? (
                    <Badge variant="success">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  {userProfile.verification.phone ? (
                    <Badge variant="success">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Identity</span>
                  </div>
                  {userProfile.verification.identity ? (
                    <Badge variant="success">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Accredited</span>
                  </div>
                  {userProfile.verification.accredited ? (
                    <Badge variant="success">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Not Required
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ProfileActivityFeed
              activities={mockActivities}
              maxItems={10}
              showActions={true}
            />

            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Investments</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockActivities.filter(a => a.type === 'investment').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Transactions</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockActivities.filter(a => a.type === 'transaction').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Properties</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockActivities.filter(a => a.type === 'property').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Achievements</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockActivities.filter(a => a.type === 'achievement').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Social</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockActivities.filter(a => a.type === 'social').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>User Profile Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Profile cards (3 variants)</li>
                <li>✅ Avatar upload with validation</li>
                <li>✅ Settings panel (4 tabs)</li>
                <li>✅ User dashboard</li>
                <li>✅ Activity feed</li>
                <li>✅ Verification system</li>
                <li>✅ Profile completion tracking</li>
                <li>✅ Investment portfolio</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Profile Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Personal information</li>
                <li>✅ Bio and social links</li>
                <li>✅ Location and contact</li>
                <li>✅ Theme preferences</li>
                <li>✅ Privacy settings</li>
                <li>✅ Notification preferences</li>
                <li>✅ Multi-step verification</li>
                <li>✅ Accredited investor status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dashboard Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Portfolio overview</li>
                <li>✅ Investment tracking</li>
                <li>✅ ROI calculations</li>
                <li>✅ Monthly income display</li>
                <li>✅ Achievement system</li>
                <li>✅ Profile completion</li>
                <li>✅ Recent activity timeline</li>
                <li>✅ Property breakdowns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}