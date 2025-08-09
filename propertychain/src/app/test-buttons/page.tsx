"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronRight, Download, Heart, Plus, Settings, Trash2 } from "lucide-react"

export default function TestButtonsPage() {
  const [loading, setLoading] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Button Component Test</h1>
      
      {/* Variants Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes (40px, 48px, 56px)</h2>
        <div className="flex items-center gap-4">
          <Button size="sm">Small (40px)</Button>
          <Button size="default">Default (48px)</Button>
          <Button size="lg">Large (56px)</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Buttons</h2>
        <div className="flex items-center gap-4">
          <Button size="icon-sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon-lg" variant="destructive">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button leftIcon={<Download className="h-4 w-4" />}>
            Download
          </Button>
          <Button rightIcon={<ChevronRight className="h-4 w-4" />}>
            Continue
          </Button>
          <Button 
            variant="success" 
            leftIcon={<Heart className="h-4 w-4" />}
            rightIcon={<span className="text-xs">12</span>}
          >
            Like
          </Button>
        </div>
      </section>

      {/* Rounded Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Border Radius Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button rounded="none">None</Button>
          <Button rounded="sm">Small</Button>
          <Button rounded="default">Default</Button>
          <Button rounded="lg">Large</Button>
          <Button rounded="xl">Extra Large</Button>
          <Button rounded="pill">Pill</Button>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button loading loadingText="Processing...">
            Submit
          </Button>
          <Button loading variant="success" size="sm">
            Save
          </Button>
          <Button loading variant="destructive" size="lg">
            Delete
          </Button>
          <Button loading size="icon">
            <Plus />
          </Button>
        </div>
      </section>

      {/* Interactive Loading */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Loading Demo</h2>
        <div className="flex gap-4">
          <Button 
            onClick={handleLoadingClick} 
            loading={loading}
            loadingText="Saving..."
          >
            Click to Save
          </Button>
          <Button 
            variant="success"
            onClick={handleLoadingClick} 
            loading={loading}
            loadingText="Processing..."
            size="lg"
          >
            Process Payment
          </Button>
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Default</Button>
          <Button disabled variant="secondary">Disabled Secondary</Button>
          <Button disabled variant="success">Disabled Success</Button>
          <Button disabled variant="outline">Disabled Outline</Button>
        </div>
      </section>

      {/* Full Width */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Width</h2>
        <div className="max-w-md space-y-2">
          <Button className="w-full">Full Width Button</Button>
          <Button variant="outline" className="w-full">Full Width Outline</Button>
          <Button variant="success" className="w-full" size="lg">Full Width Large</Button>
        </div>
      </section>
    </div>
  )
}