/**
 * Theme System Test Page
 * PropertyLend DeFi Platform
 * 
 * Phase 2.1: Testing theme switching functionality
 */

'use client'

import { useState } from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ButtonThemed } from '@/components/ui/button-themed'
import { CardThemed, PropertyCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card-themed'
import { InputThemed, SearchInput, PasswordInput, TextareaThemed } from '@/components/ui/input-themed'
import { Plus, Search, Star, TrendingUp, Shield } from 'lucide-react'

function ThemeTestContent() {
  const [loading, setLoading] = useState(false)

  const handleLoadingTest = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 light:from-gray-50 light:via-white light:to-gray-50 p-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl space-y-12">
        
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold dark:text-white light:text-gray-900">
              Theme System - Phase 2.1
            </h1>
            <p className="text-xl dark:text-gray-400 light:text-gray-600 mt-2">
              Component Theming & Dark/Light Mode Support
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Button Variants */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold dark:text-white light:text-gray-900">
            Button Components
          </h2>
          
          <div className="grid gap-6">
            {/* Primary Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-gray-300 light:text-gray-700">Primary Variants</h3>
              <div className="flex flex-wrap gap-4">
                <ButtonThemed variant="primary" size="sm">Small Primary</ButtonThemed>
                <ButtonThemed variant="primary" size="md">Medium Primary</ButtonThemed>
                <ButtonThemed variant="primary" size="lg">Large Primary</ButtonThemed>
                <ButtonThemed 
                  variant="primary" 
                  loading={loading} 
                  onClick={handleLoadingTest}
                >
                  {loading ? 'Loading...' : 'Test Loading'}
                </ButtonThemed>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-gray-300 light:text-gray-700">Secondary & Special Variants</h3>
              <div className="flex flex-wrap gap-4">
                <ButtonThemed variant="secondary">Secondary</ButtonThemed>
                <ButtonThemed variant="outline">Outline</ButtonThemed>
                <ButtonThemed variant="ghost">Ghost</ButtonThemed>
                <ButtonThemed variant="glass">Glass</ButtonThemed>
                <ButtonThemed variant="neon">Neon Effect</ButtonThemed>
                <ButtonThemed variant="success">Success</ButtonThemed>
                <ButtonThemed variant="danger">Danger</ButtonThemed>
              </div>
            </div>

            {/* Buttons with Icons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-gray-300 light:text-gray-700">With Icons</h3>
              <div className="flex flex-wrap gap-4">
                <ButtonThemed variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                  Add Investment
                </ButtonThemed>
                <ButtonThemed variant="outline" rightIcon={<TrendingUp className="h-4 w-4" />}>
                  View Analytics
                </ButtonThemed>
                <ButtonThemed variant="glass" leftIcon={<Shield className="h-4 w-4" />}>
                  Security
                </ButtonThemed>
              </div>
            </div>
          </div>
        </section>

        {/* Card Components */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold dark:text-white light:text-gray-900">
            Card Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Cards */}
            <CardThemed variant="default" padding="md">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a default card that adapts to the current theme.</p>
              </CardContent>
            </CardThemed>

            <CardThemed variant="glass" padding="md">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Glassmorphic effect with backdrop blur.</p>
              </CardContent>
            </CardThemed>

            <CardThemed variant="elevated" padding="md">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enhanced shadow and elevation.</p>
              </CardContent>
            </CardThemed>

            <CardThemed variant="interactive" padding="md" hover>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Hover effects and cursor pointer.</p>
              </CardContent>
            </CardThemed>

            <CardThemed variant="success" padding="md">
              <CardHeader>
                <CardTitle>Success State</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Success variant with green accents.</p>
              </CardContent>
            </CardThemed>

            <CardThemed variant="danger" padding="md">
              <CardHeader>
                <CardTitle>Danger State</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Danger variant with red accents.</p>
              </CardContent>
            </CardThemed>
          </div>

          {/* Property Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-gray-300 light:text-gray-700">Property Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PropertyCard
                image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
                title="Luxury Downtown Condo Development"
                apy={8.5}
                tvl={2500000}
                progress={65}
                timeLeft="12 days left"
                minInvestment={10000}
                tranche="senior"
              />
              
              <PropertyCard
                image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
                title="Modern Suburban Complex"
                apy={24.2}
                tvl={1800000}
                progress={45}
                timeLeft="8 days left"
                minInvestment={25000}
                tranche="junior"
              />
            </div>
          </div>
        </section>

        {/* Input Components */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold dark:text-white light:text-gray-900">
            Input Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Inputs */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium dark:text-gray-300 light:text-gray-700">Basic Inputs</h3>
              
              <InputThemed
                variant="default"
                label="Investment Amount"
                placeholder="Enter amount in USD"
                helperText="Minimum investment: $10,000"
              />

              <InputThemed
                variant="outline"
                label="Property Address"
                placeholder="123 Main St, City, State"
                required
              />

              <InputThemed
                variant="filled"
                label="APY Target"
                placeholder="8.5%"
                success="Valid APY range"
              />

              <InputThemed
                variant="glass"
                label="Glass Input"
                placeholder="Glassmorphic effect"
              />
            </div>

            {/* Special Inputs */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium dark:text-gray-300 light:text-gray-700">Special Inputs</h3>
              
              <SearchInput
                label="Search Properties"
                placeholder="Search by location, type, or APY..."
                onSearch={(value) => console.log('Search:', value)}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter secure password"
                helperText="Must be at least 8 characters"
              />

              <InputThemed
                variant="default"
                label="Error State"
                placeholder="This input has an error"
                error="This field is required"
              />

              <TextareaThemed
                variant="default"
                label="Property Description"
                placeholder="Describe the property investment opportunity..."
                helperText="Maximum 500 characters"
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* Theme Comparison */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold dark:text-white light:text-gray-900">
            Theme Comparison
          </h2>
          
          <CardThemed variant="default" padding="lg">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold dark:text-white light:text-gray-900">
                Current Theme Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium dark:text-gray-200 light:text-gray-800">Dark Theme</h4>
                  <ul className="space-y-2 text-sm dark:text-gray-400 light:text-gray-600">
                    <li>• Deep space background colors</li>
                    <li>• Glassmorphic effects</li>
                    <li>• High contrast text (WCAG AAA)</li>
                    <li>• Neon accent colors</li>
                    <li>• Gradient button effects</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium dark:text-gray-200 light:text-gray-800">Light Theme</h4>
                  <ul className="space-y-2 text-sm dark:text-gray-400 light:text-gray-600">
                    <li>• Clean white backgrounds</li>
                    <li>• Subtle shadows and borders</li>
                    <li>• Professional color palette</li>
                    <li>• Accessible contrast ratios</li>
                    <li>• Modern flat design</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <ButtonThemed variant="primary">
                  Toggle Theme Above ↑
                </ButtonThemed>
                <ButtonThemed variant="outline">
                  Test Interactions
                </ButtonThemed>
              </div>
            </div>
          </CardThemed>
        </section>
      </div>
    </div>
  )
}

export default function ThemeSystemPage() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ThemeTestContent />
    </ThemeProvider>
  )
}