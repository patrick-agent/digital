'use client'

import { useRef, useEffect } from 'react'
import { useVisibilityLoader, getDeviceType } from '@/hooks/useVisibilityLoader'

export default function GalaxyBackground({ mouseOffset = 20 }) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const deepStarsRef = useRef([])
  const nebulaRef = useRef([])
  const shootingStarsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef(null)
  const lastShootingStarRef = useRef(0)
  const isActiveRef = useRef(true)
  const { ref: containerRef, isVisible } = useVisibilityLoader({ rootMargin: '100px' })

  useEffect(() => {
    isActiveRef.current = isVisible
  }, [isVisible])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const deviceType = getDeviceType()
    const starCount = deviceType === 'mobile' ? 100 : 250
    const deepStarCount = deviceType === 'mobile' ? 40 : 100

    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      baseOpacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))

    deepStarsRef.current = Array.from({ length: deepStarCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 0.8 + 0.3,
      baseOpacity: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.01 + 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))

    nebulaRef.current = [
      { x: width * 0.3, y: height * 0.4, r: width * 0.35, color: 'rgba(0, 245, 212, 0.03)' },
      { x: width * 0.7, y: height * 0.6, r: width * 0.3, color: 'rgba(129, 140, 248, 0.025)' },
      { x: width * 0.5, y: height * 0.2, r: width * 0.25, color: 'rgba(251, 113, 133, 0.02)' },
    ]

    const createShootingStar = () => ({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.3,
      len: Math.random() * 80 + 60,
      speed: Math.random() * 6 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.008,
      r: Math.random() * 1.5 + 1,
    })

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / width - 0.5) * 2,
        y: (e.clientY / height - 0.5) * 2,
      }
    }

    const animate = (time) => {
      if (!isActiveRef.current) {
        animFrameRef.current = requestAnimationFrame(animate)
        return
      }
      ctx.clearRect(0, 0, width, height)
      const { x: mx, y: my } = mouseRef.current
      const offset = mouseOffset

      nebulaRef.current.forEach((n) => {
        const nx = n.x + mx * offset * 0.5
        const ny = n.y + my * offset * 0.5
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r)
        gradient.addColorStop(0, n.color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      })

      deepStarsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.2 + 0.8
        const opacity = star.baseOpacity * twinkle
        const px = star.x + mx * offset * 0.3 * (star.r / 2)
        const py = star.y + my * offset * 0.3 * (star.r / 2)

        ctx.beginPath()
        ctx.arc(px, py, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240, 237, 232, ${opacity})`
        ctx.fill()
      })

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
        const opacity = star.baseOpacity * twinkle
        const px = star.x + mx * offset * (star.r / 2)
        const py = star.y + my * offset * (star.r / 2)

        ctx.beginPath()
        ctx.arc(px, py, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240, 237, 232, ${opacity})`
        ctx.fill()
      })

      if (time - lastShootingStarRef.current > Math.random() * 3000 + 2000) {
        shootingStarsRef.current.push(createShootingStar())
        lastShootingStarRef.current = time
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.opacity -= ss.decay

        if (ss.opacity <= 0) return false

        const tailX = ss.x - Math.cos(ss.angle) * ss.len
        const tailY = ss.y - Math.sin(ss.angle) * ss.len

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
        gradient.addColorStop(0, `rgba(240, 237, 232, 0)`)
        gradient.addColorStop(1, `rgba(240, 237, 232, ${ss.opacity})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = ss.r
        ctx.lineCap = 'round'
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(ss.x, ss.y, ss.r * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240, 237, 232, ${ss.opacity})`
        ctx.fill()

        return true
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [mouseOffset])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="galaxy-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
