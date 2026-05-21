"use client"

import { useMemo } from "react"
import styles from "./ArticleBody.module.css"

/**
 * Injects `id` attributes into H2/H3 headings inside HTML content
 * so that the TableOfContents component can link to them.
 */
function injectHeadingIds(html) {
  if (!html) return ""
  return html.replace(
    /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
    (match, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, "").trim()
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      if (attrs.includes("id=")) return match
      return `<h${level} id="${id}"${attrs}>${text}</h${level}>`
    }
  )
}

export default function ArticleBody({ content }) {
  const processed = useMemo(() => injectHeadingIds(content), [content])

  return (
    <div
      className={styles.body}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  )
}
