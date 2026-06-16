import fs from 'fs';

const posts = JSON.parse(fs.readFileSync('db/blog.json', 'utf8'));

// Hardware/gear only — with full names for display, and search keywords for matching
// Format: { displayName, searchTerms: [...] }
const gearDB = {
  'audio-interface': {
    label: 'Audio Interface',
    items: [
      { name: 'Focusrite Scarlett Solo', search: ['scarlett solo', 'focusrite solo'] },
      { name: 'Focusrite Scarlett 2i2', search: ['scarlett 2i2', 'focusrite 2i2', '2i2'] },
      { name: 'Focusrite Scarlett 4i4', search: ['scarlett 4i4', '4i4'] },
      { name: 'Focusrite Clarett+ 2Pre', search: ['clarett', 'focusrite clarett'] },
      { name: 'Focusrite Clarett+ 4Pre', search: ['clarett 4pre'] },
      { name: 'SSL 2', search: ['ssl 2', 'ssl2'] },
      { name: 'SSL 2+', search: ['ssl 2+', 'ssl2+'] },
      { name: 'SSL 12', search: ['ssl 12', 'ssl12'] },
      { name: 'Audient iD14 MkII', search: ['audient id14', 'id14 mkii', 'id14'] },
      { name: 'Audient iD44 MkII', search: ['audient id44', 'id44'] },
      { name: 'MOTU M2', search: ['motu m2'] },
      { name: 'MOTU M4', search: ['motu m4'] },
      { name: 'Universal Audio Apollo Twin X', search: ['apollo twin', 'ua apollo'] },
      { name: 'Universal Audio Apollo x4', search: ['apollo x4'] },
      { name: 'Universal Audio Volt 1', search: ['ua volt', 'volt 1', 'universal audio volt'] },
      { name: 'Universal Audio Volt 2', search: ['volt 2', 'ua volt 2'] },
      { name: 'Universal Audio Volt 276', search: ['volt 276'] },
      { name: 'RME Babyface Pro FS', search: ['rme babyface', 'babyface pro'] },
      { name: 'RME Fireface UCX II', search: ['rme fireface', 'fireface ucx'] },
      { name: 'PreSonus Studio 24c', search: ['presonus studio 24c'] },
      { name: 'PreSonus Studio 68c', search: ['presonus studio 68c'] },
      { name: 'Behringer U-Phoria UMC204HD', search: ['behringer umc204', 'umc204hd'] },
      { name: 'Behringer U-Phoria UMC404HD', search: ['behringer umc404', 'umc404hd'] },
      { name: 'Arturia MiniFuse 2', search: ['arturia minifuse 2', 'minifuse 2'] },
      { name: 'Arturia MiniFuse 4', search: ['arturia minifuse 4'] },
    ]
  },
  microphone: {
    label: 'Microphone',
    items: [
      { name: 'Shure SM7B', search: ['shure sm7b', 'sm7b'] },
      { name: 'Shure SM58', search: ['shure sm58', 'sm58'] },
      { name: 'Shure SM57', search: ['shure sm57', 'sm57'] },
      { name: 'Shure MV7', search: ['shure mv7', 'mv7'] },
      { name: 'Rode NT1 (5th Gen)', search: ['rode nt1', 'rode nt-1', 'nt1'] },
      { name: 'Rode NT1-A', search: ['rode nt1-a', 'rode nt1a', 'nt1-a'] },
      { name: 'Rode NT-USB', search: ['rode nt-usb', 'rode natusb'] },
      { name: 'Audio-Technica AT2020', search: ['audio-technica at2020', 'at2020'] },
      { name: 'Audio-Technica AT2035', search: ['at2035'] },
      { name: 'Audio-Technica AT4040', search: ['at4040'] },
      { name: 'AKG C214', search: ['akg c214', 'c214'] },
      { name: 'AKG C414', search: ['akg c414', 'c414'] },
      { name: 'AKG C3000', search: ['akg c3000', 'c3000'] },
      { name: 'AKG C1000S', search: ['akg c1000', 'c1000'] },
      { name: 'AKG P120', search: ['akg p120', 'p120'] },
      { name: 'Lewitt LCT 240 PRO', search: ['lewitz lct 240', 'lct 240'] },
      { name: 'Lewitt LCT 440 PURE', search: ['lewitz lct 440', 'lct 440', 'lct 440 pure'] },
      { name: 'Aston Origin', search: ['aston origin'] },
      { name: 'Aston Spirit', search: ['aston spirit'] },
      { name: 'sE Electronics sE2200', search: ['se2200', 'sE 2200'] },
      { name: 'Neumann TLM 103', search: ['neumann tlm 103', 'tlm 103'] },
      { name: 'Neumann U87', search: ['neumann u87', 'u87'] },
      { name: 'Blue Yeti', search: ['blue yeti'] },
      { name: 'Samson Q2U', search: ['samson q2u', 'q2u'] },
      { name: 'Samson C01', search: ['samson c01'] },
      { name: 'Warm Audio WA-47', search: ['warm audio wa-47', 'wa-47'] },
      { name: 'Cloudlifter CL-1', search: ['cloudlifter cl-1', 'cloudlifter', 'cl-1'] },
      { name: 'Triton Audio FetHead', search: ['triton fethead', 'fethead'] },
      { name: 'sE Electronics DM1 Dynamite', search: ['se dm1', 'sE dynamite', 'dm1'] },
    ]
  },
  headphone: {
    label: 'Tai nghe Studio',
    items: [
      { name: 'Beyerdynamic DT 770 Pro', search: ['beyerdynamic dt770', 'dt 770 pro', 'dt770', 'beyerdynamic dt 770'] },
      { name: 'Beyerdynamic DT 990 Pro', search: ['beyerdynamic dt990', 'dt 990 pro', 'dt990', 'beyerdynamic dt 990'] },
      { name: 'Beyerdynamic DT 1770 Pro', search: ['dt 1770', 'dt1770'] },
      { name: 'Beyerdynamic DT 1990 Pro', search: ['dt 1990', 'dt1990'] },
      { name: 'Sennheiser HD 600', search: ['sennheiser hd600', 'hd 600', 'hd600'] },
      { name: 'Sennheiser HD 650', search: ['sennheiser hd650', 'hd 650', 'hd650'] },
      { name: 'Sennheiser HD 660S2', search: ['hd 660s', 'hd660s'] },
      { name: 'Sennheiser HD 560S', search: ['hd 560s', 'hd560s'] },
      { name: 'Sennheiser HD 25', search: ['sennheiser hd25', 'hd 25', 'hd25'] },
      { name: 'AKG K240 Studio', search: ['akg k240', 'k240'] },
      { name: 'AKG K371', search: ['akg k371', 'k371'] },
      { name: 'AKG K701', search: ['akg k701', 'k701'] },
      { name: 'AKG K712 Pro', search: ['akg k712', 'k712'] },
      { name: 'Sony MDR-7506', search: ['sony mdr-7506', 'mdr-7506', 'mdr 7506'] },
      { name: 'Sony MDR-CD900ST', search: ['mdr-cd900st', 'cd900st'] },
      { name: 'Audio-Technica ATH-M50x', search: ['ath-m50x', 'm50x', 'ath m50'] },
      { name: 'Audio-Technica ATH-M40x', search: ['ath-m40x', 'm40x'] },
      { name: 'Focal Clear MG', search: ['focal clear'] },
      { name: 'Hifiman Sundara', search: ['hifiman sundara', 'sundara'] },
      { name: 'Slate Audio VSX', search: ['slate vsx', 'slate audio vsx'] },
    ]
  },
  monitor: {
    label: 'Loa kiểm âm',
    items: [
      { name: 'Yamaha HS5', search: ['yamaha hs5', 'hs5'] },
      { name: 'Yamaha HS7', search: ['yamaha hs7', 'hs7'] },
      { name: 'Yamaha HS8', search: ['yamaha hs8', 'hs8'] },
      { name: 'KRK Rokit 5 G4', search: ['krk rokit 5', 'rokit 5'] },
      { name: 'KRK Rokit 7 G4', search: ['krk rokit 7', 'rokit 7'] },
      { name: 'KRK Rokit 8 G4', search: ['krk rokit 8', 'rokit 8', 'krk rokit'] },
      { name: 'JBL 305P MkII', search: ['jbl 305p', 'jbl 305'] },
      { name: 'JBL 306P MkII', search: ['jbl 306p', 'jbl 306'] },
      { name: 'JBL 308P MkII', search: ['jbl 308p', 'jbl 308'] },
      { name: 'Adam A7X', search: ['adam a7x', 'adam audio a7x'] },
      { name: 'Adam T5V', search: ['adam t5v', 't5v'] },
      { name: 'Adam T7V', search: ['adam t7v', 't7v'] },
      { name: 'Genelec 8030C', search: ['genelec 8030', 'genelec 8030c'] },
      { name: 'Focal Alpha 65 Evo', search: ['focal alpha 65', 'alpha 65'] },
      { name: 'PreSonus Eris E5 XT', search: ['presonus eris e5', 'eris e5'] },
      { name: 'iLoud Micro Monitor', search: ['iloud micro monitor', 'iloud micro'] },
      { name: 'iLoud MTM', search: ['iloud mtm'] },
    ]
  },
  'midi-controller': {
    label: 'MIDI Controller / Keyboard',
    items: [
      { name: 'Akai MPK Mini Mk3', search: ['akai mpk mini', 'mpk mini'] },
      { name: 'Akai MPD218', search: ['akai mpd218', 'mpd218'] },
      { name: 'Akai APC40 MkII', search: ['akai apc40', 'apc40'] },
      { name: 'Akai MPC One', search: ['akai mpc one', 'mpc one'] },
      { name: 'Arturia MiniLab 3', search: ['arturia minilab 3', 'minilab 3', 'minilab'] },
      { name: 'Arturia KeyLab 49', search: ['arturia keylab', 'keylab'] },
      { name: 'Arturia KeyStep 37', search: ['arturia keystep', 'keystep'] },
      { name: 'Arturia BeatStep Pro', search: ['beatstep pro'] },
      { name: 'Novation Launchpad X', search: ['novation launchpad', 'launchpad x', 'launchpad'] },
      { name: 'Novation Launchkey 49', search: ['novation launchkey', 'launchkey 49'] },
      { name: 'Novation FLkey', search: ['novation flkey', 'flkey'] },
      { name: 'Novation SL MkIII', search: ['novation sl mkiii', 'sl mkiii'] },
      { name: 'Native Instruments Komplete Kontrol A49', search: ['komplete kontrol a49', 'komplete kontrol'] },
      { name: 'Native Instruments Maschine Mk3', search: ['maschine mk3', 'ni maschine'] },
      { name: 'Native Instruments Maschine Mikro Mk3', search: ['maschine mikro'] },
      { name: 'Ableton Push 2', search: ['ableton push 2', 'push 2'] },
      { name: 'Ableton Push 3', search: ['ableton push 3', 'push 3'] },
      { name: 'Korg minilogue XD', search: ['korg minilogue', 'minilogue'] },
      { name: 'Korg Volca series', search: ['korg volca', 'volca'] },
      { name: 'Roland SP-404 MkII', search: ['roland sp-404', 'sp-404'] },
      { name: 'Roland TR-8S', search: ['roland tr-8s', 'tr-8s'] },
      { name: 'M-Audio Oxygen Pro 49', search: ['maudio oxygen pro', 'oxygen pro 49'] },
    ]
  },
  'accessory': {
    label: 'Phụ kiện phòng thu',
    items: [
      { name: 'Pop filter', search: ['pop filter', 'popfilter'] },
      { name: 'Mic stand (chân đế micro)', search: ['mic stand', 'micro stand', 'chân đế micro', 'chân micro'] },
      { name: 'Shock mount', search: ['shock mount', 'chống rung micro'] },
      { name: 'Reflection filter (tấm chắn âm)', search: ['reflection filter', 'tấm chắn âm'] },
      { name: 'Isolation pad (đế cách rung loa)', search: ['isolation pad', 'cách rung loa'] },
      { name: 'Monitor stand (chân đế loa)', search: ['monitor stand', 'chân đế loa', 'giá loa'] },
      { name: 'Headphone amp', search: ['headphone amp', 'headphone amplifier'] },
      { name: 'Cáp XLR', search: ['cáp xlr', 'cap xlr', 'xlr cable'] },
      { name: 'Cáp TRS / TS (jack)', search: ['cáp trs', 'cáp ts', 'cap trs', 'jack trs', 'dây trs', '1/4 inch'] },
      { name: 'Acoustic foam (miếng tiêu âm)', search: ['acoustic foam', 'tiêu âm', 'mút tiêu âm'] },
      { name: 'Bass trap (bẫy bass)', search: ['bass trap', 'bẫy bass', 'bẫy low'] },
      { name: 'Diffuser (tấm khuếch tán)', search: ['diffuser', 'khuếch tán âm'] },
      { name: 'Power conditioner (ổ lọc điện)', search: ['power conditioner', 'ổ lọc điện', 'lọc điện'] },
      { name: 'Patch bay', search: ['patch bay'] },
      { name: 'Subwoofer', search: ['subwoofer'] },
      { name: 'Monitor controller', search: ['monitor controller'] },
      { name: 'Rack case (tủ rack)', search: ['rack case', 'tủ rack'] },
    ]
  }
};

