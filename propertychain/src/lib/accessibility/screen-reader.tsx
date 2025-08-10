/**
 * Screen Reader Support Utilities - PropertyChain
 * 
 * Comprehensive screen reader support with announcements, live regions, and semantic markup
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Screen reader announcement priority levels
 */
export type AnnouncementPriority = 'polite' | 'assertive' | 'off'

/**
 * Live region configuration
 */
interface LiveRegionConfig {
  priority: AnnouncementPriority
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  busy?: boolean
}

/**
 * Screen reader announcement options
 */
interface AnnouncementOptions {
  priority?: AnnouncementPriority
  delay?: number
  interrupt?: boolean
  clear?: boolean
}

/**
 * Screen Reader Manager
 */
export class ScreenReaderManager {
  private static instance: ScreenReaderManager
  private liveRegions: Map<string, HTMLElement> = new Map()
  private announcementQueue: Array<{
    message: string
    priority: AnnouncementPriority
    timestamp: number
  }> = []
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this.createLiveRegions()
    }
  }
  
  static getInstance(): ScreenReaderManager {
    if (!ScreenReaderManager.instance) {
      ScreenReaderManager.instance = new ScreenReaderManager()
    }
    return ScreenReaderManager.instance
  }
  
  /**
   * Announce message to screen readers
   */
  announce(
    message: string, 
    options: AnnouncementOptions = {}
  ): void {
    if (!message.trim() || typeof window === 'undefined') return
    
    const {
      priority = 'polite',
      delay = 0,
      interrupt = false,
      clear = false,
    } = options
    
    // Clear existing announcements if requested
    if (clear) {
      this.clearAnnouncements()
    }
    
    // Interrupt current announcements if requested
    if (interrupt) {
      this.clearAnnouncements('assertive')
    }
    
    const announce = () => {
      const liveRegion = this.liveRegions.get(priority)
      if (liveRegion) {
        // Clear and set message
        liveRegion.textContent = ''
        setTimeout(() => {
          liveRegion.textContent = message
        }, 10) // Small delay ensures screen reader picks up the change
        
        // Add to queue for tracking
        this.announcementQueue.push({
          message,
          priority,
          timestamp: Date.now(),
        })
        
        // Clean up old announcements
        this.cleanupQueue()
      }
    }
    
    if (delay > 0) {
      setTimeout(announce, delay)
    } else {
      announce()
    }
  }
  
  /**
   * Clear announcements
   */
  clearAnnouncements(priority?: AnnouncementPriority): void {
    if (priority) {
      const region = this.liveRegions.get(priority)
      if (region) {
        region.textContent = ''
      }
      this.announcementQueue = this.announcementQueue.filter(a => a.priority !== priority)
    } else {
      this.liveRegions.forEach(region => {
        region.textContent = ''
      })
      this.announcementQueue = []
    }
  }
  
  /**
   * Announce page navigation
   */
  announcePageChange(pageName: string, description?: string): void {
    const message = description 
      ? `Navigated to ${pageName}. ${description}`
      : `Navigated to ${pageName}`
    
    this.announce(message, { priority: 'assertive' })
  }
  
  /**
   * Announce form validation errors
   */
  announceFormErrors(errors: string[]): void {
    if (errors.length === 0) return
    
    const message = errors.length === 1
      ? `Form error: ${errors[0]}`
      : `${errors.length} form errors: ${errors.join(', ')}`
    
    this.announce(message, { priority: 'assertive' })
  }
  
  /**
   * Announce loading states
   */
  announceLoading(isLoading: boolean, context?: string): void {
    const message = isLoading
      ? `Loading${context ? ` ${context}` : ''}...`
      : `Finished loading${context ? ` ${context}` : ''}`
    
    this.announce(message, { priority: 'polite' })
  }
  
  /**
   * Announce data changes
   */
  announceDataChange(type: string, action: string, itemName?: string): void {
    const message = itemName
      ? `${type} ${action}: ${itemName}`
      : `${type} ${action}`
    
    this.announce(message, { priority: 'polite' })
  }
  
  /**
   * Create live regions for announcements
   */
  private createLiveRegions(): void {
    const priorities: AnnouncementPriority[] = ['polite', 'assertive']
    
    priorities.forEach(priority => {
      if (priority === 'off') return
      
      let region = document.getElementById(`live-region-${priority}`)
      
      if (!region) {
        region = document.createElement('div')
        region.id = `live-region-${priority}`
        region.setAttribute('aria-live', priority)
        region.setAttribute('aria-atomic', 'true')
        region.setAttribute('aria-relevant', 'additions text')
        region.style.position = 'absolute'
        region.style.left = '-10000px'
        region.style.width = '1px'
        region.style.height = '1px'
        region.style.overflow = 'hidden'
        
        document.body.appendChild(region)
      }
      
      this.liveRegions.set(priority, region)
    })
  }
  
  /**
   * Clean up old announcements from queue
   */
  private cleanupQueue(): void {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    this.announcementQueue = this.announcementQueue.filter(
      announcement => announcement.timestamp > fiveMinutesAgo
    )
  }
}

/**
 * React hook for screen reader announcements
 */
