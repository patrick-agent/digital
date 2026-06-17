"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

const TYPE_OPTIONS = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "reel", label: "Reel" },
]

function createInitialForm(item) {
  if (!item) {
    return {
      title: "", mediaType: "photo", fileUrl: "", thumbnail: "",
      altText: "", caption: "", tags: "", eventRef: "",
    }
  }

  return {
    title: item.title || "", mediaType: item.mediaType || "photo",
    fileUrl: item.fileUrl || "", thumbnail: item.thumbnail || "",
    altText: item.altText || "", caption: item.caption || "",
    tags: (item.tags || []).join(", "), eventRef: item.eventRef || "",
  }
}

export default function GalleryForm({ item }) {
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
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }
    try {
      const url = isEditing ? `/api/admin/gallery/${item.id}` : "/api/admin/gallery"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save") }
      router.push("/admin/gallery")
      router.refresh()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">{isEditing ? "Edit Gallery Item" : "New Gallery Item"}</h2>
      {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Caption</label>
            <textarea value={form.caption} onChange={(e) => handleChange("caption", e.target.value)} rows={2} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Alt Text</label>
            <input type="text" value={form.altText} onChange={(e) => handleChange("altText", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => handleChange("tags", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Type</h3>
            <select value={form.mediaType} onChange={(e) => handleChange("mediaType", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
              {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button type="submit" disabled={saving} className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Media</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">File URL</label>
              <input type="url" value={form.fileUrl} onChange={(e) => handleChange("fileUrl", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Thumbnail URL</label>
              <input type="url" value={form.thumbnail} onChange={(e) => handleChange("thumbnail", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="https://..." />
            </div>
            {(form.thumbnail || form.fileUrl) && (
              <img src={form.thumbnail || form.fileUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-border" onError={(e) => (e.target.style.display = "none")} />
            )}
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Event Reference</h3>
            <input type="text" value={form.eventRef} onChange={(e) => handleChange("eventRef", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="Event ID or name" />
          </div>
        </div>
      </div>
    </form>
  )
}
