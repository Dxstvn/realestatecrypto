/**
 * Document Manager Component - PropertyChain
 * 
 * Comprehensive document management system with upload, version control, and viewer
 * Following UpdatedUIPlan.md Step 45 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash,
  MoreVertical,
  Search,
  Filter,
  FolderOpen,
  FolderPlus,
  File,
  FileImage,
  FileScan,
  FileSignature,
  FileCheck,
  FileX,
  Clock,
  User,
  Shield,
  Lock,
  Unlock,
  Share2,
  Copy,
  Check,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Grid,
  List,
  Calendar,
  Hash,
  Tag,
  Paperclip,
  Archive,
  RefreshCw,
  History,
  GitBranch,
  Plus,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Types
interface Document {
  id: string
  name: string
  type: string
  size: number
  category: string
  uploadDate: string
  modifiedDate: string
  version: number
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  uploadedBy: string
  tags: string[]
  description?: string
  url?: string
  thumbnail?: string
  permissions: {
    view: string[]
    edit: string[]
    delete: string[]
  }
  versions?: DocumentVersion[]
  signatures?: DocumentSignature[]
}

interface DocumentVersion {
  id: string
  version: number
  uploadDate: string
  uploadedBy: string
  changes: string
  size: number
}

interface DocumentSignature {
  id: string
  signedBy: string
  signedDate: string
  signature: string
  verified: boolean
}

interface DocumentCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  count: number
}

interface DocumentManagerProps {
  propertyId: string
  documents?: Document[]
  onUpload?: (files: File[]) => Promise<void>
  onDelete?: (documentId: string) => Promise<void>
  onUpdate?: (documentId: string, data: Partial<Document>) => Promise<void>
  onSign?: (documentId: string) => Promise<void>
  viewMode?: 'grid' | 'list'
}

// Document categories
const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { id: 'all', name: 'All Documents', icon: FileText, color: 'text-gray-500', count: 0 },
  { id: 'contracts', name: 'Contracts', icon: FileSignature, color: 'text-blue-500', count: 0 },
  { id: 'legal', name: 'Legal', icon: Shield, color: 'text-purple-500', count: 0 },
  { id: 'financial', name: 'Financial', icon: FileScan, color: 'text-green-500', count: 0 },
  { id: 'property', name: 'Property', icon: File, color: 'text-orange-500', count: 0 },
  { id: 'inspection', name: 'Inspection', icon: FileCheck, color: 'text-red-500', count: 0 },
  { id: 'insurance', name: 'Insurance', icon: Shield, color: 'text-indigo-500', count: 0 },
  { id: 'other', name: 'Other', icon: FolderOpen, color: 'text-gray-500', count: 0 },
]

export function DocumentManager({
  propertyId,
  documents = [],
  onUpload,
  onDelete,
  onUpdate,
  onSign,
  viewMode: initialViewMode = 'grid',
}: DocumentManagerProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Update category counts
  const categoriesWithCounts = DOCUMENT_CATEGORIES.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? documents.length : documents.filter(d => d.category === cat.id).length
  }))

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    if (!onUpload) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const fileArray = Array.from(files)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onUpload(fileArray)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast({
        title: 'Upload successful',
        description: `${fileArray.length} file(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not upload files. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [onUpload, toast])

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [handleFileUpload])

  // Handle document actions
  const handleDelete = async (doc: Document) => {
    if (!onDelete) return

    try {
      await onDelete(doc.id)
      toast({
        title: 'Document deleted',
        description: `${doc.name} has been deleted`,
      })
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Could not delete document. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleSign = async (doc: Document) => {
    if (!onSign) return

    try {
      await onSign(doc.id)
      toast({
        title: 'Document signed',
        description: `${doc.name} has been signed successfully`,
      })
    } catch (error) {
      toast({
        title: 'Signing failed',
        description: 'Could not sign document. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Document Manager</h2>
          <p className="text-muted-foreground">
            Manage all transaction documents in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Documents
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuItem>Verified</DropdownMenuItem>
                  <DropdownMenuItem>Pending</DropdownMenuItem>
                  <DropdownMenuItem>Rejected</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Date</DropdownMenuLabel>
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>All time</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                {categoriesWithCounts.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors",
                        selectedCategory === category.id && "bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4 w-4", category.color)} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
                <Progress value={48} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  2.4 GB of 5 GB used
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid/List */}
        <div className="lg:col-span-3">
          {/* Upload Zone */}
          {isUploading && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-transparent"
            )}
          >
            {dragActive && (
              <div className="p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-primary mb-4" />
                <p className="text-lg font-medium">Drop files here</p>
                <p className="text-sm text-muted-foreground">
                  Release to upload documents
                </p>
              </div>
            )}

            {!dragActive && filteredDocuments.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload documents to get started
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </CardContent>
              </Card>
            )}

            {!dragActive && filteredDocuments.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onView={() => setSelectedDocument(doc)}
                        onDelete={() => handleDelete(doc)}
                        onSign={() => handleSign(doc)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[600px]">
                        <div className="divide-y">
                          {filteredDocuments.map((doc) => (
                            <DocumentListItem
                              key={doc.id}
                              document={doc}
                              onView={() => setSelectedDocument(doc)}
                              onDelete={() => handleDelete(doc)}
                              onSign={() => handleSign(doc)}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  )
}

// Document Card Component
function DocumentCard({
  document,
  onView,
  onDelete,
  onSign,
}: {
  document: Document
  onView: () => void
  onDelete: () => void
  onSign: () => void
}) {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileScan
    if (type.includes('image')) return FileImage
    if (type.includes('sign')) return FileSignature
    return FileText
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
    }
  }

  const Icon = getFileIcon(document.type)

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onView}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSign(); }}>
                <FileSignature className="h-4 w-4 mr-2" />
                Sign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-medium text-sm mb-1 line-clamp-2">{document.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">
          {(document.size / 1024 / 1024).toFixed(2)} MB • v{document.version}
        </p>

        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs", getStatusColor(document.status))}>
            {document.status}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {new Date(document.modifiedDate).toLocaleDateString()}
          </p>
        </div>

        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {document.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {document.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{document.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Document List Item Component
function DocumentListItem({
  document,
  onView,
  onDelete,
  onSign,
}: {
  document: Document
  onView: () => void
  onDelete: () => void
  onSign: () => void
}) {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileScan
    if (type.includes('image')) return FileImage
    if (type.includes('sign')) return FileSignature
    return FileText
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
    }
  }

  const Icon = getFileIcon(document.type)

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{document.name}</h3>
          <p className="text-xs text-muted-foreground">
            {(document.size / 1024 / 1024).toFixed(2)} MB • v{document.version} • Modified {new Date(document.modifiedDate).toLocaleDateString()}
          </p>
        </div>
        <Badge className={cn("text-xs", getStatusColor(document.status))}>
          {document.status}
        </Badge>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSign}>
                <FileSignature className="h-4 w-4 mr-2" />
                Sign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// Document Viewer Component
function DocumentViewer({
  document,
  onClose,
}: {
  document: Document | null
  onClose: () => void
}) {
  if (!document) return null

  return (
    <Dialog open={!!document} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>
            Version {document.version} • Last modified {new Date(document.modifiedDate).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="flex-1">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1">
            <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Document preview would be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">File Name</Label>
                <p className="font-medium">{document.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">File Size</Label>
                <p className="font-medium">{(document.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium capitalize">{document.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge className="mt-1">{document.status}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Uploaded By</Label>
                <p className="font-medium">{document.uploadedBy}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Upload Date</Label>
                <p className="font-medium">{new Date(document.uploadDate).toLocaleString()}</p>
              </div>
            </div>
            {document.description && (
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium mt-1">{document.description}</p>
              </div>
            )}
            {document.tags.length > 0 && (
              <div>
                <Label className="text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="versions" className="space-y-2">
            {document.versions?.map((version) => (
              <Card key={version.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Version {version.version}</p>
                      <p className="text-sm text-muted-foreground">
                        {version.changes} • {new Date(version.uploadDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {version.uploadedBy}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="signatures" className="space-y-2">
            {document.signatures?.map((sig) => (
              <Card key={sig.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {sig.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium">{sig.signedBy}</p>
                        <p className="text-sm text-muted-foreground">
                          Signed on {new Date(sig.signedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={sig.verified ? 'default' : 'secondary'}>
                      {sig.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!document.signatures || document.signatures.length === 0) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileSignature className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No signatures yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Helper component
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  )
}