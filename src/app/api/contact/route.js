import { NextResponse } from "next/server"
import { persistContactSubmission } from "@/lib/contact-submissions"

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, persona } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đầy đủ thông tin!" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ!" },
        { status: 400 }
      )
    }

    const submission = await persistContactSubmission({ name, email, subject, message, persona })

    return NextResponse.json({
      success: true,
      message: "Tin nhắn đã được ghi nhận thành công!",
      referenceId: submission.id,
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { success: false, message: "Không thể ghi nhận tin nhắn lúc này. Vui lòng thử lại!" },
      { status: 500 }
    )
  }
}
