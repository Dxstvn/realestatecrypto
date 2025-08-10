/**
 * Structured Data Component - PropertyChain
 * 
 * JSON-LD structured data for SEO
 * Following UpdatedUIPlan.md Step 57 specifications and CLAUDE.md principles
 */

'use client'

import Script from 'next/script'

// Organization schema
export interface OrganizationSchema {
  name: string
  url: string
  logo: string
  description: string
  foundingDate?: string
  founders?: Array<{
    name: string
    url?: string
  }>
  contactPoint?: {
    telephone: string
    contactType: string
    areaServed?: string
    availableLanguage?: string[]
  }
  sameAs?: string[]
}

// Real Estate Listing schema
export interface RealEstateListingSchema {
  name: string
  description: string
  url: string
  image: string[]
  price: number
  priceCurrency: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  numberOfRooms?: number
  numberOfBedrooms?: number
  numberOfBathrooms?: number
  floorSize?: {
    value: number
    unitCode: string
  }
  yearBuilt?: number
  propertyType?: string
  amenityFeature?: Array<{
    name: string
    value?: boolean
  }>
  additionalProperty?: Array<{
    name: string
    value: string | number
  }>
}

// Article schema
export interface ArticleSchema {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
  mainEntityOfPage: string
  keywords?: string[]
  articleSection?: string
  wordCount?: number
}

// Website schema
export interface WebsiteSchema {
  name: string
  url: string
  description: string
  potentialAction?: {
    target: string
    queryInput: string
  }
}

// Breadcrumb schema
export interface BreadcrumbSchema {
  items: Array<{
    name: string
    url: string
  }>
}

// FAQ schema
export interface FAQSchema {
  questions: Array<{
    question: string
    answer: string
  }>
}

// Generate Organization JSON-LD
export function generateOrganizationSchema(data: OrganizationSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    foundingDate: data.foundingDate,
    founders: data.founders?.map(founder => ({
      '@type': 'Person',
      name: founder.name,
      url: founder.url,
    })),
    contactPoint: data.contactPoint ? {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      contactType: data.contactPoint.contactType,
      areaServed: data.contactPoint.areaServed,
      availableLanguage: data.contactPoint.availableLanguage,
    } : undefined,
    sameAs: data.sameAs,
  }
}

// Generate Real Estate Listing JSON-LD
export function generateRealEstateListingSchema(data: RealEstateListingSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.priceCurrency,
      availability: `https://schema.org/${data.availability || 'InStock'}`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    geo: data.geo ? {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    } : undefined,
    numberOfRooms: data.numberOfRooms,
    numberOfBedrooms: data.numberOfBedrooms,
    numberOfBathrooms: data.numberOfBathrooms,
    floorSize: data.floorSize ? {
      '@type': 'QuantitativeValue',
      value: data.floorSize.value,
      unitCode: data.floorSize.unitCode,
    } : undefined,
    yearBuilt: data.yearBuilt,
    propertyType: data.propertyType,
    amenityFeature: data.amenityFeature?.map(feature => ({
      '@type': 'LocationFeatureSpecification',
      name: feature.name,
      value: feature.value,
    })),
    additionalProperty: data.additionalProperty?.map(prop => ({
      '@type': 'PropertyValue',
      name: prop.name,
      value: prop.value,
    })),
  }
}

// Generate Article JSON-LD
export function generateArticleSchema(data: ArticleSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.mainEntityOfPage,
    },
    keywords: data.keywords?.join(', '),
    articleSection: data.articleSection,
    wordCount: data.wordCount,
  }
}

// Generate Website JSON-LD with search
export function generateWebsiteSchema(data: WebsiteSchema): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
  }

  if (data.potentialAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: data.potentialAction.target,
      'query-input': data.potentialAction.queryInput,
    }
  }

  return schema
}

// Generate Breadcrumb JSON-LD
export function generateBreadcrumbSchema(data: BreadcrumbSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Generate FAQ JSON-LD
export function generateFAQSchema(data: FAQSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(qa => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    })),
  }
}

// Structured Data Component
export function StructuredData({ data }: { data: object | object[] }) {
  const jsonLd = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  )
}

// Property Structured Data Component
export function PropertyStructuredData({
  property,
}: {
  property: RealEstateListingSchema
}) {
  const schemas = [
    generateRealEstateListingSchema(property),
    generateBreadcrumbSchema({
      items: [
        { name: 'Home', url: 'https://propertychain.com' },
        { name: 'Properties', url: 'https://propertychain.com/properties' },
        { name: property.name, url: property.url },
      ],
    }),
  ]

  return <StructuredData data={schemas} />
}

// Organization Structured Data (for homepage)
export function OrganizationStructuredData() {
  const schema = generateOrganizationSchema({
    name: 'PropertyChain',
    url: 'https://propertychain.com',
    logo: 'https://propertychain.com/logo.png',
    description: 'Real estate tokenization platform enabling fractional property investment through blockchain technology.',
    foundingDate: '2023',
    contactPoint: {
      telephone: '+1-555-0123',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://twitter.com/propertychain',
      'https://linkedin.com/company/propertychain',
      'https://github.com/propertychain',
    ],
  })

  const websiteSchema = generateWebsiteSchema({
    name: 'PropertyChain',
    url: 'https://propertychain.com',
    description: 'Real estate tokenization platform',
    potentialAction: {
      target: 'https://propertychain.com/search?q={search_term_string}',
      queryInput: 'required name=search_term_string',
    },
  })

  return <StructuredData data={[schema, websiteSchema]} />
}

// Export all schemas
export default StructuredData