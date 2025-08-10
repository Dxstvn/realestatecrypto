/**
 * Focus Management System - PropertyChain
 * 
 * Comprehensive focus management with focus traps, restoration, and visual indicators
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Focus trap configuration
 */
interface FocusTrapConfig {
  initialFocus?: HTMLElement | (() => HTMLElement | null)
  fallbackFocus?: HTMLElement | (() => HTMLElement | null)
  escapeDeactivates?: boolean
  clickOutsideDeactivates?: boolean
  returnFocusOnDeactivate?: boolean
  allowOutsideClick?: boolean
  preventScroll?: boolean
}

/**
 * Focus restoration options
 */
interface FocusRestorationOptions {
  preventScroll?: boolean
  delay?: number
  fallback?: HTMLElement | (() => HTMLElement | null)
}

/**
 * Focus Manager Class
 */
export class FocusManager {
  private static instance: FocusManager
  private focusHistory: HTMLElement[] = []
  private activeTrap: FocusTrap | null = null
  
  private constructor() {}
  
  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager()
    }
    return FocusManager.instance
  }
  
  /**
   * Save current focus to history
   */
  saveFocus(): HTMLElement | null {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement)
      return activeElement
    }
    return null
  }
  
  /**
   * Restore focus from history
   */
  restoreFocus(options: FocusRestorationOptions = {}): boolean {
    const {
      preventScroll = false,
      delay = 0,
      fallback,
    } = options
    
    const execute = () => {
      const lastFocusedElement = this.focusHistory.pop()
      
      if (lastFocusedElement && document.contains(lastFocusedElement)) {
        try {
          lastFocusedElement.focus({ preventScroll })
          return true
        } catch (error) {
          console.warn('Failed to restore focus:', error)
        }
      }
      
      // Try fallback if primary restoration fails
      const fallbackElement = typeof fallback === 'function' ? fallback() : fallback
      if (fallbackElement && document.contains(fallbackElement)) {
        try {
          fallbackElement.focus({ preventScroll })
          return true
        } catch (error) {
          console.warn('Failed to focus fallback element:', error)
        }
      }
      
      return false
    }
    
    if (delay > 0) {
      setTimeout(execute, delay)
      return true // Assume success for delayed execution
    } else {
      return execute()
    }
  }
  
  /**
   * Clear focus history
   */
  clearHistory(): void {
    this.focusHistory = []
  }
  
  /**
   * Check if element is focusable
   */
  isFocusable(element: Element): boolean {
    if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false
    }
    
    if (element.hasAttribute('tabindex')) {
      const tabindex = parseInt(element.getAttribute('tabindex') || '0', 10)
      return tabindex >= 0
    }
    
    const focusableElements = [
      'a[href]',
      'button',
      'input',
      'select',
      'textarea',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'object',
      'embed',
      'area[href]',
      'summary',
    ]
    
    return focusableElements.some(selector => element.matches(selector))
  }
  
  /**
   * Get all focusable elements within container
   */
  getFocusableElements(container: Element = document.body): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'object',
      'embed',
      'area[href]',
      'summary',
    ].join(', ')
    
    return Array.from(container.querySelectorAll(selector))
      .filter(el => this.isVisible(el))
      .sort((a, b) => this.getTabOrder(a) - this.getTabOrder(b)) as HTMLElement[]
  }
  
  /**
   * Check if element is visible
   */
  private isVisible(element: Element): boolean {
    if (element.hasAttribute('hidden')) return false
    
    const style = window.getComputedStyle(element)
    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      (element as HTMLElement).offsetParent === null
    )
  }
  
  /**
   * Get tab order for element
   */
  private getTabOrder(element: Element): number {
    const tabindex = element.getAttribute('tabindex')
    if (tabindex === null) return 0
    const value = parseInt(tabindex, 10)
    return isNaN(value) ? 0 : value
  }
  
  /**
   * Create focus trap
   */
  createTrap(container: Element, config: FocusTrapConfig = {}): FocusTrap {
    return new FocusTrap(container, config, this)
  }
  
  /**
   * Set active trap (only one can be active at a time)
   */
  setActiveTrap(trap: FocusTrap | null): void {
    if (this.activeTrap && this.activeTrap !== trap) {
      this.activeTrap.deactivate()
    }
    this.activeTrap = trap
  }
}

/**
 * Focus Trap Class
 */
