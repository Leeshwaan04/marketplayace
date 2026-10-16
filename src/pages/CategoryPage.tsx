import React, { useState } from 'react'
import { Container, Breadcrumbs, CompanyCard, SectionTitle } from '../components/ui'
import { Link } from '../utils/nav'
import { categoryBySlug, groupById, CATEGORIES } from '../data/taxonomy'
import { companiesInCategory } from '../data/companies'
import { useSeo } from '../utils/seo'
import { NotFoundPage } from './NotFoundPage'

export const CategoryPage: React.FC<{ slug: string }> = ({ slug }) => {
  const category = categoryBySlug(slug)
  const [country, setCountry] = useState<string>('all')
  const all = category ? companiesInCategory(category.slug) : []
  const countries = [...new Set(all.map((c) => c.country?.value).filter((x): x is string => !!x))].sort()
  const shown = country === 'all' ? all : all.filter((c) => c.country?.value === country)

  useSeo({
    title: category ? `${category.name}: companies and industry overview` : 'Industry not found',
    description: category
      ? `${category.description} ${all.length > 0 ? `${all.length} sourced company profiles.` : 'Company profiles are being researched.'}`
      : 'This industry does not exist.',
    path: `/category/${slug}`,
    noindex: !category
  })

  if (!category) return <NotFoundPage />
  const group = groupById(category.group)
  const related = CATEGORIES.filter((c) => c.group === category.group && c.slug !== category.slug).slice(0, 8)

  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: { page: 'home' } },
          { label: 'Industries', to: { page: 'categories' } },
          { label: category.name }
        ]}
      />
      <p className="text-sm font-semibold text-accent">{group.name}</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">{category.description}</p>

      <section className="mt-10" aria-labelledby="profiles">
        <SectionTitle id="profiles" title={`Profiled companies (${all.length})`} />
        {all.length === 0 ? (
          <div className="surface-card p-6 text-sm text-ink-muted">
            We have not published any verified profiles in this industry yet. We add a company only when its core facts
            can be traced to a source.
          </div>
        ) : (
          <>
            {countries.length > 1 && (
              <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto" role="group" aria-label="Filter by country">
                {['all', ...countries].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={country === c}
                    onClick={() => setCountry(c)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      country === c ? 'border-accent bg-accent-soft text-white' : 'border-line bg-surface-1 text-ink-muted hover:text-white'
                    }`}
                  >
                    {c === 'all' ? 'All countries' : c}
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((c) => <CompanyCard key={c.slug} company={c} />)}
            </div>
          </>
        )}
      </section>

      {category.planned.length > 0 && (
        <section className="mt-12" aria-labelledby="planned">
          <SectionTitle
            id="planned"
            title="Planned coverage"
            hint="Companies we intend to profile. This is a coverage list, not a ranking or an endorsement."
          />
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
