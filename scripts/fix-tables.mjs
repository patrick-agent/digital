import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const filePath = join(__dirname, "..", "db", "blog.json")
const data = JSON.parse(readFileSync(filePath, "utf8"))

function isTableDelimiter(value) {
  const cells = value.trim().replace(/^\|/, "").replace(/\|$/, "").split("|")
  return cells.length > 0 && cells.every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell))
}

function splitTableRow(value) {
  return value.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim())
}

function tableAlignment(delimiter) {
  const trimmed = delimiter.trim()
  if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center"
  if (trimmed.endsWith(":")) return "right"
  return "left"
}

function parseEmbeddedTable(inner) {
  const lines = inner.split(/\r?\n/).map(l => l.trim()).filter(Boolean)

  if (lines.length >= 3) {
    const delimIdx = lines.findIndex(l => isTableDelimiter(l))
    if (delimIdx > 0 && lines[delimIdx - 1].includes("|")) {
      const headers = splitTableRow(lines[delimIdx - 1])
      const alignments = splitTableRow(lines[delimIdx]).map(tableAlignment)
      const rows = []
      for (let i = delimIdx + 1; i < lines.length; i++) {
        if (lines[i].includes("|")) rows.push(splitTableRow(lines[i]))
      }
      return { headers, alignments, rows }
    }
  }

  const cells = inner.trim().split("|").map(s => s.trim())
  const emptyIdx = []
  cells.forEach((c, i) => { if (c === "") emptyIdx.push(i) })
  const groups = []
  for (let i = 0; i < emptyIdx.length - 1; i++) {
    const start = emptyIdx[i] + 1
    const end = emptyIdx[i + 1]
    if (start < end) groups.push(cells.slice(start, end))
  }
  if (groups.length < 2) return null
  const alignCells = groups[1]
  if (!alignCells.every(c => /^:?-{3,}:?$/.test(c))) return null
  return {
    headers: groups[0],
    alignments: alignCells.map(tableAlignment),
    rows: groups.slice(2),
  }
}

function renderTableHtml({ headers, alignments, rows }) {
  const head = headers
    .map((cell, i) => `<th style="text-align:${alignments[i] || "left"}">${cell}</th>`)
    .join("")
  const body = rows
    .map((row) => {
      const cells = headers
        .map((_, i) => `<td style="text-align:${alignments[i] || "left"}">${row[i] || ""}</td>`)
        .join("")
      return `<tr>${cells}</tr>`
    })
    .join("")
  return `<div class="articleTableScroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`
}

const tablePattern = /<p>([\s\S]*?)<\/p>/gi
let modified = 0

for (const post of data) {
  if (!post.content) continue
  const original = post.content
  post.content = post.content.replace(tablePattern, (match, inner) => {
    const parsed = parseEmbeddedTable(inner)
    return parsed ? renderTableHtml(parsed) : match
  })
  if (post.content !== original) modified++
}

writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
console.log(`Done. Modified ${modified} posts.`)
