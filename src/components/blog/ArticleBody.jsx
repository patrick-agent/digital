import { enhanceArticleContent } from "@/lib/article-content"
import styles from "./ArticleBody.module.css"

export default function ArticleBody({ content }) {
  const processed = enhanceArticleContent(content)

  return (
    <div
      className={styles.body}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  )
}

export function ArticleSummary({ excerpt }) {
  if (!excerpt) return null
  return (
    <section aria-label="Article summary" className={styles.summary}>
      <span className={styles.summaryLabel}>Quick Read</span>
      <p className={styles.summaryText}>{excerpt}</p>
    </section>
  )
}
