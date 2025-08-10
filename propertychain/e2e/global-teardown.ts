/**
 * Global Teardown for E2E Tests - PropertyChain
 * 
 * Cleanup after all E2E tests
 * Following UpdatedUIPlan.md Step 59 specifications and CLAUDE.md principles
 */

import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...')
  
  try {
    // Perform any cleanup here, such as:
    // - Removing test data
    // - Deleting test users
    // - Cleaning up test files
    // - Resetting database state
    
    // Example: Clean up test data
    // await cleanupTestData()
    
    // Calculate test duration
    const startTime = parseInt(process.env.TEST_START_TIME || '0')
    const duration = Date.now() - startTime
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    
    console.log(`⏱️  Total test duration: ${minutes}m ${seconds}s`)
    console.log('✅ Global teardown completed successfully')
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw in teardown to avoid masking test failures
  }
}

// Helper function to clean up test data
async function cleanupTestData() {
  console.log('Cleaning up test data...')
  
  // Example implementation:
  // const response = await fetch('/api/test/cleanup', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  
  // if (!response.ok) {
  //   console.error('Failed to clean up test data')
  // }
}

export default globalTeardown