import Link from "next/link"
import { Plus } from "lucide-react"
import { readGallery } from "@/lib/db"
import GalleryListClient from "./GalleryListClient"

export const dynamic = "force-dynamic"

export default async function AdminGalleryPage({ searchParams }) {
  const params = await searchParams
  const { data: items, meta } = await readGallery({
    mediaType: params?.mediaType || "",
    search: params?.search || "",
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gallery</h1>
          <p className="text-text-muted text-sm mt-1">{meta.total} items</p>
        </div>
        <Link href="/admin/gallery/new" className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          New Item
        </Link>
      </div>
      <GalleryListClient items={items} />
    </div>
  )
}
