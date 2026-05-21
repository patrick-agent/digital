import Link from "next/link"
import { Plus } from "lucide-react"
import { readCaseStudies } from "@/lib/db"
import CaseStudiesListClient from "./CaseStudiesListClient"

export const dynamic = "force-dynamic"

export default async function AdminCaseStudiesPage({ searchParams }) {
  const params = await searchParams
  const { data: items, meta } = await readCaseStudies({
    status: params?.status || "",
    search: params?.search || "",
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Case Studies</h1>
          <p className="text-text-muted text-sm mt-1">{meta.total} case studies</p>
        </div>
        <Link href="/admin/case-studies/new" className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          New Case Study
        </Link>
      </div>
      <CaseStudiesListClient items={items} />
    </div>
  )
}
