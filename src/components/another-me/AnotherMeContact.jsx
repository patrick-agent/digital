'use client';

import Link from 'next/link';
import SoftAurora from '@/components/ui/SoftAurora';
import styles from './AnotherMeContact.module.css';

export default function AnotherMeContact() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.auroraBg}>
        <SoftAurora
          speed={0.4}
          scale={1.8}
          brightness={0.8}
          color1="#6c5ee8"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.2}
          octaveDecay={0.15}
          layerOffset={1.5}
          colorSpeed={0.5}
          enableMouseInteraction={false}
          mouseInfluence={0.2}
        />
      </div>
      <div className={styles.contentCard}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Ready to get started?
        </div>

        <h2 className={styles.heading}>Bạn đã sẵn sàng chưa? Tôi đã sẵn sàng!</h2>

        <p className={styles.subtext}>Đặt lịch tư vấn miễn phí 30 phút. Không cam kết.</p>

        <div className={styles.buttons}>
          <Link href="mailto:ngochithanh1027@gmail.com" className={styles.btnPrimary}>
            Đặt lịch tư vấn
            <svg className={styles.arrowIcon} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3L10 7.5L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
