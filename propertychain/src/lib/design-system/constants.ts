/**
 * Design System Constants
 * PropertyLend DeFi Platform
 * 
 * Unified design tokens for consistent UI/UX
 * Following Phase 1.1 of UI_POLISH_PLAN.md
 */

/**
 * Spacing System
 * Based on 4px grid for consistent spacing
 */
export const SPACING = {
  xs: '4px',    // 0.25rem
  sm: '8px',    // 0.5rem
  md: '16px',   // 1rem
  lg: '24px',   // 1.5rem
  xl: '32px',   // 2rem
  '2xl': '48px', // 3rem
  '3xl': '64px', // 4rem
  '4xl': '96px', // 6rem
  '5xl': '128px' // 8rem
} as const

/**
 * Button Sizing System
 * Consistent button dimensions across the platform
 */
export const BUTTON_SIZES = {
  sm: {
    height: '32px',
    paddingX: '12px',
    paddingY: '6px',
    fontSize: '14px',
    borderRadius: '6px',
    minWidth: '64px'
  },
  md: {
    height: '40px',
    paddingX: '16px',
    paddingY: '8px',
    fontSize: '16px',
    borderRadius: '8px',
    minWidth: '80px'
  },
  lg: {
    height: '48px',
    paddingX: '24px',
    paddingY: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    minWidth: '96px'
  },
  xl: {
    height: '56px',
    paddingX: '32px',
    paddingY: '14px',
    fontSize: '18px',
    borderRadius: '12px',
    minWidth: '128px'
  }
} as const

/**
 * Border Radius System
 * Consistent corner rounding
 */
export const RADIUS = {
  sm: '6px',     // Small elements
  md: '8px',     // Default
  lg: '12px',    // Cards
  xl: '16px',    // Large cards
  '2xl': '24px', // Hero sections
  full: '9999px' // Pills/circles
} as const

/**
 * Color System with WCAG AAA Compliance
 * Enhanced contrast ratios for accessibility
 */
export const COLORS = {
  // Background colors - Dark theme
  background: {
    primary: '#0A0B14',    // Deep space black
    secondary: '#12131F',  // Slightly lighter
    tertiary: '#1A1B2E',   // Card backgrounds
    glass: 'rgba(255, 255, 255, 0.03)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.7)'
  },
  
  // Text colors with proper contrast
  text: {
    primary: '#FFFFFF',    // Main text (AAA on dark)
    secondary: '#B8BCC8',  // Secondary text (AA on dark)
    tertiary: '#6B7280',   // Muted text
    inverse: '#0A0B14',    // For light backgrounds
    disabled: '#4B5563'    // Disabled state
  },
  
  // Brand colors
  brand: {
    primary: '#6366F1',    // Primary purple
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    secondary: '#8B5CF6',  // Secondary purple
    secondaryDark: '#7C3AED',
    secondaryLight: '#A78BFA'
  },
  
  // Semantic colors
  semantic: {
    success: '#10B981',      // Success green
    successDark: '#059669',
    successLight: '#34D399',
    warning: '#F59E0B',      // Warning yellow
    warningDark: '#D97706',
    warningLight: '#FCD34D',
    danger: '#EF4444',       // Error red
    dangerDark: '#DC2626',
    dangerLight: '#F87171',
    info: '#3B82F6',         // Info blue
    infoDark: '#2563EB',
    infoLight: '#60A5FA'
  },
  
  // APY/Yield specific colors
  yield: {
    senior: '#3B82F6',       // Senior tranche blue
    junior: '#10B981',       // Junior tranche green
    apy: '#F59E0B',         // APY highlight
    tvl: '#8B5CF6'          // TVL purple
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    secondary: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    yield: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    hero: 'linear-gradient(135deg, #0A0B14 0%, #1A1B2E 50%, #0A0B14 100%)',
    card: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)'
  },
  
  // Neon effects
  neon: {
    green: '#39FF14',
    purple: '#BC13FE',
    blue: '#00D4FF',
    yellow: '#FFD700'
  }
} as const

/**
 * Typography Scale
 * Consistent font sizing and line heights
 */
export const TYPOGRAPHY = {
  displayLg: {
    fontSize: '72px',
    lineHeight: '1.1',
    fontWeight: '800',
    letterSpacing: '-0.02em'
  },
  display: {
    fontSize: '60px',
    lineHeight: '1.2',
    fontWeight: '700',
    letterSpacing: '-0.02em'
  },
  h1: {
    fontSize: '48px',
    lineHeight: '1.2',
    fontWeight: '700',
    letterSpacing: '-0.01em'
  },
  h2: {
    fontSize: '36px',
    lineHeight: '1.3',
    fontWeight: '600',
    letterSpacing: '-0.01em'
  },
  h3: {
    fontSize: '28px',
    lineHeight: '1.4',
    fontWeight: '600',
    letterSpacing: '0'
  },
  h4: {
    fontSize: '24px',
    lineHeight: '1.4',
    fontWeight: '500',
    letterSpacing: '0'
  },
  bodyLg: {
    fontSize: '18px',
    lineHeight: '1.6',
    fontWeight: '400',
    letterSpacing: '0'
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.6',
    fontWeight: '400',
    letterSpacing: '0'
  },
  bodySm: {
    fontSize: '14px',
    lineHeight: '1.5',
    fontWeight: '400',
    letterSpacing: '0'
  },
  caption: {
    fontSize: '12px',
    lineHeight: '1.4',
    fontWeight: '400',
    letterSpacing: '0.01em'
  },
  label: {
    fontSize: '14px',
    lineHeight: '1.2',
    fontWeight: '500',
    letterSpacing: '0.01em',
    textTransform: 'uppercase' as const
  }
} as const

/**
 * Animation Durations
 * Consistent animation timing
 */
export const ANIMATION = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
  slowest: '1000ms',
  
  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
} as const

/**
 * Z-Index Scale
 * Layering system for overlapping elements
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
  max: 9999
} as const

/**
 * Breakpoints
 * Responsive design breakpoints
 */
export const BREAKPOINTS = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

/**
 * Shadows
 * Consistent shadow depths
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Glow effects
  glow: {
    primary: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)',
    success: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)',
    danger: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)',
    neon: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
  },
  
  // Glass effect
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
} as const

/**
 * Container Widths
 * Maximum content widths
 */
export const CONTAINER = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%'
} as const

// Type exports for TypeScript
export type SpacingKey = keyof typeof SPACING
export type ButtonSizeKey = keyof typeof BUTTON_SIZES
export type RadiusKey = keyof typeof RADIUS
export type ColorKey = keyof typeof COLORS
export type TypographyKey = keyof typeof TYPOGRAPHY
export type AnimationKey = keyof typeof ANIMATION
export type ZIndexKey = keyof typeof Z_INDEX
export type BreakpointKey = keyof typeof BREAKPOINTS
export type ShadowKey = keyof typeof SHADOWS
export type ContainerKey = keyof typeof CONTAINER