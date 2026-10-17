import { useCallback, useEffect, useState } from 'react'

export type LabsTab = 'floor' | 'vault' | 'squad' | 'studio'

export type Route =
  | { page: 'home' }
  | { page: 'categories' }
  | { page: 'category'; slug: string; country?: string }
  | { page: 'countries' }
  | { page: 'country'; slug: string }
  | { page: 'company'; slug: string }
  | { page: 'methodology' }
  | { page: 'about' }
  | { page: 'privacy' }
  | { page: 'terms' }
  | { page: 'compare'; slugs: string[] }
  | { page: 'labs'; tab: LabsTab }
  | { page: 'not-found' }

const LABS_TABS: LabsTab[] = ['floor', 'vault', 'squad', 'studio']

export function parsePath(pathname: string, search = ''): Route {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent)
  const [a, b] = parts
  if (!a) return { page: 'home' }
  if (a === 'categories' && !b) return { page: 'categories' }
  if (a === 'category' && b) return { page: 'category', slug: b, country: parts[2] }
  if (a === 'countries' && !b) return { page: 'countries' }
  if (a === 'country' && b) return { page: 'country', slug: b }
  if (a === 'company' && b) return { page: 'company', slug: b }
  if (a === 'compare' && !b) {
    const slugs = (new URLSearchParams(search).get('c') ?? '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 3)
    return { page: 'compare', slugs }
  }
  if (a === 'methodology' || a === 'about' || a === 'privacy' || a === 'terms') return { page: a }
  if (a === 'labs') return { page: 'labs', tab: LABS_TABS.includes(b as LabsTab) ? (b as LabsTab) : 'floor' }
  return { page: 'not-found' }
}

export function buildPath(route: Route): string {
  switch (route.page) {
    case 'home': return '/'
    case 'categories': return '/categories'
    case 'category': return `/category/${encodeURIComponent(route.slug)}${route.country ? `/${encodeURIComponent(route.country)}` : ''}`
    case 'country': return `/country/${encodeURIComponent(route.slug)}`
    case 'company': return `/company/${encodeURIComponent(route.slug)}`
    case 'compare': return route.slugs.length ? `/compare?c=${route.slugs.map(encodeURIComponent).join(',')}` : '/compare'
    case 'labs': return route.tab === 'floor' ? '/labs' : `/labs/${route.tab}`
    case 'not-found': return '/'
    default: return `/${route.page}`
  }
}

/** Minimal History API router. Works with the SPA fallback in public/_redirects. */
export function useRoute(initialUrl = '/') {
  const [route, setRoute] = useState<Route>(() => {
    if (typeof window === 'undefined') {
      // Server render and prerender: no window, so use the URL we were given.
      const u = new URL(initialUrl, 'http://localhost')
      return parsePath(u.pathname, u.search)
    }
    return parsePath(window.location.pathname, window.location.search)
  })

  useEffect(() => {
    const onPop = () => {
      setRoute(parsePath(window.location.pathname, window.location.search))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((next: Route) => {
    const path = buildPath(next)
    if (path !== window.location.pathname + window.location.search) window.history.pushState(null, '', path)
    setRoute(next)
    window.scrollTo({ top: 0 })
  }, [])

  return { route, navigate }
}
