import { readGalleryItem } from "@/lib/db"
import GalleryForm from "@/components/admin/GalleryForm"

export const dynamic = "force-dynamic"

export default async function EditGalleryPage({ params }) {
  const { id } = await params
  const item = await readGalleryItem(id)
  if (!item) return <div className="text-text-muted">Not found</div>
  return <GalleryForm item={item} />
}
