"use client"

import { useState } from "react"
import { Search, UserMinus, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_COLORS = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  unsubscribed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export default function NewsletterClient({ subscribers: initialSubscribers, meta }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  async function handleUnsubscribe(id) {
    if (!confirm("Unsubscribe this user?")) return
    const res = await fetch("/api/admin/newsletter", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unsubscribe", id }),
    })
    if (res.ok) {
      setSubscribers((prev) => prev.map((s) => s.id === id ? { ...s, status: "unsubscribed" } : s))
    }
  }

  function handleExportCSV() {
    const headers = ["Email", "First Name", "Persona Interest", "Subscribed At", "Status"]
    const rows = subscribers.map((s) => [
      s.email, s.firstName || "", (s.personaInterest || []).join("; "),
      new Date(s.subscribedAt).toLocaleDateString(), s.status,
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "subscribers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = subscribers.filter((s) => {
    const matchesSearch = !search || s.email.toLowerCase().includes(search.toLowerCase()) || s.firstName?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Newsletter Subscribers</h1>
          <p className="text-text-muted text-sm mt-1">{meta.total} subscribers</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-admin-card border border-border hover:bg-admin-hover text-text-primary rounded-lg text-sm font-medium transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscribers..." className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      <div className="bg-admin-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Persona Interest</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Subscribed</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm">No subscribers yet.</td></tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-admin-hover/50 transition-colors">
                  <td className="px-5 py-3 text-text-primary text-sm">{s.email}</td>
                  <td className="px-5 py-3 text-text-secondary text-sm">{s.firstName || "—"}</td>
                  <td className="px-5 py-3 text-text-muted text-sm">{(s.personaInterest || []).join(", ") || "—"}</td>
                  <td className="px-5 py-3 text-text-muted text-sm">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><Badge variant="outline" className={`text-xs ${STATUS_COLORS[s.status] || ""}`}>{s.status}</Badge></td>
                  <td className="px-5 py-3 text-right">
                    {s.status === "active" && (
                      <button onClick={() => handleUnsubscribe(s.id)} className="p-1.5 text-text-muted hover:text-red-400 transition-colors" title="Unsubscribe">
                        <UserMinus size={16} />
                      </button>
                    )}
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
