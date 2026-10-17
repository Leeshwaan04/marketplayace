/**
 * The single list of pages the site publishes. Used by the prerender, the sitemap and the tests so they cannot drift.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { readIndex, countrySlug } from './data.mjs'

const root = new URL('../../', import.meta.url).pathname

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
  const catCountry = new Set()
  for (const c of companies) {
    if (!c.country) continue
    const cs = countrySlug(c.country)
    countries.set(cs, (countries.get(cs) ?? 0) + 1)
    for (const k of c.categories) catCountry.add(`${k}/${cs}`)
  }
  const routes = [
    ...STATIC_ROUTES,
    ...cats.map((k) => `/category/${k}`),
    ...[...countries.keys()].sort().map((c) => `/country/${c}`),
    ...[...catCountry].sort().map((kc) => `/category/${kc}`),
    ...companies.map((c) => `/company/${c.slug}`)
  ]
  return { routes, shells: SHELL_ROUTES, counts: { companies: companies.length, categories: cats.length, countries: countries.size, categoryCountry: catCountry.size } }
}
