import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
  title: "Blog — Studio 3D",
  description: "Explore tutorials, insights, and stories about 3D art, music production, and the creative process.",
  openGraph: {
    title: "Blog — Studio 3D",
    description: "Explore tutorials, insights, and stories about 3D art, music production, and the creative process.",
    type: "website",
  },
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
