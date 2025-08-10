/**
 * Tree Shaking Configuration - PropertyChain
 * 
 * Dead code elimination and module optimization
 * Following UpdatedUIPlan.md Step 69 specifications and CLAUDE.md principles
 */

import type { Configuration } from 'webpack'

/**
 * Tree shaking configuration options
 */
export interface TreeShakingConfig {
  enableSideEffects: boolean
  optimizeExports: boolean
  concatenateModules: boolean
  innerGraph: boolean
  providedExports: boolean
  usedExports: boolean
}

/**
 * Default tree shaking configuration
 */
export const defaultTreeShakingConfig: TreeShakingConfig = {
  enableSideEffects: true,
  optimizeExports: true,
  concatenateModules: true,
  innerGraph: true,
  providedExports: true,
  usedExports: true,
}

/**
 * Configure webpack for optimal tree shaking
 */
export function configureTreeShaking(
  config: Configuration,
  options: Partial<TreeShakingConfig> = {}
): Configuration {
  const treeShakingConfig = { ...defaultTreeShakingConfig, ...options }
  
  if (!config.optimization) {
    config.optimization = {}
  }
  
  // Enable tree shaking optimizations
  config.optimization.sideEffects = treeShakingConfig.enableSideEffects
  config.optimization.usedExports = treeShakingConfig.usedExports
  config.optimization.providedExports = treeShakingConfig.providedExports
  config.optimization.concatenateModules = treeShakingConfig.concatenateModules
  config.optimization.innerGraph = treeShakingConfig.innerGraph
  
  // Production mode enables more aggressive tree shaking
  if (process.env.NODE_ENV === 'production') {
    config.mode = 'production'
    config.optimization.minimize = true
  }
  
  return config
}

/**
 * Package.json sideEffects configuration
 */
export const packageSideEffects = {
  // Mark specific files as having side effects
  files: [
    '*.css',
    '*.scss',
    '*.sass',
    '*.less',
    './src/styles/globals.css',
    './src/lib/polyfills.ts',
    './src/lib/monitoring/sentry.ts',
  ],
  
  // Mark specific packages as side-effect-free
  packages: {
    'lodash-es': false,
    'date-fns': false,
    'uuid': false,
    'zod': false,
    'class-variance-authority': false,
    'clsx': false,
  },
}

/**
 * Babel configuration for tree shaking
 */
export const babelTreeShakingConfig = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          modules: false, // Preserve ES modules for tree shaking
          targets: {
            esmodules: true,
          },
        },
      },
    ],
  ],
  plugins: [
    // Remove console logs in production
    process.env.NODE_ENV === 'production' && [
      'transform-remove-console',
      {
        exclude: ['error', 'warn'],
      },
    ],
    // Remove debug code in production
    process.env.NODE_ENV === 'production' && [
      'transform-define',
      {
        '__DEV__': false,
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    ],
    // Optimize lodash imports
    ['lodash', { id: ['lodash-es'] }],
    // Optimize date-fns imports
    ['date-fns', { id: ['date-fns'] }],
  ].filter(Boolean),
}

/**
 * ESLint configuration for tree shaking
 */
