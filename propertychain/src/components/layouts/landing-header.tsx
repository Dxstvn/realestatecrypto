/**
 * Landing Page Header - PropertyLend
 * Phase 5.0: Landing Page Navigation for New Users
 * 
 * Header focused on education and conversion for non-authenticated users
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu-fixed'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Menu,
  TrendingUp,
  BookOpen,
  Shield,
  Users,
  FileText,
  MessageCircle,
  GraduationCap,
  Newspaper,
  FileCode,
  Sun,
  Moon,
  ChevronRight,
  ArrowRight,
  Sparkles,
  DollarSign,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Landing page navigation structure - Focus on education and conversion
const landingNavigation = [
  {
    title: 'How It Works',
    items: [
      { 
        title: 'For Lenders', 
        href: '/how-it-works/lenders',
        description: 'Earn stable yields on your stablecoins',
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      },
      { 
        title: 'For Borrowers', 
        href: '/how-it-works/borrowers',
        description: 'Access bridge loans for real estate',
        icon: <Home className="h-4 w-4 text-blue-500" />,
      },
      { 
        title: 'Security & Insurance', 
        href: '/how-it-works/security',
        description: 'Learn about our safety measures',
        icon: <Shield className="h-4 w-4 text-purple-500" />,
      }
    ]
  },
  {
    title: 'Products',
    items: [
      { 
        title: 'Senior Tranches', 
        href: '/products/senior',
        description: 'Stable 8% APY with priority protection',
        icon: <Shield className="h-4 w-4 text-blue-400" />,
        badge: 'Low Risk',
      },
      { 
        title: 'Junior Tranches', 
        href: '/products/junior',
        description: 'Higher yields 20-30% APY',
        icon: <Sparkles className="h-4 w-4 text-green-400" />,
        badge: 'High Yield',
      },
      { 
        title: 'View All Pools', 
        href: '/pools/explore',
        description: 'Browse available investment opportunities',
        icon: <DollarSign className="h-4 w-4 text-purple-400" />,
      }
    ]
  },
  {
    title: 'About',
    items: [
      { 
        title: 'Company', 
        href: '/about',
        description: 'Our mission and team',
        icon: <Users className="h-4 w-4 text-indigo-500" />,
      },
      { 
        title: 'FAQ', 
        href: '/faq',
        description: 'Frequently asked questions',
        icon: <MessageCircle className="h-4 w-4 text-pink-500" />,
      },
      { 
        title: 'Contact', 
        href: '/contact',
        description: 'Get in touch with our team',
        icon: <FileText className="h-4 w-4 text-orange-500" />,
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      { 
        title: 'Documentation', 
        href: '/docs',
        description: 'Technical documentation',
        icon: <BookOpen className="h-4 w-4 text-cyan-500" />,
      },
      { 
        title: 'Blog', 
        href: '/blog',
        description: 'Latest news and insights',
        icon: <Newspaper className="h-4 w-4 text-yellow-500" />,
      },
      { 
        title: 'Whitepaper', 
        href: '/whitepaper',
        description: 'Technical details of our protocol',
        icon: <FileCode className="h-4 w-4 text-gray-500" />,
      }
    ]
  }
]

interface LandingHeaderProps {
  className?: string
}

export function LandingHeader({ className }: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 w-full z-50',
          'h-[60px] lg:h-[72px]',
          'transition-all duration-200',
          scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800' : 'bg-transparent',
          className
        )}
      >
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link 
              href="/"
              className="flex items-center gap-3 group transition-all duration-200"
            >
              <div className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-gray-900 dark:text-white">
                  PropertyLend
                </span>
                <span className="text-xs leading-none mt-0.5 text-gray-600 dark:text-gray-400">
                  DeFi Bridge Lending
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <NavigationMenu>
                <NavigationMenuList>
                  {landingNavigation.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger 
                        className={cn(
                          'h-auto px-4 py-2 text-[15px] font-medium',
                          'transition-colors duration-200',
                          'bg-transparent',
                          'text-gray-700 hover:text-gray-900',
                          'dark:text-gray-300 dark:hover:text-white'
                        )}
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[450px] p-6">
                          <div className="space-y-3">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className={cn(
                                  'block rounded-lg p-4',
                                  'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200',
                                  'no-underline group/item',
                                  isActiveLink(subItem.href) && 'bg-purple-50 dark:bg-purple-900/20'
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  {subItem.icon && (
                                    <div className="mt-0.5">
                                      {subItem.icon}
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm text-gray-900 dark:text-white group-hover/item:text-purple-600 dark:group-hover/item:text-purple-400 transition-colors">
                                        {subItem.title}
                                      </span>
                                      {subItem.badge && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                          {subItem.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {subItem.description}
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                className="hidden sm:inline-flex"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* CTA Buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/get-started">
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle className="text-left">Navigation</SheetTitle>
                    </SheetHeader>
                    
                    {/* Mobile Navigation */}
                    <div className="mt-6 space-y-6">
                      {landingNavigation.map((section) => (
                        <div key={section.title}>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            {section.title}
                          </h3>
                          <div className="space-y-2">
                            {section.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                                  isActiveLink(item.href)
                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                {item.icon}
                                <div className="flex-1">
                                  <div className="font-medium">{item.title}</div>
                                  {item.badge && (
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {/* Mobile CTA Buttons */}
                      <div className="border-t pt-6 space-y-3">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/get-started" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[60px] lg:h-[72px]" aria-hidden="true" />
    </>
  )
}