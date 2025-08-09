"use client"

import { 
  Display,
  H1, H2, H3, H4, H5, H6,
  Text,
  FinancialValue,
  Code,
  Strong,
  Em,
  Small
} from "@/components/ui/typography"

export default function TestTypographyPage() {
  return (
    <div className="container mx-auto p-8 space-y-12 max-w-6xl">
      {/* Page Header */}
      <div className="space-y-2">
        <H1>Typography System Test</H1>
        <Text size="body-lg" color="muted">
          Demonstrating all typography components with Section 0 compliance
        </Text>
      </div>

      {/* Display Components */}
      <section className="space-y-6">
        <H2>Display Components</H2>
        <div className="space-y-4">
          <Display size="large" gradient>
            Display Large with Gradient
          </Display>
          <Display>
            Display Default (48px)
          </Display>
        </div>
      </section>

      {/* Heading Hierarchy */}
      <section className="space-y-6">
        <H2>Heading Hierarchy</H2>
        <div className="space-y-4">
          <H1>Heading 1 - 36px/44px/-0.03em/700</H1>
          <H2>Heading 2 - 30px/38px/-0.02em/700</H2>
          <H3>Heading 3 - 24px/32px/-0.02em/600</H3>
          <H4>Heading 4 - 20px/30px/-0.01em/600</H4>
          <H5>Heading 5 - 18px/28px/0/600</H5>
          <H6>Heading 6 - 16px/24px/0/600</H6>
        </div>
      </section>

      {/* Visual Hierarchy Ratios */}
      <section className="space-y-6">
        <H2>Visual Hierarchy Ratios (Section 0.2)</H2>
        <div className="space-y-4 border-l-4 border-primary pl-4">
          <div>
            <H1 className="mb-0">H1: 36px</H1>
            <Text color="muted" size="body-sm">↓ 1.2x ratio</Text>
            <H2 className="mb-0 mt-2">H2: 30px</H2>
            <Text color="muted" size="body-sm">↓ 1.25x ratio</Text>
            <H3 className="mb-0 mt-2">H3: 24px</H3>
          </div>
        </div>
      </section>

      {/* Body Text Variations */}
      <section className="space-y-6">
        <H2>Body Text Variations</H2>
        <div className="space-y-4">
          <Text size="body-lg">
            Body Large (18px/28px) - Perfect for introductory paragraphs and emphasis text that needs to stand out without being a heading.
          </Text>
          <Text>
            Body Default (16px/24px) - The standard body text size used throughout the application for optimal readability across all devices.
          </Text>
          <Text size="body-sm">
            Body Small (14px/20px) - Used for secondary information, captions, and supporting text that shouldn&apos;t compete with primary content.
          </Text>
          <Text size="caption">
            Caption (12px/16px) - Reserved for timestamps, metadata, and auxiliary information.
          </Text>
          <Text size="overline">
            Overline Text - Used for labels and categories
          </Text>
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-6">
        <H2>Text Color Variations</H2>
        <div className="space-y-2">
          <Text color="default">Default text color for primary content</Text>
          <Text color="muted">Muted text for secondary information</Text>
          <Text color="subtle">Subtle text for tertiary details</Text>
          <Text color="primary">Primary brand color text</Text>
          <Text color="success">Success state text for positive feedback</Text>
          <Text color="warning">Warning state text for cautions</Text>
          <Text color="destructive">Destructive text for errors or deletions</Text>
        </div>
      </section>

      {/* Financial Values */}
      <section className="space-y-6">
        <H2>Financial Data Components</H2>
        
        <div className="space-y-6">
          {/* Property Values */}
          <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-4">
            <H3>Property Investment Metrics</H3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Text size="caption" color="muted">Property Value</Text>
                <FinancialValue 
                  size="large" 
                  value={2500000} 
                  prefix="$" 
                  decimals={0}
                />
              </div>
              <div>
                <Text size="caption" color="muted">Monthly Yield</Text>
                <FinancialValue 
                  size="medium" 
                  value={8.75} 
                  suffix="%" 
                  trend="positive"
                />
              </div>
              <div>
                <Text size="caption" color="muted">ROI</Text>
                <FinancialValue 
                  size="medium" 
                  value={12.3} 
                  suffix="%" 
                  trend="positive"
                  showTrend
                  trendValue={2.1}
                />
              </div>
              <div>
                <Text size="caption" color="muted">Token Price</Text>
                <FinancialValue 
                  size="small" 
                  value={100} 
                  prefix="$"
                  decimals={2}
                />
              </div>
            </div>
          </div>

          {/* Portfolio Performance */}
          <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-4">
            <H3>Portfolio Performance</H3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Text>Total Portfolio Value</Text>
                <FinancialValue size="large" value={1234567.89} prefix="$" />
              </div>
              <div className="flex justify-between items-center">
                <Text size="body-sm" color="muted">Today&apos;s Change</Text>
                <FinancialValue 
                  size="medium" 
                  value={12345.67} 
                  prefix="+" 
                  trend="positive"
                />
              </div>
              <div className="flex justify-between items-center">
                <Text size="body-sm" color="muted">Monthly Return</Text>
                <FinancialValue 
                  size="small" 
                  value={-2.34} 
                  suffix="%" 
                  trend="negative"
                />
              </div>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Property</th>
                  <th className="text-right py-2">Value</th>
                  <th className="text-right py-2">Change</th>
                  <th className="text-right py-2">Yield</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr className="border-b">
                  <td className="py-2">Downtown Tower A</td>
                  <td className="text-right">
                    <FinancialValue size="table" value={500000} prefix="$" decimals={0} />
                  </td>
                  <td className="text-right">
                    <FinancialValue size="micro" value={2.5} suffix="%" trend="positive" />
                  </td>
                  <td className="text-right">
                    <FinancialValue size="micro" value={7.8} suffix="%" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Suburban Complex B</td>
                  <td className="text-right">
                    <FinancialValue size="table" value={325000} prefix="$" decimals={0} />
                  </td>
                  <td className="text-right">
                    <FinancialValue size="micro" value={-1.2} suffix="%" trend="negative" />
                  </td>
                  <td className="text-right">
                    <FinancialValue size="micro" value={6.5} suffix="%" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Text Truncation (Progressive Disclosure) */}
      <section className="space-y-6">
        <H2>Progressive Disclosure with Truncation</H2>
        <div className="space-y-4 max-w-md">
          <H3 truncate>
            This is a very long heading that will be truncated with an ellipsis when it exceeds the container width
          </H3>
          <Text truncate={2}>
            This is a multi-line text that will be truncated after two lines. Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-6">
        <H2>Code & Monospace</H2>
        <div className="space-y-4">
          <Text>
            Inline code like <Code inline>const value = 100</Code> uses monospace font.
          </Text>
          <Code inline={false}>
{`// Multi-line code block
const calculateROI = (investment, returns) => {
  const roi = ((returns - investment) / investment) * 100;
  return roi.toFixed(2);
}`}
          </Code>
        </div>
      </section>

      {/* Semantic Elements */}
      <section className="space-y-6">
        <H2>Semantic Text Elements</H2>
        <Text>
          Use <Strong>strong text</Strong> for emphasis, <Em>italicized text</Em> for 
          subtle emphasis, and <Small>small text for fine print</Small>.
        </Text>
      </section>

      {/* Accessibility Notes */}
      <section className="space-y-6 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
        <H2>Section 0 Compliance Notes</H2>
        <div className="space-y-4">
          <div>
            <H4>✅ Clarity Over Cleverness</H4>
            <Text size="body-sm">Clear hierarchy with obvious purpose for each text style</Text>
          </div>
          <div>
            <H4>✅ Consistency</H4>
            <Text size="body-sm">Exact specifications from Section 1.2 implemented</Text>
          </div>
          <div>
            <H4>✅ Progressive Disclosure</H4>
            <Text size="body-sm">Truncation support for managing long content</Text>
          </div>
          <div>
            <H4>✅ Respect The Grid</H4>
            <Text size="body-sm">All line heights and margins on 8px/4px grid</Text>
          </div>
          <div>
            <H4>✅ Visual Hierarchy</H4>
            <Text size="body-sm">1.2x and 1.25x ratios between heading levels</Text>
          </div>
          <div>
            <H4>✅ Accessibility</H4>
            <Text size="body-sm">Semantic HTML tags, proper heading hierarchy, WCAG compliant colors</Text>
          </div>
        </div>
      </section>
    </div>
  )
}