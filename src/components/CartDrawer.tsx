import React, { useState } from 'react'
import { Dialog } from './Dialog'
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Tag } from 'lucide-react'
import type { CartItem } from '../types'
import { playSound } from '../utils/audio'
import confetti from 'canvas-confetti'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, qty: number) => void
  onApplyGlobalCoupon: (code: string) => boolean
  activeCoupon: string | null
  globalDiscountPercent: number
  onClearCart: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onApplyGlobalCoupon,
  activeCoupon,
  globalDiscountPercent,
  onClearCart,
}) => {
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isCheckedOut, setIsCheckedOut] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  if (!isOpen) return null

  // Calculate pricing
  const subtotalOriginal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const subtotalAfterGameDiscounts = items.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0
  )

  const extraCouponSavings = activeCoupon
    ? subtotalAfterGameDiscounts * (globalDiscountPercent / 100)
    : 0

  const finalTotal = Math.max(0, subtotalAfterGameDiscounts - extraCouponSavings)
  const totalSavings = subtotalOriginal - finalTotal

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    if (!couponInput) return
    const success = onApplyGlobalCoupon(couponInput.trim().toUpperCase())
    if (success) {
      playSound('win')
      confetti({ particleCount: 50, spread: 60 })
      setCouponInput('')
    } else {
      setCouponError('Invalid Ace code. Try ACE30 or ACE15!')
      playSound('click')
    }
  }

  const handleCheckout = () => {
    playSound('win')
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    })
    setOrderNumber(`ACE-${Math.floor(100000 + Math.random() * 900000)}`)
    setIsCheckedOut(true)
  }

  const handleFinish = () => {
    setIsCheckedOut(false)
    onClearCart()
    onClose()
  }

  return (
    <Dialog onClose={onClose} label="Shopping cart" className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-full bg-gray-950 border-l border-gray-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Top Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <span className="font-extrabold text-white text-base">Your Play Cart</span>
            <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => {
              playSound('click')
              onClose()
            }}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 space-y-4">
          {isCheckedOut ? (
            /* Order Success State */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white">Sample order complete</h3>
              <p className="text-xs text-gray-300 max-w-xs mx-auto">
                This was a demonstration. No payment was taken and nothing will be shipped.
              </p>

              <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-2 text-left text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-purple-400 font-bold">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Charged:</span>
                  <span className="text-white font-bold">${finalTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Saved via Play:</span>
                  <span className="text-emerald-400 font-bold">${totalSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-cyan-400 font-bold">Demo only, nothing shipped</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 rounded-xl font-bold text-gray-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 cursor-pointer shadow-lg active:scale-95 transition-all text-sm uppercase"
              >
                Return to The Play Floor
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-300">Your Cart is Empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Pick an item on the Play Floor, challenge the Reflex Bar to slash the price, or join a sample Squad!
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
              >
                Browse Drops
              </button>
            </div>
          ) : (
            /* Cart Items List */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-gray-900/90 rounded-xl border border-gray-800 flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-sm font-black text-white">${item.finalPrice.toFixed(0)}</span>
                      {item.discountPercent > 0 && (
                        <span className="text-[10px] text-gray-500 line-through">
                          ${item.product.price}
                        </span>
                      )}
                    </div>
                    {item.discountPercent > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400">
                        🎯 {item.discountPercent}% Off via Game
                      </span>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-5 h-5 rounded bg-gray-800 text-gray-300 text-xs flex items-center justify-center hover:bg-gray-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs text-white font-mono">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-gray-800 text-gray-300 text-xs flex items-center justify-center hover:bg-gray-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound('click')
                      onRemoveItem(item.product.id)
                    }}
                    className="text-gray-500 hover:text-red-400 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter Ace Promo Code"
                      className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
                {activeCoupon && (
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Coupon '{activeCoupon}' applied (-{globalDiscountPercent}%)</span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {!isCheckedOut && items.length > 0 && (
          <div className="p-4 border-t border-gray-800 bg-gray-900/80 space-y-3 sticky bottom-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Original Retail:</span>
                <span className="line-through">${subtotalOriginal.toFixed(0)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Game & Promo Savings:</span>
                  <span>-${totalSavings.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-gray-800">
                <span>Final Checkout Total:</span>
                <span className="text-xl font-mono text-purple-300">${finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl font-black text-sm uppercase bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-all"
            >
              <span>Complete sample checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Labs preview: no payment is taken</span>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
