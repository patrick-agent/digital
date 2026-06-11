import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { siteMetadata } from "@/lib/seo"
import styles from "./shop.module.css"

export const metadata = {
  title: "Shop Home Studio | Tachy",
  description:
    "Catalog gear, phụ kiện và storage do Tachy chọn lọc cho producer và home studio, đi kèm giá tham khảo và link affiliate minh bạch.",
  openGraph: {
    title: "Shop Home Studio | Tachy",
    description: "Gear, phụ kiện và storage do Tachy chọn lọc cho workflow thu, mix và sản xuất tại nhà.",
    type: "website",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Home Studio | Tachy",
    description: "Catalog gear, phụ kiện và storage do Tachy chọn lọc cho home studio.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/shop`,
  },
}

export default function ShopLayout({ children }) {
  return (
    <>
      <a href="#shop-content" className={styles.skipLink}>
        Bỏ qua điều hướng để tới nội dung shop
      </a>
      <Navbar />
      <main id="shop-content" className={styles.layoutMain}>{children}</main>
      <Footer />
    </>
  )
}
