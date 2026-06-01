"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { Copy, ImageIcon, Loader2, Trash2, Upload } from "lucide-react"

export default function MediaLibraryClient({ initialItems }) {
  const fileInputRef = useRef(null)
  const [items, setItems] = useState(initialItems || [])
  const [folder, setFolder] = useState("website")
  const [alt, setAlt] = useState("")
  const [uploading, setUploading] = useState(false)

  async function uploadFile(file) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder || "website")
    formData.append("alt", alt)

    const res = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "Upload failed")
    }
    return res.json()
  }

  async function handleFileChange(event) {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        uploaded.push(await uploadFile(file))
      }
      setItems((prev) => [...uploaded, ...prev])
      setAlt("")
      toast.success(`${uploaded.length} file uploaded`)
    } catch (error) {
      toast.error(error?.message || "Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function copyUrl(url) {
    await navigator.clipboard.writeText(url)
    toast.success("URL copied")
  }

  async function deleteItem(id) {
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Unable to delete media item")
      return
    }
    setItems((prev) => prev.filter((item) => item.id !== id))
    toast.success("Media item deleted")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-cyan">Assets</p>
          <h1 className="mt-2 text-2xl font-bold text-text-primary">Media Library</h1>
          <p className="mt-1 text-sm text-text-muted">Upload ảnh/file và copy URL để dùng trong Website Builder hoặc các form nội dung.</p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white hover:bg-accent-purple/90 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading..." : "Upload Media"}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-admin-card p-5">
        <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Folder</label>
            <input
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              className="w-full rounded-lg border border-border bg-admin-bg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              placeholder="website"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text-secondary">Alt text mặc định</label>
            <input
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              className="w-full rounded-lg border border-border bg-admin-bg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              placeholder="Mô tả ảnh để hỗ trợ SEO/accessibility"
            />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-admin-card p-12 text-center">
          <ImageIcon className="mx-auto text-text-muted" size={42} />
          <h2 className="mt-4 text-lg font-semibold text-text-primary">No media yet</h2>
          <p className="mt-1 text-sm text-text-muted">Upload ảnh đầu tiên để bắt đầu xây dựng thư viện media.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-admin-card">
              <div className="flex aspect-video items-center justify-center bg-admin-bg">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="text-text-muted" size={36} />
                )}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="truncate text-sm font-medium text-text-primary" title={item.filename}>{item.filename}</p>
                  <p className="text-xs text-text-muted">{item.folder} • {item.type}</p>
                </div>
                <p className="line-clamp-2 break-all rounded-lg bg-admin-bg p-2 text-xs text-text-muted">{item.url}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-admin-bg px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary"
                  >
                    <Copy size={14} /> Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-400/20 px-3 py-2 text-red-400 hover:bg-red-400/10"
                    aria-label="Delete media"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
