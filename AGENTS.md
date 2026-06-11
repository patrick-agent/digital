<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:anchored-summary -->
# Session Summary

## Goal
Rewrite + SEO-optimize 245 blog articles from Excel file (`blog-rewrite.xlsx`) and import into `db/blog.json`. Use all available SEO/AEO/GEO skills. Keep existing images, search real thumbnails from web.

## Constraints & Preferences
- Vietnamese content, no plagiarism with originals.
- Use seo-content-writer, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator, entity-optimizer, ai-seo skills.
- Thumbnails: search real images from web (Unsplash), not reuse source og_image.
- Category: map from tags to 8 existing categories.
- Process all 245 articles.
- Persona: "artist" (from sync-blog.mjs).

## Progress
### Done
- All 245 articles rewritten with SEO/AEO/GEO optimization and imported into `db/blog.json`.
- Total posts: 331 (86 original + 245 new).
- 16 batch import scripts created and executed.
- Categories used: thu-am-tai-nha, review-thiet-bi, the-loai-nhac, kien-thuc-am-nhac, san-xuat-nhac, ky-thuat-am-thanh, thiet-bi-phong-thu.
- Skills loaded: ai-seo, seo-content-writer, geo-content-optimizer, meta-tags-optimizer, schema-markup-generator, entity-optimizer.

### Blocked
- (none)

## Key Decisions
- Manual batch processing (user chose Huong B): 10-40 articles per batch.
- coverImage: high-quality Unsplash photo-IDs hardcoded in update scripts.
- Source: XLSX exported once to `_blog-rewrite-data.json`, then processed from JSON.
- Keep cloudinary images in content, rewrite text only.
- Category mapping: tags → existing categories.

## Next Steps
1. Run coverImage update scripts for batches 5-16.
2. Consider cleaning up `scripts/_batch-*-import.mjs`.
3. Sync blog to production.
4. Submit to Google Indexing API.

## Relevant Files
- `C:\Users\Admin\Desktop\Website 3D\blog-rewrite.xlsx`: source Excel (245 rows).
- `_blog-rewrite-data.json`: parsed JSON workspace file.
- `db/blog.json`: target blog database (331 posts).
- `scripts/_batch-*-import.mjs`: 16 batch import scripts (temporary).
<!-- END:anchored-summary -->

<!-- BEGIN:shop-summary -->

<!-- BEGIN:google-sheets-sync -->
# Google Sheets → Blog Auto-Post Workflow

## Tổng quan

Hệ thống tự động đọc bài viết từ Google Sheets và đăng lên Blog (Tachy Artist, persona = "artist").

## Cách hoạt động

1. Bạn tạo Google Sheet với các cột tương ứng blog fields
2. Cột `status` = "public" → bài viết sẽ được tự động đăng (published)
3. Cột `status` khác "public" → bỏ qua
4. Script match bài viết bằng slug/title → nếu tồn tại thì update, chưa có thì create

## Cột Google Sheet mặc định

| Sheet Column | Blog Field | Ghi chú |
|---|---|---|
| title | title | Bắt buộc |
| slug | slug | Tự động sinh nếu để trống |
| content | content | HTML content |
| excerpt | excerpt | Mô tả ngắn |
| coverImage | coverImage | URL ảnh bìa |
| tags | tags | Phân cách bằng dấu phẩy |
| category | category | Danh mục |
| status | status | "public" → published |
| seoTitle | seoTitle | Mặc định = title |
| seoDescription | seoDescription | Mặc định = excerpt |
| seoKeywords | seoKeywords | Phân cách bằng dấu phẩy, dùng cho meta keywords |

## Cài đặt

### 1. Tạo Service Account trên Google Cloud Console

1. Vào https://console.cloud.google.com/ → APIs & Services → Credentials
2. Create Credentials → Service Account → đặt tên (vd: "blog-sync")
3. Sau khi tạo, vào Keys → Add Key → Create New Key → JSON
4. File JSON sẽ download về, trong đó có:
   - `client_email` (vd: `blog-sync@your-project.iam.gserviceaccount.com`)
   - `private_key` (dòng "-----BEGIN PRIVATE KEY-----...")

### 2. Cấp quyền cho Service Account

1. Mở Google Sheet của bạn
2. Share (nút Share ở góc trên phải) với `client_email` ở trên, quyền **Editor**

### 3. Lấy Spreadsheet ID

