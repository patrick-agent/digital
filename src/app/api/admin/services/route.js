import { listServices, createService } from "@/lib/services/service/index.js"
import { requireAdmin, fromResult } from "@/lib/admin-route"

export async function GET(request) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { searchParams } = new URL(request.url)
  const result = await listServices({
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
  })
  return fromResult(result, { list: true })
}

export async function POST(request) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const body = await request.json()
  const result = await createService(body)
  return fromResult(result, { status: 201 })
}
