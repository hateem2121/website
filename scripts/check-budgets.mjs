/**
 * Performance budget gate (spec §16): the initial JavaScript a visitor downloads per public
 * route, against the 200 KB gzip budget.
 *
 *   node scripts/check-budgets.mjs [baseUrl] [--allow-unmeasured]
 *
 * Default baseUrl is http://localhost:3789 (see playwright.config.ts's webServer).
 * Measure a production build, never `next dev` — dev output is unminified and unsplit, so
 * every number from it is meaningless.
 *
 *   env -u NODE_ENV -u PORT pnpm run build
 *   env -u NODE_ENV -u PORT PORT=3789 pnpm run start &
 *   node scripts/check-budgets.mjs
 *
 * WHY THIS MEASURES A RUNNING SERVER RATHER THAN THE BUILD ARTIFACT
 * -----------------------------------------------------------------
 * `.next/diagnostics/route-bundle-stats.json` looks like the obvious source, and it lies by
 * omission. Measured 2026-07-22 on this repo: the artifact lists 11 first-load chunks for `/`
 * totalling 187.0 KB gzip, while the served HTML references 12 and the browser actually
 * downloads 225 KB. The missing chunk (`0cz1d0mv5g_q7.js`, 38 KB) is real, is fetched on
 * first load, and would have let this gate report a comfortable PASS on a route that was
 * 25 KB over budget.
 *
 * So the gate parses the HTML the server really sends and re-compresses every script it
 * really references. Slower, needs a running server, and is the only version that cannot
 * quietly under-report.
 *
 * Node built-ins only, on purpose — a budget checker that needs its own dependency tree is a
 * budget checker nobody runs.
 */
import { gzipSync, brotliCompressSync, constants as zlibConstants } from 'node:zlib'

/** Spec §16: "initial bundle on marketing pages < 200KB gzip". */
const BUDGET_GZIP_BYTES = 200 * 1024

const args = process.argv.slice(2)
const allowUnmeasured = args.includes('--allow-unmeasured')
const BASE = (args.find((a) => !a.startsWith('--')) ?? 'http://localhost:3789').replace(/\/+$/, '')

/**
 * Concrete URLs, not route patterns — a pattern cannot be fetched, and the point is to
 * measure what a visitor receives. Every entry must resolve; an entry that 404s or renders
 * no scripts is a FAILURE, not a skip.
 *
 * `/admin` is deliberately absent: a private tool behind a login, not a marketing page, and
 * spec §16 scopes the budget to the latter.
 */
const ROUTES = [
  { url: '/', label: 'home' },
  { url: '/about', label: 'about' },
  { url: '/capabilities', label: 'capabilities' },
  { url: '/sustainability', label: 'sustainability' },
  { url: '/catalog', label: 'catalog index' },
  { url: '/catalog/team-wear', label: 'category lander' },
  { url: '/case-studies', label: 'case studies' },
  { url: '/insights', label: 'insights index' },
  { url: '/insights/how-to-choose-a-team-wear-manufacturer', label: 'article' },
  { url: '/rfq', label: 'rfq' },
  { url: '/contact', label: 'contact' },
  { url: '/this-route-does-not-exist', label: '404', expectStatus: 404 },
  // The product page carries the 3D viewer and is the route this gate most exists to
  // protect. It needs a published product to be reachable; until Phase 4 publishes the
  // first article it is UNMEASURED, which is deliberately not the same as "passing".
  { url: process.env.BUDGET_PRODUCT_URL ?? '', label: 'product article (3D viewer)', optional: true },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

/**
 * Scripts the browser fetches for the initial render: <script src> plus preloaded scripts.
 *
 * `nomodule` scripts are EXCLUDED, and that exclusion is load-bearing. Next emits its legacy
 * polyfill bundle (38.0 KB gzip, measured 2026-07-22) as `<script nomodule>`, which every
 * browser with ES-module support — i.e. every browser in the §16 "mobile 4G" target — skips
 * without downloading. Counting it inflated this repo's headline number from 187.4 KB to
 * 225.4 KB and made a passing budget look like a 25 KB breach.
 *
 * Matching is case-insensitive because React serialises the prop as `noModule=""`; HTML
 * attribute names are case-insensitive, so the browser still honours it.
 */
function extractScriptUrls(html) {
  const urls = new Set()
  for (const m of html.matchAll(/<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g)) {
    const attrs = `${m[1]} ${m[3]}`
    if (/\bnomodule\b/i.test(attrs)) continue
    urls.add(m[2])
  }
  for (const m of html.matchAll(/<link[^>]+>/g)) {
    const tag = m[0]
    if (!/rel="(module)?preload"/.test(tag) && !/rel="modulepreload"/.test(tag)) continue
    if (/rel="preload"/.test(tag) && !/as="script"/.test(tag)) continue
    const href = tag.match(/href="([^"]+)"/)?.[1]
    if (href && href.endsWith('.js')) urls.add(href)
  }
  // Same-origin application code only. A third-party script would be a separate spec
  // violation (§16 bans blocking third-party scripts) and is not this gate's budget.
  return [...urls].filter((u) => u.startsWith('/'))
}

