"use client"

/**
 * Simple Header - PropertyChain  
 * Implementation following Section 2.1 specifications
 */

import Link from 'next/link'
import { useState } from 'react'
import { Building2, Menu, Bell, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function SimpleHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount] = useState(3)
  const [isAuthenticated] = useState(false)

  return (
    <header className="fixed top-0 w-full z-[1000] bg-white border-b border-gray-200">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[72px] container mx-auto max-w-[1440px] px-12 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">PropertyChain</span>
            <div className="text-xs text-gray-500">Tokenized Real Estate</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="flex items-center gap-8">
          <Link href="/browse" className="text-gray-600 hover:text-blue-500 font-medium">
            Browse Properties
          </Link>
          <Link href="/invest" className="text-gray-600 hover:text-blue-500 font-medium">
            Start Investing
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-blue-500 font-medium">
            How It Works
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-500 font-medium">
            About
          </Link>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-[60px] flex items-center justify-between px-4">
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">PropertyChain</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6 mt-6">
              <Link 
                href="/browse" 
                className="text-lg font-medium text-gray-900 hover:text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                Browse Properties
              </Link>
              <Link 
                href="/invest" 
                className="text-lg font-medium text-gray-900 hover:text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                Start Investing
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-lg font-medium text-gray-900 hover:text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/about" 
                className="text-lg font-medium text-gray-900 hover:text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              
              <div className="border-t pt-6 mt-6">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <Button variant="ghost" className="justify-start">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                      {notificationCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notificationCount}
                        </span>
                      )}
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}