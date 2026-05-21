export const SITE_CONFIG = {
  name: "Studio 3D",
  tagline: "Interactive Music Portfolio",
  description:
    "An immersive 3D interactive music portfolio experience.",
};

export const THEME = {
  colors: {
    accentPrimary: "#a855f7",
    accentSecondary: "#6366f1",
    accentTertiary: "#ec4899",
    accentWarm: "#f59e0b",
    accentCool: "#06b6d4",
    bgPrimary: "#060608",
    bgSecondary: "#0c0c12",
    bgTertiary: "#12121c",
    textPrimary: "#f0f0f5",
    textSecondary: "#a0a0b8",
    textMuted: "#5a5a72",
  },
  gradients: {
    primary: "linear-gradient(135deg, #a855f7, #6366f1)",
    warm: "linear-gradient(135deg, #ec4899, #f59e0b)",
    cool: "linear-gradient(135deg, #6366f1, #06b6d4)",
    text: "linear-gradient(135deg, #f0f0f5 0%, #a855f7 50%, #ec4899 100%)",
  },
  blur: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    xl: "32px",
  },
};

export const CAMERA = {
  defaultPosition: [0, 0, 5],
  fov: 75,
};

export const SCROLL_SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "music", label: "Music" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

export const CINEMATIC = {
  bloom: {
    luminanceThreshold: 0.2,
    luminanceSmoothing: 0.08,
    mipmapBlur: true,
    intensity: 1.5,
    radius: 0.5,
  },
  colorGrading: {
    brightness: 1.05,
    contrast: 1.1,
    saturation: 1.15,
  },
  noise: {
    opacity: 0.035,
  },
  vignette: {
    darkness: 0.6,
    offset: 0.4,
  },
};
