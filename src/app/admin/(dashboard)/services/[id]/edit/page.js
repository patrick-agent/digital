import { readService } from "@/lib/db"
import ServicesForm from "@/components/admin/ServicesForm"

export const dynamic = "force-dynamic"

export default async function EditServicesPage({ params }) {
  const { id } = await params
  const item = await readService(id)
  if (!item) return <div className="text-text-muted">Not found</div>
  return <ServicesForm item={item} />
}
