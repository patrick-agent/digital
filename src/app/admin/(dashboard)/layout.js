import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"

export default async function DashboardLayout({ children }) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return <AdminShell>{children}</AdminShell>
}
