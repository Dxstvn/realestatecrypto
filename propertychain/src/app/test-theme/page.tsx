"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { H1, H2, H3, Text, FinancialValue } from "@/components/ui/typography"
import { useTheme } from "@/components/providers/theme-provider"
import { Moon, Sun, Monitor } from "lucide-react"

export default function TestThemePage() {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark, isSystem, mounted } = useTheme()

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <H1>Theme System Test</H1>
        <Text size="body-lg" color="muted">
          Testing PropertyChain theme switching with exact color specifications
        </Text>
      </div>

      {/* Theme Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Controls</CardTitle>
          <CardDescription>
            Current theme: <strong>{theme}</strong> • Resolved: <strong>{resolvedTheme}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              leftIcon={<Sun className="h-4 w-4" />}
            >
              Light
            </Button>
            <Button 
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              leftIcon={<Moon className="h-4 w-4" />}
            >
              Dark
            </Button>
            <Button 
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
              leftIcon={<Monitor className="h-4 w-4" />}
            >
              System
            </Button>
          </div>
          
          <Button onClick={toggleTheme} variant="secondary">
            Toggle Theme
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Is Dark: {isDark ? 'Yes' : 'No'}</p>
            <p>Is System: {isSystem ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Color Demonstration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Light/Dark Backgrounds */}
        <Card>
          <CardHeader>
            <CardTitle>Background Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background border rounded-lg">
              <Text>Background</Text>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Text>Muted Background</Text>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <Text>Accent Background</Text>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <Text>Card Background</Text>
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Text Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Text color="default">Default text color</Text>
            <Text color="muted">Muted text color</Text>
            <Text color="subtle">Subtle text color</Text>
            <Text color="primary">Primary text color</Text>
            <Text color="success">Success text color</Text>
            <Text color="warning">Warning text color</Text>
            <Text color="destructive">Destructive text color</Text>
          </CardContent>
        </Card>
      </div>

      {/* Component Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Component Variants in Current Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Button Variants */}
          <div className="space-y-2">
            <H3>Button Variants</H3>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
            </div>
          </div>

          {/* Financial Values */}
          <div className="space-y-2">
            <H3>Financial Values</H3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Text size="caption" color="muted">Property Value</Text>
                <FinancialValue size="large" value={2500000} prefix="$" decimals={0} />
              </div>
              <div>
                <Text size="caption" color="muted">ROI</Text>
                <FinancialValue size="medium" value={12.3} suffix="%" trend="positive" />
              </div>
              <div>
                <Text size="caption" color="muted">Monthly Yield</Text>
                <FinancialValue size="small" value={8.75} suffix="%" />
              </div>
              <div>
                <Text size="caption" color="muted">Loss</Text>
                <FinancialValue size="small" value={-2.1} suffix="%" trend="negative" />
              </div>
            </div>
          </div>

          {/* Typography Hierarchy */}
          <div className="space-y-2">
            <H3>Typography Hierarchy</H3>
            <div className="space-y-1">
              <H1 className="mb-0">Heading 1</H1>
              <H2 className="mb-0">Heading 2</H2>
              <H3 className="mb-0">Heading 3</H3>
              <Text>Body text with proper contrast</Text>
              <Text color="muted">Muted body text</Text>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS Variables Display */}
      <Card>
        <CardHeader>
          <CardTitle>CSS Variables (Current Theme)</CardTitle>
          <CardDescription>
            Showing actual CSS variable values for debugging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>--background:</span>
                <span className="text-muted-foreground">hsl(var(--background))</span>
              </div>
              <div className="flex justify-between">
                <span>--foreground:</span>
                <span className="text-muted-foreground">hsl(var(--foreground))</span>
              </div>
              <div className="flex justify-between">
                <span>--primary:</span>
                <span className="text-primary">hsl(var(--primary))</span>
              </div>
              <div className="flex justify-between">
                <span>--muted:</span>
                <span className="text-muted-foreground">hsl(var(--muted))</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>--success:</span>
                <span className="text-success">hsl(var(--success))</span>
              </div>
              <div className="flex justify-between">
                <span>--destructive:</span>
                <span className="text-destructive">hsl(var(--destructive))</span>
              </div>
              <div className="flex justify-between">
                <span>--warning:</span>
                <span className="text-warning">hsl(var(--warning))</span>
              </div>
              <div className="flex justify-between">
                <span>--border:</span>
                <span className="text-muted-foreground">hsl(var(--border))</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}