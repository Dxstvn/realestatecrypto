/**
 * Toast Utility Functions - PropertyChain
 * 
 * Enhanced toast notifications with custom styling and features
 * Following Section 0 principles and Section 7.2 specifications
 */

import { toast as sonnerToast, ExternalToast } from 'sonner'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet,
  Bell,
  Shield,
  Zap,
  Copy,
  Download,
  Upload,
  Share2,
} from 'lucide-react'
import { ReactNode } from 'react'

// Toast types for different contexts
export type ToastType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'loading'
  | 'investment'
  | 'transaction'
  | 'property'
  | 'security'

// Custom toast options interface
interface CustomToastOptions extends ExternalToast {
  icon?: ReactNode
  type?: ToastType
  action?: {
    label: string
    onClick: () => void
  }
  progress?: number
  important?: boolean
}

// Icon mapping for toast types
const toastIcons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  loading: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
  investment: <DollarSign className="h-5 w-5 text-green-500" />,
  transaction: <Wallet className="h-5 w-5 text-blue-500" />,
  property: <Building2 className="h-5 w-5 text-purple-500" />,
  security: <Shield className="h-5 w-5 text-orange-500" />,
}

// Style configurations for different toast types
const toastStyles = {
  success: {
    style: {
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: 'white',
      border: '1px solid #059669',
    },
  },
  error: {
    style: {
      background: 'linear-gradient(to right, #ef4444, #dc2626)',
      color: 'white',
      border: '1px solid #dc2626',
    },
  },
  warning: {
    style: {
      background: 'linear-gradient(to right, #f59e0b, #d97706)',
      color: 'white',
      border: '1px solid #d97706',
    },
  },
  info: {
    style: {
      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
      color: 'white',
      border: '1px solid #2563eb',
    },
  },
  loading: {
    style: {
      background: '#f3f4f6',
      color: '#374151',
      border: '1px solid #e5e7eb',
    },
  },
  investment: {
    style: {
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: 'white',
      border: '1px solid #059669',
    },
  },
  transaction: {
    style: {
      background: '#ffffff',
      color: '#1f2937',
      border: '2px solid #3b82f6',
    },
  },
  property: {
    style: {
      background: '#ffffff',
      color: '#1f2937',
      border: '2px solid #8b5cf6',
    },
  },
  security: {
    style: {
      background: '#fff7ed',
      color: '#9a3412',
      border: '2px solid #fb923c',
    },
  },
}

/**
 * Base toast function with enhanced features
 */
function showToast(
  message: string,
  options?: CustomToastOptions
) {
  const { type = 'info', icon, action, progress, important, ...restOptions } = options || {}
  
  const toastIcon = icon || toastIcons[type]
  const toastStyle = toastStyles[type]
  
  return sonnerToast(message, {
    ...toastStyle,
    ...restOptions,
    icon: toastIcon,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    duration: important ? Infinity : (restOptions.duration || 4000),
  })
}

/**
 * Success toast
 */
export function toastSuccess(
  message: string,
  options?: Omit<CustomToastOptions, 'type'>
) {
  return showToast(message, { ...options, type: 'success' })
}

/**
 * Error toast
 */
export function toastError(
  message: string,
  options?: Omit<CustomToastOptions, 'type'>
) {
  return showToast(message, { ...options, type: 'error' })
}

/**
 * Warning toast
 */
export function toastWarning(
  message: string,
  options?: Omit<CustomToastOptions, 'type'>
) {
  return showToast(message, { ...options, type: 'warning' })
}

/**
 * Info toast
 */
export function toastInfo(
  message: string,
  options?: Omit<CustomToastOptions, 'type'>
) {
  return showToast(message, { ...options, type: 'info' })
}

/**
 * Loading toast with promise support
 */
export function toastLoading(
  message: string,
  options?: Omit<CustomToastOptions, 'type'>
) {
  return showToast(message, { ...options, type: 'loading' })
}

/**
 * Promise-based toast
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  },
  options?: CustomToastOptions
) {
  return sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    ...options,
  })
}

/**
 * Investment-specific toasts
 */
export const investmentToasts = {
  success: (amount: string, property: string) => {
    return showToast(`Successfully invested ${amount} in ${property}`, {
      type: 'investment',
      description: 'Your transaction has been processed',
      action: {
        label: 'View Details',
        onClick: () => console.log('View investment details'),
      },
    })
  },
  
  pending: (property: string) => {
    return toastLoading(`Processing investment in ${property}...`, {
      description: 'Please wait while we confirm your transaction',
    })
  },
  
  failed: (reason?: string) => {
    return toastError('Investment failed', {
      description: reason || 'Please check your wallet balance and try again',
      action: {
        label: 'Retry',
        onClick: () => console.log('Retry investment'),
      },
    })
  },
  
  returns: (amount: string, percentage: string, isPositive: boolean) => {
    return showToast(`${isPositive ? 'Profit' : 'Loss'}: ${amount}`, {
      type: 'investment',
      description: `${percentage} return on investment`,
      icon: isPositive ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />,
    })
  },
}

