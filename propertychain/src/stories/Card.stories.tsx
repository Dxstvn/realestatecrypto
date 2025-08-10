/**
 * Card Component Stories - PropertyChain
 * 
 * Storybook documentation for Card components
 * Following UpdatedUIPlan.md Step 64 specifications and CLAUDE.md principles
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, MapPin, Bed, Bath, Square } from 'lucide-react'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Versatile card component for displaying property listings, dashboards, and content sections.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic card with content
 */
export const Basic: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content can include any elements</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * Property listing card
 */
export const PropertyCard: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-400" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Modern Downtown Apartment</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              Manhattan, New York
            </CardDescription>
          </div>
          <Badge variant="secondary">Available</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />3 beds
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />2 baths
          </span>
          <span className="flex items-center">
            <Square className="h-4 w-4 mr-1" />1,200 sqft
          </span>
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Token Price</span>
            <span className="font-semibold">$100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Expected ROI</span>
            <span className="font-semibold text-green-600">7.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Available Tokens</span>
            <span className="font-semibold">2,500</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">View Details</Button>
        <Button variant="outline" className="flex-1">Invest Now</Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * Dashboard metric card
 */
export const MetricCard: Story = {
  render: () => (
    <Card className="w-[250px]">
      <CardHeader className="pb-2">
        <CardDescription>Total Portfolio Value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$125,430</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-green-600">+12.5%</span> from last month
        </p>
      </CardContent>
    </Card>
  ),
}

/**
 * Investment summary card
 */
export const InvestmentSummary: Story = {
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Investment Overview</CardTitle>
        <CardDescription>Your portfolio performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Properties Owned</span>
            <span className="font-semibold">5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Tokens</span>
            <span className="font-semibold">1,250</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Income</span>
            <span className="font-semibold text-green-600">$850</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Returns</span>
            <span className="font-semibold text-green-600">+18.3%</span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Portfolio Health</span>
            <span className="text-xs font-semibold text-green-600">Excellent</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Full Report</Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * Empty state card
 */
export const EmptyState: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Home className="h-12 w-12 text-muted-foreground mb-4" />
        <CardTitle className="mb-2">No Properties Yet</CardTitle>
        <CardDescription className="text-center mb-4">
          Start building your real estate portfolio today
        </CardDescription>
        <Button>Browse Properties</Button>
      </CardContent>
    </Card>
  ),
}

/**
 * Loading state card
 */
export const LoadingState: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="h-6 bg-secondary rounded animate-pulse" />
        <div className="h-4 bg-secondary rounded animate-pulse mt-2 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-secondary rounded animate-pulse" />
          <div className="h-4 bg-secondary rounded animate-pulse w-5/6" />
          <div className="h-4 bg-secondary rounded animate-pulse w-4/6" />
        </div>
      </CardContent>
    </Card>
  ),
}

/**
 * Interactive hover card
 */
export const HoverEffect: Story = {
  render: () => (
    <Card className="w-[350px] transition-all hover:shadow-lg hover:scale-105 cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card responds to hover interactions</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Grid layout example
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[800px]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content for card {i}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}