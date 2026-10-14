import React, { useState, useEffect, useRef } from 'react'
import { X, Star, Check, ShoppingBag, Zap, Trophy, RefreshCw } from 'lucide-react'
import confetti from 'canvas-confetti'
import type { Product } from '../types'
import { playSound } from '../utils/audio'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, discountPercent: number) => void
  initialMode?: 'view' | 'game'
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  initialMode = 'view'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'minigame'>(initialMode === 'game' ? 'minigame' : 'details')
  const [gameState, setGameState] = useState<'ready' | 'running' | 'stopped'>('ready')
  const [sliderPos, setSliderPos] = useState(50) // 0 to 100
  const [discountWon, setDiscountWon] = useState(0)
  const animRef = useRef<number | null>(null)
  const speedRef = useRef(1.8)
  const dirRef = useRef(1)
  const posRef = useRef(0)

  const [prevInitialMode, setPrevInitialMode] = useState(initialMode)
  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode)
    setActiveTab(initialMode === 'game' ? 'minigame' : 'details')
  }

  // Mini-game needle animation loop
  const startSlider = () => {
    setGameState('running')
    playSound('tick')
    posRef.current = 0
    dirRef.current = 1

    const loop = () => {
      posRef.current += speedRef.current * dirRef.current
      if (posRef.current >= 100) {
        posRef.current = 100
        dirRef.current = -1
      } else if (posRef.current <= 0) {
        posRef.current = 0
        dirRef.current = 1
      }
      setSliderPos(posRef.current)
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
  }

  const stopSlider = () => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
    }
    setGameState('stopped')

    // Evaluate position (Bullseye target is 45 to 55)
    const distFromCenter = Math.abs(posRef.current - 50)
    let won = 5

    if (distFromCenter <= 6) {
      // Direct Bullseye!
      won = product?.maxDiscountPercent || 25
      playSound('win')
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      })
    } else if (distFromCenter <= 18) {
      // Great hit!
      won = Math.floor((product?.maxDiscountPercent || 20) * 0.75)
      playSound('coin')
    } else if (distFromCenter <= 30) {
      // Good hit
      won = Math.floor((product?.maxDiscountPercent || 20) * 0.5)
      playSound('coin')
    } else {
      // Consolation
      won = 5
      playSound('click')
    }

    setDiscountWon(won)
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  if (!product) return null

  const discountedPrice = discountWon > 0
    ? (product.price * (1 - discountWon / 100)).toFixed(0)
    : product.price.toFixed(0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click')
            onClose()
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-950 px-6 pt-4 space-x-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('minigame')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'minigame'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Play Price Challenge</span>
            {discountWon > 0 && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                -{discountWon}%
              </span>
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'details' ? (
            /* Product Details Tab */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Media */}
              <div className="space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-950 border border-gray-800">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>In Stock: <strong className="text-white">{product.inStock} units</strong></span>
                  <span className="text-pink-400 font-semibold">{product.spectators} shoppers viewing</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {product.rarity}
                    </span>
                    <span className="text-xs text-gray-400">{product.category}</span>
                  </div>

                  <h2 className="text-xl font-black text-white">{product.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">{product.tagline}</p>

                  <div className="flex items-center space-x-2 my-3 text-xs text-gray-300">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="font-bold text-sm">{product.rating}</span>
                    </div>
                    <span>({product.reviewsCount} verified reviews)</span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed border-t border-gray-800 pt-3">
                    {product.description}
                  </p>

                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Features:</span>
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">
                        ${discountedPrice}
                      </div>
                      {discountWon > 0 && (
                        <div className="text-xs text-emerald-400 font-bold">
                          Saved ${(product.price - Number(discountedPrice)).toFixed(0)} ({discountWon}% off)
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveTab('minigame')}
                      className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{discountWon > 0 ? 'Replay Challenge' : 'Play To Lower Price'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      playSound('coin')
                      onAddToCart(product, discountWon)
                      onClose()
                    }}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (${discountedPrice})</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Precision Mini-game Tab */
            <div className="py-4 space-y-6 text-center">
              <div className="max-w-md mx-auto space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>The Ace Reflex Precision Bar</span>
                </div>
                <h3 className="text-2xl font-black text-white">Stop the Needle in the Bullseye!</h3>
                <p className="text-xs text-gray-400">
                  Hit the center target zone to slash <strong className="text-purple-300">{product.maxDiscountPercent}%</strong> off the price of this item. Zero loss: you always get a discount!
                </p>
              </div>

              {/* The Timing Meter Track */}
              <div className="max-w-md mx-auto px-4">
                <div className="relative h-12 w-full rounded-2xl bg-gray-950 border border-gray-700 overflow-hidden shadow-inner flex items-center">
                  {/* Outer zones */}
                  <div className="absolute inset-y-0 left-0 w-[35%] bg-blue-950/40 border-r border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-mono">
                    10% Zone
                  </div>
                  {/* Bullseye zone (42% to 58%) */}
                  <div className="absolute inset-y-0 left-[42%] w-[16%] bg-gradient-to-r from-amber-500/40 via-pink-500/50 to-amber-500/40 border-x-2 border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    🎯 {product.maxDiscountPercent}%
                  </div>
                  {/* Right zone */}
                  <div className="absolute inset-y-0 right-0 w-[35%] bg-blue-950/40 border-l border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-mono">
                    10% Zone
                  </div>

                  {/* Moving Needle */}
                  <div
                    className="absolute top-0 bottom-0 w-2.5 bg-white shadow-[0_0_15px_#fff] rounded-full z-10 transition-transform duration-75"
                    style={{ left: `calc(${sliderPos}% - 5px)` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-mono">
                  <span>0ms</span>
                  <span className="text-amber-400 font-bold">BULLSEYE SWEETSPOT</span>
                  <span>100ms</span>
                </div>
              </div>

              {/* Controls */}
              <div className="max-w-xs mx-auto space-y-3">
                {gameState === 'ready' && (
                  <button
                    onClick={startSlider}
                    className="w-full py-3.5 rounded-xl font-black text-sm uppercase bg-gradient-to-r from-amber-400 to-pink-500 text-gray-950 hover:brightness-110 shadow-lg shadow-orange-500/30 cursor-pointer active:scale-95 transition-all"
                  >
                    Start Needle
                  </button>
                )}

                {gameState === 'running' && (
                  <button
                    onClick={stopSlider}
                    className="w-full py-3.5 rounded-xl font-black text-sm uppercase bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/40 cursor-pointer active:scale-95 transition-all animate-pulse"
                  >
                    HIT / STOP!
                  </button>
                )}

                {gameState === 'stopped' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
                      🎉 YOU SCORED A {discountWon}% DISCOUNT!
                      <div className="text-xs text-gray-400 mt-0.5">
                        New Price: <span className="text-white font-mono">${discountedPrice}</span> (was ${product.price})
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={startSlider}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                      <button
                        onClick={() => {
                          playSound('coin')
                          onAddToCart(product, discountWon)
                          onClose()
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Claim & Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
