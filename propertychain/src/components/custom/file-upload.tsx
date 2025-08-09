/**
 * File Upload Components - PropertyChain
 * 
 * Comprehensive file upload with drag-drop, progress, and validation
 * Following Section 0 principles with accessibility
 */

'use client'

import * as React from 'react'
import { useDropzone, Accept, FileRejection } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/cn'
import { formatNumber } from '@/lib/format'
import {
  Upload,
  X,
  File,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  Code,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CloudUpload,
  FolderOpen,
  Paperclip,
  FileCheck,
  FileX,
  UploadCloud,
  HardDrive,
} from 'lucide-react'

// File upload types
export interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export interface FileUploadProps {
  onUpload?: (files: File[]) => void | Promise<void>
  onRemove?: (file: UploadedFile) => void
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'button'
}

// Get file icon based on type
const getFileIcon = (file: File) => {
  const type = file.type.split('/')[0]
  const extension = file.name.split('.').pop()?.toLowerCase()

  switch (type) {
    case 'image':
      return <Image className="h-4 w-4" />
    case 'video':
      return <Film className="h-4 w-4" />
    case 'audio':
      return <Music className="h-4 w-4" />
    case 'text':
      return <FileText className="h-4 w-4" />
    default:
      switch (extension) {
        case 'pdf':
          return <FileText className="h-4 w-4 text-red-500" />
        case 'zip':
        case 'rar':
        case '7z':
          return <Archive className="h-4 w-4 text-amber-500" />
        case 'js':
        case 'ts':
        case 'jsx':
        case 'tsx':
        case 'html':
        case 'css':
          return <Code className="h-4 w-4 text-blue-500" />
        default:
          return <File className="h-4 w-4" />
      }
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Base File Upload Component
export function FileUpload({
  onUpload,
  onRemove,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  multiple = true,
  disabled = false,
  className,
  variant = 'default',
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [uploading, setUploading] = React.useState(false)

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(({ file, errors }) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: undefined,
          progress: 0,
          status: 'error' as const,
          error: errors.map(e => e.message).join(', '),
        }))
        setFiles(prev => [...prev, ...errors])
        return
      }

      // Create file objects
      const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'pending' as const,
      }))

      setFiles(prev => [...prev, ...newFiles])

      // Upload files
      if (onUpload) {
        setUploading(true)
        try {
          await onUpload(acceptedFiles)
          
          // Simulate upload progress
          for (const file of newFiles) {
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id
                  ? { ...f, status: 'uploading' as const }
                  : f
              )
            )

            // Simulate progress
            for (let i = 0; i <= 100; i += 10) {
              await new Promise(resolve => setTimeout(resolve, 100))
              setFiles(prev =>
                prev.map(f =>
                  f.id === file.id
                    ? { ...f, progress: i }
                    : f
                )
              )
            }

            setFiles(prev =>
              prev.map(f =>
                f.id === file.id
                  ? { ...f, status: 'success' as const, url: `/uploads/${file.file.name}` }
                  : f
              )
            )
          }
        } catch (error) {
          setFiles(prev =>
            prev.map(f =>
              newFiles.some(nf => nf.id === f.id)
                ? { ...f, status: 'error' as const, error: 'Upload failed' }
                : f
            )
          )
        } finally {
          setUploading(false)
        }
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: multiple ? maxFiles : 1,
    multiple,
    disabled: disabled || uploading,
  })

  const handleRemove = (file: UploadedFile) => {
    setFiles(prev => prev.filter(f => f.id !== file.id))
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
    onRemove?.(file)
  }

  const handleRetry = (file: UploadedFile) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === file.id
          ? { ...f, status: 'pending' as const, progress: 0, error: undefined }
          : f
      )
    )
    if (onUpload) {
      onUpload([file.file])
    }
  }

  const clearAll = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  if (variant === 'button') {
    return (
      <div className={className}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button disabled={disabled || uploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isDragActive ? 'Drop files here' : 'Upload Files'}
          </Button>
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => handleRemove(file)}
                onRetry={() => handleRetry(file)}
                compact
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        <div
          {...getRootProps()}
          className={cn(
            'flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isDragActive ? 'Drop files here' : 'Click or drag files'}
          </span>
          {uploading && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
        </div>
        {files.length > 0 && (
          <div className="space-y-1">
            {files.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => handleRemove(file)}
                onRetry={() => handleRetry(file)}
                compact
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <CloudUpload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse files
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {maxSize && (
              <Badge variant="secondary">
                Max size: {formatFileSize(maxSize)}
              </Badge>
            )}
            {maxFiles > 1 && (
              <Badge variant="secondary">
                Max files: {maxFiles}
              </Badge>
            )}
            {accept && (
              <Badge variant="secondary">
                {Object.values(accept).flat().join(', ')}
              </Badge>
            )}
          </div>
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Uploaded Files ({files.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={uploading}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <div className="space-y-2">
                {files.map(file => (
                  <FileItem
                    key={file.id}
                    file={file}
                    onRemove={() => handleRemove(file)}
                    onRetry={() => handleRetry(file)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// File Item Component
interface FileItemProps {
  file: UploadedFile
  onRemove?: () => void
  onRetry?: () => void
  onPreview?: () => void
  compact?: boolean
}

function FileItem({
  file,
  onRemove,
  onRetry,
  onPreview,
  compact = false,
}: FileItemProps) {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg border bg-card">
        {getFileIcon(file.file)}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{file.file.name}</p>
          {file.status === 'uploading' && (
            <Progress value={file.progress} className="h-1 mt-1" />
          )}
        </div>
        {getStatusIcon()}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      {file.preview ? (
        <img
          src={file.preview}
          alt={file.file.name}
          className="h-12 w-12 rounded object-cover"
        />
      ) : (
        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
          {getFileIcon(file.file)}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium text-sm truncate">{file.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.file.size)}
              {file.file.type && ` • ${file.file.type}`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {file.status === 'success' && file.preview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreview}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {file.status === 'error' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {file.status === 'uploading' && (
          <div className="mt-2">
            <Progress value={file.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {file.progress}% uploaded
            </p>
          </div>
        )}
        
        {file.status === 'error' && file.error && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertDescription className="text-xs">
              {file.error}
            </AlertDescription>
          </Alert>
        )}
        
        {file.status === 'success' && file.url && (
          <p className="text-xs text-green-600 mt-1">
            Upload complete
          </p>
        )}
      </div>
    </div>
  )
}

// Multi-File Upload with Gallery
interface MultiFileUploadProps extends Omit<FileUploadProps, 'multiple'> {
  files?: UploadedFile[]
  onFilesChange?: (files: UploadedFile[]) => void
  showGallery?: boolean
}

export function MultiFileUpload({
  files: externalFiles,
  onFilesChange,
  showGallery = true,
  ...props
}: MultiFileUploadProps) {
  const [internalFiles, setInternalFiles] = React.useState<UploadedFile[]>([])
  const files = externalFiles || internalFiles

  const handleUpload = async (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 100,
      status: 'success' as const,
    }))

    if (onFilesChange) {
      onFilesChange([...files, ...uploadedFiles])
    } else {
      setInternalFiles(prev => [...prev, ...uploadedFiles])
    }

    return props.onUpload?.(newFiles)
  }

  const handleRemove = (file: UploadedFile) => {
    const newFiles = files.filter(f => f.id !== file.id)
    if (onFilesChange) {
      onFilesChange(newFiles)
    } else {
      setInternalFiles(newFiles)
    }
    props.onRemove?.(file)
  }

  return (
    <div className="space-y-4">
      <FileUpload
        {...props}
        multiple
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
      
      {showGallery && files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>File Gallery</CardTitle>
            <CardDescription>
              {files.length} file(s) uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map(file => (
                <div
                  key={file.id}
                  className="relative group rounded-lg overflow-hidden border"
                >
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center">
                      {getFileIcon(file.file)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Preview logic
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemove(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Avatar Upload Component
interface AvatarUploadProps {
  value?: string
  onChange?: (url: string) => void
  onUpload?: (file: File) => Promise<string>
  size?: number
  className?: string
}

export function AvatarUpload({
  value,
  onChange,
  onUpload,
  size = 128,
  className,
}: AvatarUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const [preview, setPreview] = React.useState(value)

  const handleDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      if (onUpload) {
        setUploading(true)
        try {
          const url = await onUpload(file)
          onChange?.(url)
        } catch (error) {
          setPreview(value)
        } finally {
          setUploading(false)
        }
      }
    },
    [value, onChange, onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-full overflow-hidden cursor-pointer border-2 transition-all',
          isDragActive
            ? 'border-primary scale-105'
            : 'border-muted hover:border-primary/50',
          uploading && 'pointer-events-none'
        )}
        style={{ width: size, height: size }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {!uploading && (
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

import { Clock } from 'lucide-react'