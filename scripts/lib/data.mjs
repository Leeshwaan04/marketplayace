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

export const toLite = (c) => ({
  slug: c.slug,
  name: c.name,
  hq: c.headquarters?.value ?? null,
  country: c.country?.value ?? null,
  categories: c.categories,
  logo: c.logo?.usable && c.logo.path ? c.logo.path : null,
  founded: c.founded?.value ?? null,
  sitelinks: c.sitelinks ?? 0
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
  for (const c of companies) shards[shardOf(c.slug)][c.slug] = c
  for (let i = 0; i < SHARDS; i++) await writeFile(path.join(SHARD_DIR, shardName(i)), JSON.stringify(shards[i]))
  const sorted = [...companies].sort((a, b) => a.slug.localeCompare(b.slug))
  await writeFile(INDEX_FILE, JSON.stringify({ generatedAt, source: 'Wikidata (CC0), SEC EDGAR', companies: sorted.map(toLite) }))
}
