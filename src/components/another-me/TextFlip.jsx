'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './TextFlip.module.css'

export default function TextFlip({ words = ['CREATOR', 'BUILDER', 'NAVIGATOR'], interval = 2500 }) {
  const [index, setIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length)
        setIsFlipping(false)
      }, 300)
    }, interval)
    return () => clearInterval(timer)
  }, [words, interval])

  return (
    <div ref={containerRef} className={styles.textFlip}>
      <span className={styles.staticText}>I am a </span>
      <span className={styles.flipWrapper}>
        <span
          className={`${styles.flipWord} ${isFlipping ? styles.flipOut : styles.flipIn}`}
          key={index}
        >
          {words[index]}
        </span>
      </span>
    </div>
  )
}
