import React from 'react'
import { Container, Breadcrumbs } from '../components/ui'
import { Link } from '../utils/nav'
import { COUNTRIES, INDEX } from '../data/companies'
import { useSeo } from '../utils/seo'

export const CountriesPage: React.FC = () => {
  useSeo({
    title: 'Companies and brands by country',
    description: `Browse ${INDEX.length.toLocaleString('en')} company and brand profiles across ${COUNTRIES.length} countries, then narrow by industry.`,
    path: '/countries'
  })
  return (
    <Container className="pb-16 pt-8">
      <Breadcrumbs items={[{ label: 'Home', to: { page: 'home' } }, { label: 'Countries' }]} />
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Companies and brands by country</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Where a company is based, according to open data. {COUNTRIES.length} countries have at least one profile.
      </p>
      <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COUNTRIES.map((c) => (
          <li key={c.slug}>
            <Link to={{ page: 'country', slug: c.slug }} className="surface-card flex items-center justify-between gap-3 p-4 transition-colors hover:border-line-strong">
              <span className="font-semibold text-white">{c.name}</span>
              <span className="text-sm text-ink-faint">{c.count.toLocaleString('en')}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
