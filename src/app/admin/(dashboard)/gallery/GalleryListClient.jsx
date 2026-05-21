"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Edit, Trash2, Image, Video, Film } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const TYPE_ICONS = { photo: Image, video: Video, reel: Film }
const TYPE_COLORS = {
  photo: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  video: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
  reel: "bg-accent-pink/10 text-accent-pink border-accent-pink/20",
}

export default function GalleryListClient({ items: initialItems }) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== id)); router.refresh() }
  }

  const filtered = items.filter((item) => {
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.caption?.toLowerCase().includes(search.toLowerCase())
    const matchesType = !typeFilter || item.mediaType === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gallery..." className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
          <option value="">All Types</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="reel">Reel</option>
        </select>
      </div>

      <div className="bg-admin-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Preview</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Order</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm">No gallery items yet.</td></tr>
            ) : (
              filtered.map((item) => {
                const TypeIcon = TYPE_ICONS[item.mediaType] || Image
                return (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-admin-hover/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-admin-bg">
                        {(item.thumbnail || item.fileUrl) && <img src={item.thumbnail || item.fileUrl} alt="" className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />}
                      </div>
                    </td>
                    <td className="px-5 py-3"><p className="text-text-primary text-sm font-medium">{item.title || "Untitled"}</p>{item.caption && <p className="text-text-muted text-xs mt-0.5 truncate max-w-xs">{item.caption}</p>}</td>
                    <td className="px-5 py-3"><Badge variant="outline" className={`text-xs ${TYPE_COLORS[item.mediaType] || ""}`}><TypeIcon size={12} className="mr-1" />{item.mediaType}</Badge></td>
                    <td className="px-5 py-3 text-text-muted text-sm">{item.displayOrder}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/gallery/${item.id}/edit`} className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
