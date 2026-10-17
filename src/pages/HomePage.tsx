import React from 'react'
import { ArrowRight, ShieldCheck, Database, FileSearch } from 'lucide-react'
import { Container, CompanyCard, SectionTitle } from '../components/ui'
import { SearchBox } from '../components/SearchBox'
import { HeroBackdrop } from '../components/HeroBackdrop'
import { Link } from '../utils/nav'
import { CATEGORIES, GROUPS } from '../data/taxonomy'
import { INDEX, COUNTRIES, DATA_GENERATED_AT } from '../data/companies'
import { useSeo } from '../utils/seo'
import { websiteAndPublisher } from '../utils/jsonld'

export const HomePage: React.FC = () => {
  useSeo({
    title: 'Company and industry intelligence for India and the world',
    description:
      'Explore companies by industry. Every fact on every profile links to its source and shows when it was retrieved, and anything we cannot verify is left blank.',
    path: '/',
    jsonLd: websiteAndPublisher()
  })

  const covered = new Set(INDEX.flatMap((c) => c.categories))
  const featured = [...INDEX].sort((a, b) => b.sitelinks - a.sitelinks || a.name.localeCompare(b.name)).slice(0, 24)

  return (
    <>
      <section className="relative isolate overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-24">
        <HeroBackdrop />
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know any company, <span className="text-accent">industry by industry.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Profiles of Indian and global companies where every fact links to its source and shows when we retrieved
              it. If we can&apos;t verify something, we leave it blank.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBox />
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              {INDEX.length.toLocaleString('en')} companies profiled across {covered.size} of {CATEGORIES.length} industries and {COUNTRIES.length} countries. Coverage is growing; see{' '}
              <Link to={{ page: 'methodology' }} className="text-accent underline-offset-2 hover:underline">how we work</Link>.
            </p>
          </div>
        </Container>
      </section>

      <Container className="space-y-14 pb-16">
        <section aria-labelledby="industries">
          <SectionTitle id="industries" title="Browse by industry" hint="Six groups, each opening into its industries." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((g) => {
              const cats = CATEGORIES.filter((c) => c.group === g.id)
              const profiled = new Set(INDEX.filter((c) => c.categories.some((s) => cats.some((k) => k.slug === s))).map((c) => c.slug)).size
              return (
                <Link
                  key={g.id}
                  to={{ page: 'categories' }}
                  className="surface-card group flex flex-col p-5 transition-colors hover:border-line-strong"
                >
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300">{g.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{g.blurb}</p>
                  <p className="mt-4 text-xs text-ink-faint">
                    {cats.length} industries, {profiled} {profiled === 1 ? 'company' : 'companies'} profiled
                  </p>
                </Link>
              )
            })}
          </div>
          <div className="mt-4">
            <Link to={{ page: 'categories' }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              See all {CATEGORIES.length} industries <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section aria-labelledby="countries">
          <SectionTitle id="countries" title="Browse by country" hint="Brands grouped by where they are based." />
          <ul className="flex flex-wrap gap-2">
            {COUNTRIES.slice(0, 18).map((c) => (
              <li key={c.slug}>
                <Link to={{ page: 'country', slug: c.slug }} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3.5 py-1.5 text-sm text-ink hover:border-line-strong hover:text-white">
                  {c.name} <span className="text-xs text-ink-faint">{c.count.toLocaleString('en')}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link to={{ page: 'countries' }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              See all {COUNTRIES.length} countries <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section aria-labelledby="profiled">
          <SectionTitle id="profiled" title="Most widely documented companies" hint={`The ${featured.length} profiled companies with the most Wikipedia coverage. Data last synced ${DATA_GENERATED_AT}.`} />
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CompanyCard key={c.slug} company={c} />
            ))}
          </div>
        </section>

        <section aria-labelledby="trust" className="surface-card p-6 sm:p-8">
          <h2 id="trust" className="text-xl font-bold text-white">How we keep this trustworthy</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { icon: FileSearch, title: 'Every fact has a source', body: 'Each figure links to where it came from and shows the date we retrieved it.' },
              { icon: Database, title: 'Blank beats wrong', body: 'We never estimate or fill gaps. A missing value means we have no verified source for it yet.' },
              { icon: ShieldCheck, title: 'No paid placement', body: 'Companies cannot pay to be listed, ranked or edited. We publish no scores or rankings we cannot explain.' }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-3 font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
