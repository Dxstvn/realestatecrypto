/**
 * Theme Context and Provider
 * PropertyLend DeFi Platform
 * 
 * Phase 2.1: Component Theming
 * Provides dark/light theme support with system preference detection
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ 
  children,
  defaultTheme = 'dark',
  storageKey = 'propertylend-theme'
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  // Get system theme preference
  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply theme to document
  const applyTheme = (theme: 'dark' | 'light') => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.style.colorScheme = theme
  }

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored) {
      setThemeState(stored)
    }
    setMounted(true)
  }, [storageKey])

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return

    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyTheme(resolved)
    localStorage.setItem(storageKey, theme)
  }, [theme, mounted, storageKey])

  // Listen to system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const systemTheme = getSystemTheme()
      setResolvedTheme(systemTheme)
      applyTheme(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // Prevent flash of incorrect theme
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition')
    }, 0)

    return () => clearTimeout(timeout)
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}