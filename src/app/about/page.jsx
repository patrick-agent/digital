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
    description: "Indie artist & producer. RnB, Trapchill, Hip-hop.",
    type: "profile",
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
