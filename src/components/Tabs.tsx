import React, { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon?: LucideIcon
  badge?: React.ReactNode
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  label: string
  className?: string
}

/** Accessible tab list with roving focus and arrow-key navigation. */
export function Tabs<T extends string>({ tabs, value, onChange, label, className }: TabsProps<T>) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = tabs.findIndex((t) => t.id === value)
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    onChange(tabs[next].id)
    refs.current[tabs[next].id]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={clsx('no-scrollbar flex items-center gap-1 overflow-x-auto', className)}
    >
      {tabs.map(({ id, label: text, icon: Icon, badge }) => {
        const selected = id === value
        return (
          <button
            key={id}
            ref={(el) => {
              refs.current[id] = el
            }}
            role="tab"
            type="button"
            id={`tab-${id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={clsx(
              'relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors',
              selected
                ? 'bg-accent-soft text-white'
                : 'text-ink-muted hover:bg-surface-2 hover:text-white'
            )}
          >
            {Icon && <Icon className={clsx('h-4 w-4', selected ? 'text-accent' : 'text-ink-faint')} aria-hidden />}
            <span>{text}</span>
            {badge}
            {selected && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" aria-hidden />
            )}
          </button>
        )
      })}
    </div>
  )
}
