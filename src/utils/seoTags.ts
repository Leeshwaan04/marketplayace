/**
 * The single definition of a page's <head> metadata. The browser (useSeo) and the build-time prerender
 * (scripts/prerender.mjs, via entry-server) both use it, so a crawler and a visitor always see the same tags.
 */
export const SITE = 'https://marketplayace.com'
export const SITE_NAME = 'Marketplayace'
export const DEFAULT_IMAGE = `${SITE}/og-default.jpg`
export const DEFAULT_IMAGE_ALT = 'Abstract cards of company data connected by lines of light'

export interface SeoInput {
  /** Full <title>, already including the site name. */
  fullTitle: string
  description: string
  /** Canonical path, or null when the page must not declare one (for example the 404 page). */
  path: string | null
  noindex?: boolean
}

export interface TagSpec {
  tag: 'meta' | 'link'
  /** Identifies the tag so it can be updated or removed when the page changes. */
  key: string
  attrs: Record<string, string>
}

export function seoTags({ fullTitle, description, path, noindex }: SeoInput): TagSpec[] {
  const meta = (kind: 'name' | 'property', name: string, content: string): TagSpec => ({
    tag: 'meta',
    key: `${kind}:${name}`,
    attrs: { [kind]: name, content }
  })
  const tags: TagSpec[] = [
    meta('name', 'description', description),
    meta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', 'en'),
    meta('property', 'og:title', fullTitle),
    meta('property', 'og:description', description),
    meta('property', 'og:image', DEFAULT_IMAGE),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', DEFAULT_IMAGE_ALT),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', fullTitle),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', DEFAULT_IMAGE)
  ]
  if (path) {
    tags.push({ tag: 'link', key: 'link:canonical', attrs: { rel: 'canonical', href: SITE + path } })
    tags.push(meta('property', 'og:url', SITE + path))
  }
  return tags
}

/** Every key this module can emit, so stale ones can be removed when navigating. */
export const MANAGED_KEYS = [
  'name:description', 'name:robots', 'property:og:site_name', 'property:og:type', 'property:og:locale', 'property:og:title',
  'property:og:description', 'property:og:image', 'property:og:image:width', 'property:og:image:height', 'property:og:image:alt',
  'name:twitter:card', 'name:twitter:title', 'name:twitter:description', 'name:twitter:image', 'link:canonical', 'property:og:url'
]

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** HTML for the prerender. */
export function tagsToHtml(tags: TagSpec[]): string {
  return tags.map((t) => `<${t.tag} ${Object.entries(t.attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} />`).join('\n    ')
}
