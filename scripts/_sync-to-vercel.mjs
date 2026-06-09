process.loadEnvFile(".env")
import { readFile } from "fs/promises"
import path from "path"

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) { console.error("Missing BLOB_READ_WRITE_TOKEN"); process.exit(1) }

const storeId = token.split("_").pop()
const filePath = path.join(process.cwd(), "db", "blog.json")
const data = JSON.parse(await readFile(filePath, "utf-8"))
console.log("Read " + data.length + " posts from local file")

const res = await fetch("https://vercel.com/api/blob/?pathname=db/blog.json", {
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
  console.log("✅ Synced " + data.length + " posts to Vercel Blob")
} else {
  console.log("❌ Sync failed: " + res.status + " " + (await res.text()))
}
