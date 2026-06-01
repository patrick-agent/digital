"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function SEOClient({ seo, routes }) {
  const pages = seo.pages || {}
  const [selectedRoute, setSelectedRoute] = useState(routes[0]?.route || "/")
  const currentPage = pages[selectedRoute] || {}

  const [form, setForm] = useState({
    ogTitle: currentPage.ogTitle || "",
    ogDescription: currentPage.ogDescription || "",
    ogImage: currentPage.ogImage || "",
    canonicalUrl: currentPage.canonicalUrl || "",
    robots: currentPage.robots || "index, follow",
    schemaType: currentPage.schemaType || "",
  })

  function handleRouteChange(route) {
    setSelectedRoute(route)
    const page = pages[route] || {}
    setForm({
      ogTitle: page.ogTitle || "", ogDescription: page.ogDescription || "",
      ogImage: page.ogImage || "", canonicalUrl: page.canonicalUrl || "",
      robots: page.robots || "index, follow", schemaType: page.schemaType || "",
    })
  }

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSave() {
    const res = await fetch("/api/admin/seo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route: selectedRoute, data: form }),
    })
    if (res.ok) alert("Saved!")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">SEO & Metadata</h1>
          <p className="text-text-muted text-sm mt-1">Per-page SEO settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Route selector */}
        <div className="bg-admin-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Pages</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {routes.map((r) => (
              <button
                key={r.route}
                onClick={() => handleRouteChange(r.route)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedRoute === r.route
                    ? "bg-sidebar-active text-accent-purple shadow-[inset_3px_0_0_var(--color-accent-purple)]"
                    : "text-text-secondary hover:bg-sidebar-hover"
                }`}
              >
                <p className="font-medium">{r.label}</p>
                <p className="text-xs text-text-muted">{r.route}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-admin-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Edit: {routes.find((r) => r.route === selectedRoute)?.label || selectedRoute}
          </h3>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">OG Title</label>
            <input type="text" value={form.ogTitle} onChange={(e) => handleChange("ogTitle", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">OG Description</label>
            <textarea value={form.ogDescription} onChange={(e) => handleChange("ogDescription", e.target.value)} rows={3} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">OG Image URL</label>
            <input type="url" value={form.ogImage} onChange={(e) => handleChange("ogImage", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Canonical URL</label>
              <input type="url" value={form.canonicalUrl} onChange={(e) => handleChange("canonicalUrl", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Robots</label>
              <select value={form.robots} onChange={(e) => handleChange("robots", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
                <option value="index, follow">Index, Follow</option>
                <option value="noindex, follow">Noindex, Follow</option>
                <option value="index, nofollow">Index, Nofollow</option>
                <option value="noindex, nofollow">Noindex, Nofollow</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Schema Type</label>
            <input type="text" value={form.schemaType} onChange={(e) => handleChange("schemaType", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="Article, WebPage, etc." />
          </div>

          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
