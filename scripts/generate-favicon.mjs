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

async function createIcoFromPngBuffer(inputBuffer) {
  const pngBuffer = await sharp(inputBuffer)
    .resize(32, 32, { fit: "cover" })
    .png()
    .toBuffer();

  const metadata = await sharp(pngBuffer).metadata();
  const width = metadata.width || 32;
  const height = metadata.height || 32;

  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);
  iconDir.writeUInt16LE(1, 2);
  iconDir.writeUInt16LE(1, 4);

  const iconEntry = Buffer.alloc(16);
  iconEntry.writeUInt8(width >= 256 ? 0 : width, 0);
  iconEntry.writeUInt8(height >= 256 ? 0 : height, 1);
  iconEntry.writeUInt8(0, 2);
  iconEntry.writeUInt8(0, 3);
  iconEntry.writeUInt16LE(1, 4);
  iconEntry.writeUInt16LE(32, 6);
  iconEntry.writeUInt32LE(pngBuffer.length, 8);
  iconEntry.writeUInt32LE(iconDir.length + iconEntry.length, 12);

  return Buffer.concat([iconDir, iconEntry, pngBuffer]);
}

async function generateFavicon() {
  // Verify input exists
  if (!fs.existsSync(inputLogo)) {
    console.error("Input logo not found at:", inputLogo);
    process.exit(1);
  }

  const inputBuffer = fs.readFileSync(inputLogo);

  // ── 1. Public favicon PNG (512×512) with purple accent tint ──
  const faviconPngPath = path.join(publicDir, "favicon.png");
  const favicon256 = await generateTintedFavicon(inputBuffer, 512);
  await sharp(favicon256).png({ compressionLevel: 9 }).toFile(faviconPngPath);
  console.log("✓ Generated public/favicon.png (512x512) — purple accent tint, white bg removed");

  // ── 2. App Router icon.png (512×512) for file-based metadata ──
  const appIconPath = path.join(appDir, "icon.png");
  fs.writeFileSync(appIconPath, favicon256);
  console.log("✓ Generated src/app/icon.png (512x512) for App Router metadata");

  // ── 3. Favicon ICO (32×32) as a real .ico file ──
  const faviconIcoPath = path.join(appDir, "favicon.ico");
  const favicon32 = await generateTintedFavicon(inputBuffer, 32);
  const faviconIco = await createIcoFromPngBuffer(favicon32);
  fs.writeFileSync(faviconIcoPath, faviconIco);
  console.log("✓ Generated src/app/favicon.ico (32x32) as a valid ICO file");

  // ── 4. Apple touch icon (180×180) for public + App Router ──
  const appleTouchPath = path.join(publicDir, "apple-touch-icon.png");
  const apple180 = await generateTintedFavicon(inputBuffer, 180);
  await sharp(apple180).png({ compressionLevel: 9 }).toFile(appleTouchPath);
  console.log("✓ Generated public/apple-touch-icon.png (180x180) — purple accent tint, white bg removed");

  const appAppleIconPath = path.join(appDir, "apple-icon.png");
  fs.writeFileSync(appAppleIconPath, apple180);
  console.log("✓ Generated src/app/apple-icon.png (180x180) for App Router metadata");

  // ── 5. Navbar logo (100×100) — larger, no color change ──
  const logoPath = path.join(publicDir, "logo.png");
  await sharp(inputBuffer)
    .resize(100, 100, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(logoPath);
  console.log("✓ Generated public/logo.png (100x100) for navbar");

  console.log("\n✅ All favicon and logo files generated successfully!");
}

generateFavicon().catch(console.error);
