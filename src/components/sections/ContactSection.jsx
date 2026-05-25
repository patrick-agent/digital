"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import styles from "./ContactSection.module.css";
import GlassPanel from "../ui/GlassPanel";
import { Canvas } from "@react-three/fiber";
import ParticleField from "../canvas/ParticleField";
import FloatingGeometries from "../canvas/FloatingGeometries";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";
import {
  FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon,
  SpotifyIcon, AppleMusicIcon, AmazonMusicIcon
} from "../icons/SocialIcons";

const RumbaDancingCanvas = dynamic(
  () => import("../canvas/RumbaDancingCanvas"),
  { ssr: false, loading: () => null }
);

const ICON_MAP = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
  Spotify: SpotifyIcon,
  "Apple Music": AppleMusicIcon,
  "Amazon Music": AmazonMusicIcon,
};

const NOTE_LAYERS = [
  { depth: 0, label: "far", blur: 2, speed: 0.02, notes: ["♪", "♫", "♩"] },
  { depth: 1, label: "mid", blur: 0, speed: 0.05, notes: ["♬", "♪", "♫"] },
  { depth: 2, label: "near", blur: 1.5, speed: 0.1, notes: ["♩", "♬", "♪"] },
];

function ParallaxNotes({ mouse }) {
  const layersRef = useRef([]);

  useEffect(() => {
    const layers = layersRef.current;
    if (!layers.length) return;
    layers.forEach((el, i) => {
      if (!el) return;
      const speed = NOTE_LAYERS[i].speed;
      el.style.transform = `translateX(${mouse.x * speed * 50}px) translateY(${mouse.y * speed * 30}px)`;
    });
  }, [mouse]);

  return (
    <div className={styles.parallaxContainer}>
      {NOTE_LAYERS.map((layer) => (
        <div
          key={layer.label}
          className={styles.noteLayer}
          ref={(el) => { layersRef.current[layer.depth] = el; }}
          style={{
            '--blur': `${layer.blur}px`,
            zIndex: layer.depth,
          }}
        >
          {layer.notes.map((glyph, i) => (
            <span
              key={`${layer.label}-${i}`}
              className={styles.note}
              style={{ '--i': i + layer.depth * 3 }}
            >
              {glyph}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const SECTION_CONFIG = {
  startPos: { x: 0, y: -5, z: 0 },
  startRot: { x: 0, y: THREE.MathUtils.degToRad(0), z: 0 },
  startScale: { x: 1.0, y: 1.0, z: 1.0 },
};

function BackgroundLayers({ isMobile, mouse }) {
  const { devicePixelRatio, isVisible, getResponsiveParticleCount } = useCanvasOptimizer({ threshold: 0 });
  const particleCount = getResponsiveParticleCount(200);
  const geoCount = isMobile ? 2 : 5;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
      dpr={devicePixelRatio}
      frameloop={isVisible ? "always" : "demand"}
    >
      <fog attach="fog" args={["#0f0a1a", 15, 35]} />
      <ambientLight intensity={0.5} />
      <ParticleField count={Math.floor(particleCount * 0.5)} color="#a855f7" spread={25} size={0.015} opacity={0.08} mouseReactive={!isMobile} depth={-5} />
      <ParticleField count={Math.floor(particleCount * 0.35)} color="#c084fc" spread={18} size={0.025} opacity={0.12} mouseReactive={!isMobile} depth={0} />
      <ParticleField count={Math.floor(particleCount * 0.15)} color="#e879f9" spread={10} size={0.035} opacity={0.18} mouseReactive={!isMobile} depth={5} />
      {!isMobile && <FloatingGeometries count={geoCount} color="#9333ea" spread={14} size={0.15} />}
    </Canvas>
  );
}

const SOCIAL_CHANNELS = [
  { name: "Facebook", handle: "@tachy.ngo", url: "https://facebook.com/tachy.ngo/" },
  { name: "Instagram", handle: "@tachy.ngo", url: "https://instagram.com/tachy.ngo/" },
  { name: "YouTube", handle: "@TachyNgo", url: "https://youtube.com/@TachyNgo" },
  { name: "TikTok", handle: "@tachy.ngo", url: "https://tiktok.com/@tachy.ngo" },
  { name: "Spotify", handle: "Tachy", url: "https://open.spotify.com/artist/6k6IAy0p8zl0cfzBqGvX9G" },
  { name: "Apple Music", handle: "Tachy", url: "https://music.apple.com/gb/artist/tachy/1818075133" },
  { name: "Amazon Music", handle: "Tachy", url: "https://music.amazon.com/artists/B0FBMQJR61/tachy" },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const characterRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const [charReady, setCharReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { isMobile, isTablet } = useCanvasOptimizer();
  const isSmall = isMobile || isTablet;

  const autoScrollRef = useRef(null);
  const scrollPosRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) return;
    const animate = () => {
      if (!isDraggingRef.current && scrollTrackRef.current) {
        scrollPosRef.current += 0.5;
        const maxScroll = scrollTrackRef.current.scrollWidth - scrollTrackRef.current.clientWidth;
        if (scrollPosRef.current > maxScroll) scrollPosRef.current = 0;
        scrollTrackRef.current.scrollLeft = scrollPosRef.current;
      }
      autoScrollRef.current = requestAnimationFrame(animate);
    };
    scrollTrackRef.current.scrollLeft = scrollPosRef.current;
    autoScrollRef.current = requestAnimationFrame(animate);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.touches[0].clientX;
    stopAutoScroll();
  }, [stopAutoScroll]);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current || !scrollTrackRef.current) return;
    const dx = lastXRef.current - e.touches[0].clientX;
    scrollPosRef.current += dx;
    const maxScroll = scrollTrackRef.current.scrollWidth - scrollTrackRef.current.clientWidth;
    if (scrollPosRef.current < 0) scrollPosRef.current = 0;
    if (scrollPosRef.current > maxScroll) scrollPosRef.current = maxScroll;
    scrollTrackRef.current.scrollLeft = scrollPosRef.current;
    lastXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    startAutoScroll();
  }, [startAutoScroll]);

  useEffect(() => {
    if (!isSmall || !visible || !scrollTrackRef.current) return;
    scrollPosRef.current = 0;
    const timer = setTimeout(() => startAutoScroll(), 500);
    return () => { clearTimeout(timer); stopAutoScroll(); };
  }, [isSmall, visible, startAutoScroll, stopAutoScroll]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isSmall) return;
    const interval = setInterval(() => {
      if (characterRef.current?.current) { setCharReady(true); clearInterval(interval); }
    }, 50);
    return () => clearInterval(interval);
  }, [isSmall]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setError("");

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Vui lòng điền đầy đủ thông tin!");
      setFormStatus("idle");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ!");
      setFormStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
        setFormStatus("error");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
      setFormStatus("error");
    }
  };

  return (
    <section id="contact" className={styles.contact} ref={sectionRef} onMouseMove={!isSmall ? handleMouseMove : undefined}>
      <div className={styles.contactBg}>
        <div className={styles.lightRays} />
        <div className={styles.gradientOverlay} />
        {!isSmall && <ParallaxNotes mouse={mouse} />}
        <div className={styles.fogOverlay} />
      </div>

      {visible && <BackgroundLayers isMobile={isMobile} />}

      {isSmall && visible && (
        <div className={styles.scrollTrackOverlay}>
          <div className={styles.trackTitle}>Follow Me</div>
          <div
            ref={scrollTrackRef}
            className={styles.scrollTrack}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.scrollTrackInner}>
              {SOCIAL_CHANNELS.map((channel) => {
                const IconComponent = ICON_MAP[channel.name];
                return (
                  <a
                    key={channel.name}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.scrollCard}
                  >
                    <div className={styles.socialIcon}><IconComponent size={24} /></div>
                    <div className={styles.socialInfo}>
                      <h4>{channel.name}</h4>
                      <p>{channel.handle}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className={styles.contactContent}>
        {!isSmall && <div className={styles.characterContainer}>
          <RumbaDancingCanvas
            ref={characterRef}
            isMobile={isMobile}
            sectionVisible={visible}
            initialPos={[SECTION_CONFIG.startPos.x, SECTION_CONFIG.startPos.y, SECTION_CONFIG.startPos.z]}
            initialRot={[SECTION_CONFIG.startRot.x, SECTION_CONFIG.startRot.y, SECTION_CONFIG.startRot.z]}
            initialScale={[SECTION_CONFIG.startScale.x, SECTION_CONFIG.startScale.y, SECTION_CONFIG.startScale.z]}
          />
        </div>}

        <div className={styles.uiOverlay}>
          {!isSmall && <div className={styles.leftContainer}>
            <GlassPanel variant="dark" glow style={{ padding: "30px 25px" }}>
              <h2 className={styles.socialTitle}>Follow Me</h2>
              <p className={styles.socialSubtitle}>
                Stay connected with Tachy across all platforms
              </p>
              <div className={styles.socialLinks}>
                {SOCIAL_CHANNELS.map((channel) => {
                  const IconComponent = ICON_MAP[channel.name];
                  return (
                    <a
                      key={channel.name}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <div className={styles.socialIcon}><IconComponent size={24} /></div>
                      <div className={styles.socialInfo}>
                        <h4>{channel.name}</h4>
                        <p>{channel.handle}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </GlassPanel>
          </div>}

          <div className={styles.rightContainer}>
            <GlassPanel variant="dark" glow style={{ padding: "30px 25px" }}>
              <h2 className={styles.formTitle}>Get In Touch</h2>
              <p className={styles.formSubtitle}>
                Have questions? Send Tachy a message!
              </p>

              {formStatus === "success" ? (
                <div className={styles.successMessage}>
                  Cảm ơn bạn! Tin nhắn đã được gửi thành công.
                </div>
              ) : (
                <form className={styles.contactForm} onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  {error && <div className={styles.errorMessage}>{error}</div>}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}