/**
 * Property Card v2 - Standardized Implementation
 * PropertyLend DeFi Platform
 * 
 * Phase 2.2: Card Component Standardization
 * Uses the standardized card system for consistency
 */

'use client'

import { StandardizedCard } from "@/components/ui/card-standardized"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Award, 
  Bed, 
  Bath, 
  Square,
  Users,
  Clock,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// Property data interface
export interface PropertyData {
  id: string
  title: string
  location: {
    address: string
    city: string
    state: string
    zip: string
  } | string
  image?: string
  images?: string[]
  tokenPrice: number
  expectedReturn: number
  returnPeriod?: string
  beds?: number
  baths?: number
  sqft?: number
  minInvestment?: number
  targetFunding?: number
  currentFunding?: number
  fundingProgress?: number
  investors?: number
  daysLeft?: number
  featured?: boolean
  verified?: boolean
  status?: 'funding' | 'funded' | 'closed' | 'upcoming'
  type?: string
  tranche?: 'senior' | 'junior'
}

interface PropertyCardV2Props {
  property: PropertyData
  variant?: 'default' | 'compact' | 'featured'
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  className?: string
}

export function PropertyCardV2({
  property,
  variant = 'default',
  onFavorite,
  onShare,
  className
}: PropertyCardV2Props) {
  // Calculate funding percentage
  const fundingPercentage = property.fundingProgress || 
    (property.currentFunding && property.targetFunding
      ? Math.min(Math.round((property.currentFunding / property.targetFunding) * 100), 100)
      : 0)

  // Format location string
  const locationString = typeof property.location === 'string' 
    ? property.location 
    : `${property.location.city}, ${property.location.state}`

  // Format currency
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  // Format percentage
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  // Prepare badges
  const badges: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    icon?: React.ReactNode
  }> = []
  
  if (property.featured) {
    badges.push({
      label: 'FEATURED',
      variant: 'default',
      icon: <Award className="h-3 w-3" />
    })
  }
  
  if (property.verified) {
    badges.push({
      label: 'Verified',
      variant: 'secondary',
      icon: <CheckCircle className="h-3 w-3" />
    })
  }

  // Get status badge color
  const getStatusColor = (status?: PropertyData['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'funding': return 'secondary'
      case 'funded': return 'default'
      case 'closed': return 'outline'
      case 'upcoming': return 'outline'
      default: return 'secondary'
    }
  }

  if (property.status) {
    badges.push({
      label: property.status.toUpperCase(),
      variant: getStatusColor(property.status)
    })
  }

  // Prepare progress data
  const getFundingVariant = (percentage: number): 'default' | 'success' => {
    return percentage >= 90 ? 'success' : 'default'
  }

  const progress = property.targetFunding ? {
    label: 'Funding Progress',
    value: fundingPercentage,
    max: 100,
    currentValue: property.currentFunding ? formatCurrency(property.currentFunding) : undefined,
    targetValue: formatCurrency(property.targetFunding),
    variant: getFundingVariant(fundingPercentage)
  } : undefined

  // Card variant mapping
  const cardVariant = variant === 'featured' ? 'featured' : 
                     property.featured ? 'featured' : 'property'

  const cardSize = variant === 'compact' ? 'sm' : 
                  variant === 'featured' ? 'xl' : 'lg'

  return (
    <StandardizedCard
      className={className}
      variant={cardVariant}
      size={cardSize}
      image={property.image || property.images?.[0] ? {
        src: property.image || property.images![0],
        alt: property.title,
        priority: property.featured
      } : undefined}
      title={property.title}
      subtitle={locationString}
      titleHref={`/properties/${property.id}`}
      badges={badges}
      onFavorite={onFavorite ? () => onFavorite(property.id) : undefined}
      onShare={onShare ? () => onShare(property.id) : undefined}
      progress={progress}
      primaryAction={{
        label: 'View Details',
        href: `/properties/${property.id}`,
        variant: 'default'
      }}
      secondaryAction={variant === 'featured' ? {
        label: 'Invest Now',
        href: `/invest/${property.id}`,
        icon: <TrendingUp className="h-4 w-4 mr-2" />
      } : undefined}
      minInvestment={property.minInvestment ? formatCurrency(property.minInvestment) : undefined}
    >
      {/* Property Details Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Token Price */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Token Price</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(property.tokenPrice)}
          </p>
        </div>
        
        {/* Expected Return */}
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Expected Return</p>
          <p className="text-xl font-bold text-green-400">
            {formatPercentage(property.expectedReturn)}
          </p>
          {property.returnPeriod && (
            <p className="text-xs text-gray-500">
              {property.returnPeriod}
            </p>
          )}
        </div>
      </div>

      {/* Property Specifications */}
      {(property.beds || property.baths || property.sqft) && (
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t border-gray-800">
          {property.beds && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              <span>{property.beds} Beds</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              <span>{property.baths} Baths</span>
            </div>
          )}
          {property.sqft && (
            <div className="flex items-center gap-1">
              <Square className="h-3.5 w-3.5" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          )}
        </div>
      )}

      {/* Investment Statistics */}
      {(property.investors !== undefined || property.daysLeft !== undefined) && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {property.investors !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{property.investors} investors</span>
              </div>
            )}
            {property.daysLeft !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{property.daysLeft} days left</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tranche Information */}
      {property.tranche && (
        <div className="mt-3">
          <Badge 
            variant="outline"
            className={cn(
              "w-full justify-center",
              property.tranche === 'senior' 
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : "bg-green-500/20 text-green-400 border-green-500/30"
            )}
          >
            {property.tranche === 'senior' ? 'Senior Tranche' : 'Junior Tranche'}
          </Badge>
        </div>
      )}
    </StandardizedCard>
  )
}

// Skeleton loader for property card v2
export function PropertyCardV2Skeleton() {
  return (
    <div className="h-[480px] rounded-xl bg-gray-900/50 border border-gray-800 animate-pulse">
      <div className="aspect-[16/9] bg-gray-800 rounded-t-xl" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-20" />
            <div className="h-8 bg-gray-800 rounded w-24" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-20" />
            <div className="h-8 bg-gray-800 rounded w-24" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded" />
          <div className="flex justify-between">
            <div className="h-3 bg-gray-800 rounded w-20" />
            <div className="h-3 bg-gray-800 rounded w-20" />
          </div>
        </div>
        
        <div className="h-10 bg-gray-800 rounded" />
      </div>
    </div>
  )
}