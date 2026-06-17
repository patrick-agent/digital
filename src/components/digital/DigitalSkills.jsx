'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import RippleGrid from '@/components/ui/RippleGrid';
import { useVisibilityLoader, useDeviceType } from '@/hooks/useVisibilityLoader';
import styles from './DigitalSkills.module.css';

const skillClusters = [
  { cluster: "Paid Media", color: [0, 245, 212], 
    headline: "Đánh đúng người, đúng thời điểm",
    description: "Tối ưu ngân sách trên mọi nền tảng ads với data-driven targeting.",
    skills: ["Google Ads", "Meta Ads", "TikTok Ads", "YouTube Ads", "E-Commerce", "etc"] },
  { cluster: "Analytics", color: [245, 158, 11], 
    headline: "Đo lường. Phân tích. Tối ưu.",
    description: "Biến dữ liệu thô thành insight hành động được.",
    skills: ["GA4", "GTM", "Looker Studio", "SQL", "Power BI", "Superset", "API","etc"] },
  { cluster: "Strategy", color: [129, 140, 248], 
    headline: "Chiến lược trước, công cụ sau",
    description: "Xây dựng growth funnel từ TOFU, MOFU đến LOFU.",
    skills: ["Brand Strategy", "Funnel Design", "CR Optimization", "Market Research", "Project Management", "etc"] },
  { cluster: "Creative", color: [251, 113, 133], 
    headline: "Content Always is King",
    description: "Từ concept đến production, mọi creative đều gắn liền với mục tiêu.",
    skills: ["Copywriting", "Design & Editing", "Video Brief", "Creative Strategy", "Storytelling", "etc"] },
  { cluster: "Tech & AI", color: [52, 211, 153], 
    headline: "Hệ thống và tự động hóa mọi thứ",
    description: "AI agents, automation workflows, và vibe coding để scale nhanh hơn.",
    skills: ["n8n", "make.com", "Prompt Engineering", "AI Agents", "Vibe Coding","etc"] },
];

const toolLogos = [
  { name: "Google Ads", src: "/tool-logos/google-ads.png" },
  { name: "Meta Ads", src: "/tool-logos/meta-ads.png" },
  { name: "TikTok Ads", src: "/tool-logos/tiktok-ads.png" },
  { name: "GA4", src: "/tool-logos/GA4.png" },
  { name: "GTM", src: "/tool-logos/GTM.png" },
  { name: "Looker Studio", src: "/tool-logos/lookerstudio.png" },
  { name: "SQL", src: "/tool-logos/SQL.png" },
  { name: "Power BI", src: "/tool-logos/power-bi.png" },
  { name: "Superset", src: "/tool-logos/superset.png" },
  { name: "n8n", src: "/tool-logos/n8n.png" },
  { name: "Make.com", src: "/tool-logos/make.com.png" },
  { name: "Photoshop", src: "/tool-logos/photoshop.png" },
  { name: "Illustrator", src: "/tool-logos/illustrator.png" },
  { name: "After Effects", src: "/tool-logos/after-effect.png" },
  { name: "Premiere Pro", src: "/tool-logos/premiere-pro.png" },
];

