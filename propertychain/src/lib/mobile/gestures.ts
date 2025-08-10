/**
 * Mobile Gesture Handlers - PropertyChain
 * 
 * Touch gesture detection and handling for mobile interactions
 * Following UpdatedUIPlan.md Step 49 specifications and CLAUDE.md principles
 */

import { RefObject, useEffect, useRef, useState } from 'react'

// Types
export interface GestureEvent {
  type: GestureType
  deltaX: number
  deltaY: number
  distance: number
  direction: SwipeDirection
  velocity: number
  scale?: number
  rotation?: number
  center: { x: number; y: number }
  touches: number
}

export type GestureType =
  | 'swipe'
  | 'pinch'
  | 'rotate'
  | 'tap'
  | 'doubletap'
  | 'longpress'
  | 'pan'
  | 'panstart'
  | 'panmove'
  | 'panend'

export type SwipeDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface GestureHandlers {
  onSwipe?: (event: GestureEvent) => void
  onSwipeUp?: (event: GestureEvent) => void
  onSwipeDown?: (event: GestureEvent) => void
  onSwipeLeft?: (event: GestureEvent) => void
  onSwipeRight?: (event: GestureEvent) => void
  onPinch?: (event: GestureEvent) => void
  onPinchIn?: (event: GestureEvent) => void
  onPinchOut?: (event: GestureEvent) => void
  onRotate?: (event: GestureEvent) => void
  onTap?: (event: GestureEvent) => void
  onDoubleTap?: (event: GestureEvent) => void
  onLongPress?: (event: GestureEvent) => void
  onPan?: (event: GestureEvent) => void
  onPanStart?: (event: GestureEvent) => void
  onPanMove?: (event: GestureEvent) => void
  onPanEnd?: (event: GestureEvent) => void
}

export interface GestureConfig {
  threshold?: number
  velocity?: number
  longPressDelay?: number
  doubleTapDelay?: number
  preventDefault?: boolean
  stopPropagation?: boolean
  capture?: boolean
  passive?: boolean
}

// Default configuration
const DEFAULT_CONFIG: GestureConfig = {
  threshold: 50,
  velocity: 0.3,
  longPressDelay: 500,
  doubleTapDelay: 300,
  preventDefault: true,
  stopPropagation: false,
  capture: false,
  passive: false,
}

