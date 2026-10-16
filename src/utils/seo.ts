import { createContext, useContext, useEffect } from 'react'

const SITE = 'https://marketplayace.com'
const SITE_NAME = 'Marketplayace'

interface SeoOptions {
  title: string
  description: string
  path: string
  /** schema.org JSON-LD object(s) for this page */
  jsonLd?: object | object[]
  noindex?: boolean
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

export type SeoData = SeoOptions & { fullTitle: string }

/** Provided only during prerender: receives each page's SEO data so the script can write the <head>. */
export const SeoSinkContext = createContext<((seo: SeoData) => void) | null>(null)

export const fullTitle = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)

/** Per-route title, description, canonical, Open Graph and structured data. */
export function useSeo(options: SeoOptions) {
  const { title, description, path, jsonLd, noindex } = options
  const sink = useContext(SeoSinkContext)
  sink?.({ ...options, fullTitle: fullTitle(title) })
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const full = fullTitle(title)
    document.title = full
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', full)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', SITE + path)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = SITE + path

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