export class FocusTrap {
  private container: Element
  private config: Required<FocusTrapConfig>
  private manager: FocusManager
  private isActive = false
  private previousActiveElement: HTMLElement | null = null
  private focusableElements: HTMLElement[] = []
  
  constructor(container: Element, config: FocusTrapConfig, manager: FocusManager) {
    this.container = container
    this.manager = manager
    this.config = {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
      allowOutsideClick: false,
      preventScroll: false,
      ...config,
    } as Required<FocusTrapConfig>
  }
  
  /**
   * Activate focus trap
   */
  activate(): void {
    if (this.isActive) return
    
    this.isActive = true
    this.manager.setActiveTrap(this)
    
    // Save current focus
    this.previousActiveElement = document.activeElement as HTMLElement
    
    // Update focusable elements
    this.updateFocusableElements()
    
    // Set initial focus
    this.setInitialFocus()
    
    // Add event listeners
    document.addEventListener('keydown', this.handleKeyDown)
    if (this.config.clickOutsideDeactivates) {
      document.addEventListener('click', this.handleClick)
    }
  }
  
  /**
   * Deactivate focus trap
   */
  deactivate(): void {
    if (!this.isActive) return
    
    this.isActive = false
    this.manager.setActiveTrap(null)
    
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('click', this.handleClick)
    
    // Restore focus
    if (this.config.returnFocusOnDeactivate && this.previousActiveElement) {
      try {
        this.previousActiveElement.focus({ preventScroll: this.config.preventScroll })
      } catch (error) {
        console.warn('Failed to restore focus on deactivate:', error)
      }
    }
  }
  
  /**
   * Update focusable elements list
   */
  private updateFocusableElements(): void {
    this.focusableElements = this.manager.getFocusableElements(this.container)
  }
  
  /**
   * Set initial focus
   */
  private setInitialFocus(): void {
    let elementToFocus: HTMLElement | null = null
    
    // Try initial focus option
    if (this.config.initialFocus) {
      elementToFocus = typeof this.config.initialFocus === 'function' 
        ? this.config.initialFocus()
        : this.config.initialFocus
    }
    
    // Fallback to first focusable element
    if (!elementToFocus && this.focusableElements.length > 0) {
      elementToFocus = this.focusableElements[0]
    }
    
    // Fallback to container itself
    if (!elementToFocus && this.container) {
      elementToFocus = this.container as HTMLElement
      if (!this.manager.isFocusable(elementToFocus)) {
        elementToFocus.setAttribute('tabindex', '-1')
      }
    }
    
    // Focus the element
    if (elementToFocus) {
      try {
        elementToFocus.focus({ preventScroll: this.config.preventScroll })
      } catch (error) {
        console.warn('Failed to set initial focus:', error)
      }
    }
  }
  
  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isActive) return
    
    // Handle escape key
    if (this.config.escapeDeactivates && event.key === 'Escape') {
      event.preventDefault()
      this.deactivate()
      return
    }
    
    // Handle tab key
    if (event.key === 'Tab') {
      this.handleTabKey(event)
    }
  }
  
  /**
   * Handle tab key navigation
   */
  private handleTabKey(event: KeyboardEvent): void {
    if (this.focusableElements.length === 0) {
      event.preventDefault()
      return
    }
    
    const currentIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement)
    
    if (event.shiftKey) {
      // Shift+Tab (backward)
      if (currentIndex <= 0) {
        event.preventDefault()
        this.focusableElements[this.focusableElements.length - 1].focus()
      }
    } else {
      // Tab (forward)
      if (currentIndex >= this.focusableElements.length - 1) {
        event.preventDefault()
        this.focusableElements[0].focus()
      }
    }
  }
  
  /**
   * Handle click events
   */
  private handleClick = (event: MouseEvent): void => {
    if (!this.isActive) return
    
    const target = event.target as Element
    
    if (!this.container.contains(target) && !this.config.allowOutsideClick) {
      if (this.config.clickOutsideDeactivates) {
        this.deactivate()
      } else {
        event.preventDefault()
        // Refocus first element if click outside
        if (this.focusableElements.length > 0) {
          this.focusableElements[0].focus()
        }
      }
    }
  }
}

/**
 * React hook for focus management
 */
