/**
 * Hero Section Component - PropertyChain
 * 
 * Main hero section for the homepage following UpdatedUIPlan.md Section 3 specifications
 * Implements exact design system from Section 0 foundational principles
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Users, Building } from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import Balancer from 'react-wrap-balancer'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Hero Section Component
 * Following Section 3.1 & 3.2 specifications exactly
 */
export function HeroSection() {
  const [isClient, setIsClient] = useState(false)
  const { scrollY } = useScroll()
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -30])

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="relative min-h-[700px] md:min-h-[800px] overflow-hidden">
      {/* Section 3.1: Hero Container */}
      {/* Background gradient: Linear gradient 135deg from #E6F2FF via #FFFFFF to #E6F2FF */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#E6F2FF] via-white to-[#E6F2FF]"
        aria-hidden="true"
      />

      {/* Background Pattern: 40px × 40px grid */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(#003366 1px, transparent 1px), linear-gradient(90deg, #003366 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Floating Elements with Framer Motion (Section 3.1) */}
      {isClient && (
        <>
          {/* Element 1: 80px × 80px, #007BFF at 20% opacity, blur 24px */}
          <motion.div
            className="absolute top-[10%] right-[15%] w-20 h-20 bg-[#007BFF] opacity-20 rounded-lg"
            style={{
              filter: 'blur(24px)',
              y: y1,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />

          {/* Element 2: 120px × 120px circle, #4CAF50 at 20% opacity, blur 24px */}
          <motion.div
            className="absolute bottom-[20%] left-[10%] w-[120px] h-[120px] bg-[#4CAF50] opacity-20 rounded-full"
            style={{
              filter: 'blur(24px)',
              y: y2,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [5, -5, 5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 pt-[120px] md:pt-[160px] pb-20">
        {/* Section 3.2: Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Headlines and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 mr-2 text-[#007BFF]" />
              SEC-Compliant Tokenized Real Estate
            </Badge>

            {/* Main Headline - Section 3.2 specs */}
            <h1 className="text-[48px] md:text-[60px] font-bold leading-[1.1] text-[#001933] tracking-[-0.03em] mb-6">
              <Balancer>
                Invest in Premium Real Estate{' '}
                <span className="text-[#007BFF]">From $100</span>
              </Balancer>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              <Balancer>
                Own fractional shares of institutional-grade properties. 
                Earn rental income, build wealth, and diversify your portfolio 
                with blockchain-secured investments.
              </Balancer>
            </p>

            {/* CTA Buttons - Section 3.2 specifications */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="h-14 px-6 text-base font-semibold bg-[#007BFF] hover:bg-[#0062CC] transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link href="/properties/explore">
                  Start Investing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6 text-base font-semibold border-2 hover:-translate-y-0.5 transition-all duration-200"
                asChild
              >
                <Link href="/how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Statistics Bar with CountUp */}
            <div 
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#001933]">
                  $
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={127}
                      duration={2}
                      separator=","
                      suffix="M+"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Total Invested</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#001933]">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={15234}
                      duration={2}
                      separator=","
                      suffix="+"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Active Investors</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#001933]">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={156}
                      duration={2}
                      suffix="+"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Properties</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#001933]">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={12.8}
                      duration={2}
                      decimals={1}
                      suffix="%"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">Avg. Returns</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Featured Property Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Featured Property Card - Section 3.2 specs */}
            <Card className="overflow-hidden shadow-xl border-0">
              <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
                {/* Placeholder for property image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[#007BFF] to-[#0062CC] text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  FEATURED
                </Badge>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Marina Bay Towers</h3>
                  <p className="text-sm opacity-90">San Francisco, CA</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Min. Investment</p>
                    <p className="text-xl font-bold text-[#001933]">$100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected ROI</p>
                    <p className="text-xl font-bold text-[#4CAF50]">14.2%</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-semibold text-[#001933]">78%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#007BFF] to-[#0062CC]"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>423 Investors</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    <span>Residential</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional floating decoration */}
            {isClient && (
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#007BFF] opacity-10 rounded-full"
                style={{ filter: 'blur(40px)' }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-12 border-t border-gray-200"
        >
          <p className="text-center text-sm text-gray-600 mb-6">Trusted by leading institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for partner logos */}
            {['Partner 1', 'Partner 2', 'Partner 3', 'Partner 4', 'Partner 5'].map((partner) => (
              <div key={partner} className="h-8 w-24 bg-gray-300 rounded animate-pulse" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}