/**
 * Blur Placeholder Generator - PropertyChain
 * 
 * Generate base64 blur placeholders for images
 * Following UpdatedUIPlan.md Step 61 specifications and CLAUDE.md principles
 */

import { getPlaiceholder } from 'plaiceholder'
import sharp from 'sharp'

// Cache for generated placeholders
const placeholderCache = new Map<string, string>()

/**
 * Generate a base64-encoded blur placeholder for an image
 */
export async function generateBlurPlaceholder(
  src: string,
  options?: {
    size?: number
    quality?: number
    brightness?: number
    saturation?: number
  }
): Promise<string> {
  const {
    size = 10,
    quality = 60,
    brightness = 1,
    saturation = 1.2
  } = options || {}

  // Check cache
  const cacheKey = `${src}-${size}-${quality}-${brightness}-${saturation}`
  if (placeholderCache.has(cacheKey)) {
    return placeholderCache.get(cacheKey)!
  }

  try {
    let buffer: Buffer

    // Handle different image sources
    if (src.startsWith('http')) {
      // Fetch remote image
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else if (src.startsWith('/')) {
      // Local file
      const fs = await import('fs/promises')
      const path = await import('path')
      const filePath = path.join(process.cwd(), 'public', src)
      buffer = await fs.readFile(filePath)
    } else {
      // Assume it's already a path
      const fs = await import('fs/promises')
      buffer = await fs.readFile(src)
    }

    // Process with sharp for better performance
    const processedBuffer = await sharp(buffer)
      .resize(size, size, { fit: 'inside' })
      .modulate({
        brightness,
        saturation
      })
      .blur()
      .jpeg({ quality })
      .toBuffer()

    // Convert to base64
    const base64 = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`

    // Cache the result
    placeholderCache.set(cacheKey, base64)

    return base64
  } catch (error) {
    console.error('Error generating blur placeholder:', error)
    // Return a default placeholder
    return generateDefaultPlaceholder()
  }
}

/**
 * Generate blur placeholder using plaiceholder library
 */
export async function generatePlaiceholder(src: string) {
  try {
    const { base64 } = await getPlaiceholder(src as any, {
      size: 10
    })
    return base64
  } catch (error) {
    console.error('Error generating plaiceholder:', error)
    return generateDefaultPlaceholder()
  }
}

/**
 * Generate a simple colored placeholder
 */
export function generateColorPlaceholder(
  color: string = '#e5e7eb',
  width: number = 10,
  height: number = 10
): string {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `
  
  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate a gradient placeholder
 */
export function generateGradientPlaceholder(
  colors: string[] = ['#e5e7eb', '#f3f4f6'],
  direction: 'horizontal' | 'vertical' | 'diagonal' = 'vertical',
  width: number = 10,
  height: number = 10
): string {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`
  
  let x1 = '0%', y1 = '0%', x2 = '0%', y2 = '100%'
  if (direction === 'horizontal') {
    x2 = '100%'
    y2 = '0%'
  } else if (direction === 'diagonal') {
    x2 = '100%'
    y2 = '100%'
  }

  const stops = colors.map((color, index) => {
    const offset = (index / (colors.length - 1)) * 100
    return `<stop offset="${offset}%" stop-color="${color}"/>`
  }).join('')

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
          ${stops}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${gradientId})"/>
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate a shimmer/skeleton placeholder
 */
export function generateShimmerPlaceholder(
  baseColor: string = '#e5e7eb',
  highlightColor: string = '#f3f4f6',
  width: number = 10,
  height: number = 10
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${baseColor}">
            <animate attributeName="stop-color" 
              values="${baseColor};${highlightColor};${baseColor}" 
              dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" stop-color="${highlightColor}">
            <animate attributeName="stop-color" 
              values="${highlightColor};${baseColor};${highlightColor}" 
              dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stop-color="${baseColor}">
            <animate attributeName="stop-color" 
              values="${baseColor};${highlightColor};${baseColor}" 
              dur="1.5s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#shimmer)"/>
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate default placeholder
 */
function generateDefaultPlaceholder(): string {
  return generateColorPlaceholder('#f3f4f6')
}

/**
 * Extract dominant color from an image
 */
export async function extractDominantColor(src: string): Promise<string> {
  try {
    let buffer: Buffer

    if (src.startsWith('http')) {
      const response = await fetch(src)
      const arrayBuffer = await response.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      const fs = await import('fs/promises')
      buffer = await fs.readFile(src)
    }

    // Get image stats including dominant color
    const stats = await sharp(buffer).stats()
    
    // Convert dominant color to hex
    const { channels } = stats
    const r = Math.round(channels[0].mean)
    const g = Math.round(channels[1].mean)
    const b = Math.round(channels[2].mean)
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  } catch (error) {
    console.error('Error extracting dominant color:', error)
    return '#e5e7eb'
  }
}

/**
 * Batch generate placeholders for multiple images
 */
export async function batchGeneratePlaceholders(
  images: string[],
  options?: Parameters<typeof generateBlurPlaceholder>[1]
): Promise<Map<string, string>> {
  const results = new Map<string, string>()
  
  // Process in parallel with concurrency limit
  const concurrency = 5
  for (let i = 0; i < images.length; i += concurrency) {
    const batch = images.slice(i, i + concurrency)
    const placeholders = await Promise.all(
      batch.map(src => generateBlurPlaceholder(src, options))
    )
    
    batch.forEach((src, index) => {
      results.set(src, placeholders[index])
    })
  }
  
  return results
}

/**
 * Clear placeholder cache
 */
export function clearPlaceholderCache(): void {
  placeholderCache.clear()
}

/**
 * Get cache size
 */
export function getPlaceholderCacheSize(): number {
  return placeholderCache.size
}

// Export all functions
export default {
  generateBlurPlaceholder,
  generatePlaiceholder,
  generateColorPlaceholder,
  generateGradientPlaceholder,
  generateShimmerPlaceholder,
  extractDominantColor,
  batchGeneratePlaceholders,
  clearPlaceholderCache,
  getPlaceholderCacheSize
}