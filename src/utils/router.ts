import { useCallback, useEffect, useState } from 'react'

export type LabsTab = 'floor' | 'vault' | 'squad' | 'studio'

export type Route =
  | { page: 'home' }
  | { page: 'categories' }
  | { page: 'category'; slug: string }
  | { page: 'company'; slug: string }
  | { page: 'methodology' }
  | { page: 'about' }
  | { page: 'privacy' }
  | { page: 'labs'; tab: LabsTab }
  | { page: 'not-found' }

const LABS_TABS: LabsTab[] = ['floor', 'vault', 'squad', 'studio']

export function parsePath(pathname: string): Route {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent)
  const [a, b] = parts
  if (!a) return { page: 'home' }
  if (a === 'categories' && !b) return { page: 'categories' }
  if (a === 'category' && b) return { page: 'category', slug: b }
  if (a === 'company' && b) return { page: 'company', slug: b }
  if (a === 'methodology' || a === 'about' || a === 'privacy') return { page: a }
  if (a === 'labs') return { page: 'labs', tab: LABS_TABS.includes(b as LabsTab) ? (b as LabsTab) : 'floor' }
  return { page: 'not-found' }
}

export function buildPath(route: Route): string {
  switch (route.page) {
    case 'home': return '/'
    case 'categories': return '/categories'
    case 'category': return `/category/${encodeURIComponent(route.slug)}`
    case 'company': return `/company/${encodeURIComponent(route.slug)}`
    case 'labs': return route.tab === 'floor' ? '/labs' : `/labs/${route.tab}`
    case 'not-found': return '/'
    default: return `/${route.page}`
  }
}

/** Minimal History API router. Works with the SPA fallback in public/_redirects. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname))

  useEffect(() => {
    const onPop = () => {
      setRoute(parsePath(window.location.pathname))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((next: Route) => {
    const path = buildPath(next)
    if (path !== window.location.pathname) window.history.pushState(null, '', path)
    setRoute(next)
    window.scrollTo({ top: 0 })
  }, [])

  return { route, navigate }
}
