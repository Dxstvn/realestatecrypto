/**
 * Theme Provider - PropertyChain
 * 
 * Implements theme switching with exact color specifications from Section 1.7
 * Follows Section 0 principles:
 * - Clarity: Obvious light/dark/system modes
 * - Consistency: Same theme behavior across all components
 * - Performance: CSS variables for instant switching
 * - Accessibility: Respects user's system preferences
 */

'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

/**
 * Theme Provider Component
 * 
 * Provides theme context with:
 * - System theme detection
 * - Smooth transitions between themes
 * - CSS variable switching
 * - Persistence across sessions
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="propertychain-theme"
      themes={['light', 'dark', 'system']}
      {...props}
    >
      <ThemeWatcher />
      {children}
    </NextThemesProvider>
  )
}

/**
 * Theme Watcher Component
 * 
 * Handles theme-specific optimizations:
 * - Prevents flash of unstyled content
 * - Manages CSS variable transitions
 * - Applies theme-specific body classes
 */
function ThemeWatcher() {
  React.useEffect(() => {
    // Add theme transition class after mount to prevent FOUC
    const timer = setTimeout(() => {
      document.documentElement.classList.add('theme-transition')
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    // Apply theme-specific optimizations
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark')
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content', 
          isDark ? '#121212' : '#FFFFFF'
        )
      }

      // Dispatch custom theme change event for other components
      window.dispatchEvent(
        new CustomEvent('theme-changed', { 
          detail: { theme: isDark ? 'dark' : 'light' } 
        })
      )
    }

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' && 
          mutation.attributeName === 'class'
        ) {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Initial theme setup
    handleThemeChange()

    return () => observer.disconnect()
  }, [])

  return null
}

/**
 * Custom Hook for Theme Management
 * 
 * Provides theme utilities with PropertyChain-specific features:
 * - Theme state management
 * - System preference detection
 * - Smooth transitions
 * - Performance optimizations
 */
import { useTheme as useNextTheme } from 'next-themes'

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Toggle between light and dark themes
   * Respects user preference over system setting
   */
  const toggleTheme = React.useCallback(() => {
    if (theme === 'system') {
      // If on system, switch to opposite of current system theme
      setTheme(systemTheme === 'dark' ? 'light' : 'dark')
    } else {
      // Toggle between light and dark
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
  }, [theme, systemTheme, setTheme])

  /**
   * Set theme with transition management
   * Ensures smooth visual transitions
   */
  const setThemeWithTransition = React.useCallback((newTheme: string) => {
    // Temporarily disable transitions during theme change
    document.documentElement.classList.add('theme-changing')
    
    setTheme(newTheme)
    
    // Re-enable transitions after change
    setTimeout(() => {
      document.documentElement.classList.remove('theme-changing')
    }, 200) // Match our 200ms standard transition duration
  }, [setTheme])

  /**
   * Check if current theme is dark
   * Handles mounted state for SSR compatibility
   */
  const isDark = React.useMemo(() => {
    if (!mounted) return false
    return resolvedTheme === 'dark'
  }, [mounted, resolvedTheme])

  /**
   * Check if using system theme
   */
  const isSystem = React.useMemo(() => {
    return theme === 'system'
  }, [theme])

  return {
    theme,
    resolvedTheme,
    systemTheme,
    setTheme: setThemeWithTransition,
    toggleTheme,
    isDark,
    isSystem,
    mounted,
  }
}