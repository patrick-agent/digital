# Architecture Refactor Plan — Studio 3D

> Goal: Giải quyết 6 candidates (đã bỏ CRUD factory + middleware theo yêu cầu).
> Phương pháp: Tuần tự từng phase, backward-compatible ở mỗi bước.
> Thời gian dự kiến: ~4 giờ.

---

## Phase 1: Small Wins (zero risk, thấy kết quả ngay)

### Bước 1.1 — Extract ProductCard component
**Trước**: Card JSX lặp lại ở `page.js:184-244` và `[slug]/page.js:274-316` (~60 dòng giống nhau)

**Cách làm**:
1. Tạo `src/components/shop/ProductCard.jsx` (Server Component)
2. Props: `{ product, excerptLength = 150, showAffiliate = true }`
3. Copy code từ `page.js` vào component
4. Import và dùng trong cả 2 page
5. Xoá code cũ

**Sau khi xong**: Sửa 1 chỗ là card đổi ở mọi nơi. ~15 phút.

---

### Bước 1.2 — Split CSS module
**Trước**: `shop.module.css` dài 864 dòng, chứa styles cho cả listing + detail + layout.

**Cách làm**: Tách thành:

| File | Chứa | Dùng bởi |
|------|------|----------|
| `shop-layout.module.css` | layoutMain, skipLink, page, hero, heroPanel, heroStats, backLink, filterBar, filterDivider, resultsBar | layout.js + page.js |
| `shop-card.module.css` | card*, grid*, categoryRail*, imageFallback, empty | page.js + [slug]/page.js |
| `shop-detail.module.css` | detailPage*, detailGrid*, contentSection*, faq*, features*, relatedSection* | [slug]/page.js |

**Sau khi xong**: File giảm từ 864 → ~300 dòng mỗi file. Dễ tìm, dễ sửa. ~20 phút.

---

### Bước 1.3 — Fix script import bridge
**Trước**: `sync-blog.mjs` dùng `pathToFileURL` + `import()` kiểu:
```js
const DB_URL = pathToFileURL(path.join(__dirname, "..", "src", "lib", "db.js")).href
const { createPost, updatePost } = await import(DB_URL)
```
Fragile — dễ break nếu move file.

**Cách làm**: Tạo `src/lib/db-cli.mjs`:
```js
// src/lib/db-cli.mjs  (file mới)
export { createPost, updatePost, readPost, readPosts } from './db.js'
```
Sửa `sync-blog.mjs` thành:
```js
const { createPost, updatePost, readPost, readPosts } = await import('../src/lib/db-cli.mjs')
```

**Sau khi xong**: Import ổn định, dễ maintain. ~10 phút.

---

## Phase 2: Data Layer Refactoring (core — cẩn thận nhất)

### Bước 2.1 — Tách monolithic db.js (quan trọng nhất)
**Trước**: 1 file `src/lib/db.js` dài 1023 dòng, 11 entities, 35+ exports. Blog + shop + music + gallery... tất cả chung 1 cache, chung 1 file.

**Cách làm — Mechanical split (không thay đổi logic)**:

**Sub-step 1**: Tạo `src/lib/db/` directory

**Sub-step 2**: Tách I/O layer → `src/lib/db/io.js`
- Di chuyển: readJSON, writeJSON, readFileJSON, writeFileJSON, readBlob, writeBlob, blobToken, blobStoreId, blobReadUrl, blobWriteUrl, blobPath, blobAuthHeaders, ensureDbDir, jsonCache, isVercel, useBlobDb, DB_DIR
- Export: `readJSON`, `writeJSON`, `readFileJSON`, `writeFileJSON`

**Sub-step 3**: Tách slug helpers → `src/lib/db/slug.js`
- Di chuyển: `slugify()`, `generateUniqueSlug()`
- Export: `slugify`, `generateUniqueSlug`

**Sub-step 4**: Tạo 6 entity modules chính (các entity có CRUD đầy đủ):

| File | Functions |
|------|-----------|
| `src/lib/db/blog.js` | readPosts, readPost, createPost, updatePost, deletePost, duplicatePost |
| `src/lib/db/shop.js` | readProducts, readProduct, createProduct, updateProduct, deleteProduct |
| `src/lib/db/music.js` | readMusic, readMusicItem, createMusic, updateMusic, deleteMusic |
| `src/lib/db/gallery.js` | readGallery, createGalleryItem, bulkCreateGalleryItems, readGalleryItem, updateGalleryItem, deleteGalleryItem |
| `src/lib/db/events.js` | readEvents, createEvent, readEvent, updateEvent, deleteEvent |
| `src/lib/db/case-studies.js` | readCaseStudies, createCaseStudy, readCaseStudy, updateCaseStudy, deleteCaseStudy |

**Sub-step 5**: Tạo 5 entity modules đơn giản:

| File | Functions |
|------|-----------|
| `src/lib/db/services.js` | readServices, createService, readService, updateService, deleteService |
| `src/lib/db/newsletter.js` | readSubscribers, unsubscribeSubscriber, addSubscriber |
| `src/lib/db/seo.js` | readSEOMetadata, updateSEOMetadata, getAllRoutes |
| `src/lib/db/media.js` | readMedia, createMediaItem, updateMediaItem, deleteMediaItem |
| `src/lib/db/settings.js` | readSettings, updateSettings |

