'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AnotherMeLoading from './loading'

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

export default function AnotherMePageContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <AnotherMeLoading />
  }

  return (
    <>
      <AnotherMeHero />
      <AnotherMeSocialProof />
      <AnotherMeTransition />
      <AnotherMeTimeline />
      <AnotherMeSkills />
      <AnotherMeServices />
      <AnotherMeContact />
    </>
  )
}
