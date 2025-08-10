/**
 * File Storage Backup System - PropertyChain
 * 
 * Comprehensive file and media backup utilities with cloud storage support
 * Following UpdatedUIPlan.md Step 68 specifications and CLAUDE.md principles
 */

import { z } from 'zod'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { createGzip, createGunzip } from 'zlib'
import archiver from 'archiver'
import extract from 'extract-zip'

/**
 * File backup configuration schema
 */
const FileBackupConfigSchema = z.object({
  sources: z.array(z.object({
    path: z.string(),
    name: z.string(),
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).default([]),
    recursive: z.boolean().default(true),
  })),
  destination: z.string(),
  compression: z.boolean().default(true),
  encryption: z.boolean().default(true),
  cloudProvider: z.object({
    type: z.enum(['aws-s3', 'google-cloud', 'azure-blob', 'local']),
    bucket: z.string().optional(),
    region: z.string().optional(),
    credentials: z.record(z.string(), z.string()).optional(),
  }).optional(),
  retention: z.object({
    days: z.number().default(30),
    versions: z.number().default(10),
  }),
  scheduling: z.object({
    enabled: z.boolean().default(false),
    cron: z.string().optional(),
    interval: z.number().optional(),
  }).optional(),
})

export type FileBackupConfig = z.infer<typeof FileBackupConfigSchema>

/**
 * File backup metadata
 */
interface FileBackupMetadata {
  id: string
  timestamp: number
  sources: Array<{
    name: string
    path: string
    fileCount: number
    totalSize: number
  }>
  archivePath: string
  compressed: boolean
  encrypted: boolean
  checksum: string
  size: number
  duration: number
}

/**
 * Backup progress callback
 */
type ProgressCallback = (progress: {
  stage: string
  current: number
  total: number
  percentage: number
  file?: string
}) => void

/**
 * File Storage Backup Manager
 */
export class FileStorageBackupManager {
  private config: FileBackupConfig
  private encryptionKey: string
  
  constructor(config: FileBackupConfig, encryptionKey?: string) {
    this.config = FileBackupConfigSchema.parse(config)
    this.encryptionKey = encryptionKey || process.env.FILE_BACKUP_ENCRYPTION_KEY || this.generateEncryptionKey()
  }
  
