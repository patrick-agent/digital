import { Suspense } from 'react'
import DigitalPageContent from './page.client'
import DigitalLoading from './loading'
import { buildPageMetadata } from '@/lib/seo'

/** @type {import('next').Metadata} */
export const metadata = buildPageMetadata({
  title: "Another Me | Digital Marketing & Creative Strategy by Tachy",
  description:
    "Khám phá Another Me, không gian digital của Tachy về marketing, creative strategy, content systems và tư duy tăng trưởng.",
  path: "/digital",
  keywords: ["Another Me", "digital marketing", "creative strategy", "content systems", "Tachy"],
})

export const viewport = {
  themeColor: '#0a0a0f',
}

export default function DigitalPage() {
  return (
    <Suspense fallback={<DigitalLoading />}>
      <DigitalPageContent />
    </Suspense>
  )
}
