#!/usr/bin/env node
/** Generates public/sitemap.xml and public/robots.txt from the taxonomy and synced company data. */
import { readFile, writeFile } from 'node:fs/promises'

const SITE = 'https://marketplayace.com'
const companies = JSON.parse(await readFile(new URL('../src/data/generated/companies.json', import.meta.url))).companies
const taxonomySrc = await readFile(new URL('../src/data/taxonomy.ts', import.meta.url), 'utf8')
const categorySlugs = [...taxonomySrc.matchAll(/^\s*\['([a-z0-9-]+)', '/gm)].map((m) => m[1])
const today = new Date().toISOString().slice(0, 10)

const urls = [
  ['/', 'weekly', '1.0'],
  ['/categories', 'weekly', '0.8'],
  ['/methodology', 'monthly', '0.5'],
  ['/about', 'monthly', '0.4'],
  ['/privacy', 'yearly', '0.2'],
  ['/terms', 'yearly', '0.2'],
  ...categorySlugs.map((s) => [`/category/${s}`, 'weekly', '0.6']),
  ...companies.map((c) => [`/company/${c.slug}`, 'weekly', '0.7'])
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([p, f, pr]) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml)
await writeFile(new URL('../public/robots.txt', import.meta.url), `User-agent: *\nAllow: /\nDisallow: /labs\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap: ${urls.length} URLs (${categorySlugs.length} categories, ${companies.length} companies)`)
