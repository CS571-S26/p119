// @ts-check
import { mkdir } from "node:fs/promises"
import { createWriteStream } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const DATA_FILE = join(ROOT, "data", "courses.jsonl")
const STATIC_API = "https://static.uwcourses.com"
const SITEMAP_URL = `${STATIC_API}/courses-sitemap.xml`
const CONCURRENCY = 50

async function fetchCourseIds() {
  const res = await fetch(SITEMAP_URL)
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  const ids = []
  const re = /<loc>https:\/\/uwcourses\.com\/courses\/([^<]+)<\/loc>/g
  let m
  while ((m = re.exec(xml)) !== null) ids.push(m[1])
  return ids
}

async function fetchCourse(id) {
  const res = await fetch(`${STATIC_API}/course/${id}.json`)
  if (!res.ok) return null
  return res.json()
}

async function pool(items, limit, fn) {
  let idx = 0
  let done = 0
  const total = items.length
  let lastLogged = 0
  async function worker() {
    while (idx < total) {
      const i = idx++
      try {
        await fn(items[i], i)
      } catch (err) {
        console.warn(`[cache] item ${items[i]} failed:`, err.message)
      }
      done++
      if (done - lastLogged >= 500 || done === total) {
        console.log(`[cache] ${done}/${total}`)
        lastLogged = done
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
}

async function main() {
  const start = Date.now()
  console.log(`[cache] fetching course list from ${SITEMAP_URL}`)
  const ids = await fetchCourseIds()
  ids.sort()
  console.log(`[cache] ${ids.length} courses to cache`)

  await mkdir(dirname(DATA_FILE), { recursive: true })
  const stream = createWriteStream(DATA_FILE)

  let okCount = 0
  let failCount = 0
  const results = new Map()

  await pool(ids, CONCURRENCY, async (id) => {
    const course = await fetchCourse(id)
    if (!course) {
      failCount++
      return
    }
    results.set(id, course)
    okCount++
  })

  // Write in sorted id order so the file stays diff-stable.
  for (const id of ids) {
    const course = results.get(id)
    if (!course) continue
    stream.write(JSON.stringify({ id, course }) + "\n")
  }
  stream.end()
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve)
    stream.on("error", reject)
  })

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(
    `[cache] done in ${elapsed}s — ${okCount} ok, ${failCount} skipped, wrote ${DATA_FILE}`,
  )
}

main().catch((err) => {
  console.error("[cache] failed:", err)
  process.exit(1)
})
