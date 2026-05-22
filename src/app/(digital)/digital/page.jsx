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
    description: "The other side of Tachy — new dimensions of sound and art.",
    type: "website",
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
