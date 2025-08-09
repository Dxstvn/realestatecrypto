/**
 * Mobile Navigation Component - PropertyChain
 * 
 * Enhanced mobile navigation with touch gestures
 * Replaces header navigation on screens < 1024px
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { SwipeableHandlers, useSwipeable } from 'react-swipeable' // TODO: Add swipe gestures
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Home,
  Building2,
  ChevronRight,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

// Navigation items structure
interface NavItem {
  title: string
  href?: string
  description?: string
  items?: NavItem[]
  icon?: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  {
    title: 'Properties',
    items: [
      {
        title: 'Browse All',
        href: ROUTES.PROPERTIES,
        description: 'Explore our curated selection'
      },
      {
        title: 'Featured Deals',
        href: ROUTES.EXPLORE,
        description: 'Hand-picked opportunities'
      },
      {
        title: 'Compare',
        href: ROUTES.COMPARE,
        description: 'Side-by-side comparison'
      }
    ]
  },
  {
    title: 'Learn',
    items: [
      {
        title: 'How It Works',
        href: ROUTES.HOW_IT_WORKS,
        description: 'Understanding tokenization'
      },
      {
        title: 'About',
        href: ROUTES.ABOUT,
        description: 'Our mission'
      }
    ]
  },
  {
    title: 'Support',
    href: ROUTES.CONTACT,
  },
]

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef?: React.RefObject<HTMLButtonElement>
}

export function MobileNav({ isOpen, setIsOpen, triggerRef }: MobileNavProps) {
  const [notificationCount] = useState(3) // Mock notification count
  const [isAuthenticated] = useState(false) // Mock auth state
  const pathname = usePathname()
  // const sheetRef = useRef<HTMLDivElement>(null) // TODO: Add ref when needed

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatars/user.jpg',
    initials: 'JD'
  }

  // Swipe handlers for touch gestures - TODO: Re-enable when react-swipeable is configured
  // const swipeHandlers = useSwipeable({
  //   onSwipedRight: () => setIsOpen(false),
  //   trackMouse: false,
  //   trackTouch: true,
  //   delta: 50,
  //   preventScrollOnSwipe: true,
  // })

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname, setIsOpen])

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent 
        side="right" 
        className="w-[280px] p-0 overflow-hidden"
        // {...swipeHandlers} // TODO: Re-enable swipe handlers
        // ref={sheetRef} // TODO: Add ref when needed
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-left flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Menu</span>
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Swipe Indicator */}
        <div className="absolute top-1/2 left-1 -translate-y-1/2 w-1 h-16 bg-border/50 rounded-full" />
        
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* User Section (if authenticated) */}
            {isAuthenticated && (
              <>
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Main Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.title}>
                  {item.items ? (
                    // Accordion for items with children
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={item.title} className="border-none">
                        <AccordionTrigger className="px-3 py-2 hover:bg-accent rounded-lg hover:no-underline">
                          <span className="text-sm font-medium">{item.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0">
                          <div className="space-y-1 pl-4">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href || '#'}
                                className={cn(
                                  'block rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                  isActiveLink(subItem.href || '')
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                <div className="font-medium">{subItem.title}</div>
                                {subItem.description && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {subItem.description}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    // Direct link
                    <Link
                      href={item.href || '#'}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                        isActiveLink(item.href || '')
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-accent'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Authenticated User Actions */}
            {isAuthenticated ? (
              <>
                <Separator />
                <div className="space-y-1">
                  <Link
                    href={ROUTES.INVESTOR_DASHBOARD}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  
                  {notificationCount > 0 && (
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left">
                      <Bell className="h-4 w-4" />
                      <span className="flex-1">Notifications</span>
                      <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                        {notificationCount}
                      </Badge>
                    </button>
                  )}
                  
                  <Link
                    href={ROUTES.SETTINGS}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>

                <Separator />
                
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-destructive/10 transition-colors text-destructive">
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              // Authentication buttons for non-authenticated users
              <>
                <Separator />
                <div className="space-y-2">
                  <Link href={ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER} onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Bottom Branding */}
            <div className="pt-4">
              <div className="text-xs text-muted-foreground text-center">
                © 2024 PropertyChain
                <br />
                Tokenized Real Estate Platform
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// Export a trigger button component for easy integration
export function MobileNavTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Open navigation menu</span>
    </Button>
  )
}