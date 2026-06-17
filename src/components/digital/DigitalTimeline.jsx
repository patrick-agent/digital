'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Galaxy from '@/components/ui/Galaxy'
import GradientText from '@/components/ui/GradientText'
import { useVisibilityLoader, useDeviceType } from '@/hooks/useVisibilityLoader'
import { milestones } from './DigitalTimelineData'
import styles from './DigitalTimeline.module.css'

const SplineScene = dynamic(
  () => import('@splinetool/react-spline'),
  { ssr: false, loading: () => <div className={styles.splineFallback} /> }
)

function animateDot(gsap, dot, scale, opacity, duration, ease) {
  gsap.to(dot, { scale, opacity, duration, ease })
}

function animateFiber(gsap, fiberLine, fiberGlow, ratio, duration, ease) {
  gsap.to(fiberLine, { scaleY: ratio, duration, ease })
  gsap.to(fiberGlow, { scaleY: ratio, duration, ease })
}

function animateRocket(gsap, rocket, y, opacity, duration, ease) {
  gsap.to(rocket, { y, opacity, duration, ease })
}

function animateColumns(gsap, leftCol, rightCol, x, opacity, duration, ease, delay = 0) {
  gsap.to(leftCol, { x, opacity, duration, ease })
  gsap.to(rightCol, { x: -x, opacity, duration, ease, delay })
}

function animateStatCounter(gsap, statEl, target, suffix) {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration: 1.2,
    ease: 'power1.out',
    onUpdate: () => {
      statEl.textContent = (Number.isInteger(target) ? Math.floor(obj.val) : obj.val.toFixed(1)) + suffix
    }
  })
}

