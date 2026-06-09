import { siteMetadata } from "@/lib/seo"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
  title: "Blog — Tachy",
  description: "Explore music production guides, SEO articles, and creative experiments from Tachy.",
  openGraph: {
    title: "Blog — Tachy",
    description: "Explore music production guides, SEO articles, and creative experiments from Tachy.",
    type: "website",
    url: `${siteMetadata.siteUrl}/blog`,
  },
  robots: { index: true, follow: true },
}

export default function BlogLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: 220 }}>{children}</main>
      <Footer />
    </>
  )
}
