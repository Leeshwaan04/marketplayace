import { createContext, useContext, useEffect } from 'react'
import { MANAGED_KEYS, SITE_NAME, seoTags, type TagSpec } from './seoTags'

interface SeoOptions {
  title: string
  description: string
  /** Canonical path, or null for pages that must not declare one. */
  path: string | null
  /** schema.org JSON-LD object(s) for this page */
  jsonLd?: object | object[]
  noindex?: boolean
}

export type SeoData = SeoOptions & { fullTitle: string }

/** Provided only during prerender: receives each page's SEO data so the script can write the <head>. */
export const SeoSinkContext = createContext<((seo: SeoData) => void) | null>(null)

const fullTitle = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)

function selectorFor(t: TagSpec): string {
  if (t.tag === 'link') return `link[rel="${t.attrs.rel}"]`
  const [kind, name] = t.key.split(/:(.*)/s) as ['name' | 'property', string]
  return `meta[${kind}="${name}"]`
}

function upsert(t: TagSpec) {
  let el = document.head.querySelector<HTMLElement>(selectorFor(t))
  if (!el) {
    el = document.createElement(t.tag)
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v)
}

/** Per-route title, description, canonical, Open Graph, Twitter card and structured data. */
export function useSeo(options: SeoOptions) {
  const { title, description, path, jsonLd, noindex } = options
  const sink = useContext(SeoSinkContext)
  sink?.({ ...options, fullTitle: fullTitle(title) })
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const full = fullTitle(title)
    document.title = full
    const tags = seoTags({ fullTitle: full, description, path, noindex })
    const present = new Set(tags.map((t) => t.key))
    for (const t of tags) upsert(t)
    // Remove tags the new page does not declare (for example the canonical on a 404).
    for (const key of MANAGED_KEYS) {
      if (present.has(key)) continue
      const t: TagSpec = key.startsWith('link:') ? { tag: 'link', key, attrs: { rel: key.slice(5) } } : { tag: 'meta', key, attrs: {} }
      document.head.querySelector(selectorFor(t))?.remove()
    }

    let script = document.getElementById('page-jsonld') as HTMLScriptElement | null
    if (ld) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'page-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = ld
    } else {
      script?.remove()
    }
  }, [title, description, path, ld, noindex])
}