export function useFocusManager() {
  const manager = FocusManager.getInstance()
  
  const saveFocus = useCallback(() => {
    return manager.saveFocus()
  }, [manager])
  
  const restoreFocus = useCallback((options?: FocusRestorationOptions) => {
    return manager.restoreFocus(options)
  }, [manager])
  
  const clearHistory = useCallback(() => {
    manager.clearHistory()
  }, [manager])
  
  return {
    saveFocus,
    restoreFocus,
    clearHistory,
    isFocusable: manager.isFocusable.bind(manager),
    getFocusableElements: manager.getFocusableElements.bind(manager),
  }
}

/**
 * React hook for focus trap
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean,
  config: FocusTrapConfig = {}
) {
  const trapRef = useRef<FocusTrap | null>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const manager = FocusManager.getInstance()
    trapRef.current = manager.createTrap(containerRef.current, config)
    
    return () => {
      if (trapRef.current) {
        trapRef.current.deactivate()
      }
    }
  }, [containerRef, config])
  
  useEffect(() => {
    if (!trapRef.current) return
    
    if (isActive) {
      trapRef.current.activate()
    } else {
      trapRef.current.deactivate()
    }
  }, [isActive])
  
  return trapRef.current
}

/**
 * React hook for auto-focus
 */
export function useAutoFocus(
  elementRef: React.RefObject<HTMLElement>,
  shouldFocus: boolean = true,
  options: { preventScroll?: boolean; delay?: number } = {}
) {
  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      const focus = () => {
        try {
          elementRef.current?.focus({ preventScroll: options.preventScroll })
        } catch (error) {
          console.warn('Failed to auto-focus element:', error)
        }
      }
      
      if (options.delay) {
        const timeout = setTimeout(focus, options.delay)
        return () => clearTimeout(timeout)
      } else {
        // Use requestAnimationFrame to ensure DOM is ready
        const frame = requestAnimationFrame(focus)
        return () => cancelAnimationFrame(frame)
      }
    }
  }, [shouldFocus, elementRef, options.preventScroll, options.delay])
}

/**
 * React hook for focus restoration
 */
export function useFocusRestore(
  shouldRestore: boolean = true,
  delay: number = 0
) {
  const previousElementRef = useRef<HTMLElement | null>(null)
  const { restoreFocus } = useFocusManager()
  
  useEffect(() => {
    // Save focus on mount
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && activeElement !== document.body) {
      previousElementRef.current = activeElement
    }
  }, [])
  
  useEffect(() => {
    return () => {
      // Restore focus on unmount
      if (shouldRestore && previousElementRef.current) {
        if (delay > 0) {
          setTimeout(() => {
            try {
              previousElementRef.current?.focus()
            } catch (error) {
              console.warn('Failed to restore focus:', error)
            }
          }, delay)
        } else {
          try {
            previousElementRef.current.focus()
          } catch (error) {
            console.warn('Failed to restore focus:', error)
          }
        }
      }
    }
  }, [shouldRestore, delay])
}

/**
 * React hook for focus within detection
 */
export function useFocusWithin(
  elementRef: React.RefObject<HTMLElement>,
  onFocusWithin?: (hasFocus: boolean) => void
) {
  const [hasFocusWithin, setHasFocusWithin] = useState(false)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const handleFocusIn = (event: FocusEvent) => {
      if (element.contains(event.target as Node)) {
        setHasFocusWithin(true)
        onFocusWithin?.(true)
      }
    }
    
    const handleFocusOut = (event: FocusEvent) => {
      if (element.contains(event.target as Node) && 
          (!event.relatedTarget || !element.contains(event.relatedTarget as Node))) {
        setHasFocusWithin(false)
        onFocusWithin?.(false)
      }
    }
    
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [elementRef, onFocusWithin])
  
  return hasFocusWithin
}

/**
 * React hook for focus visible detection
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  
  useEffect(() => {
    let hadKeyboardEvent = true
    
    const handlePointerDown = () => {
      hadKeyboardEvent = false
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Escape') {
        hadKeyboardEvent = true
      }
    }
    
    const handleFocus = (event: FocusEvent) => {
      if (hadKeyboardEvent) {
        setIsFocusVisible(true)
      }
    }
    
    const handleBlur = () => {
      setIsFocusVisible(false)
    }
    
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('focusin', handleFocus, true)
    document.addEventListener('focusout', handleBlur, true)
    
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('focusin', handleFocus, true)
      document.removeEventListener('focusout', handleBlur, true)
    }
  }, [])
  
  return isFocusVisible
}

// Global focus manager instance
export const focusManager = FocusManager.getInstance()

export default FocusManager