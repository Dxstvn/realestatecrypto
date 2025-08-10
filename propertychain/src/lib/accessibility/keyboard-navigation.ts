/**
 * Keyboard Navigation System - PropertyChain
 * 
 * Comprehensive keyboard navigation with focus management, shortcuts, and custom handlers
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

import { useEffect, useCallback, useRef, useState } from 'react'

/**
 * Keyboard navigation configuration
 */
interface NavigationConfig {
  enableArrowKeys?: boolean
  enableTabTrapping?: boolean
  enableEscapeKey?: boolean
  enableEnterKey?: boolean
  enableSpaceKey?: boolean
  wrapAround?: boolean
  orientation?: 'horizontal' | 'vertical' | 'both'
}

/**
 * Key codes for common navigation keys
 */
export const KEYS = {
  TAB: 'Tab',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const

/**
 * Focusable element selectors
 */
export const FOCUSABLE_SELECTORS = [
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
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
].join(', ')

/**
 * Keyboard Navigation Manager
 */
export class KeyboardNavigationManager {
  private shortcuts: Map<string, () => void> = new Map()
  private isListening = false
  
  /**
   * Register global keyboard shortcut
   */
  registerShortcut(
    keys: string | string[],
    callback: () => void,
    options?: { preventDefault?: boolean; stopPropagation?: boolean }
  ): () => void {
    const keySequence = Array.isArray(keys) ? keys.join('+') : keys
    
    const handler = (event: KeyboardEvent) => {
      if (this.matchesShortcut(event, keySequence)) {
        if (options?.preventDefault !== false) {
          event.preventDefault()
        }
        if (options?.stopPropagation) {
          event.stopPropagation()
        }
        callback()
      }
    }
    
    document.addEventListener('keydown', handler)
    this.shortcuts.set(keySequence, callback)
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handler)
      this.shortcuts.delete(keySequence)
    }
  }
  
  /**
   * Check if keyboard event matches shortcut
   */
  private matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
    const parts = shortcut.split('+').map(part => part.trim().toLowerCase())
    
    const modifiers = {
      ctrl: event.ctrlKey,
      cmd: event.metaKey,
      alt: event.altKey,
      shift: event.shiftKey,
    }
    
    const key = event.key.toLowerCase()
    
    return parts.every(part => {
      if (part in modifiers) {
        return modifiers[part as keyof typeof modifiers]
      }
      return part === key
    })
  }
  
  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: Element = document.body): Element[] {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS))
      .filter(el => this.isVisible(el) && !this.isDisabled(el))
  }
  
  /**
   * Check if element is visible
   */
  private isVisible(element: Element): boolean {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0'
  }
  
  /**
   * Check if element is disabled
   */
  private isDisabled(element: Element): boolean {
    return element.hasAttribute('disabled') || 
           element.getAttribute('aria-disabled') === 'true'
  }
  
  /**
   * Focus first focusable element in container
   */
  focusFirst(container: Element = document.body): boolean {
    const focusable = this.getFocusableElements(container)
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus()
      return true
    }
    return false
  }
  
  /**
   * Focus last focusable element in container
   */
  focusLast(container: Element = document.body): boolean {
    const focusable = this.getFocusableElements(container)
    if (focusable.length > 0) {
      (focusable[focusable.length - 1] as HTMLElement).focus()
      return true
    }
    return false
  }
}

