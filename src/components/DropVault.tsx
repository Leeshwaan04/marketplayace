import React, { useState, useEffect } from 'react'
import { Flame, Clock, AlertTriangle } from 'lucide-react'
import type { DutchDropItem } from '../types'
import { playSound } from '../utils/audio'
import confetti from 'canvas-confetti'

interface DropVaultProps {
  drops: DutchDropItem[]
  onSnagDrop: (drop: DutchDropItem, pricePaid: number) => void
}

export const DropVault: React.FC<DropVaultProps> = ({ drops: initialDrops, onSnagDrop }) => {
  const [drops, setDrops] = useState<DutchDropItem[]>(initialDrops)
  const [tickerSecond, setTickerSecond] = useState(3)

  // Live Dutch Auction price drop simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerSecond((prev) => {
        if (prev <= 1) {
          // Decrement prices of active drops
          setDrops((currentDrops) =>
            currentDrops.map((d) => {
              if (d.currentPrice > d.floorPrice) {
                const nextPrice = Math.max(d.floorPrice, d.currentPrice - d.priceDropPerTick)
                return { ...d, currentPrice: nextPrice }
              }
              return d
            })
          )
          playSound('tick')
          return 3
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSnag = (item: DutchDropItem) => {
    playSound('win')
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    })
    onSnagDrop(item, item.currentPrice)
  }

  return (
    <div className="space-y-6">
      {/* Dutch Auction Header Banner */}
      <div className="relative rounded-2xl p-6 bg-gradient-to-r from-red-950/60 via-purple-950/60 to-gray-900 border border-red-500/30 overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                Dutch Reverse Auction Demo
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Prices Drop Every {drops[0]?.tickIntervalSec || 2} Seconds.
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              The longer you wait, the cheaper it gets. But wait too long, and another player will snatch it! Who blinks first?
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-gray-950/80 px-4 py-2.5 rounded-xl border border-red-500/40 shrink-0">
            <Clock className="w-5 h-5 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Next Price Drop In:</div>
              <div className="text-lg font-black text-white font-mono">00:0{tickerSecond}s</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Dutch Auction Drops */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {drops.map((item) => {
          const discountPercent = Math.round(((item.startingPrice - item.currentPrice) / item.startingPrice) * 100)
          const isAtFloor = item.currentPrice <= item.floorPrice
          const remainingUnits = item.totalAvailable - item.claimed

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-gray-900/90 border border-red-500/30 hover:border-red-400/80 shadow-xl overflow-hidden flex flex-col justify-between transition-all group backdrop-blur-sm"
            >
              {/* Media container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
                    Dutch Vault Drop
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gray-950/80 text-[11px] text-orange-400 border border-orange-500/30">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Only {remainingUnits} left</span>
                </div>

                {/* Live price badge on image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="bg-gray-950/90 border border-red-500/40 px-3 py-1.5 rounded-xl shadow-lg">
                    <span className="text-[10px] text-gray-400 block uppercase font-mono">Simulated Price</span>
                    <span className="text-2xl font-black text-red-400 font-mono tracking-tight">
                      ${item.currentPrice.toFixed(0)}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30">
                    -{discountPercent}%
                  </span>
                </div>
              </div>

              {/* Details & Live Action */}
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-400 mb-1 flex items-center space-x-1">
                    <span>Seller:</span>
                    <strong className="text-gray-200">{item.seller}</strong>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Floor Price Meter */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                      <span>Floor: ${item.floorPrice}</span>
                      <span>Start: ${item.startingPrice}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-orange-400 to-emerald-400 transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((item.currentPrice - item.floorPrice) / (item.startingPrice - item.floorPrice)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleSnag(item)}
                    className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wide bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-gray-950 hover:brightness-110 shadow-lg shadow-red-500/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Flame className="w-4 h-4 fill-current text-gray-950" />
                    <span>SNAG NOW FOR ${item.currentPrice.toFixed(0)}</span>
                  </button>
                  <p className="text-[10px] text-gray-500 text-center mt-1.5">
                    {isAtFloor ? '⚠️ Floor price reached! Final price.' : 'Price drops by $2 in 3 seconds'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
