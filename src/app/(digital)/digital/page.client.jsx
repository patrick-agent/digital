'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const DigitalHero = dynamic(() => import('@/components/digital/DigitalHero'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a0a0f' }} />,
})

const DigitalSocialProof = dynamic(() => import('@/components/digital/DigitalSocialProof'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a0a0f' }} />,
})

const DigitalTransition = dynamic(() => import('@/components/digital/DigitalTransition'), {
  ssr: false,
  loading: () => null,
})

const DigitalTimeline = dynamic(() => import('@/components/digital/DigitalTimeline'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a0a0f' }} />,
})

const DigitalSkills = dynamic(() => import('@/components/digital/DigitalSkills'), {
  ssr: false,
  loading: () => <div style={{ height: '60vh', background: '#0a0a0f' }} />,
})

const DigitalServices = dynamic(() => import('@/components/digital/DigitalServices'), {
  ssr: false,
  loading: () => <div style={{ height: '80vh', background: '#0a0a0f' }} />,
})

const DigitalContact = dynamic(() => import('@/components/digital/DigitalContact'), {
  ssr: false,
  loading: () => <div style={{ height: '50vh', background: '#0a0a0f' }} />,
})

function SectionPlaceholder({ minHeight = '80vh' }) {
  return <div style={{ minHeight, background: '#0a0a0f' }} aria-hidden="true" />
}

function LazyMount({ children, minHeight = '80vh', rootMargin = '350px 0px' }) {
  const ref = useRef(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (shouldRender) return
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setShouldRender(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, shouldRender])

  if (shouldRender) return children

  return <div ref={ref}><SectionPlaceholder minHeight={minHeight} /></div>
}

export default function DigitalPageContent() {
  return (
    <>
      <DigitalHero />
      <LazyMount minHeight="100vh">
        <DigitalSocialProof />
      </LazyMount>
      <LazyMount minHeight="40vh" rootMargin="250px 0px">
        <DigitalTransition />
      </LazyMount>
      <LazyMount minHeight="100vh" rootMargin="300px 0px">
        <DigitalTimeline />
      </LazyMount>
      <LazyMount minHeight="60vh" rootMargin="250px 0px">
        <DigitalSkills />
      </LazyMount>
      <LazyMount minHeight="80vh" rootMargin="250px 0px">
        <DigitalServices />
      </LazyMount>
      <LazyMount minHeight="50vh" rootMargin="200px 0px">
        <DigitalContact />
      </LazyMount>
    </>
  )
}
