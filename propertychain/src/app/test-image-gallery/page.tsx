/**
 * Test Page for Image Gallery Component
 * 
 * Tests all features of the ImageGallery component:
 * - Swiper carousel functionality
 * - Lightbox with zoom
 * - Lazy loading
 * - Touch gestures
 * - Different variants
 */

'use client'

import { useState } from 'react'
import { ImageGallery, type GalleryImage } from '@/components/custom/image-gallery'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock property images
const mockPropertyImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&h=200&fit=crop',
    alt: 'Modern house exterior',
    title: 'Front View',
    description: 'Beautiful modern house with landscaped front yard',
    width: 1600,
    height: 900,
    tags: ['exterior', 'front'],
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop',
    alt: 'Luxury pool area',
    title: 'Pool & Backyard',
    description: 'Resort-style pool with outdoor entertainment area',
    width: 1600,
    height: 900,
    tags: ['exterior', 'pool'],
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop',
    alt: 'Modern living room',
    title: 'Living Room',
    description: 'Spacious living room with floor-to-ceiling windows',
    width: 1600,
    height: 900,
    tags: ['interior', 'living room'],
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=200&fit=crop',
    alt: 'Master bedroom',
    title: 'Master Bedroom',
    description: 'Luxurious master bedroom with en-suite bathroom',
    width: 1600,
    height: 900,
    tags: ['interior', 'bedroom'],
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=200&h=200&fit=crop',
    alt: 'Gourmet kitchen',
    title: 'Kitchen',
    description: 'Chef-inspired kitchen with premium appliances',
    width: 1600,
    height: 900,
    tags: ['interior', 'kitchen'],
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=200&h=200&fit=crop',
    alt: 'Home office',
    title: 'Home Office',
    description: 'Professional home office with built-in shelving',
    width: 1600,
    height: 900,
    tags: ['interior', 'office'],
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&h=200&fit=crop',
    alt: 'Bathroom',
    title: 'Master Bathroom',
    description: 'Spa-like bathroom with soaking tub',
    width: 1600,
    height: 900,
    tags: ['interior', 'bathroom'],
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop',
    alt: 'Aerial view',
    title: 'Aerial View',
    description: 'Bird\'s eye view of the entire property',
    width: 1600,
    height: 900,
    tags: ['exterior', 'aerial'],
  },
]

// Minimal image set for testing
const minimalImages = mockPropertyImages.slice(0, 3)

// Single image for edge case testing
const singleImage = [mockPropertyImages[0]]

export default function TestImageGallery() {
  const [showThumbnails, setShowThumbnails] = useState(true)
  const [showFullscreenButton, setShowFullscreenButton] = useState(true)
  const [showDownloadButton, setShowDownloadButton] = useState(true)
  const [showShareButton, setShowShareButton] = useState(true)
  const [showFavoriteButton, setShowFavoriteButton] = useState(true)
  const [enableZoom, setEnableZoom] = useState(true)
  const [enableLazyLoad, setEnableLazyLoad] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)

  const handleImageClick = (image: GalleryImage, index: number) => {
    console.log('Image clicked:', image, 'at index:', index)
    toast.info(`Clicked: ${image.title || image.alt}`)
  }

  const handleDownload = (image: GalleryImage) => {
    console.log('Download image:', image)
    toast.success(`Downloading: ${image.title || image.alt}`)
  }

  const handleShare = (image: GalleryImage) => {
    console.log('Share image:', image)
    toast.info(`Sharing: ${image.title || image.alt}`)
  }

  const handleFavorite = (image: GalleryImage) => {
    console.log('Favorite image:', image)
    toast.success(`Added to favorites: ${image.title || image.alt}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Image Gallery Component Test</h1>
        <p className="text-gray-600">
          Testing Swiper carousel, lightbox, lazy loading, and touch gestures
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="thumbnails"
                checked={showThumbnails}
                onCheckedChange={setShowThumbnails}
              />
              <Label htmlFor="thumbnails">Show Thumbnails</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="fullscreen"
                checked={showFullscreenButton}
                onCheckedChange={setShowFullscreenButton}
              />
              <Label htmlFor="fullscreen">Fullscreen Button</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="download"
                checked={showDownloadButton}
                onCheckedChange={setShowDownloadButton}
              />
              <Label htmlFor="download">Download Button</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="share"
                checked={showShareButton}
                onCheckedChange={setShowShareButton}
              />
              <Label htmlFor="share">Share Button</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="favorite"
                checked={showFavoriteButton}
                onCheckedChange={setShowFavoriteButton}
              />
              <Label htmlFor="favorite">Favorite Button</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="zoom"
                checked={enableZoom}
                onCheckedChange={setEnableZoom}
              />
              <Label htmlFor="zoom">Enable Zoom</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="lazy"
                checked={enableLazyLoad}
                onCheckedChange={setEnableLazyLoad}
              />
              <Label htmlFor="lazy">Lazy Loading</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoplay"
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
              />
              <Label htmlFor="autoplay">Auto Play</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Tests */}
      <Tabs defaultValue="default" className="space-y-4">
        <TabsList>
          <TabsTrigger value="default">Default Gallery</TabsTrigger>
          <TabsTrigger value="compact">Compact Variant</TabsTrigger>
          <TabsTrigger value="minimal">Minimal Variant</TabsTrigger>
          <TabsTrigger value="single">Single Image</TabsTrigger>
          <TabsTrigger value="empty">Empty State</TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Gallery (8 Images)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={mockPropertyImages}
                showThumbnails={showThumbnails}
                showFullscreenButton={showFullscreenButton}
                showDownloadButton={showDownloadButton}
                showShareButton={showShareButton}
                showFavoriteButton={showFavoriteButton}
                enableZoom={enableZoom}
                enableLazyLoad={enableLazyLoad}
                autoPlay={autoPlay}
                autoPlayInterval={3000}
                onImageClick={handleImageClick}
                onDownload={handleDownload}
                onShare={handleShare}
                onFavorite={handleFavorite}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compact Variant</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={minimalImages}
                variant="compact"
                showThumbnails={showThumbnails}
                showFullscreenButton={showFullscreenButton}
                enableZoom={enableZoom}
                enableLazyLoad={enableLazyLoad}
                onImageClick={handleImageClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minimal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minimal Variant (No Thumbnails)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={minimalImages}
                variant="minimal"
                showFullscreenButton={showFullscreenButton}
                enableZoom={enableZoom}
                onImageClick={handleImageClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Single Image (Edge Case)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={singleImage}
                showThumbnails={false}
                showFullscreenButton={showFullscreenButton}
                showFavoriteButton={showFavoriteButton}
                enableZoom={enableZoom}
                onImageClick={handleImageClick}
                onFavorite={handleFavorite}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={[]}
                showThumbnails={showThumbnails}
                showFullscreenButton={showFullscreenButton}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>• Click on images to open the lightbox</p>
          <p>• Use arrow keys to navigate in lightbox</p>
          <p>• Press ESC to close lightbox</p>
          <p>• Use +/- keys to zoom in lightbox</p>
          <p>• Press R to rotate image in lightbox</p>
          <p>• Swipe on mobile to navigate images</p>
          <p>• Pinch to zoom on touch devices</p>
          <p>• Click thumbnails to jump to specific images</p>
        </CardContent>
      </Card>
    </div>
  )
}