export function useScreenReader() {
  const screenReader = ScreenReaderManager.getInstance()
  
  const announce = useCallback(
    (message: string, options?: AnnouncementOptions) => {
      screenReader.announce(message, options)
    },
    [screenReader]
  )
  
  const announcePageChange = useCallback(
    (pageName: string, description?: string) => {
      screenReader.announcePageChange(pageName, description)
    },
    [screenReader]
  )
  
  const announceFormErrors = useCallback(
    (errors: string[]) => {
      screenReader.announceFormErrors(errors)
    },
    [screenReader]
  )
  
  const announceLoading = useCallback(
    (isLoading: boolean, context?: string) => {
      screenReader.announceLoading(isLoading, context)
    },
    [screenReader]
  )
  
  const announceDataChange = useCallback(
    (type: string, action: string, itemName?: string) => {
      screenReader.announceDataChange(type, action, itemName)
    },
    [screenReader]
  )
  
  const clearAnnouncements = useCallback(
    (priority?: AnnouncementPriority) => {
      screenReader.clearAnnouncements(priority)
    },
    [screenReader]
  )
  
  return {
    announce,
    announcePageChange,
    announceFormErrors,
    announceLoading,
    announceDataChange,
    clearAnnouncements,
  }
}

/**
 * Live Region Component
 */
interface LiveRegionProps {
  children: React.ReactNode
  priority?: AnnouncementPriority
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export function LiveRegion({
  children,
  priority = 'polite',
  atomic = true,
  relevant = 'additions',
  className = '',
}: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Screen Reader Only Component
 */
interface ScreenReaderOnlyProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function ScreenReaderOnly({
  children,
  as: Component = 'span',
  className = '',
}: ScreenReaderOnlyProps) {
  return (
    <Component className={`sr-only ${className}`}>
      {children}
    </Component>
  )
}

/**
 * Status Announcement Hook
 */
export function useStatusAnnouncement(
  status: string | null,
  options?: AnnouncementOptions
) {
  const { announce } = useScreenReader()
  const previousStatus = useRef<string | null>(null)
  
  useEffect(() => {
    if (status && status !== previousStatus.current) {
      announce(status, options)
      previousStatus.current = status
    }
  }, [status, announce, options])
}

/**
 * Loading Announcement Hook
 */
export function useLoadingAnnouncement(
  isLoading: boolean,
  context?: string,
  delay = 500
) {
  const { announceLoading } = useScreenReader()
  const [shouldAnnounce, setShouldAnnounce] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    if (isLoading) {
      // Delay announcement to avoid announcing quick loading states
      timeoutRef.current = setTimeout(() => {
        setShouldAnnounce(true)
        announceLoading(true, context)
      }, delay)
    } else {
      // Clear timeout if loading finished quickly
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Only announce completion if we announced the start
      if (shouldAnnounce) {
        announceLoading(false, context)
        setShouldAnnounce(false)
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, context, delay, announceLoading, shouldAnnounce])
}

/**
 * Route Change Announcement Hook
 */
export function useRouteAnnouncement() {
  const { announcePageChange } = useScreenReader()
  
  return useCallback((pageName: string, description?: string) => {
    // Delay to ensure page content has loaded
    setTimeout(() => {
      announcePageChange(pageName, description)
    }, 100)
  }, [announcePageChange])
}

/**
 * Form Error Announcement Hook
 */
export function useFormErrorAnnouncement(errors: Record<string, string>) {
  const { announceFormErrors } = useScreenReader()
  const previousErrorsRef = useRef<Record<string, string>>({})
  
  useEffect(() => {
    const errorMessages = Object.values(errors).filter(Boolean)
    const previousErrorMessages = Object.values(previousErrorsRef.current).filter(Boolean)
    
    // Only announce if errors have changed
    if (errorMessages.length > 0 && 
        JSON.stringify(errorMessages) !== JSON.stringify(previousErrorMessages)) {
      announceFormErrors(errorMessages)
    }
    
    previousErrorsRef.current = errors
  }, [errors, announceFormErrors])
}

/**
 * Data Table Announcements
 */
export function useTableAnnouncements() {
  const { announce } = useScreenReader()
  
  const announceSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    announce(`Table sorted by ${column}, ${direction === 'asc' ? 'ascending' : 'descending'}`)
  }, [announce])
  
  const announceFilter = useCallback((filterCount: number) => {
    announce(`${filterCount} ${filterCount === 1 ? 'row' : 'rows'} visible after filtering`)
  }, [announce])
  
  const announceSelection = useCallback((selectedCount: number, totalCount: number) => {
    announce(`${selectedCount} of ${totalCount} rows selected`)
  }, [announce])
  
  return {
    announceSort,
    announceFilter,
    announceSelection,
  }
}

/**
 * Progress Announcements
 */
export function useProgressAnnouncement(
  progress: number,
  label?: string,
  announceInterval = 25
) {
  const { announce } = useScreenReader()
  const lastAnnouncedRef = useRef<number>(-1)
  
  useEffect(() => {
    const roundedProgress = Math.round(progress / announceInterval) * announceInterval
    
    if (roundedProgress !== lastAnnouncedRef.current && roundedProgress >= 0 && roundedProgress <= 100) {
      const message = label 
        ? `${label}: ${roundedProgress}% complete`
        : `${roundedProgress}% complete`
      
      announce(message, { priority: 'polite' })
      lastAnnouncedRef.current = roundedProgress
    }
  }, [progress, label, announceInterval, announce])
}

// Global screen reader manager instance
export const screenReader = ScreenReaderManager.getInstance()

export default ScreenReaderManager