import React, { useState, useMemo } from 'react'
import { Search, Sparkles, CheckCircle2, Trophy, ArrowRight, MapPin, Tag } from 'lucide-react'
import { MASTER_CATEGORIES } from '../data/categories'
import { generateCategoryBrands } from '../data/brandsData'
import type { Brand, BrandTier } from '../types/brand'
import { playSound } from '../utils/audio'

interface BrandDirectoryProps {
  onSelectBrand: (brand: Brand) => void
}

export const BrandDirectory: React.FC<BrandDirectoryProps> = ({ onSelectBrand }) => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('quick-commerce')
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<'All' | BrandTier>('All')
  const [sortBy, setSortBy] = useState<'trending' | 'aceScore' | 'name'>('trending')

  // Current active category meta
  const activeCategory = useMemo(() => {
    return MASTER_CATEGORIES.find((c) => c.slug === selectedCategorySlug) || MASTER_CATEGORIES[0]
  }, [selectedCategorySlug])

  // Get brands for this category
  const categoryBrands = useMemo(() => {
    return generateCategoryBrands(selectedCategorySlug, 48)
  }, [selectedCategorySlug])

  // Filtered & sorted brands
  const filteredBrands = useMemo(() => {
    return categoryBrands
      .filter((b) => {
        const matchesSearch =
          searchQuery === '' ||
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesTier = tierFilter === 'All' || b.tier === tierFilter

        return matchesSearch && matchesTier
      })
      .sort((a, b) => {
        if (sortBy === 'trending') return a.trendingRank - b.trendingRank
        if (sortBy === 'aceScore') return b.aceScore - a.aceScore
        return a.name.localeCompare(b.name)
      })
  }, [categoryBrands, searchQuery, tierFilter, sortBy])

  // Quick stats across all 52 categories
  const totalNetworkBrands = useMemo(() => {
    return MASTER_CATEGORIES.reduce((acc, cat) => acc + cat.totalBrandsCount, 0)
  }, [])

  return (
    <div className="space-y-8">
      {/* Directory Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-gray-900 to-indigo-950/70 border border-purple-500/30 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Enterprise Brand Network • 52 Verticals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Directory of {totalNetworkBrands.toLocaleString()}+ Brands
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Explore dedicated brand details, Ace Trust Scores, exclusive promo codes, and interactive game perks across 1k Quick Commerce, 1k Pharmacy, 1k Gaming, 1k Aviation, 1k Fintech, and 47+ more industries.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 text-center">
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div className="text-xl font-black text-purple-400 font-mono">52</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Categories</div>
            </div>
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div className="text-xl font-black text-emerald-400 font-mono">60k+</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Brands Indexed</div>
            </div>
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 col-span-2 sm:col-span-1">
              <div className="text-xl font-black text-amber-400 font-mono">100%</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Verified Perks</div>
            </div>
          </div>
        </div>
      </div>

      {/* 52 Categories Selector Scrollable Grid / Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
            Select Category ({MASTER_CATEGORIES.length} Sectors):
          </span>
          <span className="text-xs text-purple-400 font-medium">
            Active: <strong>{activeCategory.name}</strong> ({activeCategory.totalBrandsCount.toLocaleString()} Brands)
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          {MASTER_CATEGORIES.map((cat) => {
            const isSelected = cat.slug === selectedCategorySlug
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('click')
                  setSelectedCategorySlug(cat.slug)
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-md shadow-purple-500/20'
                    : 'bg-gray-900/80 text-gray-300 hover:text-white border-gray-800 hover:border-gray-700'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {cat.totalBrandsCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-gray-900/70 p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Brand Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeCategory.name} brands, HQ, or tags...`}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Tier & Sort Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
          {/* Tier Pills */}
          <div className="flex items-center space-x-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            {(['All', 'S-Tier', 'A-Tier', 'B-Tier'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  playSound('click')
                  setTierFilter(tier)
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  tierFilter === tier
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-gray-400 text-xs">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'trending' | 'aceScore' | 'name')}
              className="bg-gray-950 border border-gray-800 text-xs text-gray-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-purple-500"
            >
              <option value="trending">🔥 Trending Rank</option>
              <option value="aceScore">🏆 Highest Ace Score</option>
              <option value="name">🔤 Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => {
          return (
            <div
              key={brand.id}
              className="group rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-purple-500/60 p-5 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              onClick={() => {
                playSound('click')
                onSelectBrand(brand)
              }}
            >
              {/* Header with Logo & Tier */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-700 bg-gray-950 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                          {brand.name}
                        </h3>
                        {brand.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="truncate">{brand.headquarters}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tier Badge */}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                    brand.tier === 'S-Tier'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : brand.tier === 'A-Tier'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {brand.tier}
                  </span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {brand.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-gray-950 text-gray-400 border border-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="pt-3 border-t border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">ACE TRUST SCORE</span>
                    <div className="flex items-center space-x-1 text-emerald-400 font-bold font-mono">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{brand.aceScore}/100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-mono">VALUATION</span>
                    <span className="text-white font-bold font-mono">{brand.valuationOrMarketCap}</span>
                  </div>
                </div>

                {/* Exclusive Perk Banner */}
                {brand.offers[0] && (
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 text-purple-300 truncate">
                      <Tag className="w-3 h-3 text-pink-400 shrink-0" />
                      <span className="truncate">{brand.offers[0].title}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold shrink-0 ml-1">
                      {brand.offers[0].discount}
                    </span>
                  </div>
                )}

                {/* Dossier Action Trigger */}
                <button
                  className="w-full py-2.5 rounded-xl font-bold text-xs uppercase bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-gray-200 hover:text-white transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Open Brand Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
