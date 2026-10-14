export type Rarity = 'Common' | 'Rare' | 'Legendary' | 'Mythic'

export type Category = 'All' | 'Gaming Tech' | 'Creator Drops' | 'Digital Mods & UGC' | 'Streetwear' | 'Collectibles'

export interface Product {
  id: string
  title: string
  category: Category
  tagline: string
  originalPrice: number
  price: number
  image: string
  rarity: Rarity
  rating: number
  reviewsCount: number
  inStock: number
  spectators: number
  maxDiscountPercent: number
  description: string
  features: string[]
  playFactor: 'High Skill' | 'Instant Win' | 'Squad Boost' | 'Mystery Drop'
  seller: {
    name: string
    avatar: string
    isVerified: boolean
    salesCount: number
  }
}

export interface CartItem {
  product: Product
  quantity: number
  discountPercent: number
  finalPrice: number
  unlockedViaGame?: boolean
}

export interface DutchDropItem {
  id: string
  title: string
  image: string
  rarity: Rarity
  startingPrice: number
  floorPrice: number
  currentPrice: number
  priceDropPerTick: number
  tickIntervalSec: number
  totalAvailable: number
  claimed: number
  seller: string
}

export interface SquadRoom {
  id: string
  product: Product
  targetMembers: number
  currentMembers: {
    id: string
    name: string
    avatar: string
    joinedAt: string
  }[]
  expiresInSeconds: number
  squadDiscountPercent: number
}
