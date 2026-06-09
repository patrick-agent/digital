import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
  title: "Shop — Tachy Artist",
  description:
    "Discover recommended gear, tools, and essentials curated by Tachy. Each product includes an affiliate link — supporting the artist at no extra cost to you.",
  openGraph: {
    title: "Shop — Tachy Artist",
    description: "Curated gear & tools recommended by Tachy.",
    type: "website",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop — Tachy Artist",
    description: "Discover recommended gear, tools, and essentials curated by Tachy.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: "https://tachy.io.vn/shop",
  },
}

export default function ShopLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: 220 }}>{children}</main>
      <Footer />
    </>
  )
}
