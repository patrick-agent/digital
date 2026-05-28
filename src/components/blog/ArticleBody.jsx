"use client"

import { useMemo } from "react"

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
      className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-white prose-li:text-zinc-300 prose-a:text-violet-400"
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  )
}

export function ArticleSummary({ excerpt }) {
  if (!excerpt) return null
  return (
    <section aria-label="summary" className="border-l-3 border-cyan-400 bg-zinc-900/60 rounded-lg p-6 mb-12">
      <p className="text-zinc-400 text-sm leading-relaxed m-0">{excerpt}</p>
    </section>
  )
}
