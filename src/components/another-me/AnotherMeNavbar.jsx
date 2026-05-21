'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './AnotherMeNavbar.module.css';

const sections = [
  { label: 'Home',         href: '#hero' },
  { label: 'About',        href: '#about' },
  { label: 'My Journey',   href: '#timeline' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Services',     href: '#services' },
  { label: 'Contact',      href: '#contact' },
];

export default function AnotherMeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled(y > 50);
          setHidden(y > lastY && y > 100);
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const scrollToSection = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  const navHeight = scrolled ? 58 : 64;

  return (
    <>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}
        aria-label="Digital navigation"
      >
        <div className={styles.inner}>
          <Link href="/digital" className={styles.logo} aria-label="Tachy Artist — Digital">
            <Image
              src="/logo.png"
              alt="Tachy Artist logo"
              width={32}
              height={32}
              className={styles.logoImg}
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Tachy</span>
              <span className={styles.logoTagline}>Digital Marketer</span>
            </div>
          </Link>

          <div className={styles.desktopNav}>
            {sections.map((section) => (
              <a
                key={section.href}
                href={section.href}
                className={`${styles.navLink} ${activeSection === section.href ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.href);
                }}
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className={styles.desktopCta}>
            <a
              href="#contact"
              className={styles.ctaBtn}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contact');
              }}
            >
              Đặt lịch tư vấn
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2.5 10.5L10.5 2.5M10.5 2.5H5M10.5 2.5V8"
                      stroke="currentColor" strokeWidth="1.4"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <button
            className={styles.hamburger}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className={`${styles.line} ${styles.line1} ${isOpen ? styles.open : ''}`} />
            <span className={`${styles.line} ${styles.line2} ${isOpen ? styles.open : ''}`} />
            <span className={`${styles.line} ${styles.line3} ${isOpen ? styles.open : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.mobileDrawer} ${isOpen ? styles.open : ''}`}
        style={{ '--nav-height': `${navHeight}px` }}
        role="dialog"
        aria-hidden={!isOpen}
      >
        {sections.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className={`${styles.mobileLink} ${activeSection === section.href ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(section.href);
            }}
          >
            {section.label}
          </a>
        ))}
        <a
          href="#contact"
          className={styles.mobileCta}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#contact');
          }}
        >
          Đặt lịch tư vấn
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 10.5L10.5 2.5M10.5 2.5H5M10.5 2.5V8"
                  stroke="currentColor" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </>
  );
}
