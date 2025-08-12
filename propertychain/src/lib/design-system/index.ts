/**
 * Design System Export
 * PropertyLend DeFi Platform
 * 
 * Central export for all design system utilities
 * Following Phase 1.1 of UI_POLISH_PLAN.md
 */

export * from './constants'

import {
  SPACING,
  BUTTON_SIZES,
  RADIUS,
  COLORS,
  TYPOGRAPHY,
  ANIMATION,
  Z_INDEX,
  BREAKPOINTS,
  SHADOWS,
  CONTAINER
} from './constants'

/**
 * Helper function to get CSS variable value
 */
export const getCSSVariable = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
  }
  return ''
}

/**
 * Helper function to set CSS variable value
 */
export const setCSSVariable = (variable: string, value: string): void => {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty(variable, value)
  }
}

/**
 * Convert pixel value to rem
 */
export const pxToRem = (px: number): string => {
  return `${px / 16}rem`
}

/**
 * Get responsive value based on breakpoint
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof typeof BREAKPOINTS, T>>,
  defaultValue: T
): T => {
  if (typeof window === 'undefined') return defaultValue
  
  const width = window.innerWidth
  const breakpoints = Object.entries(BREAKPOINTS).sort((a, b) => 
    parseInt(b[1]) - parseInt(a[1])
  )
  
  for (const [key, value] of breakpoints) {
    if (width >= parseInt(value) && values[key as keyof typeof BREAKPOINTS]) {
      return values[key as keyof typeof BREAKPOINTS]!
    }
  }
  
  return defaultValue
}

/**
 * Design system theme object for use with styled-components or emotion
 */
export const theme = {
  spacing: SPACING,
  buttons: BUTTON_SIZES,
  radius: RADIUS,
  colors: COLORS,
  typography: TYPOGRAPHY,
  animation: ANIMATION,
  zIndex: Z_INDEX,
  breakpoints: BREAKPOINTS,
  shadows: SHADOWS,
  container: CONTAINER,
} as const

/**
 * Tailwind-compatible color palette
 */
export const tailwindColors = {
  'bg-primary': COLORS.background.primary,
  'bg-secondary': COLORS.background.secondary,
  'bg-tertiary': COLORS.background.tertiary,
  'text-primary': COLORS.text.primary,
  'text-secondary': COLORS.text.secondary,
  'text-tertiary': COLORS.text.tertiary,
  'brand-primary': COLORS.brand.primary,
  'brand-secondary': COLORS.brand.secondary,
  'yield-senior': COLORS.yield.senior,
  'yield-junior': COLORS.yield.junior,
  'yield-apy': COLORS.yield.apy,
  'yield-tvl': COLORS.yield.tvl,
} as const

/**
 * Media query helpers
 */
export const media = {
  xs: `@media (min-width: ${BREAKPOINTS.xs})`,
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2xl']})`,
} as const

/**
 * Generate consistent spacing classes
 */
export const generateSpacing = (property: 'margin' | 'padding', size: keyof typeof SPACING) => {
  const value = SPACING[size]
  return {
    all: `${property}: ${value}`,
    top: `${property}-top: ${value}`,
    right: `${property}-right: ${value}`,
    bottom: `${property}-bottom: ${value}`,
    left: `${property}-left: ${value}`,
    x: `${property}-left: ${value}; ${property}-right: ${value}`,
    y: `${property}-top: ${value}; ${property}-bottom: ${value}`,
  }
}

/**
 * Apply glassmorphism effect
 */
export const glassmorphism = (opacity: number = 0.03, blur: number = 10) => `
  background: rgba(255, 255, 255, ${opacity});
  backdrop-filter: blur(${blur}px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);
`

/**
 * Apply neon glow effect
 */
export const neonGlow = (color: string, intensity: number = 1) => `
  box-shadow: 
    0 0 ${10 * intensity}px ${color},
    0 0 ${20 * intensity}px ${color},
    0 0 ${30 * intensity}px ${color},
    0 0 ${40 * intensity}px ${color};
  text-shadow: 
    0 0 ${10 * intensity}px ${color},
    0 0 ${20 * intensity}px ${color},
    0 0 ${30 * intensity}px ${color};
`

/**
 * Apply gradient text effect
 */
export const gradientText = (gradient: string = COLORS.gradients.primary) => `
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export default theme