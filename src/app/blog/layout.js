import { siteMetadata } from "@/lib/seo"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import SkipLink from "@/components/ui/SkipLink"

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

const styles = {
  disclosure: {
    background: 'rgba(0,0,0,0.03)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    padding: '6px 16px',
    fontSize: '12px',
    textAlign: 'center',
    color: '#999',
  },
}

function AffiliateDisclosure() {
  return (
    <div style={styles.disclosure}>
      Một số bài viết có chứa link affiliate (hoa hồng) giúp hỗ trợ Tachy mà không làm tăng chi phí của bạn.
    </div>
  )
}

export default function BlogLayout({ children }) {
  return (
    <>
      <SkipLink href="#blog-content">Bỏ qua điều hướng tới blog</SkipLink>
      <Navbar />
      <main id="blog-content" style={{ paddingBottom: 220 }}>{children}</main>
      <Footer />
      <AffiliateDisclosure />
    </>
  )
}