/**
 * Transaction-specific toasts
 */
export const transactionToasts = {
  sent: (txHash: string) => {
    return showToast('Transaction sent', {
      type: 'transaction',
      description: `Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      action: {
        label: 'View on Explorer',
        onClick: () => window.open(`https://etherscan.io/tx/${txHash}`, '_blank'),
      },
    })
  },
  
  confirmed: (confirmations: number) => {
    return toastSuccess('Transaction confirmed', {
      description: `${confirmations} block confirmations`,
    })
  },
  
  failed: (error: string) => {
    return toastError('Transaction failed', {
      description: error,
      important: true,
    })
  },
}

/**
 * Property-specific toasts
 */
export const propertyToasts = {
  added: (propertyName: string) => {
    return showToast(`${propertyName} added to portfolio`, {
      type: 'property',
      action: {
        label: 'View Property',
        onClick: () => console.log('View property'),
      },
    })
  },
  
  updated: () => {
    return toastSuccess('Property details updated', {
      icon: <Building2 className="h-5 w-5" />,
    })
  },
  
  removed: () => {
    return toastInfo('Property removed from watchlist')
  },
  
  favorited: (propertyName: string) => {
    return showToast(`${propertyName} added to favorites`, {
      type: 'info',
      icon: '❤️',
      duration: 2000,
    })
  },
}

/**
 * Security-specific toasts
 */
export const securityToasts = {
  twoFactorEnabled: () => {
    return showToast('Two-factor authentication enabled', {
      type: 'security',
      description: 'Your account is now more secure',
      icon: <Shield className="h-5 w-5 text-green-500" />,
    })
  },
  
  passwordChanged: () => {
    return toastSuccess('Password changed successfully', {
      description: 'Please use your new password to login',
    })
  },
  
  sessionExpired: () => {
    return toastWarning('Session expired', {
      description: 'Please login again to continue',
      important: true,
      action: {
        label: 'Login',
        onClick: () => window.location.href = '/login',
      },
    })
  },
  
  suspiciousActivity: () => {
    return showToast('Suspicious activity detected', {
      type: 'security',
      description: 'Please verify your identity',
      important: true,
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
    })
  },
}

/**
 * Utility toasts
 */
export const utilityToasts = {
  copied: (text?: string) => {
    return showToast(text ? `Copied: ${text}` : 'Copied to clipboard', {
      type: 'info',
      icon: <Copy className="h-5 w-5" />,
      duration: 2000,
    })
  },
  
  downloading: (fileName: string) => {
    return toastLoading(`Downloading ${fileName}...`, {
      icon: <Download className="h-5 w-5 animate-bounce" />,
    })
  },
  
  downloaded: (fileName: string) => {
    return toastSuccess(`${fileName} downloaded`, {
      icon: <Download className="h-5 w-5" />,
      duration: 3000,
    })
  },
  
  uploading: (fileName: string) => {
    return toastLoading(`Uploading ${fileName}...`, {
      icon: <Upload className="h-5 w-5 animate-bounce" />,
    })
  },
  
  uploaded: (fileName: string) => {
    return toastSuccess(`${fileName} uploaded successfully`, {
      icon: <Upload className="h-5 w-5" />,
    })
  },
  
  shared: () => {
    return showToast('Link shared', {
      type: 'info',
      icon: <Share2 className="h-5 w-5" />,
      duration: 2000,
    })
  },
  
  notification: (title: string, message: string) => {
    return showToast(title, {
      type: 'info',
      description: message,
      icon: <Bell className="h-5 w-5" />,
      action: {
        label: 'View',
        onClick: () => console.log('View notification'),
      },
    })
  },
}

/**
 * Custom styled toast
 */
export function toastCustom(
  message: string,
  options?: {
    title?: string
    description?: string
    icon?: ReactNode
    style?: React.CSSProperties
    className?: string
    action?: {
      label: string
      onClick: () => void
    }
    duration?: number
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  }
) {
  const { title, description, icon, style, className, action, duration = 4000, position } = options || {}
  
  return sonnerToast.custom((t) => (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg bg-background border shadow-lg ${className || ''}`}
      style={style}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm">{message}</div>
        {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
      </div>
      {action && (
        <button
          onClick={() => {
            action.onClick()
            sonnerToast.dismiss(t)
          }}
          className="shrink-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  ), { duration, position })
}

// Export main toast object for compatibility
export const toast = {
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  loading: toastLoading,
  promise: toastPromise,
  custom: toastCustom,
  dismiss: sonnerToast.dismiss,
  // Specialized toasts
  investment: investmentToasts,
  transaction: transactionToasts,
  property: propertyToasts,
  security: securityToasts,
  utility: utilityToasts,
}