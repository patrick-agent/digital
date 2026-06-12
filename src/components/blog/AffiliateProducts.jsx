import ProductCard from "@/components/shop/ProductCard"
import styles from "./AffiliateProducts.module.css"

export default function AffiliateProducts({ products }) {
  if (!products?.length) return null

  return (
    <aside className={styles.section} aria-label="Sản phẩm affiliate trong bài viết">
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>ARTICLE picks</span>
          <h2 className={styles.title}>Sản phẩm được nhắc trong bài viết</h2>
        </header>

        <div className={styles.viewport}>
          <div className={styles.track}>
            {products.map((product, index) => (
              <div key={product.id} className={styles.item}>
                <ProductCard
                  product={product}
                  headingLevel="h3"
                  excerptLength={118}
                  imageSizes="(max-width: 1024px) 100vw, 320px"
                  compact
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
