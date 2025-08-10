/**
 * Example Page with ISR - PropertyChain
 * 
 * Demonstrates Incremental Static Regeneration
 * Following UpdatedUIPlan.md Step 62 specifications and CLAUDE.md principles
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageISRConfig, STATIC_GENERATION } from '@/lib/cache/isr-config'
import { withCache, CACHE_CONFIG } from '@/lib/cache/redis'

// Type definitions
interface Property {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  location: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  yearBuilt: number
  features: string[]
  createdAt: string
  updatedAt: string
}

interface PageProps {
  params: {
    id: string
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await fetchProperty(params.id)
  
  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.'
    }
  }
  
  return {
    title: property.title,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images[0] ? [property.images[0]] : [],
      type: 'website'
    }
  }
}

/**
 * Generate static params for popular properties
 */
export async function generateStaticParams() {
  // Use the configuration from isr-config
  const params = await STATIC_GENERATION.properties.generateStaticParams()
  return params
}

/**
 * Property detail page component
 */
export default async function PropertyPage({ params }: PageProps) {
  const property = await fetchProperty(params.id)
  
  if (!property) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
      
      {/* Property images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {property.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${property.title} - Image ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg"
          />
        ))}
      </div>
      
      {/* Property details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 mb-6">{property.description}</p>
          
          <h3 className="text-xl font-semibold mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {property.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-3xl font-bold mb-4">
            ${property.price.toLocaleString()}
          </div>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{property.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Bedrooms:</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span>Bathrooms:</span>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex justify-between">
              <span>Square Feet:</span>
              <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Year Built:</span>
              <span className="font-medium">{property.yearBuilt}</span>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Schedule Viewing
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Fetch property data with caching
 */
async function fetchProperty(id: string): Promise<Property | null> {
  // Use Redis cache wrapper
  const property = await withCache(
    `property:${id}`,
    async () => {
      // Fetch from your API or database
      const response = await fetch(`${process.env.API_URL}/properties/${id}`, {
        next: {
          // ISR revalidation interval from config
          revalidate: getPageISRConfig(`/properties/${id}`) || 300,
          tags: ['properties', `property:${id}`]
        }
      })
      
      if (!response.ok) {
        return null
      }
      
      return response.json()
    },
    {
      ttl: CACHE_CONFIG.ttl.long, // Cache for 1 hour
      tags: ['properties', `property:${id}`]
    }
  )
  
  return property
}

/**
 * Configure ISR revalidation
 */
export const revalidate = getPageISRConfig('/properties/[id]') || 300 // Default 5 minutes

/**
 * Configure dynamic rendering
 */
export const dynamic = 'force-static' // Generate at build time, revalidate with ISR

/**
 * Configure runtime
 */
export const runtime = 'nodejs' // Use Node.js runtime for SSR/ISR