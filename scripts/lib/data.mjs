/**
 * Storage layout for generated company data, shared by the sync, sitemap, prerender and test scripts.
 *
 *   src/data/generated/index.json     light records for lists, search and counts (ships in the JS bundle)
 *   public/data/shard-NN.json         full records, grouped into SHARDS files by a hash of the slug,
 *                                     loaded on demand in the browser and read from disk when prerendering
 */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'

export const SHARDS = 64
const root = new URL('../../', import.meta.url).pathname
export const INDEX_FILE = path.join(root, 'src/data/generated/index.json')
export const SHARD_DIR = path.join(root, 'public/data')

/** FNV-1a. Must stay identical to shardOf() in src/data/companies.ts. */
export function shardOf(slug) {
  let h = 0x811c9dc5
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h % SHARDS
}
export const shardName = (n) => `shard-${String(n).padStart(2, '0')}.json`

/** Wikidata uses several names for the same place; show one consistent name. */
const COUNTRY_NAMES = {
  "People's Republic of China": 'China',
  'Republic of China': 'Taiwan',
  'United States of America': 'United States',
  'Czech Republic': 'Czechia',
  'Kingdom of the Netherlands': 'Netherlands',
  'Russian Federation': 'Russia',
  'Korea, South': 'South Korea',
  "Côte d'Ivoire": "Côte d'Ivoire"
}
// Dissolved states: a company shown under one of these has no reliable current country, so show none rather than guess.
const HISTORIC_COUNTRIES = new Set(['Soviet Union', 'Czechoslovakia', 'Yugoslavia', 'Serbia and Montenegro', 'Austria-Hungary', 'Russian Empire', 'Ottoman Empire', 'Kingdom of Yugoslavia'])
// Unambiguous predecessors of a single modern country.
const SUCCESSORS = { 'East Germany': 'Germany', 'West Germany': 'Germany', 'German Reich': 'Germany', 'Nazi Germany': 'Germany', 'German Empire': 'Germany', 'Weimar Republic': 'Germany', 'Kingdom of Italy': 'Italy' }
export const normalizeCountry = (name) => (name ? (HISTORIC_COUNTRIES.has(name) ? null : (SUCCESSORS[name] ?? COUNTRY_NAMES[name] ?? name)) : name)

/** Must stay identical to countrySlug() in src/data/companies.ts. */
export const countrySlug = (name) =>
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’`]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** How many independent verified facts a record has. Used by the quality gate (see docs/SCALING-PLAN.md). */
export const factCount = (c) =>
  ['founded', 'headquarters', 'country', 'website', 'industries', 'listings', 'employees', 'founders', 'parent', 'revenue'].filter((k) => c[k]).length

export const toLite = (c) => ({
  slug: c.slug,
  name: c.name,
  hq: c.headquarters?.value ?? null,
  country: normalizeCountry(c.country?.value ?? null),
  categories: c.categories,
  logo: c.logo?.usable && c.logo.path ? c.logo.path : null,
  founded: c.founded?.value ?? null,
  sitelinks: c.sitelinks ?? 0,
  facts: factCount(c) + (c.description ? 1 : 0)
})

export async function readAllCompanies() {
  const all = []
  let files = []
  try { files = (await readdir(SHARD_DIR)).filter((f) => /^shard-\d+\.json$/.test(f)).sort() } catch { /* none yet */ }
  for (const f of files) {
    const shard = JSON.parse(await readFile(path.join(SHARD_DIR, f), 'utf8'))
    all.push(...Object.values(shard))
  }
  return all.sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function readIndex() {
  return JSON.parse(await readFile(INDEX_FILE, 'utf8'))
}

export async function writeAllCompanies(companies, generatedAt) {
  await mkdir(SHARD_DIR, { recursive: true })
  for (const f of await readdir(SHARD_DIR)) if (/^shard-\d+\.json$/.test(f)) await rm(path.join(SHARD_DIR, f))
  const shards = Array.from({ length: SHARDS }, () => ({}))
  for (const c of companies) {
    // Wikidata sometimes describes an item as the page about it ("Wikipedia overview article"); that is not a description.
    if (c.description && /^(wikipedia|wikimedia)\b.*\b(article|page|overview|disambiguation|category|list)\b|disambiguation page/i.test(c.description.value)) c.description = null
    // A financial figure without its period or currency is not trustworthy; never publish one.
    for (const k of ['revenue', 'netIncome', 'marketCap']) {
      if (c[k] && (!c[k].value?.asOf || !c[k].value?.currency)) c[k] = null
    }
    if (c.country) {
      const v = normalizeCountry(c.country.value)
      c.country = v ? { ...c.country, value: v } : null
    }
    shards[shardOf(c.slug)][c.slug] = c
  }
  for (let i = 0; i < SHARDS; i++) await writeFile(path.join(SHARD_DIR, shardName(i)), JSON.stringify(shards[i]))
  const sorted = [...companies].sort((a, b) => a.slug.localeCompare(b.slug))
  await writeFile(INDEX_FILE, JSON.stringify({ generatedAt, source: 'Wikidata (CC0), SEC EDGAR', companies: sorted.map(toLite) }))
}
