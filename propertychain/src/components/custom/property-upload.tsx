/**
 * Property-Specific Upload Components - PropertyChain
 * 
 * Specialized upload functionality for real estate documents and media
 */

'use client'

import * as React from 'react'
import { FileUpload, MultiFileUpload, AvatarUpload, type UploadedFile } from './file-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'
import { formatFileSize, formatDate } from '@/lib/format'
import {
  FileText,
  Image,
  Video,
  File,
  Upload,
  Check,
  X,
  AlertCircle,
  Shield,
  Lock,
  Unlock,
  Download,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  Camera,
  Paperclip,
  FileCheck,
  FilePlus,
  FileX,
  Home,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Users,
  Briefcase,
  ClipboardCheck,
  FileSignature,
  Scale,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  UploadCloud,
} from 'lucide-react'

// Document categories for real estate
export const DOCUMENT_CATEGORIES = {
  legal: {
    label: 'Legal Documents',
    icon: <Scale className="h-4 w-4" />,
    types: ['Title Deed', 'Purchase Agreement', 'Lease Agreement', 'HOA Documents'],
    required: true,
  },
  financial: {
    label: 'Financial Records',
    icon: <DollarSign className="h-4 w-4" />,
    types: ['Tax Records', 'Income Statements', 'Mortgage Documents', 'Insurance'],
    required: true,
  },
  property: {
    label: 'Property Information',
    icon: <Home className="h-4 w-4" />,
    types: ['Floor Plans', 'Survey', 'Inspection Reports', 'Appraisal'],
    required: false,
  },
  media: {
    label: 'Photos & Videos',
    icon: <Camera className="h-4 w-4" />,
    types: ['Exterior Photos', 'Interior Photos', 'Virtual Tour', 'Drone Footage'],
    required: false,
  },
  compliance: {
    label: 'Compliance & Permits',
    icon: <ClipboardCheck className="h-4 w-4" />,
    types: ['Building Permits', 'Zoning Documents', 'Environmental Reports'],
    required: false,
  },
}

// Property Document Upload Component
interface PropertyDocumentUploadProps {
  category: keyof typeof DOCUMENT_CATEGORIES
  documentType?: string
  onUpload?: (files: File[], metadata: any) => Promise<void>
  required?: boolean
  maxFiles?: number
  className?: string
}

