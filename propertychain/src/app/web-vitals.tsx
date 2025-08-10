/**
 * Web Vitals Client Component - PropertyChain
 * 
 * Client-side Web Vitals reporting
 * Following UpdatedUIPlan.md Step 56 specifications and CLAUDE.md principles
 */

'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/monitoring/web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals collection
    initWebVitals()
  }, [])

  return null
}

export default WebVitalsReporter