'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import styles from './AnotherMeTransition.module.css'

const SplineScene = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

export default function AnotherMeTransition() {
  const layerRef = useRef(null)
  const rocketRef = useRef(null)

  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const introSection = document.querySelector('#about')
        if (!introSection || !layerRef.current || !rocketRef.current) return

        gsap.set(layerRef.current, { opacity: 0 })
        gsap.set(rocketRef.current, { x:150, y: 2000, scale: 2 })

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
  }, [])

  return (
    <div ref={layerRef} className={styles.transitionLayer}>
      <div ref={rocketRef} className={styles.rocketContainer}>
        <SplineScene scene="https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode" />
      </div>
    </div>
  )
}