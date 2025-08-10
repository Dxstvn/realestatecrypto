/**
 * Property Approval Queue - PropertyChain Admin
 * 
 * Card-based review interface for property approval workflow
 * Following UpdatedUIPlan.md Step 55.2 specifications
 */

'use client'

import { useState } from 'react'
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
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Image,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  MessageSquare,
  Shield,
  AlertTriangle,
  CheckSquare,
  Square,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface PropertyForApproval {
  id: string
  name: string
  address: string
  type: 'residential' | 'commercial' | 'industrial' | 'land'
  price: number
  tokenPrice: number
  totalTokens: number
  owner: {
    id: string
    name: string
    email: string
    avatar?: string
    verificationStatus: 'verified' | 'pending' | 'unverified'
  }
  documents: {
    id: string
    type: string
    name: string
    url: string
    verified: boolean
    uploadedAt: Date
  }[]
  images: string[]
  verificationChecks: {
    ownership: boolean
    valuation: boolean
    legalCompliance: boolean
    insurance: boolean
    inspection: boolean
    title: boolean
    zoning: boolean
    environmental: boolean
  }
  submittedAt: Date
  lastModified: Date
  notes: {
    id: string
    author: string
    content: string
    createdAt: Date
    type: 'info' | 'warning' | 'error'
  }[]
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'needs_info'
}

interface ApprovalQueueProps {
  properties: PropertyForApproval[]
  onApprove?: (propertyId: string, notes?: string) => void
  onReject?: (propertyId: string, reason: string) => void
  onRequestInfo?: (propertyId: string, message: string) => void
}

export function ApprovalQueue({ 
  properties, 
  onApprove,
  onReject,
  onRequestInfo
}: ApprovalQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProperty, setSelectedProperty] = useState<PropertyForApproval>(properties[0])
  const [internalNote, setInternalNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [infoRequest, setInfoRequest] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)

  const currentProperty = properties[currentIndex]
  if (!currentProperty) return null

  const handleApprove = () => {
    if (confirm('Are you sure you want to approve this property?')) {
      onApprove?.(currentProperty.id, internalNote)
      toast.success('Property approved successfully')
      setInternalNote('')
      handleNext()
    }
  }

  const handleReject = () => {
    if (!rejectReason) {
      toast.error('Please provide a reason for rejection')
      return
    }
    onReject?.(currentProperty.id, rejectReason)
    toast.success('Property rejected')
    setRejectReason('')
    setShowRejectModal(false)
    handleNext()
  }

  const handleRequestInfo = () => {
    if (!infoRequest) {
      toast.error('Please specify what information is needed')
      return
    }
    onRequestInfo?.(currentProperty.id, infoRequest)
    toast.success('Information request sent')
    setInfoRequest('')
    setShowInfoModal(false)
    handleNext()
  }

  const handleNext = () => {
    if (currentIndex < properties.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Calculate verification progress
  const verificationProgress = () => {
    const checks = Object.values(currentProperty.verificationChecks)
    const completed = checks.filter(Boolean).length
    return (completed / checks.length) * 100
  }

  // Check if all documents are verified
  const allDocumentsVerified = currentProperty.documents.every(doc => doc.verified)

  return (
    <div className="space-y-6">
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Approval Queue</h2>
          <p className="text-gray-500 mt-1">
            Reviewing {currentIndex + 1} of {properties.length} pending properties
          </p>
        </div>
        
        <div className="flex items-center gap-2">
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
            {currentIndex + 1} / {properties.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === properties.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentProperty.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{currentProperty.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">{currentProperty.type}</Badge>
                    <span className="text-sm text-gray-500">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {currentProperty.address}
                    </span>
                    <span className="text-sm text-gray-500">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Submitted {formatDate(currentProperty.submittedAt)}
                    </span>
                  </div>
                </div>
                
                <Badge 
                  className={cn(
                    currentProperty.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                    currentProperty.status === 'in_review' && 'bg-blue-100 text-blue-700',
                  )}
                >
                  {currentProperty.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="owner">Owner Info</TabsTrigger>
                  <TabsTrigger value="notes">Notes & History</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Property Images */}
                    <div>
                      <Label>Property Images</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {currentProperty.images.slice(0, 6).map((image, index) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Property ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {currentProperty.images.length > 6 && (
                        <Button variant="link" size="sm" className="mt-2">
                          View all {currentProperty.images.length} images
                        </Button>
                      )}
                    </div>

                    {/* Financial Details */}
                    <div className="space-y-4">
                      <div>
                        <Label>Financial Information</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Property Value</span>
                            <span className="font-medium">{formatCurrency(currentProperty.price)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Token Price</span>
                            <span className="font-medium">{formatCurrency(currentProperty.tokenPrice)}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Total Tokens</span>
                            <span className="font-medium">{currentProperty.totalTokens.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Min. Investment</span>
                            <span className="font-medium">
                              {formatCurrency(currentProperty.tokenPrice * 10)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <Label>Quick Actions</Label>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Package
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-2">
                    {currentProperty.documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.type} • Uploaded {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {doc.verified ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!allDocumentsVerified && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Some documents are still pending verification. Please review all documents before approval.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                {/* Verification Tab */}
                <TabsContent value="verification" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Verification Progress</Label>
                        <span className="text-sm font-medium">{verificationProgress().toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${verificationProgress()}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(currentProperty.verificationChecks).map(([key, value]) => (
                        <div 
                          key={key}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {value ? (
                              <CheckSquare className="h-5 w-5 text-green-600" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Toggle verification status
                              toast.success(`${key} verification updated`)
                            }}
                          >
                            {value ? 'Verified' : 'Mark Verified'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Owner Info Tab */}
                <TabsContent value="owner" className="space-y-4">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={currentProperty.owner.avatar} />
                      <AvatarFallback>
                        {currentProperty.owner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{currentProperty.owner.name}</h3>
                        <p className="text-gray-500">{currentProperty.owner.email}</p>
                        <Badge 
                          className={cn(
                            'mt-2',
                            currentProperty.owner.verificationStatus === 'verified' && 'bg-green-100 text-green-700',
                            currentProperty.owner.verificationStatus === 'pending' && 'bg-yellow-100 text-yellow-700',
                            currentProperty.owner.verificationStatus === 'unverified' && 'bg-gray-100 text-gray-700'
                          )}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {currentProperty.owner.verificationStatus}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Properties</p>
                          <p className="text-xl font-bold">12</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Success Rate</p>
                          <p className="text-xl font-bold">92%</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="text-xl font-bold">2023</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Owner
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Notes & History Tab */}
                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <Label>Internal Notes</Label>
                    <Textarea
                      className="mt-2"
                      placeholder="Add internal notes about this property..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Audit Trail</Label>
                    <ScrollArea className="h-64 mt-2 border rounded-lg p-4">
                      <div className="space-y-3">
                        {currentProperty.notes.map((note) => (
                          <div key={note.id} className="flex gap-3">
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              note.type === 'info' && 'bg-blue-500',
                              note.type === 'warning' && 'bg-yellow-500',
                              note.type === 'error' && 'bg-red-500'
                            )} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{note.author}</span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(note.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{note.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <Separator className="my-6" />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={handleApprove}
                    disabled={!allDocumentsVerified || verificationProgress() < 100}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Property
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectModal(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowInfoModal(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Info
                  </Button>
                </div>
                
                <Button variant="ghost" onClick={handleNext}>
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reject Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Reason for Rejection</Label>
                <Textarea
                  className="mt-2"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
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