// Build search index: each searchTerm -> product info
const searchIndex = {};
for (const [cat, data] of Object.entries(gearDB)) {
  for (const item of data.items) {
    const lk = item.name.toLowerCase();
    // Add the product name itself
    searchIndex[lk] = { keyword: item.name, category: cat, categoryLabel: data.label, searchKeys: item.search };
    // Also store record for direct name matching later
  }
}

// Build regex search patterns with word boundaries for short terms
function buildRegex(term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // If term has spaces or is long, just do simple match
  // For short terms (< 6 chars), use word boundaries
  const clean = term.trim();
  if (clean.length < 6 && /^[a-zA-Z0-9-]+$/.test(clean)) {
    return new RegExp(`\\b${escaped}\\b`, 'gi');
  }
  return new RegExp(escaped.replace(/\s+/g, '\\s+'), 'gi');
}

// For matching: check if content contains the product name OR any search terms
const matchRules = [];
for (const [cat, data] of Object.entries(gearDB)) {
  for (const item of data.items) {
    matchRules.push({
      keyword: item.name,
      category: cat,
      categoryLabel: data.label,
      terms: item.search,
      regexes: item.search.map(t => buildRegex(t))
    });
  }
}

// Scan each post for each product
const results = {};
for (const rule of matchRules) {
  results[rule.keyword] = { keyword: rule.keyword, category: rule.category, categoryLabel: rule.categoryLabel, posts: [] };
}

