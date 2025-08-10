/**
 * SEO Components Export - PropertyChain
 * 
 * Central export for all SEO components and utilities
 * Following UpdatedUIPlan.md Step 57 specifications and CLAUDE.md principles
 */

// Export SEO components
export {
  generateSEOMetadata,
  generatePropertySEOMetadata,
  generateProfileSEOMetadata,
  generateArticleSEOMetadata,
  type SEOProps,
} from './seo'

// Export structured data components
export {
  StructuredData,
  PropertyStructuredData,
  OrganizationStructuredData,
  generateOrganizationSchema,
  generateRealEstateListingSchema,
  generateArticleSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  type OrganizationSchema,
  type RealEstateListingSchema,
  type ArticleSchema,
  type WebsiteSchema,
  type BreadcrumbSchema,
  type FAQSchema,
} from './structured-data'

// Re-export utilities
export * from '@/lib/seo/utils'

// Export default for convenience
export { default as SEOUtils } from '@/lib/seo/utils'