export default function DigitalSkills() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidthPercent, setCardWidthPercent] = useState(33.333);
  const carouselRef = useRef(null);
  const { ref: sectionRef, isVisible } = useVisibilityLoader({ rootMargin: '100px' });
  const deviceType = useDeviceType();

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth <= 767) {
        setVisibleCards(1);
        setCardWidthPercent(85);
        setCurrentIndex((prev) => Math.min(prev, skillClusters.length - 1));
      } else if (window.innerWidth <= 1023) {
        setVisibleCards(2);
        setCardWidthPercent(50);
        setCurrentIndex((prev) => Math.min(prev, skillClusters.length - 2));
      } else {
        setVisibleCards(3);
        setCardWidthPercent(33.333);
        setCurrentIndex((prev) => Math.min(prev, skillClusters.length - 3));
      }
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const maxIndex = Math.max(0, skillClusters.length - visibleCards);
  const clampedCurrentIndex = Math.min(currentIndex, maxIndex);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    setDragOffset(currentX - startX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = window.innerWidth <= 767 ? 40 : 80;
    if (dragOffset < -threshold && clampedCurrentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    } else if (dragOffset > threshold && clampedCurrentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setDragOffset(0);
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) handlePointerUp();
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging, dragOffset, currentIndex, maxIndex]);

  return (
    <section id="skills" ref={sectionRef} className={styles.section}>
      {isVisible && <div className={styles.rippleBg}>
        <RippleGrid
          enableRainbow={false}
          gridColor="#a855f7"
          rippleIntensity={deviceType === 'mobile' ? 0.01 : 0.03}
          gridSize={deviceType === 'mobile' ? 6 : 8}
          gridThickness={deviceType === 'mobile' ? 8 : 12}
          mouseInteraction={deviceType !== 'mobile'}
          mouseInteractionRadius={1.5}
          opacity={deviceType === 'mobile' ? 0.3 : 0.6}
          glowIntensity={deviceType === 'mobile' ? 0.05 : 0.15}
        />
      </div>}
      <div className={styles.header}>
        <span className={styles.label}>THE ARSENAL</span>
        <h2 className={styles.heading}>Bộ kỹ năng của tôi</h2>
        <p className={styles.sub}>Đây là tất cả những kỹ năng từ cơ bản đến nâng cao mà tôi đã và đang sở hữu.</p>
      </div>

      <div
        ref={carouselRef}
        className={styles.carouselWrapper}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => isDragging && handlePointerUp()}
      >
        <motion.div
          className={styles.carouselTrack}
          animate={{ x: `calc(-${clampedCurrentIndex * cardWidthPercent}% + ${dragOffset}px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {skillClusters.map((cluster, index) => (
            <Card key={index} title={cluster.cluster} color={cluster.color} headline={cluster.headline} description={cluster.description} skills={cluster.skills} />
          ))}
        </motion.div>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>

      <div className={styles.logoSection}>
        <h3 className={styles.logoTitle}>Bộ công cụ của tôi</h3>
        <p className={styles.logoSubtitle}>Những công cụ tôi có thể sử dụng từ cơ bản đến nâng cao</p>

        <div className={styles.logoMarquee}>
          <div className={styles.logoTrack}>
            {[...toolLogos, ...toolLogos].map((logo, i) => (
              <div key={i} className={styles.logoItem}>
                <img src={logo.src} alt={logo.name} className={styles.logoImg} loading="lazy" />
              </div>
            ))}
          </div>
          <div className={styles.logoTrackReverse}>
            {[...toolLogos, ...toolLogos].map((logo, i) => (
              <div key={`r-${i}`} className={styles.logoItem}>
                <img src={logo.src} alt={logo.name} className={styles.logoImg} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Card = memo(function Card({ title, color, headline, description, skills }) {
  const [hovered, setHovered] = useState(false);
  const rgb = color.join(',');

  return (
    <div className={styles.card}>
      <div
        className={styles.cardInner}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className={`${styles.cornerIcon} ${styles.topLeft}`} />
        <span className={`${styles.cornerIcon} ${styles.bottomLeft}`} />
        <span className={`${styles.cornerIcon} ${styles.topRight}`} />
        <span className={`${styles.cornerIcon} ${styles.bottomRight}`} />

        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle} style={{ color: hovered ? `rgb(${rgb})` : 'var(--am-text)', borderColor: `rgba(${rgb}, ${hovered ? 0.5 : 0.2})` }}>{title}</h3>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.canvasOverlay}
            >
              <CanvasRevealEffect
                animationSpeed={3}
                containerClassName={styles.canvasContainer}
                colors={[color]}
                dotSize={2.5}
                opacities={[0.1, 0.2, 0.25, 0.45, 0.5, 0.55, 0.6, 0.65, 0.8, 0.9]}
                showGradient={false}
              />
              <div className={styles.gradientOverlay} />
              <div className={styles.hoverContent}>
                <div className={styles.hoverText}>
                  <h4 className={styles.hoverHeadline} style={{ color: `rgb(${rgb})` }}>{headline}</h4>
                  <p className={styles.hoverDescription}>{description}</p>
                </div>
                <div className={styles.skillsList}>
                  {skills.map((skill, i) => (
                    <span key={i} className={styles.skillTag} style={{ borderColor: `rgba(${rgb}, 0.3)` }}>{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