const assetCache = new Map()
async function compressedSizes(url) {
  if (assetCache.has(url)) return assetCache.get(url)
  const res = await fetch(`${BASE}${url}`)
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  // Re-compress from the raw bytes ourselves. Never trust Content-Length or the wire
  // encoding: an edge may serve brotli at a different quality than the budget assumes.
  const buf = Buffer.from(await res.arrayBuffer())
  const sizes = {
    gzip: gzipSync(buf, { level: 9 }).length,
    brotli: brotliCompressSync(buf, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 } }).length,
  }
  assetCache.set(url, sizes)
  return sizes
}

async function measure(route) {
  const res = await fetch(`${BASE}${route.url}`)
  const expected = route.expectStatus ?? 200
  if (res.status !== expected) {
    throw new Error(`expected HTTP ${expected}, got ${res.status}`)
  }
  const scripts = extractScriptUrls(await res.text())
  if (!scripts.length) {
    // A route that renders zero scripts is a broken measurement, not a 0 KB win.
    throw new Error('no scripts found in HTML — measurement failure, not a pass')
  }
  let gzip = 0
  let brotli = 0
  for (const s of scripts) {
    const size = await compressedSizes(s)
    gzip += size.gzip
    brotli += size.brotli
  }
  return { ...route, gzip, brotli, count: scripts.length }
}

// ── Run ──────────────────────────────────────────────────────────────────────────────────
console.log(`\nInitial JS per public route — budget ${kb(BUDGET_GZIP_BYTES)} gzip (spec §16)`)
console.log(`Measured against ${BASE}\n`)

const results = []
const unmeasured = []
const errors = []

for (const route of ROUTES) {
  if (!route.url) {
    unmeasured.push({ ...route, reason: 'no URL configured (set BUDGET_PRODUCT_URL)' })
    continue
  }
  try {
    results.push(await measure(route))
  } catch (err) {
    if (route.optional) unmeasured.push({ ...route, reason: err.message })
    else errors.push({ ...route, reason: err.message })
  }
}

results.sort((a, b) => b.gzip - a.gzip)

console.log(`  ${'gzip'.padStart(10)} ${'brotli'.padStart(10)} ${'files'.padStart(6)}  route`)
for (const r of results) {
  const mark = r.gzip > BUDGET_GZIP_BYTES ? '✗' : '✓'
  console.log(
    `${mark} ${kb(r.gzip).padStart(10)} ${kb(r.brotli).padStart(10)} ${String(r.count).padStart(6)}  ${r.url}`,
  )
}

for (const u of unmeasured) {
  console.log(`\n⚠ UNMEASURED — ${u.label} (${u.url || 'no url'}): ${u.reason}`)
}

let failed = false

if (errors.length) {
  console.error(`\n✗ ${errors.length} route(s) could not be measured:`)
  for (const e of errors) console.error(`    ${e.url} — ${e.reason}`)
  failed = true
}

const breaches = results.filter((r) => r.gzip > BUDGET_GZIP_BYTES)
if (breaches.length) {
  console.error(
    `\n✗ ${breaches.length}/${results.length} route(s) over the ${kb(BUDGET_GZIP_BYTES)} gzip budget.` +
      ` Worst: ${breaches[0].url} at ${kb(breaches[0].gzip)}` +
      ` (+${kb(breaches[0].gzip - BUDGET_GZIP_BYTES)}).`,
  )
  failed = true
}

if (unmeasured.length && !allowUnmeasured) {
  console.error(
    `\n✗ ${unmeasured.length} required route(s) UNMEASURED. An unmeasured route is not a passing` +
      ` route.\n  Pass --allow-unmeasured to accept this knowingly (interim work only).`,
  )
  failed = true
}

if (failed) process.exit(1)

console.log(
  `\n✓ All ${results.length} measured routes within budget.` +
    ` Worst: ${results[0].url} at ${kb(results[0].gzip)}.` +
    (unmeasured.length ? ` ${unmeasured.length} route(s) knowingly unmeasured.` : '') +
    '\n',
)
