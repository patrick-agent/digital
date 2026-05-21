"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ExternalLink, Copy, Eye } from "lucide-react"
import RichTextEditor from "./RichTextEditor"
import { calculateSEOScore } from "@/lib/seo-score"

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
]

const PERSONA_OPTIONS = [
  { value: "artist", label: "Tachy Artist" },
  { value: "marketer", label: "Another Me" },
]

// Component hiển thị điểm SEO
function SEOIndicator({ data }) {
  const { score, checks } = calculateSEOScore(data)

  const getColor = (s) => {
    if (s >= 75) return "text-green-400"
    if (s >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getLabel = (s) => {
    if (s >= 75) return "Good"
    if (s >= 50) return "Fair"
    return "Needs Work"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">SEO Score</span>
        <span className={`text-sm font-bold ${getColor(score)}`}>{score}/100 — {getLabel(score)}</span>
      </div>
      <div className="w-full bg-admin-bg rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            score >= 75 ? "bg-green-400" : score >= 50 ? "bg-yellow-400" : "bg-red-400"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="space-y-1">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                check.status === "pass"
                  ? "bg-green-400"
                  : check.status === "warn"
                  ? "bg-yellow-400"
                  : "bg-red-400"
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
  const [showPreview, setShowPreview] = useState(false)

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
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: form.category,
      status: form.status,
      publishedAt: form.publishedAt
        ? new Date(form.publishedAt).toISOString()
        : null,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    try {
      const url = isEditing
        ? `/api/admin/blog/posts/${post.id}`
        : "/api/admin/blog/posts"
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
      const res = await fetch(`/api/admin/blog/posts/${post.id}?action=duplicate`, {
        method: "POST",
      })
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

  // Preview URL dựa trên persona
  const previewUrl = isEditing
    ? `/blog/${form.category || "uncategorized"}/${form.slug}`
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          {isEditing ? "Edit Post" : "New Post"}
        </h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <button
                type="button"
                onClick={handleDuplicate}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-2 bg-admin-card border border-border hover:bg-admin-hover text-text-secondary rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Copy size={14} />
                Duplicate
              </button>
              {previewUrl && (
                <Link
                  href={previewUrl}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 bg-admin-card border border-border hover:bg-admin-hover text-text-secondary rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye size={14} />
                  Preview
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Persona selector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Persona
            </label>
            <div className="flex gap-3">
              {PERSONA_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("persona", opt.value)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors border ${
                    form.persona === opt.value
                      ? "bg-accent-purple/20 border-accent-purple text-accent-purple"
                      : "bg-admin-bg border-border text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              placeholder="Post title"
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
              placeholder="post-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Content
            </label>
            <RichTextEditor
              content={form.content}
              onChange={(html) => handleChange("content", html)}
            />
          </div>

          {/* Preview panel */}
          {showPreview && form.content && (
            <div className="bg-admin-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Content Preview</h3>
              <div
                className="prose prose-invert max-w-none text-text-secondary text-sm"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
              placeholder="Short description for meta and previews"
            />
          </div>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Publish</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">Status</label>
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

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Published At
              </label>
              <input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) => handleChange("publishedAt", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
            </button>
          </div>

          {/* Media */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Media</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => handleChange("coverImage", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                placeholder="https://..."
              />
              {form.coverImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Taxonomy */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Taxonomy
            </h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                placeholder="Music, Art, ..."
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

          {/* SEO */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">SEO</h3>

            <SEOIndicator data={form} />

            <div>
              <label className="block text-xs text-text-muted mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                SEO Description
              </label>
              <textarea
                value={form.seoDescription}
                onChange={(e) => handleChange("seoDescription", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={form.seoKeywords}
                onChange={(e) => handleChange("seoKeywords", e.target.value)}
                className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              />
            </div>
          </div>

          {/* Preview toggle */}
          <div className="bg-admin-card border border-border rounded-xl p-5">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 w-full py-2 text-sm font-medium text-text-secondary hover:text-accent-cyan transition-colors"
            >
              <ExternalLink size={14} />
              {showPreview ? "Hide Preview" : "Show Content Preview"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
