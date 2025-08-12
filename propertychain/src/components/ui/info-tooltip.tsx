/**
 * Info Tooltip Component - PropertyLend
 * Phase 4.2: Content Improvements
 * 
 * Helpful tooltips for complex terms and metrics
 */

'use client'

import { ReactNode, useState } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Info, HelpCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Glossary of complex terms
export const GLOSSARY: Record<string, string> = {
  // Financial Terms
  'APY': 'Annual Percentage Yield - The real rate of return on your investment, accounting for compound interest',
  'TVL': 'Total Value Locked - The total amount of capital currently invested across all lending pools',
  'LTV': 'Loan-to-Value Ratio - The loan amount as a percentage of the property\'s appraised value',
  'Bridge Loan': 'Short-term financing used until permanent financing is secured, typically 6-18 months',
  'Tranche': 'A portion of a pooled investment with specific risk/return characteristics',
  'Senior Tranche': 'The safest investment tier with first priority on repayments but lower yields',
  'Junior Tranche': 'Higher-risk tier with subordinated payment priority but higher potential returns',
  'Subordinated': 'Lower payment priority - junior investors are paid after senior obligations are met',
  
  // DeFi Terms
  'Smart Contract': 'Self-executing code on the blockchain that automatically enforces agreement terms',
  'Stablecoin': 'Cryptocurrency designed to maintain stable value, typically pegged to USD',
  'Liquidity Pool': 'A collection of funds locked in a smart contract for lending purposes',
  'LP Token': 'Liquidity Provider Token - Represents your share of a lending pool',
  'Gas Fee': 'Transaction fee paid to process operations on the blockchain',
  'Wallet': 'Digital tool for storing and managing cryptocurrency assets',
  'Web3': 'Decentralized internet built on blockchain technology',
  'DeFi': 'Decentralized Finance - Financial services without traditional intermediaries',
  
  // Risk Terms
  'Default Rate': 'Percentage of loans that fail to be repaid according to terms',
  'Collateral': 'Assets pledged as security for loan repayment',
  'Due Diligence': 'Comprehensive assessment of investment risks and opportunities',
  'Liquidation': 'Forced sale of collateral to recover loan principal',
  'Recovery Rate': 'Percentage of principal recovered through collateral liquidation',
  'First Loss Capital': 'Capital that absorbs initial losses before other investors are affected',
  
  // Platform Terms
  'Origination Fee': 'One-time fee charged when a loan is created',
  'Management Fee': 'Annual fee for platform operations and maintenance',
  'KYC': 'Know Your Customer - Identity verification required for regulatory compliance',
  'AML': 'Anti-Money Laundering - Procedures to prevent illegal fund transfers',
  'Multi-sig': 'Multi-signature - Requires multiple approvals for transactions',
  'Compound Interest': 'Interest earned on both principal and previously earned interest',
}

interface InfoTooltipProps {
  content?: ReactNode
  term?: string
  children?: ReactNode
  icon?: 'info' | 'help' | 'alert'
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  iconClassName?: string
  contentClassName?: string
  showIcon?: boolean
  delayDuration?: number
}

export function InfoTooltip({
  content,
  term,
  children,
  icon = 'info',
  side = 'top',
  align = 'center',
  className,
  iconClassName,
  contentClassName,
  showIcon = true,
  delayDuration = 200,
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  
  // Get content from glossary if term is provided
  const tooltipContent = content || (term && GLOSSARY[term]) || ''
  
  if (!tooltipContent) return <>{children}</>
  
  const IconComponent = {
    info: Info,
    help: HelpCircle,
    alert: AlertCircle,
  }[icon]
  
  const trigger = children || (
    showIcon && (
      <IconComponent 
        className={cn(
          'h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors',
          iconClassName
        )}
      />
    )
  )
  
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild>
          <span className={cn('inline-flex items-center', className)}>
            {trigger}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={5}
            className={cn(
              'z-50 max-w-xs px-3 py-2',
              'bg-gray-900 dark:bg-gray-100',
              'text-white dark:text-gray-900',
              'text-sm leading-relaxed',
              'rounded-lg shadow-lg',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2',
              'data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2',
              'data-[side=top]:slide-in-from-bottom-2',
              contentClassName
            )}
          >
            {tooltipContent}
            <TooltipPrimitive.Arrow className="fill-gray-900 dark:fill-gray-100" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

// Specialized component for term definitions
interface TermWithTooltipProps {
  term: string
  children: ReactNode
  className?: string
}

export function TermWithTooltip({ term, children, className }: TermWithTooltipProps) {
  const definition = GLOSSARY[term]
  
  if (!definition) return <>{children}</>
  
  return (
    <InfoTooltip
      content={definition}
      showIcon={false}
      className={className}
    >
      <span className="underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 underline-offset-2 cursor-help">
        {children}
      </span>
    </InfoTooltip>
  )
}

// Statistic with tooltip
interface StatisticWithTooltipProps {
  label: string
  value: string | number
  tooltip?: string
  icon?: boolean
  className?: string
}

export function StatisticWithTooltip({
  label,
  value,
  tooltip,
  icon = true,
  className,
}: StatisticWithTooltipProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        {tooltip && icon && (
          <InfoTooltip content={tooltip} icon="info" iconClassName="h-3 w-3" />
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  )
}

// Inline help text component
interface HelpTextProps {
  children: ReactNode
  className?: string
}

export function HelpText({ children, className }: HelpTextProps) {
  return (
    <p className={cn(
      'text-sm text-gray-600 dark:text-gray-400 mt-1',
      'flex items-start gap-1',
      className
    )}>
      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </p>
  )
}

// Export all tooltip components
export const Tooltip = {
  Info: InfoTooltip,
  Term: TermWithTooltip,
  Statistic: StatisticWithTooltip,
  Help: HelpText,
}