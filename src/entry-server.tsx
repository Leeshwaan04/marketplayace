import { renderToString } from 'react-dom/server'
import App from './App'
import { SeoSinkContext, type SeoData } from './utils/seo'
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
