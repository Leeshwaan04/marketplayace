import React, { useState } from 'react'
import { PlusCircle, Sparkles, CheckCircle2, Zap } from 'lucide-react'
import type { Product, Category, Rarity } from '../types'
import { playSound } from '../utils/audio'
import { sanitizeText, sanitizeUrl, validatePrice, validateDiscountPercent } from '../utils/security'
import confetti from 'canvas-confetti'

interface SellerStudioProps {
  onAddProduct: (product: Product) => void
}

export const SellerStudio: React.FC<SellerStudioProps> = ({ onAddProduct }) => {
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [category, setCategory] = useState<Category>('Gaming Tech')
  const [rarity, setRarity] = useState<Rarity>('Legendary')
  const [price, setPrice] = useState(199)
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(25)
  const [image, setImage] = useState('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80')
  const [description, setDescription] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanTitle = sanitizeText(title, 80)
    const cleanTagline = sanitizeText(tagline, 120) || 'Custom verified drop on Marketplayace'
    const cleanDescription = sanitizeText(description, 500) || 'Exclusive creator listing configured with zero-loss gameplay mechanics.'
    const safePrice = validatePrice(Number(price), 1, 50000)
    const safeMaxDiscount = validateDiscountPercent(Number(maxDiscountPercent), 40)
    const safeImage = sanitizeUrl(image, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80')

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: cleanTitle,
      tagline: cleanTagline,
      category,
      rarity,
      price: safePrice,
      originalPrice: Math.round(safePrice * 1.25),
      image: safeImage,
      rating: 5.0,
      reviewsCount: 1,
      inStock: 10,
      spectators: 12,
      maxDiscountPercent: safeMaxDiscount,
      description: cleanDescription,
      features: ['Verified smart-escrow fulfillment', 'Direct creator support', 'Instant play challenge enabled'],
      playFactor: 'High Skill',
      seller: {
        name: 'You (Creator Ace)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
        salesCount: 1
      }
    }

    onAddProduct(newProd)
    playSound('win')
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3500)
    setTitle('')
    setTagline('')
    setDescription('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Studio Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-950/60 via-pink-950/60 to-gray-900 border border-purple-500/30 overflow-hidden backdrop-blur-md">
        <div className="flex items-center space-x-2 text-purple-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            Creator & Merchant Minting Terminal
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">
          List Your Gear with Built-In "Play Rules"
        </h2>
        <p className="text-xs text-gray-300 max-w-2xl mt-1">
          Unlike ordinary e-commerce platforms, Marketplayace lets you define gamified discount boundaries, Dutch auction drops, and squad limits that drive viral engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="md:col-span-7 bg-gray-900/80 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono">
            Listing Specifications
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Item Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ApexTitan Custom Controller"
              className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Short Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Hand-soldered with hall-effect precision sticks"
              className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Gaming Tech">Gaming Tech</option>
                <option value="Creator Drops">Creator Drops</option>
                <option value="Digital Mods & UGC">Digital Mods & UGC</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Collectibles">Collectibles</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Rarity Tier</label>
              <select
                value={rarity}
                onChange={(e) => setRarity(e.target.value as Rarity)}
                className="w-full px-3 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Legendary">Legendary</option>
                <option value="Mythic">Mythic</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Retail Price ($)</label>
              <input
                type="number"
                min="5"
                max="5000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Max Mini-Game Discount (%)</label>
              <input
                type="number"
                min="5"
                max="40"
                value={maxDiscountPercent}
                onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell buyers about your manufacturing process, specifications, and warranty..."
              className="w-full px-3.5 py-2.5 bg-gray-950 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {isSuccess && (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold bg-emerald-950/70 border border-emerald-500/30 p-3 rounded-xl animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>Listing Minted! Successfully added to The Play Floor.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-black text-sm uppercase bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish to The Play Floor</span>
          </button>
        </form>

        {/* Live Preview Column */}
        <div className="md:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
            Live Marketplace Card Preview
          </h3>

          <div className="rounded-2xl bg-gray-900 border border-purple-500/40 p-4 space-y-3 shadow-2xl">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-950">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                {rarity}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 font-mono">{category}</span>
              <h4 className="text-base font-bold text-white line-clamp-1">{title || 'Your Product Title'}</h4>
              <p className="text-xs text-gray-400 line-clamp-1">{tagline || 'Your product tagline will appear here'}</p>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-gray-800">
              <div>
                <span className="text-xl font-black text-white">${price}</span>
                <span className="text-[10px] text-gray-400 block">Up to {maxDiscountPercent}% off with mini-game</span>
              </div>
              <span className="text-xs font-bold text-amber-400 flex items-center">
                <Zap className="w-3.5 h-3.5 mr-0.5" />
                Play Enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
