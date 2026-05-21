import Link from "next/link"
import { Plus } from "lucide-react"
import { readMusic } from "@/lib/db"
import MusicListClient from "./MusicListClient"

export const dynamic = "force-dynamic"

export default async function AdminMusicPage({ searchParams }) {
  const params = await searchParams
  const { data: items, meta } = await readMusic({
    type: params?.type || "",
    search: params?.search || "",
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bio Music / Discography</h1>
          <p className="text-text-muted text-sm mt-1">{meta.total} releases</p>
        </div>
        <Link href="/admin/music/new" className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          New Release
        </Link>
      </div>
      <MusicListClient items={items} />
    </div>
  )
}
