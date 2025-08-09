/**
 * Mobile Navigation Test Page - PropertyChain
 * Tests mobile navigation functionality and touch gestures
 */

'use client'

import { useState, useEffect } from 'react'
import { MobileNav, MobileNavTrigger } from '@/components/layouts/mobile-nav'

export default function TestMobileNavPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  
  useEffect(() => {
    const runTests = () => {
      const results: string[] = []
      const width = window.innerWidth
      setScreenWidth(width)
      
      // Check if mobile view
      const mobile = width < 1024
      setIsMobile(mobile)
      
      if (mobile) {
        results.push('✅ Mobile view detected (< 1024px)')
      } else {
        results.push(`⚠️ Desktop view (${width}px) - Resize to < 1024px for mobile`)
      }
      
      // Check for touch support
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      if (hasTouch) {
        results.push('✅ Touch support detected')
      } else {
        results.push('ℹ️ No touch support - Use mouse to test')
      }
      
      // Check Sheet component
      const sheetExists = document.querySelector('[role="dialog"]')
      if (isOpen && sheetExists) {
        results.push('✅ Sheet dialog rendered')
        
        // Check width
        const sheetContent = document.querySelector('[role="dialog"] > div')
        if (sheetContent) {
          const width = sheetContent.clientWidth
          if (width === 280 || width === 300) {
            results.push(`✅ Sheet width correct (${width}px)`)
          } else {
            results.push(`❌ Sheet width incorrect (${width}px, expected 280px)`)
          }
        }
        
        // Check for swipe indicator
        const swipeIndicator = document.querySelector('.absolute.top-1\\/2.left-1')
        if (swipeIndicator) {
          results.push('✅ Swipe indicator present')
        } else {
          results.push('❌ Swipe indicator missing')
        }
        
        // Check for accordion
        const accordion = document.querySelector('[data-radix-accordion-root]')
        if (accordion) {
          results.push('✅ Accordion component present')
        } else {
          results.push('❌ Accordion component missing')
        }
      }
      
      setTestResults(results)
    }
    
    // Run tests on mount and when dialog state changes
    runTests()
    
    // Also run on resize
    const handleResize = () => runTests()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mobile Navigation Test</h1>
        
        {/* Screen Info */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="text-lg font-semibold mb-2">Current Screen</h2>
          <div className="space-y-1">
            <p>Width: <span className="font-mono font-bold">{screenWidth}px</span></p>
            <p>Mode: <span className="font-bold">{isMobile ? 'Mobile' : 'Desktop'}</span></p>
            <p>Touch: <span className="font-bold">
              {'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Enabled' : 'Disabled'}
            </span></p>
          </div>
        </div>
        
        {/* Test Button */}
        <div className="mb-8 flex gap-4">
          <MobileNavTrigger onClick={() => setIsOpen(true)} />
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Open Mobile Nav
          </button>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
            >
              Close Mobile Nav
            </button>
          )}
        </div>
        
        {/* Test Results */}
        <div className="space-y-2 mb-8">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded ${
                result.startsWith('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : result.startsWith('❌')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : result.startsWith('⚠️')
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Resize browser to &lt;1024px for mobile view</li>
            <li>Click "Open Mobile Nav" button</li>
            <li>Test accordion dropdowns (Properties, Learn)</li>
            <li>On touch devices: Swipe right to close</li>
            <li>On desktop: Click outside or X button to close</li>
            <li>Test navigation links</li>
            <li>Check responsive behavior</li>
          </ol>
        </div>
        
        {/* Features */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded">
          <h2 className="text-xl font-semibold mb-4">Step 13 Features:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ 280px width drawer from right</li>
            <li>✅ Backdrop with overlay (Sheet component)</li>
            <li>✅ Touch gestures with react-swipeable</li>
            <li>✅ Accordion for nested navigation</li>
            <li>✅ Smooth animations</li>
            <li>✅ Accessibility features</li>
            <li>✅ Visual swipe indicator</li>
          </ul>
        </div>
      </div>
      
      {/* Mobile Navigation Component */}
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}