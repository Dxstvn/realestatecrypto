/**
 * Aligned Navigation Menu Component
 * PropertyLend DeFi Platform
 * 
 * Phase 2.3: Navigation Dropdown Fix
 * - Properly aligned dropdowns with parent items
 * - Visual connector arrow between dropdown and navbar
 * - Consistent positioning across all dropdowns
 */

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Export the Navigation Menu Root
const NavigationMenuAligned = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuAlignedViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenuAligned.displayName = "NavigationMenuAligned"

// Navigation Menu List
const NavigationMenuAlignedList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-2",
      className
    )}
    {...props}
  />
))
NavigationMenuAlignedList.displayName = "NavigationMenuAlignedList"

// Navigation Menu Item
const NavigationMenuAlignedItem = NavigationMenuPrimitive.Item

// Navigation Menu Trigger Style
const navigationMenuAlignedTriggerStyle = cva(
  cn(
    "group inline-flex h-10 w-max items-center justify-center rounded-md",
    "bg-transparent px-4 py-2 text-sm font-medium",
    "transition-all duration-200",
    "hover:bg-accent/50 hover:text-accent-foreground",
    "focus:bg-accent focus:text-accent-foreground focus:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
  )
)

// Navigation Menu Trigger with proper alignment
const NavigationMenuAlignedTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuAlignedTriggerStyle(), "group relative", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className={cn(
        "relative top-[1px] ml-1 h-3 w-3",
        "transition-transform duration-200",
        "group-data-[state=open]:rotate-180"
      )}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuAlignedTrigger.displayName = "NavigationMenuAlignedTrigger"

// Navigation Menu Content with proper alignment
const NavigationMenuAlignedContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      // Proper positioning with centered alignment
      "absolute left-1/2 top-full -translate-x-1/2",
      "mt-2",
      // Animation
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-top-2",
      "data-[motion=from-start]:slide-in-from-top-2",
      "data-[motion=to-end]:slide-out-to-top-2",
      "data-[motion=to-start]:slide-out-to-top-2",
      className
    )}
    {...props}
  />
))
NavigationMenuAlignedContent.displayName = "NavigationMenuAlignedContent"

// Navigation Menu Link
const NavigationMenuAlignedLink = NavigationMenuPrimitive.Link

// Navigation Menu Viewport with improved styling
const NavigationMenuAlignedViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex w-full justify-center">
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "relative mt-2",
        "h-[var(--radix-navigation-menu-viewport-height)]",
        "w-full md:w-[var(--radix-navigation-menu-viewport-width)]",
        "overflow-hidden rounded-lg",
        "border border-border",
        "bg-popover text-popover-foreground",
        "shadow-lg",
        // Visual connector arrow styling
        "before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2",
        "before:h-0 before:w-0",
        "before:border-8 before:border-transparent",
        "before:border-b-border",
        // Inner arrow for fill
        "after:absolute after:-top-[7px] after:left-1/2 after:-translate-x-1/2",
        "after:h-0 after:w-0",
        "after:border-[7px] after:border-transparent",
        "after:border-b-popover",
        // Animation
        "origin-top-center",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:fade-out data-[state=open]:fade-in",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuAlignedViewport.displayName = "NavigationMenuAlignedViewport"

// Navigation Menu Indicator with visual connector
const NavigationMenuAlignedIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-2 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    {/* Visual connector arrow */}
    <div className="relative -top-px h-3 w-3 rotate-45 rounded-tl-sm bg-popover shadow-sm border-l border-t border-border" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuAlignedIndicator.displayName = "NavigationMenuAlignedIndicator"

// Styled dropdown container for consistent look
const NavigationMenuDropdownContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'left' | 'center' | 'right'
  }
>(({ className, align = 'center', children, ...props }, ref) => {
  const alignmentClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full mt-2 z-50",
        alignmentClasses[align],
        "min-w-[280px] rounded-lg",
        "border border-border bg-popover text-popover-foreground",
        "shadow-lg",
        "p-2",
        // Visual connector arrow
        "before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2",
        "before:h-0 before:w-0",
        "before:border-8 before:border-transparent",
        "before:border-b-border",
        // Inner arrow for fill
        "after:absolute after:-top-[7px] after:left-1/2 after:-translate-x-1/2",
        "after:h-0 after:w-0",
        "after:border-[7px] after:border-transparent",
        "after:border-b-popover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
NavigationMenuDropdownContainer.displayName = "NavigationMenuDropdownContainer"

export {
  navigationMenuAlignedTriggerStyle,
  NavigationMenuAligned,
  NavigationMenuAlignedList,
  NavigationMenuAlignedItem,
  NavigationMenuAlignedContent,
  NavigationMenuAlignedTrigger,
  NavigationMenuAlignedLink,
  NavigationMenuAlignedIndicator,
  NavigationMenuAlignedViewport,
  NavigationMenuDropdownContainer
}