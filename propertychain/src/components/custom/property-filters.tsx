/**
 * Property Filters Component - PropertyChain
 * 
 * Advanced filtering system for property search and discovery
 * Responsive design with sidebar (desktop) and sheet modal (mobile)
 * Following UpdatedUIPlan.md specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  X,
  ChevronDown,
  Search,
  MapPin,
  Home,
  DollarSign,
  TrendingUp,
  Calendar,
  Building,
  Trash2,
  Settings,
} from 'lucide-react'
import Select from 'react-select'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils/cn'

/**
 * Filter form schema
 */
const filterSchema = z.object({
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  minInvestment: z.tuple([z.number(), z.number()]).optional(),
  locations: z.array(z.string()).optional(),
  propertyTypes: z.array(z.string()).optional(),
  investmentTypes: z.array(z.string()).optional(),
  returnRange: z.tuple([z.number(), z.number()]).optional(),
  fundingStatus: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  yearBuilt: z.tuple([z.number(), z.number()]).optional(),
  occupancyRate: z.tuple([z.number(), z.number()]).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  newListings: z.boolean().optional(),
  closingSoon: z.boolean().optional(),
  sortBy: z.string().optional(),
})

export type FilterFormValues = z.infer<typeof filterSchema>

/**
 * Filter options configuration
 */
export const FILTER_OPTIONS = {
  locations: [
    { value: 'new-york-ny', label: 'New York, NY' },
    { value: 'los-angeles-ca', label: 'Los Angeles, CA' },
    { value: 'chicago-il', label: 'Chicago, IL' },
    { value: 'houston-tx', label: 'Houston, TX' },
    { value: 'phoenix-az', label: 'Phoenix, AZ' },
    { value: 'philadelphia-pa', label: 'Philadelphia, PA' },
    { value: 'san-antonio-tx', label: 'San Antonio, TX' },
    { value: 'san-diego-ca', label: 'San Diego, CA' },
    { value: 'dallas-tx', label: 'Dallas, TX' },
    { value: 'san-jose-ca', label: 'San Jose, CA' },
    { value: 'austin-tx', label: 'Austin, TX' },
    { value: 'miami-fl', label: 'Miami, FL' },
  ],
  propertyTypes: [
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building },
    { id: 'industrial', label: 'Industrial', icon: Settings },
    { id: 'mixed-use', label: 'Mixed-Use', icon: Building },
    { id: 'hospitality', label: 'Hospitality', icon: Building },
    { id: 'retail', label: 'Retail', icon: Building },
  ],
  investmentTypes: [
    { id: 'fractional', label: 'Fractional Ownership' },
    { id: 'full', label: 'Full Ownership' },
    { id: 'reit', label: 'REIT' },
    { id: 'crowdfunding', label: 'Crowdfunding' },
  ],
  fundingStatus: [
    { id: 'funding', label: 'Currently Funding', color: 'blue' },
    { id: 'funded', label: 'Fully Funded', color: 'green' },
    { id: 'trading', label: 'Trading', color: 'yellow' },
    { id: 'closed', label: 'Closed', color: 'gray' },
  ],
  amenities: [
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'gym', label: 'Fitness Center' },
    { id: 'parking', label: 'Parking' },
    { id: 'security', label: '24/7 Security' },
    { id: 'concierge', label: 'Concierge' },
    { id: 'rooftop', label: 'Rooftop Access' },
    { id: 'elevator', label: 'Elevator' },
    { id: 'laundry', label: 'Laundry Facilities' },
    { id: 'storage', label: 'Storage' },
    { id: 'pets', label: 'Pet Friendly' },
  ],
  sortOptions: [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'return-desc', label: 'Highest Returns' },
    { value: 'funding-desc', label: 'Most Funded' },
    { value: 'closing-soon', label: 'Closing Soon' },
  ],
}

/**
 * PropertyFilters component props
 */
export interface PropertyFiltersProps {
  initialFilters?: Partial<FilterFormValues>
  onFiltersChange?: (filters: FilterFormValues) => void
  onClearFilters?: () => void
  activeFiltersCount?: number
  variant?: 'sidebar' | 'sheet' | 'inline'
  showSort?: boolean
  showQuickFilters?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Filter section component for collapsible sections
 */
function FilterSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  count,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  count?: number
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto font-medium"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{title}</span>
            {count !== undefined && count > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {count}
              </Badge>
            )}
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

