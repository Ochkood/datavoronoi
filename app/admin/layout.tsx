import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="min-h-screen transition-all duration-300 lg:ml-[250px]">
        {children}
      </main>
    </div>
  )
}
