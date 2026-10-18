import indexData from './generated/index.json'
import { categoryBySlug } from './taxonomy'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Sourced<T> {
  value: T
  /** Human-readable name of the source, e.g. 'Wikidata' or 'SEC EDGAR 10-K'. */
  provider: string
  source: string
  retrievedAt: string
}

export interface Money {
  amount: number
  currency: string | null
  asOf: string | null
}

export interface Logo {
  usable: boolean
  path: string | null
  license: string | null
  licenseUrl: string | null
  author: string | null
  commonsPage: string
}

/** Full record. Loaded on demand (public/data shards); read from disk while prerendering. */
export interface Company {
  slug: string
  wikidataId: string
  cik?: string | null
  name: string
  description: Sourced<string> | null
  founded: Sourced<number> | null
  headquarters: Sourced<string> | null
  country: Sourced<string> | null
  industries: Sourced<string[]> | null
  founders: Sourced<string[]> | null
  parent: Sourced<string> | null
  website: Sourced<string> | null
  listings: Sourced<{ exchange: string | null; symbol: string }[]> | null
  employees: Sourced<{ amount: number; asOf: string | null }> | null
  revenue: Sourced<Money> | null
  netIncome: Sourced<Money> | null
  marketCap: Sourced<Money> | null
  logo: Logo | null
  categories: string[]
  wikipedia: string | null
  dataNote: string | null
  sitelinks?: number
  /** 'query' = found by a category spec rather than hand-picked. */
  discovery?: 'query' | 'curated'
}

/** Light record that ships in the JS bundle: enough for lists, cards, search and counts. */
export interface CompanyLite {
  slug: string
  name: string
  hq: string | null
  country: string | null
  categories: string[]
  logo: string | null
  founded: number | null
  sitelinks: number
  /** Count of verified facts, including the description. Drives the quality gate. */
  facts: number
}

/* ------------------------------------------------------------------ */
/* Index (always available)                                            */
/* ------------------------------------------------------------------ */

export const DATA_GENERATED_AT: string = indexData.generatedAt
export const INDEX = indexData.companies as CompanyLite[]
const bySlug = new Map(INDEX.map((c) => [c.slug, c]))
const byNotability = (a: CompanyLite, b: CompanyLite) => b.sitelinks - a.sitelinks || a.name.localeCompare(b.name)

export const companyLite = (slug: string) => bySlug.get(slug) ?? null

/**
 * Page-title names. Two different companies can share a name (two "Puma"s, a brand and its operator), so
 * titles must be unique: add the country, then the industry, then the founding year, then the profile's own slug,
 * only as far as needed.
 */
const titles = (() => {
  const result = new Map<string, string>()
  const level: ((c: CompanyLite) => string)[] = [
    (c) => c.name,
    (c) => (c.country ? `${c.name} (${c.country})` : c.name),
    (c) => `${c.name} (${[c.country, categoryBySlug(c.categories[0])?.name].filter(Boolean).join(', ')})`,
    (c) => `${c.name} (${[c.country, c.founded ? `founded ${c.founded}` : null].filter(Boolean).join(', ')})`,
    (c) => `${c.name} (${c.slug})`
  ]
  let pending = INDEX
  for (const make of level) {
    const groups = new Map<string, CompanyLite[]>()
    for (const c of pending) {
      const key = make(c).toLowerCase()
      groups.set(key, [...(groups.get(key) ?? []), c])
    }
    const next: CompanyLite[] = []
    for (const [, members] of groups) {
      if (members.length === 1 && !result.has(members[0].slug)) result.set(members[0].slug, make(members[0]))
      else next.push(...members)
    }
    // A name that is unique in the whole index keeps its plain form; collisions move to the next, more specific form.
    pending = next
    if (pending.length === 0) break
  }
  for (const c of pending) result.set(c.slug, `${c.name} (${c.slug})`)
  return result
})()

export const titleName = (c: CompanyLite) => titles.get(c.slug) ?? c.name

export const companiesInCategory = (slug: string) => INDEX.filter((c) => c.categories.includes(slug)).sort(byNotability)

