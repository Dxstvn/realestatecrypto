/**
 * Footer Component - PropertyChain
 * 
 * 4-column layout on desktop, accordion on mobile
 * Bottom of all public pages
 * Following Section 0 principles with 8px grid system
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
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
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Send,
  Shield,
  Award,
  TrendingUp,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

// Newsletter form schema
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

// Footer navigation structure
const footerNavigation = {
  product: {
    title: 'Product',
    links: [
      { label: 'Browse Properties', href: ROUTES.PROPERTIES },
      { label: 'How It Works', href: ROUTES.HOW_IT_WORKS },
      { label: 'Investment Calculator', href: '/calculator' },
      { label: 'Market Analytics', href: '/analytics' },
      { label: 'Mobile App', href: '/mobile', external: true },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: ROUTES.ABOUT },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Investors', href: '/investors' },
      { label: 'Contact', href: ROUTES.CONTACT },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs', external: true },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Blog', href: '/blog' },
      { label: 'API Status', href: 'https://status.propertychain.com', external: true },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
      { label: 'Security', href: '/security' },
    ],
  },
}

// Trust badges
const trustBadges = [
  { icon: Shield, label: 'SEC Compliant' },
  { icon: Award, label: 'SOC 2 Certified' },
  { icon: TrendingUp, label: '$10M+ Tokenized' },
]

// Social links
const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/propertychain', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/propertychain', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/propertychain', label: 'GitHub' },
  { icon: Youtube, href: 'https://youtube.com/@propertychain', label: 'YouTube' },
]

export function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Newsletter form
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
      title: 'Successfully subscribed!',
      description: 'Thank you for subscribing to our newsletter.',
    })
    
    form.reset()
    setIsSubmitting(false)
  }

  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 py-12 lg:py-16">
        {/* Desktop 4-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Newsletter */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">PropertyChain</div>
                <div className="text-xs text-muted-foreground">Tokenized Real Estate</div>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground">
              Democratizing real estate investment through blockchain technology. 
              Invest in premium properties with as little as $100.
            </p>

            {/* Newsletter Form */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Stay Updated</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter your email"
                              type="email"
                              {...field}
                              className="flex-1"
                            />
                            <Button 
                              type="submit" 
                              size="icon"
                              loading={isSubmitting}
                              className="shrink-0"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              {footerNavigation.product.title}
            </h3>
            <ul className="space-y-3">
              {footerNavigation.product.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1',
                    )}
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {link.label}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-8">
            {/* Company Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                {footerNavigation.company.title}
              </h3>
              <ul className="space-y-3">
                {footerNavigation.company.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                {footerNavigation.resources.title}
              </h3>
              <ul className="space-y-3">
                {footerNavigation.resources.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1',
                      )}
                      {...(link.external && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {link.label}
                      {link.external && <ExternalLink className="h-3 w-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Legal & Contact */}
          <div className="space-y-8">
            {/* Legal Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                {footerNavigation.legal.title}
              </h3>
              <ul className="space-y-3">
                {footerNavigation.legal.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    123 Blockchain Ave<br />
                    San Francisco, CA 94105
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:+1-888-PROP-123" className="hover:text-foreground transition-colors">
                    1-888-PROP-123
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href="mailto:invest@propertychain.com" className="hover:text-foreground transition-colors">
                    invest@propertychain.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="lg:hidden space-y-6">
          {/* Brand Section (Always Visible) */}
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">PropertyChain</div>
                <div className="text-xs text-muted-foreground">Tokenized Real Estate</div>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground">
              Democratizing real estate investment through blockchain technology.
            </p>
          </div>

          {/* Newsletter Form (Always Visible) */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            className="flex-1"
                          />
                          <Button 
                            type="submit" 
                            size="icon"
                            loading={isSubmitting}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Accordion Navigation */}
          <Accordion type="single" collapsible className="w-full">
            {/* Product Links */}
            <AccordionItem value="product">
              <AccordionTrigger className="text-sm font-semibold">
                {footerNavigation.product.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {footerNavigation.product.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1',
                        )}
                        {...(link.external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                      >
                        {link.label}
                        {link.external && <ExternalLink className="h-3 w-3" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Company Links */}
            <AccordionItem value="company">
              <AccordionTrigger className="text-sm font-semibold">
                {footerNavigation.company.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {footerNavigation.company.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Resources Links */}
            <AccordionItem value="resources">
              <AccordionTrigger className="text-sm font-semibold">
                {footerNavigation.resources.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {footerNavigation.resources.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1',
                        )}
                        {...(link.external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                      >
                        {link.label}
                        {link.external && <ExternalLink className="h-3 w-3" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Legal Links */}
            <AccordionItem value="legal">
              <AccordionTrigger className="text-sm font-semibold">
                {footerNavigation.legal.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pt-2">
                  {footerNavigation.legal.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Contact Info */}
            <AccordionItem value="contact">
              <AccordionTrigger className="text-sm font-semibold">
                Contact
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 text-sm text-muted-foreground pt-2">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      123 Blockchain Ave<br />
                      San Francisco, CA 94105
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href="tel:+1-888-PROP-123" className="hover:text-foreground transition-colors">
                      1-888-PROP-123
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href="mailto:invest@propertychain.com" className="hover:text-foreground transition-colors">
                      invest@propertychain.com
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Social Links (Mobile) */}
          <div className="flex gap-2 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <badge.icon className="h-5 w-5" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-accent/20">
        <div className="container mx-auto max-w-[1440px] px-4 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} PropertyChain. All rights reserved.
            </p>

            {/* Additional Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/sitemap"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sitemap
              </Link>
              <Link
                href="/accessibility"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="/disclaimer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}