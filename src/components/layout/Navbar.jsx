"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Navbar.module.css";
import { enabledItems, mergeSiteSettings } from "@/lib/site-defaults";

export default function Navbar({ settings }) {
  const siteSettings = mergeSiteSettings(settings);
  const branding = siteSettings.branding;
  const navLinks = enabledItems(siteSettings.navigation);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isMenuOpen]);

  const handleDrawerKeyDown = useCallback((e) => {
    if (e.key !== "Tab") return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand} id="nav-brand">
          <div className={styles.logoMark}>
            <img
              src={branding.logoUrl || "/logo.png"}
              alt={`${branding.siteName || "Tachy"} Logo`}
              width={52}
              height={52}
              fetchPriority="high"
              decoding="sync"
              className={styles.logoImage}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>{branding.siteName}</span>
            <span className={styles.brandSub}>{branding.siteSubtitle}</span>
          </div>
        </Link>

        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`${styles.navLink} ${activeSection === link.id ? styles.navLinkActive : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          ref={hamburgerRef}
          id="nav-hamburger"
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        <a href={branding.navCtaHref || "/#music"} className={styles.cta} id="nav-listen-now">
          <span className={styles.ctaPulse} />
          <svg
            className={styles.ctaIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
          {branding.navCtaLabel || "Listen Now"}
        </a>
      </nav>

      <div
        className={`${styles.drawerBackdrop} ${isMenuOpen ? styles.backdropOpen : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={handleDrawerKeyDown}
      >
        <div className={styles.drawerContent}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`${styles.drawerLink} ${activeSection === link.id ? styles.drawerLinkActive : ""}`}
              onClick={handleNavClick}
            >
              {link.label}
            </a>
          ))}
          <a
            href={branding.navCtaHref || "/#music"}
            className={styles.drawerCta}
            onClick={handleNavClick}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            {branding.navCtaLabel || "Listen Now"}
          </a>
        </div>
      </div>
    </header>
  );
}
