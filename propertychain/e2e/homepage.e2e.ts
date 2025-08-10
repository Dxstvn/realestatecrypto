/**
 * Homepage E2E Tests - PropertyChain
 * 
 * End-to-end tests for the homepage
 * Following UpdatedUIPlan.md Step 59 specifications and CLAUDE.md principles
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the homepage correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/PropertyChain/)
    
    // Check main heading
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/PropertyChain|Real Estate/)
    
    // Check navigation is present
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    
    // Check footer is present
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('should navigate to properties page', async ({ page }) => {
    // Click on properties link
    await page.click('text=Properties')
    
    // Wait for navigation
    await page.waitForURL('**/properties')
    
    // Check we're on the properties page
    await expect(page).toHaveURL(/\/properties/)
    
    // Check properties page content
    const propertiesHeading = page.locator('h1:has-text("Properties")')
    await expect(propertiesHeading).toBeVisible()
  })

  test('should display hero section with CTA', async ({ page }) => {
    // Check hero section
    const heroSection = page.locator('[data-testid="hero-section"]').or(page.locator('section').first())
    await expect(heroSection).toBeVisible()
    
    // Check CTA buttons
    const ctaButton = page.locator('button:has-text("Get Started"), a:has-text("Get Started")').first()
    await expect(ctaButton).toBeVisible()
    
    // Click CTA and verify navigation
    await ctaButton.click()
    // Should navigate to signup or properties
    await expect(page).toHaveURL(/(signup|properties|auth)/)
  })

  test('should display featured properties', async ({ page }) => {
    // Look for featured properties section
    const featuredSection = page.locator('text=/Featured Properties|Popular Properties/i')
    
    if (await featuredSection.isVisible()) {
      // Check if property cards are displayed
      const propertyCards = page.locator('[data-testid="property-card"]').or(
        page.locator('article').filter({ hasText: /\$/ })
      )
      
      const count = await propertyCards.count()
      expect(count).toBeGreaterThan(0)
      
      // Check first property card has essential elements
      if (count > 0) {
        const firstCard = propertyCards.first()
        
        // Should have an image
        const image = firstCard.locator('img')
        await expect(image).toBeVisible()
        
        // Should have a price
        const price = firstCard.locator('text=/\\$[0-9,]+/')
        await expect(price).toBeVisible()
      }
    }
  })

  test('should have responsive navigation menu', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile menu should have hamburger button
      const menuButton = page.locator('[aria-label*="menu"], button:has-text("Menu"), [data-testid="mobile-menu"]')
      await expect(menuButton).toBeVisible()
      
      // Click to open mobile menu
      await menuButton.click()
      
      // Menu items should be visible
      await expect(page.locator('text=Properties')).toBeVisible()
      await expect(page.locator('text=Marketplace')).toBeVisible()
    } else {
      // Desktop menu items should be visible
      const nav = page.locator('nav')
      await expect(nav.locator('text=Properties')).toBeVisible()
      await expect(nav.locator('text=Marketplace')).toBeVisible()
    }
  })

  test('should handle dark mode toggle', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"], button:has-text("Theme"), [data-testid="theme-toggle"]')
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      })
      
      // Click theme toggle
      await themeToggle.click()
      
      // Wait for theme change
      await page.waitForTimeout(500)
      
      // Check theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      })
      
      expect(newTheme).not.toBe(initialTheme)
    }
  })

  test('should load page performance metrics', async ({ page }) => {
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      }
    })
    
    // Check performance thresholds
    expect(metrics.domInteractive).toBeLessThan(3000) // DOM interactive in less than 3s
    expect(metrics.loadComplete).toBeLessThan(5000) // Page load in less than 5s
  })

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    expect(metaDescription?.length).toBeGreaterThan(50)
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
    
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    expect(ogDescription).toBeTruthy()
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toBeTruthy()
  })

  test('should handle newsletter subscription', async ({ page }) => {
    // Look for newsletter form
    const newsletterForm = page.locator('form').filter({ hasText: /newsletter|subscribe/i })
    
    if (await newsletterForm.isVisible()) {
      // Find email input
      const emailInput = newsletterForm.locator('input[type="email"]')
      await expect(emailInput).toBeVisible()
      
      // Enter email
      await emailInput.fill('test@example.com')
      
      // Submit form
      const submitButton = newsletterForm.locator('button[type="submit"]')
      await submitButton.click()
      
      // Check for success message or loading state
      await expect(page.locator('text=/thank you|subscribed|success/i')).toBeVisible({ timeout: 5000 })
    }
  })
})