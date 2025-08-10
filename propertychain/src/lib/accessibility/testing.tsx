/**
 * Accessibility Testing Utilities - PropertyChain
 * 
 * Comprehensive accessibility testing and validation utilities
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

import React, { useState, useCallback } from 'react'

/**
 * Accessibility test result
 */
interface AccessibilityTestResult {
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
  element?: HTMLElement
  rule: string
  suggestion?: string
}

/**
 * Accessibility audit summary
 */
interface AccessibilityAudit {
  passed: boolean
  score: number // 0-100
  errors: AccessibilityTestResult[]
  warnings: AccessibilityTestResult[]
  info: AccessibilityTestResult[]
  totalTests: number
  passedTests: number
}

/**
 * Accessibility Testing Manager
 */
export class AccessibilityTester {
  private static instance: AccessibilityTester
  
  private constructor() {}
  
  static getInstance(): AccessibilityTester {
    if (!AccessibilityTester.instance) {
      AccessibilityTester.instance = new AccessibilityTester()
    }
    return AccessibilityTester.instance
  }
  
  /**
   * Run comprehensive accessibility audit
   */
  audit(container: HTMLElement = document.body): AccessibilityAudit {
    const results: AccessibilityTestResult[] = [
      ...this.testHeadings(container),
      ...this.testImages(container),
      ...this.testLinks(container),
      ...this.testButtons(container),
      ...this.testForms(container),
      ...this.testTables(container),
      ...this.testLandmarks(container),
      ...this.testColorContrast(container),
      ...this.testFocusability(container),
      ...this.testAriaLabels(container),
      ...this.testKeyboardNavigation(container),
      ...this.testLiveRegions(container),
    ]
    
    const errors = results.filter(r => r.severity === 'error' && !r.passed)
    const warnings = results.filter(r => r.severity === 'warning' && !r.passed)
    const info = results.filter(r => r.severity === 'info' && !r.passed)
    const passedTests = results.filter(r => r.passed).length
    
    // Calculate score based on errors and warnings
    let score = 100
    score -= errors.length * 10 // Errors cost 10 points each
    score -= warnings.length * 5 // Warnings cost 5 points each
    score = Math.max(0, score)
    
    return {
      passed: errors.length === 0,
      score,
      errors,
      warnings,
      info,
      totalTests: results.length,
      passedTests,
    }
  }
  
