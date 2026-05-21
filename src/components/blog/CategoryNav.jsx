"use client"

import { useRef } from "react"
import styles from "./CategoryNav.module.css"

export default function CategoryNav({ categories, active, onSelect }) {
  const scrollRef = useRef(null)

  return (
    <nav className={styles.wrapper} ref={scrollRef}>
      <div className={styles.track}>
        <button
          className={`${styles.pill} ${active === null ? styles.active : ""}`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.pill} ${active === cat ? styles.active : ""}`}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  )
}
