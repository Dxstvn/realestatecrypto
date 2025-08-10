/**
 * Skip Links Component - PropertyChain
 * 
 * Skip navigation links for keyboard users and screen readers
 * Following UpdatedUIPlan.md Step 67 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Skip link item interface
 */
interface SkipLinkItem {
  href: string
  label: string
  description?: string
}

/**
 * Skip Links props
 */
interface SkipLinksProps {
  className?: string
  customLinks?: SkipLinkItem[]
  showOnFocus?: boolean
}

/**
 * Default skip links for common page sections
 */
const DEFAULT_SKIP_LINKS: SkipLinkItem[] = [
  {
    href: '#main-content',
    label: 'Skip to main content',
    description: 'Jump to the main content area',
  },
  {
    href: '#navigation',
    label: 'Skip to navigation',
    description: 'Jump to the main navigation menu',
  },
  {
    href: '#sidebar',
    label: 'Skip to sidebar',
    description: 'Jump to the sidebar content',
  },
  {
    href: '#footer',
    label: 'Skip to footer',
    description: 'Jump to the page footer',
  },
]

/**
 * Skip Links Component
 */
export function SkipLinks({ 
  className,
  customLinks = DEFAULT_SKIP_LINKS,
  showOnFocus = true,
}: SkipLinksProps) {
  const [isVisible, setIsVisible] = React.useState(!showOnFocus)
  const pathname = usePathname()
  
  // Filter links based on page content
  const availableLinks = React.useMemo(() => {
    return customLinks.filter(link => {
      // Check if target element exists
      if (typeof window !== 'undefined') {
        const target = document.querySelector(link.href)
        return target !== null
      }
      return true
    })
  }, [customLinks, pathname])
  
  const handleLinkClick = (href: string) => {
    const target = document.querySelector(href) as HTMLElement
    if (target) {
      target.focus()
      // Scroll into view if needed
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
  
  const handleFocus = () => {
    if (showOnFocus) {
      setIsVisible(true)
    }
  }
  
  const handleBlur = () => {
    if (showOnFocus) {
      setIsVisible(false)
    }
  }
  
  if (availableLinks.length === 0) {
    return null
  }
  
  return (
    <nav
      aria-label="Skip navigation links"
      className={cn(
        "fixed top-0 left-0 z-[9999]",
        showOnFocus && !isVisible && "sr-only",
        className
      )}
    >
      <ul className="flex flex-col gap-1 p-2 bg-white border border-gray-300 shadow-lg rounded-br-md">
        {availableLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick(link.href)
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "inline-block px-4 py-2 text-sm font-medium",
                "text-blue-700 bg-blue-50 border border-blue-300 rounded",
                "hover:bg-blue-100 hover:text-blue-800",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "focus:bg-blue-100 focus:text-blue-800",
                "transition-colors duration-200",
                "no-underline"
              )}
              title={link.description}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Skip to Main Content Component (simplified)
 */
interface SkipToMainProps {
  className?: string
  targetId?: string
  label?: string
}

export function SkipToMain({ 
  className,
  targetId = 'main-content',
  label = 'Skip to main content',
}: SkipToMainProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
  
  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-2 left-2 z-[9999]",
        "px-4 py-2 text-sm font-medium",
        "text-white bg-blue-600 border border-blue-700 rounded",
        "hover:bg-blue-700",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "focus:bg-blue-700",
        "transition-colors duration-200",
        "no-underline",
        className
      )}
    >
      {label}
    </a>
  )
}

/**
 * Main Content Wrapper with proper landmark
 */
interface MainContentProps {
  children: React.ReactNode
  className?: string
  id?: string
  skipLinkTarget?: boolean
}

export function MainContent({ 
  children, 
  className,
  id = 'main-content',
  skipLinkTarget = true,
}: MainContentProps) {
  const mainRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    // Ensure main content is focusable for skip links
    if (skipLinkTarget && mainRef.current) {
      mainRef.current.setAttribute('tabindex', '-1')
    }
  }, [skipLinkTarget])
  
  return (
    <main
      ref={mainRef}
      id={id}
      className={cn("outline-none", className)}
    >
      {children}
    </main>
  )
}

/**
 * Navigation Wrapper with proper landmark
 */
