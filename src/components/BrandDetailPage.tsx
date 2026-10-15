import React, { useState } from 'react'
import {
  X, CheckCircle2, Trophy, ExternalLink, MapPin,
  Calendar, DollarSign, Tag, Copy, Sparkles, Zap, ArrowLeft,
  Smartphone, Star, ShieldCheck, Flame
} from 'lucide-react'
import type { Brand } from '../types/brand'
import { BrandLogoBadge } from './BrandLogoBadge'
import { playSound } from '../utils/audio'
import { sanitizeUrl, safeCopyText } from '../utils/security'
import confetti from 'canvas-confetti'

interface BrandDetailPageProps {
  brand: Brand | null
  onClose: () => void
  onClaimCoupon: (code: string, discountVal: number) => void
}

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ brand, onClose, onClaimCoupon }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [hasPlayedPerk, setHasPlayedPerk] = useState(false)
  const [perkDiscountWon, setPerkDiscountWon] = useState<number | null>(null)

  if (!brand) return null

  const handleCopyCode = async (code: string, bonus: number) => {
    playSound('coin')
    const success = await safeCopyText(code)
    if (success) {
      setCopiedCode(code)
    }
    onClaimCoupon(code, bonus)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const handlePlayBrandChallenge = () => {
    playSound('squad')
    const won = 15 + Math.floor(Math.random() * 16) // 15% to 30%
    setPerkDiscountWon(won)
    setHasPlayedPerk(true)
    playSound('win')
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 }
    })
    onClaimCoupon(`${brand.name.toUpperCase().replace(/[^A-Z]/g, '')}${won}`, won)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-gray-950 border border-purple-500/40 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Close and Back Header */}
        <div className="p-4 border-b border-gray-800 bg-gray-950/90 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => {
              playSound('click')
              onClose()
            }}
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </button>

          <button
            onClick={() => {
              playSound('click')
              onClose()
            }}
            className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Banner Media */}
          <div className="relative h-48 sm:h-64 w-full bg-gray-900">
            <img
              src={brand.bannerImage}
              alt={brand.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

            {/* Floating Brand Logo Badge */}
            <div className="absolute -bottom-10 left-6 sm:left-8 flex items-end space-x-4">
              <BrandLogoBadge
                brand={brand}
                size="xl"
                className="border-4 border-gray-950 shadow-2xl"
              />
            </div>

            {/* Floating Tier & Country Flags */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gray-950/80 border border-gray-700 text-gray-200 backdrop-blur-md">
                {brand.countryFlag} {brand.city}, {brand.country}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md shadow-lg ${
                brand.tier === 'S-Tier'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              }`}>
                {brand.tier} Brand
              </span>
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="pt-12 px-6 sm:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{brand.name}</h1>
                  {brand.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  )}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 font-mono">
                    {brand.countryCode}
                  </span>
                </div>
                <p className="text-xs text-purple-400 font-semibold mt-0.5">{brand.subCategory}</p>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={sanitizeUrl(brand.officialLoginUrl || brand.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all cursor-pointer"
                >
                  <span>Pre-Login Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PRE-LOGIN SITE SHOWCASE & HERO HIGHLIGHTS */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900/90 to-purple-950/40 border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
                  <Flame className="w-4 h-4 text-pink-400" />
                  <span>Pre-Login Experience & Customer Proposition</span>
                </div>
                {brand.appRating && (
                  <div className="flex items-center space-x-3 text-xs font-mono bg-black/40 px-3 py-1 rounded-lg border border-gray-800">
                    <span className="flex items-center space-x-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>iOS {brand.appRating.ios}</span>
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Android {brand.appRating.android}</span>
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-300 font-bold">{brand.appRating.downloads} Downloads</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  "{brand.heroTagline}"
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {brand.heroSubhead}
                </p>
              </div>

              {/* Pre-Login Key Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {brand.preLoginHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gray-950/70 border border-gray-800/80 flex items-center space-x-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs text-gray-200 font-medium">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs">
                <span className="text-gray-400 flex items-center space-x-1 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Headquarters</span>
                </span>
                <span className="text-white font-bold truncate block">{brand.headquarters}</span>
              </div>

              <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs">
                <span className="text-gray-400 flex items-center space-x-1 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Founded</span>
                </span>
                <span className="text-white font-bold">{brand.founded}</span>
              </div>

              <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs">
                <span className="text-gray-400 flex items-center space-x-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Valuation</span>
                </span>
                <span className="text-white font-bold truncate block">{brand.valuationOrMarketCap}</span>
              </div>

              <div className="p-3 bg-gradient-to-br from-purple-950/50 to-gray-900 rounded-xl border border-purple-500/30 text-xs">
                <span className="text-purple-300 flex items-center space-x-1 mb-1 font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ace Score</span>
                </span>
                <span className="text-emerald-400 font-black font-mono text-base">{brand.aceScore}/100</span>
              </div>
            </div>

            {/* Bio Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Executive Brand Dossier
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {brand.description}
              </p>
            </div>

            {/* Interactive "Play Brand Discount" Hero Widget */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-pink-950/50 to-gray-900 border border-pink-500/40 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 text-pink-400">
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Exclusive Brand Play Challenge
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-white">{brand.name} Loyalty Play Perk</h4>
                  <p className="text-xs text-gray-300 max-w-lg mt-0.5">{brand.playPerkDescription}</p>
                </div>

                {!hasPlayedPerk ? (
                  <button
                    onClick={handlePlayBrandChallenge}
                    className="py-2.5 px-5 rounded-xl font-black text-xs uppercase bg-gradient-to-r from-amber-400 to-pink-500 text-gray-950 hover:brightness-110 shadow-lg shadow-orange-500/30 cursor-pointer active:scale-95 transition-all shrink-0"
                  >
                    Play Brand Challenge
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Unlocked {perkDiscountWon}% Off Voucher!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Verified Offers & Promo Codes */}
            <div className="space-y-3 pb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Live Verified Offers & Escrow Coupons ({brand.offers.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brand.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate">{offer.title}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        Expires: <strong className="text-gray-300">{offer.expiresIn}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCode(offer.code, offer.playDiscountBonus)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCode === offer.code ? 'Copied!' : offer.code}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
