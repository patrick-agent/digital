import AnotherMeHero from "@/components/another-me/AnotherMeHero";
import AnotherMeSocialProof from "@/components/another-me/AnotherMeSocialProof";
import AnotherMeTransition from "@/components/another-me/AnotherMeTransition";
import AnotherMeTimeline from "@/components/another-me/AnotherMeTimeline";
import AnotherMeSkills from "@/components/another-me/AnotherMeSkills";
import AnotherMeServices from "@/components/another-me/AnotherMeServices";
import AnotherMeContact from "@/components/another-me/AnotherMeContact";
import AnotherMeFooter from "@/components/another-me/AnotherMeFooter";

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Another Me — Tachy Artist",
  description:
    "Discover the other side of Tachy — a creative persona exploring new dimensions of sound, art, and identity.",
  keywords: ["Tachy", "Another Me", "artist", "creative", "music", "portfolio"],
  openGraph: {
    title: "Another Me — Tachy Artist",
    description: "The other side of Tachy — new dimensions of sound and art.",
    type: "website",
  },
};

export const viewport = {
  themeColor: '#0a0a0f',
};

export default function AnotherMePage() {
  return (
    <main>
      <AnotherMeHero />
      <AnotherMeSocialProof />
      <AnotherMeTransition />
      <AnotherMeTimeline />
      <AnotherMeSkills />
      <AnotherMeServices />
      <AnotherMeContact />
      <AnotherMeFooter />
    </main>
  );
}
