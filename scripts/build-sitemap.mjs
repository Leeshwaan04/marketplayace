#!/usr/bin/env node
/**
 * Generates public/sitemap.xml and public/robots.txt from the same route list the prerender uses.
 * Labs and Compare are kept out of the index with a noindex tag, NOT with robots.txt: a crawler that is
 * blocked from a page can never see its noindex, so the URL could still appear in results.
 */
import { writeFile } from 'node:fs/promises'
import { listRoutes } from './lib/routes.mjs'
import { readIndex } from './lib/data.mjs'

const SITE = 'https://marketplayace.com'
const { routes, counts } = await listRoutes()
const today = new Date().toISOString().slice(0, 10)
// Pages built from company data are only as fresh as the last data sync; claiming "today" for them would be untrue.
const dataDate = (await readIndex()).generatedAt
const lastmod = (r) => (['/', '/categories', '/countries'].includes(r) || r.startsWith('/company/') || r.startsWith('/category/') || r.startsWith('/country/') ? dataDate : today)

const priority = (r) => (r === '/' ? ['weekly', '1.0'] : r === '/categories' || r === '/countries' ? ['weekly', '0.8'] : r.startsWith('/company/') ? ['weekly', '0.7'] : r.startsWith('/category/') || r.startsWith('/country/') ? ['weekly', '0.6'] : ['monthly', '0.4'])

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => { const [f, p] = priority(r); return `  <url><loc>${SITE}${r}</loc><lastmod>${lastmod(r)}</lastmod><changefreq>${f}</changefreq><priority>${p}</priority></url>` }).join('\n')}
</urlset>
`
if (routes.length > 50000) throw new Error('sitemap exceeds 50,000 URLs: split it into several files')
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml)
await writeFile(new URL('../public/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nDisallow: /data/\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap: ${routes.length} URLs (${counts.categories} industries, ${counts.countries} countries, ${counts.categoryCountry} industry-by-country, ${counts.companies} companies)`)
