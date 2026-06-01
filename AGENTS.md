<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
