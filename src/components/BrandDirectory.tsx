import React, { useState, useMemo } from 'react'
import {
  Search, Sparkles, CheckCircle2, Trophy, ArrowRight, MapPin, Tag,
  Globe2, Building2, Star, Layers
} from 'lucide-react'
import { MASTER_CATEGORIES } from '../data/categories'
import { MASTER_COUNTRIES } from '../data/countriesData'
import { generateCategoryBrands, generateCountryBrands, REAL_BRANDS } from '../data/brandsData'
import { BrandLogoBadge } from './BrandLogoBadge'
import type { Brand, BrandTier } from '../types/brand'
import { playSound } from '../utils/audio'

interface BrandDirectoryProps {
  onSelectBrand: (brand: Brand) => void
}

type BrowseMode = 'category' | 'country-city'

export const BrandDirectory: React.FC<BrandDirectoryProps> = ({ onSelectBrand }) => {
  const [browseMode, setBrowseMode] = useState<BrowseMode>('category')

  // Category mode state
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('quick-commerce')

  // Country & City mode state
  const [selectedCountrySlug, setSelectedCountrySlug] = useState('india')
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>('')

  // Cross filters
  const [filterCountrySlug, setFilterCountrySlug] = useState<string>('all')
  const [filterCategorySlug, setFilterCategorySlug] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<'All' | BrandTier>('All')
  const [sortBy, setSortBy] = useState<'trending' | 'aceScore' | 'name'>('trending')

  // Active Category Meta
  const activeCategory = useMemo(() => {
    return MASTER_CATEGORIES.find((c) => c.slug === selectedCategorySlug) || MASTER_CATEGORIES[0]
  }, [selectedCategorySlug])

  // Active Country Meta
  const activeCountry = useMemo(() => {
    return MASTER_COUNTRIES.find((c) => c.slug === selectedCountrySlug) || MASTER_COUNTRIES[0]
  }, [selectedCountrySlug])

  // Brands Source according to browse mode (100% REAL brands only, zero dummy data)
  const rawBrands = useMemo(() => {
    if (browseMode === 'country-city') {
      return generateCountryBrands(selectedCountrySlug, selectedCitySlug || undefined)
    }
    return generateCategoryBrands(selectedCategorySlug)
  }, [browseMode, selectedCategorySlug, selectedCountrySlug, selectedCitySlug])

  // Filtered & Sorted Brands
  const filteredBrands = useMemo(() => {
    return rawBrands
      .filter((b) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim()
        const matchesSearch =
          q === '' ||
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.country.toLowerCase().includes(q) ||
          b.headquarters.toLowerCase().includes(q) ||
          b.heroTagline.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))

        // Tier filter
        const matchesTier = tierFilter === 'All' || b.tier === tierFilter

        // Cross filter country if in category mode
        const matchesCrossCountry =
          browseMode !== 'category' ||
          filterCountrySlug === 'all' ||
          b.countryCode.toLowerCase() === filterCountrySlug.toLowerCase()

        // Cross filter category if in country-city mode
        const matchesCrossCategory =
          browseMode !== 'country-city' ||
          filterCategorySlug === 'all' ||
          b.category === filterCategorySlug

        return matchesSearch && matchesTier && matchesCrossCountry && matchesCrossCategory
      })
      .sort((a, b) => {
        if (sortBy === 'trending') return a.trendingRank - b.trendingRank
        if (sortBy === 'aceScore') return b.aceScore - a.aceScore
        return a.name.localeCompare(b.name)
      })
  }, [rawBrands, searchQuery, tierFilter, filterCountrySlug, filterCategorySlug, browseMode, sortBy])

  return (
    <div className="space-y-8">
      {/* Directory Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-gray-900 to-indigo-950/70 border border-purple-500/30 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/40">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Verified Enterprise Brands • 100% Real-World Data</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Directory of Real-World Global Brands
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Explore authentic pre-login customer propositions, official vector brandmarks, real valuations, and verified promo codes across leading global enterprises and tech hubs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 text-center">
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div className="text-xl font-black text-purple-400 font-mono">100%</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Real Brands</div>
            </div>
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div className="text-xl font-black text-blue-400 font-mono">10+</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Countries</div>
            </div>
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div className="text-xl font-black text-emerald-400 font-mono">Top Tier</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Market Leaders</div>
            </div>
            <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div className="text-xl font-black text-amber-400 font-mono">Verified</div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Escrow Perks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-gray-900/90 rounded-2xl border border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              playSound('click')
              setBrowseMode('category')
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              browseMode === 'category'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Browse by Industry / Sector (52 Verticals)</span>
          </button>

          <button
            onClick={() => {
              playSound('click')
              setBrowseMode('country-city')
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              browseMode === 'country-city'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Browse by Country & City (Global Hubs)</span>
          </button>
        </div>

        <div className="text-xs text-gray-400 font-mono px-3 py-1">
          Showing: <strong className="text-purple-300">{filteredBrands.length}</strong> active brands
        </div>
      </div>

      {/* VIEW MODE 1: Category Mode (52 Sectors Carousel) */}
      {browseMode === 'category' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
              Select Industry Sector ({MASTER_CATEGORIES.length} Categories):
            </span>
            <span className="text-xs text-purple-400 font-medium">
              Active: <strong>{activeCategory.name}</strong> ({activeCategory.totalBrandsCount.toLocaleString()} Brands)
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {MASTER_CATEGORIES.map((cat) => {
              const isSelected = cat.slug === selectedCategorySlug
              const realCount = REAL_BRANDS.filter((b) => b.category === cat.slug).length
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
                  {realCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {realCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Country & City Mode (Global Tech Hubs) */}
      {browseMode === 'country-city' && (
        <div className="space-y-4 bg-gray-900/60 p-5 rounded-2xl border border-gray-800">
          {/* Country Selection Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center space-x-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Select Country Hub:</span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                {activeCountry.flag} {activeCountry.name} ({REAL_BRANDS.filter((b) => b.countryCode === activeCountry.code).length} Verified Market Leaders • Currency: {activeCountry.currency})
              </span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
              {MASTER_COUNTRIES.map((ctry) => {
                const isSelected = ctry.slug === selectedCountrySlug
                const realCtryCount = REAL_BRANDS.filter((b) => b.countryCode === ctry.code).length
                return (
                  <button
                    key={ctry.id}
                    onClick={() => {
                      playSound('click')
                      setSelectedCountrySlug(ctry.slug)
                      setSelectedCitySlug('') // Reset city to All
                    }}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                        : 'bg-gray-950 text-gray-300 hover:text-white border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-base">{ctry.flag}</span>
                    <span>{ctry.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {realCtryCount > 0 ? `${realCtryCount} Verified` : 'Indexed'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* City Selection Pills within the Selected Country */}
          <div className="space-y-2 pt-2 border-t border-gray-800/80">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Select City / Tech Hub in {activeCountry.name}:</span>
              </span>
              <span className="text-[11px] text-gray-400">
                Primary Hub: <strong className="text-purple-300">{activeCountry.primaryTechHub}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => {
                  playSound('click')
                  setSelectedCitySlug('')
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 border transition-all ${
                  selectedCitySlug === ''
                    ? 'bg-purple-600 text-white border-purple-500 shadow'
                    : 'bg-gray-950 text-gray-400 hover:text-white border-gray-800'
                }`}
              >
                All {activeCountry.name} Cities ({REAL_BRANDS.filter((b) => b.countryCode === activeCountry.code).length})
              </button>

              {activeCountry.cities.map((city) => {
                const isSelected = selectedCitySlug === city.slug
                const realCityCount = REAL_BRANDS.filter((b) => b.city.toLowerCase() === city.name.toLowerCase()).length
                return (
                  <button
                    key={city.slug}
                    onClick={() => {
                      playSound('click')
                      setSelectedCitySlug(city.slug)
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap shrink-0 border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow'
                        : 'bg-gray-950 text-gray-300 hover:text-white border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <span className="font-bold">{city.name}</span>
                    <span className="text-[10px] text-gray-400">({city.hubType})</span>
                    {realCityCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                        {realCityCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <div className="bg-gray-900/70 p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Brand Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search brands by name, city, country, or tag...`}
            className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Dynamic Secondary Dropdowns based on Mode */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
          {/* Secondary Cross-Filter: If in Category mode, filter by Country */}
          {browseMode === 'category' && (
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400 text-xs">Country:</span>
              <select
                value={filterCountrySlug}
                onChange={(e) => setFilterCountrySlug(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-xs text-gray-200 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="all">🌍 All Countries</option>
                <option value="in">🇮🇳 India</option>
                <option value="us">🇺🇸 United States</option>
                <option value="gb">🇬🇧 United Kingdom</option>
                <option value="ae">🇦🇪 UAE</option>
                <option value="sg">🇸🇬 Singapore</option>
                <option value="jp">🇯🇵 Japan</option>
                <option value="de">🇩🇪 Germany</option>
                <option value="fr">🇫🇷 France</option>
                <option value="ca">🇨🇦 Canada</option>
                <option value="au">🇦🇺 Australia</option>
              </select>
            </div>
          )}

          {/* Secondary Cross-Filter: If in Country & City mode, filter by Industry */}
          {browseMode === 'country-city' && (
            <div className="flex items-center space-x-1.5">
              <span className="text-gray-400 text-xs">Sector:</span>
              <select
                value={filterCategorySlug}
                onChange={(e) => setFilterCategorySlug(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-xs text-gray-200 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="all">⚡ All Sectors</option>
                <option value="quick-commerce">⚡ Quick Commerce</option>
                <option value="e-commerce">🛍️ E-Commerce</option>
                <option value="pharmacy">💊 Pharmacy & Health</option>
                <option value="gaming">🎮 Gaming & Esports</option>
                <option value="aviation">✈️ Aviation & Travel</option>
                <option value="fintech">💳 Fintech & Banking</option>
                <option value="ai-robotics">🤖 AI & Robotics</option>
                <option value="ev-auto">🚗 EV & Auto</option>
              </select>
            </div>
          )}

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
              {/* Header with Authentic Vector Logo & Tier */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <BrandLogoBadge brand={brand} size="md" />

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                          {brand.name}
                        </h3>
                        {brand.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                        )}
                      </div>

                      {/* Country Flag & City Tag */}
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mt-0.5">
                        <span className="text-sm">{brand.countryFlag}</span>
                        <MapPin className="w-3 h-3 text-purple-400 ml-0.5" />
                        <span className="font-semibold text-gray-300">{brand.city}</span>
                        <span className="text-gray-500">, {brand.country}</span>
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

                {/* Pre-login Tagline Snippet */}
                <div className="p-2.5 rounded-xl bg-gray-950/80 border border-gray-800/80 mb-3">
                  <div className="text-[11px] font-bold text-white line-clamp-1">
                    "{brand.heroTagline}"
                  </div>
                  <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                    {brand.heroSubhead}
                  </div>
                </div>

                {/* Ratings & Tags row */}
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex flex-wrap gap-1">
                    {brand.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-950 text-gray-400 border border-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {brand.appRating && (
                    <div className="flex items-center space-x-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{brand.appRating.ios} ({brand.appRating.downloads})</span>
                    </div>
                  )}
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
                  <span>Inspect Pre-Login Portal & Perks</span>
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
