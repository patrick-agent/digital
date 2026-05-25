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
