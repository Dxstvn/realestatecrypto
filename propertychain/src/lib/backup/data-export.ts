/**
 * Data Export Tools - PropertyChain
 * 
 * Comprehensive data export utilities for various formats and compliance requirements
 * Following UpdatedUIPlan.md Step 68 specifications and CLAUDE.md principles
 */

import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { stringify } from 'csv-stringify'
import { createObjectCsvWriter } from 'csv-writer'
import XLSX from 'xlsx'

/**
 * Export format types
 */
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  XLSX = 'xlsx',
  XML = 'xml',
  PDF = 'pdf',
  SQL = 'sql',
}

/**
 * Export configuration schema
 */
const ExportConfigSchema = z.object({
  format: z.nativeEnum(ExportFormat),
  destination: z.string(),
  compression: z.boolean().default(false),
  encryption: z.boolean().default(false),
  filters: z.object({
    dateRange: z.object({
      start: z.date(),
      end: z.date(),
    }).optional(),
    userIds: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    includeDeleted: z.boolean().default(false),
    limit: z.number().optional(),
  }).optional(),
  formatting: z.object({
    includeHeaders: z.boolean().default(true),
    dateFormat: z.string().default('ISO'),
    numberFormat: z.string().default('raw'),
    booleanFormat: z.enum(['true/false', '1/0', 'yes/no']).default('true/false'),
  }).optional(),
  compliance: z.object({
    gdpr: z.boolean().default(false),
    hipaa: z.boolean().default(false),
    anonymize: z.boolean().default(false),
    redactPII: z.boolean().default(false),
  }).optional(),
})

export type ExportConfig = z.infer<typeof ExportConfigSchema>

/**
 * Export metadata
 */
interface ExportMetadata {
  id: string
  timestamp: number
  format: ExportFormat
  recordCount: number
  fileSize: number
  filePath: string
  checksum: string
  filters?: any
  compliance: {
    gdprCompliant: boolean
    dataRetentionApplied: boolean
    anonymized: boolean
    piiRedacted: boolean
  }
}

/**
 * Export result
 */
interface ExportResult {
  success: boolean
  metadata?: ExportMetadata
  error?: string
  warnings?: string[]
}

/**
 * Data source interface
 */
interface DataSource {
  name: string
  query: (filters?: any) => Promise<any[]>
  schema: Record<string, string>
  piiFields?: string[]
}

/**
 * Data Export Manager
 */
export class DataExportManager {
  private dataSources: Map<string, DataSource> = new Map()
  private encryptionKey: string
  
  constructor(encryptionKey?: string) {
    this.encryptionKey = encryptionKey || process.env.EXPORT_ENCRYPTION_KEY || this.generateEncryptionKey()
    this.registerBuiltInDataSources()
  }
  
  /**
   * Register a data source
   */
  registerDataSource(name: string, source: DataSource): void {
    this.dataSources.set(name, source)
  }
  