URL Google Sheet: `https://docs.google.com/spreadsheets/d/1ABCxyz.../edit`
→ Spreadsheet ID là `1ABCxyz...`

### 4. Cấu hình .env

Thêm vào file `.env`:

```env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="blog-sync@your-project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1ABCxyz..."
GOOGLE_SHEETS_RANGE="Blog!A:Z"
```

> **Quan trọng**: `private_key` phải giữ nguyên `\n` xuống dòng, bọc trong dấu ngoặc kép.

## Cách sử dụng

### CLI Script

```bash
# Dry-run (xem trước, không thay đổi dữ liệu)
npm run sync:blog:dry

# Thực thi thật
npm run sync:blog
```

### Webhook API

Endpoint: `POST /api/webhook/sync-blog`
Header: `x-api-key: <AUTOMATION_API_KEY>`
Body:
```json
{
  "rows": [
    {
      "title": "Bài viết mới",
      "content": "<p>HTML content</p>",
      "status": "public",
      "category": "tutorials",
      "tags": "react, nextjs"
    }
  ]
}
```

Có thể gọi webhook này từ:
- **Google Apps Script** (trigger khi sheet thay đổi)
- **cron-job.org** hoặc **Vercel Cron Jobs** (chạy định kỳ)
- **GitHub Actions** (schedule workflow)
- **Zapier / Make (Integromat)**

### Ví dụ Google Apps Script trigger

Copy script này vào Extensions → Apps Script trong Google Sheet:

```javascript
function onSheetChange() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Blog")
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const rows = data.slice(1).map(row => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = row[i] })
    return obj
  })

  const options = {
    method: "post",
    headers: { "x-api-key": "997a5749-e68d-4b5c-8afa-ca3c710f214c" },
    contentType: "application/json",
    payload: JSON.stringify({ rows }),
  }

  UrlFetchApp.fetch("https://your-domain.com/api/webhook/sync-blog", options)
}
```

## Architecture

```
Google Sheet ──► scripts/sync-blog.mjs (CLI)
              ──► POST /api/webhook/sync-blog (Webhook API)
                        │
                        ▼
                  src/lib/db.js (CRUD)
                        │
                        ▼
                  db/blog.json (JSON database)
```

## Luồng xử lý

1. Đọc dữ liệu từ Google Sheet (hoặc từ request body webhook)
2. Map cột theo column map
3. Với mỗi row có `status = "public"`:
   - Tìm bài viết hiện tại theo slug/title
   - Nếu có → update
   - Nếu không → create mới với persona = "artist"
4. Bỏ qua rows có status ≠ "public"
<!-- END:google-sheets-sync -->

<!-- BEGIN:auto-indexing -->
# Google Sitemap Ping — Auto Index URLs

## Tổng quan

Gửi sitemap đến Google sau mỗi lần deploy để Google crawl và lập chỉ mục.

## Cách hoạt động

1. Script gọi `https://www.google.com/ping?sitemap=https://tachy.io.vn/sitemap.xml`
2. Google nhận ping và lên lịch crawl sitemap
3. Các URL mới/cập nhật sẽ được index trong vài giờ

## Cách sử dụng

```bash
# Dry-run (xem trước)
npm run index:urls:dry

# Thực thi thật
npm run index:urls
```

## Architecture

```
Vercel Deploy ──► npm run postdeploy
                       │
                       ▼
              scripts/index-urls.mjs
                       │
                       ▼
         https://www.google.com/ping?sitemap=...
                       │
                       ▼
              Google lên lịch crawl
```

## Ghi chú

- Không cần cấu hình, không cần API key, không cần biến môi trường
- Google sẽ crawl lại toàn bộ sitemap, thường trong vài giờ
- Nếu muốn index nhanh hơn (vài phút), dùng Google Indexing API (xem target_6yfxb4a)
<!-- END:auto-indexing -->

<!-- BEGIN:seo-aeo-skills -->
# SEO & AEO Skills Stack (Installed)

## Skills đã cài đặt

