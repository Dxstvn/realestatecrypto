/**
 * Color System Test Page
 * PropertyLend DeFi Platform
 * 
 * Phase 1.2: Testing WCAG AAA compliance
 */

'use client'

import { useState, useEffect } from 'react'
import { COLORS } from '@/lib/design-system/constants'
import { 
  validateDarkThemeColors, 
  getContrastRatio, 
  getContrastRating,
  meetsWCAG,
  colorCombinations 
} from '@/lib/design-system/color-utils'
import { Check, X, AlertCircle } from 'lucide-react'

export default function ColorSystemPage() {
  const [contrastResults, setContrastResults] = useState<any[]>([])

  useEffect(() => {
    setContrastResults(validateDarkThemeColors())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="container mx-auto max-w-7xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            Color System - Phase 1.2
          </h1>
          <p className="text-xl text-gray-400">
            WCAG AAA Compliance Testing & Validation
          </p>
        </div>

        {/* Contrast Validation Results */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Contrast Ratio Validation
          </h2>
          
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="grid gap-4">
              {contrastResults.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-950/50 border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded border-2 border-gray-700"
                        style={{ backgroundColor: result.foreground }}
                      />
                      <div 
                        className="w-10 h-10 rounded border-2 border-gray-700"
                        style={{ backgroundColor: result.background }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{result.name}</p>
                      <p className="text-sm text-gray-500">
                        Contrast Ratio: {result.ratio}:1
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.level === 'AAA' 
                          ? 'bg-green-900/50 text-green-400 border border-green-800'
                          : result.level === 'AA'
                          ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                          : 'bg-red-900/50 text-red-400 border border-red-800'
                      }`}
                    >
                      {result.label}
                    </span>
                    {result.level === 'AAA' ? (
                      <Check className="h-5 w-5 text-green-400" />
                    ) : result.level === 'AA' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Color Palette Grid */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Enhanced Color Palette
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Background Colors */}
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Background Colors</h3>
              <div className="space-y-3">
                {Object.entries(COLORS.background).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border border-gray-700"
                        style={{ 
                          backgroundColor: typeof color === 'string' ? color : 'transparent',
                          background: typeof color === 'string' ? color : 'transparent'
                        }}
                      />
                      <code className="text-xs text-gray-500">
                        {typeof color === 'string' ? color.substring(0, 7) : 'rgba'}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Text Colors</h3>
              <div className="space-y-3">
                {Object.entries(COLORS.text).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span 
                      className="text-sm capitalize"
                      style={{ color }}
                    >
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border border-gray-700"
                        style={{ backgroundColor: color }}
                      />
                      <code className="text-xs text-gray-500">{color}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Colors */}
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Brand Colors</h3>
              <div className="space-y-3">
                {Object.entries(COLORS.brand).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border border-gray-700 shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                      <code className="text-xs text-gray-500">{color}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Semantic Colors</h3>
              <div className="space-y-3">
                {Object.entries(COLORS.semantic).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border border-gray-700 shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                      <code className="text-xs text-gray-500">{color}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yield Colors */}
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Yield/APY Colors</h3>
              <div className="space-y-3">
                {Object.entries(COLORS.yield).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border border-gray-700 shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                      <code className="text-xs text-gray-500">{color}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neon Colors */}
            <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
              <h3 className="text-lg font-medium text-white mb-4">Neon Accents</h3>
              <div className="space-y-3">
                {Object.entries(COLORS.neon).map(([name, color]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span 
                      className="text-sm capitalize font-medium"
                      style={{ 
                        color,
                        textShadow: `0 0 10px ${color}, 0 0 20px ${color}`
                      }}
                    >
                      {name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded"
                        style={{ 
                          backgroundColor: color,
                          boxShadow: `0 0 15px ${color}`
                        }}
                      />
                      <code className="text-xs text-gray-500">{color}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Gradient System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(COLORS.gradients).map(([name, gradient]) => (
              <div 
                key={name}
                className="h-32 rounded-xl border border-gray-800 flex items-center justify-center"
                style={{ background: gradient }}
              >
                <span className="text-white font-medium capitalize bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Color Combinations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            Common Color Combinations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(colorCombinations).map(([name, combo]) => (
              <div 
                key={name}
                className="p-6 rounded-xl border"
                style={{ 
                  backgroundColor: combo.background,
                  borderColor: 'border' in combo ? combo.border : COLORS.background.glassBorder,
                  color: combo.text
                }}
              >
                <h3 className="font-medium mb-2 capitalize">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm opacity-80">
                  Sample text for contrast testing
                </p>
                {'accent' in combo && combo.accent && (
                  <p className="text-sm opacity-80 mt-3">
                    Accent color
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* WCAG Guidelines */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-white">
            WCAG AAA Guidelines
          </h2>
          
          <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-800">
            <div className="grid gap-4">
              <div className="flex items-start gap-4">
                <Check className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Normal Text</p>
                  <p className="text-sm text-gray-400">
                    Minimum contrast ratio of 7:1 for AAA compliance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Check className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Large Text (18pt+)</p>
                  <p className="text-sm text-gray-400">
                    Minimum contrast ratio of 4.5:1 for AAA compliance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Check className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Interactive Elements</p>
                  <p className="text-sm text-gray-400">
                    Minimum 44x44px touch targets for mobile accessibility
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Check className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-medium text-white">Focus Indicators</p>
                  <p className="text-sm text-gray-400">
                    Clear visible focus states with 3:1 contrast ratio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}