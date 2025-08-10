/**
 * ARIA Labels and Attributes System - PropertyChain
 * 
 * Comprehensive ARIA labeling system with semantic markup and dynamic attributes
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

import { useEffect, useRef, useId } from 'react'

/**
 * ARIA landmark roles
 */
export const LANDMARKS = {
  BANNER: 'banner',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  FORM: 'form',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  REGION: 'region',
  SEARCH: 'search',
} as const

/**
 * ARIA widget roles
 */
export const WIDGET_ROLES = {
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  DIALOG: 'dialog',
  GRIDCELL: 'gridcell',
  LINK: 'link',
  LOG: 'log',
  MARQUEE: 'marquee',
  MENUITEM: 'menuitem',
  MENUITEMCHECKBOX: 'menuitemcheckbox',
  MENUITEMRADIO: 'menuitemradio',
  OPTION: 'option',
  PROGRESSBAR: 'progressbar',
  RADIO: 'radio',
  SCROLLBAR: 'scrollbar',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  STATUS: 'status',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TEXTBOX: 'textbox',
  TIMER: 'timer',
  TOOLTIP: 'tooltip',
  TREEITEM: 'treeitem',
} as const

/**
 * ARIA composite roles
 */
export const COMPOSITE_ROLES = {
  COMBOBOX: 'combobox',
  GRID: 'grid',
  LISTBOX: 'listbox',
  MENU: 'menu',
  MENUBAR: 'menubar',
  RADIOGROUP: 'radiogroup',
  TABLIST: 'tablist',
  TREE: 'tree',
  TREEGRID: 'treegrid',
} as const

/**
 * ARIA live region politeness levels
 */
export const LIVE_POLITENESS = {
  OFF: 'off',
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
} as const

/**
 * ARIA states and properties
 */
export interface AriaAttributes {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-checked'?: boolean | 'mixed'
  'aria-selected'?: boolean
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  'aria-disabled'?: boolean
  'aria-hidden'?: boolean
  'aria-live'?: 'off' | 'polite' | 'assertive'
  'aria-atomic'?: boolean
  'aria-busy'?: boolean
  'aria-controls'?: string
  'aria-owns'?: string
  'aria-activedescendant'?: string
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling'
  'aria-multiline'?: boolean
  'aria-multiselectable'?: boolean
  'aria-readonly'?: boolean
  'aria-required'?: boolean
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
  'aria-valuemax'?: number
  'aria-valuemin'?: number
  'aria-valuenow'?: number
  'aria-valuetext'?: string
  'aria-orientation'?: 'horizontal' | 'vertical'
  'aria-level'?: number
  'aria-posinset'?: number
  'aria-setsize'?: number
  'aria-rowcount'?: number
  'aria-colcount'?: number
  'aria-rowindex'?: number
  'aria-colindex'?: number
  'aria-rowspan'?: number
  'aria-colspan'?: number
}

/**
 * ARIA Label Manager
 */
export class AriaLabelManager {
  private static instance: AriaLabelManager
  private labelRegistry = new Map<string, string>()
  private descriptionRegistry = new Map<string, string>()
  
  private constructor() {}
  
  static getInstance(): AriaLabelManager {
    if (!AriaLabelManager.instance) {
      AriaLabelManager.instance = new AriaLabelManager()
    }
    return AriaLabelManager.instance
  }
  
  /**
   * Generate accessible label for form control
   */
  generateFormLabel(
    controlType: string,
    label: string,
    isRequired?: boolean,
    hasError?: boolean,
    description?: string
  ): string {
    let accessibleLabel = label
    
    if (isRequired) {
      accessibleLabel += ', required'
    }
    
    if (hasError) {
      accessibleLabel += ', invalid entry'
    }
    
    if (description) {
      accessibleLabel += `, ${description}`
    }
    
    // Add control type context if not obvious
    const needsTypeContext = ['slider', 'spinbutton', 'combobox']
    if (needsTypeContext.includes(controlType.toLowerCase())) {
      accessibleLabel += `, ${controlType}`
    }
    
    return accessibleLabel
  }
  
  /**
   * Generate accessible button label
   */
  generateButtonLabel(
    text: string,
    action?: string,
    state?: 'expanded' | 'pressed' | 'selected',
    disabled?: boolean
  ): string {
    let label = text
    
    if (action) {
      label = `${action} ${text}`
    }
    
    if (state) {
      switch (state) {
        case 'expanded':
          label += ', expanded'
          break
        case 'pressed':
          label += ', pressed'
          break
        case 'selected':
          label += ', selected'
          break
      }
    }
    
    if (disabled) {
      label += ', disabled'
    }
    
    return label
  }
  
