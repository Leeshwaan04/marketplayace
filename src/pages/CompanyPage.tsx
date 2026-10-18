import React from 'react'
import { ExternalLink, Clock } from 'lucide-react'
import { Container, Breadcrumbs, CompanyCard, SectionTitle } from '../components/ui'
import { CompanyLogo } from '../components/CompanyLogo'
import { Link } from '../utils/nav'
import { companyLite, companiesInCategory, titleName, MIN_INDEXED_FACTS, countrySlug, formatMoney, type Company, type Sourced } from '../data/companies'
import { useCompanyDetails } from '../data/useCompanyDetails'
import { categoryBySlug } from '../data/taxonomy'
import { useSeo } from '../utils/seo'
import { SITE } from '../config/site'
import { NotFoundPage } from './NotFoundPage'

/** Meta description: skip placeholder descriptions like "company", never end mid-word or with a doubled period. */
function companyDescription(c: Company): string {
  const raw = (c.description?.value ?? '').trim().replace(/\.+$/, '')
  const useful = raw.length >= 15 && !/^(public |private )?company$/i.test(raw)
  const head = useful ? `${c.name}, ${raw}.` : `${c.name}.`
  const tail = ' Sourced facts including founding, headquarters and financials, each with its source and retrieval date.'
  const full = head + tail
  if (full.length <= 300) return full
  const room = 300 - tail.length - 1
  const cut = head.slice(0, room).replace(/\s+\S*$/, '').replace(/[,;:.\s]+$/, '')
  return `${cut}.${tail}`
}

/** Years since an `asOf` string like '2017-12' or '2024'; null if unknown. */
const ageYears = (asOf: string | null) => {
  const y = asOf ? Number(asOf.match(/(?:19|20)\d{2}/g)?.slice(-1)[0]) : NaN
  return Number.isFinite(y) ? new Date().getFullYear() - y : null
}

const Row: React.FC<{ label: string; fact: Sourced<unknown> | null; render: () => React.ReactNode; asOf?: string | null }> = ({
  label,
  fact,
  render,
  asOf = null
}) => {
  const stale = (ageYears(asOf) ?? 0) >= 3
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-sm text-white">
        {fact ? (
          <>
            <span>{render()}</span>
            {asOf && (
              <span className={`ml-2 inline-flex items-center gap-1 text-xs ${stale ? 'text-reward' : 'text-ink-faint'}`}>
                {stale && <Clock className="h-3 w-3" aria-hidden />}
                as of {asOf}{stale ? ' (may be out of date)' : ''}
              </span>
            )}
            <a
              href={fact.source}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-ink-faint underline-offset-2 hover:text-accent hover:underline"
              aria-label={`Source for ${label}: ${fact.provider}`}
            >
              {fact.provider}
            </a>
          </>
        ) : (
          <span className="text-ink-faint">Not available. No verified source yet.</span>
        )}
      </dd>
    </div>
  )
}

const orgJsonLd = (c: Company) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: c.name,
  ...(c.description ? { description: c.description.value } : {}),
  ...(c.website ? { url: c.website.value } : {}),
  ...(c.founded ? { foundingDate: String(c.founded.value) } : {}),
  ...(c.headquarters ? { location: c.headquarters.value } : {}),
  ...(c.founders ? { founder: c.founders.value.map((name) => ({ '@type': 'Person', name })) } : {}),
  ...(c.listings?.value[0] ? { tickerSymbol: `${c.listings.value[0].exchange ?? ''} ${c.listings.value[0].symbol}`.trim() } : {}),
  ...(c.logo?.usable && c.logo.path ? { logo: SITE.url + c.logo.path } : {}),
  sameAs: [`https://www.wikidata.org/wiki/${c.wikidataId}`, c.wikipedia].filter(Boolean)
})

