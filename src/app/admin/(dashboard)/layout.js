import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SidebarAdmin from "@/components/admin/Sidebar"

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen w-full bg-admin-bg">
      <SidebarAdmin />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-admin-bg/90 px-6 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-cyan">Admin Console</p>
              <h1 className="text-lg font-semibold text-text-primary">Website Management</h1>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-text-muted">
              <span className="rounded-full border border-border bg-admin-card px-3 py-1">Tachy Artist</span>
              <span className="rounded-full border border-accent-purple/25 bg-accent-purple/10 px-3 py-1 text-accent-purple">ngx-admin Classic</span>
            </div>
          </div>
        </header>
        <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
