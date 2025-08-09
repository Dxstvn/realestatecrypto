/**
 * PropertyChain Accessibility Features
 * 
 * Real estate specific accessibility components and utilities
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Home,
  DollarSign,
  MapPin,
  Building,
  TrendingUp,
  FileText,
  Users,
  Calculator,
  Info,
  AlertCircle,
  CheckCircle,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Palette,
  Navigation,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Star,
  Heart,
  Share2,
  Download,
  Printer,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Camera,
  Image,
  Video,
  FileImage,
  Layers,
  Grid,
  List,
  Map as MapIcon,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RefreshCw,
  Settings,
  Accessibility,
  Headphones,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
} from 'lucide-react'
import {
  useAccessibility,
  ScreenReaderOnly,
  LiveRegion,
  FocusTrap,
  KeyboardNavigation,
} from './index'
import { formatCurrency, formatNumber, formatDate } from '@/lib/format'

// ============================================================================
// PropertyChain Specific Types
// ============================================================================

export interface PropertyAccessibilityData {
  wheelchairAccessible: boolean
  elevatorAvailable: boolean
  rampAccess: boolean
  accessibleParking: boolean
  accessibleBathrooms: boolean
  wideDoorways: boolean
  grabBars: boolean
  visualAlarms: boolean
  brailleSignage: boolean
  audioInduction: boolean
  serviceAnimalFriendly: boolean
  accessibleRoute: boolean
}

export interface AccessiblePropertyCardProps {
  property: {
    id: string
    title: string
    address: string
    price: number
    roi: number
    type: string
    bedrooms: number
    bathrooms: number
    sqft: number
    image?: string
    accessibility?: PropertyAccessibilityData
    tokenized?: boolean
    fundingProgress?: number
  }
  variant?: 'default' | 'compact' | 'detailed'
  onSelect?: () => void
  selected?: boolean
}

// ============================================================================
// Accessible Property Card
// ============================================================================

export function AccessiblePropertyCard({
  property,
  variant = 'default',
  onSelect,
  selected = false,
}: AccessiblePropertyCardProps) {
  const { config, announceToScreenReader } = useAccessibility()
  const [imageError, setImageError] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  const handleSelect = () => {
    onSelect?.()
    announceToScreenReader(
      selected 
        ? `Deselected ${property.title}` 
        : `Selected ${property.title}, ${property.type} property at ${property.address}, priced at ${formatCurrency(property.price)}`
    )
  }

  const accessibilityFeatures = React.useMemo(() => {
    if (!property.accessibility) return []
    
    const features = []
    const a = property.accessibility
    
    if (a.wheelchairAccessible) features.push('Wheelchair accessible')
    if (a.elevatorAvailable) features.push('Elevator available')
    if (a.rampAccess) features.push('Ramp access')
    if (a.accessibleParking) features.push('Accessible parking')
    if (a.accessibleBathrooms) features.push('Accessible bathrooms')
    if (a.wideDoorways) features.push('Wide doorways')
    if (a.grabBars) features.push('Grab bars installed')
    if (a.visualAlarms) features.push('Visual alarm systems')
    if (a.brailleSignage) features.push('Braille signage')
    if (a.serviceAnimalFriendly) features.push('Service animal friendly')
    
    return features
  }, [property.accessibility])

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        selected && "ring-2 ring-primary",
        variant === 'compact' && "p-3",
        config.clickTargetSize === 'large' && "min-h-[48px]",
        config.clickTargetSize === 'largest' && "min-h-[56px]"
      )}
      role="article"
      aria-label={`Property: ${property.title}`}
      aria-selected={selected}
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSelect()
        }
      }}
    >
      <CardContent className={cn("p-4", variant === 'compact' && "p-2")}>
        {/* Property Image with Alt Text */}
        {property.image && !imageError && variant !== 'compact' && (
          <div className="relative mb-4">
            <img
              src={property.image}
              alt={`${property.type} property at ${property.address}. ${property.bedrooms} bedrooms, ${property.bathrooms} bathrooms, ${formatNumber(property.sqft)} square feet.`}
              className="w-full h-48 object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
            {property.tokenized && (
              <Badge className="absolute top-2 right-2">
                <Shield className="h-3 w-3 mr-1" />
                Tokenized
              </Badge>
            )}
          </div>
        )}

        {/* Property Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {property.title}
            <ScreenReaderOnly>
              , {property.type} property
            </ScreenReaderOnly>
          </h3>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            <span>{property.address}</span>
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold" aria-label={`Price: ${formatCurrency(property.price)}`}>
              {formatCurrency(property.price)}
            </span>
            <Badge variant="secondary" aria-label={`Return on investment: ${property.roi} percent annually`}>
              <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
              {property.roi}% ROI
            </Badge>
          </div>

          {/* Property Features */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span aria-label={`${property.bedrooms} bedrooms`}>
              {property.bedrooms} bed
            </span>
            <span aria-label={`${property.bathrooms} bathrooms`}>
              {property.bathrooms} bath
            </span>
            <span aria-label={`${formatNumber(property.sqft)} square feet`}>
              {formatNumber(property.sqft)} sqft
            </span>
          </div>

          {/* Funding Progress */}
          {property.fundingProgress !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Funding Progress</span>
                <span aria-label={`${property.fundingProgress} percent funded`}>
                  {property.fundingProgress}%
                </span>
              </div>
              <Progress 
                value={property.fundingProgress} 
                className="h-2"
                aria-label={`Funding progress: ${property.fundingProgress} percent`}
              />
            </div>
          )}

          {/* Accessibility Features */}
          {accessibilityFeatures.length > 0 && (
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(!expanded)
                  announceToScreenReader(
                    expanded 
                      ? 'Accessibility features collapsed' 
                      : `Accessibility features expanded. This property has ${accessibilityFeatures.length} accessibility features.`
                  )
                }}
                aria-expanded={expanded}
                aria-controls={`accessibility-${property.id}`}
              >
                <span className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  Accessibility Features ({accessibilityFeatures.length})
                </span>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {expanded && (
                <div 
                  id={`accessibility-${property.id}`}
                  className="mt-2 space-y-1"
                  role="list"
                  aria-label="Accessibility features"
                >
                  {accessibilityFeatures.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 text-sm"
                      role="listitem"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" aria-hidden="true" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Accessible Investment Calculator
// ============================================================================

export function AccessibleInvestmentCalculator() {
  const { config, announceToScreenReader } = useAccessibility()
  const [investment, setInvestment] = React.useState(10000)
  const [years, setYears] = React.useState(5)
  const [roi, setRoi] = React.useState(12)
  
  const projectedValue = React.useMemo(() => {
    return investment * Math.pow(1 + roi / 100, years)
  }, [investment, years, roi])
  
  const totalReturn = projectedValue - investment
  const annualIncome = (investment * roi) / 100

  React.useEffect(() => {
    const timer = setTimeout(() => {
      announceToScreenReader(
        `With an investment of ${formatCurrency(investment)} over ${years} years at ${roi}% return, ` +
        `your projected value is ${formatCurrency(projectedValue)} with a total return of ${formatCurrency(totalReturn)}`
      )
    }, 1000)
    return () => clearTimeout(timer)
  }, [investment, years, roi, projectedValue, totalReturn, announceToScreenReader])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Investment Calculator
        </CardTitle>
        <CardDescription>
          Calculate your potential returns on property investments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Investment Amount */}
        <div className="space-y-2">
          <Label htmlFor="investment-amount">
            Investment Amount
            <span className="sr-only">in dollars</span>
          </Label>
          <div className="space-y-2">
            <Slider
              id="investment-amount"
              min={1000}
              max={1000000}
              step={1000}
              value={[investment]}
              onValueChange={(value) => setInvestment(value[0])}
              aria-label="Investment amount"
              aria-valuemin={1000}
              aria-valuemax={1000000}
              aria-valuenow={investment}
              aria-valuetext={formatCurrency(investment)}
            />
            <div className="flex items-center justify-between text-sm">
              <span>{formatCurrency(1000)}</span>
              <span className="font-semibold text-lg" aria-live="polite">
                {formatCurrency(investment)}
              </span>
              <span>{formatCurrency(1000000)}</span>
            </div>
          </div>
        </div>

        {/* Investment Period */}
        <div className="space-y-2">
          <Label htmlFor="investment-years">
            Investment Period
            <span className="sr-only">in years</span>
          </Label>
          <div className="space-y-2">
            <Slider
              id="investment-years"
              min={1}
              max={30}
              step={1}
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              aria-label="Investment period"
              aria-valuemin={1}
              aria-valuemax={30}
              aria-valuenow={years}
              aria-valuetext={`${years} years`}
            />
            <div className="flex items-center justify-between text-sm">
              <span>1 year</span>
              <span className="font-semibold text-lg" aria-live="polite">
                {years} years
              </span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {/* Expected ROI */}
        <div className="space-y-2">
          <Label htmlFor="expected-roi">
            Expected Annual Return
            <span className="sr-only">percentage</span>
          </Label>
          <div className="space-y-2">
            <Slider
              id="expected-roi"
              min={5}
              max={25}
              step={0.5}
              value={[roi]}
              onValueChange={(value) => setRoi(value[0])}
              aria-label="Expected annual return"
              aria-valuemin={5}
              aria-valuemax={25}
              aria-valuenow={roi}
              aria-valuetext={`${roi} percent`}
            />
            <div className="flex items-center justify-between text-sm">
              <span>5%</span>
              <span className="font-semibold text-lg" aria-live="polite">
                {roi}%
              </span>
              <span>25%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="border-t pt-4 space-y-3" role="region" aria-label="Investment calculation results">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Initial Investment</span>
            <span className="font-semibold">{formatCurrency(investment)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Annual Income</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(annualIncome)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Return</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(totalReturn)}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Projected Value</span>
            <span className="font-bold text-primary">
              {formatCurrency(projectedValue)}
            </span>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is an estimate based on constant returns. Actual results may vary.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Accessible Property Search
// ============================================================================

export function AccessiblePropertySearch() {
  const { config, announceToScreenReader } = useAccessibility()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [propertyType, setPropertyType] = React.useState('all')
  const [priceRange, setPriceRange] = React.useState('all')
  const [accessibilityFilter, setAccessibilityFilter] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    const filters = []
    if (propertyType !== 'all') filters.push(`${propertyType} properties`)
    if (priceRange !== 'all') filters.push(`price ${priceRange}`)
    if (accessibilityFilter) filters.push('wheelchair accessible')
    
    const announcement = searchQuery
      ? `Searching for ${searchQuery}${filters.length > 0 ? ' with filters: ' + filters.join(', ') : ''}`
      : `Browsing all properties${filters.length > 0 ? ' with filters: ' + filters.join(', ') : ''}`
    
    announceToScreenReader(announcement)
  }

  // Keyboard shortcut to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || e.key === 's') && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          searchInputRef.current?.focus()
          announceToScreenReader('Search field focused')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [announceToScreenReader])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Property Search
        </CardTitle>
        <CardDescription>
          Press "/" to focus search. Use filters to narrow results.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="property-search">Search Properties</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="property-search"
              type="search"
              placeholder="Enter location, property name, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className={cn(
                "w-full pl-10 pr-4 py-2 border rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                config.clickTargetSize === 'large' && "py-3",
                config.clickTargetSize === 'largest' && "py-4"
              )}
              aria-label="Search for properties"
              aria-describedby="search-help"
            />
          </div>
          <p id="search-help" className="text-xs text-muted-foreground">
            Try "downtown apartment" or "3 bedroom house with garage"
          </p>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="property-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-range">Price Range</Label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger id="price-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-250k">Under $250,000</SelectItem>
                <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="1m-2m">$1,000,000 - $2,000,000</SelectItem>
                <SelectItem value="2m+">Over $2,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Accessibility Filter */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Accessibility className="h-5 w-5 text-primary" />
            <div>
              <Label htmlFor="accessibility-filter" className="font-medium">
                Wheelchair Accessible Only
              </Label>
              <p className="text-xs text-muted-foreground">
                Show only properties with accessibility features
              </p>
            </div>
          </div>
          <Switch
            id="accessibility-filter"
            checked={accessibilityFilter}
            onCheckedChange={setAccessibilityFilter}
            aria-label="Filter for wheelchair accessible properties"
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch} 
          className="w-full"
          size={config.clickTargetSize === 'largest' ? 'lg' : 'default'}
        >
          <Search className="mr-2 h-4 w-4" />
          Search Properties
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Voice Navigation Component
// ============================================================================

