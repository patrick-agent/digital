#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * Analyzes the Next.js build output to help identify performance issues
 * 
 * Usage: node scripts/analyze-bundle.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, '../.next');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  grey: '\x1b[90m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getColoredSize(bytes, warningThreshold = 250 * 1024) {
  const formatted = formatBytes(bytes);
  const color =
    bytes > warningThreshold ? colors.red :
    bytes > warningThreshold * 0.7 ? colors.yellow :
    colors.green;
  return `${color}${formatted}${colors.reset}`;
}

function getGzipSize(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const compressed = zlib.gzipSync(data);
    return compressed.length;
  } catch {
    return 0;
  }
}

function analyzeDirectory(dir, depth = 0, maxDepth = 2) {
  if (depth > maxDepth) return { totalSize: 0, gzipSize: 0, files: [] };

  const items = fs.readdirSync(dir, { withFileTypes: true });
  let totalSize = 0;
  let totalGzipSize = 0;
  const files = [];

  for (const item of items) {
    if (item.isDirectory()) {
      if (!item.name.startsWith('.')) {
        const subResult = analyzeDirectory(
          path.join(dir, item.name),
          depth + 1,
          maxDepth
        );
        totalSize += subResult.totalSize;
        totalGzipSize += subResult.gzipSize;

        if (depth < maxDepth) {
          files.push({
            name: item.name,
            size: subResult.totalSize,
            gzipSize: subResult.gzipSize,
            isDir: true,
          });
        }
      }
    } else {
      const filePath = path.join(dir, item.name);
      const stats = fs.statSync(filePath);
      const gzipSize = getGzipSize(filePath);
      totalSize += stats.size;
      totalGzipSize += gzipSize;

      if (depth === maxDepth && stats.size > 10000) { // Only show files > 10KB
        files.push({
          name: item.name,
          size: stats.size,
          gzipSize: gzipSize,
          isDir: false,
        });
      }
    }
  }

  return { totalSize, gzipSize: totalGzipSize, files };
}

function printSummary() {
  console.log(`\n${colors.cyan}=== NEXT.JS BUILD BUNDLE ANALYSIS ===${colors.reset}\n`);

  if (!fs.existsSync(BUILD_DIR)) {
    console.log(`${colors.yellow}⚠ Build directory not found. Run 'npm run build' first.${colors.reset}\n`);
    return;
  }

  const buildDirs = [
    { name: 'Static (Client)', path: path.join(BUILD_DIR, 'static') },
    { name: 'Server', path: path.join(BUILD_DIR, 'server') },
  ];

  let totalBuildSize = 0;
  let totalGzipSize = 0;

  for (const dir of buildDirs) {
    if (!fs.existsSync(dir.path)) continue;

    const result = analyzeDirectory(dir.path, 0, 2);
    totalBuildSize += result.totalSize;
    totalGzipSize += result.gzipSize;

    console.log(`${colors.blue}${dir.name}:${colors.reset}`);
    console.log(`  Raw:  ${getColoredSize(result.totalSize)}`);
    console.log(`  Gzip: ${getColoredSize(result.gzipSize)}`);

    if (result.files.length > 0) {
      const sorted = result.files.sort((a, b) => b.gzipSize - a.gzipSize);
      const topFiles = sorted.slice(0, 5);

      console.log(`  ${colors.grey}Top files (by gzip size):${colors.reset}`);
      for (const file of topFiles) {
        const gzipSize = getColoredSize(file.gzipSize);
        const rawSize = formatBytes(file.size);
        console.log(`    - ${file.name}: ${gzipSize} (raw: ${rawSize})`);
      }
    }

    console.log();
  }

  console.log(`${colors.cyan}TOTAL BUILD SIZE:${colors.reset}`);
  console.log(`  Raw:  ${getColoredSize(totalBuildSize)}`);
  console.log(`  Gzip: ${getColoredSize(totalGzipSize)}`);
  console.log();

  // Recommendations
  console.log(`${colors.yellow}📋 Recommendations:${colors.reset}`);
  if (totalGzipSize > 500 * 1024) {
    console.log(`  ${colors.red}⚠ Gzipped size exceeds 500KB. Consider further optimization.${colors.reset}`);
  } else if (totalGzipSize > 300 * 1024) {
    console.log(`  ${colors.yellow}⚠ Gzipped size is moderate. Monitor for growth.${colors.reset}`);
  } else {
    console.log(`  ${colors.green}✓ Gzipped size is excellent!${colors.reset}`);
  }

  console.log(`  • Ensure dynamic imports for heavy components`);
  console.log(`  • Use Route-based code splitting (Next.js handles this)`);
  console.log(`  • Monitor third-party libraries for size impact`);
  console.log(`  • Consider image optimization with next/image\n`);
}

// Run analysis
try {
  printSummary();
} catch (error) {
  console.error(`${colors.red}Error during analysis:${colors.reset}`, error.message);
  process.exit(1);
}
