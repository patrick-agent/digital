import { readCaseStudy } from "@/lib/db"
import CaseStudiesForm from "@/components/admin/CaseStudiesForm"

export const dynamic = "force-dynamic"

export default async function EditCaseStudiesPage({ params }) {
  const { id } = await params
  const item = await readCaseStudy(id)
  if (!item) return <div className="text-text-muted">Not found</div>
  return <CaseStudiesForm item={item} />
}
