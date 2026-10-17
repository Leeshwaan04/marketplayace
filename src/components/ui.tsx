import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from '../utils/nav'
import { CompanyLogo } from './CompanyLogo'
import type { CompanyLite } from '../data/companies'
import { categoryBySlug } from '../data/taxonomy'
import type { Route } from '../utils/router'

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
)

export const Breadcrumbs: React.FC<{ items: { label: string; to?: Route }[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="mb-4">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
      {items.map((it, i) => (
        <li key={it.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden />}
          {it.to ? (
            <Link to={it.to} className="hover:text-white">{it.label}</Link>
          ) : (
            <span aria-current="page" className="text-white">{it.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)

export const SectionTitle: React.FC<{ title: string; hint?: string; id?: string }> = ({ title, hint, id }) => (
  <div className="mb-4">
    <h2 id={id} className="text-xl font-bold text-white">{title}</h2>
    {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
  </div>
)

export const CompanyCard: React.FC<{ company: CompanyLite }> = ({ company }) => {
  const cat = categoryBySlug(company.categories[0])
  const place = [company.hq, company.country].filter(Boolean).join(', ')
  return (
    <Link
      to={{ page: 'company', slug: company.slug }}
      className="surface-card group flex min-w-0 items-start gap-4 p-4 transition-colors hover:border-line-strong"
    >
      <CompanyLogo name={company.name} src={company.logo} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-white group-hover:text-violet-300">{company.name}</h3>
        <p className="mt-0.5 truncate text-sm text-ink-muted">{place || 'Location not available'}</p>
        {cat && <p className="mt-2 truncate text-xs text-ink-faint">{cat.name}</p>}
      </div>
    </Link>
  )
}
