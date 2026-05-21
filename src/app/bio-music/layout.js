import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata = {
  title: "Bio Music — Tachy Artist",
  description:
    "All releases by Tachy — RnB, Trapchill & Hip-hop singles and EPs. Listen on Spotify, Apple Music, YouTube and more.",
  openGraph: {
    title: "Bio Music — Tachy Artist",
    description: "Discography of indie artist Tachy.",
    type: "website",
  },
}

export default function BioMusicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
