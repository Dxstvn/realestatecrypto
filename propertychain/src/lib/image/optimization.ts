/**
 * Image Optimization Utilities - PropertyChain
 * 
 * Utilities for image optimization and processing
 * Following UpdatedUIPlan.md Step 61 specifications and CLAUDE.md principles
 */

// Image format detection
export function detectImageFormat(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    case 'svg':
      return 'image/svg+xml'
    default:
      return 'image/jpeg'
  }
}

// Check if browser supports WebP
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5
}

// Check if browser supports AVIF
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image()
    avif.onload = () => resolve(true)
    avif.onerror = () => resolve(false)
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
  })
}

// Generate srcset for responsive images
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536, 1920],
  format?: string
): string {
  const extension = format || baseUrl.split('.').pop()
  const urlWithoutExt = baseUrl.substring(0, baseUrl.lastIndexOf('.'))
  
  return widths
    .map(width => `${urlWithoutExt}-${width}w.${extension} ${width}w`)
    .join(', ')
}

// Generate sizes attribute for responsive images
export function generateSizes(breakpoints: { maxWidth: number; size: string }[]): string {
  return breakpoints
    .map(({ maxWidth, size }) => `(max-width: ${maxWidth}px) ${size}`)
    .join(', ')
}

// Calculate optimal image dimensions
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight
  
  let width = originalWidth
  let height = originalHeight
  
  if (width > maxWidth) {
    width = maxWidth
    height = width / aspectRatio
  }
  
  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height)
  }
}

// Get device pixel ratio
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1
  return window.devicePixelRatio || 1
}

// Calculate image quality based on network speed
export function getOptimalQuality(connectionType?: string): number {
  if (!connectionType) {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      connectionType = (navigator as any).connection?.effectiveType
    }
  }
  
  switch (connectionType) {
    case 'slow-2g':
    case '2g':
      return 60
    case '3g':
      return 70
    case '4g':
      return 85
    default:
      return 90
  }
}

// Preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// Batch preload images
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => preloadImage(url)))
}

// Lazy load image with Intersection Observer
export function lazyLoadImage(
  element: HTMLImageElement,
  src: string,
  srcset?: string
): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.src = src
            if (srcset) {
              element.srcset = srcset
            }
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px'
      }
    )
    
    observer.observe(element)
  } else {
    // Fallback for browsers without Intersection Observer
    element.src = src
    if (srcset) {
      element.srcset = srcset
    }
  }
}

// Image CDN URL builder
export class ImageCDN {
  private baseUrl: string
  
  constructor(baseUrl: string = 'https://images.propertychain.com') {
    this.baseUrl = baseUrl
  }
  
  build(
    path: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
      fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
      position?: string
      blur?: number
      sharpen?: number
      grayscale?: boolean
      rotate?: number
    } = {}
  ): string {
    const params = new URLSearchParams()
    
    if (options.width) params.append('w', options.width.toString())
    if (options.height) params.append('h', options.height.toString())
    if (options.quality) params.append('q', options.quality.toString())
    if (options.format) params.append('f', options.format)
    if (options.fit) params.append('fit', options.fit)
    if (options.position) params.append('pos', options.position)
    if (options.blur) params.append('blur', options.blur.toString())
    if (options.sharpen) params.append('sharp', options.sharpen.toString())
    if (options.grayscale) params.append('gray', '1')
    if (options.rotate) params.append('rot', options.rotate.toString())
    
    const queryString = params.toString()
    return `${this.baseUrl}/${path}${queryString ? `?${queryString}` : ''}`
  }
  
  thumbnail(path: string, size: number = 150): string {
    return this.build(path, {
      width: size,
      height: size,
      fit: 'cover',
      quality: 70
    })
  }
  
  responsive(path: string, widths: number[] = [320, 640, 768, 1024, 1280, 1920]): string {
    return widths
      .map(width => `${this.build(path, { width })} ${width}w`)
      .join(', ')
  }
}

// Progressive image loading
export class ProgressiveImage {
  private placeholder: string
  private src: string
  private srcset?: string
  
  constructor(src: string, placeholder: string, srcset?: string) {
    this.src = src
    this.placeholder = placeholder
    this.srcset = srcset
  }
  
  load(element: HTMLImageElement): void {
    // Set placeholder immediately
    element.src = this.placeholder
    element.classList.add('loading')
    
    // Load full image
    const fullImage = new Image()
    
    fullImage.onload = () => {
      element.src = this.src
      if (this.srcset) {
        element.srcset = this.srcset
      }
      element.classList.remove('loading')
      element.classList.add('loaded')
    }
    
    fullImage.src = this.src
  }
}

// Image optimization configuration
export interface ImageOptimizationConfig {
  formats: string[]
  widths: number[]
  quality: number
  lazy: boolean
  placeholder: 'blur' | 'color' | 'none'
  cdn: boolean
  cdnUrl?: string
}

export const defaultImageConfig: ImageOptimizationConfig = {
  formats: ['avif', 'webp', 'jpeg'],
  widths: [320, 640, 768, 1024, 1280, 1536, 1920, 2560],
  quality: 85,
  lazy: true,
  placeholder: 'blur',
  cdn: true,
  cdnUrl: process.env.NEXT_PUBLIC_IMAGE_CDN_URL || 'https://images.propertychain.com'
}

// Export all utilities
export default {
  detectImageFormat,
  supportsWebP,
  supportsAVIF,
  generateSrcSet,
  generateSizes,
  calculateOptimalDimensions,
  getDevicePixelRatio,
  getOptimalQuality,
  preloadImage,
  preloadImages,
  lazyLoadImage,
  ImageCDN,
  ProgressiveImage,
  defaultImageConfig
}