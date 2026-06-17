import { getMusicItem, updateMusicItem, deleteMusicItem } from "@/lib/music/service"
import { requireAdmin, fromResult } from "@/lib/admin-route"

export async function GET(request, { params }) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { id } = await params
  const result = await getMusicItem({ id })
  return fromResult(result)
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { id } = await params
  const body = await request.json()
  const result = await updateMusicItem({ id, ...body })
  return fromResult(result)
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { id } = await params
  const result = await deleteMusicItem({ id })
  return fromResult(result, { status: 200 })
}
