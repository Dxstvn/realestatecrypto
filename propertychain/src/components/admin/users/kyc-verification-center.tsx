/**
 * KYC Verification Center - PropertyChain Admin
 * 
 * Queue-based KYC verification workflow with document viewer
 * Following UpdatedUIPlan.md Step 55.3 and Section 10.4 specifications
 */

'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Image,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Shield,
  AlertTriangle,
  CheckSquare,
  Square,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Building,
  Fingerprint,
  Globe,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface KYCSubmission {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    location?: {
      city: string
      country: string
    }
    accountCreated: Date
    previousSubmissions: number
  }
  submittedAt: Date
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'needs_info'
  documents: {
    id: string
    type: 'id_front' | 'id_back' | 'selfie' | 'address_proof' | 'bank_statement' | 'tax_document'
    name: string
    url: string
    uploadedAt: Date
    metadata?: {
      size: number
      format: string
      resolution?: string
    }
  }[]
  automatedChecks: {
    documentAuthenticity: { passed: boolean; confidence: number; details?: string }
    faceMatch: { passed: boolean; confidence: number; details?: string }
    addressVerification: { passed: boolean; confidence: number; details?: string }
    sanctionsCheck: { passed: boolean; confidence: number; details?: string }
    ageVerification: { passed: boolean; confidence: number; details?: string }
    duplicateCheck: { passed: boolean; confidence: number; details?: string }
  }
  manualChecks: {
    documentsComplete: boolean
    documentsLegible: boolean
    informationMatches: boolean
    noSuspiciousActivity: boolean
    identityConfirmed: boolean
  }
  riskScore: number // 0-100, lower is better
  notes: {
    id: string
    author: string
    content: string
    createdAt: Date
    type: 'info' | 'warning' | 'error'
  }[]
  previousActions: {
    action: string
    performedBy: string
    timestamp: Date
    reason?: string
  }[]
}

interface KYCVerificationCenterProps {
  submissions: KYCSubmission[]
  onApprove?: (submissionId: string, notes?: string) => void
  onReject?: (submissionId: string, reason: string) => void
  onRequestInfo?: (submissionId: string, message: string) => void
}

