/**
 * Property Documents - PropertyChain
 * 
 * Specialized document management for real estate transactions and property files
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DocumentViewer,
  createMockDocument,
  type Document,
  type Annotation,
  type DocumentPermissions,
} from './document-viewer'
import {
  FileText,
  Folder,
  Upload,
  Download,
  Share,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Heart,
  Tag,
  User,
  Calendar,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Plus,
  X,
  Copy,
  Archive,
  History,
  Shield,
  Key,
  Home,
  Building,
  DollarSign,
  Briefcase,
  Camera,
  Paperclip,
  Mail,
  Phone,
  MapPin,
  Target,
  Zap,
} from 'lucide-react'
import { formatDate, formatFileSize } from '@/lib/format'
import { addDays, subDays, subMonths } from 'date-fns'

// PropertyChain Document Types
export interface PropertyDocument extends Document {
  propertyId?: string
  transactionId?: string
  category: PropertyDocumentCategory
  stage: TransactionStage
  requiredBy?: Date
  signedBy?: Array<{
    name: string
    email: string
    signedAt: Date
    ipAddress: string
  }>
  expiresAt?: Date
  isTemplate?: boolean
  templateId?: string
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_revision'
  reviewers?: Array<{
    name: string
    role: string
    status: 'pending' | 'approved' | 'rejected'
    comments?: string
    reviewedAt?: Date
  }>
  complianceChecks?: Array<{
    type: string
    status: 'passed' | 'failed' | 'warning'
    message: string
    checkedAt: Date
  }>
}

export type PropertyDocumentCategory = 
  | 'legal' 
  | 'financial' 
  | 'property_details' 
  | 'inspection' 
  | 'insurance' 
  | 'mortgage' 
  | 'closing' 
  | 'compliance'
  | 'marketing'
  | 'correspondence'

export type TransactionStage = 
  | 'pre_listing'
  | 'listing'
  | 'offer'
  | 'contract'
  | 'inspection'
  | 'financing'
  | 'closing'
  | 'post_closing'

export interface DocumentTemplate {
  id: string
  name: string
  category: PropertyDocumentCategory
  description: string
  fields: Array<{
    name: string
    type: 'text' | 'number' | 'date' | 'signature' | 'checkbox'
    required: boolean
    defaultValue?: any
  }>
  content: string
  version: string
  isActive: boolean
}

// Property Document Manager Component
interface PropertyDocumentManagerProps {
  propertyId?: string
  transactionId?: string
  documents?: PropertyDocument[]
  onDocumentUpload?: (file: File, metadata: Partial<PropertyDocument>) => void
  onDocumentDelete?: (documentId: string) => void
  onDocumentShare?: (documentId: string, recipients: string[]) => void
  onDocumentSign?: (documentId: string) => void
  className?: string
}

export function PropertyDocumentManager({
  propertyId,
  transactionId,
  documents = [],
  onDocumentUpload,
  onDocumentDelete,
  onDocumentShare,
  onDocumentSign,
  className,
}: PropertyDocumentManagerProps) {
  const [selectedDocument, setSelectedDocument] = React.useState<PropertyDocument | null>(null)
  const [view, setView] = React.useState<'list' | 'grid' | 'viewer'>('list')
  const [filter, setFilter] = React.useState<{
    category?: PropertyDocumentCategory
    stage?: TransactionStage
    status?: string
    search?: string
  }>({})
  const [showUploadDialog, setShowUploadDialog] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<'name' | 'date' | 'category' | 'size'>('date')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')

  // Mock documents
  const mockDocuments: PropertyDocument[] = [
    {
      ...createMockDocument(),
      id: 'doc-1',
      name: 'Property Purchase Agreement.pdf',
      category: 'legal',
      stage: 'contract',
      reviewStatus: 'approved',
      requiredBy: addDays(new Date(), 7),
      signedBy: [
        {
          name: 'John Smith',
          email: 'john@example.com',
          signedAt: subDays(new Date(), 2),
          ipAddress: '192.168.1.1',
        }
      ],
      complianceChecks: [
        {
          type: 'Legal Review',
          status: 'passed',
          message: 'All legal requirements met',
          checkedAt: subDays(new Date(), 1),
        }
      ],
    },
    {
      ...createMockDocument(),
      id: 'doc-2',
      name: 'Property Inspection Report.pdf',
      category: 'inspection',
      stage: 'inspection',
      reviewStatus: 'pending',
      pages: 8,
      size: 1024000,
      complianceChecks: [
        {
          type: 'Safety Check',
          status: 'warning',
          message: 'Minor electrical issues noted',
          checkedAt: subDays(new Date(), 1),
        }
      ],
    },
    {
      ...createMockDocument(),
      id: 'doc-3',
      name: 'Mortgage Pre-approval Letter.pdf',
      category: 'financial',
      stage: 'financing',
      reviewStatus: 'approved',
      pages: 3,
      size: 512000,
      expiresAt: addDays(new Date(), 30),
    },
    {
      ...createMockDocument(),
      id: 'doc-4',
      name: 'Property Disclosure Statement.pdf',
      category: 'legal',
      stage: 'listing',
      reviewStatus: 'needs_revision',
      pages: 5,
      size: 768000,
      reviewers: [
        {
          name: 'Jane Lawyer',
          role: 'Legal Counsel',
          status: 'rejected',
          comments: 'Missing environmental disclosures',
          reviewedAt: subDays(new Date(), 1),
        }
      ],
    },
  ]

  const allDocuments = documents.length > 0 ? documents : mockDocuments

  // Filter and sort documents
  const filteredDocuments = React.useMemo(() => {
    let filtered = allDocuments

    if (filter.category) {
      filtered = filtered.filter(doc => doc.category === filter.category)
    }
    if (filter.stage) {
      filtered = filtered.filter(doc => doc.stage === filter.stage)
    }
    if (filter.status) {
      filtered = filtered.filter(doc => doc.reviewStatus === filter.status)
    }
    if (filter.search) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(filter.search!.toLowerCase()) ||
        doc.category.toLowerCase().includes(filter.search!.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof PropertyDocument]
      let bVal: any = b[sortBy as keyof PropertyDocument]
      
      if (sortBy === 'date') {
        aVal = a.uploadDate.getTime()
        bVal = b.uploadDate.getTime()
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })

    return filtered
  }, [allDocuments, filter, sortBy, sortOrder])

  const getCategoryIcon = (category: PropertyDocumentCategory) => {
    switch (category) {
      case 'legal': return <Shield className="h-4 w-4 text-blue-500" />
      case 'financial': return <DollarSign className="h-4 w-4 text-green-500" />
      case 'property_details': return <Home className="h-4 w-4 text-purple-500" />
      case 'inspection': return <Search className="h-4 w-4 text-orange-500" />
      case 'insurance': return <Shield className="h-4 w-4 text-red-500" />
      case 'mortgage': return <Building className="h-4 w-4 text-indigo-500" />
      case 'closing': return <Key className="h-4 w-4 text-amber-500" />
      case 'compliance': return <CheckCircle className="h-4 w-4 text-teal-500" />
      case 'marketing': return <Camera className="h-4 w-4 text-pink-500" />
      case 'correspondence': return <Mail className="h-4 w-4 text-gray-500" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: PropertyDocument['reviewStatus']) => {
    switch (status) {
      case 'approved': return 'text-green-600'
      case 'rejected': return 'text-red-600'
      case 'needs_revision': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: PropertyDocument['reviewStatus']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      case 'needs_revision': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Documents</h2>
          <p className="text-muted-foreground">
            {propertyId && `Property ID: ${propertyId}`}
            {transactionId && ` • Transaction ID: ${transactionId}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <DocumentTemplateSelector onCreateFromTemplate={(template) => {
            console.log('Create from template:', template)
          }} />
        </div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={filter.search || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9 w-64"
                />
              </div>
              
              <Select
                value={filter.category || 'all'}
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  category: value === 'all' ? undefined : value as PropertyDocumentCategory 
                }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="property_details">Property Details</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="closing">Closing</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filter.status || 'all'}
                onValueChange={(value) => setFilter(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : value 
                }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="needs_revision">Needs Revision</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded-lg">
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  List
                </Button>
                <Button
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('grid')}
                >
                  Grid
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy('name')}>
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('date')}>
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('category')}>
                    Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('size')}>
                    Size {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredDocuments.length} of {allDocuments.length} documents
          </div>
        </CardContent>
      </Card>

      {/* Document View */}
      {view === 'viewer' && selectedDocument ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedDocument.category)}
                  {selectedDocument.name}
                </CardTitle>
                <CardDescription>
                  {selectedDocument.category} • {selectedDocument.stage}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setView('list')}
              >
                <X className="mr-2 h-4 w-4" />
                Close Viewer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DocumentViewer
              document={selectedDocument}
              onDownload={() => console.log('Download:', selectedDocument.id)}
              onPrint={() => console.log('Print:', selectedDocument.id)}
              onShare={() => console.log('Share:', selectedDocument.id)}
              className="h-[600px]"
            />
          </CardContent>
        </Card>
      ) : view === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(doc.category)}
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.pages} pages
                            {doc.isConfidential && (
                              <Badge variant="destructive" className="ml-2 text-xs">
                                Confidential
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {doc.stage.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1", getStatusColor(doc.reviewStatus))}>
                        {getStatusIcon(doc.reviewStatus)}
                        <span className="text-sm capitalize">
                          {doc.reviewStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(doc.uploadDate)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFileSize(doc.size)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedDocument(doc)
                              setView('viewer')
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        // Grid view
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(doc.category)}
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {doc.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedDocument(doc)
                          setView('viewer')
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <h3 className="font-semibold mb-2 line-clamp-2">{doc.name}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>{doc.pages} pages</span>
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>{formatDate(doc.uploadDate)}</span>
                    <div className={cn("flex items-center gap-1", getStatusColor(doc.reviewStatus))}>
                      {getStatusIcon(doc.reviewStatus)}
                    </div>
                  </div>
                </div>

                {doc.complianceChecks && doc.complianceChecks.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Compliance Status:</div>
                    <div className="flex gap-1">
                      {doc.complianceChecks.map((check, index) => (
                        <div
                          key={index}
                          className={cn(
                            "w-3 h-3 rounded-full",
                            check.status === 'passed' && "bg-green-500",
                            check.status === 'warning' && "bg-yellow-500",
                            check.status === 'failed' && "bg-red-500"
                          )}
                          title={check.message}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <DocumentUploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={onDocumentUpload}
        propertyId={propertyId}
        transactionId={transactionId}
      />
    </div>
  )
}

// Document Template Selector Component
interface DocumentTemplateSelectorProps {
  onCreateFromTemplate: (template: DocumentTemplate) => void
}

function DocumentTemplateSelector({ onCreateFromTemplate }: DocumentTemplateSelectorProps) {
  const templates: DocumentTemplate[] = [
    {
      id: 'template-1',
      name: 'Purchase Agreement',
      category: 'legal',
      description: 'Standard real estate purchase agreement template',
      fields: [
        { name: 'propertyAddress', type: 'text', required: true },
        { name: 'purchasePrice', type: 'number', required: true },
        { name: 'closingDate', type: 'date', required: true },
        { name: 'buyerSignature', type: 'signature', required: true },
        { name: 'sellerSignature', type: 'signature', required: true },
      ],
      content: 'Purchase agreement template content...',
      version: '2.0',
      isActive: true,
    },
    {
      id: 'template-2',
      name: 'Property Disclosure',
      category: 'legal',
      description: 'Property condition disclosure statement',
      fields: [
        { name: 'propertyAddress', type: 'text', required: true },
        { name: 'knownDefects', type: 'checkbox', required: false },
        { name: 'sellerSignature', type: 'signature', required: true },
      ],
      content: 'Disclosure template content...',
      version: '1.5',
      isActive: true,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Templates
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Document Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.map(template => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onCreateFromTemplate(template)}
          >
            <div className="flex-1">
              <div className="font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground">
                {template.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Document Upload Dialog Component
interface DocumentUploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload?: (file: File, metadata: Partial<PropertyDocument>) => void
  propertyId?: string
  transactionId?: string
}

function DocumentUploadDialog({
  open,
  onClose,
  onUpload,
  propertyId,
  transactionId,
}: DocumentUploadDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [metadata, setMetadata] = React.useState<Partial<PropertyDocument>>({
    category: 'legal',
    stage: 'listing',
    isConfidential: false,
  })
  const [isUploading, setIsUploading] = React.useState(false)

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      onUpload?.(file, metadata)
      onClose()
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMetadata(prev => ({
        ...prev,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to this property or transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Selection */}
          <div>
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={metadata.category || 'legal'}
                onValueChange={(value) => setMetadata(prev => ({ 
                  ...prev, 
                  category: value as PropertyDocumentCategory 
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="property_details">Property Details</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="closing">Closing</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={metadata.stage || 'listing'}
                onValueChange={(value) => setMetadata(prev => ({ 
                  ...prev, 
                  stage: value as TransactionStage 
                }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre_listing">Pre-listing</SelectItem>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="financing">Financing</SelectItem>
                  <SelectItem value="closing">Closing</SelectItem>
                  <SelectItem value="post_closing">Post-closing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="confidential"
                checked={metadata.isConfidential || false}
                onCheckedChange={(checked) => setMetadata(prev => ({ 
                  ...prev, 
                  isConfidential: checked 
                }))}
              />
              <Label htmlFor="confidential">Mark as confidential</Label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={metadata.tags?.join(', ') || ''}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              className="mt-1"
            />
          </div>

          {/* File Info */}
          {file && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <div><strong>File:</strong> {file.name}</div>
                <div><strong>Size:</strong> {formatFileSize(file.size)}</div>
                <div><strong>Type:</strong> {file.type}</div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>Processing</span>
              </div>
              <Progress value={75} />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              'Upload Document'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}