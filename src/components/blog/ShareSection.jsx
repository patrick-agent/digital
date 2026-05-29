"use client"

import { useState } from "react"
import styles from "./ShareSection.module.css"

export default function ShareSection({ title, url }) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className={styles.share} aria-labelledby="share-title">
      <p id="share-title" className={styles.title}>Chia sẻ bài viết</p>
      <div className={styles.actions}>
        <a
          className={styles.button}
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noreferrer"
        >
          X
        </a>
        <a
          className={styles.button}
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
        <a
          className={styles.button}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <button className={styles.button} type="button" onClick={copyLink}>
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </section>
  )
}
