/**
 * Custom 404 Not Found Page - PropertyChain
 * 
 * Enhanced error page with:
 * - Custom illustration with animated elements
 * - Helpful navigation options
 * - Search functionality
 * - Recent pages suggestions
 * 
 * Following UpdatedUIPlan.md Step 40 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Search,
  ArrowLeft,
  Building,
  TrendingUp,
  FileText,
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  Clock,
  Star,
  Compass,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Animated illustration components
function FloatingBuilding({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay,
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2
      }}
      className="absolute"
    >
      <Building className="h-8 w-8 text-blue-300" />
    </motion.div>
  )
}

function AnimatedSearchIcon() {
  return (
    <motion.div
      animate={{ 
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }}
    >
      <Search className="h-16 w-16 text-gray-400" />
    </motion.div>
  )
}

function NotFoundIllustration() {
  return (
    <div className="relative w-full h-64 mb-8 flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <FloatingBuilding delay={0} />
        <div className="absolute top-4 right-8">
          <FloatingBuilding delay={0.5} />
        </div>
        <div className="absolute bottom-8 left-4">
          <FloatingBuilding delay={1} />
        </div>
        <div className="absolute top-1/2 left-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Compass className="h-6 w-6 text-gray-300" />
          </motion.div>
        </div>
      </div>

      {/* Main illustration */}
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="mb-4"
        >
          <AnimatedSearchIcon />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-8xl font-bold text-gray-200 mb-2"
        >
          404
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-gray-400"
        >
          <MapPin className="h-4 w-4" />
          <span className="text-sm">Property not found at this location</span>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full"
          style={{
            left: `${20 + (i * 12)}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-10, -20, -10],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
}

// Recent pages suggestion
const recentPages = [
  { title: 'Property Listings', href: '/properties', icon: Building },
  { title: 'Investment Dashboard', href: '/dashboard', icon: TrendingUp },
  { title: 'Market Analysis', href: '/analytics', icon: FileText },
  { title: 'Help Center', href: '/help', icon: HelpCircle },
]

// Popular searches
const popularSearches = [
  'Downtown apartments',
  'Investment properties',
  'Commercial real estate',
  'Property management',
  'Market trends',
]

export default function NotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Redirect to search results
    router.push(`/properties/explore?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main content */}
        <div className="text-center mb-12">
          <NotFoundIllustration />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Oops! Property Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The property you're looking for might have been sold, removed, or the URL might be incorrect.
              Let's help you find what you're searching for.
            </p>
          </motion.div>
        </div>

        {/* Search section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Find Properties
              </CardTitle>
              <CardDescription>
                Search for properties, locations, or browse our listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  placeholder="Search properties, neighborhoods, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </form>

              {/* Popular searches */}
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500 mr-2">Popular:</span>
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {recentPages.map((page, index) => {
            const Icon = page.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-all duration-200 hover:scale-105">
                  <CardContent className="p-4">
                    <Link href={page.href} className="block text-center space-y-3">
                      <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium">{page.title}</h3>
                      <ExternalLink className="h-4 w-4 mx-auto text-gray-400" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Button onClick={handleGoBack} variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home Page
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/properties/explore">
              <Building className="h-4 w-4 mr-2" />
              Browse Properties
            </Link>
          </Button>
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center"
        >
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Need Help?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/help">
                    <FileText className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="tel:+1-555-0123">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Error Code: 404 • Page Not Found • PropertyChain Platform
          </p>
        </motion.div>
      </div>
    </div>
  )
}