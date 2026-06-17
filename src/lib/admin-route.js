import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const ERROR_STATUS = {
  NOT_FOUND: 404,
  INVALID_INPUT: 400,
  UNKNOWN_ERROR: 500,
}

function statusFromCode(code) {
  for (const [key, status] of Object.entries(ERROR_STATUS)) {
    if (code.endsWith(key)) return status
  }
  return 500
}

export async function requireAdmin() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return session
}

export function fromResult(result, opts) {
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      { status: statusFromCode(result.error.code) }
    )
  }
  if (opts?.status) {
    return NextResponse.json(result.data, { status: opts.status })
  }
  if (opts?.list) {
    return NextResponse.json({ data: result.data.items, meta: result.data.meta })
  }
  return NextResponse.json(result.data)
}
