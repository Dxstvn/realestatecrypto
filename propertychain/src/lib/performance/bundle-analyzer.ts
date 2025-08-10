/**
 * Bundle Analyzer Configuration - PropertyChain
 * 
 * Webpack bundle analysis and optimization utilities
 * Following UpdatedUIPlan.md Step 69 specifications and CLAUDE.md principles
 */

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import type { Configuration } from 'webpack'

/**
 * Bundle analyzer configuration
 */
export interface BundleAnalyzerConfig {
  enabled: boolean
  analyzerMode: 'server' | 'static' | 'json' | 'disabled'
  reportFilename: string
  openAnalyzer: boolean
  generateStatsFile: boolean
  statsFilename: string
  logLevel: 'info' | 'warn' | 'error' | 'silent'
}

/**
 * Default bundle analyzer configuration
 */
export const defaultBundleAnalyzerConfig: BundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === 'true',
  analyzerMode: process.env.CI ? 'static' : 'server',
  reportFilename: 'bundle-report.html',
  openAnalyzer: !process.env.CI,
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json',
  logLevel: 'info',
}

/**
 * Configure webpack bundle analyzer
 */
export function configureBundleAnalyzer(
  config: Configuration,
  options: Partial<BundleAnalyzerConfig> = {}
): Configuration {
  const analyzerConfig = { ...defaultBundleAnalyzerConfig, ...options }
  
  if (!analyzerConfig.enabled) {
    return config
  }
  
  const plugin = new BundleAnalyzerPlugin({
    analyzerMode: analyzerConfig.analyzerMode,
    reportFilename: analyzerConfig.reportFilename,
    openAnalyzer: analyzerConfig.openAnalyzer,
    generateStatsFile: analyzerConfig.generateStatsFile,
    statsFilename: analyzerConfig.statsFilename,
    logLevel: analyzerConfig.logLevel,
    defaultSizes: 'gzip',
    excludeAssets: /\.map$/,
  })
  
  if (!config.plugins) {
    config.plugins = []
  }
  
  config.plugins.push(plugin)
  
  return config
}

/**
 * Bundle size limits configuration
 */
export interface BundleSizeLimits {
  maxEntrypointSize: number
  maxAssetSize: number
  maxChunkSize: number
  warnThreshold: number
}

/**
 * Default bundle size limits (in bytes)
 */
export const defaultBundleSizeLimits: BundleSizeLimits = {
  maxEntrypointSize: 512 * 1024, // 512KB
  maxAssetSize: 256 * 1024, // 256KB
  maxChunkSize: 1024 * 1024, // 1MB
  warnThreshold: 0.9, // Warn at 90% of limit
}

/**
 * Configure webpack performance hints
 */
export function configurePerformanceHints(
  config: Configuration,
  limits: Partial<BundleSizeLimits> = {}
): Configuration {
  const sizeLimits = { ...defaultBundleSizeLimits, ...limits }
  
  config.performance = {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    maxEntrypointSize: sizeLimits.maxEntrypointSize,
    maxAssetSize: sizeLimits.maxAssetSize,
    assetFilter: (assetFilename: string) => {
      // Only check JS and CSS files
      return /\.(js|css)$/.test(assetFilename)
    },
  }
  
  return config
}

/**
 * Chunk optimization configuration
 */
export interface ChunkOptimizationConfig {
  enableVendorSplitting: boolean
  enableCommonsSplitting: boolean
  minSize: number
  maxAsyncRequests: number
  maxInitialRequests: number
}

/**
 * Default chunk optimization configuration
 */
export const defaultChunkOptimizationConfig: ChunkOptimizationConfig = {
  enableVendorSplitting: true,
  enableCommonsSplitting: true,
  minSize: 20000, // 20KB
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
}

/**
 * Configure webpack chunk optimization
 */
