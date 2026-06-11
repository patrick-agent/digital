'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, DollarSign, Code, Bot } from 'lucide-react';
import { useVisibilityLoader, useDeviceType } from '@/hooks/useVisibilityLoader';
import styles from './DigitalServices.module.css';

const GridScan = dynamic(
  () => import('@/components/ui/GridScan').then((mod) => mod.GridScan),
  { ssr: false, loading: () => null }
);

const services = [
  {
    slug: "",
    name: "Performance Marketing",
    tagline: "Data-driven Solutions, Full Funnel Approach cho Digital Campaigns",
    features: ["Google & Meta Ads", "SEO/SEM", "Marketing Automation", "etc..."],
    stat: "50+ Projects tôi đã tham gia",
    icon: DollarSign
  },
  {
    slug: "",
    name: "Visualize & Dashboard", 
    tagline: "Xây dựng hệ thống dữ liệu và Dashboard trực quan có insights",
    features: ["Định nghĩa Metrics", "Cào dữ liệu tự động", "Near real-time dashboard","etc..."],
    stat: "Actionable & Decision Making",
    icon: TrendingUp
  },
  {
    slug: "",
    name: "AI Vibe Coding",
    tagline: "Chỉ cần ý tưởng, AI thực thi và chúng ta QC kết quả",
    features: ["Opencode, VS Code, Claude Code,...", "Automation scripts", "AI integration","etc..."],
    stat: "10x faster",
    icon: Code
  },
  {
    slug: "",
    name: "AI Agent Building",
    tagline: "Custom AI agents cho quy trình của bạn",
    features: ["n8n / make.com workflows", "Custom agents", "Process automation", "Nuôi tôm - Openclaw"],
    stat: "80% time saved",
    icon: Bot
  },
];

export default function DigitalServices() {
  const sectionRef = useRef(null);
  const { ref: visibilityRef, isVisible } = useVisibilityLoader({ rootMargin: '100px' });
  const deviceType = useDeviceType();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx;
    let cancelled = false;
    (async () => {
      const gsapModule = await import('gsap');
      const scrollModule = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      const gsap = gsapModule.default || gsapModule;
      const ScrollTrigger = scrollModule.ScrollTrigger || scrollModule.default?.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const header = section.querySelector(`.${styles.header}`);
        if (!header) return;

        gsap.fromTo(header, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        });
      }, section);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="services" ref={(el) => { sectionRef.current = el; visibilityRef.current = el; }} className={styles.section}>
      {isVisible && <div className={styles.gridBg}>
        <GridScan
          sensitivity={0.55}
          lineThickness={deviceType === 'mobile' ? 0.8 : 1}
          linesColor="#2F293A"
          gridScale={deviceType === 'mobile' ? 0.2 : 0.1}
          scanColor="#a855f7"
          scanOpacity={deviceType === 'mobile' ? 0.2 : 0.4}
          enablePost={deviceType !== 'mobile'}
          bloomIntensity={deviceType === 'mobile' ? 0 : 0.6}
          chromaticAberration={deviceType === 'mobile' ? 0 : 0.002}
          noiseIntensity={deviceType === 'mobile' ? 0 : 0.01}
          scanGlow={deviceType === 'mobile' ? 0.2 : 0.5}
        />
      </div>}
      <div className={styles.overlay} />
      <div className={styles.header}>
        <span className={styles.label}>What I offer?</span>
        <h2 className={styles.heading}>Tôi có thể cung cấp được gì?</h2>
        <p className={styles.sub}>Hãy đưa tôi ý tưởng và chúng ta cùng thực thi ý tưởng đó</p>
      </div>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <article key={index} className={styles.card}>
            <div className={styles.gradientOverlay} />
            <div className={styles.iconWrapper}>
              <service.icon size={28} />
            </div>
            <div className={styles.titleWrapper}>
              <span className={styles.sideBar} />
              <span className={styles.title}>{service.name}</span>
            </div>
            <p className={styles.description}>{service.tagline}</p>
            <ul className={styles.featureList}>
              {service.features.map((feature, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.bullet} />
                  {feature}
                </li>
              ))}
            </ul>
            <span className={styles.statBadge}>{service.stat}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
