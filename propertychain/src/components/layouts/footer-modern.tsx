/**
 * Modern Footer - PropertyLend
 * Phase 5.2: DeFi-styled footer with enhanced aesthetics
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import {
  TrendingUp,
  Mail,
  Github,
  MessageCircle,
  Send,
  Shield,
  Award,
  ChevronRight,
  ExternalLink,
  Sparkles,
  DollarSign,
  Users,
  Building,
  FileText,
  HelpCircle,
  BarChart3,
  Coins,
  Globe,
  Lock,
  Zap,
  Instagram,
  Linkedin,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Newsletter schema
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

// Footer navigation
const footerNavigation = {
  products: {
    title: 'Products',
    links: [
      { label: 'Senior Tranches', href: '/pools?tranche=senior', badge: '8%' },
      { label: 'Junior Tranches', href: '/pools?tranche=junior', badge: '20-30%' },
      { label: 'All Pools', href: '/pools' },
      { label: 'Staking', href: '/staking' },
      { label: 'Governance', href: '/dao' },
    ],
  },
  developers: {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs', icon: <FileText className="h-3 w-3" /> },
      { label: 'API Reference', href: '/api', icon: <ExternalLink className="h-3 w-3" /> },
      { label: 'Smart Contracts', href: 'https://github.com/propertylend', icon: <Github className="h-3 w-3" /> },
      { label: 'Audits', href: '/security/audits' },
      { label: 'Bug Bounty', href: '/security/bug-bounty', badge: 'Up to $100K' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Risk Disclosure', href: '/risk' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
}

// Stats
const stats = [
  { value: '$125M', label: 'TVL', icon: <DollarSign className="h-4 w-4" /> },
  { value: '15.4K', label: 'Users', icon: <Users className="h-4 w-4" /> },
  { value: '342', label: 'Loans', icon: <Building className="h-4 w-4" /> },
  { value: '12.8%', label: 'Avg APY', icon: <TrendingUp className="h-4 w-4" /> },
]

// Social links
const socialLinks = [
  { 
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
      </svg>
    ), 
    href: 'https://x.com/propertylend', 
    label: 'X' 
  },
  { icon: Instagram, href: 'https://instagram.com/propertylend', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/propertylend', label: 'LinkedIn' },
]

// Trust badges
const trustBadges = [
  { icon: <Shield className="h-5 w-5" />, label: 'SEC Registered' },
  { icon: <Lock className="h-5 w-5" />, label: 'Audited' },
  { icon: <Award className="h-5 w-5" />, label: 'SOC 2' },
  { icon: <Zap className="h-5 w-5" />, label: 'Chainlink' },
]

export function FooterModern() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: 'Welcome aboard! 🚀',
      description: 'You\'ve successfully joined our newsletter.',
    })
    
    form.reset()
    setIsSubmitting(false)
  }

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      
      {/* Newsletter Section */}
      <div className="relative border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12 py-12">
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-purple-500/20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    Newsletter
                  </Badge>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Stay ahead of the curve
                </h3>
                <p className="text-gray-400">
                  Get weekly insights on DeFi lending, real estate markets, and exclusive pool launches.
                </p>
              </div>
              
              <div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              type="email"
                              {...field}
                              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-6"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Subscribe
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
                <p className="text-xs text-gray-500 mt-2">
                  No spam, unsubscribe anytime. Read our <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto max-w-7xl px-4 lg:px-12 py-16">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">PropertyLend</div>
                <div className="text-xs text-gray-400">DeFi Bridge Lending</div>
              </div>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              The future of real estate investment. Earn stable yields from property-backed loans through 
              our innovative tranched lending protocol.
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    {stat.icon}
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {footerNavigation.products.title}
            </h3>
            <ul className="space-y-3">
              {footerNavigation.products.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge className="text-[9px] px-2.5 py-0.5 h-5 min-w-[3rem] bg-purple-500/20 text-purple-400 border-purple-500/30 font-medium whitespace-nowrap">
                        {link.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {footerNavigation.developers.title}
            </h3>
            <ul className="space-y-3">
              {footerNavigation.developers.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
                    {...(link.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    <span>{link.label}</span>
                    {link.icon}
                    {link.badge && (
                      <Badge className="text-[9px] px-2 py-0.5 h-5 bg-green-500/20 text-green-400 border-green-500/30 font-medium">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {footerNavigation.company.title}
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <Badge className="text-[9px] px-2 py-0.5 h-5 bg-blue-500/20 text-blue-400 border-blue-500/30 font-medium">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {footerNavigation.legal.title}
            </h3>
            <ul className="space-y-3">
              {footerNavigation.legal.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">PropertyLend</div>
                <div className="text-xs text-gray-400">DeFi Bridge Lending</div>
              </div>
            </Link>
            
            <p className="text-sm text-gray-400">
              The future of real estate investment.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    {stat.icon}
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Accordion Navigation */}
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(footerNavigation).map(([key, section]) => (
              <AccordionItem key={key} value={key} className="border-gray-800">
                <AccordionTrigger className="text-sm font-semibold text-white">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
                        >
                          <span>{link.label}</span>
                          {'icon' in link && link.icon}
                          {'badge' in link && link.badge && (
                            <Badge className="text-[9px] px-2.5 py-0.5 h-5 min-w-[3rem] bg-purple-500/20 text-purple-400 border-purple-500/30 font-medium whitespace-nowrap">
                              {link.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Social Links */}
          <div className="flex gap-2 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                {badge.icon}
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 bg-black/50">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} PropertyLend. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/sitemap" className="text-gray-500 hover:text-gray-400 transition-colors">
                Sitemap
              </Link>
              <Link href="/security" className="text-gray-500 hover:text-gray-400 transition-colors">
                Security
              </Link>
              <Link href="/status" className="text-gray-500 hover:text-gray-400 transition-colors">
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}