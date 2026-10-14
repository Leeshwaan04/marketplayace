import React, { useState, useEffect } from 'react'
import { ShoppingBag, Volume2, VolumeX, Sparkles, Flame, Search, Gift } from 'lucide-react'
import { playSound, toggleMute, getMuteState } from '../utils/audio'

interface HeaderProps {
  cartCount: number
  totalDiscountSaved: number
  onOpenCart: () => void
  onOpenPerkModal: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  totalDiscountSaved,
  onOpenCart,
  onOpenPerkModal,
  searchQuery,
  setSearchQuery,
}) => {
  const [isMuted, setIsMuted] = useState(getMuteState())
  const [activeShoppers, setActiveShoppers] = useState(1482)

  // Subtle fluctuation in active shoppers to simulate live multiplayer activity
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShoppers((prev) => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleMuteToggle = () => {
    const muted = toggleMute()
    setIsMuted(muted)
    if (!muted) playSound('click')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/85 backdrop-blur-xl">
      {/* Top micro-ticker bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-xs text-gray-400 bg-gradient-to-r from-purple-950/40 via-gray-900/40 to-pink-950/40 border-b border-gray-800/60 overflow-hidden">
        <div className="flex items-center space-x-2 truncate">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-400">{activeShoppers.toLocaleString()} Players Live</span>
          <span className="text-gray-600">|</span>
          <span className="hidden sm:inline flex items-center text-gray-300">
            <Flame className="w-3.5 h-3.5 text-orange-400 mr-1 inline" />
            Dutch Drop Arena ticking live
          </span>
          <span className="hidden md:inline text-gray-600">|</span>
          <span className="hidden md:inline text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1 inline" />
            Play any product to slash 10%–35% off checkout
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs shrink-0 pl-2">
          {totalDiscountSaved > 0 && (
            <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse">
              +${totalDiscountSaved.toFixed(0)} Won
            </span>
          )}
          <button
            onClick={handleMuteToggle}
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-500" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
            <span className="hidden sm:inline text-[11px]">{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all transform group-hover:scale-105">
            <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-300 text-lg">
              A
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">
                MARKET<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PLAY</span>ACE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-gray-400 -mt-0.5 tracking-wider uppercase font-mono">
              The Play-First Commerce Exchange
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drops, gear, UGC mods, creators..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900/80 text-sm text-gray-200 placeholder-gray-500 rounded-full border border-gray-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Claim Daily Perk Button */}
          <button
            onClick={() => {
              playSound('coin')
              onOpenPerkModal()
            }}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 hover:from-amber-500/30 hover:to-orange-500/30 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Daily Ace Drop</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => {
              playSound('click')
              onOpenCart()
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700/80 text-gray-200 hover:text-white transition-all cursor-pointer group hover:border-purple-500"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-gray-300 group-hover:text-purple-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[11px] font-bold text-white shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

