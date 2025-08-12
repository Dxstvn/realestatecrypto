/**
 * Transparent Header Test Page
 * PropertyLend DeFi Platform
 * 
 * Demonstrates transparent navbar with adaptive text colors
 */

'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeaderTransparent } from '@/components/layouts/header-transparent'
import { 
  Eye,
  Sun,
  Moon,
  ArrowDown,
  Palette,
  Type,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TransparentHeaderTestPage() {
  const [forceLight, setForceLight] = useState(false)
  const [forceDark, setForceDark] = useState(false)
  
  return (
    <>
      {/* Override the default header with our test configuration */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderTransparent 
          forceLight={forceLight} 
          forceDark={forceDark}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative">
        {/* Dark Hero Section */}
        <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
          
          <div className="relative z-10 text-center space-y-6 px-4">
            <Badge variant="outline" className="mb-4 border-white/20 text-white">
              Transparent Adaptive Header
            </Badge>
            
            <h1 className="text-6xl font-bold text-white">
              Transparent Navigation
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The navbar background stays transparent while text colors adapt
              to ensure visibility on any background
            </p>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4 pt-8">
              <Button
                variant={forceLight ? "default" : "outline"}
                onClick={() => {
                  setForceLight(true)
                  setForceDark(false)
                }}
                className={forceLight ? "" : "border-white/20 text-white hover:bg-white/10"}
              >
                <Sun className="mr-2 h-4 w-4" />
                Force Light Text
              </Button>
              
              <Button
                variant={!forceLight && !forceDark ? "default" : "outline"}
                onClick={() => {
                  setForceLight(false)
                  setForceDark(false)
                }}
                className={!forceLight && !forceDark ? "" : "border-white/20 text-white hover:bg-white/10"}
              >
                <Eye className="mr-2 h-4 w-4" />
                Auto Adapt
              </Button>
              
              <Button
                variant={forceDark ? "default" : "outline"}
                onClick={() => {
                  setForceLight(false)
                  setForceDark(true)
                }}
                className={forceDark ? "" : "border-white/20 text-white hover:bg-white/10"}
              >
                <Moon className="mr-2 h-4 w-4" />
                Force Dark Text
              </Button>
            </div>
            
            {/* Scroll Indicator */}
            <div className="pt-16 animate-bounce">
              <ArrowDown className="h-8 w-8 text-white/50 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">
                Scroll to see text adaptation
              </p>
            </div>
          </div>
        </section>

        {/* Light Section */}
        <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <Badge variant="outline" className="mb-4">
              Light Background Section
            </Badge>
            
            <h2 className="text-5xl font-bold text-gray-900">
              Automatic Adaptation
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              When scrolling over light backgrounds, the navbar text automatically
              darkens to maintain readability
            </p>
            
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Adaptive Colors</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Text color changes based on background
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Type className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Always Readable</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Ensures text is visible on any background
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Transparent BG</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Background remains fully transparent
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dark Section Again */}
        <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <Badge variant="outline" className="mb-4 border-white/20 text-white">
              Dark Background Section
            </Badge>
            
            <h2 className="text-5xl font-bold text-white">
              Back to Light Text
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The navbar text returns to light colors when over dark backgrounds,
              maintaining perfect contrast
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Smart Detection
                </h3>
                <p className="text-sm text-gray-400">
                  Automatically detects background luminosity and adjusts accordingly
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Smooth Transitions
                </h3>
                <p className="text-sm text-gray-400">
                  300ms transitions ensure smooth color changes without jarring effects
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Manual Override
                </h3>
                <p className="text-sm text-gray-400">
                  Option to force light or dark text when auto-detection isn't suitable
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient Section */}
        <section className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-500 to-pink-400 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <Badge variant="outline" className="mb-4 border-white/20 text-white bg-black/20">
              Gradient Background
            </Badge>
            
            <h2 className="text-5xl font-bold text-white drop-shadow-lg">
              Works on Gradients Too
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              The adaptive system handles gradient backgrounds gracefully,
              choosing the most appropriate text color
            </p>
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Implementation Details
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  How It Works
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>The navbar maintains a completely transparent background at all times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Text color adapts based on scroll position and underlying content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Light text for dark backgrounds, dark text for light backgrounds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span>Smooth 300ms transitions prevent jarring color changes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">5.</span>
                    <span>Optional subtle backdrop blur at 50px scroll for improved readability</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Usage Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {'<HeaderTransparent />'}
                    </code>
                    <p className="text-gray-600 mt-2">
                      Auto-adapts based on scroll position
                    </p>
                  </div>
                  
                  <div>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {'<HeaderTransparent forceLight />'}
                    </code>
                    <p className="text-gray-600 mt-2">
                      Forces light text (for known dark backgrounds)
                    </p>
                  </div>
                  
                  <div>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {'<HeaderTransparent forceDark />'}
                    </code>
                    <p className="text-gray-600 mt-2">
                      Forces dark text (for known light backgrounds)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}