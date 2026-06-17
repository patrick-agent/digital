import { listMusicItems, createMusicItem } from "@/lib/music/service"
import { requireAdmin, fromResult } from "@/lib/admin-route"

export async function GET(request) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { searchParams } = new URL(request.url)
  const result = await listMusicItems({
    type: searchParams.get("type") || "",
    search: searchParams.get("search") || "",
  })
  return fromResult(result, { list: true })
}

export async function POST(request) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const body = await request.json()
  const result = await createMusicItem(body)
  return fromResult(result, { status: 201 })
}
