/**
 * Next.js Bundle Analyzer Configuration - PropertyChain
 * 
 * Bundle size analysis and optimization
 * Following UpdatedUIPlan.md Step 56 specifications and CLAUDE.md principles
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

// Import base config
const baseConfig = require('./next.config.js')

// Webpack configuration for bundle analysis
const webpackConfig = (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  // Call base webpack config if it exists
  if (baseConfig.webpack) {
    config = baseConfig.webpack(config, { buildId, dev, isServer, defaultLoaders, webpack })
  }

  // Bundle analyzer specific configurations
  if (process.env.ANALYZE === 'true') {
    // Add bundle analyzer plugin (handled by withBundleAnalyzer)
    console.log('📊 Bundle analyzer enabled - will open after build completes')
  }

  // Production optimizations
  if (!dev && !isServer) {
    // Replace react with preact in production for smaller bundle
    if (process.env.USE_PREACT === 'true') {
      Object.assign(config.resolve.alias, {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime'
      })
    }

    // Optimize moment.js
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    )

    // Module concatenation
    config.optimization.concatenateModules = true

    // Tree shaking
    config.optimization.usedExports = true
    config.optimization.sideEffects = false

    // Split chunks configuration
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Vendor chunks
        framework: {
          name: 'framework',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true,
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 20,
        },
        lib: {
          test(module) {
            return module.size() > 160000 &&
              /node_modules[/\\]/.test(module.identifier())
          },
          name(module) {
            const hash = crypto.createHash('sha1')
            hash.update(module.identifier())
            return hash.digest('hex').substring(0, 8)
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        // Split large libraries
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          priority: 20,
          enforce: true,
        },
        polyfills: {
          test: /[\\/]node_modules[\\/]core-js[\\/]/,
          name: 'polyfills',
          priority: 20,
          enforce: true,
        },
        // Async chunks
        async: {
          chunks: 'async',
          priority: 10,
          minSize: 20000,
          reuseExistingChunk: true,
        },
      },
      maxAsyncRequests: 30,
      maxInitialRequests: 25,
      minSize: 20000,
    }

    // Minimize configuration
    config.optimization.minimize = true
    
    // Runtime chunk
    config.optimization.runtimeChunk = {
      name: 'runtime',
    }
  }

  // Add webpack bundle analyzer for detailed analysis
  if (process.env.DETAILED_ANALYZE === 'true') {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: isServer
          ? '../analyze/server.html'
          : './analyze/client.html',
        generateStatsFile: true,
        statsFilename: isServer
          ? '../analyze/server-stats.json'
          : './analyze/client-stats.json',
        openAnalyzer: false,
        logLevel: 'info',
        defaultSizes: 'gzip',
        statsOptions: {
          source: false,
          reasons: true,
          chunks: true,
          chunkModules: true,
          chunkOrigins: true,
          depth: true,
          entrypoints: true,
          children: true,
          optimizationBailout: true,
          providedExports: true,
          usedExports: true,
          modules: true,
          excludeModules: false,
          maxModules: Infinity,
          errors: true,
          warnings: true,
          publicPath: true,
          performance: true,
        },
      })
    )
  }

  // Bundle size logging
  if (!dev) {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          const stats = compilation.getStats().toJson({
            all: false,
            assets: true,
            cachedAssets: true,
          })

          console.log('\n📦 Bundle Size Report:')
          console.log('=' * 50)
          
          const assets = stats.assets
            .filter(asset => !asset.name.includes('.map'))
            .sort((a, b) => b.size - a.size)
            .slice(0, 10)

          assets.forEach(asset => {
            const size = (asset.size / 1024).toFixed(2)
            const gzipSize = asset.gzipSize ? ` (${(asset.gzipSize / 1024).toFixed(2)} KB gzipped)` : ''
            console.log(`  ${asset.name}: ${size} KB${gzipSize}`)
          })

          const totalSize = stats.assets
            .filter(asset => !asset.name.includes('.map'))
            .reduce((sum, asset) => sum + asset.size, 0)

          console.log('=' * 50)
          console.log(`Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`)
        })
      },
    })
  }

  return config
}

// Merge with base config and wrap with bundle analyzer
module.exports = withBundleAnalyzer({
  ...baseConfig,
  webpack: webpackConfig,
  
  // Additional performance configurations
  compress: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Optimize CSS
  optimizeCss: {
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    },
  },
  
  // Experimental features for better performance
  experimental: {
    ...baseConfig.experimental,
    optimizeCss: true,
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    newNextLinkBehavior: true,
    images: {
      allowFutureImage: true,
    },
  },
});