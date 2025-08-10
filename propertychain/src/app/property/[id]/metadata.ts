/**
 * Property Page Metadata - PropertyChain
 * 
 * Example of dynamic metadata generation for property pages
 * Following UpdatedUIPlan.md Step 57 specifications and CLAUDE.md principles
 */

import { Metadata } from 'next'
import { generatePropertySEOMetadata, generateOGImageUrl } from '@/components/seo'

// Mock function - replace with actual API call
async function getProperty(id: string) {
  // This would fetch from your database
  return {
    id,
    name: 'Modern Downtown Condo',
    description: 'Luxurious 2-bedroom condo in the heart of downtown with stunning city views',
    price: 850000,
    location: {
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      zipCode: '94105',
    },
    propertyType: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    images: [
      'https://propertychain.com/images/property1.jpg',
      'https://propertychain.com/images/property2.jpg',
    ],
    availability: 'for_sale' as const,
    yearBuilt: 2020,
    amenities: ['Gym', 'Pool', 'Parking', 'Security'],
    virtualTourUrl: 'https://propertychain.com/tours/property1',
    updatedAt: new Date('2024-01-15'),
  }
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.id)
  
  // Generate dynamic OG image
  const ogImage = generateOGImageUrl({
    type: 'property',
    title: property.name,
    price: property.price.toString(),
    location: `${property.location.city}, ${property.location.state}`,
    beds: property.bedrooms.toString(),
    baths: property.bathrooms.toString(),
    sqft: property.squareFeet.toString(),
    image: property.images[0],
  })
  
  const metadata = generatePropertySEOMetadata({
    propertyId: property.id,
    propertyName: property.name,
    propertyDescription: property.description,
    price: property.price,
    location: property.location,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    squareFeet: property.squareFeet,
    images: [ogImage, ...property.images],
    availability: property.availability,
  })
  
  // Add additional metadata
  return {
    ...metadata,
    alternates: {
      canonical: `https://propertychain.com/property/${property.id}`,
    },
    other: {
      'property:type': property.propertyType,
      'property:bedrooms': property.bedrooms.toString(),
      'property:bathrooms': property.bathrooms.toString(),
      'property:square_feet': property.squareFeet.toString(),
      'property:year_built': property.yearBuilt.toString(),
      'property:amenities': property.amenities.join(', '),
      'property:virtual_tour': property.virtualTourUrl,
    },
  }
}