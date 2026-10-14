import React, { useState } from 'react'
import { Users, Clock, Share2, CheckCircle2, UserPlus, Sparkles, ShoppingBag } from 'lucide-react'
import type { SquadRoom, Product } from '../types'
import { playSound } from '../utils/audio'
import { safeCopyText } from '../utils/security'
import confetti from 'canvas-confetti'

interface SquadShoppingProps {
  squadRooms: SquadRoom[]
  onJoinAndBuy: (product: Product, squadDiscount: number) => void
}

export const SquadShopping: React.FC<SquadShoppingProps> = ({ squadRooms, onJoinAndBuy }) => {
  const [rooms, setRooms] = useState<SquadRoom[]>(squadRooms)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleJoinSquad = (roomId: string) => {
    playSound('squad')
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId && r.currentMembers.length < r.targetMembers) {
          const updated = {
            ...r,
            currentMembers: [
              ...r.currentMembers,
              {
                id: `user-${Date.now()}`,
                name: 'You (The Ace)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
                joinedAt: 'Just now'
              }
            ]
          }

          if (updated.currentMembers.length >= updated.targetMembers) {
            playSound('win')
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            })
          }
          return updated
        }
        return r
      })
    )
  }

  const handleCopyLink = async (roomId: string) => {
    playSound('click')
    const success = await safeCopyText(`https://marketplayace.com/squad/${roomId}`)
    if (success) {
      setCopiedId(roomId)
    }
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Squad Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-950/60 via-purple-950/60 to-gray-900 border border-blue-500/30 overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Multiplayer Co-Op Checkout
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Squad Up. Slash 25% to 30% Off as a Team.
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              Don't buy alone. When 3 players group up for the same item within the countdown window, everyone unlocks the wholesale Ace tier!
            </p>
          </div>

          <div className="bg-gray-950/80 px-4 py-2.5 rounded-xl border border-blue-500/30 text-xs text-gray-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Squads Active: <strong className="text-white">18 Rooms</strong></span>
          </div>
        </div>
      </div>

      {/* Squad Rooms List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const isComplete = room.currentMembers.length >= room.targetMembers
          const discountedPrice = (room.product.price * (1 - room.squadDiscountPercent / 100)).toFixed(0)

          return (
            <div
              key={room.id}
              className="rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/50 p-5 flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-sm transition-all"
            >
              <div className="flex gap-4">
                <img
                  src={room.product.image}
                  alt={room.product.title}
                  className="w-24 h-24 rounded-xl object-cover border border-gray-800 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                      Squad Target: {room.targetMembers} Players
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono">06:48 left</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">{room.product.title}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-black text-cyan-400 font-mono">${discountedPrice}</span>
                    <span className="text-xs text-gray-500 line-through">${room.product.price}</span>
                    <span className="text-xs font-bold text-emerald-400">({room.squadDiscountPercent}% Squad Perk)</span>
                  </div>
                </div>
              </div>

              {/* Members Slots */}
              <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Room Capacity ({room.currentMembers.length}/{room.targetMembers}):</span>
                  {isComplete ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Squad Unlocked!</span>
                    </span>
                  ) : (
                    <span className="text-cyan-400 font-mono">
                      Needs {room.targetMembers - room.currentMembers.length} more player
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: room.targetMembers }).map((_, idx) => {
                    const member = room.currentMembers[idx]
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center min-h-[64px] ${
                          member
                            ? 'bg-blue-950/40 border-cyan-500/40 text-cyan-200'
                            : 'bg-gray-900/60 border-dashed border-gray-800 text-gray-500'
                        }`}
                      >
                        {member ? (
                          <>
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-6 h-6 rounded-full object-cover border border-cyan-400 mb-1"
                            />
                            <span className="text-[10px] font-bold truncate max-w-[80px]">{member.name}</span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center space-y-0.5">
                            <UserPlus className="w-4 h-4 text-gray-600" />
                            <span className="text-[10px]">Open Slot</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleCopyLink(room.id)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{copiedId === room.id ? 'Copied Link!' : 'Invite Friend'}</span>
                </button>

                {!isComplete ? (
                  <button
                    onClick={() => handleJoinSquad(room.id)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join This Squad</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      playSound('coin')
                      onJoinAndBuy(room.product, room.squadDiscountPercent)
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim Squad Deal (${discountedPrice})</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
