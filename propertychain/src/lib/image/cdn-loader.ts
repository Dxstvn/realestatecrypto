/**
 * CDN Image Loader - PropertyChain
 * 
 * Custom image loader for Next.js with CDN integration
 * Following UpdatedUIPlan.md Step 61 specifications and CLAUDE.md principles
 */

interface ImageLoaderProps {
  src: string
  width: number
  quality?: number
}

/**
 * Custom image loader for CDN integration
 * Supports multiple CDN providers
 */
export default function cdnLoader({ src, width, quality }: ImageLoaderProps): string {
  // Get CDN configuration from environment
  const cdnUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || 'https://images.propertychain.com'
  const cdnProvider = process.env.NEXT_PUBLIC_IMAGE_CDN_PROVIDER || 'cloudinary'
  
  // Handle absolute URLs (external images)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // For external images, use proxy through our CDN
    return buildCdnUrl(cdnUrl, cdnProvider, src, width, quality, true)
  }
  
  // Handle relative URLs (local images)
  const imagePath = src.startsWith('/') ? src.slice(1) : src
  return buildCdnUrl(cdnUrl, cdnProvider, imagePath, width, quality, false)
}

/**
 * Build CDN URL based on provider
 */
function buildCdnUrl(
  cdnUrl: string,
  provider: string,
  src: string,
  width: number,
  quality?: number,
  isExternal: boolean = false
): string {
  const q = quality || 85
  
  switch (provider) {
    case 'cloudinary':
      return buildCloudinaryUrl(cdnUrl, src, width, q, isExternal)
    
    case 'imgix':
      return buildImgixUrl(cdnUrl, src, width, q, isExternal)
    
    case 'cloudflare':
      return buildCloudflareUrl(cdnUrl, src, width, q, isExternal)
    
    case 'bunny':
      return buildBunnyUrl(cdnUrl, src, width, q, isExternal)
    
    case 'custom':
    default:
      return buildCustomUrl(cdnUrl, src, width, q, isExternal)
  }
}

/**
 * Cloudinary URL builder
 */
function buildCloudinaryUrl(
  baseUrl: string,
  src: string,
  width: number,
  quality: number,
  isExternal: boolean
): string {
  const transformations = [
    `w_${width}`,
    `q_${quality}`,
    'c_limit',
    'f_auto',
    'dpr_auto'
  ]
  
  if (isExternal) {
    // For external images, use fetch transformation
    const encodedUrl = encodeURIComponent(src)
    return `${baseUrl}/image/fetch/${transformations.join(',')}/${encodedUrl}`
  }
  
  // For local images
  return `${baseUrl}/image/upload/${transformations.join(',')}/propertychain/${src}`
}

/**
 * Imgix URL builder
 */
function buildImgixUrl(
  baseUrl: string,
  src: string,
  width: number,
  quality: number,
  isExternal: boolean
): string {
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    auto: 'format,compress',
    fit: 'max',
    dpr: 'auto'
  })
  
  if (isExternal) {
    params.append('url', src)
    return `${baseUrl}/proxy?${params.toString()}`
  }
  
  return `${baseUrl}/${src}?${params.toString()}`
}

/**
 * Cloudflare Images URL builder
 */
function buildCloudflareUrl(
  baseUrl: string,
  src: string,
  width: number,
  quality: number,
  isExternal: boolean
): string {
  const variant = getCloudflareVariant(width)
  
  if (isExternal) {
    // Cloudflare doesn't support external image proxy directly
    // Use custom endpoint
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: quality.toString()
    })
    return `${baseUrl}/cdn-cgi/image/${params.toString()}`
  }
  
  // For local images, use variant system
  return `${baseUrl}/cdn-cgi/image/width=${width},quality=${quality},format=auto/${src}`
}

/**
 * BunnyCDN URL builder
 */
function buildBunnyUrl(
  baseUrl: string,
  src: string,
  width: number,
  quality: number,
  isExternal: boolean
): string {
  const params = new URLSearchParams({
    width: width.toString(),
    quality: quality.toString(),
    format: 'auto'
  })
  
  if (isExternal) {
    params.append('url', src)
    return `${baseUrl}/pullzone?${params.toString()}`
  }
  
  return `${baseUrl}/${src}?${params.toString()}`
}

/**
 * Custom/Generic CDN URL builder
 */
function buildCustomUrl(
  baseUrl: string,
  src: string,
  width: number,
  quality: number,
  isExternal: boolean
): string {
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    f: 'auto'
  })
  
  if (isExternal) {
    params.append('url', src)
    return `${baseUrl}/optimize?${params.toString()}`
  }
  
  return `${baseUrl}/${src}?${params.toString()}`
}

/**
 * Get Cloudflare variant based on width
 */
function getCloudflareVariant(width: number): string {
  if (width <= 320) return 'small'
  if (width <= 640) return 'medium'
  if (width <= 1024) return 'large'
  if (width <= 1920) return 'xlarge'
  return 'original'
}

/**
 * Validate image source
 */
export function validateImageSource(src: string): boolean {
  // Check for malicious patterns
  const maliciousPatterns = [
    /javascript:/i,
    /data:text\/html/i,
    /<script/i,
    /onclick=/i,
    /onerror=/i
  ]
  
  return !maliciousPatterns.some(pattern => pattern.test(src))
}

/**
 * Get optimized image URL with format detection
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
): string {
  const {
    width = 1920,
    quality = 85,
    format = 'auto'
  } = options
  
  // Validate source
  if (!validateImageSource(src)) {
    console.error('Invalid image source detected:', src)
    return '/images/placeholder.jpg'
  }
  
  // Use the CDN loader
  return cdnLoader({ src, width, quality })
}

/**
 * Preload critical images through CDN
 */
export function preloadCriticalImages(images: string[]): void {
  if (typeof window === 'undefined') return
  
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedImageUrl(src, { width: 1920, quality: 90 })
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
  })
}