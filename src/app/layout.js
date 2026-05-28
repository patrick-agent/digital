import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";

/**
 * Optimized font loading with display settings for better performance
 * - font-display: 'swap' prevents layout shift and shows fallback immediately
 * - Only loading critical font weights for each typeface
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Show fallback text immediately
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  preload: false,
});

export const metadata = {
  metadataBase: new URL('https://tachy.io.vn'),
  title: "Tachy — An Indie Artist",
  description:
    "An immersive 3D interactive music portfolio experience. Explore sound, visuals, and creativity in a dreamy studio space.",
  keywords: ["music", "portfolio", "3D", "interactive", "studio", "artist", "Tachy", "indie"],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Tachy — An Indie Artist",
    description:
      "An immersive 3D interactive music portfolio experience.",
    type: "website",
    url: "https://tachy.io.vn",
    siteName: "Tachy",
    images: [
      { url: "/apple-touch-icon.png", width: 180, height: 180 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tachy — An Indie Artist",
    description:
      "An immersive 3D interactive music portfolio experience.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060608",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
