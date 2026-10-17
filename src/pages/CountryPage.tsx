import React from 'react'
import { Container, Breadcrumbs, CompanyCard } from '../components/ui'
import { Link } from '../utils/nav'
import { CATEGORIES, GROUPS } from '../data/taxonomy'
import { companiesInCountry, countryBySlug } from '../data/companies'
import { useSeo } from '../utils/seo'
import { NotFoundPage } from './NotFoundPage'

const PREVIEW = 6

export const CountryPage: React.FC<{ slug: string }> = ({ slug }) => {
  const country = countryBySlug(slug)
  const all = country ? companiesInCountry(slug) : []

  useSeo({
    title: country ? `Companies and brands in ${country.name}` : 'Country not found',
    description: country
      ? `${all.length.toLocaleString('en')} company and brand profiles based in ${country.name}, grouped by industry, each with sourced facts.`
      : 'This country page does not exist.',
    path: `/country/${slug}`,
    noindex: !country
  })

  if (!country) return <NotFoundPage />

  const byCategory = CATEGORIES.map((cat) => ({ cat, items: all.filter((c) => c.categories.includes(cat.slug)) })).filter((x) => x.items.length > 0)

  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs items={[{ label: 'Home', to: { page: 'home' } }, { label: 'Countries', to: { page: 'countries' } }, { label: country.name }]} />
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Companies and brands in {country.name}</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        {all.length.toLocaleString('en')} {all.length === 1 ? 'profile' : 'profiles'} across {byCategory.length} {byCategory.length === 1 ? 'industry' : 'industries'}.
      </p>

      <nav aria-label={`Industries in ${country.name}`} className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {byCategory.map(({ cat, items }) => (
            <li key={cat.slug}>
              <a href={`#${cat.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3.5 py-1.5 text-sm text-ink hover:border-line-strong hover:text-white">
                {cat.name} <span className="text-xs text-ink-faint">{items.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-12">
        {GROUPS.map((g) => {
          const sections = byCategory.filter((x) => x.cat.group === g.id)
          if (sections.length === 0) return null
          return (
            <section key={g.id} aria-labelledby={`g-${g.id}`}>
              <h2 id={`g-${g.id}`} className="text-xl font-bold text-white">{g.name}</h2>
              <div className="mt-5 space-y-8">
                {sections.map(({ cat, items }) => (
                  <div key={cat.slug} id={cat.slug}>
                    <h3 className="mb-3 flex items-baseline gap-3 text-lg font-bold text-white">
                      <Link to={{ page: 'category', slug: cat.slug, country: slug }} className="hover:text-violet-300">{cat.name}</Link>
                      <span className="text-sm font-normal text-ink-faint">{items.length}</span>
                    </h3>
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.slice(0, PREVIEW).map((c) => <CompanyCard key={c.slug} company={c} />)}
                    </div>
                    {items.length > PREVIEW && (
                      <Link to={{ page: 'category', slug: cat.slug, country: slug }} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
                        See all {items.length} {cat.name.toLowerCase()} in {country.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </Container>
  )
}
