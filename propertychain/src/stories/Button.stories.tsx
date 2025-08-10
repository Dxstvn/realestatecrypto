/**
 * Button Component Stories - PropertyChain
 * 
 * Storybook documentation for Button component
 * Following UpdatedUIPlan.md Step 64 specifications and CLAUDE.md principles
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Heart, Share2 } from 'lucide-react'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Base button component used throughout the PropertyChain platform. Supports multiple variants, sizes, and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default button style
 */
export const Default: Story = {
  args: {
    children: 'Invest Now',
  },
}

/**
 * Primary action button
 */
export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Purchase Tokens',
  },
}

/**
 * Secondary action button
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'View Details',
  },
}

/**
 * Destructive action button
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Cancel Transaction',
  },
}

/**
 * Outline button style
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Browse Properties',
  },
}

/**
 * Ghost button style
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Learn More',
  },
}

/**
 * Link button style
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'View Documentation',
  },
}

/**
 * Small size button
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

/**
 * Large size button
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

/**
 * Icon only button
 */
export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Heart className="h-4 w-4" />,
    'aria-label': 'Add to favorites',
  },
}

/**
 * Button with icon on the left
 */
export const WithIconLeft: Story = {
  args: {
    children: (
      <>
        <Download className="mr-2 h-4 w-4" />
        Download Report
      </>
    ),
  },
}

/**
 * Button with icon on the right
 */
export const WithIconRight: Story = {
  args: {
    children: (
      <>
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    ),
  },
}

/**
 * Disabled button state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable',
  },
}

/**
 * Loading button state
 */
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <span className="animate-spin mr-2">⏳</span>
        Processing...
      </>
    ),
  },
}

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    className: 'w-full',
    children: 'Connect Wallet',
  },
  parameters: {
    layout: 'padded',
  },
}

/**
 * Button group example
 */
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button variant="outline">
        <Heart className="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button>
        Invest Now
      </Button>
    </div>
  ),
}

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
}

/**
 * All sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Heart className="h-4 w-4" />
      </Button>
    </div>
  ),
}