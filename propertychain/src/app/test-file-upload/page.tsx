/**
 * File Upload Test Page - PropertyChain
 * Tests all file upload components and features
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
  FileUpload,
  MultiFileUpload,
  AvatarUpload,
  type UploadedFile,
} from '@/components/custom/file-upload'
import {
  PropertyDocumentUpload,
  PropertyMediaUpload,
  DocumentManager,
  BulkUpload,
  DOCUMENT_CATEGORIES,
} from '@/components/custom/property-upload'
import {
  Upload,
  FileText,
  Image,
  Camera,
  Film,
  FolderOpen,
  Cloud,
  HardDrive,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Trash2,
} from 'lucide-react'
import { toastSuccess, toastInfo, toastError } from '@/lib/toast'

// Mock documents for DocumentManager
const mockDocuments = [
  {
    id: '1',
    name: 'Property Title Deed.pdf',
    category: 'legal' as const,
    type: 'Title Deed',
    size: 2456789,
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'John Smith',
    status: 'verified' as const,
    isConfidential: true,
    url: '/documents/title-deed.pdf',
  },
  {
    id: '2',
    name: 'Tax Assessment 2023.pdf',
    category: 'financial' as const,
    type: 'Tax Records',
    size: 1234567,
    uploadedAt: new Date('2024-01-10'),
    uploadedBy: 'Jane Doe',
    status: 'pending' as const,
    isConfidential: false,
    url: '/documents/tax-2023.pdf',
  },
  {
    id: '3',
    name: 'Floor Plans.dwg',
    category: 'property' as const,
    type: 'Floor Plans',
    size: 5678901,
    uploadedAt: new Date('2024-01-08'),
    uploadedBy: 'Architect Pro',
    status: 'verified' as const,
    isConfidential: false,
    url: '/documents/floor-plans.dwg',
  },
  {
    id: '4',
    name: 'Inspection Report.pdf',
    category: 'property' as const,
    type: 'Inspection Reports',
    size: 3456789,
    uploadedAt: new Date('2024-01-05'),
    uploadedBy: 'Inspector Lee',
    status: 'rejected' as const,
    isConfidential: false,
    url: '/documents/inspection.pdf',
  },
  {
    id: '5',
    name: 'Building Permit.pdf',
    category: 'compliance' as const,
    type: 'Building Permits',
    size: 987654,
    uploadedAt: new Date('2024-01-03'),
    uploadedBy: 'City Office',
    status: 'verified' as const,
    isConfidential: false,
    url: '/documents/permit.pdf',
  },
]

// Mock existing media
const mockExistingMedia = [
  {
    id: '1',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=property1',
    type: 'image' as const,
    caption: 'Front view of the property',
    isPrimary: true,
  },
  {
    id: '2',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=property2',
    type: 'image' as const,
    caption: 'Living room',
    isPrimary: false,
  },
  {
    id: '3',
    url: 'https://api.dicebear.com/7.x/shapes/svg?seed=property3',
    type: 'image' as const,
    caption: 'Master bedroom',
    isPrimary: false,
  },
]

export default function TestFileUploadPage() {
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [uploadStats, setUploadStats] = useState({
    totalUploaded: 0,
    totalSize: 0,
    successCount: 0,
    errorCount: 0,
  })

  const handleBasicUpload = async (files: File[]) => {
    toastInfo(`Uploading ${files.length} file(s)...`)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    setUploadStats(prev => ({
      totalUploaded: prev.totalUploaded + files.length,
      totalSize: prev.totalSize + totalSize,
      successCount: prev.successCount + files.length,
      errorCount: prev.errorCount,
    }))
    
    toastSuccess(`Successfully uploaded ${files.length} file(s)`)
  }

  const handleDocumentUpload = async (files: File[], metadata: any) => {
    toastInfo(`Uploading ${files.length} document(s) to ${metadata.documentType}...`)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toastSuccess('Documents uploaded successfully')
  }

  const handleMediaUpload = async (files: File[], metadata: any) => {
    toastInfo(`Uploading ${files.length} media file(s)...`)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toastSuccess('Media uploaded successfully')
  }

  const handleBulkUpload = async (files: File[], assignments: any) => {
    toastInfo(`Processing ${files.length} files with category assignments...`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    toastSuccess('Bulk upload completed')
  }

  const handleAvatarUpload = async (file: File): Promise<string> => {
    toastInfo('Uploading avatar...')
    await new Promise(resolve => setTimeout(resolve, 1000))
    const url = URL.createObjectURL(file)
    toastSuccess('Avatar uploaded successfully')
    return url
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">File Upload Test</h1>
        <p className="text-muted-foreground">
          Testing drag-and-drop file upload with progress tracking
        </p>
      </div>

      {/* Upload Statistics */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Uploaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{uploadStats.totalUploaded}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">
                {(uploadStats.totalSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">
                {uploadStats.totalUploaded > 0
                  ? Math.round((uploadStats.successCount / uploadStats.totalUploaded) * 100)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-500">
                {uploadStats.errorCount}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Upload</TabsTrigger>
          <TabsTrigger value="multi">Multi-File</TabsTrigger>
          <TabsTrigger value="property">Property Docs</TabsTrigger>
          <TabsTrigger value="media">Media Upload</TabsTrigger>
          <TabsTrigger value="manager">Doc Manager</TabsTrigger>
        </TabsList>

        {/* Basic Upload Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Default Upload</CardTitle>
                <CardDescription>Standard drag-and-drop file upload</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUpload={handleBasicUpload}
                  maxSize={10 * 1024 * 1024}
                  maxFiles={5}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compact Upload</CardTitle>
                <CardDescription>Space-saving upload variant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  onUpload={handleBasicUpload}
                  variant="compact"
                  maxFiles={3}
                />
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Button Variant</h4>
                  <FileUpload
                    onUpload={handleBasicUpload}
                    variant="button"
                    multiple={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Restricted File Types</CardTitle>
              <CardDescription>Only specific file types allowed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Images Only</h4>
                  <FileUpload
                    onUpload={handleBasicUpload}
                    accept={{
                      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                    }}
                    variant="compact"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">PDFs Only</h4>
                  <FileUpload
                    onUpload={handleBasicUpload}
                    accept={{
                      'application/pdf': ['.pdf'],
                    }}
                    variant="compact"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Documents</h4>
                  <FileUpload
                    onUpload={handleBasicUpload}
                    accept={{
                      'application/pdf': ['.pdf'],
                      'application/msword': ['.doc', '.docx'],
                      'application/vnd.ms-excel': ['.xls', '.xlsx'],
                    }}
                    variant="compact"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Upload</CardTitle>
              <CardDescription>Profile picture upload with preview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <AvatarUpload
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  onUpload={handleAvatarUpload}
                  size={128}
                />
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Image preview</li>
                    <li>✅ Drag and drop</li>
                    <li>✅ Click to browse</li>
                    <li>✅ Loading state</li>
                    <li>✅ Hover effect</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multi-File Tab */}
        <TabsContent value="multi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-File Upload with Gallery</CardTitle>
              <CardDescription>Upload multiple files with preview gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiFileUpload
                onUpload={handleBasicUpload}
                maxSize={20 * 1024 * 1024}
                maxFiles={20}
                showGallery
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Documents Tab */}
        <TabsContent value="property" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <PropertyDocumentUpload
              category="legal"
              onUpload={handleDocumentUpload}
              required
            />
            
            <PropertyDocumentUpload
              category="financial"
              onUpload={handleDocumentUpload}
              required
            />
            
            <PropertyDocumentUpload
              category="property"
              onUpload={handleDocumentUpload}
            />
            
            <PropertyDocumentUpload
              category="compliance"
              onUpload={handleDocumentUpload}
            />
          </div>

          <BulkUpload
            onUpload={handleBulkUpload}
          />
        </TabsContent>

        {/* Media Upload Tab */}
        <TabsContent value="media" className="space-y-6">
          <PropertyMediaUpload
            propertyId="property-123"
            onUpload={handleMediaUpload}
            existingMedia={mockExistingMedia}
          />

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Media upload supports photos, videos, and virtual tours. 
              The first photo will be set as the primary listing image.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Document Manager Tab */}
        <TabsContent value="manager" className="space-y-6">
          <DocumentManager
            documents={mockDocuments}
            onDownload={(doc) => toastInfo(`Download: ${doc.name}`)}
            onDelete={(doc) => toastInfo(`Delete: ${doc.name}`)}
            onVerify={(doc) => toastSuccess(`Verified: ${doc.name}`)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Document Categories</CardTitle>
              <CardDescription>Required and optional document types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(DOCUMENT_CATEGORIES).map(([key, info]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {info.icon}
                      <span className="font-medium">{info.label}</span>
                      {info.required && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                      {info.types.map((type) => (
                        <li key={type}>• {type}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>File Upload Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Drag and drop support</li>
                <li>✅ Click to browse files</li>
                <li>✅ Progress tracking</li>
                <li>✅ File validation</li>
                <li>✅ Size restrictions</li>
                <li>✅ Type restrictions</li>
                <li>✅ Preview generation</li>
                <li>✅ Error handling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Property Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Document categorization</li>
                <li>✅ Media upload (photos/videos)</li>
                <li>✅ Virtual tour support</li>
                <li>✅ Bulk upload with assignment</li>
                <li>✅ Document verification status</li>
                <li>✅ Confidential marking</li>
                <li>✅ Metadata attachment</li>
                <li>✅ Document manager</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">UI Variants</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Default dropzone</li>
                <li>✅ Compact variant</li>
                <li>✅ Button variant</li>
                <li>✅ Avatar upload</li>
                <li>✅ Multi-file gallery</li>
                <li>✅ Loading states</li>
                <li>✅ Success/error states</li>
                <li>✅ Retry functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}