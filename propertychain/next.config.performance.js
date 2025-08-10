/**
 * Performance-Optimized Next.js Configuration - PropertyChain
 * 
 * Enhanced configuration with all performance optimizations
 * Following UpdatedUIPlan.md Step 69 specifications and CLAUDE.md principles
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.propertychain.com wss://api.propertychain.com https://www.google-analytics.com https://sentry.io;
  media-src 'self' https:;
  object-src 'none';
  child-src 'self';
  frame-src 'self' https://www.youtube.com;
  worker-src 'self' blob:;
  form-action 'self';
  base-uri 'self';
  manifest-src 'self';
`

// Security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(self)'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    // React optimization
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-test']
    } : false,
    // Emotion optimization (if using emotion)
    emotion: {
      sourceMap: process.env.NODE_ENV !== 'production',
      autoLabel: 'dev-only',
      labelFormat: '[local]',
    },
  },

  // Module optimization
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@radix-ui/react-*': {
      transform: '@radix-ui/react-{{member}}',
    },
  },

  // Enhanced experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-*',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'date-fns',
      'lodash-es',
      'zod',
      'react-hook-form',
      '@hookform/resolvers',
      'swr',
      'axios',
      '@tanstack/react-query',
      'ethers',
      'wagmi',
      'viem',
      '@rainbow-me/rainbowkit',
    ],
    scrollRestoration: true,
    // Enable server components optimization
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    // Turbopack for faster builds (when stable)
    // turbo: {
    //   rules: {
    //     '*.svg': {
    //       loaders: ['@svgr/webpack'],
    //       as: '*.js',
    //     },
    //   },
    // },
  },

  // Enhanced Image Optimization Configuration
  images: {
    // Remote image patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'api.propertychain.com',
      },
      {
        protocol: 'https',
        hostname: 'images.propertychain.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.propertychain.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
    ],
    
    // Responsive breakpoints for srcset generation
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Sizes for next/image automatic srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    
    // Modern image formats with AVIF priority for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Cache TTL for optimized images (in seconds)
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 60 : 60,
    
    // Quality settings
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Unoptimized for development speed
    unoptimized: process.env.NODE_ENV === 'development' && process.env.OPTIMIZE_IMAGES !== 'true',
  },

  // Headers configuration
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Service Worker
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Static assets with long cache
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Fonts with long cache
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Images with moderate cache
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // JavaScript bundles with immutable cache
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Rewrites for API proxy (if needed)
  async rewrites() {
    return []
  },

  // Enhanced Webpack configuration for performance
  webpack: (config, { isServer, dev, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Enhanced optimization settings
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        minimize: true,
        concatenateModules: true,
        usedExports: true,
        sideEffects: false,
        providedExports: true,
        innerGraph: true,
        // Runtime chunk optimization
        runtimeChunk: {
          name: 'runtime',
        },
        // Advanced splitting strategy
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js core)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|next|styled-jsx)[\\/]/,
              priority: 50,
              enforce: true,
              reuseExistingChunk: true,
            },
            // UI libraries
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|lucide-react|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              chunks: 'all',
              priority: 40,
              reuseExistingChunk: true,
            },
            // Web3 libraries
            web3: {
              name: 'web3',
              test: /[\\/]node_modules[\\/](ethers|wagmi|viem|@rainbow-me|@walletconnect|@web3-react)[\\/]/,
              chunks: 'async',
              priority: 35,
              reuseExistingChunk: true,
            },
            // Data fetching libraries
            data: {
              name: 'data',
              test: /[\\/]node_modules[\\/](swr|axios|@tanstack[\\/]react-query)[\\/]/,
              chunks: 'async',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Form libraries
            forms: {
              name: 'forms',
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|yup|zod)[\\/]/,
              chunks: 'async',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Utility libraries
            utils: {
              name: 'utils',
              test: /[\\/]node_modules[\\/](lodash|date-fns|uuid|nanoid)[\\/]/,
              chunks: 'async',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunks
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            // Async common chunks
            asyncCommons: {
              name: 'async-commons',
              chunks: 'async',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      }

      // Performance hints
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000, // 500KB
        maxAssetSize: 256000, // 250KB
        assetFilter: (assetFilename) => {
          return /\.(js|css)$/.test(assetFilename)
        },
      }
    }

    // Add webpack plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        '__PERFORMANCE_MONITORING__': JSON.stringify(process.env.PERFORMANCE_MONITORING === 'true'),
        '__BUNDLE_ANALYZER__': JSON.stringify(process.env.ANALYZE === 'true'),
      })
    )

    // Ignore moment locales to reduce bundle size
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    )

    return config
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'PropertyChain',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_PERFORMANCE_MONITORING: process.env.PERFORMANCE_MONITORING || 'false',
  },

  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Output configuration
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  
  // Disable x-powered-by header
  poweredByHeader: false,

  // Generate build ID for caching
  generateBuildId: async () => {
    // Use git commit hash or timestamp
    return process.env.BUILD_ID || Date.now().toString()
  },
}

// Wrap with bundle analyzer if enabled
module.exports = withBundleAnalyzer(nextConfig)