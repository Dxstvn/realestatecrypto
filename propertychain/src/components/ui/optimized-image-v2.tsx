/**
 * Optimized Image Component - PropertyLend
 * Phase 3.2: Performance Optimizations
 * 
 * Features:
 * - Lazy loading with loading="lazy"
 * - WebP format with fallbacks
 * - Blur placeholder during loading
 * - Responsive srcSet
 * - Intersection Observer for visibility
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  fallbackSrc?: string
}

// Generate blur placeholder
const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Create a gradient blur effect
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#6366f1')
    gradient.addColorStop(1, '#8b5cf6')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  return canvas.toDataURL()
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes,
  objectFit = 'cover',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  fallbackSrc = '/images/placeholder.jpg'
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imageRef.current) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    )

    observer.observe(imageRef.current)

    return () => observer.disconnect()
  }, [priority])

  // Generate WebP URL if supported
  const getOptimizedSrc = (originalSrc: string): string => {
    // Check if browser supports WebP
    if (typeof window !== 'undefined' && window.navigator) {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const isWebPSupported = canvas.toDataURL('image/webp').indexOf('image/webp') === 5
      
      if (isWebPSupported && !originalSrc.includes('.webp')) {
        // Convert to WebP URL if using a CDN that supports it
        if (originalSrc.includes('unsplash.com')) {
          return `${originalSrc}&fm=webp`
        }
        // For local images, assume WebP version exists
        if (originalSrc.startsWith('/')) {
          return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')
        }
      }
    }
    return originalSrc
  }

  const optimizedSrc = getOptimizedSrc(imageSrc)

  // Generate responsive sizes if not provided
  const defaultSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    (max-width: 1280px) 33vw,
    25vw
  `

  // Handle image error
  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || (typeof window !== 'undefined' ? generateBlurDataURL() : undefined)

  if (!isInView) {
    // Render placeholder while not in view
    return (
      <div
        ref={imageRef}
        className={cn(
          'bg-gray-200 dark:bg-gray-800 animate-pulse',
          className
        )}
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
        aria-label={`Loading ${alt}`}
      />
    )
  }

  return (
    <div
      ref={imageRef}
      className={cn(
        'relative overflow-hidden',
        !isLoaded && 'animate-pulse',
        className
      )}
      style={{
        contain: 'layout style paint', // CSS containment for better performance
      }}
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={defaultSizes}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down'
        )}
        style={{
          width: width ? undefined : '100%',
          height: height ? undefined : 'auto',
        }}
      />
    </div>
  )
}

// Picture component for art direction and multiple formats
interface PictureProps extends OptimizedImageProps {
  sources?: Array<{
    srcSet: string
    type: string
    media?: string
  }>
}

export function Picture({
  sources = [],
  ...imageProps
}: PictureProps) {
  const [isInView, setIsInView] = useState(false)
  const pictureRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (imageProps.priority || !pictureRef.current) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    observer.observe(pictureRef.current)

    return () => observer.disconnect()
  }, [imageProps.priority])

  if (!isInView) {
    return (
      <picture ref={pictureRef}>
        <div
          className={cn(
            'bg-gray-200 dark:bg-gray-800 animate-pulse',
            imageProps.className
          )}
          style={{
            width: imageProps.width || '100%',
            height: imageProps.height || 'auto',
            aspectRatio: imageProps.width && imageProps.height 
              ? `${imageProps.width}/${imageProps.height}` 
              : undefined
          }}
          aria-label={`Loading ${imageProps.alt}`}
        />
      </picture>
    )
  }

  // Generate WebP sources automatically
  const webpSources = sources.length > 0 ? sources : [
    {
      srcSet: imageProps.src.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
      type: 'image/webp'
    },
    {
      srcSet: imageProps.src,
      type: imageProps.src.includes('.png') ? 'image/png' : 'image/jpeg'
    }
  ]

  return (
    <picture ref={pictureRef}>
      {webpSources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          type={source.type}
          media={source.media}
        />
      ))}
      <OptimizedImage {...imageProps} />
    </picture>
  )
}