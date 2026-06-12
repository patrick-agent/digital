import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroAbout from "@/components/artist/about/HeroAbout";
import BioSection from "@/components/artist/about/BioSection";
import StreamingBar from "@/components/artist/about/StreamingBar";
import { buildPageMetadata } from "@/lib/seo";

/** @type {import('next').Metadata} */
export const metadata = buildPageMetadata({
  title: "Giới Thiệu Tachy | Indie Artist, Music Producer & Songwriter",
  description:
    "Tìm hiểu về Tachy, indie artist và music producer tự sáng tác, thu âm, phát hành nhạc và xây dựng workflow sáng tạo độc lập.",
  path: "/about",
  keywords: ["Tachy", "giới thiệu Tachy", "indie artist", "music producer", "songwriter"],
  type: "profile",
})

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAbout />
        <BioSection />
        <StreamingBar />
      </main>
      <Footer />
    </>
  );
}
