/**
 * Responsive Image Component - PropertyChain
 * 
 * Optimized image loading for mobile devices with lazy loading and multiple formats
 * Following UpdatedUIPlan.md Step 49 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Loader2, ImageOff, ZoomIn } from 'lucide-react'
import { DeviceDetection, NetworkDetection } from '@/lib/mobile/performance'

// Types
interface ResponsiveImageProps {
  src: string
  alt: string
  sources?: ImageSource[]
  className?: string
  containerClassName?: string
  priority?: boolean
  quality?: number
  blur?: boolean
  blurDataURL?: string
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
  onClick?: () => void
  aspectRatio?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  sizes?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  fetchpriority?: 'high' | 'low' | 'auto'
}

interface ImageSource {
  srcSet: string
  type?: string
  media?: string
  sizes?: string
}

interface ImageState {
  isLoading: boolean
  hasError: boolean
  isInView: boolean
  currentSrc: string
}

export function ResponsiveImage({
  src,
  alt,
  sources = [],
  className,
  containerClassName,
  priority = false,
  quality = 75,
  blur = true,
  blurDataURL,
  fallbackSrc = '/images/placeholder.png',
  onLoad,
  onError,
  onClick,
  aspectRatio = '16/9',
  objectFit = 'cover',
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  fetchpriority = 'auto',
}: ResponsiveImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
    isInView: priority,
    currentSrc: src,
  })
  const [showZoom, setShowZoom] = useState(false)

  // Generate optimized sources based on device and network
  const optimizedSources = React.useMemo(() => {
    const isMobile = DeviceDetection.isMobile()
    const isSlowConnection = NetworkDetection.isSlowConnection()
    const isDataSaver = NetworkDetection.getDataSaverStatus()

    // If data saver is on or connection is slow, reduce quality
    const adjustedQuality = isDataSaver || isSlowConnection ? quality * 0.7 : quality

    // Default sources if none provided
    if (sources.length === 0) {
      const baseSrc = src.split('.')[0]
      const ext = src.split('.').pop()

      return [
        // WebP format for modern browsers
        {
          srcSet: `
            ${baseSrc}-320w.webp 320w,
            ${baseSrc}-640w.webp 640w,
            ${baseSrc}-750w.webp 750w,
            ${baseSrc}-1080w.webp 1080w,
            ${baseSrc}-1920w.webp 1920w
          `,
          type: 'image/webp',
          sizes,
        },
        // AVIF format for better compression
        {
          srcSet: `
            ${baseSrc}-320w.avif 320w,
            ${baseSrc}-640w.avif 640w,
            ${baseSrc}-750w.avif 750w,
            ${baseSrc}-1080w.avif 1080w,
            ${baseSrc}-1920w.avif 1920w
          `,
          type: 'image/avif',
          sizes,
        },
        // Original format as fallback
        {
          srcSet: `
            ${baseSrc}-320w.${ext} 320w,
            ${baseSrc}-640w.${ext} 640w,
            ${baseSrc}-750w.${ext} 750w,
            ${baseSrc}-1080w.${ext} 1080w,
            ${baseSrc}-1920w.${ext} 1920w
          `,
          sizes,
        },
      ]
    }

    return sources
  }, [src, sources, quality, sizes])

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !('IntersectionObserver' in window)) {
      setState(prev => ({ ...prev, isInView: true }))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState(prev => ({ ...prev, isInView: true }))
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  // Handle image load
  const handleLoad = () => {
    setState(prev => ({ ...prev, isLoading: false }))
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      hasError: true,
      currentSrc: fallbackSrc,
    }))
    onError?.()
  }

  // Handle click for zoom
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (!state.hasError) {
      setShowZoom(true)
    }
  }

  // Progressive image loading
  const shouldLoadImage = state.isInView || priority

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden',
          containerClassName
        )}
        style={{ aspectRatio }}
        onClick={handleClick}
      >
        {/* Blur placeholder */}
        {blur && blurDataURL && state.isLoading && (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110"
            style={{ backgroundImage: `url(${blurDataURL})` }}
          />
        )}

        {/* Loading state */}
        {state.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F5F5]">
            <Loader2 className="h-8 w-8 animate-spin text-[#BDBDBD]" />
          </div>
        )}

        {/* Error state */}
        {state.hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F5F5]">
            <ImageOff className="h-8 w-8 text-[#BDBDBD] mb-2" />
            <p className="text-xs text-[#9E9E9E]">Failed to load image</p>
          </div>
        )}

        {/* Picture element for responsive images */}
        {shouldLoadImage && (
          <picture>
            {optimizedSources.map((source, index) => (
              <source
                key={index}
                srcSet={source.srcSet}
                type={source.type}
                media={source.media}
                sizes={source.sizes}
              />
            ))}
            <motion.img
              ref={imageRef}
              src={state.currentSrc}
              alt={alt}
              className={cn(
                'w-full h-full',
                state.isLoading && 'opacity-0',
                !state.isLoading && 'opacity-100',
                className
              )}
              style={{ objectFit }}
              loading={priority ? 'eager' : loading}
              decoding={decoding}
              fetchPriority={priority ? 'high' : fetchpriority}
              onLoad={handleLoad}
              onError={handleError}
              initial={{ opacity: 0 }}
              animate={{ opacity: state.isLoading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </picture>
        )}

        {/* Zoom indicator */}
        {!state.hasError && !state.isLoading && onClick === undefined && (
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <ZoomIn className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Fullscreen zoom modal */}
      {showZoom && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowZoom(false)}
        >
          <motion.img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowZoom(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </>
  )
}

// Responsive Background Image Component
export function ResponsiveBackgroundImage({
  src,
  sources = [],
  className,
  children,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  parallax = false,
  blur = false,
}: {
  src: string
  sources?: ImageSource[]
  className?: string
  children?: React.ReactNode
  overlay?: boolean
  overlayColor?: string
  parallax?: boolean
  blur?: boolean
}) {
  const [offset, setOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax effect
  useEffect(() => {
    if (!parallax) return

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const speed = 0.5
        setOffset(rect.top * speed)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallax])

  // Generate CSS for responsive background
  const generateBackgroundStyle = () => {
    const isMobile = DeviceDetection.isMobile()
    const isSlowConnection = NetworkDetection.isSlowConnection()

    // Use lower quality image for slow connections
    let imageSrc = src
    if (isSlowConnection) {
      const baseSrc = src.split('.')[0]
      const ext = src.split('.').pop()
      imageSrc = `${baseSrc}-750w.${ext}`
    }

    return {
      backgroundImage: `url(${imageSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transform: parallax ? `translateY(${offset}px)` : undefined,
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={generateBackgroundStyle()}
    >
      {/* Blur overlay */}
      {blur && (
        <div className="absolute inset-0 backdrop-blur-sm" />
      )}

      {/* Color overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Image Gallery Component
export function ResponsiveImageGallery({
  images,
  columns = 2,
  gap = 8,
  className,
}: {
  images: { src: string; alt: string; caption?: string }[]
  columns?: number
  gap?: number
  className?: string
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const isMobile = DeviceDetection.isMobile()
  const adjustedColumns = isMobile ? Math.min(columns, 2) : columns

  return (
    <>
      <div
        className={cn('grid', className)}
        style={{
          gridTemplateColumns: `repeat(${adjustedColumns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative group cursor-pointer">
            <ResponsiveImage
              src={image.src}
              alt={image.alt}
              aspectRatio="1/1"
              onClick={() => setSelectedIndex(index)}
              className="rounded-lg"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setSelectedIndex(null)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous button */}
          {selectedIndex > 0 && (
            <button
              className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedIndex(selectedIndex - 1)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next button */}
          {selectedIndex < images.length - 1 && (
            <button
              className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedIndex(selectedIndex + 1)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Image */}
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            className="max-w-full max-h-full object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* Caption */}
          {images[selectedIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-center">
              {images[selectedIndex].caption}
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </>
  )
}