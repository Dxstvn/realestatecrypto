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
import { HeroSection } from '@/components/sections'
import { 
  ArrowRight, 
  Building, 
  TrendingUp, 
  Users,
  User,
  Search, 
  ChevronRight,
  Star,
  Quote,
  DollarSign,
  Shield,
  Lock,
  Globe,
  Zap,
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
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c4a5825?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1567684014761-d65d2c1a55e4?w=800&h=600&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    status: 'funding' as const,
    type: 'Residential',
    fundingProgress: 58,
    investors: 198,
    daysLeft: 15,
  },
]

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Real Estate Investor',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'PropertyChain has democratized real estate investing. I can now diversify my portfolio with properties I could never afford on my own.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Entrepreneur',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    content: 'The transparency and security of blockchain combined with real estate returns is exactly what I was looking for. Excellent platform!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Financial Advisor',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: "I recommend PropertyChain to clients seeking alternative investments. The monthly yields and professional management are outstanding.",
    rating: 5,
  },
]

// ============================================================================
// Homepage Component
// ============================================================================

export default function HomePage() {
  const router = useRouter()

  return (
    <>
      {/* Hero Section from UpdatedUIPlan.md Section 3 */}
      <HeroSection />

      {/* Statistics Bar - 4 KPI cards, 280px width each (Section 4.1) */}
      <section className="py-16 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Value Locked"
              value="$284M"
              change={12.5}
              trend="up"
              icon={<DollarSign className="h-5 w-5" />}
              description="Platform assets"
            />
            <KPICard
              title="Active Investors"
              value="12,847"
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
              description="Successfully tokenized"
            />
            <KPICard
              title="Average ROI"
              value="10.8%"
              change={2.1}
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
              description="Annual returns"
            />
          </div>
        </div>
      </section>

      {/* Featured Properties - 3x2 grid (Section 4.1) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Investment Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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

      {/* How it Works Timeline - 1-2-3 steps (Section 4.1) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">How PropertyChain Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start investing in premium real estate in just three simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Register & Verify',
                  description: 'Create your account and complete KYC verification to start investing',
                  icon: <User className="h-6 w-6" />,
                },
                {
                  step: '2',
                  title: 'Browse Properties',
                  description: 'Explore verified properties with detailed financials and projections',
                  icon: <Search className="h-6 w-6" />,
                },
                {
                  step: '3',
                  title: 'Invest & Earn',
                  description: 'Purchase property tokens and receive monthly rental yields',
                  icon: <TrendingUp className="h-6 w-6" />,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connector Line (hidden on mobile) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gray-300">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#007BFF] text-white text-2xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="h-12 bg-[#007BFF] hover:bg-[#0062CC]"
              onClick={() => router.push('/register')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Carousel - Auto-rotate every 5 seconds */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Investors Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied investors building wealth through PropertyChain
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="h-6 w-6" />
              <span className="font-medium">SEC Compliant</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Lock className="h-6 w-6" />
              <span className="font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Globe className="h-6 w-6" />
              <span className="font-medium">Global Access</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Zap className="h-6 w-6" />
              <span className="font-medium">Instant Transactions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#007BFF]">
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
              Join PropertyChain today and access institutional-grade real estate investments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg bg-white text-[#007BFF] hover:bg-gray-100"
                onClick={() => router.push('/register')}
              >
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white text-white hover:bg-white/10"
                onClick={() => router.push('/properties/explore')}
              >
                Browse Properties
                <Building className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

// ============================================================================
// Testimonial Carousel Component
// ============================================================================

interface Testimonial {
  id: number
  name: string
  role: string
  image: string
  content: string
  rating: number
}

function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  // Auto-rotate every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <Quote className="h-8 w-8 text-gray-200" />
                  </div>
                  <p className="text-gray-700 italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'w-8 bg-[#007BFF]'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}