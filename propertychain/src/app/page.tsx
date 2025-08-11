/**
 * Homepage - PropertyChain
 * 
 * Landing page following UpdatedUIPlan.md Section 4.1 specifications
 * Integrates Hero Section from Section 3 specifications
 * Following CLAUDE.md principles for clarity and performance
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PropertyCard } from '@/components/custom/property-card'
import { KPICard } from '@/components/custom/kpi-card'
import { HeroOptimized } from '@/components/sections/hero-optimized'
import {
  HowItWorksSection,
  BenefitsSection,
  TrustSection,
  TestimonialsSection,
  FAQSection,
} from '@/components/sections/landing-sections'
import { 
  ArrowRight, 
  Building, 
  TrendingUp, 
  Users,
  DollarSign,
} from 'lucide-react'

// ============================================================================
// Mock Data
// ============================================================================

const featuredProperties = [
  {
    id: '1',
    title: 'Luxury Downtown Condo',
    location: '123 Main St, New York, NY',
    price: 850000,
    tokenPrice: 100,
    tokensAvailable: 8500,
    totalTokens: 8500,
    annualReturn: 8.5,
    monthlyYield: 0.71,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    status: 'funding' as const,
    type: 'Residential',
    fundingProgress: 65,
    investors: 142,
    daysLeft: 12,
  },
  {
    id: '2',
    title: 'Modern Office Complex',
    location: '456 Business Blvd, San Francisco, CA',
    price: 2500000,
    tokenPrice: 250,
    tokensAvailable: 10000,
    totalTokens: 10000,
    annualReturn: 10.2,
    monthlyYield: 0.85,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    status: 'funding' as const,
    type: 'Commercial',
    fundingProgress: 42,
    investors: 89,
    daysLeft: 18,
  },
  {
    id: '3',
    title: 'Beachfront Resort Property',
    location: '789 Ocean Dr, Miami, FL',
    price: 3200000,
    tokenPrice: 500,
    tokensAvailable: 6400,
    totalTokens: 6400,
    annualReturn: 12.5,
    monthlyYield: 1.04,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
    status: 'funding' as const,
    type: 'Hospitality',
    fundingProgress: 78,
    investors: 256,
    daysLeft: 5,
  },
  {
    id: '4',
    title: 'Industrial Warehouse District',
    location: '321 Industrial Way, Chicago, IL',
    price: 1800000,
    tokenPrice: 150,
    tokensAvailable: 12000,
    totalTokens: 12000,
    annualReturn: 9.8,
    monthlyYield: 0.82,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    status: 'funded' as const,
    type: 'Industrial',
    fundingProgress: 100,
    investors: 312,
    daysLeft: 0,
  },
  {
    id: '5',
    title: 'Mixed-Use Development',
    location: '555 Urban Plaza, Austin, TX',
    price: 4500000,
    tokenPrice: 300,
    tokensAvailable: 15000,
    totalTokens: 15000,
    annualReturn: 11.3,
    monthlyYield: 0.94,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    status: 'funding' as const,
    type: 'Mixed-Use',
    fundingProgress: 35,
    investors: 167,
    daysLeft: 24,
  },
  {
    id: '6',
    title: 'Student Housing Complex',
    location: '999 University Ave, Boston, MA',
    price: 2100000,
    tokenPrice: 200,
    tokensAvailable: 10500,
    totalTokens: 10500,
    annualReturn: 9.2,
    monthlyYield: 0.77,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
    status: 'funding' as const,
    type: 'Residential',
    fundingProgress: 58,
    investors: 198,
    daysLeft: 15,
  },
]


// ============================================================================
// Homepage Component
// ============================================================================

export default function HomePage() {
  const router = useRouter()

  return (
    <>
      {/* Optimized Hero Section with 60fps animations */}
      <HeroOptimized />

      {/* Statistics Bar - 4 KPI cards, 280px width each (Section 4.1) */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Value Locked"
              value="$125M"
              change={12.5}
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
              description="Platform assets"
            />
            <KPICard
              title="Active Investors"
              value="15,234"
              change={8.2}
              trend="up"
              icon={<Users className="h-5 w-5" />}
              description="Verified users"
            />
            <KPICard
              title="Properties Funded"
              value="342"
              change={15.3}
              trend="up"
              icon={<Building className="h-5 w-5" />}
              description="Successfully funded"
            />
            <KPICard
              title="Average APY"
              value="12.8%"
              change={2.1}
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
              description="Annual returns"
            />
          </div>
        </div>
      </section>

      {/* Featured Properties - 3x2 grid (Section 4.1) */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Investment Opportunities</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover premium properties with verified returns and professional management
            </p>
          </motion.div>

          {/* Property Grid - 3 columns desktop, 12-card max (Section 4.1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PropertyCard property={property} variant="default" />
              </motion.div>
            ))}
          </div>

          {/* View All Properties link */}
          <div className="text-center mt-8">
            <Link href="/properties/explore">
              <Button variant="outline" size="lg" className="h-12">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <HowItWorksSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Trust & Security Section */}
      <TrustSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />


      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join PropertyLend today and access institutional-grade real estate investments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg bg-white text-purple-700 hover:bg-gray-100"
                onClick={() => router.push('/register')}
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => router.push('/pools')}
              >
                Browse Pools
                <Building className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

