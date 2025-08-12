/**
 * Apple-Style Navbar Demo Page
 * PropertyLend DeFi Platform
 * 
 * Showcases Apple-inspired navbar with subtle backdrop blur
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Apple,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowDown,
  Monitor,
  Zap,
  Shield,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AppleNavbarPage() {
  return (
    <div className="relative">
      {/* Hero Section - Dark Background */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
          <div className="absolute h-full w-full bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-300 bg-purple-500/10">
            <Apple className="w-3 h-3 mr-1" />
            Apple-Inspired Design
          </Badge>
          
          <h1 className="text-7xl font-bold text-white">
            Subtle Backdrop Blur
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the elegance of Apple's navigation design with
            smooth backdrop blur and perfect readability
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Dynamic Blur</h3>
              <p className="text-sm text-gray-400">
                Backdrop blur intensity increases as you scroll
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Always Readable</h3>
              <p className="text-sm text-gray-400">
                Text remains perfectly visible on any background
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Smooth Performance</h3>
              <p className="text-sm text-gray-400">
                Hardware-accelerated for 60fps scrolling
              </p>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="pt-16 animate-bounce">
            <ArrowDown className="h-8 w-8 text-white/50 mx-auto" />
            <p className="text-sm text-gray-400 mt-2">
              Scroll to see the navbar transform
            </p>
          </div>
        </div>
      </section>

      {/* Light Section */}
      <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge variant="outline" className="mb-4">
            Light Background
          </Badge>
          
          <h2 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
            Adapts to Theme
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The navbar automatically adjusts its backdrop color and opacity
            based on the current theme, maintaining consistency
          </p>
          
          {/* Technical Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              How It Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Scroll Detection</p>
                    <p className="text-sm text-gray-600">
                      JavaScript tracks scroll position in real-time
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dynamic Backdrop</p>
                    <p className="text-sm text-gray-600">
                      Background opacity increases from 0 to 85% as you scroll
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Blur Effect</p>
                    <p className="text-sm text-gray-600">
                      20px blur with 180% saturation for that Apple feel
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Smooth Transitions</p>
                    <p className="text-sm text-gray-600">
                      200ms ease-out for natural, responsive feel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complex Gradient Section */}
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-600 to-orange-400 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 max-w-5xl mx-auto">
          <Badge variant="outline" className="mb-4 border-white/30 text-white bg-black/20">
            Gradient Background
          </Badge>
          
          <h2 className="text-6xl font-bold text-white drop-shadow-2xl">
            Works Everywhere
          </h2>
          
          <p className="text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
            The backdrop blur creates a consistent visual layer that
            ensures content remains readable on any background
          </p>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="min-h-screen bg-gray-900 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-gray-800/[0.04] bg-grid" />
        <div className="relative max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Implementation Details
          </h2>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">CSS Properties</h3>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                  <div>backdrop-filter: saturate(180%) blur(20px);</div>
                  <div>-webkit-backdrop-filter: saturate(180%) blur(20px);</div>
                  <div>background-color: rgba(255, 255, 255, 0.85);</div>
                  <div>border-bottom: 1px solid rgba(0, 0, 0, 0.15);</div>
                  <div>transition: all 200ms ease-out;</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Browser Support</p>
                      <p className="text-sm text-gray-400">
                        Works in Safari, Chrome, Edge, and Firefox
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Performance</p>
                      <p className="text-sm text-gray-400">
                        GPU-accelerated for smooth 60fps
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Theme Aware</p>
                      <p className="text-sm text-gray-400">
                        Adapts to light and dark modes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Layers className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Layered Design</p>
                      <p className="text-sm text-gray-400">
                        Creates depth and hierarchy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Advantages</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-400" />
                    <p className="text-gray-300">No complex color detection needed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-400" />
                    <p className="text-gray-300">Consistent visual appearance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-400" />
                    <p className="text-gray-300">Simpler implementation and maintenance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-green-400" />
                    <p className="text-gray-300">Better performance than color adaptation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid {
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  )
}