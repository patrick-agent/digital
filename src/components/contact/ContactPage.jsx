"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./ContactPage.module.css";
import {
  FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon,
  SpotifyIcon, AppleMusicIcon,
} from "../icons/SocialIcons";

const AboutCanvas = dynamic(
  () => import("@/components/artist/about/AboutCanvas"),
  { ssr: false, loading: () => null }
);

const PERSONAS = [
  { id: "artist", label: "Artist" },
  { id: "digital", label: "Digital" },
];

const SOCIALS = [
  { name: "Facebook", icon: FacebookIcon, url: "https://facebook.com/tachy.ngo/" },
  { name: "Instagram", icon: InstagramIcon, url: "https://instagram.com/tachy.ngo/" },
  { name: "YouTube", icon: YouTubeIcon, url: "https://youtube.com/@TachyNgo" },
  { name: "TikTok", icon: TikTokIcon, url: "https://tiktok.com/@tachy.ngo" },
  { name: "Spotify", icon: SpotifyIcon, url: "https://open.spotify.com/artist/6k6IAy0p8zl0cfzBqGvX9G" },
  { name: "Apple Music", icon: AppleMusicIcon, url: "https://music.apple.com/gb/artist/tachy/1818075133" },
];

const PERSONA_CONTENT = {
  artist: {
    badge: "Artist",
    heading: "Let's Create Something Amazing",
    text: "Whether you're a fan, a fellow musician, or a collaborator — I'd love to hear from you. Drop a message and I'll get back to you as soon as possible.",
    emailSubject: "Hello Tachy!",
    reasonOptions: [
      { value: "general", label: "General Inquiry" },
      { value: "collab", label: "Music Collaboration" },
      { value: "booking", label: "Booking / Performance" },
      { value: "press", label: "Press / Media" },
      { value: "other", label: "Other" },
    ],
  },
  digital: {
    badge: "Digital Marketer",
    heading: "Let's Grow Your Brand",
    text: "Looking for performance marketing, analytics dashboards, AI automation, or tech consulting? Book a free 30-min consultation or send me a message.",
    emailSubject: "Digital Marketing Inquiry",
    reasonOptions: [
      { value: "consultation", label: "Free Consultation" },
      { value: "marketing", label: "Performance Marketing" },
      { value: "analytics", label: "Analytics & Dashboard" },
      { value: "ai", label: "AI Automation" },
      { value: "other", label: "Other" },
    ],
  },
};

export default function ContactPageClient() {
  const [persona, setPersona] = useState("artist");
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const content = PERSONA_CONTENT[persona];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      setStatus("idle");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `${form.reason ? `[${form.reason}] ` : ""}${content.emailSubject}`,
          message: form.message,
          persona,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", reason: "", message: "" });
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setForm({ name: "", email: "", reason: "", message: "" });
    setError("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgCanvas}>
        <AboutCanvas />
      </div>
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.overline}>Get in Touch</span>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.subtitle}>
            Whether you&apos;re here for the music or the marketing — I&apos;m
            always open to a good conversation.
          </p>
        </header>

        <div className={styles.personaTabs} role="tablist" aria-label="Select contact persona">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={persona === p.id}
              aria-controls={`panel-${p.id}`}
              className={`${styles.personaTab} ${persona === p.id ? styles.personaTabActive : ""}`}
              onClick={() => setPersona(p.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                  const idx = PERSONAS.findIndex((x) => x.id === persona);
                  const next = e.key === "ArrowLeft"
                    ? (idx - 1 + PERSONAS.length) % PERSONAS.length
                    : (idx + 1) % PERSONAS.length;
                  setPersona(PERSONAS[next].id);
                  document.getElementById(`tab-${PERSONAS[next].id}`)?.focus();
                }
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.grid} role="tabpanel" id={`panel-${persona}`} aria-labelledby={`tab-${persona}`}>
          <aside className={styles.infoCard}>
            <div className={styles.personaBadge}>
              <span className={styles.personaDot} />
              {content.badge}
            </div>
            <h2 className={styles.infoHeading}>{content.heading}</h2>
            <p className={styles.infoText}>{content.text}</p>
            <a href="mailto:ngochithanh1027@gmail.com" className={styles.infoEmail}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              ngochithanh1027@gmail.com
            </a>
            <div className={styles.socialLinks}>
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={s.name}>
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </aside>

          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send a Message</h2>
            <p className={styles.formSubtitle}>
              {persona === "artist"
                ? "I'll respond within 24-48 hours."
                : "Let's schedule a free 30-min consultation."}
            </p>

            {status === "success" ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successText}>
                  Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
                <button onClick={handleReset} className={styles.resetBtn}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">
                    Name <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="reason">Subject</label>
                  <select
                    className={styles.select}
                    id="reason"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject...</option>
                    {content.reasonOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">
                    Message <span style={{ color: "var(--accent-primary)" }}>*</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
