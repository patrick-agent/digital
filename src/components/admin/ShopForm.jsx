"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import RichTextEditor from "./RichTextEditor"

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "hidden", label: "Hidden" },
  { value: "out_of_stock", label: "Out of Stock" },
]

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "VND", label: "VND (₫)" },
]

function createInitialForm(product) {
  if (!product) {
    return {
      name: "",
      slug: "",
      description: "",
      price: "",
      currency: "USD",
      images: [""],
      category: "",
      tags: "",
      affiliateUrl: "",
      status: "hidden",
      seoTitle: "",
      seoDescription: "",
      features: "",
      whyRecommend: "",
      faq: [{ question: "", answer: "" }],
    }
  }

  return {
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    currency: product.currency || "USD",
    images: product.images?.length ? product.images : [""],
    category: product.category || "",
    tags: (product.tags || []).join(", "),
    affiliateUrl: product.affiliateUrl || "",
    status: product.status || "hidden",
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    features: (product.features || []).join("\n"),
    whyRecommend: product.whyRecommend || "",
    faq: product.faq?.length ? product.faq : [{ question: "", answer: "" }],
  }
}

export default function ShopForm({ product }) {
  const router = useRouter()
  const isEditing = !!product

  const [form, setForm] = useState(() => createInitialForm(product))
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = useCallback(
    (field, value) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value }

        if (field === "name" && !slugManuallyEdited) {
          next.slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        }

        return next
      })
    },
    [slugManuallyEdited]
  )

  function handleImageChange(index, value) {
    const newImages = [...form.images]
    newImages[index] = value
    if (index === form.images.length - 1 && value) {
      newImages.push("")
    }
    setForm((prev) => ({ ...prev, images: newImages }))
  }

  function removeImage(index) {
    if (form.images.length <= 1) return
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      images: form.images.filter(Boolean),
      category: form.category,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      affiliateUrl: form.affiliateUrl,
      status: form.status,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      whyRecommend: form.whyRecommend,
      faq: form.faq.filter((item) => item.question.trim() && item.answer.trim()),
    }

    try {
      const url = isEditing
        ? `/api/admin/shop/products/${product.id}`
        : "/api/admin/shop/products"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to save")
      }

      router.push("/admin/shop")
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              placeholder="Product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true)
                handleChange("slug", e.target.value)
              }}
              className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Description
            </label>
            <RichTextEditor
              content={form.description}
              onChange={(html) => handleChange("description", html)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Images (URLs)
            </label>
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  className="flex-1 px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                  placeholder="https://..."
                />
                {i < form.images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="px-2 py-2 text-text-muted hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Affiliate URL
            </label>
            <input
              type="url"
              value={form.affiliateUrl}
              onChange={(e) => handleChange("affiliateUrl", e.target.value)}
              className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              placeholder="https://affiliate.link..."
            />
          </div>
        </div>

        <div className="space-y-4">
<div className="bg-admin-card border border-border rounded-xl p-5 
space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Status</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Visibility</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Taxonomy</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                placeholder="Music, Merch, ..."
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">SEO</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">SEO Description</label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => handleChange("seoDescription", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
              />
            </div>
          </div>

          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">SEO Content</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">Features (one per line)</label>
              <textarea
                value={form.features}
                onChange={(e) => handleChange("features", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none font-mono text-xs"
                placeholder="Cardioid polar pattern&#x0a;Frequency response: 20-20,000 Hz&#x0a;Requires 48V phantom power"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">Why Tachy Recommends This</label>
              <RichTextEditor
                content={form.whyRecommend}
                onChange={(html) => handleChange("whyRecommend", html)}
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-2">FAQ</label>
              {form.faq.map((item, i) => (
                <div key={i} className="mb-3 p-3 bg-admin-bg rounded-lg border border-border space-y-2">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const next = [...form.faq]
                      next[i] = { ...next[i], question: e.target.value }
                      handleChange("faq", next)
                    }}
                    className="w-full px-2 py-1.5 bg-admin-bg border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                    placeholder="Question"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const next = [...form.faq]
                      next[i] = { ...next[i], answer: e.target.value }
                      handleChange("faq", next)
                    }}
                    rows={2}
                    className="w-full px-2 py-1.5 bg-admin-bg border border-border rounded text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
                    placeholder="Answer"
                  />
                  {form.faq.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = form.faq.filter((_, j) => j !== i)
                        handleChange("faq", next)
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleChange("faq", [...form.faq, { question: "", answer: "" }])
                }}
                className="text-xs text-accent-primary hover:text-accent-primary/80"
              >
                + Add FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
