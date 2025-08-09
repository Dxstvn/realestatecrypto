/**
 * Property List Item Component - PropertyChain
 * 
 * Horizontal layout property card for list view
 * Following RECOVERY_PLAN.md specifications
 */

'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Bed,
  Bath,
  Square,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Calendar,
  Building,
  ArrowRight,
  Heart,
  Share2,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '@/lib/format'

interface PropertyListItemProps {
  property: any
  compareMode?: boolean
  selected?: boolean
  onToggleCompare?: () => void
  className?: string
}

export function PropertyListItem({
  property,
  compareMode = false,
  selected = false,
  onToggleCompare,
  className,
}: PropertyListItemProps) {
  const [isFavorited, setIsFavorited] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  
  // Calculate funding percentage
  const fundingPercentage = property.fundingProgress || (
    property.currentFunding && property.targetFunding
      ? Math.min(Math.round((property.currentFunding / property.targetFunding) * 100), 100)
      : 0
  )
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn('relative', className)}
    >
      <Card className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-lg',
        selected && 'ring-2 ring-primary',
        property.featured && 'border-primary'
      )}>
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="relative w-full lg:w-80 h-48 lg:h-64 overflow-hidden bg-gray-100">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {property.featured && (
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                    FEATURED
                  </Badge>
                )}
                {property.verified && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                <Badge 
                  className={cn(
                    'uppercase font-semibold',
                    property.status === 'funding' && 'bg-green-100 text-green-700',
                    property.status === 'funded' && 'bg-blue-100 text-blue-700',
                    property.status === 'upcoming' && 'bg-amber-100 text-amber-700'
                  )}
                >
                  {property.status}
                </Badge>
              </div>
              
              {/* Compare Checkbox */}
              {compareMode && (
                <div className="absolute top-4 right-4 z-10">
                  <Checkbox
                    checked={selected}
                    onCheckedChange={onToggleCompare}
                    className="bg-white border-2 h-6 w-6"
                  />
                </div>
              )}
              
              {/* Image */}
              <Link href={`/properties/${property.id}`}>
                {!imageError ? (
                  <Image
                    src={property.image || property.images?.[0] || '/images/property-placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </Link>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="mb-4">
                  <Link 
                    href={`/properties/${property.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{property.location}</span>
                    </div>
                    {property.propertyType && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          <span>{property.propertyType}</span>
                        </div>
                      </>
                    )}
                    {property.yearBuilt && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Built {property.yearBuilt}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Property Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
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
                
                {/* Investment Info */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Token Price</p>
                    <p className="text-lg font-bold">{formatCurrency(property.tokenPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Expected Return</p>
                    <p className="text-lg font-bold text-green-600">
                      {property.annualReturn 
                        ? formatPercentage(property.annualReturn / 100)
                        : formatPercentage(property.expectedReturn / 100)
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Min. Investment</p>
                    <p className="text-lg font-bold">{formatCurrency(property.minInvestment || 100)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Property Value</p>
                    <p className="text-lg font-bold">{formatCurrency(property.price)}</p>
                  </div>
                </div>
                
                {/* Funding Progress */}
                {property.currentFunding && property.targetFunding && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Funding Progress</span>
                      <span className="font-medium">{fundingPercentage}%</span>
                    </div>
                    <Progress 
                      value={fundingPercentage} 
                      className="h-2 mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatCurrency(property.currentFunding)} raised</span>
                      <span>Goal: {formatCurrency(property.targetFunding)}</span>
                    </div>
                  </div>
                )}
                
                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {property.investors !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{property.investors} investors</span>
                      </div>
                    )}
                    {property.daysLeft !== undefined && property.daysLeft > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{property.daysLeft} days left</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleFavorite}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isFavorited && 'fill-red-500 text-red-500'
                        )}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Link href={`/properties/${property.id}`}>
                      <Button size="sm">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}