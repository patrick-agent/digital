import { Geist, Geist_Mono, Caveat } from "next/font/google";
import Script from "next/script";
import SkipLink from "@/components/ui/SkipLink";
import { absoluteUrl, defaultRobots, siteMetadata } from "@/lib/seo";
import "./globals.css";

const siteDescription = siteMetadata.description;

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
  title: "Tachy | Indie Artist, Music Producer & Home Studio Blog",
  description: siteDescription,
  keywords: ["Tachy", "indie artist Việt Nam", "music producer", "home studio", "music production", "audio gear", "blog âm nhạc", "creative strategy"],
  robots: defaultRobots,
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: "rmZiW-EkmfQCHQr7kdW4m4G7Ie9_Dzlu3hpc_KCsrho",
  },
  openGraph: {
    title: "Tachy | Indie Artist, Music Producer & Home Studio Blog",
    description: siteDescription,
    type: "website",
    url: "https://tachy.io.vn",
    siteName: "Tachy",
    images: [
      { url: absoluteUrl("/images/tachy-about.jpg"), width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tachy | Indie Artist, Music Producer & Home Studio Blog",
    description: siteDescription,
    images: [absoluteUrl("/images/tachy-about.jpg")],
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
    <html lang="vi" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body suppressHydrationWarning>
        <SkipLink href="#main-content">Bỏ qua điều hướng tới nội dung chính</SkipLink>
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K9T7TND3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div id="main-content">{children}</div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Tachy",
                  url: "https://tachy.io.vn",
                  description: siteDescription,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: "https://tachy.io.vn/blog?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Person",
                  name: "Tachy",
                  url: "https://tachy.io.vn",
                  sameAs: [
                    "https://open.spotify.com/artist/6k6IAy0p8zl0cfzBqGvX9G",
                    "https://youtube.com/@TachyNgo",
                    "https://music.apple.com/gb/artist/tachy/1818075133",
                  ],
                  image: "https://tachy.io.vn/images/tachy-about.jpg",
                },
              ],
            }),
          }}
        />
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K9T7TND3');`,
          }}
        />
      </body>
    </html>
  );
}