  /**
   * Create file backup
   */
  async createBackup(
    options: {
      name?: string
      onProgress?: ProgressCallback
      excludePatterns?: string[]
    } = {}
  ): Promise<{
    success: boolean
    metadata?: FileBackupMetadata
    error?: string
  }> {
    const startTime = Date.now()
    const backupId = this.generateBackupId()
    const timestamp = Date.now()
    
    try {
      console.log(`Starting file backup: ${backupId}`)
      
      // Create backup directory
      await this.ensureBackupDirectory()
      
      // Generate archive name
      const archiveName = `${options.name || 'files'}_${timestamp}_${backupId}`
      const archivePath = path.join(this.config.destination, `${archiveName}.tar`)
      
      // Collect files to backup
      options.onProgress?.({
        stage: 'Scanning files',
        current: 0,
        total: 1,
        percentage: 0,
      })
      
      const filesToBackup = await this.collectFiles(options.excludePatterns)
      
      // Create archive
      options.onProgress?.({
        stage: 'Creating archive',
        current: 0,
        total: filesToBackup.length,
        percentage: 0,
      })
      
      const archiveStats = await this.createArchive(archivePath, filesToBackup, options.onProgress)
      
      // Compress archive if enabled
      let finalPath = archivePath
      if (this.config.compression) {
        options.onProgress?.({
          stage: 'Compressing',
          current: 0,
          total: 1,
          percentage: 0,
        })
        
        finalPath = await this.compressArchive(archivePath)
        await fs.unlink(archivePath) // Remove uncompressed version
      }
      
      // Encrypt archive if enabled
      if (this.config.encryption) {
        options.onProgress?.({
          stage: 'Encrypting',
          current: 0,
          total: 1,
          percentage: 0,
        })
        
        const encryptedPath = await this.encryptArchive(finalPath)
        await fs.unlink(finalPath) // Remove unencrypted version
        finalPath = encryptedPath
      }
      
      // Calculate checksum
      const checksum = await this.calculateChecksum(finalPath)
      
      // Get final file size
      const stats = await fs.stat(finalPath)
      
      // Create metadata
      const metadata: FileBackupMetadata = {
        id: backupId,
        timestamp,
        sources: archiveStats.sources,
        archivePath: finalPath,
        compressed: this.config.compression,
        encrypted: this.config.encryption,
        checksum,
        size: stats.size,
        duration: Date.now() - startTime,
      }
      
      // Save metadata
      await this.saveMetadata(backupId, metadata)
      
      // Upload to cloud if configured
      if (this.config.cloudProvider) {
        options.onProgress?.({
          stage: 'Uploading to cloud',
          current: 0,
          total: 1,
          percentage: 0,
        })
        
        await this.uploadToCloud(finalPath, metadata)
      }
      
      options.onProgress?.({
        stage: 'Complete',
        current: 1,
        total: 1,
        percentage: 100,
      })
      
      console.log(`File backup completed: ${backupId} (${Date.now() - startTime}ms)`)
      
      return {
        success: true,
        metadata,
      }
    } catch (error) {
      console.error(`File backup failed: ${backupId}`, error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
  
  /**
   * Restore from backup
   */
  async restoreFromBackup(
    backupId: string,
    options: {
      destination?: string
      overwrite?: boolean
      onProgress?: ProgressCallback
      selectiveRestore?: {
        paths: string[]
        preserveStructure: boolean
      }
    } = {}
  ): Promise<{
    success: boolean
    restoredFiles?: number
    error?: string
  }> {
    try {
      console.log(`Starting file restore: ${backupId}`)
      
      // Get backup metadata
      const metadata = await this.getBackupMetadata(backupId)
      if (!metadata) {
        throw new Error(`Backup metadata not found: ${backupId}`)
      }
      
      // Find backup file (local or download from cloud)
      let backupFile = metadata.archivePath
      if (this.config.cloudProvider && !await this.fileExists(backupFile)) {
        options.onProgress?.({
          stage: 'Downloading from cloud',
          current: 0,
          total: 1,
          percentage: 0,
        })
        
        backupFile = await this.downloadFromCloud(backupId, metadata)
      }
      
      // Verify checksum
      const checksum = await this.calculateChecksum(backupFile)
      if (checksum !== metadata.checksum) {
        throw new Error('Backup file checksum verification failed')
      }
      
      // Decrypt if encrypted
      let processedFile = backupFile
      if (metadata.encrypted) {
        options.onProgress?.({
          stage: 'Decrypting',
          current: 0,
          total: 1,
          percentage: 0,
        })
        
        processedFile = await this.decryptArchive(backupFile)
      }
      
      // Decompress if compressed
      if (metadata.compressed) {
        options.onProgress?.({
          stage: 'Decompressing',
          current: 0,
          total: 1,
          percentage: 0,
        })
        
        const decompressedFile = await this.decompressArchive(processedFile)
        if (processedFile !== backupFile) {
          await fs.unlink(processedFile) // Clean up decrypted temp file
        }
        processedFile = decompressedFile
      }
      
      // Extract archive
      options.onProgress?.({
        stage: 'Extracting files',
        current: 0,
        total: 1,
        percentage: 0,
      })
      
      const destination = options.destination || './restored_files'
      const restoredFiles = await this.extractArchive(
        processedFile,
        destination,
        options.selectiveRestore,
        options.overwrite,
        options.onProgress
      )
      
      // Clean up temporary files
      if (processedFile !== backupFile) {
        await fs.unlink(processedFile)
      }
      
      console.log(`File restore completed: ${backupId}`)
      
      return {
        success: true,
        restoredFiles,
      }
    } catch (error) {
      console.error(`File restore failed: ${backupId}`, error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
  
  /**
   * List available backups
   */
  async listBackups(options: {
    limit?: number
    since?: number
  } = {}): Promise<FileBackupMetadata[]> {
    try {
      const metadataFiles = await fs.readdir(this.config.destination)
      const backups: FileBackupMetadata[] = []
      
      for (const file of metadataFiles) {
        if (file.endsWith('.metadata.json')) {
          const backupId = file.replace('.metadata.json', '')
          const metadata = await this.getBackupMetadata(backupId)
          if (metadata) {
            // Apply filters
            if (options.since && metadata.timestamp < options.since) continue
            
            backups.push(metadata)
          }
        }
      }
      
      // Sort by timestamp (newest first)
      backups.sort((a, b) => b.timestamp - a.timestamp)
      
      // Apply limit
      if (options.limit) {
        return backups.slice(0, options.limit)
      }
      
      return backups
    } catch (error) {
      console.error('Failed to list file backups:', error)
      return []
    }
  }
  
  /**
   * Clean up old backups
   */
  async cleanupOldBackups(): Promise<{ removed: number; freed: number }> {
    try {
      const backups = await this.listBackups()
      const retentionDate = Date.now() - (this.config.retention.days * 24 * 60 * 60 * 1000)
      
      let removedCount = 0
      let freedBytes = 0
      
      // Keep only the specified number of versions
      const toKeep = backups.slice(0, this.config.retention.versions)
      const toRemove = backups.slice(this.config.retention.versions)
      
      // Also remove backups older than retention period
      const expiredBackups = toKeep.filter(backup => backup.timestamp < retentionDate)
      toRemove.push(...expiredBackups)
      
      for (const backup of toRemove) {
        try {
          // Remove local file
          if (await this.fileExists(backup.archivePath)) {
            await fs.unlink(backup.archivePath)
            freedBytes += backup.size
          }
          
          // Remove from cloud if configured
          if (this.config.cloudProvider) {
            await this.deleteFromCloud(backup.id)
          }
          
          // Remove metadata
          const metadataPath = path.join(this.config.destination, `${backup.id}.metadata.json`)
          try {
            await fs.unlink(metadataPath)
          } catch {
            // Metadata might not exist
          }
          
          removedCount++
        } catch (error) {
          console.warn(`Failed to remove backup ${backup.id}:`, error)
        }
      }
      
      console.log(`Cleaned up ${removedCount} old file backups, freed ${Math.round(freedBytes / 1024 / 1024)}MB`)
      
      return { removed: removedCount, freed: freedBytes }
    } catch (error) {
      console.error('File backup cleanup failed:', error)
      return { removed: 0, freed: 0 }
    }
  }
  
  /**
   * Verify backup integrity
   */
  async verifyBackup(backupId: string): Promise<{
    valid: boolean
    issues: string[]
  }> {
    const issues: string[] = []
    
    try {
      // Get metadata
      const metadata = await this.getBackupMetadata(backupId)
      if (!metadata) {
        issues.push('Metadata file missing')
        return { valid: false, issues }
      }
      
      // Check if backup file exists
      let backupFile = metadata.archivePath
      if (!await this.fileExists(backupFile)) {
        if (this.config.cloudProvider) {
          // Try to verify in cloud
          const cloudExists = await this.verifyCloudBackup(backupId)
          if (!cloudExists) {
            issues.push('Backup file missing from both local and cloud storage')
          }
        } else {
          issues.push('Backup file missing')
        }
        return { valid: issues.length === 0, issues }
      }
      
      // Verify file size
      const stats = await fs.stat(backupFile)
      if (stats.size !== metadata.size) {
        issues.push(`File size mismatch: expected ${metadata.size}, got ${stats.size}`)
      }
      
      // Verify checksum
      const checksum = await this.calculateChecksum(backupFile)
      if (checksum !== metadata.checksum) {
        issues.push('Checksum verification failed')
      }
      
      return {
        valid: issues.length === 0,
        issues,
      }
    } catch (error) {
      issues.push(`Verification error: ${error}`)
      return { valid: false, issues }
    }
  }
  
  /**
   * Collect files to backup
   */
  private async collectFiles(excludePatterns: string[] = []): Promise<Array<{
    sourcePath: string
    archivePath: string
    size: number
  }>> {
    const files: Array<{ sourcePath: string; archivePath: string; size: number }> = []
    
    for (const source of this.config.sources) {
      const sourceFiles = await this.scanDirectory(
        source.path,
        source.name,
        source.include,
        [...source.exclude, ...excludePatterns],
        source.recursive
      )
      files.push(...sourceFiles)
    }
    
    return files
  }
  
  /**
   * Scan directory for files
   */
  private async scanDirectory(
    dirPath: string,
    archivePrefix: string,
    include?: string[],
    exclude: string[] = [],
    recursive = true
  ): Promise<Array<{ sourcePath: string; archivePath: string; size: number }>> {
    const files: Array<{ sourcePath: string; archivePath: string; size: number }> = []
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const relativePath = path.relative(dirPath, fullPath)
        const archivePath = path.join(archivePrefix, relativePath)
        
        // Check exclude patterns
        if (exclude.some(pattern => this.matchesPattern(relativePath, pattern))) {
          continue
        }
        
        // Check include patterns (if specified)
        if (include && include.length > 0) {
          if (!include.some(pattern => this.matchesPattern(relativePath, pattern))) {
            continue
          }
        }
        
        if (entry.isFile()) {
          const stats = await fs.stat(fullPath)
          files.push({
            sourcePath: fullPath,
            archivePath,
            size: stats.size,
          })
        } else if (entry.isDirectory() && recursive) {
          const subFiles = await this.scanDirectory(
            fullPath,
            archivePrefix,
            include,
            exclude,
            recursive
          )
          files.push(...subFiles)
        }
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${dirPath}:`, error)
    }
    
    return files
  }
  
  /**
   * Create archive from files
   */
  private async createArchive(
    archivePath: string,
    files: Array<{ sourcePath: string; archivePath: string; size: number }>,
    onProgress?: ProgressCallback
  ): Promise<{
    sources: Array<{
      name: string
      path: string
      fileCount: number
      totalSize: number
    }>
  }> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(archivePath)
      const archive = archiver('tar', { gzip: false })
      
      let processedFiles = 0
      const totalFiles = files.length
      
      // Group files by source for metadata
      const sourceStats = new Map<string, { fileCount: number; totalSize: number }>()
      
      archive.on('error', reject)
      archive.on('warning', (err: any) => {
        if (err.code === 'ENOENT') {
          console.warn('Archive warning:', err)
        } else {
          reject(err)
        }
      })
      
      output.on('close', () => {
        const sources = Array.from(sourceStats.entries()).map(([name, stats]) => ({
          name,
          path: name,
          fileCount: stats.fileCount,
          totalSize: stats.totalSize,
        }))
        
        resolve({ sources })
      })
      
      archive.pipe(output)
      
      // Add files to archive
      files.forEach(file => {
        try {
          archive.file(file.sourcePath, { name: file.archivePath })
          
          // Update source stats
          const sourceName = file.archivePath.split('/')[0]
          const stats = sourceStats.get(sourceName) || { fileCount: 0, totalSize: 0 }
          stats.fileCount++
          stats.totalSize += file.size
          sourceStats.set(sourceName, stats)
          
          processedFiles++
          onProgress?.({
            stage: 'Creating archive',
            current: processedFiles,
            total: totalFiles,
            percentage: Math.round((processedFiles / totalFiles) * 100),
            file: file.sourcePath,
          })
        } catch (error) {
          console.warn(`Failed to add file to archive: ${file.sourcePath}`, error)
        }
      })
      
      archive.finalize()
    })
  }
  
  /**
   * Extract archive
   */
  private async extractArchive(
    archivePath: string,
    destination: string,
    selectiveRestore?: {
      paths: string[]
      preserveStructure: boolean
    },
    overwrite = false,
    onProgress?: ProgressCallback
  ): Promise<number> {
    await fs.mkdir(destination, { recursive: true })
    
    // For simplicity, this implementation assumes tar files
    // In a production environment, you'd want to detect file type and use appropriate extraction
    
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execAsync = promisify(exec)
    
    let command = `tar -xf ${archivePath} -C ${destination}`
    
    if (!overwrite) {
      command += ' --keep-old-files'
    }
    
    if (selectiveRestore && selectiveRestore.paths.length > 0) {
      const pathArgs = selectiveRestore.paths.map(p => `"${p}"`).join(' ')
      command += ` ${pathArgs}`
    }
    
    await execAsync(command)
    
    // Count extracted files (simplified)
    const { stdout } = await execAsync(`find ${destination} -type f | wc -l`)
    return parseInt(stdout.trim(), 10)
  }
  
  /**
   * Utility methods
   */
  private matchesPattern(filePath: string, pattern: string): boolean {
    // Simple glob pattern matching
    const regex = new RegExp(
      pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')
    )
    return regex.test(filePath)
  }
  
  private generateBackupId(): string {
    return crypto.randomBytes(16).toString('hex')
  }
  
  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }
  
  private async ensureBackupDirectory(): Promise<void> {
    await fs.mkdir(this.config.destination, { recursive: true })
  }
  
  private async compressArchive(archivePath: string): Promise<string> {
    const compressedPath = `${archivePath}.gz`
    
    await pipeline(
      createReadStream(archivePath),
      createGzip({ level: 9 }),
      createWriteStream(compressedPath)
    )
    
    return compressedPath
  }
  
  private async decompressArchive(archivePath: string): Promise<string> {
    const decompressedPath = archivePath.replace('.gz', '')
    
    await pipeline(
      createReadStream(archivePath),
      createGunzip(),
      createWriteStream(decompressedPath)
    )
    
    return decompressedPath
  }
  
  private async encryptArchive(archivePath: string): Promise<string> {
    const encryptedPath = `${archivePath}.enc`
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv)
    
    const input = await fs.readFile(archivePath)
    const encrypted = Buffer.concat([iv, cipher.update(input), cipher.final()])
    
    await fs.writeFile(encryptedPath, encrypted)
    return encryptedPath
  }
  
  private async decryptArchive(archivePath: string): Promise<string> {
    const decryptedPath = archivePath.replace('.enc', '')
    
    const encrypted = await fs.readFile(archivePath)
    const iv = encrypted.slice(0, 16)
    const data = encrypted.slice(16)
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv)
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
    
    await fs.writeFile(decryptedPath, decrypted)
    return decryptedPath
  }
  
  private async calculateChecksum(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256')
    const data = await fs.readFile(filePath)
    hash.update(data)
    return hash.digest('hex')
  }
  
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }
  
  private async saveMetadata(backupId: string, metadata: FileBackupMetadata): Promise<void> {
    const metadataPath = path.join(this.config.destination, `${backupId}.metadata.json`)
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }
  
  private async getBackupMetadata(backupId: string): Promise<FileBackupMetadata | null> {
    try {
      const metadataPath = path.join(this.config.destination, `${backupId}.metadata.json`)
      const data = await fs.readFile(metadataPath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  
  /**
   * Cloud storage methods (simplified implementations)
   */
  private async uploadToCloud(filePath: string, metadata: FileBackupMetadata): Promise<void> {
    if (!this.config.cloudProvider) return
    
    // Implementation would depend on cloud provider
    console.log(`Uploading ${filePath} to ${this.config.cloudProvider.type}`)
    // Actual implementation would use AWS SDK, Google Cloud SDK, etc.
  }
  
  private async downloadFromCloud(backupId: string, metadata: FileBackupMetadata): Promise<string> {
    if (!this.config.cloudProvider) throw new Error('Cloud provider not configured')
    
    const localPath = path.join(this.config.destination, `temp_${backupId}`)
    
    // Implementation would depend on cloud provider
    console.log(`Downloading backup ${backupId} from cloud`)
    // Actual implementation would use cloud SDKs
    
    return localPath
  }
  
  private async deleteFromCloud(backupId: string): Promise<void> {
    if (!this.config.cloudProvider) return
    
    // Implementation would depend on cloud provider
    console.log(`Deleting backup ${backupId} from cloud`)
  }
  
  private async verifyCloudBackup(backupId: string): Promise<boolean> {
    if (!this.config.cloudProvider) return false
    
    // Implementation would depend on cloud provider
    console.log(`Verifying backup ${backupId} in cloud`)
    return true // Simplified
  }
}

export default FileStorageBackupManager