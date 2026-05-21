import { NextResponse } from "next/server"

export function validateApiKey(request) {
  const key = request.headers.get("x-api-key")

  if (!key || key !== process.env.AUTOMATION_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized — invalid or missing API key",
      },
      { status: 401 }
    )
  }

  return null
}
