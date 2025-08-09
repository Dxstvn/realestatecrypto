/**
 * User Profile Components - PropertyChain
 * 
 * Comprehensive user profile with cards, avatar upload, and settings panels
 * Following Section 0 principles with accessibility
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  User,
  UserCheck,
  UserX,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Share,
  Download,
  Upload,
  Edit,
  Settings,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  CreditCard,
  DollarSign,
  TrendingUp,
  Home,
  Target,
  Flag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Bell,
  BellOff,
  Camera,
  Image,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Copy,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from 'lucide-react'
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  parseISO,
  isValid,
} from 'date-fns'
import { formatCurrency } from '@/lib/format'

// User profile types
export interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  displayName?: string
  bio?: string
  avatar?: string
  coverImage?: string
  dateOfBirth?: Date
  phone?: string
  location?: {
    city: string
    state: string
    country: string
  }
  website?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    currency: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private' | 'investors-only'
      showEmail: boolean
      showPhone: boolean
      showLocation: boolean
      showInvestments: boolean
    }
  }
  verification: {
    email: boolean
    phone: boolean
    identity: boolean
    accredited: boolean
  }
  stats: {
    joinedDate: Date
    lastActive: Date
    totalInvestments: number
    totalInvested: number
    totalReturns: number
    propertiesOwned: number
    averageROI: number
    riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  }
  subscription?: {
    plan: 'free' | 'premium' | 'professional'
    expiresAt?: Date
  }
}

export interface ProfileActivity {
  id: string
  type: 'investment' | 'property' | 'transaction' | 'social' | 'achievement'
  title: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Get user initials
const getUserInitials = (firstName?: string, lastName?: string, displayName?: string) => {
  if (displayName) {
    return displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) {
    return firstName[0].toUpperCase()
  }
  return 'U'
}

// Get verification level
const getVerificationLevel = (verification: UserProfile['verification']) => {
  const levels = Object.values(verification).filter(Boolean).length
  if (levels === 4) return { level: 'Fully Verified', color: 'text-green-500', badge: 'success' as const }
  if (levels >= 2) return { level: 'Partially Verified', color: 'text-amber-500', badge: 'default' as const }
  return { level: 'Unverified', color: 'text-red-500', badge: 'destructive' as const }
}

// Profile Card Component
interface ProfileCardProps {
  user: UserProfile
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  onEdit?: () => void
  onMessage?: () => void
  onFollow?: () => void
  className?: string
}

export function ProfileCard({
  user,
  variant = 'default',
  showActions = true,
  onEdit,
  onMessage,
  onFollow,
  className,
}: ProfileCardProps) {
  const verificationInfo = getVerificationLevel(user.verification)
  const memberSince = format(user.stats.joinedDate, 'MMMM yyyy')
  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.displayName || user.username

  if (variant === 'compact') {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={fullName} />
              <AvatarFallback>{getUserInitials(user.firstName, user.lastName, user.displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{fullName}</h3>
                {user.verification.identity && (
                  <UserCheck className="h-3 w-3 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {user.bio || `${user.stats.totalInvestments} investments • Member since ${memberSince}`}
              </p>
            </div>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onMessage}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onFollow}>
                    <Heart className="mr-2 h-4 w-4" />
                    Follow
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="mr-2 h-4 w-4" />
                    Share Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        {/* Cover Image */}
        {user.coverImage && (
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <img
              src={user.coverImage}
              alt="Profile cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-background -mt-12 relative z-10">
              <AvatarImage src={user.avatar} alt={fullName} />
              <AvatarFallback className="text-xl">
                {getUserInitials(user.firstName, user.lastName, user.displayName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{fullName}</h2>
                    {user.verification.identity && (
                      <UserCheck className="h-5 w-5 text-blue-500" />
                    )}
                    <Badge variant={verificationInfo.badge}>
                      {verificationInfo.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  {user.bio && (
                    <p className="text-sm mt-2">{user.bio}</p>
                  )}
                </div>
                
                {showActions && (
                  <div className="flex gap-2">
                    <Button onClick={onMessage}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" onClick={onFollow}>
                      <Heart className="mr-2 h-4 w-4" />
                      Follow
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Share className="mr-2 h-4 w-4" />
                          Share Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Report User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="grid gap-2 md:grid-cols-2 mt-4">
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {user.location.city}, {user.location.state}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Member since {memberSince}
                </div>
                {user.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Website
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {formatCurrency(user.stats.totalInvested)} invested
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.totalInvestments}</p>
                  <p className="text-sm text-muted-foreground">Investments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.propertiesOwned}</p>
                  <p className="text-sm text-muted-foreground">Properties</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {user.stats.averageROI.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg ROI</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">
                    {formatCurrency(user.stats.totalReturns)}
                  </p>
                  <p className="text-sm text-muted-foreground">Returns</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback className="text-lg">
              {getUserInitials(user.firstName, user.lastName, user.displayName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{fullName}</h3>
                  {user.verification.identity && (
                    <UserCheck className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                <Badge variant={verificationInfo.badge} className="mt-1">
                  {verificationInfo.level}
                </Badge>
              </div>
              
              {showActions && (
                <div className="flex gap-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={onEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {onMessage && (
                    <Button size="sm" onClick={onMessage}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {user.bio && (
              <p className="text-sm mt-3 text-muted-foreground">{user.bio}</p>
            )}
            
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location.city}, {user.location.state}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {memberSince}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {user.stats.totalInvestments} investments
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Avatar Upload Component
interface AvatarUploadProps {
  currentAvatar?: string
  onUpload?: (file: File) => Promise<string>
  onRemove?: () => void
  size?: number
  className?: string
}

export function AvatarUpload({
  currentAvatar,
  onUpload,
  onRemove,
  size = 128,
  className,
}: AvatarUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const [preview, setPreview] = React.useState(currentAvatar)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUpload) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      
      const uploadedUrl = await onUpload(file)
      setPreview(uploadedUrl)
    } catch (error) {
      setPreview(currentAvatar)
      alert('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    onRemove?.()
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="relative group">
        <Avatar
          className="transition-all"
          style={{ width: size, height: size }}
        >
          <AvatarImage src={preview} />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
          {uploading ? (
            <RefreshCw className="h-6 w-6 text-white animate-spin" />
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              {preview && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

// Profile Settings Panel Component
interface ProfileSettingsPanelProps {
  user: UserProfile
  onSave?: (updates: Partial<UserProfile>) => void
  className?: string
}

export function ProfileSettingsPanel({
  user,
  onSave,
  className,
}: ProfileSettingsPanelProps) {
  const [formData, setFormData] = React.useState(user)
  const [saving, setSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('general')

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave?.(formData)
    } finally {
      setSaving(false)
    }
  }

  const updateFormData = (updates: Partial<UserProfile>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updatePreferences = (updates: Partial<UserProfile['preferences']>) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData({ lastName: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName || ''}
                  onChange={(e) => updateFormData({ displayName: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => updateFormData({ bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => updateFormData({ website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Theme</Label>
                  <Select
                    value={formData.preferences.theme}
                    onValueChange={(value: any) => updatePreferences({ theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Language</Label>
                  <Select
                    value={formData.preferences.language}
                    onValueChange={(value) => updatePreferences({ language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={formData.preferences.timezone}
                    onValueChange={(value) => updatePreferences({ timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="MST">Mountain Time</SelectItem>
                      <SelectItem value="CST">Central Time</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={formData.preferences.currency}
                    onValueChange={(value) => updatePreferences({ currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar</SelectItem>
                      <SelectItem value="EUR">Euro</SelectItem>
                      <SelectItem value="GBP">British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <Switch
                      checked={formData.preferences.notifications.email}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          notifications: { ...formData.preferences.notifications, email: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch
                      checked={formData.preferences.notifications.push}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          notifications: { ...formData.preferences.notifications, push: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>SMS Notifications</Label>
                    <Switch
                      checked={formData.preferences.notifications.sms}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          notifications: { ...formData.preferences.notifications, sms: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label>Profile Visibility</Label>
                <Select
                  value={formData.preferences.privacy.profileVisibility}
                  onValueChange={(value: any) => 
                    updatePreferences({
                      privacy: { ...formData.preferences.privacy, profileVisibility: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="investors-only">Investors Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Information Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Show Email Address</Label>
                    <Switch
                      checked={formData.preferences.privacy.showEmail}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          privacy: { ...formData.preferences.privacy, showEmail: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Phone Number</Label>
                    <Switch
                      checked={formData.preferences.privacy.showPhone}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          privacy: { ...formData.preferences.privacy, showPhone: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Location</Label>
                    <Switch
                      checked={formData.preferences.privacy.showLocation}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          privacy: { ...formData.preferences.privacy, showLocation: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Investment Portfolio</Label>
                    <Switch
                      checked={formData.preferences.privacy.showInvestments}
                      onCheckedChange={(checked) => 
                        updatePreferences({
                          privacy: { ...formData.preferences.privacy, showInvestments: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Account Verification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">Verify your email address</p>
                      </div>
                    </div>
                    {user.verification.email ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Verify</Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Phone Verification</p>
                        <p className="text-sm text-muted-foreground">Verify your phone number</p>
                      </div>
                    </div>
                    {user.verification.phone ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Verify</Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Identity Verification</p>
                        <p className="text-sm text-muted-foreground">Verify your identity with ID</p>
                      </div>
                    </div>
                    {user.verification.identity ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Verify</Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Accredited Investor</p>
                        <p className="text-sm text-muted-foreground">Verify accredited investor status</p>
                      </div>
                    </div>
                    {user.verification.accredited ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Verify</Button>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Change Password
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Two-Factor Authentication
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Login Activity
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Profile Activity Feed
interface ProfileActivityFeedProps {
  activities: ProfileActivity[]
  maxItems?: number
  showActions?: boolean
  className?: string
}

export function ProfileActivityFeed({
  activities,
  maxItems = 10,
  showActions = true,
  className,
}: ProfileActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems)

  const getActivityIcon = (type: ProfileActivity['type']) => {
    switch (type) {
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'property':
        return <Home className="h-4 w-4 text-blue-500" />
      case 'transaction':
        return <CreditCard className="h-4 w-4 text-purple-500" />
      case 'social':
        return <Users className="h-4 w-4 text-cyan-500" />
      case 'achievement':
        return <Award className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest investments, transactions, and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            displayActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(activity.timestamp, 'MMM d, h:mm a')}
                  </p>
                </div>
                {showActions && (
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        
        {activities.length > maxItems && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}