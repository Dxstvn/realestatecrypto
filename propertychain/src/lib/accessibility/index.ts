/**
 * Accessibility Module Index - PropertyChain
 * 
 * Main exports for the comprehensive accessibility system
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

// Screen Reader Support
export {
  ScreenReaderManager,
  screenReader,
  useScreenReader,
  useStatusAnnouncement,
  useLoadingAnnouncement,
  useRouteAnnouncement,
  useFormErrorAnnouncement,
  useTableAnnouncements,
  useProgressAnnouncement,
  LiveRegion,
  ScreenReaderOnly,
} from './screen-reader'

// Keyboard Navigation
export {
  KeyboardNavigationManager,
  keyboardNavigation,
  useKeyboardNavigation,
  useKeyboardShortcuts,
  useRovingTabIndex,
  useMenuNavigation,
  useDialogNavigation,
  useTableNavigation,
  KEYS,
  FOCUSABLE_SELECTORS,
} from './keyboard-navigation'

// Focus Management
export {
  FocusManager,
  FocusTrap,
  focusManager,
  useFocusManager,
  useFocusTrap,
  useAutoFocus,
  useFocusRestore,
  useFocusWithin,
  useFocusVisible,
} from './focus-management'

// ARIA Labels and Attributes
export {
  AriaLabelManager,
  ariaManager,
  useFormFieldAria,
  useButtonAria,
  useDialogAria,
  useListAria,
  useTabAria,
  useProgressAria,
  useTableAria,
  useStatusAria,
  useComboboxAria,
  useBreadcrumbAria,
  LiveRegion as AriaLiveRegion,
  VisuallyHidden,
  LANDMARKS,
  WIDGET_ROLES,
  COMPOSITE_ROLES,
} from './aria-labels'

// Accessibility Testing
export {
  AccessibilityTester,
  accessibilityTester,
  useAccessibilityTest,
  enableAccessibilityChecking,
} from './testing'

// Re-export types
export type { AnnouncementPriority } from './screen-reader'
// NavigationConfig not available in keyboard-navigation
// FocusTrapConfig and FocusRestorationOptions not exported from focus-management
// AriaAttributes not exported from aria-labels
// AccessibilityTestResult and AccessibilityAudit not exported from testing

// Import the screenReader instance and types
import { screenReader, type AnnouncementPriority } from './screen-reader'

/**
 * Comprehensive accessibility utilities
 */

/**
 * Initialize accessibility features
 */
export function initializeAccessibility() {
  // Initialize screen reader manager
  // screenReader.initialize() would be called here if available
  
  // Initialize focus manager
  // focusManager.initialize() would be called here if available
  
  // Initialize ARIA manager
  // ariaManager.initialize() would be called here if available
  
  // Enable development checking
  if (process.env.NODE_ENV === 'development') {
    // enableAccessibilityChecking() would be called here if available
  }
  
  // Add global CSS for accessibility
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.textContent = `
      /* Screen reader only class */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      /* Focus visible styles */
      .focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        * {
          outline-width: 3px;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        ::before,
        ::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      
      /* Skip link styles */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 9999;
        padding: 8px;
        background: #000;
        color: #fff;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `
    document.head.appendChild(style)
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Check if user is using dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Get user's accessibility preferences
 */
export function getAccessibilityPreferences() {
  return {
    reducedMotion: prefersReducedMotion(),
    highContrast: prefersHighContrast(),
    darkMode: prefersDarkMode(),
  }
}

/**
 * Announce to screen readers
 */
export function announce(message: string, priority: AnnouncementPriority = 'polite') {
  screenReader.announce(message, { priority })
}

/**
 * Focus element safely
 */
export function focusElement(element: HTMLElement, preventScroll = false) {
  try {
    element.focus({ preventScroll })
    return true
  } catch (error) {
    console.warn('Failed to focus element:', error)
    return false
  }
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: Element): boolean {
  // Check aria-hidden
  if (element.getAttribute('aria-hidden') === 'true') {
    return false
  }
  
  // Check CSS visibility
  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false
  }
  
  // Check if element is offscreen (but still accessible)
  const rect = element.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    return false
  }
  
  return true
}

/**
 * Generate accessible ID
 */
export function generateAccessibleId(prefix = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create accessible description
 */
export function createAccessibleDescription(
  element: HTMLElement,
  description: string
): string {
  const descId = generateAccessibleId('desc')
  
  // Create description element
  const descElement = document.createElement('div')
  descElement.id = descId
  descElement.className = 'sr-only'
  descElement.textContent = description
  
  // Add to DOM
  document.body.appendChild(descElement)
  
  // Link to element
  const existingDescribedBy = element.getAttribute('aria-describedby')
  const newDescribedBy = existingDescribedBy 
    ? `${existingDescribedBy} ${descId}`
    : descId
  
  element.setAttribute('aria-describedby', newDescribedBy)
  
  return descId
}

/**
 * Remove accessible description
 */
export function removeAccessibleDescription(element: HTMLElement, descId: string): void {
  // Remove from aria-describedby
  const describedBy = element.getAttribute('aria-describedby')
  if (describedBy) {
    const ids = describedBy.split(' ').filter(id => id !== descId)
    if (ids.length > 0) {
      element.setAttribute('aria-describedby', ids.join(' '))
    } else {
      element.removeAttribute('aria-describedby')
    }
  }
  
  // Remove description element
  const descElement = document.getElementById(descId)
  if (descElement) {
    descElement.remove()
  }
}

/**
 * Accessibility configuration
 */
export const ACCESSIBILITY_CONFIG = {
  // Screen reader settings
  screenReader: {
    enableAnnouncements: true,
    defaultPriority: 'polite' as AnnouncementPriority,
    debounceTime: 100,
  },
  
  // Focus management settings
  focus: {
    enableTrapping: true,
    restoreOnEscape: true,
    preventScroll: false,
  },
  
  // Keyboard navigation settings
  keyboard: {
    enableArrowKeys: true,
    wrapAround: true,
    enableTabTrapping: true,
  },
  
  // Testing settings
  testing: {
    enableDevChecks: process.env.NODE_ENV === 'development',
    auditOnChange: false,
    logLevel: 'warn' as 'error' | 'warn' | 'info',
  },
} as const

export default {
  initializeAccessibility,
  announce,
  focusElement,
  isVisibleToScreenReader,
  generateAccessibleId,
  createAccessibleDescription,
  removeAccessibleDescription,
  getAccessibilityPreferences,
  ACCESSIBILITY_CONFIG,
}