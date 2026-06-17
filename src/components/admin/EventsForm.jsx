"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
]

function createInitialForm(item) {
  if (!item) {
    return {
      eventName: "", venue: "", city: "", country: "", date: "",
      ticketUrl: "", posterImage: "", status: "upcoming",
    }
  }

  return {
    eventName: item.eventName || "", venue: item.venue || "", city: item.city || "",
    country: item.country || "", date: item.date ? item.date.slice(0, 10) : "",
    ticketUrl: item.ticketUrl || "", posterImage: item.posterImage || "",
    status: item.status || "upcoming",
  }
}

export default function EventsForm({ item }) {
  const router = useRouter()
  const isEditing = !!item

  const [form, setForm] = useState(() => createInitialForm(item))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const url = isEditing ? `/api/admin/events/${item.id}` : "/api/admin/events"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save") }
      router.push("/admin/events")
      router.refresh()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">{isEditing ? "Edit Event" : "New Event"}</h2>
      {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Event Name</label>
            <input type="text" value={form.eventName} onChange={(e) => handleChange("eventName", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Venue</label>
              <input type="text" value={form.venue} onChange={(e) => handleChange("venue", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
              <input type="text" value={form.city} onChange={(e) => handleChange("city", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
            <input type="text" value={form.country} onChange={(e) => handleChange("country", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Details</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button type="submit" disabled={saving} className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Links & Media</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Ticket URL</label>
              <input type="url" value={form.ticketUrl} onChange={(e) => handleChange("ticketUrl", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Poster Image URL</label>
              <input type="url" value={form.posterImage} onChange={(e) => handleChange("posterImage", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="https://..." />
            </div>
            {form.posterImage && <img src={form.posterImage} alt="Poster" className="w-full h-32 object-cover rounded-lg border border-border" onError={(e) => (e.target.style.display = "none")} />}
          </div>
        </div>
      </div>
    </form>
  )
}
