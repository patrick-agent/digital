"use client"

import Link from "next/link"
import { siteMetadata } from "@/lib/seo"
import styles from "./Breadcrumb.module.css"

function absoluteHref(href) {
  if (/^https?:\/\//i.test(href)) return href
  return `${siteMetadata.siteUrl}${href.startsWith("/") ? href : `/${href}`}`
}

export default function Breadcrumb({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteHref(item.href),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        {items.map((item, i) => (
          <span key={item.href} className={styles.item}>
            {i < items.length - 1 ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
