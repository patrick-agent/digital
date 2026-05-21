'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { IconTrendingUp, IconCurrencyDollar, IconCode, IconRobot } from '@tabler/icons-react';
import { GridScan } from '@/components/ui/GridScan';
import styles from './AnotherMeServices.module.css';

const services = [
  {
    slug: "",
    name: "Performance Marketing",
    tagline: "Data-driven Solutions, Full Funnel Approach cho Digital Campaigns",
    features: ["Google & Meta Ads", "SEO/SEM", "Marketing Automation", "etc..."],
    stat: "50+ Projects tôi đã tham gia",
    icon: IconCurrencyDollar
  },
  {
    slug: "",
    name: "Visulization & Dashboard", 
    tagline: "Xây dựng hệ thống dữ liệu và Dashboard trực quan có insights",
    features: ["Định nghĩa Metrics", "Cào dữ liệu tự động", "Near real-time dashboard","etc..."],
    stat: "Actionable & Decision Making",
    icon: IconTrendingUp
  },
  {
    slug: "",
    name: "AI Vibe Coding",
    tagline: "Chỉ cần ý tưởng, AI thực thi và chúng ta QC kết quả",
    features: ["Opencode, VS Code, Claude Code,...", "Automation scripts", "AI integration","etc..."],
    stat: "10x faster",
    icon: IconCode
  },
  {
    slug: "",
    name: "AI Agent Building",
    tagline: "Custom AI agents cho quy trình quy trình của bạn",
    features: ["n8n / make.com workflows", "Custom agents", "Process automation", "Nuôi tôm - Openclaw"],
    stat: "80% time saved",
    icon: IconRobot
  },
];

export default function AnotherMeServices() {
  const sectionRef = useRef(null);

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

      const header = section.querySelector(`.${styles.header}`);

      gsap.fromTo(header, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });

      return () => ScrollTrigger.getAll().forEach(t => t.kill());
    })();
  }, []);

  return (
    <section id="services" ref={sectionRef} className={styles.section}>
      <div className={styles.gridBg}>
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#2F293A"
          gridScale={0.1}
          scanColor="#a855f7"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.header}>
        <span className={styles.label}>What I offer?</span>
        <h2 className={styles.heading}>Tôi có thể cung cấp được gì?</h2>
        <p className={styles.sub}>Hãy đưa tôi ý tưởng và chúng ta cùng thực thi ý tưởng đó</p>
      </div>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <Link key={index} href={`/digital/services/${service.slug}`} className={styles.cardLink}>
            <article className={styles.card}>
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
          </Link>
        ))}
      </div>
    </section>
  );
}
