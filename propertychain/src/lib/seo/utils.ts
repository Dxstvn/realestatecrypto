/**
 * SEO Utilities - PropertyChain
 * 
 * Helper functions for SEO optimization
 * Following UpdatedUIPlan.md Step 57 specifications and CLAUDE.md principles
 */

// Generate canonical URL
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertychain.com'
  // Remove trailing slash and query parameters
  const cleanPath = path.split('?')[0].replace(/\/$/, '')
  return `${baseUrl}${cleanPath}`
}

// Generate alternate language URLs
export function generateAlternateUrls(
  path: string,
  locales: string[] = ['en', 'es', 'fr', 'de', 'zh', 'ja']
): Record<string, string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertychain.com'
  const alternates: Record<string, string> = {}
  
  locales.forEach(locale => {
    if (locale === 'en') {
      alternates[locale] = `${baseUrl}${path}`
    } else {
      alternates[locale] = `${baseUrl}/${locale}${path}`
    }
  })
  
  return alternates
}

// Truncate text for meta descriptions
export function truncateDescription(
  text: string,
  maxLength: number = 160
): string {
  if (text.length <= maxLength) return text
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

// Generate keywords from text
export function generateKeywords(
  text: string,
  additionalKeywords: string[] = []
): string[] {
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  ])
  
  // Extract words from text
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
  
  // Count word frequency
  const wordFreq = new Map<string, number>()
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })
  
  // Sort by frequency and get top keywords
  const topKeywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
  
  // Combine with additional keywords
  const keywordSet = new Set([...additionalKeywords, ...topKeywords])
  const allKeywords = Array.from(keywordSet)
  
  return allKeywords.slice(0, 15) // Return max 15 keywords
}

// Format price for structured data
export function formatPrice(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Generate reading time
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Sanitize text for meta tags
export function sanitizeMetaText(text: string): string {
  return text
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Generate breadcrumb path
export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertychain.com'
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl }
  ]
  
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Format segment name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      url: `${baseUrl}${currentPath}`
    })
  })
  
  return breadcrumbs
}

// Check if URL should be indexed
export function shouldIndexPage(pathname: string): boolean {
  const noIndexPatterns = [
    /^\/api\//,
    /^\/admin\//,
    /^\/dashboard\//,
    /^\/auth\//,
    /^\/settings\//,
    /^\/transactions\//,
    /^\/404/,
    /^\/500/,
    /\?/,  // Pages with query parameters
  ]
  
  return !noIndexPatterns.some(pattern => pattern.test(pathname))
}

// Generate social media share URLs
export function generateShareUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = description ? encodeURIComponent(description) : ''
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  }
}

// Validate and format property address for SEO
export function formatPropertyAddress(address: {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country?: string
}): string {
  const parts = [
    address.streetAddress,
    address.city,
    address.state,
    address.zipCode,
    address.country || 'USA'
  ].filter(Boolean)
  
  return parts.join(', ')
}

// Generate property SEO title
export function generatePropertyTitle(property: {
  type: string
  bedrooms?: number
  bathrooms?: number
  city: string
  state: string
  price: number
}): string {
  const parts = []
  
  if (property.bedrooms) {
    parts.push(`${property.bedrooms} Bed`)
  }
  if (property.bathrooms) {
    parts.push(`${property.bathrooms} Bath`)
  }
  
  parts.push(property.type)
  parts.push(`in ${property.city}, ${property.state}`)
  parts.push(`- $${property.price.toLocaleString()}`)
  
  return parts.join(' ')
}

// Generate Open Graph image URL
export function generateOGImageUrl(params: Record<string, string>): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertychain.com'
  const searchParams = new URLSearchParams(params)
  return `${baseUrl}/api/og?${searchParams.toString()}`
}

// Format date for structured data
export function formatISODate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toISOString()
}

// Check if content is fresh for SEO
export function isContentFresh(lastModified: Date | string, daysThreshold: number = 90): boolean {
  const modified = typeof lastModified === 'string' ? new Date(lastModified) : lastModified
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= daysThreshold
}

// Generate schema.org property type
export function getSchemaPropertyType(propertyType: string): string {
  const typeMap: Record<string, string> = {
    'house': 'House',
    'apartment': 'Apartment',
    'condo': 'Condominium',
    'townhouse': 'Townhouse',
    'land': 'Land',
    'commercial': 'CommercialProperty',
    'office': 'OfficeBuilding',
    'retail': 'RetailStore',
    'industrial': 'IndustrialProperty',
    'multi-family': 'MultiFamily',
  }
  
  return typeMap[propertyType.toLowerCase()] || 'RealEstateListing'
}

// SEO score calculator
export function calculateSEOScore(params: {
  hasTitle: boolean
  titleLength: number
  hasDescription: boolean
  descriptionLength: number
  hasKeywords: boolean
  keywordCount: number
  hasOGImage: boolean
  hasStructuredData: boolean
  hasCanonical: boolean
  contentLength: number
  hasH1: boolean
  imageCount: number
  hasAltTags: boolean
}): number {
  let score = 0
  const maxScore = 100
  
  // Title (20 points)
  if (params.hasTitle) {
    score += 10
    if (params.titleLength >= 30 && params.titleLength <= 60) {
      score += 10
    } else if (params.titleLength < 30 || params.titleLength > 70) {
      score += 5
    }
  }
  
  // Description (20 points)
  if (params.hasDescription) {
    score += 10
    if (params.descriptionLength >= 120 && params.descriptionLength <= 160) {
      score += 10
    } else if (params.descriptionLength < 120 || params.descriptionLength > 200) {
      score += 5
    }
  }
  
  // Keywords (10 points)
  if (params.hasKeywords && params.keywordCount >= 5) {
    score += 10
  } else if (params.hasKeywords) {
    score += 5
  }
  
  // Open Graph (10 points)
  if (params.hasOGImage) {
    score += 10
  }
  
  // Structured Data (15 points)
  if (params.hasStructuredData) {
    score += 15
  }
  
  // Canonical URL (10 points)
  if (params.hasCanonical) {
    score += 10
  }
  
  // Content (10 points)
  if (params.contentLength >= 300) {
    score += 10
  } else if (params.contentLength >= 150) {
    score += 5
  }
  
  // H1 Tag (5 points)
  if (params.hasH1) {
    score += 5
  }
  
  return Math.min(score, maxScore)
}

export default {
  generateCanonicalUrl,
  generateAlternateUrls,
  truncateDescription,
  generateKeywords,
  formatPrice,
  calculateReadingTime,
  sanitizeMetaText,
  generateBreadcrumbs,
  shouldIndexPage,
  generateShareUrls,
  formatPropertyAddress,
  generatePropertyTitle,
  generateOGImageUrl,
  formatISODate,
  isContentFresh,
  getSchemaPropertyType,
  calculateSEOScore,
}