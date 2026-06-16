import { readFileSync, writeFileSync } from 'fs';

const posts = JSON.parse(readFileSync('db/blog.json', 'utf-8'));

const brands = [
  'Shure', 'Beyerdynamic', 'Sennheiser', 'Audio-Technica', 'Yamaha', 'KRK', 'Rode',
  'Focusrite', 'SSL', 'Universal Audio', 'Audient', 'MOTU', 'AKG', 'Neumann',
  'Adam Audio', 'Genelec', 'Focal', 'Pioneer', 'Roland', 'Korg', 'Native Instruments',
  'Arturia', 'Akai', 'Novation', 'Presonus', 'Mackie', 'JBL', 'Sony', 'AKG',
  'Aston', 'Lewitt', 'Warm Audio', 'Cloudlifter', 'dbx', 'Behringer', 'Samson',
  'Blue', 'CAD', 'Electro-Voice', 'Heil', 'sE Electronics', 'Slate Digital',
  'Waves', 'iZotope', 'FabFilter', 'Valhalla', 'Soundtoys', 'Output', 'Serum',
  'Kontakt', 'Komplete', 'Ableton', 'FL Studio', 'Logic Pro', 'Cubase', 'Pro Tools',
  'Studio One'
];

const models = [
  'SM7B', 'NT1', 'AT2020', 'DT770', 'DT990', 'HD600', 'HD650', 'HD660S',
  'HS5', 'HS7', 'HS8', 'HS80', 'Rokit', 'Scarlett', 'Clarett', 'Volt',
  'SSL2', 'ID14', 'ID44', 'MKII', '2i2', '4i4', 'Solo', 'Apollo', 'Twin',
  'Quad', 'UA', 'RME Babyface', 'RME Fireface', 'LA-610', 'WA-47',
  '1176', 'LA-2A', 'CL-1B'
];

const genericTerms = [
  'audio interface', 'microphone', 'tai nghe', 'loa kiểm âm', 'headphone',
  'studio monitor', 'condenser mic', 'dynamic mic', 'preamp', 'pop filter',
  'mic stand', 'shock mount', 'acoustic foam', 'bass trap', 'sound panel',
  'cable', 'XLR', 'TRS', 'MIDI keyboard', 'MIDI controller', 'DAW controller',
  'studio desk', 'rack case', 'power conditioner', 'studio chair',
  'monitor stand', 'isolation pad', 'reflection filter', 'gobo', 'subwoofer',
  'patch bay', 'snake cable', 'headphone amp', 'monitor controller'
];

function buildPatterns() {
  const patterns = [];
  const brandMap = {};
  const modelMap = {};
  const genericMap = {};

  for (const b of brands) {
    const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    patterns.push(re);
    brandMap[re.source] = { name: b, type: 'Brand' };
  }

  for (const m of models) {
    const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    patterns.push(re);
    modelMap[re.source] = { name: m, type: 'Model' };
  }

  for (const g of genericTerms) {
    const escaped = g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    patterns.push(re);
    genericMap[re.source] = { name: g, type: 'Generic' };
  }

  return { patterns, brandMap, modelMap, genericMap };
}

const { patterns, brandMap, modelMap, genericMap } = buildPatterns();
const allMaps = { ...brandMap, ...modelMap, ...genericMap };

const results = [];
const productIndex = {}; // product -> { posts: [], totalMentions: number }

