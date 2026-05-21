'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import LiquidEther from '@/components/ui/LiquidEther';
import styles from './AnotherMeContact.module.css';

export default function AnotherMeContact() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    let ctx;
    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from([badgeRef.current, headingRef.current, subRef.current, buttonsRef.current], {
          opacity: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        });
      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      <div className={styles.etherBg}>
        <LiquidEther
          colors={['#7e4fd6', '#9a6fea', '#632abe']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.3}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={2.5}
        />
      </div>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div ref={badgeRef} className={styles.badge}>
          <span className={styles.badgeDot} />
          Ready to get started?
        </div>

        <h2 ref={headingRef} className={styles.heading}>Bạn đã sẵn sàng chưa? Tôi đã sẵn sàng!</h2>

        <p ref={subRef} className={styles.subtext}>Đặt lịch tư vấn miễn phí 30 phút. Không cam kết.</p>

        <div ref={buttonsRef} className={styles.buttons}>
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