  /**
   * Test heading structure
   */
  private testHeadings(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    // Check for h1 presence
    const h1Elements = container.querySelectorAll('h1')
    if (h1Elements.length === 0) {
      results.push({
        passed: false,
        message: 'Page should have at least one h1 element',
        severity: 'error',
        rule: 'heading-h1',
        suggestion: 'Add an h1 element as the main page heading',
      })
    } else if (h1Elements.length > 1) {
      results.push({
        passed: false,
        message: 'Page should have only one h1 element',
        severity: 'warning',
        rule: 'heading-h1-single',
        suggestion: 'Use only one h1 per page and h2-h6 for subsections',
      })
    } else {
      results.push({
        passed: true,
        message: 'Page has exactly one h1 element',
        severity: 'info',
        rule: 'heading-h1',
      })
    }
    
    // Check heading hierarchy
    let previousLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1), 10)
      
      if (index > 0 && level > previousLevel + 1) {
        results.push({
          passed: false,
          message: `Heading level skipped from h${previousLevel} to h${level}`,
          severity: 'warning',
          rule: 'heading-hierarchy',
          element: heading as HTMLElement,
          suggestion: 'Avoid skipping heading levels - use sequential hierarchy',
        })
      }
      
      // Check for empty headings
      if (!heading.textContent?.trim()) {
        results.push({
          passed: false,
          message: 'Heading element is empty',
          severity: 'error',
          rule: 'heading-empty',
          element: heading as HTMLElement,
          suggestion: 'Add descriptive text to heading elements',
        })
      }
      
      previousLevel = level
    })
    
    return results
  }
  
  /**
   * Test images for alt text
   */
  private testImages(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const images = container.querySelectorAll('img')
    
    images.forEach(img => {
      const alt = img.getAttribute('alt')
      const role = img.getAttribute('role')
      
      if (role === 'presentation' || role === 'none') {
        // Decorative images should have empty alt
        if (alt !== '') {
          results.push({
            passed: false,
            message: 'Decorative image should have empty alt attribute',
            severity: 'warning',
            rule: 'img-decorative',
            element: img,
            suggestion: 'Use alt="" for decorative images',
          })
        }
      } else if (alt === null) {
        results.push({
          passed: false,
          message: 'Image missing alt attribute',
          severity: 'error',
          rule: 'img-alt',
          element: img,
          suggestion: 'Add alt attribute with descriptive text',
        })
      } else if (alt === '' && role !== 'presentation') {
        results.push({
          passed: false,
          message: 'Content image has empty alt attribute',
          severity: 'warning',
          rule: 'img-alt-empty',
          element: img,
          suggestion: 'Add descriptive alt text or mark as decorative',
        })
      } else if (alt && alt.length > 100) {
        results.push({
          passed: false,
          message: 'Alt text is too long (over 100 characters)',
          severity: 'warning',
          rule: 'img-alt-length',
          element: img,
          suggestion: 'Keep alt text concise and descriptive',
        })
      } else if (alt) {
        results.push({
          passed: true,
          message: 'Image has appropriate alt text',
          severity: 'info',
          rule: 'img-alt',
          element: img,
        })
      }
    })
    
    return results
  }
  
  /**
   * Test links for accessibility
   */
  private testLinks(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const links = container.querySelectorAll('a')
    
    links.forEach(link => {
      const href = link.getAttribute('href')
      const text = link.textContent?.trim()
      const ariaLabel = link.getAttribute('aria-label')
      
      // Check for href
      if (!href) {
        results.push({
          passed: false,
          message: 'Link missing href attribute',
          severity: 'error',
          rule: 'link-href',
          element: link,
          suggestion: 'Add href attribute or use button element instead',
        })
      }
      
      // Check for accessible name
      if (!text && !ariaLabel) {
        results.push({
          passed: false,
          message: 'Link has no accessible name',
          severity: 'error',
          rule: 'link-name',
          element: link,
          suggestion: 'Add text content or aria-label to describe the link',
        })
      }
      
      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'here', 'more', 'link']
      if (text && genericTexts.includes(text.toLowerCase())) {
        results.push({
          passed: false,
          message: 'Link has generic text',
          severity: 'warning',
          rule: 'link-generic',
          element: link,
          suggestion: 'Use descriptive link text that makes sense out of context',
        })
      }
      
      // Check external links
      if (href && (href.startsWith('http') || href.startsWith('//'))) {
        const hasExternalIndicator = link.querySelector('[aria-label*="external"]') || 
                                   ariaLabel?.includes('external') ||
                                   text?.includes('external')
        
        if (!hasExternalIndicator) {
          results.push({
            passed: false,
            message: 'External link should indicate it opens in new context',
            severity: 'info',
            rule: 'link-external',
            element: link,
            suggestion: 'Add visual or text indicator for external links',
          })
        }
      }
    })
    
    return results
  }
  
  /**
   * Test buttons for accessibility
   */
  private testButtons(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const buttons = container.querySelectorAll('button, [role="button"]')
    
    buttons.forEach(button => {
      const text = button.textContent?.trim()
      const ariaLabel = button.getAttribute('aria-label')
      const ariaExpanded = button.getAttribute('aria-expanded')
      const ariaPressed = button.getAttribute('aria-pressed')
      
      // Check for accessible name
      if (!text && !ariaLabel) {
        results.push({
          passed: false,
          message: 'Button has no accessible name',
          severity: 'error',
          rule: 'button-name',
          element: button as HTMLElement,
          suggestion: 'Add text content or aria-label to describe the button action',
        })
      }
      
      // Check for toggle buttons
      if (ariaPressed !== null && ariaPressed !== 'true' && ariaPressed !== 'false') {
        results.push({
          passed: false,
          message: 'Toggle button has invalid aria-pressed value',
          severity: 'error',
          rule: 'button-toggle',
          element: button as HTMLElement,
          suggestion: 'Use aria-pressed="true" or aria-pressed="false" for toggle buttons',
        })
      }
      
      // Check for expandable buttons
      if (ariaExpanded !== null && ariaExpanded !== 'true' && ariaExpanded !== 'false') {
        results.push({
          passed: false,
          message: 'Expandable button has invalid aria-expanded value',
          severity: 'error',
          rule: 'button-expandable',
          element: button as HTMLElement,
          suggestion: 'Use aria-expanded="true" or aria-expanded="false" for expandable buttons',
        })
      }
      
      // Check if button is keyboard accessible
      if (button.tagName.toLowerCase() !== 'button' && !button.hasAttribute('tabindex')) {
        results.push({
          passed: false,
          message: 'Custom button is not keyboard accessible',
          severity: 'error',
          rule: 'button-keyboard',
          element: button as HTMLElement,
          suggestion: 'Add tabindex="0" or use native button element',
        })
      }
    })
    
    return results
  }
  
  /**
   * Test forms for accessibility
   */
  private testForms(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const formControls = container.querySelectorAll('input, select, textarea')
    
    formControls.forEach(control => {
      const id = control.id
      const label = container.querySelector(`label[for="${id}"]`)
      const ariaLabel = control.getAttribute('aria-label')
      const ariaLabelledBy = control.getAttribute('aria-labelledby')
      const required = control.hasAttribute('required') || control.getAttribute('aria-required') === 'true'
      const type = control.getAttribute('type')
      
      // Check for labels
      if (!label && !ariaLabel && !ariaLabelledBy) {
        results.push({
          passed: false,
          message: 'Form control has no associated label',
          severity: 'error',
          rule: 'form-label',
          element: control as HTMLElement,
          suggestion: 'Add a label element or aria-label/aria-labelledby',
        })
      }
      
      // Check required fields
      if (required) {
        const hasRequiredIndicator = label?.textContent?.includes('*') || 
                                    ariaLabel?.includes('required') ||
                                    control.getAttribute('aria-describedby')
        
        if (!hasRequiredIndicator) {
          results.push({
            passed: false,
            message: 'Required field should have clear indication',
            severity: 'warning',
            rule: 'form-required',
            element: control as HTMLElement,
            suggestion: 'Add visual and text indication for required fields',
          })
        }
      }
      
      // Check input types
      if (control.tagName.toLowerCase() === 'input') {
        const emailPattern = /@/
        const phonePattern = /phone|tel/i
        const namePattern = /name/i
        
        if (type === 'text' && id) {
          if (emailPattern.test((control as HTMLInputElement).value || '')) {
            results.push({
              passed: false,
              message: 'Email input should use type="email"',
              severity: 'warning',
              rule: 'input-type-email',
              element: control as HTMLElement,
            })
          }
          
          if (phonePattern.test(id)) {
            results.push({
              passed: false,
              message: 'Phone input should use type="tel"',
              severity: 'warning',
              rule: 'input-type-tel',
              element: control as HTMLElement,
            })
          }
        }
      }
    })
    
    return results
  }
  
  /**
   * Test tables for accessibility
   */
  private testTables(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const tables = container.querySelectorAll('table')
    
    tables.forEach(table => {
      const caption = table.querySelector('caption')
      const thead = table.querySelector('thead')
      const headers = table.querySelectorAll('th')
      
      // Check for caption
      if (!caption) {
        results.push({
          passed: false,
          message: 'Table should have a caption',
          severity: 'warning',
          rule: 'table-caption',
          element: table,
          suggestion: 'Add a caption element to describe the table content',
        })
      }
      
      // Check for headers
      if (headers.length === 0) {
        results.push({
          passed: false,
          message: 'Table should have header cells',
          severity: 'error',
          rule: 'table-headers',
          element: table,
          suggestion: 'Use th elements for table headers',
        })
      }
      
      // Check header scope
      headers.forEach(header => {
        const scope = header.getAttribute('scope')
        if (!scope && headers.length > 1) {
          results.push({
            passed: false,
            message: 'Table header should have scope attribute',
            severity: 'warning',
            rule: 'table-scope',
            element: header as HTMLElement,
            suggestion: 'Add scope="col" or scope="row" to header cells',
          })
        }
      })
      
      // Check for complex table structure
      const cells = table.querySelectorAll('td')
      const hasComplexStructure = Array.from(cells).some(cell => 
        cell.hasAttribute('colspan') || cell.hasAttribute('rowspan')
      )
      
      if (hasComplexStructure) {
        const hasHeadersAttribute = Array.from(cells).some(cell => 
          cell.hasAttribute('headers')
        )
        
        if (!hasHeadersAttribute) {
          results.push({
            passed: false,
            message: 'Complex table should use headers attribute',
            severity: 'warning',
            rule: 'table-complex',
            element: table,
            suggestion: 'Use headers attribute on cells to reference header IDs',
          })
        }
      }
    })
    
    return results
  }
  
  /**
   * Test landmarks and document structure
   */
  private testLandmarks(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    
    // Check for main landmark
    const main = container.querySelector('main, [role="main"]')
    if (!main) {
      results.push({
        passed: false,
        message: 'Page should have a main landmark',
        severity: 'error',
        rule: 'landmark-main',
        suggestion: 'Add a main element or role="main" to identify main content',
      })
    }
    
    // Check for navigation landmarks
    const navs = container.querySelectorAll('nav, [role="navigation"]')
    navs.forEach(nav => {
      const ariaLabel = nav.getAttribute('aria-label')
      const ariaLabelledBy = nav.getAttribute('aria-labelledby')
      
      if (navs.length > 1 && !ariaLabel && !ariaLabelledBy) {
        results.push({
          passed: false,
          message: 'Multiple navigation landmarks should be distinguished',
          severity: 'warning',
          rule: 'landmark-navigation',
          element: nav as HTMLElement,
          suggestion: 'Add aria-label to distinguish between navigation areas',
        })
      }
    })
    
    // Check for skip links
    const skipLinks = container.querySelectorAll('a[href^="#"], a[href^="#main"]')
    const hasSkipToMain = Array.from(skipLinks).some(link => 
      link.textContent?.toLowerCase().includes('skip') ||
      link.getAttribute('aria-label')?.toLowerCase().includes('skip')
    )
    
    if (!hasSkipToMain) {
      results.push({
        passed: false,
        message: 'Page should have skip to main content link',
        severity: 'warning',
        rule: 'skip-link',
        suggestion: 'Add skip to main content link as first focusable element',
      })
    }
    
    return results
  }
  
  /**
   * Test color contrast (simplified check)
   */
  private testColorContrast(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label')
    
    textElements.forEach(element => {
      const style = window.getComputedStyle(element)
      const color = style.color
      const backgroundColor = style.backgroundColor
      
      // This is a simplified check - in a real implementation you'd use a proper contrast calculator
      if (color && backgroundColor && color !== backgroundColor) {
        const isLightText = color.includes('255') || color.includes('white')
        const isLightBackground = backgroundColor.includes('255') || backgroundColor.includes('white')
        
        if (isLightText === isLightBackground) {
          results.push({
            passed: false,
            message: 'Potential color contrast issue detected',
            severity: 'warning',
            rule: 'color-contrast',
            element: element as HTMLElement,
            suggestion: 'Ensure text has sufficient contrast ratio (4.5:1 for normal text)',
          })
        }
      }
    })
    
    return results
  }
  
  /**
   * Test focusability and tab order
   */
  private testFocusability(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const focusableElements = container.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    focusableElements.forEach(element => {
      const tabindex = element.getAttribute('tabindex')
      
      // Check for positive tabindex
      if (tabindex && parseInt(tabindex, 10) > 0) {
        results.push({
          passed: false,
          message: 'Avoid positive tabindex values',
          severity: 'warning',
          rule: 'tabindex-positive',
          element: element as HTMLElement,
          suggestion: 'Use tabindex="0" or arrange elements in logical order',
        })
      }
      
      // Check if element is visible when focused
      try {
        (element as HTMLElement).focus()
        const style = window.getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') {
          results.push({
            passed: false,
            message: 'Focusable element is not visible',
            severity: 'error',
            rule: 'focus-visible',
            element: element as HTMLElement,
            suggestion: 'Ensure focusable elements are visible when focused',
          })
        }
      } catch (error) {
        // Element might not be focusable
      }
    })
    
    return results
  }
  
  /**
   * Test ARIA labels and attributes
   */
  private testAriaLabels(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const ariaElements = container.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]')
    
    ariaElements.forEach(element => {
      const ariaLabelledBy = element.getAttribute('aria-labelledby')
      const ariaDescribedBy = element.getAttribute('aria-describedby')
      
      // Check if referenced IDs exist
      if (ariaLabelledBy) {
        const ids = ariaLabelledBy.split(' ')
        ids.forEach(id => {
          if (!container.querySelector(`#${id}`)) {
            results.push({
              passed: false,
              message: `Referenced ID "${id}" not found`,
              severity: 'error',
              rule: 'aria-labelledby',
              element: element as HTMLElement,
              suggestion: 'Ensure aria-labelledby references existing element IDs',
            })
          }
        })
      }
      
      if (ariaDescribedBy) {
        const ids = ariaDescribedBy.split(' ')
        ids.forEach(id => {
          if (!container.querySelector(`#${id}`)) {
            results.push({
              passed: false,
              message: `Referenced ID "${id}" not found`,
              severity: 'error',
              rule: 'aria-describedby',
              element: element as HTMLElement,
              suggestion: 'Ensure aria-describedby references existing element IDs',
            })
          }
        })
      }
    })
    
    return results
  }
  
  /**
   * Test keyboard navigation
   */
  private testKeyboardNavigation(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const interactiveElements = container.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
    )
    
    // Check if all interactive elements are keyboard accessible
    interactiveElements.forEach(element => {
      const tagName = element.tagName.toLowerCase()
      const role = element.getAttribute('role')
      const tabindex = element.getAttribute('tabindex')
      
      // Custom interactive elements should have proper keyboard support
      if (role === 'button' && tagName !== 'button') {
        if (!element.hasAttribute('tabindex')) {
          results.push({
            passed: false,
            message: 'Custom button is not keyboard accessible',
            severity: 'error',
            rule: 'keyboard-button',
            element: element as HTMLElement,
            suggestion: 'Add tabindex="0" and keyboard event handlers',
          })
        }
      }
      
      if (role === 'link' && tagName !== 'a') {
        if (!element.hasAttribute('tabindex')) {
          results.push({
            passed: false,
            message: 'Custom link is not keyboard accessible',
            severity: 'error',
            rule: 'keyboard-link',
            element: element as HTMLElement,
            suggestion: 'Add tabindex="0" and keyboard event handlers',
          })
        }
      }
    })
    
    return results
  }
  
  /**
   * Test live regions
   */
  private testLiveRegions(container: HTMLElement): AccessibilityTestResult[] {
    const results: AccessibilityTestResult[] = []
    const liveRegions = container.querySelectorAll('[aria-live]')
    
    liveRegions.forEach(region => {
      const ariaLive = region.getAttribute('aria-live')
      
      if (!['off', 'polite', 'assertive'].includes(ariaLive || '')) {
        results.push({
          passed: false,
          message: 'Invalid aria-live value',
          severity: 'error',
          rule: 'live-region',
          element: region as HTMLElement,
          suggestion: 'Use aria-live="polite" or aria-live="assertive"',
        })
      }
    })
    
    return results
  }
}