export const eslintTreeShakingRules = {
  'no-unused-vars': ['error', { 
    varsIgnorePattern: '^_',
    argsIgnorePattern: '^_',
  }],
  'no-unused-expressions': 'error',
  'no-dead-code': 'error',
  'tree-shaking/no-side-effects-in-initialization': 'error',
  'import/no-unused-modules': ['error', {
    unusedExports: true,
    missingExports: true,
    ignoreExports: [
      '**/*.d.ts',
      '**/*.stories.{js,jsx,ts,tsx}',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/pages/**',
      '**/app/**',
    ],
  }],
}

/**
 * Import optimization utilities
 */
export const importOptimization = {
  /**
   * Convert default imports to named imports for better tree shaking
   */
  convertToNamedImports: (code: string): string => {
    // Convert lodash imports
    code = code.replace(
      /import\s+(\w+)\s+from\s+['"]lodash['"]/g,
      "import { $1 } from 'lodash-es'"
    )
    
    // Convert date-fns imports
    code = code.replace(
      /import\s+(\w+)\s+from\s+['"]date-fns['"]/g,
      "import { $1 } from 'date-fns'"
    )
    
    return code
  },
  
  /**
   * Remove unused imports
   */
  removeUnusedImports: (code: string, usedIdentifiers: Set<string>): string => {
    const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"][^'"]+['"]/g
    
    return code.replace(importRegex, (match, namedImports, defaultImport) => {
      if (defaultImport && !usedIdentifiers.has(defaultImport)) {
        return '' // Remove unused default import
      }
      
      if (namedImports) {
        const imports = namedImports.split(',').map((i: string) => i.trim())
        const usedImports = imports.filter((imp: string) => {
          const [name] = imp.split(' as ')
          return usedIdentifiers.has(name.trim())
        })
        
        if (usedImports.length === 0) {
          return '' // Remove import statement if no imports are used
        }
        
        if (usedImports.length < imports.length) {
          // Update import with only used imports
          return match.replace(namedImports, usedImports.join(', '))
        }
      }
      
      return match
    })
  },
}

/**
 * Module federation configuration for micro-frontends
 */
export const moduleFederationConfig = {
  name: 'propertychain',
  filename: 'remoteEntry.js',
  exposes: {
    './PropertyList': './src/components/properties/property-list',
    './PropertyCard': './src/components/properties/property-card',
    './WalletConnect': './src/components/web3/wallet-connect',
    './TransactionFlow': './src/components/web3/transaction-flow',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    'next': { singleton: true, requiredVersion: '^14.0.0' },
    'ethers': { singleton: true, requiredVersion: '^6.0.0' },
    'wagmi': { singleton: true, requiredVersion: '^2.0.0' },
  },
}

/**
 * Analyze module for tree shaking opportunities
 */
export async function analyzeModuleForTreeShaking(
  modulePath: string
): Promise<{
  exports: string[]
  imports: string[]
  sideEffects: boolean
  unusedExports: string[]
  suggestions: string[]
}> {
  const fs = await import('fs/promises')
  const code = await fs.readFile(modulePath, 'utf-8')
  
  // Extract exports
  const exportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g
  const namedExportRegex = /export\s+{([^}]+)}/g
  const defaultExportRegex = /export\s+default\s+/g
  
  const exports: string[] = []
  let match
  
  while ((match = exportRegex.exec(code)) !== null) {
    exports.push(match[1])
  }
  
  while ((match = namedExportRegex.exec(code)) !== null) {
    const namedExports = match[1].split(',').map(e => e.trim().split(' as ')[0])
    exports.push(...namedExports)
  }
  
  if (defaultExportRegex.test(code)) {
    exports.push('default')
  }
  
  // Extract imports
  const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
  const imports: string[] = []
  
  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[3])
  }
  
  // Check for side effects
  const sideEffectPatterns = [
    /console\./,
    /document\./,
    /window\./,
    /global\./,
    /process\.env/,
    /require\(/,
    /eval\(/,
    /Function\(/,
  ]
  
  const hasSideEffects = sideEffectPatterns.some(pattern => pattern.test(code))
  
  // Analyze unused exports (simplified - would need full project analysis)
  const unusedExports: string[] = []
  const suggestions: string[] = []
  
  if (hasSideEffects) {
    suggestions.push('Module contains side effects that may prevent tree shaking')
  }
  
  if (exports.includes('default') && exports.length > 1) {
    suggestions.push('Consider using only named exports for better tree shaking')
  }
  
  if (imports.some(imp => imp.includes('lodash') && !imp.includes('lodash-es'))) {
    suggestions.push('Use lodash-es instead of lodash for better tree shaking')
  }
  
  return {
    exports,
    imports,
    sideEffects: hasSideEffects,
    unusedExports,
    suggestions,
  }
}

/**
 * Generate tree shaking report
 */
export async function generateTreeShakingReport(
  srcDir: string = './src'
): Promise<{
  totalModules: number
  modulesWithSideEffects: number
  totalExports: number
  potentialSavings: string[]
  recommendations: string[]
}> {
  const glob = await import('glob')
  const path = await import('path')
  
  const files = await glob.glob(`${srcDir}/**/*.{ts,tsx,js,jsx}`, {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/*.d.ts'],
  })
  
  let totalExports = 0
  let modulesWithSideEffects = 0
  const potentialSavings: string[] = []
  const recommendations = new Set<string>()
  
  for (const file of files) {
    const analysis = await analyzeModuleForTreeShaking(file)
    
    totalExports += analysis.exports.length
    
    if (analysis.sideEffects) {
      modulesWithSideEffects++
      potentialSavings.push(path.relative(process.cwd(), file))
    }
    
    analysis.suggestions.forEach(s => recommendations.add(s))
  }
  
  return {
    totalModules: files.length,
    modulesWithSideEffects,
    totalExports,
    potentialSavings: potentialSavings.slice(0, 10), // Top 10
    recommendations: Array.from(recommendations),
  }
}

export default {
  configureTreeShaking,
  packageSideEffects,
  babelTreeShakingConfig,
  eslintTreeShakingRules,
  importOptimization,
  moduleFederationConfig,
  analyzeModuleForTreeShaking,
  generateTreeShakingReport,
}