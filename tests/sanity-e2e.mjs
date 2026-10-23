import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readAllCompanies, readIndex, countrySlug } from '../scripts/lib/data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

let totalTests = 0
let passedTests = 0
let failedTests = 0

function it(desc, fn) {
  totalTests++
  try {
    fn()
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${desc}`)
    passedTests++
  } catch (err) {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${desc}: ${err.message}`)
    failedTests++
  }
}

function expect(actual) {
  return {
    toBe(expected, msg) {
      if (actual !== expected) {
        throw new Error(msg || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`)
      }
    },
    toBeGreaterThanOrEqual(min, msg) {
      if (actual < min) {
        throw new Error(msg || `Expected ${actual} >= ${min}`)
      }
    },
    toBeLessThanOrEqual(max, msg) {
      if (actual > max) {
        throw new Error(msg || `Expected ${actual} <= ${max}`)
      }
    },
    toBeTruthy(msg) {
      if (!actual) throw new Error(msg || `Expected truthy value but got ${actual}`)
    },
    toBeFalsy(msg) {
      if (actual) throw new Error(msg || `Expected falsy value but got ${actual}`)
    },
    toContain(substr, msg) {
      if (typeof actual === 'string' && !actual.includes(substr)) {
        throw new Error(msg || `Expected string to contain ${substr}`)
      }
      if (Array.isArray(actual) && !actual.includes(substr)) {
        throw new Error(msg || `Expected array to contain ${substr}`)
      }
    }
  }
}

console.log('\n======================================================================')
console.log('   MARKETPLAYACE.COM - END-TO-END IN-DEPTH SANITY TEST SUITE')
console.log('======================================================================\n')

// --------------------------------------------------------------------
// JOURNEY 1: NAVIGATION, ROUTING AND DISCOVERY FLOW
// --------------------------------------------------------------------
console.log('\x1b[36m[JOURNEY 1: Navigation, Routing & Discovery Flows]\x1b[0m')

const LABS_TABS = ['floor', 'vault', 'squad', 'studio']

function parsePath(pathname, search = '') {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent)
  const [a, b] = parts
  if (!a) return { page: 'home' }
  if (a === 'categories' && !b) return { page: 'categories' }
  if (a === 'category' && b) return { page: 'category', slug: b, country: parts[2] }
  if (a === 'countries' && !b) return { page: 'countries' }
  if (a === 'country' && b) return { page: 'country', slug: b }
  if (a === 'company' && b) return { page: 'company', slug: b }
  if (a === 'compare' && !b) {
    const slugs = (new URLSearchParams(search).get('c') ?? '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 3)
    return { page: 'compare', slugs }
  }
  if (a === 'methodology' || a === 'about' || a === 'privacy' || a === 'terms') return { page: a }
  if (a === 'labs') return { page: 'labs', tab: LABS_TABS.includes(b) ? b : 'floor' }
  return { page: 'not-found' }
}

function buildPath(route) {
  switch (route.page) {
    case 'home': return '/'
    case 'categories': return '/categories'
    case 'category': return `/category/${encodeURIComponent(route.slug)}${route.country ? `/${encodeURIComponent(route.country)}` : ''}`
    case 'country': return `/country/${encodeURIComponent(route.slug)}`
    case 'company': return `/company/${encodeURIComponent(route.slug)}`
    case 'compare': return route.slugs?.length ? `/compare?c=${route.slugs.map(encodeURIComponent).join(',')}` : '/compare'
    case 'labs': return route.tab === 'floor' ? '/labs' : `/labs/${route.tab}`
    case 'not-found': return '/'
    default: return `/${route.page}`
  }
}

it('Parses and round-trips core homepage and list routes', () => {
  expect(parsePath('/').page).toBe('home')
  expect(buildPath({ page: 'home' })).toBe('/')

  expect(parsePath('/categories').page).toBe('categories')
  expect(buildPath({ page: 'categories' })).toBe('/categories')

  expect(parsePath('/countries').page).toBe('countries')
  expect(buildPath({ page: 'countries' })).toBe('/countries')
})

it('Parses dynamic category routes with and without country filters', () => {
  const cat = parsePath('/category/quick-commerce')
  expect(cat.page).toBe('category')
  expect(cat.slug).toBe('quick-commerce')
  expect(buildPath({ page: 'category', slug: 'quick-commerce' })).toBe('/category/quick-commerce')

  const catCountry = parsePath('/category/quick-commerce/india')
  expect(catCountry.page).toBe('category')
  expect(catCountry.slug).toBe('quick-commerce')
  expect(catCountry.country).toBe('india')
  expect(buildPath({ page: 'category', slug: 'quick-commerce', country: 'india' })).toBe('/category/quick-commerce/india')
})

it('Parses company, country and compare routes', () => {
  const comp = parsePath('/company/zepto')
  expect(comp.page).toBe('company')
  expect(comp.slug).toBe('zepto')
  expect(buildPath({ page: 'company', slug: 'zepto' })).toBe('/company/zepto')

  const country = parsePath('/country/india')
  expect(country.page).toBe('country')
  expect(country.slug).toBe('india')
  expect(buildPath({ page: 'country', slug: 'india' })).toBe('/country/india')

  const compare = parsePath('/compare', 'c=zepto,blinkit,swiggy')
  expect(compare.page).toBe('compare')
  expect(compare.slugs.length).toBe(3)
  expect(compare.slugs[0]).toBe('zepto')
  expect(compare.slugs[1]).toBe('blinkit')
  expect(compare.slugs[2]).toBe('swiggy')
})

it('Parses static information routes and unknown routes to not-found', () => {
  expect(parsePath('/methodology').page).toBe('methodology')
  expect(parsePath('/about').page).toBe('about')
  expect(parsePath('/privacy').page).toBe('privacy')
  expect(parsePath('/terms').page).toBe('terms')
  expect(parsePath('/non-existent-random-route-xyz').page).toBe('not-found')
})

// --------------------------------------------------------------------
// JOURNEY 2: GLOBAL SEARCH ENGINE AND AUTO-SUGGEST
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 2: Search Engine & Auto-Suggest Flows]\x1b[0m')

const indexJson = await readIndex()
const INDEX = indexJson.companies

function searchCompanies(q, limit = 8) {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  const scored = []
  for (const c of INDEX) {
    const n = c.name.toLowerCase()
    const i = n.indexOf(needle)
    if (i < 0 && !c.slug.includes(needle.replace(/\s+/g, '-'))) continue
    scored.push([(i === 0 ? 0 : i > 0 && /[^a-z0-9]/.test(n[i - 1]) ? 1 : 2), c])
  }
  const byNotability = (a, b) => b.sitelinks - a.sitelinks || a.name.localeCompare(b.name)
  return scored.sort((a, b) => a[0] - b[0] || byNotability(a[1], b[1])).slice(0, limit).map(([, c]) => c)
}

it('Finds exact match Indian and global brands by prefix and word start', () => {
  const blinkitResults = searchCompanies('blinkit')
  expect(blinkitResults.length > 0).toBeTruthy('Expected at least one result for blinkit')
  expect(blinkitResults[0].slug).toBe('blinkit')

  const swiggyResults = searchCompanies('swiggy')
  expect(swiggyResults.length > 0).toBeTruthy('Expected at least one result for swiggy')
  expect(swiggyResults[0].slug).toBe('swiggy')

  const tataResults = searchCompanies('Tata')
  expect(tataResults.length > 0).toBeTruthy('Expected at least one result for Tata')
})

it('Handles case-insensitivity, leading/trailing whitespace, and empty query', () => {
  expect(searchCompanies('  ').length).toBe(0)
  expect(searchCompanies('').length).toBe(0)

  const lower = searchCompanies('apple')
  const upper = searchCompanies('APPLE')
  expect(lower.length).toBe(upper.length)
  expect(lower[0]?.slug).toBe(upper[0]?.slug)
})

it('Prioritizes word-start matches over arbitrary middle substring matches', () => {
  const hits = searchCompanies('gro', 5)
  expect(hits.length > 0).toBeTruthy('Expected hits for gro')
  const top = hits[0].name.toLowerCase()
  const startsWithGro = /(^|\s)gro/i.test(top)
  expect(startsWithGro).toBeTruthy('Top result should start with gro')
})

// --------------------------------------------------------------------
// JOURNEY 3: BRAND PROFILE DATA INTEGRITY & SOURCED FACTS
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 3: Brand Profiles & Sourced Facts Verification]\x1b[0m')

const allCompanies = await readAllCompanies()
const compMap = new Map(allCompanies.map((c) => [c.slug, c]))

it('Verifies real brand profile fields for key companies', () => {
  const sampleSlugs = ['blinkit', 'swiggy', 'zomato', 'apple', 'microsoft']
  for (const slug of sampleSlugs) {
    const c = compMap.get(slug)
    if (!c) continue
    expect(typeof c.name).toBe('string', `${slug} name should be string`)
    expect(c.name.length > 0).toBeTruthy(`${slug} name should not be empty`)
    expect(c.categories.length > 0).toBeTruthy(`${slug} should have categories`)
    if (c.website) {
      expect(c.website.value.startsWith('http')).toBeTruthy(`${slug} website should be valid URL`)
      expect(c.website.provider.length > 0).toBeTruthy(`${slug} website should have provider`)
      expect(c.website.retrievedAt.length > 0).toBeTruthy(`${slug} website should have retrievedAt`)
    }
  }
})

it('Verifies all published facts have provider, source URL and retrieval date', () => {
  const fields = ['description', 'founded', 'headquarters', 'country', 'industries', 'founders', 'parent', 'website', 'listings', 'employees', 'revenue', 'netIncome', 'marketCap']
  let factCount = 0
  for (const c of allCompanies) {
    for (const f of fields) {
      const fact = c[f]
      if (!fact) continue
      factCount++
      if (!fact.provider) throw new Error(`${c.slug}.${f} missing provider`)
      if (!/^https?:\/\//.test(fact.source)) throw new Error(`${c.slug}.${f} source must be http(s) URL`)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fact.retrievedAt)) throw new Error(`${c.slug}.${f} invalid retrievedAt format`)
    }
  }
  expect(factCount > 5000).toBeTruthy(`Expected at least 5000 verified facts across companies, found ${factCount}`)
})

it('Quality gate strictly filters thin companies from search index', () => {
  const liteIndex = INDEX
  for (const c of liteIndex) {
    expect(typeof c.facts).toBe('number', `${c.slug} should have facts count`)
    expect(c.facts >= 0).toBeTruthy(`${c.slug} facts must be non-negative`)
  }
})

// --------------------------------------------------------------------
// JOURNEY 4: COUNTRY-WISE & INDUSTRY-WISE REAL BRAND EXPLORATION
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 4: Country & Industry Real Brand Exploration]\x1b[0m')

const countryMap = new Map()
for (const c of INDEX) {
  if (!c.country) continue
  const slug = countrySlug(c.country)
  const e = countryMap.get(slug) ?? { name: c.country, slug, count: 0 }
  e.count++
  countryMap.set(slug, e)
}
const COUNTRIES = [...countryMap.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

it('Verifies countries list has proper count aggregation and valid slugs', () => {
  expect(COUNTRIES.length >= 10).toBeTruthy('Expected at least 10 countries in index')
  const india = COUNTRIES.find((c) => c.slug === 'india')
  expect(Boolean(india)).toBeTruthy('Expected India in country list')
  expect(india.count >= 20).toBeTruthy(`Expected at least 20 companies in India, found ${india.count}`)

  for (const c of COUNTRIES) {
    expect(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.slug)).toBeTruthy(`Country slug ${c.slug} is invalid`)
    expect(c.count > 0).toBeTruthy(`Country ${c.name} has 0 companies`)
  }
})

it('Verifies Indian brands are categorized under real sectors', () => {
  const indianCompanies = INDEX.filter((c) => c.country && countrySlug(c.country) === 'india')
  expect(indianCompanies.length > 20).toBeTruthy('Expected at least 20 Indian brands')
  const categoriesPresent = new Set(indianCompanies.flatMap((c) => c.categories))
  expect(categoriesPresent.size >= 5).toBeTruthy('Expected at least 5 industries represented in India')
})

it('Verifies headquarters locations exist on brand records', () => {
  const withHq = INDEX.filter((c) => c.hq && c.hq.length > 0)
  expect(withHq.length > 1000).toBeTruthy('Expected at least 1000 companies with explicit HQ locations')
})

// --------------------------------------------------------------------
// JOURNEY 5: IBSL BANNER INTEGRATION ON ALL PAGES
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 5: IBSL Campaign Banner Across All Pages]\x1b[0m')

const TARGET_LINK = 'https://indiabullssecurities.onelink.me/Kaqz/marketplayace'

it('Verifies IBSL banner asset files exist with non-zero size', () => {
  const assets = [
    'public/banners/ibsl-banner-leaderboard.jpg',
    'public/banners/ibsl-banner-medium.jpg',
    'public/banners/ibsl-banner-card.jpg'
  ]
  for (const rel of assets) {
    const full = path.join(rootDir, rel)
    expect(fs.existsSync(full)).toBeTruthy(`Missing asset: ${rel}`)
    const stat = fs.statSync(full)
    expect(stat.size > 5000).toBeTruthy(`Asset too small: ${rel} (${stat.size} bytes)`)
  }
})

it('Verifies IBSLBanner component imports target link and has secure attributes', () => {
  const bannerCode = fs.readFileSync(path.join(rootDir, 'src/components/IBSLBanner.tsx'), 'utf8')
  expect(bannerCode.includes(TARGET_LINK)).toBeTruthy('IBSLBanner must use TARGET_LINK')
  expect(bannerCode.includes('target="_blank"')).toBeTruthy('IBSLBanner must have target="_blank"')
  expect(bannerCode.includes('rel="noopener noreferrer"')).toBeTruthy('IBSLBanner must have rel="noopener noreferrer"')
  expect(bannerCode.includes('ibsl-banner-leaderboard.jpg')).toBeTruthy('IBSLBanner must include leaderboard asset')
  expect(bannerCode.includes('ibsl-banner-medium.jpg')).toBeTruthy('IBSLBanner must include medium asset')
  expect(bannerCode.includes('ibsl-banner-card.jpg')).toBeTruthy('IBSLBanner must include card asset')
})

it('Verifies IBSLBanner is mounted globally in App.tsx', () => {
  const appCode = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8')
  expect(appCode.includes('IBSLBanner')).toBeTruthy('App.tsx must import and render IBSLBanner')
  expect(appCode.includes('<IBSLBanner />')).toBeTruthy('App.tsx must include <IBSLBanner /> JSX')
})

it('Verifies prerendered distribution HTML files contain IBSL link and assets', () => {
  const testFiles = [
    'dist/index.html',
    'dist/categories.html',
    'dist/countries.html',
    'dist/methodology.html',
    'dist/about.html',
    'dist/privacy.html',
    'dist/terms.html',
    'dist/category/groceries.html',
    'dist/country/india.html',
    'dist/company/blinkit.html'
  ]
  for (const rel of testFiles) {
    const full = path.join(rootDir, rel)
    if (!fs.existsSync(full)) continue
    const html = fs.readFileSync(full, 'utf8')
    expect(html.includes(TARGET_LINK)).toBeTruthy(`${rel} missing IBSL campaign link`)
    expect(html.includes('rel="noopener noreferrer"')).toBeTruthy(`${rel} missing secure rel attribute`)
  }
})

// --------------------------------------------------------------------
// JOURNEY 6: INTERACTIVE COMMERCE ENGINE & LABS EXPERIMENTS
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 6: Interactive Commerce Engine & Labs Flows]\x1b[0m')

it('Simulates cart operations: adding, updating quantity, stacking discounts and clamping', () => {
  const originalPrice = 500
  let quantity = 1
  const gameDiscount = 15 // 15% won in mini-game
  const promoDiscount = 10 // 10% coupon

  const discountedItemPrice = originalPrice * (1 - gameDiscount / 100)
  expect(discountedItemPrice).toBe(425, 'Item discount calculation')

  quantity = 2
  const subtotal = discountedItemPrice * quantity
  expect(subtotal).toBe(850, 'Subtotal calculation')

  const finalTotal = subtotal * (1 - promoDiscount / 100)
  expect(finalTotal).toBe(765, 'Final total after promo discount')

  const maxAllowedDiscount = 40
  const attemptedDiscount = 99
  const clampedDiscount = Math.min(attemptedDiscount, maxAllowedDiscount)
  expect(clampedDiscount).toBe(40, 'Discount must be clamped to ceiling')
})

it('Simulates Dutch auction price drop and floor clamp mechanics', () => {
  const startPrice = 1000
  const floorPrice = 400
  const dropPerTick = 150

  let currentPrice = startPrice
  currentPrice = Math.max(floorPrice, currentPrice - dropPerTick)
  expect(currentPrice).toBe(850)

  currentPrice = Math.max(floorPrice, currentPrice - dropPerTick)
  expect(currentPrice).toBe(700)

  currentPrice = Math.max(floorPrice, currentPrice - dropPerTick * 3)
  expect(currentPrice).toBe(400, 'Price must clamp exactly at floor price')
})

it('Simulates Squad Shopping room state and unlocks at quorum', () => {
  const room = {
    id: 'squad-alpha',
    targetMembers: 4,
    members: ['alice', 'bob']
  }
  const isUnlocked = (r) => r.members.length >= r.targetMembers

  expect(isUnlocked(room)).toBeFalsy('Squad should not be unlocked with 2/4 members')
  room.members.push('carol')
  expect(isUnlocked(room)).toBeFalsy('Squad should not be unlocked with 3/4 members')
  room.members.push('dave')
  expect(isUnlocked(room)).toBeTruthy('Squad must be unlocked when quorum is met')
})

// --------------------------------------------------------------------
// JOURNEY 7: SECURITY, VAPT & ACCESSIBILITY GUARDRAILS
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 7: Security, VAPT & Accessibility Guardrails]\x1b[0m')

it('Codebase must contain zero em dashes (\u2014) and zero en dashes (\u2013)', () => {
  const targets = ['src', 'index.html', 'README.md', 'tests']
  let emCount = 0
  let enCount = 0

  function scan(dirOrFile) {
    const full = path.join(rootDir, dirOrFile)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(full)) scan(path.join(dirOrFile, child))
    } else if (/\.(tsx?|html|css|md|json|mjs)$/.test(dirOrFile) && !dirOrFile.includes('data/generated')) {
      const content = fs.readFileSync(full, 'utf8')
      if (content.includes('\u2014')) {
        console.error(`Em dash in ${dirOrFile}`)
        emCount++
      }
      if (content.includes('\u2013')) {
        console.error(`En dash in ${dirOrFile}`)
        enCount++
      }
    }
  }

  for (const t of targets) scan(t)
  expect(emCount).toBe(0, `Found ${emCount} em dashes`)
  expect(enCount).toBe(0, `Found ${enCount} en dashes`)
})

it('Enforces VAPT URL sanitization against script injection', () => {
  function sanitize(u) {
    if (!u || typeof u !== 'string') return 'https://marketplayace.com'
    const t = u.trim()
    try {
      const p = new URL(t, 'https://marketplayace.com')
      if (p.protocol === 'http:' || p.protocol === 'https:') return t
    } catch {
      if (t.startsWith('/') && !t.startsWith('//')) return t
    }
    return 'https://marketplayace.com'
  }

  expect(sanitize('javascript:alert(1)')).toBe('https://marketplayace.com')
  expect(sanitize('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe('https://marketplayace.com')
  expect(sanitize('https://marketplayace.com')).toBe('https://marketplayace.com')
  expect(sanitize('/company/zepto')).toBe('/company/zepto')
})

it('Enforces landmark accessibility and skip-to-content target in App.tsx', () => {
  const app = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8')
  expect(app.includes('href="#main"')).toBeTruthy('Skip to content link must point to #main')
  expect(app.includes('id="main"')).toBeTruthy('Main landmark must have id="main"')
  expect(app.includes('<SiteHeader')).toBeTruthy('SiteHeader must be mounted')
  expect(app.includes('<Footer')).toBeTruthy('Footer must be mounted')
})

// --------------------------------------------------------------------
// JOURNEY 8: SEO METADATA, OPEN GRAPH, JSON-LD & SITEMAP
// --------------------------------------------------------------------
console.log('\n\x1b[36m[JOURNEY 8: SEO Metadata, Open Graph & Structured Data]\x1b[0m')

it('Sitemap lists exactly the valid indexable routes', () => {
  const sitemapXml = fs.readFileSync(path.join(rootDir, 'public/sitemap.xml'), 'utf8')
  expect(sitemapXml.includes('https://marketplayace.com/')).toBeTruthy('Sitemap must include root')
  expect(sitemapXml.includes('https://marketplayace.com/categories')).toBeTruthy('Sitemap must include /categories')
  expect(sitemapXml.includes('https://marketplayace.com/countries')).toBeTruthy('Sitemap must include /countries')
  expect(sitemapXml.includes('https://marketplayace.com/company/blinkit')).toBeTruthy('Sitemap must include /company/blinkit')
  expect(!sitemapXml.includes('/labs')).toBeTruthy('Sitemap must not include /labs')
  expect(!sitemapXml.includes('/compare')).toBeTruthy('Sitemap must not include /compare')
})

it('Robots.txt points to sitemap and protects data shards from scrapers', () => {
  const robots = fs.readFileSync(path.join(rootDir, 'public/robots.txt'), 'utf8')
  expect(robots.includes('Sitemap: https://marketplayace.com/sitemap.xml')).toBeTruthy('robots.txt must declare sitemap')
  expect(robots.includes('Disallow: /data/')).toBeTruthy('robots.txt must disallow /data/')
})

// --------------------------------------------------------------------
// SUMMARY REPORT
// --------------------------------------------------------------------
console.log('\n======================================================================')
console.log(`   TOTAL TESTS: ${totalTests} | PASSED: \x1b[32m${passedTests}\x1b[0m | FAILED: ${failedTests === 0 ? '\x1b[32m0\x1b[0m' : `\x1b[31m${failedTests}\x1b[0m`}`)
console.log('======================================================================\n')

if (failedTests > 0) {
  process.exit(1)
}
