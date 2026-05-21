import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SidebarAdmin from "@/components/admin/Sidebar"

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen w-full">
      <SidebarAdmin />
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
