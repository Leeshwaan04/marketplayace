import React, { useState } from 'react'
import { ShoppingBag, Volume2, VolumeX, Search, Gift, X } from 'lucide-react'
import { playSound, toggleMute, getMuteState } from '../utils/audio'

interface HeaderProps {
  cartCount: number
  totalDiscountSaved: number
  onOpenCart: () => void
  onOpenPerkModal: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const SearchField: React.FC<{
  value: string
  onChange: (q: string) => void
  className?: string
}> = ({ value, onChange, className }) => (
  <div className={`relative ${className ?? ''}`} role="search">
    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search drops, gear, mods, creators"
      aria-label="Search drops"
      className="w-full rounded-full border border-line bg-surface-1 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-ink-faint transition-colors hover:border-line-strong focus:border-accent [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-surface-3 hover:text-white"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    )}
  </div>
)

export const LabsToolbar: React.FC<HeaderProps> = ({
  cartCount,
  totalDiscountSaved,
  onOpenCart,
  onOpenPerkModal,
  searchQuery,
  setSearchQuery
}) => {
  const [isMuted, setIsMuted] = useState(getMuteState())

  const handleMuteToggle = () => {
    const muted = toggleMute()
    setIsMuted(muted)
    if (!muted) playSound('click')
  }

  return (
    <div className="border-b border-line bg-surface-1/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <SearchField value={searchQuery} onChange={setSearchQuery} className="min-w-0 flex-1 basis-64" />
        <div className="ml-auto flex items-center gap-2">
          {totalDiscountSaved > 0 && (
            <span className="hidden rounded-full border border-reward/30 bg-reward/10 px-2.5 py-1 text-xs font-bold text-reward md:inline">
              ${totalDiscountSaved.toFixed(0)} sample savings
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              playSound('coin')
              onOpenPerkModal()
            }}
            aria-label="Open the daily sample drop"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-reward/30 bg-reward/10 px-3 text-sm font-semibold text-reward transition-colors hover:bg-reward/20"
          >
            <Gift className="h-[18px] w-[18px]" aria-hidden />
            <span className="hidden sm:inline">Daily drop</span>
          </button>
          <button
            type="button"
            onClick={handleMuteToggle}
            aria-label={isMuted ? 'Turn sound effects on' : 'Turn sound effects off'}
            aria-pressed={!isMuted}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-1 text-ink-muted transition-colors hover:border-line-strong hover:text-white"
          >
            {isMuted ? <VolumeX className="h-[18px] w-[18px]" aria-hidden /> : <Volume2 className="h-[18px] w-[18px]" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('click')
              onOpenCart()
            }}
            aria-label={`Open sample cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface-1 text-ink transition-colors hover:border-accent"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
