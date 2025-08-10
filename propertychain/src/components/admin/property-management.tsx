/**
 * Property Management Component - PropertyChain Admin
 * 
 * Administrative property management and monitoring
 * Following UpdatedUIPlan.md Section 10 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Building,
  MapPin,
  DollarSign,
  Calendar,
  User,
  FileText,
  Image,
  MoreVertical,
  Edit,
  Eye,
  Trash,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield,
  Download,
  Upload,
  Filter,
  Search,
  Plus,
  Home,
  Building2,
  Briefcase,
  Hash,
  Percent,
  Star,
  MessageSquare,
  Activity,
  BarChart3,
  Flag,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useToast } from '@/hooks/use-toast'

// Types
interface Property {
  id: string
  title: string
  address: string
  type: 'single-family' | 'condo' | 'multi-family' | 'commercial'
  status: 'pending' | 'active' | 'sold' | 'suspended'
  price: number
  tokenized: boolean
  tokenSupply?: number
  tokensAvailable?: number
  owner: {
    id: string
    name: string
    verified: boolean
  }
  listing: {
    createdAt: string
    updatedAt: string
    views: number
    inquiries: number
    offers: number
  }
  compliance: {
    documentsVerified: boolean
    kycCompleted: boolean
    titleVerified: boolean
    inspectionPassed: boolean
  }
  financials: {
    valuation: number
    roi: number
    capRate: number
    monthlyRent?: number
  }
  images: string[]
  description: string
  features: string[]
  issues?: PropertyIssue[]
}

interface PropertyIssue {
  id: string
  type: 'compliance' | 'verification' | 'quality' | 'dispute'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  createdAt: string
  status: 'open' | 'investigating' | 'resolved'
}

interface PropertyStats {
  total: number
  active: number
  pending: number
  sold: number
  suspended: number
  totalValue: number
  avgPrice: number
  tokenizedCount: number
  complianceRate: number
}

// Mock data
const mockProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Modern Downtown Condo',
    address: '123 Main St, San Francisco, CA 94105',
    type: 'condo',
    status: 'active',
    price: 850000,
    tokenized: true,
    tokenSupply: 1000,
    tokensAvailable: 650,
    owner: {
      id: 'user-001',
      name: 'John Smith',
      verified: true,
    },
    listing: {
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      views: 1234,
      inquiries: 45,
      offers: 3,
    },
    compliance: {
      documentsVerified: true,
      kycCompleted: true,
      titleVerified: true,
      inspectionPassed: true,
    },
    financials: {
      valuation: 850000,
      roi: 8.5,
      capRate: 5.2,
      monthlyRent: 3500,
    },
    images: ['image1.jpg', 'image2.jpg'],
    description: 'Luxury downtown condo with stunning city views',
    features: ['2 Bedrooms', '2 Bathrooms', 'City View', 'Parking'],
  },
  {
    id: 'prop-002',
    title: 'Suburban Family Home',
    address: '456 Oak Ave, Palo Alto, CA 94301',
    type: 'single-family',
    status: 'pending',
    price: 1250000,
    tokenized: false,
    owner: {
      id: 'user-002',
      name: 'Jane Doe',
      verified: false,
    },
    listing: {
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 567,
      inquiries: 12,
      offers: 0,
    },
    compliance: {
      documentsVerified: false,
      kycCompleted: false,
      titleVerified: true,
      inspectionPassed: false,
    },
    financials: {
      valuation: 1250000,
      roi: 6.8,
      capRate: 4.5,
    },
    images: ['image3.jpg'],
    description: 'Spacious family home in quiet neighborhood',
    features: ['4 Bedrooms', '3 Bathrooms', 'Garden', 'Garage'],
    issues: [
      {
        id: 'issue-001',
        type: 'compliance',
        severity: 'high',
        description: 'KYC verification pending',
        createdAt: '2024-01-18',
        status: 'open',
      },
    ],
  },
]

const mockStats: PropertyStats = {
  total: 456,
  active: 234,
  pending: 45,
  sold: 177,
  suspended: 5,
  totalValue: 125000000,
  avgPrice: 274122,
  tokenizedCount: 189,
  complianceRate: 87.5,
}

interface PropertyManagementProps {
  onPropertyEdit?: (property: Property) => void
  onPropertyDelete?: (propertyId: string) => void
  onStatusChange?: (propertyId: string, status: Property['status']) => void
}

export function PropertyManagement({
  onPropertyEdit,
  onPropertyDelete,
  onStatusChange,
}: PropertyManagementProps) {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'views'>('date')

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...properties]

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType)
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price
        case 'views':
          return b.listing.views - a.listing.views
        case 'date':
        default:
          return new Date(b.listing.createdAt).getTime() - new Date(a.listing.createdAt).getTime()
      }
    })

    return filtered
  }, [properties, filterStatus, filterType, searchQuery, sortBy])

  // Handle status change
  const handleStatusChange = (propertyId: string, newStatus: Property['status']) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, status: newStatus } : p
    ))

    if (onStatusChange) {
      onStatusChange(propertyId, newStatus)
    }

    toast({
      title: 'Status updated',
      description: `Property status changed to ${newStatus}`,
    })
  }

  // Handle property approval
  const handleApprove = (property: Property) => {
    handleStatusChange(property.id, 'active')
  }

  // Handle property suspension
  const handleSuspend = (property: Property) => {
    handleStatusChange(property.id, 'suspended')
  }

  // Get status badge color
  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#E8F5E9] text-[#2E7D32]'
      case 'pending':
        return 'bg-[#FFF3E0] text-[#F57C00]'
      case 'sold':
        return 'bg-[#E6F2FF] text-[#007BFF]'
      case 'suspended':
        return 'bg-[#FFEBEE] text-[#C62828]'
      default:
        return 'bg-[#F5F5F5] text-[#616161]'
    }
  }

  // Get property type icon
  const getPropertyIcon = (type: Property['type']) => {
    switch (type) {
      case 'single-family':
        return <Home className="h-4 w-4" />
      case 'condo':
        return <Building2 className="h-4 w-4" />
      case 'multi-family':
        return <Building className="h-4 w-4" />
      case 'commercial':
        return <Briefcase className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">{mockStats.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {mockStats.active} active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {mockStats.pending} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">
              ${(mockStats.totalValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-[#9E9E9E] mt-2">
              Avg: ${(mockStats.avgPrice / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">Tokenized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">{mockStats.tokenizedCount}</div>
            <div className="flex items-center gap-1 mt-2">
              <Percent className="h-3 w-3 text-[#9E9E9E]" />
              <span className="text-xs text-[#9E9E9E]">
                {((mockStats.tokenizedCount / mockStats.total) * 100).toFixed(1)}% of total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#616161]">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4CAF50]">
              {mockStats.complianceRate}%
            </div>
            <p className="text-xs text-[#9E9E9E] mt-2">
              Fully verified properties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9E9E9E]" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="views">Views</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Property Listings</CardTitle>
              <CardDescription>
                Manage and monitor all property listings
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
                        {getPropertyIcon(property.type)}
                      </div>
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <div className="flex items-center gap-1 text-xs text-[#9E9E9E] mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.address}
                        </div>
                        {property.tokenized && (
                          <Badge variant="outline" className="text-xs mt-1">
                            <Hash className="h-3 w-3 mr-1" />
                            Tokenized
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-sm">{property.type.replace('-', ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">${(property.price / 1000).toFixed(0)}K</p>
                      {property.financials.monthlyRent && (
                        <p className="text-xs text-[#9E9E9E]">
                          ${property.financials.monthlyRent}/mo
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", getStatusColor(property.status))}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{property.owner.name}</span>
                      {property.owner.verified ? (
                        <CheckCircle className="h-3 w-3 text-[#4CAF50]" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-[#FF6347]" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {property.compliance.documentsVerified ? (
                        <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#DC3545]" />
                      )}
                      {property.compliance.kycCompleted ? (
                        <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#DC3545]" />
                      )}
                      {property.compliance.titleVerified ? (
                        <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#DC3545]" />
                      )}
                      {property.compliance.inspectionPassed ? (
                        <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#DC3545]" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-[#9E9E9E]" />
                        <span>{property.listing.views}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#9E9E9E]">
                        <MessageSquare className="h-3 w-3" />
                        <span>{property.listing.inquiries}</span>
                        <span>•</span>
                        <span>{property.listing.offers} offers</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedProperty(property)
                          setShowDetailDialog(true)
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedProperty(property)
                          setShowEditDialog(true)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Property
                        </DropdownMenuItem>
                        {property.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleApprove(property)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {property.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleSuspend(property)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
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

      {/* Property Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedProperty?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-6">
              {/* Property Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#9E9E9E]">Address</Label>
                  <p className="font-medium">{selectedProperty.address}</p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Type</Label>
                  <p className="font-medium capitalize">
                    {selectedProperty.type.replace('-', ' ')}
                  </p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Price</Label>
                  <p className="font-medium text-lg">
                    ${selectedProperty.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-[#9E9E9E]">Status</Label>
                  <Badge className={cn("capitalize", getStatusColor(selectedProperty.status))}>
                    {selectedProperty.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Owner Info */}
              <div>
                <h4 className="font-medium mb-3">Owner Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#9E9E9E]">Name</Label>
                    <p className="font-medium">{selectedProperty.owner.name}</p>
                  </div>
                  <div>
                    <Label className="text-[#9E9E9E]">Verification</Label>
                    <div className="flex items-center gap-2">
                      {selectedProperty.owner.verified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                          <span className="text-sm">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-[#DC3545]" />
                          <span className="text-sm">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Compliance Status */}
              <div>
                <h4 className="font-medium mb-3">Compliance Status</h4>
                <div className="space-y-2">
                  {Object.entries(selectedProperty.compliance).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#DC3545]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues */}
              {selectedProperty.issues && selectedProperty.issues.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Active Issues</h4>
                    <div className="space-y-2">
                      {selectedProperty.issues.map((issue) => (
                        <Alert key={issue.id} className="border-[#FFCC80]">
                          <AlertCircle className="h-4 w-4 text-[#FF6347]" />
                          <AlertDescription>
                            <p className="font-medium">{issue.description}</p>
                            <p className="text-xs text-[#9E9E9E] mt-1">
                              {issue.type} • {issue.severity} severity • {issue.status}
                            </p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}