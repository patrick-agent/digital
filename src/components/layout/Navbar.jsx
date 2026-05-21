"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/#hero", id: "hero", label: "Home" },
  { href: "/#about", id: "about", label: "About" },
  { href: "/#music", id: "music", label: "Music" },
  { href: "/#latest-ep", id: "latest-ep", label: "Lastest EP" },
  { href: "/#donation", id: "donation", label: "Support" },
  { href: "/#contact", id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

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

    NAV_LINKS.forEach(({ id }) => {
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
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.nav}>
        <a href="/" className={styles.brand} id="nav-brand">
          <div className={styles.logoMark}>
            <Image
              src="/logo.png"
              alt="Tachy Logo"
              width={52}
              height={52}
              className={styles.logoImage}
              priority
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Tachy</span>
            <span className={styles.brandSub}>An Indie Artist</span>
          </div>
        </a>

        <div className={styles.desktopLinks}>
          {NAV_LINKS.map((link) => (
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

        <a href="/#music" className={styles.cta} id="nav-listen-now">
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
          Listen Now
        </a>
      </nav>

      <div
        className={`${styles.drawerBackdrop} ${isMenuOpen ? styles.backdropOpen : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={styles.drawerContent}>
          {NAV_LINKS.map((link) => (
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
            href="/#music"
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
            Listen Now
          </a>
        </div>
      </div>
    </header>
  );
}
