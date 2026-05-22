'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useVisibilityLoader } from '@/hooks/useVisibilityLoader'
import styles from './AnotherMeHero.module.css'

const SplineScene = dynamic(
  () => import('@splinetool/react-spline'),
  { ssr: false, loading: () => <div className={styles.splineFallback} /> }
)

export default function AnotherMeHero() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const taglineRef = useRef(null)
  const ctaRef = useRef(null)
  const { ref: visibilityRef, isVisible } = useVisibilityLoader({ rootMargin: '0px' })

  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      ctx = gsap.context(() => {
        const chars = headlineRef.current?.querySelectorAll('span')
        if (!chars) return
        gsap.from(chars, {
          opacity: 0,
          y: 30,
          rotateX: -40,
          stagger: 0.03,
          duration: 0.6,
          ease: 'back.out(1.7)',
        })

        gsap.from(taglineRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 1,
          ease: 'power2.out',
        })

        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 15,
          duration: 0.8,
          delay: 1.5,
          ease: 'power2.out',
        })
      }, sectionRef)
    }
    init()
    return () => ctx?.revert()
  }, [])

  const handleScrollToIntro = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const headline = '10 năm. 3650 ngày. Biến dữ liệu thành cảm xúc.'

  return (
    <section ref={(el) => { sectionRef.current = el; visibilityRef.current = el; }} id="hero" className={styles.section}>
      <div className={styles.splineWrapper}>
        {isVisible && <SplineScene scene="https://prod.spline.design/FaJ3iYbeeDlZbkJI/scene.splinecode" />}
        <div className={styles.splineOverlay} />
      </div>

      <div className={styles.watermarkCover} />

      <div className={styles.content}>
        <h1 ref={headlineRef} className={styles.headline}>
          {headline.split('').map((char, i) => (
            <span key={i} className={styles.char}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p ref={taglineRef} className={styles.tagline}>
          Digital Navigator · Growth Architect
        </p>

        <button ref={ctaRef} className={styles.cta} onClick={handleScrollToIntro}>
          Discover Me
        </button>
      </div>
    </section>
  )
}
