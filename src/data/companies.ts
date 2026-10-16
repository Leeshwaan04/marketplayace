import generated from './generated/companies.json'

export interface Sourced<T> {
  value: T
  /** Human-readable name of the source, e.g. 'Wikidata' or 'SEC EDGAR 10-K'. */
  provider: string
  source: string
  retrievedAt: string
}

export interface Money {
  amount: number
  currency: string | null
  asOf: string | null
}

export interface Logo {
  usable: boolean
  path: string | null
  license: string | null
  licenseUrl: string | null
  author: string | null
  commonsPage: string
}

export interface Company {
  slug: string
  wikidataId: string
  name: string
  description: Sourced<string> | null
  founded: Sourced<number> | null
  headquarters: Sourced<string> | null
  country: Sourced<string> | null
  industries: Sourced<string[]> | null
  founders: Sourced<string[]> | null
  parent: Sourced<string> | null
  website: Sourced<string> | null
  listings: Sourced<{ exchange: string | null; symbol: string }[]> | null
  employees: Sourced<{ amount: number; asOf: string | null }> | null
  revenue: Sourced<Money> | null
  netIncome: Sourced<Money> | null
  marketCap: Sourced<Money> | null
  logo: Logo | null
  categories: string[]
  wikipedia: string | null
  dataNote: string | null
}

export const DATA_GENERATED_AT: string = generated.generatedAt
export const COMPANIES = generated.companies as unknown as Company[]

export const companyBySlug = (slug: string) => COMPANIES.find((c) => c.slug === slug) ?? null
export const companiesInCategory = (slug: string) => COMPANIES.filter((c) => c.categories.includes(slug))
export const countries = () =>
  [...new Set(COMPANIES.map((c) => c.country?.value).filter((x): x is string => !!x))].sort()

/** Compact currency formatting that never implies precision we don't have. */
export function formatMoney(m: Money): string {
  const abs = Math.abs(m.amount)
  const sym = m.currency ? `${m.currency} ` : ''
  const unit = abs >= 1e12 ? [1e12, 'trillion'] : abs >= 1e9 ? [1e9, 'billion'] : abs >= 1e6 ? [1e6, 'million'] : [1, '']
  const n = m.amount / (unit[0] as number)
  return `${sym}${n.toLocaleString('en', { maximumFractionDigits: n >= 100 ? 0 : 1 })}${unit[1] ? ' ' + unit[1] : ''}`
}

export function searchCompanies(q: string, limit = 8): Company[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  return COMPANIES.filter(
    (c) => c.name.toLowerCase().includes(needle) || c.slug.includes(needle.replace(/\s+/g, '-'))
  )
    .sort((a, b) => Number(b.name.toLowerCase().startsWith(needle)) - Number(a.name.toLowerCase().startsWith(needle)))
    .slice(0, limit)
}
