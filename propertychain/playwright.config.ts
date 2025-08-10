/**
 * Playwright Configuration - PropertyChain
 * 
 * E2E testing configuration
 * Following UpdatedUIPlan.md Step 59 specifications and CLAUDE.md principles
 */

import { defineConfig, devices } from '@playwright/test'

// Read from environment variables
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'
const isCI = !!process.env.CI

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Test match pattern
  testMatch: /.*\.e2e\.ts/,
  
  // Timeout for each test
  timeout: 30 * 1000,
  
  // Timeout for each assertion
  expect: {
    timeout: 5000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: isCI,
  
  // Retry failed tests
  retries: isCI ? 2 : 0,
  
  // Number of workers
  workers: isCI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  
  // Global setup
  globalSetup: './e2e/global-setup.ts',
  
  // Global teardown
  globalTeardown: './e2e/global-teardown.ts',
  
  // Shared settings for all projects
  use: {
    // Base URL
    baseURL,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Video recording
    video: 'retain-on-failure',
    
    // Screenshot
    screenshot: 'only-on-failure',
    
    // Action timeout
    actionTimeout: 15 * 1000,
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
    
    // Viewport
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Accept downloads
    acceptDownloads: true,
    
    // Locale
    locale: 'en-US',
    
    // Timezone
    timezoneId: 'America/New_York',
    
    // Permissions
    permissions: ['geolocation', 'notifications'],
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    // Branded browsers
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  
  // Run your local dev server before starting the tests
  webServer: isCI
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120 * 1000,
      },
  
  // Output folder for test artifacts
  outputDir: 'test-results/',
})