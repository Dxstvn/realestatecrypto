/**
 * Property Detail Page - PropertyChain
 * 
 * Comprehensive property details with investment features
 * Following RECOVERY_PLAN.md Step 1.4 specifications
 */

'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PropertyCard } from '@/components/custom/property-card'
import { PropertyChat } from '@/components/custom/property-chat'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/format'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Building,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Share2,
  Heart,
  Download,
  Play,
  Camera,
  FileText,
  Calculator,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Home,
  Shield,
  Award,
  Zap,
  Car,
  Trees,
  Dumbbell,
  Waves,
  Coffee,
  Wifi,
  Wind,
  Sun,
  ArrowRight,
  ArrowUpRight,
  Info,
  AlertCircle,
  BarChart3,
  PieChart,
  Target,
  Wallet,
  Timer,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'

// ============================================================================
// Mock Property Data
// ============================================================================

const generatePropertyData = (id: string) => {
  const propertyId = parseInt(id) || 1
  const cities = ['New York', 'San Francisco', 'Miami', 'Chicago', 'Austin', 'Boston', 'Seattle', 'Denver']
  const types = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Mixed-Use']
  
  return {
    id,
    title: `Modern ${types[propertyId % types.length]} Property ${propertyId}`,
    description: `This exceptional ${types[propertyId % types.length].toLowerCase()} property offers an outstanding investment opportunity with proven returns and professional management. Located in a prime area with strong appreciation potential, this property features modern amenities and sustainable design elements that attract quality tenants and ensure long-term value growth.`,
    location: {
      address: `${100 + propertyId} Main Street`,
      city: cities[propertyId % cities.length],
      state: ['NY', 'CA', 'FL', 'IL', 'TX', 'MA', 'WA', 'CO'][propertyId % 8],
      zip: `${10000 + propertyId}`,
      coordinates: {
        lat: 40.7128 + (propertyId % 10) * 0.1,
        lng: -74.0060 + (propertyId % 10) * 0.1,
      }
    },
    price: 1000000 + (propertyId * 100000),
    tokenPrice: 100 + (propertyId * 10),
    tokensAvailable: 5000 - (propertyId * 100),
    totalTokens: 10000,
    minInvestment: 100,
    targetFunding: 1500000 + (propertyId * 50000),
    currentFunding: (1500000 + (propertyId * 50000)) * (0.3 + (propertyId % 7) * 0.1),
    expectedReturn: 8 + (propertyId % 5),
    monthlyYield: 0.5 + (propertyId % 5) * 0.1,
    appreciationRate: 3 + (propertyId % 4),
    propertyType: types[propertyId % types.length],
    yearBuilt: 2010 + (propertyId % 14),
    beds: 2 + (propertyId % 4),
    baths: 1 + (propertyId % 3),
    sqft: 1500 + (propertyId * 100),
    lotSize: 5000 + (propertyId * 500),
    investors: 50 + (propertyId * 5),
    daysLeft: 30 - (propertyId % 25),
    status: ['funding', 'funded', 'upcoming'][propertyId % 3] as 'funding' | 'funded' | 'upcoming',
    featured: propertyId % 7 === 0,
    verified: propertyId % 3 !== 0,
    images: [
      `https://images.unsplash.com/photo-${1560518883 + propertyId}-cc1a3fa10c00?w=1200&h=800&fit=crop`,
      `https://images.unsplash.com/photo-${1486406146926 + propertyId}-c627a92ad1ab?w=1200&h=800&fit=crop`,
      `https://images.unsplash.com/photo-${1545324418 + propertyId}-cc1a3fa10c00?w=1200&h=800&fit=crop`,
      `https://images.unsplash.com/photo-${1551882547 + propertyId}-ff40c63fe5fa?w=1200&h=800&fit=crop`,
      `https://images.unsplash.com/photo-${1558618666 + propertyId}-fcd25c85cd64?w=1200&h=800&fit=crop`,
    ],
    amenities: [
      'Parking', 'Pool', 'Gym', 'Security', 'Elevator',
      'Balcony', 'Garden', 'Storage', 'Laundry', 'AC',
    ].slice(0, 5 + (propertyId % 5)),
    highlights: [
      'Recently renovated with modern finishes',
      'Prime location with high walkability score',
      'Professional property management included',
      'Strong rental income history',
      'Energy efficient systems installed',
    ],
    documents: [
      { name: 'Property Deed', type: 'legal', size: '2.3 MB' },
      { name: 'Inspection Report', type: 'inspection', size: '5.1 MB' },
      { name: 'Financial Statement', type: 'financial', size: '1.8 MB' },
      { name: 'Insurance Policy', type: 'insurance', size: '3.2 MB' },
      { name: 'Rental Agreement', type: 'legal', size: '1.5 MB' },
    ],
    financials: {
      purchasePrice: 1000000 + (propertyId * 100000),
      monthlyRent: 5000 + (propertyId * 500),
      annualPropertyTax: 12000 + (propertyId * 1000),
      annualInsurance: 3000 + (propertyId * 200),
      managementFee: 8, // percentage
      maintenanceReserve: 5, // percentage
      vacancyRate: 5, // percentage
      appreciationHistory: [
        { year: 2020, value: 900000 },
        { year: 2021, value: 950000 },
        { year: 2022, value: 1000000 },
        { year: 2023, value: 1050000 },
        { year: 2024, value: 1100000 },
      ],
    },
    investmentTerms: {
      minimumHoldPeriod: '12 months',
      exitStrategy: 'Buy-back option after 5 years',
      distributionFrequency: 'Monthly',
      votingRights: 'Proportional to token ownership',
      liquidityOptions: 'Secondary market trading available',
    },
    neighborhoodStats: {
      walkScore: 85,
      transitScore: 72,
      bikeScore: 68,
      crimeRate: 'Low',
      schoolRating: 8.5,
      medianIncome: 85000,
      populationGrowth: 2.3,
    }
  }
}

