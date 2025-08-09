/**
 * Accessibility Features - PropertyChain
 * 
 * WCAG AA compliant accessibility utilities and components
 * Following Section 0 design principles and CLAUDE.md standards
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Type,
  ZoomIn,
  ZoomOut,
  Palette,
  Sun,
  Moon,
  Monitor,
  Keyboard,
  MousePointer,
  Accessibility,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Menu,
  X,
  AlertCircle,
  Check,
  Play,
  Pause,
  SkipForward,
  RotateCw,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Navigation,
  Focus,
  Zap,
  Shield,
  Heart,
  Star,
  Bell,
  MessageSquare,
} from 'lucide-react'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface AccessibilityConfig {
  // Visual
  fontSize: 'small' | 'normal' | 'large' | 'extra-large'
  lineHeight: 'compact' | 'normal' | 'relaxed' | 'loose'
  letterSpacing: 'tight' | 'normal' | 'wide'
  contrast: 'normal' | 'high' | 'highest'
  reduceMotion: boolean
  reduceTransparency: boolean
  
  // Interactive
  focusIndicator: 'default' | 'high-contrast' | 'thick'
  keyboardOnly: boolean
  clickTargetSize: 'default' | 'large' | 'largest'
  
  // Screen Reader
  screenReaderAnnouncements: boolean
  ariaLiveRegions: 'off' | 'polite' | 'assertive'
  descriptiveLinks: boolean
  
  // Cognitive
  simpleLanguage: boolean
  readingGuide: boolean
  focusMode: boolean
  
  // Audio/Visual
  captions: boolean
  transcripts: boolean
  audioDescriptions: boolean
  signLanguage: boolean
}

export interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  returnFocus?: boolean
  onEscape?: () => void
  className?: string
}

export interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export interface LiveRegionProps {
  children: React.ReactNode
  mode?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export interface KeyboardNavigationProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical' | 'grid'
  wrap?: boolean
  onNavigate?: (index: number) => void
  className?: string
}

// ============================================================================
// Accessibility Context
// ============================================================================

const AccessibilityContext = React.createContext<{
  config: AccessibilityConfig
  updateConfig: (updates: Partial<AccessibilityConfig>) => void
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
} | null>(null)

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export function AccessibilityProvider({
  children,
  defaultConfig,
}: {
  children: React.ReactNode
  defaultConfig?: Partial<AccessibilityConfig>
}) {
  const [config, setConfig] = React.useState<AccessibilityConfig>({
    fontSize: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    contrast: 'normal',
    reduceMotion: false,
    reduceTransparency: false,
    focusIndicator: 'default',
    keyboardOnly: false,
    clickTargetSize: 'default',
    screenReaderAnnouncements: true,
    ariaLiveRegions: 'polite',
    descriptiveLinks: true,
    simpleLanguage: false,
    readingGuide: false,
    focusMode: false,
    captions: true,
    transcripts: false,
    audioDescriptions: false,
    signLanguage: false,
    ...defaultConfig,
  })

  const [announcements, setAnnouncements] = React.useState<Array<{
    id: string
    message: string
    priority: 'polite' | 'assertive'
  }>>([])

  const updateConfig = React.useCallback((updates: Partial<AccessibilityConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const announceToScreenReader = React.useCallback((
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const id = `announce-${Date.now()}`
    setAnnouncements(prev => [...prev, { id, message, priority }])
    
    // Auto-remove after announcement
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    }, 1000)
  }, [])

  // Apply global styles based on config
  React.useEffect(() => {
    const root = document.documentElement
    
    // Font size
    const fontSizes = {
      small: '14px',
      normal: '16px',
      large: '18px',
      'extra-large': '20px',
    }
    root.style.setProperty('--base-font-size', fontSizes[config.fontSize])
    
    // Line height
    const lineHeights = {
      compact: '1.2',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2',
    }
    root.style.setProperty('--base-line-height', lineHeights[config.lineHeight])
    
    // Letter spacing
    const letterSpacings = {
      tight: '-0.02em',
      normal: '0',
      wide: '0.05em',
    }
    root.style.setProperty('--base-letter-spacing', letterSpacings[config.letterSpacing])
    
    // Reduce motion
    if (config.reduceMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    // High contrast
    if (config.contrast !== 'normal') {
      root.classList.add(`contrast-${config.contrast}`)
    } else {
      root.classList.remove('contrast-high', 'contrast-highest')
    }
    
    // Focus indicator
    root.setAttribute('data-focus-style', config.focusIndicator)
    
    // Click target size
    root.setAttribute('data-target-size', config.clickTargetSize)
  }, [config])

  return (
    <AccessibilityContext.Provider value={{ config, updateConfig, announceToScreenReader }}>
      {children}
      
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcements
          .filter(a => a.priority === 'polite')
          .map(a => <div key={a.id}>{a.message}</div>)
        }
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcements
          .filter(a => a.priority === 'assertive')
          .map(a => <div key={a.id}>{a.message}</div>)
        }
      </div>
    </AccessibilityContext.Provider>
  )
}

// ============================================================================
// Skip Navigation Links
// ============================================================================

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:px-4 focus:py-2 focus:rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {children}
    </a>
  )
}

export function SkipNavigation() {
  return (
    <div className="skip-navigation">
      <SkipLink href="#main">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#footer">Skip to footer</SkipLink>
    </div>
  )
}

// ============================================================================
// Focus Management
// ============================================================================

export function FocusTrap({
  children,
  active = true,
  returnFocus = true,
  onEscape,
  className,
}: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const previousFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!active) return

    // Store previous focus
    previousFocus.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = () => {
      if (!containerRef.current) return []
      
      const selector = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
      
      return Array.from(containerRef.current.querySelectorAll(selector)) as HTMLElement[]
    }

    // Focus first element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape()
        return
      }

      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
      
      if (e.shiftKey) {
        // Backward navigation
        if (currentIndex <= 0) {
          e.preventDefault()
          focusableElements[focusableElements.length - 1].focus()
        }
      } else {
        // Forward navigation
        if (currentIndex === focusableElements.length - 1) {
          e.preventDefault()
          focusableElements[0].focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      // Return focus
      if (returnFocus && previousFocus.current) {
        previousFocus.current.focus()
      }
    }
  }, [active, returnFocus, onEscape])

  if (!active) return <>{children}</>

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

export function KeyboardNavigation({
  children,
  orientation = 'vertical',
  wrap = true,
  onNavigate,
  className,
}: KeyboardNavigationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const getNavigableElements = React.useCallback(() => {
    if (!containerRef.current) return []
    return Array.from(
      containerRef.current.querySelectorAll('[data-navigable="true"]')
    ) as HTMLElement[]
  }, [])

  const navigate = React.useCallback((direction: 'next' | 'prev' | 'first' | 'last') => {
    const elements = getNavigableElements()
    if (elements.length === 0) return

    let newIndex = currentIndex

    switch (direction) {
      case 'next':
        newIndex = currentIndex + 1
        if (newIndex >= elements.length) {
          newIndex = wrap ? 0 : elements.length - 1
        }
        break
      case 'prev':
        newIndex = currentIndex - 1
        if (newIndex < 0) {
          newIndex = wrap ? elements.length - 1 : 0
        }
        break
      case 'first':
        newIndex = 0
        break
      case 'last':
        newIndex = elements.length - 1
        break
    }

    setCurrentIndex(newIndex)
    elements[newIndex]?.focus()
    onNavigate?.(newIndex)
  }, [currentIndex, wrap, getNavigableElements, onNavigate])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isVertical = orientation === 'vertical'
      const isHorizontal = orientation === 'horizontal'
      
      switch (e.key) {
        case 'ArrowDown':
          if (isVertical || orientation === 'grid') {
            e.preventDefault()
            navigate('next')
          }
          break
        case 'ArrowUp':
          if (isVertical || orientation === 'grid') {
            e.preventDefault()
            navigate('prev')
          }
          break
        case 'ArrowRight':
          if (isHorizontal || orientation === 'grid') {
            e.preventDefault()
            navigate('next')
          }
          break
        case 'ArrowLeft':
          if (isHorizontal || orientation === 'grid') {
            e.preventDefault()
            navigate('prev')
          }
          break
        case 'Home':
          e.preventDefault()
          navigate('first')
          break
        case 'End':
          e.preventDefault()
          navigate('last')
          break
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('keydown', handleKeyDown)
      return () => container.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, orientation])

  return (
    <div
      ref={containerRef}
      className={className}
      role="group"
      aria-orientation={orientation}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Live Regions for Screen Readers
// ============================================================================

export function LiveRegion({
  children,
  mode = 'polite',
  atomic = false,
  relevant = 'additions',
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={mode}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  )
}

export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

// ============================================================================
// Accessibility Settings Panel
// ============================================================================

export function AccessibilitySettings() {
  const { config, updateConfig } = useAccessibility()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize your viewing experience for better accessibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Visual</h3>
          
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              value={config.fontSize}
              onValueChange={(value) => updateConfig({ 
                fontSize: value as AccessibilityConfig['fontSize'] 
              })}
            >
              <SelectTrigger id="font-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="line-height">Line Height</Label>
            <Select
              value={config.lineHeight}
              onValueChange={(value) => updateConfig({ 
                lineHeight: value as AccessibilityConfig['lineHeight'] 
              })}
            >
              <SelectTrigger id="line-height">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="loose">Loose</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrast">Contrast</Label>
            <Select
              value={config.contrast}
              onValueChange={(value) => updateConfig({ 
                contrast: value as AccessibilityConfig['contrast'] 
              })}
            >
              <SelectTrigger id="contrast">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="highest">Highest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-motion">Reduce Motion</Label>
            <Switch
              id="reduce-motion"
              checked={config.reduceMotion}
              onCheckedChange={(checked) => updateConfig({ reduceMotion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-transparency">Reduce Transparency</Label>
            <Switch
              id="reduce-transparency"
              checked={config.reduceTransparency}
              onCheckedChange={(checked) => updateConfig({ reduceTransparency: checked })}
            />
          </div>
        </div>

        {/* Interactive Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Interactive</h3>
          
          <div className="space-y-2">
            <Label htmlFor="focus-indicator">Focus Indicator</Label>
            <Select
              value={config.focusIndicator}
              onValueChange={(value) => updateConfig({ 
                focusIndicator: value as AccessibilityConfig['focusIndicator'] 
              })}
            >
              <SelectTrigger id="focus-indicator">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
                <SelectItem value="thick">Thick Border</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-size">Click Target Size</Label>
            <Select
              value={config.clickTargetSize}
              onValueChange={(value) => updateConfig({ 
                clickTargetSize: value as AccessibilityConfig['clickTargetSize'] 
              })}
            >
              <SelectTrigger id="target-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (44px)</SelectItem>
                <SelectItem value="large">Large (48px)</SelectItem>
                <SelectItem value="largest">Largest (56px)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="keyboard-only">Keyboard Navigation Only</Label>
            <Switch
              id="keyboard-only"
              checked={config.keyboardOnly}
              onCheckedChange={(checked) => updateConfig({ keyboardOnly: checked })}
            />
          </div>
        </div>

        {/* Screen Reader Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Screen Reader</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="announcements">Screen Reader Announcements</Label>
            <Switch
              id="announcements"
              checked={config.screenReaderAnnouncements}
              onCheckedChange={(checked) => updateConfig({ 
                screenReaderAnnouncements: checked 
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="descriptive-links">Descriptive Links</Label>
            <Switch
              id="descriptive-links"
              checked={config.descriptiveLinks}
              onCheckedChange={(checked) => updateConfig({ descriptiveLinks: checked })}
            />
          </div>
        </div>

        {/* Cognitive Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cognitive</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="simple-language">Simple Language</Label>
            <Switch
              id="simple-language"
              checked={config.simpleLanguage}
              onCheckedChange={(checked) => updateConfig({ simpleLanguage: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reading-guide">Reading Guide</Label>
            <Switch
              id="reading-guide"
              checked={config.readingGuide}
              onCheckedChange={(checked) => updateConfig({ readingGuide: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="focus-mode">Focus Mode</Label>
            <Switch
              id="focus-mode"
              checked={config.focusMode}
              onCheckedChange={(checked) => updateConfig({ focusMode: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Accessibility Toolbar
// ============================================================================

export function AccessibilityToolbar() {
  const { config, updateConfig, announceToScreenReader } = useAccessibility()
  const [isOpen, setIsOpen] = React.useState(false)

  const increaseFontSize = () => {
    const sizes: AccessibilityConfig['fontSize'][] = ['small', 'normal', 'large', 'extra-large']
    const currentIndex = sizes.indexOf(config.fontSize)
    if (currentIndex < sizes.length - 1) {
      updateConfig({ fontSize: sizes[currentIndex + 1] })
      announceToScreenReader(`Font size increased to ${sizes[currentIndex + 1]}`)
    }
  }

  const decreaseFontSize = () => {
    const sizes: AccessibilityConfig['fontSize'][] = ['small', 'normal', 'large', 'extra-large']
    const currentIndex = sizes.indexOf(config.fontSize)
    if (currentIndex > 0) {
      updateConfig({ fontSize: sizes[currentIndex - 1] })
      announceToScreenReader(`Font size decreased to ${sizes[currentIndex - 1]}`)
    }
  }

  const toggleHighContrast = () => {
    const newContrast = config.contrast === 'normal' ? 'high' : 'normal'
    updateConfig({ contrast: newContrast })
    announceToScreenReader(`High contrast ${newContrast === 'high' ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="mb-2 w-64">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Font Size</span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={decreaseFontSize}
                  aria-label="Decrease font size"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs w-20 text-center">{config.fontSize}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={increaseFontSize}
                  aria-label="Increase font size"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">High Contrast</span>
              <Switch
                checked={config.contrast !== 'normal'}
                onCheckedChange={toggleHighContrast}
                aria-label="Toggle high contrast"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reduce Motion</span>
              <Switch
                checked={config.reduceMotion}
                onCheckedChange={(checked) => {
                  updateConfig({ reduceMotion: checked })
                  announceToScreenReader(`Motion ${checked ? 'reduced' : 'enabled'}`)
                }}
                aria-label="Toggle reduce motion"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Focus Mode</span>
              <Switch
                checked={config.focusMode}
                onCheckedChange={(checked) => {
                  updateConfig({ focusMode: checked })
                  announceToScreenReader(`Focus mode ${checked ? 'enabled' : 'disabled'}`)
                }}
                aria-label="Toggle focus mode"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        size="lg"
        className="rounded-full h-14 w-14"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle accessibility toolbar"
        aria-expanded={isOpen}
      >
        <Accessibility className="h-6 w-6" />
      </Button>
    </div>
  )
}

// ============================================================================
// Accessible Form Components
// ============================================================================

export function AccessibleFormField({
  label,
  error,
  required,
  description,
  children,
  id,
}: {
  label: string
  error?: string
  required?: boolean
  description?: string
  children: React.ReactNode
  id: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </Label>
      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div aria-describedby={`${id}-description ${id}-error`}>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          <AlertCircle className="inline h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// Reading Guide
// ============================================================================

export function ReadingGuide() {
  const [position, setPosition] = React.useState(0)
  const { config } = useAccessibility()

  React.useEffect(() => {
    if (!config.readingGuide) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition(e.clientY)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [config.readingGuide])

  if (!config.readingGuide) return null

  return (
    <div
      className="fixed left-0 right-0 h-12 bg-primary/10 pointer-events-none z-40 transition-transform"
      style={{ transform: `translateY(${position - 24}px)` }}
      aria-hidden="true"
    />
  )
}

// ============================================================================
// Focus Mode Overlay
// ============================================================================

export function FocusModeOverlay() {
  const { config } = useAccessibility()
  
  if (!config.focusMode) return null

  return (
    <div
      className="fixed inset-0 bg-background/50 pointer-events-none z-30"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/4 bottom-1/4 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
    </div>
  )
}

// ============================================================================
// Keyboard Shortcuts Helper
// ============================================================================

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = React.useState(false)

  const shortcuts = [
    { keys: ['Tab'], description: 'Navigate forward' },
    { keys: ['Shift', 'Tab'], description: 'Navigate backward' },
    { keys: ['Enter'], description: 'Activate button/link' },
    { keys: ['Space'], description: 'Check/uncheck checkbox' },
    { keys: ['Esc'], description: 'Close dialog/menu' },
    { keys: ['/', '?'], description: 'Open search' },
    { keys: ['Alt', 'S'], description: 'Skip to main content' },
    { keys: ['Alt', 'A'], description: 'Open accessibility settings' },
  ]

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Keyboard Shortcuts
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-muted-foreground">+</span>}
                          <kbd className="px-2 py-1 text-xs bg-muted rounded">
                            {key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

// ============================================================================
// Export all components
// ============================================================================

export {
  FocusTrap,
  SkipLink,
  SkipNavigation,
  LiveRegion,
  ScreenReaderOnly,
  AccessibilitySettings,
  AccessibilityToolbar,
  AccessibleFormField,
  ReadingGuide,
  FocusModeOverlay,
  KeyboardShortcuts,
}