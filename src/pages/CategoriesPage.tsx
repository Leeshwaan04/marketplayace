import React, { useState } from 'react'
import { Container, Breadcrumbs } from '../components/ui'
import { Link } from '../utils/nav'
import { CATEGORIES, GROUPS } from '../data/taxonomy'
import { companiesInCategory } from '../data/companies'
import { useSeo } from '../utils/seo'

export const CategoriesPage: React.FC = () => {
  const [onlyProfiled, setOnlyProfiled] = useState(false)
  useSeo({
    title: 'All industries',
    description: `Browse ${CATEGORIES.length} industries across finance, technology, mobility, energy, consumer and media, and open any profiled company.`,
    path: '/categories'
  })

  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs items={[{ label: 'Home', to: { page: 'home' } }, { label: 'Industries' }]} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">All industries</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            {CATEGORIES.length} industries in six groups. Industries without profiles yet are listed so you can see what is coming.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={onlyProfiled} onChange={(e) => setOnlyProfiled(e.target.checked)} className="h-4 w-4 accent-violet-500" />
          Only industries with profiles
        </label>
      </div>

      <div className="mt-10 space-y-12">
        {GROUPS.map((g) => {
          const cats = CATEGORIES.filter((c) => c.group === g.id)
            .map((c) => ({ c, n: companiesInCategory(c.slug).length }))
            .filter(({ n }) => !onlyProfiled || n > 0)
            .sort((a, b) => b.n - a.n || a.c.name.localeCompare(b.c.name))
          if (cats.length === 0) return null
          return (
            <section key={g.id} aria-labelledby={`g-${g.id}`}>
              <h2 id={`g-${g.id}`} className="text-xl font-bold text-white">{g.name}</h2>
              <p className="mt-1 text-sm text-ink-muted">{g.blurb}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cats.map(({ c, n }) => (
                  <li key={c.slug}>
                    <Link
                      to={{ page: 'category', slug: c.slug }}
                      className="surface-card group flex h-full flex-col p-4 transition-colors hover:border-line-strong"
                    >
                      <span className="font-semibold text-white group-hover:text-violet-300">{c.name}</span>
                      <span className="mt-1 line-clamp-2 flex-1 text-sm text-ink-muted">{c.description}</span>
                      <span className={`mt-3 text-xs font-medium ${n > 0 ? 'text-success' : 'text-ink-faint'}`}>
                        {n > 0 ? `${n} ${n === 1 ? 'company' : 'companies'} profiled` : 'Profiles coming'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </Container>
  )
}
