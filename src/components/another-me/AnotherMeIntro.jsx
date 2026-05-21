'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import TextFlip from './TextFlip'
import CompanyLogos from './CompanyLogos'
import styles from './AnotherMeIntro.module.css'

const SplineScene = dynamic(
  () => import('@splinetool/react-spline'),
  { ssr: false, loading: () => <div className={styles.splineFallback} /> }
)

export default function AnotherMeIntro() {
  const sectionRef = useRef(null)
  const badgeRef = useRef(null)
  const headlineRef = useRef(null)
  const manifestoRef = useRef(null)
  const statsRef = useRef(null)
  const colLeftRef = useRef(null)
  const colRightRef = useRef(null)

  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })

        tl.fromTo(colLeftRef.current, {
          x: -60,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        })

        tl.fromTo(colRightRef.current, {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        }, '-=0.4')

        tl.fromTo(badgeRef.current, {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.3')

        tl.fromTo(headlineRef.current, {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.35')

        tl.fromTo(manifestoRef.current, {
          y: 30,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.35')

        tl.fromTo(statsRef.current, {
          y: 20,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.3')

        const statEls = statsRef.current.querySelectorAll(`.${styles.statValue}`)
        const targets = [10, 50, 3]
        statEls.forEach((el, i) => {
          const obj = { val: 0 }
          gsap.to(obj, {
            val: targets[i],
            duration: 1.5,
            ease: 'power1.out',
            onUpdate: () => {
              el.textContent = Math.floor(obj.val) + (i === 2 ? 'x' : '+')
            },
          })
        })
      }, sectionRef)
    }

    init()
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} id="intro" className={styles.section}>
      <div className={styles.grid}>
        <div ref={colLeftRef} className={styles.colLeft}>
          <div className={styles.textFlipContainer}>
            <TextFlip words={['CREATOR', 'BUILDER', 'NAVIGATOR']} interval={2500} />
          </div>

          <p ref={badgeRef} className={styles.badge}>
            DIGITAL MARKETER · AI DEVELOPER · GROWTH CONSULTANT
          </p>

          <h2 ref={headlineRef} className={styles.headline}>
            Một người, hai thế giới.
          </h2>

          <p ref={manifestoRef} className={styles.manifesto}>
            Tôi không chọn giữa sáng tạo và phân tích — tôi sống ở cả hai.
            Mỗi chiến dịch là một tác phẩm, mỗi dòng code là một nhịp điệu.
            Nơi nghệ thuật gặp dữ liệu, câu chuyện thương hiệu trở nên sống động.
          </p>

          <div ref={statsRef} className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>0+</span>
              <span className={styles.statLabel}>Năm kinh nghiệm</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>0+</span>
              <span className={styles.statLabel}>Dự án hoàn thành</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>0x</span>
              <span className={styles.statLabel}>Tốc độ tăng trưởng</span>
            </div>
          </div>

          <CompanyLogos />
        </div>

        <div ref={colRightRef} className={styles.colRight}>
          <div className={styles.splineContainer}>
            <SplineScene scene="https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode" />
            <div className={styles.splineOverlay} />
          </div>
        </div>
      </div>
    </section>
  )
}
