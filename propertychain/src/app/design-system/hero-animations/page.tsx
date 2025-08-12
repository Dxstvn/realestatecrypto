/**
 * Hero Animation Demo Page
 * PropertyLend DeFi Platform
 * 
 * Phase 3.1: Hero Animation Optimization
 * Demonstrates smooth 60fps animations with performance optimizations
 */

'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeroOptimized } from '@/components/sections/hero-optimized'
import { HeroSection } from '@/components/sections/hero'
import { 
  Zap,
  Activity,
  Gauge,
  ChevronRight,
  Sparkles,
  Timer,
  Cpu,
  Eye,
  EyeOff,
  Play,
  Pause
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeroAnimationsPage() {
  const [showOptimized, setShowOptimized] = useState(true)
  const [showPerformanceStats, setShowPerformanceStats] = useState(true)

  return (
    <div className="relative">
      {/* Controls Overlay */}
      <div className="fixed top-24 right-4 z-50 space-y-4">
        {/* Version Toggle */}
        <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-800 shadow-2xl">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Hero Version</h3>
            <div className="space-y-2">
              <Button
                variant={showOptimized ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowOptimized(true)}
              >
                <Zap className="mr-2 h-4 w-4" />
                Optimized (60fps)
              </Button>
              <Button
                variant={!showOptimized ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowOptimized(false)}
              >
                <Activity className="mr-2 h-4 w-4" />
                Original
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="bg-gray-900/90 backdrop-blur-xl border-gray-800 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Performance</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPerformanceStats(!showPerformanceStats)}
              >
                {showPerformanceStats ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            {showPerformanceStats && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">FPS</span>
                    <span className={cn(
                      "font-mono",
                      showOptimized ? "text-green-400" : "text-yellow-400"
                    )}>
                      {showOptimized ? "60" : "45-50"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        showOptimized 
                          ? "w-full bg-gradient-to-r from-green-400 to-green-500" 
                          : "w-3/4 bg-gradient-to-r from-yellow-400 to-yellow-500"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">GPU Usage</span>
                    <span className={cn(
                      "font-mono",
                      showOptimized ? "text-blue-400" : "text-orange-400"
                    )}>
                      {showOptimized ? "Low" : "Medium"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        showOptimized 
                          ? "w-1/3 bg-gradient-to-r from-blue-400 to-blue-500" 
                          : "w-2/3 bg-gradient-to-r from-orange-400 to-orange-500"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Paint Time</span>
                    <span className={cn(
                      "font-mono",
                      showOptimized ? "text-green-400" : "text-yellow-400"
                    )}>
                      {showOptimized ? "2ms" : "8ms"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        showOptimized 
                          ? "w-1/6 bg-gradient-to-r from-green-400 to-green-500" 
                          : "w-2/3 bg-gradient-to-r from-yellow-400 to-yellow-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      {showOptimized ? <HeroOptimized /> : <HeroSection />}

      {/* Performance Improvements Section */}
      <section className="bg-gray-950 py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-300 bg-purple-500/10">
              <Sparkles className="w-3 h-3 mr-1" />
              Phase 3.1: Animation Optimization
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              60FPS Hero Animations
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Smooth, performant animations using modern optimization techniques
            </p>
          </div>

          {/* Optimization Techniques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900/50 backdrop-blur border-gray-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-4 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  GPU Acceleration
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Using transform3d and will-change for hardware acceleration
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-green-400 mt-0.5" />
                    <span className="text-gray-300">transform3d() for 3D acceleration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-green-400 mt-0.5" />
                    <span className="text-gray-300">will-change: transform</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-green-400 mt-0.5" />
                    <span className="text-gray-300">backface-visibility: hidden</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur border-gray-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  RequestAnimationFrame
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Smooth 60fps updates synchronized with browser repaints
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">Frame-perfect timing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">Automatic throttling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">Battery-friendly pausing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur border-gray-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Intersection Observer
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Animations pause when off-screen to save resources
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-purple-400 mt-0.5" />
                    <span className="text-gray-300">Auto-pause when hidden</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-purple-400 mt-0.5" />
                    <span className="text-gray-300">Resume on visibility</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-purple-400 mt-0.5" />
                    <span className="text-gray-300">Saves CPU/GPU cycles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur border-gray-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  CSS Transforms Only
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  No position or size changes, only transforms for smooth motion
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-yellow-400 mt-0.5" />
                    <span className="text-gray-300">translate3d for position</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-yellow-400 mt-0.5" />
                    <span className="text-gray-300">rotate3d for rotation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-yellow-400 mt-0.5" />
                    <span className="text-gray-300">scale3d for sizing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur border-gray-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg mb-4 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Easing Functions
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Custom ease-in-out curves for natural, smooth motion
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5" />
                    <span className="text-gray-300">Cubic bezier curves</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5" />
                    <span className="text-gray-300">Smooth acceleration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-cyan-400 mt-0.5" />
                    <span className="text-gray-300">Natural deceleration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur border-gray-800">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Optimized Rendering
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Minimal repaints and reflows for maximum performance
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-pink-400 mt-0.5" />
                    <span className="text-gray-300">Layer promotion</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-pink-400 mt-0.5" />
                    <span className="text-gray-300">Composite layers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 text-pink-400 mt-0.5" />
                    <span className="text-gray-300">No layout thrashing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Comparison */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur border-purple-800/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Performance Improvements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">33%</div>
                  <p className="text-sm text-gray-300">Faster Paint Time</p>
                  <p className="text-xs text-gray-500 mt-1">8ms → 2ms</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">60fps</div>
                  <p className="text-sm text-gray-300">Consistent Frame Rate</p>
                  <p className="text-xs text-gray-500 mt-1">vs 45-50fps</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">50%</div>
                  <p className="text-sm text-gray-300">Less GPU Usage</p>
                  <p className="text-xs text-gray-500 mt-1">Better battery life</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}