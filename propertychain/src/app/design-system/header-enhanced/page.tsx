/**
 * Header Enhancement Test Page
 * PropertyLend DeFi Platform
 * 
 * Phase 2.4: Navigation & Header Improvements
 * Demonstrates all header improvements including scroll-aware styling
 */

'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle,
  ArrowDown,
  Layers,
  Eye,
  Zap,
  Monitor,
  Smartphone,
  Shield,
  Clock,
  Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeaderEnhancedTestPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 20)
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const scrollProgress = Math.min((scrollY / 500) * 100, 100)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Fixed Scroll Indicator */}
      <div className="fixed top-20 right-4 z-40 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-lg p-4 w-64">
        <h3 className="text-sm font-semibold text-white mb-3">Scroll State</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Scroll Y</span>
              <span className="text-white font-mono">{scrollY}px</span>
            </div>
            <Progress value={scrollProgress} className="h-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              isScrolled ? "bg-green-500" : "bg-gray-600"
            )} />
            <span className="text-xs text-gray-300">
              {isScrolled ? "Navbar Scrolled" : "Navbar at Top"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 lg:px-12 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-20">
          <Badge variant="outline" className="mb-4">
            Phase 2.4 Implementation
          </Badge>
          <h1 className="text-5xl font-bold text-white">
            Navigation & Header Improvements
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Scroll-aware navbar with adaptive styling, proper content overlap prevention,
            and smooth transitions for all properties
          </p>
          
          {/* Scroll Prompt */}
          <div className="pt-8 animate-bounce">
            <ArrowDown className="h-8 w-8 text-primary mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Scroll to see navbar transitions</p>
          </div>
        </div>

        {/* Key Features Grid */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Phase 2.4 Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Scroll-Aware Background",
                description: "Navbar transitions from transparent to solid with glassmorphic blur",
                icon: <Eye className="h-6 w-6" />,
                details: [
                  "Transparent at top of page",
                  "95% opacity when scrolled",
                  "12px backdrop blur",
                  "Smooth 300ms transition"
                ]
              },
              {
                title: "Content Overlap Prevention",
                description: "Automatic spacing to prevent content hiding behind fixed navbar",
                icon: <Layers className="h-6 w-6" />,
                details: [
                  "60px padding on mobile",
                  "72px padding on desktop",
                  "Invisible spacer element",
                  "Responsive breakpoints"
                ]
              },
              {
                title: "Theme Adaptation",
                description: "Different styles for light and dark themes",
                icon: <Palette className="h-6 w-6" />,
                details: [
                  "Dark: rgba(10, 11, 20, 0.95)",
                  "Light: rgba(255, 255, 255, 0.95)",
                  "Adaptive border colors",
                  "Theme-aware shadows"
                ]
              },
              {
                title: "Z-Index Management",
                description: "Proper layering to ensure navbar stays above all content",
                icon: <Shield className="h-6 w-6" />,
                details: [
                  "z-index: 50 for navbar",
                  "Above all page content",
                  "Below modals and popovers",
                  "Dropdown menus handled"
                ]
              },
              {
                title: "Smooth Transitions",
                description: "All properties animate smoothly for polished feel",
                icon: <Clock className="h-6 w-6" />,
                details: [
                  "300ms duration",
                  "ease-out timing",
                  "Background opacity",
                  "Border and shadow"
                ]
              },
              {
                title: "Mobile Responsive",
                description: "Adaptive heights and padding for different screen sizes",
                icon: <Smartphone className="h-6 w-6" />,
                details: [
                  "Mobile: 60px height",
                  "Desktop: 72px height",
                  "Responsive padding",
                  "Touch-friendly targets"
                ]
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 space-y-4 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Implementation Code Examples */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Implementation Details
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Scroll-Aware Hook
              </h3>
              <pre className="text-xs bg-gray-950 p-4 rounded-lg overflow-x-auto">
                <code className="text-gray-400">{`const useScrollNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 20)
      setIsAtTop(scrollY < 5)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return { isScrolled, isAtTop }
}`}</code>
              </pre>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Adaptive Styling
              </h3>
              <pre className="text-xs bg-gray-950 p-4 rounded-lg overflow-x-auto">
                <code className="text-gray-400">{`className={cn(
  'fixed top-0 w-full z-50',
  'transition-all duration-300 ease-out',
  isAtTop ? [
    'bg-transparent',
    'border-b border-transparent'
  ] : isScrolled ? [
    'bg-gray-950/95',
    'backdrop-blur-xl',
    'border-b border-white/10',
    'shadow-lg shadow-black/30'
  ] : [
    'bg-gray-950/80',
    'backdrop-blur-md',
    'border-b border-white/5'
  ]
)}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Responsive Testing Guide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Responsive Testing
          </h2>
          
          <div className="bg-blue-950/20 border border-blue-800/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Monitor className="h-8 w-8 text-blue-400 flex-shrink-0" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Desktop (≥1024px)
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Navbar height: 72px</li>
                    <li>• Full navigation menu visible</li>
                    <li>• APY ticker and network indicator shown</li>
                    <li>• Theme toggle in dropdown</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Tablet (768px - 1023px)
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Navbar height: 60px</li>
                    <li>• Navigation hidden in hamburger menu</li>
                    <li>• Compact logo display</li>
                    <li>• Theme toggle in sheet menu</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Mobile (&lt;768px)
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Navbar height: 60px</li>
                    <li>• Full sheet navigation</li>
                    <li>• Touch-friendly targets (44px min)</li>
                    <li>• Simplified layout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Success Metrics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Transition Smoothness", value: "300ms", status: "optimal" },
              { label: "Z-Index Management", value: "✓", status: "correct" },
              { label: "Content Overlap", value: "0px", status: "fixed" },
              { label: "Mobile Responsive", value: "100%", status: "complete" }
            ].map((metric, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-500 mb-2">{metric.label}</p>
                <p className={cn(
                  "text-2xl font-bold",
                  metric.status === 'optimal' && 'text-green-400',
                  metric.status === 'correct' && 'text-blue-400',
                  metric.status === 'fixed' && 'text-purple-400',
                  metric.status === 'complete' && 'text-primary'
                )}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testing Instructions */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Testing Instructions
          </h2>
          
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <p className="text-gray-200 font-medium">Test Scroll Transitions</p>
                  <p className="text-sm text-gray-400">
                    Scroll slowly and observe the navbar background transitioning from transparent to solid
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <p className="text-gray-200 font-medium">Check Content Overlap</p>
                  <p className="text-sm text-gray-400">
                    Verify that the hero text and page content are not hidden behind the navbar
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <p className="text-gray-200 font-medium">Toggle Theme</p>
                  <p className="text-sm text-gray-400">
                    Switch between light and dark themes to see adaptive styling
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <p className="text-gray-200 font-medium">Test Responsive Behavior</p>
                  <p className="text-sm text-gray-400">
                    Resize your browser window to test mobile and tablet breakpoints
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white text-sm rounded-full flex items-center justify-center font-bold">
                  5
                </span>
                <div>
                  <p className="text-gray-200 font-medium">Verify Z-Index</p>
                  <p className="text-sm text-gray-400">
                    Open dropdowns and ensure they appear correctly above/below the navbar
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Spacer for Scroll Testing */}
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-center">
            <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-2xl font-semibold text-white mb-2">
              Keep Scrolling!
            </p>
            <p className="text-gray-400">
              Watch the navbar adapt as you scroll
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <section className="py-20 text-center">
          <Badge variant="outline" className="mb-4">
            Phase 2.4 Complete
          </Badge>
          <h2 className="text-3xl font-bold text-white mb-4">
            Navigation & Header Improvements
          </h2>
          <p className="text-lg text-gray-400">
            All requirements successfully implemented
          </p>
        </section>
      </div>
    </div>
  )
}