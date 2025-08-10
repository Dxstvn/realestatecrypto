#!/usr/bin/env node

/**
 * Bundle Analysis Script - PropertyChain
 * 
 * Analyze and report on bundle sizes
 * Following UpdatedUIPlan.md Step 56 specifications and CLAUDE.md principles
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

// Configuration
const THRESHOLDS = {
  totalSize: 2 * 1024 * 1024, // 2MB total
  chunkSize: 500 * 1024, // 500KB per chunk
  firstLoad: 200 * 1024, // 200KB first load JS
  css: 100 * 1024, // 100KB CSS
}

// Colors
const colors = {
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.blue,
  dim: chalk.gray,
}

// Analyze bundle
async function analyzeBundle() {
  console.log(colors.info('\n📊 Starting Bundle Analysis...\n'))

  try {
    // Build the application with analysis
    console.log(colors.info('Building application with bundle analysis...'))
    execSync('ANALYZE=true npm run build', { 
      stdio: 'inherit',
      env: { ...process.env, ANALYZE: 'true' }
    })

    // Read build output
    const buildManifest = path.join(process.cwd(), '.next', 'build-manifest.json')
    const pagesManifest = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json')
    
    if (!fs.existsSync(buildManifest)) {
      throw new Error('Build manifest not found. Make sure the build completed successfully.')
    }

    const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'))
    
    // Analyze pages
    console.log(colors.info('\n📄 Page Bundle Sizes:\n'))
    analyzePages(manifest)

    // Analyze chunks
    console.log(colors.info('\n📦 Chunk Analysis:\n'))
    analyzeChunks()

    // Check against thresholds
    console.log(colors.info('\n✅ Threshold Checks:\n'))
    checkThresholds()

    // Generate report
    generateReport()

    console.log(colors.success('\n✨ Bundle analysis complete!\n'))
    console.log(colors.dim('View the interactive report at: .next/analyze/client.html\n'))

  } catch (error) {
    console.error(colors.error('\n❌ Bundle analysis failed:'), error.message)
    process.exit(1)
  }
}

// Analyze page bundles
function analyzePages(manifest) {
  const pages = Object.keys(manifest.pages || {})
  
  pages.forEach(page => {
    const assets = manifest.pages[page] || []
    const jsAssets = assets.filter(a => a.endsWith('.js'))
    const cssAssets = assets.filter(a => a.endsWith('.css'))
    
    console.log(colors.info(`  ${page}:`))
    console.log(colors.dim(`    JS files: ${jsAssets.length}`))
    console.log(colors.dim(`    CSS files: ${cssAssets.length}`))
  })
}

// Analyze chunks
function analyzeChunks() {
  const statsPath = path.join(process.cwd(), '.next', 'analyze', 'client-stats.json')
  
  if (!fs.existsSync(statsPath)) {
    console.log(colors.warning('  Stats file not found. Run with DETAILED_ANALYZE=true for detailed analysis.'))
    return
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'))
  const chunks = stats.chunks || []
  
  // Sort by size
  chunks.sort((a, b) => b.size - a.size)
  
  // Display top 10 chunks
  console.log(colors.info('  Top 10 Chunks by Size:\n'))
  chunks.slice(0, 10).forEach((chunk, index) => {
    const size = (chunk.size / 1024).toFixed(2)
    const modules = chunk.modules ? chunk.modules.length : 0
    const initial = chunk.initial ? '⚡' : '  '
    
    const sizeColor = chunk.size > THRESHOLDS.chunkSize ? colors.error : 
                      chunk.size > THRESHOLDS.chunkSize * 0.8 ? colors.warning : 
                      colors.success
    
    console.log(`    ${initial} ${index + 1}. ${chunk.names.join(', ')} - ${sizeColor(size + ' KB')} (${modules} modules)`)
  })

  // Summary
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
  const initialSize = chunks.filter(c => c.initial).reduce((sum, chunk) => sum + chunk.size, 0)
  
  console.log(colors.info('\n  Summary:'))
  console.log(`    Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`    Initial Load: ${(initialSize / 1024).toFixed(2)} KB`)
  console.log(`    Total Chunks: ${chunks.length}`)
  console.log(`    Initial Chunks: ${chunks.filter(c => c.initial).length}`)
}

// Check against thresholds
function checkThresholds() {
  const statsPath = path.join(process.cwd(), '.next', 'analyze', 'client-stats.json')
  
  if (!fs.existsSync(statsPath)) {
    console.log(colors.warning('  Cannot check thresholds without stats file.'))
    return
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'))
  const assets = stats.assets || []
  
  // Calculate totals
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0)
  const jsSize = assets
    .filter(a => a.name.endsWith('.js'))
    .reduce((sum, asset) => sum + asset.size, 0)
  const cssSize = assets
    .filter(a => a.name.endsWith('.css'))
    .reduce((sum, asset) => sum + asset.size, 0)
  
  // Check thresholds
  const checks = [
    {
      name: 'Total Bundle Size',
      current: totalSize,
      threshold: THRESHOLDS.totalSize,
      unit: 'MB',
      divisor: 1024 * 1024,
    },
    {
      name: 'JavaScript Size',
      current: jsSize,
      threshold: THRESHOLDS.totalSize * 0.7,
      unit: 'KB',
      divisor: 1024,
    },
    {
      name: 'CSS Size',
      current: cssSize,
      threshold: THRESHOLDS.css,
      unit: 'KB',
      divisor: 1024,
    },
  ]

  checks.forEach(check => {
    const current = (check.current / check.divisor).toFixed(2)
    const threshold = (check.threshold / check.divisor).toFixed(2)
    const percentage = ((check.current / check.threshold) * 100).toFixed(1)
    
    const status = check.current <= check.threshold
    const statusIcon = status ? '✅' : '❌'
    const statusColor = status ? colors.success : colors.error
    
    console.log(`  ${statusIcon} ${check.name}: ${statusColor(current + ' ' + check.unit)} / ${threshold} ${check.unit} (${percentage}%)`)
  })
}

// Generate detailed report
function generateReport() {
  const reportPath = path.join(process.cwd(), 'bundle-report.json')
  const statsPath = path.join(process.cwd(), '.next', 'analyze', 'client-stats.json')
  
  if (!fs.existsSync(statsPath)) {
    return
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'))
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalAssets: stats.assets.length,
      totalSize: stats.assets.reduce((sum, a) => sum + a.size, 0),
      totalChunks: stats.chunks.length,
      totalModules: stats.modules.length,
    },
    largestAssets: stats.assets
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)
      .map(asset => ({
        name: asset.name,
        size: asset.size,
        sizeReadable: (asset.size / 1024).toFixed(2) + ' KB',
      })),
    recommendations: generateRecommendations(stats),
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(colors.dim(`\n  Report saved to: ${reportPath}`))
}

// Generate recommendations
function generateRecommendations(stats) {
  const recommendations = []
  
  // Check for large modules
  const largeModules = stats.modules
    .filter(m => m.size > 100 * 1024)
    .sort((a, b) => b.size - a.size)
    .slice(0, 5)

  if (largeModules.length > 0) {
    recommendations.push({
      type: 'large-modules',
      severity: 'warning',
      message: 'Large modules detected',
      details: largeModules.map(m => ({
        name: m.name,
        size: (m.size / 1024).toFixed(2) + ' KB',
      })),
    })
  }

  // Check for duplicate modules
  const moduleNames = {}
  stats.modules.forEach(m => {
    const name = m.name.split('/').pop()
    if (!moduleNames[name]) {
      moduleNames[name] = []
    }
    moduleNames[name].push(m)
  })

  const duplicates = Object.entries(moduleNames)
    .filter(([name, modules]) => modules.length > 1)
    .slice(0, 5)

  if (duplicates.length > 0) {
    recommendations.push({
      type: 'duplicate-modules',
      severity: 'info',
      message: 'Potential duplicate modules',
      details: duplicates.map(([name, modules]) => ({
        name,
        count: modules.length,
        totalSize: (modules.reduce((sum, m) => sum + m.size, 0) / 1024).toFixed(2) + ' KB',
      })),
    })
  }

  // Check for optimization opportunities
  const unminifiedAssets = stats.assets.filter(a => 
    !a.name.includes('.min.') && 
    (a.name.endsWith('.js') || a.name.endsWith('.css'))
  )

  if (unminifiedAssets.length > 0) {
    recommendations.push({
      type: 'unminified-assets',
      severity: 'warning',
      message: 'Unminified assets detected',
      count: unminifiedAssets.length,
    })
  }

  return recommendations
}

// Run analysis
analyzeBundle()