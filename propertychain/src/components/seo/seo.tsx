/**
 * SEO Component - PropertyChain
 * 
 * Dynamic meta tags and SEO optimization
 * Following UpdatedUIPlan.md Step 57 specifications and CLAUDE.md principles
 */

import { Metadata } from 'next'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  price?: {
    amount: number
    currency: string
  }
  availability?: 'for_sale' | 'sold' | 'pending'
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
  alternates?: {
    [locale: string]: string
  }
}

// Generate metadata for Next.js App Router
export function generateSEOMetadata({
  title = 'PropertyChain - Real Estate Tokenization Platform',
  description = 'Invest in real estate through blockchain tokenization. Secure, transparent, and accessible property investment for everyone.',
  keywords = ['real estate', 'tokenization', 'blockchain', 'investment', 'property', 'Web3'],
  image = 'https://propertychain.com/og-image.jpg',
  url = 'https://propertychain.com',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  price,
  availability,
  noindex = false,
  nofollow = false,
  canonical,
  alternates = {},
}: SEOProps): Metadata {
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'PropertyChain Team' }],
    creator: 'PropertyChain',
    publisher: 'PropertyChain',
    
    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: 'PropertyChain',
      type: type as any,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@propertychain',
      site: '@propertychain',
    },
    
    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Viewport
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    
    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    },
  }

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    }
  }

  // Add product-specific metadata (for properties)
  if (type === 'product' && price) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'website' as any, // Product metadata will be added via other tags
    }
    
    // Add price and availability as other metadata
    metadata.other = {
      'product:price:amount': price.amount.toString(),
      'product:price:currency': price.currency,
      'product:availability': availability || 'for_sale',
    }
  }

  // Add canonical URL
  if (canonical) {
    metadata.alternates = {
      ...metadata.alternates,
      canonical,
    }
  }

  // Add language alternates
  if (Object.keys(alternates).length > 0) {
    metadata.alternates = {
      ...metadata.alternates,
      languages: alternates,
    }
  }

  return metadata
}

// Property-specific SEO metadata
export function generatePropertySEOMetadata({
  propertyId,
  propertyName,
  propertyDescription,
  price,
  location,
  propertyType,
  bedrooms,
  bathrooms,
  squareFeet,
  images,
  availability = 'for_sale',
}: {
  propertyId: string
  propertyName: string
  propertyDescription: string
  price: number
  location: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  images: string[]
  availability?: 'for_sale' | 'sold' | 'pending'
}): Metadata {
  const title = `${propertyName} - ${location.city}, ${location.state} | PropertyChain`
  const description = `${propertyDescription}. ${bedrooms ? `${bedrooms} bedrooms, ` : ''}${bathrooms ? `${bathrooms} bathrooms, ` : ''}${squareFeet ? `${squareFeet} sq ft. ` : ''}Listed at $${price.toLocaleString()}.`
  
  return generateSEOMetadata({
    title,
    description,
    keywords: [
      'real estate',
      propertyType.toLowerCase(),
      location.city.toLowerCase(),
      location.state.toLowerCase(),
      'property investment',
      'tokenized real estate',
      'blockchain property',
    ],
    image: images[0] || 'https://propertychain.com/og-property-default.jpg',
    url: `https://propertychain.com/property/${propertyId}`,
    type: 'product',
    price: {
      amount: price,
      currency: 'USD',
    },
    availability,
  })
}

// User profile SEO metadata
export function generateProfileSEOMetadata({
  userId,
  userName,
  userBio,
  userImage,
  propertiesCount,
  investmentValue,
}: {
  userId: string
  userName: string
  userBio?: string
  userImage?: string
  propertiesCount: number
  investmentValue: number
}): Metadata {
  const title = `${userName} - PropertyChain Investor Profile`
  const description = userBio || `${userName} is an investor on PropertyChain with ${propertiesCount} properties and $${investmentValue.toLocaleString()} in investments.`
  
  return generateSEOMetadata({
    title,
    description,
    keywords: [
      'real estate investor',
      'property investor',
      'blockchain investor',
      'propertychain profile',
    ],
    image: userImage || 'https://propertychain.com/og-profile-default.jpg',
    url: `https://propertychain.com/profile/${userId}`,
    type: 'profile',
  })
}

// Blog/Article SEO metadata
export function generateArticleSEOMetadata({
  slug,
  title,
  excerpt,
  content,
  author,
  publishedAt,
  updatedAt,
  category,
  tags,
  featuredImage,
}: {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  featuredImage?: string
}): Metadata {
  // Calculate reading time (avg 200 words per minute)
  const wordCount = content.split(' ').length
  const readingTime = Math.ceil(wordCount / 200)
  
  const description = `${excerpt} (${readingTime} min read)`
  
  return generateSEOMetadata({
    title: `${title} | PropertyChain Blog`,
    description,
    keywords: [
      'real estate blog',
      'property investment',
      category.toLowerCase(),
      ...tags,
    ],
    image: featuredImage || 'https://propertychain.com/og-blog-default.jpg',
    url: `https://propertychain.com/blog/${slug}`,
    type: 'article',
    author,
    publishedTime: publishedAt,
    modifiedTime: updatedAt,
    section: category,
    tags,
  })
}