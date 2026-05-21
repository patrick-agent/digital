'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from './CompanyLogos.module.css'

const LOGOS = [
  { name: 'Hoàn Mỹ', src: '/company-logos/hoanmy.png' },
  { name: 'MegaHome', src: '/company-logos/megahome.png' },
  { name: 'Metamed', src: '/company-logos/metamed.png' },
  { name: 'Phúc Ngọc Tân', src: '/company-logos/phucngoctan.png' },
  { name: 'VinaGame', src: '/company-logos/vinagame.png' },
  { name: 'Yes4All', src: '/company-logos/yes4all.png' },
]

export default function CompanyLogos() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationId
    let position = 0
    const speed = 0.5

    const animate = () => {
      position -= speed
      const firstSetWidth = track.querySelector(`.${styles.logoSet}`).offsetWidth
      if (Math.abs(position) >= firstSetWidth) {
        position = 0
      }
      track.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const renderSet = (keySuffix) => (
    <div className={styles.logoSet} key={keySuffix}>
      {LOGOS.map((logo, i) => (
        <div className={styles.logoItem} key={`${keySuffix}-${i}`}>
          <Image
            src={logo.src}
            alt={logo.name}
            width={120}
            height={48}
            className={styles.logoImg}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Những công ty tôi đã trải qua</p>
      <div className={styles.scrollContainer}>
        <div className={styles.track} ref={trackRef}>
          {renderSet('set1')}
          {renderSet('set2')}
          {renderSet('set3')}
        </div>
      </div>
    </div>
  )
}
