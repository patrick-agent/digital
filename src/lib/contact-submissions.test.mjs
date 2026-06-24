import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, readdir, readFile } from "fs/promises"
import path from "path"
import os from "os"

import { persistContactSubmission } from "./contact-submissions.js"

test("persistContactSubmission writes a private local record when Blob is not configured", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "studio-3d-contact-"))
  const previousCwd = process.cwd()
  const previousBlobToken = process.env.BLOB_READ_WRITE_TOKEN
  const previousVercel = process.env.VERCEL

  delete process.env.BLOB_READ_WRITE_TOKEN
  delete process.env.VERCEL
  process.chdir(tempDir)

  try {
    const result = await persistContactSubmission({
      name: "Ngoc",
      email: "ngoc@example.com",
      subject: "Hello",
      message: "Need help",
      persona: "artist",
    })

    const directory = path.join(tempDir, ".private", "contact-submissions")
    const [filename] = await readdir(directory)
    const raw = await readFile(path.join(directory, filename), "utf-8")
    const parsed = JSON.parse(raw)

    assert.equal(parsed.id, result.id)
    assert.equal(parsed.email, "ngoc@example.com")
  } finally {
    if (previousBlobToken === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = previousBlobToken
    }

    if (previousVercel === undefined) {
      delete process.env.VERCEL
    } else {
      process.env.VERCEL = previousVercel
    }

    process.chdir(previousCwd)
  }
})
