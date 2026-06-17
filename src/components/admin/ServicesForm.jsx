"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "hidden", label: "Hidden" },
]

function createInitialForm(item) {
  if (!item) {
    return {
      serviceName: "", slug: "", headline: "", description: "",
      featuresRaw: "", priceRange: "", ctaLabel: "Contact", ctaUrl: "",
      icon: "", status: "active",
    }
  }

  return {
    serviceName: item.serviceName || "", slug: item.slug || "", headline: item.headline || "",
    description: item.description || "", featuresRaw: (item.features || []).join("\n"),
    priceRange: item.priceRange || "", ctaLabel: item.ctaLabel || "Contact",
    ctaUrl: item.ctaUrl || "", icon: item.icon || "", status: item.status || "active",
  }
}

export default function ServicesForm({ item }) {
  const router = useRouter()
  const isEditing = !!item

  const [form, setForm] = useState(() => createInitialForm(item))
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = useCallback((field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "serviceName" && !slugManuallyEdited) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      }
      return next
    })
  }, [slugManuallyEdited])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const payload = { ...form, features: form.featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean) }
    delete payload.featuresRaw
    try {
      const url = isEditing ? `/api/admin/services/${item.id}` : "/api/admin/services"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save") }
      router.push("/admin/services")
      router.refresh()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">{isEditing ? "Edit Service" : "New Service"}</h2>
      {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Service Name</label>
            <input type="text" value={form.serviceName} onChange={(e) => handleChange("serviceName", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => { setSlugManuallyEdited(true); handleChange("slug", e.target.value) }} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Headline</label>
            <input type="text" value={form.headline} onChange={(e) => handleChange("headline", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="Short catchy headline" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Features (one per line)</label>
            <textarea value={form.featuresRaw} onChange={(e) => handleChange("featuresRaw", e.target.value)} rows={5} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder="Feature 1&#10;Feature 2" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Settings</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Price Range</label>
              <input type="text" value={form.priceRange} onChange={(e) => handleChange("priceRange", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="$500 - $2000" />
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
            <h3 className="text-sm font-semibold text-text-primary">CTA</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Label</label>
              <input type="text" value={form.ctaLabel} onChange={(e) => handleChange("ctaLabel", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">URL</label>
              <input type="url" value={form.ctaUrl} onChange={(e) => handleChange("ctaUrl", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="/digital/contact" />
            </div>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Icon</h3>
            <input type="text" value={form.icon} onChange={(e) => handleChange("icon", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="Lucide icon name (e.g. BarChart)" />
          </div>
        </div>
      </div>
    </form>
  )
}
