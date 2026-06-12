/**
 * Centralised SEO configuration.
 * Import `siteMetadata` wherever you need site-wide values
 * (e.g. in `generateMetadata` helpers or JSON-LD schemas).
 *
 * ── Replace these values before deploying ──
 *   siteUrl     → your production domain (e.g. https://myartistsite.com)
 *   author      → the artist / site owner name
 *   title       → site name
 *   description → short site description for meta tags
 *   twitterHandle → your Twitter / X handle
 */
export const siteMetadata = {
  title: "Tachy",
  description:
    "Tachy là indie artist và music producer, chia sẻ nhạc, kinh nghiệm home studio, music production, audio gear và creative strategy.",
  siteUrl: "https://tachy.io.vn",
  author: "Tachy",
  defaultImage: "/images/tachy-about.jpg",
  twitterHandle: "@tachy",
}

export const defaultRobots = {
  index: true,
  follow: true,
  "max-snippet": -1,
  "max-image-preview": "large",
  "max-video-preview": -1,
}

export function absoluteUrl(path = "") {
  if (!path) return siteMetadata.siteUrl
  if (/^https?:\/\//i.test(path)) return path
  return `${siteMetadata.siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords,
  image = siteMetadata.defaultImage,
  type = "website",
}) {
  const canonical = absoluteUrl(path)
  const ogImage = absoluteUrl(image)

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: siteMetadata.title,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
    },
    robots: defaultRobots,
  }
}
