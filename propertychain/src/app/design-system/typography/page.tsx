/**
 * Typography Demo Page - PropertyLend
 * Phase 4.1: Content & Typography
 * 
 * Showcases the refined typography system
 */

'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Typography,
  Display,
  Heading,
  Text,
  Lead,
  Caption,
  Overline,
  GradientText,
  Code,
  Blockquote,
  List,
  OrderedList,
  Article,
  NumericDisplay,
} from '@/components/ui/typography-v2'
import {
  Type,
  FileText,
  Hash,
  DollarSign,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronRight,
} from 'lucide-react'

export default function TypographyPage() {
  const [selectedAlign, setSelectedAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left')
  const [showGrid, setShowGrid] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-400 bg-purple-500/10">
              <Type className="w-3 h-3 mr-1" />
              Phase 4.1: Typography System
            </Badge>
            <Display size="lg" gradient className="mb-4">
              Typography System
            </Display>
            <Lead className="max-w-3xl mx-auto text-gray-300">
              A refined type scale with consistent hierarchy, optimized for readability and visual impact
            </Lead>
          </div>
        </div>
      </section>

      {/* Type Scale */}
      <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <Heading variant="h2" className="mb-8">Type Scale</Heading>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Display Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Display</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption>display-lg · 72px/1.1/800</Caption>
                    <Typography variant="display-lg">Display Large</Typography>
                  </div>
                  <div>
                    <Caption>display · 60px/1.2/700</Caption>
                    <Typography variant="display">Display Default</Typography>
                  </div>
                </CardContent>
              </Card>

              {/* Heading Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Headings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption>h1 · 48px/1.2/700</Caption>
                    <Typography variant="h1">Heading 1</Typography>
                  </div>
                  <div>
                    <Caption>h2 · 36px/1.3/600</Caption>
                    <Typography variant="h2">Heading 2</Typography>
                  </div>
                  <div>
                    <Caption>h3 · 28px/1.4/600</Caption>
                    <Typography variant="h3">Heading 3</Typography>
                  </div>
                  <div>
                    <Caption>h4 · 24px/1.4/500</Caption>
                    <Typography variant="h4">Heading 4</Typography>
                  </div>
                  <div>
                    <Caption>h5 · 20px/1.5/500</Caption>
                    <Typography variant="h5">Heading 5</Typography>
                  </div>
                  <div>
                    <Caption>h6 · 18px/1.5/500</Caption>
                    <Typography variant="h6">Heading 6</Typography>
                  </div>
                </CardContent>
              </Card>

              {/* Body Text */}
              <Card>
                <CardHeader>
                  <CardTitle>Body Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption>body-lg · 18px/1.6/400</Caption>
                    <Text variant="body-lg">
                      Large body text for introductions and emphasis. PropertyLend connects stablecoin holders with real estate borrowers.
                    </Text>
                  </div>
                  <div>
                    <Caption>body · 16px/1.6/400</Caption>
                    <Text variant="body">
                      Regular body text for general content. Our platform offers senior and junior tranches with yields ranging from 8% to 30% APY.
                    </Text>
                  </div>
                  <div>
                    <Caption>body-sm · 14px/1.5/400</Caption>
                    <Text variant="body-sm">
                      Small body text for secondary information. All loans are backed by real estate collateral and undergo thorough due diligence.
                    </Text>
                  </div>
                </CardContent>
              </Card>

              {/* Special Text */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption>caption · 12px/1.4/400</Caption>
                    <Typography variant="caption">
                      Caption text for labels and metadata
                    </Typography>
                  </div>
                  <div>
                    <Caption>overline · 12px/1.4/600 · UPPERCASE</Caption>
                    <Typography variant="overline">
                      Overline Text
                    </Typography>
                  </div>
                  <div>
                    <Caption>gradient text</Caption>
                    <GradientText className="text-2xl font-bold">
                      Gradient Text Effect
                    </GradientText>
                  </div>
                  <div>
                    <Caption>inline code</Caption>
                    <Text>
                      Use <Code>const APY = 0.08</Code> for calculations
                    </Text>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Examples */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <Heading variant="h2" className="mb-8">Interactive Examples</Heading>
          
          <Tabs defaultValue="alignment" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="alignment">Alignment</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="weights">Weights</TabsTrigger>
              <TabsTrigger value="truncation">Truncation</TabsTrigger>
            </TabsList>

            <TabsContent value="alignment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Text Alignment</CardTitle>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant={selectedAlign === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAlign('left')}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedAlign === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAlign('center')}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedAlign === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAlign('right')}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedAlign === 'justify' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedAlign('justify')}
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Typography variant="h3" align={selectedAlign}>
                    Aligned Heading
                  </Typography>
                  <Typography variant="body" align={selectedAlign}>
                    PropertyLend is revolutionizing real estate financing by connecting stablecoin holders 
                    with property developers through blockchain technology. Our platform offers transparent, 
                    secure, and efficient lending pools with attractive yields backed by real estate collateral.
                  </Typography>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Typography variant="body-lg" color="default">
                    Default text color
                  </Typography>
                  <Typography variant="body-lg" color="muted">
                    Muted text color
                  </Typography>
                  <Typography variant="body-lg" color="subtle">
                    Subtle text color
                  </Typography>
                  <Typography variant="body-lg" color="primary">
                    Primary text color
                  </Typography>
                  <Typography variant="body-lg" color="success">
                    Success text color
                  </Typography>
                  <Typography variant="body-lg" color="warning">
                    Warning text color
                  </Typography>
                  <Typography variant="body-lg" color="error">
                    Error text color
                  </Typography>
                  <Typography variant="body-lg" gradient>
                    Gradient text color
                  </Typography>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Font Weights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Typography variant="body-lg" weight="thin">
                    Thin (100)
                  </Typography>
                  <Typography variant="body-lg" weight="extralight">
                    Extra Light (200)
                  </Typography>
                  <Typography variant="body-lg" weight="light">
                    Light (300)
                  </Typography>
                  <Typography variant="body-lg" weight="normal">
                    Normal (400)
                  </Typography>
                  <Typography variant="body-lg" weight="medium">
                    Medium (500)
                  </Typography>
                  <Typography variant="body-lg" weight="semibold">
                    Semibold (600)
                  </Typography>
                  <Typography variant="body-lg" weight="bold">
                    Bold (700)
                  </Typography>
                  <Typography variant="body-lg" weight="extrabold">
                    Extra Bold (800)
                  </Typography>
                  <Typography variant="body-lg" weight="black">
                    Black (900)
                  </Typography>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="truncation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Text Truncation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption>Single line truncation</Caption>
                    <Typography variant="body" truncate>
                      This is a very long text that will be truncated with an ellipsis when it exceeds the container width. PropertyLend offers innovative DeFi solutions for real estate financing.
                    </Typography>
                  </div>
                  <div>
                    <Caption>Two line clamp</Caption>
                    <Typography variant="body" truncate={2}>
                      This text will be clamped to two lines maximum. PropertyLend is revolutionizing real estate financing by connecting stablecoin holders with property developers through blockchain technology. Our platform offers transparent, secure, and efficient lending pools with attractive yields backed by real estate collateral.
                    </Typography>
                  </div>
                  <div>
                    <Caption>Three line clamp</Caption>
                    <Typography variant="body" truncate={3}>
                      This text will be clamped to three lines maximum. PropertyLend is revolutionizing real estate financing by connecting stablecoin holders with property developers through blockchain technology. Our platform offers transparent, secure, and efficient lending pools with attractive yields backed by real estate collateral. Senior tranches offer stable 8% APY while junior tranches can yield up to 30% APY.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Financial Display */}
      <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <Heading variant="h2" className="mb-8">Financial Display</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Caption>Total Value Locked</Caption>
                <NumericDisplay 
                  value={125847293} 
                  prefix="$" 
                  decimals={0}
                  size="lg"
                />
                <div className="mt-2">
                  <NumericDisplay 
                    value={12.5} 
                    prefix="+" 
                    suffix="%" 
                    trend="up"
                    size="sm"
                  />
                  <Caption className="ml-2">vs last month</Caption>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Caption>Average APY</Caption>
                <NumericDisplay 
                  value={14.75} 
                  suffix="%" 
                  decimals={2}
                  size="lg"
                />
                <div className="mt-2">
                  <NumericDisplay 
                    value={0.5} 
                    prefix="+" 
                    suffix="%" 
                    trend="up"
                    size="sm"
                  />
                  <Caption className="ml-2">increase</Caption>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Caption>Active Pools</Caption>
                <NumericDisplay 
                  value={42} 
                  decimals={0}
                  size="lg"
                />
                <div className="mt-2">
                  <NumericDisplay 
                    value={3} 
                    prefix="+" 
                    trend="up"
                    size="sm"
                    decimals={0}
                  />
                  <Caption className="ml-2">new this week</Caption>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Caption>Default Rate</Caption>
                <NumericDisplay 
                  value={0.02} 
                  suffix="%" 
                  decimals={2}
                  size="lg"
                  trend="neutral"
                />
                <div className="mt-2">
                  <NumericDisplay 
                    value={0.01} 
                    prefix="-" 
                    suffix="%" 
                    trend="down"
                    size="sm"
                  />
                  <Caption className="ml-2">improvement</Caption>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Long-form Content */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4 lg:px-12">
          <Heading variant="h2" className="mb-8">Article Typography</Heading>
          
          <Article>
            <h1>Understanding DeFi Bridge Lending</h1>
            <p className="lead">
              PropertyLend is pioneering a new approach to real estate financing by bridging traditional 
              property investment with decentralized finance.
            </p>
            
            <h2>How It Works</h2>
            <p>
              Our platform connects stablecoin holders seeking yield with real estate developers needing 
              bridge financing. Through smart contracts and blockchain technology, we create transparent, 
              efficient lending pools that benefit both parties.
            </p>
            
            <blockquote>
              "The future of real estate financing lies in the intersection of traditional assets and 
              blockchain technology." - PropertyLend Team
            </blockquote>
            
            <h3>Investment Tranches</h3>
            <p>We offer two types of investment opportunities:</p>
            <ul>
              <li><strong>Senior Tranches:</strong> Stable 8% APY with priority payment protection</li>
              <li><strong>Junior Tranches:</strong> Variable 20-30% APY with higher risk/reward</li>
            </ul>
            
            <h3>Risk Management</h3>
            <p>
              Every loan on our platform is backed by real estate collateral and undergoes thorough 
              due diligence. We maintain strict loan-to-value ratios and implement multiple layers 
              of security to protect investor funds.
            </p>
            
            <p>
              The smart contract code is audited and uses industry-standard patterns like 
              <code>ReentrancyGuard</code> and <code>Pausable</code> for enhanced security.
            </p>
          </Article>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-12 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 lg:px-12">
          <Heading variant="h2" className="mb-8">Usage Guidelines</Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Typography Principles</CardTitle>
              </CardHeader>
              <CardContent>
                <List>
                  <li>Use consistent type scale across all pages</li>
                  <li>Maintain clear visual hierarchy with size and weight</li>
                  <li>Limit to 2-3 font weights per page</li>
                  <li>Ensure adequate line height for readability</li>
                  <li>Use color purposefully to convey meaning</li>
                  <li>Apply responsive sizing for mobile devices</li>
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <List>
                  <li>Headlines: Use Display or H1-H3 variants</li>
                  <li>Body text: Stick to 16px (body) for readability</li>
                  <li>Financial data: Use tabular numbers with NumericDisplay</li>
                  <li>Emphasis: Prefer weight changes over color</li>
                  <li>Links: Ensure sufficient contrast and hover states</li>
                  <li>Mobile: Test all text sizes on small screens</li>
                </List>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}