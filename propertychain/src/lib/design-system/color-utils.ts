/**
 * Color Utility Functions
 * PropertyLend DeFi Platform
 * 
 * Phase 1.2: Color System Refinement
 * WCAG AAA compliance utilities and color manipulation
 */

import { COLORS } from './constants'

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * Calculate relative luminance (WCAG formula)
 */
export function getLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const { r, g, b } = rgb
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21 (higher is better)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if color combination meets WCAG standards
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background)
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7
  } else { // AA
    return size === 'large' ? ratio >= 3 : ratio >= 4.5
  }
}

/**
 * Get contrast rating label
 */
export function getContrastRating(ratio: number): {
  label: string
  level: 'fail' | 'AA' | 'AAA'
  color: string
} {
  if (ratio < 3) {
    return { label: 'Fail', level: 'fail', color: COLORS.semantic.danger }
  } else if (ratio < 4.5) {
    return { label: 'AA Large', level: 'AA', color: COLORS.semantic.warning }
  } else if (ratio < 7) {
    return { label: 'AA', level: 'AA', color: COLORS.semantic.warning }
  } else {
    return { label: 'AAA', level: 'AAA', color: COLORS.semantic.success }
  }
}

/**
 * Adjust color brightness
 */
export function adjustBrightness(color: string, percent: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const { r, g, b } = rgb
  const amount = percent / 100

  const newR = Math.min(255, Math.max(0, r + (255 - r) * amount))
  const newG = Math.min(255, Math.max(0, g + (255 - g) * amount))
  const newB = Math.min(255, Math.max(0, b + (255 - b) * amount))

  return rgbToHex(Math.round(newR), Math.round(newG), Math.round(newB))
}

/**
 * Mix two colors
 */
export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return color1

  const w = weight * 2 - 1
  const a = 0

  const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2
  const w2 = 1 - w1

  const r = Math.round(rgb1.r * w1 + rgb2.r * w2)
  const g = Math.round(rgb1.g * w1 + rgb2.g * w2)
  const b = Math.round(rgb1.b * w1 + rgb2.b * w2)

  return rgbToHex(r, g, b)
}

/**
 * Generate color palette from base color
 */
export function generatePalette(baseColor: string): Record<number, string> {
  return {
    50: mixColors(baseColor, '#FFFFFF', 0.1),
    100: mixColors(baseColor, '#FFFFFF', 0.2),
    200: mixColors(baseColor, '#FFFFFF', 0.3),
    300: mixColors(baseColor, '#FFFFFF', 0.4),
    400: mixColors(baseColor, '#FFFFFF', 0.5),
    500: baseColor,
    600: adjustBrightness(baseColor, -10),
    700: adjustBrightness(baseColor, -20),
    800: adjustBrightness(baseColor, -30),
    900: adjustBrightness(baseColor, -40),
    950: adjustBrightness(baseColor, -50)
  }
}

/**
 * Color validation for WCAG AAA on dark backgrounds
 */
export const validateDarkThemeColors = () => {
  const results = []
  const darkBg = COLORS.background.primary

  // Test text colors
  const textColors = {
    'Primary Text': COLORS.text.primary,
    'Secondary Text': COLORS.text.secondary,
    'Tertiary Text': COLORS.text.tertiary,
  }

  for (const [name, color] of Object.entries(textColors)) {
    const ratio = getContrastRatio(color, darkBg)
    const rating = getContrastRating(ratio)
    results.push({
      name,
      foreground: color,
      background: darkBg,
      ratio: ratio.toFixed(2),
      ...rating
    })
  }

  // Test semantic colors
  const semanticColors = {
    'Success': COLORS.semantic.success,
    'Warning': COLORS.semantic.warning,
    'Danger': COLORS.semantic.danger,
    'Info': COLORS.semantic.info
  }

  for (const [name, color] of Object.entries(semanticColors)) {
    const ratio = getContrastRatio(color, darkBg)
    const rating = getContrastRating(ratio)
    results.push({
      name,
      foreground: color,
      background: darkBg,
      ratio: ratio.toFixed(2),
      ...rating
    })
  }

  return results
}

/**
 * Get accessible text color for any background
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio('#FFFFFF', backgroundColor)
  const blackContrast = getContrastRatio('#000000', backgroundColor)
  
  // For AAA compliance, we need at least 7:1 ratio
  if (whiteContrast >= 7) return '#FFFFFF'
  if (blackContrast >= 7) return '#000000'
  
  // Fall back to whichever has better contrast
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000'
}

/**
 * Alpha channel utilities
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

/**
 * Check if a color is considered "light"
 */
export function isLightColor(color: string): boolean {
  const luminance = getLuminance(color)
  return luminance > 0.5
}

/**
 * Generate complementary color
 */
export function getComplementaryColor(color: string): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  return rgbToHex(
    255 - rgb.r,
    255 - rgb.g,
    255 - rgb.b
  )
}

/**
 * Common color combinations for PropertyLend
 */
export const colorCombinations = {
  // Primary actions
  primaryButton: {
    background: COLORS.brand.primary,
    text: '#FFFFFF',
    hover: COLORS.brand.primaryDark
  },
  
  // Senior tranche
  seniorTranche: {
    background: COLORS.yield.senior,
    text: '#FFFFFF',
    accent: mixColors(COLORS.yield.senior, '#FFFFFF', 0.2)
  },
  
  // Junior tranche
  juniorTranche: {
    background: COLORS.yield.junior,
    text: '#FFFFFF',
    accent: mixColors(COLORS.yield.junior, '#FFFFFF', 0.2)
  },
  
  // Glass cards
  glassCard: {
    background: COLORS.background.glass,
    border: COLORS.background.glassBorder,
    text: COLORS.text.primary
  },
  
  // Error states
  error: {
    background: hexToRgba(COLORS.semantic.danger, 0.1),
    border: COLORS.semantic.danger,
    text: COLORS.semantic.dangerLight
  },
  
  // Success states
  success: {
    background: hexToRgba(COLORS.semantic.success, 0.1),
    border: COLORS.semantic.success,
    text: COLORS.semantic.successLight
  }
}

export default {
  hexToRgb,
  rgbToHex,
  getLuminance,
  getContrastRatio,
  meetsWCAG,
  getContrastRating,
  adjustBrightness,
  mixColors,
  generatePalette,
  validateDarkThemeColors,
  getAccessibleTextColor,
  hexToRgba,
  isLightColor,
  getComplementaryColor,
  colorCombinations
}