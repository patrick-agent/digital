#!/usr/bin/env node

/**
 * 3D Model Analysis & Compression Utility
 *
 * Usage:
 *   node scripts/compress-models.mjs           # Report sizes only
 *   node scripts/compress-models.mjs compress   # Compress existing GLB files with Draco
 *
 * Prerequisites for compression:
 *   npm install --save-dev @gltf-transform/cli
 *
 * For FBX→GLB conversion, use Blender:
 *   1. Open Blender → File → Import → FBX
 *   2. File → Export → glTF 2.0 (.glb)
 *      - Enable "Draco Compression"
 *      - Compression Level: 6
 *      - Quantization: Position 10, TexCoord 8, Normal 8
 *   3. Save to public/models/compressed/
 *
 * Then update your code:
 *   useFBX("/models/Walking.fbx") → useGLTF("/models/compressed/Walking.glb")
 *   (Also update PreloadModels.jsx accordingly)
 */

import { readFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import { execSync } from "child_process";

const MODELS_DIR = join(process.cwd(), "public", "models");
const OUT_DIR = join(MODELS_DIR, "compressed");

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb.toFixed(0)} KB`;
}

function analyzeModels() {
  if (!existsSync(MODELS_DIR)) {
    console.error("❌ public/models/ not found");
    process.exit(1);
  }

  const files = readdirSync(MODELS_DIR);
  const modelFiles = files.filter(f => /\.(fbx|glb|gltf)$/i.test(f));

  if (modelFiles.length === 0) {
    console.log("No model files found in public/models/");
    return [];
  }

  console.log(`\n📦 Found ${modelFiles.length} model files:\n`);
  let totalSize = 0;

  for (const file of modelFiles.sort()) {
    const filePath = join(MODELS_DIR, file);
    const size = statSync(filePath).size;
    const ext = extname(file).toLowerCase();
    totalSize += size;

    const icon = ext === ".glb" ? "🔷" : ext === ".gltf" ? "🔶" : "📄";
    console.log(`  ${icon} ${file.padEnd(40)} ${formatSize(size).padStart(10)}`);
  }

  console.log(`\n  ${"─".repeat(52)}`);
  console.log(`  📊 Total: ${formatSize(totalSize)} (${modelFiles.length} files)`);
  console.log(`  💡 Tip: FBX files can be compressed 60-80% by converting to Draco-compressed GLB`);

  return modelFiles;
}

function compressGlbFiles() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const glbFiles = readdirSync(MODELS_DIR).filter(f => /\.glb$/i.test(f));

  if (glbFiles.length === 0) {
    console.log("  No GLB files found to compress.");
    return;
  }

  try {
    execSync("gltf-transform --version", { stdio: "pipe" });
  } catch {
    console.log("\n📦 Installing @gltf-transform/cli...");
    execSync("npm install --save-dev @gltf-transform/cli", { stdio: "inherit" });
  }

  for (const file of glbFiles) {
    const src = join(MODELS_DIR, file);
    const dst = join(OUT_DIR, file);
    const originalSize = statSync(src).size;

    console.log(`\n🔧 Compressing: ${file}`);
    try {
      execSync(
        `npx gltf-transform draco "${src}" "${dst}" --encode-meshes --encode-quantization-bits 10`,
        { stdio: "inherit" }
      );

      if (existsSync(dst)) {
        const newSize = statSync(dst).size;
        const saved = ((1 - newSize / originalSize) * 100).toFixed(0);
        const origKb = (originalSize / 1024).toFixed(1);
        const newKb = (newSize / 1024).toFixed(1);
        console.log(`  ✅ ${origKb}KB → ${newKb}KB (${saved}% reduction)`);
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }
}

// --- Main ---
const args = process.argv.slice(2);
const isCompress = args.includes("compress");

console.log(`\n${"=".repeat(50)}`);
console.log(`  🏗️  3D Model Optimizer`);
console.log(`${"=".repeat(50)}`);

const files = analyzeModels();

if (isCompress) {
  compressGlbFiles();
}
