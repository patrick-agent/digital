'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useVisibilityLoader } from '@/hooks/useVisibilityLoader'
import styles from './AnotherMeTransition.module.css'

const SplineScene = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
})

export default function AnotherMeTransition() {
  const layerRef = useRef(null)
  const rocketRef = useRef(null)
  const [shouldRender, setShouldRender] = useState(false)
  const { ref: triggerRef } = useVisibilityLoader({
    rootMargin: '100px',
  })

  useEffect(() => {
    if (shouldRender) return
    const el = triggerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin: '500px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldRender, triggerRef])

  useEffect(() => {
    if (!shouldRender) return
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const introSection = document.querySelector('#about')
        if (!introSection || !layerRef.current || !rocketRef.current) return

        gsap.set(layerRef.current, { opacity: 0 })
        gsap.set(rocketRef.current, { x: 150, y: 2000, scale: 2 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: introSection,
            start: '30% top',
            end: 'bottom top',
            scrub: 1,
          }
        })

        tl.to(layerRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        })

        tl.to(rocketRef.current, {
          y: -1800,
          x: 50,
          scale: 0.6,
          duration: 1,
          opacity: 1,
          ease: 'power2.inOut',
        }, 0)
      })
    }
    init()
    return () => ctx?.revert()
  }, [shouldRender])

  return (
    <>
      <div ref={triggerRef} />
      <div ref={layerRef} className={styles.transitionLayer}>
        <div ref={rocketRef} className={styles.rocketContainer}>
          {shouldRender && <SplineScene scene="https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode" />}
        </div>
      </div>
    </>
  )
}