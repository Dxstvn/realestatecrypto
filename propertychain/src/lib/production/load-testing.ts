/**
 * Load Testing Configuration - PropertyChain
 * 
 * Performance and load testing utilities for production readiness
 * Following UpdatedUIPlan.md Step 70 specifications and CLAUDE.md principles
 */

import { performance } from 'perf_hooks'

/**
 * Load test configuration
 */
export interface LoadTestConfig {
  baseUrl: string
  duration: number // seconds
  users: number
  rampUp: number // seconds
  scenarios: LoadTestScenario[]
  thresholds: PerformanceThresholds
}

export interface LoadTestScenario {
  name: string
  weight: number // percentage
  steps: LoadTestStep[]
}

export interface LoadTestStep {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  headers?: Record<string, string>
  body?: any
  think?: number // milliseconds
  validation?: (response: any) => boolean
}

export interface PerformanceThresholds {
  responseTime: {
    p50: number
    p95: number
    p99: number
  }
  errorRate: number // percentage
  throughput: number // requests per second
}

export interface LoadTestResult {
  success: boolean
  duration: number
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  metrics: {
    responseTime: {
      min: number
      max: number
      mean: number
      median: number
      p95: number
      p99: number
    }
    throughput: number
    errorRate: number
    concurrency: number
  }
  errors: Array<{
    timestamp: number
    scenario: string
    step: string
    error: string
  }>
}

/**
 * Default load test configuration
 */
export const defaultLoadTestConfig: LoadTestConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  duration: 60, // 1 minute
  users: 10,
  rampUp: 10,
  scenarios: [
    {
      name: 'Browse Properties',
      weight: 40,
      steps: [
        { method: 'GET', path: '/', think: 2000 },
        { method: 'GET', path: '/properties', think: 3000 },
        { method: 'GET', path: '/properties/1', think: 5000 },
      ],
    },
    {
      name: 'User Authentication',
      weight: 20,
      steps: [
        { method: 'GET', path: '/auth/login', think: 1000 },
        {
          method: 'POST',
          path: '/api/auth/login',
          body: { email: 'test@example.com', password: 'password' },
          think: 2000,
        },
        { method: 'GET', path: '/dashboard', think: 3000 },
      ],
    },
    {
      name: 'API Requests',
      weight: 40,
      steps: [
        { method: 'GET', path: '/api/properties', think: 1000 },
        { method: 'GET', path: '/api/properties/featured', think: 1000 },
        { method: 'GET', path: '/api/health', think: 500 },
      ],
    },
  ],
  thresholds: {
    responseTime: {
      p50: 500,
      p95: 2000,
      p99: 5000,
    },
    errorRate: 1, // 1%
    throughput: 100, // 100 req/s
  },
}

/**
 * K6 load test script generator
 */
export function generateK6Script(config: LoadTestConfig): string {
  const script = `
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '${config.rampUp}s', target: ${config.users} },
    { duration: '${config.duration - config.rampUp * 2}s', target: ${config.users} },
    { duration: '${config.rampUp}s', target: 0 },
  ],
  thresholds: {
    http_req_duration: [
      'p(50)<${config.thresholds.responseTime.p50}',
      'p(95)<${config.thresholds.responseTime.p95}',
      'p(99)<${config.thresholds.responseTime.p99}',
    ],
    errors: ['rate<${config.thresholds.errorRate / 100}'],
    http_reqs: ['rate>${config.thresholds.throughput}'],
  },
};

// Base URL
const BASE_URL = '${config.baseUrl}';

// Scenarios
${config.scenarios.map(scenario => `
function ${scenario.name.replace(/\s+/g, '_')}() {
  ${scenario.steps.map((step, index) => `
  // Step ${index + 1}: ${step.method} ${step.path}
  const res${index} = http.${step.method.toLowerCase()}(
    \`\${BASE_URL}${step.path}\`,
    ${step.body ? `JSON.stringify(${JSON.stringify(step.body)})` : 'null'},
    {
      headers: ${JSON.stringify(step.headers || { 'Content-Type': 'application/json' })},
    }
  );
  
  check(res${index}, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(res${index}.status !== 200);
  
  ${step.think ? `sleep(${step.think / 1000});` : ''}
  `).join('\n')}
}
`).join('\n')}

// Main test function
export default function () {
  const scenarios = [
    ${config.scenarios.map(s => `{ fn: ${s.name.replace(/\s+/g, '_')}, weight: ${s.weight} }`).join(',\n    ')}
  ];
  
  // Select scenario based on weight
  const random = Math.random() * 100;
  let accumulated = 0;
  
  for (const scenario of scenarios) {
    accumulated += scenario.weight;
    if (random <= accumulated) {
      scenario.fn();
      break;
    }
  }
}

// Setup function
export function setup() {
  console.log('Starting load test...');
  console.log('Base URL:', BASE_URL);
  console.log('Virtual Users:', ${config.users});
  console.log('Duration:', ${config.duration}, 'seconds');
  
  // Warm up request
  const warmup = http.get(\`\${BASE_URL}/api/health\`);
  check(warmup, { 'Warmup successful': (r) => r.status === 200 });
  
  return { startTime: Date.now() };
}

// Teardown function
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log('Load test completed in', duration, 'seconds');
}
`

  return script
}

