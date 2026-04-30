// @ts-check
import { open, readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(ROOT, "dist")
const COURSES_FILE = join(ROOT, "data", "courses.jsonl")
const CONCURRENCY = 50
const SITE_NAME = "MadMap"

async function* iterCourses() {
  const fh = await open(COURSES_FILE, "r")
  try {
    for await (const line of fh.readLines()) {
      if (!line.trim()) continue
      yield JSON.parse(line)
    }
  } finally {
    await fh.close()
  }
}

async function loadCourses() {
  const courses = []
  for await (const entry of iterCourses()) courses.push(entry)
  return courses
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function escapeForScript(json) {
  return json
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

function injectMeta(shell, title, description, extraHead = "") {
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(
      "</head>",
      `<meta name="description" content="${escapeHtml(description)}">${extraHead}</head>`,
    )
}

function buildCourseHtml(shell, id, course) {
  const subjects = course?.course_reference?.subjects ?? []
  const num = course?.course_reference?.course_number
  const subj = subjects[0] ?? ""
  const heading = subj && num ? `${subj} ${num}` : id
  const title = `${heading} — ${course.course_title} | ${SITE_NAME}`
  const description = (course.description ?? "").trim().slice(0, 160)
  const dataPayload = JSON.stringify({ id, course })
  const dataScript = `<script>window.__INITIAL_COURSE_DATA__=${escapeForScript(dataPayload)}</script>`
  return injectMeta(shell, title, description, dataScript)
}

async function writeHtml(relPath, content) {
  const target = join(DIST, relPath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
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
        console.warn(`[prerender] item failed:`, err.message)
      }
      done++
      if (done - lastLogged >= 500 || done === total) {
        console.log(`[prerender] ${done}/${total}`)
        lastLogged = done
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
}

async function main() {
  const start = Date.now()
  const shell = await readFile(join(DIST, "index.html"), "utf8")

  // Static routes
  await writeHtml(
    "about/index.html",
    injectMeta(
      shell,
      `About | ${SITE_NAME}`,
      "An interactive prerequisite map for UW–Madison courses.",
    ),
  )
  await writeHtml(
    "course/index.html",
    injectMeta(
      shell,
      `Course | ${SITE_NAME}`,
      "Browse course details and prerequisites.",
    ),
  )

  // SPA fallback for any path not generated below (catches bad/typoed URLs)
  await writeHtml("404.html", shell)

  console.log(`[prerender] reading ${COURSES_FILE}`)
  const courses = await loadCourses()
  console.log(`[prerender] ${courses.length} courses to render`)

  let okCount = 0
  await pool(courses, CONCURRENCY, async ({ id, course }) => {
    await writeHtml(`course/${id}/index.html`, buildCourseHtml(shell, id, course))
    okCount++
  })

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`[prerender] done in ${elapsed}s — ${okCount} pages`)
}

main().catch((err) => {
  console.error("[prerender] failed:", err)
  process.exit(1)
})