  /**
   * Generate accessible table cell label
   */
  generateTableCellLabel(
    cellContent: string,
    rowHeaders?: string[],
    columnHeaders?: string[],
    rowIndex?: number,
    colIndex?: number
  ): string {
    let label = cellContent
    
    if (columnHeaders?.length && colIndex !== undefined) {
      const columnHeader = columnHeaders[colIndex]
      if (columnHeader) {
        label = `${columnHeader}: ${label}`
      }
    }
    
    if (rowHeaders?.length && rowIndex !== undefined) {
      const rowHeader = rowHeaders[rowIndex]
      if (rowHeader) {
        label = `${rowHeader}, ${label}`
      }
    }
    
    if (rowIndex !== undefined && colIndex !== undefined) {
      label += `, row ${rowIndex + 1}, column ${colIndex + 1}`
    }
    
    return label
  }
  
  /**
   * Generate accessible status message
   */
  generateStatusMessage(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    details?: string
  ): string {
    let statusLabel = ''
    
    switch (type) {
      case 'success':
        statusLabel = 'Success: '
        break
      case 'error':
        statusLabel = 'Error: '
        break
      case 'warning':
        statusLabel = 'Warning: '
        break
      case 'info':
        statusLabel = 'Information: '
        break
    }
    
    let fullMessage = statusLabel + message
    
    if (details) {
      fullMessage += `. ${details}`
    }
    
    return fullMessage
  }
  
  /**
   * Generate accessible navigation label
   */
  generateNavigationLabel(
    currentItem: string,
    totalItems?: number,
    currentIndex?: number,
    description?: string
  ): string {
    let label = currentItem
    
    if (typeof currentIndex === 'number' && totalItems) {
      label += `, ${currentIndex + 1} of ${totalItems}`
    }
    
    if (description) {
      label += `, ${description}`
    }
    
    return label
  }
  
  /**
   * Register label for element
   */
  registerLabel(elementId: string, label: string): void {
    this.labelRegistry.set(elementId, label)
  }
  
  /**
   * Get registered label
   */
  getLabel(elementId: string): string | undefined {
    return this.labelRegistry.get(elementId)
  }
  
  /**
   * Register description for element
   */
  registerDescription(elementId: string, description: string): void {
    this.descriptionRegistry.set(elementId, description)
  }
  
  /**
   * Get registered description
   */
  getDescription(elementId: string): string | undefined {
    return this.descriptionRegistry.get(elementId)
  }
}

/**
 * Hook for generating form field ARIA attributes
 */
export function useFormFieldAria(
  label: string,
  options: {
    required?: boolean
    invalid?: boolean
    description?: string
    errorMessage?: string
    disabled?: boolean
  } = {}
) {
  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  
  const { required, invalid, description, errorMessage, disabled } = options
  
  const ariaAttributes: AriaAttributes = {
    'aria-labelledby': labelId,
    'aria-required': required,
    'aria-invalid': invalid,
    'aria-disabled': disabled,
  }
  
  if (description) {
    ariaAttributes['aria-describedby'] = descriptionId
  }
  
  if (invalid && errorMessage) {
    ariaAttributes['aria-describedby'] = ariaAttributes['aria-describedby']
      ? `${ariaAttributes['aria-describedby']} ${errorId}`
      : errorId
  }
  
  return {
    fieldProps: ariaAttributes,
    labelId,
    descriptionId,
    errorId,
  }
}

/**
 * Hook for button ARIA attributes
 */
export function useButtonAria(
  options: {
    pressed?: boolean
    expanded?: boolean
    controls?: string
    describedBy?: string
    disabled?: boolean
    popup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  } = {}
) {
  const { pressed, expanded, controls, describedBy, disabled, popup } = options
  
  const ariaAttributes: AriaAttributes = {
    'aria-disabled': disabled,
  }
  
  if (typeof pressed === 'boolean') {
    ariaAttributes['aria-pressed'] = pressed
  }
  
  if (typeof expanded === 'boolean') {
    ariaAttributes['aria-expanded'] = expanded
  }
  
  if (controls) {
    ariaAttributes['aria-controls'] = controls
  }
  
  if (describedBy) {
    ariaAttributes['aria-describedby'] = describedBy
  }
  
  if (popup !== undefined) {
    ariaAttributes['aria-haspopup'] = popup
  }
  
  return ariaAttributes
}

/**
 * Hook for dialog ARIA attributes
 */
export function useDialogAria(
  title: string,
  description?: string,
  modal = true
) {
  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  
  const ariaAttributes: any = {
    role: modal ? 'dialog' : 'alertdialog',
    'aria-labelledby': titleId,
    'aria-modal': modal,
  }
  
  if (description) {
    ariaAttributes['aria-describedby'] = descriptionId
  }
  
  return {
    dialogProps: ariaAttributes,
    titleId,
    descriptionId,
  }
}

