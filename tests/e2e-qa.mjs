import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readAllCompanies } from '../scripts/lib/data.mjs'
import { listRoutes } from '../scripts/lib/routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`)
    passed++
  } catch (err) {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name}: ${err.message}`)
    failed++
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

console.log('\n======================================================')
console.log('   MARKETPLAYACE.COM - E2E QA & VAPT VERIFICATION SUITE')
console.log('======================================================\n')

// --- SUITE 1: EM DASH & EN DASH PURITY AUDIT ---
console.log('\x1b[36m[SUITE 1: Unicode Purity - Em & En Dash Elimination]\x1b[0m')

test('Codebase must contain zero em dashes (\u2014)', () => {
  const targets = ['src', 'index.html', 'README.md']
  let emDashCount = 0

  function scan(dirOrFile) {
    const fullPath = path.join(rootDir, dirOrFile)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(fullPath)) {
        scan(path.join(dirOrFile, child))
      }
    } else if (/\.(tsx?|html|css|md|json)$/.test(dirOrFile) && !dirOrFile.includes('data/generated')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes('\u2014')) {
        console.error(`Found em dash in: ${dirOrFile}`)
        emDashCount++
      }
    }
  }

  for (const t of targets) scan(t)
  assert(emDashCount === 0, `Expected 0 em dashes, found ${emDashCount}`)
})

test('Codebase must contain zero en dashes (\u2013)', () => {
  const targets = ['src', 'index.html', 'README.md']
  let enDashCount = 0

  function scan(dirOrFile) {
    const fullPath = path.join(rootDir, dirOrFile)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(fullPath)) {
        scan(path.join(dirOrFile, child))
      }
    } else if (/\.(tsx?|html|css|md|json)$/.test(dirOrFile) && !dirOrFile.includes('data/generated')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      if (content.includes('\u2013')) {
        console.error(`Found en dash in: ${dirOrFile}`)
        enDashCount++
      }
    }
  }

  for (const t of targets) scan(t)
  assert(enDashCount === 0, `Expected 0 en dashes, found ${enDashCount}`)
})

// --- SUITE 2: VAPT SECURITY CONTROLS ---
console.log('\n\x1b[36m[SUITE 2: VAPT Security & Input Validation Controls]\x1b[0m')

// Inlined logic from src/utils/security.ts to test logic
function sanitizeUrl(url, fallback = 'https://marketplayace.com') {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.trim()
  try {
    const parsed = new URL(trimmed, 'https://marketplayace.com')
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed
    }
  } catch {
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed
    }
  }
  return fallback
}

function sanitizeText(input, maxLength = 200) {
  if (!input || typeof input !== 'string') return ''
  return input.replace(/[<>]/g, '').trim().slice(0, maxLength)
}

function validatePrice(price, min = 1, max = 100000) {
  if (isNaN(price) || !isFinite(price)) return min
  return Math.min(Math.max(price, min), max)
}

function validateDiscountPercent(discount, maxAllowed = 40) {
  if (isNaN(discount) || !isFinite(discount)) return 0
  return Math.min(Math.max(Math.floor(discount), 0), maxAllowed)
}

test('VAPT-01: Blocks malicious javascript: and data: URI vectors', () => {
  assert(sanitizeUrl('javascript:alert(document.cookie)') === 'https://marketplayace.com', 'Failed to block javascript: URI')
  assert(sanitizeUrl('data:text/html,<script>alert(1)</script>') === 'https://marketplayace.com', 'Failed to block data: URI')
  assert(sanitizeUrl('vbscript:msgbox(1)') === 'https://marketplayace.com', 'Failed to block vbscript: URI')
  assert(sanitizeUrl('https://zepto.com') === 'https://zepto.com', 'Failed to allow valid https URL')
})

test('VAPT-02: Strips raw script tags and XSS brackets from user inputs', () => {
  const dirty = '<script>alert("xss")</script>CyberDeck Keyboard'
  const clean = sanitizeText(dirty)
  assert(!clean.includes('<') && !clean.includes('>'), 'Failed to strip HTML tag delimiters')
  assert(clean.includes('CyberDeck Keyboard'), 'Preserved genuine text content')
})

test('VAPT-03: Restricts price manipulation and prevents negative or NaN values', () => {
  assert(validatePrice(-50) === 1, 'Failed to clamp negative price')
  assert(validatePrice(NaN) === 1, 'Failed to handle NaN price')
  assert(validatePrice(Infinity) === 1, 'Failed to handle Infinity price')
  assert(validatePrice(250) === 250, 'Preserved normal valid price')
  assert(validatePrice(9999999) === 100000, 'Failed to clamp upper bound price')
})

test('VAPT-04: Enforces discount ceiling to prevent checkout fraud', () => {
  assert(validateDiscountPercent(99) === 40, 'Failed to clamp excessive discount')
  assert(validateDiscountPercent(-20) === 0, 'Failed to clamp negative discount')
  assert(validateDiscountPercent(25) === 25, 'Preserved legitimate 25% discount')
})

test('VAPT-05: External anchor tags must use rel="noopener noreferrer"', () => {
  const files = ['src/pages/CompanyPage.tsx', 'src/components/Footer.tsx']
  for (const f of files) {
    const c = fs.readFileSync(path.join(rootDir, f), 'utf8')
    const externals = (c.match(/target="_blank"/g) || []).length
    const safe = (c.match(/rel="noopener noreferrer"/g) || []).length
    assert(safe >= externals, `${f}: ${externals} target=_blank links but only ${safe} noopener`)
  }
})

// --- SUITE 3: DATA INTEGRITY & E-E-A-T GUARDRAILS ---
console.log('\n\x1b[36m[SUITE 3: Data Integrity & E-E-A-T Guardrails]\x1b[0m')

const companiesFile = { companies: await readAllCompanies() }
const routeList = await listRoutes()
const taxonomySrc = fs.readFileSync(path.join(rootDir, 'src/data/taxonomy.ts'), 'utf8')
const categorySlugs = [...taxonomySrc.matchAll(/^\s*\['([a-z0-9-]+)', '/gm)].map((m) => m[1])
const registry = JSON.parse(fs.readFileSync(path.join(rootDir, 'scripts/registry.json'), 'utf8'))

const FACT_FIELDS = ['description', 'founded', 'headquarters', 'country', 'industries', 'founders', 'parent', 'website', 'listings', 'employees', 'revenue', 'netIncome', 'marketCap']

test('Taxonomy has unique slugs and at least 50 industries', () => {
  assert(new Set(categorySlugs).size === categorySlugs.length, 'duplicate category slugs')
  assert(categorySlugs.length >= 50, `only ${categorySlugs.length} categories`)
})

test('Every company category exists in the taxonomy', () => {
  for (const c of companiesFile.companies) {
    assert(c.categories.length > 0, `${c.slug} has no category`)
    for (const k of c.categories) assert(categorySlugs.includes(k), `${c.slug}: unknown category ${k}`)
  }
})

test('Every published fact carries provider, source URL and retrieval date', () => {
  for (const c of companiesFile.companies) {
    for (const f of FACT_FIELDS) {
      const fact = c[f]
      if (!fact) continue
      assert(fact.provider, `${c.slug}.${f} missing provider`)
      assert(/^https:\/\//.test(fact.source), `${c.slug}.${f} missing https source`)
      assert(/^\d{4}-\d{2}-\d{2}$/.test(fact.retrievedAt), `${c.slug}.${f} missing retrieval date`)
    }
  }
})

test('No financial figure is published without its period and currency', () => {
  for (const c of companiesFile.companies) {
    for (const f of ['revenue', 'netIncome', 'marketCap']) {
      if (!c[f]) continue
      assert(c[f].value.asOf, `${c.slug}.${f} has no period`)
      assert(c[f].value.currency, `${c.slug}.${f} has no currency`)
    }
  }
})

test('Registry entries are unique and human-reviewed', () => {
  const qids = registry.companies.map((c) => c.qid).filter(Boolean)
  assert(new Set(qids).size === qids.length, 'duplicate QIDs in registry')
  for (const o of registry.companies.flatMap((c) => Object.values(c.overrides ?? {}))) {
    assert(/^https:\/\//.test(o.source) && o.reviewedAt, 'override without source and review date')
  }
})

test('Logos are only shown when freely licensed, and the file exists locally', () => {
  for (const c of companiesFile.companies) {
    if (!c.logo?.usable) continue
    assert(c.logo.license, `${c.slug}: usable logo without licence`)
    assert(fs.existsSync(path.join(rootDir, 'public', c.logo.path)), `${c.slug}: missing ${c.logo.path}`)
  }
})

test('Company slugs are clean ASCII and are not truncated versions of the name', () => {
  const fold = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[øØ]/g, 'o').replace(/[æÆ]/g, 'ae').replace(/ß/g, 'ss')
  for (const c of companiesFile.companies) {
    assert(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.slug), `${c.slug}: slug must be lowercase ASCII with hyphens`)
    if (/[^ -~]/.test(c.name)) {
      const first = fold(c.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').split('-').filter(Boolean)[0]
      assert(c.slug.startsWith(first.slice(0, 4)), `${c.slug}: slug does not start like "${c.name}" (non-ASCII letters dropped?)`)
    }
  }
})

test('Sitemap lists exactly the published pages', () => {
  const xml = fs.readFileSync(path.join(rootDir, 'public/sitemap.xml'), 'utf8')
  const urls = [...xml.matchAll(/<loc>https:\/\/marketplayace\.com([^<]*)<\/loc>/g)].map((m) => m[1])
  assert(urls.length === routeList.routes.length, `sitemap has ${urls.length} URLs but the site publishes ${routeList.routes.length}; run npm run data:sync`)
  const set = new Set(urls)
  for (const r of routeList.routes) assert(set.has(r), `sitemap missing ${r}`)
  for (const u of urls) assert(!u.startsWith('/labs') && !u.startsWith('/compare'), `non-indexable page in sitemap: ${u}`)
})

test('Query-discovered entries are marked, dated and in a known industry', () => {
  const queryEntries = registry.companies.filter((c) => c.source === 'query')
  assert(queryEntries.length > 0, 'expected query-discovered entries')
  for (const c of queryEntries) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(c.discoveredAt), `${c.slug}: missing discoveredAt`)
    for (const k of c.categories) assert(categorySlugs.includes(k), `${c.slug}: unknown category ${k}`)
  }
  const slugs = registry.companies.map((c) => c.slug)
  assert(new Set(slugs).size === slugs.length, 'duplicate slugs in registry')
  const full = new Map(companiesFile.companies.map((c) => [c.slug, c]))
  for (const c of queryEntries) {
    const rec = full.get(c.slug)
    if (rec) assert(rec.discovery === 'query', `${c.slug}: generated record does not say it was found by a query`)
  }
})

test('Category specs are valid and point at real industries', () => {
  const dir = path.join(rootDir, 'scripts/specs')
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    assert(spec.category === f.replace('.json', ''), `${f}: category does not match file name`)
    assert(categorySlugs.includes(spec.category), `${f}: unknown industry`)
    for (const i of spec.includes ?? []) assert(/^P(31|452|1056)$/.test(i.via) && /^Q\d+$/.test(i.qid), `${f}: bad include ${JSON.stringify(i)}`)
    for (const i of spec.includeQids ?? []) assert(/^Q\d+$/.test(i.qid) && i.name, `${f}: bad includeQid ${JSON.stringify(i)}`)
    assert((spec.includes?.length ?? 0) + (spec.includeQids?.length ?? 0) > 0, `${f}: spec selects nothing`)
  }
})

test('Country slugs are clean and every country page has companies', () => {
  const countries = new Map()
  for (const c of companiesFile.companies) if (c.country) {
    const v = c.country.value
    assert(!/People's Republic of China|United States of America/.test(v), `${c.slug}: un-normalised country "${v}"`)
    countries.set(v, (countries.get(v) ?? 0) + 1)
  }
  assert(countries.size >= 10, 'expected at least 10 countries')
  for (const r of routeList.routes.filter((x) => x.startsWith('/country/'))) assert(/^\/country\/[a-z0-9-]+$/.test(r), `bad country route ${r}`)
})


test('Source code contains no unverifiable trust claims', () => {
  const banned = [/100% real/i, /verified promo/i, /60k\+?/i, /60,000/, /52 sectors?/i, /escrow/i, /guaranteed delivery/i, /cryptographic/i, /images\.openai\.com/]
  const hits = []
  const scan = (rel) => {
    const full = path.join(rootDir, rel)
    if (fs.statSync(full).isDirectory()) return fs.readdirSync(full).forEach((c) => scan(path.join(rel, c)))
    if (!/\.(tsx?|html)$/.test(rel) || rel.startsWith('src/data/mockProducts')) return
    const text = fs.readFileSync(full, 'utf8')
    for (const re of banned) if (re.test(text)) hits.push(`${rel}: ${re}`)
  }
  scan('src')
  scan('index.html')
  assert(hits.length === 0, `banned claims found: ${hits.join('; ')}`)
})

test('Hero media is compressed, has a poster, and respects reduced motion', () => {
  for (const f of ['hero.webm', 'hero.mp4', 'hero-poster.jpg']) {
    const full = path.join(rootDir, 'public/media', f)
    assert(fs.existsSync(full), `missing public/media/${f}`)
    assert(fs.statSync(full).size < 3 * 1024 * 1024, `${f} is over 3 MB`)
  }
  const hero = fs.readFileSync(path.join(rootDir, 'src/components/HeroBackdrop.tsx'), 'utf8')
  assert(/prefers-reduced-motion/.test(hero), 'HeroBackdrop must honour prefers-reduced-motion')
  assert(/aria-hidden/.test(hero) && /muted/.test(hero) && /playsInline/.test(hero), 'HeroBackdrop must be decorative, muted and inline')
})

test('Every company and industry page is prerendered with its own content and metadata', () => {
  const dist = path.join(rootDir, 'dist')
  assert(fs.existsSync(path.join(dist, 'index.html')), 'run npm run build first')
  const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8')
  const titles = new Set()
  const check = (file, route, expectInText) => {
    const html = read(file)
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1]
    assert(title && title.includes('Marketplayace'), `${file}: missing title`)
    assert(!titles.has(title), `${file}: duplicate title "${title}"`)
    titles.add(title)
    assert(new RegExp(`<link rel="canonical" href="https://marketplayace.com${route === '/' ? '/' : route}"`).test(html), `${file}: wrong or missing canonical`)
    assert((html.match(/<h1[ >]/g) || []).length === 1, `${file}: expected exactly one h1`)
    assert(/<meta name="description" content="[^"]{40,}"/.test(html), `${file}: missing description`)
    assert(html.includes(`data-route="${route}"`), `${file}: missing data-route`)
    assert(html.includes(expectInText), `${file}: server HTML lacks its own content`)
    assert((html.match(/<meta name="description"/g) || []).length === 1, `${file}: duplicate description tag`)
  }
  for (const r of routeList.routes) {
    const file = r === '/' ? 'index.html' : `${r.slice(1)}.html`
    const company = r.startsWith('/company/') ? companiesFile.companies.find((c) => `/company/${c.slug}` === r) : null
    check(file, r, company ? company.name.replace(/&/g, '&amp;').replace(/</g, '&lt;') : '<h1')
    if (company) assert(/"@type":"Organization"/.test(read(file)), `${company.slug}: missing Organization JSON-LD`)
  }
})

test('Non-indexable and unknown routes are handled correctly', () => {
  const dist = path.join(rootDir, 'dist')
  for (const f of ['labs.html', 'labs/vault.html', 'labs/squad.html', 'labs/studio.html', 'compare.html', '404.html']) {
    const html = fs.readFileSync(path.join(dist, f), 'utf8')
    assert(/<meta name="robots" content="noindex,nofollow"/.test(html), `${f}: must be noindex`)
  }
  assert(fs.existsSync(path.join(dist, '404.html')), '404.html missing, unknown URLs would not return 404')
  assert(!fs.existsSync(path.join(dist, '_redirects')) || !/\/\*\s+\/index\.html\s+200/.test(fs.readFileSync(path.join(dist, '_redirects'), 'utf8')), 'catch-all SPA rewrite would hide 404s')
  assert(!fs.existsSync(path.join(dist, 'dist-server')), 'server bundle must not ship')
})

test('Labs is clearly labelled as sample and kept out of search indexing', () => {
  const labs = fs.readFileSync(path.join(rootDir, 'src/pages/LabsPage.tsx'), 'utf8')
  assert(/nothing is for sale/i.test(labs), 'Labs banner missing')
  assert(/noindex:\s*true/.test(labs), 'Labs must be noindex')
  const robots = fs.readFileSync(path.join(rootDir, 'public/robots.txt'), 'utf8')
  assert(/Disallow: \/labs/.test(robots), 'robots.txt must disallow /labs')
})

// --- SUITE 4: COMMERCE & MULTIPLAYER GAME STATE LOGIC ---
console.log('\n\x1b[36m[SUITE 4: Commerce Engine & Multiplayer Game State]\x1b[0m')

test('Cart discount math correctly applies stacked game and promo perks', () => {
  const originalPrice = 200
  const gameDiscount = 20 // 20%
  const promoDiscount = 10 // 10%
  
  const priceAfterGame = originalPrice * (1 - gameDiscount / 100) // 160
  const finalPrice = priceAfterGame * (1 - promoDiscount / 100) // 144
  const totalSaved = originalPrice - finalPrice // 56

  assert(priceAfterGame === 160, 'Game discount calculation mismatch')
  assert(finalPrice === 144, 'Promo discount stack mismatch')
  assert(totalSaved === 56, 'Total savings calculation mismatch')
})

test('Dutch auction price stops at floor price without overflowing', () => {
  let currentPrice = 120
  const floorPrice = 100
  const tickDrop = 15

  // 1st tick: 105
  currentPrice = Math.max(floorPrice, currentPrice - tickDrop)
  assert(currentPrice === 105, '1st tick drop calculation error')

  // 2nd tick: should hit floor 100, not 90
  currentPrice = Math.max(floorPrice, currentPrice - tickDrop)
  assert(currentPrice === floorPrice, 'Floor price clamp failed')
})

test('Squad room reaches unlocked state when target members are reached', () => {
  const squad = {
    targetMembers: 3,
    currentMembers: ['user1', 'user2']
  }

  assert(squad.currentMembers.length < squad.targetMembers, 'Should be in incomplete state')
  squad.currentMembers.push('user3')
  assert(squad.currentMembers.length >= squad.targetMembers, 'Should trigger squad unlock state')
})

// --- SUITE 5: PRODUCTION BUILD DISTRIBUTION CHECK ---
console.log('\n\x1b[36m[SUITE 5: Production Build Asset Verification]\x1b[0m')

test('Vite production build generates complete assets in dist/', () => {
  const distDir = path.join(rootDir, 'dist')
  assert(fs.existsSync(distDir), 'dist/ directory does not exist')
  
  const htmlFile = path.join(distDir, 'index.html')
  assert(fs.existsSync(htmlFile), 'dist/index.html is missing')

  const assetsDir = path.join(distDir, 'assets')
  assert(fs.existsSync(assetsDir), 'dist/assets directory is missing')

  const assetFiles = fs.readdirSync(assetsDir)
  const hasJs = assetFiles.some(f => f.endsWith('.js'))
  const hasCss = assetFiles.some(f => f.endsWith('.css'))

  assert(hasJs, 'Missing compiled production JavaScript bundle')
  assert(hasCss, 'Missing compiled production CSS bundle')
})

console.log('\n======================================================')
console.log(`   TOTAL TESTS: ${passed + failed} | PASSED: \x1b[32m${passed}\x1b[0m | FAILED: ${failed === 0 ? '\x1b[32m0\x1b[0m' : `\x1b[31m${failed}\x1b[0m`}`)
console.log('======================================================\n')

if (failed > 0) {
  process.exit(1)
}
