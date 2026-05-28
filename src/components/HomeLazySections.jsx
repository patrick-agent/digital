"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const SectionPlaceholder = forwardRef(function SectionPlaceholder(
  { id, minHeight = "100vh" },
  ref
) {
  return <div ref={ref} id={id} style={{ minHeight }} aria-hidden="true" />;
});

const AboutSection = dynamic(() => import("@/components/sections/AboutSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="about" minHeight="100vh" />,
});

const MusicSection = dynamic(() => import("@/components/sections/MusicSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="music" minHeight="100vh" />,
});

const LatestEPSection = dynamic(() => import("@/components/sections/LatestEPSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="latest-ep" minHeight="90vh" />,
});

const DonationSection = dynamic(() => import("@/components/sections/DonationSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="donation" minHeight="70vh" />,
});

const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), {
  ssr: false,
  loading: () => <SectionPlaceholder id="contact" minHeight="100vh" />,
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: false,
  loading: () => <SectionPlaceholder minHeight="55vh" />,
});

function LazyMount({ id, minHeight, children, rootMargin = "400px 0px" }) {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  if (shouldRender) return children;

  return <SectionPlaceholder id={id} minHeight={minHeight} ref={ref} />;
}

export default function HomeLazySections() {
  return (
    <>
      <LazyMount id="about" minHeight="100vh">
        <AboutSection />
      </LazyMount>
      <LazyMount id="music" minHeight="100vh" rootMargin="350px 0px">
        <MusicSection />
      </LazyMount>
      <LazyMount id="latest-ep" minHeight="90vh" rootMargin="300px 0px">
        <LatestEPSection />
      </LazyMount>
      <LazyMount id="donation" minHeight="70vh" rootMargin="250px 0px">
        <DonationSection />
      </LazyMount>
      <LazyMount id="contact" minHeight="100vh" rootMargin="250px 0px">
        <ContactSection />
      </LazyMount>
    </>
  );
}

export function LazyFooter() {
  return (
    <LazyMount minHeight="55vh" rootMargin="250px 0px">
      <Footer />
    </LazyMount>
  );
}
