"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import RichTextEditor from "@/components/admin/RichTextEditor"
import { slugify } from "@/lib/db/slug"

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
]

function createInitialForm(item) {
  if (!item) {
    return {
      title: "", slug: "", clientName: "", industry: "",
      challenge: "", solution: "", resultsRaw: "",
      metricsRaw: "", coverImage: "", testimonialQuote: "",
      testimonialAuthor: "", tags: "", publishedAt: "", status: "draft",
    }
  }

  return {
    title: item.title || "", slug: item.slug || "", clientName: item.clientName || "",
    industry: item.industry || "", challenge: item.challenge || "", solution: item.solution || "",
    resultsRaw: (item.results || []).join("\n"),
    metricsRaw: JSON.stringify(item.metrics || {}, null, 2),
    coverImage: item.coverImage || "", testimonialQuote: item.testimonialQuote || "",
    testimonialAuthor: item.testimonialAuthor || "", tags: (item.tags || []).join(", "),
    publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : "",
    status: item.status || "draft",
  }
}

export default function CaseStudiesForm({ item }) {
  const router = useRouter()
  const isEditing = !!item

  const [form, setForm] = useState(() => createInitialForm(item))
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = useCallback((field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "title" && !slugManuallyEdited) {
        next.slug = slugify(value, "")
      }
      return next
    })
  }, [slugManuallyEdited])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    let metrics = {}
    try { metrics = form.metricsRaw ? JSON.parse(form.metricsRaw) : {} } catch { metrics = {} }
    const payload = {
      ...form,
      results: form.resultsRaw.split("\n").map((r) => r.trim()).filter(Boolean),
      metrics, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
    }
    delete payload.resultsRaw
    delete payload.metricsRaw
    try {
      const url = isEditing ? `/api/admin/case-studies/${item.id}` : "/api/admin/case-studies"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save") }
      router.push("/admin/case-studies")
      router.refresh()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">{isEditing ? "Edit Case Study" : "New Case Study"}</h2>
      {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => { setSlugManuallyEdited(true); handleChange("slug", e.target.value) }} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Client Name</label>
              <input type="text" value={form.clientName} onChange={(e) => handleChange("clientName", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Industry</label>
              <input type="text" value={form.industry} onChange={(e) => handleChange("industry", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Challenge</label>
            <RichTextEditor content={form.challenge} onChange={(html) => handleChange("challenge", html)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Solution</label>
            <RichTextEditor content={form.solution} onChange={(html) => handleChange("solution", html)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Results (one per line)</label>
            <textarea value={form.resultsRaw} onChange={(e) => handleChange("resultsRaw", e.target.value)} rows={4} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Publish</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Published At</label>
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => handleChange("publishedAt", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <button type="submit" disabled={saving} className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Cover Image</h3>
            <input type="url" value={form.coverImage} onChange={(e) => handleChange("coverImage", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="https://..." />
            {form.coverImage && <img src={form.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg border border-border" onError={(e) => (e.target.style.display = "none")} />}
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Testimonial</h3>
            <textarea value={form.testimonialQuote} onChange={(e) => handleChange("testimonialQuote", e.target.value)} rows={3} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder="Quote..." />
            <input type="text" value={form.testimonialAuthor} onChange={(e) => handleChange("testimonialAuthor", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="Author name" />
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Metrics (JSON)</h3>
            <textarea value={form.metricsRaw} onChange={(e) => handleChange("metricsRaw", e.target.value)} rows={4} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder='{"revenue": "+50%", "traffic": "+200%"}' />
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Tags</h3>
            <input type="text" value={form.tags} onChange={(e) => handleChange("tags", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="tag1, tag2" />
          </div>
        </div>
      </div>
    </form>
  )
}
