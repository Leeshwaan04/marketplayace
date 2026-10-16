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

const root = new URL('..', import.meta.url).pathname
const dist = path.join(root, 'dist')

const { render } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html is not the untouched client shell (run vite build first)')

const companies = JSON.parse(await readFile(path.join(root, 'src/data/generated/companies.json'), 'utf8')).companies
const taxonomy = await readFile(path.join(root, 'src/data/taxonomy.ts'), 'utf8')
const categorySlugs = [...taxonomy.matchAll(/^\s*\['([a-z0-9-]+)', '/gm)].map((m) => m[1])

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const SITE = 'https://marketplayace.com'

function headTags(seo) {
  const tags = [
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${seo.noindex ? 'noindex,nofollow' : 'index,follow'}" />`,
    ...(seo.path ? [`<link rel="canonical" href="${SITE}${seo.path}" />`] : []),
    `<meta property="og:title" content="${esc(seo.fullTitle)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    ...(seo.path ? [`<meta property="og:url" content="${SITE}${seo.path}" />`] : []),
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary" />`
  ]
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    tags.push(`<script id="page-jsonld" type="application/ld+json">${json}</script>`)
  }
  return tags.join('\n    ')
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
const full = [
  '/', '/categories', '/methodology', '/about', '/privacy', '/terms',
  ...categorySlugs.map((s) => `/category/${s}`),
  ...companies.map((c) => `/company/${c.slug}`)
]
for (const url of full) {
  const { html, seo } = render(url)
  if (!seo) { problems.push(`${url}: no SEO data captured`); continue }
  if (!/<h1[ >]/.test(html)) problems.push(`${url}: no <h1> in rendered HTML`)
  if (seo.noindex) problems.push(`${url}: unexpectedly noindex`)
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`
  await write(file, inject(seo, html, url))
  pages++
}

// Shell pages: not indexable, but must resolve (no 404) and carry correct meta.
const shells = {
  '/labs': 'Labs: shopping experiments with sample listings',
  '/labs/vault': 'Labs: shopping experiments with sample listings',
  '/labs/squad': 'Labs: shopping experiments with sample listings',
  '/labs/studio': 'Labs: shopping experiments with sample listings',
  '/compare': 'Compare companies'
}
for (const [url, title] of Object.entries(shells)) {
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