  /**
   * Export data from specified sources
   */
  async exportData(
    sourceNames: string[],
    config: ExportConfig,
    options: {
      onProgress?: (stage: string, progress: number) => void
      includeMetadata?: boolean
    } = {}
  ): Promise<ExportResult> {
    const exportId = this.generateExportId()
    const timestamp = Date.now()
    
    try {
      console.log(`Starting data export: ${exportId}`)
      
      // Validate sources
      const invalidSources = sourceNames.filter(name => !this.dataSources.has(name))
      if (invalidSources.length > 0) {
        return {
          success: false,
          error: `Invalid data sources: ${invalidSources.join(', ')}`,
        }
      }
      
      options.onProgress?.('Collecting data', 0)
      
      // Collect data from all sources
      const allData: Record<string, any[]> = {}
      let totalRecords = 0
      
      for (let i = 0; i < sourceNames.length; i++) {
        const sourceName = sourceNames[i]
        const source = this.dataSources.get(sourceName)!
        
        options.onProgress?.(`Collecting from ${sourceName}`, (i / sourceNames.length) * 30)
        
        const data = await source.query(config.filters)
        
        // Apply compliance filters
        let processedData = data
        if (config.compliance?.redactPII && source.piiFields) {
          processedData = this.redactPII(data, source.piiFields)
        }
        
        if (config.compliance?.anonymize) {
          processedData = this.anonymizeData(processedData)
        }
        
        if (config.compliance?.gdpr) {
          processedData = this.applyGDPRFilters(processedData, config.filters)
        }
        
        allData[sourceName] = processedData
        totalRecords += processedData.length
      }
      
      options.onProgress?.('Processing data', 40)
      
      // Generate export file
      const exportPath = await this.generateExportFile(allData, config, exportId)
      
      options.onProgress?.('Finalizing export', 80)
      
      // Apply compression if requested
      let finalPath = exportPath
      if (config.compression) {
        finalPath = await this.compressFile(exportPath)
        await fs.unlink(exportPath) // Remove uncompressed version
      }
      
      // Apply encryption if requested
      if (config.encryption) {
        const encryptedPath = await this.encryptFile(finalPath)
        await fs.unlink(finalPath) // Remove unencrypted version
        finalPath = encryptedPath
      }
      
      // Calculate checksum and file size
      const checksum = await this.calculateChecksum(finalPath)
      const stats = await fs.stat(finalPath)
      
      options.onProgress?.('Complete', 100)
      
      // Create metadata
      const metadata: ExportMetadata = {
        id: exportId,
        timestamp,
        format: config.format,
        recordCount: totalRecords,
        fileSize: stats.size,
        filePath: finalPath,
        checksum,
        filters: config.filters,
        compliance: {
          gdprCompliant: config.compliance?.gdpr || false,
          dataRetentionApplied: !!config.filters?.dateRange,
          anonymized: config.compliance?.anonymize || false,
          piiRedacted: config.compliance?.redactPII || false,
        },
      }
      
      // Save metadata if requested
      if (options.includeMetadata !== false) {
        await this.saveExportMetadata(exportId, metadata)
      }
      
      console.log(`Data export completed: ${exportId} (${totalRecords} records, ${Math.round(stats.size / 1024)}KB)`)
      
      return {
        success: true,
        metadata,
      }
    } catch (error) {
      console.error(`Data export failed: ${exportId}`, error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
  
  /**
   * Export user data (GDPR compliance)
   */
  async exportUserData(
    userId: string,
    config: Omit<ExportConfig, 'filters'>,
    options?: {
      onProgress?: (stage: string, progress: number) => void
    }
  ): Promise<ExportResult> {
    const userConfig: ExportConfig = {
      ...config,
      filters: {
        userIds: [userId],
        includeDeleted: true, // GDPR requires all data
      },
      compliance: {
        gdpr: true,
        hipaa: false,
        anonymize: false, // Don't anonymize for user data export
        redactPII: false, // Don't redact for user's own data
      },
    }
    
    // Get all user-related data sources
    const userDataSources = Array.from(this.dataSources.keys()).filter(name => {
      const source = this.dataSources.get(name)!
      return source.schema.hasOwnProperty('userId') || 
             source.schema.hasOwnProperty('user_id') ||
             name.includes('user')
    })
    
    return this.exportData(userDataSources, userConfig, options)
  }
  
  /**
   * Export audit trail
   */
  async exportAuditTrail(
    config: ExportConfig & {
      auditTypes?: string[]
      severity?: string[]
    },
    options?: {
      onProgress?: (stage: string, progress: number) => void
    }
  ): Promise<ExportResult> {
    const auditSources = ['audit_logs', 'security_events', 'user_actions'].filter(name => 
      this.dataSources.has(name)
    )
    
    if (auditSources.length === 0) {
      return {
        success: false,
        error: 'No audit data sources available',
      }
    }
    
    return this.exportData(auditSources, config, options)
  }
  
  /**
   * Export compliance report
   */
  async exportComplianceReport(
    reportType: 'gdpr' | 'sox' | 'hipaa',
    dateRange: { start: Date; end: Date },
    format: ExportFormat = ExportFormat.PDF
  ): Promise<ExportResult> {
    const config: ExportConfig = {
      format,
      destination: './compliance_reports',
      compression: true,
      encryption: true,
      filters: {
        dateRange,
        includeDeleted: true,
      },
      compliance: {
        gdpr: reportType === 'gdpr',
        hipaa: reportType === 'hipaa',
        anonymize: true,
        redactPII: true,
      },
    }
    
    let sources: string[]
    
    switch (reportType) {
      case 'gdpr':
        sources = ['users', 'user_data_processing', 'consent_records', 'data_deletions']
        break
      case 'sox':
        sources = ['financial_transactions', 'audit_logs', 'user_access_logs']
        break
      case 'hipaa':
        sources = ['patient_data', 'medical_records', 'access_logs', 'audit_trail']
        break
      default:
        return {
          success: false,
          error: `Unknown compliance report type: ${reportType}`,
        }
    }
    
    // Filter to only existing sources
    sources = sources.filter(name => this.dataSources.has(name))
    
    if (sources.length === 0) {
      return {
        success: false,
        error: `No data sources available for ${reportType} compliance report`,
      }
    }
    
    return this.exportData(sources, config)
  }
  
  /**
   * List export history
   */
  async listExports(options: {
    limit?: number
    since?: number
    format?: ExportFormat
  } = {}): Promise<ExportMetadata[]> {
    try {
      const metadataDir = './export_metadata'
      
      try {
        await fs.access(metadataDir)
      } catch {
        return []
      }
      
      const files = await fs.readdir(metadataDir)
      const exports: ExportMetadata[] = []
      
      for (const file of files) {
        if (file.endsWith('.metadata.json')) {
          try {
            const filePath = path.join(metadataDir, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const metadata: ExportMetadata = JSON.parse(content)
            
            // Apply filters
            if (options.since && metadata.timestamp < options.since) continue
            if (options.format && metadata.format !== options.format) continue
            
            exports.push(metadata)
          } catch (error) {
            console.warn(`Failed to read export metadata ${file}:`, error)
          }
        }
      }
      
      // Sort by timestamp (newest first)
      exports.sort((a, b) => b.timestamp - a.timestamp)
      
      // Apply limit
      if (options.limit) {
        return exports.slice(0, options.limit)
      }
      
      return exports
    } catch (error) {
      console.error('Failed to list exports:', error)
      return []
    }
  }
  
  /**
   * Delete export file and metadata
   */
  async deleteExport(exportId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get metadata
      const metadata = await this.getExportMetadata(exportId)
      if (!metadata) {
        return { success: false, error: 'Export not found' }
      }
      
      // Delete export file
      try {
        await fs.unlink(metadata.filePath)
      } catch (error) {
        console.warn(`Failed to delete export file ${metadata.filePath}:`, error)
      }
      
      // Delete metadata file
      const metadataPath = path.join('./export_metadata', `${exportId}.metadata.json`)
      try {
        await fs.unlink(metadataPath)
      } catch (error) {
        console.warn(`Failed to delete metadata file ${metadataPath}:`, error)
      }
      
      console.log(`Deleted export: ${exportId}`)
      
      return { success: true }
    } catch (error) {
      console.error(`Failed to delete export ${exportId}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
  
  /**
   * Generate export file based on format
   */
  private async generateExportFile(
    data: Record<string, any[]>,
    config: ExportConfig,
    exportId: string
  ): Promise<string> {
    // Ensure destination directory exists
    await fs.mkdir(config.destination, { recursive: true })
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
    const fileName = `export_${exportId}_${timestamp}`
    
    switch (config.format) {
      case ExportFormat.JSON:
        return this.generateJSONExport(data, config, fileName)
      case ExportFormat.CSV:
        return this.generateCSVExport(data, config, fileName)
      case ExportFormat.XLSX:
        return this.generateXLSXExport(data, config, fileName)
      case ExportFormat.XML:
        return this.generateXMLExport(data, config, fileName)
      case ExportFormat.SQL:
        return this.generateSQLExport(data, config, fileName)
      default:
        throw new Error(`Unsupported export format: ${config.format}`)
    }
  }
  
  /**
   * Generate JSON export
   */
  private async generateJSONExport(
    data: Record<string, any[]>,
    config: ExportConfig,
    fileName: string
  ): Promise<string> {
    const filePath = path.join(config.destination, `${fileName}.json`)
    
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        recordCount: Object.values(data).reduce((sum, records) => sum + records.length, 0),
        sources: Object.keys(data),
        filters: config.filters,
      },
      data,
    }
    
    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2))
    return filePath
  }
  
  /**
   * Generate CSV export
   */
  private async generateCSVExport(
    data: Record<string, any[]>,
    config: ExportConfig,
    fileName: string
  ): Promise<string> {
    // For multiple data sources, create separate CSV files in a directory
    if (Object.keys(data).length > 1) {
      const dirPath = path.join(config.destination, fileName)
      await fs.mkdir(dirPath, { recursive: true })
      
      for (const [sourceName, records] of Object.entries(data)) {
        if (records.length > 0) {
          const csvPath = path.join(dirPath, `${sourceName}.csv`)
          await this.writeCSVFile(records, csvPath, config)
        }
      }
      
      return dirPath
    } else {
      // Single data source
      const filePath = path.join(config.destination, `${fileName}.csv`)
      const records = Object.values(data)[0] || []
      await this.writeCSVFile(records, filePath, config)
      return filePath
    }
  }
  
  /**
   * Generate XLSX export
   */
  private async generateXLSXExport(
    data: Record<string, any[]>,
    config: ExportConfig,
    fileName: string
  ): Promise<string> {
    const filePath = path.join(config.destination, `${fileName}.xlsx`)
    
    const workbook = XLSX.utils.book_new()
    
    for (const [sourceName, records] of Object.entries(data)) {
      if (records.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(records)
        XLSX.utils.book_append_sheet(workbook, worksheet, sourceName)
      }
    }
    
    XLSX.writeFile(workbook, filePath)
    return filePath
  }
  
  /**
   * Generate XML export
   */
  private async generateXMLExport(
    data: Record<string, any[]>,
    config: ExportConfig,
    fileName: string
  ): Promise<string> {
    const filePath = path.join(config.destination, `${fileName}.xml`)
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<export>\n'
    xml += `  <metadata>\n`
    xml += `    <exportDate>${new Date().toISOString()}</exportDate>\n`
    xml += `    <recordCount>${Object.values(data).reduce((sum, records) => sum + records.length, 0)}</recordCount>\n`
    xml += `  </metadata>\n`
    
    for (const [sourceName, records] of Object.entries(data)) {
      xml += `  <${sourceName}>\n`
      
      for (const record of records) {
        xml += '    <record>\n'
        for (const [key, value] of Object.entries(record)) {
          xml += `      <${key}>${this.escapeXML(String(value))}</${key}>\n`
        }
        xml += '    </record>\n'
      }
      
      xml += `  </${sourceName}>\n`
    }
    
    xml += '</export>'
    
    await fs.writeFile(filePath, xml)
    return filePath
  }
  
  /**
   * Generate SQL export
   */
  private async generateSQLExport(
    data: Record<string, any[]>,
    config: ExportConfig,
    fileName: string
  ): Promise<string> {
    const filePath = path.join(config.destination, `${fileName}.sql`)
    
    let sql = `-- PropertyChain Data Export\n-- Generated: ${new Date().toISOString()}\n\n`
    
    for (const [sourceName, records] of Object.entries(data)) {
      if (records.length === 0) continue
      
      const source = this.dataSources.get(sourceName)
      if (!source) continue
      
      // Create table structure
      sql += `-- Table: ${sourceName}\n`
      sql += `CREATE TABLE IF NOT EXISTS ${sourceName} (\n`
      
      const sampleRecord = records[0]
      const columns = Object.keys(sampleRecord).map(key => {
        const type = this.inferSQLType(sampleRecord[key])
        return `  ${key} ${type}`
      })
      
      sql += columns.join(',\n')
      sql += '\n);\n\n'
      
      // Insert data
      for (const record of records) {
        const values = Object.values(record).map(value => {
          if (value === null || value === undefined) return 'NULL'
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
          if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
          if (value instanceof Date) return `'${value.toISOString()}'`
          return String(value)
        })
        
        sql += `INSERT INTO ${sourceName} (${Object.keys(record).join(', ')}) VALUES (${values.join(', ')});\n`
      }
      
      sql += '\n'
    }
    
    await fs.writeFile(filePath, sql)
    return filePath
  }
  
  /**
   * Data processing methods
   */
  private redactPII(data: any[], piiFields: string[]): any[] {
    return data.map(record => {
      const redacted = { ...record }
      
      for (const field of piiFields) {
        if (redacted[field]) {
          redacted[field] = '[REDACTED]'
        }
      }
      
      return redacted
    })
  }
  
  private anonymizeData(data: any[]): any[] {
    return data.map(record => {
      const anonymized = { ...record }
      
      // Remove direct identifiers
      delete anonymized.id
      delete anonymized.email
      delete anonymized.phone
      delete anonymized.ssn
      delete anonymized.name
      delete anonymized.firstName
      delete anonymized.lastName
      
      // Hash indirect identifiers
      if (anonymized.userId) {
        anonymized.userId = this.hashValue(anonymized.userId)
      }
      
      if (anonymized.ipAddress) {
        anonymized.ipAddress = this.maskIPAddress(anonymized.ipAddress)
      }
      
      return anonymized
    })
  }
  
  private applyGDPRFilters(data: any[], filters?: any): any[] {
    // Apply GDPR-specific filtering logic
    let filtered = data
    
    // Remove data outside retention period if specified
    if (filters?.dateRange) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.createdAt || record.date || record.timestamp)
        return recordDate >= filters.dateRange.start && recordDate <= filters.dateRange.end
      })
    }
    
    // Apply right to be forgotten
    if (filters?.excludeDeletedUsers) {
      filtered = filtered.filter(record => !record.deleted && !record.isDeleted)
    }
    
    return filtered
  }
  
  /**
   * Utility methods
   */
  private async writeCSVFile(records: any[], filePath: string, config: ExportConfig): Promise<void> {
    if (records.length === 0) return
    
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: Object.keys(records[0]).map(key => ({ id: key, title: key })),
    })
    
    await csvWriter.writeRecords(records)
  }
  
  private inferSQLType(value: any): string {
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'INTEGER' : 'DECIMAL(10,2)'
    }
    if (typeof value === 'boolean') return 'BOOLEAN'
    if (value instanceof Date) return 'TIMESTAMP'
    if (typeof value === 'string') {
      return value.length > 255 ? 'TEXT' : 'VARCHAR(255)'
    }
    return 'TEXT'
  }
  
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  private hashValue(value: string): string {
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(value).digest('hex').substring(0, 8)
  }
  
  private maskIPAddress(ip: string): string {
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`
    }
    return 'xxx.xxx.xxx.xxx'
  }
  
  private generateExportId(): string {
    const crypto = require('crypto')
    return crypto.randomBytes(8).toString('hex')
  }
  
  private generateEncryptionKey(): string {
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  }
  
  private async compressFile(filePath: string): Promise<string> {
    const zlib = require('zlib')
    const { pipeline } = require('stream/promises')
    const { createReadStream, createWriteStream } = require('fs')
    
    const compressedPath = `${filePath}.gz`
    
    await pipeline(
      createReadStream(filePath),
      zlib.createGzip({ level: 9 }),
      createWriteStream(compressedPath)
    )
    
    return compressedPath
  }
  
  private async encryptFile(filePath: string): Promise<string> {
    const crypto = require('crypto')
    
    const encryptedPath = `${filePath}.enc`
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey)
    
    const input = await fs.readFile(filePath)
    const encrypted = Buffer.concat([cipher.update(input), cipher.final()])
    
    await fs.writeFile(encryptedPath, encrypted)
    return encryptedPath
  }
  
  private async calculateChecksum(filePath: string): Promise<string> {
    const crypto = require('crypto')
    const hash = crypto.createHash('sha256')
    const data = await fs.readFile(filePath)
    hash.update(data)
    return hash.digest('hex')
  }
  
  private async saveExportMetadata(exportId: string, metadata: ExportMetadata): Promise<void> {
    const metadataDir = './export_metadata'
    await fs.mkdir(metadataDir, { recursive: true })
    
    const metadataPath = path.join(metadataDir, `${exportId}.metadata.json`)
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }
  
  private async getExportMetadata(exportId: string): Promise<ExportMetadata | null> {
    try {
      const metadataPath = path.join('./export_metadata', `${exportId}.metadata.json`)
      const content = await fs.readFile(metadataPath, 'utf-8')
      return JSON.parse(content)
    } catch {
      return null
    }
  }
  
  /**
   * Register built-in data sources
   */
  private registerBuiltInDataSources(): void {
    // Example data sources - in production these would connect to actual databases
    
    this.registerDataSource('users', {
      name: 'Users',
      schema: {
        id: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        createdAt: 'date',
        updatedAt: 'date',
      },
      piiFields: ['email', 'firstName', 'lastName'],
      query: async (filters) => {
        // Mock implementation - replace with actual database query
        return [
          {
            id: '1',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-06-01'),
          },
        ]
      },
    })
    
    this.registerDataSource('properties', {
      name: 'Properties',
      schema: {
        id: 'string',
        title: 'string',
        address: 'string',
        price: 'number',
        ownerId: 'string',
        createdAt: 'date',
      },
      query: async (filters) => {
        // Mock implementation
        return [
          {
            id: '1',
            title: 'Sample Property',
            address: '123 Main St',
            price: 100000,
            ownerId: '1',
            createdAt: new Date('2023-01-15'),
          },
        ]
      },
    })
    
    this.registerDataSource('transactions', {
      name: 'Transactions',
      schema: {
        id: 'string',
        userId: 'string',
        propertyId: 'string',
        amount: 'number',
        type: 'string',
        timestamp: 'date',
      },
      query: async (filters) => {
        // Mock implementation
        return [
          {
            id: '1',
            userId: '1',
            propertyId: '1',
            amount: 5000,
            type: 'investment',
            timestamp: new Date('2023-02-01'),
          },
        ]
      },
    })
  }
}

export default DataExportManager