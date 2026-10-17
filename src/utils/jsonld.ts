import { SITE } from './seoTags'

export interface Crumb {
  name: string
  /** Path starting with "/". Omit on the last crumb (the current page). */
  path?: string
}

export const breadcrumbList = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    ...(c.path ? { item: SITE + c.path } : {})
  }))
})

/** A list page (industry, country, ...) with its first entries, so search engines understand what it collects. */
export const collectionPage = (opts: { name: string; path: string; description: string; items: { name: string; path: string }[]; limit?: number }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: opts.name,
  url: SITE + opts.path,
  description: opts.description,
  isPartOf: { '@type': 'WebSite', name: 'Marketplayace', url: SITE },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: opts.items.length,
    itemListElement: opts.items.slice(0, opts.limit ?? 50).map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: SITE + it.path
    }))
  }
})

export const websiteAndPublisher = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Marketplayace',
    url: SITE,
    description: 'Company and brand profiles where every fact shows its source and retrieval date.'
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Marketplayace',
    url: SITE,
    logo: `${SITE}/favicon.svg`
  }
]
