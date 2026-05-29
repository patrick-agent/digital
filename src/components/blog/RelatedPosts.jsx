import PostCard from "./PostCard"
import styles from "./RelatedPosts.module.css"

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Related Posts</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  )
}
