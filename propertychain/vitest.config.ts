/**
 * Vitest Configuration - PropertyChain
 * 
 * Testing configuration for unit and integration tests
 * Following UpdatedUIPlan.md Step 59 specifications and CLAUDE.md principles
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()] as any,
  
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test APIs
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.*',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/dist',
        '**/out',
        '**/.next',
        '**/coverage',
        '**/public',
        'src/app/**/*.tsx', // Exclude Next.js app router pages
        'src/app/**/*.ts',
        '**/*.stories.tsx',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 80,
        statements: 80,
      },
    },
    
    // Test match patterns
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'out',
      'coverage',
      '**/*.stories.tsx',
    ],
    
    // Test timeout
    testTimeout: 10000,
    
    // Hook timeout
    hookTimeout: 10000,
    
    // Teardown timeout
    teardownTimeout: 10000,
    
    // CSS handling
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    
    // Pool options
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 4,
        minThreads: 1,
      },
    },
    
    // Watch mode
    watch: false,
    
    // Reporter
    reporters: ['default', 'html'],
    
    // Output file for HTML reporter
    outputFile: {
      html: './coverage/test-report.html',
    },
    
    // Mock reset
    mockReset: true,
    
    // Clear mocks
    clearMocks: true,
    
    // Restore mocks
    restoreMocks: true,
    
    // Bail
    bail: 0,
    
    // Retry
    retry: 0,
    
    // Silent
    silent: false,
    
    // Allow only
    allowOnly: false,
    
    // Dangling ops
    dangerouslyIgnoreUnhandledErrors: false,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
})