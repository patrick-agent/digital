import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
  title: "Bio Music — Tachy Artist",
  description:
    "All releases by Tachy — RnB, Trapchill & Hip-hop singles and EPs. Listen on Spotify, Apple Music, YouTube and more.",
  openGraph: {
    title: "Bio Music — Tachy Artist",
    description: "Complete discography of indie artist Tachy — RnB, Trapchill & Hip-hop.",
    type: "website",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bio Music — Tachy Artist",
    description: "Complete discography of indie artist Tachy — RnB, Trapchill & Hip-hop.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: "https://tachy.io.vn/bio-music",
  },
}

export default function BioMusicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: 220 }}>{children}</main>
      <Footer />
    </>
  )
}