/**
 * Artillery load test configuration generator
 */
export function generateArtilleryConfig(config: LoadTestConfig): object {
  return {
    config: {
      target: config.baseUrl,
      phases: [
        {
          duration: config.rampUp,
          arrivalRate: 1,
          rampTo: config.users,
        },
        {
          duration: config.duration - config.rampUp * 2,
          arrivalRate: config.users,
        },
        {
          duration: config.rampUp,
          arrivalRate: config.users,
          rampTo: 1,
        },
      ],
      ensure: {
        p95: config.thresholds.responseTime.p95,
        p99: config.thresholds.responseTime.p99,
        maxErrorRate: config.thresholds.errorRate,
      },
    },
    scenarios: config.scenarios.map(scenario => ({
      name: scenario.name,
      weight: scenario.weight,
      flow: scenario.steps.map(step => {
        const action: any = {
          [step.method.toLowerCase()]: {
            url: step.path,
            headers: step.headers,
          },
        }
        
        if (step.body) {
          action[step.method.toLowerCase()].json = step.body
        }
        
        if (step.think) {
          action.think = step.think / 1000
        }
        
        return action
      }),
    })),
  }
}

/**
 * Locust load test script generator
 */
export function generateLocustScript(config: LoadTestConfig): string {
  const script = `
from locust import HttpUser, task, between
import random

class PropertyChainUser(HttpUser):
    wait_time = between(1, 3)
    host = "${config.baseUrl}"
    
    def on_start(self):
        """Called when a user starts"""
        pass
    
    def on_stop(self):
        """Called when a user stops"""
        pass
    
${config.scenarios.map(scenario => `
    @task(${scenario.weight})
    def ${scenario.name.replace(/\s+/g, '_').toLowerCase()}(self):
        """${scenario.name}"""
${scenario.steps.map(step => `
        # ${step.method} ${step.path}
        ${step.method === 'GET' ? 
          `self.client.get("${step.path}", headers=${JSON.stringify(step.headers || {})})` :
          `self.client.${step.method.toLowerCase()}("${step.path}", json=${JSON.stringify(step.body || {})}, headers=${JSON.stringify(step.headers || {})})`
        }
        ${step.think ? `self.wait_time = between(${step.think / 1000}, ${step.think / 1000 + 1})` : ''}
`).join('')}
`).join('\n')}
`

  return script
}

/**
 * Simple Node.js load tester
 */
export class SimpleLoadTester {
  private config: LoadTestConfig
  private results: LoadTestResult
  private responseTimes: number[] = []
  private errors: LoadTestResult['errors'] = []
  private startTime: number = 0
  private activeUsers: number = 0
  
  constructor(config: LoadTestConfig) {
    this.config = config
    this.results = this.initializeResults()
  }
  
  private initializeResults(): LoadTestResult {
    return {
      success: false,
      duration: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      metrics: {
        responseTime: {
          min: Infinity,
          max: 0,
          mean: 0,
          median: 0,
          p95: 0,
          p99: 0,
        },
        throughput: 0,
        errorRate: 0,
        concurrency: 0,
      },
      errors: [],
    }
  }
  
  /**
   * Run load test
   */
  async run(): Promise<LoadTestResult> {
    console.log('🚀 Starting load test...')
    console.log(`   URL: ${this.config.baseUrl}`)
    console.log(`   Duration: ${this.config.duration}s`)
    console.log(`   Users: ${this.config.users}`)
    
    this.startTime = Date.now()
    const endTime = this.startTime + this.config.duration * 1000
    
    // Ramp up users
    const userPromises: Promise<void>[] = []
    const rampUpInterval = (this.config.rampUp * 1000) / this.config.users
    
    for (let i = 0; i < this.config.users; i++) {
      userPromises.push(this.runUser(i, endTime))
      await this.sleep(rampUpInterval)
    }
    
    // Wait for all users to complete
    await Promise.all(userPromises)
    
    // Calculate final metrics
    this.calculateMetrics()
    
    // Check thresholds
    this.checkThresholds()
    
    console.log('✅ Load test completed')
    
    return this.results
  }
  
