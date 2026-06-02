import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const filePath = join(__dirname, "..", "db", "blog.json")
const data = JSON.parse(readFileSync(filePath, "utf8"))

let modified = 0

for (const post of data) {
  if (!post.content) continue
  const original = post.content
  post.content = post.content.replace(
    /<p>\s*#{1,6}\s[\s\S]*?<\/p>/gi,
    (match) => {
      const inner = match.replace(/<\/?p>/gi, "").trim()
      const level = inner.match(/^#{1,6}/)[0].length
      const text = inner.replace(/^#{1,6}\s+/, "").trim()
      return `<h${level}>${text}</h${level}>`
    }
  )
  if (post.content !== original) modified++
}

writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
console.log(`Done. Modified ${modified} posts.`)
