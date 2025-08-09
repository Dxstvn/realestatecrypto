/**
 * useInfiniteScroll Hook - PropertyChain
 * 
 * Handles infinite scroll pagination
 */

import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  enabled?: boolean
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.8, enabled = true } = options
  const targetRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!enabled || !targetRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const scrollPosition = (scrollTop + clientHeight) / scrollHeight

    if (scrollPosition >= threshold) {
      callback()
    }
  }, [callback, threshold, enabled])

  useEffect(() => {
    if (!enabled) return

    // Try IntersectionObserver first for better performance
    if ('IntersectionObserver' in window && targetRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback()
          }
        },
        { threshold: 0.1 }
      )

      if (targetRef.current) {
        observer.observe(targetRef.current)
      }

      return () => {
        if (targetRef.current) {
          observer.unobserve(targetRef.current)
        }
      }
    } else {
      // Fallback to scroll event
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [callback, handleScroll, enabled])

  return { targetRef }
}