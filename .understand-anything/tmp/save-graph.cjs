#!/usr/bin/env node
const fs = require('fs');
const { join } = require('path');

const PROJECT_ROOT = 'C:/Users/Admin/Desktop/Website 3D/studio-3d';
const INTER = join(PROJECT_ROOT, '.understand-anything/intermediate');

const assembled = JSON.parse(fs.readFileSync(join(INTER, 'assembled-graph.json'), 'utf8'));
const layers = JSON.parse(fs.readFileSync(join(INTER, 'layers.json'), 'utf8'));
const tour = JSON.parse(fs.readFileSync(join(INTER, 'tour.json'), 'utf8'));

// Build final knowledge graph
const now = new Date().toISOString();
const graph = {
  version: '1.0.0',
  project: {
    name: 'studio-3d',
    languages: ['css', 'javascript', 'json', 'markdown', 'typescript'],
    frameworks: ['Next.js', 'React', 'Tailwind CSS', 'Three.js', 'NextAuth', 'TipTap'],
    description: 'Website studio/nghệ sĩ xây bằng Next.js, kết hợp các trang trình diễn 3D, blog, shop, khu vực admin CMS và các script đồng bộ/index dữ liệu.',
    analyzedAt: now,
    gitCommitHash: 'f317feef8508c58ef5d16ab439c14783f0daf52c',
  },
  nodes: assembled.nodes || [],
  edges: assembled.edges || [],
  layers: layers,
  tour: tour,
};

// Validate
const issues = [];
const warnings = [];
const nodeIds = new Set();
const seen = new Map();

graph.nodes.forEach((n, i) => {
  if (!n.id) { issues.push(`Node[${i}] missing id`); return; }
  if (!n.type) issues.push(`Node[${i}] '${n.id}' missing type`);
  if (!n.name) issues.push(`Node[${i}] '${n.id}' missing name`);
  if (!n.summary) issues.push(`Node[${i}] '${n.id}' missing summary`);
  if (!n.tags || !n.tags.length) issues.push(`Node[${i}] '${n.id}' missing tags`);
  if (seen.has(n.id)) issues.push(`Duplicate node ID '${n.id}'`);
  else seen.set(n.id, i);
  nodeIds.add(n.id);
});

graph.edges.forEach((e, i) => {
  if (!nodeIds.has(e.source)) issues.push(`Edge[${i}] source '${e.source}' not found`);
  if (!nodeIds.has(e.target)) issues.push(`Edge[${i}] target '${e.target}' not found`);
});

// Check layers
const assigned = new Map();
graph.layers.forEach(layer => {
  if (!layer.id) issues.push('Layer missing id');
  if (!layer.name) issues.push('Layer missing name');
  if (!layer.description) issues.push('Layer missing description');
  (layer.nodeIds || []).forEach(id => {
    if (!nodeIds.has(id)) issues.push(`Layer '${layer.id}' refs missing node '${id}'`);
    if (assigned.has(id)) issues.push(`Node '${id}' appears in multiple layers`);
    assigned.set(id, layer.id);
  });
});

// Check tour
graph.tour.forEach((step, i) => {
  if (!step.order) issues.push(`Tour step[${i}] missing order`);
  if (!step.title) issues.push(`Tour step[${i}] missing title`);
  if (!step.description) issues.push(`Tour step[${i}] missing description`);
  (step.nodeIds || []).forEach(id => {
    if (!nodeIds.has(id)) issues.push(`Tour step[${i}] refs missing node '${id}'`);
  });
});

// Orphan nodes
const withEdges = new Set([...graph.edges.map(e => e.source), ...graph.edges.map(e => e.target)]);
graph.nodes.forEach(n => {
  if (!withEdges.has(n.id) && n.type !== 'document') warnings.push(`Node '${n.id}' has no edges (orphan)`);
});

const stats = {
  totalNodes: graph.nodes.length,
  totalEdges: graph.edges.length,
  totalLayers: graph.layers.length,
  tourSteps: graph.tour.length,
  nodeTypes: graph.nodes.reduce((a, n) => { a[n.type] = (a[n.type]||0)+1; return a; }, {}),
  edgeTypes: graph.edges.reduce((a, e) => { a[e.type] = (a[e.type]||0)+1; return a; }, {}),
};

console.log('=== Validation Results ===');
console.log(`Issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Stats: ${JSON.stringify(stats, null, 2)}`);

if (issues.length > 0) {
  console.log('Issues:', issues.slice(0, 20).join('\n  '));
  if (issues.length > 20) console.log(`  ... and ${issues.length - 20} more`);
}

// If issues exist, try to fix
if (issues.length > 0) {
  // Remove dangling edges
  const validNodeIds = new Set(graph.nodes.map(n => n.id));
  graph.edges = graph.edges.filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target));
  console.log(`After fix: ${graph.edges.length} edges remaining`);
}

// Write final graph
fs.writeFileSync(join(PROJECT_ROOT, '.understand-anything/knowledge-graph.json'), JSON.stringify(graph, null, 2));
console.log(`\nWritten: ${PROJECT_ROOT}/.understand-anything/knowledge-graph.json`);

// Write meta
const meta = {
  lastAnalyzedAt: now,
  gitCommitHash: 'f317feef8508c58ef5d16ab439c14783f0daf52c',
  version: '1.0.0',
  analyzedFiles: graph.nodes.filter(n => ['file', 'config', 'document', 'service', 'pipeline', 'schema', 'resource'].includes(n.type)).length,
};
fs.writeFileSync(join(PROJECT_ROOT, '.understand-anything/meta.json'), JSON.stringify(meta, null, 2));
console.log(`Written: ${PROJECT_ROOT}/.understand-anything/meta.json`);

// Write review.json
const review = { issues, warnings, stats };
fs.writeFileSync(join(INTER, 'review.json'), JSON.stringify(review, null, 2));

if (issues.length === 0) console.log('\n✅ Graph validation PASSED.');
else console.log(`\n⚠️  Graph saved with ${issues.length} issues (dangling edges removed).`);
