#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = 'C:/Users/Admin/Desktop/Website 3D/studio-3d';
const INTER = join(PROJECT_ROOT, '.understand-anything/intermediate');
const graph = JSON.parse(readFileSync(join(INTER, 'assembled-graph.json'), 'utf8'));
const layers = JSON.parse(readFileSync(join(INTER, 'layers.json'), 'utf8'));

const fileNodes = {};
for (const n of graph.nodes) {
  if (['file', 'config', 'document', 'service'].includes(n.type)) {
    fileNodes[n.id] = n;
  }
}

// Find key files
const entryFiles = Object.values(fileNodes).filter(n => n.name === 'layout.tsx' || n.name === 'page.tsx' || n.name === 'index.ts' || n.name === 'index.js' || n.name === 'page.js' || n.name === 'README.md');
const libFiles = Object.values(fileNodes).filter(n => n.filePath?.startsWith('src/lib/'));

const tour = [
  {
    order: 1,
    title: 'Tổng quan dự án',
    description: 'Studio 3D là website cá nhân của nghệ sĩ Tachy, xây dựng bằng Next.js với các trang trình diễn 3D, blog âm nhạc, shop và khu vực admin CMS.',
    nodeIds: ['document:README.md']
  },
  {
    order: 2,
    title: 'Cấu hình dự án',
    description: 'Các file cấu hình chính: Next.js, TypeScript, Tailwind CSS, ESLint và PostCSS.',
    nodeIds: ['config:next.config.mjs', 'config:tsconfig.json', 'config:tailwind.config.mjs', 'config:eslint.config.mjs', 'config:postcss.config.mjs']
  },
  {
    order: 3,
    title: 'Entry Point & Layout',
    description: 'Root layout và entry point của ứng dụng Next.js App Router.',
    nodeIds: (() => {
      const ids = [];
      const layout = Object.values(fileNodes).find(n => n.filePath === 'src/app/layout.tsx');
      if (layout) ids.push(layout.id);
      return ids;
    })()
  },
  {
    order: 4,
    title: 'Pages & Routes',
    description: 'Các trang chính và API routes của ứng dụng Next.js.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('src/app/') && (n.name === 'page.tsx' || n.name === 'route.tsx' || n.name === 'page.js')).slice(0, 8).map(n => n.id)
  },
  {
    order: 5,
    title: 'UI Components',
    description: 'Các React component chính bao gồm component 3D (Three.js), layout và UI widgets.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('src/components/')).slice(0, 10).map(n => n.id)
  },
  {
    order: 6,
    title: 'Core Library - Blog',
    description: 'Blog service với các handler CRUD, quản lý bài viết từ Google Sheets và sync dữ liệu.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('src/lib/blog/')).slice(0, 5).map(n => n.id)
  },
  {
    order: 7,
    title: 'Core Library - Database & Shop',
    description: 'Database abstraction layer và shop/product management services.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('src/lib/') && !n.filePath?.startsWith('src/lib/blog')).slice(0, 5).map(n => n.id)
  },
  {
    order: 8,
    title: 'Static Assets',
    description: 'Images, blog post hình ảnh, và tài nguyên tĩnh public.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('public/')).slice(0, 5).map(n => n.id)
  },
  {
    order: 9,
    title: 'Scripts & Automation',
    description: 'Scripts đồng bộ blog từ Google Sheets, index URLs, và quản lý nội dung.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('scripts/')).slice(0, 5).map(n => n.id)
  },
  {
    order: 10,
    title: 'Dữ liệu Blog & Shop',
    description: 'Cơ sở dữ liệu JSON chứa blog posts, sản phẩm và nội dung site.',
    nodeIds: Object.values(fileNodes).filter(n => n.filePath?.startsWith('db/')).slice(0, 5).map(n => n.id)
  },
];

writeFileSync(join(INTER, 'tour.json'), JSON.stringify(tour, null, 2));
console.log(`Tour created with ${tour.length} steps.`);
