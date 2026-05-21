import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const inputLogo = path.join(rootDir, "..", "Logo-03.png");
const publicDir = path.join(rootDir, "public");
const appDir = path.join(rootDir, "src", "app");

// Site accent colors
const ACCENT_R = 168;
const ACCENT_G = 85;
const ACCENT_B = 247;

/**
 * Generate a favicon that matches the site's color scheme.
 * The original logo is WHITE shape on TRANSPARENT background (already has alpha).
 * We simply re-tint the white pixels to the site's accent purple,
 * preserving the alpha channel so the background stays transparent.
 */
async function generateTintedFavicon(inputBuffer, size) {
  // Scale up 110% then crop to fill entire canvas (removes internal padding)
  const scaledSize = Math.round(size * 1.15);
  const resized = await sharp(inputBuffer)
    .resize(scaledSize, scaledSize, { fit: "cover" })
    .extract({ left: Math.round(scaledSize * 0.045), top: Math.round(scaledSize * 0.045), width: size, height: size })
    .ensureAlpha()
    .png()
    .toBuffer();

  // Process raw pixels: tint white/opaque pixels to accent purple
  const raw = await sharp(resized).raw().toBuffer();
  const pixelCount = size * size;
  const output = Buffer.alloc(pixelCount * 4);

  for (let i = 0; i < pixelCount; i++) {
    const r = raw[i * 4];
    const g = raw[i * 4 + 1];
    const b = raw[i * 4 + 2];
    const a = raw[i * 4 + 3];

    if (a === 0) {
      // Fully transparent pixel — keep transparent
      output[i * 4] = 0;
      output[i * 4 + 1] = 0;
      output[i * 4 + 2] = 0;
      output[i * 4 + 3] = 0;
    } else {
      // Calculate luminance (brightness) of the original pixel
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Tint with accent color, using luminance as brightness factor
      // This preserves shape/detail while applying the brand color
      output[i * 4] = Math.round(ACCENT_R * luminance);
      output[i * 4 + 1] = Math.round(ACCENT_G * luminance);
      output[i * 4 + 2] = Math.round(ACCENT_B * luminance);
      output[i * 4 + 3] = a;  // keep original alpha
    }
  }

  return sharp(output, {
    raw: { width: size, height: size, channels: 4 },
  }).png().toBuffer();
}

async function generateFavicon() {
  // Verify input exists
  if (!fs.existsSync(inputLogo)) {
    console.error("Input logo not found at:", inputLogo);
    process.exit(1);
  }

  const inputBuffer = fs.readFileSync(inputLogo);

  // ── 1. Favicon PNG (256×256) with purple accent tint ──
  const faviconPngPath = path.join(publicDir, "favicon.png");
  const favicon256 = await generateTintedFavicon(inputBuffer, 512);
  await sharp(favicon256).png({ compressionLevel: 9 }).toFile(faviconPngPath);
  console.log("✓ Generated public/favicon.png (256x256) — purple accent tint, white bg removed");

  // ── 2. Favicon ICO (32×32) with purple accent tint ──
  const faviconIcoPath = path.join(appDir, "favicon.ico");
  const favicon32 = await generateTintedFavicon(inputBuffer, 50);
  await sharp(favicon32).toFile(faviconIcoPath);
  console.log("✓ Generated src/app/favicon.ico (32x32) — purple accent tint, white bg removed");

  // ── 3. Apple touch icon (180×180) with purple accent tint ──
  const appleTouchPath = path.join(publicDir, "apple-touch-icon.png");
  const apple180 = await generateTintedFavicon(inputBuffer, 180);
  await sharp(apple180).png({ compressionLevel: 9 }).toFile(appleTouchPath);
  console.log("✓ Generated public/apple-touch-icon.png (180x180) — purple accent tint, white bg removed");

  // ── 4. Navbar logo (100×100) — larger, no color change ──
  const logoPath = path.join(publicDir, "logo.png");
  await sharp(inputBuffer)
    .resize(100, 100, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(logoPath);
  console.log("✓ Generated public/logo.png (100x100) for navbar");

  console.log("\n✅ All favicon and logo files generated successfully!");
}

generateFavicon().catch(console.error);
