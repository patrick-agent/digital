#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = 'C:/Users/Admin/Desktop/Website 3D/studio-3d';
const INTER = join(PROJECT_ROOT, '.understand-anything/intermediate');
const graph = JSON.parse(readFileSync(join(INTER, 'assembled-graph.json'), 'utf8'));

// Build directory-based layers
const layerMap = {
  'src': { id: 'layer:source-code', name: 'Source Code', description: 'Main application source code including components, pages, API routes, and library modules.' },
  'src/lib': { id: 'layer:core-library', name: 'Core Library', description: 'Shared library code including database, blog, shop, and utility modules.' },
  'src/components': { id: 'layer:components', name: 'UI Components', description: 'Reusable React UI components including 3D scenes, layouts, and widgets.' },
  'src/app': { id: 'layer:pages-routes', name: 'Pages & Routes', description: 'Next.js App Router pages, API routes, and layout definitions.' },
  'public': { id: 'layer:static-assets', name: 'Static Assets', description: 'Public static files including images, fonts, and client-side scripts.' },
  'scripts': { id: 'layer:scripts', name: 'Scripts & Automation', description: 'Build, sync, and automation scripts for blog management and deployment.' },
  'db': { id: 'layer:data-storage', name: 'Data & Storage', description: 'JSON-based data storage for blog posts, products, and site content.' },
  'docs': { id: 'layer:documentation', name: 'Documentation', description: 'Project documentation and guides.' },
  'config': { id: 'layer:configuration', name: 'Configuration', description: 'Root-level project configuration files (ESLint, PostCSS, Next.js, etc.).' },
};

// Assign file-level nodes to layers
const fileNodes = graph.nodes.filter(n => ['file', 'config', 'document', 'service', 'pipeline', 'schema', 'resource', 'table', 'endpoint'].includes(n.type));
const layers = {};

for (const [key, def] of Object.entries(layerMap)) {
  layers[def.id] = { ...def, nodeIds: [] };
}

// Add catch-all layer
layers['layer:other'] = { id: 'layer:other', name: 'Other', description: 'Files that do not fit into other specific layers.', nodeIds: [] };

for (const n of fileNodes) {
  const p = n.filePath || '';
  let assigned = false;

  if (p.startsWith('src/lib/')) {
    layers['layer:core-library'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('src/components/')) {
    layers['layer:components'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('src/app/')) {
    layers['layer:pages-routes'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('src/')) {
    layers['layer:source-code'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('public/')) {
    layers['layer:static-assets'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('scripts/')) {
    layers['layer:scripts'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('db/')) {
    layers['layer:data-storage'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.startsWith('docs/')) {
    layers['layer:documentation'].nodeIds.push(n.id);
    assigned = true;
  } else if (p.includes('.json') || p.includes('.mjs') || p.includes('.config') || p.includes('eslint') || p.includes('postcss') || p.includes('next.config') || p.includes('tailwind') || p.includes('tsconfig') || p.includes('.env') || p.includes('Dockerfile') || p.includes('.gitignore') || p.includes('.vercel')) {
    if (!p.startsWith('.understand') && !p.startsWith('.opencode') && !p.startsWith('.learnings')) {
      layers['layer:configuration'].nodeIds.push(n.id);
      assigned = true;
    }
  }

  if (!assigned) {
    layers['layer:other'].nodeIds.push(n.id);
  }
}

// Remove empty layers
const finalLayers = Object.values(layers).filter(l => l.nodeIds.length > 0);

console.log('Layers created:', finalLayers.map(l => `${l.name} (${l.nodeIds.length} nodes)`).join(', '));

writeFileSync(join(INTER, 'layers.json'), JSON.stringify(finalLayers, null, 2));
console.log('Written to layers.json');