export function VoiceNavigation() {
  const { announceToScreenReader } = useAccessibility()
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState('')
  const [isSupported, setIsSupported] = React.useState(false)

  React.useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  const startListening = () => {
    if (!isSupported) {
      announceToScreenReader('Voice navigation is not supported in your browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      announceToScreenReader('Voice navigation started. Speak your command.')
    }

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase()
      setTranscript(command)
      processVoiceCommand(command)
    }

    recognition.onerror = () => {
      setIsListening(false)
      announceToScreenReader('Voice navigation error. Please try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const processVoiceCommand = (command: string) => {
    // Process common navigation commands
    if (command.includes('search')) {
      announceToScreenReader('Opening search')
      // Trigger search focus
    } else if (command.includes('home')) {
      announceToScreenReader('Navigating to home')
      // Navigate to home
    } else if (command.includes('properties')) {
      announceToScreenReader('Navigating to properties')
      // Navigate to properties
    } else if (command.includes('dashboard')) {
      announceToScreenReader('Navigating to dashboard')
      // Navigate to dashboard
    } else if (command.includes('help')) {
      announceToScreenReader('Opening help')
      // Open help
    } else {
      announceToScreenReader(`Command not recognized: ${command}`)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button
        size="lg"
        variant={isListening ? 'destructive' : 'default'}
        className="rounded-full h-14 w-14"
        onClick={startListening}
        disabled={isListening}
        aria-label={isListening ? 'Listening...' : 'Start voice navigation'}
      >
        {isListening ? (
          <Mic className="h-6 w-6 animate-pulse" />
        ) : (
          <MicOff className="h-6 w-6" />
        )}
      </Button>
      
      {transcript && (
        <Card className="absolute bottom-16 right-0 w-64 p-3">
          <p className="text-sm">
            <strong>Last command:</strong> {transcript}
          </p>
        </Card>
      )}
    </div>
  )
}

// ============================================================================
// Text-to-Speech Component
// ============================================================================

export function TextToSpeech({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(false)

  React.useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  const speak = () => {
    if (!isSupported || !text) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  if (!isSupported) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={speak}
      aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  )
}

// ============================================================================
// Export all PropertyChain accessibility components
// ============================================================================

export {
  AccessiblePropertyCard,
  AccessibleInvestmentCalculator,
  AccessiblePropertySearch,
  VoiceNavigation,
  TextToSpeech,
}