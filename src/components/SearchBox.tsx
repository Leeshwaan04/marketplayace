import React, { useId, useMemo, useRef, useState } from 'react'
import { Search, X, Building2, Layers } from 'lucide-react'
import { CATEGORIES } from '../data/taxonomy'
import { searchCompanies } from '../data/companies'
import { useNavigate } from '../utils/navContext'
import type { Route } from '../utils/router'

interface Hit {
  key: string
  label: string
  kind: 'Company' | 'Category'
  route: Route
}

/** Global search over profiled companies and industry categories (ARIA combobox). */
interface SearchBoxProps {
  className?: string
  autoFocus?: boolean
  /** When set, picking a company calls this instead of navigating, and industries are not suggested. */
  onPickCompany?: (slug: string) => void
  placeholder?: string
  label?: string
}

export const SearchBox: React.FC<SearchBoxProps> = ({ className = '', autoFocus, onPickCompany, placeholder = 'Search companies and industries', label = 'Search companies and industries' }) => {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const hits: Hit[] = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    const companies: Hit[] = searchCompanies(needle, 6).map((c) => ({
      key: `c-${c.slug}`, label: c.name, kind: 'Company', route: { page: 'company', slug: c.slug }
    }))
    // Match at the start of a word so "gro" finds Groww but not "Group".
    const wordStart = (text: string) => new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text)
    const cats: Hit[] = onPickCompany ? [] : CATEGORIES.filter((c) => wordStart(c.name) || c.planned.some(wordStart))
      .slice(0, 4)
      .map((c) => ({ key: `k-${c.slug}`, label: c.name, kind: 'Category', route: { page: 'category', slug: c.slug } }))
    return [...companies, ...cats]
  }, [q, onPickCompany])

  const go = (hit: Hit) => {
    if (onPickCompany && hit.route.page === 'company') onPickCompany(hit.route.slug)
    else navigate(hit.route)
    setQ('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const showList = open && q.trim().length > 0

  return (
    <div className={`relative ${className}`} role="search">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && hits[active] ? `${listId}-${active}` : undefined}
        aria-label={label}
        value={q}
        placeholder={placeholder}
        onChange={(e) => {
          setQ(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, hits.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
          } else if (e.key === 'Enter' && hits[active]) {
            e.preventDefault()
            go(hits[active])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        className="w-full rounded-full border border-line bg-surface-1 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-ink-faint transition-colors hover:border-line-strong focus:border-accent"
      />
      {q && (
        <button
          type="button"
          onClick={() => {
            setQ('')
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-surface-3 hover:text-white"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-line-strong bg-surface-1 p-1.5 shadow-2xl shadow-black/50"
        >
          {hits.length === 0 && (
            <li className="px-3 py-3 text-sm text-ink-muted">
              No profile for &ldquo;{q.trim()}&rdquo; yet. Browse industries to see what we cover.
            </li>
          )}
          {hits.map((h, i) => (
            <li
              key={h.key}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault()
                go(h)
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                i === active ? 'bg-accent-soft text-white' : 'text-ink'
              }`}
            >
              {h.kind === 'Company' ? (
                <Building2 className="h-4 w-4 text-ink-faint" aria-hidden />
              ) : (
                <Layers className="h-4 w-4 text-ink-faint" aria-hidden />
              )}
              <span className="flex-1 truncate">{h.label}</span>
              <span className="text-xs text-ink-faint">{h.kind}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