/**
 * React hook for keyboard navigation
 */
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  config: NavigationConfig = {}
) {
  const {
    enableArrowKeys = true,
    enableTabTrapping = false,
    enableEscapeKey = true,
    enableEnterKey = true,
    enableSpaceKey = false,
    wrapAround = true,
    orientation = 'both',
  } = config
  
  const [currentIndex, setCurrentIndex] = useState(-1)
  const focusableElementsRef = useRef<HTMLElement[]>([])
  
  const updateFocusableElements = useCallback(() => {
    if (containerRef.current) {
      const manager = new KeyboardNavigationManager()
      focusableElementsRef.current = manager
        .getFocusableElements(containerRef.current) as HTMLElement[]
    }
  }, [containerRef])
  
  const focusElement = useCallback((index: number) => {
    const elements = focusableElementsRef.current
    if (elements.length === 0) return
    
    let targetIndex = index
    
    if (wrapAround) {
      if (targetIndex < 0) {
        targetIndex = elements.length - 1
      } else if (targetIndex >= elements.length) {
        targetIndex = 0
      }
    } else {
      targetIndex = Math.max(0, Math.min(targetIndex, elements.length - 1))
    }
    
    elements[targetIndex]?.focus()
    setCurrentIndex(targetIndex)
  }, [wrapAround])
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return
    
    const elements = focusableElementsRef.current
    if (elements.length === 0) return
    
    let handled = false
    
    // Arrow key navigation
    if (enableArrowKeys) {
      switch (event.key) {
        case KEYS.ARROW_UP:
          if (orientation === 'vertical' || orientation === 'both') {
            focusElement(currentIndex - 1)
            handled = true
          }
          break
        case KEYS.ARROW_DOWN:
          if (orientation === 'vertical' || orientation === 'both') {
            focusElement(currentIndex + 1)
            handled = true
          }
          break
        case KEYS.ARROW_LEFT:
          if (orientation === 'horizontal' || orientation === 'both') {
            focusElement(currentIndex - 1)
            handled = true
          }
          break
        case KEYS.ARROW_RIGHT:
          if (orientation === 'horizontal' || orientation === 'both') {
            focusElement(currentIndex + 1)
            handled = true
          }
          break
        case KEYS.HOME:
          focusElement(0)
          handled = true
          break
        case KEYS.END:
          focusElement(elements.length - 1)
          handled = true
          break
      }
    }
    
    // Tab trapping
    if (enableTabTrapping && event.key === KEYS.TAB) {
      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]
      
      if (event.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus()
        handled = true
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus()
        handled = true
      }
    }
    
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [
    containerRef,
    enableArrowKeys,
    enableTabTrapping,
    orientation,
    currentIndex,
    focusElement
  ])
  
  useEffect(() => {
    updateFocusableElements()
    
    // Update on DOM changes
    const observer = new MutationObserver(updateFocusableElements)
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex', 'aria-disabled'],
      })
    }
    
    return () => observer.disconnect()
  }, [updateFocusableElements])
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  // Update current index when focus changes
  useEffect(() => {
    const handleFocusChange = () => {
      const activeElement = document.activeElement as HTMLElement
      const index = focusableElementsRef.current.indexOf(activeElement)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
    
    document.addEventListener('focusin', handleFocusChange)
    return () => document.removeEventListener('focusin', handleFocusChange)
  }, [])
  
  return {
    currentIndex,
    focusElement,
    focusFirst: () => focusElement(0),
    focusLast: () => focusElement(focusableElementsRef.current.length - 1),
    focusNext: () => focusElement(currentIndex + 1),
    focusPrevious: () => focusElement(currentIndex - 1),
  }
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: Record<string, () => void>,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    const manager = new KeyboardNavigationManager()
    const cleanupFunctions: (() => void)[] = []
    
    Object.entries(shortcuts).forEach(([keys, callback]) => {
      const cleanup = manager.registerShortcut(keys, callback)
      cleanupFunctions.push(cleanup)
    })
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Hook for roving tab index
 */
export function useRovingTabIndex(
  containerRef: React.RefObject<HTMLElement>,
  defaultIndex = 0
) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const elements = Array.from(containerRef.current.children) as HTMLElement[]
    
    elements.forEach((element, index) => {
      element.setAttribute('tabindex', index === activeIndex ? '0' : '-1')
      
      if (index === activeIndex) {
        element.addEventListener('keydown', handleKeyDown)
      }
    })
    
    function handleKeyDown(event: KeyboardEvent) {
      let newIndex = activeIndex
      
      switch (event.key) {
        case KEYS.ARROW_RIGHT:
        case KEYS.ARROW_DOWN:
          newIndex = (activeIndex + 1) % elements.length
          break
        case KEYS.ARROW_LEFT:
        case KEYS.ARROW_UP:
          newIndex = activeIndex === 0 ? elements.length - 1 : activeIndex - 1
          break
        case KEYS.HOME:
          newIndex = 0
          break
        case KEYS.END:
          newIndex = elements.length - 1
          break
        default:
          return
      }
      
      event.preventDefault()
      setActiveIndex(newIndex)
      elements[newIndex]?.focus()
    }
    
    return () => {
      elements.forEach(element => {
        element.removeEventListener('keydown', handleKeyDown)
      })
    }
  }, [containerRef, activeIndex])
  
  return { activeIndex, setActiveIndex }
}

