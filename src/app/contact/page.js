import ContactPageClient from "@/components/contact/ContactPage"

export const metadata = {
  title: "Contact — Tachy Artist",
  description:
    "Get in touch with Tachy. Send a message, book a consultation, or connect on social media.",
  alternates: {
    canonical: "https://tachy.io.vn/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
