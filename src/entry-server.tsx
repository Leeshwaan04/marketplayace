import { renderToString } from 'react-dom/server'
import App from './App'
import { SeoSinkContext, type SeoData } from './utils/seo'

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
