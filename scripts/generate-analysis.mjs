#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname, basename, relative, dirname, sep, normalize } from 'node:path';

const ROOT = resolve(process.cwd());
const SRC = join(ROOT, 'src');
const IGNORE_DIRS = new Set(['node_modules', '.next', 'dist', 'build', 'coverage', '.git', 'public/generated', '.db-backups', '.vercel', '.understand-anything', '.learnings', '.opencode']);
const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.md', '.mdx', '.json', '.mjs', '.cjs']);
const TRY_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];

// ============== ALIAS CONFIG ==============
const ALIAS_MAP = {
  '@': SRC,
};

// ============== FILE SCANNER ==============
function walk(dir, basePath = '') {
  const files = [];
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return files; }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      files.push(...walk(fullPath, relPath));
    } else if (
      entry.isFile() &&
      !entry.name.endsWith('.lock') &&
      !entry.name.endsWith('.map') &&
      !entry.name.includes('.generated.') &&
      !entry.name.includes('.min.') &&
      fileInScope(entry.name)
    ) {
      files.push({ path: relPath, fullPath });
    }
  }
  return files;
}

function fileInScope(name) {
  return CODE_EXTS.has(extname(name));
}

// ============== IMPORT PARSER ==============
const IMPORT_RE = /(?:import|export)\s+(?:(?:type|typeof)\s+)?(?:\{[^}]*\}\s*)?(?:\*\s+as\s+\w+\s*)?(?:\w+\s*,?\s*)?(?:from\s+)?['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE = /import\(['"]([^'"]+)['"]\)/g;
const REQUIRE_RE = /require\(['"]([^'"]+)['"]\)/g;

function extractAllImports(content) {
  const imports = new Set();
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(content)) !== null) imports.add(m[1]);
  DYNAMIC_IMPORT_RE.lastIndex = 0;
  while ((m = DYNAMIC_IMPORT_RE.exec(content)) !== null) imports.add(m[1]);
  REQUIRE_RE.lastIndex = 0;
  while ((m = REQUIRE_RE.exec(content)) !== null) imports.add(m[1]);
  return [...imports];
}

function isBareImport(spec) {
  return !spec.startsWith('.') && !spec.startsWith('@') && !spec.startsWith('/');
}

function resolveAlias(spec) {
  for (const [alias, targetDir] of Object.entries(ALIAS_MAP)) {
    const prefix = alias.endsWith('/*') ? alias.slice(0, -2) : alias;
    if (spec === prefix || spec.startsWith(prefix + '/')) {
      const rest = spec.startsWith(prefix + '/') ? spec.slice(prefix.length + 1) : '';
      return join(targetDir, rest);
    }
  }
  return null;
}

function tryResolveFilePath(baseDir, spec) {
  // Resolve alias
  const aliased = resolveAlias(spec);
  if (aliased) {
    const found = tryResolveFinal(aliased);
    if (found) return found;
  }
  // Relative
  if (spec.startsWith('.')) {
    const joined = resolve(baseDir, spec);
    const found = tryResolveFinal(joined);
    if (found) return found;
  }
  // Bare import (node_modules) - return as-is
  if (isBareImport(spec)) {
    return { resolved: spec, isExternal: true };
  }
  return null;
}

function tryResolveFinal(absPath) {
  // Exact match
  if (existsSync(absPath) && statSync(absPath).isFile()) return { resolved: relative(ROOT, absPath).replace(/\\/g, '/'), isExternal: false };
  // Try extensions
  for (const ext of TRY_EXTS) {
    const withExt = absPath + ext;
    if (existsSync(withExt) && statSync(withExt).isFile()) return { resolved: relative(ROOT, withExt).replace(/\\/g, '/'), isExternal: false };
  }
  // Try /index
  for (const ext of TRY_EXTS) {
    const index = join(absPath, 'index' + ext);
    if (existsSync(index) && statSync(index).isFile()) return { resolved: relative(ROOT, index).replace(/\\/g, '/'), isExternal: false };
  }
  return null;
}

// ============== BUSINESS FEATURE DETECTION ==============
const BUSINESS_FEATURE_LABELS = {
  'trang-nguoi-dung': 'Trang Người Dùng',
  'blog-system': 'Blog System',
  'admin-cms': 'Admin CMS',
  'shop-affiliate': 'Shop / Affiliate',
  '3d-website': '3D Website (Three.js)',
  'authentication': 'Authentication',
  'api-routes': 'API Routes',
  'core-library': 'Core Library',
  'data-storage': 'Data & Storage',
  'static-assets': 'Static Assets',
  'scripts-automation': 'Scripts & Automation',
  'config': 'Configuration',
};

