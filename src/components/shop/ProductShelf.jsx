"use client"

import { useEffect, useEffectEvent, useId, useRef, useState } from "react"
import ProductCard from "./ProductCard"
import styles from "./ProductShelf.module.css"

export default function ProductShelf({ products, ariaLabel, actionLabel, onAction }) {
  const viewportRef = useRef(null)
  const regionId = useId()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(products.length > 1)

  const updateControls = useEffectEvent(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth
    setCanScrollPrev(viewport.scrollLeft > 4)
    setCanScrollNext(maxScrollLeft - viewport.scrollLeft > 4)
  })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    updateControls()

    const handleScroll = () => updateControls()
    const handleResize = () => updateControls()

    viewport.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      viewport.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [products.length, updateControls])

  const scrollByViewport = (direction) => {
    const viewport = viewportRef.current
    if (!viewport) return

    const scrollAmount = Math.max(viewport.clientWidth * 0.88, 260)

    viewport.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollByViewport("next")
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollByViewport("prev")
    }
  }

  return (
    <div className={styles.shelf}>
      <div className={styles.toolbar}>
        <p className={styles.hint}>Vuốt ngang hoặc dùng phím mũi tên để quét nhanh các gear trong danh mục này.</p>

        <div className={styles.actionCluster}>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => scrollByViewport("prev")}
              disabled={!canScrollPrev}
              aria-label="Xem sản phẩm preview trước"
              aria-controls={regionId}
            >
              &lt;
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => scrollByViewport("next")}
              disabled={!canScrollNext}
              aria-label="Xem sản phẩm preview tiếp theo"
              aria-controls={regionId}
            >
              &gt;
            </button>
          </div>

          {actionLabel && onAction && (
            <button type="button" className={styles.actionButton} onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      <div
        id={regionId}
        ref={viewportRef}
        className={styles.viewport}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.track}>
          {products.map((product, index) => (
            <div key={product.id} className={styles.item}>
              <ProductCard
                product={product}
                compact
                index={index}
                imageSizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 34vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
