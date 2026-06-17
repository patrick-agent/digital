"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

function createInitialForm(data) {
  if (!data) {
    return {
      bioShort: "", bioLong: "", contactBookingEmail: "",
      riderPdf: "", techSpecPdf: "",
      headshotsRaw: "", logosRaw: "", pressReleasesRaw: "",
    }
  }

  return {
    bioShort: data.bioShort || "", bioLong: data.bioLong || "",
    contactBookingEmail: data.contactBookingEmail || "",
    riderPdf: data.riderPdf || "", techSpecPdf: data.techSpecPdf || "",
    headshotsRaw: (data.headshots || []).join("\n"),
    logosRaw: (data.logos || []).join("\n"),
    pressReleasesRaw: (data.pressReleases || []).map((p) => `${p.title}|${p.url}`).join("\n"),
  }
}

export default function PressKitForm({ data }) {
  const router = useRouter()
  const [form, setForm] = useState(() => createInitialForm(data))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const headshots = form.headshotsRaw.split("\n").map((u) => u.trim()).filter(Boolean)
    const logos = form.logosRaw.split("\n").map((u) => u.trim()).filter(Boolean)
    const pressReleases = form.pressReleasesRaw.split("\n").map((line) => {
      const [title, url] = line.split("|").map((s) => s.trim())
      return title && url ? { title, url } : null
    }).filter(Boolean)

    const payload = { ...form, headshots, logos, pressReleases }
    delete payload.headshotsRaw
    delete payload.logosRaw
    delete payload.pressReleasesRaw

    try {
      const res = await fetch("/api/admin/press-kit", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save") }
      router.refresh()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Press Kit</h2>
      {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Short Bio</label>
            <textarea value={form.bioShort} onChange={(e) => handleChange("bioShort", e.target.value)} rows={2} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder="1-2 sentence bio for press" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Long Bio (MDX)</label>
            <textarea value={form.bioLong} onChange={(e) => handleChange("bioLong", e.target.value)} rows={6} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Contact</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Booking Email</label>
              <input type="email" value={form.contactBookingEmail} onChange={(e) => handleChange("contactBookingEmail", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <button type="submit" disabled={saving} className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Update Press Kit"}
            </button>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Assets</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Headshots (URLs, one per line)</label>
              <textarea value={form.headshotsRaw} onChange={(e) => handleChange("headshotsRaw", e.target.value)} rows={3} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Logos (URLs, one per line)</label>
              <textarea value={form.logosRaw} onChange={(e) => handleChange("logosRaw", e.target.value)} rows={3} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
            </div>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Documents</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Rider PDF URL</label>
              <input type="url" value={form.riderPdf} onChange={(e) => handleChange("riderPdf", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Tech Spec PDF URL</label>
              <input type="url" value={form.techSpecPdf} onChange={(e) => handleChange("techSpecPdf", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Press Releases</h3>
            <textarea value={form.pressReleasesRaw} onChange={(e) => handleChange("pressReleasesRaw", e.target.value)} rows={4} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder="Title|URL&#10;Title|URL" />
          </div>
        </div>
      </div>
    </form>
  )
}
