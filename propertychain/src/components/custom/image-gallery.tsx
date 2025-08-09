/**
 * Image Gallery Component - PropertyChain
 * 
 * Advanced image gallery with carousel, lightbox, and touch gestures
 * Used in property detail pages for showcasing property images
 * Following UpdatedUIPlan.md specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Zoom, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Download,
  Share2,
  Heart,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Grid3X3,
  Maximize2,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils/cn'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'
import 'swiper/css/free-mode'
import 'react-lazy-load-image-component/src/effects/blur.css'

/**
 * Image type definition
 */
export interface GalleryImage {
  id: string
  url: string
  thumbnailUrl?: string
  alt: string
  title?: string
  description?: string
  width?: number
  height?: number
  tags?: string[]
}

/**
 * ImageGallery component props
 */
export interface ImageGalleryProps {
  images: GalleryImage[]
  initialIndex?: number
  showThumbnails?: boolean
  showFullscreenButton?: boolean
  showDownloadButton?: boolean
  showShareButton?: boolean
  showFavoriteButton?: boolean
  enableZoom?: boolean
  enableLazyLoad?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onImageClick?: (image: GalleryImage, index: number) => void
  onDownload?: (image: GalleryImage) => void
  onShare?: (image: GalleryImage) => void
  onFavorite?: (image: GalleryImage) => void
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

/**
 * Loading skeleton for gallery
 */
function GallerySkeleton({ showThumbnails = true }: { showThumbnails?: boolean }) {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
      {showThumbnails && (
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-md" />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Lightbox component for fullscreen viewing
 */
function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onDownload,
  onShare,
  enableZoom = true,
}: {
  images: GalleryImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
  onDownload?: (image: GalleryImage) => void
  onShare?: (image: GalleryImage) => void
  enableZoom?: boolean
}) {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const currentImage = images[currentIndex]

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onNavigate(Math.max(0, currentIndex - 1))
          break
        case 'ArrowRight':
          onNavigate(Math.min(images.length - 1, currentIndex + 1))
          break
        case 'Escape':
          onClose()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case 'r':
          handleRotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length, onNavigate, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/95">
        <DialogHeader className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">
              {currentImage?.title || `Image ${currentIndex + 1} of ${images.length}`}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              {enableZoom && (
                <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-white px-2 min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Other controls */}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleRotate}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              
              {onDownload && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => onDownload(currentImage)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {onShare && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => onShare(currentImage)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}

              <DialogClose asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* Main image display */}
        <div className="relative flex items-center justify-center h-full min-h-[60vh]">
          {/* Previous button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-full max-h-full"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
          >
            <Image
              src={currentImage?.url || ''}
              alt={currentImage?.alt || ''}
              width={currentImage?.width || 1920}
              height={currentImage?.height || 1080}
              className="max-w-full max-h-[80vh] object-contain"
              priority
            />
          </motion.div>

          {/* Next button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={() => onNavigate(Math.min(images.length - 1, currentIndex + 1))}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Thumbnail strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => onNavigate(index)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all',
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Main ImageGallery Component
 * Following Section 4 specifications:
 * - Swiper for main carousel
 * - shadcn Dialog for lightbox
 * - Lazy loading with react-lazy-load
 * - Touch gestures for mobile
 */
export function ImageGallery({
  images,
  initialIndex = 0,
  showThumbnails = true,
  showFullscreenButton = true,
  showDownloadButton = false,
  showShareButton = false,
  showFavoriteButton = false,
  enableZoom = true,
  enableLazyLoad = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onImageClick,
  onDownload,
  onShare,
  onFavorite,
  className,
  variant = 'default',
}: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(initialIndex)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)
  const [isFavorited, setIsFavorited] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (onImageClick) {
      onImageClick(image, index)
    } else if (showFullscreenButton) {
      setIsLightboxOpen(true)
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    if (onFavorite && images[activeIndex]) {
      onFavorite(images[activeIndex])
    }
  }

  if (isLoading) {
    return <GallerySkeleton showThumbnails={showThumbnails} />
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  // Variant styles
  const variantStyles = {
    default: 'space-y-4',
    compact: 'space-y-2',
    minimal: '',
  }

  return (
    <>
      <div className={cn('relative', variantStyles[variant], className)}>
        {/* Main image carousel */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination, Thumbs, Zoom, FreeMode]}
            spaceBetween={10}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            pagination={{ clickable: true }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            zoom={enableZoom}
            autoplay={autoPlay ? { delay: autoPlayInterval } : false}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100"
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id}>
                <div className="swiper-zoom-container">
                  {enableLazyLoad ? (
                    <LazyLoadImage
                      src={image.url}
                      alt={image.alt}
                      effect="blur"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleImageClick(image, index)}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => handleImageClick(image, index)}
                      priority={index === 0}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <Button
            className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            size="icon"
            variant="ghost"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {showFullscreenButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 bg-white/80 backdrop-blur-sm"
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fullscreen</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {showFavoriteButton && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 bg-white/80 backdrop-blur-sm"
                      onClick={handleFavorite}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isFavorited && 'fill-red-500 text-red-500'
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {showShareButton && onShare && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 bg-white/80 backdrop-blur-sm"
                      onClick={() => onShare(images[activeIndex])}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Image counter */}
          <Badge
            variant="secondary"
            className="absolute bottom-4 left-4 bg-black/60 text-white border-0"
          >
            {activeIndex + 1} / {images.length}
          </Badge>
        </div>

        {/* Thumbnail navigation */}
        {showThumbnails && variant !== 'minimal' && images.length > 1 && (
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={8}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            breakpoints={{
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 8 },
            }}
            className="gallery-thumbs"
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={image.id}
                className={cn(
                  'cursor-pointer rounded-md overflow-hidden border-2 transition-all',
                  index === activeIndex
                    ? 'border-[#007BFF] opacity-100'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <div className="relative aspect-square">
                  {enableLazyLoad ? (
                    <LazyLoadImage
                      src={image.thumbnailUrl || image.url}
                      alt={image.alt}
                      effect="blur"
                      className="w-full h-full object-cover"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <Image
                      src={image.thumbnailUrl || image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Lightbox dialog */}
      <ImageLightbox
        images={images}
        currentIndex={activeIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={setActiveIndex}
        onDownload={onDownload}
        onShare={onShare}
        enableZoom={enableZoom}
      />
    </>
  )
}