const BUSINESS_FEATURE_DESCRIPTIONS = {
  'trang-nguoi-dung': 'Giao diện chính cho người dùng: trang chủ, about, contact, bio-music, layout chung, navbar, footer, hero sections.',
  'blog-system': 'Hệ thống blog: danh sách bài viết, chi tiết bài viết, article content rendering, related posts, breadcrumb, schema markup, SEO blog.',
  'admin-cms': 'Trang quản trị: dashboard admin, CRUD blog/case-studies/events/gallery/music/services/shop, RichTextEditor, SEO score.',
  'shop-affiliate': 'Cửa hàng & affiliate: danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng, Shopee affiliate, product card.',
  '3d-website': 'Hiệu ứng 3D: Three.js canvas, character models, particle fields, shaders, spotlight, teleport beam, post-processing.',
  'authentication': 'Xác thực: NextAuth, API auth, middleware, admin route protection, JWT, session management.',
  'api-routes': 'API endpoints: blog CRUD, webhook sync, shop API, media upload, newsletter, SEO settings, gallery.',
  'core-library': 'Thư viện dùng chung: SEO utils, database connection, site defaults, shader utils, hooks (useCanvasOptimizer, useHydrated, useVisibilityLoader).',
  'data-storage': 'Dữ liệu: JSON files cho blog, case-studies, events, gallery, music, shop, services.',
  'static-assets': 'Tài nguyên tĩnh: images, fonts, models, favicon, robots.txt, sitemap index.',
  'scripts-automation': 'Kịch bản tự động: sync blog, SEO audit, shop scraper, image optimization, Google indexing, DB backup.',
  'config': 'Cấu hình dự án: Next.js, Tailwind, PostCSS, jsconfig, ESLint, env variables.',
};

const BUSINESS_FEATURE_ORDER = [
  'trang-nguoi-dung', 'blog-system', 'admin-cms', 'shop-affiliate', '3d-website',
  'authentication', 'api-routes', 'core-library', 'data-storage',
  'static-assets', 'scripts-automation', 'config',
];

function detectBusinessFeature(relPath) {
  if (relPath.startsWith('src/pages/api/') || relPath.startsWith('src/app/api/')) return 'api-routes';
  if (relPath.startsWith('src/pages/admin/') || relPath.startsWith('src/app/admin/') || relPath.startsWith('src/components/admin/')) return 'admin-cms';
  if (relPath.startsWith('src/components/blog/') || relPath.startsWith('src/lib/blog/') || relPath.startsWith('src/app/blog/') || relPath.startsWith('db/blog')) return 'blog-system';
  if (relPath.startsWith('src/components/shop/') || relPath.startsWith('src/lib/shop/') || relPath.startsWith('src/app/shop/') || relPath.startsWith('src/lib/affiliate/')) return 'shop-affiliate';
  if (relPath.includes('middleware') || relPath.startsWith('src/lib/auth') || relPath.startsWith('src/lib/api-auth') || relPath.startsWith('src/lib/admin-route')) return 'authentication';
  if (relPath.includes('/3d/') || relPath.includes('/three/') || relPath.includes('/canvas/') || relPath.includes('/shader/') || relPath.includes('/scene/') || relPath.includes('three-fiber') || relPath.includes('PostProcessing') || relPath.includes('StudioModel') || relPath.includes('CharacterCanvas') || relPath.includes('SpotlightCard')) return '3d-website';
  if (relPath.startsWith('src/pages/') || relPath.startsWith('src/app/')) return 'trang-nguoi-dung';
  if (relPath.startsWith('src/components/')) return 'trang-nguoi-dung';
  if (relPath.startsWith('src/lib/') || relPath.startsWith('src/hooks/') || relPath.startsWith('src/utils/') || relPath.startsWith('src/context/') || relPath.startsWith('src/services/') || relPath.startsWith('src/styles/')) return 'core-library';
  if (relPath.startsWith('db/')) return 'data-storage';
  if (relPath.startsWith('public/')) return 'static-assets';
  if (relPath.startsWith('scripts/')) return 'scripts-automation';
  const configFiles = ['next.config', 'tailwind.config', 'postcss.config', 'jsconfig', 'tsconfig', '.env', '.eslintrc', '.prettierrc'];
  if (configFiles.some(c => basename(relPath).startsWith(c))) return 'config';
  return 'core-library';
}

const BUSINESS_CODE_TYPES = {
  'pages-routes': [],
  'ui-components': [],
  'core-lib-hooks': [],
  'api-endpoints': [],
  'data-files': [],
  'scripts': [],
  'config-files': [],
  'styles': [],
};

const CODE_TYPE_LABELS = {
  'pages-routes': '📄 Pages & Routes',
  'ui-components': '🧩 UI Components',
  'core-lib-hooks': '🔧 Library & Hooks',
  'api-endpoints': '🔌 API Endpoints',
  'data-files': '🗄️ Data Files',
  'scripts': '⚙️ Scripts',
  'config-files': '⚙️ Config',
  'styles': '🎨 Styles',
};

const CODE_TYPE_ORDER = ['pages-routes', 'ui-components', 'core-lib-hooks', 'api-endpoints', 'data-files', 'scripts', 'config-files', 'styles'];

