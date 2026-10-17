#!/usr/bin/env node
/**
 * Static prerender. Run after `vite build` (client) and `vite build --config vite.ssr.config.ts` (server).
 *
 * For every indexable page it renders the real React app to HTML and writes dist/<route>.html (served at the clean URL by Cloudflare) with the
 * page's own <title>, description, canonical, Open Graph tags and JSON-LD, so crawlers and link previews get
 * full content without running JavaScript. The browser then hydrates the same markup.
 *
 * Shell pages (Labs, Compare) are not indexable; they get the empty app shell with correct meta so direct
 * visits work. Unknown URLs get a real 404 via dist/404.html.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { readAllCompanies } from './lib/data.mjs'
import { listRoutes } from './lib/routes.mjs'

const root = new URL('..', import.meta.url).pathname
const dist = path.join(root, 'dist')

const serverModule = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href)
const render = Object.assign((url) => serverModule.render(url), { setDetailProvider: serverModule.setDetailProvider })
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html is not the untouched client shell (run vite build first)')

// Full records are read from the shards on disk (the browser fetches the same files on demand).
const details = new Map((await readAllCompanies()).map((c) => [c.slug, c]))
render.setDetailProvider((slug) => details.get(slug) ?? null)
const { routes, thin, shells: shellRoutes, counts } = await listRoutes()
console.log(`routes: ${routes.length} pages + ${thin.length} thin (noindex) (${counts.companies} companies, ${counts.categories} industries, ${counts.countries} countries, ${counts.categoryCountry} industry-by-country)`)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function headTags(seo) {
  // Meta, canonical and social tags come from the same definition the browser uses (src/utils/seoTags.ts).
  const parts = [serverModule.renderHead(seo)]
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    parts.push(`<script id="page-jsonld" type="application/ld+json">${json}</script>`)
  }
  return parts.join('\n    ')
}

function inject(seo, bodyHtml, route) {
  // Replacement FUNCTIONS, not strings: a string replacement would interpret "$&", "$1", "$$" inside
  // company text or rendered HTML as special patterns and corrupt the page.
  const attr = route === null ? '' : ` data-route="${esc(route)}"`
  return template
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(seo.fullTitle)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/, () => '')
    .replace('</head>', () => `    ${headTags(seo)}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root"${attr}>${bodyHtml}</div>`)
}

async function write(file, html) {
  const full = path.join(dist, file)
  await mkdir(path.dirname(full), { recursive: true })
  await writeFile(full, html)
}

let pages = 0
const problems = []

// Fully prerendered, indexable pages
const titles = new Map()
for (const url of routes) {
  const { html, seo } = render(url)
  if (!seo) { problems.push(`${url}: no SEO data captured`); continue }
  if (!/<h1[ >]/.test(html)) problems.push(`${url}: no <h1> in rendered HTML`)
  if (seo.noindex) problems.push(`${url}: unexpectedly noindex (route listed but page says it does not exist)`)
  if (titles.has(seo.fullTitle)) problems.push(`${url}: duplicate title with ${titles.get(seo.fullTitle)}: ${seo.fullTitle}`)
  titles.set(seo.fullTitle, url)
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`
  await write(file, inject(seo, html, url))
  pages++
}

// Thin pages (industries with no profiles yet): published so links work, but kept out of the index and sitemap.
for (const url of thin) {
  const { html, seo } = render(url)
  if (!seo || !seo.noindex) { problems.push(`${url}: thin page must be noindex`); continue }
  await write(`${url.slice(1)}.html`, inject(seo, html, url))
  pages++
}

// Shell pages: not indexable, but must resolve (no 404) and carry correct meta.
for (const url of shellRoutes) {
  const title = url.startsWith('/labs') ? 'Labs: shopping experiments with sample listings' : 'Compare companies'
  const seo = { title, fullTitle: `${title} | Marketplayace`, description: 'Interactive page. Content loads in the browser.', path: url, noindex: true }
  await write(`${url.slice(1)}.html`, inject(seo, '', null))
  pages++
}

// Real 404 for unknown URLs
{
  const { html } = render('/__not-found__')
  const seo = { title: 'Page not found', fullTitle: 'Page not found | Marketplayace', description: 'This page does not exist.', path: null, noindex: true }
  await write('404.html', inject(seo, html, null))
}

if (problems.length) {
  console.error('Prerender problems:\n  ' + problems.join('\n  '))
  process.exit(1)
}
console.log(`prerendered ${pages} pages + 404.html`)