export function KYCVerificationCenter({ 
  submissions, 
  onApprove,
  onReject,
  onRequestInfo
}: KYCVerificationCenterProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({})
  const [internalNote, setInternalNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [infoRequest, setInfoRequest] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  
  const imageRef = useRef<HTMLDivElement>(null)
  
  const currentSubmission = submissions[currentIndex]
  if (!currentSubmission) return null

  // Calculate verification progress
  const calculateProgress = () => {
    const automatedChecks = Object.values(currentSubmission.automatedChecks)
    const manualChecks = Object.values(currentSubmission.manualChecks)
    const totalChecks = automatedChecks.length + manualChecks.length
    const passedChecks = automatedChecks.filter(c => c.passed).length + 
                        manualChecks.filter(Boolean).length
    return (passedChecks / totalChecks) * 100
  }

  // Handle document viewer controls
  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50))
  const handleRotate = () => setRotation((rotation + 90) % 360)
  const handleReset = () => {
    setZoom(100)
    setRotation(0)
  }

  // Handle actions
  const handleApprove = () => {
    if (confirm('Are you sure you want to approve this KYC submission?')) {
      onApprove?.(currentSubmission.id, internalNote)
      toast.success('KYC approved successfully')
      setInternalNote('')
      handleNext()
    }
  }

  const handleReject = () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for rejection')
      return
    }
    onReject?.(currentSubmission.id, rejectReason)
    toast.success('KYC rejected')
    setRejectReason('')
    setShowRejectModal(false)
    handleNext()
  }

  const handleRequestInfo = () => {
    if (!infoRequest) {
      toast.error('Please specify what information is needed')
      return
    }
    onRequestInfo?.(currentSubmission.id, infoRequest)
    toast.success('Information request sent')
    setInfoRequest('')
    setShowInfoModal(false)
    handleNext()
  }

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedDocument(null)
      setManualOverrides({})
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedDocument(null)
      setManualOverrides({})
    }
  }

  const handleBulkApprove = () => {
    if (selectedSubmissions.length === 0) {
      toast.error('No submissions selected')
      return
    }
    toast.success(`${selectedSubmissions.length} KYC submissions approved`)
    setSelectedSubmissions([])
    setIsBulkMode(false)
  }

  // Toggle manual check override
  const toggleManualCheck = (checkKey: string) => {
    setManualOverrides(prev => ({
      ...prev,
      [checkKey]: !prev[checkKey]
    }))
  }

  // Get risk level color
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50'
    if (score < 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const progress = calculateProgress()
  const allAutomatedChecksPassed = Object.values(currentSubmission.automatedChecks).every(c => c.passed)
  const allManualChecksPassed = Object.values(currentSubmission.manualChecks).every(Boolean) ||
                                Object.values(manualOverrides).some(Boolean)

  return (
    <div className="space-y-6">
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">KYC Verification Center</h2>
          <p className="text-gray-500 mt-1">
            Reviewing {currentIndex + 1} of {submissions.length} pending submissions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isBulkMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsBulkMode(!isBulkMode)}
          >
            {isBulkMode ? 'Exit Bulk Mode' : 'Bulk Process'}
          </Button>
          
          {!isBulkMode && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {submissions.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === submissions.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {isBulkMode && selectedSubmissions.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedSubmissions.length} submissions selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleBulkApprove}>
              Approve Selected
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedSubmissions([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubmission.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content - Document Viewer */}
            <div className="col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Document Review</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleZoomOut}
                        disabled={zoom <= 50}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium w-12 text-center">
                        {zoom}%
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={zoom >= 200}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleRotate}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="documents" className="h-full">
                    <TabsList className="grid grid-cols-2 w-full max-w-md">
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="documents" className="mt-4">
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {currentSubmission.documents.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDocument(doc)}
                            className={cn(
                              "p-2 border rounded-lg hover:bg-gray-50 transition-colors",
                              selectedDocument?.id === doc.id && "border-primary bg-primary/5"
                            )}
                          >
                            <FileText className="h-8 w-8 mx-auto mb-1 text-gray-400" />
                            <p className="text-xs text-center truncate">
                              {doc.type.replace('_', ' ')}
                            </p>
                          </button>
                        ))}
                      </div>
                      
                      {selectedDocument ? (
                        <div 
                          ref={imageRef}
                          className="relative bg-gray-100 rounded-lg overflow-hidden"
                          style={{ height: '500px' }}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            <img
                              src={selectedDocument.url}
                              alt={selectedDocument.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="h-[500px] bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                            <p>Select a document to review</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="comparison" className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 rounded-lg p-4 h-[500px]">
                          <p className="text-sm font-medium mb-2">ID Document</p>
                          {/* Document preview */}
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 h-[500px]">
                          <p className="text-sm font-medium mb-2">Selfie</p>
                          {/* Selfie preview */}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Verification Details */}
            <div className="space-y-4">
              {/* User Info Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={currentSubmission.user.avatar} />
                      <AvatarFallback>
                        {currentSubmission.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{currentSubmission.user.name}</p>
                      <p className="text-sm text-gray-500">{currentSubmission.user.email}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    {currentSubmission.user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{currentSubmission.user.phone}</span>
                      </div>
                    )}
                    {currentSubmission.user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {currentSubmission.user.location.city}, {currentSubmission.user.location.country}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Member since {formatDate(currentSubmission.user.accountCreated)}</span>
                    </div>
                    {currentSubmission.user.previousSubmissions > 0 && (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                        <span>{currentSubmission.user.previousSubmissions} previous attempts</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={cn(
                    'p-3 rounded-lg text-center',
                    getRiskColor(currentSubmission.riskScore)
                  )}>
                    <p className="text-sm font-medium">Risk Score</p>
                    <p className="text-2xl font-bold">{currentSubmission.riskScore}</p>
                    <p className="text-xs mt-1">
                      {currentSubmission.riskScore < 30 ? 'Low Risk' :
                       currentSubmission.riskScore < 60 ? 'Medium Risk' : 'High Risk'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Automated Checks Card */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Automated Checks</CardTitle>
                    {allAutomatedChecksPassed ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        All Passed
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Review Needed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(currentSubmission.automatedChecks).map(([key, check]) => (
                    <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{check.confidence}%</p>
                        {check.details && (
                          <p className="text-xs text-gray-500">{check.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Manual Checks Card */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Manual Verification</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setManualOverrides({})}>
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(currentSubmission.manualChecks).map(([key, value]) => {
                    const isOverridden = manualOverrides[key] !== undefined
                    const isChecked = isOverridden ? manualOverrides[key] : value
                    
                    return (
                      <div 
                        key={key}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => toggleManualCheck(key)}
                      >
                        <div className="flex items-center gap-2">
                          {isChecked ? (
                            <CheckSquare className="h-4 w-4 text-green-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        {isOverridden && (
                          <Badge variant="secondary" className="text-xs">
                            Override
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Progress and Actions */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Verification Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Overall Progress</span>
                      <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div>
                    <Label>Internal Notes</Label>
                    <Textarea
                      className="mt-2"
                      placeholder="Add notes about this verification..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={handleApprove}
                      disabled={!allAutomatedChecksPassed || !allManualChecksPassed}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve KYC
                    </Button>
                    
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setShowRejectModal(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowInfoModal(true)}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Request More Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject KYC Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rejection Reason</Label>
                <Textarea
                  className="mt-2"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Common Reasons:</p>
                <div className="space-y-1">
                  {[
                    'Documents are illegible or blurry',
                    'Information does not match records',
                    'Suspected fraudulent documents',
                    'Missing required documents',
                    'Age verification failed',
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className="text-sm text-left p-2 hover:bg-gray-50 rounded-lg w-full"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Confirm Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Information Needed</Label>
                <Textarea
                  className="mt-2"
                  placeholder="Describe what additional information or documents are needed..."
                  value={infoRequest}
                  onChange={(e) => setInfoRequest(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Common Requests:</p>
                <div className="space-y-1">
                  {[
                    'Please provide a clearer photo of your ID',
                    'Address proof document is required',
                    'Selfie must show your face clearly',
                    'Bank statement must be from the last 3 months',
                    'Please provide additional verification documents',
                  ].map((request) => (
                    <button
                      key={request}
                      onClick={() => setInfoRequest(request)}
                      className="text-sm text-left p-2 hover:bg-gray-50 rounded-lg w-full"
                    >
                      {request}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowInfoModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestInfo}>
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}