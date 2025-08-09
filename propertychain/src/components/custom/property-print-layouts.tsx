/**
 * Property Print Layouts - PropertyChain
 * 
 * Specialized print layouts for real estate documents and reports
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  PrintLayout,
  PrintButton,
  type PrintableDocument,
} from './print-layouts'
import {
  Home,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Users,
  Camera,
  Star,
  CheckCircle,
  Info,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Bath,
  Bed,
  Car,
  Square,
  TreePine,
  Wifi,
  Zap,
  Droplets,
  Shield,
  Key,
  Clock,
  FileText,
  AlertTriangle,
  Target,
  Briefcase,
  Calculator,
  CreditCard,
  Receipt,
  PiggyBank,
  TrendingDown,
  Eye,
  Download,
  Share,
  Print,
} from 'lucide-react'
import { formatCurrency, formatDate, formatNumber, formatSquareFeet } from '@/lib/format'
import { addDays, subDays, subMonths } from 'date-fns'

// Property-specific print types
export interface PropertyListingPrintData {
  id: string
  title: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFeet: number
  lotSize?: number
  yearBuilt?: number
  description: string
  features: string[]
  amenities: string[]
  photos: Array<{ url: string; caption?: string }>
  agent: {
    name: string
    phone: string
    email: string
    license: string
    brokerage: string
  }
  listing: {
    mlsNumber?: string
    listedDate: Date
    status: string
    daysOnMarket: number
  }
  financial: {
    price: number
    pricePerSqFt: number
    taxes?: number
    hoaFees?: number
    insurance?: number
  }
  neighborhood: {
    schools: Array<{ name: string; rating?: number; distance?: string }>
    amenities: string[]
    demographics?: {
      medianAge?: number
      medianIncome?: number
      homeOwnership?: number
    }
  }
}

export interface TransactionReportData {
  id: string
  propertyAddress: string
  transactionType: 'purchase' | 'sale' | 'refinance'
  parties: {
    buyer?: { name: string; email: string; phone: string }
    seller?: { name: string; email: string; phone: string }
    buyerAgent?: { name: string; license: string; brokerage: string }
    sellerAgent?: { name: string; license: string; brokerage: string }
    lender?: { name: string; contact: string }
    titleCompany?: { name: string; contact: string }
  }
  financial: {
    purchasePrice: number
    downPayment: number
    loanAmount: number
    interestRate: number
    monthlyPayment: number
    closingCosts: number
    earnestMoney: number
  }
  timeline: {
    listingDate?: Date
    offerDate: Date
    acceptanceDate: Date
    inspectionDate?: Date
    appraisalDate?: Date
    closingDate: Date
    possessionDate?: Date
  }
  milestones: Array<{
    name: string
    completed: boolean
    completedDate?: Date
    dueDate?: Date
    responsible: string
  }>
  documents: Array<{
    name: string
    type: string
    status: 'pending' | 'received' | 'approved'
    dueDate?: Date
  }>
  notes: string[]
}

export interface MarketReportData {
  area: string
  reportDate: Date
  period: string
  summary: {
    totalSales: number
    averagePrice: number
    medianPrice: number
    priceChange: number
    daysOnMarket: number
    inventoryLevel: number
  }
  trends: {
    priceHistory: Array<{ date: Date; price: number }>
    salesVolume: Array<{ date: Date; volume: number }>
    inventory: Array<{ date: Date; count: number }>
  }
  comparables: Array<{
    address: string
    price: number
    squareFeet: number
    pricePerSqFt: number
    daysOnMarket: number
    soldDate: Date
  }>
  forecast: {
    nextQuarter: {
      priceChange: number
      salesVolume: number
      recommendation: string
    }
    nextYear: {
      priceChange: number
      marketCondition: string
    }
  }
}

// Property Listing Print Layout
interface PropertyListingPrintProps {
  data: PropertyListingPrintData
  variant?: 'full' | 'summary' | 'flyer'
  showPhotos?: boolean
  showAgent?: boolean
  className?: string
}

export function PropertyListingPrint({
  data,
  variant = 'full',
  showPhotos = true,
  showAgent = true,
  className,
}: PropertyListingPrintProps) {
  if (variant === 'flyer') {
    return <PropertyFlyer data={data} showAgent={showAgent} className={className} />
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <div className="flex items-center justify-center gap-4 text-lg text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {data.address}, {data.city}, {data.state} {data.zipCode}
          </span>
        </div>
        <div className="text-2xl font-bold text-primary mt-4">
          {formatCurrency(data.price)}
        </div>
      </div>

      {/* Key Details */}
      <div className="grid gap-4 md:grid-cols-4">
        {data.bedrooms && (
          <div className="text-center p-4 border rounded">
            <Bed className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{data.bedrooms}</div>
            <div className="text-sm text-muted-foreground">Bedrooms</div>
          </div>
        )}
        {data.bathrooms && (
          <div className="text-center p-4 border rounded">
            <Bath className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{data.bathrooms}</div>
            <div className="text-sm text-muted-foreground">Bathrooms</div>
          </div>
        )}
        <div className="text-center p-4 border rounded">
          <Square className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <div className="text-2xl font-bold">{formatSquareFeet(data.squareFeet)}</div>
          <div className="text-sm text-muted-foreground">Square Feet</div>
        </div>
        {data.lotSize && (
          <div className="text-center p-4 border rounded">
            <TreePine className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <div className="text-2xl font-bold">{formatSquareFeet(data.lotSize)}</div>
            <div className="text-sm text-muted-foreground">Lot Size</div>
          </div>
        )}
      </div>

      {variant === 'full' && (
        <>
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Property Description</h2>
            <p className="text-muted-foreground leading-relaxed">{data.description}</p>
          </div>

          {/* Property Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Property Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Property Type:</span>
                  <span className="font-medium">{data.propertyType}</span>
                </div>
                {data.yearBuilt && (
                  <div className="flex justify-between">
                    <span>Year Built:</span>
                    <span className="font-medium">{data.yearBuilt}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Price per Sq Ft:</span>
                  <span className="font-medium">{formatCurrency(data.financial.pricePerSqFt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days on Market:</span>
                  <span className="font-medium">{data.listing.daysOnMarket}</span>
                </div>
                {data.listing.mlsNumber && (
                  <div className="flex justify-between">
                    <span>MLS Number:</span>
                    <span className="font-medium">{data.listing.mlsNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Financial Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>List Price:</span>
                  <span className="font-medium">{formatCurrency(data.financial.price)}</span>
                </div>
                {data.financial.taxes && (
                  <div className="flex justify-between">
                    <span>Annual Taxes:</span>
                    <span className="font-medium">{formatCurrency(data.financial.taxes)}</span>
                  </div>
                )}
                {data.financial.hoaFees && (
                  <div className="flex justify-between">
                    <span>HOA Fees:</span>
                    <span className="font-medium">{formatCurrency(data.financial.hoaFees)}/month</span>
                  </div>
                )}
                {data.financial.insurance && (
                  <div className="flex justify-between">
                    <span>Insurance (est.):</span>
                    <span className="font-medium">{formatCurrency(data.financial.insurance)}/year</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          {data.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="grid gap-1 md:grid-cols-2">
                {data.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Neighborhood Information */}
          {data.neighborhood.schools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Nearby Schools</h3>
              <div className="space-y-2">
                {data.neighborhood.schools.map((school, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{school.name}</div>
                      {school.distance && (
                        <div className="text-sm text-muted-foreground">{school.distance}</div>
                      )}
                    </div>
                    {school.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{school.rating}/10</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Agent Information */}
      {showAgent && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Listing Agent</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{data.agent.name}</div>
              <div className="text-muted-foreground mb-2">{data.agent.brokerage}</div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {data.agent.phone}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {data.agent.email}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                License: {data.agent.license}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-4 text-center text-sm text-muted-foreground">
        <div>
          Listed on {formatDate(data.listing.listedDate)} • Status: {data.listing.status}
        </div>
        <div className="mt-2">
          This information is believed to be accurate but is not guaranteed. 
          Buyers should verify all information independently.
        </div>
      </div>
    </div>
  )
}

// Property Flyer Layout
function PropertyFlyer({
  data,
  showAgent = true,
  className,
}: {
  data: PropertyListingPrintData
  showAgent?: boolean
  className?: string
}) {
  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {/* Hero Section */}
      <div className="relative mb-6">
        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <Camera className="h-16 w-16 text-gray-400" />
        </div>
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded text-lg font-bold">
          {formatCurrency(data.price)}
        </div>
      </div>

      {/* Property Info */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <div className="text-muted-foreground mb-4">
          {data.address}, {data.city}, {data.state} {data.zipCode}
        </div>
        
        {/* Key Stats */}
        <div className="flex items-center justify-center gap-6 text-center">
          {data.bedrooms && (
            <div>
              <div className="text-2xl font-bold">{data.bedrooms}</div>
              <div className="text-xs text-muted-foreground">BEDS</div>
            </div>
          )}
          {data.bathrooms && (
            <div>
              <div className="text-2xl font-bold">{data.bathrooms}</div>
              <div className="text-xs text-muted-foreground">BATHS</div>
            </div>
          )}
          <div>
            <div className="text-2xl font-bold">{formatNumber(data.squareFeet)}</div>
            <div className="text-xs text-muted-foreground">SQ FT</div>
          </div>
          {data.lotSize && (
            <div>
              <div className="text-2xl font-bold">{formatNumber(data.lotSize)}</div>
              <div className="text-xs text-muted-foreground">LOT</div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm leading-relaxed">{data.description}</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
        {data.features.slice(0, 6).map((feature, index) => (
          <div key={index} className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Agent Info */}
      {showAgent && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{data.agent.name}</div>
              <div className="text-sm text-muted-foreground">{data.agent.brokerage}</div>
            </div>
            <div className="text-right text-sm">
              <div>{data.agent.phone}</div>
              <div className="text-muted-foreground">{data.agent.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Placeholder */}
      <div className="text-center mt-6">
        <div className="inline-block p-4 border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
            <span className="text-xs">QR CODE</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Scan for more photos and details
        </div>
      </div>
    </div>
  )
}

// Transaction Report Print Layout
interface TransactionReportPrintProps {
  data: TransactionReportData
  variant?: 'summary' | 'detailed'
  className?: string
}

export function TransactionReportPrint({
  data,
  variant = 'detailed',
  className,
}: TransactionReportPrintProps) {
  const completedMilestones = data.milestones.filter(m => m.completed).length
  const totalMilestones = data.milestones.length
  const progress = (completedMilestones / totalMilestones) * 100

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">Transaction Report</h1>
        <div className="text-lg text-muted-foreground">{data.propertyAddress}</div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {data.transactionType.toUpperCase()}
          </Badge>
          <Badge variant={completedMilestones === totalMilestones ? 'default' : 'secondary'} className="text-lg px-3 py-1">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction Progress</h2>
        <div className="space-y-3">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedMilestones} of {totalMilestones} milestones completed</span>
            <span>Closing: {formatDate(data.timeline.closingDate)}</span>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded">
              <span>Purchase Price:</span>
              <span className="font-bold text-lg">{formatCurrency(data.financial.purchasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Down Payment:</span>
              <span className="font-medium">{formatCurrency(data.financial.downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Loan Amount:</span>
              <span className="font-medium">{formatCurrency(data.financial.loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Earnest Money:</span>
              <span className="font-medium">{formatCurrency(data.financial.earnestMoney)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span className="font-medium">{data.financial.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Payment:</span>
              <span className="font-medium">{formatCurrency(data.financial.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Closing Costs:</span>
              <span className="font-medium">{formatCurrency(data.financial.closingCosts)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Dates</h2>
        <div className="space-y-2">
          {data.timeline.listingDate && (
            <div className="flex justify-between p-2 border-l-4 border-gray-300">
              <span>Listed:</span>
              <span className="font-medium">{formatDate(data.timeline.listingDate)}</span>
            </div>
          )}
          <div className="flex justify-between p-2 border-l-4 border-blue-300">
            <span>Offer Submitted:</span>
            <span className="font-medium">{formatDate(data.timeline.offerDate)}</span>
          </div>
          <div className="flex justify-between p-2 border-l-4 border-green-300">
            <span>Offer Accepted:</span>
            <span className="font-medium">{formatDate(data.timeline.acceptanceDate)}</span>
          </div>
          {data.timeline.inspectionDate && (
            <div className="flex justify-between p-2 border-l-4 border-yellow-300">
              <span>Inspection:</span>
              <span className="font-medium">{formatDate(data.timeline.inspectionDate)}</span>
            </div>
          )}
          {data.timeline.appraisalDate && (
            <div className="flex justify-between p-2 border-l-4 border-purple-300">
              <span>Appraisal:</span>
              <span className="font-medium">{formatDate(data.timeline.appraisalDate)}</span>
            </div>
          )}
          <div className="flex justify-between p-2 border-l-4 border-red-300">
            <span>Closing:</span>
            <span className="font-medium">{formatDate(data.timeline.closingDate)}</span>
          </div>
        </div>
      </div>

      {variant === 'detailed' && (
        <>
          {/* Parties */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Transaction Parties</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {data.parties.buyer && (
                <div className="p-4 border rounded">
                  <h3 className="font-semibold mb-2">Buyer</h3>
                  <div className="space-y-1 text-sm">
                    <div>{data.parties.buyer.name}</div>
                    <div className="text-muted-foreground">{data.parties.buyer.email}</div>
                    <div className="text-muted-foreground">{data.parties.buyer.phone}</div>
                  </div>
                </div>
              )}
              {data.parties.seller && (
                <div className="p-4 border rounded">
                  <h3 className="font-semibold mb-2">Seller</h3>
                  <div className="space-y-1 text-sm">
                    <div>{data.parties.seller.name}</div>
                    <div className="text-muted-foreground">{data.parties.seller.email}</div>
                    <div className="text-muted-foreground">{data.parties.seller.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            <div className="space-y-2">
              {data.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded border",
                    milestone.completed ? "bg-green-50 border-green-200" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">{milestone.name}</div>
                      <div className="text-sm text-muted-foreground">{milestone.responsible}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {milestone.completed && milestone.completedDate ? (
                      <div className="text-green-600">
                        Completed {formatDate(milestone.completedDate)}
                      </div>
                    ) : milestone.dueDate ? (
                      <div className="text-muted-foreground">
                        Due {formatDate(milestone.dueDate)}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Status */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Document Status</h2>
            <div className="space-y-2">
              {data.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">{doc.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        doc.status === 'approved' 
                          ? 'default' 
                          : doc.status === 'received' 
                          ? 'secondary' 
                          : 'outline'
                      }
                    >
                      {doc.status}
                    </Badge>
                    {doc.dueDate && (
                      <div className="text-sm text-muted-foreground">
                        Due {formatDate(doc.dueDate)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Notes */}
      {data.notes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <div className="space-y-2">
            {data.notes.map((note, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm">{note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Market Report Print Layout
interface MarketReportPrintProps {
  data: MarketReportData
  className?: string
}

export function MarketReportPrint({
  data,
  className,
}: MarketReportPrintProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">Market Report</h1>
        <div className="text-xl text-muted-foreground mb-2">{data.area}</div>
        <div className="text-lg">{data.period} • {formatDate(data.reportDate)}</div>
      </div>

      {/* Market Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Market Summary</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 border rounded">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{data.summary.totalSales}</div>
            <div className="text-sm text-muted-foreground">Total Sales</div>
          </div>
          <div className="text-center p-4 border rounded">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{formatCurrency(data.summary.averagePrice)}</div>
            <div className="text-sm text-muted-foreground">Average Price</div>
          </div>
          <div className="text-center p-4 border rounded">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className={cn(
              "text-2xl font-bold",
              data.summary.priceChange >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {data.summary.priceChange >= 0 ? '+' : ''}{data.summary.priceChange}%
            </div>
            <div className="text-sm text-muted-foreground">Price Change</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-3">Market Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Median Price:</span>
              <span className="font-medium">{formatCurrency(data.summary.medianPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Days on Market:</span>
              <span className="font-medium">{data.summary.daysOnMarket}</span>
            </div>
            <div className="flex justify-between">
              <span>Inventory Level:</span>
              <span className="font-medium">{data.summary.inventoryLevel} months</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Forecast</h3>
          <div className="space-y-3">
            <div>
              <div className="font-medium">Next Quarter</div>
              <div className="text-sm text-muted-foreground">
                Price change: {data.forecast.nextQuarter.priceChange >= 0 ? '+' : ''}{data.forecast.nextQuarter.priceChange}%
              </div>
              <div className="text-sm text-muted-foreground">
                {data.forecast.nextQuarter.recommendation}
              </div>
            </div>
            <div>
              <div className="font-medium">Next Year</div>
              <div className="text-sm text-muted-foreground">
                Market condition: {data.forecast.nextYear.marketCondition}
              </div>
              <div className="text-sm text-muted-foreground">
                Expected price change: {data.forecast.nextYear.priceChange >= 0 ? '+' : ''}{data.forecast.nextYear.priceChange}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparable Sales */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Comparable Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Address</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Sq Ft</th>
                <th className="border border-gray-300 px-4 py-2 text-right">$/Sq Ft</th>
                <th className="border border-gray-300 px-4 py-2 text-right">DOM</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Sold Date</th>
              </tr>
            </thead>
            <tbody>
              {data.comparables.map((comp, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{comp.address}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(comp.price)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(comp.squareFeet)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(comp.pricePerSqFt)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{comp.daysOnMarket}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{formatDate(comp.soldDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-center text-sm text-muted-foreground">
        <div>
          Data compiled from multiple sources including MLS, public records, and market analysis.
        </div>
        <div className="mt-2">
          This report is provided for informational purposes only and should not be considered as investment advice.
        </div>
      </div>
    </div>
  )
}

// Utility functions for creating mock property print data
export function createMockPropertyListingData(): PropertyListingPrintData {
  return {
    id: 'prop-123',
    title: 'Stunning Modern Family Home',
    address: '123 Maple Street',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
    price: 750000,
    propertyType: 'Single Family Home',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    lotSize: 8000,
    yearBuilt: 2018,
    description: 'This beautiful modern home features an open floor plan with high ceilings, gourmet kitchen with granite countertops, and a spacious master suite. The backyard includes a pool and spa, perfect for entertaining. Located in a desirable neighborhood with excellent schools.',
    features: [
      'Hardwood floors throughout',
      'Granite countertops',
      'Stainless steel appliances',
      'Walk-in closets',
      'Two-car garage',
      'Swimming pool and spa',
      'Covered patio',
      'Central air conditioning',
      'Security system',
      'Sprinkler system'
    ],
    amenities: [
      'Community pool',
      'Tennis court',
      'Playground',
      'Walking trails'
    ],
    photos: [
      { url: '/photos/front.jpg', caption: 'Front exterior view' },
      { url: '/photos/kitchen.jpg', caption: 'Gourmet kitchen' },
      { url: '/photos/master.jpg', caption: 'Master bedroom' },
    ],
    agent: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@propertychain.com',
      license: 'CA DRE# 12345678',
      brokerage: 'PropertyChain Realty'
    },
    listing: {
      mlsNumber: 'MLS123456',
      listedDate: subDays(new Date(), 15),
      status: 'Active',
      daysOnMarket: 15
    },
    financial: {
      price: 750000,
      pricePerSqFt: 268,
      taxes: 9000,
      hoaFees: 150,
      insurance: 1800
    },
    neighborhood: {
      schools: [
        { name: 'Maple Elementary School', rating: 9, distance: '0.3 miles' },
        { name: 'Lincoln Middle School', rating: 8, distance: '0.7 miles' },
        { name: 'Roosevelt High School', rating: 9, distance: '1.2 miles' }
      ],
      amenities: [
        'Parks and recreation',
        'Shopping centers',
        'Public transportation',
        'Restaurants and cafes'
      ]
    }
  }
}

export function createMockTransactionData(): TransactionReportData {
  return {
    id: 'trans-456',
    propertyAddress: '123 Maple Street, Sacramento, CA 95814',
    transactionType: 'purchase',
    parties: {
      buyer: {
        name: 'John and Mary Smith',
        email: 'john.smith@email.com',
        phone: '(555) 987-6543'
      },
      seller: {
        name: 'Robert Johnson',
        email: 'robert.johnson@email.com',
        phone: '(555) 555-1234'
      },
      buyerAgent: {
        name: 'Sarah Johnson',
        license: 'CA DRE# 12345678',
        brokerage: 'PropertyChain Realty'
      },
      lender: {
        name: 'First National Bank',
        contact: 'Lisa Chen - (555) 111-2222'
      }
    },
    financial: {
      purchasePrice: 750000,
      downPayment: 150000,
      loanAmount: 600000,
      interestRate: 6.5,
      monthlyPayment: 3794,
      closingCosts: 15000,
      earnestMoney: 7500
    },
    timeline: {
      offerDate: subDays(new Date(), 30),
      acceptanceDate: subDays(new Date(), 28),
      inspectionDate: subDays(new Date(), 21),
      appraisalDate: subDays(new Date(), 14),
      closingDate: addDays(new Date(), 5),
      possessionDate: addDays(new Date(), 5)
    },
    milestones: [
      {
        name: 'Offer Accepted',
        completed: true,
        completedDate: subDays(new Date(), 28),
        responsible: 'Buyer Agent'
      },
      {
        name: 'Inspection Completed',
        completed: true,
        completedDate: subDays(new Date(), 21),
        responsible: 'Inspector'
      },
      {
        name: 'Appraisal Completed',
        completed: true,
        completedDate: subDays(new Date(), 14),
        responsible: 'Lender'
      },
      {
        name: 'Final Loan Approval',
        completed: false,
        dueDate: addDays(new Date(), 2),
        responsible: 'Lender'
      },
      {
        name: 'Final Walkthrough',
        completed: false,
        dueDate: addDays(new Date(), 4),
        responsible: 'Buyer'
      },
      {
        name: 'Closing',
        completed: false,
        dueDate: addDays(new Date(), 5),
        responsible: 'Title Company'
      }
    ],
    documents: [
      {
        name: 'Purchase Agreement',
        type: 'Contract',
        status: 'approved'
      },
      {
        name: 'Inspection Report',
        type: 'Report',
        status: 'received'
      },
      {
        name: 'Appraisal Report',
        type: 'Report',
        status: 'approved'
      },
      {
        name: 'Loan Documents',
        type: 'Financial',
        status: 'pending',
        dueDate: addDays(new Date(), 2)
      }
    ],
    notes: [
      'Inspection revealed minor plumbing issues - seller agreed to repair',
      'Appraisal came in at full purchase price',
      'Buyer secured favorable loan terms at 6.5% interest'
    ]
  }
}

export function createMockMarketReportData(): MarketReportData {
  return {
    area: 'Sacramento, CA - Downtown District',
    reportDate: new Date(),
    period: 'Q4 2024',
    summary: {
      totalSales: 847,
      averagePrice: 650000,
      medianPrice: 625000,
      priceChange: 4.2,
      daysOnMarket: 28,
      inventoryLevel: 2.3
    },
    trends: {
      priceHistory: [
        { date: subMonths(new Date(), 12), price: 590000 },
        { date: subMonths(new Date(), 9), price: 610000 },
        { date: subMonths(new Date(), 6), price: 630000 },
        { date: subMonths(new Date(), 3), price: 625000 },
        { date: new Date(), price: 650000 }
      ],
      salesVolume: [
        { date: subMonths(new Date(), 12), volume: 756 },
        { date: subMonths(new Date(), 9), volume: 823 },
        { date: subMonths(new Date(), 6), volume: 891 },
        { date: subMonths(new Date(), 3), volume: 847 },
        { date: new Date(), volume: 847 }
      ],
      inventory: [
        { date: subMonths(new Date(), 12), count: 1205 },
        { date: subMonths(new Date(), 9), count: 987 },
        { date: subMonths(new Date(), 6), count: 845 },
        { date: subMonths(new Date(), 3), count: 763 },
        { date: new Date(), count: 694 }
      ]
    },
    comparables: [
      {
        address: '456 Oak Avenue',
        price: 675000,
        squareFeet: 2650,
        pricePerSqFt: 255,
        daysOnMarket: 21,
        soldDate: subDays(new Date(), 7)
      },
      {
        address: '789 Pine Street',
        price: 598000,
        squareFeet: 2340,
        pricePerSqFt: 256,
        daysOnMarket: 35,
        soldDate: subDays(new Date(), 14)
      },
      {
        address: '321 Elm Drive',
        price: 720000,
        squareFeet: 2890,
        pricePerSqFt: 249,
        daysOnMarket: 18,
        soldDate: subDays(new Date(), 3)
      }
    ],
    forecast: {
      nextQuarter: {
        priceChange: 2.1,
        salesVolume: 892,
        recommendation: 'Favorable market conditions for both buyers and sellers'
      },
      nextYear: {
        priceChange: 6.8,
        marketCondition: 'Balanced market with steady appreciation'
      }
    }
  }
}