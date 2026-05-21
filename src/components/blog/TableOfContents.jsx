"use client"

import { useMemo, useEffect, useState, useCallback } from "react"
import styles from "./TableOfContents.module.css"

function parseHeadings(html) {
  if (!html) return []
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi
  const headings = []
  let match
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
    })
  }
  return headings
}

export default function TableOfContents({ content }) {
  const headings = useMemo(() => parseHeadings(content), [content])
  const [activeId, setActiveId] = useState(null)

  const handleClick = useCallback((e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const ids = headings.map((h) => h.id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <h2 className={styles.title}>On this page</h2>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li key={h.id} className={h.level === 2 ? styles.h2 : styles.h3}>
            <a
              href={`#${h.id}`}
              className={`${styles.link} ${activeId === h.id ? styles.active : ""}`}
              onClick={(e) => handleClick(e, h.id)}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
