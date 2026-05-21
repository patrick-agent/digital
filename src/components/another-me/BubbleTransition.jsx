'use client'

import { useRef, useEffect, useState } from 'react'
import styles from './BubbleTransition.module.css'

export default function BubbleTransition() {
  const containerRef = useRef(null)
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    setBubbles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: Math.random() * 50 + 15,
        x: Math.random() * 100,
        maxOpacity: Math.random() * 0.2 + 0.08,
        hue: Math.random() > 0.5 ? '170' : '250',
      }))
    )
  }, [])

  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const container = containerRef.current
      if (!container || bubbles.length === 0) return

      const bubbleEls = container.querySelectorAll(`.${styles.bubble}`)

      ctx = gsap.context(() => {
        const heroSection = document.getElementById('hero')
        if (!heroSection) return

        bubbleEls.forEach((bubble, i) => {
          const size = parseFloat(bubble.dataset.size)
          const startX = parseFloat(bubble.dataset.x)

          gsap.set(bubble, {
            y: 0,
            x: startX,
            opacity: 0,
            scale: 0.5,
          })

          gsap.to(bubble, {
            y: -window.innerHeight * 0.8,
            opacity: parseFloat(bubble.dataset.maxOpacity),
            scale: 1,
            x: startX + (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
            delay: i * 0.04,
          })
        })
      }, container)
    }

    init()
    return () => ctx?.revert()
  }, [bubbles])

  return (
    <div ref={containerRef} className={styles.container}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className={styles.bubble}
          data-size={b.size}
          data-x={b.x}
          data-max-opacity={b.maxOpacity}
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            bottom: 0,
            border: `1px solid hsla(${b.hue}, 80%, 60%, ${b.maxOpacity})`,
            background: `radial-gradient(circle at 30% 30%, hsla(${b.hue}, 80%, 60%, ${b.maxOpacity * 0.3}), transparent)`,
          }}
        />
      ))}
    </div>
  )
}
