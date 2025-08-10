/**
 * Sitemap Generation - PropertyChain
 * 
 * Dynamic sitemap generation for SEO
 * Following UpdatedUIPlan.md Step 57 specifications and CLAUDE.md principles
 */

import { MetadataRoute } from 'next'

// Mock function to get dynamic data - replace with actual API calls
async function getProperties() {
  // This would fetch from your database
  return [
    { id: '1', updatedAt: new Date('2024-01-15') },
    { id: '2', updatedAt: new Date('2024-01-16') },
    { id: '3', updatedAt: new Date('2024-01-17') },
  ]
}

async function getBlogPosts() {
  // This would fetch from your CMS or database
  return [
    { slug: 'introduction-to-tokenization', updatedAt: new Date('2024-01-10') },
    { slug: 'how-to-invest-in-real-estate', updatedAt: new Date('2024-01-12') },
    { slug: 'blockchain-in-real-estate', updatedAt: new Date('2024-01-14') },
  ]
}

async function getUsers() {
  // This would fetch public user profiles
  return [
    { id: 'user1', updatedAt: new Date('2024-01-10') },
    { id: 'user2', updatedAt: new Date('2024-01-11') },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertychain.com'
  
  // Fetch dynamic data
  const [properties, blogPosts, users] = await Promise.all([
    getProperties(),
    getBlogPosts(),
    getUsers(),
  ])
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
  
  // Property pages
  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/property/${property.id}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
  
  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  
  // User profile pages (only public profiles)
  const userPages: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${baseUrl}/profile/${user.id}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))
  
  // Combine all pages
  return [
    ...staticPages,
    ...propertyPages,
    ...blogPages,
    ...userPages,
  ]
}

// Robots.txt configuration
export function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://propertychain.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/static/',
          '/*.json$',
          '/*?*', // Query parameters
          '/404',
          '/500',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}