export function PropertyDocumentUpload({
  category,
  documentType,
  onUpload,
  required = false,
  maxFiles = 10,
  className,
}: PropertyDocumentUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [metadata, setMetadata] = React.useState({
    documentType: documentType || '',
    description: '',
    expiryDate: '',
    isConfidential: false,
  })

  const categoryInfo = DOCUMENT_CATEGORIES[category]

  const handleUpload = async (newFiles: File[]) => {
    if (onUpload) {
      await onUpload(newFiles, metadata)
    }
  }

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/msword': ['.doc', '.docx'],
    'application/vnd.ms-excel': ['.xls', '.xlsx'],
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {categoryInfo.icon}
            <CardTitle>{categoryInfo.label}</CardTitle>
          </div>
          {required && (
            <Badge variant="destructive">Required</Badge>
          )}
        </div>
        <CardDescription>
          Upload {categoryInfo.label.toLowerCase()} for this property
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Type Selection */}
        <div>
          <Label>Document Type</Label>
          <Select
            value={metadata.documentType}
            onValueChange={(value) => setMetadata({ ...metadata, documentType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {categoryInfo.types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Area */}
        <FileUpload
          accept={acceptedTypes}
          maxFiles={maxFiles}
          onUpload={handleUpload}
          variant="compact"
        />

        {/* Metadata Fields */}
        <div className="space-y-3">
          <div>
            <Label>Description</Label>
            <Textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              placeholder="Add a description..."
              className="resize-none"
              rows={2}
            />
          </div>

          {category === 'legal' && (
            <div>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={metadata.expiryDate}
                onChange={(e) => setMetadata({ ...metadata, expiryDate: e.target.value })}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Mark as Confidential
            </Label>
            <Button
              variant={metadata.isConfidential ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMetadata({ ...metadata, isConfidential: !metadata.isConfidential })}
            >
              {metadata.isConfidential ? (
                <>
                  <Lock className="mr-2 h-3 w-3" />
                  Confidential
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-3 w-3" />
                  Public
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Upload Button */}
        <Button className="w-full" disabled={!metadata.documentType}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </CardContent>
    </Card>
  )
}

// Property Media Upload Component
interface PropertyMediaUploadProps {
  propertyId?: string
  onUpload?: (files: File[], metadata: any) => Promise<void>
  existingMedia?: {
    id: string
    url: string
    type: 'image' | 'video'
    caption?: string
    isPrimary?: boolean
  }[]
  className?: string
}

export function PropertyMediaUpload({
  propertyId,
  onUpload,
  existingMedia = [],
  className,
}: PropertyMediaUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [selectedTab, setSelectedTab] = React.useState('photos')
  const [captions, setCaptions] = React.useState<Record<string, string>>({})

  const handleUpload = async (newFiles: File[]) => {
    const metadata = {
      propertyId,
      captions,
      type: selectedTab,
    }
    
    if (onUpload) {
      await onUpload(newFiles, metadata)
    }
  }

  const handleSetPrimary = (fileId: string) => {
    // Logic to set primary image
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Property Media</CardTitle>
        <CardDescription>
          Upload photos and videos to showcase the property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="virtual">Virtual Tour</TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="space-y-4">
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                Upload high-quality photos (min 1920x1080). The first photo will be the primary listing image.
              </AlertDescription>
            </Alert>

            <MultiFileUpload
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
              }}
              maxSize={10 * 1024 * 1024} // 10MB
              maxFiles={50}
              onUpload={handleUpload}
              showGallery
            />

            {/* Photo Categories */}
            <div className="grid gap-2">
              <Label>Photo Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Exterior', 'Interior', 'Bedroom', 'Bathroom', 'Kitchen', 'Living Room', 'Garden', 'Pool'].map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-accent"
                  >
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <Alert>
              <Video className="h-4 w-4" />
              <AlertDescription>
                Upload property walkthrough videos (max 500MB, MP4 format recommended).
              </AlertDescription>
            </Alert>

            <FileUpload
              accept={{
                'video/*': ['.mp4', '.mov', '.avi', '.webm'],
              }}
              maxSize={500 * 1024 * 1024} // 500MB
              maxFiles={5}
              onUpload={handleUpload}
            />
          </TabsContent>

          <TabsContent value="virtual" className="space-y-4">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Upload 360° photos or virtual tour files for an immersive experience.
              </AlertDescription>
            </Alert>

            <FileUpload
              accept={{
                'image/*': ['.jpg', '.jpeg'],
                'application/octet-stream': ['.tour'],
              }}
              maxSize={50 * 1024 * 1024} // 50MB
              maxFiles={20}
              onUpload={handleUpload}
            />
          </TabsContent>
        </Tabs>

        {/* Existing Media Gallery */}
        {existingMedia.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <h3 className="font-semibold mb-3">Existing Media</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {existingMedia.map((media) => (
                <div key={media.id} className="relative group">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.caption || 'Property image'}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  {media.isPrimary && (
                    <Badge className="absolute top-2 left-2">
                      Primary
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {media.caption && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {media.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Document Manager Component
interface Document {
  id: string
  name: string
  category: keyof typeof DOCUMENT_CATEGORIES
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: string
  status: 'pending' | 'verified' | 'rejected'
  isConfidential: boolean
  url: string
}

interface DocumentManagerProps {
  documents: Document[]
  onDownload?: (doc: Document) => void
  onDelete?: (doc: Document) => void
  onVerify?: (doc: Document) => void
  className?: string
}

export function DocumentManager({
  documents,
  onDownload,
  onDelete,
  onVerify,
  className,
}: DocumentManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
    }
  }

  const getDocumentIcon = (category: keyof typeof DOCUMENT_CATEGORIES) => {
    return DOCUMENT_CATEGORIES[category].icon
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Document Manager</CardTitle>
          <Badge variant="secondary">
            {documents.length} documents
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(DOCUMENT_CATEGORIES).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No documents found</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getDocumentIcon(doc.category)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{doc.name}</p>
                        {doc.isConfidential && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>{formatFileSize(doc.size)}</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                        <span>by {doc.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(doc.status)}
                    {doc.status === 'pending' && onVerify && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVerify(doc)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload?.(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">
                {documents.filter(d => d.status === 'verified').length}
              </p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500">
                {documents.filter(d => d.status === 'pending').length}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">
                {documents.filter(d => d.status === 'rejected').length}
              </p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Bulk Upload Component
interface BulkUploadProps {
  onUpload?: (files: File[], assignments: Record<string, any>) => Promise<void>
  className?: string
}

export function BulkUpload({
  onUpload,
  className,
}: BulkUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [assignments, setAssignments] = React.useState<Record<string, any>>({})

  const handleAssignment = (fileId: string, category: string, type: string) => {
    setAssignments({
      ...assignments,
      [fileId]: { category, type },
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Bulk Document Upload</CardTitle>
        <CardDescription>
          Upload multiple documents and assign categories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MultiFileUpload
          files={files}
          onFilesChange={setFiles}
          showGallery={false}
          maxFiles={50}
        />

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Assign Categories</h3>
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg border">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1 truncate">{file.file.name}</span>
                <Select
                  onValueChange={(value) => {
                    const [category, type] = value.split(':')
                    handleAssignment(file.id, category, type)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_CATEGORIES).map(([category, info]) => (
                      <React.Fragment key={category}>
                        <SelectItem value={category} disabled>
                          {info.label}
                        </SelectItem>
                        {info.types.map((type) => (
                          <SelectItem key={type} value={`${category}:${type}`}>
                            <span className="ml-4">{type}</span>
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        <Button
          className="w-full"
          disabled={files.length === 0 || Object.keys(assignments).length !== files.length}
          onClick={() => {
            const rawFiles = files.map(f => f.file)
            onUpload?.(rawFiles, assignments)
          }}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload All Documents
        </Button>
      </CardContent>
    </Card>
  )
}

// Format file size helper (if not imported from elsewhere)
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}