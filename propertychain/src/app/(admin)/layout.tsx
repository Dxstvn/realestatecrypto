/**
 * Admin Layout - PropertyChain
 * 
 * Protected layout for admin-only pages
 * Following UpdatedUIPlan.md Step 55 and CLAUDE.md security standards
 */

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth-helpers'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Verify admin access
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/login?error=SessionRequired')
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard?error=Unauthorized')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader user={session.user} />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}