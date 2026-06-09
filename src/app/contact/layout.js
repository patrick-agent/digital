import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
  title: "Contact — Tachy Artist",
  description:
    "Get in touch with Tachy. Send a message, book a consultation, or connect on social media.",
  openGraph: {
    title: "Contact — Tachy Artist",
    description: "Get in touch with Tachy.",
    type: "website",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Tachy Artist",
    description: "Get in touch with Tachy. Send a message, book a consultation, or connect on social media.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: "https://tachy.io.vn/contact",
  },
}

export default function ContactLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: 220 }}>{children}</main>
      <Footer />
    </>
  )
}
