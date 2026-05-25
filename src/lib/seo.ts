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
  title: "Artist Portfolio",
  description:
    "Personal artist website — tutorials, insights, and stories about 3D art, music production, and the creative process.",
  siteUrl: "http://localhost:3000",
  author: "Artist Name",
  defaultImage: "/og-image.png",
  twitterHandle: "@artist",
}
