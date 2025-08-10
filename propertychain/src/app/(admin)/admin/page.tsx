/**
 * Admin Dashboard Page - PropertyChain
 * 
 * Main admin overview with business KPIs and analytics
 * Following UpdatedUIPlan.md Step 55.1 specifications and CLAUDE.md principles
 */

import { Suspense } from 'react'
import { KPIStrip } from '@/components/admin/dashboard/kpi-strip'
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart'
import { UserGrowthFunnel } from '@/components/admin/dashboard/user-growth-funnel'
import { LiveActivityFeed } from '@/components/admin/dashboard/live-activity-feed'
import { getServerSession } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

// Loading components
function KPIStripSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-[500px] w-full" />
}

function ActivityFeedSkeleton() {
  return <Skeleton className="h-[600px] w-full" />
}

export default async function AdminDashboardPage() {
  // Verify admin access
  const session = await getServerSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  // Export handlers (these would be server actions in production)
  async function handleKPIExport() {
    'use server'
    // Export KPI data to CSV/Excel
    console.log('Exporting KPI data...')
  }
  
  async function handleRevenueExport() {
    'use server'
    // Export revenue data
    console.log('Exporting revenue data...')
  }
  
  async function handleUserDataExport() {
    'use server'
    // Export user analytics
    console.log('Exporting user data...')
  }
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Platform overview and business analytics
        </p>
      </div>
      
      {/* System Status Alert */}
      <Alert className="bg-green-50 border-green-200">
        <InfoIcon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          All systems operational. Last backup: 2 hours ago. Next scheduled maintenance: Dec 15, 2024.
        </AlertDescription>
      </Alert>
      
      {/* KPI Metrics Strip */}
      <section>
        <Suspense fallback={<KPIStripSkeleton />}>
          <KPIStrip onExport={handleKPIExport} />
        </Suspense>
      </section>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Analytics */}
        <section className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </section>
        
        {/* User Growth Funnel */}
        <section className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <UserGrowthFunnel />
          </Suspense>
        </section>
        
        {/* Live Activity Feed */}
        <section className="lg:col-span-2">
          <Suspense fallback={<ActivityFeedSkeleton />}>
            <LiveActivityFeed />
          </Suspense>
        </section>
      </div>
      
      {/* Quick Actions */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2">
        <button
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          title="View Reports"
        >
          📊
        </button>
        <button
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          title="System Settings"
        >
          ⚙️
        </button>
        <button
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          title="Support Tickets"
        >
          💬
        </button>
      </div>
    </div>
  )
}