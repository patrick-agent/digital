import ContactPageClient from "@/components/contact/ContactPage"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Liên Hệ Tachy | Booking, Hợp Tác & Tư Vấn",
  description:
    "Liên hệ Tachy để booking, hợp tác sáng tạo, tư vấn home studio hoặc trao đổi về music production và digital projects.",
  path: "/contact",
  keywords: ["liên hệ Tachy", "booking nghệ sĩ", "hợp tác âm nhạc", "tư vấn home studio"],
})

export default function ContactPage() {
  return <ContactPageClient />
}
