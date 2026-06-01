"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, ExternalLink, Copy, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { calculateSEOScore } from "@/lib/seo-score"

const STATUS_COLORS = {
  draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
  published: "bg-green-50 text-green-700 border-green-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
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
  const color = score >= 75 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-accent-pink"
  return <span className={`text-xs font-bold ${color}`}>{score}</span>
}

function ActionIcon({ icon: Icon, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-gray-100 hover:text-text-primary"
      title={label}
      aria-label={label}
    >
      <Icon size={16} />
    </button>
  )
}

function ActionLink({ icon: Icon, href, label }) {
  return (
    <Link
      href={href}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-gray-100 hover:text-text-primary"
      title={label}
      aria-label={label}
    >
      <Icon size={16} />
    </Link>
  )
}

export default function BlogListClient({ posts: initialPosts }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [personaFilter, setPersonaFilter] = useState("")

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this post?")) return
    const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" })
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  async function handleDuplicate(id) {
    const res = await fetch(`/api/admin/blog/posts/${id}?action=duplicate`, { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      router.push(`/admin/blog/${data.id}/edit`)
      router.refresh()
    }
  }

  const filtered = posts.filter((post) => {
    const matchesSearch = !search || post.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || post.status === statusFilter
    const matchesPersona = !personaFilter || post.persona === personaFilter
    return matchesSearch && matchesStatus && matchesPersona
  })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="admin-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="admin-input pl-9"
            />
          </div>
          <select
            value={personaFilter}
            onChange={(e) => setPersonaFilter(e.target.value)}
            className="admin-input w-auto"
          >
            <option value="">All Personas</option>
            <option value="artist">Tachy Artist</option>
            <option value="marketer">Another Me</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input w-auto"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr className="border-b border-border">
              <th>Title</th>
              <th>Persona</th>
              <th>Status</th>
              <th>Category</th>
              <th className="text-center">SEO</th>
              <th>Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-sm text-text-muted">
                  {posts.length === 0
                    ? "No posts yet. Create your first post!"
                    : "No posts match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                  <td>
                    <div className="max-w-md">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {post.title || "Untitled"}
                      </p>
                      {post.slug && (
                        <p className="mt-0.5 text-xs text-text-muted truncate">/{post.slug}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${PERSONA_COLORS[post.persona] || ""}`}
                    >
                      {PERSONA_LABELS[post.persona] || post.persona || "artist"}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold capitalize ${STATUS_COLORS[post.status] || ""}`}
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="text-sm font-medium text-text-secondary">
                    {post.category || <span className="text-text-muted-2">—</span>}
                  </td>
                  <td className="text-center">
                    <SEOScoreBadge data={post} />
                  </td>
                  <td className="text-sm text-text-muted whitespace-nowrap">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <ActionLink
                        icon={ExternalLink}
                        href={`/blog/${post.category || "uncategorized"}/${post.slug}`}
                        label="Preview post"
                      />
                      <ActionIcon icon={Copy} onClick={() => handleDuplicate(post.id)} label="Duplicate post" />
                      <ActionLink icon={Edit} href={`/admin/blog/${post.id}/edit`} label="Edit post" />
                      <ActionIcon
                        icon={Trash2}
                        onClick={() => handleDelete(post.id)}
                        label="Delete post"
                      />
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
