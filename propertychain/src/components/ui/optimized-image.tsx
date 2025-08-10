/**
 * Optimized Image Component - PropertyChain
 * 
 * Next.js Image with automatic optimization
 * Following UpdatedUIPlan.md Step 61 specifications and CLAUDE.md principles
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  showSkeleton?: boolean
  aspectRatio?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  fadeIn?: boolean
  lazy?: boolean
  priority?: boolean
  blurDataURL?: string
  generateBlur?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  showSkeleton = true,
  aspectRatio,
  objectFit = 'cover',
  fadeIn = true,
  lazy = true,
  priority = false,
  blurDataURL,
  generateBlur = true,
  className,
  width,
  height,
  sizes = '100vw',
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number | null>(null)

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src)
    setHasError(false)
    setIsLoading(true)
  }, [src])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setNaturalAspectRatio(img.naturalWidth / img.naturalHeight)
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }

  // Calculate dimensions
  const getDimensions = () => {
    if (width && height) {
      return { width, height }
    }

    if (width && aspectRatio) {
      return {
        width,
        height: Number(width) / aspectRatio
      }
    }

    if (height && aspectRatio) {
      return {
        width: Number(height) * aspectRatio,
        height
      }
    }

    // Default dimensions
    return {
      width: width || 800,
      height: height || 600
    }
  }

  const { width: imgWidth, height: imgHeight } = getDimensions()

  // Generate sizes for responsive images
  const generateSizes = () => {
    if (sizes) return sizes

    // Generate responsive sizes based on width
    if (typeof imgWidth === 'number') {
      if (imgWidth <= 640) return '100vw'
      if (imgWidth <= 768) return '(max-width: 640px) 100vw, 640px'
      if (imgWidth <= 1024) return '(max-width: 768px) 100vw, (max-width: 1024px) 768px, 1024px'
      return '(max-width: 640px) 100vw, (max-width: 768px) 640px, (max-width: 1024px) 768px, 1024px'
    }

    return '100vw'
  }

  // Container styles for aspect ratio
  const containerStyles = aspectRatio
    ? {
        position: 'relative' as const,
        width: '100%',
        paddingBottom: `${(1 / aspectRatio) * 100}%`
      }
    : undefined

  const imageStyles = aspectRatio
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit
      }
    : { objectFit }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={containerStyles}
    >
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <Skeleton
          className={cn(
            'absolute inset-0 z-10',
            aspectRatio ? '' : 'w-full h-full'
          )}
        />
      )}

      {/* Main image */}
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        sizes={generateSizes()}
        quality={quality}
        priority={priority}
        loading={lazy ? 'lazy' : 'eager'}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          fadeIn && 'transition-opacity duration-300',
          isLoading && fadeIn ? 'opacity-0' : 'opacity-100',
          aspectRatio ? 'absolute inset-0' : '',
          className
        )}
        style={imageStyles}
      />

      {/* Error state */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Image not available</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Responsive image component with art direction
interface ResponsiveImageProps {
  sources: {
    media?: string
    srcSet: string
    sizes?: string
    type?: string
  }[]
  fallback: OptimizedImageProps
}

export function ResponsiveImage({ sources, fallback }: ResponsiveImageProps) {
  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          media={source.media}
          srcSet={source.srcSet}
          sizes={source.sizes}
          type={source.type}
        />
      ))}
      <OptimizedImage {...fallback} />
    </picture>
  )
}

// Property image with optimizations
interface PropertyImageProps extends Omit<OptimizedImageProps, 'src' | 'alt'> {
  propertyName: string
  imageUrl: string
  size?: 'thumbnail' | 'card' | 'hero' | 'full'
}

export function PropertyImage({
  propertyName,
  imageUrl,
  size = 'card',
  ...props
}: PropertyImageProps) {
  const sizeConfig = {
    thumbnail: {
      width: 150,
      height: 150,
      sizes: '150px',
      quality: 70
    },
    card: {
      width: 400,
      height: 300,
      sizes: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px',
      quality: 80
    },
    hero: {
      width: 1920,
      height: 800,
      sizes: '100vw',
      quality: 90,
      priority: true
    },
    full: {
      width: 1920,
      height: 1080,
      sizes: '100vw',
      quality: 85
    }
  }

  const config = sizeConfig[size]

  return (
    <OptimizedImage
      src={imageUrl}
      alt={`Property image of ${propertyName}`}
      {...config}
      {...props}
      aspectRatio={config.width / config.height}
      objectFit="cover"
    />
  )
}

// Gallery image with lightbox support
interface GalleryImageProps extends OptimizedImageProps {
  thumbnailSrc?: string
  onClick?: () => void
}

export function GalleryImage({
  thumbnailSrc,
  onClick,
  ...props
}: GalleryImageProps) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer overflow-hidden rounded-lg"
      type="button"
    >
      <OptimizedImage
        {...props}
        className={cn(
          'transition-transform duration-300 group-hover:scale-105',
          props.className
        )}
      />
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
        <svg
          className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </div>
    </button>
  )
}

export default OptimizedImage