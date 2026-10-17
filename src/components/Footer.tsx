import React from 'react'
import { Link } from '../utils/nav'
import { INDEX, COUNTRIES } from '../data/companies'
import { CATEGORIES } from '../data/taxonomy'
import { SITE } from '../config/site'

const YEAR = new Date().getFullYear()

// Sitewide links to the biggest industries and countries give crawlers (and people) a short path to deep pages.
const categoryCounts = new Map<string, number>()
for (const c of INDEX) for (const k of c.categories) categoryCounts.set(k, (categoryCounts.get(k) ?? 0) + 1)
const TOP_INDUSTRIES = CATEGORIES.filter((c) => categoryCounts.has(c.slug))
  .sort((a, b) => (categoryCounts.get(b.slug) ?? 0) - (categoryCounts.get(a.slug) ?? 0))
  .slice(0, 8)
const TOP_COUNTRIES = COUNTRIES.slice(0, 8)

export const Footer: React.FC = () => (
  <footer className="mt-8 border-t border-line bg-surface-0 text-sm text-ink-muted">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:px-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">A</span>
          <span className="text-base font-extrabold tracking-tight text-white">
            Market<span className="text-accent">play</span>ace
          </span>
        </div>
        <p className="max-w-sm leading-relaxed">
          Company and industry profiles where every fact shows its source. {INDEX.length.toLocaleString('en')} companies profiled so far.
        </p>
      </div>

      <nav aria-label="Popular industries">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Industries</h3>
        <ul className="space-y-2">
          {TOP_INDUSTRIES.map((c) => (
            <li key={c.slug}><Link to={{ page: 'category', slug: c.slug }} className="hover:text-white">{c.name}</Link></li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Popular countries">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Countries</h3>
        <ul className="space-y-2">
          {TOP_COUNTRIES.map((c) => (
            <li key={c.slug}><Link to={{ page: 'country', slug: c.slug }} className="hover:text-white">{c.name}</Link></li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Explore">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Explore</h3>
        <ul className="space-y-2">
          <li><Link to={{ page: 'categories' }} className="hover:text-white">Industries</Link></li>
          <li><Link to={{ page: 'countries' }} className="hover:text-white">Countries</Link></li>
          <li><Link to={{ page: 'compare', slugs: [] }} className="hover:text-white">Compare companies</Link></li>
          <li><Link to={{ page: 'labs', tab: 'floor' }} className="hover:text-white">Labs (sample listings)</Link></li>
        </ul>
      </nav>

      <nav aria-label="Trust">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Trust</h3>
        <ul className="space-y-2">
          <li><Link to={{ page: 'methodology' }} className="hover:text-white">Methodology</Link></li>
          <li><Link to={{ page: 'about' }} className="hover:text-white">About</Link></li>
          <li><Link to={{ page: 'privacy' }} className="hover:text-white">Privacy</Link></li>
          <li><Link to={{ page: 'terms' }} className="hover:text-white">Terms</Link></li>
          {SITE.contactEmail && <li><a href={`mailto:${SITE.contactEmail}`} className="hover:text-white">Contact</a></li>}
        </ul>
      </nav>
    </div>

    <div className="border-t border-line px-4 py-5 text-center text-xs text-ink-faint">
      <p>© {YEAR} {SITE.legalEntity || SITE.name}. Company names and logos belong to their owners. Not affiliated with or endorsed by any company profiled. Not investment advice.</p>
    </div>
  </footer>
)
