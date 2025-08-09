/**
 * Property Comparison Component - PropertyChain
 * 
 * Side-by-side property comparison tool
 * Following RECOVERY_PLAN.md specifications
 */

'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  X,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Building,
  Bed,
  Bath,
  Square,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercentage } from '@/lib/format'

interface PropertyComparisonProps {
  propertyIds: string[]
  onClose: () => void
  className?: string
}

// Mock data fetcher - in production this would be an API call
const getPropertyById = (id: string) => {
  // This would normally fetch from API
  return {
    id,
    title: `Property ${id.split('-')[1]}`,
    location: 'New York, NY',
    price: 1000000 + parseInt(id.split('-')[1]) * 100000,
    tokenPrice: 100 + parseInt(id.split('-')[1]) * 10,
    minInvestment: 100,
    expectedReturn: 8 + (parseInt(id.split('-')[1]) % 5),
    propertyType: ['Residential', 'Commercial', 'Industrial'][parseInt(id.split('-')[1]) % 3],
    beds: 2 + (parseInt(id.split('-')[1]) % 4),
    baths: 1 + (parseInt(id.split('-')[1]) % 3),
    sqft: 1000 + parseInt(id.split('-')[1]) * 100,
    yearBuilt: 2010 + (parseInt(id.split('-')[1]) % 14),
    investors: 50 + parseInt(id.split('-')[1]) * 5,
    daysLeft: 30 - (parseInt(id.split('-')[1]) % 25),
    amenities: ['Parking', 'Pool', 'Gym', 'Security'].slice(0, 2 + (parseInt(id.split('-')[1]) % 3)),
    image: `https://images.unsplash.com/photo-${1560518883 + parseInt(id.split('-')[1])}-cc1a3fa10c00?w=400&h=300&fit=crop`,
  }
}

export function PropertyComparison({
  propertyIds,
  onClose,
  className,
}: PropertyComparisonProps) {
  const properties = React.useMemo(
    () => propertyIds.map(id => getPropertyById(id)),
    [propertyIds]
  )
  
  // Comparison metrics
  const metrics = [
    { key: 'price', label: 'Property Price', format: 'currency' },
    { key: 'tokenPrice', label: 'Token Price', format: 'currency' },
    { key: 'minInvestment', label: 'Min. Investment', format: 'currency' },
    { key: 'expectedReturn', label: 'Expected Return', format: 'percentage' },
    { key: 'propertyType', label: 'Property Type', format: 'text' },
    { key: 'beds', label: 'Bedrooms', format: 'number' },
    { key: 'baths', label: 'Bathrooms', format: 'number' },
    { key: 'sqft', label: 'Square Feet', format: 'number' },
    { key: 'yearBuilt', label: 'Year Built', format: 'number' },
    { key: 'investors', label: 'Current Investors', format: 'number' },
    { key: 'daysLeft', label: 'Days Remaining', format: 'number' },
  ]
  
  const formatValue = (value: any, format: string) => {
    if (value === undefined || value === null) return '-'
    
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return formatPercentage(value / 100)
      case 'number':
        return value.toLocaleString()
      default:
        return value
    }
  }
  
  // Find best value for highlighting
  const getBestValue = (metric: any) => {
    const values = properties.map(p => p[metric.key as keyof typeof p])
      .filter(v => v !== undefined && v !== null && typeof v === 'number')
    
    if (values.length === 0) return null
    
    if (metric.key === 'price' || metric.key === 'tokenPrice' || metric.key === 'minInvestment') {
      return Math.min(...values)
    } else if (metric.key === 'expectedReturn' || metric.key === 'investors' || metric.key === 'sqft') {
      return Math.max(...values)
    }
    
    return null
  }
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Compare Properties</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Property Headers */}
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-4 p-6 bg-gray-50 border-b">
              <div className="text-sm font-medium text-gray-600">Properties</div>
              {properties.map((property) => (
                <div key={property.id} className="space-y-3">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {property.title}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Comparison Table */}
            <div className="divide-y">
              {metrics.map((metric, index) => {
                const bestValue = getBestValue(metric)
                
                return (
                  <div 
                    key={metric.key}
                    className={cn(
                      'grid grid-cols-[200px_repeat(4,1fr)] gap-4 p-4 hover:bg-gray-50',
                      index % 2 === 0 && 'bg-gray-50/50'
                    )}
                  >
                    <div className="text-sm font-medium text-gray-600">
                      {metric.label}
                    </div>
                    {properties.map((property) => {
                      const value = property[metric.key as keyof typeof property]
                      const isBest = bestValue !== null && value === bestValue
                      
                      return (
                        <div 
                          key={property.id}
                          className={cn(
                            'text-sm',
                            isBest && 'font-semibold text-green-600'
                          )}
                        >
                          {formatValue(value, metric.format)}
                          {isBest && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Best
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              
              {/* Amenities */}
              <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-4 p-4 bg-gray-50/50">
                <div className="text-sm font-medium text-gray-600">
                  Amenities
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="flex flex-wrap gap-1">
                    {property.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-4 p-6 border-t bg-gray-50">
              <div></div>
              {properties.map((property) => (
                <div key={property.id}>
                  <Link href={`/properties/${property.id}`}>
                    <Button className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}