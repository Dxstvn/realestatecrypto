/**
 * Design System Index Page
 * PropertyLend DeFi Platform
 * 
 * Overview of all UI Polish phases completed
 */

'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle,
  ArrowRight,
  Layers,
  Palette,
  CreditCard,
  Navigation,
  Monitor,
  Zap,
  Type,
  FileText,
  Route,
  ChevronRight,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

const phases = [
  {
    phase: "Phase 1: Foundation Fixes",
    status: "completed",
    items: [
      {
        id: "1.1",
        title: "Design System Establishment",
        description: "Unified spacing, button sizing, and border radius systems",
        icon: <Layers className="h-5 w-5" />,
        href: "/design-system/theme",
        status: "completed"
      },
      {
        id: "1.2",
        title: "Color System Refinement",
        description: "WCAG AAA compliant colors with proper contrast ratios",
        icon: <Palette className="h-5 w-5" />,
        href: "/design-system/theme",
        status: "completed"
      }
    ]
  },
  {
    phase: "Phase 2: Component Standardization",
    status: "completed",
    items: [
      {
        id: "2.1",
        title: "Component Theming",
        description: "Dark/light mode support with theme-aware components",
        icon: <Monitor className="h-5 w-5" />,
        href: "/design-system/theme",
        status: "completed"
      },
      {
        id: "2.2",
        title: "Card Component Standardization",
        description: "Consistent 16:9 ratios, glassmorphic effects, accessible progress indicators",
        icon: <CreditCard className="h-5 w-5" />,
        href: "/design-system/cards",
        status: "completed"
      },
      {
        id: "2.3",
        title: "Navigation Dropdown Fix",
        description: "Properly aligned dropdowns with visual connectors",
        icon: <Navigation className="h-5 w-5" />,
        href: "/design-system/navigation",
        status: "completed"
      },
      {
        id: "2.4",
        title: "Navigation & Header Improvements",
        description: "Scroll-aware navbar, content overlap prevention, smooth transitions",
        icon: <Monitor className="h-5 w-5" />,
        href: "/design-system/header-enhanced",
        status: "completed"
      },
      {
        id: "2.5",
        title: "Advanced Navbar Text Adaptation",
        description: "Mix-blend-mode and Intersection Observer for perfect text visibility",
        icon: <Eye className="h-5 w-5" />,
        href: "/design-system/adaptive-navbar",
        status: "completed"
      }
    ]
  },
  {
    phase: "Phase 3: Animation & Performance",
    status: "pending",
    items: [
      {
        id: "3.1",
        title: "Hero Animation Optimization",
        description: "Smooth hexagon animations with 60fps performance",
        icon: <Zap className="h-5 w-5" />,
        status: "pending"
      },
      {
        id: "3.2",
        title: "Performance Optimizations",
        description: "Lazy loading, virtual scrolling, code splitting",
        icon: <Zap className="h-5 w-5" />,
        status: "pending"
      }
    ]
  },
  {
    phase: "Phase 4: Content & Typography",
    status: "pending",
    items: [
      {
        id: "4.1",
        title: "Typography System",
        description: "Refined type scale with consistent hierarchy",
        icon: <Type className="h-5 w-5" />,
        status: "pending"
      },
      {
        id: "4.2",
        title: "Content Improvements",
        description: "Clear labels, real content, helpful tooltips",
        icon: <FileText className="h-5 w-5" />,
        status: "pending"
      }
    ]
  },
  {
    phase: "Phase 5: Route Fixes & New Pages",
    status: "pending",
    items: [
      {
        id: "5.0",
        title: "Landing Page Navigation",
        description: "Education and conversion focused navigation",
        icon: <Route className="h-5 w-5" />,
        status: "pending"
      },
      {
        id: "5.1",
        title: "Pool Details Page",
        description: "Individual pool details with live APY ticker",
        icon: <Route className="h-5 w-5" />,
        status: "pending"
      },
      {
        id: "5.2",
        title: "DAO Governance Page",
        description: "Governance dashboard with proposals and voting",
        icon: <Route className="h-5 w-5" />,
        status: "pending"
      }
    ]
  }
]

export default function DesignSystemPage() {
  const completedPhases = phases.filter(p => p.status === 'completed').length
  const totalPhases = phases.length
  const completionPercentage = Math.round((completedPhases / totalPhases) * 100)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-12">
      <div className="container mx-auto max-w-7xl px-4 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-4">
            UI Polish Implementation
          </Badge>
          <h1 className="text-5xl font-bold text-white">
            PropertyLend Design System
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive UI/UX improvements following the UI Polish Plan
          </p>
          
          {/* Progress Overview */}
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{completionPercentage}%</p>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{completedPhases}</p>
              <p className="text-sm text-gray-500">Phases Done</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{totalPhases - completedPhases}</p>
              <p className="text-sm text-gray-500">Remaining</p>
            </div>
          </div>
        </div>

        {/* Phases Grid */}
        {phases.map((phase, phaseIndex) => (
          <section key={phaseIndex} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-white">
                {phase.phase}
              </h2>
              <Badge 
                variant={phase.status === 'completed' ? 'default' : 'outline'}
                className={cn(
                  phase.status === 'completed' && 'bg-green-600 text-white'
                )}
              >
                {phase.status === 'completed' ? 'Completed' : 'Pending'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative group",
                    "bg-gray-900/50 backdrop-blur-xl border rounded-xl p-6",
                    "transition-all duration-300",
                    item.status === 'completed' 
                      ? "border-green-800/30 hover:border-green-600/50"
                      : "border-gray-800 hover:border-gray-700 opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      item.status === 'completed'
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-800 text-gray-500"
                    )}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">
                          Phase {item.id}
                        </span>
                        {item.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {item.description}
                      </p>
                      
                      {'href' in item && item.href && item.status === 'completed' && (
                        <Link href={item.href}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="gap-2 text-primary hover:text-primary-light"
                          >
                            View Demo
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Quick Links */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">
            Quick Links
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/design-system/theme">
              <Button variant="outline" className="gap-2">
                <Palette className="h-4 w-4" />
                Theme System
              </Button>
            </Link>
            <Link href="/design-system/cards">
              <Button variant="outline" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Card Components
              </Button>
            </Link>
            <Link href="/design-system/navigation">
              <Button variant="outline" className="gap-2">
                <Navigation className="h-4 w-4" />
                Navigation
              </Button>
            </Link>
            <Link href="/design-system/header-enhanced">
              <Button variant="outline" className="gap-2">
                <Monitor className="h-4 w-4" />
                Enhanced Header
              </Button>
            </Link>
            <Link href="/design-system/adaptive-navbar">
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Adaptive Navbar
              </Button>
            </Link>
          </div>
        </section>

        {/* Implementation Notes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">
            Implementation Notes
          </h2>
          
          <div className="bg-blue-950/20 border border-blue-800/30 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-200 font-medium">Design System Foundation</p>
                  <p className="text-sm text-gray-400">
                    Established unified spacing (8px grid), typography scale, and color tokens with WCAG AAA compliance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-200 font-medium">Component Architecture</p>
                  <p className="text-sm text-gray-400">
                    Built theme-aware components with proper TypeScript interfaces and accessibility features
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-200 font-medium">Navigation System</p>
                  <p className="text-sm text-gray-400">
                    Fixed dropdown alignment issues and implemented scroll-aware navbar with glassmorphic effects
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-200 font-medium">Performance Focus</p>
                  <p className="text-sm text-gray-400">
                    All transitions use 300ms duration with proper easing for smooth 60fps animations
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