**Sub-step 6**: Tạo `src/lib/db/index.js` (barrel re-export):
```js
export { readJSON, writeJSON, readFileJSON, writeFileJSON } from './io.js'
export { slugify, generateUniqueSlug } from './slug.js'
export { readPosts, readPost, createPost, updatePost, deletePost, duplicatePost } from './blog.js'
export { readProducts, readProduct, createProduct, updateProduct, deleteProduct } from './shop.js'
// ... etc for all entities
```

**Sub-step 7**: Sửa `src/lib/db.js` thành:
```js
export * from './db/index.js'
```

Mọi import `@/lib/db` vẫn hoạt động bình thường. **Zero breaking change.**

**Sau khi xong**: 1 file 1023 dòng → 13 file (tổng ~1100 dòng). Mỗi entity độc lập. Cache riêng. Dễ test. Dễ maintain. ~1.5-2 giờ.

---

### Bước 2.2 — Blog public-catalog pattern
**Trước**: Blog dùng raw `db.js` + `blog.js` wrapper (thiếu validation, thiếu consistent error handling). Shop đã có pattern tốt hơn.

**Cách làm**: Copy pattern từ shop sang blog:

1. Tạo `src/lib/blog/public-catalog/`:
   - `spec.js` — định nghĩa input/output schemas bằng zod
   - `handler.js` — validate input, filter, sort, trả về `{ success, data/error }`
   - `index.js` — export `listPublishedPosts()`, `getPublishedPost()`, `getRelatedPosts()`

2. Update `src/app/blog/*` pages dùng public-catalog thay vì `db.js` trực tiếp

3. `blog.js` wrapper cũ vẫn giữ (không xoá) — không ai import nữa thì xoá sau

**Ví dụ output của handler**:
```js
// Thay vì: const posts = await readPosts({ status: "published" })
// Giờ dùng:
const result = await listPublishedPosts({ category, tag, page })
// result = { success: true, data: { posts: [...], meta: {...} } }
// hoặc: { success: false, error: { code, message } }
```

**Sau khi xong**: Blog data access nhất quán với shop. Error handling rõ ràng. ~1 giờ.

---

## Phase 3: Script Refactoring

### Bước 3.1 — Split rebuild-shop-catalog.mjs
**Trước**: 1 script 1421 dòng, 5 responsibilities: data + content builder + scraper + image map + orchestrator.

**Cách làm**:

1. Tạo `scripts/shop-data/products.mjs` — chứa 33 product definitions + IMAGE_MAP
2. Tạo `scripts/shop-data/content-builder.mjs` — buildDescription, buildWhyRecommend, buildFaq, buildSeoTitle, buildSeoDescription, buildPriceNote
3. Tạo `scripts/shop-data/shopee-scraper.mjs` — fetchShopeeMeta, extractShopeeData, parsePrice
4. `rebuild-shop-catalog.mjs` chỉ còn: import → loop → write file

**Cấu trúc sau khi split**:
```
scripts/
├── rebuild-shop-catalog.mjs      (orchestrator — ~50 dòng)
└── shop-data/
    ├── products.mjs               (33 products + IMAGE_MAP)
    ├── content-builder.mjs        (pure functions)
    └── shopee-scraper.mjs         (fetch + parse)
```

**Sau khi xong**: Có thể test content builder riêng không cần scrape. Dễ thêm/xoá sản phẩm. ~30 phút.

---

## Timeline

| Thứ tự | Bước | Thời gian | Mô tả |
|--------|------|-----------|-------|
| 1 | B1.1 ProductCard | 15 phút | Extract component |
| 2 | B1.2 CSS split | 20 phút | Tách CSS module |
| 3 | B1.3 Script import fix | 10 phút | Sửa sync-blog.mjs |
| 4 | B2.1 db.js split | 1.5-2 giờ | **Quan trọng nhất** |
| 5 | B2.2 Blog public-catalog | 1 giờ | Đồng bộ pattern |
| 6 | B3.1 Split rebuild script | 30 phút | Tách script lớn |
| | **Tổng** | **~4 giờ** | 6 bước tuần tự |

---

## Risk Mitigation

| Rủi ro | Cách tránh |
|--------|------------|
| **db.js split break imports** | Giữ `db.js` re-export từ barrel — không breaking change |
| **ProductCard khác nhau giữa 2 page** | Dùng `excerptLength` + `showAffiliate` props |
| **Script không chạy sau khi split** | Giữ script cũ đến khi script mới verified |
| **CSS split thiếu style** | Import đúng file, verify từng page sau khi split |
| **Blog public-catalog khác behavior cũ** | So sánh output trước/sau trên cùng data |

---

## Khi nào bắt đầu?

Sau khi bạn OK plan này, tôi sẽ:
1. Chạy `npm run build` để verify trạng thái hiện tại
2. Làm tuần tự từ Bước 1.1 → 1.2 → 1.3 → 2.1 → 2.2 → 3.1
3. Sau mỗi bước chạy `npm run build` kiểm tra không lỗi
4. Nếu build OK mới chuyển sang bước tiếp theo
