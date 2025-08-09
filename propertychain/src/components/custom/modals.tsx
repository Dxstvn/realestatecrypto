/**
 * Modal System Components - PropertyChain
 * 
 * Comprehensive modal system using shadcn Dialog
 * Standard sizes, mobile responsiveness, and various modal types
 * Following Section 0 principles and Section 7 specifications
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Loader2,
  Search,
  Upload,
  Download,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  File,
  Trash2,
  Edit,
  Copy,
  Share2,
  Settings,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'

// Modal size variants
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

const modalSizes = {
  xs: 'sm:max-w-[320px]',
  sm: 'sm:max-w-[480px]',
  md: 'sm:max-w-[640px]',
  lg: 'sm:max-w-[800px]',
  xl: 'sm:max-w-[1024px]',
  full: 'sm:max-w-[90vw]',
}

// Modal types
export type ModalType = 'default' | 'alert' | 'confirm' | 'form' | 'command' | 'sheet'

// Base Modal Component with size variants
interface BaseModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  size?: ModalSize
  children: React.ReactNode
  footer?: React.ReactNode
  closeButton?: boolean
  className?: string
  mobileFullScreen?: boolean
}

export function BaseModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  size = 'sm',
  children,
  footer,
  closeButton = true,
  className,
  mobileFullScreen = false,
}: BaseModalProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use Sheet for mobile if mobileFullScreen is true
  if (isMobile && mobileFullScreen) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <ScrollArea className="flex-1 my-4">
            {children}
          </ScrollArea>
          {footer && <SheetFooter>{footer}</SheetFooter>}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent 
        className={cn(modalSizes[size], className)}
        onPointerDownOutside={(e) => {
          if (!closeButton) e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

// Confirmation Modal
interface ConfirmModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export function ConfirmModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange?.(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === 'destructive' ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <AlertCircle className="h-5 w-5 text-primary" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading || isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading || isLoading}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
          >
            {(loading || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Alert Modal (Info, Success, Warning, Error)
interface AlertModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description: string
  actionText?: string
  onAction?: () => void
}

export function AlertModal({
  open,
  onOpenChange,
  trigger,
  type,
  title,
  description,
  actionText = 'OK',
  onAction,
}: AlertModalProps) {
  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
  }

  const colors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    error: 'bg-red-50 border-red-200',
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <div className={cn('rounded-lg border p-4 mb-4', colors[type])}>
          <div className="flex items-start gap-3">
            {icons[type]}
            <div className="flex-1">
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            onAction?.()
            onOpenChange?.(false)
          }}>
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Command Modal (Search/Command Palette)
interface CommandModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  placeholder?: string
  commands: Array<{
    group: string
    items: Array<{
      icon?: React.ReactNode
      label: string
      shortcut?: string
      onSelect: () => void
    }>
  }>
}

export function CommandModal({
  open,
  onOpenChange,
  trigger,
  placeholder = 'Type a command or search...',
  commands,
}: CommandModalProps) {
  return (
    <>
      {trigger && (
        <div onClick={() => onOpenChange?.(true)}>
          {trigger}
        </div>
      )}
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commands.map((group, index) => (
            <React.Fragment key={group.group}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => {
                      item.onSelect()
                      onOpenChange?.(false)
                    }}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        {item.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

// Media Gallery Modal
interface MediaGalleryModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  media: Array<{
    id: string
    type: 'image' | 'video'
    url: string
    thumbnail?: string
    title?: string
    description?: string
  }>
  initialIndex?: number
}

export function MediaGalleryModal({
  open,
  onOpenChange,
  trigger,
  title = 'Media Gallery',
  media,
  initialIndex = 0,
}: MediaGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
  const currentMedia = media[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0))
  }

  React.useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0">
        <div className="relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-lg font-semibold">{currentMedia?.title || title}</h3>
                {currentMedia?.description && (
                  <p className="text-sm opacity-90">{currentMedia.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-black/30 text-white">
                  {currentIndex + 1} / {media.length}
                </Badge>
                <DialogClose asChild>
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>

          {/* Media Display */}
          <div className="relative bg-black flex items-center justify-center min-h-[400px] max-h-[70vh]">
            {currentMedia?.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={currentMedia.title || 'Media'}
                className="max-w-full max-h-full object-contain"
              />
            ) : currentMedia?.type === 'video' ? (
              <video
                src={currentMedia.url}
                controls
                className="max-w-full max-h-full"
              />
            ) : null}

            {/* Navigation */}
            {media.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="p-4 bg-background border-t">
              <ScrollArea className="w-full">
                <div className="flex gap-2">
                  {media.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'relative shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all',
                        currentIndex === index
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-transparent hover:border-muted-foreground'
                      )}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title || `Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Film className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Form Modal with Steps
interface FormModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  steps: Array<{
    title: string
    description?: string
    content: React.ReactNode
  }>
  onComplete: (data: any) => void | Promise<void>
  size?: ModalSize
}

export function FormModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  steps,
  onComplete,
  size = 'md',
}: FormModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({})

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await onComplete(formData)
      onOpenChange?.(false)
      setCurrentStep(0)
      setFormData({})
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!open) {
      setCurrentStep(0)
      setFormData({})
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(modalSizes[size])}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Progress Indicator */}
        {steps.length > 1 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{currentStepData.title}</span>
            </div>
            <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
          </div>
        )}

        {/* Step Content */}
        <div className="py-4">
          {currentStepData.description && (
            <p className="text-sm text-muted-foreground mb-4">
              {currentStepData.description}
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            {!isFirstStep && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isLoading}
              >
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {isLastStep ? (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Quick Action Modal
interface QuickActionModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  actions: Array<{
    icon: React.ReactNode
    label: string
    description?: string
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
}

export function QuickActionModal({
  open,
  onOpenChange,
  trigger,
  title,
  actions,
}: QuickActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                action.onClick()
                onOpenChange?.(false)
              }}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="mt-0.5">{action.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{action.label}</div>
                  {action.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Import for Chevron icons
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Export all modal components
export const Modals = {
  Base: BaseModal,
  Confirm: ConfirmModal,
  Alert: AlertModal,
  Command: CommandModal,
  MediaGallery: MediaGalleryModal,
  Form: FormModal,
  QuickAction: QuickActionModal,
}