/**
 * Scroll-aware Navbar Hook
 * PropertyLend DeFi Platform
 * 
 * Phase 2.4: Navigation & Header Improvements
 * Provides scroll state for adaptive navbar styling
 */

import { useState, useEffect, useCallback } from 'react'

interface ScrollNavbarState {
  isScrolled: boolean
  isAtTop: boolean
  scrollY: number
  scrollDirection: 'up' | 'down' | null
}

export const useScrollNavbar = (threshold: number = 20): ScrollNavbarState => {
  const [state, setState] = useState<ScrollNavbarState>({
    isScrolled: false,
    isAtTop: true,
    scrollY: 0,
    scrollDirection: null,
  })

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const previousScrollY = state.scrollY
    
    setState(prevState => ({
      scrollY: currentScrollY,
      isScrolled: currentScrollY > threshold,
      isAtTop: currentScrollY < 5,
      scrollDirection: 
        currentScrollY > previousScrollY ? 'down' : 
        currentScrollY < previousScrollY ? 'up' : 
        prevState.scrollDirection,
    }))
  }, [threshold, state.scrollY])

  useEffect(() => {
    // Check initial state
    handleScroll()
    
    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return state
}