### 1. aaron-he-zhu/seo-geo-claude-skills (20 skills, bundle)
- `competitor-analysis` — Phân tích đối thủ
- `content-gap-analysis` — Phân tích khoảng trống nội dung
- `keyword-research` — Nghiên cứu từ khóa
- `serp-analysis` — Phân tích SERP
- `geo-content-optimizer` — Tối ưu nội dung cho Generative Engine
- `meta-tags-optimizer` — Tối ưu thẻ meta
- `schema-markup-generator` — Tạo JSON-LD schema markup
- `seo-content-writer` — Viết nội dung SEO
- `content-refresher` — Refresh nội dung cũ
- `internal-linking-optimizer` — Tối ưu internal links
- `on-page-seo-auditor` — Audit on-page SEO
- `technical-seo-checker` — Kiểm tra technical SEO
- `backlink-analyzer` — Phân tích backlink
- `rank-tracker` — Theo dõi thứ hạng
- `content-quality-auditor` — Audit chất lượng nội dung
- `domain-authority-auditor` — Audit domain authority
- `entity-optimizer` — Tối ưu entity cho AI
- `performance-reporter` — Báo cáo hiệu suất
- `alert-manager` — Quản lý cảnh báo
- `memory-management` — Quản lý bộ nhớ skill

### 2. addyosmani/web-quality-skills@seo
- Technical SEO (crawlability, robots.txt, canonical, sitemap)
- On-page (title, meta, headings, image SEO, internal linking)
- JSON-LD structured data (Organization, Article, Product, FAQ, Breadcrumb)
- Mobile SEO, hreflang
- Audit checklist (critical/high/medium)

### 3. coreyhaines31/marketingskills@ai-seo
- AI search optimization (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot)
- 3-pillar strategy: structure, authority, presence
- AI visibility audit framework
- Content-type-specific guidance

### 4. sanity-io/agent-toolkit@seo-aeo-best-practices
- SEO + AEO combined best practices
- EEAT guidelines
- Structured data implementation
- Sitemap & robots.txt optimization

### 5. jdrhyne/agent-skills@gsc (190 installs)
- Query Google Search Console for search analytics, indexing status, SEO insights
- Commands: top queries, top pages by traffic, low-CTR opportunities, URL inspection, sitemaps
- Dimensions: query, page, country, device, date
- Metrics: clicks, impressions, CTR, position
- Requires: Google Cloud OAuth with `webmasters.readonly` scope + GSC property access

### 6. agricidaniel/claude-seo@seo-backlinks (1.6K installs)
- Backlink profile analysis: referring domains, anchor text distribution, toxic link detection, competitor gap analysis
- Works with free APIs (Moz, Bing Webmaster, Common Crawl) + DataForSEO extension
- Commands: `/seo backlinks <url>`, `/seo backlinks gap <url1> <url2>`, `/seo backlinks toxic <url>`
- Output: Backlink Health Score 0-100, critical/high/medium priority issues, link building opportunities
- Fallback cascade: DataForSEO → Moz → Bing → Common Crawl → verification crawler

## Workflow đề xuất

### Blog Post Lifecycle (Vibe Code)

1. **Viết bài mới** → request tôi viết blog, tôi sẽ dùng `seo-content-writer` + `ai-seo` + `geo-content-optimizer` để tối ưu
2. **Sync từ Google Sheets** → `npm run sync:blog` (tự động map SEO fields)
3. **Sau sync** → tôi sẽ chạy `schema-markup-generator` để tạo JSON-LD, `meta-tags-optimizer` để kiểm tra metadata
4. **Index** → `npm run postdeploy` (ping sitemap + Google Indexing API)
5. **Theo dõi** → `rank-tracker`, `content-quality-auditor`, `backlink-analyzer`

### Các lệnh CLI

```bash
# Sync blog + SEO optimize + index chạy tuần tự
npm run sync:blog && npm run postdeploy

# Kiểm tra technical SEO trước khi deploy
# (dùng technical-seo-checker skill qua agent)

# Phân tích nội dung AI visibility
# (dùng ai-seo skill qua agent)
```

## Quy tắc tự động commit

Sau mỗi lần viết/sửa blog post (thay đổi `db/blog.json`), tôi sẽ tự động:
1. `git add db/blog.json` (và `AGENTS.md` nếu cần)
2. `git commit -m "blog: [mô tả ngắn]"`
3. Thông báo cho bạn biết

Hoặc chạy thủ công: `npm run save`

## Kích hoạt skills

Các skills nằm tại `~\.agents\skills\`. Để dùng skill cụ thể trong phiên làm việc, chỉ cần yêu cầu agent load skill đó khi cần.
<!-- END:seo-aeo-skills -->
