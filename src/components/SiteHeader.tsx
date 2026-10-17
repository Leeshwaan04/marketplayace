import React from 'react'
import { Link } from '../utils/nav'
import { SearchBox } from './SearchBox'
import type { Route } from '../utils/router'

const NAV: { label: string; to: Route; match: Route['page'][] }[] = [
  { label: 'Industries', to: { page: 'categories' }, match: ['categories', 'category'] },
  { label: 'Countries', to: { page: 'countries' }, match: ['countries', 'country'] },
  { label: 'Compare', to: { page: 'compare', slugs: [] }, match: ['compare'] },
  { label: 'Methodology', to: { page: 'methodology' }, match: ['methodology'] },
  { label: 'About', to: { page: 'about' }, match: ['about'] },
  { label: 'Labs', to: { page: 'labs', tab: 'floor' }, match: ['labs'] }
]

export const SiteHeader: React.FC<{ current: Route['page'] }> = ({ current }) => (
  <header className="sticky top-0 z-40 border-b border-line bg-surface-0/90 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
      <Link to={{ page: 'home' }} className="flex items-center gap-2.5 rounded-lg" aria-label="Marketplayace home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-base font-black text-white">A</span>
        <span className="hidden text-lg font-extrabold tracking-tight text-white sm:inline">
          Market<span className="text-accent">play</span>ace
        </span>
      </Link>

      <nav aria-label="Primary" className="no-scrollbar ml-2 hidden items-center gap-1 md:flex">
        {NAV.map((n) => (
          <Link
            key={n.label}
            to={n.to}
            aria-current={n.match.includes(current) ? 'page' : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              n.match.includes(current) ? 'bg-accent-soft text-white' : 'text-ink-muted hover:bg-surface-2 hover:text-white'
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {current === 'home' ? <div className="ml-auto" /> : <SearchBox className="ml-auto w-full max-w-md" />}
    </div>

    <nav aria-label="Primary mobile" className="no-scrollbar flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden">
      {NAV.map((n) => (
        <Link
          key={n.label}
          to={n.to}
          aria-current={n.match.includes(current) ? 'page' : undefined}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold ${
            n.match.includes(current) ? 'bg-accent-soft text-white' : 'text-ink-muted'
          }`}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  </header>
)