// Gesture detection hook
export function useGestures(
  ref: RefObject<HTMLElement>,
  handlers: GestureHandlers,
  config: GestureConfig = {}
) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const touchStartRef = useRef<TouchList | null>(null)
  const touchStartTimeRef = useRef<number>(0)
  const lastTapTimeRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isPanningRef = useRef(false)
  const initialDistanceRef = useRef<number>(0)
  const initialRotationRef = useRef<number>(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Calculate distance between two points
    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    // Calculate angle between two points
    const getAngle = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX
      const dy = touch1.clientY - touch2.clientY
      return Math.atan2(dy, dx) * (180 / Math.PI)
    }

    // Calculate center point
    const getCenter = (touches: TouchList) => {
      let x = 0
      let y = 0
      for (let i = 0; i < touches.length; i++) {
        x += touches[i].clientX
        y += touches[i].clientY
      }
      return {
        x: x / touches.length,
        y: y / touches.length,
      }
    }

    // Determine swipe direction
    const getSwipeDirection = (deltaX: number, deltaY: number): SwipeDirection => {
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX < mergedConfig.threshold! && absY < mergedConfig.threshold!) {
        return 'none'
      }

      if (absX > absY) {
        return deltaX > 0 ? 'right' : 'left'
      } else {
        return deltaY > 0 ? 'down' : 'up'
      }
    }

    // Handle touch start
    const handleTouchStart = (e: TouchEvent) => {
      if (mergedConfig.preventDefault) e.preventDefault()
      if (mergedConfig.stopPropagation) e.stopPropagation()

      touchStartRef.current = e.touches
      touchStartTimeRef.current = Date.now()
      isPanningRef.current = false

      // Initialize pinch/rotate tracking
      if (e.touches.length === 2) {
        initialDistanceRef.current = getDistance(e.touches[0], e.touches[1])
        initialRotationRef.current = getAngle(e.touches[0], e.touches[1])
      }

      // Long press detection
      if (e.touches.length === 1) {
        longPressTimerRef.current = setTimeout(() => {
          if (handlers.onLongPress && !isPanningRef.current) {
            const touch = e.touches[0]
            handlers.onLongPress({
              type: 'longpress',
              deltaX: 0,
              deltaY: 0,
              distance: 0,
              direction: 'none',
              velocity: 0,
              center: { x: touch.clientX, y: touch.clientY },
              touches: 1,
            })
          }
        }, mergedConfig.longPressDelay)
      }

      // Pan start
      if (handlers.onPanStart) {
        const center = getCenter(e.touches)
        handlers.onPanStart({
          type: 'panstart',
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          direction: 'none',
          velocity: 0,
          center,
          touches: e.touches.length,
        })
      }
    }

    // Handle touch move
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return
      if (mergedConfig.preventDefault) e.preventDefault()

      // Clear long press timer on move
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      isPanningRef.current = true
      const startTouch = touchStartRef.current[0]
      const currentTouch = e.touches[0]
      const deltaX = currentTouch.clientX - startTouch.clientX
      const deltaY = currentTouch.clientY - startTouch.clientY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Pan move
      if (handlers.onPanMove || handlers.onPan) {
        const center = getCenter(e.touches)
        const event: GestureEvent = {
          type: 'panmove',
          deltaX,
          deltaY,
          distance,
          direction: getSwipeDirection(deltaX, deltaY),
          velocity: 0,
          center,
          touches: e.touches.length,
        }
        handlers.onPanMove?.(event)
        handlers.onPan?.(event)
      }

      // Pinch detection
      if (e.touches.length === 2 && touchStartRef.current.length === 2) {
        const currentDistance = getDistance(e.touches[0], e.touches[1])
        const scale = currentDistance / initialDistanceRef.current

        if (handlers.onPinch || handlers.onPinchIn || handlers.onPinchOut) {
          const event: GestureEvent = {
            type: 'pinch',
            deltaX: 0,
            deltaY: 0,
            distance: currentDistance,
            direction: 'none',
            velocity: 0,
            scale,
            center: getCenter(e.touches),
            touches: 2,
          }

          handlers.onPinch?.(event)
          if (scale < 1) {
            handlers.onPinchIn?.(event)
          } else if (scale > 1) {
            handlers.onPinchOut?.(event)
          }
        }

        // Rotation detection
        if (handlers.onRotate) {
          const currentRotation = getAngle(e.touches[0], e.touches[1])
          const rotation = currentRotation - initialRotationRef.current

          handlers.onRotate({
            type: 'rotate',
            deltaX: 0,
            deltaY: 0,
            distance: currentDistance,
            direction: 'none',
            velocity: 0,
            rotation,
            center: getCenter(e.touches),
            touches: 2,
          })
        }
      }
    }

    // Handle touch end
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      const touchEndTime = Date.now()
      const touchDuration = touchEndTime - touchStartTimeRef.current
      const startTouch = touchStartRef.current[0]
      const endTouch = e.changedTouches[0]
      const deltaX = endTouch.clientX - startTouch.clientX
      const deltaY = endTouch.clientY - startTouch.clientY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const velocity = distance / touchDuration
      const direction = getSwipeDirection(deltaX, deltaY)
      const center = { x: endTouch.clientX, y: endTouch.clientY }

      // Pan end
      if (handlers.onPanEnd && isPanningRef.current) {
        handlers.onPanEnd({
          type: 'panend',
          deltaX,
          deltaY,
          distance,
          direction,
          velocity,
          center,
          touches: e.touches.length,
        })
      }

      // Swipe detection
      if (distance > mergedConfig.threshold! && velocity > mergedConfig.velocity!) {
        const event: GestureEvent = {
          type: 'swipe',
          deltaX,
          deltaY,
          distance,
          direction,
          velocity,
          center,
          touches: 1,
        }

        handlers.onSwipe?.(event)

        switch (direction) {
          case 'up':
            handlers.onSwipeUp?.(event)
            break
          case 'down':
            handlers.onSwipeDown?.(event)
            break
          case 'left':
            handlers.onSwipeLeft?.(event)
            break
          case 'right':
            handlers.onSwipeRight?.(event)
            break
        }
      }
      // Tap detection
      else if (distance < 10 && touchDuration < 200) {
        const event: GestureEvent = {
          type: 'tap',
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          direction: 'none',
          velocity: 0,
          center,
          touches: 1,
        }

        // Double tap detection
        const timeSinceLastTap = touchEndTime - lastTapTimeRef.current
        if (timeSinceLastTap < mergedConfig.doubleTapDelay!) {
          handlers.onDoubleTap?.({
            ...event,
            type: 'doubletap',
          })
          lastTapTimeRef.current = 0
        } else {
          handlers.onTap?.(event)
          lastTapTimeRef.current = touchEndTime
        }
      }

      // Reset
      touchStartRef.current = null
      isPanningRef.current = false
    }

    // Add event listeners
    const options = {
      capture: mergedConfig.capture,
      passive: !mergedConfig.preventDefault,
    }

    element.addEventListener('touchstart', handleTouchStart, options)
    element.addEventListener('touchmove', handleTouchMove, options)
    element.addEventListener('touchend', handleTouchEnd, options)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [ref, handlers, mergedConfig])
}