/**
 * Hook for menu keyboard navigation
 */
export function useMenuNavigation(
  isOpen: boolean,
  onClose?: () => void,
  onSelect?: (index: number) => void
) {
  const menuRef = useRef<HTMLElement>(null)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  
  const { focusElement } = useKeyboardNavigation(menuRef, {
    enableArrowKeys: true,
    orientation: 'vertical',
    wrapAround: true,
  })
  
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1)
      return
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) return
      
      switch (event.key) {
        case KEYS.ESCAPE:
          onClose?.()
          event.preventDefault()
          break
        case KEYS.ENTER:
        case KEYS.SPACE:
          if (highlightedIndex >= 0) {
            onSelect?.(highlightedIndex)
          }
          event.preventDefault()
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, onClose, onSelect])
  
  // Focus first item when menu opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      requestAnimationFrame(() => {
        const firstItem = menuRef.current?.querySelector('[role="menuitem"]') as HTMLElement
        if (firstItem) {
          firstItem.focus()
          setHighlightedIndex(0)
        }
      })
    }
  }, [isOpen])
  
  return {
    menuRef,
    highlightedIndex,
    setHighlightedIndex,
  }
}

/**
 * Hook for dialog keyboard navigation
 */
export function useDialogNavigation(
  isOpen: boolean,
  onClose?: () => void,
  restoreFocus = true
) {
  const dialogRef = useRef<HTMLElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  
  useKeyboardNavigation(dialogRef, {
    enableTabTrapping: true,
    enableEscapeKey: true,
  })
  
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement
      
      // Focus dialog or first focusable element
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const manager = new KeyboardNavigationManager()
          if (!manager.focusFirst(dialogRef.current)) {
            dialogRef.current.focus()
          }
        }
      })
      
      // Handle escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === KEYS.ESCAPE && dialogRef.current?.contains(event.target as Node)) {
          onClose?.()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    } else if (restoreFocus && previousActiveElementRef.current) {
      // Restore focus when dialog closes
      previousActiveElementRef.current.focus()
      previousActiveElementRef.current = null
    }
  }, [isOpen, onClose, restoreFocus])
  
  return { dialogRef }
}

/**
 * Hook for table keyboard navigation
 */
export function useTableNavigation(
  tableRef: React.RefObject<HTMLTableElement>
) {
  const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0])
  
  useEffect(() => {
    if (!tableRef.current) return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!tableRef.current?.contains(event.target as Node)) return
      
      const rows = Array.from(tableRef.current.querySelectorAll('tr'))
      const [currentRow, currentCol] = currentCell
      
      let newRow = currentRow
      let newCol = currentCol
      
      switch (event.key) {
        case KEYS.ARROW_UP:
          newRow = Math.max(0, currentRow - 1)
          break
        case KEYS.ARROW_DOWN:
          newRow = Math.min(rows.length - 1, currentRow + 1)
          break
        case KEYS.ARROW_LEFT:
          newCol = Math.max(0, currentCol - 1)
          break
        case KEYS.ARROW_RIGHT:
          const currentRowElement = rows[currentRow]
          const cells = Array.from(currentRowElement?.cells || [])
          newCol = Math.min(cells.length - 1, currentCol + 1)
          break
        case KEYS.HOME:
          if (event.ctrlKey) {
            newRow = 0
            newCol = 0
          } else {
            newCol = 0
          }
          break
        case KEYS.END:
          if (event.ctrlKey) {
            newRow = rows.length - 1
            const lastRowCells = Array.from(rows[rows.length - 1]?.cells || [])
            newCol = lastRowCells.length - 1
          } else {
            const currentRowElement = rows[currentRow]
            const cells = Array.from(currentRowElement?.cells || [])
            newCol = cells.length - 1
          }
          break
        default:
          return
      }
      
      // Focus new cell
      const targetRow = rows[newRow]
      const targetCell = targetRow?.cells[newCol] as HTMLTableCellElement
      
      if (targetCell) {
        targetCell.focus()
        setCurrentCell([newRow, newCol])
        event.preventDefault()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [tableRef, currentCell])
  
  return { currentCell, setCurrentCell }
}

export const keyboardNavigation = new KeyboardNavigationManager()

export default KeyboardNavigationManager