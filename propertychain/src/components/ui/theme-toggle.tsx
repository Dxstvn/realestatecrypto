/**
 * Theme Toggle Component
 * PropertyLend DeFi Platform
 * 
 * Phase 2.1: Theme switching UI
 */

'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="w-40 bg-gray-900/95 backdrop-blur-xl border-gray-800"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <span className="ml-auto text-primary-500">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <span className="ml-auto text-primary-500">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <span className="ml-auto text-primary-500">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact version for mobile
export function ThemeToggleCompact() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}