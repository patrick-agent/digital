#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dbPath = path.join(root, "db", "music.json");
const outDir = path.join(root, "public", "images", "releases");

function parseDataUrl(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function safeSlug(item) {
  return (item.slug || item.title || item.id || "release")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const raw = await readFile(dbPath, "utf8");
const releases = JSON.parse(raw);

await mkdir(outDir, { recursive: true });

let converted = 0;
let beforeBytes = 0;
let afterBytes = 0;

for (const release of releases) {
  const parsed = parseDataUrl(release.coverArt);
  if (!parsed) continue;

  const slug = safeSlug(release);
  const filename = `${slug}.webp`;
  const outputPath = path.join(outDir, filename);
  const output = await sharp(parsed.buffer)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  await writeFile(outputPath, output);
  release.coverArt = `/images/releases/${filename}`;

  converted += 1;
  beforeBytes += parsed.buffer.byteLength;
  afterBytes += output.byteLength;
}

await writeFile(dbPath, `${JSON.stringify(releases, null, 2)}\n`, "utf8");

const savedPercent = beforeBytes > 0 ? Math.round((1 - afterBytes / beforeBytes) * 100) : 0;
console.log(`Converted ${converted} cover images.`);
console.log(`Cover art bytes: ${beforeBytes} -> ${afterBytes} (${savedPercent}% smaller).`);