// ============================================================================
// Property Detail Page Component
// ============================================================================

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  const property = generatePropertyData(propertyId)
  
  // State Management
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [showLightbox, setShowLightbox] = React.useState(false)
  const [isFavorited, setIsFavorited] = React.useState(false)
  const [investmentAmount, setInvestmentAmount] = React.useState(1000)
  const [compareToSP500, setCompareToSP500] = React.useState(false)
  const [showChat, setShowChat] = React.useState(false)
  
  // Calculate funding percentage
  const fundingPercentage = Math.min(
    Math.round((property.currentFunding / property.targetFunding) * 100),
    100
  )
  
  // Calculate investment returns
  const calculateReturns = () => {
    const monthlyReturn = investmentAmount * (property.monthlyYield / 100)
    const annualReturn = monthlyReturn * 12
    const totalReturn5Years = annualReturn * 5 + (investmentAmount * (property.appreciationRate / 100) * 5)
    const sp500Return = investmentAmount * 0.10 * 5 // Assuming 10% annual S&P 500 return
    
    return {
      monthly: monthlyReturn,
      annual: annualReturn,
      total5Years: totalReturn5Years,
      sp500: sp500Return,
      difference: totalReturn5Years - sp500Return,
    }
  }
  
  const returns = calculateReturns()
  
  // Similar properties (mock data)
  const similarProperties = [1, 2, 3, 4].map(i => ({
    id: `prop-${parseInt(propertyId) + i}`,
    title: `Similar Property ${i}`,
    location: property.location.city + ', ' + property.location.state,
    price: property.price + (i * 50000),
    tokenPrice: property.tokenPrice + (i * 10),
    minInvestment: 100,
    expectedReturn: property.expectedReturn + (i * 0.5),
    image: `https://images.unsplash.com/photo-${1560518883 + i}-cc1a3fa10c00?w=400&h=300&fit=crop`,
    investors: 50 + (i * 10),
    daysLeft: 20 - i * 2,
    status: 'funding' as const,
  }))
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/properties/explore">Properties</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/properties/explore?type=${property.propertyType}`}>
                  {property.propertyType}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{property.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      {/* Hero Section with Image Gallery */}
      <section className="relative">
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-4 max-h-[480px]">
            {/* Main Image */}
            <div className="relative h-[480px] rounded-lg overflow-hidden group">
              <Image
                src={property.images[selectedImageIndex]}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <button
                onClick={() => setShowLightbox(true)}
                className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center"
              >
                <div className="bg-white/90 backdrop-blur p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-6 w-6" />
                </div>
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm">
                <Camera className="inline h-4 w-4 mr-2" />
                {selectedImageIndex + 1} / {property.images.length}
              </div>
              
              {/* Virtual Tour Button */}
              <Button
                className="absolute bottom-4 right-4"
                variant="secondary"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Virtual Tour
              </Button>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4 h-[480px]">
              {property.images.slice(1, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index + 1)}
                  className={cn(
                    'relative rounded-lg overflow-hidden group',
                    index === 3 && 'relative'
                  )}
                >
                  <Image
                    src={image}
                    alt={`View ${index + 2}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  {index === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{property.images.length - 5} more
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Title and Badges */}
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex gap-2">
                  {property.verified && (
                    <Badge className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {property.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  <Badge 
                    variant={property.status === 'funding' ? 'default' : 'secondary'}
                  >
                    {property.status}
                  </Badge>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                </span>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-gray-400" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-gray-400" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-gray-400" />
                  <span>{formatNumber(property.sqft)} sqft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Built {property.yearBuilt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span>{property.propertyType}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={cn('h-4 w-4', isFavorited && 'fill-red-500 text-red-500')} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Investment Progress */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">Funding Progress</p>
                <p className="text-2xl font-bold">{formatCurrency(property.currentFunding)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Target</p>
                <p className="text-lg font-semibold">{formatCurrency(property.targetFunding)}</p>
              </div>
            </div>
            <Progress value={fundingPercentage} className="h-3 mb-3" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{property.investors} investors</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{property.daysLeft} days left</span>
                </div>
              </div>
              <span className="font-semibold">{fundingPercentage}% funded</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="investment">Investment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {property.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Amenities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {amenity === 'Parking' && <Car className="h-4 w-4 text-gray-400" />}
                          {amenity === 'Pool' && <Waves className="h-4 w-4 text-gray-400" />}
                          {amenity === 'Gym' && <Dumbbell className="h-4 w-4 text-gray-400" />}
                          {amenity === 'Security' && <Shield className="h-4 w-4 text-gray-400" />}
                          {amenity === 'Garden' && <Trees className="h-4 w-4 text-gray-400" />}
                          {amenity === 'AC' && <Wind className="h-4 w-4 text-gray-400" />}
                          {!['Parking', 'Pool', 'Gym', 'Security', 'Garden', 'AC'].includes(amenity) && 
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                          }
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financials" className="space-y-6 mt-6">
                {/* Financial Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Purchase Price</p>
                        <p className="text-xl font-bold">{formatCurrency(property.financials.purchasePrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Rent</p>
                        <p className="text-xl font-bold">{formatCurrency(property.financials.monthlyRent)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Return</p>
                        <p className="text-xl font-bold text-green-600">{property.expectedReturn}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cap Rate</p>
                        <p className="text-xl font-bold">{(property.expectedReturn * 0.8).toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Property Tax</span>
                        <span className="font-medium">{formatCurrency(property.financials.annualPropertyTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Insurance</span>
                        <span className="font-medium">{formatCurrency(property.financials.annualInsurance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Management Fee</span>
                        <span className="font-medium">{property.financials.managementFee}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maintenance Reserve</span>
                        <span className="font-medium">{property.financials.maintenanceReserve}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vacancy Rate</span>
                        <span className="font-medium">{property.financials.vacancyRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Appreciation History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Value History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.financials.appreciationHistory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600">{item.year}</span>
                          <div className="flex-1 mx-4">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                                style={{ width: `${(item.value / 1200000) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Documents</CardTitle>
                    <CardDescription>
                      All documents have been verified and are available for download
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-600">{doc.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-6 mt-6">
                {/* Map Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive map would be displayed here</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {property.location.address}, {property.location.city}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Neighborhood Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Neighborhood Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Walk Score</p>
                        <p className="text-2xl font-bold">{property.neighborhoodStats.walkScore}</p>
                        <p className="text-xs text-gray-500">Very Walkable</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Transit Score</p>
                        <p className="text-2xl font-bold">{property.neighborhoodStats.transitScore}</p>
                        <p className="text-xs text-gray-500">Excellent Transit</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bike Score</p>
                        <p className="text-2xl font-bold">{property.neighborhoodStats.bikeScore}</p>
                        <p className="text-xs text-gray-500">Bikeable</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Crime Rate</p>
                        <p className="text-2xl font-bold">{property.neighborhoodStats.crimeRate}</p>
                        <p className="text-xs text-gray-500">Safe Area</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">School Rating</p>
                        <p className="text-2xl font-bold">{property.neighborhoodStats.schoolRating}/10</p>
                        <p className="text-xs text-gray-500">Excellent Schools</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Population Growth</p>
                        <p className="text-2xl font-bold">+{property.neighborhoodStats.populationGrowth}%</p>
                        <p className="text-xs text-gray-500">Annual</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="investment" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Minimum Hold Period</p>
                          <p className="text-sm text-gray-600">{property.investmentTerms.minimumHoldPeriod}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Exit Strategy</p>
                          <p className="text-sm text-gray-600">{property.investmentTerms.exitStrategy}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Distribution Frequency</p>
                          <p className="text-sm text-gray-600">{property.investmentTerms.distributionFrequency}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Voting Rights</p>
                          <p className="text-sm text-gray-600">{property.investmentTerms.votingRights}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">Liquidity Options</p>
                          <p className="text-sm text-gray-600">{property.investmentTerms.liquidityOptions}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Risk Disclosure */}
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Disclosure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="text-sm text-amber-900">
                          <p className="font-medium mb-2">Important Investment Information</p>
                          <ul className="space-y-1 list-disc list-inside">
                            <li>Real estate investments carry inherent risks</li>
                            <li>Past performance does not guarantee future results</li>
                            <li>Property values and rental income may fluctuate</li>
                            <li>Investments are illiquid during the minimum hold period</li>
                            <li>Please review all documents before investing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Similar Properties */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Similar Properties</h2>
              <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4">
                  {similarProperties.map((prop) => (
                    <div key={prop.id} className="w-[300px] flex-shrink-0">
                      <PropertyCard property={prop} variant="compact" />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
          
          {/* Right Column - Investment Widget (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Investment Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Calculator</CardTitle>
                  <CardDescription>
                    Calculate your potential returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Investment Amount */}
                  <div className="space-y-2">
                    <Label>Investment Amount</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                        min={property.minInvestment}
                        max={100000}
                        step={100}
                      />
                      <span className="text-sm text-gray-600">USD</span>
                    </div>
                    <Slider
                      value={[investmentAmount]}
                      onValueChange={([value]) => setInvestmentAmount(value)}
                      min={property.minInvestment}
                      max={100000}
                      step={100}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatCurrency(property.minInvestment)}</span>
                      <span>{formatCurrency(100000)}</span>
                    </div>
                  </div>
                  
                  {/* Token Amount */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tokens You'll Receive</span>
                      <span className="font-bold">
                        {Math.floor(investmentAmount / property.tokenPrice)} tokens
                      </span>
                    </div>
                  </div>
                  
                  {/* Returns Projection */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Projected Returns</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Income</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(returns.monthly)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Annual Income</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(returns.annual)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">5-Year Total Return</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(returns.total5Years)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compare to S&P 500 */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compare-sp500" className="text-sm">
                      Compare to S&P 500
                    </Label>
                    <Switch
                      id="compare-sp500"
                      checked={compareToSP500}
                      onCheckedChange={setCompareToSP500}
                    />
                  </div>
                  
                  {compareToSP500 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-900 mb-2">S&P 500 Comparison (5 years)</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>S&P 500 Return</span>
                          <span>{formatCurrency(returns.sp500)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Your Advantage</span>
                          <span className={returns.difference > 0 ? 'text-green-600' : 'text-red-600'}>
                            {returns.difference > 0 ? '+' : ''}{formatCurrency(returns.difference)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="lg">
                      <Wallet className="h-4 w-4 mr-2" />
                      Invest Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Download Investment Report
                    </Button>
                  </div>
                  
                  {/* Countdown Timer */}
                  {property.daysLeft > 0 && property.daysLeft <= 7 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-amber-900 font-medium">
                          Only {property.daysLeft} days left to invest!
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Share Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Share This Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        size="lg"
        onClick={() => setShowChat(true)}
      >
        <MessageCircle className="h-5 w-5 mr-2" />
        Chat with Agent
      </Button>
      
      {/* Image Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="relative max-w-7xl max-h-[90vh] mx-4">
              <Image
                src={property.images[selectedImageIndex]}
                alt={property.title}
                width={1920}
                height={1080}
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex((prev) => 
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex((prev) => 
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chat with Property Agent</DialogTitle>
            <DialogDescription>
              Get instant answers about {property.title}
            </DialogDescription>
          </DialogHeader>
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chat interface would be here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}