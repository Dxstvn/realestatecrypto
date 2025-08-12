/**
 * Mobile Navigation Component
 * PropertyLend DeFi Platform
 * 
 * Optimized mobile navigation with Web3 features
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  Home,
  Coins,
  TrendingUp,
  Wallet,
  Lock,
  BarChart3,
  Settings,
  ChevronRight,
  Zap,
  Shield,
  Users,
  Activity,
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Pools', href: '/pools', icon: Coins },
  { name: 'Earn', href: '/earn', icon: TrendingUp },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
  { name: 'Staking', href: '/staking', icon: Lock },
]

const bottomNav = [
  { name: 'Pools', href: '/pools', icon: Coins },
  { name: 'Earn', href: '/earn', icon: TrendingUp },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
  { name: 'More', href: '#', icon: Menu },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <header className={cn(
        'lg:hidden fixed top-0 left-0 right-0 z-50',
        'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800',
        className
      )}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">PropertyLend</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Activity className="h-5 w-5" />
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-950 border-gray-800 w-80">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                
                <nav className="mt-8 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                          isActive 
                            ? 'bg-primary/20 text-primary' 
                            : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-white">Connect Wallet</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Connect your wallet to start earning
                  </p>
                  <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                    Connect
                  </Button>
                </div>

                <div className="mt-auto pt-8">
                  <div className="space-y-3 px-4">
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Admin</span>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                      <span className="text-sm">Network: Polygon</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 z-50',
        'bg-gray-950/90 backdrop-blur-xl border-t border-gray-800',
        'safe-area-bottom'
      )}>
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {bottomNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            if (item.name === 'More') {
              return (
                <button
                  key={item.name}
                  onClick={() => setIsOpen(true)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                    'text-gray-500 hover:text-white hover:bg-gray-900/50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.name}</span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-gray-500 hover:text-white hover:bg-gray-900/50'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

// Mobile-optimized APY ticker
export function MobileAPYTicker() {
  return (
    <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Senior APY</span>
            <span className="font-bold text-blue-400">8.5%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Junior APY</span>
            <span className="font-bold text-green-400">25.3%</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
    </div>
  )
}

// Mobile-first pool card
export function MobilePoolCard({ pool }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-xl border border-gray-800 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{pool.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {pool.tranche}
            </span>
            <span className="text-xs text-gray-500">{pool.asset}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-400">{pool.apy}%</p>
          <p className="text-xs text-gray-500">APY</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">TVL</p>
          <p className="font-semibold text-white">${(pool.tvl / 1000000).toFixed(1)}M</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Available</p>
          <p className="font-semibold text-white">${(pool.available / 1000).toFixed(0)}k</p>
        </div>
      </div>

      <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
        Deposit
      </Button>
    </motion.div>
  )
}