export function configureChunkOptimization(
  config: Configuration,
  options: Partial<ChunkOptimizationConfig> = {}
): Configuration {
  const chunkConfig = { ...defaultChunkOptimizationConfig, ...options }
  
  if (!config.optimization) {
    config.optimization = {}
  }
  
  config.optimization.splitChunks = {
    chunks: 'all',
    minSize: chunkConfig.minSize,
    maxAsyncRequests: chunkConfig.maxAsyncRequests,
    maxInitialRequests: chunkConfig.maxInitialRequests,
    cacheGroups: {
      default: false,
      vendors: chunkConfig.enableVendorSplitting ? {
        name: 'vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        reuseExistingChunk: true,
      } : false,
      commons: chunkConfig.enableCommonsSplitting ? {
        name: 'commons',
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
      } : false,
      // Framework chunks (React, Next.js)
      framework: {
        name: 'framework',
        test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
        priority: 40,
        enforce: true,
      },
      // UI library chunks
      ui: {
        name: 'ui',
        test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|lucide-react)[\\/]/,
        priority: 30,
      },
      // Web3 chunks
      web3: {
        name: 'web3',
        test: /[\\/]node_modules[\\/](ethers|wagmi|viem|@rainbow-me)[\\/]/,
        priority: 25,
      },
      // Utility chunks
      utils: {
        name: 'utils',
        test: /[\\/]node_modules[\\/](lodash|date-fns|zod)[\\/]/,
        priority: 20,
      },
    },
  }
  
  // Enable module concatenation for smaller bundles
  config.optimization.concatenateModules = true
  
  // Use deterministic module IDs for long-term caching
  config.optimization.moduleIds = 'deterministic'
  
  // Use deterministic chunk IDs
  config.optimization.chunkIds = 'deterministic'
  
  // Enable tree shaking
  config.optimization.usedExports = true
  config.optimization.sideEffects = false
  
  // Minimize in production
  config.optimization.minimize = process.env.NODE_ENV === 'production'
  
  return config
}

/**
 * Generate bundle analysis report
 */
export async function generateBundleReport(
  statsFile: string = 'bundle-stats.json'
): Promise<{
  totalSize: number
  chunks: Array<{
    name: string
    size: number
    modules: number
  }>
  assets: Array<{
    name: string
    size: number
    chunkNames: string[]
  }>
  warnings: string[]
}> {
  const fs = await import('fs/promises')
  const path = await import('path')
  
  try {
    const statsPath = path.join(process.cwd(), '.next', statsFile)
    const statsData = await fs.readFile(statsPath, 'utf-8')
    const stats = JSON.parse(statsData)
    
    const chunks = stats.chunks.map((chunk: any) => ({
      name: chunk.names[0] || 'unnamed',
      size: chunk.size,
      modules: chunk.modules?.length || 0,
    }))
    
    const assets = stats.assets.map((asset: any) => ({
      name: asset.name,
      size: asset.size,
      chunkNames: asset.chunkNames || [],
    }))
    
    const totalSize = assets.reduce((sum: number, asset: any) => sum + asset.size, 0)
    
    const warnings: string[] = []
    
    // Check for large chunks
    chunks.forEach((chunk: any) => {
      if (chunk.size > defaultBundleSizeLimits.maxChunkSize) {
        warnings.push(`Chunk '${chunk.name}' exceeds size limit (${Math.round(chunk.size / 1024)}KB)`)
      }
    })
    
    // Check for large assets
    assets.forEach((asset: any) => {
      if (asset.size > defaultBundleSizeLimits.maxAssetSize && /\.(js|css)$/.test(asset.name)) {
        warnings.push(`Asset '${asset.name}' exceeds size limit (${Math.round(asset.size / 1024)}KB)`)
      }
    })
    
    return {
      totalSize,
      chunks: chunks.sort((a: any, b: any) => b.size - a.size).slice(0, 10),
      assets: assets.sort((a: any, b: any) => b.size - a.size).slice(0, 10),
      warnings,
    }
  } catch (error) {
    console.error('Failed to generate bundle report:', error)
    throw error
  }
}

export default {
  configureBundleAnalyzer,
  configurePerformanceHints,
  configureChunkOptimization,
  generateBundleReport,
}