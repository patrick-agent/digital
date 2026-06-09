"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SettingsForm({ settings }) {
  const router = useRouter()
  const [form, setForm] = useState({
    siteTitle: settings.siteTitle || "",
    seoTitle: settings.seoTitle || "",
    seoDescription: settings.seoDescription || "",
    seoKeywords: (settings.seoKeywords || []).join(", "),
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          seoKeywords: form.seoKeywords
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      setMessage("Settings saved successfully")
      router.refresh()
    } catch (err) {
      setMessage("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" style={{ margin: 12 , borderRadius: "0" , minHeight: "80vh" , maxWidth: "100%" }}>
      <div className="bg-admin-card border border-border rounded-xl p-6 space-y-4" style={{ padding: 12 , borderRadius: "0" , marginBottom: 12 }}>
        <h2 className="text-lg font-semibold text-text-primary" style={{ color: "var(--color-text-muted)" , fontSize: "1rem" , marginBottom: 12 }}>
          General
        </h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Site Title
          </label>
          <input
            type="text"
            value={form.siteTitle}
            onChange={(e) => setForm((p) => ({ ...p, siteTitle: e.target.value }))}
            className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
          />
        </div>
      </div>

      <div className="bg-admin-card border border-border rounded-xl p-6 space-y-4" style={{ padding: 12 , borderRadius: "0" , marginBottom: 12 }}>
        <h2 className="text-lg font-semibold text-text-primary" style={{ color: "var(--color-text-muted)" , fontSize: "1rem" , marginBottom: 12 }}>
          SEO Defaults
        </h2>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" style={{ marginTop: 12 }}>
            Default SEO Title
          </label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
            className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" style={{ marginTop: 12 }}>
            Default SEO Description
          </label>
          <textarea
            value={form.seoDescription}
            onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1" style={{ marginTop: 12 }}>
            Default SEO Keywords (comma separated)
          </label>
          <input
            type="text"
            value={form.seoKeywords}
            onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
            className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
          />
        </div>
      </div>

      {message && (
        <p
          className={`text-sm px-4 py-3 rounded-lg ${
            message.includes("Error")
              ? "bg-red-400/10 text-red-400 border border-red-400/20"
              : "bg-green-400/10 text-green-400 border border-green-400/20"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        style={{ backgroundColor: "var(--color-accent-purple)" , color: "#fff" , borderRadius: "9999px" , fontSize: "0.875rem" , padding: "6px 30px" }}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  )
}
