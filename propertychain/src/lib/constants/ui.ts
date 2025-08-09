/**
 * UI Constants
 * Design system and component configuration
 */

// Following Section 0.3 Information Density Limits
export const DENSITY_LIMITS = {
  // Cards/Grid Items
  propertyCards: {
    desktop: 12,  // 3x4 or 4x3 grid
    tablet: 8,    // 2x4 grid
    mobile: 6,    // 1x6 stack
    initial: 9,   // Above fold
  },
  
  // Dashboard Components
  kpiCards: {
    max: 6,
    optimal: 4,
    mobile: 2, // Most important only
  },
  
  // Table Rows
  tableRows: {
    default: 10,
    expanded: 25,
    max: 50,
    mobile: 5, // Convert to cards
  },
  
  // Dropdown Items
  dropdownItems: {
    visible: 7,
    scrollAfter: 8,
    max: 50,
    sections: 5,
  },
  
  // Navigation
  navItems: {
    primary: 5,
    withMore: 4,
    mobile: 4,
  },
  
  // Form Fields
  formFields: {
    perStep: 6,
    perSection: 4,
    total: 20,
  },
} as const

// Z-Index Layer Management (Section 0.2)
export const Z_INDEX = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
  maximum: 999,
} as const

// Animation Timing (Section 0.5)
export const TRANSITIONS = {
  instant: '0ms',
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  '3xl': 1920,
} as const

export const GRID_UNIT = 8 // Base 8px grid unit

export const TOUCH_TARGET_MIN = 44 // Minimum touch target (mobile)