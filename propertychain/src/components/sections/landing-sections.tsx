/**
 * Landing Page Sections - PropertyLend
 * Phase 5.2: Refactored sections for better user engagement
 * Modern DeFi aesthetic with focus on trust and clarity
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Lock,
  Award,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  Home,
  FileCheck,
  Wallet,
  PieChart,
  Clock,
  Globe,
  Building,
  Percent,
  UserCheck,
  ShieldCheck,
  BarChart3,
  Coins,
  Sparkles,
  Target,
  HeartHandshake,
  Scale,
  FileText,
  HelpCircle,
} from 'lucide-react'

// How It Works - Enhanced with better visuals
export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Connect & Verify',
      description: 'Connect your wallet and complete our streamlined KYC process',
      icon: <UserCheck className="h-6 w-6" />,
      details: [
        'Instant wallet connection',
        'Bank-grade KYC verification',
        'Accredited investor status check',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '02',
      title: 'Choose Your Tranche',
      description: 'Select between stable senior or high-yield junior positions',
      icon: <PieChart className="h-6 w-6" />,
      details: [
        'Senior: 8% fixed APY',
        'Junior: 20-30% variable APY',
        'Real-time risk analytics',
      ],
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '03',
      title: 'Invest & Earn',
      description: 'Deploy capital and start earning yields immediately',
      icon: <TrendingUp className="h-6 w-6" />,
      details: [
        'Minimum $100 investment',
        'Monthly yield distribution',
        'Compound or withdraw anytime',
      ],
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-3 h-3 mr-1" />
            Simple Process
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Start Earning in Minutes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join thousands of investors earning stable yields from real estate-backed loans
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all duration-300 group">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {step.number}
                </div>

                <CardHeader>
                  <div className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform",
                    step.color
                  )}>
                    {step.icon}
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                {/* Connector Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-gray-300 dark:text-gray-700" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
          >
            Start Investing Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// Benefits/Features Showcase
export function BenefitsSection() {
  const benefits = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Real Estate Backed',
      description: 'Every loan is secured by physical property with verified appraisals',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Percent className="h-6 w-6" />,
      title: 'Stable Returns',
      description: 'Earn 8-30% APY with predictable monthly distributions',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Risk-Adjusted Tranches',
      description: 'Choose your risk level with senior or junior investment positions',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Short Duration',
      description: '6-18 month loan terms for better liquidity and flexibility',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'Regulated & Compliant',
      description: 'SEC-compliant structure with full regulatory oversight',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Access',
      description: 'Invest from anywhere with just a wallet and internet connection',
      gradient: 'from-cyan-500 to-cyan-600',
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-green-500/30 text-green-600 dark:text-green-400">
            <Target className="w-3 h-3 mr-1" />
            Why PropertyLend
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Built for Modern Investors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Combine the stability of real estate with the efficiency of DeFi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={cn(
                    "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform",
                    benefit.gradient
                  )}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Trust & Security Section
export function TrustSection() {
  const stats = [
    { value: '$125M+', label: 'Total Value Locked', icon: <DollarSign className="h-5 w-5" /> },
    { value: '15,234', label: 'Active Investors', icon: <Users className="h-5 w-5" /> },
    { value: '342', label: 'Funded Loans', icon: <Building className="h-5 w-5" /> },
    { value: '100%', label: 'Repayment Rate', icon: <Award className="h-5 w-5" /> },
  ]

  const partners = [
    { name: 'SEC Registered', icon: <FileCheck className="h-8 w-8" /> },
    { name: 'SOC 2 Certified', icon: <ShieldCheck className="h-8 w-8" /> },
    { name: 'Chainlink Oracle', icon: <Zap className="h-8 w-8" /> },
    { name: 'OpenZeppelin Audited', icon: <Lock className="h-8 w-8" /> },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-600 dark:text-blue-400">
            <Shield className="w-3 h-3 mr-1" />
            Trust & Security
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Institutional-Grade Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Built with security-first architecture and regulatory compliance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Partners/Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="text-gray-600 dark:text-gray-400 mb-2">
                  {partner.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// FAQ Section - Simplified and less dominant
export function FAQSection() {
  const faqs = [
    {
      question: "What is PropertyLend?",
      answer: "PropertyLend is a DeFi platform that connects stablecoin holders with real estate borrowers. Earn 8-30% APY by providing liquidity to real estate-backed loans.",
    },
    {
      question: "What are senior and junior tranches?",
      answer: "Senior tranches offer stable 8% APY with priority payment protection. Junior tranches offer variable 20-30% APY with higher risk but greater returns.",
    },
    {
      question: "How secure is my investment?",
      answer: "Every loan is backed by real estate collateral at 70% LTV or lower. Smart contracts are audited by OpenZeppelin and we maintain comprehensive insurance coverage.",
    },
    {
      question: "What's the minimum investment?",
      answer: "You can start investing with as little as $100 in USDC or USDT. There's no maximum limit.",
    },
    {
      question: "How often do I receive yields?",
      answer: "Yields are distributed monthly directly to your wallet. You can compound or withdraw them.",
    },
    {
      question: "Can I withdraw anytime?",
      answer: "Loan terms range from 6-18 months. A secondary market for trading positions is in development.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-4xl px-4 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Common Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick answers to help you get started
          </p>
        </div>

        <div className="space-y-2">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 dark:border-gray-800"
              >
                <AccordionTrigger className="hover:no-underline py-3 text-left">
                  <span className="text-base font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
            Need more help?
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/docs">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-3 w-3" />
                Documentation
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="sm">
                <HelpCircle className="mr-2 h-3 w-3" />
                Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Portfolio Manager',
      company: 'Apex Capital',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'PropertyLend has revolutionized how we allocate to real estate. The transparency and yield consistency are unmatched in the DeFi space.',
      rating: 5,
      stats: { invested: '$2.5M', returns: '12.4% APY' },
    },
    {
      name: 'Michael Torres',
      role: 'Real Estate Developer',
      company: 'Torres Properties',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      content: 'As a borrower, the speed and efficiency of funding through PropertyLend is incredible. We closed our last deal in just 5 days.',
      rating: 5,
      stats: { borrowed: '$5M', projects: '8 funded' },
    },
    {
      name: 'Emily Rodriguez',
      role: 'Crypto Investor',
      company: 'Independent',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content: 'Finally, a platform that bridges DeFi yields with real-world assets. The senior tranches give me stable returns I can count on.',
      rating: 5,
      stats: { invested: '$150K', duration: '18 months' },
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-green-500/30 text-green-600 dark:text-green-400">
            <Users className="w-3 h-3 mr-1" />
            Success Stories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join a growing community of investors and borrowers
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {testimonial.company}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div key={i} className="h-3 w-3 bg-yellow-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {Object.entries(testimonial.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {value}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {key}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}