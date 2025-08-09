/**
 * Footer Test Page - PropertyChain
 * Tests footer component layout and functionality
 */

'use client'

import { useState, useEffect } from 'react'
import { Footer } from '@/components/layouts/footer'

export default function TestFooterPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [screenWidth, setScreenWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const runTests = () => {
      const results: string[] = []
      const width = window.innerWidth
      setScreenWidth(width)
      
      // Check if mobile view
      const mobile = width < 1024
      setIsMobile(mobile)
      
      // Check layout type
      if (mobile) {
        results.push('📱 Mobile layout active (< 1024px)')
      } else {
        results.push('🖥️ Desktop layout active (≥ 1024px)')
      }
      
      // Check for footer element
      const footer = document.querySelector('footer')
      if (footer) {
        results.push('✅ Footer element found')
        
        // Check for desktop columns
        const desktopGrid = footer.querySelector('.lg\\:grid-cols-4')
        if (!mobile && desktopGrid) {
          results.push('✅ 4-column desktop layout present')
        } else if (!mobile && !desktopGrid) {
          results.push('❌ Desktop 4-column layout missing')
        }
        
        // Check for mobile accordion
        const accordion = footer.querySelector('[data-radix-accordion-root]')
        if (mobile && accordion) {
          results.push('✅ Mobile accordion layout present')
        } else if (mobile && !accordion) {
          results.push('❌ Mobile accordion missing')
        }
        
        // Check for newsletter form
        const newsletterForm = footer.querySelector('form')
        if (newsletterForm) {
          results.push('✅ Newsletter form present')
          
          const emailInput = newsletterForm.querySelector('input[type="email"]')
          if (emailInput) {
            results.push('✅ Email input field present')
          } else {
            results.push('❌ Email input missing')
          }
        } else {
          results.push('❌ Newsletter form missing')
        }
        
        // Check for social links
        const socialLinks = footer.querySelectorAll('a[aria-label]')
        if (socialLinks.length > 0) {
          results.push(`✅ ${socialLinks.length} social links found`)
        } else {
          results.push('❌ Social links missing')
        }
        
        // Check for logo
        const logo = footer.querySelector('a[href="/"]')
        if (logo) {
          results.push('✅ Logo/brand link present')
        } else {
          results.push('❌ Logo missing')
        }
        
        // Check for trust badges
        const trustBadges = footer.querySelectorAll('.flex.items-center.gap-2.text-sm')
        if (trustBadges.length >= 3) {
          results.push('✅ Trust badges present')
        } else {
          results.push('❌ Trust badges missing or incomplete')
        }
        
        // Check for copyright
        const copyright = Array.from(footer.querySelectorAll('p')).find(p => 
          p.textContent?.includes('© ')
        )
        if (copyright) {
          results.push('✅ Copyright notice present')
        } else {
          results.push('❌ Copyright notice missing')
        }
        
        // Check container max-width
        const container = footer.querySelector('.max-w-\\[1440px\\]')
        if (container) {
          results.push('✅ Max-width container (1440px) present')
        } else {
          results.push('❌ Max-width container missing')
        }
        
        // Check border and styling
        const borderTop = window.getComputedStyle(footer).borderTopWidth
        if (borderTop !== '0px') {
          results.push('✅ Top border styling applied')
        } else {
          results.push('❌ Top border missing')
        }
        
        // Check padding/spacing
        const padding = window.getComputedStyle(footer.querySelector('.container') || footer).padding
        if (padding && padding !== '0px') {
          results.push('✅ Proper padding applied')
        }
      } else {
        results.push('❌ Footer element not found')
      }
      
      setTestResults(results)
    }
    
    // Run tests on mount and resize
    runTests()
    
    const handleResize = () => runTests()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Footer Component Test</h1>
          
          {/* Screen Info */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h2 className="text-lg font-semibold mb-2">Current Screen</h2>
            <div className="space-y-1">
              <p>Width: <span className="font-mono font-bold">{screenWidth}px</span></p>
              <p>Layout: <span className="font-bold">{isMobile ? 'Mobile (Accordion)' : 'Desktop (4-Column)'}</span></p>
            </div>
          </div>
          
          {/* Test Results */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded ${
                    result.startsWith('✅') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : result.startsWith('❌')
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : result.startsWith('📱') || result.startsWith('🖥️')
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-gray-50 text-gray-800 border border-gray-200'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature List */}
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded">
            <h2 className="text-xl font-semibold mb-4">Step 14 Features:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>✅ 4-column layout on desktop (≥1024px)</li>
              <li>✅ Accordion layout on mobile (&lt;1024px)</li>
              <li>✅ Newsletter subscription form with validation</li>
              <li>✅ Social media links</li>
              <li>✅ Organized navigation sections</li>
              <li>✅ Trust badges (SEC, SOC 2, etc.)</li>
              <li>✅ Contact information</li>
              <li>✅ Legal links</li>
              <li>✅ Copyright notice</li>
              <li>✅ Responsive design</li>
              <li>✅ Theme support (light/dark)</li>
              <li>✅ 8px grid spacing</li>
            </ul>
          </div>
          
          {/* Instructions */}
          <div className="p-6 bg-gray-50 border border-gray-200 rounded">
            <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Scroll down to see the footer component</li>
              <li>Resize browser to test responsive behavior (breakpoint: 1024px)</li>
              <li>On mobile: Click accordion items to expand/collapse</li>
              <li>Test newsletter form (enter email and submit)</li>
              <li>Click social media links (should open in new tab)</li>
              <li>Verify all navigation links are present</li>
              <li>Check theme compatibility (if theme toggle available)</li>
            </ol>
          </div>
          
          {/* Summary */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Summary:</h2>
            <div className="text-lg">
              <span className="text-green-600 font-semibold">
                {testResults.filter(r => r.startsWith('✅')).length} Passed
              </span>
              {' | '}
              <span className="text-red-600 font-semibold">
                {testResults.filter(r => r.startsWith('❌')).length} Failed
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Component */}
      <Footer />
    </div>
  )
}