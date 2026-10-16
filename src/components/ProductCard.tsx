import React from 'react'
import { Star, Zap, ShoppingCart, Sparkles } from 'lucide-react'
import type { Product, Rarity } from '../types'
import { playSound } from '../utils/audio'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onQuickAdd: (product: Product) => void
  onPlayDiscount: (product: Product) => void
  appliedDiscount?: number
}

const rarityStyles: Record<Rarity, { border: string; badge: string }> = {
  Mythic: { border: 'hover:border-amber-400/60', badge: 'text-amber-300 border-amber-400/50' },
  Legendary: { border: 'hover:border-violet-400/60', badge: 'text-violet-300 border-violet-400/50' },
  Rare: { border: 'hover:border-cyan-400/60', badge: 'text-cyan-300 border-cyan-400/50' },
  Common: { border: 'hover:border-line-strong', badge: 'text-ink-muted border-line-strong' }
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  onPlayDiscount,
  appliedDiscount = 0
}) => {
  const currentPrice = appliedDiscount > 0 ? product.price * (1 - appliedDiscount / 100) : product.price
  const style = rarityStyles[product.rarity] || rarityStyles.Common

  return (
    <article
      className={`group surface-card animate-rise flex flex-col overflow-hidden transition-colors duration-200 ${style.border}`}
    >
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`View ${product.title}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-surface-2 text-left"
      >
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" aria-hidden />

        <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
          <span
            className={`rounded-md border bg-surface-0/85 px-2 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur-md ${style.badge}`}
          >
            {product.rarity}
          </span>
        </div>

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-surface-0/85 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
          {product.playFactor}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <img src={product.seller.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
          <span className="truncate">{product.seller.name}</span>
          <span className="shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
            Sample
          </span>
        </div>

        <div className="flex-1">
          <h3 className="line-clamp-1 text-base font-bold text-white">
            <button type="button" onClick={() => onSelect(product)} className="text-left hover:text-violet-300">
              {product.title}
            </button>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-muted">{product.tagline}</p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-line pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">${currentPrice.toFixed(0)}</span>
              {product.originalPrice > currentPrice && (
                <span className="text-sm text-ink-faint line-through">${product.originalPrice}</span>
              )}
            </div>
            <p className={`text-xs font-medium ${appliedDiscount > 0 ? 'text-success' : 'text-ink-faint'}`}>
              {appliedDiscount > 0
                ? `${appliedDiscount}% game discount applied`
                : `Win up to ${product.maxDiscountPercent}% off`}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-ink" aria-label={`Rated ${product.rating} from ${product.reviewsCount} reviews`}>
            <Star className="h-4 w-4 fill-reward text-reward" aria-hidden />
            <span className="font-bold">{product.rating}</span>
            <span className="text-ink-faint">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('whistle')
              onPlayDiscount(product)
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2.5 text-sm font-bold text-white transition hover:bg-accent-strong active:scale-[0.97]"
          >
            <Zap className="h-4 w-4" aria-hidden />
            Play price
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('coin')
              onQuickAdd(product)
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-line-strong px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-surface-2 active:scale-[0.97]"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