function categorizeCodeType(relPath) {
  if (relPath.startsWith('src/pages/') || relPath.startsWith('src/app/')) return 'pages-routes';
  if (relPath.startsWith('src/components/') || relPath.startsWith('src/context/')) return 'ui-components';
  if (relPath.startsWith('src/lib/') || relPath.startsWith('src/hooks/') || relPath.startsWith('src/utils/') || relPath.startsWith('src/services/')) return 'core-lib-hooks';
  if (relPath.startsWith('src/styles/') || relPath.endsWith('.css')) return 'styles';
  if (relPath.startsWith('db/')) return 'data-files';
  if (relPath.startsWith('scripts/')) return 'scripts';
  if (relPath.startsWith('public/')) return 'static-assets';
  const configFiles = ['next.config', 'tailwind.config', 'postcss.config', 'jsconfig', 'tsconfig'];
  if (configFiles.some(c => basename(relPath).startsWith(c))) return 'config-files';
  return 'other';
}

// ============== LAYER DETECTION ==============
function detectLayer(relPath) {
  if (relPath.startsWith('src/pages/')) return 'pages-routes';
  if (relPath.startsWith('src/app/')) return 'pages-routes';
  if (relPath.startsWith('src/pages/admin/') || relPath.startsWith('src/app/admin/')) return 'admin-cms';
  if (relPath.startsWith('src/pages/blog/') || relPath.startsWith('src/app/blog/')) return 'blog-system';
  if (relPath.startsWith('src/pages/shop/') || relPath.startsWith('src/app/shop/') || relPath.startsWith('src/pages/affiliate/')) return 'shop-affiliate';
  if (relPath.startsWith('src/pages/api/')) return 'api-routes';
  if (relPath.startsWith('src/components/admin/')) return 'admin-cms';
  if (relPath.startsWith('src/components/blog/') || relPath.startsWith('src/lib/blog/') || relPath.startsWith('db/blog')) return 'blog-system';
  if (relPath.startsWith('src/components/shop/') || relPath.startsWith('src/lib/shop/') || relPath.startsWith('src/lib/affiliate/')) return 'shop-affiliate';
  if (relPath.startsWith('src/lib/auth/') || relPath.includes('middleware')) return 'auth';
  if (relPath.startsWith('src/components/')) return 'ui-components';
  if (relPath.startsWith('src/lib/') || relPath.startsWith('src/hooks/') || relPath.startsWith('src/utils/') || relPath.startsWith('src/services/')) return 'core-library';
  if (relPath.startsWith('db/')) return 'data-storage';
  if (relPath.startsWith('public/')) return 'static-assets';
  if (relPath.startsWith('scripts/')) return 'automation-scripts';
  if (relPath.includes('/3d/') || relPath.includes('/three/') || relPath.includes('/canvas/') || relPath.includes('/shader/') || relPath.includes('/scene/') || relPath.includes('three-fiber')) return '3d-components';
  if (relPath.startsWith('src/')) return 'core-library';
  // Config files at root
  const configFiles = ['next.config', 'tailwind.config', 'postcss.config', 'jsconfig', 'tsconfig', '.env', '.eslintrc', '.prettierrc'];
  if (configFiles.some(c => basename(relPath).startsWith(c))) return 'config';
  return 'other';
}

const LAYER_LABELS = {
  'ui-components': 'UI Components',
  'pages-routes': 'Pages & Routes',
  'core-library': 'Core Library',
  'data-storage': 'Data & Storage',
  'static-assets': 'Static Assets',
  'api-routes': 'API Routes',
  'admin-cms': 'Admin CMS',
  'blog-system': 'Blog System',
  'shop-affiliate': 'Shop / Affiliate',
  '3d-components': '3D Components',
  'automation-scripts': 'Scripts & Automation',
  'config': 'Configuration',
  'auth': 'Authentication',
  'other': 'Other',
};

const LAYER_ORDER = [
  'pages-routes', 'ui-components', 'core-library', 'data-storage',
  'api-routes', 'admin-cms', 'blog-system', 'shop-affiliate',
  '3d-components', 'automation-scripts', 'config', 'auth', 'static-assets', 'other',
];

// ============== METRICS ==============
function countLines(content) {
  const lines = content.split('\n');
  const total = content.endsWith('\n') ? Math.max(0, lines.length - 1) : lines.length;
  const nonEmpty = lines.filter(l => l.trim().length > 0).length;
  const codeLines = lines.filter(l => l.trim().length > 0 && !l.trim().startsWith('//') && !l.trim().startsWith('#') && !l.trim().startsWith('/*') && !l.trim().startsWith('*')).length;
  return { total, nonEmpty, codeLines };
}

