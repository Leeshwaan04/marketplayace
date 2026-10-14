import React, { useState } from 'react'
import { X, Gift, Sparkles, CheckCircle2 } from 'lucide-react'
import { playSound } from '../utils/audio'
import confetti from 'canvas-confetti'

interface DailyPerkModalProps {
  isOpen: boolean
  onClose: () => void
  onClaimPerk: (perkName: string, perkDiscount: number) => void
}

const TILES = [
  { id: 1, title: '⚡ 20% Off CyberDeck Gear', discount: 20 },
  { id: 2, title: '💎 Mythic $20 Ace Credit', discount: 20 },
  { id: 3, title: '🚀 Free Priority Delivery', discount: 15 }
]

export const DailyPerkModal: React.FC<DailyPerkModalProps> = ({ isOpen, onClose, onClaimPerk }) => {
  const [revealed, setRevealed] = useState<number | null>(null)

  if (!isOpen) return null

  const handleReveal = (tile: typeof TILES[0]) => {
    if (revealed !== null) return
    setRevealed(tile.id)
    playSound('win')
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
    onClaimPerk(tile.title, tile.discount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-900 border border-amber-500/40 p-6 shadow-2xl space-y-6 text-center">
        <button
          onClick={() => {
            playSound('click')
            onClose()
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Ace Mystery Box</span>
          </div>
          <h3 className="text-2xl font-black text-white">Pick 1 Mystery Tile!</h3>
          <p className="text-xs text-gray-400">
            Every day, active players get one free tap to uncover a surprise coupon or VIP perk.
          </p>
        </div>

        {/* 3 Mystery Tiles */}
        <div className="grid grid-cols-3 gap-3">
          {TILES.map((tile) => {
            const isThisRevealed = revealed === tile.id
            const anyRevealed = revealed !== null

            return (
              <button
                key={tile.id}
                disabled={anyRevealed}
                onClick={() => handleReveal(tile)}
                className={`aspect-square rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isThisRevealed
                    ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                    : anyRevealed
                    ? 'bg-gray-950/60 border-gray-800 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-b from-gray-800 to-gray-950 border-gray-700 hover:border-amber-400 hover:scale-105'
                }`}
              >
                {isThisRevealed ? (
                  <div className="space-y-1">
                    <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
                    <span className="text-[10px] font-black text-amber-300 leading-tight block">
                      {tile.title}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-amber-400 font-black text-sm">
                      ?
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">TAP ME</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Perk successfully added to your account!</span>
          </div>
        )}

        <button
          onClick={() => {
            playSound('click')
            onClose()
          }}
          className="w-full py-2.5 rounded-xl font-bold text-xs uppercase bg-gray-800 hover:bg-gray-700 text-gray-200 cursor-pointer"
        >
          {revealed ? 'Awesome, Let\'s Shop' : 'Close'}
        </button>
      </div>
    </div>
  )
}