  /**
   * Run a single user session
   */
  private async runUser(userId: number, endTime: number): Promise<void> {
    this.activeUsers++
    
    while (Date.now() < endTime) {
      // Select scenario based on weight
      const scenario = this.selectScenario()
      
      // Execute scenario steps
      for (const step of scenario.steps) {
        if (Date.now() >= endTime) break
        
        const startTime = performance.now()
        
        try {
          // Simulate HTTP request (replace with actual fetch in real implementation)
          await this.executeStep(step)
          
          const responseTime = performance.now() - startTime
          this.responseTimes.push(responseTime)
          this.results.successfulRequests++
          
          // Update min/max
          this.results.metrics.responseTime.min = Math.min(
            this.results.metrics.responseTime.min,
            responseTime
          )
          this.results.metrics.responseTime.max = Math.max(
            this.results.metrics.responseTime.max,
            responseTime
          )
        } catch (error) {
          this.results.failedRequests++
          this.errors.push({
            timestamp: Date.now(),
            scenario: scenario.name,
            step: `${step.method} ${step.path}`,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
        
        this.results.totalRequests++
        
        // Think time
        if (step.think) {
          await this.sleep(step.think)
        }
      }
    }
    
    this.activeUsers--
  }
  
  /**
   * Select scenario based on weight
   */
  private selectScenario(): LoadTestScenario {
    const random = Math.random() * 100
    let accumulated = 0
    
    for (const scenario of this.config.scenarios) {
      accumulated += scenario.weight
      if (random <= accumulated) {
        return scenario
      }
    }
    
    return this.config.scenarios[0]
  }
  
  /**
   * Execute a test step
   */
  private async executeStep(step: LoadTestStep): Promise<void> {
    // In a real implementation, this would make actual HTTP requests
    // For now, simulate with random delay
    const delay = Math.random() * 500 + 100
    await this.sleep(delay)
    
    // Randomly fail some requests for testing
    if (Math.random() < 0.01) {
      throw new Error('Simulated request failure')
    }
  }
  
  /**
   * Calculate final metrics
   */
  private calculateMetrics(): void {
    const duration = (Date.now() - this.startTime) / 1000
    
    this.results.duration = duration
    this.results.errors = this.errors
    
    if (this.responseTimes.length > 0) {
      // Sort response times for percentile calculation
      const sorted = [...this.responseTimes].sort((a, b) => a - b)
      
      // Calculate mean
      const sum = sorted.reduce((a, b) => a + b, 0)
      this.results.metrics.responseTime.mean = sum / sorted.length
      
      // Calculate median
      const mid = Math.floor(sorted.length / 2)
      this.results.metrics.responseTime.median = sorted[mid]
      
      // Calculate percentiles
      const p95Index = Math.floor(sorted.length * 0.95)
      const p99Index = Math.floor(sorted.length * 0.99)
      this.results.metrics.responseTime.p95 = sorted[p95Index]
      this.results.metrics.responseTime.p99 = sorted[p99Index]
    }
    
    // Calculate throughput
    this.results.metrics.throughput = this.results.totalRequests / duration
    
    // Calculate error rate
    this.results.metrics.errorRate = 
      (this.results.failedRequests / this.results.totalRequests) * 100
    
    // Max concurrency
    this.results.metrics.concurrency = this.config.users
  }
  
  /**
   * Check if results meet thresholds
   */
  private checkThresholds(): void {
    const metrics = this.results.metrics
    const thresholds = this.config.thresholds
    
    this.results.success = 
      metrics.responseTime.median <= thresholds.responseTime.p50 &&
      metrics.responseTime.p95 <= thresholds.responseTime.p95 &&
      metrics.responseTime.p99 <= thresholds.responseTime.p99 &&
      metrics.errorRate <= thresholds.errorRate &&
      metrics.throughput >= thresholds.throughput
  }
  
  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Generate load test report
 */
export function generateLoadTestReport(result: LoadTestResult): string {
  const report: string[] = [
    '# Load Test Report',
    '',
    `**Status:** ${result.success ? '✅ PASSED' : '❌ FAILED'}`,
    `**Duration:** ${result.duration.toFixed(2)} seconds`,
    `**Total Requests:** ${result.totalRequests}`,
    `**Successful Requests:** ${result.successfulRequests}`,
    `**Failed Requests:** ${result.failedRequests}`,
    '',
    '## Performance Metrics',
    '',
    '### Response Time (ms)',
    `- **Min:** ${result.metrics.responseTime.min.toFixed(2)}`,
    `- **Max:** ${result.metrics.responseTime.max.toFixed(2)}`,
    `- **Mean:** ${result.metrics.responseTime.mean.toFixed(2)}`,
    `- **Median:** ${result.metrics.responseTime.median.toFixed(2)}`,
    `- **P95:** ${result.metrics.responseTime.p95.toFixed(2)}`,
    `- **P99:** ${result.metrics.responseTime.p99.toFixed(2)}`,
    '',
    '### Throughput',
    `- **Requests/sec:** ${result.metrics.throughput.toFixed(2)}`,
    `- **Error Rate:** ${result.metrics.errorRate.toFixed(2)}%`,
    `- **Max Concurrency:** ${result.metrics.concurrency}`,
    '',
  ]
  
  if (result.errors.length > 0) {
    report.push('## Errors')
    report.push('')
    result.errors.slice(0, 10).forEach(error => {
      report.push(`- **[${new Date(error.timestamp).toISOString()}]** ${error.scenario} - ${error.step}: ${error.error}`)
    })
    if (result.errors.length > 10) {
      report.push(`- ... and ${result.errors.length - 10} more errors`)
    }
    report.push('')
  }
  
  return report.join('\n')
}

export default {
  SimpleLoadTester,
  generateK6Script,
  generateArtilleryConfig,
  generateLocustScript,
  generateLoadTestReport,
  defaultLoadTestConfig,
}