/**
 * React hook for accessibility testing
 */
export function useAccessibilityTest(containerRef: React.RefObject<HTMLElement>) {
  const [audit, setAudit] = useState<AccessibilityAudit | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  
  const runAudit = useCallback(async () => {
    if (!containerRef.current || isRunning) return
    
    setIsRunning(true)
    const tester = AccessibilityTester.getInstance()
    
    // Run audit in next tick to avoid blocking UI
    setTimeout(() => {
      const result = tester.audit(containerRef.current!)
      setAudit(result)
      setIsRunning(false)
    }, 0)
  }, [containerRef, isRunning])
  
  return {
    audit,
    runAudit,
    isRunning,
  }
}

/**
 * Development-only accessibility checker
 */
export function enableAccessibilityChecking() {
  if (process.env.NODE_ENV !== 'development') return
  
  const tester = AccessibilityTester.getInstance()
  
  // Run audit when DOM changes
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldCheck = true
      }
    })
    
    if (shouldCheck) {
      setTimeout(() => {
        const audit = tester.audit()
        if (audit.errors.length > 0 || audit.warnings.length > 0) {
          console.group('🔍 Accessibility Issues Detected')
          audit.errors.forEach(error => {
            console.error(`❌ ${error.message}`, error.element)
          })
          audit.warnings.forEach(warning => {
            console.warn(`⚠️ ${warning.message}`, warning.element)
          })
          console.groupEnd()
        }
      }, 1000) // Debounce
    }
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
  
  // Expose global audit function
  ;(window as any).auditAccessibility = () => {
    const audit = tester.audit()
    console.group('♿ Accessibility Audit Results')
    console.log(`Score: ${audit.score}/100`)
    console.log(`Tests: ${audit.passedTests}/${audit.totalTests} passed`)
    
    if (audit.errors.length > 0) {
      console.group('❌ Errors')
      audit.errors.forEach(error => console.error(error.message, error.element))
      console.groupEnd()
    }
    
    if (audit.warnings.length > 0) {
      console.group('⚠️ Warnings')
      audit.warnings.forEach(warning => console.warn(warning.message, warning.element))
      console.groupEnd()
    }
    
    console.groupEnd()
    return audit
  }
}

// Global accessibility tester instance
export const accessibilityTester = AccessibilityTester.getInstance()

export default AccessibilityTester