'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const AnotherMeHero = dynamic(() => import('@/components/another-me/AnotherMeHero'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a0a0f' }} />,
})

const AnotherMeSocialProof = dynamic(() => import('@/components/another-me/AnotherMeSocialProof'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a0a0f' }} />,
})

const AnotherMeTransition = dynamic(() => import('@/components/another-me/AnotherMeTransition'), {
  ssr: false,
  loading: () => null,
})

const AnotherMeTimeline = dynamic(() => import('@/components/another-me/AnotherMeTimeline'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0a0a0f' }} />,
})

const AnotherMeSkills = dynamic(() => import('@/components/another-me/AnotherMeSkills'), {
  ssr: false,
  loading: () => <div style={{ height: '60vh', background: '#0a0a0f' }} />,
})

const AnotherMeServices = dynamic(() => import('@/components/another-me/AnotherMeServices'), {
  ssr: false,
  loading: () => <div style={{ height: '80vh', background: '#0a0a0f' }} />,
})

const AnotherMeContact = dynamic(() => import('@/components/another-me/AnotherMeContact'), {
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

export default function AnotherMePageContent() {
  return (
    <>
      <AnotherMeHero />
      <LazyMount minHeight="100vh">
        <AnotherMeSocialProof />
      </LazyMount>
      <LazyMount minHeight="40vh" rootMargin="250px 0px">
        <AnotherMeTransition />
      </LazyMount>
      <LazyMount minHeight="100vh" rootMargin="300px 0px">
        <AnotherMeTimeline />
      </LazyMount>
      <LazyMount minHeight="60vh" rootMargin="250px 0px">
        <AnotherMeSkills />
      </LazyMount>
      <LazyMount minHeight="80vh" rootMargin="250px 0px">
        <AnotherMeServices />
      </LazyMount>
      <LazyMount minHeight="50vh" rootMargin="200px 0px">
        <AnotherMeContact />
      </LazyMount>
    </>
  )
}
