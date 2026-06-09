import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroAbout from "@/components/artist/about/HeroAbout";
import BioSection from "@/components/artist/about/BioSection";
import StreamingBar from "@/components/artist/about/StreamingBar";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "About — Tachy Artist",
  description:
    "Tachy is an independent RnB, Trapchill & Hip-hop artist and music producer — writing, producing, and recording everything on his own.",
  openGraph: {
    title: "About — Tachy Artist",
    description: "Tachy is an independent RnB, Trapchill & Hip-hop artist and music producer — writing, producing, and recording everything on his own.",
    type: "profile",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Tachy Artist",
    description: "Tachy is an independent RnB, Trapchill & Hip-hop artist and music producer.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: "https://tachy.io.vn/about",
  },
};

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
