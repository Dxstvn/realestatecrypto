/**
 * Navigation Test Page - PropertyChain
 * Tests all header functionality and specifications
 */

"use client"

import { useEffect, useState } from 'react'

export default function TestNavigationPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  
  useEffect(() => {
    // Immediate test execution when component mounts
    const runTests = () => {
      const results: string[] = []
      
      // Get main header element
      const headerEl = document.querySelector('header')
      if (!headerEl) {
        results.push("❌ Header element not found")
        setTestResults(results)
        return
      }
      
      // Add a test to confirm we're running
      results.push("🔄 Tests started...")
      
      // Test 1: Desktop Layout
      const desktopNav = headerEl.querySelector('.hidden.lg\\:flex')
      if (desktopNav) {
        results.push("✅ Desktop layout (≥1024px) exists")
      } else {
        results.push("❌ Desktop layout not found")
      }
      
      // Test 2: Header Height 
      const headerHeight = headerEl.clientHeight
      if (headerHeight >= 60 && headerHeight <= 96) {
        results.push("✅ Header height is appropriate (60-96px)")
      } else {
        results.push(`❌ Header height is ${headerHeight}px, should be 60-96px`)
      }
      
      // Test 3: Max width container
      const container = headerEl.querySelector('.max-w-\\[1440px\\]')
      if (container) {
        results.push("✅ Desktop max-width container (1440px) exists")
      } else {
        results.push("❌ Desktop max-width container missing")
      }
    
      // Test 4: Mobile Layout
      const mobileNav = headerEl.querySelector('.lg\\:hidden')
      if (mobileNav) {
        results.push("✅ Mobile layout (<1024px) exists")
      } else {
        results.push("❌ Mobile layout not found")
      }
      
      // Test 5: Logo Section
      const logo = headerEl.querySelector('a[href="/"]')
      if (logo) {
        results.push("✅ Logo link exists")
        
        // Check gradient background
        const logoIcon = logo.querySelector('.bg-gradient-to-br')
        if (logoIcon) {
          results.push("✅ Logo has gradient background")
        } else {
          results.push("❌ Logo gradient background missing")
        }
        
        // Check PropertyChain text
        const brandText = logo.textContent?.includes('PropertyChain')
        if (brandText) {
          results.push("✅ PropertyChain brand text present")
        } else {
          results.push("❌ PropertyChain brand text missing")
        }
        
        // Check tagline
        const tagline = logo.textContent?.includes('Tokenized Real Estate')
        if (tagline) {
          results.push("✅ 'Tokenized Real Estate' tagline present")
        } else {
          results.push("❌ Tagline missing")
        }
      } else {
        results.push("❌ Logo section not found")
      }
      
      // Test 6: Navigation Menu Items - Check for dropdown trigger buttons
      // Properties dropdown trigger
      const propertiesButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.trim().startsWith('Properties')
      )
      
      if (propertiesButton) {
        results.push("✅ Properties navigation menu exists")
      } else {
        results.push("❌ Properties navigation menu missing")
      }
      
      // Learn dropdown trigger
      const learnButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.trim().startsWith('Learn')
      )
      
      if (learnButton) {
        results.push("✅ Learn navigation menu exists") 
      } else {
        results.push("❌ Learn navigation menu missing")
      }
      
      // Support link
      const supportLink = document.querySelector('a[href="/contact"]')
      if (supportLink) {
        results.push("✅ Support navigation link exists")
      } else {
        results.push("❌ Support navigation link missing")
      }
      
      // Test 7: Authentication Buttons
      const signInBtn = document.querySelector('a[href="/login"]')
      const getStartedBtn = document.querySelector('a[href="/register"]')
      
      if (signInBtn) {
        results.push("✅ Sign In button exists")
      } else {
        results.push("❌ Sign In button missing")
      }
      
      if (getStartedBtn) {
        results.push("✅ Get Started button exists")
      } else {
        results.push("❌ Get Started button missing")
      }
      
      // Test 8: Mobile Menu Trigger
      const menuTrigger = document.querySelector('button[aria-haspopup="dialog"]')
      if (menuTrigger) {
        results.push("✅ Mobile menu trigger exists")
      } else {
        results.push("❌ Mobile menu trigger missing")
      }
      
      // Test 9: Fixed Positioning
      const styles = window.getComputedStyle(headerEl)
      if (styles.position === 'fixed') {
        results.push("✅ Header has fixed positioning")
      } else {
        results.push(`❌ Header position is ${styles.position}, should be fixed`)
      }
      
      // Test 10: Z-Index
      const zIndex = parseInt(styles.zIndex)
      if (zIndex >= 1000) {
        results.push("✅ Header has correct z-index (≥1000)")
      } else {
        results.push(`❌ Header z-index is ${zIndex}, should be ≥1000`)
      }
    
      setTestResults(results)
    }
    
    // Run tests immediately and also after a delay to ensure DOM is ready
    runTests()
    const timer = setTimeout(runTests, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="min-h-screen pt-[72px] p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Navigation Header Test Results</h1>
        
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`p-3 rounded ${
                result.startsWith('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded">
          <h2 className="text-xl font-semibold mb-4">Manual Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Resize browser to &lt;1024px to test mobile layout</li>
            <li>Click mobile menu button to test Sheet drawer</li>
            <li>Hover over Properties and Learn buttons to see dropdowns</li>
            <li>Test Sign In and Get Started buttons</li>
            <li>Verify header stays fixed on scroll</li>
            <li>Check responsive behavior at different breakpoints</li>
          </ol>
        </div>
        
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="text-xl font-semibold mb-4">Current Navigation Structure:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Properties</strong> - Dropdown menu (Browse All, Featured Deals, Compare)</li>
            <li><strong>Learn</strong> - Dropdown menu (How It Works, About PropertyChain)</li>
            <li><strong>Support</strong> - Direct link to contact page</li>
          </ul>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Test Summary:</h2>
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
  )
}