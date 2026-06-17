#!/usr/bin/env node
const fs = require('fs');
const graph = JSON.parse(fs.readFileSync('C:/Users/Admin/Desktop/Website 3D/studio-3d/.understand-anything/knowledge-graph.json', 'utf8'));

const issues = [];
graph.nodes.forEach((n, i) => {
  if (!n.id) issues.push(`Node[${i}] missing id`);
  if (!n.type) issues.push(`Node[${i}] '${n.id}' missing type`);
  if (!n.name) issues.push(`Node[${i}] '${n.id}' missing name`);
  if (!n.summary) issues.push(`Node[${i}] '${n.id}' missing summary`);
  if (!n.tags || !n.tags.length) issues.push(`Node[${i}] '${n.id}' missing tags`);
});

console.log('Post-fix validation:');
if (issues.length === 0) console.log('  ✅ All nodes valid');
else console.log(`  ⚠️  ${issues.length} issues remaining:\n  ` + issues.slice(0, 10).join('\n  '));

const stats = {
  totalNodes: graph.nodes.length,
  totalEdges: graph.edges.length,
  totalLayers: graph.layers.length,
  tourSteps: graph.tour.length,
  nodeTypes: graph.nodes.reduce((a, n) => { a[n.type] = (a[n.type]||0)+1; return a; }, {}),
  edgeTypes: graph.edges.reduce((a, e) => { a[e.type] = (a[e.type]||0)+1; return a; }, {}),
};
console.log('\nStats:', JSON.stringify(stats, null, 2));