function estimateComplexity(content, ext) {
  const lines = content.split('\n');
  let complexity = 0, functions = 0, classes = 0, conditionals = 0;
  for (const line of lines) {
    const t = line.trim();
    if (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs') {
      if (/^\s*(export\s+)?(function|const|let|var)\s+\w+\s*[=(]/.test(t) && !/^\s*(import|export\s+type|interface\s+)/.test(t)) {
        if (/^\s*(export\s+)?function\s+\w+\s*\(/.test(t) || /^\s*(export\s+)?const\s+\w+\s*=\s*\(?.*\)?\s*=>/.test(t) || /^\s*(export\s+)?const\s+\w+\s*:\s*\w+\s*=/.test(t)) {
          functions++;
        }
      }
      if (/^\s*(export\s+)?class\s+\w+/.test(t)) classes++;
      if (/\b(if|else if|for|while|catch|case\s+\w+:)\s*/.test(t) && !t.startsWith('//')) conditionals++;
      if (/\b(&&|\|\|)\b/.test(t)) conditionals += 0.5;
    } else if (ext === '.css') {
      complexity += 0.5;
    } else if (ext === '.md' || ext === '.mdx') {
      if (t.startsWith('#') && !t.startsWith('##')) classes++;
    }
  }
  complexity = functions + classes + conditionals;
  return { complexity: Math.round(complexity * 10) / 10, functions, classes, conditionals: Math.round(conditionals) };
}

// ============== MAIN ==============
function main() {
  console.log('[analysis] Scanning project files...');
  const allFiles = walk(ROOT).filter(f => CODE_EXTS.has(extname(f.path)));

  console.log(`[analysis] Found ${allFiles.length} source files. Parsing imports...`);

  // Build file lookup by relative path
  const fileLookup = new Map();
  for (const f of allFiles) fileLookup.set(f.path, f);

  // Parse all imports
  const fileMetrics = {};
  const importsMap = {}; // filePath -> array of { spec, resolved, layer }
  const fileLayers = {};

  for (const file of allFiles) {
    try {
      const content = readFileSync(file.fullPath, 'utf-8');
      const ext = extname(file.path);
      const lines = countLines(content);
      const complexity = estimateComplexity(content, ext);
      const specs = extractAllImports(content);
      const archModule = detectLayer(file.path);
      fileLayers[file.path] = archModule;

      // Resolve each import spec
      const resolvedImports = [];
      const baseDir = dirname(file.fullPath);
      for (const spec of specs) {
        const result = tryResolveFilePath(baseDir, spec);
        if (result) {
          const targetLayer = result.isExternal ? 'external' : (fileLayers[result.resolved] || detectLayer(result.resolved));
          resolvedImports.push({ spec, resolved: result.resolved, isExternal: result.isExternal, layer: targetLayer });
          // Track layer for resolved files too
          if (!result.isExternal && !fileLayers[result.resolved]) {
            fileLayers[result.resolved] = detectLayer(result.resolved);
          }
        } else {
          resolvedImports.push({ spec, resolved: null, isExternal: false, layer: null });
        }
      }

      importsMap[file.path] = resolvedImports;

      fileMetrics[file.path] = {
        path: file.path,
        extension: ext,
        lines: lines.total,
        nonEmptyLines: lines.nonEmpty,
        codeLines: lines.codeLines,
        ...complexity,
        imports: specs,
        resolvedImports,
        exportCount: 0,
        exports: [],
        archModule,
        size: lines.total > 300 ? 'large' : lines.total > 100 ? 'medium' : 'small',
        riskFlags: [],
      };
      if (lines.total > 300 && ext !== '.css' && complexity.complexity >= 15) fileMetrics[file.path].riskFlags.push('large-file');
      if (complexity.complexity > 20) fileMetrics[file.path].riskFlags.push('high-complexity');
      if (specs.length > 15) fileMetrics[file.path].riskFlags.push('many-imports');
    } catch (err) {
      // skip unreadable
    }
  }

  // ============== LAYER GRAPH ==============
  console.log('[analysis] Building layer dependency graph...');

  // Aggregate files by layer
  const layerFiles = {};
  for (const [fp, layer] of Object.entries(fileLayers)) {
    if (!layerFiles[layer]) layerFiles[layer] = [];
    layerFiles[layer].push(fp);
  }

  // Build edge matrix: sourceLayer -> targetLayer -> { count, fileEdges: [{ from, to, spec }] }
  const edgeMatrix = {};

  function addEdge(sourceLayer, targetLayer, fromFile, toFile, spec) {
    if (!edgeMatrix[sourceLayer]) edgeMatrix[sourceLayer] = {};
    if (!edgeMatrix[sourceLayer][targetLayer]) edgeMatrix[sourceLayer][targetLayer] = { count: 0, fileEdges: [] };
    edgeMatrix[sourceLayer][targetLayer].count++;
    edgeMatrix[sourceLayer][targetLayer].fileEdges.push({ from: fromFile, to: toFile, spec });
  }

  for (const [fp, resolvedImports] of Object.entries(importsMap)) {
    const sourceLayer = fileLayers[fp];
    if (!sourceLayer) continue;
    for (const imp of resolvedImports) {
      const targetLayer = imp.isExternal ? 'external' : fileLayers[imp.resolved] || 'other';
      if (targetLayer && targetLayer !== sourceLayer) {
        addEdge(sourceLayer, targetLayer, fp, imp.resolved || imp.spec, imp.spec);
      }
    }
  }

  // Format as edges array
  const layerEdges = [];
  for (const [source, targets] of Object.entries(edgeMatrix)) {
    for (const [target, edgeData] of Object.entries(targets)) {
      // Unique file pairs
      const uniquePairs = new Set();
      const uniqueFileEdges = [];
      for (const fe of edgeData.fileEdges) {
        const key = `${fe.from}|${fe.to}`;
        if (!uniquePairs.has(key)) {
          uniquePairs.add(key);
          uniqueFileEdges.push(fe);
        }
      }
      layerEdges.push({
        source,
        target,
        sourceLabel: LAYER_LABELS[source] || source,
        targetLabel: LAYER_LABELS[target] || target,
        importCount: edgeData.count,
        uniqueFilePairs: uniqueFileEdges.length,
        fileEdges: uniqueFileEdges.slice(0, 100), // cap at 100 for payload size
      });
    }
  }

  // Sort edges by import count descending
  layerEdges.sort((a, b) => b.importCount - a.importCount);

  // Build per-layer file details
  const layerDetails = {};
  for (const [layer, files] of Object.entries(layerFiles)) {
    const fileList = files.map(fp => ({
      path: fp,
      lines: fileMetrics[fp]?.lines || 0,
      complexity: fileMetrics[fp]?.complexity || 0,
    })).sort((a, b) => b.lines - a.lines);
    layerDetails[layer] = {
      id: layer,
      label: LAYER_LABELS[layer] || layer,
      fileCount: files.length,
      totalLines: fileList.reduce((s, f) => s + f.lines, 0),
      totalComplexity: fileList.reduce((s, f) => s + f.complexity, 0),
      files: fileList.slice(0, 200), // cap for payload
    };
  }

  // Warning: check if pages-routes -> ui-components has zero edges
  const warnings = [];
  const pageToUI = layerEdges.find(e => e.source === 'pages-routes' && e.target === 'ui-components');
  if (!pageToUI || pageToUI.importCount === 0) {
    warnings.push('pages-routes-to-ui-components-zero');
  }

  // ============== FAN-IN/FAN-OUT ==============
  console.log('[analysis] Computing fan-in/fan-out...');
  for (const [filePath, deps] of Object.entries(importsMap)) {
    if (!fileMetrics[filePath]) continue;
    fileMetrics[filePath].fanOut = deps.filter(d => !d.isExternal).length;
  }
  const fanIn = {};
  for (const [filePath, deps] of Object.entries(importsMap)) {
    for (const dep of deps) {
      if (dep.isExternal || !dep.resolved) continue;
      fanIn[dep.resolved] = (fanIn[dep.resolved] || 0) + 1;
    }
  }
  for (const [filePath, count] of Object.entries(fanIn)) {
    if (fileMetrics[filePath]) fileMetrics[filePath].fanIn = count;
  }

  // ============== EXPORTS ==============
  for (const file of allFiles) {
    const m = fileMetrics[file.path];
    if (!m) continue;
    const ext = extname(file.path);
    const content = readFileSync(file.fullPath, 'utf-8');
    const exports = [];
    for (const line of content.split('\n')) {
      const t = line.trim();
      if ((ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx') && !t.startsWith('//')) {
        if (/^\s*export\s+(default\s+)?(function|class|const|let|var|type|interface)\s+\w+/.test(t)) {
          const m2 = t.match(/export\s+(default\s+)?(function|class|const|let|var|type|interface)\s+(\w+)/);
          if (m2) exports.push(m2[3]);
        }
        if (t.includes('export default')) {
          const m3 = t.match(/export\s+default\s+(function|class)\s+(\w+)/);
          if (m3) exports.push(`default:${m3[2]}`);
        }
      }
    }
    m.exports = exports;
    m.exportCount = exports.length;
  }

  // ============== COMPUTE SUMMARY ==============
  const extBreakdown = {};
  for (const file of allFiles) {
    const ext = extname(file.path);
    if (!extBreakdown[ext]) extBreakdown[ext] = { count: 0, totalLines: 0 };
    extBreakdown[ext].count++;
    extBreakdown[ext].totalLines += fileMetrics[file.path]?.lines || 0;
  }

  const totalFunctions = Object.values(fileMetrics).reduce((s, m) => s + (m?.functions || 0), 0);
  const totalClasses = Object.values(fileMetrics).reduce((s, m) => s + (m?.classes || 0), 0);
  const totalLines = Object.values(fileMetrics).reduce((s, m) => s + (m?.lines || 0), 0);

  // ============== UNUSED EXPORTS ==============
  const exportLocations = {};
  for (const [fp, metrics] of Object.entries(fileMetrics)) {
    if (!metrics) continue;
    for (const exp of metrics.exports) {
      exportLocations[`${fp}::${exp}`] = fp;
    }
  }
  const referencedExports = new Set();
  for (const [filePath, deps] of Object.entries(importsMap)) {
    for (const dep of deps) {
      if (dep.isExternal || !dep.resolved) continue;
      const m = dep.resolved.match(/([^/]+)$/);
      if (m) {
        for (const key of Object.keys(exportLocations)) {
          if (key.includes(m[1])) referencedExports.add(key);
        }
      }
    }
  }
  const unusedExports = Object.keys(exportLocations).filter(k => !referencedExports.has(k));

  // ============== CONNECTIVITY ==============
  const connectivity = [];
  for (const [fp, m] of Object.entries(fileMetrics)) {
    if (!m) continue;
    const totalConnections = (m.fanIn || 0) + (m.fanOut || 0);
    connectivity.push({ path: fp, fullPath: join(ROOT, fp), fanIn: m.fanIn || 0, fanOut: m.fanOut || 0, totalConnections });
  }
  connectivity.sort((a, b) => b.totalConnections - a.totalConnections);

  // ============== REFACTOR PRIORITY ==============
  const refactorPriority = Object.entries(fileMetrics)
    .filter(([, m]) => m)
    .map(([fp, m]) => {
      let reason = [], action = 'Keep', score = 0;
      if (m.lines > 500) { reason.push(`Quá lớn (${m.lines} dòng)`); score += 30; action = 'Refactor'; }
      else if (m.lines > 300) { reason.push(`File lớn (${m.lines} dòng)`); score += 15; action = 'Review'; }
      if (m.complexity > 50) { reason.push(`Rất phức tạp (độ phức tạp=${m.complexity})`); score += 25; action = 'Refactor'; }
      else if (m.complexity > 20) { reason.push(`Độ phức tạp cao (${m.complexity})`); score += 12; }
      if (m.imports.length > 25) { reason.push(`Quá nhiều import (${m.imports.length})`); score += 15; action = action === 'Keep' ? 'Review' : action; }
      else if (m.imports.length > 15) { reason.push(`Nhiều import (${m.imports.length})`); score += 5; }
      if (m.exportCount > 15) { reason.push(`Xuất quá nhiều (${m.exportCount} exports)`); score += 10; action = action === 'Keep' ? 'Review' : action; }
      if ((m.fanIn || 0) > 20) { reason.push(`Fan-in cao (${m.fanIn} files import)`); score += 10; action = action === 'Keep' ? 'Review' : action; }
      if ((m.fanOut || 0) > 20) { reason.push(`Fan-out cao (${m.fanOut} imports)`); score += 10; action = action === 'Keep' ? 'Review' : action; }
      if (m.functions > 10) { reason.push(`${m.functions} functions`); score += 5; }
      if (score >= 30) action = 'Refactor';
      else if (score >= 15) action = 'Review';
      else if (score >= 5) action = 'Split';
      return { path: fp, lines: m.lines, complexity: m.complexity, functions: m.functions, classes: m.classes, imports: m.imports.length, exports: m.exportCount, fanIn: m.fanIn || 0, fanOut: m.fanOut || 0, score, action, reasons: reason.join('; ') };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  const fileCountByExt = {};
  for (const [fp, m] of Object.entries(fileMetrics)) {
    if (!m) continue;
    fileCountByExt[m.extension] = (fileCountByExt[m.extension] || 0) + 1;
  }

  // Architecture map
  const archModules = {};
  for (const [fp, m] of Object.entries(fileMetrics)) {
    if (!m) continue;
    const mod = m.archModule;
    if (!archModules[mod]) archModules[mod] = { files: [], totalLines: 0, totalFunctions: 0 };
    archModules[mod].files.push(fp);
    archModules[mod].totalLines += m.lines;
    archModules[mod].totalFunctions += m.functions || 0;
  }

  const riskWarnings = {
    circularDependencies: [],
    unusedExports: unusedExports.slice(0, 30).map(e => { const [fp, name] = e.split('::'); return { file: fp, exportName: name }; }),
    largeFiles: Object.entries(fileMetrics).filter(([, m]) => m.riskFlags.includes('large-file')).map(([fp]) => fp).filter(fp => !fp.endsWith('.css')),
    highComplexity: Object.entries(fileMetrics).filter(([, m]) => m.riskFlags.includes('high-complexity')).map(([fp, m]) => ({ path: fp, complexity: m.complexity })).filter(f => !f.path.endsWith('.css')),
  };

  // ============== BUSINESS FEATURES ==============
  console.log('[analysis] Building business feature map...');
  const featureFiles = {};
  for (const [fp, m] of Object.entries(fileMetrics)) {
    if (!m) continue;
    const feat = detectBusinessFeature(fp);
    if (!featureFiles[feat]) featureFiles[feat] = { pages: [], components: [], lib: [], api: [], data: [], scripts: [], config: [], styles: [], other: [] };
    const codeType = categorizeCodeType(fp);
    const entry = { path: fp, lines: m.lines, complexity: m.complexity, functions: m.functions, imports: m.imports.length, exports: m.exportCount, fanIn: m.fanIn || 0, fanOut: m.fanOut || 0 };
    if (codeType === 'pages-routes') featureFiles[feat].pages.push(entry);
    else if (codeType === 'ui-components') featureFiles[feat].components.push(entry);
    else if (codeType === 'core-lib-hooks') featureFiles[feat].lib.push(entry);
    else if (codeType === 'api-endpoints') featureFiles[feat].api.push(entry);
    else if (codeType === 'data-files') featureFiles[feat].data.push(entry);
    else if (codeType === 'scripts') featureFiles[feat].scripts.push(entry);
    else if (codeType === 'config-files') featureFiles[feat].config.push(entry);
    else if (codeType === 'styles') featureFiles[feat].styles.push(entry);
    else featureFiles[feat].other.push(entry);
  }

  // Build business feature dependency edges
  const featEdgeMatrix = {};
  for (const [fp, resolvedImports] of Object.entries(importsMap)) {
    const srcFeat = detectBusinessFeature(fp);
    if (!srcFeat) continue;
    for (const imp of resolvedImports) {
      const tgtFeat = imp.isExternal ? 'external' : detectBusinessFeature(imp.resolved || '');
      if (tgtFeat && tgtFeat !== srcFeat) {
        if (!featEdgeMatrix[srcFeat]) featEdgeMatrix[srcFeat] = {};
        if (!featEdgeMatrix[srcFeat][tgtFeat]) featEdgeMatrix[srcFeat][tgtFeat] = { count: 0, fileEdges: [] };
        featEdgeMatrix[srcFeat][tgtFeat].count++;
        featEdgeMatrix[srcFeat][tgtFeat].fileEdges.push({ from: fp, to: imp.resolved || imp.spec, spec: imp.spec });
      }
    }
  }
  const businessEdges = [];
  for (const [src, targets] of Object.entries(featEdgeMatrix)) {
    for (const [tgt, ed] of Object.entries(targets)) {
      const unique = new Set();
      const uniqueEdges = [];
      for (const fe of ed.fileEdges) {
        const key = `${fe.from}|${fe.to}`;
        if (!unique.has(key)) { unique.add(key); uniqueEdges.push(fe); }
      }
      businessEdges.push({
        source: src, target: tgt,
        sourceLabel: BUSINESS_FEATURE_LABELS[src] || src,
        targetLabel: BUSINESS_FEATURE_LABELS[tgt] || tgt,
        importCount: ed.count, uniqueFilePairs: uniqueEdges.length,
        fileEdges: uniqueEdges.slice(0, 50),
      });
    }
  }
  businessEdges.sort((a, b) => b.importCount - a.importCount);

  // Build business features output
  const businessFeatures = {};
  const featKeys = Object.keys(featureFiles).filter(k => k !== 'external').sort((a, b) => BUSINESS_FEATURE_ORDER.indexOf(a) - BUSINESS_FEATURE_ORDER.indexOf(b));
  for (const feat of featKeys) {
    const ff = featureFiles[feat];
    const allFilesInFeat = [...ff.pages, ...ff.components, ...ff.lib, ...ff.api, ...ff.data, ...ff.scripts, ...ff.config, ...ff.styles, ...ff.other];
    const totalFiles = allFilesInFeat.length;
    const totalLines = allFilesInFeat.reduce((s, f) => s + f.lines, 0);
    const totalComplexity = allFilesInFeat.reduce((s, f) => s + f.complexity, 0);
    const nonCSS = allFilesInFeat.filter(f => !f.path.endsWith('.css'));
    const riskyFiles = nonCSS.filter(f => (f.lines > 300 && f.complexity >= 15) || f.complexity > 20 || f.fanIn > 20 || f.fanOut > 20);
    const riskScore = Math.round(
      riskyFiles.length * 3 +
      nonCSS.filter(f => f.lines > 500).length * 2 +
      (totalComplexity > 100 ? 5 : 0) +
      (totalFiles > 20 ? 3 : 0)
    );

    // Incoming/outgoing deps
    const dependencies = businessEdges.filter(e => e.source === feat).map(e => ({ target: e.target, label: e.targetLabel, count: e.importCount, fileEdges: e.fileEdges }));
    const dependents = businessEdges.filter(e => e.target === feat).map(e => ({ source: e.source, label: e.sourceLabel, count: e.importCount, fileEdges: e.fileEdges }));

    // Technologies used
    const techs = new Set();
    if (ff.pages.some(f => /\.(tsx|jsx)$/.test(f.path))) techs.add('React');
    if (ff.pages.some(f => f.path.includes('app/'))) techs.add('Next.js App Router');
    if (ff.lib.some(f => f.path.includes('react-three') || f.path.includes('drei'))) techs.add('Three.js');
    if (ff.lib.some(f => f.path.includes('next-auth'))) techs.add('NextAuth');
    if (ff.lib.some(f => f.path.includes('tiptap'))) techs.add('TipTap');
    if (ff.lib.some(f => f.path.includes('db.js') || f.path.includes('db/'))) techs.add('JSON Database');
    if (ff.lib.some(f => f.path.includes('splinetool'))) techs.add('Spline 3D');
    if (ff.lib.some(f => f.path.includes('radix'))) techs.add('Radix UI');

    // Sort each code type group
    const sortByRisk = arr => [...arr].sort((a, b) => (b.lines + b.complexity * 2) - (a.lines + a.complexity * 2));

    businessFeatures[feat] = {
      id: feat,
      label: BUSINESS_FEATURE_LABELS[feat] || feat,
      description: BUSINESS_FEATURE_DESCRIPTIONS[feat] || '',
      totalFiles, totalLines, totalComplexity, riskScore,
      riskLevel: riskScore > 30 ? 'high' : riskScore > 15 ? 'medium' : 'low',
      riskyFiles: riskyFiles.length,
      files: {
        pages: sortByRisk(ff.pages).slice(0, 30),
        components: sortByRisk(ff.components).slice(0, 30),
        lib: sortByRisk(ff.lib).slice(0, 30),
        api: sortByRisk(ff.api).slice(0, 30),
        data: sortByRisk(ff.data).slice(0, 30),
        scripts: sortByRisk(ff.scripts).slice(0, 30),
        config: sortByRisk(ff.config).slice(0, 30),
        styles: sortByRisk(ff.styles).slice(0, 30),
      },
      fileCounts: {
        pages: ff.pages.length, components: ff.components.length,
        lib: ff.lib.length, api: ff.api.length, data: ff.data.length,
        scripts: ff.scripts.length, config: ff.config.length, styles: ff.styles.length,
      },
      dependencies,
      dependents,
      technologies: [...techs],
    };
  }

  // Render summary
  console.log(`\n=== BUSINESS FEATURES ===`);
  for (const feat of featKeys) {
    const bf = businessFeatures[feat];
    if (!bf || bf.totalFiles === 0) continue;
    console.log(`  ${bf.label}: ${bf.totalFiles} files, ${bf.totalLines} lines, risk=${bf.riskLevel}`);
  }
  console.log(`\n=== BUSINESS FEATURE EDGES (top 10) ===`);
  for (const edge of businessEdges.slice(0, 10)) {
    console.log(`  ${edge.sourceLabel} → ${edge.targetLabel}: ${edge.importCount} imports`);
  }

  // Render summary
  console.log(`\n=== LAYER GRAPH SUMMARY ===`);
  const layerKeys = Object.keys(layerDetails).sort((a, b) => LAYER_ORDER.indexOf(a) - LAYER_ORDER.indexOf(b));
  for (const layer of layerKeys) {
    if (layer === 'external') continue;
    const ld = layerDetails[layer];
    if (ld.fileCount === 0) continue;
    console.log(`  ${ld.label}: ${ld.fileCount} files, ${ld.totalLines} lines, ${ld.totalComplexity.toFixed(0)} complexity`);
  }
  console.log(`\n=== LAYER EDGES (top 15) ===`);
  for (const edge of layerEdges.slice(0, 15)) {
    console.log(`  ${edge.sourceLabel} → ${edge.targetLabel}: ${edge.importCount} imports (${edge.uniqueFilePairs} file pairs)`);
  }
  if (warnings.includes('pages-routes-to-ui-components-zero')) {
    console.log(`\n⚠️  WARNING: Pages & Routes → UI Components has ZERO direct imports. Parser may be missing @/ alias or dynamic imports.`);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    projectRoot: ROOT,
    summary: {
      totalFiles: allFiles.length,
      totalFunctions,
      totalClasses,
      totalLines,
      filesByExtension: fileCountByExt,
    },
    fileMetrics,
    refactorPriority,
    architectureMap: archModules,
    mostConnectedNodes: connectivity.slice(0, 30),
    riskWarnings,
    layerGraph: {
      layers: layerKeys.filter(k => k !== 'external').map(k => layerDetails[k]).filter(l => l.fileCount > 0),
      edges: layerEdges.filter(e => e.source !== 'external' && e.target !== 'external'),
      warnings,
    },
    businessFeatures,
    businessEdges,
  };

  const outputPath = join(ROOT, '.understand-anything', 'file-analysis.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n[analysis] Written to ${outputPath}`);
  console.log(`[analysis] ${allFiles.length} files, ${Object.keys(output.businessFeatures).length} business features, ${output.businessEdges.length} feature edges, ${output.layerGraph.edges.length} layer edges, ${unusedExports.length} unused exports`);
}

main();