/**
 * Hook for list/menu ARIA attributes
 */
export function useListAria(
  options: {
    multiselectable?: boolean
    orientation?: 'horizontal' | 'vertical'
    activedescendant?: string
    owns?: string
  } = {}
) {
  const { multiselectable, orientation, activedescendant, owns } = options
  
  const ariaAttributes: AriaAttributes & { role: string } = {
    role: 'listbox',
    'aria-multiselectable': multiselectable,
    'aria-orientation': orientation,
  }
  
  if (activedescendant) {
    ariaAttributes['aria-activedescendant'] = activedescendant
  }
  
  if (owns) {
    ariaAttributes['aria-owns'] = owns
  }
  
  return ariaAttributes
}

/**
 * Hook for tab ARIA attributes
 */
export function useTabAria(
  isSelected: boolean,
  controls?: string,
  index?: number,
  setSize?: number
) {
  const ariaAttributes: AriaAttributes & { role: string } = {
    role: 'tab',
    'aria-selected': isSelected,
  }
  
  if (controls) {
    ariaAttributes['aria-controls'] = controls
  }
  
  if (typeof index === 'number') {
    ariaAttributes['aria-posinset'] = index + 1
  }
  
  if (setSize) {
    ariaAttributes['aria-setsize'] = setSize
  }
  
  return ariaAttributes
}

/**
 * Hook for progress ARIA attributes
 */
export function useProgressAria(
  value: number,
  min = 0,
  max = 100,
  label?: string
) {
  const ariaAttributes: AriaAttributes & { role: string } = {
    role: 'progressbar',
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': value,
  }
  
  if (label) {
    ariaAttributes['aria-label'] = label
  }
  
  // Add text representation for screen readers
  const percentage = Math.round(((value - min) / (max - min)) * 100)
  ariaAttributes['aria-valuetext'] = `${percentage}%`
  
  return ariaAttributes
}

/**
 * Hook for table ARIA attributes
 */
export function useTableAria(
  caption?: string,
  rowCount?: number,
  colCount?: number
) {
  const id = useId()
  const captionId = `${id}-caption`
  
  const tableAttributes: AriaAttributes & { role: string } = {
    role: 'table',
  }
  
  if (caption) {
    tableAttributes['aria-labelledby'] = captionId
  }
  
  if (rowCount) {
    tableAttributes['aria-rowcount'] = rowCount
  }
  
  if (colCount) {
    tableAttributes['aria-colcount'] = colCount
  }
  
  return {
    tableProps: tableAttributes,
    captionId,
  }
}

/**
 * Hook for status/alert ARIA attributes
 */
export function useStatusAria(
  type: 'status' | 'alert' | 'log' = 'status',
  live: 'off' | 'polite' | 'assertive' = 'polite',
  atomic = true
) {
  const ariaAttributes: AriaAttributes & { role: string } = {
    role: type,
    'aria-live': live,
    'aria-atomic': atomic,
  }
  
  return ariaAttributes
}

/**
 * Hook for combobox ARIA attributes
 */
export function useComboboxAria(
  options: {
    expanded: boolean
    hasPopup?: 'listbox' | 'tree' | 'grid' | 'dialog'
    controls?: string
    activedescendant?: string
    autocomplete?: 'none' | 'inline' | 'list' | 'both'
  }
) {
  const { expanded, hasPopup = 'listbox', controls, activedescendant, autocomplete } = options
  
  const ariaAttributes: AriaAttributes & { role: string } = {
    role: 'combobox',
    'aria-expanded': expanded,
    'aria-haspopup': hasPopup,
    'aria-autocomplete': autocomplete,
  }
  
  if (controls) {
    ariaAttributes['aria-controls'] = controls
  }
  
  if (activedescendant) {
    ariaAttributes['aria-activedescendant'] = activedescendant
  }
  
  return ariaAttributes
}

/**
 * Hook for breadcrumb navigation ARIA attributes
 */
export function useBreadcrumbAria(currentIndex: number, totalItems: number) {
  return {
    navProps: {
      'aria-label': 'Breadcrumb navigation',
      role: 'navigation',
    },
    getCurrentProps: (index: number) => ({
      'aria-current': index === currentIndex ? 'page' as const : undefined,
      'aria-posinset': index + 1,
      'aria-setsize': totalItems,
    }),
  }
}

/**
 * Component for ARIA live region
 */
interface LiveRegionProps {
  children: React.ReactNode
  politeness?: 'off' | 'polite' | 'assertive'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true,
  relevant = 'additions',
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
    >
      {children}
    </div>
  )
}

/**
 * Component for visually hidden content (screen reader only)
 */
interface VisuallyHiddenProps {
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  )
}

// Global ARIA label manager instance
export const ariaManager = AriaLabelManager.getInstance()

export default AriaLabelManager