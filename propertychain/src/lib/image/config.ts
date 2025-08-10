/**
 * Image Optimization Configuration - PropertyChain
 * 
 * Centralized image optimization settings and presets
 * Following UpdatedUIPlan.md Step 61 specifications and CLAUDE.md principles
 */

/**
 * Image size presets for different use cases
 */
export const IMAGE_SIZES = {
  // Thumbnails
  thumbnail: {
    small: { width: 80, height: 80 },
    medium: { width: 150, height: 150 },
    large: { width: 250, height: 250 }
  },
  
  // Property cards
  card: {
    small: { width: 320, height: 240 },
    medium: { width: 400, height: 300 },
    large: { width: 600, height: 450 }
  },
  
  // Hero images
  hero: {
    mobile: { width: 640, height: 480 },
    tablet: { width: 1024, height: 600 },
    desktop: { width: 1920, height: 800 },
    wide: { width: 2560, height: 1080 }
  },
  
  // Gallery images
  gallery: {
    thumb: { width: 200, height: 200 },
    preview: { width: 400, height: 400 },
    full: { width: 1200, height: 800 },
    zoom: { width: 2400, height: 1600 }
  },
  
  // Avatar images
  avatar: {
    small: { width: 32, height: 32 },
    medium: { width: 64, height: 64 },
    large: { width: 128, height: 128 }
  },
  
  // Banner images
  banner: {
    mobile: { width: 640, height: 200 },
    desktop: { width: 1920, height: 400 }
  }
} as const

/**
 * Image quality presets based on use case
 */
export const IMAGE_QUALITY = {
  // High quality for hero and featured images
  hero: 90,
  featured: 85,
  
  // Standard quality for general content
  standard: 80,
  content: 75,
  
  // Lower quality for thumbnails and previews
  thumbnail: 70,
  preview: 65,
  
  // Adaptive quality based on network
  auto: 'auto'
} as const

/**
 * Responsive image breakpoints
 */
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
  ultrawide: 1920
} as const

/**
 * Image format priorities
 */
export const IMAGE_FORMATS = {
  modern: ['avif', 'webp', 'jpeg'],
  standard: ['webp', 'jpeg'],
  legacy: ['jpeg', 'png']
} as const

/**
 * Blur placeholder settings
 */
export const BLUR_SETTINGS = {
  size: 10,
  quality: 60,
  brightness: 1,
  saturation: 1.2
} as const

/**
 * CDN configuration
 */
export const CDN_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_IMAGE_CDN_ENABLED === 'true',
  provider: process.env.NEXT_PUBLIC_IMAGE_CDN_PROVIDER || 'cloudinary',
  url: process.env.NEXT_PUBLIC_IMAGE_CDN_URL || 'https://images.propertychain.com',
  apiKey: process.env.NEXT_PUBLIC_IMAGE_CDN_API_KEY,
  zone: process.env.NEXT_PUBLIC_IMAGE_CDN_ZONE || 'auto'
} as const

/**
 * Lazy loading configuration
 */
export const LAZY_LOAD_CONFIG = {
  rootMargin: '50px',
  threshold: 0.01,
  trackVisibility: true,
  delay: 100
} as const

/**
 * Image optimization rules
 */
export const OPTIMIZATION_RULES = {
  // Maximum dimensions
  maxWidth: 3840,
  maxHeight: 2160,
  
  // File size limits (in bytes)
  maxFileSize: 5 * 1024 * 1024, // 5MB
  warningFileSize: 2 * 1024 * 1024, // 2MB
  
  // Compression settings
  jpegQuality: 85,
  pngQuality: 90,
  webpQuality: 80,
  avifQuality: 75,
  
  // Processing options
  stripMetadata: true,
  progressive: true,
  optimize: true,
  
  // Cache settings
  cacheTTL: 60 * 60 * 24 * 60, // 60 days
  staleWhileRevalidate: 60 * 60 * 24 * 7 // 7 days
} as const

/**
 * Get responsive sizes attribute for images
 */
export function getResponsiveSizes(type: keyof typeof IMAGE_SIZES): string {
  const breakpoints = [
    `(max-width: ${BREAKPOINTS.mobile}px) 100vw`,
    `(max-width: ${BREAKPOINTS.tablet}px) 50vw`,
    `(max-width: ${BREAKPOINTS.desktop}px) 33vw`,
    '25vw'
  ]
  
  return breakpoints.join(', ')
}

/**
 * Get srcset for responsive images
 */
export function getResponsiveSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ')
}

/**
 * Get optimal quality based on image type and network
 */
export function getOptimalQuality(
  imageType: keyof typeof IMAGE_QUALITY,
  networkSpeed?: 'slow' | 'fast' | 'auto'
): number | string {
  const baseQuality = IMAGE_QUALITY[imageType]
  
  if (baseQuality === 'auto' || networkSpeed === 'auto') {
    return 'auto'
  }
  
  if (networkSpeed === 'slow' && typeof baseQuality === 'number') {
    return Math.max(50, baseQuality - 20)
  }
  
  return baseQuality
}

/**
 * Check if image optimization is supported
 */
export function isOptimizationSupported(): boolean {
  if (typeof window === 'undefined') return true
  
  // Check for modern browser features
  const hasIntersectionObserver = 'IntersectionObserver' in window
  const hasLazyLoading = 'loading' in HTMLImageElement.prototype
  const hasWebP = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('image/webp') === 5
  
  return hasIntersectionObserver && hasLazyLoading && hasWebP
}

/**
 * Get image optimization hints
 */
export function getOptimizationHints(
  width: number,
  height: number,
  fileSize?: number
): string[] {
  const hints: string[] = []
  const { maxWidth, maxHeight, maxFileSize, warningFileSize } = OPTIMIZATION_RULES
  
  if (width > maxWidth) {
    hints.push(`Image width (${width}px) exceeds maximum (${maxWidth}px)`)
  }
  
  if (height > maxHeight) {
    hints.push(`Image height (${height}px) exceeds maximum (${maxHeight}px)`)
  }
  
  if (fileSize) {
    if (fileSize > maxFileSize) {
      hints.push(`File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds maximum (${maxFileSize / 1024 / 1024}MB)`)
    } else if (fileSize > warningFileSize) {
      hints.push(`File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) is large, consider optimizing`)
    }
  }
  
  const aspectRatio = width / height
  if (aspectRatio > 3 || aspectRatio < 0.33) {
    hints.push(`Unusual aspect ratio (${aspectRatio.toFixed(2)}), consider cropping`)
  }
  
  return hints
}

/**
 * Export all configuration
 */
export default {
  IMAGE_SIZES,
  IMAGE_QUALITY,
  BREAKPOINTS,
  IMAGE_FORMATS,
  BLUR_SETTINGS,
  CDN_CONFIG,
  LAZY_LOAD_CONFIG,
  OPTIMIZATION_RULES,
  getResponsiveSizes,
  getResponsiveSrcSet,
  getOptimalQuality,
  isOptimizationSupported,
  getOptimizationHints
}