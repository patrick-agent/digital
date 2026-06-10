process.loadEnvFile(".env")
import { readFile } from "fs/promises"
import path from "path"

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) { console.error("Missing BLOB_READ_WRITE_TOKEN"); process.exit(1) }

const storeId = token.split("_").pop()

const files = process.argv.includes("--shop-only")
  ? ["shop.json"]
  : process.argv.includes("--blog-only")
    ? ["blog.json"]
    : ["blog.json", "shop.json"]

for (const filename of files) {
  const filePath = path.join(process.cwd(), "db", filename)
  let data
  try {
    data = JSON.parse(await readFile(filePath, "utf-8"))
  } catch {
    console.error(`Cannot read ${filename}`)
    continue
  }

  const res = await fetch(`https://vercel.com/api/blob/?pathname=db/${filename}`, {
    method: "PUT",
    headers: {
      authorization: "Bearer " + token,
      "x-vercel-blob-store-id": storeId,
      "x-api-version": "12",
      "x-vercel-blob-access": "private",
      "x-add-random-suffix": "0",
      "x-allow-overwrite": "1",
      "x-content-type": "application/json"
    },
    body: JSON.stringify(data, null, 2)
  })

  if (res.ok) {
    console.log(`✅ Synced ${filename} (${Array.isArray(data) ? data.length : "object"} records) to Vercel Blob`)
  } else {
    console.log(`❌ Sync ${filename} failed: ${res.status} ${await res.text()}`)
  }
}
