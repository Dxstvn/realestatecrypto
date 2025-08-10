/**
 * Admin Header - PropertyChain
 * 
 * Header component for admin dashboard
 * Following UpdatedUIPlan.md specifications
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Shield,
  Moon,
  Sun,
  HelpCircle,
  Terminal,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { signOut } from 'next-auth/react'
import type { PropertyChainUser } from '@/lib/auth'

interface AdminHeaderProps {
  user: PropertyChainUser
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notifications] = useState(3)
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">PropertyChain</span>
            <Badge variant="destructive" className="text-xs">ADMIN</Badge>
          </div>
          
          {/* Search */}
          <div className="relative ml-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, properties, transactions..."
              className="pl-10 pr-4 py-2 w-96 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <Button variant="ghost" size="sm" className="gap-2">
            <Terminal className="h-4 w-4" />
            Console
          </Button>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                  <AvatarFallback>
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}