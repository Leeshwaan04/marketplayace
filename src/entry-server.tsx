import { renderToString } from 'react-dom/server'
import App from './App'
import { SeoSinkContext, type SeoData } from './utils/seo'
import { seoTags, tagsToHtml } from './utils/seoTags'
import { detailProvider, type Company } from './data/companies'

/** Lets the prerender script supply full company records read from disk. */
export function setDetailProvider(read: (slug: string) => Company | null) {
  detailProvider.sync = read
}

/** Renders one URL to HTML plus the metadata its <head> needs. Used only by scripts/prerender.mjs. */
export function render(url: string): { html: string; seo: SeoData | null } {
  let seo: SeoData | null = null
  const html = renderToString(
    <SeoSinkContext.Provider value={(data) => { seo = data }}>
      <App url={url} />
    </SeoSinkContext.Provider>
  )
  return { html, seo }
}

/** The <head> tags for a page, from the same definition the browser uses. */
export function renderHead(seo: SeoData): string {
  return tagsToHtml(seoTags({ fullTitle: seo.fullTitle, description: seo.description, path: seo.path, noindex: seo.noindex }))
}
