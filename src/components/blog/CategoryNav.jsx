"use client"

import { useRef } from "react"
import styles from "./CategoryNav.module.css"

export default function CategoryNav({
  categories,
  active,
  counts = {},
  labels = {},
  onSelect,
  ariaLabel = "Lọc blog theo danh mục",
  forceVisible = false,
}) {
  const scrollRef = useRef(null)

  const totalCount = Object.values(counts).reduce((total, value) => total + value, 0)

  return (
    <nav className={styles.wrapper} ref={scrollRef} aria-label={ariaLabel} style={forceVisible ? { display: "block" } : undefined}>
      <div className={styles.track}>
        <button
          type="button"
          className={`${styles.pill} ${active === null ? styles.active : ""}`}
          aria-pressed={active === null}
          onClick={() => onSelect(null)}
        >
          <span className={styles.label}>Tất cả</span>
          <span className={styles.count}>{totalCount}</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.pill} ${active === cat ? styles.active : ""}`}
            aria-pressed={active === cat}
            onClick={() => onSelect(cat)}
          >
            <span className={styles.label}>{labels[cat] || cat}</span>
            <span className={styles.count}>{counts[cat] || 0}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
