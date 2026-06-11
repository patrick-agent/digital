import Link from "next/link"
import Image from "next/image"
import {
  formatProductPrice,
  getPrimaryProductImage,
  getProductExcerpt,
} from "@/lib/shop/presentation"
import styles from "@/app/shop/shop-card.module.css"

export default function ProductCard({
  product,
  headingLevel = "h2",
  excerptLength = 150,
  imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  compact = false,
  index = 0,
}) {
  const HeadingTag = headingLevel

  return (
    <article className={styles.card} style={{ "--i": index }}>
      <Link href={`/shop/${product.slug}`} className={styles.cardImageWrap}>
        {getPrimaryProductImage(product) ? (
          <Image
            src={getPrimaryProductImage(product)}
            alt={product.name}
            fill
            sizes={imageSizes}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.imageFallback}>Chưa có ảnh</div>
        )}
      </Link>
      <div className={styles.cardBody}>
        {(product.brand || product.category) && (
          <div className={styles.cardMetaRow}>
            {product.brand && (
              <span className={styles.cardBrand}>{product.brand}</span>
            )}
            {product.category && (
              <span className={styles.cardCategory}>{product.category}</span>
            )}
          </div>
        )}
        <HeadingTag className={styles.cardName}>
          <Link href={`/shop/${product.slug}`} className={styles.cardTitleLink}>
            {product.name}
          </Link>
        </HeadingTag>
        <p className={styles.cardExcerpt}>
          {getProductExcerpt(product.description, excerptLength)}
        </p>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>
            {formatProductPrice(product.price, product.currency)}
          </span>
          {product.affiliateUrl ? (
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`${styles.cardLink} ${compact ? styles.affiliateBtnSmall : ""}`}
              data-no-nav="true"
            >
              Mua ngay
            </a>
          ) : (
            <Link
              href={`/shop/${product.slug}`}
              className={`${styles.cardLink} ${compact ? styles.affiliateBtnSmall : ""}`}
            >
              {compact ? "Xem" : "Xem chi tiết"}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
