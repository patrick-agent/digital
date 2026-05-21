"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS = {
  draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  published: "bg-green-500/10 text-green-500 border-green-500/20",
}

export default function CaseStudiesListClient({ items: initialItems }) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  async function handleDelete(id) {
    if (!confirm("Delete this case study?")) return
    const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" })
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== id)); router.refresh() }
  }

  const filtered = items.filter((item) => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.clientName?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="bg-admin-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Industry</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No case studies yet.</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-admin-hover/50 transition-colors">
                  <td className="px-5 py-3"><p className="text-text-primary text-sm font-medium">{item.title}</p>{item.slug && <p className="text-text-muted text-xs mt-0.5">/{item.slug}</p>}</td>
                  <td className="px-5 py-3 text-text-secondary text-sm">{item.clientName || "—"}</td>
                  <td className="px-5 py-3 text-text-muted text-sm">{item.industry || "—"}</td>
                  <td className="px-5 py-3"><Badge variant="outline" className={`text-xs ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/case-studies/${item.id}/edit`} className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"><Edit size={16} /></Link>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