export default function DigitalTimeline() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const fiberTrackRef = useRef(null)
  const fiberLineRef = useRef(null)
  const fiberGlowRef = useRef(null)
  const rocketRef = useRef(null)
  const milestoneRefs = useRef([])
  const dotRefs = useRef([])
  const [fiberTop, setFiberTop] = useState(0)
  const [fiberHeight, setFiberHeight] = useState(0)
  const [dotYPositions, setDotYPositions] = useState([])
  const { ref: visibilityRef, isVisible } = useVisibilityLoader({ rootMargin: '200px' })
  const deviceType = useDeviceType()

  useEffect(() => {
    milestoneRefs.current = milestoneRefs.current.slice(0, milestones.length)
    dotRefs.current = dotRefs.current.slice(0, milestones.length)
  }, [])

  useEffect(() => {
    const updateFiberBounds = () => {
      const firstDot = dotRefs.current[0]
      const lastDot = dotRefs.current[dotRefs.current.length - 1]
      const wrapper = milestoneRefs.current[0]?.closest(`.${styles.milestonesWrapper}`)
      if (firstDot && lastDot && wrapper) {
        const wrapperRect = wrapper.getBoundingClientRect()
        const firstRect = firstDot.getBoundingClientRect()
        const lastRect = lastDot.getBoundingClientRect()
        const top = firstRect.top + firstRect.height / 2 - wrapperRect.top
        const bottom = lastRect.top + lastRect.height / 2 - wrapperRect.top
        if (bottom - top <= 0) return
        setFiberTop(top)
        setFiberHeight(bottom - top)
        setDotYPositions(
          dotRefs.current.map(dot => {
            if (!dot) return 0
            const rect = dot.getBoundingClientRect()
            return rect.top + rect.height / 2 - wrapperRect.top - top
          })
        )
      }
    }
    updateFiberBounds()
    const timer = setTimeout(updateFiberBounds, 100)
    window.addEventListener('resize', updateFiberBounds)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateFiberBounds)
    }
  }, [])

  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const fiberLine = fiberLineRef.current
        const fiberGlow = fiberGlowRef.current
        const rocket = rocketRef.current

        if (fiberLine) { fiberLine.style.transformOrigin = 'top center'; fiberLine.style.transform = 'scaleY(0)' }
        if (fiberGlow) { fiberGlow.style.transformOrigin = 'top center'; fiberGlow.style.transform = 'translateX(-50%) scaleY(0)' }
        if (rocket) gsap.set(rocket, { y: 0, opacity: 0 })

        gsap.fromTo(headingRef.current, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 30%', toggleActions: 'play none none none' }
        })

        milestoneRefs.current.forEach((item, i) => {
          if (!item) return
          const leftCol = item.querySelector(`.${styles.colLeft}`)
          const rightCol = item.querySelector(`.${styles.colRight}`)
          const statEl = item.querySelector(`.${styles.statValue}`)
          const dot = dotRefs.current[i]
          const dotY = dotYPositions[i] ?? 0
          const prevY = i > 0 ? (dotYPositions[i - 1] ?? 0) : 0

          ScrollTrigger.create({
            trigger: item,
            start: 'top 50%',
            end: 'top 40%',
            scrub: 1,
            onEnter: () => {
              if (dot) animateDot(gsap, dot, 1, 1, 0.4, 'power2.out')
              if (fiberHeight > 0) {
                const ratio = dotY / fiberHeight
                animateFiber(gsap, fiberLine, fiberGlow, ratio, 0.5, 'power2.out')
                if (rocket) animateRocket(gsap, rocket, dotY, 1, 0.5, 'power2.out')
              }
              animateColumns(gsap, leftCol, rightCol, 0, 1, 0.6, 'power2.out', 0.1)
              if (statEl && statEl.dataset.counted !== 'true') {
                statEl.dataset.counted = 'true'
                const text = statEl.textContent
                const numMatch = text.match(/[\d.]+/)
                if (numMatch) {
                  const target = parseFloat(numMatch[0])
                  animateStatCounter(gsap, statEl, target, text.replace(numMatch[0], ''))
                }
              }
            },
            onLeaveBack: () => {
              if (dot) animateDot(gsap, dot, 0, 0, 0.3, 'power2.in')
              if (fiberHeight > 0) {
                const ratio = prevY / fiberHeight
                animateFiber(gsap, fiberLine, fiberGlow, ratio, 0.3, 'power2.in')
                if (rocket) animateRocket(gsap, rocket, prevY, prevY === 0 ? 0 : 1, 0.3, 'power2.in')
              }
              animateColumns(gsap, leftCol, rightCol, 20, 0, 0.3, 'power2.in')
            }
          })
        })
      }, sectionRef)
    }

    init()
    return () => ctx?.revert()
  }, [fiberHeight, dotYPositions])

  return (
    <section ref={(el) => { sectionRef.current = el; visibilityRef.current = el; }} id="timeline" className={styles.section}>
      {isVisible && <div className={styles.galaxyBg}>
        <Galaxy
          hueShift={280}
          density={deviceType === 'mobile' ? 0.4 : 1.0}
          glowIntensity={deviceType === 'mobile' ? 0.15 : 0.35}
          saturation={deviceType === 'mobile' ? 0.3 : 0.5}
          starSpeed={0.25}
          mouseRepulsion={false}
          twinkleIntensity={deviceType === 'mobile' ? 0.1 : 0.25}
          rotationSpeed={0.08}
          speed={deviceType === 'mobile' ? 0.5 : 1.0}
        />
      </div>}
      <div className={styles.inner}>
        <div ref={headingRef} className={styles.heading}>
          <span className={styles.headingLabel}>The Journey</span>
          <h2 className={styles.headingTitle}>Hành trình sự nghiệp</h2>
          <div className={styles.flareLine} />
        </div>

        <div className={styles.timelineContainer}>
          <div
            ref={fiberTrackRef}
            className={styles.fiberTrack}
            style={{ top: fiberTop, height: fiberHeight || 'auto' }}
          >
            <div ref={fiberLineRef} className={styles.fiberLine} />
            <div ref={fiberGlowRef} className={styles.fiberGlow} />
            <div ref={rocketRef} className={styles.rocketWrapper}>
              <div className={styles.rocketContainer}>
                {isVisible && <SplineScene
                  scene="https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode"
                />}
              </div>
            </div>
          </div>

          <div className={styles.milestonesWrapper}>
            {milestones.map((m, i) => (
              <div
                key={m.id}
                ref={el => milestoneRefs.current[i] = el}
                className={styles.milestoneRow}
              >
                <div className={styles.colLeft}>
                  <GradientText
                    colors={['#a855f7', '#6366f1', '#ec4899', '#a855f7']}
                    animationSpeed={4}
                    direction="horizontal"
                  >
                    <span className={styles.year}>{m.year}</span>
                  </GradientText>
                  <span className={styles.era}>{m.era}</span>
                  <span className={styles.headline}>{m.headline}</span>
                </div>

                <div className={styles.colCenter}>
                  <div
                    ref={el => dotRefs.current[i] = el}
                    className={styles.milestoneDot}
                  />
                </div>

                <div className={styles.colRight}>
                  <div className={styles.milestoneCard}>
                    <span className={styles.company}>{m.company}</span>
                    <p className={styles.achievement}>{m.achievement}</p>
                    <div className={styles.statBlock}>
                      <span className={styles.statValue} style={{ color: m.color }}>{m.stat.value}</span>
                      <span className={styles.statLabel}>{m.stat.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