interface NavigationProps {
  children: React.ReactNode
  className?: string
  id?: string
  ariaLabel?: string
  skipLinkTarget?: boolean
}

export function Navigation({ 
  children, 
  className,
  id = 'navigation',
  ariaLabel = 'Main navigation',
  skipLinkTarget = true,
}: NavigationProps) {
  const navRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    // Ensure navigation is focusable for skip links
    if (skipLinkTarget && navRef.current) {
      navRef.current.setAttribute('tabindex', '-1')
    }
  }, [skipLinkTarget])
  
  return (
    <nav
      ref={navRef}
      id={id}
      aria-label={ariaLabel}
      className={cn("outline-none", className)}
    >
      {children}
    </nav>
  )
}

/**
 * Sidebar Wrapper with proper landmark
 */
interface SidebarProps {
  children: React.ReactNode
  className?: string
  id?: string
  ariaLabel?: string
  skipLinkTarget?: boolean
}

export function Sidebar({ 
  children, 
  className,
  id = 'sidebar',
  ariaLabel = 'Sidebar navigation',
  skipLinkTarget = true,
}: SidebarProps) {
  const sidebarRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    // Ensure sidebar is focusable for skip links
    if (skipLinkTarget && sidebarRef.current) {
      sidebarRef.current.setAttribute('tabindex', '-1')
    }
  }, [skipLinkTarget])
  
  return (
    <aside
      ref={sidebarRef}
      id={id}
      aria-label={ariaLabel}
      className={cn("outline-none", className)}
    >
      {children}
    </aside>
  )
}

/**
 * Footer Wrapper with proper landmark
 */
interface FooterProps {
  children: React.ReactNode
  className?: string
  id?: string
  skipLinkTarget?: boolean
}

export function Footer({ 
  children, 
  className,
  id = 'footer',
  skipLinkTarget = true,
}: FooterProps) {
  const footerRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    // Ensure footer is focusable for skip links
    if (skipLinkTarget && footerRef.current) {
      footerRef.current.setAttribute('tabindex', '-1')
    }
  }, [skipLinkTarget])
  
  return (
    <footer
      ref={footerRef}
      id={id}
      className={cn("outline-none", className)}
    >
      {children}
    </footer>
  )
}

/**
 * Content Section with proper landmark
 */
interface ContentSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  ariaLabel?: string
  landmark?: 'region' | 'complementary' | 'banner' | 'contentinfo'
  skipLinkTarget?: boolean
}

export function ContentSection({ 
  children, 
  className,
  id,
  ariaLabel,
  landmark = 'region',
  skipLinkTarget = false,
}: ContentSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    // Ensure section is focusable for skip links if needed
    if (skipLinkTarget && sectionRef.current) {
      sectionRef.current.setAttribute('tabindex', '-1')
    }
  }, [skipLinkTarget])
  
  return (
    <section
      ref={sectionRef}
      id={id}
      role={landmark}
      aria-label={ariaLabel}
      className={cn("outline-none", className)}
    >
      {children}
    </section>
  )
}

/**
 * Page Layout with all landmarks
 */
interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  showSkipLinks?: boolean
  customSkipLinks?: SkipLinkItem[]
}

export function PageLayout({ 
  children, 
  className,
  showSkipLinks = true,
  customSkipLinks,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      {showSkipLinks && (
        <SkipLinks customLinks={customSkipLinks} />
      )}
      {children}
    </div>
  )
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks() {
  const [availableTargets, setAvailableTargets] = React.useState<string[]>([])
  
  React.useEffect(() => {
    // Check which skip link targets are available on the current page
    const targets = [
      '#main-content',
      '#navigation', 
      '#sidebar',
      '#footer',
    ]
    
    const available = targets.filter(target => {
      return document.querySelector(target) !== null
    })
    
    setAvailableTargets(available)
    
    // Update when DOM changes
    const observer = new MutationObserver(() => {
      const newAvailable = targets.filter(target => {
        return document.querySelector(target) !== null
      })
      setAvailableTargets(newAvailable)
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
    
    return () => observer.disconnect()
  }, [])
  
  const jumpToTarget = React.useCallback((target: string) => {
    const element = document.querySelector(target)
    if (element) {
      (element as HTMLElement).focus()
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])
  
  return {
    availableTargets,
    jumpToTarget,
  }
}

export default SkipLinks