/** Lowercase ASCII URL slug for a country name ("Côte d'Ivoire" -> "cote-divoire"). */
export const countrySlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’`]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export interface CountryInfo {
  name: string
  slug: string
  count: number
}

const countryMap = new Map<string, CountryInfo>()
for (const c of INDEX) {
  if (!c.country) continue
  const slug = countrySlug(c.country)
  const e = countryMap.get(slug) ?? { name: c.country, slug, count: 0 }
  e.count++
  countryMap.set(slug, e)
}
/** Every country with at least one profiled company, largest first. */
export const COUNTRIES: CountryInfo[] = [...countryMap.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
export const countryBySlug = (slug: string) => countryMap.get(slug) ?? null
export const companiesInCountry = (slug: string) => INDEX.filter((c) => c.country && countrySlug(c.country) === slug).sort(byNotability)
/** Industry-by-country pages with fewer companies than this are noindex. Keep equal to MIN_INDEXED_COUNTRY_PAGE in scripts/lib/routes.mjs. */
export const MIN_INDEXED_COUNTRY_PAGE = 3
/** A company page needs at least this many verified facts to be indexed. Keep equal to MIN_INDEXED_FACTS in scripts/lib/routes.mjs. */
export const MIN_INDEXED_FACTS = 5
export const companiesInCategoryAndCountry = (category: string, slug: string) =>
  companiesInCategory(category).filter((c) => c.country && countrySlug(c.country) === slug)

export function searchCompanies(q: string, limit = 8): CompanyLite[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  const scored: [number, CompanyLite][] = []
  for (const c of INDEX) {
    const n = c.name.toLowerCase()
    const i = n.indexOf(needle)
    if (i < 0 && !c.slug.includes(needle.replace(/\s+/g, '-'))) continue
    // word-start matches first, then by notability
    scored.push([(i === 0 ? 0 : i > 0 && /[^a-z0-9]/.test(n[i - 1]) ? 1 : 2), c])
  }
  return scored.sort((a, b) => a[0] - b[0] || byNotability(a[1], b[1])).slice(0, limit).map(([, c]) => c)
}

/* ------------------------------------------------------------------ */
/* Details (loaded on demand)                                          */
/* ------------------------------------------------------------------ */

const SHARDS = 64

/** FNV-1a. Must stay identical to shardOf() in scripts/lib/data.mjs. */
function shardOf(slug: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h % SHARDS
}
const shardUrl = (n: number) => `/data/shard-${String(n).padStart(2, '0')}.json`

const cache = new Map<string, Company>()
/** Set by the prerender entry so server rendering can read details synchronously from disk. */
export const detailProvider: { sync: ((slug: string) => Company | null) | null } = { sync: null }

export const getCompanyDetail = (slug: string): Company | null => cache.get(slug) ?? detailProvider.sync?.(slug) ?? null

const shardLoads = new Map<number, Promise<void>>()
function loadShard(n: number): Promise<void> {
  let p = shardLoads.get(n)
  if (!p) {
    p = fetch(shardUrl(n))
      .then((r) => {
        if (!r.ok) throw new Error(`shard ${n}: HTTP ${r.status}`)
        return r.json() as Promise<Record<string, Company>>
      })
      .then((records) => {
        for (const [slug, rec] of Object.entries(records)) cache.set(slug, rec)
      })
      .catch((err) => {
        shardLoads.delete(n) // allow a retry later
        throw err
      })
    shardLoads.set(n, p)
  }
  return p
}

/** Ensures the full records for these slugs are in memory. Resolves immediately when they already are. */
export function loadCompanyDetails(slugs: string[]): Promise<void> {
  const shards = new Set(slugs.filter((s) => !cache.has(s)).map(shardOf))
  return Promise.all([...shards].map(loadShard)).then(() => undefined)
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/** Compact currency formatting that never implies precision we don't have. */
export function formatMoney(m: Money): string {
  const abs = Math.abs(m.amount)
  const sym = m.currency ? `${m.currency} ` : ''
  const unit = abs >= 1e12 ? [1e12, 'trillion'] : abs >= 1e9 ? [1e9, 'billion'] : abs >= 1e6 ? [1e6, 'million'] : [1, '']
  const n = m.amount / (unit[0] as number)
  return `${sym}${n.toLocaleString('en', { maximumFractionDigits: n >= 100 ? 0 : 1 })}${unit[1] ? ' ' + unit[1] : ''}`
}
