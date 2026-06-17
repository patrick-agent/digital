"use client"

import { useMemo, useEffect, useState, useCallback } from "react"
import { getArticleHeadings } from "@/lib/article-content"
import styles from "./TableOfContents.module.css"

export default function TableOfContents({ content }) {
  const headings = useMemo(() => getArticleHeadings(content), [content])
  const [activeId, setActiveId] = useState(null)
  const [isOpen, setIsOpen] = useState(true)
  const currentActiveId = activeId || headings[0]?.id || null

  function handleClick(e, id) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      window.history.replaceState(null, "", `#${id}`)
    }
  }

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
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <button
        className={styles.header}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <h2 className={styles.title}>Mục lục</h2>
      </button>
      <div className={`${styles.wrapper} ${isOpen ? styles.wrapperOpen : ""}`}>
        <ul className={styles.list}>
          {headings.map((h) => (
            <li key={h.id} className={styles[`h${h.level}`] || styles.h3}>
              <a
                href={`#${h.id}`}
                className={`${styles.link} ${currentActiveId === h.id ? styles.active : ""}`}
                onClick={(e) => handleClick(e, h.id)}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
