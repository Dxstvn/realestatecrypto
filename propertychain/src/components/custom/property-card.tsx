/**
 * Property Card Component - PropertyChain
 * 
 * Reusable property card with investment details
 * Used in homepage, property listings, dashboard, and related properties
 * Following Section 0 principles and Section 4 specifications
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  TrendingUp,
  Clock,
  Users,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '@/lib/format'

// Property type definitions
export interface PropertyCardData {
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
  price: number
  tokenPrice: number
  minInvestment?: number
  targetFunding?: number
  currentFunding?: number
  expectedReturn?: number
  returnPeriod?: string
  propertyType?: string
  beds?: number
  baths?: number
  sqft?: number
  investors?: number
  daysLeft?: number
  featured?: boolean
  verified?: boolean
  status?: 'funding' | 'funded' | 'closed' | 'upcoming'
  badges?: Array<{
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }>
  annualReturn?: number
  monthlyYield?: number
  tokensAvailable?: number
  totalTokens?: number
  fundingProgress?: number
  type?: string
}

interface PropertyCardProps {
  property: PropertyCardData
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  onFavorite?: (id: string) => void
  onShare?: (id: string) => void
  className?: string
}

export function PropertyCard({
  property,
  variant = 'default',
  showActions = true,
  onFavorite,
  onShare,
  className,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Calculate funding percentage
  const fundingPercentage = property.fundingProgress || (
    property.currentFunding && property.targetFunding
      ? Math.min(Math.round((property.currentFunding / property.targetFunding) * 100), 100)
      : 0
  )

  // Determine status color
  const getStatusColor = (status?: PropertyCardData['status']) => {
    switch (status) {
      case 'funding':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'funded':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'closed':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'upcoming':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
    onFavorite?.(property.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    onShare?.(property.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn('h-full', className)}
    >
      <Card 
        className={cn(
          'h-full flex flex-col overflow-hidden transition-all duration-300',
          'hover:shadow-xl',
          property.featured && 'ring-2 ring-primary ring-offset-2',
          variant === 'compact' && 'min-h-[400px]',
          variant === 'default' && 'min-h-[480px]',
          variant === 'featured' && 'min-h-[520px]'
        )}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {property.featured && (
              <Badge 
                className="bg-gradient-to-r from-primary to-primary/80 text-white border-0"
              >
                FEATURED
              </Badge>
            )}
            {property.verified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {property.badges?.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'default'}>
                {badge.label}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 backdrop-blur hover:bg-white text-gray-700"
                      onClick={handleFavorite}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorited ? 'Remove from favorites' : 'Add to favorites'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 backdrop-blur hover:bg-white text-gray-700"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share property</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Property Image */}
          <Link href={`/properties/${property.id}`}>
            {!imageError ? (
              <Image
                src={property.image || property.images?.[0] || '/images/property-placeholder.jpg'}
                alt={property.title}
                fill
                className={cn(
                  'object-cover transition-all duration-300',
                  'group-hover:scale-105',
                  !imageLoaded && 'blur-sm'
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={property.featured}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Square className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </Link>

          {/* Status Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge 
              className={cn(
                'uppercase font-semibold',
                getStatusColor(property.status)
              )}
            >
              {property.status}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <Link 
            href={`/properties/${property.id}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg line-clamp-1">
              {property.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {typeof property.location === 'string' 
                ? property.location 
                : `${property.location.city}, ${property.location.state}`
              }
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

          {/* Investment Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Token Price</p>
                <p className="text-xl font-bold">
                  {formatCurrency(property.tokenPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Expected Return</p>
                <p className="text-lg font-semibold text-green-600">
                  {property.annualReturn 
                    ? formatPercentage(property.annualReturn / 100)
                    : property.expectedReturn 
                    ? formatPercentage(property.expectedReturn)
                    : 'N/A'
                  }
                </p>
                {property.returnPeriod && (
                  <p className="text-xs text-muted-foreground">
                    {property.returnPeriod}
                  </p>
                )}
              </div>
            </div>

            {/* Funding Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Funding Progress</span>
                <span className="font-medium">{fundingPercentage}%</span>
              </div>
              <Progress 
                value={fundingPercentage} 
                className="h-2"
                indicatorClassName="bg-gradient-to-r from-primary to-primary/80"
              />
              {property.currentFunding && property.targetFunding && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(property.currentFunding)} raised</span>
                  <span>of {formatCurrency(property.targetFunding)}</span>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="pt-0">
          <div className="w-full space-y-3">
            <Separator />
            <div className="flex gap-2">
              <Link href={`/properties/${property.id}`} className="flex-1">
                <Button className="w-full" size="lg">
                  View Details
                </Button>
              </Link>
              {variant === 'featured' && (
                <Link href={`/invest/${property.id}`}>
                  <Button size="lg" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Invest Now
                  </Button>
                </Link>
              )}
            </div>
            {property.minInvestment && (
              <p className="text-xs text-center text-muted-foreground">
                Min. investment: {formatCurrency(property.minInvestment)}
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Skeleton loader for property card
export function PropertyCardSkeleton() {
  return (
    <Card className="h-[480px] animate-pulse">
      <div className="aspect-[16/10] bg-gray-200" />
      <CardHeader className="pb-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-2 bg-gray-200 rounded" />
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-3">
          <div className="h-px bg-gray-200" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </CardFooter>
    </Card>
  )
}