/**
 * Quick filters component
 */
function QuickFilters({
  values,
  onChange,
}: {
  values: FilterFormValues
  onChange: (values: Partial<FilterFormValues>) => void
}) {
  const quickFilters = [
    {
      key: 'featured',
      label: 'Featured',
      checked: values.featured,
    },
    {
      key: 'verified',
      label: 'Verified',
      checked: values.verified,
    },
    {
      key: 'newListings',
      label: 'New Listings',
      checked: values.newListings,
    },
    {
      key: 'closingSoon',
      label: 'Closing Soon',
      checked: values.closingSoon,
    },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quickFilters.map((filter) => (
        <Button
          key={filter.key}
          variant={filter.checked ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onChange({ [filter.key]: !filter.checked })
          }
          className="text-xs"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}

/**
 * Range slider component
 */
function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1000,
  formatValue,
  description,
}: {
  label: string
  value?: [number, number]
  onChange: (value: [number, number]) => void
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
  description?: string
}) {
  const currentValue = value || [min, max]
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-muted-foreground">
          {formatValue ? formatValue(currentValue[0]) : currentValue[0]} -{' '}
          {formatValue ? formatValue(currentValue[1]) : currentValue[1]}
        </span>
      </div>
      <Slider
        value={currentValue}
        onValueChange={(value) => onChange(value as [number, number])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

/**
 * Main PropertyFilters Component
 */
export function PropertyFilters({
  initialFilters = {},
  onFiltersChange,
  onClearFilters,
  activeFiltersCount = 0,
  variant = 'sidebar',
  showSort = true,
  showQuickFilters = true,
  className,
  children,
}: PropertyFiltersProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      priceRange: [50000, 5000000],
      minInvestment: [100, 50000],
      locations: [],
      propertyTypes: [],
      investmentTypes: [],
      returnRange: [5, 25],
      fundingStatus: [],
      amenities: [],
      yearBuilt: [1950, 2024],
      occupancyRate: [70, 100],
      verified: false,
      featured: false,
      newListings: false,
      closingSoon: false,
      sortBy: 'featured',
      ...initialFilters,
    },
  })

  const { watch, setValue, reset } = form
  const watchedValues = watch()

  // Handle form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onFiltersChange?.(value as FilterFormValues)
    })
    return () => subscription.unsubscribe()
  }, [form, onFiltersChange])

  const handleClearFilters = () => {
    reset({
      priceRange: [50000, 5000000],
      minInvestment: [100, 50000],
      locations: [],
      propertyTypes: [],
      investmentTypes: [],
      returnRange: [5, 25],
      fundingStatus: [],
      amenities: [],
      yearBuilt: [1950, 2024],
      occupancyRate: [70, 100],
      verified: false,
      featured: false,
      newListings: false,
      closingSoon: false,
      sortBy: 'featured',
    })
    onClearFilters?.()
  }

  const handleQuickFilterChange = (updates: Partial<FilterFormValues>) => {
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof FilterFormValues, value)
    })
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => `${value}%`

  const filterContent = (
    <div className="space-y-1">
      {/* Quick Filters */}
      {showQuickFilters && (
        <div className="p-4 border-b">
          <QuickFilters
            values={watchedValues}
            onChange={handleQuickFilterChange}
          />
        </div>
      )}

      <Form {...form}>
        <form className="space-y-1">
          {/* Price Range */}
          <FilterSection title="Price Range" icon={DollarSign}>
            <RangeSlider
              label="Property Price"
              value={watchedValues.priceRange}
              onChange={(value) => setValue('priceRange', value)}
              min={50000}
              max={5000000}
              step={50000}
              formatValue={formatCurrency}
              description="Total property value"
            />
          </FilterSection>

          <Separator />

          {/* Minimum Investment */}
          <FilterSection title="Investment Amount" icon={TrendingUp}>
            <RangeSlider
              label="Minimum Investment"
              value={watchedValues.minInvestment}
              onChange={(value) => setValue('minInvestment', value)}
              min={100}
              max={50000}
              step={100}
              formatValue={formatCurrency}
              description="Required minimum investment"
            />
          </FilterSection>

          <Separator />

          {/* Location */}
          <FilterSection
            title="Location"
            icon={MapPin}
            count={watchedValues.locations?.length}
          >
            <Controller
              name="locations"
              control={form.control}
              render={({ field }) => (
                <Select
                  isMulti
                  options={FILTER_OPTIONS.locations}
                  value={FILTER_OPTIONS.locations.filter((option) =>
                    field.value?.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    field.onChange(
                      selectedOptions?.map((option) => option.value) || []
                    )
                  }}
                  placeholder="Select locations..."
                  className="text-sm"
                  classNamePrefix="react-select"
                />
              )}
            />
          </FilterSection>

          <Separator />

          {/* Property Type */}
          <FilterSection
            title="Property Type"
            icon={Home}
            count={watchedValues.propertyTypes?.length}
          >
            <div className="grid grid-cols-2 gap-3">
              {FILTER_OPTIONS.propertyTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={watchedValues.propertyTypes?.includes(type.id)}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.propertyTypes || []
                      if (checked) {
                        setValue('propertyTypes', [...current, type.id])
                      } else {
                        setValue(
                          'propertyTypes',
                          current.filter((t) => t !== type.id)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={type.id}
                    className="text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <type.icon className="h-3 w-3" />
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Expected Returns */}
          <FilterSection title="Expected Returns" icon={TrendingUp}>
            <RangeSlider
              label="Annual Return"
              value={watchedValues.returnRange}
              onChange={(value) => setValue('returnRange', value)}
              min={5}
              max={25}
              step={0.5}
              formatValue={formatPercentage}
              description="Expected annual return percentage"
            />
          </FilterSection>

          <Separator />

          {/* Funding Status */}
          <FilterSection
            title="Funding Status"
            icon={Calendar}
            count={watchedValues.fundingStatus?.length}
          >
            <div className="space-y-2">
              {FILTER_OPTIONS.fundingStatus.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.id}
                    checked={watchedValues.fundingStatus?.includes(status.id)}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.fundingStatus || []
                      if (checked) {
                        setValue('fundingStatus', [...current, status.id])
                      } else {
                        setValue(
                          'fundingStatus',
                          current.filter((s) => s !== status.id)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={status.id}
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        status.color === 'blue' && 'bg-blue-500',
                        status.color === 'green' && 'bg-green-500',
                        status.color === 'yellow' && 'bg-yellow-500',
                        status.color === 'gray' && 'bg-gray-400'
                      )}
                    />
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Amenities */}
          <FilterSection
            title="Amenities"
            icon={Building}
            count={watchedValues.amenities?.length}
            defaultOpen={false}
          >
            <div className="grid grid-cols-2 gap-2">
              {FILTER_OPTIONS.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={watchedValues.amenities?.includes(amenity.id)}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.amenities || []
                      if (checked) {
                        setValue('amenities', [...current, amenity.id])
                      } else {
                        setValue(
                          'amenities',
                          current.filter((a) => a !== amenity.id)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={amenity.id}
                    className="text-xs cursor-pointer"
                  >
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Sort By */}
          {showSort && (
            <>
              <Separator />
              <FilterSection title="Sort By" icon={Filter} defaultOpen={false}>
                <Controller
                  name="sortBy"
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {FILTER_OPTIONS.sortOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              </FilterSection>
            </>
          )}
        </form>
      </Form>

      {/* Clear Filters Button */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="w-full gap-2"
          disabled={activeFiltersCount === 0}
        >
          <Trash2 className="h-4 w-4" />
          Clear All Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )

  // Render based on variant
  if (variant === 'sheet') {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {children || (
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md p-0 overflow-y-auto">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Properties
            </SheetTitle>
            <SheetDescription>
              Refine your search to find the perfect investment opportunity
            </SheetDescription>
          </SheetHeader>
          {filterContent}
        </SheetContent>
      </Sheet>
    )
  }

  if (variant === 'inline') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filterContent}
        </CardContent>
      </Card>
    )
  }

  // Default sidebar variant
  return (
    <div className={cn('space-y-1', className)}>
      {filterContent}
    </div>
  )
}