'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import RotatingText from '@/components/ui/RotatingText';
import '@/components/ui/RotatingText.css';
import Galaxy from '@/components/ui/Galaxy';
import { useVisibilityLoader, useDeviceType } from '@/hooks/useVisibilityLoader';
import styles from './DigitalSocialProof.module.css';

const SplineScene = dynamic(
  () => import('@splinetool/react-spline'),
  { ssr: false, loading: () => <div className={styles.splineFallback} /> }
);

const companyLogos = [
  { name: 'Hoàn Mỹ', src: '/company-logos/hoanmy-2.png' },
  { name: 'MegaHome', src: '/company-logos/megahome.png' },
  { name: 'Metamed', src: '/company-logos/metamed.png' },
  { name: 'Phúc Ngọc Tân', src: '/company-logos/phucngoctan.png' },
  { name: 'VinaGame', src: '/company-logos/vinagame.png' },
  { name: 'Yes4All', src: '/company-logos/yes4all.png' },
];

export default function DigitalSocialProof() {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const colLeftRef = useRef(null);
  const colRightRef = useRef(null);
  const { ref: visibilityRef, isVisible } = useVisibilityLoader({ rootMargin: '200px' });
  const deviceType = useDeviceType();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let gsap, ScrollTrigger;
    (async () => {
      const gsapModule = await import('gsap');
      const scrollModule = await import('gsap/ScrollTrigger');
      gsap = gsapModule.default || gsapModule;
      ScrollTrigger = scrollModule.ScrollTrigger || scrollModule.default?.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(colLeftRef.current, { x: -60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });

      gsap.fromTo(colRightRef.current, { opacity: 0 }, {
        opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });

      return () => ScrollTrigger.getAll().forEach(t => t.kill());
    })();
  }, []);

  return (
    <section id="about" ref={(el) => { sectionRef.current = el; visibilityRef.current = el; }} className={styles.section}>
      {isVisible && <div className={styles.galaxyBg}>
        <Galaxy
          hueShift={270}
          density={deviceType === 'mobile' ? 0.5 : 1.2}
          glowIntensity={deviceType === 'mobile' ? 0.2 : 0.4}
          saturation={deviceType === 'mobile' ? 0.3 : 0.6}
          starSpeed={0.3}
          mouseRepulsion={false}
          twinkleIntensity={deviceType === 'mobile' ? 0.1 : 0.2}
          rotationSpeed={0.05}
          speed={deviceType === 'mobile' ? 0.5 : 1.0}
        />
      </div>}
      <div className={styles.container}>
        <div className={styles.heroRow}>
          <div ref={colLeftRef} className={styles.colLeft}>
            <div className={styles.glassCard}>
              <div className={styles.textFlipContainer}>
                <span className={styles.iamText}>I&apos;m a </span>
                <span className={styles.rotatingBox}>
                  <RotatingText
                    texts={['CREATOR', 'BUILDER', 'NAVIGATOR','OPTIMIZER','PLANNER','RESEARCHER']}
                    mainClassName={styles.rotatingText}
                    staggerFrom="last"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-120%', opacity: 0 }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </span>
              </div>

              <p className={styles.badge}>
                DIGITAL MARKETER · DATA ANALYST · GRAPHIC DESIGNER
              </p>

              <h2 className={styles.heading}>
                One Life but Multiple Paths
              </h2>

              <p className={styles.subheading}>
                Digital nói chung là một mảng rất rộng nên để bao quát hết tất cả mọi thứ
                thì gần như là không thể, nhưng tôi luôn cố gắng để có thể trải nghiệm
                và làm chủ càng nhiều công cụ và kỹ năng liên quan đến digital marketing càng tốt.
                Dù là chạy quảng cáo, phân tích dữ liệu, thiết kế đồ họa hay tự động hóa quy trình làm việc,
                tôi đều đam mê khám phá và áp dụng chúng để tạo ra giá trị thực sự.
              </p>

              <div className={styles.buttonRow}>
                <Link href="https://drive.google.com/file/d/18NdT1ygCIZdYxzHPWU85uUkVxLfeTACq/view?usp=sharing" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Download my Resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              </div>

              <div className={styles.logoBarWrapper}>
                <p className={styles.logoBarTitle}>Những Doanh nghiệp mà tôi đã đồng hành:</p>
                <div className={styles.logoBar}>
                  <div ref={marqueeRef} className={styles.marqueeTrack}>
                    <div className={styles.marqueeContent}>
                      {[...companyLogos, ...companyLogos].map((logo, i) => (
                        <div key={i} className={styles.logoItem}>
                          <img
                            src={logo.src}
                            alt={logo.name}
                            className={styles.logoImg}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={colRightRef} className={styles.colRight}>
            <div className={styles.splineContainer}>
              {isVisible && <SplineScene scene="https://prod.spline.design/xc5ykxFbQXgCsObK/scene.splinecode" />}
              <div className={styles.splineOverlay} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