export const CompanyPage: React.FC<{ slug: string }> = ({ slug }) => {
  const lite = companyLite(slug)
  const { details, loading, failed } = useCompanyDetails(lite ? [slug] : [])
  const company = details[0] ?? null
  const primary = lite ? categoryBySlug(lite.categories[0]) : null

  useSeo({
    title: lite ? `${titleName(lite)}: company profile and facts` : 'Company not found',
    description: company
      ? companyDescription(company)
      : lite
        ? `${lite.name}. Company profile with sourced facts, each with its source and retrieval date.`
        : 'This company profile does not exist.',
    path: `/company/${slug}`,
    // Quality gate: a profile with too few verified facts is published for people but not offered to search engines.
    noindex: !lite || lite.facts < MIN_INDEXED_FACTS,
    jsonLd: company
      ? [
          orgJsonLd(company),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
              ...(primary ? [{ '@type': 'ListItem', position: 2, name: primary.name, item: `${SITE.url}/category/${primary.slug}` }] : []),
              { '@type': 'ListItem', position: primary ? 3 : 2, name: company.name }
            ]
          }
        ]
      : undefined
  })

  if (!lite) return <NotFoundPage />
  if (!company) {
    return (
      <Container className="pb-16 pt-8">
        <Breadcrumbs items={[{ label: 'Home', to: { page: 'home' } }, ...(primary ? [{ label: primary.name, to: { page: 'category', slug: primary.slug } as const }] : []), { label: lite.name }]} />
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <CompanyLogo name={lite.name} src={lite.logo} size="xl" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{lite.name}</h1>
        </header>
        <p className="mt-8 text-sm text-ink-muted" role="status">
          {failed ? 'We could not load this profile. Check your connection and reload the page.' : loading ? 'Loading profile…' : ''}
        </p>
      </Container>
    )
  }
  const c = company
  const countryName = c.country?.value ?? null
  const peers = primary
    ? (() => {
        // Same industry first and, when we can, same country, then the most notable of the rest.
        const all = companiesInCategory(primary.slug).filter((x) => x.slug !== c.slug)
        const near = all.filter((x) => x.country === lite.country)
        return [...near, ...all.filter((x) => !near.includes(x))].slice(0, 6)
      })()
    : []
  const hasFinancials = c.revenue || c.netIncome || c.marketCap

  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: { page: 'home' } },
          ...(primary ? [{ label: primary.name, to: { page: 'category', slug: primary.slug } as const }] : []),
          { label: c.name }
        ]}
      />

      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <CompanyLogo name={c.name} src={c.logo?.usable ? c.logo.path : null} size="xl" />
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{c.name}</h1>
          {c.description && <p className="mt-2 max-w-2xl text-ink-muted first-letter:uppercase">{c.description.value}</p>}
          {c.dataNote && <p className="mt-2 max-w-2xl text-sm text-ink-faint">Note: {c.dataNote}</p>}
          {c.discovery === 'query' && (
            <p className="mt-2 max-w-2xl text-sm text-ink-faint">
              This profile was added automatically by an industry match on open data. Its facts have not been individually checked by us.
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {c.categories.map((s) => {
              const k = categoryBySlug(s)
              return k ? (
                <Link key={s} to={{ page: 'category', slug: s }} className="rounded-full border border-line bg-surface-1 px-3 py-1 text-xs text-ink hover:border-line-strong">
                  {k.name}
                </Link>
              ) : null
            })}
            {countryName && (
              <Link to={{ page: 'country', slug: countrySlug(countryName) }} className="rounded-full border border-line bg-surface-1 px-3 py-1 text-xs text-ink hover:border-line-strong">
                {countryName}
              </Link>
            )}
            <Link to={{ page: 'compare', slugs: [c.slug] }} className="text-sm text-accent hover:underline">Compare</Link>
            {c.website && (
              <a href={c.website.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                Official website <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section aria-labelledby="glance">
            <SectionTitle id="glance" title="At a glance" />
            <dl className="surface-card divide-y divide-line px-5">
              <Row label="Founded" fact={c.founded} render={() => c.founded!.value} />
              <Row label="Headquarters" fact={c.headquarters} render={() => [c.headquarters!.value, c.country?.value].filter(Boolean).join(', ')} />
              <Row label="Founders" fact={c.founders} render={() => c.founders!.value.join(', ')} />
              {c.parent && <Row label="Parent company" fact={c.parent} render={() => c.parent!.value} />}
              <Row label="Industries" fact={c.industries} render={() => <span className="first-letter:uppercase">{c.industries!.value.join(', ')}</span>} />
              <Row
                label="Stock listing"
                fact={c.listings}
                render={() => c.listings!.value.map((l) => `${l.exchange ?? 'Exchange'}: ${l.symbol}`).join(' · ')}
              />
              <Row
                label="Employees"
                fact={c.employees}
                asOf={c.employees?.value.asOf}
                render={() => c.employees!.value.amount.toLocaleString('en')}
              />
            </dl>
          </section>

          <section aria-labelledby="fin">
            <SectionTitle
              id="fin"
              title="Financials"
              hint="Figures as published in open data for the period shown. They are not live and are not investment advice."
            />
            {hasFinancials ? (
              <dl className="surface-card divide-y divide-line px-5">
                <Row label="Revenue" fact={c.revenue} asOf={c.revenue?.value.asOf} render={() => formatMoney(c.revenue!.value)} />
                <Row label="Net income" fact={c.netIncome} asOf={c.netIncome?.value.asOf} render={() => formatMoney(c.netIncome!.value)} />
                <Row label="Market capitalisation" fact={c.marketCap} asOf={c.marketCap?.value.asOf} render={() => formatMoney(c.marketCap!.value)} />
              </dl>
            ) : (
              <div className="surface-card p-5 text-sm text-ink-muted">
                We have no verified financial figures for {c.name} yet. We add them from regulatory filings or annual reports,
                with the period and a link to the document.
              </div>
            )}
          </section>

          <section aria-labelledby="coming" className="rounded-2xl border border-dashed border-line-strong p-5">
            <h2 id="coming" className="font-bold text-white">Not covered yet</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Business model, products, competitors, market trends and news are still being researched for this profile. We
              publish them only with named sources, never as unsourced summaries.
            </p>
          </section>

          {peers.length > 0 && primary && (
            <section aria-labelledby="peers">
              <SectionTitle
                id="peers"
                title={`Also profiled in ${primary.name}`}
                hint="Companies in the same industry. Listing here does not mean they compete directly."
              />
              <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
                {peers.map((p) => <CompanyCard key={p.slug} company={p} />)}
              </div>
            </section>
          )}
        </div>

        <aside aria-labelledby="sources" className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="surface-card p-5">
            <h2 id="sources" className="font-bold text-white">Sources and data</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <a href={`https://www.wikidata.org/wiki/${c.wikidataId}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Wikidata entry {c.wikidataId}
                </a>
              </li>
              {c.wikipedia && (
                <li>
                  <a href={c.wikipedia} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Wikipedia article</a>
                </li>
              )}
              {c.website && (
                <li>
                  <a href={c.website.value} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Company website</a>
                </li>
              )}
            </ul>
            <p className="mt-3 text-xs text-ink-faint">
              Retrieved {c.description?.retrievedAt ?? c.founded?.retrievedAt ?? 'recently'}. Wikidata is open data
              under CC0 and is community-maintained: facts credited to Wikidata have not been individually checked by us and can be wrong. Where a US filing exists, we use the SEC record instead. See our{' '}
              <Link to={{ page: 'methodology' }} className="underline hover:text-accent">methodology</Link>.
            </p>
            {SITE.contactEmail && (
              <p className="mt-3 text-sm">
                <a href={`mailto:${SITE.contactEmail}?subject=Correction: ${encodeURIComponent(c.name)}`} className="text-accent hover:underline">
                  Report a correction
                </a>
              </p>
            )}
          </div>

          <div className="surface-card p-5 text-xs leading-relaxed text-ink-faint">
            <h3 className="mb-1 text-sm font-semibold text-ink-muted">Trademarks</h3>
            {c.logo?.usable
              ? `Logo from Wikimedia Commons under ${c.logo.license ?? 'a free licence'}${c.logo.author ? `, by ${c.logo.author}` : ''}. `
              : 'No freely licensed logo is available, so a monogram is shown. '}
            {c.name} and its marks belong to their owners. Marketplayace is not affiliated with, endorsed by or paid by {c.name}.
            {c.logo?.commonsPage && c.logo.usable && (
              <>
                {' '}
                <a href={c.logo.commonsPage} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">File details</a>.
              </>
            )}
          </div>
        </aside>
      </div>
    </Container>
  )
}
