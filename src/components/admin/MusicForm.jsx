"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  SiSpotify, SiYoutube, SiApplemusic, SiSoundcloud, SiTidal, SiYoutubemusic,
} from "react-icons/si"
import { Music, Upload, X, Link2, ImageIcon } from "lucide-react"

const TYPE_OPTIONS = [
  { value: "album", label: "Album" },
  { value: "single", label: "Single" },
  { value: "ep", label: "EP" },
  { value: "collab", label: "Collab" },
]

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
]

const STREAMING_PLATFORMS = [
  { key: "spotifyUrl", field: "spotify", label: "Spotify", icon: SiSpotify, color: "#1DB954", placeholder: "https://open.spotify.com/track/..." },
  { key: "appleUrl", field: "apple", label: "Apple Music", icon: SiApplemusic, color: "#FA243C", placeholder: "https://music.apple.com/..." },
  { key: "youtubeUrl", field: "youtube", label: "YouTube", icon: SiYoutube, color: "#FF0000", placeholder: "https://youtube.com/watch?v=..." },
  { key: "soundcloudUrl", field: "soundcloud", label: "SoundCloud", icon: SiSoundcloud, color: "#FF5500", placeholder: "https://soundcloud.com/..." },
  { key: "amazonMusicUrl", field: "amazon_music", label: "Amazon Music", icon: Music, color: "#25D1DA", placeholder: "https://music.amazon.com/..." },
  { key: "youtubeMusicUrl", field: "youtube_music", label: "YouTube Music", icon: SiYoutubemusic, color: "#FF0000", placeholder: "https://music.youtube.com/..." },
  { key: "tidalUrl", field: "tidal", label: "Tidal", icon: SiTidal, color: "#000000", placeholder: "https://tidal.com/..." },
  { key: "deezerUrl", field: "deezer", label: "Deezer", icon: SiTidal, color: "#A238FF", placeholder: "https://deezer.com/..." },
]

