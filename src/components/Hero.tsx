import React, { useState } from 'react'
import { Sparkles, Zap, Trophy, ShieldCheck, Play, ArrowRight, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { playSound } from '../utils/audio'

interface HeroProps {
  onSpinReward: (discountCode: string, discountVal: number) => void
  onExploreDrops: () => void
}

const REWARDS = [
  { label: '30% OFF ALL GEAR', code: 'ACE30', val: 30, color: 'from-purple-500 to-pink-500' },
  { label: 'FREE EXPRESS SHIPPING', code: 'FREESHIP', val: 15, color: 'from-blue-500 to-cyan-500' },
  { label: '25% OFF DIGITAL MODS', code: 'MODS25', val: 25, color: 'from-emerald-500 to-teal-500' },
  { label: 'MYTHIC $50 STORE VOUCHER', code: 'MYTHIC50', val: 50, color: 'from-amber-400 to-orange-500' },
  { label: '20% OFF SQUAD CART', code: 'SQUAD20', val: 20, color: 'from-fuchsia-500 to-rose-500' },
  { label: '15% INSTANT ACE DISCOUNT', code: 'ACE15', val: 15, color: 'from-violet-500 to-purple-600' }
]

export const Hero: React.FC<HeroProps> = ({ onSpinReward, onExploreDrops }) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [activeReward, setActiveReward] = useState<typeof REWARDS[0] | null>(null)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleSpin = () => {
    if (isSpinning || hasClaimed) return
    setIsSpinning(true)
    playSound('squad')

    let counter = 0
    const totalTicks = 24 + Math.floor(Math.random() * 6)
    const interval = setInterval(() => {
      counter++
      setSelectedIndex((prev) => (prev + 1) % REWARDS.length)
      playSound('tick')

      if (counter >= totalTicks) {
        clearInterval(interval)
        setIsSpinning(false)
        setHasClaimed(true)
        const won = REWARDS[counter % REWARDS.length]
        setActiveReward(won)
        playSound('win')
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
        onSpinReward(won.code, won.val)
      }
    }, 90)
  }

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background glow flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Vision & Pitch */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Next-Gen Commerce: Play-To-Save & Live Drops</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Don't Just Shop. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              Play The Market.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Welcome to <strong className="text-white">marketplayace.com</strong> — the premier interactive exchange for gaming tech, streetwear, creator drops, and UGC mods. Slash prices with skill-based micro games, team up in squad carts, or grab live Dutch reverse auctions before anyone else.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2 text-xs text-gray-300 font-medium">
            <div className="flex items-center space-x-1.5 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Zero-Loss Micro Games</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-lg">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>Squad 3-Player Deals</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Creator Escrow</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
            <button
              onClick={onExploreDrops}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore The Play Floor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/Leeshwaan04/marketplayace"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold text-gray-300 bg-gray-900/80 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all cursor-pointer"
            >
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive "Ace Drop Spinner" Widget */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md rounded-2xl p-[1.5px] bg-gradient-to-b from-purple-500/50 via-pink-500/20 to-transparent shadow-2xl">
            <div className="rounded-[15px] bg-gray-950/90 backdrop-blur-xl p-6 border border-gray-800/80 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400 font-mono">
                    Free Welcome Drop
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">1 Free Spin / Session</span>
              </div>

              {/* Slot / Reel display */}
              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900/90 p-4 min-h-[140px] flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-radial from-purple-900/20 to-transparent pointer-events-none" />

                <div className={`transition-all duration-100 transform ${isSpinning ? 'scale-105 blur-[0.5px]' : 'scale-100'}`}>
                  <span className="text-[11px] uppercase tracking-widest text-gray-400 font-mono block mb-1">
                    {isSpinning ? 'SHUFFLING REWARDS...' : hasClaimed ? '🎉 REWARD UNLOCKED!' : 'READY TO DROP'}
                  </span>
                  <div className={`text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${REWARDS[selectedIndex].color}`}>
                    {REWARDS[selectedIndex].label}
                  </div>
                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded bg-gray-800/90 border border-gray-700 font-mono text-xs text-purple-300">
                    CODE: {REWARDS[selectedIndex].code}
                  </div>
                </div>
              </div>

              {/* Spin Trigger Button */}
              <div>
                {!hasClaimed ? (
                  <button
                    disabled={isSpinning}
                    onClick={handleSpin}
                    className={`w-full py-3.5 px-4 rounded-xl font-black text-sm tracking-wide uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
                      isSpinning
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-gray-950 hover:brightness-110 shadow-orange-500/25 active:scale-[0.98]'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isSpinning ? 'Spinning The Vault...' : 'Spin Free Ace Drop'}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 py-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Coupon Applied Automatically To Cart!</span>
                    </div>
                    <p className="text-[11px] text-gray-400 text-center">
                      Use code <span className="font-mono text-white font-bold">{activeReward?.code}</span> or simply browse products below to enjoy discounted checkout.
                    </p>
                  </div>
                )}
              </div>

              {/* Micro guarantee footer */}
              <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
                <span>Fair Odds Protocol</span>
                <span>Powered by Web Audio & Instant HMR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
