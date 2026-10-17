import { useEffect, useState } from 'react'
import { companyLite, getCompanyDetail, loadCompanyDetails, type Company } from './companies'

/**
 * Full company records for these slugs. During prerender they are available immediately; in the browser they
 * may need one small shard download, in which case `loading` is true until it arrives.
 */
export function useCompanyDetails(slugs: string[]): { details: (Company | null)[]; loading: boolean; failed: boolean } {
  const key = slugs.join(',')
  const [, setTick] = useState(0)
  const [failedKey, setFailedKey] = useState<string | null>(null)
  const details = slugs.map(getCompanyDetail)
  const missing = details.some((d, i) => !d && companyLite(slugs[i]))

  useEffect(() => {
    if (!missing) return
    let alive = true
    loadCompanyDetails(key.split(',').filter(Boolean))
      .then(() => alive && setTick((t) => t + 1))
      .catch(() => alive && setFailedKey(key))
    return () => {
      alive = false
    }
  }, [key, missing])

  return { details, loading: missing && failedKey !== key, failed: missing && failedKey === key }
}