export default function MusicForm({ item }) {
  const router = useRouter()
  const isEditing = !!item
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    title: "", slug: "", type: "single", releaseDate: "", coverArt: "",
    spotifyEmbed: "", description: "", featured: false, status: "draft",
    tracklistRaw: "",
    spotifyUrl: "", appleUrl: "", youtubeUrl: "", soundcloudUrl: "",
    amazonMusicUrl: "", youtubeMusicUrl: "", tidalUrl: "", deezerUrl: "",
  })
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [coverPreview, setCoverPreview] = useState("")

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "", slug: item.slug || "", type: item.type || "single",
        releaseDate: item.releaseDate ? item.releaseDate.slice(0, 10) : "",
        coverArt: item.coverArt || "", spotifyEmbed: item.spotifyEmbed || "",
        description: item.description || "", featured: item.featured || false,
        status: item.status || "draft",
        tracklistRaw: (item.tracklist || []).join("\n"),
        spotifyUrl: item.streamingLinks?.spotify || "",
        appleUrl: item.streamingLinks?.apple || "",
        youtubeUrl: item.streamingLinks?.youtube || "",
        soundcloudUrl: item.streamingLinks?.soundcloud || "",
        amazonMusicUrl: item.streamingLinks?.amazon_music || "",
        youtubeMusicUrl: item.streamingLinks?.youtube_music || "",
        tidalUrl: item.streamingLinks?.tidal || "",
        deezerUrl: item.streamingLinks?.deezer || "",
      })
      setCoverPreview(item.coverArt || "")
    }
  }, [item])

  const handleChange = useCallback((field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === "title" && !slugManuallyEdited) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      }
      if (field === "coverArt") {
        setCoverPreview(value)
      }
      return next
    })
  }, [slugManuallyEdited])

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "releases")
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Upload failed")
      }
      const data = await res.json()
      handleChange("coverArt", data.url)
    } catch {
      // Fallback: use local preview if API not available
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result
        if (typeof result === "string") handleChange("coverArt", result)
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  function removeCover() {
    handleChange("coverArt", "")
    setCoverPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    const tracklist = form.tracklistRaw.split("\n").map((t) => t.trim()).filter(Boolean)
    const streamingLinks = {
      spotify: form.spotifyUrl, apple: form.appleUrl, youtube: form.youtubeUrl,
      soundcloud: form.soundcloudUrl, amazon_music: form.amazonMusicUrl,
      youtube_music: form.youtubeMusicUrl, tidal: form.tidalUrl, deezer: form.deezerUrl,
    }
    const payload = { ...form, tracklist, streamingLinks }
    delete payload.tracklistRaw
    delete payload.spotifyUrl; delete payload.appleUrl
    delete payload.youtubeUrl; delete payload.soundcloudUrl
    delete payload.amazonMusicUrl; delete payload.youtubeMusicUrl
    delete payload.tidalUrl; delete payload.deezerUrl
    try {
      const url = isEditing ? `/api/admin/music/${item.id}` : "/api/admin/music"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to save") }
      router.push("/admin/music")
      router.refresh()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">{isEditing ? "Edit Release" : "New Release"}</h2>
      {error && <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left: Main Info ─── */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
            <input type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50" required placeholder="e.g. Can't Stop" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => { setSlugManuallyEdited(true); handleChange("slug", e.target.value) }} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="e.g. cant-stop" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder="Describe this release..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tracklist <span className="text-text-muted font-normal">(one per line)</span></label>
            <textarea value={form.tracklistRaw} onChange={(e) => handleChange("tracklistRaw", e.target.value)} rows={6} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none" placeholder={"1. First Track\n2. Second Track\n3. Third Track"} />
          </div>
        </div>

        {/* ─── Right: Sidebar ─── */}
        <div className="space-y-4">
          {/* Details */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Details</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1">Type</label>
              <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Release Date</label>
              <input type="date" value={form.releaseDate} onChange={(e) => handleChange("releaseDate", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} className="rounded border-border bg-admin-bg" />
              Featured release
            </label>
            <button type="submit" disabled={saving} className="w-full py-2.5 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update Release" : "Create Release"}
            </button>
          </div>

          {/* Cover Art */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2"><ImageIcon size={14} /> Cover Art</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-accent-purple/50 transition-colors">
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
                  <div className="w-4 h-4 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" /> Uploading...
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={20} className="mx-auto text-text-muted" />
                  <p className="text-text-muted text-xs">Click to upload cover art</p>
                  <p className="text-text-muted text-xs opacity-60">JPG, PNG, WebP — Max 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border" /><span className="text-text-muted text-xs">OR</span><div className="flex-1 h-px bg-border" /></div>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="url" value={form.coverArt} onChange={(e) => handleChange("coverArt", e.target.value)} className="w-full pl-9 pr-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder="Paste image URL..." />
            </div>
            {coverPreview && (
              <div className="relative group">
                <img src={coverPreview} alt="Cover preview" className="w-full aspect-square object-cover rounded-lg border border-border" onError={(e) => (e.target.style.display = "none")} />
                <button type="button" onClick={removeCover} className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
              </div>
            )}
          </div>

          {/* Streaming Links */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Streaming Links</h3>
            <p className="text-text-muted text-xs">Add URLs for each platform</p>
            {STREAMING_PLATFORMS.map((p) => {
              const Icon = p.icon
              const value = form[p.key] || ""
              return (
                <div key={p.key} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
                    <Icon size={14} style={{ color: p.color }} />
                    <span className="text-xs text-text-secondary truncate">{p.label}</span>
                  </div>
                  <input type="url" value={value} onChange={(e) => handleChange(p.key, e.target.value)} className="flex-1 min-w-0 px-2.5 py-1.5 bg-admin-bg border border-border rounded-md text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-purple/50" placeholder={p.placeholder} />
                </div>
              )
            })}
          </div>

          {/* Spotify Embed */}
          <div className="bg-admin-card border border-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Spotify Embed</h3>
            <textarea value={form.spotifyEmbed} onChange={(e) => handleChange("spotifyEmbed", e.target.value)} rows={3} className="w-full px-3 py-2 bg-admin-bg border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/50 resize-none font-mono" placeholder='<iframe src="https://open.spotify.com/embed/..." />' />
          </div>
        </div>
      </div>
    </form>
  )
}
