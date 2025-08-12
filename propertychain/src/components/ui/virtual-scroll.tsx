/**
 * Virtual Scroll Component - PropertyLend
 * Phase 3.2: Performance Optimizations
 * 
 * Features:
 * - Virtual scrolling for long lists
 * - Only renders visible items
 * - Smooth scrolling with buffer
 * - Dynamic item heights support
 * - Optimized for 60fps scrolling
 */

'use client'

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number | ((index: number) => number)
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  containerHeight?: number
  buffer?: number
  onScroll?: (scrollTop: number) => void
  loading?: boolean
  loadMore?: () => void
  hasMore?: boolean
  endMessage?: ReactNode
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  renderItem,
  className,
  containerHeight = 600,
  buffer = 3,
  onScroll,
  loading = false,
  loadMore,
  hasMore = false,
  endMessage
}: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const animationFrameRef = useRef<number>()
  
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
  const [scrollTop, setScrollTop] = useState(0)

  // Calculate item heights
  const getItemHeight = useCallback((index: number): number => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight
  }, [itemHeight])

  // Calculate total height
  const getTotalHeight = useCallback((): number => {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      total += getItemHeight(i)
    }
    return total
  }, [items.length, getItemHeight])

  // Calculate item position
  const getItemPosition = useCallback((index: number): number => {
    let position = 0
    for (let i = 0; i < index; i++) {
      position += getItemHeight(i)
    }
    return position
  }, [getItemHeight])

  // Calculate visible range
  const calculateVisibleRange = useCallback((scrollTop: number): { start: number, end: number } => {
    let accumulatedHeight = 0
    let start = 0
    let end = items.length - 1

    // Find start index
    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i)
      if (accumulatedHeight + height > scrollTop) {
        start = Math.max(0, i - buffer)
        break
      }
      accumulatedHeight += height
    }

    // Find end index
    accumulatedHeight = 0
    for (let i = start; i < items.length; i++) {
      if (accumulatedHeight > containerHeight + scrollTop) {
        end = Math.min(items.length - 1, i + buffer)
        break
      }
      accumulatedHeight += getItemHeight(i)
    }

    return { start, end }
  }, [items.length, getItemHeight, containerHeight, buffer])

  // Handle scroll with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newScrollTop = containerRef.current?.scrollTop || 0
      scrollPositionRef.current = newScrollTop
      
      // Update visible range
      const newRange = calculateVisibleRange(newScrollTop)
      setVisibleRange(newRange)
      setScrollTop(newScrollTop)
      
      // Callback
      onScroll?.(newScrollTop)
      
      // Check if need to load more
      if (loadMore && hasMore && !loading) {
        const scrollHeight = containerRef.current?.scrollHeight || 0
        const clientHeight = containerRef.current?.clientHeight || 0
        if (scrollHeight - newScrollTop - clientHeight < 100) {
          loadMore()
        }
      }
    })
  }, [calculateVisibleRange, onScroll, loadMore, hasMore, loading])

  // Initial calculation
  useEffect(() => {
    const newRange = calculateVisibleRange(0)
    setVisibleRange(newRange)
  }, [calculateVisibleRange])

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const totalHeight = getTotalHeight()
  const offsetY = getItemPosition(visibleRange.start)

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-auto relative',
        className
      )}
      style={{
        height: containerHeight,
        contain: 'strict', // CSS containment for performance
      }}
      onScroll={handleScroll}
    >
      {/* Total height spacer */}
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {/* Visible items container */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            willChange: 'transform',
          }}
        >
          {items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => {
            const actualIndex = visibleRange.start + index
            return (
              <div
                key={actualIndex}
                style={{
                  height: getItemHeight(actualIndex),
                  contain: 'layout style paint',
                }}
              >
                {renderItem(item, actualIndex)}
              </div>
            )
          })}
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* End message */}
      {!hasMore && endMessage && items.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          {endMessage}
        </div>
      )}
    </div>
  )
}

// Hook for virtual scrolling
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  buffer: number = 3
) {
  const [scrollTop, setScrollTop] = useState(0)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })

  const calculateVisibleRange = useCallback(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = start + visibleCount

    return {
      start: Math.max(0, start - buffer),
      end: Math.min(items.length - 1, end + buffer)
    }
  }, [scrollTop, itemHeight, containerHeight, buffer, items.length])

  useEffect(() => {
    const newRange = calculateVisibleRange()
    setVisibleRange(newRange)
  }, [calculateVisibleRange])

  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1)
  const offsetY = visibleRange.start * itemHeight
  const totalHeight = items.length * itemHeight

  return {
    visibleItems,
    offsetY,
    totalHeight,
    setScrollTop,
    visibleRange
  }
}