for (const post of posts) {
  for (const rule of matchRules) {
    let count = 0;
    for (const regex of rule.regexes) {
      const matches = post.content.match(regex);
      if (matches) count += matches.length;
    }
    if (count > 0) {
      results[rule.keyword].posts.push({
        title: post.title,
        slug: post.slug,
        category: post.category,
        count
      });
    }
  }
}

// Filter to products with at least 1 mention
const activeProducts = Object.values(results).filter(p => p.posts.length > 0);

// Sort by mention count desc
activeProducts.sort((a, b) => {
  const totalA = a.posts.reduce((s, p) => s + p.count, 0);
  const totalB = b.posts.reduce((s, p) => s + p.count, 0);
  return totalB - totalA;
});

// Build markdown
let md = `# Danh sach Gear can gan link Affiliate

**Tong quan:**
- Tong bai viet: ${posts.length}
- Gear phat hien: ${activeProducts.length}
- Bai viet DA co link affiliate: ${posts.filter(p => p.links && p.links.length > 0).length}
- Bai viet CHUA co link affiliate: ${posts.filter(p => !p.links || p.links.length === 0).length}

> Chi bao gom **phan cung (gear)** — da loai bo plugin/phan mem.
> Hay dien **Affiliate Link** va **Gia tham khao** vao cac o trong ben duoi.

---

## Cach su dung

1. Tim san pham trong cac bang ben duoi
2. Nhap **Affiliate Link** (URL day du) vao cot tuong ung
3. Nhap **Gia tham khao** (VND) de tien tham khao
4. Khi ban da dien xong — bao minh, minh se tu dong update vao **tat ca bai viet** co chua san pham do

---

`;

