/**
 * Optimized Hero Section Component - PropertyLend
 * Phase 3.1: Hero Animation Optimization
 * 
 * Features:
 * - Smooth 60fps animations using CSS transforms
 * - GPU acceleration with will-change
 * - Intersection Observer to pause off-screen animations
 * - RequestAnimationFrame for smooth updates
 * - Optimized performance with transform3d
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Users, DollarSign, Zap, Target, Coins } from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import Balancer from 'react-wrap-balancer'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Floating element component with optimized animations
interface FloatingElementProps {
  className?: string
  delay?: number
  duration?: number
  children: React.ReactNode
}

function FloatingElement({ className, delay = 0, duration = 6, children }: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const [isVisible, setIsVisible] = useState(false)

  // Use Intersection Observer to pause animations when off-screen
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Smooth animation using requestAnimationFrame
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp
    if (!elementRef.current || !isVisible) return

    const elapsed = timestamp - startTimeRef.current
    const progress = (elapsed % (duration * 1000)) / (duration * 1000)
    
    // Smooth ease-in-out curve
    const easeInOut = (t: number) => t < 0.5 
      ? 2 * t * t 
      : -1 + (4 - 2 * t) * t

    const easedProgress = easeInOut(progress)
    const yOffset = Math.sin(easedProgress * Math.PI * 2) * 20
    const rotation = easedProgress * 360
    const scale = 1 + Math.sin(easedProgress * Math.PI * 2) * 0.1

    // Use transform3d for GPU acceleration
    elementRef.current.style.transform = `
      translate3d(0, ${yOffset}px, 0) 
      rotate3d(0, 0, 1, ${rotation}deg) 
      scale3d(${scale}, ${scale}, 1)
    `

    animationRef.current = requestAnimationFrame(animate)
  }, [duration, isVisible])

  // Start/stop animation based on visibility
  useEffect(() => {
    if (isVisible) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, animate])

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute will-change-transform",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        // Enable GPU acceleration
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
    >
      {children}
    </div>
  )
}

// Optimized Hexagon Component
function HexagonShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
      style={{
        filter: 'drop-shadow(0 0 20px currentColor)',
      }}
    >
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        fill="currentColor"
        opacity="0.3"
      />
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  )
}

export function HeroOptimized() {
  const [isClient, setIsClient] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[700px] md:min-h-[800px] overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950"
    >
      {/* Optimized animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 0%, rgba(120, 120, 240, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(240, 120, 240, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(120, 240, 180, 0.2) 0%, transparent 50%)
          `,
          animation: heroInView ? 'gradient-shift 15s ease infinite' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      {/* Optimized Floating Elements */}
      {isClient && heroInView && (
        <>
          {/* Hexagon 1 - Top Right */}
          <FloatingElement
            className="top-[10%] right-[15%] w-24 h-24 text-green-400"
            duration={10}
            delay={0}
          >
            <HexagonShape />
          </FloatingElement>

          {/* Hexagon 2 - Bottom Left */}
          <FloatingElement
            className="bottom-[20%] left-[10%] w-32 h-32 text-purple-400"
            duration={12}
            delay={2}
          >
            <HexagonShape />
          </FloatingElement>

          {/* Cube - Top Left */}
          <FloatingElement
            className="top-[25%] left-[5%] w-16 h-16"
            duration={8}
            delay={1}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-30 rounded-lg shadow-2xl" />
          </FloatingElement>

          {/* Circle - Middle Right */}
          <FloatingElement
            className="top-[40%] right-[8%] w-20 h-20"
            duration={9}
            delay={3}
          >
            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-25 rounded-full shadow-2xl" />
          </FloatingElement>

          {/* Triangle - Bottom Right */}
          <FloatingElement
            className="bottom-[15%] right-[20%] w-20 h-20"
            duration={11}
            delay={1.5}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 opacity-30">
              <polygon
                points="50,10 90,90 10,90"
                fill="currentColor"
                style={{ filter: 'drop-shadow(0 0 15px currentColor)' }}
              />
            </svg>
          </FloatingElement>
        </>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12 pt-[120px] md:pt-[160px] pb-20">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Headlines and CTAs */}
          <div
            className={cn(
              "transition-all duration-700",
              heroInView 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
          >
            {/* Trust Badge */}
            <Badge 
              className="mb-6 px-4 py-2 text-sm font-medium bg-green-500/10 border-green-500/20 text-green-400"
            >
              <Shield className="w-4 h-4 mr-2" />
              Audited by CertiK • $127M TVL
            </Badge>

            {/* Main Headline */}
            <h1 className="text-[48px] md:text-[60px] font-bold leading-[1.1] text-white tracking-[-0.03em] mb-6">
              <Balancer>
                Sustainable Yields for{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Stablecoin Holders
                </span>
              </Balancer>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              <Balancer>
                Earn 8-30% APY through real estate-backed lending pools. 
                Choose senior tranches for stability or junior for enhanced yields. 
                Transparent, audited, and DeFi-native.
              </Balancer>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="h-14 px-6 text-base font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl transform-gpu"
                asChild
              >
                <Link href="/earn" className="inline-flex items-center">
                  Start Earning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6 text-base font-semibold border-2 border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-200 transform-gpu"
                asChild
              >
                <Link href="/docs">
                  Read Docs
                </Link>
              </Button>
            </div>

            {/* DeFi Statistics Bar */}
            <div 
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  $
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={127}
                      duration={2}
                      separator=","
                      suffix="M"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">Total Value Locked</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={12.4}
                      duration={2}
                      decimals={1}
                      suffix="%"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">Current APY 🔥</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={5234}
                      duration={2}
                      separator=","
                    />
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">DeFi Users</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-purple-400">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={34}
                      duration={2}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">Active Loans</p>
              </div>
            </div>
          </div>

          {/* Right Column: Yield Comparison Card */}
          <div
            className={cn(
              "relative transition-all duration-700 delay-200",
              heroInView 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-8"
            )}
          >
            {/* APY Comparison Widget */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/20">
                    <Zap className="w-3 h-3 mr-1" />
                    LIVE APY
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-1">Choose Your Tranche</h3>
                  <p className="text-sm text-gray-400">Real estate-backed yields</p>
                </div>

                {/* Senior vs Junior Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Senior Tranche */}
                  <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-200 transform-gpu hover:scale-105">
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <div className="text-2xl font-bold text-green-400 mb-1">8%</div>
                      <div className="text-xs text-green-400 font-medium mb-2">FIXED APY</div>
                      <div className="text-xs text-gray-500">Senior</div>
                    </div>
                  </div>

                  {/* Junior Tranche */}
                  <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200 transform-gpu hover:scale-105">
                    <div className="text-center">
                      <Target className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                      <div className="text-2xl font-bold text-yellow-400 mb-1">20-30%</div>
                      <div className="text-xs text-yellow-400 font-medium mb-2">VARIABLE APY</div>
                      <div className="text-xs text-gray-500">Junior</div>
                    </div>
                  </div>
                </div>

                {/* Protocol Comparison */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-3">vs Other Protocols</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white font-medium">PropertyLend</span>
                      <span className="text-sm font-bold text-green-400">8-30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Aave</span>
                      <span className="text-sm text-gray-400">3.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Compound</span>
                      <span className="text-sm text-gray-400">2.8%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>5,234 lenders</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    <span>$127M TVL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* DeFi Trust Indicators */}
        <div
          className={cn(
            "mt-20 pt-12 border-t border-gray-800 transition-all duration-700 delay-400",
            heroInView 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-center text-sm text-gray-400 mb-6">Trusted by 5,234 degens • Audited by CertiK</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* DeFi Protocol Badges */}
            {[
              { name: 'CertiK Audit', color: 'text-green-400' },
              { name: 'Polygon Network', color: 'text-purple-400' },
              { name: 'Chainlink Oracles', color: 'text-blue-400' },
              { name: 'OpenZeppelin', color: 'text-cyan-400' },
            ].map((item) => (
              <div key={item.name} className={`flex items-center gap-2 ${item.color} text-sm font-medium`}>
                <Coins className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1) rotate(180deg);
          }
        }
      `}</style>
    </section>
  )
}