import { Suspense } from 'react'
import AnotherMePageContent from './page.client'
import AnotherMeLoading from './loading'

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Another Me — Tachy Artist",
  description:
    "Discover the other side of Tachy — a creative persona exploring new dimensions of sound, art, and identity.",
  keywords: ["Tachy", "Another Me", "artist", "creative", "music", "portfolio"],
  openGraph: {
    title: "Another Me — Tachy Artist",
    description: "Discover the other side of Tachy — a creative persona exploring new dimensions of sound, art, and identity through music and digital innovation.",
    type: "website",
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Another Me — Tachy Artist",
    description: "Discover the other side of Tachy — a creative persona exploring new dimensions of sound, art, and identity.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: "https://tachy.io.vn/digital",
  },
}

export const viewport = {
  themeColor: '#0a0a0f',
}

export default function AnotherMePage() {
  return (
    <Suspense fallback={<AnotherMeLoading />}>
      <AnotherMePageContent />
    </Suspense>
  )
}