// Group by category
const cats = {};
for (const p of activeProducts) {
  if (!cats[p.category]) cats[p.category] = [];
  cats[p.category].push(p);
}

for (const [catKey, products] of Object.entries(cats)) {
  const catLabel = products[0].categoryLabel;
  md += `## ${catLabel}\n\n`;
  md += `| # | San pham | So bai viet | Tong luot de cap | Affiliate Link | Gia (VND) |\n`;
  md += `|---|----------|------------:|-----------------:|----------------|----------:|\n`;

  let rank = 1;
  for (const p of products) {
    const totalMentions = p.posts.reduce((s, p) => s + p.count, 0);
    const totalPosts = p.posts.length;
    md += `| ${rank} | **${p.keyword}** | ${totalPosts} | ${totalMentions} |  |  |\n`;
    rank++;
  }
  md += '\n';

  // Detail section for each product
  md += `<details>\n<summary>Xem chi tiet bai viet cho tung san pham</summary>\n\n`;
  for (const p of products) {
    const totalMentions = p.posts.reduce((s, p) => s + p.count, 0);
    md += `### ${p.keyword} (${p.posts.length} bai viet, ${totalMentions} luot de cap)\n\n`;
    md += `| # | Bai viet | Slug | Luot de cap |\n`;
    md += `|---|----------|------|------------:|\n`;
    let i = 1;
    for (const pp of p.posts.sort((a, b) => b.count - a.count)) {
      md += `| ${i} | ${pp.title} | \`${pp.slug}\` | ${pp.count} |\n`;
      i++;
    }
    md += '\n';
    md += `> **Affiliate Link:** \n`;
    md += `> **Gia tham khao:** `;
    md += `\n\n`;
    md += `---\n\n`;
  }
  md += `</details>\n\n`;
}

md += `---\n\n`;
md += `## Thong ke tong hop\n\n`;
md += `| Danh muc | So gear | Tong luot de cap | Tong bai viet lien quan |\n`;
md += `|----------|--------:|-----------------:|--------------------:|\n`;
for (const [catKey, products] of Object.entries(cats)) {
  const catLabel = products[0].categoryLabel;
  const totalGear = products.length;
  const totalMentions = products.reduce((s, p) => s + p.posts.reduce((s2, p2) => s2 + p2.count, 0), 0);
  const allSlugs = new Set(products.flatMap(p => p.posts.map(pp => pp.slug)));
  md += `| ${catLabel} | ${totalGear} | ${totalMentions} | ${allSlugs.size} |\n`;
}

fs.writeFileSync('_affiliate-products-need-links.md', md, 'utf8');
console.log('Done! File written successfully.');
console.log('Total gear products found:', activeProducts.length);
