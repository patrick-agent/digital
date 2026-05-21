"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Edit, Trash2, ExternalLink, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { calculateSEOScore } from "@/lib/seo-score"

const STATUS_COLORS = {
  draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  published: "bg-green-500/10 text-green-500 border-green-500/20",
  scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

const PERSONA_LABELS = {
  artist: "Tachy Artist",
  marketer: "Another Me",
}

const PERSONA_COLORS = {
  artist: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  marketer: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
}

function SEOScoreBadge({ data }) {
  const { score } = calculateSEOScore(data)
  const color = score >= 75 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
  return <span className={`text-xs font-bold ${color}`}>{score}</span>
}

export default function BlogListClient({ posts: initialPosts }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [personaFilter, setPersonaFilter] = useState("")

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this post?")) return

    const res = await fetch(`/api/admin/blog/posts/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  async function handleDuplicate(id) {
    const res = await fetch(`/api/admin/blog/posts/${id}?action=duplicate`, {
      method: "POST",
    })

    if (res.ok) {
      const data = await res.json()
      router.push(`/admin/blog/${data.id}/edit`)
      router.refresh()
    }
  }

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || post.status === statusFilter
    const matchesPersona = !personaFilter || post.persona === personaFilter
    return matchesSearch && matchesStatus && matchesPersona
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
          />
        </div>
        <select
          value={personaFilter}
          onChange={(e) => setPersonaFilter(e.target.value)}
          className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
        >
          <option value="">All Personas</option>
          <option value="artist">Tachy Artist</option>
          <option value="marketer">Another Me</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-admin-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Persona
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                SEO
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Updated
              </th>
              <th className="text-right px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-text-muted text-sm">
                  {posts.length === 0
                    ? "No posts yet. Create your first post!"
                    : "No posts match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-admin-hover/50 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-text-primary text-sm font-medium">{post.title || "Untitled"}</p>
                      {post.slug && (
                        <p className="text-text-muted text-xs mt-0.5">/{post.slug}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${PERSONA_COLORS[post.persona] || ""}`}
                    >
                      {PERSONA_LABELS[post.persona] || post.persona || "artist"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${STATUS_COLORS[post.status] || ""}`}
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-text-secondary text-sm">
                    {post.category || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <SEOScoreBadge data={post} />
                  </td>
                  <td className="px-5 py-3 text-text-muted text-sm">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${post.category || "uncategorized"}/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"
                        title="Preview"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(post.id)}
                        className="p-1.5 text-text-muted hover:text-accent-purple transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 text-text-muted hover:text-accent-cyan transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
