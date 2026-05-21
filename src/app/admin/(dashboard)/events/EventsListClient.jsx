"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Edit, Trash2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS = {
  upcoming: "bg-green-500/10 text-green-500 border-green-500/20",
  past: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function EventsListClient({ items: initialItems }) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  async function handleDelete(id) {
    if (!confirm("Delete this event?")) return
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" })
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== id)); router.refresh() }
  }

  const filtered = items.filter((item) => {
    const matchesSearch = !search || item.eventName.toLowerCase().includes(search.toLowerCase()) || item.city?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-admin-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Event</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Venue</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Location</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm">No events yet.</td></tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-admin-hover/50 transition-colors">
                  <td className="px-5 py-3"><p className="text-text-primary text-sm font-medium">{item.eventName}</p></td>
                  <td className="px-5 py-3 text-text-secondary text-sm">{item.venue || "—"}</td>
                  <td className="px-5 py-3 text-text-secondary text-sm">{item.city}{item.country ? `, ${item.country}` : ""}</td>
                  <td className="px-5 py-3 text-text-muted text-sm">{item.date ? new Date(item.date).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3"><Badge variant="outline" className={`text-xs ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.ticketUrl && <a href={item.ticketUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"><ExternalLink size={16} /></a>}
                      <Link href={`/admin/events/${item.id}/edit`} className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"><Edit size={16} /></Link>
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
