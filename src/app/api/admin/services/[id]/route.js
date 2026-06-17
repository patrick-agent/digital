import {
  getService,
  updateService,
  deleteService,
} from "@/lib/services/service/index.js"
import { requireAdmin, fromResult } from "@/lib/admin-route"

export async function GET(request, { params }) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { id } = await params
  const result = await getService({ id })
  return fromResult(result)
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { id } = await params
  const body = await request.json()
  const result = await updateService({ id, ...body })
  return fromResult(result)
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin()
  if (session instanceof Response) return session

  const { id } = await params
  const result = await deleteService({ id })
  return fromResult(result, { status: 200 })
}
