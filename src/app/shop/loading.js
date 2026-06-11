import styles from "./shop-card.module.css"

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonBadge} />
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLineShort} />
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonPrice} />
          <div className={styles.skeletonButton} />
        </div>
      </div>
    </div>
  )
}

export default function ShopLoading() {
  return (
    <div className={styles.gridSection} style={{ paddingTop: "200px" }}>
      <div className={styles.grid}>
        {Array.from({ length: 9 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
