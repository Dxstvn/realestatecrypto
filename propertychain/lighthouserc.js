/**
 * Lighthouse CI Configuration - PropertyChain
 * 
 * Performance monitoring and CI/CD integration
 * Following UpdatedUIPlan.md Step 56 specifications and CLAUDE.md principles
 */

module.exports = {
  ci: {
    collect: {
      // Static site settings
      staticDistDir: './out',
      
      // Or server settings for Next.js
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/properties',
        'http://localhost:3000/marketplace',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/property/sample',
      ],
      
      // Number of runs
      numberOfRuns: 3,
      
      // Chrome flags
      settings: {
        chromeFlags: '--no-sandbox',
        // Device emulation
        preset: 'desktop',
        // Throttling
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
        },
        // Categories to test
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
          'pwa'
        ],
      },
    },
    
    assert: {
      // Performance assertions
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.5 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 2000 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
        
        // Resource hints
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
        
        // JavaScript
        'no-unload-listeners': 'error',
        'no-document-write': 'error',
        'uses-passive-event-listeners': 'warn',
        
        // Images
        'uses-webp-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        
        // Caching
        'uses-long-cache-ttl': 'warn',
        'uses-http2': 'warn',
        
        // Security
        'is-on-https': 'error',
        'no-vulnerable-libraries': 'error',
        
        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'warn',
        'image-alt': 'error',
        'link-name': 'error',
        'meta-viewport': 'error',
        
        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        'font-size': 'warn',
        'tap-targets': 'warn',
        
        // Best practices
        'errors-in-console': 'warn',
        'no-document-write': 'error',
        'geolocation-on-start': 'error',
        'notification-on-start': 'error',
        'password-inputs-can-be-pasted-into': 'warn',
      },
      
      // Budget settings
      budgets: [
        {
          resourceSizes: [
            {
              resourceType: 'script',
              budget: 300, // 300KB
            },
            {
              resourceType: 'stylesheet',
              budget: 100, // 100KB
            },
            {
              resourceType: 'image',
              budget: 500, // 500KB
            },
            {
              resourceType: 'font',
              budget: 100, // 100KB
            },
            {
              resourceType: 'total',
              budget: 1500, // 1.5MB
            },
          ],
          resourceCounts: [
            {
              resourceType: 'third-party',
              budget: 10,
            },
          ],
        },
      ],
    },
    
    upload: {
      // Upload to temporary public storage
      target: 'temporary-public-storage',
      
      // Or upload to Lighthouse CI server
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.example.com',
      // token: process.env.LHCI_TOKEN,
      
      // GitHub status checks
      githubAppToken: process.env.GITHUB_APP_TOKEN,
      githubStatusContextSuffix: '/lighthouse',
    },
    
    // Server configuration
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lighthouse-ci.db',
      },
    },
  },
  
  // Custom Lighthouse config
  lighthouse: {
    config: {
      extends: 'lighthouse:default',
      settings: {
        // Skip certain audits in CI
        skipAudits: [
          'uses-http2', // May not be available in CI
          'offline-start-url', // PWA specific
          'works-offline', // PWA specific
        ],
        
        // Additional metrics
        extraHeaders: {
          'Accept-Encoding': 'gzip, deflate, br',
        },
        
        // Form factor
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        
        // Throttling for more realistic conditions
        throttlingMethod: 'simulate',
      },
      
      // Custom audits
      audits: [
        // Custom performance audits can be added here
      ],
      
      // Categories weights
      categories: {
        performance: {
          auditRefs: [
            { id: 'first-contentful-paint', weight: 10 },
            { id: 'largest-contentful-paint', weight: 25 },
            { id: 'total-blocking-time', weight: 30 },
            { id: 'cumulative-layout-shift', weight: 15 },
            { id: 'speed-index', weight: 10 },
            { id: 'interactive', weight: 10 },
          ],
        },
      },
    },
  },
};