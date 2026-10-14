import React from 'react'
import { Eye, Star, Zap, ShoppingCart, Sparkles, CheckCircle } from 'lucide-react'
import type { Product, Rarity } from '../types'
import { playSound } from '../utils/audio'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onQuickAdd: (product: Product) => void
  onPlayDiscount: (product: Product) => void
  appliedDiscount?: number
}

const rarityStyles: Record<Rarity, { border: string; badge: string; glow: string }> = {
  Mythic: {
    border: 'border-amber-500/40 hover:border-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]'
  },
  Legendary: {
    border: 'border-purple-500/40 hover:border-purple-400',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]'
  },
  Rare: {
    border: 'border-cyan-500/40 hover:border-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    glow: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]'
  },
  Common: {
    border: 'border-gray-700 hover:border-gray-500',
    badge: 'bg-gray-800 text-gray-300 border-gray-600',
    glow: 'hover:shadow-[0_0_20px_-5px_rgba(156,163,175,0.2)]'
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  onPlayDiscount,
  appliedDiscount = 0
}) => {
  const currentPrice = appliedDiscount > 0
    ? (product.price * (1 - appliedDiscount / 100))
    : product.price

  const style = rarityStyles[product.rarity] || rarityStyles.Common

  return (
    <div
      className={`group relative rounded-2xl bg-gray-900/80 border ${style.border} ${style.glow} transition-all duration-300 overflow-hidden flex flex-col justify-between backdrop-blur-sm`}
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-950 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${style.badge} backdrop-blur-md`}>
            {product.rarity}
          </span>
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gray-950/70 border border-gray-800 text-[11px] text-gray-300 backdrop-blur-md">
            <Eye className="w-3 h-3 text-pink-400" />
            <span>{product.spectators}</span>
          </div>
        </div>

        {/* Play Factor Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-purple-300 bg-purple-950/80 border border-purple-500/30 px-2 py-0.5 rounded-md backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{product.playFactor}</span>
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Seller / Creator row */}
          <div className="flex items-center space-x-1.5 text-xs text-gray-400 mb-1.5">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="truncate">{product.seller.name}</span>
            {product.seller.isVerified && (
              <CheckCircle className="w-3 h-3 text-blue-400 shrink-0" />
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Pricing & Ratings */}
        <div className="pt-2 border-t border-gray-800/80">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black text-white">
                  ${currentPrice.toFixed(0)}
                </span>
                {product.originalPrice > currentPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {appliedDiscount > 0 ? (
                <span className="text-[10px] font-bold text-emerald-400">
                  🎉 {appliedDiscount}% Game Discount Applied!
                </span>
              ) : (
                <span className="text-[10px] text-gray-400 font-medium">
                  Up to {product.maxDiscountPercent}% off with mini-game
                </span>
              )}
            </div>

            <div className="flex items-center text-xs text-amber-400 space-x-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-gray-500 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                playSound('whistle')
                onPlayDiscount(product)
              }}
              className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 text-purple-200 hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Play Price</span>
            </button>

            <button
              onClick={() => {
                playSound('coin')
                onQuickAdd(product)
              }}
              className="flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
