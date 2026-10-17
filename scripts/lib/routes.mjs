/**
 * The single list of pages the site publishes. Used by the prerender, the sitemap and the tests so they cannot drift.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { readIndex, countrySlug } from './data.mjs'

const root = new URL('../../', import.meta.url).pathname

/** Industry-by-country pages with fewer companies than this are published but noindex. Keep equal to MIN_INDEXED_COUNTRY_PAGE in src/data/companies.ts. */
export const MIN_INDEXED_COUNTRY_PAGE = 3

export async function categorySlugs() {
  const taxonomy = await readFile(path.join(root, 'src/data/taxonomy.ts'), 'utf8')
  return [...taxonomy.matchAll(/^\s*\['([a-z0-9-]+)', '/gm)].map((m) => m[1])
}

/** Static pages that are always published. */
export const STATIC_ROUTES = ['/', '/categories', '/countries', '/methodology', '/about', '/privacy', '/terms']
/** Interactive, non-indexable pages that must still resolve (served as an empty app shell). */
export const SHELL_ROUTES = ['/labs', '/labs/vault', '/labs/squad', '/labs/studio', '/compare']

export async function listRoutes() {
  const { companies } = await readIndex()
  const cats = await categorySlugs()
  const countries = new Map()
  const catCountry = new Map()
  for (const c of companies) {
    if (!c.country) continue
    const cs = countrySlug(c.country)
    countries.set(cs, (countries.get(cs) ?? 0) + 1)
    for (const k of c.categories) catCountry.set(`${k}/${cs}`, (catCountry.get(`${k}/${cs}`) ?? 0) + 1)
  }
  const bigEnough = (kc) => catCountry.get(kc) >= MIN_INDEXED_COUNTRY_PAGE
  const withProfiles = new Set(companies.flatMap((c) => c.categories))
  const routes = [
    ...STATIC_ROUTES,
    // Industries with no profiles yet are thin pages: they are published (noindex) but not listed here.
    ...cats.filter((k) => withProfiles.has(k)).map((k) => `/category/${k}`),
    ...[...countries.keys()].sort().map((c) => `/country/${c}`),
    ...[...catCountry.keys()].filter(bigEnough).sort().map((kc) => `/category/${kc}`),
    ...companies.map((c) => `/company/${c.slug}`)
  ]
  const thin = [
    ...cats.filter((k) => !withProfiles.has(k)).map((k) => `/category/${k}`),
    ...[...catCountry.keys()].filter((kc) => !bigEnough(kc)).sort().map((kc) => `/category/${kc}`)
  ]
  return { routes, thin, shells: SHELL_ROUTES, counts: { companies: companies.length, categories: cats.filter((k) => withProfiles.has(k)).length, countries: countries.size, categoryCountry: [...catCountry.keys()].filter(bigEnough).length } }
}
