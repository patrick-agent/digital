process.loadEnvFile(".env")
import sharp from "sharp"
import { readPosts, updatePost } from "../src/lib/db.js"
import { mkdir } from "fs/promises"
import path from "path"

const { data: posts } = await readPosts({ status: "published", limit: 200 })
const targets = posts.filter(p => !p.coverImage)
console.log("Posts needing cover images: " + targets.length)

// Color themes for each category
const themes = {
  "san-xuat-nhac":      { colors: ["#667eea", "#764ba2"], gradient: "vertical" },
  "the-loai-nhac":      { colors: ["#f093fb", "#f5576c"], gradient: "vertical" },
  "review-thiet-bi":    { colors: ["#4facfe", "#00f2fe"], gradient: "vertical" },
  "kien-thuc-am-nhac":  { colors: ["#43e97b", "#38f9d7"], gradient: "vertical" },
  "thu-am-tai-nha":     { colors: ["#fa709a", "#fee140"], gradient: "vertical" },
  "default":            { colors: ["#a18cd1", "#fbc2eb"], gradient: "vertical" }
}

const accentColors = {
  "san-xuat-nhac": "#a855f7",
  "the-loai-nhac": "#f43f5e",
  "review-thiet-bi": "#06b6d4",
  "kien-thuc-am-nhac": "#22c55e",
  "thu-am-tai-nha": "#f59e0b",
  "default": "#8b5cf6"
}

const OUT_DIR = path.join(process.cwd(), "public", "images", "blog")
await mkdir(OUT_DIR, { recursive: true })

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function chunkText(text, maxChars = 25) {
  const words = text.split(" ")
  const lines = []
  let current = ""
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim()
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

for (const post of targets) {
  const theme = themes[post.category] || themes.default
  const accent = accentColors[post.category] || accentColors.default
  const [r1, g1, b1] = hexToRgb(theme.colors[0])
  const [r2, g2, b2] = hexToRgb(theme.colors[1])

  const WIDTH = 1200, HEIGHT = 630
  const lines = chunkText(post.title, 28)

  // Create SVG overlay with text
  let svgText = ""
  const startY = 240
  for (let i = 0; i < lines.length; i++) {
    svgText += `<text x="600" y="${startY + i * 65}" font-family="'Segoe UI','Arial',sans-serif" font-size="${i === 0 && lines.length > 1 ? 48 : 50}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${lines[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>\n`
  }

  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${theme.colors[0]}" />
        <stop offset="100%" style="stop-color:${theme.colors[1]}" />
      </linearGradient>
      <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:rgba(0,0,0,0)" />
        <stop offset="100%" style="stop-color:rgba(0,0,0,0.4)" />
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#overlay)" />
    <!-- Decorative circles -->
    <circle cx="100" cy="100" r="200" fill="rgba(255,255,255,0.05)" />
    <circle cx="1100" cy="500" r="250" fill="rgba(255,255,255,0.05)" />
    <circle cx="200" cy="500" r="150" fill="rgba(255,255,255,0.03)" />
    <!-- Accent line -->
    <rect x="400" y="180" width="400" height="4" rx="2" fill="${accent}" />
    <!-- Text -->
    ${svgText}
    <!-- Domain -->
    <text x="600" y="560" font-family="'Segoe UI','Arial',sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">tachy.io.vn</text>
  </svg>`

  const filename = post.slug + ".webp"
  const filepath = path.join(OUT_DIR, filename)

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: r1, g: g1, b: b1, alpha: 1 }
    }
  })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 }
    ])
    .webp({ quality: 85 })
    .toFile(filepath)

  const imagePath = "/images/blog/" + filename
  await updatePost(post.id, { coverImage: imagePath })
  console.log("  ✅ " + post.slug + " → " + imagePath)
}

console.log("\nDone! Generated " + targets.length + " cover images")
