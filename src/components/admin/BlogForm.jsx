"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Copy, Eye } from "lucide-react"
import RichTextEditor from "./RichTextEditor"
import { calculateSEOScore } from "@/lib/seo-score"

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
]

function SEOIndicator({ data }) {
  const { score, checks } = calculateSEOScore(data)

  const getColor = (s) => {
    if (s >= 75) return "text-green-500"
    if (s >= 50) return "text-yellow-600"
    return "text-accent-pink"
  }

  const getLabel = (s) => {
    if (s >= 75) return "Good"
    if (s >= 50) return "Fair"
    return "Needs Work"
  }

  return (
    <div className="space-y-3" style={{ paddingLeft: 12, paddingRight: 12 , marginBottom: 24 }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">SEO Score</span>
        <span className={`text-sm font-bold ${getColor(score)}`}>{score}/100 — {getLabel(score)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100" style={{ marginBottom: 12 }}>
        <div
          className={`h-full rounded-full transition-all ${score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-accent-pink"}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="space-y-1.5">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                check.status === "pass" ? "bg-green-500" : check.status === "warn" ? "bg-yellow-500" : "bg-accent-pink"
              }`}
            />
            <span className="text-text-muted">
              {check.name === "title_length" && "Title length (30-60 chars)"}
              {check.name === "desc_length" && "Description length (120-160 chars)"}
              {check.name === "has_image" && "Has cover image"}
              {check.name === "taxonomy" && "Has category or tags"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BlogForm({ post }) {
  const router = useRouter()
  const isEditing = !!post

  const [form, setForm] = useState({
    title: "",
    slug: "",
    persona: "artist",
    content: "",
    excerpt: "",
    coverImage: "",
    tags: "",
    category: "",
    status: "draft",
    publishedAt: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        persona: post.persona || "artist",
        content: post.content || "",
        excerpt: post.excerpt || "",
        coverImage: post.coverImage || "",
        tags: (post.tags || []).join(", "),
        category: post.category || "",
        status: post.status || "draft",
        publishedAt: post.publishedAt
          ? new Date(post.publishedAt).toISOString().slice(0, 16)
          : "",
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        seoKeywords: (post.seoKeywords || []).join(", "),
      })
    }
  }, [post])

  const handleChange = useCallback(
    (field, value) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value }
        if (field === "title" && !slugManuallyEdited) {
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

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      persona: form.persona,
      content: form.content,
      excerpt: form.excerpt,
      coverImage: form.coverImage,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      category: form.category,
      status: form.status,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords.split(",").map((t) => t.trim()).filter(Boolean),
    }

    try {
      const url = isEditing ? `/api/admin/blog/posts/${post.id}` : "/api/admin/blog/posts"
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
      router.push("/admin/blog")
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDuplicate() {
    if (!post) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/blog/posts/${post.id}?action=duplicate`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to duplicate")
      const data = await res.json()
      router.push(`/admin/blog/${data.id}/edit`)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = isEditing
    ? `/blog/${form.slug}`
    : null

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* 2-column layout: 68% / 32% */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[68%_32%]">

        {/* ===== LEFT COLUMN (68%) ===== */}
        <div className="space-y-6">

          {/* Basic Information */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>Basic Information</h3>
            </div>
            <div className="section-body section-body-loose admin-form-section space-y-5" style={{ marginTop: 8 }}>
              <div>
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="admin-input"
                  placeholder="Enter post title"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true)
                    handleChange("slug", e.target.value)
                  }}
                  className="admin-input font-mono text-sm"
                  placeholder="post-url-slug"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>Content</h3>
            </div>
            <div className="section-body section-body-editor">
              <RichTextEditor
                content={form.content}
                onChange={(html) => handleChange("content", html)}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>Excerpt</h3>
            </div>
            <div className="section-body">
              <textarea
                value={form.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                rows={3}
                className="admin-input resize-none"
                placeholder="Brief description for search results and previews"
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (32%) ===== */}
        <div className="space-y-6">

          {/* Publish */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>Publish</h3>
            </div>
            <div className="section-body section-body-compact admin-form-group space-y-4">
              <div>
                <label className="admin-label-light">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="admin-input mt-1"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label-light" style={{ marginTop: 12 }}>
                  Published At
                </label>
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) => handleChange("publishedAt", e.target.value)}
                  className="admin-input mt-1"
                />
              </div>
              <div className="flex gap-2" style={{ marginLeft: 12, marginRight: 12 }}>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDuplicate}
                    disabled={saving}
                    className="admin-btn-secondary flex-1"
                  >
                    <Copy size={15} />
                    Duplicate
                  </button>
                )}
                {previewUrl && (
                  <Link
                    href={previewUrl}
                    target="_blank"
                    className="admin-btn-secondary flex-1"
                  >
                    <Eye size={15} />
                    Preview
                  </Link>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="admin-btn-primary w-full"
              >
                {saving ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>

          {/* Media */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>Media</h3>
            </div>
            <div className="section-body section-body-compact admin-form-group space-y-4">
              <div>
                <label className="admin-label-light">Cover Image URL</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => handleChange("coverImage", e.target.value)}
                  className="admin-input mt-1"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {form.coverImage && (
                <div className="overflow-hidden rounded-xl border border-border" style={{ marginBottom: 0 }}>
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="h-40 w-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Taxonomy */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>Taxonomy</h3>
            </div>
            <div className="section-body section-body-compact admin-form-group space-y-4">
              <div>
                <label className="admin-label-light">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="admin-input mt-1"
                  placeholder="e.g. Music, Art, Tutorial"
                />
              </div>
              <div>
                <label className="admin-label-light">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  className="admin-input mt-1"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="admin-section-card">
            <div className="section-header">
              <h3>SEO</h3>
            </div>
            <div className="section-body section-body-compact admin-form-group space-y-4">
              <SEOIndicator data={form} />
              <div>
                <label className="admin-label-light">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => handleChange("seoTitle", e.target.value)}
                  className="admin-input mt-1"
                />
              </div>
              <div>
                <label className="admin-label-light">SEO Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => handleChange("seoDescription", e.target.value)}
                  rows={2}
                  className="admin-input mt-1 resize-none"
                />
              </div>
              <div>
                <label className="admin-label-light">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => handleChange("seoKeywords", e.target.value)}
                  className="admin-input mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