// Swipeable hook
export function useSwipeable(
  handlers: {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
  },
  config?: GestureConfig
) {
  const ref = useRef<HTMLDivElement>(null)

  useGestures(
    ref,
    {
      onSwipeLeft: handlers.onSwipeLeft,
      onSwipeRight: handlers.onSwipeRight,
      onSwipeUp: handlers.onSwipeUp,
      onSwipeDown: handlers.onSwipeDown,
    },
    config
  )

  return ref
}

// Pinch to zoom hook
export function usePinchToZoom(
  initialScale = 1,
  minScale = 0.5,
  maxScale = 3
) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(initialScale)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const lastScaleRef = useRef(initialScale)
  const lastPositionRef = useRef({ x: 0, y: 0 })

  useGestures(ref, {
    onPinch: (event) => {
      if (event.scale) {
        const newScale = Math.min(
          Math.max(lastScaleRef.current * event.scale, minScale),
          maxScale
        )
        setScale(newScale)
        lastScaleRef.current = newScale
      }
    },
    onPan: (event) => {
      if (scale > 1) {
        setPosition({
          x: lastPositionRef.current.x + event.deltaX,
          y: lastPositionRef.current.y + event.deltaY,
        })
      }
    },
    onPanEnd: (event) => {
      if (scale > 1) {
        lastPositionRef.current = {
          x: lastPositionRef.current.x + event.deltaX,
          y: lastPositionRef.current.y + event.deltaY,
        }
      }
    },
    onDoubleTap: () => {
      if (scale === initialScale) {
        setScale(maxScale)
      } else {
        setScale(initialScale)
        setPosition({ x: 0, y: 0 })
        lastPositionRef.current = { x: 0, y: 0 }
      }
      lastScaleRef.current = scale === initialScale ? maxScale : initialScale
    },
  })

  return {
    ref,
    scale,
    position,
    reset: () => {
      setScale(initialScale)
      setPosition({ x: 0, y: 0 })
      lastScaleRef.current = initialScale
      lastPositionRef.current = { x: 0, y: 0 }
    },
  }
}

// Pull to refresh hook
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  threshold = 80
) {
  const ref = useRef<HTMLDivElement>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useGestures(ref, {
    onPanStart: () => {
      if (window.scrollY === 0) {
        setIsPulling(true)
      }
    },
    onPan: (event) => {
      if (isPulling && event.deltaY > 0 && !isRefreshing) {
        setPullDistance(Math.min(event.deltaY, threshold * 1.5))
      }
    },
    onPanEnd: async (event) => {
      if (isPulling) {
        if (event.deltaY >= threshold && !isRefreshing) {
          setIsRefreshing(true)
          try {
            await onRefresh()
          } finally {
            setIsRefreshing(false)
          }
        }
        setPullDistance(0)
        setIsPulling(false)
      }
    },
  })

  return {
    ref,
    isPulling,
    pullDistance,
    isRefreshing,
    progress: Math.min(pullDistance / threshold, 1),
  }
}

// Drag to reorder hook
export function useDragToReorder<T>(
  items: T[],
  onReorder: (items: T[]) => void
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setTargetIndex(index)
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && targetIndex !== null) {
      const newItems = [...items]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(targetIndex, 0, draggedItem)
      onReorder(newItems)
    }
    setDraggedIndex(null)
    setTargetIndex(null)
  }

  return {
    draggedIndex,
    targetIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setItemRef: (index: number, ref: HTMLElement | null) => {
      itemRefs.current[index] = ref
    },
  }
}

// Export all utilities
export default {
  useGestures,
  useSwipeable,
  usePinchToZoom,
  usePullToRefresh,
  useDragToReorder,
}