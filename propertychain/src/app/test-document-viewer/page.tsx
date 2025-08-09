/**
 * Document Viewer Test Page - PropertyChain
 * Tests all document viewer components and features
 */

'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  DocumentViewer,
  createMockDocument,
  type Document,
  type Annotation,
  type ViewerConfig,
} from '@/components/custom/document-viewer'
import {
  PropertyDocumentManager,
  type PropertyDocument,
  type PropertyDocumentCategory,
  type TransactionStage,
} from '@/components/custom/property-documents'
import {
  FileText,
  Eye,
  Download,
  Share,
  Edit,
  Highlighter,
  MessageSquare,
  Pen,
  MousePointer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  Bookmark,
  Star,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  Folder,
  Tag,
  Users,
  Settings,
  Info,
  Zap,
  Target,
  Home,
  Building,
  DollarSign,
  Camera,
  Mail,
  Key,
} from 'lucide-react'
import { addDays, subDays, subMonths } from 'date-fns'
import { toastSuccess, toastInfo, toastError } from '@/lib/toast'

// Mock data
const mockDocument = createMockDocument()

const mockAnnotations: Annotation[] = [
  {
    id: 'ann-1',
    type: 'highlight',
    page: 1,
    position: { x: 20, y: 30, width: 40, height: 5 },
    content: 'Important clause highlighted',
    color: '#FFFF00',
    author: 'John Smith',
    createdAt: subDays(new Date(), 2),
  },
  {
    id: 'ann-2',
    type: 'note',
    page: 1,
    position: { x: 70, y: 50 },
    content: 'Need to verify this information with legal team',
    color: '#FF6B6B',
    author: 'Sarah Johnson',
    createdAt: subDays(new Date(), 1),
    replies: [
      {
        id: 'reply-1',
        author: 'Mike Wilson',
        content: 'I can help with this verification',
        createdAt: new Date(),
      }
    ],
  },
  {
    id: 'ann-3',
    type: 'highlight',
    page: 3,
    position: { x: 15, y: 60, width: 50, height: 8 },
    content: 'Financial terms section',
    color: '#90EE90',
    author: 'Emily Davis',
    createdAt: subDays(new Date(), 3),
  },
]