for (const post of posts) {
  const hasLinks = post.links && post.links.length > 0;
  const foundProducts = new Map(); // normalized name -> { name, type, count }

  for (const re of patterns) {
    const matches = post.content.matchAll(re);
    for (const match of matches) {
      const info = allMaps[re.source];
      const key = info.name.toLowerCase();
      if (!foundProducts.has(key)) {
        foundProducts.set(key, { name: info.name, type: info.type, count: 0 });
      }
      foundProducts.get(key).count++;
    }
  }

  if (foundProducts.size === 0) continue;

  const products = Array.from(foundProducts.values()).sort((a, b) => b.count - a.count);

  for (const p of products) {
    const pkey = p.name.toLowerCase();
    if (!productIndex[pkey]) {
      productIndex[pkey] = { name: p.name, type: p.type, totalMentions: 0, posts: [] };
    }
    productIndex[pkey].totalMentions += p.count;
    productIndex[pkey].posts.push({
      title: post.title,
      slug: post.slug,
      hasLinks,
      mentions: p.count
    });
  }

  results.push({
    title: post.title,
    slug: post.slug,
    category: post.category,
    hasLinks,
    products
  });
}

// Group products by type
const allProducts = Object.values(productIndex).sort((a, b) => b.totalMentions - a.totalMentions);
const branded = allProducts.filter(p => p.type === 'Brand');
const modeled = allProducts.filter(p => p.type === 'Model');
const generics = allProducts.filter(p => p.type === 'Generic');

// --- GENERATE REPORT ---
let md = `# Product Affiliate Link Audit

**Generated:** ${new Date().toISOString().split('T')[0]}
**Total posts analyzed:** ${posts.length}
**Posts with product mentions:** ${results.length}
**Unique products found:** ${allProducts.length}
**Posts with existing affiliate links:** ${results.filter(r => r.hasLinks).length}
**Posts WITHOUT affiliate links (opportunities):** ${results.filter(r => !r.hasLinks).length}

---

## Summary by Type

| Type | Count | Products |
|------|-------|----------|
| Brands | ${branded.length} | ${branded.map(p => p.name).join(', ')} |
| Models | ${modeled.length} | ${modeled.map(p => p.name).join(', ')} |
| Generic | ${generics.length} | ${generics.map(p => p.name).join(', ')} |

---

## Top 50 Most Mentioned Products

| # | Product | Type | Mentions | Posts | Has Links |
|---|---------|------|----------|-------|-----------|
${allProducts.slice(0, 50).map((p, i) => {
  const postsWithLinks = p.posts.filter(pp => pp.hasLinks).length;
  return `| ${i+1} | ${p.name} | ${p.type} | ${p.totalMentions} | ${p.posts.length} | ${postsWithLinks > 0 ? 'Yes (' + postsWithLinks + ')' : 'No' } |`;
}).join('\n')}

---

## Posts Without Affiliate Links (Opportunities)

${results.filter(r => !r.hasLinks).map(r => {
  const prodList = r.products.map(p => `    - **${p.name}** (${p.type}) — ${p.count}x mention(s)`).join('\n');
  return `### ${r.title}
  **Slug:** \`${r.slug}\`
  **Category:** ${r.category}
  **Products found:**
${prodList}
  `;
}).join('\n')}

---

## Posts WITH Affiliate Links (Reference)

${results.filter(r => r.hasLinks).map(r => {
  const prodList = r.products.map(p => `    - **${p.name}** (${p.type}) — ${p.count}x mention(s)`).join('\n');
  return `### ${r.title}
  **Slug:** \`${r.slug}\`
  **Category:** ${r.category}
  **Products found:**
${prodList}
  `;
}).join('\n')}

---

## Full Product Directory

${allProducts.map(p => {
  const postEntries = p.posts.map(pp => `    - [${pp.title}](https://tachy.io.vn/blog/${pp.slug}) — ${pp.mentions}x — ${pp.hasLinks ? '✅ Has links' : '❌ No links'}`).join('\n');
  return `### ${p.name} (${p.type})
**Total mentions across all posts:** ${p.totalMentions}
**Appears in ${p.posts.length} post(s):**
${postEntries}
`;
}).join('\n')}

---

*End of audit.*
`;

writeFileSync('_product-affiliate-audit.md', md, 'utf-8');
console.log(`Done. Analyzed ${posts.length} posts, found ${allProducts.length} unique products across ${results.length} posts.`);
console.log(`Report written to _product-affiliate-audit.md`);
