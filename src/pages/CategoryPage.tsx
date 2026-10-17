import React from 'react'
import { Container, Breadcrumbs, CompanyCard, SectionTitle } from '../components/ui'
import { Link } from '../utils/nav'
import { categoryBySlug, groupById, CATEGORIES } from '../data/taxonomy'
import { companiesInCategory, companiesInCategoryAndCountry, countryBySlug, countrySlug, type CompanyLite } from '../data/companies'
import { useSeo } from '../utils/seo'
import { NotFoundPage } from './NotFoundPage'

/** How many companies each country section shows on the all-countries view before linking to its own page. */
const PER_COUNTRY_PREVIEW = 12

export const CategoryPage: React.FC<{ slug: string; country?: string }> = ({ slug, country }) => {
  const category = categoryBySlug(slug)
  const countryInfo = country ? countryBySlug(country) : null
  const everyone = category ? companiesInCategory(category.slug) : []
  const list = category && country ? companiesInCategoryAndCountry(category.slug, country) : everyone
  const invalid = !category || (country !== undefined && (!countryInfo || list.length === 0))

  const title = !category
    ? 'Industry not found'
    : invalid
      ? 'Page not found'
      : countryInfo
        ? `${category.name} in ${countryInfo.name}: company profiles`
        : `${category.name}: company profiles by country`
  useSeo({
    title,
    description: !category || invalid
      ? 'This page does not exist.'
      : countryInfo
        ? `${list.length} ${category.name.toLowerCase()} companies and brands based in ${countryInfo.name}, each with sourced facts.`
        : `${category.description} ${everyone.length > 0 ? `${everyone.length} company profiles, grouped by country.` : 'Company profiles are being researched.'}`,
    path: `/category/${slug}${country ? `/${country}` : ''}`,
    noindex: invalid
  })

  if (!category || invalid) return <NotFoundPage />
  const group = groupById(category.group)
  const related = CATEGORIES.filter((c) => c.group === category.group && c.slug !== category.slug).slice(0, 8)

  // Group by country for the all-countries view
  const groups = new Map<string, { name: string; slug: string | null; items: CompanyLite[] }>()
  for (const c of everyone) {
    const key = c.country ? countrySlug(c.country) : '_none'
    const g = groups.get(key) ?? { name: c.country ?? 'Country not available', slug: c.country ? key : null, items: [] }
    g.items.push(c)
    groups.set(key, g)
  }
  const sections = [...groups.values()].sort((a, b) => (a.slug === null ? 1 : b.slug === null ? -1 : b.items.length - a.items.length || a.name.localeCompare(b.name)))

  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: { page: 'home' } },
          { label: 'Industries', to: { page: 'categories' } },
          ...(countryInfo ? [{ label: category.name, to: { page: 'category', slug: category.slug } as const }, { label: countryInfo.name }] : [{ label: category.name }])
        ]}
      />
      <p className="text-sm font-semibold text-accent">{group.name}</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {countryInfo ? `${category.name} in ${countryInfo.name}` : category.name}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        {countryInfo ? `${list.length} ${list.length === 1 ? 'company' : 'companies'} and brands based in ${countryInfo.name}.` : category.description}
      </p>

      {!countryInfo && sections.length > 1 && (
        <nav aria-label={`${category.name} by country`} className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {sections.filter((g) => g.slug).map((g) => (
              <li key={g.slug}>
                <Link
                  to={{ page: 'category', slug: category.slug, country: g.slug! }}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3.5 py-1.5 text-sm text-ink hover:border-line-strong hover:text-white"
                >
                  {g.name} <span className="text-xs text-ink-faint">{g.items.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section className="mt-10" aria-labelledby="profiles">
        <SectionTitle id="profiles" title={`Profiled companies (${list.length})`} />
        {list.length === 0 ? (
          <div className="surface-card p-6 text-sm text-ink-muted">
            We have not published any verified profiles in this industry yet. We add a company only when its core facts
            can be traced to a source.
          </div>
        ) : countryInfo ? (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => <CompanyCard key={c.slug} company={c} />)}
          </div>
        ) : (
          <div className="space-y-10">
            {sections.map((g) => {
              const shown = g.items.slice(0, PER_COUNTRY_PREVIEW)
              return (
                <div key={g.slug ?? '_none'} id={g.slug ?? undefined}>
                  <h3 className="mb-3 flex items-baseline gap-3 text-lg font-bold text-white">
                    {g.slug ? (
                      <Link to={{ page: 'category', slug: category.slug, country: g.slug }} className="hover:text-violet-300">{g.name}</Link>
                    ) : (
                      g.name
                    )}
                    <span className="text-sm font-normal text-ink-faint">{g.items.length}</span>
                  </h3>
                  <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((c) => <CompanyCard key={c.slug} company={c} />)}
                  </div>
                  {g.items.length > shown.length && g.slug && (
                    <Link to={{ page: 'category', slug: category.slug, country: g.slug }} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
                      See all {g.items.length} in {g.name}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {!countryInfo && category.planned.length > 0 && (
        <section className="mt-12" aria-labelledby="planned">
          <SectionTitle id="planned" title="Planned coverage" hint="Companies we intend to profile. This is a coverage list, not a ranking or an endorsement." />
          <ul className="flex flex-wrap gap-2">
            {category.planned.map((p) => (
              <li key={p} className="rounded-full border border-line bg-surface-1 px-3 py-1.5 text-sm text-ink-muted">{p}</li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related">
          <SectionTitle id="related" title={`More in ${group.name.toLowerCase()}`} />
          <ul className="flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={{ page: 'category', slug: r.slug }} className="inline-block rounded-full border border-line bg-surface-1 px-3.5 py-1.5 text-sm text-ink hover:border-line-strong hover:text-white">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  )
}
