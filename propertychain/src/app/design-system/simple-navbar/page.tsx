/**
 * Simple Transparent Navbar Test Page
 * PropertyLend DeFi Platform
 * 
 * Tests simple white/black text switching on transparent navbar
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Contrast,
  Eye,
  Zap,
  ChevronRight,
  ArrowDown,
  Sun,
  Moon,
  Palette,
  Type
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SimpleNavbarPage() {
  return (
    <div className="relative">
      {/* Hero Section - Dark Background */}
      <section className="dark-section relative min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 flex items-center justify-center overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
        
        <div className="relative z-10 text-center space-y-6 px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-300 bg-purple-500/10">
            <Contrast className="w-3 h-3 mr-1" />
            Simple Transparent Navbar
          </Badge>
          
          <h1 className="text-7xl font-bold text-white">
            White Text on Dark
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The navbar text is white when over dark backgrounds,
            ensuring perfect contrast and readability
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Eye className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Auto Detection</h3>
              <p className="text-sm text-gray-400">
                Automatically detects background color
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Type className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Simple Switch</h3>
              <p className="text-sm text-gray-400">
                Clean transition between white and black
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Zap className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Fast Performance</h3>
              <p className="text-sm text-gray-400">
                Minimal overhead, smooth 60fps
              </p>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="pt-16 animate-bounce">
            <ArrowDown className="h-8 w-8 text-white/50 mx-auto" />
            <p className="text-sm text-gray-400 mt-2">
              Scroll to see text color change
            </p>
          </div>
        </div>
      </section>

      {/* Light Section - White Background */}
      <section className="light-section min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge variant="outline" className="mb-4">
            Light Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-gray-900">
            Black Text on Light
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The navbar automatically switches to black text when scrolling over
            light backgrounds, maintaining perfect readability
          </p>
          
          {/* Visual Example */}
          <div className="bg-gray-50 rounded-2xl p-8 mt-12 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              How It Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Background Detection</p>
                    <p className="text-sm text-gray-600">
                      JavaScript checks elements under navbar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Brightness Calculation</p>
                    <p className="text-sm text-gray-600">
                      Determines if background is light or dark
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Color Switch</p>
                    <p className="text-sm text-gray-600">
                      Applies white or black text color
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Smooth Transition</p>
                    <p className="text-sm text-gray-600">
                      300ms ease for natural feel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gray Section */}
      <section className="light-section min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge variant="outline" className="mb-4">
            Gray Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-gray-900">
            Still Black Text
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Light gray backgrounds also trigger black text for optimal contrast
          </p>
        </div>
      </section>

      {/* Dark Blue Section */}
      <section className="dark-section min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-4 border-blue-400/30 text-blue-300 bg-blue-400/10">
            Dark Blue Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-white">
            Back to White Text
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Dark backgrounds automatically trigger white text
          </p>
        </div>
      </section>

      {/* Purple Gradient Section */}
      <section className="dark-section min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-4 border-pink-400/30 text-pink-300 bg-pink-400/10">
            Gradient Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-white">
            Handles Gradients
          </h2>
          
          <p className="text-xl text-pink-100 max-w-3xl mx-auto">
            Complex gradients are properly detected as dark or light
          </p>
          
          {/* Code Example */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mt-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
              Implementation
            </h3>
            <div className="font-mono text-sm text-gray-300 space-y-2">
              <div className="text-purple-400">// Check background color</div>
              <div>const brightness = calculateBrightness(bgColor)</div>
              <div>const textColor = brightness {'>'} 128 ? 'black' : 'white'</div>
              <div className="text-gray-500">// Apply with smooth transition</div>
              <div>element.style.color = textColor</div>
              <div>element.style.transition = 'color 300ms'</div>
            </div>
          </div>
        </div>
      </section>

      {/* Light Blue Section */}
      <section className="light-section min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-100">
            Light Blue Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-gray-900">
            Black on Light Blue
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Even colored light backgrounds trigger black text
          </p>
        </div>
      </section>

      {/* Dark Gray Section */}
      <section className="dark-section min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-4 border-gray-700 text-gray-300">
            Dark Gray Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-white">
            White on Dark Gray
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dark gray backgrounds use white text for contrast
          </p>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="light-section min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Technical Implementation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Sun className="h-5 w-5 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Light Backgrounds
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>Text color: rgb(0, 0, 0)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>Secondary: rgba(0, 0, 0, 0.7)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>Hover bg: rgba(0, 0, 0, 0.05)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>Active bg: rgba(0, 0, 0, 0.1)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Moon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">
                  Dark Backgrounds
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-600 mt-0.5" />
                  <span>Text color: rgb(255, 255, 255)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-600 mt-0.5" />
                  <span>Secondary: rgba(255, 255, 255, 0.8)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-600 mt-0.5" />
                  <span>Hover bg: rgba(255, 255, 255, 0.1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-600 mt-0.5" />
                  <span>Active bg: rgba(255, 255, 255, 0.15)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-3xl font-bold">300ms</p>
                <p className="text-sm opacity-90">Transition Time</p>
              </div>
              <div>
                <p className="text-3xl font-bold">60fps</p>
                <p className="text-sm opacity-90">Smooth Scrolling</p>
              </div>
              <div>
                <p className="text-3xl font-bold">0px</p>
                <p className="text-sm opacity-90">Background Blur</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm opacity-90">Transparent</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              This simple approach ensures perfect readability without visual complexity
            </p>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .bg-grid {
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  )
}