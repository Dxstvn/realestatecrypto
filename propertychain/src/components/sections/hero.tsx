/**
 * Hero Section Component - PropertyLend
 * 
 * DeFi lending platform hero section with Web3 design elements
 * Features animated gradient backgrounds, APY displays, and tranche selectors
 * Following PropertyLend UI spec with glassmorphism and neon effects
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Users, Building, DollarSign, Zap, Target, TrendingDown, Coins } from 'lucide-react'
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
      {/* Web3 DeFi Hero Container */}
      {/* Background: Animated gradient mesh (purple/blue/green) */}
      <div 
        className="absolute inset-0 gradient-hero animate-gradient-shift"
        aria-hidden="true"
      />

      {/* Animated background particles */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #667EEA 2px, transparent 2px), radial-gradient(circle at 75% 75%, #764BA2 2px, transparent 2px)`,
          backgroundSize: '60px 60px, 40px 40px',
          animation: 'float 8s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Web3 Floating Geometric Shapes */}
      {isClient && (
        <>
          {/* Element 1: Neon purple cube with glow */}
          <motion.div
            className="absolute top-[10%] right-[15%] w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 opacity-30 rounded-lg glow-primary"
            style={{
              filter: 'blur(20px)',
              y: y1,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />

          {/* Element 2: Neon green hexagon with pulse */}
          <motion.div
            className="absolute bottom-[20%] left-[10%] w-[120px] h-[120px] bg-gradient-to-br from-green-400 to-emerald-500 opacity-25 glow-success"
            style={{
              filter: 'blur(20px)',
              y: y2,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360, 0],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />

          {/* Element 3: Small floating circles */}
          <motion.div
            className="absolute top-[30%] left-[20%] w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 4,
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
              className="mb-6 px-4 py-2 text-sm font-medium glass border-success/20 text-success"
            >
              <Shield className="w-4 h-4 mr-2" />
              Audited by CertiK • $127M TVL
            </Badge>

            {/* Main Headline - DeFi focused */}
            <h1 className="text-[48px] md:text-[60px] font-bold leading-[1.1] text-foreground tracking-[-0.03em] mb-6">
              <Balancer>
                Sustainable Yields for{' '}
                <span className="neon-text-green">Stablecoin Holders</span>
              </Balancer>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              <Balancer>
                Earn 8-30% APY through real estate-backed lending pools. 
                Choose senior tranches for stability or junior for enhanced yields. 
                Transparent, audited, and DeFi-native.
              </Balancer>
            </p>

            {/* CTA Buttons - DeFi focused */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="h-14 px-6 text-base font-semibold gradient-primary animate-shimmer-web3 hover:glow-primary transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link href="/earn">
                  Start Earning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6 text-base font-semibold border-2 border-border hover:border-primary hover:bg-accent hover:-translate-y-0.5 transition-all duration-200"
                asChild
              >
                <Link href="/docs">
                  Read Docs
                </Link>
              </Button>
            </div>

            {/* DeFi Statistics Bar with CountUp */}
            <div 
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
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
                <p className="text-sm text-muted-foreground mt-1">Total Value Locked</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold neon-text-green">
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
                <p className="text-sm text-muted-foreground mt-1">Current APY 🔥</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={5234}
                      duration={2}
                      separator=","
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">DeFi Users</p>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {statsInView && (
                    <CountUp
                      start={0}
                      end={34}
                      duration={2}
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Active Loans</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Yield Comparison Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* APY Comparison Widget */}
            <Card className="glass border-border shadow-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Badge className="mb-3 bg-success/20 text-success border-success/20">
                    <Zap className="w-3 h-3 mr-1" />
                    LIVE APY
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground mb-1">Choose Your Tranche</h3>
                  <p className="text-sm text-muted-foreground">Real estate-backed yields</p>
                </div>

                {/* Senior vs Junior Comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Senior Tranche */}
                  <div className="glass rounded-lg p-4 border border-success/20 hover:border-success/40 transition-all duration-200 hover:glow-success">
                    <div className="text-center">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-success" />
                      <div className="text-2xl font-bold neon-text-green mb-1">8%</div>
                      <div className="text-xs text-success font-medium mb-2">FIXED APY</div>
                      <div className="text-xs text-muted-foreground">Senior</div>
                    </div>
                  </div>

                  {/* Junior Tranche */}
                  <div className="glass rounded-lg p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-200 hover:glow-primary">
                    <div className="text-center">
                      <Target className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                      <div className="text-2xl font-bold text-yellow-400 mb-1 animate-glow-pulse">20-30%</div>
                      <div className="text-xs text-yellow-400 font-medium mb-2">VARIABLE APY</div>
                      <div className="text-xs text-muted-foreground">Junior</div>
                    </div>
                  </div>
                </div>

                {/* Protocol Comparison */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">vs Other Protocols</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground font-medium">PropertyLend</span>
                      <span className="text-sm font-bold neon-text-green">8-30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Aave</span>
                      <span className="text-sm text-muted-foreground">3.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compound</span>
                      <span className="text-sm text-muted-foreground">2.8%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
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

            {/* Web3 floating decoration */}
            {isClient && (
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 opacity-20 rounded-full glow-success"
                style={{ filter: 'blur(40px)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-hidden="true"
              />
            )}
          </motion.div>
        </div>

        {/* DeFi Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-12 border-t border-border"
        >
          <p className="text-center text-sm text-muted-foreground mb-6">Trusted by 5,234 degens • Audited by CertiK</p>
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
        </motion.div>
      </div>
    </section>
  )
}