import React from 'react'
import { X } from 'lucide-react'
import { Container, Breadcrumbs } from '../components/ui'
import { CompanyLogo } from '../components/CompanyLogo'
import { Link } from '../utils/nav'
import { useNavigate } from '../utils/navContext'
import { companyLite, formatMoney, type Company, type Sourced } from '../data/companies'
import { useCompanyDetails } from '../data/useCompanyDetails'
import { SearchBox } from '../components/SearchBox'
import { useSeo } from '../utils/seo'

interface Row {
  label: string
  get: (c: Company) => Sourced<unknown> | null
  show: (c: Company) => string
  asOf?: (c: Company) => string | null
}

const ROWS: Row[] = [
  { label: 'Founded', get: (c) => c.founded, show: (c) => String(c.founded?.value) },
  { label: 'Headquarters', get: (c) => c.headquarters, show: (c) => c.headquarters!.value },
  { label: 'Founders', get: (c) => c.founders, show: (c) => c.founders!.value.join(', ') },
  { label: 'Stock listing', get: (c) => c.listings, show: (c) => c.listings!.value.map((l) => `${l.exchange ?? ''} ${l.symbol}`.trim()).join(', ') },
  { label: 'Employees', get: (c) => c.employees, show: (c) => c.employees!.value.amount.toLocaleString('en'), asOf: (c) => c.employees?.value.asOf ?? null },
  { label: 'Revenue', get: (c) => c.revenue, show: (c) => formatMoney(c.revenue!.value), asOf: (c) => c.revenue?.value.asOf ?? null },
  { label: 'Net income', get: (c) => c.netIncome, show: (c) => formatMoney(c.netIncome!.value), asOf: (c) => c.netIncome?.value.asOf ?? null },
  { label: 'Market capitalisation', get: (c) => c.marketCap, show: (c) => formatMoney(c.marketCap!.value), asOf: (c) => c.marketCap?.value.asOf ?? null }
]

export const ComparePage: React.FC<{ slugs: string[] }> = ({ slugs }) => {
  const navigate = useNavigate()
  const valid = slugs.filter((s) => companyLite(s))
  const { details, loading } = useCompanyDetails(valid)
  const selected = details.filter((c): c is Company => !!c)
  const set = (next: string[]) => navigate({ page: 'compare', slugs: next })

  useSeo({
    title: selected.length ? `Compare ${selected.map((c) => c.name).join(' vs ')}` : 'Compare companies',
    description: 'Side-by-side comparison of sourced company facts. Figures use different periods and sources, shown next to each value.',
    path: '/compare',
    noindex: true
  })

  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs items={[{ label: 'Home', to: { page: 'home' } }, { label: 'Compare' }]} />
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Compare companies</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Pick up to three. Values show their own period and source, so figures from different dates are not directly
        comparable. We do not rank or score companies.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {valid.map((slug) => {
          const l = companyLite(slug)!
          return (
            <span key={slug} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-1 py-1 pl-1.5 pr-2 text-sm text-white">
              <CompanyLogo name={l.name} src={l.logo} size="sm" className="!h-6 !w-6 !rounded-full !text-[10px]" />
              {l.name}
              <button type="button" aria-label={`Remove ${l.name}`} onClick={() => set(valid.filter((s) => s !== slug))} className="rounded-full p-0.5 text-ink-muted hover:bg-surface-3 hover:text-white">
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </span>
          )
        })}
        {valid.length < 3 && (
          <SearchBox
            className="w-72"
            placeholder="Add a company…"
            label="Add a company to compare"
            onPickCompany={(slug) => !valid.includes(slug) && set([...valid, slug])}
          />
        )}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink-muted" role="status">Loading…</p>
      ) : selected.length < 2 ? (
        <div className="surface-card mt-8 p-6 text-sm text-ink-muted">Choose at least two companies to see them side by side.</div>
      ) : (
        <div className="surface-card mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Comparison of {selected.map((c) => c.name).join(', ')}</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-44 p-4 font-medium text-ink-muted">Fact</th>
                {selected.map((c) => (
                  <th key={c.slug} scope="col" className="p-4">
                    <Link to={{ page: 'company', slug: c.slug }} className="flex items-center gap-3 text-white hover:text-violet-300">
                      <CompanyLogo name={c.name} src={c.logo?.usable ? c.logo.path : null} size="sm" />
                      <span className="font-bold">{c.name}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="p-4 align-top font-medium text-ink-muted">{r.label}</th>
                  {selected.map((c) => {
                    const fact = r.get(c)
                    return (
                      <td key={c.slug} className="p-4 align-top text-white">
                        {fact ? (
                          <>
                            <div>{r.show(c)}</div>
                            <div className="mt-0.5 text-xs text-ink-faint">
                              {r.asOf?.(c) ? `${r.asOf(c)} · ` : ''}
                              <a href={fact.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-accent hover:underline">{fact.provider}</a>
                            </div>
                          </>
                        ) : (
                          <span className="text-ink-faint">Not available</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}
