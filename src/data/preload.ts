import { loadCompanyDetails } from './companies'
import { parsePath } from '../utils/router'

/** Loads whatever full records the URL's page needs, so hydration can start with the same data the server used. */
export async function preloadForUrl(pathname: string, search: string): Promise<void> {
  const route = parsePath(pathname, search)
  try {
    if (route.page === 'company') await loadCompanyDetails([route.slug])
    else if (route.page === 'compare' && route.slugs.length) await loadCompanyDetails(route.slugs)
  } catch {
    /* the page falls back to its loading state and retries */
  }
}
