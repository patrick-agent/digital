import { readMusicItem } from "@/lib/db"
import MusicForm from "@/components/admin/MusicForm"

export const dynamic = "force-dynamic"

export default async function EditMusicPage({ params }) {
  const { id } = await params
  const item = await readMusicItem(id)
  if (!item) return <div className="text-text-muted">Not found</div>
  return <MusicForm item={item} />
}