const mockPropertyDocuments: PropertyDocument[] = [
  {
    ...createMockDocument(),
    id: 'prop-doc-1',
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
    id: 'prop-doc-2',
    name: 'Property Inspection Report.pdf',
    category: 'inspection',
    stage: 'inspection',
    reviewStatus: 'pending',
    pages: 15,
    size: 2048000,
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
    id: 'prop-doc-3',
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
    id: 'prop-doc-4',
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
  {
    ...createMockDocument(),
    id: 'prop-doc-5',
    name: 'Property Appraisal Report.pdf',
    category: 'property_details',
    stage: 'contract',
    reviewStatus: 'approved',
    pages: 12,
    size: 1536000,
  },
  {
    ...createMockDocument(),
    id: 'prop-doc-6',
    name: 'Insurance Policy.pdf',
    category: 'insurance',
    stage: 'closing',
    reviewStatus: 'approved',
    pages: 8,
    size: 896000,
    expiresAt: addDays(new Date(), 365),
  },
]

export default function TestDocumentViewerPage() {
  const [selectedTab, setSelectedTab] = useState('viewer')
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [annotations, setAnnotations] = useState<Annotation[]>(mockAnnotations)
  const [viewerConfig, setViewerConfig] = useState<Partial<ViewerConfig>>({
    theme: 'light',
    fitMode: 'width',
    showAnnotations: true,
    enableAnnotations: true,
  })

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    toastInfo(`Navigated to page ${page}`)
  }, [])

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
    toastInfo(`Zoom changed to ${newZoom}%`)
  }, [])

  const handleAnnotationAdd = useCallback((annotation: Omit<Annotation, 'id' | 'createdAt'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `ann-${Date.now()}`,
      createdAt: new Date(),
    }
    setAnnotations(prev => [...prev, newAnnotation])
    toastSuccess(`${annotation.type} annotation added`)
  }, [])

  const handleAnnotationUpdate = useCallback((annotation: Annotation) => {
    setAnnotations(prev => prev.map(a => a.id === annotation.id ? annotation : a))
    toastSuccess('Annotation updated')
  }, [])

  const handleAnnotationDelete = useCallback((annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId))
    toastSuccess('Annotation deleted')
  }, [])

  const handleDownload = useCallback(() => {
    toastInfo('Document download started...')
  }, [])

  const handlePrint = useCallback(() => {
    toastInfo('Opening print dialog...')
  }, [])

  const handleShare = useCallback(() => {
    toastInfo('Share dialog opened')
  }, [])

  const handleDocumentUpload = useCallback((file: File, metadata: Partial<PropertyDocument>) => {
    toastSuccess(`Document "${file.name}" uploaded successfully`)
  }, [])

  const handleDocumentDelete = useCallback((documentId: string) => {
    toastSuccess('Document deleted')
  }, [])

  const handleDocumentShare = useCallback((documentId: string, recipients: string[]) => {
    toastSuccess(`Document shared with ${recipients.length} recipients`)
  }, [])

  const handleDocumentSign = useCallback((documentId: string) => {
    toastInfo('Opening document for signature...')
  }, [])

  // Stats calculations
  const totalDocuments = mockPropertyDocuments.length
  const pendingDocuments = mockPropertyDocuments.filter(d => d.reviewStatus === 'pending').length
  const approvedDocuments = mockPropertyDocuments.filter(d => d.reviewStatus === 'approved').length
  const annotationsCount = annotations.length

  const generateSampleAnnotation = () => {
    const types: Annotation['type'][] = ['highlight', 'note', 'stamp', 'text']
    const colors = ['#FFFF00', '#FF6B6B', '#90EE90', '#87CEEB', '#DDA0DD']
    
    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      page: Math.floor(Math.random() * mockDocument.pages) + 1,
      position: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        width: Math.random() * 20 + 10,
        height: Math.random() * 10 + 5,
      },
      content: `Sample ${types[Math.floor(Math.random() * types.length)]} annotation`,
      color: colors[Math.floor(Math.random() * colors.length)],
      author: 'Demo User',
      createdAt: new Date(),
    }
    
    setAnnotations(prev => [...prev, newAnnotation])
    toastSuccess('Sample annotation added')
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Document Viewer Test</h1>
            <p className="text-muted-foreground">
              Testing comprehensive document viewing system with PDF support and annotation tools
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={generateSampleAnnotation}>
              <Zap className="mr-2 h-4 w-4" />
              Add Sample Annotation
            </Button>
          </div>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalDocuments}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-500">{pendingDocuments}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{approvedDocuments}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annotations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{annotationsCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
          <TabsTrigger value="annotations">Annotations</TabsTrigger>
          <TabsTrigger value="management">Document Management</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        {/* Document Viewer Tab */}
        <TabsContent value="viewer" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>PDF Document Viewer</CardTitle>
                  <CardDescription>
                    Interactive document viewer with navigation, zoom, and annotation tools
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Page {currentPage} of {mockDocument.pages}
                  </Badge>
                  <Badge variant="outline">
                    {zoom}% zoom
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DocumentViewer
                document={mockDocument}
                initialPage={currentPage}
                config={viewerConfig}
                annotations={annotations}
                onPageChange={handlePageChange}
                onZoomChange={handleZoomChange}
                onAnnotationAdd={handleAnnotationAdd}
                onAnnotationUpdate={handleAnnotationUpdate}
                onAnnotationDelete={handleAnnotationDelete}
                onDownload={handleDownload}
                onPrint={handlePrint}
                onShare={handleShare}
                className="h-[700px]"
              />
            </CardContent>
          </Card>

          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              Use the toolbar tools to interact with the document. Select highlight or note tools 
              and click-drag on the document to add annotations. The sidebar provides navigation 
              and annotation management.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Annotations Tab */}
        <TabsContent value="annotations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Annotation Tools</CardTitle>
                <CardDescription>
                  Available annotation types and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Highlighter className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">Highlight Tool</div>
                        <div className="text-sm text-muted-foreground">
                          Select and highlight important text sections
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Note Tool</div>
                        <div className="text-sm text-muted-foreground">
                          Add contextual notes and comments
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Pen className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Drawing Tool</div>
                        <div className="text-sm text-muted-foreground">
                          Draw freehand annotations and markups
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <MousePointer className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="font-medium">Selection Tool</div>
                        <div className="text-sm text-muted-foreground">
                          Select and interact with existing annotations
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Annotations ({annotations.length})</CardTitle>
                <CardDescription>
                  Annotations on the current document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {annotations.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No annotations yet. Use the annotation tools to add some!
                      </p>
                    </div>
                  ) : (
                    annotations.map(annotation => (
                      <div key={annotation.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: annotation.color }}
                            />
                            <Badge variant="outline" className="text-xs">
                              Page {annotation.page}
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {annotation.type}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAnnotationDelete(annotation.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-sm mb-2">{annotation.content}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{annotation.author}</span>
                          <span>{annotation.createdAt.toLocaleDateString()}</span>
                        </div>
                        
                        {annotation.replies && annotation.replies.length > 0 && (
                          <div className="mt-2 pl-3 border-l border-muted">
                            {annotation.replies.map(reply => (
                              <div key={reply.id} className="text-xs text-muted-foreground">
                                <span className="font-medium">{reply.author}:</span> {reply.content}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Annotation Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h3 className="font-semibold mb-2">Core Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Multiple annotation types</li>
                    <li>✅ Color customization</li>
                    <li>✅ Author tracking</li>
                    <li>✅ Timestamp recording</li>
                    <li>✅ Position accuracy</li>
                    <li>✅ Content editing</li>
                    <li>✅ Reply threading</li>
                    <li>✅ Status management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Collaboration</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Multi-user annotations</li>
                    <li>✅ Real-time updates</li>
                    <li>✅ Comment threads</li>
                    <li>✅ Review workflows</li>
                    <li>✅ Approval processes</li>
                    <li>✅ Notification system</li>
                    <li>✅ Permission controls</li>
                    <li>✅ Version tracking</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Export & Share</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✅ Annotation export</li>
                    <li>✅ Summary reports</li>
                    <li>✅ PDF with annotations</li>
                    <li>✅ Share with teams</li>
                    <li>✅ Email notifications</li>
                    <li>✅ Audit trail</li>
                    <li>✅ Backup & restore</li>
                    <li>✅ API integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Management Tab */}
        <TabsContent value="management" className="space-y-6">
          <PropertyDocumentManager
            propertyId="prop-123"
            transactionId="trans-456"
            documents={mockPropertyDocuments}
            onDocumentUpload={handleDocumentUpload}
            onDocumentDelete={handleDocumentDelete}
            onDocumentShare={handleDocumentShare}
            onDocumentSign={handleDocumentSign}
          />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Purchase Agreement',
                category: 'legal',
                description: 'Standard real estate purchase agreement template',
                icon: <Shield className="h-6 w-6 text-blue-500" />,
                fields: 8,
              },
              {
                name: 'Property Disclosure',
                category: 'legal',
                description: 'Seller property condition disclosure form',
                icon: <Eye className="h-6 w-6 text-green-500" />,
                fields: 12,
              },
              {
                name: 'Inspection Report',
                category: 'inspection',
                description: 'Comprehensive property inspection template',
                icon: <Search className="h-6 w-6 text-orange-500" />,
                fields: 25,
              },
              {
                name: 'Listing Agreement',
                category: 'legal',
                description: 'Exclusive listing agreement template',
                icon: <Home className="h-6 w-6 text-purple-500" />,
                fields: 6,
              },
              {
                name: 'Mortgage Application',
                category: 'financial',
                description: 'Standard mortgage loan application form',
                icon: <DollarSign className="h-6 w-6 text-green-500" />,
                fields: 15,
              },
              {
                name: 'Closing Checklist',
                category: 'closing',
                description: 'Pre-closing document verification checklist',
                icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
                fields: 20,
              },
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.fields} fields
                          </span>
                        </div>
                        <Button size="sm">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Document templates provide pre-configured forms for common real estate 
              transactions. They include smart fields, validation rules, and automated 
              workflows to streamline document creation and processing.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Viewer Controls</CardTitle>
                <CardDescription>
                  Navigation and viewing options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <ZoomIn className="h-4 w-4" />
                    <span>Zoom in/out (10% - 500%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCw className="h-4 w-4" />
                    <span>Document rotation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    <span>Fit modes (width, height, page)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Theme selection (light, dark, sepia)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span>Page thumbnails & navigation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search & Navigation</CardTitle>
                <CardDescription>
                  Find and navigate through documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="h-4 w-4" />
                    <span>Full-text search with highlighting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bookmark className="h-4 w-4" />
                    <span>Document outline navigation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4" />
                    <span>Bookmarks and saved positions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Collaborative viewing sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4" />
                    <span>Favorites and quick access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Actions</CardTitle>
                <CardDescription>
                  Available document operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4" />
                    <span>Download in multiple formats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Share className="h-4 w-4" />
                    <span>Share with access controls</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Edit className="h-4 w-4" />
                    <span>Form filling and editing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Key className="h-4 w-4" />
                    <span>Digital signatures</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Security and permissions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property-Specific Features</CardTitle>
                <CardDescription>
                  Real estate document management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    <span>Property-linked documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Folder className="h-4 w-4" />
                    <span>Transaction stage organization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Compliance checking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Deadline tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>Automated notifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The document viewer is designed with placeholder rendering. In production, 
              it would integrate with PDF.js or similar libraries for actual document rendering, 
              along with cloud storage services for document management.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Document Viewer System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Components</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ PDF document viewer with controls</li>
                <li>✅ Document navigation and thumbnails</li>
                <li>✅ Zoom and rotation controls</li>
                <li>✅ Search functionality</li>
                <li>✅ Annotation tools (highlight, note, draw)</li>
                <li>✅ Document toolbar with actions</li>
                <li>✅ Sidebar with multiple tabs</li>
                <li>✅ Status bar with document info</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property document management</li>
                <li>✅ Transaction stage organization</li>
                <li>✅ Document templates and creation</li>
                <li>✅ Review workflows and approvals</li>
                <li>✅ Compliance checking system</li>
                <li>✅ Digital signature support</li>
                <li>✅ Permission and security controls</li>
                <li>✅ Upload and categorization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Real-time collaboration</li>
                <li>✅ Annotation threading and replies</li>
                <li>✅ Document versioning</li>
                <li>✅ Audit trails and history</li>
                <li>✅ Export and sharing options</li>
                <li>✅ Responsive design</li>
                <li>✅ Full TypeScript support</li>
                <li>✅ Accessibility features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}