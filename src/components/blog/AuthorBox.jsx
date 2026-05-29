import Image from "next/image"
import styles from "./AuthorBox.module.css"

export default function AuthorBox() {
  return (
    <section className={styles.author} aria-label="Author">
      <Image
        src="/images/tachy-about.jpg"
        alt="Tachy"
        width={88}
        height={88}
        className={styles.avatar}
      />
      <div className={styles.content}>
        <div>
          <h2 className={styles.name}>Tachy</h2>
          <p className={styles.role}>Independent Artist</p>
        </div>
        <p className={styles.bio}>
          Tachy chia sẻ các góc nhìn về âm nhạc, sáng tạo số, 3D web và cách xây dựng trải nghiệm nghệ thuật hiện đại.
        </p>
        <a className={styles.follow} href="https://youtube.com/@TachyNgo" target="_blank" rel="noreferrer">
          Follow
        </a>
      </div>
    </section>
  )
}
