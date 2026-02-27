"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { RouteGuard } from "@/components/auth/route-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard roles={["publisher", "admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <main className="ml-[260px] min-h-screen transition-all duration-300">
          {children}
        </main>
      </div>
    </RouteGuard>
  )
}
